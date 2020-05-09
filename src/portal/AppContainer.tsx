import React from "react";
import { ClippedDrawerAppBar, DrawerAction } from "./ClippedDrawerAppBar";
import { BasicGraphComponent } from "portal/BasicGraph";
import { DefaultGraph } from "portal/DefaultGraph";
import { GettingStarted } from "./GettingStarted";
import { Typography, Link } from "@material-ui/core";
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
  background-color: white;
  flex: 1;
  margin-top: 64px;
  overflow: ${(props) => (props.isGraphDemo ? "hidden" : undefined)};
`;

const GraphDescription = styled.section`
  margin: 12px 0 0 12px;
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
              <Typography
                paragraph
                variant="h4"
                style={{ fontSize: 24, fontWeight: 600 }}
              >
                ❂ Basic Graph
              </Typography>
              <Typography paragraph style={{ width: DefaultWidth }}>
                The basic graph that sun graph creates with additional features
                to the default graph template.
              </Typography>
              <Typography paragraph style={{ width: DefaultWidth }}>
                Additional features: zoom, node drag, graph movement, custom
                node UI.
              </Typography>
              <Typography paragraph style={{ width: DefaultWidth }}>
                The "update graph" button will update the graph structure with
                new inputs.
              </Typography>
              <Link
                href="https://github.com/assafsun/sun-graph/blob/master/src/portal/BasicGraph.tsx"
                target="_blank"
                variant="button"
                paragraph
                style={{ width: DefaultWidth }}
              >
                Go to code
              </Link>
            </GraphDescription>
            <BasicGraphComponent></BasicGraphComponent>
          </>
        );
      }
      case DrawerAction.Advanced: {
        return (
          <>
            <GraphDescription>
              <Typography
                paragraph
                variant="h4"
                style={{ fontSize: 24, fontWeight: 600 }}
              >
                ❂ Advanced Graph
              </Typography>
              <Typography paragraph style={{ width: DefaultWidth }}>
                The advanced graph that sun graph creates with additional
                features to the basic graph.
              </Typography>
              <Typography paragraph style={{ width: DefaultWidth }}>
                Additional features: Layout as an input for building the graph
                structure, different node shapes and custom template on links.
              </Typography>
              <Link
                href="https://github.com/assafsun/sun-graph/blob/master/src/portal/AdvancedGraph.tsx"
                target="_blank"
                variant="button"
                paragraph
                style={{ width: DefaultWidth }}
              >
                Go to code
              </Link>
            </GraphDescription>
            <AdvancedGraphComponent></AdvancedGraphComponent>
          </>
        );
      }
      case DrawerAction.Default: {
        return (
          <>
            <GraphDescription>
              <Typography
                paragraph
                variant="h4"
                style={{ fontSize: 24, fontWeight: 600 }}
              >
                ❂ Default Graph
              </Typography>
              <Typography paragraph style={{ width: DefaultWidth }}>
                The default graph that sun graph creates after getting only the
                user nodes and links inputs.
              </Typography>
              <Link
                href="https://github.com/assafsun/sun-graph/blob/master/src/portal/DefaultGraph.tsx"
                target="_blank"
                variant="button"
                paragraph
                style={{ width: DefaultWidth }}
              >
                Go to code
              </Link>
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
