import React from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import { SunGraph } from "SunGraph/SunGraph";

export class DefaultGraph extends React.Component {
  public nodes: Node[] = [];
  public links: Edge[] = [];

  constructor(props: any) {
    super(props);
    this.nodes = [
      {
        id: "1",
      },
      {
        id: "2",
      },
      {
        id: "3",
      },
      {
        id: "4",
      },
      {
        id: "5",
      },
    ];

    this.links = [
      {
        source: "1",
        target: "2",
      },
      {
        source: "1",
        target: "3",
      },
      {
        source: "1",
        target: "4",
      },
      {
        source: "4",
        target: "5",
      },
    ];

    this.state = {};
  }

  render() {
    return <SunGraph nodes={this.nodes} links={this.links}></SunGraph>;
  }
}
