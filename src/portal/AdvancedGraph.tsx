/**
 * AdvancedGraph Component
 * 
 * This example demonstrates advanced SunGraph features:
 * - Multiple custom node templates with different sizes/styles
 * - Custom layout algorithm (CustomLayout)
 * - Bundled line styling for complex relationships
 * - Edge labels with custom templates
 * - Mixed node styles in the same graph
 * 
 * Perfect for: Complex system diagrams, network visualization, mixed styling
 */

import React from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import { SunGraph, LineShape } from "SunGraph/SunGraph";
import { CustomLayout } from "./layouts/customLayout";
import styled from "styled-components";
import { Typography, Link, Box, Chip } from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import { ExampleLayout } from "./layouts/ExampleLayout";

const FeaturesList = styled.ul`
  margin: 12px 0;
  padding-left: 20px;
  
  li {
    margin: 8px 0;
    color: #666;
  }
`;

/**
 * Default node container - simple bordered box
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
`;

/**
 * First custom node style - small teal box
 * Used for specialized/small nodes in the graph
 */
const NodeFirstOption = styled.div`
  height: 50px;
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #548d96;
  border-radius: 8px;
  border: 2px solid #2c4850;
  color: white;
  font-weight: bold;
  font-size: 12px;
`;

/**
 * Second custom node style - medium light teal box
 * Used for intermediate nodes
 */
const NodeSecondOption = styled.div`
  height: 75px;
  width: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #7aafb1;
  border-radius: 10px;
  border: 2px solid #5a8f91;
  color: white;
  font-weight: bold;
  font-size: 13px;
`;

/**
 * AdvancedGraphComponent
 * 
 * Demonstrates:
 * 1. Multiple node template types in a single graph
 * 2. Custom layout algorithms
 * 3. Different node dimensions
 * 4. Edge labels with custom rendering
 * 5. Bundled line curves for complex relationships
 */
export class AdvancedGraphComponent extends React.Component {
  // Array of all nodes in the graph
  public nodes: Node[] = [];
  
  // Array of all edges connecting nodes
  public links: Edge[] = [];
  
  // Use bundled line curves for a more organic look
  // Good for visualizing complex interconnections
  public curve: any = LineShape.BundleLine;

  constructor(props: any) {
    super(props);
    
    // Initialize the graph structure
    this.initializeGraph();
  }

  /**
   * Creates all nodes and edges for the graph
   * Demonstrates different node styles and sizes
   */
  private initializeGraph(): void {
    // Define nodes with varying sizes and templates
    this.nodes = [
      // Root node - standard size
      {
        id: "1",
        label: "Root",
        width: 100,
        height: 100,
      },
      // Intermediate nodes
      {
        id: "2",
        label: "Branch A",
        data: { sourceNode: "1" },
        width: 100,
        height: 100,
      },
      // Custom styled small node
      {
        id: "3",
        label: "Sub 1",
        data: { sourceNode: "1" },
        width: 50,
        height: 50,
        template: (node) => this.renderSmallNode(node),
      },
      // Another standard node
      {
        id: "4",
        label: "Branch B",
        data: { sourceNode: "1" },
        width: 100,
        height: 100,
      },
      // Custom styled medium node
      {
        id: "5",
        label: "Hub",
        data: { sourceNode: "4" },
        width: 75,
        height: 75,
        template: (node) => this.renderMediumNode(node),
      },
      // Leaf nodes connected to the hub
      {
        id: "6",
        label: "Leaf 1",
        data: { sourceNode: "5" },
        width: 100,
        height: 100,
      },
      {
        id: "7",
        label: "Leaf 2",
        data: { sourceNode: "5" },
        width: 100,
        height: 100,
      },
      {
        id: "8",
        label: "Leaf 3",
        data: { sourceNode: "5" },
        width: 100,
        height: 100,
      },
    ];

    // Generate edges from node relationships
    // Each node with a 'sourceNode' in its data creates an edge from that source
    for (const node of this.nodes) {
      if (!node.data?.sourceNode) {
        continue;
      }

      const edge: Edge = {
        source: node.data.sourceNode,
        target: node.id,
        // Custom edge label template
        midPointTemplate: (link: Edge) => (
          <text 
            x="0" 
            y="0" 
            fill="blue"
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textAnchor: "middle"
            }}
          >
            connects
          </text>
        ),
      };

      // eslint-disable-next-line react/no-direct-mutation-state
      this.links.push(edge);
    }

    this.state = {};
  }

  /**
   * Default node template - used for nodes without custom template
   * 
   * @param node The node to render
   * @returns React component showing the node
   */
  public defaultNodeUI(node: Node): React.ReactNode {
    return (
      <Container>
        <Title>{node.label}</Title>
      </Container>
    );
  }

  /**
   * Small node template - compact styling
   * Used for specialized or secondary nodes
   * 
   * @param node The node to render
   * @returns React component for small nodes
   */
  private renderSmallNode(node: Node): React.ReactNode {
    return (
      <NodeFirstOption>
        {node.label}
      </NodeFirstOption>
    );
  }

  /**
   * Medium node template - balanced styling
   * Used for hub/central nodes
   * 
   * @param node The node to render
   * @returns React component for medium nodes
   */
  private renderMediumNode(node: Node): React.ReactNode {
    return (
      <NodeSecondOption>
        {node.label}
      </NodeSecondOption>
    );
  }

  render() {
    const description = (
      <>
        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 12 }}>
          Overview
        </Typography>
        <Typography paragraph>
          This example showcases advanced SunGraph capabilities including custom layouts,
          mixed node styles, and bundled edge curves.
        </Typography>
        
        <Typography variant="h6" style={{ fontWeight: 600, marginTop: 16, marginBottom: 8 }}>
          Features Demonstrated
        </Typography>
        <FeaturesList>
          <li><strong>Custom Layout Algorithms</strong> - Custom node positioning</li>
          <li><strong>Multiple Node Styles</strong> - Different templates and sizes</li>
          <li><strong>Bundled Edge Curves</strong> - Smooth, flowing connections</li>
          <li><strong>Edge Labels</strong> - Custom templates on edge midpoints</li>
          <li><strong>Complex Graphs</strong> - 8+ nodes with multiple connections</li>
        </FeaturesList>

        <Typography variant="h6" style={{ fontWeight: 600, marginTop: 16, marginBottom: 8 }}>
          Key Differences from Basic
        </Typography>
        <Typography paragraph>
          This example uses <code>CustomLayout</code> for custom positioning instead of the default
          Dagre layout. Notice how nodes are arranged differently and how the bundled curves create
          a more organic appearance for complex relationships.
        </Typography>

        <Box style={{ marginTop: 16 }}>
          <Link
            href="https://github.com/assafsun/sun-graph/blob/master/src/portal/AdvancedGraph.tsx"
            target="_blank"
            style={{ textDecoration: 'none' }}
          >
            <Chip
              icon={<GitHubIcon />}
              label="View Source Code"
              variant="outlined"
              color="primary"
            />
          </Link>
        </Box>
      </>
    );

    return (
      <ExampleLayout
        title="🚀 Advanced Graph"
        description={description}
      >
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
          clickHandler={() => console.log("Graph interaction detected")}
          autoZoom={true}
          requireModifierToZoom={true}
        />
      </ExampleLayout>
    );
  }
}
