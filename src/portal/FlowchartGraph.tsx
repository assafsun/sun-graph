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
    return (
      <SunGraph
        nodes={this.nodes}
        links={this.links}
        layout={new CustomDagreLayout()}
        panningEnabled={true}
        enableZoom={true}
        draggingEnabled={true}
        autoCenter={true}
      />
    );
  }
}
