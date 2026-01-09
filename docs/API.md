# SunGraph API Documentation

## Overview

SunGraph is a React component for creating beautiful, interactive graph visualizations. This guide documents all the core APIs and interfaces.

---

## Table of Contents

1. [Graph Model](#graph-model)
2. [Node Interface](#node-interface)
3. [Edge Interface](#edge-interface)
4. [Layout Interface](#layout-interface)
5. [SunGraph Component Props](#sungraph-component-props)
6. [Enums](#enums)

---

## Graph Model

### `Graph`

The main data structure representing a complete graph visualization.

```typescript
interface Graph {
  edges: Edge[];           // Array of edges connecting nodes
  nodes: Node[];           // Array of nodes in the graph
  edgeLabels?: any;        // Optional edge label configuration
}
```

**Example:**
```typescript
const graph: Graph = {
  nodes: [
    { id: "1", label: "Node 1", width: 100, height: 100 },
    { id: "2", label: "Node 2", width: 100, height: 100 }
  ],
  edges: [
    { source: "1", target: "2", label: "connects to" }
  ]
};
```

---

## Node Interface

### `Node`

Represents a single node (vertex) in the graph.

```typescript
interface Node {
  id: string;                                    // Unique identifier (required)
  template?: (node: Node) => React.ReactNode;   // Custom render function
  width?: number;                                // Node width in pixels (default: 100)
  height?: number;                               // Node height in pixels (default: 100)
  label?: string;                                // Display label/text
  transform?: string;                            // SVG transform string (position)
  data?: any;                                    // Custom data object
  position?: NodePosition;                       // x, y coordinates
}

interface NodePosition {
  x: number;  // X coordinate
  y: number;  // Y coordinate
}
```

**Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier for the node |
| `label` | string | ❌ | Display text shown on the node |
| `width` | number | ❌ | Width in pixels (default: 100) |
| `height` | number | ❌ | Height in pixels (default: 100) |
| `template` | function | ❌ | Custom React render function for node content |
| `position` | NodePosition | ❌ | x, y coordinates (auto-calculated by layout) |
| `transform` | string | ❌ | SVG transform (used internally) |
| `data` | any | ❌ | Custom metadata object |

**Examples:**

### Basic Node
```typescript
const basicNode: Node = {
  id: "user-1",
  label: "John Doe",
  width: 120,
  height: 80
};
```

### Node with Custom Template
```typescript
const customNode: Node = {
  id: "user-2",
  width: 100,
  height: 100,
  template: (node) => (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      background: '#548d96',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <strong>{node.label}</strong>
    </div>
  ),
  data: { 
    role: "Manager",
    department: "Sales"
  }
};
```

### Node with Data
```typescript
const dataNode: Node = {
  id: "api-endpoint",
  label: "API Server",
  data: {
    url: "https://api.example.com",
    type: "backend",
    status: "active"
  }
};
```

---

## Edge Interface

### `Edge`

Represents a connection between two nodes.

```typescript
interface Edge {
  id?: string;                                    // Optional unique identifier
  source: string;                                 // Source node ID (required)
  target: string;                                 // Target node ID (required)
  label?: string;                                 // Display label on edge
  data?: any;                                     // Custom data object
  points?: any;                                   // Calculated path points (auto-set by layout)
  line?: string;                                  // SVG path string (auto-calculated)
  midPoint?: NodePosition;                        // Center point of the edge
  midPointTemplate?: (link: Edge) => React.ReactNode; // Custom label template
}
```

**Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `source` | string | ✅ | ID of the source (start) node |
| `target` | string | ✅ | ID of the target (end) node |
| `id` | string | ❌ | Unique identifier (auto-generated if not provided) |
| `label` | string | ❌ | Text displayed on/near the edge |
| `midPointTemplate` | function | ❌ | Custom React render for edge label |
| `data` | any | ❌ | Custom metadata object |
| `line` | string | ❌ | SVG path (calculated by layout) |
| `points` | any | ❌ | Path waypoints (calculated by layout) |
| `midPoint` | NodePosition | ❌ | Center point (calculated by layout) |

**Examples:**

### Basic Edge
```typescript
const basicEdge: Edge = {
  source: "user-1",
  target: "user-2",
  label: "reports to"
};
```

### Edge with Custom Label Template
```typescript
const customEdge: Edge = {
  source: "server-1",
  target: "database",
  midPointTemplate: (edge) => (
    <div style={{
      background: '#f0f0f0',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px'
    }}>
      {edge.label}
    </div>
  ),
  label: "queries"
};
```

### Edge with Data
```typescript
const dataEdge: Edge = {
  source: "api-1",
  target: "api-2",
  label: "calls",
  data: {
    protocol: "HTTP",
    latency: "45ms",
    bandwidth: "10Mbps"
  }
};
```

---

## Layout Interface

### `Layout`

Defines how nodes are positioned in the graph. Implement this interface to create custom layouts.

```typescript
interface Layout {
  settings?: any;                                    // Layout-specific configuration
  run(graph: Graph): Graph;                          // Calculate node positions
  updateEdge(graph: Graph, edge: Edge): Graph;      // Update edge when node moves
  onDragStart?(draggingNode: Node, $event: MouseEvent): void;  // Drag start handler
  onDrag?(draggingNode: Node, $event: MouseEvent): void;       // Drag handler
  onDragEnd?(draggingNode: Node, $event: MouseEvent): void;    // Drag end handler
}
```

**Methods:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `run` | `graph: Graph` | `Graph` | Main layout algorithm - positions all nodes |
| `updateEdge` | `graph: Graph, edge: Edge` | `Graph` | Called when a node is dragged to update edge paths |
| `onDragStart` | `draggingNode: Node, $event: MouseEvent` | `void` | Optional - called when user starts dragging a node |
| `onDrag` | `draggingNode: Node, $event: MouseEvent` | `void` | Optional - called while node is being dragged |
| `onDragEnd` | `draggingNode: Node, $event: MouseEvent` | `void` | Optional - called when user finishes dragging |

**Built-in Layouts:**
- `CustomDagreLayout` - Hierarchical layout using Dagre algorithm

---

## SunGraph Component Props

### `SunGraph`

Main React component for rendering graphs.

```typescript
interface SunGraphProps {
  graph: Graph;                                // Graph data (required)
  layout: Layout;                              // Layout algorithm (required)
  nodeWidth?: number;                          // Default node width
  nodeHeight?: number;                         // Default node height
  curve?: any;                                 // D3 curve function for edges
  enableZoom?: boolean;                        // Enable mouse wheel zoom
  enablePanning?: boolean;                     // Enable pan/drag of canvas
  panningAxis?: PanningAxis;                   // Restrict panning direction
  autoCenter?: boolean;                        // Auto-center graph on load
  onNodeClick?: (node: Node) => void;          // Node click handler
  onEdgeClick?: (edge: Edge) => void;          // Edge click handler
  onNodeDoubleClick?: (node: Node) => void;    // Double-click handler
}
```

**Example:**
```typescript
import { SunGraph, LineShape } from "sun-graph";
import { CustomDagreLayout } from "sun-graph/layout.model";

<SunGraph
  graph={myGraph}
  layout={new CustomDagreLayout()}
  curve={LineShape.CurveLinear}
  enableZoom={true}
  enablePanning={true}
  autoCenter={true}
  onNodeClick={(node) => console.log("Clicked:", node)}
/>
```

---

## Enums

### `PanningAxis`

Restricts panning to specific directions.

```typescript
enum PanningAxis {
  Both = "both",              // Pan in any direction (default)
  Horizontal = "horizontal",  // Pan left/right only
  Vertical = "vertical"       // Pan up/down only
}
```

### `LineShape`

Available D3 curve shapes for edges.

```typescript
enum LineShape {
  CurveLinear = "curveLinear",
  BundleLine = "curveBundle",
  CurveNatural = "curveNatural",
  CurveMonotoneX = "curveMonotoneX",
  CurveCardinal = "curveCardinal"
}
```

---

## Common Patterns

### Creating a Graph
```typescript
import { Node, Edge, Graph } from "sun-graph/graph.model";
import { SunGraph } from "sun-graph";
import { CustomDagreLayout } from "sun-graph/layout.model";

const nodes: Node[] = [
  { id: "1", label: "Start", width: 100, height: 100 },
  { id: "2", label: "Process", width: 100, height: 100 },
  { id: "3", label: "End", width: 100, height: 100 }
];

const edges: Edge[] = [
  { source: "1", target: "2", label: "next" },
  { source: "2", target: "3", label: "complete" }
];

const graph: Graph = { nodes, edges };

// Render
<SunGraph
  graph={graph}
  layout={new CustomDagreLayout()}
  autoCenter={true}
/>
```

### Custom Node Styling
```typescript
const styledNode: Node = {
  id: "custom",
  width: 120,
  height: 100,
  template: (node) => (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '10px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 'bold'
    }}>
      {node.label}
    </div>
  )
};
```

---

## Tips & Best Practices

1. **Always provide unique node IDs** - IDs are used internally to track nodes
2. **Set appropriate dimensions** - Width/height affect layout calculations
3. **Use templates for complex content** - Templates allow full React component rendering
4. **Implement custom layouts** - Extend the Layout interface for specialized positioning
5. **Handle large graphs** - Consider performance with 100+ nodes
6. **Test interactions** - Ensure click handlers work correctly
7. **Use data property** - Store metadata without affecting rendering

