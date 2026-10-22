import { Edge, PresetGraph, Vertex } from '../types';

export const PRESET_GRAPHS: PresetGraph[] = [
  {
    id: 'k4',
    name: 'Complete Graph K4',
    description: '4 vertices where every vertex is connected to all other 3. Needs 4 colors (χ = 4).',
    expectedChromatic: 4,
    vertices: [
      { id: 1, label: 'V1', x: 260, y: 70, colorIndex: null },
      { id: 2, label: 'V2', x: 440, y: 150, colorIndex: null },
      { id: 3, label: 'V3', x: 380, y: 310, colorIndex: null },
      { id: 4, label: 'V4', x: 140, y: 260, colorIndex: null },
    ],
    edges: [
      { id: 'e1-2', source: 1, target: 2 },
      { id: 'e1-3', source: 1, target: 3 },
      { id: 'e1-4', source: 1, target: 4 },
      { id: 'e2-3', source: 2, target: 3 },
      { id: 'e2-4', source: 2, target: 4 },
      { id: 'e3-4', source: 3, target: 4 },
    ],
  },
  {
    id: 'c5',
    name: 'Cycle Graph C5 (Odd Cycle)',
    description: 'A 5-vertex simple ring. Because the length is odd, it cannot be 2-colored and needs 3 colors (χ = 3).',
    expectedChromatic: 3,
    vertices: [
      { id: 1, label: 'V1', x: 300, y: 60, colorIndex: null },
      { id: 2, label: 'V2', x: 460, y: 170, colorIndex: null },
      { id: 3, label: 'V3', x: 400, y: 330, colorIndex: null },
      { id: 4, label: 'V4', x: 200, y: 330, colorIndex: null },
      { id: 5, label: 'V5', x: 140, y: 170, colorIndex: null },
    ],
    edges: [
      { id: 'e1-2', source: 1, target: 2 },
      { id: 'e2-3', source: 2, target: 3 },
      { id: 'e3-4', source: 3, target: 4 },
      { id: 'e4-5', source: 4, target: 5 },
      { id: 'e5-1', source: 5, target: 1 },
    ],
  },
  {
    id: 'bipartite',
    name: 'Bipartite Graph (K3,3)',
    description: 'Two disjoint sets of 3 vertices. Any bipartite graph with at least one edge has χ = 2.',
    expectedChromatic: 2,
    vertices: [
      { id: 1, label: 'A1', x: 180, y: 90, colorIndex: null },
      { id: 2, label: 'A2', x: 180, y: 200, colorIndex: null },
      { id: 3, label: 'A3', x: 180, y: 310, colorIndex: null },
      { id: 4, label: 'B1', x: 420, y: 90, colorIndex: null },
      { id: 5, label: 'B2', x: 420, y: 200, colorIndex: null },
      { id: 6, label: 'B3', x: 420, y: 310, colorIndex: null },
    ],
    edges: [
      { id: 'e1-4', source: 1, target: 4 },
      { id: 'e1-5', source: 1, target: 5 },
      { id: 'e1-6', source: 1, target: 6 },
      { id: 'e2-4', source: 2, target: 4 },
      { id: 'e2-5', source: 2, target: 5 },
      { id: 'e2-6', source: 2, target: 6 },
      { id: 'e3-4', source: 3, target: 4 },
      { id: 'e3-5', source: 3, target: 5 },
      { id: 'e3-6', source: 3, target: 6 },
    ],
  },
  {
    id: 'wheel',
    name: 'Wheel Graph W5',
    description: 'A central hub connected to an outer 4-cycle. Requires 3 colors (χ = 3).',
    expectedChromatic: 3,
    vertices: [
      { id: 1, label: 'Hub', x: 300, y: 200, colorIndex: null },
      { id: 2, label: 'V1', x: 300, y: 70, colorIndex: null },
      { id: 3, label: 'V2', x: 450, y: 200, colorIndex: null },
      { id: 4, label: 'V3', x: 300, y: 330, colorIndex: null },
      { id: 5, label: 'V4', x: 150, y: 200, colorIndex: null },
    ],
    edges: [
      { id: 'e1-2', source: 1, target: 2 },
      { id: 'e1-3', source: 1, target: 3 },
      { id: 'e1-4', source: 1, target: 4 },
      { id: 'e1-5', source: 1, target: 5 },
      { id: 'e2-3', source: 2, target: 3 },
      { id: 'e3-4', source: 3, target: 4 },
      { id: 'e4-5', source: 4, target: 5 },
      { id: 'e5-2', source: 5, target: 2 },
    ],
  },
  {
    id: 'exam-schedule',
    name: 'Exam Schedule Conflict Graph',
    description: '6 college courses. Edges connect courses with common enrolled students that cannot be scheduled at the same time slot.',
    expectedChromatic: 3,
    vertices: [
      { id: 1, label: 'Math', x: 200, y: 80, colorIndex: null },
      { id: 2, label: 'CS', x: 400, y: 80, colorIndex: null },
      { id: 3, label: 'Physics', x: 460, y: 220, colorIndex: null },
      { id: 4, label: 'Chemistry', x: 370, y: 330, colorIndex: null },
      { id: 5, label: 'Biology', x: 170, y: 320, colorIndex: null },
      { id: 6, label: 'English', x: 110, y: 190, colorIndex: null },
    ],
    edges: [
      { id: 'e1-2', source: 1, target: 2 }, // Math - CS
      { id: 'e1-3', source: 1, target: 3 }, // Math - Physics
      { id: 'e2-3', source: 2, target: 3 }, // CS - Physics
      { id: 'e3-4', source: 3, target: 4 }, // Physics - Chem
      { id: 'e4-5', source: 4, target: 5 }, // Chem - Bio
      { id: 'e5-1', source: 5, target: 1 }, // Bio - Math
      { id: 'e6-5', source: 6, target: 5 }, // English - Bio
    ],
  },
  {
    id: 'petersen',
    name: 'Petersen Graph (10 Vertices)',
    description: 'A famous 3-regular graph with an outer 5-cycle and inner star. Has chromatic number 3.',
    expectedChromatic: 3,
    vertices: [
      // Outer 5-cycle
      { id: 1, label: 'O1', x: 300, y: 60, colorIndex: null },
      { id: 2, label: 'O2', x: 470, y: 180, colorIndex: null },
      { id: 3, label: 'O3', x: 400, y: 340, colorIndex: null },
      { id: 4, label: 'O4', x: 200, y: 340, colorIndex: null },
      { id: 5, label: 'O5', x: 130, y: 180, colorIndex: null },
      // Inner 5-star
      { id: 6, label: 'I1', x: 300, y: 140, colorIndex: null },
      { id: 7, label: 'I2', x: 390, y: 205, colorIndex: null },
      { id: 8, label: 'I3', x: 355, y: 285, colorIndex: null },
      { id: 9, label: 'I4', x: 245, y: 285, colorIndex: null },
      { id: 10, label: 'I5', x: 210, y: 205, colorIndex: null },
    ],
    edges: [
      // Outer cycle
      { id: 'p1-2', source: 1, target: 2 },
      { id: 'p2-3', source: 2, target: 3 },
      { id: 'p3-4', source: 3, target: 4 },
      { id: 'p4-5', source: 4, target: 5 },
      { id: 'p5-1', source: 5, target: 1 },
      // Spokes
      { id: 'p1-6', source: 1, target: 6 },
      { id: 'p2-7', source: 2, target: 7 },
      { id: 'p3-8', source: 3, target: 8 },
      { id: 'p4-9', source: 4, target: 9 },
      { id: 'p5-10', source: 5, target: 10 },
      // Inner star chords
      { id: 'p6-8', source: 6, target: 8 },
      { id: 'p8-10', source: 8, target: 10 },
      { id: 'p10-7', source: 10, target: 7 },
      { id: 'p7-9', source: 7, target: 9 },
      { id: 'p9-6', source: 9, target: 6 },
    ],
  },
];
