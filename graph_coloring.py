#!/usr/bin/env python3
"""
Graph Coloring Algorithm - Python Academic Project
Author: Kartheek Kokkala
Course: Python Programming / Design & Analysis of Algorithms

This module implements the Greedy Graph Coloring Algorithm using
basic Python data structures: dictionaries, lists, sets, loops, and conditions.
"""

import sys
import json

# Predefined soft, student-friendly colors (no high-brightness/neon)
COLOR_PALETTE = [
    {"index": 0, "name": "Color 1 (Light Blue)",   "bg": "#bfdbfe", "border": "#3b82f6", "text": "#1e3a8a"},
    {"index": 1, "name": "Color 2 (Light Green)",  "bg": "#bbf7d0", "border": "#22c55e", "text": "#14532d"},
    {"index": 2, "name": "Color 3 (Light Yellow)", "bg": "#fef08a", "border": "#eab308", "text": "#713f12"},
    {"index": 3, "name": "Color 4 (Light Red)",    "bg": "#fecaca", "border": "#ef4444", "text": "#7f1d1d"},
    {"index": 4, "name": "Color 5 (Light Purple)", "bg": "#e9d5ff", "border": "#a855f7", "text": "#581c87"},
    {"index": 5, "name": "Color 6 (Light Orange)", "bg": "#fed7aa", "border": "#f97316", "text": "#7c2d12"},
    {"index": 6, "name": "Color 7 (Light Teal)",   "bg": "#99f6e4", "border": "#14b8a6", "text": "#134e4a"},
]


def create_graph(vertices_count, edges):
    """
    Creates an undirected graph represented as an adjacency list dictionary.
    
    Parameters:
        vertices_count (int): Number of vertices (labeled 1 to vertices_count)
        edges (list of tuples/lists): List of pairs [u, v]
        
    Returns:
        dict: Adjacency list mapping each vertex to a list of its neighbors.
    """
    # Initialize dictionary with empty neighbor list for each vertex
    graph = {}
    for v in range(1, vertices_count + 1):
        graph[v] = []

    # Add edges in both directions (undirected graph)
    for edge in edges:
        if len(edge) == 2:
            u, v = int(edge[0]), int(edge[1])
            # Validate vertex numbers
            if 1 <= u <= vertices_count and 1 <= v <= vertices_count:
                if u != v:  # No self loops
                    if v not in graph[u]:
                        graph[u].append(v)
                    if u not in graph[v]:
                        graph[v].append(u)

    # Sort neighbor lists for predictable ordering
    for v in graph:
        graph[v].sort()

    return graph


def greedy_coloring(graph):
    """
    Implements the Greedy Graph Coloring Algorithm.
    
    Algorithm:
    1. Iterate through each vertex in order.
    2. Collect colors already assigned to its neighbors.
    3. Find the smallest non-negative integer color not in used_colors.
    4. Assign that color to the current vertex.
    
    Parameters:
        graph (dict): Adjacency list of the graph.
        
    Returns:
        tuple: (color_dict, steps_log)
    """
    color = {}
    steps = []

    for vertex in sorted(graph.keys()):
        used_colors = set()
        neighbor_details = []

        # Check the colors of all adjacent neighbors
        for neighbor in graph[vertex]:
            if neighbor in color:
                assigned_c = color[neighbor]
                used_colors.add(assigned_c)
                neighbor_details.append(f"Vertex {neighbor} (Color {assigned_c + 1})")
            else:
                neighbor_details.append(f"Vertex {neighbor} (Uncolored)")

        # Find the smallest available color starting from 0
        current_color = 0
        while current_color in used_colors:
            current_color += 1

        color[vertex] = current_color

        color_meta = COLOR_PALETTE[current_color % len(COLOR_PALETTE)]
        steps.append({
            "vertex": vertex,
            "neighbors": graph[vertex],
            "used_colors": list(used_colors),
            "assigned_color_index": current_color,
            "assigned_color_label": f"Color {current_color + 1}",
            "color_name": color_meta["name"],
            "explanation": (
                f"Selected Vertex {vertex}. Neighbors: [{', '.join(neighbor_details) if neighbor_details else 'None'}]. "
                f"Smallest available color is Color {current_color + 1} ({color_meta['name']})."
            )
        })

    return color, steps


def solve_graph_coloring(vertices_count, edges):
    """
    Main function to solve graph coloring and return comprehensive results.
    """
    graph = create_graph(vertices_count, edges)
    coloring_map, steps = greedy_coloring(graph)

    # Calculate number of distinct colors used
    unique_colors = set(coloring_map.values())
    colors_used = len(unique_colors)

    # Format result per vertex
    result_list = []
    for v in sorted(coloring_map.keys()):
        c_idx = coloring_map[v]
        palette_entry = COLOR_PALETTE[c_idx % len(COLOR_PALETTE)]
        result_list.append({
            "vertex": v,
            "color_index": c_idx,
            "color_number": c_idx + 1,
            "color_label": f"Color {c_idx + 1}",
            "color_name": palette_entry["name"],
            "bg": palette_entry["bg"],
            "border": palette_entry["border"],
            "text": palette_entry["text"],
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


# Standalone CLI test or JSON API entry point
if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--json":
        # Read from argument or stdin
        raw_input = sys.argv[2] if len(sys.argv) > 2 else sys.stdin.read()
        try:
            data = json.loads(raw_input)
            v_count = int(data.get("num_vertices", 5))
            edges_list = data.get("edges", [])
            output = solve_graph_coloring(v_count, edges_list)
            print(json.dumps(output))
        except Exception as e:
            print(json.dumps({"status": "error", "message": str(e)}))
    else:
        # Default terminal demonstration
        print("=" * 50)
        print("  GRAPH COLORING SIMULATOR - PYTHON DEMO")
        print("=" * 50)
        sample_v = 5
        sample_edges = [(1, 2), (1, 3), (2, 3), (2, 4), (3, 5)]
        print(f"Number of Vertices: {sample_v}")
        print("Edges: 1-2, 1-3, 2-3, 2-4, 3-5\n")

        res = solve_graph_coloring(sample_v, sample_edges)
        print("Graph Coloring Result:")
        print(f"Number of Vertices: {res['num_vertices']}")
        print(f"Number of Edges: {res['num_edges']}")
        print(f"Number of Colors Used: {res['colors_used']}\n")

        for item in res["coloring"]:
            print(f"Vertex {item['vertex']} → {item['color_label']} ({item['color_name']})")
        print("=" * 50)
