/// <reference types="react" />
export declare enum PanningAxis {
    Both = "both",
    Horizontal = "horizontal",
    Vertical = "vertical"
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
export interface Node {
    id: string;
    template?: (node: Node) => React.ReactNode;
    width?: number;
    height?: number;
    label?: string;
    transform?: string;
    data?: any;
    position?: NodePosition;
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
}
