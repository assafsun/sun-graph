import React from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import * as shape from "d3-shape";
import { SunGraph } from "SunGraph/SunGraph";

import "./BasicGraph.scss";

export class BasicGraphComponent extends React.Component {
  public nodes: Node[] = [];
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
      },
      {
        id: "2",
        label: "Node 2",
        data: {
          sourceNode: "1",
        },
        width: 100,
        height: 100,
      },
      {
        id: "3",
        label: "Node 3",
        data: {
          sourceNode: "1",
        },
        width: 100,
        height: 100,
      },
      {
        id: "4",
        label: "Node 4",
        data: {
          sourceNode: "1",
        },
        width: 100,
        height: 100,
      },
      {
        id: "5",
        label: "Node 5",
        data: {
          sourceNode: "4",
        },
        width: 100,
        height: 100,
      },
    ];

    for (const node of this.nodes) {
      if (!node.data) {
        continue;
      }

      const edge: Edge = {
        source: node.data.sourceNode,
        target: node.id,
      };

      this.links.push(edge);
    }

    this.state = {};
  }

  public basicNodeUI(node: Node) {
    return (
      <div className="container">
        <label className="title">{node.label}</label>
      </div>
    );
  }

  render() {
    return (
      <SunGraph
        nodes={this.nodes}
        links={this.links}
        panningEnabled={true}
        enableZoom={true}
        draggingEnabled={true}
        autoCenter={true}
        defaultNodeTemplate={(node) => this.basicNodeUI(node)}
      ></SunGraph>
    );
  }
}
