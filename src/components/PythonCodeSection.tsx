import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, FolderTree, BookOpen, ExternalLink } from 'lucide-react';

interface FileItem {
  name: string;
  path: string;
  language: string;
  code: string;
  description: string;
}

export const PythonCodeSection: React.FC = () => {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const files: FileItem[] = [
    {
      name: 'graph_coloring.py',
      path: 'graph_coloring_simulator/graph_coloring.py',
      language: 'python',
      description: 'Core greedy graph coloring algorithm implemented with basic Python data structures.',
      code: `"""
Graph Coloring Algorithm - Python Academic Project
Author: Kartheek Kokkala
Course: Python Programming / Design & Analysis of Algorithms

Implements:
1. create_graph(vertices_count, edges) -> Adjacency list dictionary
2. greedy_coloring(graph) -> Color assignments and step logs
3. solve_graph_coloring(vertices_count, edges) -> Formatted summary
"""

COLOR_PALETTE = [
    {"index": 0, "name": "Light Blue",   "bg": "#bfdbfe", "border": "#3b82f6", "text": "#1e3a8a"},
    {"index": 1, "name": "Light Green",  "bg": "#bbf7d0", "border": "#22c55e", "text": "#14532d"},
    {"index": 2, "name": "Light Yellow", "bg": "#fef08a", "border": "#eab308", "text": "#713f12"},
    {"index": 3, "name": "Light Red",    "bg": "#fecaca", "border": "#ef4444", "text": "#7f1d1d"},
    {"index": 4, "name": "Light Purple", "bg": "#e9d5ff", "border": "#a855f7", "text": "#581c87"},
    {"index": 5, "name": "Light Orange", "bg": "#fed7aa", "border": "#f97316", "text": "#7c2d12"},
    {"index": 6, "name": "Light Teal",   "bg": "#99f6e4", "border": "#14b8a6", "text": "#134e4a"},
]


def create_graph(vertices_count, edges):
    """
    Creates an adjacency list dictionary representing an undirected graph.
    Example output for 3 vertices with edge (1,2):
    {1: [2], 2: [1], 3: []}
    """
    graph = {}
    for v in range(1, vertices_count + 1):
        graph[v] = []

    for edge in edges:
        if len(edge) >= 2:
            u, v = int(edge[0]), int(edge[1])
            if 1 <= u <= vertices_count and 1 <= v <= vertices_count and u != v:
                if v not in graph[u]:
                    graph[u].append(v)
                if u not in graph[v]:
                    graph[v].append(u)

    for v in graph:
        graph[v].sort()

    return graph


def greedy_coloring(graph):
    """
    Implements the Greedy Graph Coloring Algorithm in Python.
    
    Algorithm:
    1. Iterate through each vertex in sorted order.
    2. Collect colors already assigned to its adjacent neighbors.
    3. Find the smallest non-negative integer color not in used_colors.
    4. Assign that color to the vertex.
    """
    color = {}
    steps = []

    for vertex in sorted(graph.keys()):
        used_colors = set()
        neighbor_info = []

        # Check colors of adjacent neighbors
        for neighbor in graph[vertex]:
            if neighbor in color:
                assigned = color[neighbor]
                used_colors.add(assigned)
                neighbor_info.append(f"Vertex {neighbor} (Color {assigned + 1})")
            else:
                neighbor_info.append(f"Vertex {neighbor} (Uncolored)")

        # Find the smallest available color (0, 1, 2, ...)
        current_color = 0
        while current_color in used_colors:
            current_color += 1

        color[vertex] = current_color
        color_entry = COLOR_PALETTE[current_color % len(COLOR_PALETTE)]

        steps.append({
            "vertex": vertex,
            "neighbors": graph[vertex],
            "assigned_color_index": current_color,
            "assigned_color_label": f"Color {current_color + 1}",
            "color_name": color_entry["name"],
            "explanation": (
                f"Selected Vertex {vertex}. "
                f"Neighbors: [{', '.join(neighbor_info) if neighbor_info else 'None'}]. "
                f"Smallest available color is Color {current_color + 1} ({color_entry['name']})."
            )
        })

    return color, steps


def solve_graph_coloring(vertices_count, edges):
    """
    Calculates the full coloring result and summary statistics.
    """
    graph = create_graph(vertices_count, edges)
    coloring_map, steps = greedy_coloring(graph)

    unique_colors = set(coloring_map.values())
    colors_used = len(unique_colors)

    result_list = []
    for v in sorted(coloring_map.keys()):
        c_idx = coloring_map[v]
        p = COLOR_PALETTE[c_idx % len(COLOR_PALETTE)]
        result_list.append({
            "vertex": v,
            "color_index": c_idx,
            "color_number": c_idx + 1,
            "color_label": f"Color {c_idx + 1}",
            "color_name": p["name"],
            "bg": p["bg"],
            "border": p["border"],
            "text": p["text"],
            "degree": len(graph[v]),
            "neighbors": graph[v]
        })

    return {
        "status": "success",
        "num_vertices": vertices_count,
        "num_edges": len(edges),
        "colors_used": colors_used,
        "adjacency_list": graph,
        "coloring": result_list,
        "steps": steps
    }
`,
    },
    {
      name: 'app.py',
      path: 'graph_coloring_simulator/app.py',
      language: 'python',
      description: 'Flask web application entry point routing Home, Simulator, and /api/color.',
      code: `"""
Graph Coloring Simulator - Flask Web Application
Author: Kartheek Kokkala
Course: Python Programming

Routes:
- /            -> Home page (templates/index.html)
- /simulator   -> Interactive simulator (templates/simulator.html)
- /api/color   -> Runs greedy_coloring in Python and returns JSON
"""

from flask import Flask, render_template, request, jsonify
from graph_coloring import solve_graph_coloring

app = Flask(__name__)


@app.route("/")
def home():
    """Renders the project home page."""
    return render_template("index.html")


@app.route("/simulator")
def simulator():
    """Renders the interactive graph simulator page."""
    return render_template("simulator.html")


@app.route("/api/color", methods=["POST"])
def color_graph_api():
    """
    Receives graph data, executes Python greedy coloring, and returns JSON.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "No JSON payload provided"}), 400

        num_vertices = int(data.get("num_vertices", 0))
        if num_vertices <= 0:
            return jsonify({"status": "error", "message": "Number of vertices must be > 0"}), 400

        raw_edges = data.get("edges", [])
        clean_edges = []
        for edge in raw_edges:
            if len(edge) >= 2:
                clean_edges.append((int(edge[0]), int(edge[1])))

        # Execute Python Graph Coloring
        result = solve_graph_coloring(num_vertices, clean_edges)
        return jsonify(result)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    print("Starting Graph Coloring Simulator on http://127.0.0.1:5000")
    app.run(debug=True, host="127.0.0.1", port=5000)
`,
    },
    {
      name: 'templates/simulator.html',
      path: 'graph_coloring_simulator/templates/simulator.html',
      language: 'html',
      description: 'HTML5 template for the interactive simulator, graph canvas, and output section.',
      code: `<!-- (Full HTML5 template located at graph_coloring_simulator/templates/simulator.html) -->
<!-- Features input fields for Number of Vertices, Add Edge, SVG canvas, and Result box -->`,
    },
    {
      name: 'static/script.js',
      path: 'graph_coloring_simulator/static/script.js',
      language: 'javascript',
      description: 'JavaScript connecting DOM inputs to the Flask Python API and rendering the SVG graph.',
      code: `// (Full client script located at graph_coloring_simulator/static/script.js)
// Handles SVG rendering, drag interactions, and fetch('/api/color')`,
    },
    {
      name: 'requirements.txt',
      path: 'graph_coloring_simulator/requirements.txt',
      language: 'text',
      description: 'Python package dependency file.',
      code: `Flask>=2.2.0`,
    },
    {
      name: 'README.md',
      path: 'graph_coloring_simulator/README.md',
      language: 'markdown',
      description: 'Detailed instructions on how to run in VS Code, directory layout, and viva Q&A.',
      code: `# Complete setup instructions available in graph_coloring_simulator/README.md`,
    },
  ];

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const activeFile = files[activeFileIndex];

  const handleCopy = (code: string, path: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2500);
  };

  return (
    <section id="python-code" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Python Subject Project Files & Guide
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Python Code & VS Code Execution Guide
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
            All code files are organized cleanly in the <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono text-xs">graph_coloring_simulator/</code> directory, ready to run locally in Visual Studio Code.
          </p>
        </div>

        {/* Step-by-Step VS Code Guide Box */}
        <div className="bg-slate-50 border border-slate-300 rounded-lg p-5 mb-8">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base mb-3 border-b border-slate-200 pb-2">
            <Terminal className="w-5 h-5 text-blue-600" />
            <h3>How to Run this Project in VS Code (Step-by-Step)</h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <strong>Open Folder in VS Code:</strong>
                <p className="text-slate-600 mt-0.5">Open VS Code, click <em>File → Open Folder...</em> and select the <code className="bg-slate-200 px-1 rounded font-mono text-xs">graph_coloring_simulator</code> directory.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <strong>Open Integrated Terminal:</strong>
                <p className="text-slate-600 mt-0.5">Press <kbd className="bg-slate-200 px-1.5 py-0.5 rounded text-xs border border-slate-300 font-mono">Ctrl + `</kbd> (or go to <em>Terminal → New Terminal</em>).</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <strong>Install Flask:</strong>
                <div className="bg-slate-900 text-slate-100 p-2.5 rounded font-mono text-xs mt-1">
                  pip install -r requirements.txt
                </div>
                <p className="text-slate-500 text-xs mt-0.5">(Or run <code className="bg-slate-200 px-1 rounded text-slate-800">pip install flask</code>)</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
              <div>
                <strong>Start the Application:</strong>
                <div className="bg-slate-900 text-slate-100 p-2.5 rounded font-mono text-xs mt-1">
                  python app.py
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">5</span>
              <div>
                <strong>View in Browser:</strong>
                <p className="text-slate-600 mt-0.5">Open your browser and navigate to <code className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono font-bold text-xs">http://127.0.0.1:5000</code>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Structure Diagram */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm mb-2">
            <FolderTree className="w-4 h-4 text-blue-600" />
            <h4>Python Project Folder Structure:</h4>
          </div>
          <pre className="bg-white p-3 rounded border border-slate-300 font-mono text-xs text-slate-800 overflow-x-auto">
{`graph_coloring_simulator/
│
├── app.py                  # Flask web server and endpoints
├── graph_coloring.py       # Pure Python greedy coloring algorithm
├── requirements.txt        # Flask dependency
│
├── templates/
│   ├── index.html          # Home page
│   └── simulator.html      # Interactive simulator page
│
├── static/
│   ├── style.css           # Soft academic styling
│   └── script.js           # SVG graph rendering and fetch API
│
└── README.md               # Complete documentation and viva guide`}
          </pre>
        </div>

        {/* File Browser & Code Viewer */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden shadow-sm">
          {/* File Tab Selector */}
          <div className="bg-slate-800 px-3 py-2 border-b border-slate-700 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {files.map((file, idx) => (
                <button
                  key={file.path}
                  onClick={() => setActiveFileIndex(idx)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    activeFileIndex === idx
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{file.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => handleCopy(activeFile.code, activeFile.path)}
              className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium flex items-center space-x-1.5 cursor-pointer transition-colors"
              title="Copy code to clipboard"
            >
              {copiedPath === activeFile.path ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* File details bar */}
          <div className="px-4 py-2 bg-slate-850 border-b border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="font-mono text-slate-300">{activeFile.path}</span>
            <span className="text-slate-400 italic">{activeFile.description}</span>
          </div>

          {/* Code display */}
          <div className="p-4 overflow-x-auto max-h-[460px] text-xs font-mono text-slate-200 leading-relaxed bg-[#0f172a]">
            <pre className="whitespace-pre">{activeFile.code}</pre>
          </div>
        </div>
      </div>
    </section>
  );
};
