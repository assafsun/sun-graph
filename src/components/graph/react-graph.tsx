import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { select } from "d3-selection";
import * as shape from "d3-shape";
import * as ease from "d3-ease";
import "d3-transition";
import { Observable, Subscription, of } from "rxjs";
import { first } from "rxjs/operators";
import {
  identity,
  scale,
  smoothMatrix,
  toSVG,
  transform,
  translate
} from "transformation-matrix";
import { Layout } from "../models/layout.model";
import { LayoutService } from "./layouts/layout.service";
import { Edge } from "../models/edge.model";
import { Node, ClusterNode } from "../models/node.model";
import { Graph } from "../models/graph.model";
import { id } from "../utils/id";
import { PanningAxis } from "../enums/panning.enum";

import { ColorHelper } from "./utils/color.helper";
import {
  ViewDimensions,
  calculateViewDimensions
} from "./utils/view-dimensions.helper";

/**
 * Matrix
 */
export interface Matrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

interface Props extends RouteComponentProps<any> {
  legend?: boolean;
  nodes?: Node[];
  clusters: ClusterNode[];
  links?: Edge[];
  activeEntries?: any;
  curve?: any;
  draggingEnabled?: boolean;
  nodeHeight?: number;
  nodeMaxHeight?: number;
  nodeMinHeight?: number;
  nodeWidth?: number;
  nodeMinWidth?: number;
  nodeMaxWidth?: number;
  panningEnabled?: boolean;
  panningAxis?: PanningAxis;
  enableZoom?: boolean;
  zoomSpeed?: number;
  minZoomLevel?: number;
  maxZoomLevel?: number;
  autoZoom?: boolean;
  panOnZoom?: boolean;
  animate?: boolean;
  autoCenter?: boolean;
  update$?: Observable<any>;
  center$?: Observable<any>;
  zoomToFit$?: Observable<any>;
  panToNode$?: Observable<any>;
  layout?: string | Layout | undefined;
  layoutSettings?: any;
  enableTrackpadSupport?: boolean;
  //
  activate?: (value: any) => void;
  deactivate?: (value: any) => void;
  zoomChange?: (value: number) => void;
  clickHandler?: (value: MouseEvent) => void;
  //
  nodeTemplate?: React.FunctionComponent<Node>;
  linkTemplate?: React.FunctionComponent<any>;
  clusterTemplate?: React.FunctionComponent<any>;
  defsTemplate?: React.FunctionComponent<any>;
}

class ReactGraph extends React.Component<Props> {
  public graphSubscription: Subscription = new Subscription();
  public subscriptions: Subscription[] = [];
  public colors: ColorHelper;
  public dims: ViewDimensions;
  public margin = [0, 0, 0, 0];
  public results = [];
  public seriesDomain: any;
  public transform: string;
  public legendOptions: any;
  public isPanning = false;
  public isDragging = false;
  public draggingNode: Node;
  public initialized = false;
  public graph: Graph;
  public graphDims: any = { width: 0, height: 0 };
  public _oldLinks: Edge[] = [];
  public oldNodes: Set<string> = new Set();
  public oldClusters: Set<string> = new Set();
  public transformationMatrix: Matrix = identity();
  public _touchLastX = null;
  public _touchLastY = null;

  private isMouseMoveCalled: boolean = false;

  render() {
    return <></>;
    //   return <section
    //   [view]="[width, height]"
    //   [showLegend]="legend"
    //   [legendOptions]="legendOptions"
    //   (legendLabelClick)="onClick($event)"
    //   (legendLabelActivate)="onActivate($event)"
    //   (legendLabelDeactivate)="onDeactivate($event)"
    //   mouseWheel
    //   (mouseWheelUp)="onZoom($event, 'in')"
    //   (mouseWheelDown)="onZoom($event, 'out')"
    // >
    //   <svg:g
    //     *ngIf="initialized && graph"
    //     [attr.transform]="transform"
    //     (touchstart)="onTouchStart($event)"
    //     (touchend)="onTouchEnd($event)"
    //     class="graph chart"
    //   >
    //     <defs>
    //       <ng-container *ngIf="defsTemplate" [ngTemplateOutlet]="defsTemplate"></ng-container>
    //       <svg:path
    //         class="text-path"
    //         *ngFor="let link of graph.edges"
    //         [attr.d]="link.textPath"
    //         [attr.id]="link.id"
    //       ></svg:path>
    //     </defs>

    //     <svg:rect
    //       class="panning-rect"
    //       [attr.width]="dims.width * 100"
    //       [attr.height]="dims.height * 100"
    //       [attr.transform]="'translate(' + (-dims.width || 0) * 50 + ',' + (-dims.height || 0) * 50 + ')'"
    //       (mousedown)="isPanning = true"
    //     />

    //     <ng-content></ng-content>

    //     <svg:g class="clusters">
    //       <svg:g
    //         #clusterElement
    //         *ngFor="let node of graph.clusters; trackBy: trackNodeBy"
    //         class="node-group"
    //         [class.old-node]="animate && oldClusters.has(node.id)"
    //         [id]="node.id"
    //         [attr.transform]="node.transform"
    //         (click)="onClick(node)"
    //       >
    //         <ng-container
    //           *ngIf="clusterTemplate"
    //           [ngTemplateOutlet]="clusterTemplate"
    //           [ngTemplateOutletContext]="{ $implicit: node }"
    //         ></ng-container>
    //         <svg:g *ngIf="!clusterTemplate" class="node cluster">
    //           <svg:rect
    //             [attr.width]="node.dimension.width"
    //             [attr.height]="node.dimension.height"
    //             [attr.fill]="node.data?.color"
    //           />
    //           <svg:text alignment-baseline="central" [attr.x]="10" [attr.y]="node.dimension.height / 2">
    //             {{ node.label }}
    //           </svg:text>
    //         </svg:g>
    //       </svg:g>
    //     </svg:g>

    //     <svg:g class="links">
    //       <svg:g #linkElement *ngFor="let link of graph.edges; trackBy: trackLinkBy" class="link-group" [id]="link.id">
    //         <ng-container
    //           *ngIf="linkTemplate"
    //           [ngTemplateOutlet]="linkTemplate"
    //           [ngTemplateOutletContext]="{ $implicit: link }"
    //         ></ng-container>
    //         <svg:path *ngIf="!linkTemplate" class="edge" [attr.d]="link.line" />
    //       </svg:g>
    //     </svg:g>

    //     <svg:g class="nodes">
    //       <svg:g
    //         #nodeElement
    //         *ngFor="let node of graph.nodes; trackBy: trackNodeBy"
    //         class="node-group"
    //         [class.old-node]="animate && oldNodes.has(node.id)"
    //         [id]="node.id"
    //         [attr.transform]="node.transform"
    //         (click)="onClick(node)"
    //         (mousedown)="onNodeMouseDown($event, node)"
    //       >
    //         <ng-container
    //           *ngIf="nodeTemplate"
    //           [ngTemplateOutlet]="nodeTemplate"
    //           [ngTemplateOutletContext]="{ $implicit: node }"
    //         ></ng-container>
    //         <svg:circle
    //           *ngIf="!nodeTemplate"
    //           r="10"
    //           [attr.cx]="node.dimension.width / 2"
    //           [attr.cy]="node.dimension.height / 2"
    //           [attr.fill]="node.data?.color"
    //         />
    //       </svg:g>
    //     </svg:g>
    //   </svg:g>
    // </ngx-charts-chart>
  }

  /**
   * Get the current zoom level
   */
  get zoomLevel() {
    return this.transformationMatrix.a;
  }

  /**
   * Set the current zoom level
   */
  set zoomLevel(level) {
    this.zoomTo(Number(level));
  }

  /**
   * Get the current `x` position of the graph
   */
  get panOffsetX() {
    return this.transformationMatrix.e;
  }

  /**
   * Set the current `x` position of the graph
   */
  set panOffsetX(x) {
    this.panTo(Number(x), null);
  }

  /**
   * Get the current `y` position of the graph
   */
  get panOffsetY() {
    return this.transformationMatrix.f;
  }

  /**
   * Set the current `y` position of the graph
   */
  set panOffsetY(y) {
    this.panTo(null, Number(y));
  }

  /**
   * Angular lifecycle event
   *
   *
   * @memberOf GraphComponent
   */
  ngOnInit(): void {
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { layout, layoutSettings, nodes, clusters, links } = changes;
    this.setLayout(this.props.layout);
    if (layoutSettings) {
      this.setLayoutSettings(this.props.layoutSettings);
    }
    this.update();
  }

  setLayout(layout: string | Layout | undefined): void {
    this.initialized = false;
    if (!layout) {
      layout = "dagre";
    }
    if (typeof layout === "string") {
      this.layout = this.props.layoutService.getLayout(layout);
      this.setLayoutSettings(this.props.layoutSettings);
    }
  }

  setLayoutSettings(settings: any): void {
    if (this.props.layout && typeof this.props.layout !== "string") {
      this.props.layout.settings = settings;
      this.update();
    }
  }

  /**
   * Angular lifecycle event
   *
   *
   * @memberOf GraphComponent
   */
  ngOnDestroy(): void {
    super.ngOnDestroy();
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }

  /**
   * Angular lifecycle event
   *
   *
   * @memberOf GraphComponent
   */
  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    setTimeout(() => this.update());
  }

  /**
   * Base class update implementation for the dag graph
   *
   * @memberOf GraphComponent
   */
  update(): void {
    super.update();
    if (!this.curve) {
      this.curve = shape.curveBundle.beta(1);
    }

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showLegend: this.legend
    });

    this.seriesDomain = this.getSeriesDomain();
    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.createGraph();
    this.updateTransform();
    this.initialized = true;
  }

  /**
   * Creates the dagre graph engine
   *
   * @memberOf GraphComponent
   */
  createGraph(): void {
    this.graphSubscription.unsubscribe();
    this.graphSubscription = new Subscription();
    const initializeNode = (n: Node) => {
      if (!n.meta) {
        n.meta = {};
      }
      if (!n.id) {
        n.id = id();
      }
      if (!n.dimension) {
        n.dimension = {
          width: this.props.nodeWidth ? this.props.nodeWidth : 30,
          height: this.props.nodeHeight ? this.props.nodeHeight : 30
        };

        n.meta.forceDimensions = false;
      } else {
        n.meta.forceDimensions =
          n.meta.forceDimensions === undefined ? true : n.meta.forceDimensions;
      }
      n.position = {
        x: 0,
        y: 0
      };
      n.data = n.data ? n.data : {};
      return n;
    };

    this.graph = {
      nodes: [...(this.props.nodes || [])].map(initializeNode),
      clusters: [...(this.props.clusters || [])].map(initializeNode),
      edges: [...(this.props.links || [])].map(e => {
        if (!e.id) {
          e.id = id();
        }
        return e;
      })
    };

    requestAnimationFrame(() => this.draw());
  }

  /**
   * Draws the graph using dagre layouts
   *
   *
   * @memberOf GraphComponent
   */
  draw(): void {
    if (!this.props.layout || typeof this.props.layout === "string") {
      return;
    }
    // Calc view dims for the nodes
    this.applyNodeDimensions();

    // Recalc the layout
    const result = this.props.layout.run(this.graph);
    const result$ = result instanceof Observable ? result : of(result);
    this.graphSubscription.add(
      result$.subscribe(graph => {
        this.graph = graph;
        this.tick();
      })
    );
    result$
      .pipe(first(graph => graph.nodes.length > 0))
      .subscribe(() => this.applyNodeDimensions());
  }

  tick() {
    // Transposes view options to the node
    const oldNodes: Set<string> = new Set();

    this.graph.nodes.map(n => {
      n.transform = `translate(${n.position.x - n.dimension.width / 2 || 0}, ${n
        .position.y -
        n.dimension.height / 2 || 0})`;
      if (!n.data) {
        n.data = {};
      }
      n.data.color = this.colors.getColor(this.groupResultsBy(n));
      oldNodes.add(n.id);
    });

    const oldClusters: Set<string> = new Set();

    (this.graph.clusters || []).map(n => {
      n.transform = `translate(${n.position.x - n.dimension.width / 2 || 0}, ${n
        .position.y -
        n.dimension.height / 2 || 0})`;
      if (!n.data) {
        n.data = {};
      }
      n.data.color = this.colors.getColor(this.groupResultsBy(n));
      oldClusters.add(n.id);
    });

    // Prevent animations on new nodes
    setTimeout(() => {
      this.oldNodes = oldNodes;
      this.oldClusters = oldClusters;
    }, 500);

    // Update the labels to the new positions
    const newLinks = [];
    for (const edgeLabelId in this.graph.edgeLabels) {
      const edgeLabel = this.graph.edgeLabels[edgeLabelId];

      const normKey = edgeLabelId.replace(/[^\w-]*/g, "");

      const isMultigraph =
        this.layout &&
        typeof this.layout !== "string" &&
        this.layout.settings &&
        this.layout.settings.multigraph;

      let oldLink = isMultigraph
        ? this._oldLinks.find(
            ol => `${ol.source}${ol.target}${ol.id}` === normKey
          )
        : this._oldLinks.find(ol => `${ol.source}${ol.target}` === normKey);

      const linkFromGraph = isMultigraph
        ? this.graph.edges.find(
            nl => `${nl.source}${nl.target}${nl.id}` === normKey
          )
        : this.graph.edges.find(nl => `${nl.source}${nl.target}` === normKey);

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
        newLink.textTransform = `translate(${textPos.x || 0},${textPos.y ||
          0})`;
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
      this._oldLinks = this.graph.edges.map(l => {
        const newL = Object.assign({}, l);
        newL.oldLine = l.line;
        return newL;
      });
    }

    // Calculate the height/width total, but only if we have any nodes
    if (this.graph.nodes && this.graph.nodes.length) {
      this.graphDims.width = Math.max(
        ...this.graph.nodes.map(n => n.position.x + n.dimension.width)
      );
      this.graphDims.height = Math.max(
        ...this.graph.nodes.map(n => n.position.y + n.dimension.height)
      );
    }

    if (this.autoZoom) {
      this.zoomToFit();
    }

    if (this.autoCenter) {
      // Auto-center when rendering
      this.center();
    }

    requestAnimationFrame(() => this.redrawLines());
    this.cd.markForCheck();
  }

  /**
   * Measures the node element and applies the dimensions
   *
   * @memberOf GraphComponent
   */
  applyNodeDimensions(): void {
    if (this.nodeElements && this.nodeElements.length) {
      this.nodeElements.map(elem => {
        const nativeElement = elem.nativeElement;
        const node = this.graph.nodes.find(n => n.id === nativeElement.id);

        // calculate the height
        let dims;
        try {
          dims = nativeElement.getBBox();
        } catch (ex) {
          // Skip drawing if element is not displayed - Firefox would throw an error here
          return;
        }
        if (this.nodeHeight) {
          node.dimension.height =
            node.dimension.height && node.meta.forceDimensions
              ? node.dimension.height
              : this.nodeHeight;
        } else {
          node.dimension.height =
            node.dimension.height && node.meta.forceDimensions
              ? node.dimension.height
              : dims.height;
        }

        if (this.nodeMaxHeight) {
          node.dimension.height = Math.max(
            node.dimension.height,
            this.nodeMaxHeight
          );
        }
        if (this.nodeMinHeight) {
          node.dimension.height = Math.min(
            node.dimension.height,
            this.nodeMinHeight
          );
        }

        if (this.nodeWidth) {
          node.dimension.width =
            node.dimension.width && node.meta.forceDimensions
              ? node.dimension.width
              : this.nodeWidth;
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
              return;
            }
            node.dimension.width =
              node.dimension.width && node.meta.forceDimensions
                ? node.dimension.width
                : maxTextDims.width + 20;
          } else {
            node.dimension.width =
              node.dimension.width && node.meta.forceDimensions
                ? node.dimension.width
                : dims.width;
          }
        }

        if (this.nodeMaxWidth) {
          node.dimension.width = Math.max(
            node.dimension.width,
            this.nodeMaxWidth
          );
        }
        if (this.nodeMinWidth) {
          node.dimension.width = Math.min(
            node.dimension.width,
            this.nodeMinWidth
          );
        }
      });
    }
  }

  /**
   * Redraws the lines when dragged or viewport updated
   *
   * @memberOf GraphComponent
   */
  redrawLines(_animate = this.animate): void {
    this.linkElements.map(linkEl => {
      const edge = this.graph.edges.find(
        lin => lin.id === linkEl.nativeElement.id
      );

      if (edge) {
        const linkSelection = select(linkEl.nativeElement).select(".line");
        linkSelection
          .attr("d", edge.oldLine)
          .transition()
          .ease(ease.easeSinInOut)
          .duration(_animate ? 500 : 0)
          .attr("d", edge.line);

        const textPathSelection = select(
          this.chartElement.nativeElement
        ).select(`#${edge.id}`);
        textPathSelection
          .attr("d", edge.oldTextPath)
          .transition()
          .ease(ease.easeSinInOut)
          .duration(_animate ? 500 : 0)
          .attr("d", edge.textPath);

        this.updateMidpointOnEdge(edge, edge.points);
      }
    });
  }

  /**
   * Calculate the text directions / flipping
   *
   * @memberOf GraphComponent
   */
  calcDominantBaseline(link): void {
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

  /**
   * Generate the new line path
   *
   * @memberOf GraphComponent
   */
  generateLine(points: any): any {
    const lineFunction = shape
      .line<any>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(this.curve);
    return lineFunction(points);
  }

  /**
   * Zoom was invoked from event
   *
   * @memberOf GraphComponent
   */
  onZoom($event: WheelEvent, direction): void {
    if (this.enableTrackpadSupport && !$event.ctrlKey) {
      this.pan($event.deltaX * -1, $event.deltaY * -1);
      return;
    }

    const zoomFactor =
      1 + (direction === "in" ? this.zoomSpeed : -this.zoomSpeed);

    // Check that zooming wouldn't put us out of bounds
    const newZoomLevel = this.zoomLevel * zoomFactor;
    if (
      newZoomLevel <= this.minZoomLevel ||
      newZoomLevel >= this.maxZoomLevel
    ) {
      return;
    }

    // Check if zooming is enabled or not
    if (!this.enableZoom) {
      return;
    }

    if (this.panOnZoom === true && $event) {
      // Absolute mouse X/Y on the screen
      const mouseX = $event.clientX;
      const mouseY = $event.clientY;

      // Transform the mouse X/Y into a SVG X/Y
      const svg = this.chart.nativeElement.querySelector("svg");
      const svgGroup = svg.querySelector("g.chart");

      const point = svg.createSVGPoint();
      point.x = mouseX;
      point.y = mouseY;
      const svgPoint = point.matrixTransform(svgGroup.getScreenCTM().inverse());

      // Panzoom
      this.pan(svgPoint.x, svgPoint.y, true);
      this.zoom(zoomFactor);
      this.pan(-svgPoint.x, -svgPoint.y, true);
    } else {
      this.zoom(zoomFactor);
    }
  }

  /**
   * Pan by x/y
   *
   * @param x
   * @param y
   */
  pan(x: number, y: number, ignoreZoomLevel: boolean = false): void {
    const zoomLevel = ignoreZoomLevel ? 1 : this.zoomLevel;
    this.transformationMatrix = transform(
      this.transformationMatrix,
      translate(x / zoomLevel, y / zoomLevel)
    );

    this.updateTransform();
  }

  /**
   * Pan to a fixed x/y
   *
   */
  panTo(x: number | null, y: number | null): void {
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

  /**
   * Zoom by a factor
   *
   */
  zoom(factor: number): void {
    this.transformationMatrix = transform(
      this.transformationMatrix,
      scale(factor, factor)
    );
    this.zoomChange.emit(this.zoomLevel);
    this.updateTransform();
  }

  /**
   * Zoom to a fixed level
   *
   */
  zoomTo(level: number): void {
    this.transformationMatrix.a = isNaN(level)
      ? this.transformationMatrix.a
      : Number(level);
    this.transformationMatrix.d = isNaN(level)
      ? this.transformationMatrix.d
      : Number(level);
    this.zoomChange.emit(this.zoomLevel);
    this.updateTransform();
    this.update();
  }

  /**
   * Pan was invoked from event
   *
   * @memberOf GraphComponent
   */
  onPan(event: MouseEvent): void {
    this.pan(event.movementX, event.movementY);
  }

  /**
   * Drag was invoked from an event
   *
   * @memberOf GraphComponent
   */
  onDrag(event: MouseEvent): void {
    if (!this.draggingEnabled) {
      return;
    }
    const node = this.draggingNode;
    if (this.layout && typeof this.layout !== "string" && this.layout.onDrag) {
      this.layout.onDrag(node, event);
    }

    node.position.x += event.movementX / this.zoomLevel;
    node.position.y += event.movementY / this.zoomLevel;

    // move the node
    const x = node.position.x - node.dimension.width / 2;
    const y = node.position.y - node.dimension.height / 2;
    node.transform = `translate(${x}, ${y})`;

    for (const link of this.graph.edges) {
      if (
        link.target === node.id ||
        link.source === node.id ||
        (link.target as any).id === node.id ||
        (link.source as any).id === node.id
      ) {
        if (this.layout && typeof this.layout !== "string") {
          const result = this.layout.updateEdge(this.graph, link);
          const result$ = result instanceof Observable ? result : of(result);
          this.graphSubscription.add(
            result$.subscribe(graph => {
              this.graph = graph;
              this.redrawEdge(link);
            })
          );
        }
      }
    }

    this.redrawLines(false);
  }

  redrawEdge(edge: Edge) {
    const line = this.generateLine(edge.points);
    this.calcDominantBaseline(edge);
    edge.oldLine = edge.line;
    edge.line = line;
  }

  /**
   * Update the entire view for the new pan position
   *
   *
   * @memberOf GraphComponent
   */
  updateTransform(): void {
    this.transform = toSVG(smoothMatrix(this.transformationMatrix, 100));
  }

  /**
   * Node was clicked
   *
   *
   * @memberOf GraphComponent
   */
  onClick(event: any): void {
    this.select.emit(event);
  }

  /**
   * Node was focused
   *
   *
   * @memberOf GraphComponent
   */
  onActivate(event): void {
    if (this.activeEntries.indexOf(event) > -1) {
      return;
    }
    this.activeEntries = [event, ...this.activeEntries];
    this.activate.emit({ value: event, entries: this.activeEntries });
  }

  /**
   * Node was defocused
   *
   * @memberOf GraphComponent
   */
  onDeactivate(event): void {
    const idx = this.activeEntries.indexOf(event);

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: event, entries: this.activeEntries });
  }

  /**
   * Get the domain series for the nodes
   *
   * @memberOf GraphComponent
   */
  getSeriesDomain(): any[] {
    return this.nodes
      .map(d => this.groupResultsBy(d))
      .reduce(
        (nodes: string[], node): any[] =>
          nodes.indexOf(node) !== -1 ? nodes : nodes.concat([node]),
        []
      )
      .sort();
  }

  /**
   * Tracking for the link
   *
   *
   * @memberOf GraphComponent
   */
  trackLinkBy(index: number, link: Edge): any {
    return link.id;
  }

  /**
   * Tracking for the node
   *
   *
   * @memberOf GraphComponent
   */
  trackNodeBy(index: number, node: Node): any {
    return node.id;
  }

  /**
   * Sets the colors the nodes
   *
   *
   * @memberOf GraphComponent
   */
  setColors(): void {
    this.colors = new ColorHelper(
      this.scheme,
      "ordinal",
      this.seriesDomain,
      this.customColors
    );
  }

  /**
   * Gets the legend options
   *
   * @memberOf GraphComponent
   */
  getLegendOptions(): any {
    return {
      scaleType: "ordinal",
      domain: this.seriesDomain,
      colors: this.colors
    };
  }

  /**
   * On mouse move event, used for panning and dragging.
   *
   * @memberOf GraphComponent
   */
  @HostListener("document:mousemove", ["$event"])
  onMouseMove($event: MouseEvent): void {
    this.isMouseMoveCalled = true;
    if (this.isPanning && this.panningEnabled) {
      this.checkEnum(this.panningAxis, $event);
    } else if (this.isDragging && this.draggingEnabled) {
      this.onDrag($event);
    }
  }

  @HostListener("document:mousedown", ["$event"])
  onMouseDown(event: MouseEvent): void {
    this.isMouseMoveCalled = false;
  }

  @HostListener("document:click", ["$event"])
  graphClick(event: MouseEvent): void {
    if (!this.isMouseMoveCalled) this.clickHandler.emit(event);
  }

  /**
   * On touch start event to enable panning.
   *
   * @memberOf GraphComponent
   */
  onTouchStart(event: any): void {
    this._touchLastX = event.changedTouches[0].clientX;
    this._touchLastY = event.changedTouches[0].clientY;

    this.isPanning = true;
  }

  /**
   * On touch move event, used for panning.
   *
   */
  @HostListener("document:touchmove", ["$event"])
  onTouchMove($event: any): void {
    if (this.isPanning && this.panningEnabled) {
      const clientX = $event.changedTouches[0].clientX;
      const clientY = $event.changedTouches[0].clientY;
      const movementX = clientX - this._touchLastX;
      const movementY = clientY - this._touchLastY;
      this._touchLastX = clientX;
      this._touchLastY = clientY;

      this.pan(movementX, movementY);
    }
  }

  /**
   * On touch end event to disable panning.
   *
   * @memberOf GraphComponent
   */
  onTouchEnd(event: any) {
    this.isPanning = false;
  }

  /**
   * On mouse up event to disable panning/dragging.
   *
   * @memberOf GraphComponent
   */
  @HostListener("document:mouseup", ["$event"])
  onMouseUp(event: MouseEvent): void {
    this.isDragging = false;
    this.isPanning = false;
    if (
      this.layout &&
      typeof this.layout !== "string" &&
      this.layout.onDragEnd
    ) {
      this.layout.onDragEnd(this.draggingNode, event);
    }
  }

  /**
   * On node mouse down to kick off dragging
   *
   * @memberOf GraphComponent
   */
  onNodeMouseDown(event: MouseEvent, node: any): void {
    if (!this.draggingEnabled) {
      return;
    }
    this.isDragging = true;
    this.draggingNode = node;

    if (
      this.layout &&
      typeof this.layout !== "string" &&
      this.layout.onDragStart
    ) {
      this.layout.onDragStart(node, event);
    }
  }

  /**
   * Center the graph in the viewport
   */
  center(): void {
    this.panTo(this.graphDims.width / 2, this.graphDims.height / 2);
  }

  /**
   * Zooms to fit the entier graph
   */
  zoomToFit(): void {
    const heightZoom = this.dims.height / this.graphDims.height;
    const widthZoom = this.dims.width / this.graphDims.width;
    const zoomLevel = Math.min(heightZoom, widthZoom, 1);

    if (zoomLevel <= this.minZoomLevel || zoomLevel >= this.maxZoomLevel) {
      return;
    }

    if (zoomLevel !== this.zoomLevel) {
      this.zoomLevel = zoomLevel;
      this.updateTransform();
      this.zoomChange.emit(this.zoomLevel);
    }
  }

  /**
   * Pans to the node
   * @param nodeId
   */
  panToNodeId(nodeId: string): void {
    const node = this.graph.nodes.find(n => n.id === nodeId);
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
        y: (first.y + second.y) / 2
      };
    }
  }
}

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

// @Component({
//   selector: "ngx-graph",
//   styleUrls: ["./graph.component.scss"],
//   templateUrl: "graph.component.html",
//   encapsulation: ViewEncapsulation.None,
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class GraphComponent extends BaseChartComponent
//   implements OnInit, OnChanges, OnDestroy, AfterViewInit {
//   @ViewChild(ChartComponent, { read: ElementRef, static: true })
//   chart: ElementRef;
//   @ViewChildren("nodeElement") nodeElements: QueryList<ElementRef>;
//   @ViewChildren("linkElement") linkElements: QueryList<ElementRef>;

//   constructor(
//     private el: ElementRef,
//     public zone: NgZone,
//     public cd: ChangeDetectorRef,
//     private layoutService: LayoutService
//   ) {
//     super(el, zone, cd);
//   }

//   @Input()
//   groupResultsBy: (node: any) => string = node => node.label;
// }
