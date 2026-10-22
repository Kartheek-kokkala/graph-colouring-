import React, { useState } from 'react';
import { Calendar, Map, Cpu, Radio, Clock3 } from 'lucide-react';

export const ApplicationsSection: React.FC = () => {
  const [activeApp, setActiveApp] = useState<number>(0);

  const applications = [
    {
      id: 0,
      title: 'Exam Timetable Scheduling',
      icon: Calendar,
      color: 'blue',
      summary: 'Preventing students from having two overlapping exams at the same time.',
      problem:
        'A university must schedule final exams for multiple subjects. Some students are enrolled in multiple courses simultaneously and cannot take two exams at the same time.',
      graphMapping: {
        vertices: 'Each course is a vertex (e.g., Math, CS, Chemistry).',
        edges: 'An edge connects two courses if at least one common student is enrolled in both.',
        colors: 'Each color corresponds to a distinct time slot or exam period.',
      },
      result:
        'A proper coloring guarantees that no student has two exams scheduled in the same time slot, minimizing the total number of examination days needed.',
    },
    {
      id: 1,
      title: 'Map Coloring (Four Color Theorem)',
      icon: Map,
      color: 'emerald',
      summary: 'Coloring geographical maps so bordering nations have distinct colors.',
      problem:
        'Cartographers need to color adjacent countries or states on a map such that any two regions sharing a common border can be easily distinguished.',
      graphMapping: {
        vertices: 'Each country or geographical region represents a vertex.',
        edges: 'An edge connects two countries that share a boundary line.',
        colors: 'Colors on the physical printed map.',
      },
      result:
        'By the famous Four Color Theorem (proven by Appel and Haken in 1976), any planar map can be properly colored with at most 4 colors.',
    },
    {
      id: 2,
      title: 'Register Allocation in Compilers',
      icon: Cpu,
      color: 'purple',
      summary: 'Assigning variables to a limited number of high-speed CPU registers.',
      problem:
        'When compiling high-level programming code, the computer has thousands of variables but a very small set of fast hardware registers (e.g. 16 or 32 registers).',
      graphMapping: {
        vertices: 'Every program variable is represented as a vertex.',
        edges: 'An interference edge connects two variables if they are both "live" (in use) at the same time in the program.',
        colors: 'Physical hardware registers.',
      },
      result:
        'Chaitin’s graph coloring algorithm assigns variables with overlapping lifespans to different CPU registers without memory spills.',
    },
    {
      id: 3,
      title: 'Frequency Assignment in Mobile Towers',
      icon: Radio,
      color: 'amber',
      summary: 'Preventing electromagnetic interference between nearby cell towers.',
      problem:
        'Cellular base stations broadcast wireless signals over geographical areas. If nearby towers transmit on identical frequencies, destructive interference disrupts calls.',
      graphMapping: {
        vertices: 'Each cellular transmission tower represents a vertex.',
        edges: 'An edge is drawn between two towers whose broadcast ranges overlap.',
        colors: 'Designated radio frequency bands.',
      },
      result:
        'A proper coloring assigns different frequency channels to interfering transmitters while conserving scarce wireless spectrum.',
    },
    {
      id: 4,
      title: 'General Scheduling & Resource Allocation',
      icon: Clock3,
      color: 'slate',
      summary: 'Aircraft gate assignment, meeting rooms, and sports league scheduling.',
      problem:
        'Organizations need to assign shared resources (meeting rooms, airplane boarding gates, sports fields) to events that conflict in timing.',
      graphMapping: {
        vertices: 'Individual tasks, flights, or committee meetings.',
        edges: 'Overlap in schedule or mutual demand for the exact same resource.',
        colors: 'Assigned room, gate, or time period.',
      },
      result:
        'Optimal coloring minimizes the total resources or rooms required without any double-booking.',
    },
  ];

  const current = applications[activeApp];

  return (
    <section id="applications" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Practical Use Cases
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Real-World Applications of Graph Coloring
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl mx-auto">
            Why computer scientists and engineers study graph coloring: turning resource conflicts into simple graph color problems.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {applications.map((app) => {
            const Icon = app.icon;
            const isSelected = app.id === activeApp;
            return (
              <button
                key={app.id}
                onClick={() => setActiveApp(app.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{app.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Application Detail Card */}
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 shadow-xs">
          <div className="flex items-start justify-between flex-wrap gap-4 border-b border-slate-200 pb-4 mb-4">
            <div>
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                Application Detail
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{current.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">{current.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                The Practical Challenge
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-3.5 rounded border border-slate-200">
                {current.problem}
              </p>

              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mt-4 mb-2">
                Outcome & Benefit
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-3.5 rounded border border-slate-200">
                {current.result}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                How It Translates to Graph Theory
              </h4>
              <div className="bg-white p-3.5 rounded border border-slate-200 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-700 shrink-0">Vertices (V):</span>
                  <span className="text-slate-600">{current.graphMapping.vertices}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-700 shrink-0">Edges (E):</span>
                  <span className="text-slate-600">{current.graphMapping.edges}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-700 shrink-0">Colors (k):</span>
                  <span className="text-slate-600">{current.graphMapping.colors}</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded bg-blue-50 border border-blue-200 text-xs text-blue-900">
                <strong>Try it in the simulator:</strong> Click on "Exam Schedule Conflict Graph" in the preset dropdown above to see this exact scenario simulated!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
