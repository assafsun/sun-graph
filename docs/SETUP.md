# SunGraph Setup Guide

A complete guide to installing, configuring, and getting started with SunGraph.

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Basic Example](#basic-example)
4. [Advanced Example](#advanced-example)
5. [Configuration](#configuration)
6. [Troubleshooting](#troubleshooting)

---

## Installation

### Prerequisites

- **Node.js** 12.0+
- **React** 16.8.0+ (with React Hooks support)
- **npm** or **yarn**

### Step 1: Install Package

Using npm:
```bash
npm install sun-graph
```

Using yarn:
```bash
yarn add sun-graph
```

### Step 2: Import Components

In your React component:

```typescript
import { SunGraph, LineShape } from "sun-graph";
import { Node, Edge, Graph } from "sun-graph/graph.model";
import { CustomDagreLayout } from "sun-graph/layout.model";
```

### Step 3: Create Styles

SunGraph works best with a minimal CSS reset. Add to your global styles:

```css
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}

* {
  box-sizing: border-box;
}
```

---

## Quick Start

Here's the minimal code to display a graph:

```typescript
import React from 'react';
import { SunGraph } from 'sun-graph';
import { Node, Edge, Graph } from 'sun-graph/graph.model';
import { CustomDagreLayout } from 'sun-graph/layout.model';

export function MyGraph() {
  // Define nodes
  const nodes: Node[] = [
    { id: '1', label: 'Node A', width: 100, height: 100 },
    { id: '2', label: 'Node B', width: 100, height: 100 },
    { id: '3', label: 'Node C', width: 100, height: 100 }
  ];

  // Define edges
  const edges: Edge[] = [
    { source: '1', target: '2' },
    { source: '2', target: '3' }
  ];

  // Create graph
  const graph: Graph = { nodes, edges };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <SunGraph
        graph={graph}
        layout={new CustomDagreLayout()}
        autoCenter={true}
        enableZoom={true}
        enablePanning={true}
      />
    </div>
  );
}
```

---

## Basic Example

A simple organization chart visualization:

```typescript
import React from 'react';
import { SunGraph } from 'sun-graph';
import { Node, Edge, Graph } from 'sun-graph/graph.model';
import { CustomDagreLayout } from 'sun-graph/layout.model';

export function OrganizationChart() {
  const nodes: Node[] = [
    { id: 'ceo', label: 'CEO', width: 100, height: 100 },
    { id: 'cto', label: 'CTO', width: 100, height: 100 },
    { id: 'cfo', label: 'CFO', width: 100, height: 100 },
    { id: 'eng1', label: 'Engineer 1', width: 100, height: 100 },
    { id: 'eng2', label: 'Engineer 2', width: 100, height: 100 }
  ];

  const edges: Edge[] = [
    { source: 'ceo', target: 'cto', label: 'manages' },
    { source: 'ceo', target: 'cfo', label: 'manages' },
    { source: 'cto', target: 'eng1', label: 'manages' },
    { source: 'cto', target: 'eng2', label: 'manages' }
  ];

  const graph: Graph = { nodes, edges };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <SunGraph
        graph={graph}
        layout={new CustomDagreLayout()}
        autoCenter={true}
      />
    </div>
  );
}
```

---

## Advanced Example

With custom styling and event handlers:

```typescript
import React, { useState } from 'react';
import { SunGraph, LineShape } from 'sun-graph';
import { Node, Edge, Graph } from 'sun-graph/graph.model';
import { CustomDagreLayout } from 'sun-graph/layout.model';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const GraphContainer = styled.div`
  flex: 1;
  position: relative;
`;

const InfoPanel = styled.div`
  width: 300px;
  padding: 20px;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  overflow-y: auto;
`;

export function AdvancedGraph() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Custom node template
  const customNodeTemplate = (node: Node) => (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '10px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        boxShadow: selectedNode?.id === node.id ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
      }}
    >
      {node.label}
    </div>
  );

  const nodes: Node[] = [
    { 
      id: '1', 
      label: 'Service A', 
      width: 120, 
      height: 100,
      template: customNodeTemplate,
      data: { type: 'service', status: 'active' }
    },
    { 
      id: '2', 
      label: 'Service B', 
      width: 120, 
      height: 100,
      template: customNodeTemplate,
      data: { type: 'service', status: 'active' }
    },
    { 
      id: '3', 
      label: 'Database', 
      width: 120, 
      height: 100,
      template: customNodeTemplate,
      data: { type: 'database', status: 'active' }
    }
  ];

  const edges: Edge[] = [
    { source: '1', target: '2', label: 'calls' },
    { source: '1', target: '3', label: 'queries' },
    { source: '2', target: '3', label: 'queries' }
  ];

  const graph: Graph = { nodes, edges };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  return (
    <Container>
      <GraphContainer>
        <SunGraph
          graph={graph}
          layout={new CustomDagreLayout()}
          curve={LineShape.CurveLinear}
          enableZoom={true}
          enablePanning={true}
          autoCenter={true}
          onNodeClick={handleNodeClick}
        />
      </GraphContainer>
      
      <InfoPanel>
        <h3>Node Details</h3>
        {selectedNode ? (
          <div>
            <p><strong>ID:</strong> {selectedNode.id}</p>
            <p><strong>Label:</strong> {selectedNode.label}</p>
            <p><strong>Type:</strong> {selectedNode.data?.type}</p>
            <p><strong>Status:</strong> {selectedNode.data?.status}</p>
          </div>
        ) : (
          <p>Click a node to see details</p>
        )}
      </InfoPanel>
    </Container>
  );
}
```

---

## Configuration

### SunGraph Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `graph` | `Graph` | Required | Graph data containing nodes and edges |
| `layout` | `Layout` | Required | Layout algorithm for positioning nodes |
| `curve` | `D3Curve` | `curveLinear` | D3 curve shape for edge paths |
| `nodeWidth` | `number` | `100` | Default width for nodes without explicit width |
| `nodeHeight` | `number` | `100` | Default height for nodes without explicit height |
| `enableZoom` | `boolean` | `true` | Allow mouse wheel zooming |
| `enablePanning` | `boolean` | `true` | Allow dragging canvas |
| `panningAxis` | `PanningAxis` | `Both` | Restrict panning direction |
| `autoCenter` | `boolean` | `false` | Auto-center graph on initial render |
| `onNodeClick` | `function` | - | Callback when node is clicked |
| `onNodeDoubleClick` | `function` | - | Callback when node is double-clicked |
| `onEdgeClick` | `function` | - | Callback when edge is clicked |

### Example Configuration

```typescript
<SunGraph
  graph={graph}
  layout={new CustomDagreLayout()}
  curve={LineShape.BundleLine}
  nodeWidth={120}
  nodeHeight={100}
  enableZoom={true}
  enablePanning={true}
  panningAxis={PanningAxis.Both}
  autoCenter={true}
  onNodeClick={(node) => console.log('Clicked node:', node)}
  onEdgeClick={(edge) => console.log('Clicked edge:', edge)}
/>
```

---

## Line Shape Options

SunGraph supports different D3 curve shapes for edges:

```typescript
import { LineShape } from 'sun-graph';

// Available options:
LineShape.CurveLinear        // Straight lines
LineShape.BundleLine         // Curved, bundled lines
LineShape.CurveNatural       // Natural curve interpolation
LineShape.CurveMonotoneX     // Smooth monotone curves
LineShape.CurveCardinal      // Smooth cardinal curves
```

### Visual Comparison

```typescript
// Linear edges - for simple, clear paths
<SunGraph graph={graph} layout={layout} curve={LineShape.CurveLinear} />

// Bundle edges - for complex relationships
<SunGraph graph={graph} layout={layout} curve={LineShape.BundleLine} />

// Smooth curves - for aesthetic appeal
<SunGraph graph={graph} layout={layout} curve={LineShape.CurveCardinal} />
```

---

## Layout Algorithms

### Built-in: CustomDagreLayout

Hierarchical layout using the Dagre algorithm. Best for organizational charts, flowcharts, and dependency graphs.

```typescript
import { CustomDagreLayout } from 'sun-graph/layout.model';

const layout = new CustomDagreLayout();
layout.settings = {
  // Dagre configuration options
  rankdir: 'TB',  // Top to bottom
  align: 'UL',    // Upper left
  nodesep: 50,    // Node separation
  ranksep: 50     // Rank separation
};
```

### Creating Custom Layouts

Implement the `Layout` interface for specialized positioning:

```typescript
import { Layout, Graph, Node, Edge } from 'sun-graph/layout.model';

export class CircleLayout implements Layout {
  settings = { radius: 200 };

  run(graph: Graph): Graph {
    const nodeCount = graph.nodes.length;
    const radius = this.settings.radius;

    graph.nodes.forEach((node, index) => {
      const angle = (index / nodeCount) * Math.PI * 2;
      node.position = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      };
    });

    return graph;
  }

  updateEdge(graph: Graph, edge: Edge): Graph {
    // Update edge paths when nodes move
    return graph;
  }
}
```

---

## Common Issues & Solutions

### Graph Not Displaying

**Problem:** Graph renders but no nodes are visible.

**Solutions:**
1. Check that `autoCenter={true}` is set
2. Verify node dimensions are set: `width` and `height`
3. Ensure layout is properly initialized
4. Check browser console for errors

### Performance with Large Graphs

**Problem:** Graph is slow with 100+ nodes.

**Solutions:**
1. Use `CustomDagreLayout` - it's optimized for large graphs
2. Reduce node dimensions
3. Implement virtual scrolling for very large datasets
4. Consider clustering related nodes

### Styling Issues

**Problem:** Custom templates aren't showing styles correctly.

**Solution:** Ensure CSS is scoped properly. If using styled-components:

```typescript
import styled from 'styled-components';

const StyledNode = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
`;

const node: Node = {
  id: '1',
  template: () => <StyledNode>Node Content</StyledNode>
};
```

### Events Not Firing

**Problem:** `onNodeClick` not being called.

**Solutions:**
1. Make sure handler is passed as prop
2. Verify nodes are clickable (not blocked by CSS)
3. Check that template isn't preventing click propagation

---

## Next Steps

- Read the [API Documentation](./API.md) for detailed interface reference
- Check out [Examples](../src/portal/) for real-world usage patterns
- Review [Custom Layouts](./LAYOUTS.md) guide
- Explore [Best Practices](./BEST_PRACTICES.md)

