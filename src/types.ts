export interface Vertex {
  id: number;
  x: number;
  y: number;
  label: string;
  colorIndex: number | null; // null if uncolored, 0..k-1 if colored
}

export interface Edge {
  id: string;
  source: number; // vertex id
  target: number; // vertex id
}

export type SimulatorMode = 'add-vertex' | 'add-edge' | 'drag' | 'delete';

export type OrderingStrategy = 'default' | 'welsh-powell';

export interface ColorDef {
  index: number;
  name: string;
  bgHex: string;
  borderHex: string;
  textHex: string;
  tagClass: string;
}

export interface StepLog {
  stepNumber: number;
  vertexId: number;
  vertexLabel: string;
  neighborIds: number[];
  neighborColors: (number | null)[];
  assignedColorIndex: number;
  explanation: string;
}

export interface PresetGraph {
  id: string;
  name: string;
  description: string;
  expectedChromatic: number;
  vertices: Vertex[];
  edges: Edge[];
}
