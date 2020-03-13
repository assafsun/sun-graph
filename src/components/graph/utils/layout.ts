import { Layout } from "../../models/layout.model";
import { DagreLayout } from "./../layouts/dagre";
import { DagreClusterLayout } from "./../layouts/dagreCluster";
import { DagreNodesOnlyLayout } from "./../layouts/dagreNodesOnly";
import { D3ForceDirectedLayout } from "./../layouts/d3ForceDirected";
import { ColaForceDirectedLayout } from "./../layouts/colaForceDirected";

const layouts: any = {
  dagre: DagreLayout,
  dagreCluster: DagreClusterLayout,
  dagreNodesOnly: DagreNodesOnlyLayout,
  d3ForceDirected: D3ForceDirectedLayout,
  colaForceDirected: ColaForceDirectedLayout
};

export class LayoutService {
  getLayout(name: string): Layout {
    if (layouts[name]) {
      return new layouts[name]();
    } else {
      throw new Error(`Unknown layout type '${name}'`);
    }
  }
}
