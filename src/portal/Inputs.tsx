import React from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { styled as muiStyled } from "@mui/material/styles";
import styled from "styled-components";

const DefaultWidth: number = 1200;

const InputsContainer = styled.section`
  margin: 12px 0 0 12px;
`;

function createData(name: any, isRequired: any, description: any) {
  return { name, isRequired, description };
}

const rows = [
  createData(
    "nodes",
    "Required",
    "The graph node's data, each node has its properties as defined in the node class, custom data should be inside the data attribute."
  ),
  createData(
    "links",
    "Required",
    "The graph link data, each link must define its source node id and target node id. Please note that each link may contain midPointTemplate for placing UI on the middle of the link."
  ),
  createData(
    "view",
    "Optional",
    "An array of two values for the graph width and height, the default value is the size of the its parent container"
  ),
  createData(
    "defaultNodeTemplate",
    "Optional",
    "Callback function which returns the node template UI, by default, the return node should return a proper HTML object. The node class can override this function for specific node template"
  ),
  createData(
    "isNodeTemplateHTML",
    "Optional",
    "If set to true, the expected return node template is a proper HTML element, otherwise it will expect a proper SVG element. default value: true"
  ),
  createData(
    "layout",
    "Optional",
    "Layout object will implement the Layout interface, the layout object will define the position of the nodes and links."
  ),
  createData(
    "curve",
    "Optional",
    "A line render function for drawing the line between the selected points between two nodes sun graph works by default with d3-shape and you can import the LineShape class which will help you with your line selection. For line shapes examples, please open http://bl.ocks.org/d3indepth/b6d4845973089bc1012dec1674d3aff8"
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
    "If set to true, the user will be able to position the graph. default value: false"
  ),
  createData(
    "enableZoom",
    "Optional",
    "If set to true, the user will be able to, zoom using the mouse wheel. default value: false"
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
    "If set to true, the graph will be rendered in the center of the view. default value: false"
  ),
  createData(
    "clickHandler",
    "Optional",
    "Callback function for listening to graph click event"
  ),
];

const StyledTable = muiStyled(Table)(({ theme }) => ({
  width: 1250,
  marginBottom: 60,
}));

export function Inputs() {
  return (
    <InputsContainer>
      <Typography
        paragraph
        variant="h4"
        style={{ fontSize: 24, fontWeight: 600 }}
      >
        ➣ Sun Graph Component Props
      </Typography>
      <Typography paragraph style={{ width: DefaultWidth }}>
        Sun Graph can be customized and has a set of capabilities which reacher
        your graph experience.
      </Typography>
      <TableContainer component={Paper}>
        <StyledTable stickyHeader>
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
        </StyledTable>
      </TableContainer>
    </InputsContainer>
  );
}
