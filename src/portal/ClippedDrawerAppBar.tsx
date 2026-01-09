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
  Divider,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Info as InfoIcon,
  AccountTree as AccountTreeIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import SungraphLogo from "./images/sungraph.svg";

const drawerWidth = 260;

export enum DrawerAction {
  GettingStarted = "GettingStarted",
  Props = "Props",
  Default = "Default",
  Basic = "Basic",
  Advanced = "Advanced",
  OrgChart = "OrgChart",
  Network = "Network",
  Flowchart = "Flowchart",
  Dependency = "Dependency",
  InteractiveSearch = "InteractiveSearch",
  CustomStyling = "CustomStyling",
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
    action: DrawerAction.OrgChart,
    text: "Org Chart",
    icon: AccountTreeIcon,
    description: "Hierarchy example",
  },
  {
    action: DrawerAction.Network,
    text: "Network Graph",
    icon: AccountTreeIcon,
    description: "Social network",
  },
  {
    action: DrawerAction.Flowchart,
    text: "Flowchart",
    icon: AccountTreeIcon,
    description: "Process flow",
  },
  {
    action: DrawerAction.Dependency,
    text: "Dependencies",
    icon: AccountTreeIcon,
    description: "Service graph",
  },
  {
    action: DrawerAction.InteractiveSearch,
    text: "Interactive Search",
    icon: AccountTreeIcon,
    description: "Search & select",
  },
  {
    action: DrawerAction.CustomStyling,
    text: "Custom Styling",
    icon: AccountTreeIcon,
    description: "Dynamic styles",
  },
  {
    action: DrawerAction.Props,
    text: "Props",
    icon: SettingsIcon,
    description: "Configuration",
  },
];

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
}));

const DrawerStyled = styled(Drawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    background: "#f8f9fa",
    borderRight: "1px solid #e0e0e0",
  },
}));

const DrawerContainer = styled(Box)(() => ({
  overflow: "auto",
  padding: "8px 0",
}));

export function ClippedDrawerAppBar(props: any) {
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
        sx={{
          margin: "4px 8px",
          borderRadius: "8px",
          transition: "all 0.2s ease",
          backgroundColor: isSelected ? "#667eea" : "transparent",
          color: isSelected ? "white" : "inherit",
          "&:hover": {
            backgroundColor: isSelected ? "#764ba2" : "#e8e8ff",
          },
          "&.Mui-selected": {
            backgroundColor: "#667eea",
            color: "white",
            "&:hover": {
              backgroundColor: "#764ba2",
            },
          },
        }}
      >
        <ListItemIcon
          sx={{ minWidth: 40, color: isSelected ? "white" : "inherit" }}
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
      <AppBarStyled position="fixed">
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
      </AppBarStyled>
      <DrawerStyled
        variant="permanent"
      >
        <Toolbar />
        <Box style={{ padding: "16px 12px" }}>
          <Typography variant="caption" style={{ fontWeight: 600, color: "#666" }}>
            EXAMPLES
          </Typography>
        </Box>
        <DrawerContainer>
          <List style={{ paddingTop: 0 }}>{listItems}</List>
        </DrawerContainer>
        
        <Divider style={{ margin: "16px 0" }} />
        
        <Box style={{ padding: "12px", textAlign: "center" }}>
          <Typography variant="caption" style={{ fontSize: "11px", color: "#999" }}>
            v0.0.0 • MIT License
          </Typography>
        </Box>
      </DrawerStyled>
    </>
  );
}
