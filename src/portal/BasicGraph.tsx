/**
 * BasicGraph Component
 * 
 * This example demonstrates the most basic usage of SunGraph:
 * - Creating simple nodes with labels
 * - Connecting nodes with edges
 * - Using default node styling
 * - Enabling basic interactions (zoom, pan, drag)
 * 
 * Perfect for: Learning the fundamentals, simple flowcharts, org charts
 */

import React from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import * as shape from "d3-shape";
import { SunGraph } from "SunGraph/SunGraph";
import { Button, Typography, Link, Chip, Box } from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import styled from "styled-components";
import { ExampleLayout } from "./layouts/ExampleLayout";

/**
 * Container for the default node template
 * Creates a simple bordered box with a label
 */
const Container = styled.div`
  height: 96px;
  width: 96px;
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  background: white;
`;

const Title = styled.label`
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
`;

interface State {
  nodes: Node[];         // Array of nodes in the graph
  links?: Edge[];        // Array of edges connecting nodes
  autoCenter?: boolean;  // Whether to auto-center the graph
}

/**
 * BasicGraphComponent
 * 
 * Demonstrates simple graph creation with:
 * 1. Parent-child node relationships
 * 2. Automatic edge generation
 * 3. Custom node templates
 * 4. Dynamic graph updates
 */
export class BasicGraphComponent extends React.Component<{}, State> {
  // Use linear curves for clean, simple edge lines
  public curve: any = shape.curveLinear;

  constructor(props: any) {
    super(props);
    
    // Initialize with a simple 3-node tree structure
    const nodes = this.createBasicNodes();
    const links = this.generateEdgesFromNodes(nodes);

    this.state = { 
      nodes, 
      links, 
      autoCenter: true 
    };
  }

  /**
   * Creates the initial set of nodes
   * Each node except the root has a 'sourceNode' in its data
   * property, which is used to create edges
   */
  private createBasicNodes(): Node[] {
    return [
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
          sourceNode: "1", // This node connects from Node 1
        },
        width: 100,
        height: 100,
      },
      {
        id: "3",
        label: "Node 3",
        data: {
          sourceNode: "1", // This node also connects from Node 1
        },
        width: 100,
        height: 100,
      },
    ];
  }

  /**
   * Generates edges automatically based on node relationships
   * Looks for 'sourceNode' in each node's data object
   * 
   * @param nodes The array of nodes to generate edges from
   * @returns Array of edges connecting the nodes
   */
  private generateEdgesFromNodes(nodes: Node[]): Edge[] {
    return nodes
      .filter(node => node.data?.sourceNode)
      .map(node => ({
        source: node.data.sourceNode,
        target: node.id,
      }));
  }

  /**
   * Default node UI template
   * This is used for nodes that don't have a custom template
   * 
   * @param node The node to render
   * @returns React component for the node
   */
  public basicNodeUI(node: Node): React.ReactNode {
    return (
      <Container>
        <Title>{node.label}</Title>
      </Container>
    );
  }

  /**
   * Creates a larger, more complex graph
   * Demonstrates how to update the graph with new data
   * Can be triggered by a button click
   */
  public createNewGraph(): void {
    // Create an expanded graph with 5 nodes and multiple connections
    const nodes: Node[] = [
      {
        id: "1",
        label: "Root",
        width: 100,
        height: 100,
      },
      {
        id: "2",
        label: "Child 1",
        data: { sourceNode: "1" },
        width: 100,
        height: 100,
      },
      {
        id: "3",
        label: "Child 2",
        data: { sourceNode: "1" },
        width: 100,
        height: 100,
      },
      {
        id: "4",
        label: "Child 3",
        data: { sourceNode: "1" },
        width: 100,
        height: 100,
      },
      {
        id: "5",
        label: "Grandchild",
        data: { sourceNode: "4" },
        width: 100,
        height: 100,
      },
    ];

    // Generate edges automatically
    const links = this.generateEdgesFromNodes(nodes);

    // Optional: Add custom label template to the first edge
    if (links.length > 0) {
      links[0].midPointTemplate = (link: Edge) => (
        <text x="0" y="0" fill="blue" style={{ fontSize: "12px" }}>
          connects
        </text>
      );
    }

    // Update state and trigger auto-center for the new graph
    this.setState({ 
      nodes, 
      links, 
      autoCenter: true 
    });
  }

  render() {
    const description = (
      <>
        <Typography paragraph>
          This example demonstrates the fundamental features of SunGraph with custom node
          templates and basic interactivity.
        </Typography>
        
        <Typography variant="h6" style={{ fontWeight: 600, marginTop: 16, marginBottom: 8 }}>
          Features Demonstrated
        </Typography>
        <ul style={{ paddingLeft: 20, marginTop: 0 }}>
          <li><strong>Custom Node Templates</strong> - Styled containers with labels</li>
          <li><strong>Parent-Child Relationships</strong> - Automatic edge generation</li>
          <li><strong>Graph Updates</strong> - Dynamic graph modification with button clicks</li>
          <li><strong>Zoom & Pan</strong> - Interactive canvas navigation</li>
          <li><strong>Node Dragging</strong> - Reposition nodes freely</li>
        </ul>

        <Typography variant="body2" color="textSecondary" style={{ marginTop: 12, fontStyle: 'italic' }}>
          💡 Try zooming with your mouse wheel (use Ctrl+Scroll), dragging the canvas, or moving nodes.
        </Typography>

        <Box style={{ marginTop: 16 }}>
          <Link
            href="https://github.com/assafsun/sun-graph/blob/master/src/portal/BasicGraph.tsx"
            target="_blank"
            style={{ textDecoration: 'none' }}
          >
            <Chip
              icon={<GitHubIcon />}
              label="View Source Code"
              variant="outlined"
              size="small"
              color="primary"
            />
          </Link>
        </Box>
      </>
    );

    const actions = (
      <Button
        variant="contained"
        color="primary"
        onClick={() => this.createNewGraph()}
        size="small"
      >
        Update Graph
      </Button>
    );

    return (
      <ExampleLayout
        title="🎯 Basic Graph"
        description={description}
        actions={actions}
      >
        <SunGraph
          nodes={this.state.nodes}
          links={this.state.links}
          panningEnabled={true}
          enableZoom={true}
          draggingEnabled={true}
          autoCenter={this.state.autoCenter}
          autoZoom={true} // FIT TO WINDOW
          requireModifierToZoom={true} // FIX SCROLL
          defaultNodeTemplate={(node) => this.basicNodeUI(node)}
        />
      </ExampleLayout>
    );
  }
}
