import React, { useState } from 'react';
import {
  PlusCircle,
  GitCommit,
  Move,
  Trash2,
  Palette,
  RotateCcw,
  RefreshCw,
  Play,
  SkipForward,
  Pause,
  FolderOpen,
  Plus,
  PlayCircle,
} from 'lucide-react';
import { OrderingStrategy, SimulatorMode } from '../types';
import { PRESET_GRAPHS } from '../utils/presets';

interface SimulatorControlsProps {
  mode: SimulatorMode;
  setMode: (mode: SimulatorMode) => void;
  onColorGraph: () => void;
  onResetColors: () => void;
  onClearGraph: () => void;
  onLoadPreset: (presetId: string) => void;
  strategy: OrderingStrategy;
  setStrategy: (strategy: OrderingStrategy) => void;
  // Step-by-step
  isStepping: boolean;
  onStartStepping: () => void;
  onNextStep: () => void;
  onResetStepping: () => void;
  isPlayingAuto: boolean;
  onToggleAutoPlay: () => void;
  currentStepIndex: number;
  totalSteps: number;
  // Student Input Form props
  numVerticesInput: number;
  setNumVerticesInput: (n: number) => void;
  edgesTextInput: string;
  setEdgesTextInput: (text: string) => void;
  onCreateGraphFromInputs: (vCount: number, edgesText: string) => void;
  onAddSingleEdge: (u: number, v: number) => void;
  isLoadingPython?: boolean;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  mode,
  setMode,
  onColorGraph,
  onResetColors,
  onClearGraph,
  onLoadPreset,
  strategy,
  setStrategy,
  isStepping,
  onStartStepping,
  onNextStep,
  onResetStepping,
  isPlayingAuto,
  onToggleAutoPlay,
  currentStepIndex,
  totalSteps,
  numVerticesInput,
  setNumVerticesInput,
  edgesTextInput,
  setEdgesTextInput,
  onCreateGraphFromInputs,
  onAddSingleEdge,
  isLoadingPython = false,
}) => {
  const [edgeU, setEdgeU] = useState<string>('1');
  const [edgeV, setEdgeV] = useState<string>('2');
  const [activeTab, setActiveTab] = useState<'inputs' | 'canvas-tools'>('inputs');

  const handleAddEdgeClick = () => {
    const u = parseInt(edgeU, 10);
    const v = parseInt(edgeV, 10);
    if (isNaN(u) || isNaN(v) || u === v) {
      alert('Please enter two different valid vertex numbers.');
      return;
    }
    if (u < 1 || v < 1 || u > numVerticesInput || v > numVerticesInput) {
      alert(`Vertices must be between 1 and ${numVerticesInput}.`);
      return;
    }
    onAddSingleEdge(u, v);
    // increment for convenience
    setEdgeU(String(Math.min(u + 1, numVerticesInput)));
    setEdgeV(String(Math.min(v + 1, numVerticesInput)));
  };

  return (
    <div className="bg-white rounded-lg border border-slate-300 p-4 shadow-xs space-y-4">
      {/* Tab toggle between Student Form Input and Canvas Interactive Tools */}
      <div className="flex border-b border-slate-200 pb-2 gap-2">
        <button
          onClick={() => setActiveTab('inputs')}
          className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold cursor-pointer transition-colors ${
            activeTab === 'inputs'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Graph Setup & Edges Form
        </button>
        <button
          onClick={() => setActiveTab('canvas-tools')}
          className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold cursor-pointer transition-colors ${
            activeTab === 'canvas-tools'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Interactive Canvas Tools
        </button>
      </div>

      {activeTab === 'inputs' ? (
        /* Form Inputs matching Python subject requirements */
        <div className="space-y-3">
          {/* 1. Enter Number of Vertices */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              1. Number of Vertices:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="15"
                value={numVerticesInput}
                onChange={(e) => setNumVerticesInput(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-24 px-2.5 py-1.5 border border-slate-300 rounded text-sm text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50"
              />
              <span className="text-xs text-slate-500">Vertices labeled 1 to {numVerticesInput}</span>
            </div>
          </div>

          {/* 2. Add Edge Button & Row */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              2. Add Edge (one by one):
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max={numVerticesInput}
                placeholder="u"
                value={edgeU}
                onChange={(e) => setEdgeU(e.target.value)}
                className="w-16 px-2 py-1.5 border border-slate-300 rounded text-xs text-slate-800 text-center bg-slate-50"
              />
              <span className="text-slate-400 font-bold">—</span>
              <input
                type="number"
                min="1"
                max={numVerticesInput}
                placeholder="v"
                value={edgeV}
                onChange={(e) => setEdgeV(e.target.value)}
                className="w-16 px-2 py-1.5 border border-slate-300 rounded text-xs text-slate-800 text-center bg-slate-50"
              />
              <button
                type="button"
                onClick={handleAddEdgeClick}
                className="flex items-center space-x-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Edge</span>
              </button>
            </div>
          </div>

          {/* 3. Edges textarea */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Graph Edges:
              </label>
              <span className="text-xs text-slate-400 font-mono">Format: u v</span>
            </div>
            <textarea
              rows={4}
              value={edgesTextInput}
              onChange={(e) => setEdgesTextInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono text-slate-800 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder={'1 2\n1 3\n2 3\n2 4\n3 5'}
            />
          </div>

          {/* Create Graph Button */}
          <button
            type="button"
            onClick={() => onCreateGraphFromInputs(numVerticesInput, edgesTextInput)}
            className="w-full flex items-center justify-center space-x-1.5 px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors shadow-xs"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Create / Update Graph</span>
          </button>
        </div>
      ) : (
        /* Canvas Direct Manipulation Tools */
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Canvas Direct Editor Tools:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode('add-vertex')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded border text-xs font-medium cursor-pointer ${
                mode === 'add-vertex'
                  ? 'bg-blue-100 border-blue-600 text-blue-800 font-bold'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Vertex</span>
            </button>

            <button
              onClick={() => setMode('add-edge')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded border text-xs font-medium cursor-pointer ${
                mode === 'add-edge'
                  ? 'bg-blue-100 border-blue-600 text-blue-800 font-bold'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Add Edge</span>
            </button>

            <button
              onClick={() => setMode('drag')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded border text-xs font-medium cursor-pointer ${
                mode === 'drag'
                  ? 'bg-blue-100 border-blue-600 text-blue-800 font-bold'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Move className="w-3.5 h-3.5" />
              <span>Move / Drag</span>
            </button>

            <button
              onClick={() => setMode('delete')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded border text-xs font-medium cursor-pointer ${
                mode === 'delete'
                  ? 'bg-red-100 border-red-600 text-red-800 font-bold'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Algorithm Execution Buttons */}
      <div className="pt-2 border-t border-slate-200 space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
          Algorithm Execution:
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={onColorGraph}
            disabled={isLoadingPython}
            className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-md bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm cursor-pointer transition-colors shadow-xs"
            title="Execute Python Greedy Coloring Algorithm"
          >
            <Palette className="w-4 h-4" />
            <span>{isLoadingPython ? 'Running Python...' : 'Color Graph (Run Python)'}</span>
          </button>

          {!isStepping ? (
            <button
              onClick={onStartStepping}
              className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-md bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm cursor-pointer transition-colors"
              title="Step-by-step coloring demo to explain to faculty"
            >
              <Play className="w-4 h-4" />
              <span>Step-by-Step Mode</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={onNextStep}
                disabled={currentStepIndex >= totalSteps}
                className="flex-1 flex items-center justify-center space-x-1 px-2.5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Next Step</span>
              </button>

              <button
                onClick={onToggleAutoPlay}
                className="px-2.5 py-2.5 rounded-md bg-slate-700 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer"
              >
                {isPlayingAuto ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onResetStepping}
                className="px-2.5 py-2.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs cursor-pointer font-medium"
              >
                Stop
              </button>
            </div>
          )}
        </div>

        {isStepping && (
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex justify-between">
            <span>Step {currentStepIndex} of {totalSteps}</span>
            <span>{currentStepIndex >= totalSteps ? 'Complete!' : 'Click Next Step'}</span>
          </div>
        )}
      </div>

      {/* Auxiliary Controls */}
      <div className="pt-2 border-t border-slate-200 space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={onResetColors}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Colors</span>
          </button>

          <button
            onClick={onClearGraph}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-1.5 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-red-600" />
            <span>Clear Graph</span>
          </button>
        </div>

        {/* Load Preset */}
        <div className="flex items-center space-x-2 text-xs">
          <FolderOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <select
            onChange={(e) => {
              if (e.target.value) onLoadPreset(e.target.value);
            }}
            defaultValue=""
            className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-800"
          >
            <option value="" disabled>Load Example Preset...</option>
            {PRESET_GRAPHS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
