import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemIcon,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import AccountTreeIcon from "@material-ui/icons/AccountTree";

const drawerWidth = 240;

export enum DrawerAction {
  GettingStarted = 0,
  DefaultExample,
  BasicDemo,
}

export const useStyles = makeStyles((theme) => ({
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

export function ClippedDrawerAppBar(props: any) {
  const classes = useStyles();
  return (
    <>
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
              key="GettingStarted"
              onClick={() => {
                props.handleDrawerClick(DrawerAction.GettingStarted);
              }}
            >
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="Getting Started" />
            </ListItem>
            <ListItem
              divider
              button
              key="DefaultExample"
              onClick={() => {
                props.handleDrawerClick(DrawerAction.DefaultExample);
              }}
            >
              <ListItemIcon>
                <AccountTreeIcon />
              </ListItemIcon>
              <ListItemText primary="Default Example" />
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
