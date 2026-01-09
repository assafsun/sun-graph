export enum PanningAxis {
  Both = "both",
  Horizontal = "horizontal",
  Vertical = "vertical",
}

export interface Graph {
  edges: Edge[];
  nodes: Node[];
  edgeLabels?: any;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  [key: string]: any;
}

export interface EdgeStyle {
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  [key: string]: any;
}

export interface Node {
  id: string;
  template?: (node: Node) => React.ReactNode;
  width?: number;
  height?: number;
  label?: string;
  transform?: string;
  data?: any;
  position?: NodePosition;
  style?: NodeStyle;
  isSelected?: boolean;
  isFiltered?: boolean;
}

export interface Edge {
  id?: string;
  source: string;
  target: string;
  label?: string;
  data?: any;
  points?: any;
  line?: string;
  midPoint?: NodePosition;
  midPointTemplate?: (link: Edge) => React.ReactNode;
  style?: EdgeStyle;
  isFiltered?: boolean;
}

export interface GraphEventCallbacks {
  onNodeClick?: (node: Node, event: MouseEvent) => void;
  onNodeHover?: (node: Node | null, event: MouseEvent) => void;
  onNodeDoubleClick?: (node: Node, event: MouseEvent) => void;
  onEdgeClick?: (edge: Edge, event: MouseEvent) => void;
  onEdgeHover?: (edge: Edge | null, event: MouseEvent) => void;
  onGraphClick?: (event: MouseEvent) => void;
}
