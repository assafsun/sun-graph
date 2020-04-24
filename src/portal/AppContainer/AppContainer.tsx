import React from "react";
import {
  ClippedDrawerAppBar,
  DrawerAction,
} from "../ClippedDrawerAppBar/ClippedDrawerAppBar";
import { BasicGraphComponent } from "portal/BasicGraph/BasicGraph";

import "./AppContainer.scss";
import { GettingStarted } from "../GettingStarted/GettingStarted";

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
      <div className="appContainer">
        <ClippedDrawerAppBar
          handleDrawerClick={(drawerAction: DrawerAction) =>
            this.handleDrawerClick(drawerAction)
          }
        ></ClippedDrawerAppBar>
        <div className="main">{this.loadDrawerAction()}</div>
      </div>
    );
  }

  public loadDrawerAction() {
    switch (this.state.drawerAction) {
      case DrawerAction.BasicDemo: {
        return <BasicGraphComponent></BasicGraphComponent>;
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
