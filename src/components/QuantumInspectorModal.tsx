import React, { useEffect, useRef, useState } from 'react';
import { categories } from '../data/elementsData';
import { ChemicalElement } from '../types';

interface QuantumInspectorModalProps {
  element: ChemicalElement | null;
  onClose: () => void;
}

export const QuantumInspectorModal: React.FC<QuantumInspectorModalProps> = ({ element, onClose }) => {
  const [showOrbitals, setShowOrbitals] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!element) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth || 400;
      canvas.height = (parent.clientHeight || 460) - 80;
    }

    let time = 0;

    const render = () => {
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Core glow
      const coreRadius = Math.min(8 + Math.sqrt(element.num) * 1.5, 24);
      const radGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreRadius * 1.8);
      radGrad.addColorStop(0, '#ffffff');
      radGrad.addColorStop(0.3, '#f59e0b');
      radGrad.addColorStop(0.8, 'rgba(217, 119, 6, 0.4)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      if (showOrbitals) {
        const block = element.block;
        const samplePoints = Math.min(element.num * 8 + 120, 480);

        for (let i = 0; i < samplePoints; i++) {
          const seed = i + time * 0.4;
          let r: number, theta: number, phi: number;

          if (block === 's') {
            r = 40 + (Math.sin(seed * 3) * 0.5 + 0.5) * 80;
            theta = Math.sin(seed * 1.7) * Math.PI;
            phi = seed * 2.3;
          } else if (block === 'p') {
            const u = Math.sin(seed * 2.1);
            r = Math.abs(u) * 110 + 10;
            theta = Math.sign(u) * Math.abs(Math.sin(seed)) * 0.9;
            phi = (i % 3) * (Math.PI / 1.5) + seed * 0.05;
          } else if (block === 'd') {
            const u = Math.sin(seed * 4);
            r = Math.abs(u) * 120 + 15;
            theta = Math.sin(seed * 2) * 1.2;
            phi = (i % 4) * (Math.PI / 2) + Math.cos(seed) * 0.4;
          } else {
            const u = Math.sin(seed * 6);
            r = Math.abs(u) * 130 + 20;
            theta = Math.sin(seed * 3);
            phi = (i % 6) * (Math.PI / 3) + seed * 0.1;
          }

          const rotX = time * 0.015;
          const rotY = time * 0.02;

          const x3 = r * Math.cos(phi) * Math.sin(theta);
          const y3 = r * Math.sin(phi) * Math.sin(theta);
          const z3 = r * Math.cos(theta);

          const xRot = x3 * Math.cos(rotY) + z3 * Math.sin(rotY);
          const zRot = -x3 * Math.sin(rotY) + z3 * Math.cos(rotY);
          const yRot = y3 * Math.cos(rotX) - zRot * Math.sin(rotX);
          const depth = zRot * Math.cos(rotX) + y3 * Math.sin(rotX);

          const px = cx + xRot;
          const py = cy + yRot;

          const alpha = Math.max(0.1, (depth + 140) / 280);
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        const shells = element.shells;
        shells.forEach((electronsInShell, sIndex) => {
          const radius = 35 + sIndex * 22;

          ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.stroke();

          for (let e = 0; e < electronsInShell; e++) {
            const speed = 0.015 / (sIndex + 1);
            const theta = time * speed + (e * (Math.PI * 2 / electronsInShell));
            const ex = cx + radius * Math.cos(theta);
            const ey = cy + radius * Math.sin(theta);

            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#0ea5e9';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(ex, ey, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      }

      time += 1;
      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [element, showOrbitals]);

  if (!element) return null;

  const cat = categories[element.cat] || { name: element.cat, bg: '#f1f5f9', text: '#0f172a' };

  const blockNames: Record<string, string> = {
    s: 'Bloque s (Simetría Esférica)',
    p: 'Bloque p (Lóbulos Orientados)',
    d: 'Bloque d (Trebolar / Cuadrupolar)',
    f: 'Bloque f (Multilobular Complejo)'
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(15,23,42,0.55)] p-5 backdrop-blur-[4px]"
      id="atomModal"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-[950px] overflow-hidden rounded-[20px] bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)]">
        <button
          className="absolute right-[18px] top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-[#f1f5f9] text-[1.2rem] text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#0f172a]"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        {/* Left Side: Quantum Simulation */}
        <div className="relative flex flex-1 flex-col items-center justify-center bg-[#050811] p-5">
          <div className="absolute left-[15px] top-[15px] rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(15,23,42,0.8)] px-2.5 py-1 text-[0.75rem] font-bold text-[#38bdf8]">
            Orbital de Valencia: {element.block} (|Ψ|² Densidad Cuántica)
          </div>

          <canvas ref={canvasRef} className="h-[380px] w-full" id="atomCanvas" />

          <div className="absolute bottom-[15px] flex gap-2 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-[5px_12px] backdrop-blur-[10px]">
            <button
              className={`cursor-pointer rounded-md border-none px-2 py-1 text-[0.75rem] font-semibold text-white transition-colors ${
                showOrbitals ? 'bg-[rgba(255,255,255,0.25)]' : 'bg-transparent'
              }`}
              onClick={() => setShowOrbitals(true)}
            >
              Nube Cuántica (|Ψ|²)
            </button>
            <button
              className={`cursor-pointer rounded-md border-none px-2 py-1 text-[0.75rem] font-semibold text-white transition-colors ${
                !showOrbitals ? 'bg-[rgba(255,255,255,0.25)]' : 'bg-transparent'
              }`}
              onClick={() => setShowOrbitals(false)}
            >
              Niveles Bohr (K-Q)
            </button>
          </div>
        </div>

        {/* Right Side: Properties */}
        <div className="flex-1 overflow-y-auto bg-white p-7">
          <div className="mb-5 flex items-baseline gap-3">
            <h2 className="text-[2.2rem] font-black text-[#0f172a]">{element.sym}</h2>
            <span className="text-[1.3rem] font-bold text-[#334155]">{element.name}</span>
            <span
              className="rounded-md px-2 py-1 text-[0.8rem] font-bold"
              style={{ backgroundColor: cat.bg, color: cat.text }}
            >
              {cat.name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2.5">
              <label className="mb-0.5 block text-[0.7rem] font-bold uppercase text-[#64748b]">Número Atómico (Z)</label>
              <span className="text-[0.95rem] font-bold text-[#1e293b]">{element.num}</span>
            </div>
            <div className="rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2.5">
              <label className="mb-0.5 block text-[0.7rem] font-bold uppercase text-[#64748b]">Masa Atómica</label>
              <span className="text-[0.95rem] font-bold text-[#1e293b]">{element.mass} u</span>
            </div>
            <div className="rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2.5">
              <label className="mb-0.5 block text-[0.7rem] font-bold uppercase text-[#64748b]">Electrones por Capa</label>
              <span className="text-[0.95rem] font-bold text-[#0ea5e9]">{element.shells.join(', ')}</span>
            </div>
            <div className="rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2.5">
              <label className="mb-0.5 block text-[0.7rem] font-bold uppercase text-[#64748b]">Bloque / Geometría</label>
              <span className="text-[0.95rem] font-bold text-[#8b5cf6]">
                {blockNames[element.block] || 'Bloque Cuántico'}
              </span>
            </div>
            <div className="col-span-2 rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2.5">
              <label className="mb-0.5 block text-[0.7rem] font-bold uppercase text-[#64748b]">Configuración Electrónica Fundamental</label>
              <span className="text-[0.95rem] font-bold text-[#1e293b]">{element.cfg}</span>
            </div>
            <div className="rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2.5">
              <label className="mb-0.5 block text-[0.7rem] font-bold uppercase text-[#64748b]">Electronegatividad (Pauling)</label>
              <span className="text-[0.95rem] font-bold text-[#1e293b]">{element.en}</span>
            </div>
            <div className="rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2.5">
              <label className="mb-0.5 block text-[0.7rem] font-bold uppercase text-[#64748b]">Punto de Fusión</label>
              <span className="text-[0.95rem] font-bold text-[#1e293b]">{element.m}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
