import React from 'react';
import { Play, ArrowDown, CheckCircle, Info, Sparkles } from 'lucide-react';

interface HomeHeroProps {
  onStartSimulator: () => void;
  onSelectPreset: (presetId: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onStartSimulator, onSelectPreset }) => {
  return (
    <section className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold mb-4 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Python Subject Academic Project</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Graph Coloring Simulator
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
            “Graph Coloring Simulator is a Python-based application that demonstrates how colors can be assigned to the vertices of a graph so that no two adjacent vertices have the same color.”
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onStartSimulator}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-xs text-sm sm:text-base cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Simulator</span>
            </button>

            <a
              href="#how-it-works"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-md bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors border border-slate-300 text-sm sm:text-base"
            >
              <ArrowDown className="w-4 h-4 text-slate-500" />
              <span>View Algorithm</span>
            </a>
          </div>
        </div>

        {/* Small section explaining what graph coloring means */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 mb-2 text-slate-900 font-semibold text-sm">
              <Info className="w-4 h-4 text-blue-600" />
              <h3>What is Graph Coloring?</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Graph coloring is the assignment of labels (or "colors") to the vertices of a graph such that no two adjacent vertices (connected by an edge) share the same color.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 mb-2 text-slate-900 font-semibold text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <h3>The Golden Rule</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              If vertex <strong>u</strong> and vertex <strong>v</strong> are connected by an edge <strong>(u, v)</strong>, then <code className="bg-slate-200 px-1 py-0.5 rounded text-xs text-slate-800">Color(u) ≠ Color(v)</code>. This is called a <strong>Proper Coloring</strong>.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 mb-2 text-slate-900 font-semibold text-sm">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">χ</span>
              <h3>Chromatic Number χ(G)</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The smallest number of colors needed to properly color a graph <em>G</em> is called its <strong>chromatic number</strong>, denoted as <strong>χ(G)</strong>.
            </p>
          </div>
        </div>

        {/* Quick presets helper */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Quick Demonstrations:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectPreset('k4')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 transition-colors cursor-pointer"
            >
              Complete K4 (4 Colors)
            </button>
            <button
              onClick={() => onSelectPreset('c5')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 transition-colors cursor-pointer"
            >
              Odd Cycle C5 (3 Colors)
            </button>
            <button
              onClick={() => onSelectPreset('bipartite')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 transition-colors cursor-pointer"
            >
              Bipartite K3,3 (2 Colors)
            </button>
            <button
              onClick={() => onSelectPreset('petersen')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 transition-colors cursor-pointer"
            >
              Petersen Graph
            </button>
            <button
              onClick={() => onSelectPreset('exam-schedule')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 transition-colors cursor-pointer"
            >
              Exam Timetable Graph
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
