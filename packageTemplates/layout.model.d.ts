import { Graph } from "./graph.model";
import { Edge } from "./graph.model";
import { Node } from "./graph.model";
export interface Layout {
    settings?: any;
    run(graph: Graph): Graph;
    updateEdge(graph: Graph, edge: Edge): Graph;
    onDragStart?(draggingNode: Node, $event: MouseEvent): void;
    onDrag?(draggingNode: Node, $event: MouseEvent): void;
    onDragEnd?(draggingNode: Node, $event: MouseEvent): void;
}
