import React, { useState } from 'react';
import { categories, elements } from '../data/elementsData';
import { ChemicalElement } from '../types';
import { playWaterDropSound } from '../utils/audio';

interface PeriodicTableTabProps {
  onSelectElement: (element: ChemicalElement) => void;
}

export const PeriodicTableTab: React.FC<PeriodicTableTabProps> = ({ onSelectElement }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryClick = (catKey: string) => {
    setActiveCategory(prev => (prev === catKey ? null : catKey));
  };

  const handleTilePointerDown = (e: React.PointerEvent<HTMLDivElement>, el: ChemicalElement) => {
    playWaterDropSound();

    const tile = e.currentTarget;
    const rect = tile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 1.2;

    const wave1 = document.createElement('span');
    wave1.className = 'water-wave-primary';
    wave1.style.left = `${x}px`;
    wave1.style.top = `${y}px`;
    wave1.style.width = `${size}px`;
    wave1.style.height = `${size}px`;

    const wave2 = document.createElement('span');
    wave2.className = 'water-wave-secondary';
    wave2.style.left = `${x}px`;
    wave2.style.top = `${y}px`;
    wave2.style.width = `${size}px`;
    wave2.style.height = `${size}px`;

    tile.appendChild(wave1);
    tile.appendChild(wave2);

    setTimeout(() => {
      wave1.remove();
      wave2.remove();
    }, 850);

    setTimeout(() => {
      onSelectElement(el);
    }, 240);
  };

  const cleanSearch = searchTerm.trim().toLowerCase();

  return (
    <section id="tab-table" className="block w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          id="tableSearch"
          className="w-[280px] rounded-[10px] border border-[#e2e8f0] bg-white px-4 py-2 text-[0.9rem] outline-none placeholder:text-[#94a3b8] focus:border-[#0ea5e9]"
          placeholder="Buscar por símbolo, nombre o número..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5" id="categoryLegend">
          {Object.entries(categories).map(([key, val]) => {
            const isSelected = activeCategory === key;
            return (
              <div
                key={key}
                className={`legend-chip cursor-pointer select-none rounded-[20px] px-2.5 py-1 text-[0.75rem] font-semibold transition-transform ${
                  isSelected ? 'ring-2 ring-offset-1 ring-[#0ea5e9] scale-105' : 'hover:opacity-90'
                }`}
                style={{ backgroundColor: val.bg, color: val.text }}
                onClick={() => handleCategoryClick(key)}
              >
                {val.name}
              </div>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto rounded-[18px] border border-[#e2e8f0] bg-white p-5 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.05)]">
        <div
          className="grid min-w-[1180px] gap-1.5"
          style={{
            gridTemplateColumns: 'repeat(18, minmax(62px, 1fr))',
            gridTemplateRows: 'repeat(10, minmax(64px, 1fr))'
          }}
          id="elementsGrid"
        >
          {/* Lanthanides slot indicator */}
          <div
            className="flex items-center justify-center rounded-[10px] border border-dashed border-[#e2e8f0] bg-[#f8fafc] text-center text-[0.7rem] font-bold leading-tight text-[#64748b]"
            style={{ gridRow: 6, gridColumn: 3 }}
          >
            57-71<br />La-Lu
          </div>

          {/* Actinides slot indicator */}
          <div
            className="flex items-center justify-center rounded-[10px] border border-dashed border-[#e2e8f0] bg-[#f8fafc] text-center text-[0.7rem] font-bold leading-tight text-[#64748b]"
            style={{ gridRow: 7, gridColumn: 3 }}
          >
            89-103<br />Ac-Lr
          </div>

          {elements.map(el => {
            const catInfo = categories[el.cat] || { bg: '#f1f5f9', text: '#0f172a' };
            const matchSearch =
              !cleanSearch ||
              el.name.toLowerCase().includes(cleanSearch) ||
              el.sym.toLowerCase().includes(cleanSearch) ||
              el.num.toString() === cleanSearch;

            const matchCat = !activeCategory || el.cat === activeCategory;
            const isDimmed = !matchSearch || !matchCat;

            return (
              <div
                key={el.num}
                id={`el-tile-${el.num}`}
                className={`element-tile ${isDimmed ? 'dimmed' : ''}`}
                style={{
                  gridRow: el.r,
                  gridColumn: el.c,
                  backgroundColor: catInfo.bg,
                  color: catInfo.text
                }}
                onPointerDown={e => handleTilePointerDown(e, el)}
              >
                <div className="pointer-events-none flex justify-between text-[0.65rem] font-bold opacity-75">
                  <span>{el.num}</span>
                </div>
                <div className="pointer-events-none my-[3px] text-center text-[1.25rem] font-extrabold leading-none">
                  {el.sym}
                </div>
                <div className="pointer-events-none overflow-hidden text-ellipsis whitespace-nowrap text-center text-[0.65rem] font-medium">
                  {el.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
