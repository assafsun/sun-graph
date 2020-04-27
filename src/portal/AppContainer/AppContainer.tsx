import React from "react";
import {
  ClippedDrawerAppBar,
  DrawerAction,
} from "../ClippedDrawerAppBar/ClippedDrawerAppBar";
import { BasicGraphComponent } from "portal/BasicGraph/BasicGraph";
import { DefaultGraph } from "portal/DefaultGraph/DefaultGraph";

import "./AppContainer.scss";
import { GettingStarted } from "../GettingStarted/GettingStarted";
import { Typography, Link } from "@material-ui/core";
import { AdvancedGraphComponent } from "portal/AdvancedGraph/AdvancedGraph";

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
              <Typography paragraph style={{ width: 1200 }}>
                The following graph display the basic graph that sun graph
                produce with additonal such as: zoom, node drag, graph movement,
                custom node UI.
              </Typography>
              <Link
                href="https://www.github.com"
                target="_blank"
                variant="button"
                paragraph
                style={{ width: 1200 }}
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
              <Typography paragraph style={{ width: 1200 }}>
                The following graph display more advanced graph which contains
                differnt UI and sizes in specific nodes.
              </Typography>
              <Typography paragraph style={{ width: 1200 }}>
                In addition, the advanced graph is taken as an input a custom
                layout for building the graph layout.
              </Typography>
              <Link
                href="https://www.github.com"
                target="_blank"
                variant="button"
                paragraph
                style={{ width: 1200 }}
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
              <Typography paragraph style={{ width: 1200 }}>
                The following graph display the default graph that sun graph
                create after getting only the user nodes and links inputs.
              </Typography>
              <Link
                href="https://www.github.com"
                target="_blank"
                variant="button"
                paragraph
                style={{ width: 1200 }}
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
