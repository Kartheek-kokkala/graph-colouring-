import React, { useState } from 'react';
import { Vertex, Edge, StepLog } from '../types';
import { SOFT_COLORS, getVertexDegrees, validateProperColoring } from '../utils/coloring';
import { CheckCircle2, AlertCircle, Clock, Copy, Check } from 'lucide-react';

interface StatisticsPanelProps {
  vertices: Vertex[];
  edges: Edge[];
  colorsUsed: number;
  currentStepLog: StepLog | null;
  isStepping: boolean;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  vertices,
  edges,
  colorsUsed,
  currentStepLog,
  isStepping,
}) => {
  const [copied, setCopied] = useState(false);
  const degrees = getVertexDegrees(vertices, edges);
  const maxDegree = vertices.length > 0 ? Math.max(...Array.from(degrees.values()), 0) : 0;
  const validation = validateProperColoring(vertices, edges);

  // Count colors currently present on vertices
  const colorCounts = new Map<number, number>();
  let coloredCount = 0;
  for (const v of vertices) {
    if (v.colorIndex !== null) {
      coloredCount++;
      colorCounts.set(v.colorIndex, (colorCounts.get(v.colorIndex) || 0) + 1);
    }
  }

  // Determine graph status text and style
  let statusText = 'Uncolored Graph';
  let statusBadgeClass = 'bg-slate-100 text-slate-700 border-slate-300';
  let statusIcon = <Clock className="w-3.5 h-3.5 text-slate-500" />;

  if (vertices.length === 0) {
    statusText = 'Graph is Empty';
    statusBadgeClass = 'bg-slate-100 text-slate-600 border-slate-200';
  } else if (isStepping && coloredCount > 0 && coloredCount < vertices.length) {
    statusText = `Coloring in Progress (${coloredCount}/${vertices.length} vertices)`;
    statusBadgeClass = 'bg-amber-50 text-amber-800 border-amber-300';
    statusIcon = <Clock className="w-3.5 h-3.5 text-amber-600" />;
  } else if (validation.isValid) {
    statusText = `Proper Coloring Verified (Valid, ${colorsUsed} colors)`;
    statusBadgeClass = 'bg-green-50 text-green-800 border-green-300';
    statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />;
  } else if (validation.conflicts.length > 0) {
    statusText = `Conflict Detected (${validation.conflicts.length} adjacent sharing color)`;
    statusBadgeClass = 'bg-red-50 text-red-800 border-red-300';
    statusIcon = <AlertCircle className="w-3.5 h-3.5 text-red-600" />;
  } else if (coloredCount > 0) {
    statusText = `Partially Colored (${coloredCount}/${vertices.length})`;
    statusBadgeClass = 'bg-blue-50 text-blue-800 border-blue-300';
  }

  // Build exact formatted result string requested
  const formattedResultText = `Graph Coloring Result

Number of Vertices: ${vertices.length}
Number of Edges: ${edges.length}
Number of Colors Used: ${colorsUsed}

${vertices
  .map(
    (v) =>
      `Vertex ${v.label.replace(/^V/, '')} → ${
        v.colorIndex !== null ? `Color ${v.colorIndex + 1}` : 'Uncolored'
      }`
  )
  .join('\n')}`;

  const handleCopyResult = () => {
    navigator.clipboard.writeText(formattedResultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-300 p-4 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Graph Coloring Result</h3>
        <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass}`}>
          {statusIcon}
          <span>{statusText}</span>
        </div>
      </div>

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
        <div className="bg-slate-50 border border-slate-200 rounded p-2">
          <span className="block text-xs font-medium text-slate-500 uppercase">Vertices</span>
          <span className="text-lg font-bold text-slate-800">{vertices.length}</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded p-2">
          <span className="block text-xs font-medium text-slate-500 uppercase">Edges</span>
          <span className="text-lg font-bold text-slate-800">{edges.length}</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-2">
          <span className="block text-xs font-medium text-blue-700 uppercase">Colors Used</span>
          <span className="text-lg font-bold text-blue-800">{colorsUsed}</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded p-2">
          <span className="block text-xs font-medium text-slate-500 uppercase">Max Degree</span>
          <span className="text-lg font-bold text-slate-800">{maxDegree}</span>
        </div>
      </div>

      {/* Exact Academic Format Output requested by user */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Formatted Result Output:
          </label>
          <button
            onClick={handleCopyResult}
            className="flex items-center space-x-1 text-xs text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs font-mono leading-relaxed overflow-x-auto border border-slate-800">
          {formattedResultText}
        </pre>
      </div>

      {/* Active Step Log (if stepping) */}
      {currentStepLog && (
        <div className="bg-blue-50 border border-blue-200 rounded p-2.5 text-xs text-blue-950">
          <div className="font-semibold text-blue-900 mb-1 flex items-center justify-between">
            <span>Step {currentStepLog.stepNumber} Log:</span>
            <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded font-bold">
              Vertex {currentStepLog.vertexLabel}
            </span>
          </div>
          <p className="leading-relaxed text-slate-700">{currentStepLog.explanation}</p>
        </div>
      )}

      {/* Colors Breakdown */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Assigned Soft Colors
        </label>
        {colorsUsed === 0 ? (
          <p className="text-xs text-slate-500 italic">No colors assigned yet. Click "Color Graph" to run.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {SOFT_COLORS.slice(0, Math.max(colorsUsed, 1)).map((c) => {
              const count = colorCounts.get(c.index) || 0;
              return (
                <div
                  key={c.index}
                  className="inline-flex items-center space-x-2 px-2.5 py-1 rounded border text-xs font-medium"
                  style={{ backgroundColor: c.bgHex, borderColor: c.borderHex, color: c.textHex }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.borderHex }} />
                  <span>Color {c.index + 1}:</span>
                  <span className="font-bold">{count} {count === 1 ? 'node' : 'nodes'}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
