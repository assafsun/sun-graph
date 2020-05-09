import React from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import { SunGraph, LineShape } from "SunGraph/SunGraph";
import { CustomLayout } from "./layouts/customLayout";

import styled from "styled-components";

const Container = styled.div`
  height: 96px;
  width: 96px;
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  align-items: center;
  border-radius: 25px;
`;

const Title = styled.label`
  margin-top: 10px;
`;

const NodeFirstOption = styled.div`
  height: 50px;
  width: 50px;
  display: flex;
  flex-direction: column;
  background-color: #548d96;
`;

const NodeSecondOption = styled.div`
  height: 75px;
  width: 75px;
  display: flex;
  flex-direction: column;
  background-color: #7aafb1;
`;

export class AdvancedGraphComponent extends React.Component {
  public nodes: Node[] = [];
  public links: Edge[] = [];
  public curve: any = LineShape.BundleLine;

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
        width: 50,
        height: 50,
        template: (node) => this.singleNodeUIOption1(node),
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
        width: 75,
        height: 75,
        template: (node) => this.singleNodeUIOption2(node),
      },
      {
        id: "6",
        label: "Node 6",
        data: {
          sourceNode: "5",
        },
        width: 100,
        height: 100,
      },
      {
        id: "7",
        label: "Node 7",
        data: {
          sourceNode: "5",
        },
        width: 100,
        height: 100,
      },
      {
        id: "8",
        label: "Node 8",
        data: {
          sourceNode: "5",
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
        midPointTemplate: (link: Edge) => {
          return (
            <text x="0" y="0" fill="blue">
              Edge
            </text>
          );
        },
      };

      this.links.push(edge);
    }

    this.state = {};
  }

  public defaultNodeUI(node: Node) {
    return (
      <Container>
        <Title>{node.label}</Title>
      </Container>
    );
  }

  public singleNodeUIOption1(node: Node) {
    return <NodeFirstOption></NodeFirstOption>;
  }

  public singleNodeUIOption2(node: Node) {
    return <NodeSecondOption></NodeSecondOption>;
  }

  render() {
    return (
      <SunGraph
        nodes={this.nodes}
        links={this.links}
        curve={this.curve}
        layout={new CustomLayout()}
        panningEnabled={true}
        enableZoom={true}
        draggingEnabled={true}
        autoCenter={true}
        defaultNodeTemplate={(node) => this.defaultNodeUI(node)}
        clickHandler={() => alert("Graph was clicked")}
      ></SunGraph>
    );
  }
}
