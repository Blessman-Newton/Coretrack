
import React from 'react';
import { TABS } from '../../utils/constants';
import { Package, LayoutDashboard, ArrowRightLeft, FileText, Scale, BarChart2, Syringe, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

const ICONS: { [key: string]: React.ElementType } = {
  dashboard: LayoutDashboard,
  dispatch: ArrowRightLeft,
  return: ArrowRightLeft,
  samples: Syringe,
  reconciliation: Scale,
  reports: BarChart2,
  admin: Shield,
};

interface SidebarProps {
  activeTab: typeof TABS[number];
  setActiveTab: (tab: typeof TABS[number]) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isSidebarOpen, toggleSidebar, isAdmin = false }) => {
  // Filter tabs based on user role
  const visibleTabs = TABS.filter(tab => tab !== 'admin' || isAdmin);
  return (
    <>
      {/* Mobile Overlay - Only show on desktop when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 hidden lg:block"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside className={`
        bg-slate-800 text-white transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-60' : 'w-20'}
        h-screen shadow-lg z-50 top-0
        
        /* Hide completely on mobile, show on desktop */
        hidden lg:sticky
        ${isSidebarOpen ? 'lg:flex' : 'lg:flex'}
        flex-col
      `}>
        <div className="flex items-center justify-between h-20 border-b border-slate-700 px-2">
          <div className={`flex items-center gap-2 overflow-hidden ${!isSidebarOpen ? 'w-0' : ''}`}>
            <Package className="w-8 h-8 flex-shrink-0" />
            {isSidebarOpen && <h1 className="text-xl font-bold whitespace-nowrap">Tray Inventory</h1>}
          </div>
          {!isSidebarOpen && <Package className="w-8 h-8 flex-shrink-0" />}
          <button 
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors flex-shrink-0"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul>
          {visibleTabs.map(tab => {
            const Icon = ICONS[tab] || FileText;
            return (
              <li key={tab} className="mb-2">
                <button
                  onClick={() => setActiveTab(tab)}
                  title={isSidebarOpen ? '' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'hover:bg-slate-700'
                  } ${!isSidebarOpen ? 'justify-center' : ''}`}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  {isSidebarOpen && <span className="ml-4 font-semibold capitalize">{tab}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;