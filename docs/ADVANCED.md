# Advanced Features Guide

Comprehensive guide for advanced SunGraph features and best practices.

## Table of Contents

1. [Custom Layouts](#custom-layouts)
2. [Event Handlers](#event-handlers)
3. [Performance Optimization](#performance-optimization)
4. [Advanced Styling](#advanced-styling)
5. [Best Practices](#best-practices)

---

## Custom Layouts

### Creating a Custom Layout

Implement the `Layout` interface to create custom positioning algorithms:

```typescript
import { Layout, Graph, Node, Edge } from 'sun-graph/layout.model';

export class MyCustomLayout implements Layout {
  settings?: any;

  run(graph: Graph): Graph {
    // Your positioning algorithm here
    // Must set position for each node
    return graph;
  }

  updateEdge(graph: Graph, edge: Edge): Graph {
    // Called when a node is dragged
    // Update edge paths as needed
    return graph;
  }

  onDragStart?(draggingNode: Node, $event: MouseEvent): void {
    console.log('Started dragging:', draggingNode);
  }

  onDrag?(draggingNode: Node, $event: MouseEvent): void {
    console.log('Dragging:', draggingNode);
  }

  onDragEnd?(draggingNode: Node, $event: MouseEvent): void {
    console.log('Finished dragging:', draggingNode);
  }
}
```

### Example 1: Circle Layout

Arrange nodes in a perfect circle:

```typescript
import { Layout, Graph, Node, Edge } from 'sun-graph/layout.model';

export class CircleLayout implements Layout {
  settings = { radius: 200 };

  run(graph: Graph): Graph {
    const nodeCount = graph.nodes.length;
    const radius = this.settings.radius;
    const centerX = 0;
    const centerY = 0;

    graph.nodes.forEach((node, index) => {
      const angle = (index / nodeCount) * Math.PI * 2;
      node.position = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });

    return graph;
  }

  updateEdge(graph: Graph, edge: Edge): Graph {
    return graph;
  }
}
```

### Example 2: Grid Layout

Arrange nodes in a grid pattern:

```typescript
export class GridLayout implements Layout {
  settings = { 
    cols: 3,
    rowSpacing: 150,
    colSpacing: 150
  };

  run(graph: Graph): Graph {
    const { cols, rowSpacing, colSpacing } = this.settings;
    
    graph.nodes.forEach((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      node.position = {
        x: col * colSpacing,
        y: row * rowSpacing
      };
    });

    return graph;
  }

  updateEdge(graph: Graph, edge: Edge): Graph {
    return graph;
  }
}
```

### Example 3: Force-Directed Layout

Simple force-directed layout simulation:

```typescript
export class ForceDirectedLayout implements Layout {
  settings = {
    nodeRepulsion: 50,
    edgeLength: 100,
    iterations: 50
  };

  run(graph: Graph): Graph {
    // Initialize random positions
    graph.nodes.forEach(node => {
      if (!node.position) {
        node.position = {
          x: Math.random() * 500 - 250,
          y: Math.random() * 500 - 250
        };
      }
    });

    // Run force simulation
    const { nodeRepulsion, edgeLength, iterations } = this.settings;
    
    for (let i = 0; i < iterations; i++) {
      const forces: { [key: string]: { x: number; y: number } } = {};

      // Initialize forces
      graph.nodes.forEach(node => {
        forces[node.id] = { x: 0, y: 0 };
      });

      // Repulsion forces (node-to-node)
      for (let j = 0; j < graph.nodes.length; j++) {
        for (let k = j + 1; k < graph.nodes.length; k++) {
          const nodeA = graph.nodes[j];
          const nodeB = graph.nodes[k];
          const dx = nodeB.position!.x - nodeA.position!.x;
          const dy = nodeB.position!.y - nodeA.position!.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = nodeRepulsion / (distance * distance);

          forces[nodeA.id].x -= (force * dx) / distance;
          forces[nodeA.id].y -= (force * dy) / distance;
          forces[nodeB.id].x += (force * dx) / distance;
          forces[nodeB.id].y += (force * dy) / distance;
        }
      }

      // Attraction forces (edges)
      graph.edges.forEach(edge => {
        const source = graph.nodes.find(n => n.id === edge.source)!;
        const target = graph.nodes.find(n => n.id === edge.target)!;
        const dx = target.position!.x - source.position!.x;
        const dy = target.position!.y - source.position!.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (distance - edgeLength) / 100;

        forces[source.id].x += force * (dx / distance);
        forces[source.id].y += force * (dy / distance);
        forces[target.id].x -= force * (dx / distance);
        forces[target.id].y -= force * (dy / distance);
      });

      // Update positions
      graph.nodes.forEach(node => {
        node.position!.x += forces[node.id].x * 0.1;
        node.position!.y += forces[node.id].y * 0.1;
      });
    }

    return graph;
  }

  updateEdge(graph: Graph, edge: Edge): Graph {
    return graph;
  }
}
```

---

## Event Handlers

### Node Click Handler

Respond to node clicks:

```typescript
const [selectedNode, setSelectedNode] = useState<Node | null>(null);

<SunGraph
  graph={graph}
  layout={layout}
  onNodeClick={(node) => {
    setSelectedNode(node);
    console.log('Clicked node:', node);
  }}
/>
```

### Node Double-Click Handler

Handle double-click events:

```typescript
const handleNodeDoubleClick = (node: Node) => {
  console.log('Double-clicked node:', node);
  // Edit mode, expand details, etc.
};

<SunGraph
  graph={graph}
  layout={layout}
  onNodeDoubleClick={handleNodeDoubleClick}
/>
```

### Edge Click Handler

Respond to edge clicks:

```typescript
const handleEdgeClick = (edge: Edge) => {
  console.log('Clicked edge:', edge);
  // Show edge details, modify edge, etc.
};

<SunGraph
  graph={graph}
  layout={layout}
  onEdgeClick={handleEdgeClick}
/>
```

### Combined Event Handling

```typescript
export function InteractiveGraph() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  return (
    <SunGraph
      graph={graph}
      layout={layout}
      onNodeClick={(node) => {
        setSelectedNode(node);
        setSelectedEdge(null);
      }}
      onEdgeClick={(edge) => {
        setSelectedEdge(edge);
        setSelectedNode(null);
      }}
    />
  );
}
```

---

## Performance Optimization

### 1. Memoization

Prevent unnecessary re-renders:

```typescript
import React, { memo } from 'react';

const NodeTemplate = memo(({ node }: { node: Node }) => (
  <div>
    <strong>{node.label}</strong>
  </div>
), (prev, next) => prev.node.id === next.node.id);
```

### 2. Lazy Node Templates

Only render what's visible:

```typescript
const nodes = largeNodeSet.map(node => ({
  ...node,
  template: (n: Node) => {
    // Only render complex template if visible
    if (isNodeVisible(n)) {
      return <ComplexNodeTemplate node={n} />;
    }
    return <SimpleNodeTemplate node={n} />;
  }
}));
```

### 3. Graph Simplification

For very large graphs, simplify the visualization:

```typescript
// For initial render, use simplified version
const simplifiedGraph = {
  nodes: graph.nodes.slice(0, 100),
  edges: graph.edges.filter(e => 
    graph.nodes.slice(0, 100).some(n => n.id === e.source || n.id === e.target)
  )
};

<SunGraph
  graph={simplifiedGraph}
  layout={layout}
/>
```

### 4. Debouncing Updates

Debounce frequent graph updates:

```typescript
import { debounce } from 'lodash';

const updateGraphDebounced = debounce((newGraph: Graph) => {
  setGraph(newGraph);
}, 300);
```

---

## Advanced Styling

### Dynamic Node Colors

Color nodes based on data:

```typescript
const nodeTemplate = (node: Node) => {
  const getColor = (data: any) => {
    if (data?.status === 'active') return '#4CAF50';
    if (data?.status === 'inactive') return '#999';
    if (data?.status === 'error') return '#f44336';
    return '#2196F3';
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: getColor(node.data),
      borderRadius: '8px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {node.label}
    </div>
  );
};
```

### Animated Nodes

```typescript
import styled from 'styled-components';

const AnimatedNode = styled.div`
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const nodeTemplate = (node: Node) => (
  <AnimatedNode>{node.label}</AnimatedNode>
);
```

### Gradient Backgrounds

```typescript
const GradientNode = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
  height: 100%;
`;
```

---

## Best Practices

### 1. Use Meaningful Node IDs

```typescript
// ✅ Good
const node: Node = {
  id: 'user-12345',
  label: 'John Doe'
};

// ❌ Avoid
const node: Node = {
  id: '1',
  label: 'John Doe'
};
```

### 2. Set Appropriate Dimensions

```typescript
// ✅ Good - sized appropriately for content
const node: Node = {
  id: 'node-1',
  label: 'A longer label with more text',
  width: 150,
  height: 100
};

// ❌ Avoid - too small for content
const node: Node = {
  id: 'node-1',
  label: 'A longer label with more text',
  width: 80,
  height: 60
};
```

### 3. Organize Data Properly

```typescript
// ✅ Good - structured data
const node: Node = {
  id: 'user-1',
  label: 'Alice',
  data: {
    role: 'Manager',
    department: 'Engineering',
    email: 'alice@example.com'
  }
};
```

### 4. Use Consistent Styling

```typescript
// ✅ Good - reusable styled components
const NodeContainer = styled.div`...`;

const nodes = data.map(item => ({
  id: item.id,
  template: () => <NodeContainer>{item.label}</NodeContainer>
}));
```

### 5. Handle Large Datasets

```typescript
// ✅ Good - paginate or filter for large datasets
const MAX_NODES = 500;

if (nodes.length > MAX_NODES) {
  console.warn(`Graph has ${nodes.length} nodes, truncating to ${MAX_NODES}`);
  nodes = nodes.slice(0, MAX_NODES);
}
```

### 6. Test Your Layouts

```typescript
// ✅ Good - validate layout output
class CustomLayout implements Layout {
  run(graph: Graph): Graph {
    // ... positioning logic
    
    // Validate all nodes have positions
    if (!graph.nodes.every(n => n.position)) {
      throw new Error('Layout failed to position all nodes');
    }
    
    return graph;
  }
}
```

### 7. Use Callbacks Effectively

```typescript
// ✅ Good - handle user interactions meaningfully
const handleNodeClick = useCallback((node: Node) => {
  updateSelectedNode(node.id);
  logAnalytics('node_clicked', { nodeId: node.id });
}, []);
```

### 8. Manage State Updates

```typescript
// ✅ Good - batch state updates
const handleGraphUpdate = useCallback((newData: any) => {
  setGraph(newData.graph);
  setMetadata(newData.metadata);
}, []);

// ❌ Avoid - multiple state updates
const handleGraphUpdate = (newData: any) => {
  setGraph(newData.graph);
  setMetadata(newData.metadata);  // Causes re-render
  setStatus('loaded');            // Another re-render
};
```

---

## Summary

- **Custom Layouts**: Implement the Layout interface for custom positioning
- **Events**: Use click handlers for interactivity
- **Performance**: Memoize, debounce, and simplify for large graphs
- **Styling**: Leverage styled-components for consistent theming
- **Best Practices**: Use meaningful IDs, proper dimensions, and structured data

