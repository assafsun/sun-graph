import { Layout } from "SunGraph/models/layout.model";
import { Graph, Node } from "SunGraph/models/graph.model";
import { id } from "SunGraph/utils/id";
import * as dagre from "dagre";
import { Edge } from "SunGraph/models/graph.model";
import {
  calculateEdgePath,
  NodeShape,
} from "SunGraph/utils/edgeAnchorPoint";

export enum Orientation {
  LEFT_TO_RIGHT = "LR",
  RIGHT_TO_LEFT = "RL",
  TOP_TO_BOTTOM = "TB",
  BOTTOM_TO_TOM = "BT",
}
export enum Alignment {
  CENTER = "C",
  UP_LEFT = "UL",
  UP_RIGHT = "UR",
  DOWN_LEFT = "DL",
  DOWN_RIGHT = "DR",
}

export interface DagreSettings {
  orientation?: Orientation;
  marginX?: number;
  marginY?: number;
  edgePadding?: number;
  rankPadding?: number;
  nodePadding?: number;
  align?: Alignment;
  acyclicer?: "greedy" | undefined;
  ranker?: "network-simplex" | "tight-tree" | "longest-path";
  multigraph?: boolean;
  compound?: boolean;
  useDagreEdgePoints?: boolean;
  nodeShape?: NodeShape;
  isHTMLTemplate?: boolean;
}

export class CustomLayout implements Layout {
  defaultSettings: DagreSettings = {
    orientation: Orientation.LEFT_TO_RIGHT,
    marginX: 20,
    marginY: 20,
    edgePadding: 200,
    rankPadding: 300,
    nodePadding: 100,
    multigraph: true,
    compound: true,
    useDagreEdgePoints: true,
    nodeShape: "rectangle",
    isHTMLTemplate: true,
  };
  settings: DagreSettings = {};

  dagreGraph: any;
  dagreNodes: any;
  dagreEdges: any;

  run(graph: Graph): Graph {
    this.createDagreGraph(graph);
    dagre.layout(this.dagreGraph);

    graph.edgeLabels = this.dagreGraph._edgeLabels;

    for (const dagreNodeId in this.dagreGraph._nodes) {
      const dagreNode = this.dagreGraph._nodes[dagreNodeId];
      const node = graph.nodes.find((n) => n.id === dagreNode.id);
      node.position = {
        x: dagreNode.x,
        y: dagreNode.y,
      };
      node.width = dagreNode.width;
      node.height = dagreNode.height;
    }

    for (const edge of graph.edges) {
      this.updateEdge(graph, edge);
    }

    return graph;
  }

  public updateEdge(graph: Graph, edge: Edge): Graph {
    const sourceNode = graph.nodes.find((n) => n.id === edge.source);
    const targetNode: Node = graph.nodes.find((n) => n.id === edge.target);
    
    if (!sourceNode || !targetNode) {
      return graph;
    }

    const settings = Object.assign({}, this.defaultSettings, this.settings);
    const nodeShape = settings.nodeShape || "rectangle";
    
    // Try to get Dagre's computed edge points
    let dagrePoints: any[] | undefined;
    
    if (settings.useDagreEdgePoints && this.dagreGraph) {
      // Dagre stores edge labels with composite key: source + target + edge.id
      const edgeKey = `${edge.source}\x01${edge.target}\x01${edge.id}`;
      let dagreEdge = this.dagreGraph._edgeLabels[edgeKey];
      
      // If not found, try without the edge.id
      if (!dagreEdge) {
        const simpleKey = `${edge.source}\x01${edge.target}`;
        dagreEdge = this.dagreGraph._edgeLabels[simpleKey];
      }
      
      if (dagreEdge && dagreEdge.points && dagreEdge.points.length > 0) {
        dagrePoints = dagreEdge.points;
      }
    }
    
    // Calculate edge path with proper anchor points
    edge.points = calculateEdgePath(
      sourceNode,
      targetNode,
      dagrePoints,
      nodeShape,
      nodeShape,
      settings.isHTMLTemplate ?? true
    );
    
    return graph;
  }

  createDagreGraph(graph: Graph): any {
    const settings = Object.assign({}, this.defaultSettings, this.settings);
    this.dagreGraph = new dagre.graphlib.Graph({
      compound: settings.compound,
      multigraph: settings.multigraph,
    });

    this.dagreGraph.setGraph({
      rankdir: settings.orientation,
      marginx: settings.marginX,
      marginy: settings.marginY,
      edgesep: settings.edgePadding,
      ranksep: settings.rankPadding,
      nodesep: settings.nodePadding,
      align: settings.align,
      acyclicer: settings.acyclicer,
      ranker: settings.ranker,
      multigraph: settings.multigraph,
      compound: settings.compound,
    });

    // Default to assigning a new object as a label for each new edge.
    this.dagreGraph.setDefaultEdgeLabel(() => {
      return {
        /* empty */
      };
    });

    this.dagreNodes = graph.nodes.map((n) => {
      const node: any = Object.assign({}, n);
      node.width = n.width;
      node.height = n.height;
      node.x = n.position.x;
      node.y = n.position.y;
      return node;
    });

    this.dagreEdges = graph.edges.map((l) => {
      const newLink: any = Object.assign({}, l);
      if (!newLink.id) {
        newLink.id = id();
      }
      return newLink;
    });

    for (const node of this.dagreNodes) {
      if (!node.width) {
        node.width = 20;
      }
      if (!node.height) {
        node.height = 30;
      }

      // update dagre
      this.dagreGraph.setNode(node.id, node);
    }

    // update dagre
    for (const edge of this.dagreEdges) {
      if (settings.multigraph) {
        this.dagreGraph.setEdge(edge.source, edge.target, edge, edge.id);
      } else {
        this.dagreGraph.setEdge(edge.source, edge.target);
      }
    }

    return this.dagreGraph;
  }
}
