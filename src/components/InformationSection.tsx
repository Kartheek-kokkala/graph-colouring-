import React from 'react';
import { HelpCircle, Circle, Minus, CheckCircle, Hash, BookMarked } from 'lucide-react';

export const InformationSection: React.FC = () => {
  const concepts = [
    {
      title: 'What is Graph Coloring?',
      icon: HelpCircle,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description:
        'Graph coloring is a foundational problem in graph theory and discrete mathematics. It involves assigning colors or labels to the elements of a graph subject to certain constraints. In vertex coloring, each vertex must receive a color.',
      keyTakeaway: 'Objective: Assign colors so that no two connected vertices have identical colors.',
    },
    {
      title: 'What is a Vertex (Node)?',
      icon: Circle,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      description:
        'A vertex (plural: vertices), also called a node, is a fundamental unit of a graph. Vertices represent entities, objects, or items—such as courses in a university schedule, router stations in a telecommunications network, or regions on a map.',
      keyTakeaway: 'Represented visually by numbered circles (V1, V2, V3...).',
    },
    {
      title: 'What is an Edge (Link)?',
      icon: Minus,
      iconColor: 'text-slate-700',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-300',
      description:
        'An edge is a line or connection joining two vertices in a graph. An undirected edge (u, v) signifies a relationship, dependency, or conflict between vertex u and vertex v. If an edge exists between two vertices, they are called adjacent neighbors.',
      keyTakeaway: 'Represents a mutual relationship or conflict between two entities.',
    },
    {
      title: 'What is a Proper Coloring?',
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      description:
        'A coloring of a graph is defined as "proper" if and only if no two adjacent vertices (vertices joined by an edge) share the same color. If any two connected vertices share a color, the coloring is called invalid or in conflict.',
      keyTakeaway: 'Rule: For every edge (u, v) ∈ E, Color(u) ≠ Color(v).',
    },
    {
      title: 'What is the Chromatic Number (χ)?',
      icon: Hash,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description:
        'The chromatic number of a graph G, represented by the Greek letter chi χ(G), is the absolute minimum number of colors required to produce a proper coloring. Determining the chromatic number of an arbitrary graph is an NP-Complete problem.',
      keyTakeaway: 'Example: Bipartite graphs have χ = 2; Complete graph Kn has χ = n.',
    },
    {
      title: 'Brooks’ Theorem & Degree Bounds',
      icon: BookMarked,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description:
        'Let Δ(G) be the maximum degree of any vertex in G. Greedy coloring is guaranteed to use at most Δ(G) + 1 colors. Brooks’ Theorem proves that every connected graph other than complete graphs and odd cycles can be colored with at most Δ(G) colors.',
      keyTakeaway: 'Formula: χ(G) ≤ Δ(G) for almost all connected graphs.',
    },
  ];

  return (
    <section id="information" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 text-slate-800 border border-slate-300">
            Theoretical Foundations
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Concepts & Information
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl mx-auto">
            Essential definitions every student should know when explaining Graph Theory to professors and evaluators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {concepts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2.5 mb-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${item.bgColor} border ${item.borderColor}`}>
                      <Icon className={`w-4 h-4 ${item.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-sm text-slate-800">{item.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded">
                  <span className="font-semibold text-slate-900">Summary: </span>
                  {item.keyTakeaway}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
