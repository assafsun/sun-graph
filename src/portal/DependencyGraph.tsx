/**
 * Dependency Graph Example
 * 
 * Demonstrates a dependency visualization with:
 * - Service/Module nodes with different types
 * - Dependency relationships
 * - Status indicators
 * 
 * Features:
 * - Color-coded by component type
 * - External vs internal dependencies
 * - Status visualization (running, warning, error)
 */

import React from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import { SunGraph, LineShape } from "SunGraph/SunGraph";
import styled from "styled-components";

const ServiceNode = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 12px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  text-align: center;
`;

const DatabaseNode = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 12px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(240, 147, 251, 0.3);
  text-align: center;
`;

const ExternalNode = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 12px;
  border: 2px dashed #fff;
  box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
  text-align: center;
`;

const StatusIndicator = styled.div`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 4px;
`;

export class DependencyGraph extends React.Component {
  public nodes: Node[] = [];
  public links: Edge[] = [];

  constructor(props: any) {
    super(props);
    this.initializeDependencies();
  }

  private initializeDependencies(): void {
    // Create dependency graph
    this.nodes = [
      // Frontend
      {
        id: "web-app",
        label: "Web App",
        width: 110,
        height: 90,
        data: { type: "service", status: "running" },
        template: (node) => (
          <ServiceNode>
            {node.label}
            <StatusIndicator style={{ background: "#4CAF50" }} />
          </ServiceNode>
        ),
      },

      // API Services
      {
        id: "api-gateway",
        label: "API Gateway",
        width: 110,
        height: 90,
        data: { type: "service", status: "running" },
        template: (node) => (
          <ServiceNode>
            {node.label}
            <StatusIndicator style={{ background: "#4CAF50" }} />
          </ServiceNode>
        ),
      },

      {
        id: "auth-service",
        label: "Auth Service",
        width: 110,
        height: 90,
        data: { type: "service", status: "running" },
        template: (node) => (
          <ServiceNode>
            {node.label}
            <StatusIndicator style={{ background: "#4CAF50" }} />
          </ServiceNode>
        ),
      },

      {
        id: "user-service",
        label: "User Service",
        width: 110,
        height: 90,
        data: { type: "service", status: "running" },
        template: (node) => (
          <ServiceNode>
            {node.label}
            <StatusIndicator style={{ background: "#4CAF50" }} />
          </ServiceNode>
        ),
      },

      {
        id: "product-service",
        label: "Product Service",
        width: 110,
        height: 90,
        data: { type: "service", status: "warning" },
        template: (node) => (
          <ServiceNode>
            {node.label}
            <StatusIndicator style={{ background: "#FFC107" }} />
          </ServiceNode>
        ),
      },

      {
        id: "order-service",
        label: "Order Service",
        width: 110,
        height: 90,
        data: { type: "service", status: "running" },
        template: (node) => (
          <ServiceNode>
            {node.label}
            <StatusIndicator style={{ background: "#4CAF50" }} />
          </ServiceNode>
        ),
      },

      // Databases
      {
        id: "user-db",
        label: "User DB",
        width: 100,
        height: 90,
        data: { type: "database" },
        template: (node) => <DatabaseNode>{node.label}</DatabaseNode>,
      },

      {
        id: "product-db",
        label: "Product DB",
        width: 100,
        height: 90,
        data: { type: "database" },
        template: (node) => <DatabaseNode>{node.label}</DatabaseNode>,
      },

      {
        id: "order-db",
        label: "Order DB",
        width: 100,
        height: 90,
        data: { type: "database" },
        template: (node) => <DatabaseNode>{node.label}</DatabaseNode>,
      },

      // External Services
      {
        id: "stripe-api",
        label: "Stripe API",
        width: 110,
        height: 90,
        data: { type: "external" },
        template: (node) => <ExternalNode>{node.label}</ExternalNode>,
      },

      {
        id: "email-service",
        label: "Email Service",
        width: 110,
        height: 90,
        data: { type: "external" },
        template: (node) => <ExternalNode>{node.label}</ExternalNode>,
      },

      // Cache
      {
        id: "redis-cache",
        label: "Redis Cache",
        width: 110,
        height: 90,
        data: { type: "database" },
        template: (node) => <DatabaseNode>{node.label}</DatabaseNode>,
      },
    ];

    // Create dependency links
    this.links = [
      // Frontend dependencies
      { source: "web-app", target: "api-gateway", label: "calls" },

      // API Gateway routes
      { source: "api-gateway", target: "auth-service", label: "routes" },
      { source: "api-gateway", target: "user-service", label: "routes" },
      { source: "api-gateway", target: "product-service", label: "routes" },
      { source: "api-gateway", target: "order-service", label: "routes" },

      // Service to database
      { source: "auth-service", target: "user-db", label: "queries" },
      { source: "user-service", target: "user-db", label: "queries" },
      { source: "product-service", target: "product-db", label: "queries" },
      { source: "order-service", target: "order-db", label: "queries" },

      // Cache dependencies
      { source: "user-service", target: "redis-cache", label: "caches" },
      { source: "product-service", target: "redis-cache", label: "caches" },

      // Service to service
      { source: "order-service", target: "user-service", label: "depends" },
      { source: "order-service", target: "product-service", label: "depends" },

      // External integrations
      { source: "order-service", target: "stripe-api", label: "integrates" },
      { source: "order-service", target: "email-service", label: "integrates" },
    ];
  }

  render() {
    return (
      <SunGraph
        nodes={this.nodes}
        links={this.links}
        curve={LineShape.LinearLine}
        panningEnabled={true}
        enableZoom={true}
        draggingEnabled={true}
        autoCenter={true}
      />
    );
  }
}
