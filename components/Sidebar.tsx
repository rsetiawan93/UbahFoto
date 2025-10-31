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
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-full md:w-[20%] h-auto md:h-screen bg-gray-900 border-r border-gray-800 p-6 flex-col flex-shrink-0">
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

      {/* Mobile Sticky Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
          <nav className="flex overflow-x-auto p-2">
              <div className="flex flex-nowrap mx-auto space-x-1">
                  {MENU_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeMenu === item.key;
                      return (
                          <button
                              key={item.key}
                              onClick={() => onMenuSelect(item.key)}
                              title={item.label}
                              aria-label={item.label}
                              className={`flex-shrink-0 flex items-center justify-center rounded-lg w-16 h-16 transition-all duration-200 ${
                                isActive
                                  ? 'bg-indigo-500 text-white'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                              }`}
                          >
                              <Icon className="w-7 h-7" />
                          </button>
                      );
                  })}
                   <button
                        onClick={onStartTutorial}
                        title="Bantuan"
                        aria-label="Bantuan"
                        className="flex-shrink-0 flex items-center justify-center rounded-lg w-16 h-16 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <HelpIcon className="w-7 h-7" />
                    </button>
              </div>
          </nav>
      </div>
    </>
  );
};

export default Sidebar;