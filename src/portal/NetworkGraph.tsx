/**
 * Network Graph Example
 * 
 * Demonstrates a network/social graph with:
 * - Multiple interconnected nodes
 * - Different node types (hubs vs regular nodes)
 * - Bidirectional and unidirectional connections
 * 
 * Features:
 * - Hub nodes highlighted differently
 * - Connection strength visualization
 * - Network analysis pattern
 */

import React from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import { SunGraph, LineShape } from "SunGraph/SunGraph";
import styled from "styled-components";

const HubNode = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  color: white;
  font-weight: 700;
  font-size: 13px;
  border: 3px solid #fff;
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
`;

const RegularNode = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 12px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
`;

export class NetworkGraph extends React.Component {
  public nodes: Node[] = [];
  public links: Edge[] = [];

  constructor(props: any) {
    super(props);
    this.initializeNetwork();
  }

  private initializeNetwork(): void {
    // Create network nodes - mix of hubs and regular nodes
    this.nodes = [
      // Hub nodes
      {
        id: "hub-1",
        label: "Alice",
        width: 90,
        height: 90,
        data: { type: "hub", connections: 5 },
        template: (node) => <HubNode>{node.label}</HubNode>,
      },
      {
        id: "hub-2",
        label: "Bob",
        width: 90,
        height: 90,
        data: { type: "hub", connections: 4 },
        template: (node) => <HubNode>{node.label}</HubNode>,
      },

      // Regular network nodes
      {
        id: "user-1",
        label: "Carol",
        width: 80,
        height: 80,
        data: { type: "user" },
        template: (node) => <RegularNode>{node.label}</RegularNode>,
      },
      {
        id: "user-2",
        label: "David",
        width: 80,
        height: 80,
        data: { type: "user" },
        template: (node) => <RegularNode>{node.label}</RegularNode>,
      },
      {
        id: "user-3",
        label: "Eva",
        width: 80,
        height: 80,
        data: { type: "user" },
        template: (node) => <RegularNode>{node.label}</RegularNode>,
      },
      {
        id: "user-4",
        label: "Frank",
        width: 80,
        height: 80,
        data: { type: "user" },
        template: (node) => <RegularNode>{node.label}</RegularNode>,
      },
      {
        id: "user-5",
        label: "Grace",
        width: 80,
        height: 80,
        data: { type: "user" },
        template: (node) => <RegularNode>{node.label}</RegularNode>,
      },
      {
        id: "user-6",
        label: "Henry",
        width: 80,
        height: 80,
        data: { type: "user" },
        template: (node) => <RegularNode>{node.label}</RegularNode>,
      },
      {
        id: "user-7",
        label: "Iris",
        width: 80,
        height: 80,
        data: { type: "user" },
        template: (node) => <RegularNode>{node.label}</RegularNode>,
      },
    ];

    // Create network connections
    this.links = [
      // Hub 1 connections
      { source: "hub-1", target: "user-1", label: "knows" },
      { source: "hub-1", target: "user-2", label: "knows" },
      { source: "hub-1", target: "hub-2", label: "collaborates" },
      { source: "hub-1", target: "user-3", label: "knows" },
      { source: "hub-1", target: "user-4", label: "knows" },

      // Hub 2 connections
      { source: "hub-2", target: "user-5", label: "knows" },
      { source: "hub-2", target: "user-6", label: "knows" },
      { source: "hub-2", target: "user-7", label: "knows" },
      { source: "hub-2", target: "user-3", label: "knows" },

      // Cross connections between regular users
      { source: "user-1", target: "user-2", label: "friends" },
      { source: "user-5", target: "user-6", label: "friends" },
      { source: "user-2", target: "user-4", label: "friends" },
    ];
  }

  render() {
    return (
      <SunGraph
        nodes={this.nodes}
        links={this.links}
        curve={LineShape.CurveCardinal}
        panningEnabled={true}
        enableZoom={true}
        draggingEnabled={true}
        autoCenter={true}
      />
    );
  }
}
