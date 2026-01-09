import React from "react";
import { ClippedDrawerAppBar, DrawerAction } from "./ClippedDrawerAppBar";
import { BasicGraphComponent } from "portal/BasicGraph";
import { DefaultGraph } from "portal/DefaultGraph";
import { GettingStarted } from "./GettingStarted";
import { Typography, Link, Paper, Box, Chip } from "@material-ui/core";
import { GitHub as GitHubIcon } from "@material-ui/icons";
import { AdvancedGraphComponent } from "portal/AdvancedGraph";
import styled from "styled-components";
import { Inputs } from "./Inputs";

const DefaultWidth: number = 1200;

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

interface MainProps {
  isGraphDemo: boolean;
}

const Main = styled.div.attrs((props: MainProps) => ({
  isGraphDemo: props.isGraphDemo || false,
}))`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  flex: 1;
  margin-top: 64px;
  overflow: ${(props) => (props.isGraphDemo ? "hidden" : "auto")};
`;

const GraphDescription = styled.section`
  margin: 24px 0 24px 24px;
  padding: 0 24px 0 0;
`;

const DescriptionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const ExampleTitle = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
`;

const DescriptionCard = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
  background: white;
  width: ${DefaultWidth}px;
`;

const FeaturesList = styled.ul`
  margin: 12px 0;
  padding-left: 20px;
  
  li {
    margin: 8px 0;
    color: #666;
  }
`;

interface State {
  drawerAction: DrawerAction;
}

export class AppContainerComponent extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = { drawerAction: DrawerAction.GettingStarted };
  }

  render() {
    return (
      <Container>
        <ClippedDrawerAppBar
          handleDrawerClick={(drawerAction: DrawerAction) =>
            this.handleDrawerClick(drawerAction)
          }
        ></ClippedDrawerAppBar>
        <Main
          isGraphDemo={
            this.state.drawerAction !== DrawerAction.GettingStarted &&
            this.state.drawerAction !== DrawerAction.Props
          }
        >
          {this.loadDrawerAction()}
        </Main>
      </Container>
    );
  }

  public loadDrawerAction() {
    switch (this.state.drawerAction) {
      case DrawerAction.Basic: {
        return (
          <>
            <GraphDescription>
              <DescriptionHeader>
                <ExampleTitle>🎯 Basic Graph</ExampleTitle>
              </DescriptionHeader>
              <DescriptionCard>
                <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 12 }}>
                  Overview
                </Typography>
                <Typography paragraph>
                  This example demonstrates the fundamental features of SunGraph with custom node
                  templates and basic interactivity.
                </Typography>
                
                <Typography variant="h6" style={{ fontWeight: 600, marginTop: 16, marginBottom: 8 }}>
                  Features Demonstrated
                </Typography>
                <FeaturesList>
                  <li><strong>Custom Node Templates</strong> - Styled containers with labels</li>
                  <li><strong>Parent-Child Relationships</strong> - Automatic edge generation</li>
                  <li><strong>Graph Updates</strong> - Dynamic graph modification with button clicks</li>
                  <li><strong>Zoom & Pan</strong> - Interactive canvas navigation</li>
                  <li><strong>Node Dragging</strong> - Reposition nodes freely</li>
                </FeaturesList>

                <Typography variant="h6" style={{ fontWeight: 600, marginTop: 16, marginBottom: 8 }}>
                  Try It Out
                </Typography>
                <Typography paragraph>
                  Click the "Update Graph" button to dynamically change the graph structure.
                  Try zooming with your mouse wheel, panning by dragging the canvas, and moving individual nodes.
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
                      color="primary"
                    />
                  </Link>
                </Box>
              </DescriptionCard>
            </GraphDescription>
            <BasicGraphComponent></BasicGraphComponent>
          </>
        );
      }
      case DrawerAction.Advanced: {
        return (
          <>
            <GraphDescription>
              <DescriptionHeader>
                <ExampleTitle>🚀 Advanced Graph</ExampleTitle>
              </DescriptionHeader>
              <DescriptionCard>
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
              </DescriptionCard>
            </GraphDescription>
            <AdvancedGraphComponent></AdvancedGraphComponent>
          </>
        );
      }
      case DrawerAction.Default: {
        return (
          <>
            <GraphDescription>
              <DescriptionHeader>
                <ExampleTitle>📊 Default Graph</ExampleTitle>
              </DescriptionHeader>
              <DescriptionCard>
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
              </DescriptionCard>
            </GraphDescription>
            <DefaultGraph></DefaultGraph>
          </>
        );
      }
      case DrawerAction.Props: {
        return <Inputs></Inputs>;
      }
      case DrawerAction.GettingStarted:
      default: {
        return <GettingStarted></GettingStarted>;
      }
    }
  }

  public handleDrawerClick(drawerAction: DrawerAction): void {
    this.setState({ drawerAction: drawerAction });
  }
}
