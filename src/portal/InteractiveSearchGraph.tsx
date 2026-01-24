import React, { useState, useMemo } from "react";
import { Node, Edge } from "SunGraph/models/graph.model";
import { SunGraph, LineShape } from "SunGraph/SunGraph";
import { CustomDagreLayout } from "SunGraph/layouts/customDagreLayout";
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
  border: 2px solid #667eea;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const Stats = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #333;
  flex-wrap: wrap;
`;

// Role configuration with colors and icons
const roleConfig = {
  Executive: { color: "#667eea", icon: "👑", bgColor: "#e8eaf6" },
  Manager: { color: "#764ba2", icon: "📊", bgColor: "#f3e5f5" },
  Engineer: { color: "#4facfe", icon: "⚙️", bgColor: "#e3f2fd" },
  Designer: { color: "#f093fb", icon: "🎨", bgColor: "#f3e5f5" },
  Specialist: { color: "#43e97b", icon: "⭐", bgColor: "#e8f5e9" },
};

// Create layout with circle node shape for proper edge anchoring
const circleLayout = new CustomDagreLayout();
circleLayout.settings = {
  nodeShape: "circle",
  rankPadding: 120,
  nodePadding: 80,
  isHTMLTemplate: false, // Using SVG templates (not foreignObject)
};

/**
 * Interactive Search & Selection Graph Example
 * 
 * Features:
 * - Real-time search by node label
 * - Node selection with click/ctrl+click
 * - Visual filtering - nodes dim when not matching search
 * - Professional node templates with role colors
 * - Live statistics
 */
export function InteractiveSearchGraph() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Sample data: Tech company organizational structure with skills
  const baseNodes: Node[] = useMemo(() => [
    { id: "ceo", label: "Alice Johnson", data: { role: "Executive", dept: "Leadership", abbr: "AJ" } },
    { id: "cto", label: "Bob Smith", data: { role: "Executive", dept: "Leadership", abbr: "BS" } },
    { id: "cfo", label: "Carol White", data: { role: "Executive", dept: "Finance", abbr: "CW" } },
    
    // Engineering team
    { id: "eng-lead", label: "David Chen", data: { role: "Manager", dept: "Engineering", abbr: "DC" } },
    { id: "fe-dev1", label: "Emma Davis", data: { role: "Engineer", dept: "Engineering", abbr: "ED" } },
    { id: "fe-dev2", label: "Frank Brown", data: { role: "Engineer", dept: "Engineering", abbr: "FB" } },
    { id: "be-dev1", label: "Grace Lee", data: { role: "Engineer", dept: "Engineering", abbr: "GL" } },
    { id: "be-dev2", label: "Henry Wilson", data: { role: "Engineer", dept: "Engineering", abbr: "HW" } },
    { id: "devops", label: "Iris Martinez", data: { role: "Engineer", dept: "Engineering", abbr: "IM" } },
    
    // Product team
    { id: "pm-lead", label: "Jack Taylor", data: { role: "Manager", dept: "Product", abbr: "JT" } },
    { id: "ux-designer", label: "Karen Anderson", data: { role: "Designer", dept: "Product", abbr: "KA" } },
    { id: "ui-designer", label: "Leo Thomas", data: { role: "Designer", dept: "Product", abbr: "LT" } },
    
    // Finance team
    { id: "accountant1", label: "Mia Jackson", data: { role: "Specialist", dept: "Finance", abbr: "MJ" } },
    { id: "accountant2", label: "Nathan Garcia", data: { role: "Specialist", dept: "Finance", abbr: "NG" } },
  ], []);

  const edges: Edge[] = useMemo(() => [
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
  ], []);

  // Calculate filtered nodes based on search
  const filteredNodeIds = useMemo(() => {
    if (!searchTerm.trim()) return baseNodes.map((n) => n.id);
    const term = searchTerm.toLowerCase();
    return baseNodes
      .filter(
        (node) =>
          node.label?.toLowerCase().includes(term) ||
          node.data?.role?.toLowerCase().includes(term) ||
          node.data?.dept?.toLowerCase().includes(term)
      )
      .map((n) => n.id);
  }, [searchTerm, baseNodes]);

  // Apply professional styling and filtering
  const styledNodes = useMemo(
    () =>
      baseNodes.map((node) => {
        const isFiltered = !filteredNodeIds.includes(node.id);
        const isSelected = selectedNodeIds.includes(node.id);
        const isHovered = hoveredNodeId === node.id;
        const role = node.data?.role || "Engineer";
        const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.Engineer;

        return {
          ...node,
          style: {
            fill: isSelected ? "#2c3e50" : config.color,
            stroke: isSelected ? "#000" : "#fff",
            strokeWidth: isSelected ? 3 : isHovered ? 2 : 1,
            opacity: isFiltered ? 0.15 : 1,
            filter: isHovered && !isFiltered ? "drop-shadow(0 0 8px rgba(0,0,0,0.3))" : "none",
          },
        };
      }),
    [baseNodes, filteredNodeIds, selectedNodeIds, hoveredNodeId]
  );

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => {
        const sourceFiltered = !filteredNodeIds.includes(edge.source);
        const targetFiltered = !filteredNodeIds.includes(edge.target);
        const bothFiltered = sourceFiltered && targetFiltered;

        return {
          ...edge,
          style: {
            stroke: bothFiltered ? "#ccc" : "#666",
            strokeWidth: 2,
            opacity: bothFiltered ? 0.1 : 0.6,
          },
        };
      }),
    [edges, filteredNodeIds]
  );

  const handleNodeClick = (node: Node, event: MouseEvent) => {
    event.stopPropagation();
    setSelectedNodeIds((prev) => {
      if ((event as any).ctrlKey || (event as any).metaKey) {
        return prev.includes(node.id)
          ? prev.filter((id) => id !== node.id)
          : [...prev, node.id];
      } else {
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
    const deptNodeIds = baseNodes
      .filter((n) => n.data?.dept === dept)
      .map((n) => n.id);
    setSelectedNodeIds(deptNodeIds);
  };

  const selectedCount = selectedNodeIds.length;
  const visibleCount = filteredNodeIds.length;

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h5" style={{ marginBottom: "16px", fontWeight: 700, color: "#667eea" }}>
          🔍 Interactive Search & Selection - Live Filtering
        </Typography>

        <SearchBar>
          <TextField
            placeholder="Search by name, role, or department... (try: Engineer, Leadership, Finance)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            style={{ flex: 1, minWidth: "300px" }}
            autoFocus
          />
          {searchTerm && (
            <Button
              size="small"
              variant="contained"
              onClick={handleClearSearch}
              style={{ backgroundColor: "#667eea" }}
            >
              Clear Search
            </Button>
          )}
        </SearchBar>

        <Box style={{ marginTop: "16px" }}>
          <Typography variant="subtitle2" style={{ marginBottom: "8px", fontWeight: 600 }}>
            Quick Filter by Department:
          </Typography>
          <Box style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Leadership", "Engineering", "Product", "Finance"].map((dept) => (
              <Chip
                key={dept}
                label={dept}
                onClick={() => handleSelectByDept(dept)}
                color={
                  selectedNodeIds.some((id) =>
                    baseNodes.find(
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

        <Stats style={{ marginTop: "16px" }}>
          <span>
            👥 Total: <strong>{baseNodes.length}</strong>
          </span>
          <span>
            👁️ Visible: <strong>{visibleCount}</strong> {visibleCount < baseNodes.length && `(${baseNodes.length - visibleCount} hidden)`}
          </span>
          <span>
            ✓ Selected: <strong>{selectedCount}</strong>
          </span>
          {selectedNodeIds.length > 0 && (
            <span style={{ marginLeft: "auto", fontSize: "12px", color: "#666" }}>
              <strong>Selected:</strong> {selectedNodeIds.map(id => baseNodes.find(n => n.id === id)?.label).join(", ")}
            </span>
          )}
        </Stats>
      </Paper>

      <GraphWrapper>
        <SunGraph
          nodes={styledNodes}
          links={styledEdges}
          layout={circleLayout}
          nodeWidth={64}
          nodeHeight={64}
          draggingEnabled={true}
          onNodeClick={handleNodeClick}
          onNodeHover={(node, event) => {
            setHoveredNodeId(node?.id || null);
          }}
          onGraphClick={handleGraphClick}
          defaultNodeTemplate={(node) => {
            const role = node.data?.role || "Engineer";
            const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.Engineer;
            const abbr = node.data?.abbr || "?";

            return (
              <g style={{ cursor: "pointer" }}>
                {/* Outer glow when selected */}
                {selectedNodeIds.includes(node.id) && (
                  <circle
                    r={38}
                    fill="none"
                    stroke="#2c3e50"
                    strokeWidth={1}
                    opacity={0.3}
                    style={{ pointerEvents: "none" }}
                  />
                )}

                {/* Main node circle */}
                <circle
                  r={32}
                  fill={node.style?.fill || config.color}
                  stroke={node.style?.stroke || "#fff"}
                  strokeWidth={node.style?.strokeWidth || 1}
                  opacity={node.style?.opacity || 1}
                />

                {/* Role icon */}
                <text
                  x={-8}
                  y={-8}
                  fontSize="20"
                  textAnchor="middle"
                  style={{ pointerEvents: "none" }}
                >
                  {config.icon}
                </text>

                {/* Name abbreviation */}
                <text
                  x={0}
                  y={12}
                  fontSize="14"
                  fill="white"
                  fontWeight="bold"
                  textAnchor="middle"
                  style={{ pointerEvents: "none" }}
                >
                  {abbr}
                </text>

                {/* Tooltip label on hover */}
                {hoveredNodeId === node.id && (
                  <>
                    <rect
                      x={-45}
                      y={-65}
                      width={90}
                      height={50}
                      rx={4}
                      fill="#2c3e50"
                      opacity={0.95}
                      style={{ pointerEvents: "none" }}
                    />
                    <text
                      x={0}
                      y={-50}
                      fontSize="12"
                      fill="white"
                      fontWeight="bold"
                      textAnchor="middle"
                      style={{ pointerEvents: "none" }}
                    >
                      {node.label}
                    </text>
                    <text
                      x={0}
                      y={-35}
                      fontSize="10"
                      fill="#aaa"
                      textAnchor="middle"
                      style={{ pointerEvents: "none" }}
                    >
                      {node.data?.role}
                    </text>
                    <text
                      x={0}
                      y={-22}
                      fontSize="10"
                      fill="#aaa"
                      textAnchor="middle"
                      style={{ pointerEvents: "none" }}
                    >
                      {node.data?.dept}
                    </text>
                  </>
                )}
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

      <Paper elevation={1} style={{ padding: "16px", backgroundColor: "#f8f9fa" }}>
        <Typography variant="caption" style={{ color: "#555", lineHeight: "1.6" }}>
          <strong>💡 How it works:</strong> Type in the search box to filter the graph in real-time.
          Nodes that don't match will dim out. Click nodes to select them. Use Ctrl+Click (Cmd+Click on Mac) 
          for multi-select. Hover over nodes to see details. Quick filter buttons let you filter by department.
          <br />
          <strong>Try searching:</strong> "Engineer" or "Leadership" or specific names like "Emma"
        </Typography>
      </Paper>
    </Container>
  );
}
