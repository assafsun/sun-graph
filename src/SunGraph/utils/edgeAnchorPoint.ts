/**
 * Edge Anchor Point Calculator
 * 
 * Calculates precise intersection points between edges and node boundaries
 * to ensure arrows connect properly to nodes regardless of shape or angle.
 */

import { Node, NodePosition } from "SunGraph/models/graph.model";

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  cx: number;
  cy: number;
  radius: number;
}

export type NodeShape = "rectangle" | "circle" | "ellipse";

/**
 * Calculate the intersection point between a line and a rectangle's border
 */
export function getRectangleIntersection(
  rect: Rectangle,
  lineStart: NodePosition,
  lineEnd: NodePosition
): NodePosition {
  const centerX = rect.x;
  const centerY = rect.y;
  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;

  // Calculate angle from center to line endpoint
  const dx = lineEnd.x - centerX;
  const dy = lineEnd.y - centerY;

  // Avoid division by zero
  if (dx === 0 && dy === 0) {
    return { x: centerX, y: centerY };
  }

  // Calculate intersection based on direction
  // Rectangle bounds
  const left = centerX - halfWidth;
  const right = centerX + halfWidth;
  const top = centerY - halfHeight;
  const bottom = centerY + halfHeight;

  // Slope of the line
  const slope = dy / dx;

  let intersectionX: number;
  let intersectionY: number;

  if (Math.abs(dx) * halfHeight > Math.abs(dy) * halfWidth) {
    // Intersects with left or right edge
    if (dx > 0) {
      // Right edge
      intersectionX = right;
      intersectionY = centerY + slope * halfWidth;
    } else {
      // Left edge
      intersectionX = left;
      intersectionY = centerY - slope * halfWidth;
    }
  } else {
    // Intersects with top or bottom edge
    if (dy > 0) {
      // Bottom edge
      intersectionY = bottom;
      intersectionX = centerX + (halfHeight / slope);
    } else {
      // Top edge
      intersectionY = top;
      intersectionX = centerX - (halfHeight / slope);
    }
  }

  return { x: intersectionX, y: intersectionY };
}

/**
 * Calculate the intersection point between a line and a circle's border
 */
export function getCircleIntersection(
  circle: Circle,
  lineStart: NodePosition,
  lineEnd: NodePosition
): NodePosition {
  const dx = lineEnd.x - circle.cx;
  const dy = lineEnd.y - circle.cy;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) {
    return { x: circle.cx, y: circle.cy };
  }

  // Normalize and scale to radius
  const x = circle.cx + (dx / distance) * circle.radius;
  const y = circle.cy + (dy / distance) * circle.radius;

  return { x, y };
}

/**
 * Calculate the intersection point between a line and an ellipse's border
 */
export function getEllipseIntersection(
  rect: Rectangle,
  lineStart: NodePosition,
  lineEnd: NodePosition
): NodePosition {
  const centerX = rect.x;
  const centerY = rect.y;
  const rx = rect.width / 2;
  const ry = rect.height / 2;

  const dx = lineEnd.x - centerX;
  const dy = lineEnd.y - centerY;

  if (dx === 0 && dy === 0) {
    return { x: centerX, y: centerY };
  }

  // Parametric equation for ellipse: x = rx*cos(t), y = ry*sin(t)
  // Find angle to the point
  const angle = Math.atan2(dy, dx);
  
  // Point on ellipse at this angle
  const x = centerX + rx * Math.cos(angle);
  const y = centerY + ry * Math.sin(angle);

  return { x, y };
}

/**
 * Get the anchor point on a node's border for edge connection
 * 
 * @param node - The node to calculate anchor point for
 * @param targetPoint - The point the edge is going to/from (other node or control point)
 * @param shape - The shape of the node (default: rectangle)
 * @param isHTMLTemplate - Whether the node uses HTML template (foreignObject) vs SVG shapes
 * @returns The calculated anchor point on the node's border
 */
export function getNodeAnchorPoint(
  node: Node,
  targetPoint: NodePosition,
  shape: NodeShape = "rectangle",
  isHTMLTemplate: boolean = true
): NodePosition {
  if (!node.position || !node.width || !node.height) {
    return node.position || { x: 0, y: 0 };
  }

  // Calculate actual center based on template type:
  // - HTML templates (foreignObject): content starts at (0,0), so center remains at node.position
  // - SVG templates (circle, rect centered at 0,0): center shifts by -width/2, -height/2
  const actualCenterX = isHTMLTemplate 
    ? node.position.x 
    : node.position.x - node.width / 2;
  const actualCenterY = isHTMLTemplate 
    ? node.position.y 
    : node.position.y - node.height / 2;
  
  const nodeRect: Rectangle = {
    x: actualCenterX,
    y: actualCenterY,
    width: node.width,
    height: node.height,
  };

  const nodeCenter: NodePosition = {
    x: actualCenterX,
    y: actualCenterY,
  };

  switch (shape) {
    case "circle":
      const radius = Math.min(node.width, node.height) / 2;
      return getCircleIntersection(
        { cx: nodeCenter.x, cy: nodeCenter.y, radius },
        nodeCenter,
        targetPoint
      );

    case "ellipse":
      return getEllipseIntersection(nodeRect, nodeCenter, targetPoint);

    case "rectangle":
    default:
      return getRectangleIntersection(nodeRect, nodeCenter, targetPoint);
  }
}

/**
 * Calculate optimal edge path points with proper anchor points
 * 
 * @param sourceNode - Starting node
 * @param targetNode - Ending node
 * @param dagrePoints - Optional points from Dagre layout
 * @param sourceShape - Shape of source node
 * @param targetShape - Shape of target node
 * @param isHTMLTemplate - Whether nodes use HTML template (default: true for backward compatibility)
 * @returns Array of points forming the edge path
 */
export function calculateEdgePath(
  sourceNode: Node,
  targetNode: Node,
  dagrePoints?: NodePosition[],
  sourceShape: NodeShape = "rectangle",
  targetShape: NodeShape = "rectangle",
  isHTMLTemplate: boolean = true
): NodePosition[] {
  // If Dagre provided edge points, use them
  if (dagrePoints && dagrePoints.length > 0) {
    const points = [...dagrePoints];
    
    // Replace first point with proper source anchor
    const firstControlPoint = points.length > 1 ? points[1] : targetNode.position;
    points[0] = getNodeAnchorPoint(sourceNode, firstControlPoint, sourceShape, isHTMLTemplate);
    
    // Replace last point with proper target anchor
    const lastControlPoint = points.length > 1 ? points[points.length - 2] : sourceNode.position;
    points[points.length - 1] = getNodeAnchorPoint(targetNode, lastControlPoint, targetShape, isHTMLTemplate);
    
    return points;
  }

  // Fallback: create simple 3-point curve with proper anchors
  const sourceCenter = sourceNode.position;
  const targetCenter = targetNode.position;

  // Calculate midpoint
  const midpoint: NodePosition = {
    x: (sourceCenter.x + targetCenter.x) / 2,
    y: (sourceCenter.y + targetCenter.y) / 2,
  };

  // Get anchor points
  const sourceAnchor = getNodeAnchorPoint(sourceNode, midpoint, sourceShape, isHTMLTemplate);
  const targetAnchor = getNodeAnchorPoint(targetNode, midpoint, targetShape, isHTMLTemplate);

  return [sourceAnchor, midpoint, targetAnchor];
}

/**
 * Adjust arrow marker position to account for marker size
 * This ensures the arrow head sits exactly at the node border
 * 
 * @param anchorPoint - The calculated anchor point
 * @param targetCenter - Center of the target node
 * @param arrowLength - Length of the arrow marker (default: 10)
 * @returns Adjusted point for arrow positioning
 */
export function adjustForArrowMarker(
  anchorPoint: NodePosition,
  targetCenter: NodePosition,
  arrowLength: number = 10
): NodePosition {
  const dx = targetCenter.x - anchorPoint.x;
  const dy = targetCenter.y - anchorPoint.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) {
    return anchorPoint;
  }

  // Move the point back by arrow length
  const ratio = arrowLength / distance;
  
  return {
    x: anchorPoint.x + dx * ratio,
    y: anchorPoint.y + dy * ratio,
  };
}
