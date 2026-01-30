/**
 * Flowchart Example
 * 
 * Demonstrates a process flowchart with:
 * - Start and end nodes
 * - Decision points (diamonds)
 * - Process steps (rectangles)
 * - Clear flow direction
 * 
 * Features:
 * - Different node shapes for different types
 * - Color-coded by node type
 * - Process flow visualization
 */

import React from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import { SunGraph } from "SunGraph/SunGraph";
import { CustomDagreLayout } from "SunGraph/layouts/customDagreLayout";
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

const StartEndNode = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border-radius: 50px;
  color: white;
  font-weight: 700;
  font-size: 12px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
`;

const ProcessNode = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  border-radius: 4px;
  color: white;
  font-weight: 600;
  font-size: 12px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
  padding: 8px;
  text-align: center;
`;

const DecisionNode = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  color: white;
  font-weight: 600;
  font-size: 11px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
  clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
  text-align: center;
  padding: 8px;
`;

const EndNode = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  border-radius: 50px;
  color: white;
  font-weight: 700;
  font-size: 12px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
`;

export class FlowchartGraph extends React.Component {
  public nodes: Node[] = [];
  public links: Edge[] = [];

  constructor(props: any) {
    super(props);
    this.initializeFlowchart();
  }

  private initializeFlowchart(): void {
    // Create flowchart nodes
    this.nodes = [
      // Start
      {
        id: "start",
        label: "Start",
        width: 100,
        height: 100,
        data: { type: "start" },
        template: (node) => <StartEndNode>{node.label}</StartEndNode>,
      },

      // First process
      {
        id: "process-1",
        label: "Receive Request",
        width: 120,
        height: 80,
        data: { type: "process" },
        template: (node) => <ProcessNode>{node.label}</ProcessNode>,
      },

      // First decision
      {
        id: "decision-1",
        label: "Valid Request?",
        width: 100,
        height: 100,
        data: { type: "decision" },
        template: (node) => <DecisionNode>{node.label}</DecisionNode>,
      },

      // Path 1: Invalid
      {
        id: "process-2",
        label: "Return Error",
        width: 120,
        height: 80,
        data: { type: "process" },
        template: (node) => <ProcessNode>{node.label}</ProcessNode>,
      },

      // Path 2: Valid - Process
      {
        id: "process-3",
        label: "Process Data",
        width: 120,
        height: 80,
        data: { type: "process" },
        template: (node) => <ProcessNode>{node.label}</ProcessNode>,
      },

      // Second decision
      {
        id: "decision-2",
        label: "Success?",
        width: 100,
        height: 100,
        data: { type: "decision" },
        template: (node) => <DecisionNode>{node.label}</DecisionNode>,
      },

      // Path 1: Failed
      {
        id: "process-4",
        label: "Retry",
        width: 120,
        height: 80,
        data: { type: "process" },
        template: (node) => <ProcessNode>{node.label}</ProcessNode>,
      },

      // Path 2: Success
      {
        id: "process-5",
        label: "Save Results",
        width: 120,
        height: 80,
        data: { type: "process" },
        template: (node) => <ProcessNode>{node.label}</ProcessNode>,
      },

      // Merge point
      {
        id: "process-6",
        label: "Send Response",
        width: 120,
        height: 80,
        data: { type: "process" },
        template: (node) => <ProcessNode>{node.label}</ProcessNode>,
      },

      // End
      {
        id: "end",
        label: "End",
        width: 100,
        height: 100,
        data: { type: "end" },
        template: (node) => <EndNode>{node.label}</EndNode>,
      },
    ];

    // Create flowchart connections
    this.links = [
      { source: "start", target: "process-1", label: "" },
      { source: "process-1", target: "decision-1", label: "" },

      // Invalid path
      { source: "decision-1", target: "process-2", label: "No" },
      { source: "process-2", target: "process-6", label: "" },

      // Valid path
      { source: "decision-1", target: "process-3", label: "Yes" },
      { source: "process-3", target: "decision-2", label: "" },

      // Failed path
      { source: "decision-2", target: "process-4", label: "No" },
      { source: "process-4", target: "decision-2", label: "" },

      // Success path
      { source: "decision-2", target: "process-5", label: "Yes" },
      { source: "process-5", target: "process-6", label: "" },

      // End
      { source: "process-6", target: "end", label: "" },
    ];
  }

  render() {
    const description = (
      <>
        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 12 }}>
          Overview
        </Typography>
        <Typography paragraph>
          A process flow diagram with decision points and conditional paths.
        </Typography>

        <Typography variant="h6" style={{ fontWeight: 600, marginTop: 16, marginBottom: 8 }}>
          Features Demonstrated
        </Typography>
        <FeaturesList>
          <li><strong>Directional Flow</strong> - Left-to-right process steps</li>
          <li><strong>Decision Nodes</strong> - Diamond shapes for conditional logic</li>
          <li><strong>Process Nodes</strong> - Standard steps in the workflow</li>
          <li><strong>Path Labeling</strong> - "Yes/No" labels on decision branches</li>
        </FeaturesList>

        <Box style={{ marginTop: 16 }}>
          <Link
            href="https://github.com/assafsun/sun-graph/blob/master/src/portal/FlowchartGraph.tsx"
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
        title="🔀 Flowchart"
        description={description}
      >
        <SunGraph
          nodes={this.nodes}
          links={this.links}
          layout={new CustomDagreLayout()}
          panningEnabled={true}
          enableZoom={true}
          draggingEnabled={true}
          autoCenter={true}
          autoZoom={true}
          requireModifierToZoom={true}
        />
      </ExampleLayout>
    );
  }
}
