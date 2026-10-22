import React, { useRef, useState, useEffect } from 'react';
import { Edge, SimulatorMode, Vertex } from '../types';
import { getColor } from '../utils/coloring';

interface GraphCanvasProps {
  vertices: Vertex[];
  edges: Edge[];
  mode: SimulatorMode;
  selectedSourceId: number | null;
  activeStepVertexId: number | null;
  activeNeighborIds: number[];
  onAddVertex: (x: number, y: number) => void;
  onSelectVertexForEdge: (id: number) => void;
  onDeleteVertex: (id: number) => void;
  onDeleteEdge: (edgeId: string) => void;
  onMoveVertex: (id: number, x: number, y: number) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  vertices,
  edges,
  mode,
  selectedSourceId,
  activeStepVertexId,
  activeNeighborIds,
  onAddVertex,
  onSelectVertexForEdge,
  onDeleteVertex,
  onDeleteEdge,
  onMoveVertex,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [hoveredVertexId, setHoveredVertexId] = useState<number | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  // SVG coordinate transformation
  const getSvgCoordinates = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Scale according to viewBox (viewBox is 640 x 440)
    const scaleX = 640 / rect.width;
    const scaleY = 440 / rect.height;

    const x = Math.round((clientX - rect.left) * scaleX);
    const y = Math.round((clientY - rect.top) * scaleY);

    // Keep within bounds
    return {
      x: Math.max(30, Math.min(610, x)),
      y: Math.max(30, Math.min(410, y)),
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    // If clicking on vertex or edge, their own handlers will capture it
    if (mode === 'add-vertex') {
      const { x, y } = getSvgCoordinates(e);
      onAddVertex(x, y);
    }
  };

  const handleVertexMouseDown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === 'delete') {
      onDeleteVertex(id);
    } else if (mode === 'add-edge') {
      onSelectVertexForEdge(id);
    } else if (mode === 'drag') {
      setDraggingId(id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggingId !== null && mode === 'drag') {
      const { x, y } = getSvgCoordinates(e);
      onMoveVertex(draggingId, x, y);
    }
  };

  const handleMouseUp = () => {
    if (draggingId !== null) {
      setDraggingId(null);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setDraggingId(null);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const getModeCursor = () => {
    switch (mode) {
      case 'add-vertex':
        return 'cursor-crosshair';
      case 'add-edge':
        return 'cursor-pointer';
      case 'drag':
        return draggingId ? 'cursor-grabbing' : 'cursor-grab';
      case 'delete':
        return 'cursor-not-allowed';
      default:
        return 'cursor-default';
    }
  };

  return (
    <div className="relative w-full rounded-lg border-2 border-slate-300 bg-white overflow-hidden shadow-xs">
      {/* Canvas Top Bar Instruction Banner */}
      <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-700">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-800">Canvas Mode:</span>
          <span className="px-2 py-0.5 rounded font-medium bg-slate-200 text-slate-800 capitalize">
            {mode === 'add-vertex' && 'Add Vertex (Click anywhere on the white area)'}
            {mode === 'add-edge' && (selectedSourceId === null ? 'Add Edge: Click first vertex' : `Add Edge: Selected V${selectedSourceId}, now click target vertex`)}
            {mode === 'drag' && 'Move / Drag (Click and drag vertices to reposition)'}
            {mode === 'delete' && 'Delete Mode (Click a vertex or edge to remove)'}
          </span>
        </div>
        <div className="text-slate-500 hidden sm:block">
          Dimensions: 640 × 440 px
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 640 440"
        className={`w-full h-[360px] sm:h-[440px] select-none ${getModeCursor()}`}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Subtle grid dots for a neat college lab appearance */}
        <defs>
          <pattern id="gridDots" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#cbd5e1" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="640" height="440" fill="url(#gridDots)" />

        {/* Empty state hint */}
        {vertices.length === 0 && (
          <text
            x="320"
            y="210"
            textAnchor="middle"
            fill="#64748b"
            fontSize="15"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
          >
            Graph is currently empty. Click anywhere on this canvas to add your first vertex!
          </text>
        )}
        {vertices.length === 1 && (
          <text
            x="320"
            y="30"
            textAnchor="middle"
            fill="#64748b"
            fontSize="13"
            fontFamily="Inter, sans-serif"
          >
            Add at least one more vertex, then switch to "Add Edge" to connect them.
          </text>
        )}

        {/* Edges */}
        <g className="edges-layer">
          {edges.map((edge) => {
            const source = vertices.find((v) => v.id === edge.source);
            const target = vertices.find((v) => v.id === edge.target);
            if (!source || !target) return null;

            const isHovered = hoveredEdgeId === edge.id;
            const isDeleting = mode === 'delete';
            const isConnectedToStepVertex =
              activeStepVertexId !== null &&
              ((edge.source === activeStepVertexId && activeNeighborIds.includes(edge.target)) ||
               (edge.target === activeStepVertexId && activeNeighborIds.includes(edge.source)));

            return (
              <g
                key={edge.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEdgeId(edge.id)}
                onMouseLeave={() => setHoveredEdgeId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (mode === 'delete') {
                    onDeleteEdge(edge.id);
                  }
                }}
              >
                {/* Invisible wide hit-area for easy clicking/tapping */}
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="transparent"
                  strokeWidth="18"
                />
                {/* Visible line */}
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={
                    isHovered && isDeleting
                      ? '#ef4444'
                      : isConnectedToStepVertex
                      ? '#3b82f6'
                      : isHovered
                      ? '#2563eb'
                      : '#64748b'
                  }
                  strokeWidth={isConnectedToStepVertex ? 3.5 : isHovered ? 3.5 : 2.5}
                  strokeDasharray={isConnectedToStepVertex ? '6 4' : undefined}
                  className="transition-colors duration-150"
                />
              </g>
            );
          })}
        </g>

        {/* Vertices */}
        <g className="vertices-layer">
          {vertices.map((vertex) => {
            const color = getColor(vertex.colorIndex);
            const isSelectedSource = selectedSourceId === vertex.id;
            const isHovered = hoveredVertexId === vertex.id;
            const isActiveStep = activeStepVertexId === vertex.id;
            const isActiveNeighbor = activeNeighborIds.includes(vertex.id);

            // Compute degree of this vertex for tooltips
            const degree = edges.filter(
              (e) => e.source === vertex.id || e.target === vertex.id
            ).length;

            return (
              <g
                key={vertex.id}
                transform={`translate(${vertex.x}, ${vertex.y})`}
                className="cursor-pointer"
                onMouseDown={(e) => handleVertexMouseDown(vertex.id, e)}
                onMouseEnter={() => setHoveredVertexId(vertex.id)}
                onMouseLeave={() => setHoveredVertexId(null)}
              >
                {/* Pulse / Highlight halo when active in step or selected */}
                {(isSelectedSource || isActiveStep) && (
                  <circle
                    r="29"
                    fill="none"
                    stroke={isSelectedSource ? '#2563eb' : '#3b82f6'}
                    strokeWidth="3"
                    strokeDasharray="4 3"
                    className="animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                )}

                {isActiveNeighbor && (
                  <circle
                    r="28"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Vertex Circle */}
                <circle
                  r="22"
                  fill={color.bgHex}
                  stroke={
                    mode === 'delete' && isHovered
                      ? '#dc2626'
                      : isSelectedSource
                      ? '#1d4ed8'
                      : isActiveStep
                      ? '#2563eb'
                      : color.borderHex
                  }
                  strokeWidth={isSelectedSource || isActiveStep ? 3.5 : 2.5}
                  className="transition-transform duration-150 hover:scale-105"
                />

                {/* Vertex Label */}
                <text
                  textAnchor="middle"
                  dy=".35em"
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                  fill={color.textHex}
                  pointerEvents="none"
                >
                  {vertex.label}
                </text>

                {/* Small degree indicator tag */}
                <g transform="translate(14, -14)" pointerEvents="none">
                  <circle r="8" fill="#1e293b" />
                  <text
                    textAnchor="middle"
                    dy=".35em"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="Inter, sans-serif"
                    fill="#ffffff"
                  >
                    {degree}
                  </text>
                </g>

                {/* Hover info badge when mouse is over vertex */}
                {isHovered && mode !== 'delete' && (
                  <g transform="translate(0, -32)" pointerEvents="none">
                    <rect
                      x="-55"
                      y="-18"
                      width="110"
                      height="20"
                      rx="4"
                      fill="#0f172a"
                      opacity="0.92"
                    />
                    <text
                      textAnchor="middle"
                      dy="-4"
                      fontSize="10"
                      fontWeight="500"
                      fontFamily="Inter, sans-serif"
                      fill="#ffffff"
                    >
                      {vertex.label}: deg={degree} | {color.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Canvas footer helper */}
      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap justify-between items-center">
        <span>Click on any vertex to select it. Black numbers at top-right of nodes indicate vertex <strong>Degree</strong>.</span>
        <span>Vertices: {vertices.length} | Edges: {edges.length}</span>
      </div>
    </div>
  );
};
