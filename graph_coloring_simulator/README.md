# Graph Coloring Simulator - Python Academic Project

An interactive, student-friendly academic web application built using **Python**, **Flask**, and clean HTML/CSS/JavaScript to simulate and visualize the **Greedy Graph Coloring Algorithm**.

---

## 1. Project Overview

- **Subject**: Python Programming / Discrete Mathematics / Design & Analysis of Algorithms
- **Backend**: Python 3 + Flask
- **Frontend**: Clean HTML5, CSS3, JavaScript (SVG Visualization)
- **Algorithm**: Greedy Graph Coloring using Adjacency Lists

---

## 2. Project Directory Structure

```text
graph_coloring_simulator/
│
├── app.py                  # Flask web server and routing
├── graph_coloring.py       # Core greedy graph coloring algorithm in pure Python
├── requirements.txt        # Dependencies (Flask)
│
├── templates/
│   ├── index.html          # Home page (definitions, algorithm explanation, applications)
│   └── simulator.html      # Interactive simulator page
│
├── static/
│   ├── style.css           # Soft academic styling (white, gray, dark blue, light green)
│   └── script.js           # SVG graph rendering, user inputs, and API calls
│
└── README.md               # Complete setup guide and faculty viva notes
```

---

## 3. How to Run in Visual Studio Code (Step-by-Step)

Follow these simple steps on Windows, macOS, or Linux:

### Step 1: Open VS Code
1. Open **Visual Studio Code**.
2. Go to **File → Open Folder...** and select the `graph_coloring_simulator` directory.

### Step 2: Open Integrated Terminal
1. Press ``Ctrl + ` `` (backtick) or go to **Terminal → New Terminal** in the top menu.

### Step 3: Create & Activate Python Virtual Environment (Recommended)
In the terminal, run:

- **On Windows (PowerShell / Command Prompt):**
  ```bash
  python -m venv venv
  .\venv\Scripts\activate
  ```

- **On macOS / Linux:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

### Step 4: Install Flask
Install Flask via pip:
```bash
pip install -r requirements.txt
```
*(or run: `pip install flask`)*

### Step 5: Run the Application
Run the Flask server:
```bash
python app.py
```

You will see output in the terminal:
```text
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

### Step 6: Open in Web Browser
Open your browser (Chrome, Edge, Firefox) and navigate to:
```text
http://127.0.0.1:5000
```
- Click **"Start Simulator"** or navigate to `/simulator`.
- Enter vertices, add edges, click **"Create Graph"**, then click **"Color Graph (Run Python)"**!

---

## 4. How the Python Algorithm Works

The algorithm is implemented in `graph_coloring.py`:

```python
def greedy_coloring(graph):
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

    return color
```

### Step-by-Step Execution:
1. **Adjacency List Creation**: The graph is represented as a Python dictionary where keys are vertex numbers and values are lists of adjacent neighbor vertices.
2. **Iteration**: Vertices are visited in sequence (1, 2, 3, ...).
3. **Neighbor Color Check**: A Python `set` collects all colors already assigned to its neighbors.
4. **Smallest Color Selection**: A `while` loop checks from color 0 upwards, selecting the lowest non-negative integer not present in `used_colors`.
5. **Color Assignment**: The chosen color is assigned to the current vertex in the `color` dictionary.
6. **Result**: The final colors and total number of colors used are returned to Flask and displayed on the web interface.

---

## 5. Faculty Viva Questions & Answers

### Q1: Why use an adjacency list instead of an adjacency matrix?
**Answer**: An adjacency list uses $O(V + E)$ space compared to $O(V^2)$ for a matrix. In Python, a dictionary of lists `dict[int, list]` is both memory-efficient and very simple to iterate over.

### Q2: What is the time complexity of the Greedy Graph Coloring algorithm?
**Answer**: In the worst-case, for each vertex we inspect its neighbors and look for an available color. For a graph with $|V|$ vertices and $|E|$ edges, the time complexity is $O(V^2 + E)$.

### Q3: Does Greedy Coloring always produce the minimum chromatic number $\chi(G)$?
**Answer**: No. Greedy coloring is a heuristic. The number of colors used can depend on the order in which vertices are visited. However, it guarantees that no two connected vertices have the same color (Proper Coloring), and uses at most $\Delta(G) + 1$ colors (where $\Delta$ is the maximum vertex degree).

### Q4: What are the real-world applications of Graph Coloring?
**Answer**:
1. **Exam Timetable Scheduling**: Courses sharing students cannot have exams at the same time slot (colors = time slots).
2. **Map Coloring**: Neighboring countries must have different colors (Four Color Theorem).
3. **Register Allocation**: In compiler design, variables with overlapping lifetimes cannot share the same CPU register.
4. **Frequency Assignment**: Mobile transmission towers with overlapping signals must use different radio frequencies to prevent interference.
