import React from 'react';
import { MENU_ITEMS } from '../constants';
import { type MenuItemKey } from '../types';
import { LogoIcon, HelpIcon } from './icons';

interface SidebarProps {
  activeMenu: MenuItemKey;
  onMenuSelect: (key: MenuItemKey) => void;
  onStartTutorial: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuSelect, onStartTutorial }) => {
  return (
    <aside className="w-full md:w-[20%] h-full bg-gray-900 border-r border-gray-800 p-6 flex flex-col flex-shrink-0">
      <div className="flex items-center gap-3 mb-10">
        <LogoIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-2xl font-bold text-white">Ubah Foto</h1>
      </div>
      <nav id="tutorial-sidebar" className="flex flex-col gap-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onMenuSelect(item.key)}
              className={`flex items-center gap-4 p-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">{item.label}</p>
                <p className="text-xs opacity-80">{item.description}</p>
              </div>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-800">
          <button 
              id="tutorial-help-button"
              onClick={onStartTutorial}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <HelpIcon className="w-5 h-5" />
              Bantuan
          </button>
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Powered by Gemini AI</p>
            <p>&copy; 2024</p>
          </div>
      </div>
    </aside>
  );
};

export default Sidebar;