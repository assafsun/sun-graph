import React, { useState } from "react";
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
  GettingStarted = "GettingStarted",
  Default = "Deafult",
  Basic = "BasicDemo",
  Advanced = "Advanced",
}

const DrawerActionsItems = [
  {
    action: DrawerAction.GettingStarted,
    text: "Getting Started",
    icon: InfoIcon,
  },
  {
    action: DrawerAction.Default,
    text: "Default Graph",
    icon: AccountTreeIcon,
  },
  {
    action: DrawerAction.Basic,
    text: "Basic Graph",
    icon: AccountTreeIcon,
  },
  {
    action: DrawerAction.Advanced,
    text: "Advanced Graph",
    icon: AccountTreeIcon,
  },
];

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "#354356",
    color: "#C3DBE3",
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
  const [selectedDrawerAction, setSelectedDrawerAction] = useState(
    DrawerAction.GettingStarted
  );

  const listItems = DrawerActionsItems.map((item) => {
    const IconName = item.icon;
    return (
      <ListItem
        divider
        button
        selected={selectedDrawerAction === item.action}
        key={item.action}
        onClick={() => {
          setSelectedDrawerAction(item.action);
          props.handleDrawerClick(item.action);
        }}
      >
        <ListItemIcon>
          <IconName />
        </ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItem>
    );
  });

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
          <List>{listItems}</List>
        </div>
      </Drawer>
    </>
  );
}
