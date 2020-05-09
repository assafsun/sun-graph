import React from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import * as shape from "d3-shape";
import { SunGraph } from "SunGraph/SunGraph";
import { Button } from "@material-ui/core";

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

interface State {
  nodes: Node[];
  links?: Edge[];
  autoCenter?: boolean;
}

export class BasicGraphComponent extends React.Component<{}, State> {
  public curve: any = shape.curveLinear;

  constructor(props: any) {
    super(props);
    let nodes = [
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
    ];

    let links = [];
    for (const node of nodes) {
      if (!node.data) {
        continue;
      }

      const edge: Edge = {
        source: node.data.sourceNode,
        target: node.id,
      };

      links.push(edge);
    }

    this.state = { nodes: nodes, links: links, autoCenter: false };
  }

  public basicNodeUI(node: Node) {
    return (
      <Container>
        <Title>{node.label}</Title>
      </Container>
    );
  }

  public createNewGraph(): void {
    let nodes = [
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

    let links = [];
    for (const node of nodes) {
      if (!node.data) {
        continue;
      }

      const edge: Edge = {
        source: node.data.sourceNode,
        target: node.id,
      };

      links.push(edge);
    }

    links[0].midPointTemplate = (link: Edge) => {
      return (
        <text x="0" y="0" fill="blue">
          Edge
        </text>
      );
    };
    this.setState({ nodes: nodes, links: links, autoCenter: true });
  }

  render() {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.createNewGraph()}
          style={{ marginLeft: 12, marginTop: 12 }}
        >
          Update Graph
        </Button>
        <SunGraph
          nodes={this.state.nodes}
          links={this.state.links}
          panningEnabled={true}
          enableZoom={true}
          draggingEnabled={true}
          autoCenter={this.state.autoCenter}
          defaultNodeTemplate={(node) => this.basicNodeUI(node)}
        ></SunGraph>
      </>
    );
  }
}
