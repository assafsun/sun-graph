import React, { useState, useMemo } from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import * as shape from "d3-shape";
import { SunGraph, LineShape } from "SunGraph/SunGraph";
import { TextField, Paper, Box, Typography, Chip, Button } from "@mui/material";
import styled from "styled-components";

const Container = styled.div`
  height: 96vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const GraphWrapper = styled.div`
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
`;

const Stats = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
  flex-wrap: wrap;
`;

/**
 * Interactive Search & Selection Graph Example
 * 
 * Features:
 * - Real-time search by node label
 * - Node selection with click/ctrl+click
 * - Visual highlighting of search results
 * - Node count and selection stats
 */
export function InteractiveSearchGraph() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Sample data: Tech company organizational structure with skills
  const nodes: Node[] = [
    { id: "ceo", label: "CEO - Alice Johnson", data: { role: "Executive", dept: "Leadership" } },
    { id: "cto", label: "CTO - Bob Smith", data: { role: "Executive", dept: "Leadership" } },
    { id: "cfo", label: "CFO - Carol White", data: { role: "Executive", dept: "Finance" } },
    
    // Engineering team
    { id: "eng-lead", label: "Engineering Lead - David Chen", data: { role: "Manager", dept: "Engineering" } },
    { id: "fe-dev1", label: "React Developer - Emma Davis", data: { role: "Engineer", dept: "Engineering", skill: "React" } },
    { id: "fe-dev2", label: "Vue Developer - Frank Brown", data: { role: "Engineer", dept: "Engineering", skill: "Vue" } },
    { id: "be-dev1", label: "Backend Dev - Grace Lee", data: { role: "Engineer", dept: "Engineering", skill: "Node.js" } },
    { id: "be-dev2", label: "Backend Dev - Henry Wilson", data: { role: "Engineer", dept: "Engineering", skill: "Python" } },
    { id: "devops", label: "DevOps Engineer - Iris Martinez", data: { role: "Engineer", dept: "Engineering", skill: "DevOps" } },
    
    // Product team
    { id: "pm-lead", label: "Product Manager - Jack Taylor", data: { role: "Manager", dept: "Product" } },
    { id: "ux-designer", label: "UX Designer - Karen Anderson", data: { role: "Designer", dept: "Product" } },
    { id: "ui-designer", label: "UI Designer - Leo Thomas", data: { role: "Designer", dept: "Product" } },
    
    // Finance team
    { id: "accountant1", label: "Accountant - Mia Jackson", data: { role: "Specialist", dept: "Finance" } },
    { id: "accountant2", label: "Accountant - Nathan Garcia", data: { role: "Specialist", dept: "Finance" } },
  ];

  const edges: Edge[] = [
    // CEO reports
    { source: "ceo", target: "cto", label: "reports to" },
    { source: "ceo", target: "cfo", label: "reports to" },
    { source: "ceo", target: "pm-lead", label: "reports to" },
    
    // Engineering team
    { source: "cto", target: "eng-lead", label: "manages" },
    { source: "eng-lead", target: "fe-dev1", label: "manages" },
    { source: "eng-lead", target: "fe-dev2", label: "manages" },
    { source: "eng-lead", target: "be-dev1", label: "manages" },
    { source: "eng-lead", target: "be-dev2", label: "manages" },
    { source: "eng-lead", target: "devops", label: "manages" },
    
    // Frontend developers collaboration
    { source: "fe-dev1", target: "fe-dev2", label: "collaborates" },
    { source: "fe-dev1", target: "ux-designer", label: "collaborates" },
    
    // Backend developers
    { source: "be-dev1", target: "be-dev2", label: "collaborates" },
    { source: "be-dev1", target: "devops", label: "collaborates" },
    
    // Product team
    { source: "pm-lead", target: "ux-designer", label: "manages" },
    { source: "pm-lead", target: "ui-designer", label: "manages" },
    { source: "ux-designer", target: "ui-designer", label: "collaborates" },
    
    // Finance
    { source: "cfo", target: "accountant1", label: "manages" },
    { source: "cfo", target: "accountant2", label: "manages" },
  ];

  // Filter nodes based on search term
  const filteredNodeIds = useMemo(() => {
    if (!searchTerm) return nodes.map((n) => n.id);
    const term = searchTerm.toLowerCase();
    return nodes
      .filter(
        (node) =>
          node.label?.toLowerCase().includes(term) ||
          node.data?.role?.toLowerCase().includes(term) ||
          node.data?.dept?.toLowerCase().includes(term) ||
          node.data?.skill?.toLowerCase().includes(term)
      )
      .map((n) => n.id);
  }, [searchTerm, nodes]);

  // Apply styling based on search and selection
  const styledNodes = useMemo(
    () =>
      nodes.map((node) => {
        const isFiltered = !filteredNodeIds.includes(node.id);
        const isSelected = selectedNodeIds.includes(node.id);
        const isHovered = hoveredNodeId === node.id;

        return {
          ...node,
          style: {
            fill: isSelected ? "#667eea" : isHovered ? "#764ba2" : "#4a90e2",
            stroke: isSelected ? "#764ba2" : "#333",
            strokeWidth: isSelected ? 3 : isHovered ? 2 : 1,
            opacity: isFiltered ? 0.2 : 1,
          },
        };
      }),
    [nodes, filteredNodeIds, selectedNodeIds, hoveredNodeId]
  );

  const handleNodeClick = (node: Node, event: MouseEvent) => {
    event.stopPropagation();
    setSelectedNodeIds((prev) => {
      if ((event as any).ctrlKey || (event as any).metaKey) {
        // Multi-select on Ctrl+Click or Cmd+Click
        return prev.includes(node.id)
          ? prev.filter((id) => id !== node.id)
          : [...prev, node.id];
      } else {
        // Single select
        return prev.includes(node.id) ? [] : [node.id];
      }
    });
  };

  const handleGraphClick = () => {
    setSelectedNodeIds([]);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedNodeIds([]);
  };

  const handleSelectByDept = (dept: string) => {
    const deptNodeIds = nodes
      .filter((n) => n.data?.dept === dept)
      .map((n) => n.id);
    setSelectedNodeIds(deptNodeIds);
  };

  const selectedCount = selectedNodeIds.length;
  const visibleCount = filteredNodeIds.length;

  return (
    <Container>
      <Paper elevation={2} style={{ padding: "16px" }}>
        <Typography variant="h5" style={{ marginBottom: "16px", fontWeight: 600 }}>
          🔍 Interactive Search & Selection Example
        </Typography>

        <SearchBar>
          <TextField
            placeholder="Search by name, role, department, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            style={{ flex: 1, minWidth: "300px" }}
          />
          {searchTerm && (
            <Button
              size="small"
              variant="outlined"
              onClick={handleClearSearch}
            >
              Clear Search
            </Button>
          )}
        </SearchBar>

        <Box style={{ marginTop: "12px" }}>
          <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
            Filter by Department:
          </Typography>
          <Box style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Leadership", "Engineering", "Product", "Finance"].map((dept) => (
              <Chip
                key={dept}
                label={dept}
                onClick={() => handleSelectByDept(dept)}
                color={
                  selectedNodeIds.some((id) =>
                    nodes.find(
                      (n) => n.id === id && n.data?.dept === dept
                    )
                  )
                    ? "primary"
                    : "default"
                }
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        <Stats style={{ marginTop: "12px" }}>
          <span>
            📊 Total Nodes: <strong>{nodes.length}</strong>
          </span>
          <span>
            🔎 Visible: <strong>{visibleCount}</strong>
          </span>
          <span>
            ✓ Selected: <strong>{selectedCount}</strong>
          </span>
          {selectedNodeIds.length > 0 && (
            <>
              <span style={{ marginLeft: "auto" }}>
                <strong>Selected:</strong> {selectedNodeIds.join(", ")}
              </span>
            </>
          )}
        </Stats>
      </Paper>

      <GraphWrapper>
        <SunGraph
          nodes={styledNodes}
          links={edges}
          layout={undefined}
          onNodeClick={handleNodeClick}
          onNodeHover={(node, event) => {
            setHoveredNodeId(node?.id || null);
          }}
          onGraphClick={handleGraphClick}
          defaultNodeTemplate={(node) => {
            const isFiltered = !filteredNodeIds.includes(node.id);
            return (
              <g>
                <circle
                  r={30}
                  fill={node.style?.fill || "#4a90e2"}
                  stroke={node.style?.stroke || "#333"}
                  strokeWidth={node.style?.strokeWidth || 1}
                  opacity={node.style?.opacity || 1}
                  style={{ cursor: "pointer" }}
                />
                <text
                  textAnchor="middle"
                  dy="0.3em"
                  fontSize="10"
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
          💡 <strong>Tip:</strong> Click nodes to select them. Ctrl+Click (Cmd+Click on Mac) to
          multi-select. Use the search bar or department filters to find specific people. Hover
          over nodes to see the highlighting effect.
        </Typography>
      </Paper>
    </Container>
  );
}
