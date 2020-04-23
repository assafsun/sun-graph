import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  CssBaseline,
  Drawer,
  List,
  ListItemIcon,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { BasicGraphComponent } from "Examples/BasicGraph/BasicGraph";

import "./AppContainer.scss";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
}));

enum DrawerAction {
  Introduction = 0,
  BasicDemo,
}

function ClippedDrawerAppBar(props: any) {
  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">Sun Graph</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem
              divider
              button
              key="Introduction"
              onClick={() => {
                props.handleDrawerClick(DrawerAction.Introduction);
              }}
            >
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="Introduction" />
            </ListItem>
            <ListItem
              button
              key="BasicDemo"
              onClick={() => {
                props.handleDrawerClick(DrawerAction.BasicDemo);
              }}
            >
              <ListItemIcon>
                <AccountTreeIcon />
              </ListItemIcon>
              <ListItemText primary="Basic Demo" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
}

interface AppState {
  drawerAction: DrawerAction;
}

export class AppContainerComponent extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = { drawerAction: DrawerAction.Introduction };
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
      case DrawerAction.Introduction:
      default: {
        return <div></div>;
      }
    }
  }

  public handleDrawerClick(drawerAction: DrawerAction): void {
    this.setState({ drawerAction: drawerAction });
  }
}
