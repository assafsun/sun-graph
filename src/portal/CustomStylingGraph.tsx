import React, { useState, useMemo } from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import * as shape from "d3-shape";
import { SunGraph, LineShape } from "SunGraph/SunGraph";
import { Paper, Box, Typography, Slider, FormControlLabel, Switch } from "@mui/material";
import styled from "styled-components";

const Container = styled.div`
  height: 96vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  padding: 16px;
  align-items: center;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
`;

const GraphWrapper = styled.div`
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
`;

const ColorBox = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  background-color: ${(props) => props.color};
  border-radius: 4px;
  border: 1px solid #999;
`;

/**
 * Custom Styling Example
 * 
 * Features:
 * - Conditional node coloring based on properties
 * - Dynamic size based on importance/weight
 * - Interactive controls to adjust styling
 * - Edge styling with different weights
 * - Live styling updates
 */
export function CustomStylingGraph() {
  const [minSize, setMinSize] = useState(25);
  const [maxSize, setMaxSize] = useState(45);
  const [nodeOpacity, setNodeOpacity] = useState(1);
  const [edgeWidth, setEdgeWidth] = useState(2);
  const [showHierarchy, setShowHierarchy] = useState(true);
  const [colorByType, setColorByType] = useState(true);

  // Sample data: Product team with different roles and responsibilities
  const nodes: Node[] = [
    { 
      id: "pm", 
      label: "Product Manager", 
      data: { type: "manager", importance: 10, team: "leadership" },
    },
    { 
      id: "pm1", 
      label: "Senior PM", 
      data: { type: "senior", importance: 8, team: "product" },
    },
    { 
      id: "pm2", 
      label: "PM - Platform", 
      data: { type: "manager", importance: 7, team: "product" },
    },
    { 
      id: "ux1", 
      label: "UX Designer", 
      data: { type: "designer", importance: 7, team: "design" },
    },
    { 
      id: "ux2", 
      label: "UI Designer", 
      data: { type: "designer", importance: 6, team: "design" },
    },
    { 
      id: "eng1", 
      label: "Frontend Lead", 
      data: { type: "engineer", importance: 8, team: "engineering" },
    },
    { 
      id: "eng2", 
      label: "Frontend Dev", 
      data: { type: "engineer", importance: 6, team: "engineering" },
    },
    { 
      id: "eng3", 
      label: "Backend Dev", 
      data: { type: "engineer", importance: 6, team: "engineering" },
    },
    { 
      id: "qa1", 
      label: "QA Lead", 
      data: { type: "qa", importance: 6, team: "quality" },
    },
    { 
      id: "analyst", 
      label: "Data Analyst", 
      data: { type: "analyst", importance: 5, team: "analytics" },
    },
  ];

  const edges: Edge[] = [
    { source: "pm", target: "pm1", label: "manages" },
    { source: "pm", target: "pm2", label: "manages" },
    { source: "pm1", target: "eng1", label: "works with" },
    { source: "pm2", target: "eng1", label: "works with" },
    { source: "pm1", target: "ux1", label: "works with" },
    { source: "ux1", target: "ux2", label: "collaborates" },
    { source: "eng1", target: "eng2", label: "leads" },
    { source: "eng1", target: "eng3", label: "leads" },
    { source: "pm1", target: "qa1", label: "works with" },
    { source: "pm1", target: "analyst", label: "works with" },
  ];

  const typeColors: { [key: string]: string } = {
    manager: "#667eea",
    senior: "#764ba2",
    designer: "#f093fb",
    engineer: "#4facfe",
    qa: "#43e97b",
    analyst: "#fa709a",
  };

  const typeLabels: { [key: string]: string } = {
    manager: "Manager",
    senior: "Senior",
    designer: "Designer",
    engineer: "Engineer",
    qa: "QA",
    analyst: "Analyst",
  };

  // Apply dynamic styling based on controls
  const styledNodes = useMemo(
    () =>
      nodes.map((node) => {
        const importance = node.data?.importance || 5;
        const type = node.data?.type || "engineer";
        
        // Calculate size based on importance
        const sizeRange = maxSize - minSize;
        const size = minSize + (importance / 10) * sizeRange;

        return {
          ...node,
          style: {
            fill: colorByType ? typeColors[type] : "#667eea",
            stroke: "#333",
            strokeWidth: importance > 7 ? 2 : 1,
            opacity: nodeOpacity,
          },
          width: size,
          height: size,
        };
      }),
    [nodes, minSize, maxSize, nodeOpacity, colorByType]
  );

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        style: {
          stroke: "#999",
          strokeWidth: edgeWidth,
          opacity: 0.6,
        },
      })),
    [edges, edgeWidth]
  );

  return (
    <Container>
      <Paper elevation={2} style={{ padding: "16px" }}>
        <Typography variant="h5" style={{ marginBottom: "16px", fontWeight: 600 }}>
          🎨 Custom Styling & Visualization Controls
        </Typography>

        <ControlPanel>
          <ControlGroup>
            <Typography variant="subtitle2">Node Size Range</Typography>
            <Box style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Typography variant="caption">{minSize}px</Typography>
              <Slider
                value={minSize}
                onChange={(e, val) => setMinSize(Array.isArray(val) ? val[0] : val)}
                min={15}
                max={35}
                style={{ flex: 1, maxWidth: "150px" }}
              />
            </Box>
            <Box style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Typography variant="caption">{maxSize}px</Typography>
              <Slider
                value={maxSize}
                onChange={(e, val) => setMaxSize(Array.isArray(val) ? val[0] : val)}
                min={35}
                max={60}
                style={{ flex: 1, maxWidth: "150px" }}
              />
            </Box>
          </ControlGroup>

          <ControlGroup>
            <Typography variant="subtitle2">Node Opacity</Typography>
            <Box style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Typography variant="caption">{(nodeOpacity * 100).toFixed(0)}%</Typography>
              <Slider
                value={nodeOpacity}
                onChange={(e, val) => setNodeOpacity(Array.isArray(val) ? val[0] : val)}
                min={0.3}
                max={1}
                step={0.1}
                style={{ flex: 1, maxWidth: "150px" }}
              />
            </Box>
          </ControlGroup>

          <ControlGroup>
            <Typography variant="subtitle2">Edge Width</Typography>
            <Box style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Typography variant="caption">{edgeWidth}px</Typography>
              <Slider
                value={edgeWidth}
                onChange={(e, val) => setEdgeWidth(Array.isArray(val) ? val[0] : val)}
                min={1}
                max={4}
                step={0.5}
                style={{ flex: 1, maxWidth: "150px" }}
              />
            </Box>
          </ControlGroup>

          <ControlGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={colorByType}
                  onChange={(e) => setColorByType(e.target.checked)}
                />
              }
              label="Color by Type"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showHierarchy}
                  onChange={(e) => setShowHierarchy(e.target.checked)}
                />
              }
              label="Show Hierarchy"
            />
          </ControlGroup>
        </ControlPanel>

        {colorByType && (
          <Legend>
            {Object.entries(typeLabels).map(([type, label]) => (
              <LegendItem key={type}>
                <ColorBox color={typeColors[type]} />
                <span>{label}</span>
              </LegendItem>
            ))}
          </Legend>
        )}
      </Paper>

      <GraphWrapper>
        <SunGraph
          nodes={styledNodes}
          links={styledEdges}
          defaultNodeTemplate={(node) => {
            const size = node.width || 30;
            return (
              <g>
                <circle
                  r={size / 2}
                  fill={node.style?.fill || "#667eea"}
                  stroke={node.style?.stroke || "#333"}
                  strokeWidth={node.style?.strokeWidth || 1}
                  opacity={node.style?.opacity || 1}
                  style={{ cursor: "pointer" }}
                />
                <text
                  textAnchor="middle"
                  dy="0.3em"
                  fontSize="9"
                  fill="white"
                  fontWeight="bold"
                  style={{ pointerEvents: "none" }}
                >
                  {node.label?.split(" ")[0]}
                </text>
              </g>
            );
          }}
          isNodeTemplateHTML={false}
          curve={LineShape.BasisLine}
          panningEnabled={true}
          enableZoom={true}
          autoCenter={true}
        />
      </GraphWrapper>

      <Paper elevation={1} style={{ padding: "12px" }}>
        <Typography variant="caption" style={{ color: "#666" }}>
          💡 <strong>Features:</strong> Node size is proportional to importance (1-10 scale).
          Stroke width indicates seniority. Try adjusting the sliders above to see dynamic styling
          in action. Toggle &quot;Color by Type&quot; to switch between role-based coloring and
          uniform colors.
        </Typography>
      </Paper>
    </Container>
  );
}
