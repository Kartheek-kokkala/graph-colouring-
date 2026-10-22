import React from 'react';
import { Check, Code, GitFork, Zap, ArrowDown } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Create the graph',
      desc: 'Define the set of vertices V and the set of edges E representing connections between elements using an adjacency list dictionary.',
    },
    {
      num: 2,
      title: 'Select a vertex',
      desc: 'Pick an uncolored vertex from the graph according to its natural order (Vertex 1, 2, ...).',
    },
    {
      num: 3,
      title: 'Check the colors of its neighboring vertices',
      desc: 'Inspect all vertices adjacent to the selected vertex and add their assigned colors into a Python set (used_colors).',
    },
    {
      num: 4,
      title: 'Assign the smallest available color',
      desc: 'Find the lowest non-negative integer color (0, 1, 2, ...) that is not present in used_colors.',
    },
    {
      num: 5,
      title: 'Repeat for all vertices',
      desc: 'Move to the next vertex and repeat until every single vertex has been assigned a color.',
    },
    {
      num: 6,
      title: 'Display the final colored graph',
      desc: 'Render the colored graph on the webpage and calculate the total number of colors used.',
    },
  ];

  const flowchartSteps = [
    'Start',
    'Create Graph',
    'Select a Vertex',
    'Check Neighbor Colors',
    'Assign Smallest Available Color',
    'Move to Next Vertex',
    'Repeat Until All Vertices Are Colored',
    'Display Result',
    'End',
  ];

  const pythonCode = `def greedy_coloring(graph):
    color = {}

    for vertex in graph:
        used_colors = set()

        for neighbor in graph[vertex]:
            if neighbor in color:
                used_colors.add(color[neighbor])

        current_color = 0

        while current_color in used_colors:
            current_color += 1

        color[vertex] = current_color

    return color`;

  return (
    <section id="how-it-works" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Algorithm & Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            How It Works (Python Greedy Algorithm)
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl mx-auto">
            The project uses a Python implementation of the <strong>Greedy Coloring Algorithm</strong> to assign colors sequentially using basic dictionaries, sets, and loops.
          </p>
        </div>

        {/* Flowchart Diagram */}
        <div className="bg-slate-50 border border-slate-300 rounded-lg p-5 mb-8">
          <h3 className="text-sm font-bold text-slate-800 mb-3 text-center uppercase tracking-wider">
            Greedy Coloring Execution Flowchart
          </h3>
          <div className="flex flex-col items-center space-y-1">
            {flowchartSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="w-64 py-2 px-4 rounded bg-white border-2 border-blue-800 text-blue-900 font-semibold text-xs sm:text-sm text-center shadow-xs">
                  {step}
                </div>
                {idx < flowchartSteps.length - 1 && (
                  <ArrowDown className="w-4 h-4 text-slate-500 my-0.5" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 6 Steps List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {steps.map((s) => (
            <div
              key={s.num}
              className="flex items-start space-x-3.5 p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold text-sm flex items-center justify-center shrink-0">
                {s.num}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {s.num}. {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Python Code Block */}
        <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-sm mb-8">
          <div className="px-4 py-2.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-white">Python Logic: greedy_coloring(graph)</span>
            </div>
            <span className="text-slate-400 font-mono">graph_coloring.py</span>
          </div>
          <div className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed bg-[#0f172a]">
            <pre className="whitespace-pre">{pythonCode}</pre>
          </div>
        </div>

        {/* Algorithm Analysis Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm mb-1">
              <Zap className="w-4 h-4 text-amber-600" />
              <h4>Time Complexity</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>O(V² + E)</strong>: For each vertex, inspecting neighbors and finding the smallest available color in the worst case.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm mb-1">
              <GitFork className="w-4 h-4 text-blue-600" />
              <h4>Space Complexity</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>O(V)</strong> auxiliary space for storing the color dictionary and temporary sets of neighbor colors.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm mb-1">
              <Check className="w-4 h-4 text-green-600" />
              <h4>Data Structures</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Built purely using standard Python: <strong>dict</strong> for graph adjacency, <strong>set</strong> for neighbor colors, and integer counters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
