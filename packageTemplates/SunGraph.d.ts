import React from "react";
import { Observable } from "rxjs";
import { Layout } from "SunGraph/models/layout.model";
import { Node, Edge, PanningAxis } from "SunGraph/models/graph.model";
import "./SunGraph.scss";
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
    update$?: Observable<any>;
    center$?: Observable<any>;
    zoomToFit$?: Observable<any>;
    panToNode$?: Observable<any>;
    enableTrackpadSupport?: boolean;
    autoZoom?: boolean;
    zoomChange?: (value: number) => void;
    clickHandler?: (value: MouseEvent) => void;
    defsTemplate?: () => any;
    panOnZoom?: boolean;
    panningAxis?: PanningAxis;
}
interface BasicState {
    initialized: boolean;
    graphWidth: number;
    graphHeight: number;
}
export declare class SunGraph extends React.Component<Props, BasicState> {
    constructor(props: Props);
    render(): React.ReactNode;
    componentDidMount(): void;
}
export {};
