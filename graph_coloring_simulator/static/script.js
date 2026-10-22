/**
 * Graph Coloring Simulator - Frontend JavaScript
 * Connects HTML UI to Flask Python API (/api/color)
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const numVerticesInput = document.getElementById("numVertices");
    const edgeUInput = document.getElementById("edgeU");
    const edgeVInput = document.getElementById("edgeV");
    const btnAddEdge = document.getElementById("btnAddEdge");
    const edgesText = document.getElementById("edgesText");
    const btnCreateGraph = document.getElementById("btnCreateGraph");
    const btnColorGraph = document.getElementById("btnColorGraph");
    const btnResetGraph = document.getElementById("btnResetGraph");
    const graphStatusBadge = document.getElementById("graphStatusBadge");
    const graphSvg = document.getElementById("graphSvg");
    const edgesLayer = document.getElementById("edgesLayer");
    const verticesLayer = document.getElementById("verticesLayer");

    // Result DOM Elements
    const statVertices = document.getElementById("statVertices");
    const statEdges = document.getElementById("statEdges");
    const statColors = document.getElementById("statColors");
    const resultPre = document.getElementById("resultPre");
    const stepLogList = document.getElementById("stepLogList");

    // Local State
    let currentVertices = [];
    let currentEdges = [];
    let isColored = false;

    // Presets
    const PRESETS = {
        sample5: {
            v: 5,
            edges: "1 2\n1 3\n2 3\n2 4\n3 5"
        },
        k4: {
            v: 4,
            edges: "1 2\n1 3\n1 4\n2 3\n2 4\n3 4"
        },
        c5: {
            v: 5,
            edges: "1 2\n2 3\n3 4\n4 5\n5 1"
        },
        bipartite: {
            v: 6,
            edges: "1 4\n1 5\n1 6\n2 4\n2 5\n2 6\n3 4\n3 5\n3 6"
        }
    };

    // Helper: Parse edges from textarea
    function parseEdgesFromText() {
        const text = edgesText.value.trim();
        if (!text) return [];

        const lines = text.split("\n");
        const edges = [];
        const seen = new Set();

        for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 2) {
                const u = parseInt(parts[0], 10);
                const v = parseInt(parts[1], 10);
                if (!isNaN(u) && !isNaN(v) && u !== v) {
                    const min = Math.min(u, v);
                    const max = Math.max(u, v);
                    const key = `${min}-${max}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        edges.push([min, max]);
                    }
                }
            }
        }
        return edges;
    }

    // Helper: Generate circular layout for vertices
    function generateLayout(count) {
        const vertices = [];
        const centerX = 300;
        const centerY = 200;
        const radius = Math.min(150, 110 + count * 5);

        for (let i = 1; i <= count; i++) {
            // Position vertices evenly in a circle
            const angle = (2 * Math.PI * (i - 1)) / count - Math.PI / 2;
            const x = Math.round(centerX + radius * Math.cos(angle));
            const y = Math.round(centerY + radius * Math.sin(angle));

            vertices.push({
                id: i,
                x: x,
                y: y,
                color: null
            });
        }
        return vertices;
    }

    // Render Graph onto SVG
    function renderGraph() {
        edgesLayer.innerHTML = "";
        verticesLayer.innerHTML = "";

        // Render Edges
        for (const [u, v] of currentEdges) {
            const v1 = currentVertices.find(node => node.id === u);
            const v2 = currentVertices.find(node => node.id === v);
            if (v1 && v2) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", v1.x);
                line.setAttribute("y1", v1.y);
                line.setAttribute("x2", v2.x);
                line.setAttribute("y2", v2.y);
                line.setAttribute("stroke", "#64748b");
                line.setAttribute("stroke-width", "2.5");
                edgesLayer.appendChild(line);
            }
        }

        // Render Vertices
        for (const node of currentVertices) {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute("class", "vertex-group");
            g.setAttribute("style", "cursor: grab;");

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", node.x);
            circle.setAttribute("cy", node.y);
            circle.setAttribute("r", "20");

            // Fill color
            const fill = node.color ? node.color.bg : "#ffffff";
            const stroke = node.color ? node.color.border : "#1e3a8a";
            circle.setAttribute("fill", fill);
            circle.setAttribute("stroke", stroke);
            circle.setAttribute("stroke-width", "2.5");

            // Text Label
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", node.x);
            text.setAttribute("y", node.y);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dy", ".35em");
            text.setAttribute("font-size", "13");
            text.setAttribute("font-weight", "bold");
            text.setAttribute("fill", node.color ? node.color.text : "#1e293b");
            text.textContent = node.id;

            g.appendChild(circle);
            g.appendChild(text);

            // Drag support
            enableVertexDrag(g, node);

            verticesLayer.appendChild(g);
        }

        // Update status badge
        if (isColored) {
            graphStatusBadge.textContent = "Graph Colored (Python)";
            graphStatusBadge.className = "badge colored";
        } else {
            graphStatusBadge.textContent = `${currentVertices.length} Vertices, ${currentEdges.length} Edges`;
            graphStatusBadge.className = "badge";
        }
    }

    // Dragging helper
    function enableVertexDrag(element, node) {
        let isDragging = false;

        element.addEventListener("mousedown", (e) => {
            isDragging = true;
            element.style.cursor = "grabbing";
        });

        window.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            const rect = graphSvg.getBoundingClientRect();
            const scaleX = 600 / rect.width;
            const scaleY = 400 / rect.height;

            node.x = Math.max(25, Math.min(575, Math.round((e.clientX - rect.left) * scaleX)));
            node.y = Math.max(25, Math.min(375, Math.round((e.clientY - rect.top) * scaleY)));

            renderGraph();
        });

        window.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = "grab";
            }
        });
    }

    // Action: Add single edge
    btnAddEdge.addEventListener("click", () => {
        const u = parseInt(edgeUInput.value, 10);
        const v = parseInt(edgeVInput.value, 10);
        const maxV = parseInt(numVerticesInput.value, 10);

        if (isNaN(u) || isNaN(v)) {
            alert("Please enter valid vertex numbers for u and v.");
            return;
        }
        if (u === v) {
            alert("Self-loops are not allowed in this simulator.");
            return;
        }
        if (u < 1 || u > maxV || v < 1 || v > maxV) {
            alert(`Vertex numbers must be between 1 and ${maxV}.`);
            return;
        }

        const currentText = edgesText.value.trim();
        const newEdgeLine = `${u} ${v}`;
        edgesText.value = currentText ? `${currentText}\n${newEdgeLine}` : newEdgeLine;

        edgeUInput.value = "";
        edgeVInput.value = "";

        // Recreate graph
        handleCreateGraph();
    });

    // Action: Create Graph
    function handleCreateGraph() {
        const vCount = parseInt(numVerticesInput.value, 10);
        if (isNaN(vCount) || vCount < 1) {
            alert("Please enter a valid number of vertices (≥ 1).");
            return;
        }

        currentVertices = generateLayout(vCount);
        currentEdges = parseEdgesFromText();
        isColored = false;

        statVertices.textContent = vCount;
        statEdges.textContent = currentEdges.length;
        statColors.textContent = "Uncolored";

        resultPre.textContent = `Graph Created with ${vCount} vertices and ${currentEdges.length} edges.\nClick "Color Graph (Run Python)" to execute algorithm.`;
        stepLogList.innerHTML = "<li>Awaiting algorithm execution...</li>";

        renderGraph();
    }
    btnCreateGraph.addEventListener("click", handleCreateGraph);

    // Action: Color Graph (Calls Python Flask API)
    async function handleColorGraph() {
        const vCount = parseInt(numVerticesInput.value, 10);
        const edges = parseEdgesFromText();

        if (vCount < 1) {
            alert("Number of vertices must be at least 1.");
            return;
        }

        btnColorGraph.disabled = true;
        btnColorGraph.textContent = "Running Python...";

        try {
            const response = await fetch("/api/color", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    num_vertices: vCount,
                    edges: edges
                })
            });

            const data = await response.json();

            if (data.status === "success") {
                isColored = true;

                // Update vertex colors in graph
                for (const item of data.coloring) {
                    const node = currentVertices.find(n => n.id === item.vertex);
                    if (node) {
                        node.color = {
                            bg: item.bg,
                            border: item.border,
                            text: item.text,
                            name: item.color_name,
                            label: item.color_label
                        };
                    }
                }

                renderGraph();

                // Update Stats
                statVertices.textContent = data.num_vertices;
                statEdges.textContent = data.num_edges;
                statColors.textContent = data.colors_used;

                // Format text output exactly as requested
                let textResult = "Graph Coloring Result\n\n";
                textResult += `Number of Vertices: ${data.num_vertices}\n`;
                textResult += `Number of Edges: ${data.num_edges}\n`;
                textResult += `Number of Colors Used: ${data.colors_used}\n\n`;

                for (const item of data.coloring) {
                    textResult += `Vertex ${item.vertex} → ${item.color_label}\n`;
                }
                resultPre.textContent = textResult;

                // Render Step Logs
                stepLogList.innerHTML = "";
                for (const s of data.steps) {
                    const li = document.createElement("li");
                    li.textContent = s.explanation;
                    stepLogList.appendChild(li);
                }
            } else {
                alert("Error from Python backend: " + (data.message || "Unknown error"));
            }
        } catch (err) {
            alert("Network or server error while calling Python API: " + err.message);
        } finally {
            btnColorGraph.disabled = false;
            btnColorGraph.textContent = "Color Graph (Run Python)";
        }
    }
    btnColorGraph.addEventListener("click", handleColorGraph);

    // Action: Reset Graph
    btnResetGraph.addEventListener("click", () => {
        numVerticesInput.value = 5;
        edgesText.value = "1 2\n1 3\n2 3\n2 4\n3 5";
        handleCreateGraph();
    });

    // Preset buttons handler
    document.querySelectorAll(".btn-preset").forEach(btn => {
        btn.addEventListener("click", () => {
            const presetKey = btn.getAttribute("data-preset");
            const p = PRESETS[presetKey];
            if (p) {
                numVerticesInput.value = p.v;
                edgesText.value = p.edges;
                handleCreateGraph();
            }
        });
    });

    // Initialize default graph on page load
    handleCreateGraph();
});
