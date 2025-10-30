import React from 'react';
import { LayoutDashboard, ArrowRightLeft, Syringe, Scale, BarChart2 } from 'lucide-react';
import { TABS } from '../../utils/constants';

interface MobileNavProps {
  activeTab: typeof TABS[number];
  setActiveTab: (tab: typeof TABS[number]) => void;
}

const NAV_ITEMS = [
  { tab: 'dashboard' as const, icon: LayoutDashboard, label: 'Dashboard' },
  { tab: 'dispatch' as const, icon: ArrowRightLeft, label: 'Dispatch' },
  { tab: 'return' as const, icon: ArrowRightLeft, label: 'Return' },
  { tab: 'samples' as const, icon: Syringe, label: 'Samples' },
  { tab: 'reconciliation' as const, icon: Scale, label: 'Balance' },
  { tab: 'reports' as const, icon: BarChart2, label: 'Reports' },
];

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-bottom">
      <div className="grid grid-cols-6 gap-0">
        {NAV_ITEMS.map(({ tab, icon: Icon, label }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex flex-col items-center justify-center py-2 px-1 transition-colors
              ${activeTab === tab 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-slate-600 hover:bg-slate-50'
              }
            `}
          >
            <Icon className={`w-5 h-5 mb-1 ${activeTab === tab ? 'stroke-2' : ''}`} />
            <span className="text-[10px] font-medium truncate w-full text-center">
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};
