import React from "react";
import { ClippedDrawerAppBar, DrawerAction } from "./ClippedDrawerAppBar";
import { BasicGraphComponent } from "portal/BasicGraph";
import { DefaultGraph } from "portal/DefaultGraph";
import { GettingStarted } from "./GettingStarted";
import { AdvancedGraphComponent } from "portal/AdvancedGraph";
import { OrgChartGraph } from "portal/OrgChartGraph";
import { NetworkGraph } from "portal/NetworkGraph";
import { FlowchartGraph } from "portal/FlowchartGraph";
import { DependencyGraph } from "portal/DependencyGraph";
import { InteractiveSearchGraph } from "portal/InteractiveSearchGraph";
import { CustomStylingGraph } from "portal/CustomStylingGraph";
import styled from "styled-components";
import { Inputs } from "./Inputs";

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

interface MainProps {
  isGraphDemo?: boolean;
}

const Main = styled.div<MainProps>`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  flex: 1;
  margin-top: 64px;
  overflow: auto;
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
      case DrawerAction.Basic:
        return <BasicGraphComponent />;
      case DrawerAction.Advanced:
        return <AdvancedGraphComponent />;
      case DrawerAction.Default:
        return <DefaultGraph />;
      case DrawerAction.Props:
        return <Inputs />;
      case DrawerAction.OrgChart:
        return <OrgChartGraph />;
      case DrawerAction.Network:
        return <NetworkGraph />;
      case DrawerAction.Flowchart:
        return <FlowchartGraph />;
      case DrawerAction.Dependency:
        return <DependencyGraph />;
      case DrawerAction.InteractiveSearch:
        return <InteractiveSearchGraph />;
      case DrawerAction.CustomStyling:
        return <CustomStylingGraph />;
      case DrawerAction.GettingStarted:
      default:
        return <GettingStarted />;
    }
  }

  public handleDrawerClick(drawerAction: DrawerAction): void {
    this.setState({ drawerAction: drawerAction });
  }
}
