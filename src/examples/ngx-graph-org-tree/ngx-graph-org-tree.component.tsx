import React, { ReactNode } from "react";
import { Layout } from "../../components/models/layout.model";
import { Node } from "../../components/models/node.model";
import { Edge } from "../../components/models/edge.model";
import { DagreNodesOnlyLayout } from "./customDagreNodesOnly";
import * as shape from "d3-shape";

import { ReactGraph } from "../../components/graph/react-graph";

import "./ngx-graph-org-tree.component.scss";

export class Employee {
  id: string;
  name: string;
  office: string;
  role: string;
  backgroundColor: string;
  upperManagerId?: string;
}

export class NgxGraphOrgTreeComponent extends React.Component {
  public employees: Employee[] = [];
  public nodes: Node[] = [];
  public links: Edge[] = [];
  public layoutSettings = {
    orientation: "TB",
  };
  public curve: any = shape.curveLinear;
  public layout: Layout = new DagreNodesOnlyLayout();

  constructor() {
    super({});
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
  }

  render() {
    return (
      <ReactGraph
        defsTemplate={<svg>assaf</svg>}
        nodes={this.nodes}
        links={this.links}
        nodeUI={(node: any) => this.nodeUI(node)}
        layout={new DagreNodesOnlyLayout()}
        curve={(line: any) => shape.curveLinear(line)}
        nodeWidth={150}
        nodeHeight={100}
        panningEnabled={true}
        enableZoom={true}
        zoomSpeed={0.1}
      ></ReactGraph>
    );
  }

  public nodeUI(node: any) {
    return (
      <svg>
        <g
          className="node"
          xmlns="http://www.w3.org/2000/xhtml"
          width="150"
          height="100"
        >
          <foreignObject
            width="150"
            height="100"
            xmlns="http://www.w3.org/2000/xhtml"
          >
            <div className="cardContainer">
              <label className="name">Label1</label>
              <label>Role</label>
              <label>test</label>
            </div>
          </foreignObject>
        </g>
      </svg>
    );
  }

  // view={[800, 500]}
  // links={this.links}
  // [nodes]="nodes"
  // [curve]="curve"
  // [layout]="layout"
  // [nodeWidth]=150
  // [nodeHeight]=100
  // [layoutSettings]="layoutSettings"
  // [enableZoom]="true"
  // [autoZoom]="true"

  //   <ng-template #defsTemplate>
  //   <svg:marker id="arrow" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="4" markerHeight="4" orient="auto">
  //     <svg:path d="M0,-5L10,0L0,5" class="arrow-head" />
  //   </svg:marker>
  // </ng-template>

  // <ng-template #nodeTemplate let-node>
  //   <svg:g class="node" xmlns="http://www.w3.org/2000/xhtml" width="150" height="100">
  //     <svg:foreignObject width="150" height="100">
  //       <xhtml:div class="cardContainer" xmlns="http://www.w3.org/1999/xhtml" [ngStyle]=getStyles(node)>
  //         <label class="name">{{node.label}}</label>
  //         <label>{{node.data.role}}</label>
  //         <label>{{node.data.office}}</label>
  //       </xhtml:div>
  //     </svg:foreignObject>
  //   </svg:g>
  // </ng-template>

  // <ng-template #linkTemplate let-link>
  //   <svg:g class="edge">
  //     <svg:path class="line" stroke-width="2" marker-end="url(#arrow)">
  //     </svg:path>
  //     <svg:text class="edge-label" text-anchor="middle">
  //       <textPath class="text-path" [attr.href]="'#' + link.id" [style.dominant-baseline]="link.dominantBaseline" startOffset="50%">{{link.label}}</textPath>
  //     </svg:text>
  //   </svg:g>
  //   <svg:g class="linkMidpoint" *ngIf="link.midPoint"
  //          [attr.transform]="'translate(' + (link.midPoint.x) + ',' + (link.midPoint.y) + ')'">
  //     <ellipse rx="30" ry="10" />
  //     <svg:text alignment-baseline="central">{{ link.data.linkText }}</svg:text>
  // </svg:g>
  // </ng-template>

  public getStyles(node: Node): any {
    return {
      "background-color": node.data.backgroundColor,
    };
  }
}
