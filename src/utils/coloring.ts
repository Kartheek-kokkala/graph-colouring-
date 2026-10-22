import { ColorDef, Edge, OrderingStrategy, StepLog, Vertex } from '../types';

export const SOFT_COLORS: ColorDef[] = [
  {
    index: 0,
    name: 'Light Blue',
    bgHex: '#bfdbfe',      // Tailwind blue-200
    borderHex: '#3b82f6',  // blue-500
    textHex: '#1e3a8a',    // blue-900
    tagClass: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  {
    index: 1,
    name: 'Light Green',
    bgHex: '#bbf7d0',      // green-200
    borderHex: '#22c55e',  // green-500
    textHex: '#14532d',    // green-900
    tagClass: 'bg-green-100 text-green-900 border-green-300',
  },
  {
    index: 2,
    name: 'Light Yellow',
    bgHex: '#fef08a',      // yellow-200
    borderHex: '#eab308',  // yellow-500
    textHex: '#713f12',    // yellow-900
    tagClass: 'bg-yellow-100 text-yellow-900 border-yellow-300',
  },
  {
    index: 3,
    name: 'Light Red',
    bgHex: '#fecaca',      // red-200
    borderHex: '#ef4444',  // red-500
    textHex: '#7f1d1d',    // red-900
    tagClass: 'bg-red-100 text-red-900 border-red-300',
  },
  {
    index: 4,
    name: 'Light Purple',
    bgHex: '#e9d5ff',      // purple-200
    borderHex: '#a855f7',  // purple-500
    textHex: '#581c87',    // purple-900
    tagClass: 'bg-purple-100 text-purple-900 border-purple-300',
  },
  {
    index: 5,
    name: 'Light Orange',
    bgHex: '#fed7aa',      // orange-200
    borderHex: '#f97316',  // orange-500
    textHex: '#7c2d12',    // orange-900
    tagClass: 'bg-orange-100 text-orange-900 border-orange-300',
  },
  {
    index: 6,
    name: 'Light Teal',
    bgHex: '#99f6e4',      // teal-200
    borderHex: '#14b8a6',  // teal-500
    textHex: '#134e4a',    // teal-900
    tagClass: 'bg-teal-100 text-teal-900 border-teal-300',
  },
  {
    index: 7,
    name: 'Light Pink',
    bgHex: '#fbcfe8',      // pink-200
    borderHex: '#ec4899',  // pink-500
    textHex: '#831843',    // pink-900
    tagClass: 'bg-pink-100 text-pink-900 border-pink-300',
  },
];

export const UNCOLORED: ColorDef = {
  index: -1,
  name: 'Uncolored',
  bgHex: '#f8fafc',      // slate-50
  borderHex: '#94a3b8',  // slate-400
  textHex: '#334155',    // slate-700
  tagClass: 'bg-slate-100 text-slate-700 border-slate-300',
};

export function getColor(colorIndex: number | null): ColorDef {
  if (colorIndex === null || colorIndex === undefined || colorIndex < 0) {
    return UNCOLORED;
  }
  return SOFT_COLORS[colorIndex % SOFT_COLORS.length];
}

/**
 * Builds an adjacency list mapping vertex id to array of neighbor ids.
 */
export function buildAdjacencyList(vertices: Vertex[], edges: Edge[]): Map<number, number[]> {
  const adj = new Map<number, number[]>();
  for (const v of vertices) {
    adj.set(v.id, []);
  }
  for (const edge of edges) {
    const listU = adj.get(edge.source);
    const listV = adj.get(edge.target);
    if (listU && !listU.includes(edge.target)) listU.push(edge.target);
    if (listV && !listV.includes(edge.source)) listV.push(edge.source);
  }
  return adj;
}

/**
 * Computes the degree of each vertex.
 */
export function getVertexDegrees(vertices: Vertex[], edges: Edge[]): Map<number, number> {
  const degrees = new Map<number, number>();
  for (const v of vertices) {
    degrees.set(v.id, 0);
  }
  for (const edge of edges) {
    degrees.set(edge.source, (degrees.get(edge.source) || 0) + 1);
    degrees.set(edge.target, (degrees.get(edge.target) || 0) + 1);
  }
  return degrees;
}

/**
 * Executes the Greedy Graph Coloring algorithm.
 * Returns new vertices with assigned colors and step logs.
 */
export function runGreedyColoring(
  vertices: Vertex[],
  edges: Edge[],
  strategy: OrderingStrategy = 'default'
): { coloredVertices: Vertex[]; steps: StepLog[]; colorsUsed: number } {
  if (vertices.length === 0) {
    return { coloredVertices: [], steps: [], colorsUsed: 0 };
  }

  const adj = buildAdjacencyList(vertices, edges);
  const degrees = getVertexDegrees(vertices, edges);

  // Determine order of processing vertices
  let order = [...vertices];
  if (strategy === 'welsh-powell') {
    // Sort vertices by descending degree
    order.sort((a, b) => (degrees.get(b.id) || 0) - (degrees.get(a.id) || 0));
  } else {
    // Default: Sort by vertex ID
    order.sort((a, b) => a.id - b.id);
  }

  // Map to hold assigned colors
  const colorMap = new Map<number, number>();
  const steps: StepLog[] = [];

  for (let i = 0; i < order.length; i++) {
    const current = order[i];
    const neighbors = adj.get(current.id) || [];
    
    // Find colors already taken by neighbors
    const unavailableColors = new Set<number>();
    const neighborColorInfo: (number | null)[] = [];

    for (const neighborId of neighbors) {
      const c = colorMap.get(neighborId);
      if (c !== undefined) {
        unavailableColors.add(c);
        neighborColorInfo.push(c);
      } else {
        neighborColorInfo.push(null);
      }
    }

    // Find the smallest non-negative integer color index available
    let chosenColor = 0;
    while (unavailableColors.has(chosenColor)) {
      chosenColor++;
    }

    colorMap.set(current.id, chosenColor);

    const chosenColorName = getColor(chosenColor).name;
    const neighborDetails = neighbors.length === 0
      ? 'No neighbors'
      : `Neighbors [${neighbors.map(nId => {
          const v = vertices.find(v => v.id === nId);
          const c = colorMap.get(nId);
          return `${v?.label || nId}${c !== undefined ? ` (${getColor(c).name})` : ' (Uncolored)'}`;
        }).join(', ')}]`;

    steps.push({
      stepNumber: i + 1,
      vertexId: current.id,
      vertexLabel: current.label,
      neighborIds: neighbors,
      neighborColors: neighborColorInfo,
      assignedColorIndex: chosenColor,
      explanation: `Selected ${current.label}. ${neighborDetails}. Smallest available color index is ${chosenColor} (${chosenColorName}).`,
    });
  }

  // Update vertex objects with new colors
  const coloredVertices = vertices.map(v => ({
    ...v,
    colorIndex: colorMap.has(v.id) ? colorMap.get(v.id)! : null,
  }));

  const uniqueColors = new Set(Array.from(colorMap.values()));
  const colorsUsed = uniqueColors.size;

  return { coloredVertices, steps, colorsUsed };
}

/**
 * Validates if the current graph coloring is a proper coloring.
 * Returns true if for all edges (u,v), color(u) != color(v) and both are colored.
 */
export function validateProperColoring(
  vertices: Vertex[],
  edges: Edge[]
): { isValid: boolean; conflicts: Edge[]; isFullyColored: boolean } {
  if (vertices.length === 0) {
    return { isValid: true, conflicts: [], isFullyColored: true };
  }

  const colorMap = new Map<number, number | null>();
  let hasUncolored = false;

  for (const v of vertices) {
    colorMap.set(v.id, v.colorIndex);
    if (v.colorIndex === null) {
      hasUncolored = true;
    }
  }

  const conflicts: Edge[] = [];
  for (const edge of edges) {
    const c1 = colorMap.get(edge.source);
    const c2 = colorMap.get(edge.target);
    if (c1 !== null && c1 !== undefined && c2 !== null && c2 !== undefined && c1 === c2) {
      conflicts.push(edge);
    }
  }

  return {
    isValid: conflicts.length === 0 && !hasUncolored,
    conflicts,
    isFullyColored: !hasUncolored,
  };
}
