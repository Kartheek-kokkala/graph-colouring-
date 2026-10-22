import React from 'react';
import { GraduationCap, Award, HelpCircle, CheckCircle2 } from 'lucide-react';

export const AboutProject: React.FC = () => {
  const vivaQuestions = [
    {
      q: 'Does the Greedy Coloring Algorithm always find the optimal Chromatic Number χ(G)?',
      a: 'No. The Greedy algorithm is a heuristic approximation. Depending on the order in which vertices are examined, it may use more colors than the optimal chromatic number χ(G). However, ordering vertices by descending degree (Welsh-Powell) often improves the result.',
    },
    {
      q: 'Why is finding the exact chromatic number χ(G) difficult for large graphs?',
      a: 'The graph k-coloring decision problem is NP-Complete for k ≥ 3, and computing χ(G) is NP-Hard. There is no known polynomial-time algorithm that can find the exact minimal coloring for all arbitrary graphs unless P = NP.',
    },
    {
      q: 'What is the upper bound on colors used by Greedy Coloring?',
      a: 'If Δ(G) is the maximum degree of any vertex in the graph, greedy coloring will never use more than Δ(G) + 1 colors, because any vertex has at most Δ neighbors and thus at least one color in {0, 1, ..., Δ} will always remain free.',
    },
    {
      q: 'How does Welsh-Powell improve upon simple greedy coloring?',
      a: 'Welsh-Powell sorts vertices in non-increasing order of their degrees before coloring. High-degree vertices (which are the most constrained) receive colors first, leaving flexible lower-degree vertices for later, which frequently reduces the total colors required.',
    },
  ];

  return (
    <section id="about" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 text-slate-800 border border-slate-300">
            Project Overview & Presentation Guide
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            About Project
          </h2>
        </div>

        {/* Core Project Statement Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Project Objective</h3>
              <blockquote className="text-sm sm:text-base text-slate-700 leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1 bg-blue-50/50 rounded-r">
                “This project demonstrates how graph coloring can be solved using an interactive simulator. Users can create a graph and observe how the coloring algorithm assigns different colors to adjacent vertices.”
              </blockquote>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Developed as a clean, interactive academic tool for undergraduate students and instructors in Computer Science, Information Technology, and Discrete Mathematics courses. The simulator emphasizes clarity, visual algorithmic tracing, and ease of demonstration during college vivas and laboratory evaluations.
              </p>
            </div>
          </div>
        </div>

        {/* Viva / Faculty Q&A Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs mb-8">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-4">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">
              Faculty Viva / Presentation Q&A Preparation
            </h3>
          </div>

          <div className="space-y-4">
            {vivaQuestions.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-semibold text-xs sm:text-sm text-slate-900 flex items-start space-x-2">
                  <span className="text-blue-600 font-bold shrink-0">Q{idx + 1}:</span>
                  <span>{item.q}</span>
                </div>
                <div className="mt-2 text-xs sm:text-sm text-slate-600 flex items-start space-x-2 pl-4">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item.a}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Meta Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3 rounded bg-white border border-slate-200 flex items-center space-x-2">
            <Award className="w-4 h-4 text-blue-600" />
            <div>
              <div className="font-semibold text-slate-800">Course Domain</div>
              <div>Design & Analysis of Algorithms / Graph Theory</div>
            </div>
          </div>
          <div className="p-3 rounded bg-white border border-slate-200 flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <div>
              <div className="font-semibold text-slate-800">Target Audience</div>
              <div>College Students & Faculty Evaluators</div>
            </div>
          </div>
          <div className="p-3 rounded bg-white border border-slate-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="font-semibold text-slate-800">Implementation</div>
              <div>Client-Side JavaScript / SVG Visualizer</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
