import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
  return (
    <header className="sticky top-0 z-[100] flex flex-wrap items-center justify-between gap-2.5 border-b border-[#e2e8f0] bg-white px-6 py-3">
      <div className="flex items-center gap-2.5 text-xl font-extrabold text-[#0f172a]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0ea5e9] font-black text-white">
          P
        </div>
        <span>TABLA PERIÓDICA</span>
      </div>

      <nav className="flex flex-wrap gap-1 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-1">
        <button
          className={`rounded-lg border-none px-4 py-2 text-[0.85rem] font-semibold transition-all cursor-pointer ${
            activeTab === 'tab-table'
              ? 'bg-white text-[#0f172a] shadow-[0_2px_6px_rgba(0,0,0,0.06)]'
              : 'bg-transparent text-[#64748b] hover:text-[#0f172a]'
          }`}
          onClick={() => onSelectTab('tab-table')}
        >
          Tabla
        </button>
        <button
          className={`rounded-lg border-none px-4 py-2 text-[0.85rem] font-semibold transition-all cursor-pointer ${
            activeTab === 'tab-tools'
              ? 'bg-white text-[#0f172a] shadow-[0_2px_6px_rgba(0,0,0,0.06)]'
              : 'bg-transparent text-[#64748b] hover:text-[#0f172a]'
          }`}
          onClick={() => onSelectTab('tab-tools')}
        >
          Herramientas & Explicaciones
        </button>
        <button
          className={`rounded-lg border-none px-4 py-2 text-[0.85rem] font-semibold transition-all cursor-pointer ${
            activeTab === 'tab-lab'
              ? 'bg-white text-[#0f172a] shadow-[0_2px_6px_rgba(0,0,0,0.06)]'
              : 'bg-transparent text-[#64748b] hover:text-[#0f172a]'
          }`}
          onClick={() => onSelectTab('tab-lab')}
        >
          Laboratorio Virtual
        </button>
        <button
          className={`rounded-lg border-none px-4 py-2 text-[0.85rem] font-semibold transition-all cursor-pointer ${
            activeTab === 'tab-builder'
              ? 'bg-white text-[#0f172a] shadow-[0_2px_6px_rgba(0,0,0,0.06)]'
              : 'bg-transparent text-[#64748b] hover:text-[#0f172a]'
          }`}
          onClick={() => onSelectTab('tab-builder')}
        >
          Constructor de Moléculas
        </button>
        <button
          className={`rounded-lg border-none px-4 py-2 text-[0.85rem] font-semibold transition-all cursor-pointer ${
            activeTab === 'tab-quiz'
              ? 'bg-white text-[#0f172a] shadow-[0_2px_6px_rgba(0,0,0,0.06)]'
              : 'bg-transparent text-[#64748b] hover:text-[#0f172a]'
          }`}
          onClick={() => onSelectTab('tab-quiz')}
        >
          Quiz & Desafío
        </button>
      </nav>
    </header>
  );
};
