import React from "react";
import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import "./GettingStarted.scss";

const useStyles = makeStyles({
  table: {
    width: 1250,
    marginBottom: 60,
  },
});

function createData(name: any, isRequired: any, description: any) {
  return { name, isRequired, description };
}

const rows = [
  createData(
    "nodes",
    "Required",
    "The nodes that are part of the graph, each node has its properties as defined in the Node class"
  ),
  createData(
    "links",
    "Required",
    "The link that are part of the graph, each link must define its source and target"
  ),
  createData(
    "view",
    "Optional",
    "Array of two values for the graph width and height, the default value of the graph view is the size of the its parent container"
  ),
  createData(
    "defaultNodeDisplay",
    "Optional",
    "Callback function which should return the node apperance, by default, the return node should return a proper HTML object. The node class can override this function for specipic node display"
  ),
  createData(
    "isNodeDisplayHTML",
    "Optional",
    "If set to true, the expected return node display is a proper HTML element otherwise it will expect a proper SVG element. default value is true"
  ),
  createData(
    "layout",
    "Optional",
    "Layout object will follow the Layout interface, the layout object will define the position of the nodes and links."
  ),
  createData(
    "curve",
    "Optional",
    "A line render function for drawing the line between the selected point from the layout."
  ),
  createData(
    "nodeHeight",
    "Optional",
    "Constant height for all the nodes, the Node class can override it for single node height"
  ),
  createData(
    "nodeWidth",
    "Optional",
    "Constant width for all the nodes, the Node class can override it for single node width"
  ),
  createData(
    "draggingEnabled",
    "Optional",
    "If set to true, the user will be able to drag each node. default value: false"
  ),
  createData(
    "panningEnabled",
    "Optional",
    "If set to true, the user will be able to move the graph position. default value: false"
  ),
  createData(
    "enableZoom",
    "Optional",
    "If set to true, the user will be able to zoom using the mouse wheel default value: false"
  ),
  createData(
    "minZoomLevel",
    "Optional",
    "Minimum zoom level, the value should be between the range of 0 and 4"
  ),
  createData(
    "maxZoomLevel",
    "Optional",
    "Maximum zoom level, the value should be between the range of 0 and 4"
  ),
  createData(
    "autoCenter",
    "Optional",
    "If set to true, the graph will be render in the center of the view. default value: false"
  ),
  createData(
    "clickHandler",
    "Optional",
    "Callback function for listening to graph click events"
  ),
];

export function GettingStarted() {
  const classes = useStyles();

  return (
    <section className="gettingStartedContent">
      <Typography
        paragraph
        variant="h4"
        style={{ fontSize: 24, fontWeight: 600 }}
      >
        ➣ Introduction
      </Typography>
      <Typography paragraph style={{ width: 1200 }}>
        Inspired by swimlane/ngx-graph, sun-graph is a react component for
        creating graph visualization.
      </Typography>
      <Typography paragraph style={{ width: 1200 }}>
        sun-graph will help you to build beautiful graphs in a simple way and to
        create you own custom graph shapes with your own data.
      </Typography>
      <Typography
        paragraph
        variant="h4"
        style={{ fontSize: 24, fontWeight: 600 }}
      >
        ➣ How to start building graphs?
      </Typography>
      <section className="buildingGraph">
        <Typography
          variant="caption"
          paragraph
          style={{ fontSize: 20, fontWeight: 600 }}
        >
          Import Sun Graph to your project
        </Typography>
        <Typography paragraph style={{ width: 1200 }}>
          1. Install sun-graph package by running
        </Typography>
        <Typography paragraph style={{ width: 1200 }}>
          2. Import SunGraph component into your react component
        </Typography>
        <Typography paragraph style={{ width: 1200 }}>
          3. Load SunGraph component in your react component.
        </Typography>
        <Typography
          variant="caption"
          paragraph
          style={{ fontSize: 20, fontWeight: 600 }}
        >
          Build your graph data
        </Typography>
        <Typography paragraph style={{ width: 1200 }}>
          The minimum input that SunGraph needs in order to load the graph is
          the information on the nodes and links.
        </Typography>
        <Typography paragraph style={{ width: 1200 }}>
          Graph Node - Repersent by the 'Node' class, we need to create the
          amount of nodes which the required field is the id. Once all the nodes
          objects are ready, pass them to the input props - nodes.
        </Typography>
        <Typography paragraph style={{ width: 1200 }}>
          Graph Link - Repersent by the 'Link' class, we need to create the
          links which will connect existing nodes. Each link object must have
          the 'source' attribute and 'destination' which contains the nodes ids.
          Once all the link objects are ready, pass them to the input props -
          link.
        </Typography>
      </section>
      <Typography
        paragraph
        variant="h4"
        style={{ fontSize: 24, fontWeight: 600 }}
      >
        ➣ SunGraph Component Inputs
      </Typography>
      <Typography paragraph style={{ width: 1200 }}>
        Sun Graph can be customized and has a set of capabilities which reacher
        your graph experience.
      </Typography>
      <TableContainer component={Paper}>
        <Table stickyHeader className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Input</TableCell>
              <TableCell align="left">Required\Optional</TableCell>
              <TableCell align="left">Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.isRequired}</TableCell>
                <TableCell align="left">{row.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}
