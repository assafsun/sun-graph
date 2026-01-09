/**
 * SunGraph - Refactored Functional Component with Hooks
 * 
 * This is a modernized version of the original class-based SunGraph component.
 * It uses React hooks, functional programming patterns, and improved TypeScript typing.
 * 
 * Key improvements:
 * - Functional component with hooks (useEffect, useRef, useCallback, useMemo)
 * - Better separation of concerns
 * - Cleaner RxJS subscription management
 * - Improved TypeScript types
 * - Better performance through memoization
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import * as shape from "d3-shape";
import { Observable, Subscription } from "rxjs";
import {
  identity,
  scale,
  smoothMatrix,
  toSVG,
  transform,
  translate,
  Matrix,
} from "transformation-matrix";
import { Layout } from "SunGraph/models/layout.model";
import { Graph, Node, Edge, PanningAxis } from "SunGraph/models/graph.model";
import { id as generateId } from "SunGraph/utils/id";
import {
  ViewDimensions,
  calculateViewDimensions,
} from "./utils/viewDimensionsHelper";
import { CustomDagreLayout } from "./layouts/customDagreLayout";
import { BehaviorSubject } from "rxjs";
import styled from "styled-components";

/**
 * Styled Components
 */
const GraphContainer = styled.div`
  user-select: none;
`;

const StyledEdge = styled.g`
  stroke: black;
  fill: none;
`;

const SvgGraph = styled.svg`
  height: inherit;
  width: inherit;
`;

/**
 * Constants
 */
const DefaultGraphSize: number = 1000;
const DefaultNodeSize: number = 60;

/**
 * Props Interface
 */
interface SunGraphProps {
  view?: [number, number];
  nodes: Node[];
  links: Edge[];
  layout?: Layout;
  defaultNodeTemplate?: (node: Node) => ReactNode;
  isNodeTemplateHTML?: boolean;
  curve?: any;
  nodeHeight?: number;
  nodeWidth?: number;
  draggingEnabled?: boolean;
  panningEnabled?: boolean;
  enableZoom?: boolean;
  zoomSpeed?: number;
  minZoomLevel?: number;
  maxZoomLevel?: number;
  autoCenter?: boolean;
  enableTrackpadSupport?: boolean;
  autoZoom?: boolean;
  zoomChange?: (value: number) => void;
  clickHandler?: (value: MouseEvent) => void;
  defsTemplate?: () => ReactNode;
  center$?: Observable<any>;
  zoomToFit$?: Observable<any>;
  panToNode$?: Observable<any>;
  update$?: Observable<any>;
  panOnZoom?: boolean;
  panningAxis?: PanningAxis;
}

/**
 * Line Shape Options for D3 Curves
 */
export class LineShape {
  static BasisLine = shape.curveBasis;
  static BundleLine = shape.curveBundle.beta(1);
  static LinearLine = shape.curveLinear;
  static StepLine = shape.curveStep;
  static NaturalLine = shape.curveNatural;
  static MonotoneXLine = shape.curveMonotoneX;
  static MonotoneYLine = shape.curveMonotoneY;
}

/**
 * Custom Hook: useContainerDimensions
 * Handles dimension calculation and responsive sizing
 */
function useContainerDimensions(
  view?: [number, number],
  containerId: string = "graphContainer"
) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
    initialized: boolean;
  }>({
    width: view?.[0] || DefaultGraphSize,
    height: view?.[1] || DefaultGraphSize,
    initialized: false,
  });

  useEffect(() => {
    if (view) {
      setDimensions({
        width: view[0],
        height: view[1],
        initialized: true,
      });
      return;
    }

    const graphElement = document.getElementById(containerId);
    if (!graphElement?.parentElement) {
      setDimensions((prev) => ({ ...prev, initialized: true }));
      return;
    }

    const { clientHeight, clientWidth } = graphElement.parentElement;
    setDimensions({
      width: clientWidth || DefaultGraphSize,
      height: clientHeight || DefaultGraphSize,
      initialized: true,
    });
  }, [view, containerId]);

  return dimensions;
}

/**
 * Custom Hook: useRxJSSubscription
 * Manages RxJS subscriptions lifecycle
 */
function useRxJSSubscription(
  observable$: Observable<any> | undefined,
  callback: (value: any) => void,
  dependencies: any[] = []
) {
  useEffect(() => {
    if (!observable$) return;

    const subscription = observable$.subscribe(callback);
    return () => subscription.unsubscribe();
  }, [observable$, callback, ...dependencies]);
}

/**
 * SunGraph Functional Component
 */
export const SunGraph: React.FC<SunGraphProps> = (props) => {
  const containerId = useMemo(() => `sun-graph-${generateId()}`, []);
  const dimensions = useContainerDimensions(props.view, containerId);
  const updateSubject = useRef(new BehaviorSubject(false));

  const graphContainerStyle: React.CSSProperties = {
    width: dimensions.width,
    height: dimensions.height,
  };

  // Notify child component of updates
  useEffect(() => {
    updateSubject.current.next(true);
  }, [props.nodes, props.links, props.layout]);

  if (!dimensions.initialized) {
    return <div id={containerId} style={graphContainerStyle} />;
  }

  return (
    <div id={containerId} style={graphContainerStyle}>
      <SunGraphBase
        {...props}
        view={[dimensions.width, dimensions.height]}
        update$={updateSubject.current.asObservable()}
      />
    </div>
  );
};

/**
 * State Interface for SunGraphBase
 */
interface SunGraphBaseState {
  transform: string;
  zoomLevel: number;
}

/**
 * SunGraphBase Functional Component - Main rendering logic
 */
const SunGraphBase: React.FC<SunGraphProps> = (props) => {
  const [state, setState] = useState<SunGraphBaseState>({
    transform: "matrix(1,0,0,1,0,0)",
    zoomLevel: 1,
  });

  // Refs for managing mutable state
  const graphRef = useRef<SVGSVGElement>(null);
  const subscriptionsRef = useRef<Subscription[]>([]);
  const transformMatrixRef = useRef<Matrix>(identity());
  const isPanningRef = useRef(false);
  const isDraggingRef = useRef(false);
  const draggingNodeRef = useRef<Node | null>(null);
  const isMouseMoveCalledRef = useRef(false);

  // Default props
  const {
    view = [DefaultGraphSize, DefaultGraphSize],
    curve = shape.curveLinear,
    isNodeTemplateHTML = true,
    layout = new CustomDagreLayout(),
    clickHandler = () => {},
    zoomChange = () => {},
    zoomSpeed = 0.1,
    minZoomLevel = 0.1,
    maxZoomLevel = 4,
    defsTemplate,
    draggingEnabled = true,
    panningEnabled = true,
    enableZoom = true,
    autoCenter = false,
    enableTrackpadSupport = false,
    autoZoom = false,
  } = props;

  const width = view[0];
  const height = view[1];

  /**
   * Cleanup subscriptions
   */
  useEffect(() => {
    return () => {
      subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
    };
  }, []);

  /**
   * Subscribe to external observables
   */
  useRxJSSubscription(
    props.center$,
    useCallback(() => {
      // TODO: Implement center functionality
    }, [])
  );

  useRxJSSubscription(
    props.zoomToFit$,
    useCallback(() => {
      // TODO: Implement zoom to fit functionality
    }, [])
  );

  useRxJSSubscription(
    props.panToNode$,
    useCallback((nodeId: string) => {
      // TODO: Implement pan to node functionality
    }, [])
  );

  /**
   * Handle wheel zoom
   */
  const handleWheel = useCallback(
    (event: React.WheelEvent<SVGSVGElement>) => {
      if (!enableZoom) return;

      event.preventDefault();

      const newZoomLevel = Math.max(
        minZoomLevel,
        Math.min(
          maxZoomLevel,
          state.zoomLevel - event.deltaY * zoomSpeed * 0.001
        )
      );

      if (newZoomLevel !== state.zoomLevel) {
        const zoomFactor = newZoomLevel / state.zoomLevel;
        const newMatrix = scale(transformMatrixRef.current, zoomFactor, zoomFactor);
        transformMatrixRef.current = newMatrix;

        setState((prev) => ({
          ...prev,
          zoomLevel: newZoomLevel,
          transform: toSVG(newMatrix),
        }));

        zoomChange(newZoomLevel);
      }
    },
    [enableZoom, minZoomLevel, maxZoomLevel, state.zoomLevel, zoomSpeed, zoomChange]
  );

  /**
   * Handle mouse down for panning and dragging
   */
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!graphRef.current) return;

      isPanningRef.current = panningEnabled;
      isMouseMoveCalledRef.current = false;
    },
    [panningEnabled]
  );

  /**
   * Handle mouse move for panning and dragging
   */
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      // TODO: Implement panning and dragging logic
      isMouseMoveCalledRef.current = true;
    },
    []
  );

  /**
   * Handle mouse up to end panning or dragging
   */
  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false;
    isDraggingRef.current = false;
    draggingNodeRef.current = null;
  }, []);

  /**
   * Calculate graph layout
   */
  const calculatedDims = useMemo(() => {
    return calculateViewDimensions(
      props.nodes,
      props.links,
      width,
      height,
      {
        nodeHeight: props.nodeHeight || DefaultNodeSize,
        nodeWidth: props.nodeWidth || DefaultNodeSize,
      }
    );
  }, [props.nodes, props.links, width, height, props.nodeHeight, props.nodeWidth]);

  return (
    <GraphContainer>
      <SvgGraph
        ref={graphRef}
        width={width}
        height={height}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isPanningRef.current ? "grabbing" : "grab" }}
      >
        {defsTemplate && defsTemplate()}

        <g transform={state.transform}>
          {/* Render edges */}
          <StyledEdge>
            {props.links?.map((edge) => (
              <line
                key={`${edge.source}-${edge.target}`}
                x1={0}
                y1={0}
                x2={0}
                y2={0}
              />
            ))}
          </StyledEdge>

          {/* Render nodes */}
          {props.nodes?.map((node) => (
            <g key={node.id} transform={`translate(${node.x || 0}, ${node.y || 0})`}>
              {props.defaultNodeTemplate && props.defaultNodeTemplate(node)}
            </g>
          ))}
        </g>
      </SvgGraph>
    </GraphContainer>
  );
};

SunGraphBase.displayName = "SunGraphBase";
SunGraph.displayName = "SunGraph";

export default SunGraph;
