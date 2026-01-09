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
  Divider,
  Box,
} from "@material-ui/core";
import {
  Info as InfoIcon,
  AccountTree as AccountTreeIcon,
  Settings as SettingsIcon,
  GetApp as GetAppIcon,
  GitHub as GitHubIcon,
} from "@material-ui/icons";
import SungraphLogo from "./images/sungraph.svg";

const drawerWidth = 260;

export enum DrawerAction {
  GettingStarted = "GettingStarted",
  Props = "Props",
  Default = "Default",
  Basic = "Basic",
  Advanced = "Advanced",
}

const DrawerActionsItems = [
  {
    action: DrawerAction.GettingStarted,
    text: "Getting Started",
    icon: InfoIcon,
    description: "Learn the basics",
  },
  {
    action: DrawerAction.Default,
    text: "Default Graph",
    icon: AccountTreeIcon,
    description: "Simple example",
  },
  {
    action: DrawerAction.Basic,
    text: "Basic Graph",
    icon: AccountTreeIcon,
    description: "With templates",
  },
  {
    action: DrawerAction.Advanced,
    text: "Advanced Graph",
    icon: AccountTreeIcon,
    description: "Complex example",
  },
  {
    action: DrawerAction.Props,
    text: "Props",
    icon: SettingsIcon,
    description: "Configuration",
  },
];

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: "#f8f9fa",
    borderRight: "1px solid #e0e0e0",
  },
  drawerContainer: {
    overflow: "auto",
    padding: "8px 0",
  },
  listItem: {
    margin: "4px 8px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#e8e8ff",
    },
    "&.Mui-selected": {
      backgroundColor: "#667eea",
      color: "white",
      "&:hover": {
        backgroundColor: "#764ba2",
      },
    },
  },
  listItemIcon: {
    minWidth: 40,
  },
}));

export function ClippedDrawerAppBar(props: any) {
  const classes = useStyles();
  const [selectedDrawerAction, setSelectedDrawerAction] = useState(
    DrawerAction.GettingStarted
  );

  const listItems = DrawerActionsItems.map((item, index) => {
    const IconName = item.icon;
    const isSelected = selectedDrawerAction === item.action;
    
    return (
      <ListItem
        button
        selected={isSelected}
        key={item.action}
        onClick={() => {
          setSelectedDrawerAction(item.action);
          props.handleDrawerClick(item.action);
        }}
        className={classes.listItem}
        style={{
          backgroundColor: isSelected ? "#667eea" : "transparent",
          color: isSelected ? "white" : "inherit",
        }}
      >
        <ListItemIcon
          className={classes.listItemIcon}
          style={{ color: isSelected ? "white" : "inherit" }}
        >
          <IconName />
        </ListItemIcon>
        <div>
          <ListItemText 
            primary={item.text}
            secondary={item.description}
            primaryTypographyProps={{ style: { fontWeight: 600 } }}
            secondaryTypographyProps={{
              style: { 
                fontSize: '11px',
                opacity: isSelected ? 0.8 : 0.6,
                color: isSelected ? "white" : "inherit",
              }
            }}
          />
        </div>
      </ListItem>
    );
  });

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <img
            style={{ marginRight: 12 }}
            src={SungraphLogo}
            alt="sungraph"
            width={40}
            height={40}
          />
          <Typography variant="h6" style={{ fontWeight: 700, letterSpacing: 0.5 }}>
            SunGraph
          </Typography>
          <Box style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <InfoIcon style={{ fontSize: 20, opacity: 0.8 }} />
          </Box>
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
        <Box style={{ padding: "16px 12px" }}>
          <Typography variant="caption" style={{ fontWeight: 600, color: "#666" }}>
            EXAMPLES
          </Typography>
        </Box>
        <div className={classes.drawerContainer}>
          <List style={{ paddingTop: 0 }}>{listItems}</List>
        </div>
        
        <Divider style={{ margin: "16px 0" }} />
        
        <Box style={{ padding: "12px", textAlign: "center" }}>
          <Typography variant="caption" style={{ fontSize: "11px", color: "#999" }}>
            v0.0.0 • MIT License
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}
