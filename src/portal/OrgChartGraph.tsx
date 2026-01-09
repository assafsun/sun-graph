/**
 * Organization Chart Example
 * 
 * Demonstrates a typical organizational hierarchy with:
 * - CEO at the top
 * - Department heads and managers
 * - Team members below managers
 * 
 * Features:
 * - Color-coded roles
 * - Custom node templates
 * - Clear hierarchy visualization
 */

import React from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import { SunGraph } from "SunGraph/SunGraph";
import { CustomDagreLayout } from "SunGraph/layouts/customDagreLayout";
import styled from "styled-components";

// Role-based color scheme
const roleColors: { [key: string]: string } = {
  executive: "#667eea",
  manager: "#764ba2",
  engineer: "#f093fb",
  designer: "#4facfe",
};

const NodeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 2px solid #ddd;
  padding: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  color: white;
`;

export class OrgChartGraph extends React.Component {
  public nodes: Node[] = [];
  public links: Edge[] = [];

  constructor(props: any) {
    super(props);
    this.initializeOrgChart();
  }

  private initializeOrgChart(): void {
    // Create organizational structure
    this.nodes = [
      // CEO
      {
        id: "ceo",
        label: "CEO\nJohn Smith",
        width: 120,
        height: 100,
        data: { role: "executive" },
        template: (node) => this.createNodeTemplate(node),
      },

      // VPs / Directors
      {
        id: "cto",
        label: "CTO\nEmily Johnson",
        width: 120,
        height: 100,
        data: { role: "manager", reports_to: "ceo" },
        template: (node) => this.createNodeTemplate(node),
      },
      {
        id: "cfo",
        label: "CFO\nMichael Davis",
        width: 120,
        height: 100,
        data: { role: "manager", reports_to: "ceo" },
        template: (node) => this.createNodeTemplate(node),
      },
      {
        id: "hr-director",
        label: "HR Director\nSarah Wilson",
        width: 120,
        height: 100,
        data: { role: "manager", reports_to: "ceo" },
        template: (node) => this.createNodeTemplate(node),
      },

      // Engineering Team
      {
        id: "eng-lead-1",
        label: "Senior Engineer\nAlex Chen",
        width: 120,
        height: 100,
        data: { role: "engineer", reports_to: "cto" },
        template: (node) => this.createNodeTemplate(node),
      },
      {
        id: "eng-lead-2",
        label: "Tech Lead\nLisa Brown",
        width: 120,
        height: 100,
        data: { role: "engineer", reports_to: "cto" },
        template: (node) => this.createNodeTemplate(node),
      },

      // Designers
      {
        id: "designer-1",
        label: "UX Designer\nMarcos Garcia",
        width: 120,
        height: 100,
        data: { role: "designer", reports_to: "cto" },
        template: (node) => this.createNodeTemplate(node),
      },

      // Finance Team
      {
        id: "accountant",
        label: "Accountant\nRaj Patel",
        width: 120,
        height: 100,
        data: { role: "engineer", reports_to: "cfo" },
        template: (node) => this.createNodeTemplate(node),
      },

      // HR Team
      {
        id: "recruiter",
        label: "Recruiter\nJessica Lee",
        width: 120,
        height: 100,
        data: { role: "engineer", reports_to: "hr-director" },
        template: (node) => this.createNodeTemplate(node),
      },
    ];

    // Generate edges from reporting relationships
    for (const node of this.nodes) {
      if (node.data?.reports_to) {
        const edge: Edge = {
          source: node.data.reports_to,
          target: node.id,
          label: "reports to",
        };
        this.links.push(edge);
      }
    }
  }

  private createNodeTemplate(node: Node): React.ReactNode {
    const roleColor = roleColors[node.data?.role] || "#999";
    return (
      <NodeContainer style={{ background: roleColor }}>
        {node.label}
      </NodeContainer>
    );
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
