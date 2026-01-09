import React from "react";

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
import { id } from "SunGraph/utils/id";

import {
  ViewDimensions,
  calculateViewDimensions,
} from "./utils/viewDimensionsHelper";
import { CustomDagreLayout } from "./layouts/customDagreLayout";

import { BehaviorSubject } from "rxjs";

import styled from "styled-components";

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

const DefaultGraphSize: number = 1000;
const DefaultNodeSize: number = 60;

interface State {
  initialized: boolean;
  transform?: string;
}

interface Props {
  view?: [number, number];
  nodes: Node[];
  links: Edge[];
  layout?: Layout;
  defaultNodeTemplate?: (node: Node) => React.ReactNode;
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
  defsTemplate?: () => any;
  
  // Event callbacks
  onNodeClick?: (node: Node, event: MouseEvent) => void;
  onNodeHover?: (node: Node | null, event: MouseEvent) => void;
  onNodeDoubleClick?: (node: Node, event: MouseEvent) => void;
  onEdgeClick?: (edge: Edge, event: MouseEvent) => void;
  onEdgeHover?: (edge: Edge | null, event: MouseEvent) => void;
  onGraphClick?: (event: MouseEvent) => void;
  
  // Search and filtering
  searchTerm?: string;
  filteredNodeIds?: string[];
  selectedNodeIds?: string[];
  onSelectionChange?: (nodeIds: string[]) => void;

  // Styling
  highlightColor?: string;
  selectedColor?: string;
  dimmedOpacity?: number;

  //Not reviewed props
  center$?: Observable<any>;
  zoomToFit$?: Observable<any>;
  panToNode$?: Observable<any>;
  update$?: Observable<any>;
  panOnZoom?: boolean;
  panningAxis?: PanningAxis;
}

interface BasicState {
  initialized: boolean;
  graphWidth: number;
  graphHeight: number;
}

export class LineShape {
  static BasisLine = shape.curveBasis;
  static BundleLine = shape.curveBundle.beta(1);
  static LinearLine = shape.curveLinear;
  static StepLine = shape.curveStep;
  static NaturalLine = shape.curveNatural;
  static MonotoneXLine = shape.curveMonotoneX;
  static MonotoneYLine = shape.curveMonotoneY;
}

export class SunGraph extends React.Component<Props, BasicState> {
  public subject: BehaviorSubject<any> = new BehaviorSubject(false);
  constructor(props: Props) {
    super(props);
    this.state = { initialized: false, graphHeight: 0, graphWidth: 0 };
  }

  public render(): React.ReactNode {
    const graphContainerStyle = {
      width: this.state ? this.state.graphWidth : DefaultGraphSize,
      height: this.state ? this.state.graphHeight : DefaultGraphSize,
    };

    return (
      <div id="graphContainer" style={graphContainerStyle}>
        {this.state.initialized && (
          <SunGraphBase
            {...this.props}
            view={[this.state.graphWidth, this.state.graphHeight]}
            update$={this.subject.asObservable()}
          ></SunGraphBase>
        )}
      </div>
    );
  }

  public componentDidUpdate(): void {
    this.subject.next(true);
  }

  public componentDidMount(): void {
    if (this.props.view) {
      this.setState({
        initialized: true,
        graphWidth: this.props.view[0],
        graphHeight: this.props.view[1],
      });
    } else {
      const graphElement = document.getElementById("graphContainer");
      if (!graphElement) {
        this.setState({
          initialized: true,
          graphWidth: 0,
          graphHeight: 0,
        });
        return;
      }

      const parentGraphElement = graphElement.parentElement;
      if (!parentGraphElement) {
        this.setState({
          initialized: true,
          graphWidth: 0,
          graphHeight: 0,
        });
        return;
      }

      const parentHeight: number = graphElement.parentElement.clientHeight;
      const parentWidth: number = graphElement.parentElement.clientWidth;
      this.setState({
        initialized: true,
        graphWidth: parentWidth,
        graphHeight: parentHeight,
      });
    }
  }
}

class SunGraphBase extends React.Component<Props, State> {
  private width: number;
  private height: number;
  private subscriptions: Subscription[] = [];
  private dims: ViewDimensions;
  private isPanning = false;
  private isDragging = false;
  private draggingNode: Node;
  private graph: Graph;
  private graphDims: any = { width: 0, height: 0 };
  private transformationMatrix: Matrix = identity();
  private initialTransform: string;
  private isMouseMoveCalled: boolean = false;

  private graphStyle = {
    width: this.props.view[0],
    height: this.props.view[1],
  };

  static defaultProps = {
    view: [DefaultGraphSize, DefaultGraphSize],
    curve: shape.curveLinear,
    isNodeTemplateHTML: true,
    layout: new CustomDagreLayout(),
    clickHandler: (value: MouseEvent) => {},
    zoomChange: (value: number) => {},
    zoomSpeed: 0.1,
    defsTemplate: () => (
      <svg>
        <marker
          id="arrow"
          viewBox="0 -5 10 10"
          refX="8"
          refY="0"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M0,-5L10,0L0,5" className="arrow-head" />
        </marker>
      </svg>
    ),
  };

  constructor(props: Props) {
    super(props);
    if (this.props.update$) {
      this.subscriptions.push(
        this.props.update$.subscribe((shouldUpdate: boolean) => {
          if (!shouldUpdate) {
            return;
          }
          this.recreateGraph();
        })
      );
    }

    if (this.props.center$) {
      this.subscriptions.push(
        this.props.center$.subscribe(() => {
          this.center();
        })
      );
    }
    if (this.props.zoomToFit$) {
      this.subscriptions.push(
        this.props.zoomToFit$.subscribe(() => {
          this.zoomToFit();
        })
      );
    }

    if (this.props.panToNode$) {
      this.subscriptions.push(
        this.props.panToNode$.subscribe((nodeId: string) => {
          this.panToNodeId(nodeId);
        })
      );
    }

    this.state = { initialized: false };
    this.update();
    this.draw();
    this.state = { initialized: false, transform: this.initialTransform };
  }

  public recreateGraph() {
    this.update();
    this.draw();
    this.setState({ initialized: true, transform: this.state.transform });
    this.handlePropsDraw();
  }

  public componentDidMount(): void {
    this.setState({ initialized: true });
  }

  public componentWillUnmount(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }

  public render(): React.ReactNode {
    const nodes = [];
    for (let node of this.graph.nodes) {
      let nodeTemplate: any = (
        <rect
          rx="40"
          ry="40"
          width={node.width}
          height={node.height}
          fill="#C3DBE3"
        />
      );

      if (
        this.props.isNodeTemplateHTML &&
        (node.template || this.props.defaultNodeTemplate)
      ) {
        nodeTemplate = (
          <svg>
            <g
              className="node"
              xmlns="http://www.w3.org/2000/xhtml"
              width={node.width}
              height={node.height}
              onMouseDown={(e: any) => {
                this.onNodeMouseDown(e, node);
              }}
            >
              <foreignObject
                width={node.width}
                height={node.height}
                xmlns="http://www.w3.org/2000/xhtml"
              >
                {node.template
                  ? node.template(node)
                  : this.props.defaultNodeTemplate(node)}
              </foreignObject>
            </g>
          </svg>
        );
      }

      if (
        !this.props.isNodeTemplateHTML &&
        (node.template || this.props.defaultNodeTemplate)
      ) {
        nodeTemplate = this.props.defaultNodeTemplate
          ? this.props.defaultNodeTemplate(node)
          : node.template(node);
      }

      nodes.push(
        <g
          className="node"
          key={node.id}
          width={node.width}
          height={node.height}
          onMouseDown={(e: any) => {
            this.onNodeMouseDown(e, node);
          }}
        >
          <g transform={node.transform}>{nodeTemplate}</g>
        </g>
      );
    }

    const links = [];
    for (let link of this.graph.edges) {
      links.push(
        <g className="link-group" id={link.id} key={link.id}>
          <g>
            <StyledEdge>
              <path
                className="line"
                strokeWidth="2"
                markerEnd="url(#arrow)"
                d={link.line}
              ></path>
            </StyledEdge>
            {link.midPoint && (
              <g
                className="linkMidpoint"
                transform={
                  "translate(" + link.midPoint.x + "," + link.midPoint.y + ")"
                }
              >
                {link.midPointTemplate ? link.midPointTemplate(link) : <></>}
              </g>
            )}
          </g>
        </g>
      );
    }

    return (
      this.state.initialized && (
        <GraphContainer
          style={this.graphStyle}
          onClick={(e: any) => this.graphClick(e)}
          onMouseMove={(e: any) => this.onMouseMove(e)}
          onMouseDown={(e: any) => {
            this.onMouseDown(e);
          }}
          onMouseUp={(e: any) => {
            this.onMouseUp(e);
          }}
          onWheel={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            const delta: number = Math.max(
              -1,
              Math.min(1, e.wheelDelta || -e.detail || e.deltaY || e.deltaX)
            );
            const isWheelMouseUp: boolean = e.wheelDelta
              ? delta > 0
              : delta < 0;
            if (isWheelMouseUp) {
              this.onZoom(e, "in");
            } else {
              this.onZoom(e, "out");
            }
          }}
        >
          <SvgGraph>
            <g transform={this.state.transform}>
              <g className="defsTemplate">{this.props.defsTemplate()}</g>
              <g className="nodes">{nodes}</g>
              <g className="links">{links}</g>
            </g>
          </SvgGraph>
        </GraphContainer>
      )
    );
  }

  private get zoomLevel() {
    return this.transformationMatrix.a;
  }

  private set zoomLevel(level) {
    this.zoomTo(Number(level));
  }

  private get panOffsetX() {
    return this.transformationMatrix.e;
  }

  private get panOffsetY() {
    return this.transformationMatrix.f;
  }

  private update(): void {
    this.createGraph();
    this.updateTransform();
  }

  private createGraph(): void {
    if (this.props.view) {
      this.width = this.props.view[0];
      this.height = this.props.view[1];
    } else {
      this.width = DefaultGraphSize;
      this.height = DefaultGraphSize;
    }

    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: [0, 0, 0, 0],
      showLegend: false,
    });

    const initializeNode = (n: Node) => {
      if (!n.id) {
        n.id = id();
      }

      if (!n.width || !n.height) {
        n.width = this.props.nodeWidth ? this.props.nodeWidth : DefaultNodeSize;
        n.height = this.props.nodeHeight
          ? this.props.nodeHeight
          : DefaultNodeSize;
      }

      n.position = {
        x: 0,
        y: 0,
      };
      n.data = n.data ? n.data : {};
      return n;
    };

    this.graph = {
      nodes: [...(this.props.nodes || [])].map(initializeNode),
      edges: [...(this.props.links || [])].map((e) => {
        if (!e.id) {
          e.id = id();
        }
        return e;
      }),
    };
  }

  private draw(): void {
    if (!this.props.layout || typeof this.props.layout === "string") {
      return;
    }

    this.graph = this.props.layout.run(this.graph);
    this.handleDraw();
  }

  private handleDraw() {
    this.graph.nodes.map((n) => {
      n.transform = `translate(${n.position.x - n.width / 2 || 0}, ${
        n.position.y - n.height / 2 || 0
      })`;
      if (!n.data) {
        n.data = {};
      }
      return n;
    });

    const newLinks = [];
    for (const edgeLabelId in this.graph.edgeLabels) {
      const edgeLabel = this.graph.edgeLabels[edgeLabelId];

      const points = edgeLabel.points;
      const line = this.generateLine(points);

      const newLink = Object.assign({}, edgeLabel);
      newLink.line = line;
      newLink.points = points;

      this.updateMidpointOnEdge(newLink, points);

      const textPos = points[Math.floor(points.length / 2)];
      if (textPos) {
        newLink.textTransform = `translate(${textPos.x || 0},${
          textPos.y || 0
        })`;
      }

      newLink.textAngle = 0;
      this.calcDominantBaseline(newLink);
      newLinks.push(newLink);
    }

    this.graph.edges = newLinks;
    if (this.graph.nodes && this.graph.nodes.length) {
      this.graphDims.width = Math.max(
        ...this.graph.nodes.map((n) => n.position.x + n.width)
      );
      this.graphDims.height = Math.max(
        ...this.graph.nodes.map((n) => n.position.y + n.height)
      );
    }

    this.handlePropsDraw();
  }

  private handlePropsDraw(): void {
    if (this.props.autoZoom) {
      this.zoomToFit();
    }

    if (this.props.autoCenter) {
      this.center();
    }
  }

  private calcDominantBaseline(link: any): void {
    const firstPoint = link.points[0];
    const lastPoint = link.points[link.points.length - 1];

    if (lastPoint.x < firstPoint.x) {
      link.dominantBaseline = "text-before-edge";

      link.textPath = this.generateLine([...link.points].reverse());
    } else {
      link.dominantBaseline = "text-after-edge";
      link.textPath = link.line;
    }
  }

  private generateLine(points: any): any {
    const lineFunction = shape
      .line<any>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(this.props.curve);
    return lineFunction(points);
  }

  private onZoom($event: WheelEvent, direction: any): void {
    if (this.props.enableTrackpadSupport && !$event.ctrlKey) {
      this.pan($event.deltaX * -1, $event.deltaY * -1);
      return;
    }

    const zoomFactor =
      1 + (direction === "in" ? this.props.zoomSpeed : -this.props.zoomSpeed);

    const newZoomLevel = this.zoomLevel * zoomFactor;
    if (
      newZoomLevel <= this.props.minZoomLevel ||
      newZoomLevel >= this.props.maxZoomLevel
    ) {
      return;
    }

    if (!this.props.enableZoom) {
      return;
    }

    if (this.props.panOnZoom === true && $event) {
      const mouseX = $event.clientX;
      const mouseY = $event.clientY;

      const svg = document.querySelector("svg");
      const pt = svg.createSVGPoint();

      pt.x = mouseX;
      pt.y = mouseY;
      const svgGlobal = pt.matrixTransform(svg.getScreenCTM().inverse());

      this.pan(svgGlobal.x, svgGlobal.y, true);
      this.zoom(zoomFactor);
      this.pan(svgGlobal.x * -1, svgGlobal.y * -1, true);
    } else {
      this.zoom(zoomFactor);
    }
  }

  private pan(x: number, y: number, ignoreZoomLevel: boolean = false): void {
    const zoomLevel = ignoreZoomLevel ? 1 : this.zoomLevel;

    const newTempTransofrmationMetrix = transform(
      this.transformationMatrix,
      translate(x / zoomLevel, y / zoomLevel)
    );

    if (
      newTempTransofrmationMetrix.f < 0 ||
      newTempTransofrmationMetrix.e < 0
    ) {
      return;
    }
    if (
      newTempTransofrmationMetrix.e >
        this.dims.width - this.graphDims.width * this.zoomLevel ||
      newTempTransofrmationMetrix.f >
        this.dims.height - this.graphDims.height * this.zoomLevel
    ) {
      return;
    }

    this.transformationMatrix = transform(
      this.transformationMatrix,
      translate(x / zoomLevel, y / zoomLevel)
    );

    this.updateTransform();
  }

  private panTo(x: number | null, y: number | null): void {
    if (
      x === null ||
      x === undefined ||
      isNaN(x) ||
      y === null ||
      y === undefined ||
      isNaN(y)
    ) {
      return;
    }

    const panX = -this.panOffsetX - x * this.zoomLevel + this.dims.width / 2;
    const panY = -this.panOffsetY - y * this.zoomLevel + this.dims.height / 2;

    this.transformationMatrix = transform(
      this.transformationMatrix,
      translate(panX / this.zoomLevel, panY / this.zoomLevel)
    );

    this.updateTransform();
  }

  private zoom(factor: number): void {
    this.transformationMatrix = transform(
      this.transformationMatrix,
      scale(factor, factor)
    );
    this.props.zoomChange(this.zoomLevel);
    this.updateTransform();
  }

  private zoomTo(level: number): void {
    this.transformationMatrix.a = isNaN(level)
      ? this.transformationMatrix.a
      : Number(level);
    this.transformationMatrix.d = isNaN(level)
      ? this.transformationMatrix.d
      : Number(level);
    this.props.zoomChange(this.zoomLevel);
    this.updateTransform();
    this.update();
  }

  private onPan(event: MouseEvent): void {
    this.pan(event.movementX, event.movementY);
  }

  private onDrag(event: MouseEvent): void {
    if (!this.props.draggingEnabled) {
      return;
    }
    const node = this.draggingNode;
    if (
      this.props.layout &&
      typeof this.props.layout !== "string" &&
      this.props.layout.onDrag
    ) {
      this.props.layout.onDrag(node, event);
    }

    node.position.x += event.movementX / this.zoomLevel;
    node.position.y += event.movementY / this.zoomLevel;

    const x = node.position.x - node.width / 2;
    const y = node.position.y - node.height / 2;
    node.transform = `translate(${x}, ${y})`;

    for (const link of this.graph.edges) {
      if (
        link.target === node.id ||
        link.source === node.id ||
        (link.target as any).id === node.id ||
        (link.source as any).id === node.id
      ) {
        if (this.props.layout && typeof this.props.layout !== "string") {
          this.graph = this.props.layout.updateEdge(this.graph, link);
          this.redrawEdge(link);
        }
        this.updateMidpointOnEdge(link, link.points);
      }
    }

    this.forceUpdate();
  }

  private redrawEdge(edge: Edge) {
    const line = this.generateLine(edge.points);
    this.calcDominantBaseline(edge);
    edge.line = line;
  }

  private updateTransform(): void {
    const transform = toSVG(smoothMatrix(this.transformationMatrix, 100));
    if (!this.state.initialized) {
      this.initialTransform = transform;
      return;
    }

    this.setState({
      transform: transform,
    });
  }

  private onMouseMove($event: MouseEvent): void {
    this.isMouseMoveCalled = true;
    if (this.isPanning && this.props.panningEnabled) {
      this.handlePanning(this.props.panningAxis, $event);
    } else if (this.isDragging && this.props.draggingEnabled) {
      this.onDrag($event);
    }
  }

  private onMouseDown(event: MouseEvent): void {
    this.isMouseMoveCalled = false;
    this.isPanning = true;
    this.isMouseMoveCalled = false;
  }

  private graphClick(event: MouseEvent): void {
    if (!this.isMouseMoveCalled) this.props.clickHandler(event);
  }

  private onMouseUp(event: MouseEvent): void {
    this.isDragging = false;
    this.isPanning = false;
    if (
      this.props.layout &&
      typeof this.props.layout !== "string" &&
      (this.props.layout as Layout).onDragEnd
    ) {
      (this.props.layout as Layout).onDragEnd(this.draggingNode, event);
    }
  }

  private onNodeMouseDown(event: MouseEvent, node: any): void {
    if (!this.props.draggingEnabled) {
      return;
    }

    event.stopPropagation();
    this.isDragging = true;
    this.draggingNode = node;

    if (
      this.props.layout &&
      typeof this.props.layout !== "string" &&
      this.props.layout.onDragStart
    ) {
      this.props.layout.onDragStart(node, event);
    }
  }

  private center(): void {
    this.panTo(this.graphDims.width / 2, this.graphDims.height / 2);
  }

  private zoomToFit(): void {
    const heightZoom = this.dims.height / this.graphDims.height;
    const widthZoom = this.dims.width / this.graphDims.width;
    const zoomLevel = Math.min(heightZoom, widthZoom, 1);

    if (
      zoomLevel <= this.props.minZoomLevel ||
      zoomLevel >= this.props.maxZoomLevel
    ) {
      return;
    }

    if (zoomLevel !== this.zoomLevel) {
      this.zoomLevel = zoomLevel;
      this.updateTransform();
      this.props.zoomChange(this.zoomLevel);
    }
  }

  private panToNodeId(nodeId: string): void {
    const node = this.graph.nodes.find((n) => n.id === nodeId);
    if (!node) {
      return;
    }

    this.panTo(node.position.x, node.position.y);
  }

  private handlePanning(key: string, event: MouseEvent) {
    switch (key) {
      case PanningAxis.Horizontal:
        this.pan(event.movementX, 0);
        break;
      case PanningAxis.Vertical:
        this.pan(0, event.movementY);
        break;
      default:
        this.onPan(event);
        break;
    }
  }

  private updateMidpointOnEdge(edge: Edge, points: any): void {
    if (!edge || !points) {
      return;
    }

    if (points.length % 2 === 1) {
      edge.midPoint = points[Math.floor(points.length / 2)];
    } else {
      const first = points[points.length / 2];
      const second = points[points.length / 2 - 1];
      edge.midPoint = {
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2,
      };
    }
  }
}
