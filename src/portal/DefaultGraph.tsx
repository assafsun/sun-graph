import React from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import { SunGraph } from "SunGraph/SunGraph";
import { Typography, Link, Box, Chip } from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import { ExampleLayout } from "./layouts/ExampleLayout";
import styled from "styled-components";

const FeaturesList = styled.ul`
  margin: 12px 0;
  padding-left: 20px;
  
  li {
    margin: 8px 0;
    color: #666;
  }
`;

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
    const description = (
      <>
        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 12 }}>
          Overview
        </Typography>
        <Typography paragraph>
          This is the simplest SunGraph example - just nodes and edges with default styling.
          No custom templates or special configuration.
        </Typography>
        
        <Typography variant="h6" style={{ fontWeight: 600, marginTop: 16, marginBottom: 8 }}>
          Perfect For
        </Typography>
        <FeaturesList>
          <li>Getting started with SunGraph basics</li>
          <li>Understanding the minimal configuration needed</li>
          <li>Quick prototyping of graph structures</li>
          <li>Learning the Graph, Node, and Edge interfaces</li>
        </FeaturesList>

        <Typography variant="h6" style={{ fontWeight: 600, marginTop: 16, marginBottom: 8 }}>
          What's Included
        </Typography>
        <Typography paragraph>
          Basic node styling, edge connections, zoom, pan, and node dragging capabilities.
          A great starting point before adding custom styling.
        </Typography>

        <Box style={{ marginTop: 16 }}>
          <Link
            href="https://github.com/assafsun/sun-graph/blob/master/src/portal/DefaultGraph.tsx"
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
        title="📊 Default Graph"
        description={description}
      >
        <SunGraph 
          nodes={this.nodes} 
          links={this.links}
          enableZoom={true}
          autoZoom={true}
          autoCenter={true}
          requireModifierToZoom={true}
          panningEnabled={true}
          draggingEnabled={true}
        />
      </ExampleLayout>
    );
  }
}
