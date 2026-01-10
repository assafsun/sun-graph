![sunGraph](https://user-images.githubusercontent.com/33118325/80518993-f3183500-898f-11ea-895e-129903b66b9e.jpg)

[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![npm version](http://img.shields.io/npm/v/sun-graph.svg?style=flat)](https://www.npmjs.com/package/sun-graph "View this project on npm")
![CI](https://github.com/assafsun/sun-graph/workflows/CI/badge.svg?branch=master) 
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg?logo=react&logoColor=61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6.svg?logo=typescript&logoColor=3178c6)](https://www.typescriptlang.org)
[![D3.js](https://img.shields.io/badge/D3.js-7+-f77f00.svg?logo=d3dotjs&logoColor=f77f00)](https://d3js.org)

# SunGraph - Beautiful Graph Visualization for React

Inspired by [swimlane/ngx-graph](https://github.com/swimlane/ngx-graph), **SunGraph** is a powerful React component for creating beautiful, interactive graph visualizations. Build stunning flowcharts, organizational charts, network diagrams, and more with minimal effort.

## ✨ Features

- 🎨 **Beautiful Visualizations** - Create stunning graph visualizations out of the box
- 🎯 **Interactive** - Zoom, pan, and drag nodes with smooth interactions
- 🧩 **Customizable** - Create custom node templates with full React component support
- 📐 **Flexible Layouts** - Use built-in layouts or create your own positioning algorithms
- 🎭 **Custom Styling** - Full control over node and edge styling
- 📦 **TypeScript Support** - Fully typed with comprehensive type definitions
- 🚀 **Performance** - Optimized for large graphs

## 📚 Documentation

- **[Setup Guide](./docs/SETUP.md)** - Installation and quick start
- **[API Documentation](./docs/API.md)** - Complete API reference
- **[Live Demo](https://assafsun.github.io/sun-graph/)** - Interactive examples
- **[Portal Examples](./src/portal/)** - Source code of example implementations

## 🚀 Quick Start

### Installation

Install SunGraph using npm or yarn:

```bash
npm install sun-graph
# or
yarn add sun-graph
```

### Basic Usage

```typescript
import React from 'react';
import { SunGraph } from 'sun-graph';
import { Node, Edge, Graph } from 'sun-graph/graph.model';
import { CustomDagreLayout } from 'sun-graph/layout.model';

function MyGraph() {
  const nodes: Node[] = [
    { id: '1', label: 'Node A', width: 100, height: 100 },
    { id: '2', label: 'Node B', width: 100, height: 100 },
    { id: '3', label: 'Node C', width: 100, height: 100 }
  ];

  const edges: Edge[] = [
    { source: '1', target: '2' },
    { source: '2', target: '3' }
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

export default MyGraph;
```

## 📖 Full Documentation Structure

### For Quick Learning
1. Start with the [Setup Guide](./docs/SETUP.md)
2. Try the examples in the [Portal](./src/portal/)
3. Explore the [API Documentation](./docs/API.md) for detailed reference

### Core Concepts

#### Nodes
Represent entities in your graph. Each node can have:
- Custom styling via templates
- Custom data
- Automatic positioning
- Interaction handlers

#### Edges  
Connections between nodes. Features include:
- Custom labels and styling
- Automatic path calculation
- Custom rendering

#### Layouts
Algorithms that position nodes. SunGraph includes:
- **CustomDagreLayout** - Hierarchical layout (default)
- Create your own by implementing the Layout interface

## 🎨 Examples

### Organization Chart
See [docs/SETUP.md](./docs/SETUP.md#basic-example) for a complete organization chart example.

### Network Diagram
See [docs/SETUP.md](./docs/SETUP.md#advanced-example) for network visualization with custom styling.

### Custom Templates
Define custom node rendering:

```typescript
const customNode: Node = {
  id: 'custom-1',
  width: 150,
  height: 100,
  template: (node) => (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      borderRadius: '10px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <strong>{node.label}</strong>
    </div>
  )
};
```

## 🛠️ Development

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm start
```

### Build for Production

Build the library:
```bash
npm run buildPackage
```

Build the documentation site:
```bash
npm run buildDocs
```

### Run Tests

```bash
npm test
```

## 📦 Installation from Package Template

The package includes TypeScript definitions and a ready-to-use template:

```bash
npm install sun-graph
```

Then import:

```typescript
import { SunGraph } from "sun-graph";
import { Node, Edge, Graph } from "sun-graph/graph.model";
import { Layout } from "sun-graph/layout.model";
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Related Projects

- [swimlane/ngx-graph](https://github.com/swimlane/ngx-graph) - The original Angular version that inspired this project
- [Dagre](https://github.com/dagrejs/dagre) - Graph layout library used by CustomDagreLayout
- [D3](https://d3js.org/) - Used for curve calculations

## 📞 Support

For issues, questions, or feature requests, please open an issue on GitHub.
