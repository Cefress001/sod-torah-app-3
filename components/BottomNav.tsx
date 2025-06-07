import React from 'react';
import { Page } from '../types';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  label: string;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  // Icon?: React.ElementType; // Placeholder for icon
}> = ({ page, label, currentPage, onNavigate }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => onNavigate(page)}
      className={`flex-1 flex flex-col items-center justify-center p-2 sm:p-3 transition-colors duration-200 ease-in-out
                  ${isActive ? 'text-yellow-400 border-t-2 border-yellow-400' : 'text-indigo-300 hover:text-yellow-300'}`}
      aria-current={isActive ? 'page' : undefined}
      aria-label={label}
    >
      {/* {Icon && <Icon className="w-5 h-5 mb-1" />} */}
      <span className="text-xs sm:text-sm font-medium font-cinzel">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="w-full bg-slate-900 border-t border-indigo-700 flex justify-around items-stretch shadow-md mt-auto">
      <NavItem page={Page.Altar} label="Altar" currentPage={currentPage} onNavigate={onNavigate} />
      <NavItem page={Page.Oracle} label="Oracle" currentPage={currentPage} onNavigate={onNavigate} />
      <NavItem page={Page.Compass} label="Compass" currentPage={currentPage} onNavigate={onNavigate} />
      <NavItem page={Page.Journal} label="Journal" currentPage={currentPage} onNavigate={onNavigate} />
    </nav>
  );
};

export default BottomNav;
