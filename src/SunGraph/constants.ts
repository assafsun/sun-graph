/**
 * Default constants for SunGraph component
 */

export const DEFAULT_GRAPH_SIZE = 1000;
export const DEFAULT_NODE_SIZE = 60;

export const DEFAULT_ZOOM_SPEED = 0.1;
export const DEFAULT_MIN_ZOOM_LEVEL = 0.1;
export const DEFAULT_MAX_ZOOM_LEVEL = 3;

export const DEFAULT_HIGHLIGHT_COLOR = "#1976d2";
export const DEFAULT_SELECTED_COLOR = "#1976d2";
export const DEFAULT_DIMMED_OPACITY = 0.2;

export const ARROW_MARKER_CONFIG = {
  id: "arrow",
  viewBox: "0 -5 10 10",
  refX: 8,
  refY: 0,
  markerWidth: 4,
  markerHeight: 4,
  orient: "auto",
  path: "M0,-5L10,0L0,5",
};

// Layout constants
export const DEFAULT_DAGRE_CONFIG = {
  nodePadding: 50,
  edgePadding: 100,
  rankPadding: 100,
};
