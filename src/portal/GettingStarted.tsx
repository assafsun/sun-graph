import React from "react";
import { Typography } from "@material-ui/core";

import styled from "styled-components";

const DefaultWidth: number = 1200;

const GraphBuilding = styled.section`
  margin-left: 48px;
`;

const GettingStartedContainer = styled.section`
  margin: 12px 0 0 12px;
`;

export function GettingStarted() {
  return (
    <GettingStartedContainer>
      <Typography
        paragraph
        variant="h4"
        style={{ fontSize: 24, fontWeight: 600 }}
      >
        ➣ Introduction
      </Typography>
      <Typography paragraph style={{ width: DefaultWidth }}>
        Inspired by swimlane/ngx-graph, 'sun graph' is a react component for
        creating beautiful graph visualization.
      </Typography>
      <Typography paragraph style={{ width: DefaultWidth }}>
        'sun graph' will help you to build beautiful graphs in a simple way and
        to create your own custom graph shapes with your own data.
      </Typography>
      <Typography
        paragraph
        variant="h4"
        style={{ fontSize: 24, fontWeight: 600 }}
      >
        ➣ How to start building graphs?
      </Typography>
      <GraphBuilding>
        <Typography
          variant="caption"
          paragraph
          style={{ fontSize: 20, fontWeight: 600 }}
        >
          Import sun graph package to your project
        </Typography>
        <Typography paragraph style={{ width: DefaultWidth }}>
          1. Install sun graph package by running the following command: 'yarn
          add sun-graph' or 'npm install sun-graph'
        </Typography>
        <Typography paragraph style={{ width: DefaultWidth }}>
          2. Import SunGraph component into your react component from sun-graph.
        </Typography>
        <Typography
          variant="caption"
          paragraph
          style={{ fontSize: 20, fontWeight: 600 }}
        >
          Import your data and Build your graph.
        </Typography>
        <Typography paragraph style={{ width: DefaultWidth }}>
          Load sun graph component in your React component.
        </Typography>
        <Typography paragraph style={{ width: DefaultWidth }}>
          The minimum input that sun graph require in order to load a graph is
          the information on your nodes and links.
        </Typography>
        <Typography paragraph style={{ width: DefaultWidth }}>
          Node - represented by the 'Node' class. We need to create an array of
          nodes where each node must at least contain an id property. Once the
          nodes array is ready, pass them to the nodes input props.
        </Typography>
        <Typography paragraph style={{ width: DefaultWidth }}>
          Link - represented by the 'Link' class. We need to create an array of
          links which will connect existing nodes. Each link object must have a
          'source' property and 'destination' property with a node id. Once the
          links array us ready, pass them to the links input props.
        </Typography>
      </GraphBuilding>
    </GettingStartedContainer>
  );
}
