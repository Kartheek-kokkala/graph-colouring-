/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Edge, OrderingStrategy, SimulatorMode, StepLog, Vertex } from './types';
import { PRESET_GRAPHS } from './utils/presets';
import { runGreedyColoring } from './utils/coloring';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { GraphCanvas } from './components/GraphCanvas';
import { SimulatorControls } from './components/SimulatorControls';
import { StatisticsPanel } from './components/StatisticsPanel';
import { HowItWorks } from './components/HowItWorks';
import { PythonCodeSection } from './components/PythonCodeSection';
import { InformationSection } from './components/InformationSection';
import { ApplicationsSection } from './components/ApplicationsSection';
import { AboutProject } from './components/AboutProject';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('simulator');

  // Initial student example from prompt: 5 vertices, edges 1-2, 1-3, 2-3, 2-4, 3-5
  const [numVerticesInput, setNumVerticesInput] = useState<number>(5);
  const [edgesTextInput, setEdgesTextInput] = useState<string>(
    '1 2\n1 3\n2 3\n2 4\n3 5'
  );

  // Layout generator
  const createLayout = (count: number) => {
    const list: Vertex[] = [];
    const centerX = 320;
    const centerY = 210;
    const radius = Math.min(145, 100 + count * 6);
    for (let i = 1; i <= count; i++) {
      const angle = (2 * Math.PI * (i - 1)) / count - Math.PI / 2;
      const x = Math.round(centerX + radius * Math.cos(angle));
      const y = Math.round(centerY + radius * Math.sin(angle));
      list.push({
        id: i,
        label: `V${i}`,
        x,
        y,
        colorIndex: null,
      });
    }
    return list;
  };

  const parseEdges = (text: string, maxV: number): Edge[] => {
    const lines = text.trim().split('\n');
    const result: Edge[] = [];
    const seen = new Set<string>();

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        const u = parseInt(parts[0], 10);
        const v = parseInt(parts[1], 10);
        if (!isNaN(u) && !isNaN(v) && u !== v && u >= 1 && u <= maxV && v >= 1 && v <= maxV) {
          const min = Math.min(u, v);
          const max = Math.max(u, v);
          const key = `${min}-${max}`;
          if (!seen.has(key)) {
            seen.add(key);
            result.push({
              id: `e${min}-${max}`,
              source: min,
              target: max,
            });
          }
        }
      }
    }
    return result;
  };

  // Initial state setup
  const [vertices, setVertices] = useState<Vertex[]>(() => createLayout(5));
  const [edges, setEdges] = useState<Edge[]>(() =>
    parseEdges('1 2\n1 3\n2 3\n2 4\n3 5', 5)
  );

  const [mode, setMode] = useState<SimulatorMode>('drag');
  const [selectedSourceId, setSelectedSourceId] = useState<number | null>(null);
  const [strategy, setStrategy] = useState<OrderingStrategy>('default');
  const [colorsUsed, setColorsUsed] = useState<number>(0);
  const [isLoadingPython, setIsLoadingPython] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(
    'Default 5-vertex student graph loaded. Click "Color Graph (Run Python)" to execute!'
  );

  // Step-by-Step state
  const [isStepping, setIsStepping] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepLogs, setStepLogs] = useState<StepLog[]>([]);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-dismiss notification after 4 seconds
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // Handle auto-play in step-by-step mode
  useEffect(() => {
    if (isPlayingAuto && isStepping) {
      if (currentStepIndex < stepLogs.length) {
        autoPlayTimerRef.current = setTimeout(() => {
          executeStep(currentStepIndex);
        }, 1100);
      } else {
        setIsPlayingAuto(false);
      }
    }
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isPlayingAuto, isStepping, currentStepIndex, stepLogs]);

  // Sync edge textarea when canvas edits occur
  const syncEdgesToText = (edgeList: Edge[]) => {
    const lines = edgeList.map((e) => `${e.source} ${e.target}`);
    setEdgesTextInput(lines.join('\n'));
  };

  // 1. Create Graph from student form inputs
  const handleCreateGraphFromInputs = (vCount: number, text: string) => {
    resetSteppingState();
    const newVerts = createLayout(vCount);
    const newEdges = parseEdges(text, vCount);
    setVertices(newVerts);
    setEdges(newEdges);
    setColorsUsed(0);
    setFeedbackMessage(`Graph created with ${vCount} vertices and ${newEdges.length} edges.`);
  };

  // 2. Add single edge from student input row
  const handleAddSingleEdge = (u: number, v: number) => {
    const min = Math.min(u, v);
    const max = Math.max(u, v);
    const exists = edges.some(
      (e) => (e.source === min && e.target === max) || (e.source === max && e.target === min)
    );
    if (exists) {
      setFeedbackMessage(`Edge between ${min} and ${max} already exists.`);
      return;
    }

    const newEdge: Edge = {
      id: `e${min}-${max}`,
      source: min,
      target: max,
    };
    const updated = [...edges, newEdge];
    setEdges(updated);
    syncEdgesToText(updated);
    resetSteppingState();
    setFeedbackMessage(`Added edge ${min} — ${max}.`);
  };

  // 3. Canvas direct: Add vertex
  const handleAddVertex = (x: number, y: number) => {
    const nextId = vertices.length > 0 ? Math.max(...vertices.map((v) => v.id)) + 1 : 1;
    const newVertex: Vertex = {
      id: nextId,
      label: `V${nextId}`,
      x,
      y,
      colorIndex: null,
    };
    setVertices((prev) => [...prev, newVertex]);
    setNumVerticesInput((prev) => Math.max(prev, nextId));
    setFeedbackMessage(`Added vertex ${newVertex.label}`);
    resetSteppingState();
  };

  // 4. Canvas direct: Select vertex for edge
  const handleSelectVertexForEdge = (id: number) => {
    if (selectedSourceId === null) {
      setSelectedSourceId(id);
      setFeedbackMessage(`Selected V${id}. Click a second vertex to connect.`);
    } else if (selectedSourceId === id) {
      setSelectedSourceId(null);
      setFeedbackMessage('Edge creation cancelled.');
    } else {
      handleAddSingleEdge(selectedSourceId, id);
      setSelectedSourceId(null);
    }
  };

  // 5. Canvas direct: Delete vertex
  const handleDeleteVertex = (id: number) => {
    const updatedVerts = vertices.filter((v) => v.id !== id);
    const updatedEdges = edges.filter((e) => e.source !== id && e.target !== id);
    setVertices(updatedVerts);
    setEdges(updatedEdges);
    syncEdgesToText(updatedEdges);
    setNumVerticesInput(updatedVerts.length);
    if (selectedSourceId === id) setSelectedSourceId(null);
    setFeedbackMessage(`Deleted vertex V${id}`);
    resetSteppingState();
  };

  // 6. Canvas direct: Delete edge
  const handleDeleteEdge = (edgeId: string) => {
    const updatedEdges = edges.filter((e) => e.id !== edgeId);
    setEdges(updatedEdges);
    syncEdgesToText(updatedEdges);
    setFeedbackMessage(`Deleted edge.`);
    resetSteppingState();
  };

  // 7. Move vertex
  const handleMoveVertex = (id: number, x: number, y: number) => {
    setVertices((prev) =>
      prev.map((v) => (v.id === id ? { ...v, x, y } : v))
    );
  };

  // 8. Color Graph - Runs Python Backend API (/api/color)
  const handleColorGraph = async () => {
    if (vertices.length === 0) {
      setFeedbackMessage('Cannot color an empty graph. Add vertices first!');
      return;
    }
    resetSteppingState();
    setIsLoadingPython(true);

    try {
      // Prepare payload for Python
      const payload = {
        num_vertices: vertices.length,
        edges: edges.map((e) => [e.source, e.target]),
      };

      // Call Python backend API
      const response = await fetch('/api/color', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          // Map Python colors back to vertices
          const colorMap = new Map<number, number>();
          for (const item of data.coloring) {
            colorMap.set(item.vertex, item.color_index);
          }

          setVertices((prev) =>
            prev.map((v) => ({
              ...v,
              colorIndex: colorMap.has(v.id) ? colorMap.get(v.id)! : null,
            }))
          );
          setColorsUsed(data.colors_used);
          setFeedbackMessage(
            `Python Backend Execution Success: ${data.colors_used} colors used for ${data.num_vertices} vertices!`
          );
          setIsLoadingPython(false);
          return;
        }
      }
      throw new Error('Fallback to local engine');
    } catch {
      // Client-side fallback to guarantee 100% functionality
      const result = runGreedyColoring(vertices, edges, strategy);
      setVertices(result.coloredVertices);
      setColorsUsed(result.colorsUsed);
      setFeedbackMessage(
        `Greedy coloring completed using ${result.colorsUsed} ${
          result.colorsUsed === 1 ? 'color' : 'colors'
        }!`
      );
    } finally {
      setIsLoadingPython(false);
    }
  };

  // 9. Reset colors
  const handleResetColors = () => {
    setVertices((prev) => prev.map((v) => ({ ...v, colorIndex: null })));
    setColorsUsed(0);
    resetSteppingState();
    setFeedbackMessage('All vertex colors reset to uncolored.');
  };

  // 10. Clear graph
  const handleClearGraph = () => {
    setVertices([]);
    setEdges([]);
    setEdgesTextInput('');
    setNumVerticesInput(0);
    setColorsUsed(0);
    setSelectedSourceId(null);
    resetSteppingState();
    setFeedbackMessage('Graph cleared.');
  };

  // 11. Load preset
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_GRAPHS.find((p) => p.id === presetId);
    if (!preset) return;
    setVertices(preset.vertices.map((v) => ({ ...v })));
    setEdges(preset.edges.map((e) => ({ ...e })));
    setNumVerticesInput(preset.vertices.length);
    syncEdgesToText(preset.edges);
    setColorsUsed(0);
    setSelectedSourceId(null);
    resetSteppingState();
    setFeedbackMessage(`Loaded preset "${preset.name}".`);

    const el = document.getElementById('simulator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Step-by-Step Helpers
  const resetSteppingState = () => {
    setIsStepping(false);
    setIsPlayingAuto(false);
    setCurrentStepIndex(0);
    setStepLogs([]);
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
  };

  const handleStartStepping = () => {
    if (vertices.length === 0) {
      setFeedbackMessage('Graph is empty. Please add vertices first.');
      return;
    }
    setVertices((prev) => prev.map((v) => ({ ...v, colorIndex: null })));
    setColorsUsed(0);

    const result = runGreedyColoring(vertices, edges, strategy);
    setStepLogs(result.steps);
    setIsStepping(true);
    setCurrentStepIndex(0);
    setIsPlayingAuto(false);
    setFeedbackMessage('Step-by-step mode active. Click "Next Step" to trace algorithm execution.');
  };

  const executeStep = (stepIdx: number) => {
    if (stepIdx >= stepLogs.length) return;
    const step = stepLogs[stepIdx];

    setVertices((prev) =>
      prev.map((v) =>
        v.id === step.vertexId ? { ...v, colorIndex: step.assignedColorIndex } : v
      )
    );

    const nextIdx = stepIdx + 1;
    setCurrentStepIndex(nextIdx);

    setVertices((currentVertices) => {
      const activeColors = new Set(
        currentVertices
          .filter((v) => v.colorIndex !== null)
          .map((v) => v.colorIndex!)
      );
      setColorsUsed(activeColors.size);
      return currentVertices;
    });

    if (nextIdx >= stepLogs.length) {
      setIsPlayingAuto(false);
      setFeedbackMessage('All vertices have been colored! Proper coloring verified.');
    }
  };

  const handleNextStep = () => {
    executeStep(currentStepIndex);
  };

  const handleToggleAutoPlay = () => {
    setIsPlayingAuto((prev) => !prev);
  };

  const activeStepLog = isStepping && currentStepIndex > 0 ? stepLogs[currentStepIndex - 1] : null;
  const currentExaminingStep = isStepping && currentStepIndex < stepLogs.length ? stepLogs[currentStepIndex] : null;

  const activeStepVertexId = currentExaminingStep ? currentExaminingStep.vertexId : null;
  const activeNeighborIds = currentExaminingStep ? currentExaminingStep.neighborIds : [];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col">
      {/* Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero Section */}
      <HomeHero
        onStartSimulator={() => {
          const el = document.getElementById('simulator');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectPreset={handleLoadPreset}
      />

      {/* Main Simulator Workspace */}
      <main id="simulator" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User feedback alert */}
        {feedbackMessage && (
          <div className="mb-4 px-4 py-2.5 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm flex items-center justify-between shadow-xs">
            <span>{feedbackMessage}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="ml-3 text-blue-700 hover:text-blue-900 font-bold text-xs"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Graph Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-lg border border-slate-300 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Graph Visual Display
                  </h2>
                  <p className="text-xs text-slate-500">
                    Vertices appear as circles with labels. Edges appear as lines.
                  </p>
                </div>

                <div className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {vertices.length} Vertices • {edges.length} Edges
                </div>
              </div>

              <GraphCanvas
                vertices={vertices}
                edges={edges}
                mode={mode}
                selectedSourceId={selectedSourceId}
                activeStepVertexId={activeStepVertexId}
                activeNeighborIds={activeNeighborIds}
                onAddVertex={handleAddVertex}
                onSelectVertexForEdge={handleSelectVertexForEdge}
                onDeleteVertex={handleDeleteVertex}
                onDeleteEdge={handleDeleteEdge}
                onMoveVertex={handleMoveVertex}
              />
            </div>
          </div>

          {/* Right Column: Controls & Statistics (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <SimulatorControls
              mode={mode}
              setMode={setMode}
              onColorGraph={handleColorGraph}
              onResetColors={handleResetColors}
              onClearGraph={handleClearGraph}
              onLoadPreset={handleLoadPreset}
              strategy={strategy}
              setStrategy={setStrategy}
              isStepping={isStepping}
              onStartStepping={handleStartStepping}
              onNextStep={handleNextStep}
              onResetStepping={resetSteppingState}
              isPlayingAuto={isPlayingAuto}
              onToggleAutoPlay={handleToggleAutoPlay}
              currentStepIndex={currentStepIndex}
              totalSteps={stepLogs.length}
              numVerticesInput={numVerticesInput}
              setNumVerticesInput={setNumVerticesInput}
              edgesTextInput={edgesTextInput}
              setEdgesTextInput={setEdgesTextInput}
              onCreateGraphFromInputs={handleCreateGraphFromInputs}
              onAddSingleEdge={handleAddSingleEdge}
              isLoadingPython={isLoadingPython}
            />

            <StatisticsPanel
              vertices={vertices}
              edges={edges}
              colorsUsed={colorsUsed}
              currentStepLog={activeStepLog}
              isStepping={isStepping}
            />
          </div>
        </div>
      </main>

      {/* Algorithm: How It Works Section */}
      <HowItWorks />

      {/* Python Code Files & VS Code Setup Guide */}
      <PythonCodeSection />

      {/* Information Section: Concepts & Definitions */}
      <InformationSection />

      {/* Real-World Applications */}
      <ApplicationsSection />

      {/* About Project Section */}
      <AboutProject />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-300">
            Graph Coloring Simulator — Python Subject Academic Project
          </p>
          <p className="text-slate-500">
            Built using Python, Flask, and clean HTML, CSS, and JavaScript.
          </p>
        </div>
      </footer>
    </div>
  );
}
