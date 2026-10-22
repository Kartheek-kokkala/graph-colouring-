"""
Graph Coloring Module
Author: Kartheek Kokkala
Course: Python Programming / Design & Analysis of Algorithms

Contains:
1. create_graph(vertices_count, edges) -> Adjacency list dictionary
2. greedy_coloring(graph) -> Colors dictionary and step explanations
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
    Implements the Greedy Graph Coloring Algorithm.
    For each vertex in order:
      1. Check colors taken by adjacent vertices.
      2. Pick the smallest non-negative integer color available.
      3. Assign it to the vertex.
    """
    color = {}
    steps = []

    for vertex in sorted(graph.keys()):
        used_colors = set()
        neighbor_info = []

        for neighbor in graph[vertex]:
            if neighbor in color:
                assigned = color[neighbor]
                used_colors.add(assigned)
                neighbor_info.append(f"Vertex {neighbor} (Color {assigned + 1})")
            else:
                neighbor_info.append(f"Vertex {neighbor} (Uncolored)")

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
    Returns full result payload with vertex color details and statistics.
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
