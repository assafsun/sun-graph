import React from "react";
import { Typography } from "@material-ui/core";

export function GettingStarted() {
  return (
    <section className="gettingStartedContent">
      <Typography
        paragraph
        variant="h4"
        style={{ fontSize: 24, fontWeight: 600 }}
      >
        Introduction
      </Typography>
      <Typography paragraph style={{ width: 1200 }}>
        Inspried by swimlane/ngx-graph, sun-graph is a react component for
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
        How to start building graphs?
      </Typography>
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
        The minimum input that SunGraph needs in order to load the graph is the
        information on the nodes and links.
      </Typography>
      <Typography paragraph style={{ width: 1200 }}>
        Graph Node - Repersent by the 'Node' class, we need to create the amount
        of nodes which the required field is the id. Once all the nodes objects
        are ready, pass them to the input props - nodes.
      </Typography>
      <Typography paragraph style={{ width: 1200 }}>
        Graph Link - Repersent by the 'Link' class, we need to create the links
        which will connect existing nodes. Each link object must have the
        'source' attribute and 'destination' which contains the nodes ids. Once
        all the link objects are ready, pass them to the input props - link.
      </Typography>
      <Typography paragraph style={{ width: 1200 }}>
        Check the default graph example
      </Typography>
      <Typography
        paragraph
        variant="h4"
        style={{ fontSize: 24, fontWeight: 600 }}
      >
        SunGraph Component Inputs
      </Typography>
    </section>
  );
}
