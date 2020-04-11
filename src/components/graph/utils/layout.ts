import { Layout } from "../../models/layout.model";
import { DagreLayout } from "./../layouts/dagre";

const layouts: any = {
  dagre: DagreLayout,
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
