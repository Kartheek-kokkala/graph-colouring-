import { Network, BookOpen, Layers, Lightbulb, Info, Code2 } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'simulator', label: 'Simulator', icon: Network },
    { id: 'how-it-works', label: 'How It Works', icon: BookOpen },
    { id: 'python-code', label: 'Python Files & Guide', icon: Code2 },
    { id: 'information', label: 'Concepts', icon: Layers },
    { id: 'applications', label: 'Applications', icon: Lightbulb },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('simulator')}>
            <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">Graph Coloring Simulator</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                Educational Project
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    const el = document.getElementById(item.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
