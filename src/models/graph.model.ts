export interface Graph {
  edges: Edge[];
  nodes: Node[];
  edgeLabels?: any;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeDimension {
  width: number;
  height: number;
}

export interface Node {
  id: string;
  position?: NodePosition;
  dimension?: NodeDimension;
  transform?: string;
  label?: string;
  data?: any;
  meta?: any;
  layout?: (node: Node) => any;
}

export interface ClusterNode extends Node {
  childNodeIds?: string[];
}

export interface Edge {
  id?: string;
  source: string;
  target: string;
  label?: string;
  data?: any;
  points?: any;
  line?: string;
  textTransform?: string;
  textAngle?: number;
  oldLine?: any;
  oldTextPath?: string;
  textPath?: string;
  midPoint?: NodePosition;
}