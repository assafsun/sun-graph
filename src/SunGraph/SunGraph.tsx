import React from "react";

import { select } from "d3-selection";
import * as shape from "d3-shape";
import { Observable, Subscription, of } from "rxjs";
import { first } from "rxjs/operators";
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

import "./SunGraph.scss";
import { CustomDagreLayout } from "./layouts/customDagreLayout";

interface State {
  initialized: boolean;
  transform?: string;
}

interface Props {
  view?: [number, number];
  nodes: Node[];
  links: Edge[];
  layout?: string | Layout | undefined;
  curve?: any;
  nodeHeight?: number;
  nodeWidth?: number;
  draggingEnabled?: boolean;
  panningEnabled?: boolean;
  panningAxis?: PanningAxis;
  enableZoom?: boolean;
  zoomSpeed?: number;
  minZoomLevel?: number;
  maxZoomLevel?: number;
  autoZoom?: boolean;
  autoCenter?: boolean;
  update$?: Observable<any>;
  center$?: Observable<any>;
  zoomToFit$?: Observable<any>;
  panToNode$?: Observable<any>;
  enableTrackpadSupport?: boolean;
  zoomChange?: (value: number) => void;
  clickHandler?: (value: MouseEvent) => void;
  defsTemplate?: () => any;
  panOnZoom?: boolean; // TODO - fix state update
}

export class SunGraph extends React.Component<Props, State> {
  public chartElement: any;
  public nodeElements: any;
  public linkElements: any;
  public graphSubscription: Subscription = new Subscription();
  public subscriptions: Subscription[] = [];
  public dims: ViewDimensions;
  public margin = [0, 0, 0, 0];
  public isPanning = false;
  public isDragging = false;
  public draggingNode: Node;
  public graph: Graph;
  public graphDims: any = { width: 0, height: 0 };
  public _oldLinks: Edge[] = [];
  public oldNodes: Set<string> = new Set();
  public transformationMatrix: Matrix = identity();
  public _touchLastX: any = null;
  public _touchLastY: any = null;
  public width: number;
  public height: number;
  public initialTransform: string;

  private isMouseMoveCalled: boolean = false;

  static defaultProps = {
    view: [700, 700],
    curve: shape.curveLinear,
    layout: new CustomDagreLayout(),
    clickHandler: (value: MouseEvent) => {},
    zoomChange: (value: number) => {},
  };

  constructor(props: Props) {
    super(props);
    this.chartElement = React.createRef();
    if (this.props.update$) {
      this.subscriptions.push(
        this.props.update$.subscribe(() => {
          this.update();
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

  componentDidMount() {
    this.setState({ initialized: true });
  }

  componentWillUnmount() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }

  divStyle = {
    width: this.props.view[0],
    height: this.props.view[1],
  };

  public render(): React.ReactNode {
    const nodes = [];
    for (let node of this.graph.nodes) {
      let nodeTemplate = (
        <rect r="10" width={node.width} height={node.height} fill="green" />
      );
      if (node.layout) {
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
                {node.layout(node)}
              </foreignObject>
            </g>
          </svg>
        );
      }

      nodes.push(
        <svg key={node.id}>
          <g transform={node.transform}>{nodeTemplate}</g>
        </svg>
      );
    }

    const links = [];
    for (let link of this.graph.edges) {
      links.push(
        <g className="link-group" id={link.id} key={link.id}>
          <svg>
            <g className="edge">
              <path
                className="line"
                strokeWidth="2"
                markerEnd="url(#arrow)"
                d={link.line}
              ></path>
            </g>
          </svg>
        </g>
      );
    }

    return (
      this.state.initialized && (
        <div
          style={this.divStyle}
          className="graph"
          onClick={(e: any) => this.graphClick(e)}
          onMouseMove={(e: any) => this.onMouseMove(e)}
          onMouseDown={(e: any) => {
            this.onMouseDown(e);
          }}
          onMouseUp={(e: any) => {
            this.onMouseUp(e);
          }}
          onWheel={(e: any) => {
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
              this.onZoom(e, "down");
            }
          }}
          ref={this.chartElement}
        >
          <svg className="svgGraph" transform={this.state.transform}>
            <g className="defsTemplate">{this.props.defsTemplate()}</g>
            <g className="nodes">{nodes}</g>
            <g className="links">{links}</g>
          </svg>
        </div>
      )
    );
  }

  get zoomLevel() {
    return this.transformationMatrix.a;
  }

  set zoomLevel(level) {
    this.zoomTo(Number(level));
  }

  get panOffsetX() {
    return this.transformationMatrix.e;
  }

  get panOffsetY() {
    return this.transformationMatrix.f;
  }

  private basicUpdate(): void {
    if (this.props.view) {
      this.width = this.props.view[0];
      this.height = this.props.view[1];
    } else {
      this.width = 700;
      this.height = 700;
    }

    // default values if width or height are 0 or undefined
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showLegend: false,
    });
  }

  private update(): void {
    this.basicUpdate();
    this.createGraph();
    this.updateTransform();
  }

  private createGraph(): void {
    this.graphSubscription.unsubscribe();
    this.graphSubscription = new Subscription();
    const initializeNode = (n: Node) => {
      if (!n.meta) {
        n.meta = {};
      }
      if (!n.id) {
        n.id = id();
      }
      if (!n.width || !n.height) {
        n.width = this.props.nodeWidth ? this.props.nodeWidth : 30;
        n.height = this.props.nodeHeight ? this.props.nodeHeight : 30;
        n.meta.forceDimensions = false;
      } else {
        n.meta.forceDimensions =
          n.meta.forceDimensions === undefined ? true : n.meta.forceDimensions;
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

    // Calc view dims for the nodes
    this.applyNodeDimensions();

    // Recalc the layout
    const result = this.props.layout.run(this.graph);
    const result$ = result instanceof Observable ? result : of(result);
    this.graphSubscription.add(
      result$.subscribe((graph) => {
        this.graph = graph;
        this.tick();
      })
    );
    result$
      .pipe(first((graph) => graph.nodes.length > 0))
      .subscribe(() => this.applyNodeDimensions());
  }

  private tick() {
    // Transposes view options to the node
    const oldNodes: Set<string> = new Set();

    this.graph.nodes.map((n) => {
      n.transform = `translate(${n.position.x - n.width / 2 || 0}, ${
        n.position.y - n.height / 2 || 0
      })`;
      if (!n.data) {
        n.data = {};
      }
      oldNodes.add(n.id);
      return n;
    });

    // Prevent animations on new nodes
    setTimeout(() => {
      this.oldNodes = oldNodes;
    }, 500);

    // Update the labels to the new positions
    const newLinks = [];
    for (const edgeLabelId in this.graph.edgeLabels) {
      const edgeLabel = this.graph.edgeLabels[edgeLabelId];

      const normKey = edgeLabelId.replace(/[^\w-]*/g, "");

      const isMultigraph =
        this.props.layout &&
        typeof this.props.layout !== "string" &&
        this.props.layout.settings &&
        this.props.layout.settings.multigraph;

      let oldLink = isMultigraph
        ? this._oldLinks.find(
            (ol) => `${ol.source}${ol.target}${ol.id}` === normKey
          )
        : this._oldLinks.find((ol) => `${ol.source}${ol.target}` === normKey);

      const linkFromGraph = isMultigraph
        ? this.graph.edges.find(
            (nl) => `${nl.source}${nl.target}${nl.id}` === normKey
          )
        : this.graph.edges.find((nl) => `${nl.source}${nl.target}` === normKey);

      if (!oldLink) {
        oldLink = linkFromGraph || edgeLabel;
      } else if (
        oldLink.data &&
        linkFromGraph &&
        linkFromGraph.data &&
        JSON.stringify(oldLink.data) !== JSON.stringify(linkFromGraph.data)
      ) {
        // Compare old link to new link and replace if not equal
        oldLink.data = linkFromGraph.data;
      }

      oldLink.oldLine = oldLink.line;

      const points = edgeLabel.points;
      const line = this.generateLine(points);

      const newLink = Object.assign({}, oldLink);
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
      if (!newLink.oldLine) {
        newLink.oldLine = newLink.line;
      }

      this.calcDominantBaseline(newLink);
      newLinks.push(newLink);
    }

    this.graph.edges = newLinks;

    // Map the old links for animations
    if (this.graph.edges) {
      this._oldLinks = this.graph.edges.map((l) => {
        const newL = Object.assign({}, l);
        newL.oldLine = l.line;
        return newL;
      });
    }

    // Calculate the height/width total, but only if we have any nodes
    if (this.graph.nodes && this.graph.nodes.length) {
      this.graphDims.width = Math.max(
        ...this.graph.nodes.map((n) => n.position.x + n.width)
      );
      this.graphDims.height = Math.max(
        ...this.graph.nodes.map((n) => n.position.y + n.height)
      );
    }

    if (this.props.autoZoom) {
      this.zoomToFit();
    }

    if (this.props.autoCenter) {
      // Auto-center when rendering
      this.center();
    }

    requestAnimationFrame(() => this.redrawLines());
  }

  private applyNodeDimensions(): void {
    this.nodeElements = document.getElementsByName("nodeElement");
    if (this.nodeElements && this.nodeElements.length) {
      this.nodeElements.map((elem: any) => {
        const nativeElement = elem.nativeElement;
        const node = this.graph.nodes.find((n) => n.id === nativeElement.id);

        // calculate the height
        let dims;
        try {
          dims = nativeElement.getBBox();
        } catch (ex) {
          // Skip drawing if element is not displayed - Firefox would throw an error here
          return elem;
        }

        if (this.props.nodeHeight) {
          node.height =
            node.height && node.meta.forceDimensions
              ? node.height
              : this.props.nodeHeight;
        } else {
          node.height =
            node.height && node.meta.forceDimensions
              ? node.height
              : dims.height;
        }

        if (this.props.nodeWidth) {
          node.width =
            node.width && node.meta.forceDimensions
              ? node.width
              : this.props.nodeWidth;
        } else {
          // calculate the width
          if (nativeElement.getElementsByTagName("text").length) {
            let maxTextDims;
            try {
              for (const textElem of nativeElement.getElementsByTagName(
                "text"
              )) {
                const currentBBox = textElem.getBBox();
                if (!maxTextDims) {
                  maxTextDims = currentBBox;
                } else {
                  if (currentBBox.width > maxTextDims.width) {
                    maxTextDims.width = currentBBox.width;
                  }
                  if (currentBBox.height > maxTextDims.height) {
                    maxTextDims.height = currentBBox.height;
                  }
                }
              }
            } catch (ex) {
              // Skip drawing if element is not displayed - Firefox would throw an error here
              return elem;
            }
            node.width =
              node.width && node.meta.forceDimensions
                ? node.width
                : maxTextDims.width + 20;
          } else {
            node.width =
              node.width && node.meta.forceDimensions ? node.width : dims.width;
          }
        }

        return elem;
      });
    }
  }

  private redrawLines(): void {
    this.linkElements = document.getElementsByName("linkElement");
    // if (this.linkElements.length === 0) {
    //   return;
    // }
    this.graph.edges.map((linkEl: any) => {
      // const edge = this.graph.edges.find(
      //   (lin) => lin.id === linkEl.nativeElement.id
      // );

      if (linkEl) {
        const linkSelection = select(linkEl.nativeElement).select(".line");
        linkSelection
          .attr("d", linkEl.oldLine)
          // .transition()
          // .ease(ease.easeSinInOut)
          .attr("d", linkEl.line);

        const textPathSelection = select(
          this.chartElement.nativeElement
        ).select(`#${linkEl.id}`);
        textPathSelection
          .attr("d", linkEl.oldTextPath)
          // .transition()
          // .ease(ease.easeSinInOut)
          .attr("d", linkEl.textPath);

        this.updateMidpointOnEdge(linkEl, linkEl.points);
      }

      return linkEl;
    });
  }

  private calcDominantBaseline(link: any): void {
    const firstPoint = link.points[0];
    const lastPoint = link.points[link.points.length - 1];
    link.oldTextPath = link.textPath;

    if (lastPoint.x < firstPoint.x) {
      link.dominantBaseline = "text-before-edge";

      // reverse text path for when its flipped upside down
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

    // Check that zooming wouldn't put us out of bounds
    const newZoomLevel = this.zoomLevel * zoomFactor;
    if (
      newZoomLevel <= this.props.minZoomLevel ||
      newZoomLevel >= this.props.maxZoomLevel
    ) {
      return;
    }

    // Check if zooming is enabled or not
    if (!this.props.enableZoom) {
      return;
    }

    if (this.props.panOnZoom === true && $event) {
      // Absolute mouse X/Y on the screen
      const mouseX = $event.clientX;
      const mouseY = $event.clientY;

      const svg = document.querySelector("svg");
      const pt = svg.createSVGPoint(); // demo is an SVGElement

      pt.x = mouseX;
      pt.y = mouseY;
      const svgGlobal = pt.matrixTransform(svg.getScreenCTM().inverse());

      // Panzoom
      this.pan(svgGlobal.x, svgGlobal.y, true);
      this.zoom(zoomFactor);
      this.pan(svgGlobal.x * -1, svgGlobal.y * -1, true);
    } else {
      this.zoom(zoomFactor);
    }
  }

  private pan(x: number, y: number, ignoreZoomLevel: boolean = false): void {
    const zoomLevel = ignoreZoomLevel ? 1 : this.zoomLevel;

    if (this.props.enableTrackpadSupport || ignoreZoomLevel) {
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
        newTempTransofrmationMetrix.f >
          this.dims.width - this.graphDims.width ||
        newTempTransofrmationMetrix.e > this.dims.height - this.graphDims.height
      ) {
        return;
      }
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

    // move the node
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
          const result = this.props.layout.updateEdge(this.graph, link);
          const result$ = result instanceof Observable ? result : of(result);
          this.graphSubscription.add(
            result$.subscribe((graph) => {
              this.graph = graph;
              this.redrawEdge(link);
            })
          );
        }
      }
    }

    this.redrawLines();
    this.forceUpdate();
  }

  private redrawEdge(edge: Edge) {
    const line = this.generateLine(edge.points);
    this.calcDominantBaseline(edge);
    edge.oldLine = edge.line;
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
      this.checkEnum(this.props.panningAxis, $event);
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

  private checkEnum(key: string, event: MouseEvent) {
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