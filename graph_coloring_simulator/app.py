"""
Graph Coloring Simulator - Flask Web Application
Author: Kartheek Kokkala
Course: Python Programming

This Flask application serves:
1. Home Page (/) - Project introduction, theory, and applications
2. Simulator Page (/simulator) - Interactive graph creator and visualizer
3. API Endpoint (/api/color) - Executes greedy coloring in Python and returns JSON
"""

from flask import Flask, render_template, request, jsonify
from graph_coloring import solve_graph_coloring

app = Flask(__name__)


@app.route("/")
def home():
    """Renders the project home page with introductory notes."""
    return render_template("index.html")


@app.route("/simulator")
def simulator():
    """Renders the interactive graph simulator page."""
    return render_template("simulator.html")


@app.route("/api/color", methods=["POST"])
def color_graph_api():
    """
    API endpoint that receives graph vertices and edges,
    executes the greedy graph coloring algorithm in Python,
    and returns the color assignment and statistics as JSON.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "No JSON payload provided"}), 400

        # Extract number of vertices
        num_vertices = int(data.get("num_vertices", 0))
        if num_vertices <= 0:
            return jsonify({"status": "error", "message": "Number of vertices must be greater than 0"}), 400

        # Extract edge list e.g. [[1, 2], [2, 3], ...]
        raw_edges = data.get("edges", [])
        clean_edges = []
        for edge in raw_edges:
            if len(edge) >= 2:
                u, v = int(edge[0]), int(edge[1])
                clean_edges.append((u, v))

        # Run Python Greedy Coloring
        result = solve_graph_coloring(num_vertices, clean_edges)
        return jsonify(result)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    # Run development server on port 5000 (standard Flask port)
    print("Starting Graph Coloring Simulator on http://127.0.0.1:5000")
    app.run(debug=True, host="127.0.0.1", port=5000)
