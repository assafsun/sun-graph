import React from "react";
import { Node } from "../../models/graph.model";
import { Edge } from "../../models/graph.model";
import * as shape from "d3-shape";

import { ReactGraph } from "../../GraphComponent/react-graph";

import "./BasicGraph.scss";
import { DagreLayout } from "../../layouts/dagre";
const logo = require("./logo.svg") as string;

export class Employee {
  id: string;
  name: string;
  office: string;
  role: string;
  backgroundColor: string;
  upperManagerId?: string;
}

export class BasicGraphComponent extends React.Component {
  public employees: Employee[] = [];
  public nodes: Node[] = [];
  public defTemplateUI: any;
  public links: Edge[] = [];
  public curve: any = shape.curveLinear;

  constructor(props: any) {
    super(props);
    this.employees = [
      {
        id: "1",
        name: "Employee 1",
        office: "Office 1",
        role: "Manager",
        backgroundColor: "#DC143C",
      },
      {
        id: "2",
        name: "Employee 2",
        office: "Office 2",
        role: "Engineer",
        backgroundColor: "#00FFFF",
        upperManagerId: "1",
      },
      {
        id: "3",
        name: "Employee 3",
        office: "Office 3",
        role: "Engineer",
        backgroundColor: "#00FFFF",
        upperManagerId: "1",
      },
      {
        id: "4",
        name: "Employee 4",
        office: "Office 4",
        role: "Engineer",
        backgroundColor: "#00FFFF",
        upperManagerId: "1",
      },
      {
        id: "5",
        name: "Employee 5",
        office: "Office 5",
        role: "Student",
        backgroundColor: "#8A2BE2",
        upperManagerId: "4",
      },
    ];

    for (const employee of this.employees) {
      const node: Node = {
        id: employee.id,
        label: employee.name,
        data: {
          office: employee.office,
          role: employee.role,
          backgroundColor: employee.backgroundColor,
        },
      };

      this.nodes.push(node);
    }

    for (const employee of this.employees) {
      if (!employee.upperManagerId) {
        continue;
      }

      const edge: Edge = {
        source: employee.upperManagerId,
        target: employee.id,
        label: "",
        data: {
          linkText: "Manager of",
        },
      };

      this.links.push(edge);
    }

    this.defTemplateUI = (
      <svg>
        <marker
          id="arrow"
          viewBox="0 -5 10 10"
          refX="8"
          refY="0"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M0,-5L10,0L0,5" className="arrow-head" />
        </marker>
      </svg>
    );

    this.state = {};
  }

  public nodeUI(node: any) {
    return (
      <svg>
        <g
          className="node"
          xmlns="http://www.w3.org/2000/xhtml"
          width="100"
          height="100"
        >
          <foreignObject
            width="100"
            height="100"
            xmlns="http://www.w3.org/2000/xhtml"
          >
            <div className="container">
              <label className="title">Title</label>
              <img src={logo} alt="logo" height="60" width="60"></img>
            </div>
          </foreignObject>
        </g>
      </svg>
    );
  }

  render() {
    return (
      <ReactGraph
        nodes={this.nodes}
        links={this.links}
        defsTemplate={() => this.defTemplateUI}
        nodeUI={(node: any) => this.nodeUI(node)}
        layout={new DagreLayout()}
        curve={shape.curveLinear}
        nodeWidth={100}
        nodeHeight={100}
        panningEnabled={true}
        enableZoom={true}
        zoomSpeed={0.1}
      ></ReactGraph>
    );
  }
}
