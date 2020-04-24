import React from "react";
import { Typography } from "@material-ui/core";

export function GettingStarted() {
  return (
    <section className="gettingStartedContent">
      <Typography paragraph style={{ fontSize: 24, fontWeight: 600 }}>
        Introduction
      </Typography>
      <Typography paragraph style={{ width: 1200 }} noWrap>
        Inspried by swimlane/ngx-graph, sun-graph is a react component for
        creating graph visualization.
      </Typography>
      <Typography paragraph style={{ fontSize: 24, fontWeight: 600 }}>
        sun-graph will help you to build beautiful graphs in a simple way.
      </Typography>
      <Typography paragraph style={{ fontSize: 24, fontWeight: 600 }}>
        How to start building graphs?
      </Typography>
      <Typography paragraph style={{ width: 1200 }}>
        1. Install sun-graph package by running
      </Typography>
      <Typography paragraph style={{ width: 1200 }}>
        2. Import sunGraph component into your react component
      </Typography>
      <Typography paragraph style={{ width: 1200 }}>
        3. Load sunGraph component in your react component.
      </Typography>
      <Typography paragraph style={{ fontSize: 24, fontWeight: 600 }}>
        Great! The component is imported and loaded but we don't see any graph
        visualization.
      </Typography>
      <Typography paragraph style={{ width: 1200 }}>
        We need to pass sunGraph component the graph information in order to see
        it. First, we will pass the nodes
      </Typography>
    </section>
  );
}
