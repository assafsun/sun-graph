import React from "react";
import { Typography, Button, Box, Paper, Card, CardContent, Link } from "@material-ui/core";
import { GitHub as GitHubIcon, GetApp as GetAppIcon, Launch as LaunchIcon } from "@material-ui/icons";
import styled from "styled-components";

const DefaultWidth: number = 1200;

const GettingStartedContainer = styled.section`
  margin: 12px 0 0 12px;
  padding-right: 24px;
`;

const Section = styled.section`
  margin: 32px 0;
`;

const CodeBlock = styled.pre`
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
  margin: 16px 0;
  width: ${DefaultWidth}px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px 0;
  width: ${DefaultWidth}px;
`;

const FeatureCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

export function GettingStarted() {
  return (
    <GettingStartedContainer>
      {/* Hero Section */}
      <Section>
        <Typography
          paragraph
          variant="h3"
          style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}
        >
          ✨ Welcome to SunGraph
        </Typography>
        <Typography paragraph style={{ width: DefaultWidth, fontSize: 18, color: "#666" }}>
          A powerful React component for creating beautiful, interactive graph visualizations.
        </Typography>
        <Typography paragraph style={{ width: DefaultWidth }}>
          Inspired by <strong>swimlane/ngx-graph</strong>, SunGraph helps you build stunning flowcharts,
          organizational charts, network diagrams, and more with minimal effort.
        </Typography>
      </Section>

      {/* Features */}
      <Section>
        <Typography
          paragraph
          variant="h4"
          style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}
        >
          ⚡ Key Features
        </Typography>
        <FeatureGrid>
          <FeatureCard>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
                🎨 Beautiful by Default
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Out-of-the-box stunning visualizations with customizable styling
              </Typography>
            </CardContent>
          </FeatureCard>
          
          <FeatureCard>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
                🎯 Fully Interactive
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Zoom, pan, drag nodes, and respond to user interactions
              </Typography>
            </CardContent>
          </FeatureCard>
          
          <FeatureCard>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
                🧩 Customizable
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Custom node templates with full React component support
              </Typography>
            </CardContent>
          </FeatureCard>
          
          <FeatureCard>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
                📐 Flexible Layouts
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Built-in layouts or create your own positioning algorithms
              </Typography>
            </CardContent>
          </FeatureCard>
          
          <FeatureCard>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
                📦 TypeScript Ready
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Fully typed with comprehensive type definitions
              </Typography>
            </CardContent>
          </FeatureCard>
          
          <FeatureCard>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
                🚀 High Performance
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Optimized rendering for large graphs
              </Typography>
            </CardContent>
          </FeatureCard>
        </FeatureGrid>
      </Section>

      {/* Quick Start */}
      <Section>
        <Typography
          paragraph
          variant="h4"
          style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}
        >
          🚀 Quick Start
        </Typography>
        
        <Typography paragraph style={{ width: DefaultWidth, fontWeight: 600 }}>
          1. Install the package
        </Typography>
        <CodeBlock>{`npm install sun-graph
# or
yarn add sun-graph`}</CodeBlock>

        <Typography paragraph style={{ width: DefaultWidth, fontWeight: 600 }}>
          2. Import and use in your React component
        </Typography>
        <CodeBlock>{`import { SunGraph } from "sun-graph";
import { Node, Edge, Graph } from "sun-graph/graph.model";
import { CustomDagreLayout } from "sun-graph/layout.model";

function MyGraph() {
  const nodes: Node[] = [
    { id: '1', label: 'Node A', width: 100, height: 100 },
    { id: '2', label: 'Node B', width: 100, height: 100 }
  ];

  const edges: Edge[] = [
    { source: '1', target: '2' }
  ];

  const graph: Graph = { nodes, edges };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <SunGraph
        graph={graph}
        layout={new CustomDagreLayout()}
        autoCenter={true}
      />
    </div>
  );
}`}</CodeBlock>

        <Typography paragraph style={{ width: DefaultWidth }}>
          That's it! You now have a fully interactive graph visualization.
        </Typography>
      </Section>

      {/* Explore Examples */}
      <Section>
        <Typography
          paragraph
          variant="h4"
          style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}
        >
          📚 Explore Examples
        </Typography>
        <Typography paragraph style={{ width: DefaultWidth, marginBottom: 16 }}>
          Check out the examples in the sidebar to see SunGraph in action:
        </Typography>
        
        <Box style={{ width: DefaultWidth }}>
          <Typography paragraph style={{ fontWeight: 600, marginBottom: 8 }}>
            <strong>Default Graph</strong> - Simple graph with no customization
          </Typography>
          <Typography paragraph style={{ marginBottom: 16, marginLeft: 16 }}>
            Perfect for getting started with the basics.
          </Typography>

          <Typography paragraph style={{ fontWeight: 600, marginBottom: 8 }}>
            <strong>Basic Graph</strong> - Graph with custom node templates
          </Typography>
          <Typography paragraph style={{ marginBottom: 16, marginLeft: 16 }}>
            Learn how to customize node appearance and add interactivity.
          </Typography>

          <Typography paragraph style={{ fontWeight: 600, marginBottom: 8 }}>
            <strong>Advanced Graph</strong> - Complex graph with multiple features
          </Typography>
          <Typography paragraph style={{ marginLeft: 16 }}>
            See advanced features like custom layouts, edge labels, and mixed styling.
          </Typography>
        </Box>
      </Section>

      {/* Resources */}
      <Section>
        <Typography
          paragraph
          variant="h4"
          style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}
        >
          📖 Resources
        </Typography>
        <FeatureGrid>
          <FeatureCard>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
                API Documentation
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: 12 }}>
                Complete API reference for all interfaces and components
              </Typography>
              <Link 
                href="https://github.com/assafsun/sun-graph/blob/master/docs/API.md" 
                target="_blank"
                style={{ textDecoration: 'none' }}
              >
                <Button size="small" variant="outlined" startIcon={<LaunchIcon />}>
                  Read Docs
                </Button>
              </Link>
            </CardContent>
          </FeatureCard>

          <FeatureCard>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
                Setup Guide
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: 12 }}>
                Installation, configuration, and getting started guide
              </Typography>
              <Link 
                href="https://github.com/assafsun/sun-graph/blob/master/docs/SETUP.md" 
                target="_blank"
                style={{ textDecoration: 'none' }}
              >
                <Button size="small" variant="outlined" startIcon={<LaunchIcon />}>
                  Read Docs
                </Button>
              </Link>
            </CardContent>
          </FeatureCard>

          <FeatureCard>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
                Advanced Features
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: 12 }}>
                Custom layouts, event handling, and best practices
              </Typography>
              <Link 
                href="https://github.com/assafsun/sun-graph/blob/master/docs/ADVANCED.md" 
                target="_blank"
                style={{ textDecoration: 'none' }}
              >
                <Button size="small" variant="outlined" startIcon={<LaunchIcon />}>
                  Read Docs
                </Button>
              </Link>
            </CardContent>
          </FeatureCard>

          <FeatureCard>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
                GitHub Repository
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: 12 }}>
                Source code, issues, and contribute to the project
              </Typography>
              <Link 
                href="https://github.com/assafsun/sun-graph" 
                target="_blank"
                style={{ textDecoration: 'none' }}
              >
                <Button size="small" variant="outlined" startIcon={<GitHubIcon />}>
                  View Repo
                </Button>
              </Link>
            </CardContent>
          </FeatureCard>

          <FeatureCard>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
                NPM Package
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: 12 }}>
                Install SunGraph via npm or yarn
              </Typography>
              <Link 
                href="https://www.npmjs.com/package/sun-graph" 
                target="_blank"
                style={{ textDecoration: 'none' }}
              >
                <Button size="small" variant="outlined" startIcon={<GetAppIcon />}>
                  Install
                </Button>
              </Link>
            </CardContent>
          </FeatureCard>

          <FeatureCard>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
                Examples Source
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: 12 }}>
                Source code for all examples in this portal
              </Typography>
              <Link 
                href="https://github.com/assafsun/sun-graph/tree/master/src/portal" 
                target="_blank"
                style={{ textDecoration: 'none' }}
              >
                <Button size="small" variant="outlined" startIcon={<GitHubIcon />}>
                  View Code
                </Button>
              </Link>
            </CardContent>
          </FeatureCard>
        </FeatureGrid>
      </Section>

      {/* CTA */}
      <Section style={{ marginBottom: 48 }}>
        <Paper style={{ padding: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h5" style={{ fontWeight: 600, marginBottom: 12 }}>
            Ready to get started?
          </Typography>
          <Typography paragraph style={{ marginBottom: 16 }}>
            Explore the examples in the sidebar to see SunGraph in action, or visit the documentation
            to learn more about building custom graphs.
          </Typography>
          <ButtonGroup>
            <Link href="https://github.com/assafsun/sun-graph" target="_blank" style={{ textDecoration: 'none' }}>
              <Button 
                variant="contained" 
                style={{ backgroundColor: 'white', color: '#667eea', fontWeight: 600 }}
                startIcon={<GitHubIcon />}
              >
                Star on GitHub
              </Button>
            </Link>
            <Link href="https://www.npmjs.com/package/sun-graph" target="_blank" style={{ textDecoration: 'none' }}>
              <Button 
                variant="contained"
                style={{ backgroundColor: 'white', color: '#667eea', fontWeight: 600 }}
                startIcon={<GetAppIcon />}
              >
                Install Package
              </Button>
            </Link>
          </ButtonGroup>
        </Paper>
      </Section>
    </GettingStartedContainer>
  );
}
