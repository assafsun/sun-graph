import React from "react";
import {
  ClippedDrawerAppBar,
  DrawerAction,
} from "../ClippedDrawerAppBar/ClippedDrawerAppBar";
import { BasicGraphComponent } from "portal/BasicGraph/BasicGraph";
import { DefaultGraph } from "portal/DefaultGraph/DefaultGraph";
import { GettingStarted } from "../GettingStarted/GettingStarted";
import { Typography, Link } from "@material-ui/core";
import { AdvancedGraphComponent } from "portal/AdvancedGraph/AdvancedGraph";

import "./AppContainer.scss";

const DefaultWidth: number = 1200;

interface State {
  drawerAction: DrawerAction;
}

export class AppContainerComponent extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = { drawerAction: DrawerAction.GettingStarted };
  }

  render() {
    const mainClassName: string =
      "main " +
      (this.state.drawerAction !== DrawerAction.GettingStarted
        ? "overflowHide"
        : "");

    return (
      <div className="appContainer">
        <ClippedDrawerAppBar
          handleDrawerClick={(drawerAction: DrawerAction) =>
            this.handleDrawerClick(drawerAction)
          }
        ></ClippedDrawerAppBar>
        <div className={mainClassName}>{this.loadDrawerAction()}</div>
      </div>
    );
  }

  public loadDrawerAction() {
    switch (this.state.drawerAction) {
      case DrawerAction.Basic: {
        return (
          <>
            <section className="graphDescription">
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
              <Link
                href="https://github.com/assafsun/sun-graph/blob/master/src/portal/BasicGraph/BasicGraph.tsx"
                target="_blank"
                variant="button"
                paragraph
                style={{ width: DefaultWidth }}
              >
                Go to code
              </Link>
            </section>
            <BasicGraphComponent></BasicGraphComponent>
          </>
        );
      }
      case DrawerAction.Advanced: {
        return (
          <>
            <section className="graphDescription">
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
                structure, different node shapes.
              </Typography>
              <Link
                href="https://github.com/assafsun/sun-graph/blob/master/src/portal/AdvancedGraph/AdvancedGraph.tsx"
                target="_blank"
                variant="button"
                paragraph
                style={{ width: DefaultWidth }}
              >
                Go to code
              </Link>
            </section>
            <AdvancedGraphComponent></AdvancedGraphComponent>
          </>
        );
      }
      case DrawerAction.Default: {
        return (
          <>
            <section className="graphDescription">
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
                href="https://github.com/assafsun/sun-graph/blob/master/src/portal/DefaultGraph/DefaultGraph.tsx"
                target="_blank"
                variant="button"
                paragraph
                style={{ width: DefaultWidth }}
              >
                Go to code
              </Link>
            </section>
            <DefaultGraph></DefaultGraph>
          </>
        );
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
