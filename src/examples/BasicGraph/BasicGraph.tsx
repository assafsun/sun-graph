import React from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import * as shape from "d3-shape";
import { SunGraph } from "SunGraph/SunGraph";
import { DagreLayout } from "SunGraph/layouts/dagre";

import "./BasicGraph.scss";
import Logo from "./logo.jpg";

export class BasicGraphComponent extends React.Component {
  public nodes: Node[] = [];
  public defTemplateUI: any;
  public links: Edge[] = [];
  public curve: any = shape.curveLinear;

  constructor(props: any) {
    super(props);
    this.nodes = [
      {
        id: "1",
        label: "Node 1",
        width: 100,
        height: 100,
        layout: (node: Node) => this.nodeUI(node),
      },
      {
        id: "2",
        label: "Node 2",
        data: {
          sourceNode: "1",
        },
        width: 100,
        height: 100,
        layout: (node: Node) => this.nodeUI(node),
      },
      {
        id: "3",
        label: "Node 3",
        data: {
          sourceNode: "1",
        },
        width: 100,
        height: 100,
        layout: (node) => this.nodeUI(node),
      },
      {
        id: "4",
        label: "Node 4",
        data: {
          sourceNode: "1",
        },
        width: 100,
        height: 100,
        layout: (node) => this.nodeUI(node),
      },
      {
        id: "5",
        label: "Node 5",
        data: {
          sourceNode: "4",
        },
        width: 100,
        height: 100,
        layout: (node) => this.nodeUI(node),
      },
    ];

    for (const node of this.nodes) {
      if (!node.data) {
        continue;
      }

      const edge: Edge = {
        source: node.data.sourceNode,
        target: node.id,
        label: "",
      };

      this.links.push(edge);
    }

    this.defTemplateUI = (
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
    );

    this.state = {};
  }

  public nodeUI(node: Node) {
    return (
      <div className="container">
        <label className="title">{node.label}</label>
        <img src={Logo} alt="logo" height="60" width="60"></img>
      </div>
    );
  }

  render() {
    return (
      <SunGraph
        view={[1500, 1500]}
        nodes={this.nodes}
        links={this.links}
        defsTemplate={() => this.defTemplateUI}
        layout={new DagreLayout()}
        curve={shape.curveLinear}
        panningEnabled={true}
        enableZoom={true}
        zoomSpeed={0.1}
        enableTrackpadSupport={true}
      ></SunGraph>
    );
  }
}
