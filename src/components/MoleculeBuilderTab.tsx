import React, { useEffect, useRef, useState } from 'react';
import { WorkbenchAtom } from '../types';
import { playChimeSound, playWaterDropSound } from '../utils/audio';

const atomProps: Record<
  string,
  { name: string; en: number; valence: number; maxBond: number; color: string; textColor: string; radius: number }
> = {
  H: { name: 'Hidrógeno', en: 2.2, valence: 1, maxBond: 1, color: '#f8fafc', textColor: '#0f172a', radius: 18 },
  C: { name: 'Carbono', en: 2.55, valence: 4, maxBond: 4, color: '#334155', textColor: '#ffffff', radius: 26 },
  N: { name: 'Nitrógeno', en: 3.04, valence: 5, maxBond: 3, color: '#3b82f6', textColor: '#ffffff', radius: 24 },
  O: { name: 'Oxígeno', en: 3.44, valence: 6, maxBond: 2, color: '#ef4444', textColor: '#ffffff', radius: 24 },
  Na: { name: 'Sodio', en: 0.93, valence: 1, maxBond: 1, color: '#fb923c', textColor: '#ffffff', radius: 28 },
  Cl: { name: 'Cloro', en: 3.16, valence: 7, maxBond: 1, color: '#22c55e', textColor: '#ffffff', radius: 28 },
  Ca: { name: 'Calcio', en: 1.0, valence: 2, maxBond: 2, color: '#facc15', textColor: '#0f172a', radius: 30 }
};

export const MoleculeBuilderTab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [atoms, setAtoms] = useState<WorkbenchAtom[]>([]);

  const [bondType, setBondType] = useState('Esperando átomos...');
  const [bondColor, setBondColor] = useState('#0284c7');
  const [deltaEnText, setDeltaEnText] = useState('Δ Electronegatividad: 0.00');
  const [octetStatus, setOctetStatus] = useState<React.ReactNode>(
    'Agrega al menos 2 átomos para analizar el enlace químico.'
  );
  const [compoundName, setCompoundName] = useState('Ninguno');
  const [compoundDesc, setCompoundDesc] = useState(
    'Ensambla una combinación química para descubrir sus aplicaciones en el mundo real.'
  );

  const addAtom = (sym: string) => {
    playWaterDropSound();
    const prop = atomProps[sym];
    const canvas = canvasRef.current;
    const cw = canvas?.width || 600;
    const ch = canvas?.height || 380;
    const cx = cw / 2;
    const cy = ch / 2;
    const offset = atoms.length * 65 - 100;

    const newAtom: WorkbenchAtom = {
      sym,
      name: prop.name,
      en: prop.en,
      valence: prop.valence,
      color: prop.color,
      textColor: prop.textColor,
      radius: prop.radius,
      x: Math.max(50, Math.min(cw - 50, cx + offset)),
      y: cy + (Math.random() - 0.5) * 40
    };

    setAtoms(prev => [...prev, newAtom]);
  };

  const clearWorkbench = () => {
    playChimeSound();
    setAtoms([]);
  };

  const loadMission = (type: string) => {
    playChimeSound();
    const canvas = canvasRef.current;
    const cw = canvas?.width || 600;
    const ch = canvas?.height || 380;
    const cx = cw / 2;
    const cy = ch / 2;

    let syms: string[] = [];
    if (type === 'H2O') syms = ['H', 'O', 'H'];
    else if (type === 'NaCl') syms = ['Na', 'Cl'];
    else if (type === 'CO2') syms = ['O', 'C', 'O'];
    else if (type === 'CH4') syms = ['H', 'H', 'C', 'H', 'H'];

    const newAtoms: WorkbenchAtom[] = syms.map((sym, i) => {
      const prop = atomProps[sym];
      const offset = (i - (syms.length - 1) / 2) * 70;
      return {
        sym,
        name: prop.name,
        en: prop.en,
        valence: prop.valence,
        color: prop.color,
        textColor: prop.textColor,
        radius: prop.radius,
        x: Math.max(50, Math.min(cw - 50, cx + offset)),
        y: cy + (Math.random() - 0.5) * 20
      };
    });

    setAtoms(newAtoms);
  };

  // Evaluate chemical bond & compound when atoms change
  useEffect(() => {
    if (atoms.length < 2) {
      setBondType('Esperando átomos...');
      setBondColor('#0284c7');
      setDeltaEnText('Δ Electronegatividad: 0.00');
      setOctetStatus('Agrega al menos 2 átomos para analizar el enlace químico.');
      setCompoundName('Ninguno');
      setCompoundDesc(
        'Ensambla una combinación química para descubrir sus aplicaciones en el mundo real.'
      );
      return;
    }

    let minEn = 10;
    let maxEn = 0;
    atoms.forEach(a => {
      if (a.en < minEn) minEn = a.en;
      if (a.en > maxEn) maxEn = a.en;
    });
    const deltaEn = (maxEn - minEn).toFixed(2);
    setDeltaEnText(`Δ Electronegatividad: ${deltaEn}`);

    // Pauling bond classification
    const dVal = parseFloat(deltaEn);
    if (dVal >= 1.7) {
      setBondType('Enlace Iónico (Transferencia de e⁻)');
      setBondColor('#ef4444');
    } else if (dVal >= 0.4) {
      setBondType('Enlace Covalente Polar (Compartición Asimétrica)');
      setBondColor('#0284c7');
    } else {
      setBondType('Enlace Covalente No Polar (Compartición Equitativa)');
      setBondColor('#16a34a');
    }

    const counts: Record<string, number> = {};
    atoms.forEach(a => {
      counts[a.sym] = (counts[a.sym] || 0) + 1;
    });

    if (counts['H'] === 2 && counts['O'] === 1 && atoms.length === 3) {
      setCompoundName('Agua (H₂O)');
      setCompoundDesc(
        'Molécula de la vida con geometría angular (104.5°). El Oxígeno completa su octeto (8 e⁻) y los Hidrógenos completan su dueto (2 e⁻).'
      );
      setOctetStatus(
        <span>
          <b className="text-[#16a34a]">✔ Regla del Octeto Cumplida:</b> Enlace estable.
        </span>
      );
    } else if (counts['Na'] === 1 && counts['Cl'] === 1 && atoms.length === 2) {
      setCompoundName('Cloruro de Sodio (NaCl)');
      setCompoundDesc(
        'Sal común de cocina. El Sodio transfiere su electrón al Cloro formando iones Na⁺ y Cl⁻ unidos por atracción electrostática pura.'
      );
      setOctetStatus(
        <span>
          <b className="text-[#16a34a]">✔ Octeto Iónico Completo:</b> Ambos iones alcanzan configuración de gas noble.
        </span>
      );
    } else if (counts['C'] === 1 && counts['O'] === 2 && atoms.length === 3) {
      setCompoundName('Dióxido de Carbono (CO₂)');
      setCompoundDesc(
        'Gas de efecto invernadero y producto de la respiración. Dos enlaces dobles covalentes (O=C=O) lineales.'
      );
      setOctetStatus(
        <span>
          <b className="text-[#16a34a]">✔ Octeto Covalente Doble:</b> Los 3 átomos completan 8 electrones.
        </span>
      );
    } else if (counts['C'] === 1 && counts['H'] === 4 && atoms.length === 5) {
      setCompoundName('Metano (CH₄)');
      setCompoundDesc(
        'Gas natural de uso doméstico con geometría tetraédrica simétrica perfecta.'
      );
      setOctetStatus(
        <span>
          <b className="text-[#16a34a]">✔ Octeto Tetraédrico Completo:</b> Hidrocarburo saturado estable.
        </span>
      );
    } else {
      setCompoundName('Combinación en Proceso');
      setCompoundDesc('Átomos en interacción. Ajusta las proporciones estequiométricas para estabilizar la molécula.');
      setOctetStatus('Verificando solapamiento de capas de valencia...');
    }
  }, [atoms]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wctx = canvas.getContext('2d');
    if (!wctx) return;

    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth || 500;
      canvas.height = 380;
    }

    wctx.fillStyle = '#0f172a';
    wctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw connecting bonds
    if (atoms.length >= 2) {
      for (let i = 0; i < atoms.length - 1; i++) {
        const a1 = atoms[i];
        const a2 = atoms[i + 1];

        wctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        wctx.lineWidth = 4;
        wctx.beginPath();
        wctx.moveTo(a1.x, a1.y);
        wctx.lineTo(a2.x, a2.y);
        wctx.stroke();

        // Shared electron pair
        const midX = (a1.x + a2.x) / 2;
        const midY = (a1.y + a2.y) / 2;
        wctx.fillStyle = '#38bdf8';
        wctx.beginPath();
        wctx.arc(midX - 4, midY, 3, 0, Math.PI * 2);
        wctx.arc(midX + 4, midY, 3, 0, Math.PI * 2);
        wctx.fill();
      }
    }

    // Draw atoms
    atoms.forEach(atom => {
      wctx.save();
      wctx.shadowColor = atom.color;
      wctx.shadowBlur = 10;
      wctx.fillStyle = atom.color;
      wctx.beginPath();
      wctx.arc(atom.x, atom.y, atom.radius, 0, Math.PI * 2);
      wctx.fill();
      wctx.restore();

      wctx.fillStyle = atom.textColor;
      wctx.font = 'bold 14px sans-serif';
      wctx.textAlign = 'center';
      wctx.textBaseline = 'middle';
      wctx.fillText(atom.sym, atom.x, atom.y);

      // Lewis valence dots
      const dots = atom.valence;
      for (let d = 0; d < dots; d++) {
        const angle = d * ((Math.PI * 2) / dots);
        const dotX = atom.x + (atom.radius + 8) * Math.cos(angle);
        const dotY = atom.y + (atom.radius + 8) * Math.sin(angle);
        wctx.fillStyle = '#38bdf8';
        wctx.beginPath();
        wctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
        wctx.fill();
      }
    });
  }, [atoms]);

  return (
    <section id="tab-builder" className="block w-full">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[340px_1fr_320px]">
        {/* Panel Dispensador de Átomos */}
        <div className="flex flex-col gap-3.5 rounded-[18px] border border-[#e2e8f0] bg-white p-5 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.05)]">
          <h3 className="text-base font-bold text-[#0f172a]">Banco de Átomos</h3>
          <p className="text-[0.8rem] text-[#64748b]">Toca para agregar átomos al área de ensamble molecular:</p>

          <div className="grid grid-cols-3 gap-2" id="atomDispenser">
            <div
              className="cursor-pointer rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-2.5 text-center transition-all hover:-translate-y-0.5 hover:border-[#0ea5e9] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)]"
              onClick={() => addAtom('H')}
            >
              <b className="block text-[1.1rem] text-[#0f172a]">H</b>
              <span className="text-[0.7rem] text-[#64748b]">Hidrógeno</span>
            </div>
            <div
              className="cursor-pointer rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-2.5 text-center transition-all hover:-translate-y-0.5 hover:border-[#0ea5e9] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)]"
              onClick={() => addAtom('C')}
            >
              <b className="block text-[1.1rem] text-[#0f172a]">C</b>
              <span className="text-[0.7rem] text-[#64748b]">Carbono</span>
            </div>
            <div
              className="cursor-pointer rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-2.5 text-center transition-all hover:-translate-y-0.5 hover:border-[#0ea5e9] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)]"
              onClick={() => addAtom('N')}
            >
              <b className="block text-[1.1rem] text-[#0f172a]">N</b>
              <span className="text-[0.7rem] text-[#64748b]">Nitrógeno</span>
            </div>
            <div
              className="cursor-pointer rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-2.5 text-center transition-all hover:-translate-y-0.5 hover:border-[#0ea5e9] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)]"
              onClick={() => addAtom('O')}
            >
              <b className="block text-[1.1rem] text-[#0f172a]">O</b>
              <span className="text-[0.7rem] text-[#64748b]">Oxígeno</span>
            </div>
            <div
              className="cursor-pointer rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-2.5 text-center transition-all hover:-translate-y-0.5 hover:border-[#0ea5e9] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)]"
              onClick={() => addAtom('Na')}
            >
              <b className="block text-[1.1rem] text-[#0f172a]">Na</b>
              <span className="text-[0.7rem] text-[#64748b]">Sodio</span>
            </div>
            <div
              className="cursor-pointer rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-2.5 text-center transition-all hover:-translate-y-0.5 hover:border-[#0ea5e9] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)]"
              onClick={() => addAtom('Cl')}
            >
              <b className="block text-[1.1rem] text-[#0f172a]">Cl</b>
              <span className="text-[0.7rem] text-[#64748b]">Cloro</span>
            </div>
            <div
              className="cursor-pointer rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-2.5 text-center transition-all hover:-translate-y-0.5 hover:border-[#0ea5e9] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)]"
              onClick={() => addAtom('Ca')}
            >
              <b className="block text-[1.1rem] text-[#0f172a]">Ca</b>
              <span className="text-[0.7rem] text-[#64748b]">Calcio</span>
            </div>
          </div>

          <h3 className="mt-2 text-base font-bold text-[#0f172a]">Misiones Moleculares</h3>
          <div className="flex flex-col gap-1.5">
            <button
              className="cursor-pointer rounded-md border border-[#e2e8f0] bg-[#f1f5f9] p-2 text-left text-[0.75rem] font-bold text-[#0369a1] transition-all hover:bg-[#0ea5e9] hover:text-white"
              onClick={() => loadMission('H2O')}
            >
              💧 Misión 1: Sintetiza Agua (H₂O)
            </button>
            <button
              className="cursor-pointer rounded-md border border-[#e2e8f0] bg-[#f1f5f9] p-2 text-left text-[0.75rem] font-bold text-[#0369a1] transition-all hover:bg-[#0ea5e9] hover:text-white"
              onClick={() => loadMission('NaCl')}
            >
              🧂 Misión 2: Sintetiza Sal de Mesa (NaCl)
            </button>
            <button
              className="cursor-pointer rounded-md border border-[#e2e8f0] bg-[#f1f5f9] p-2 text-left text-[0.75rem] font-bold text-[#0369a1] transition-all hover:bg-[#0ea5e9] hover:text-white"
              onClick={() => loadMission('CO2')}
            >
              💨 Misión 3: Dióxido de Carbono (CO₂)
            </button>
            <button
              className="cursor-pointer rounded-md border border-[#e2e8f0] bg-[#f1f5f9] p-2 text-left text-[0.75rem] font-bold text-[#0369a1] transition-all hover:bg-[#0ea5e9] hover:text-white"
              onClick={() => loadMission('CH4')}
            >
              🔥 Misión 4: Gas Metano de Estufa (CH₄)
            </button>
          </div>

          <button
            className="mt-2 cursor-pointer rounded-lg border-none bg-[#64748b] px-3.5 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90"
            onClick={clearWorkbench}
          >
            Desarmar Molécula
          </button>
        </div>

        {/* Workbench Stage Canvas */}
        <div className="relative flex min-h-[440px] flex-col items-center justify-center rounded-[18px] bg-[#0f172a] p-5">
          <canvas ref={canvasRef} className="h-[380px] w-full" id="workbenchCanvas" />
        </div>

        {/* Bond Analysis & Octet rule */}
        <div className="flex flex-col gap-3.5 rounded-[18px] border border-[#e2e8f0] bg-white p-5 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.05)]">
          <h3 className="text-base font-bold text-[#0f172a]">Análisis de Enlace</h3>

          <div className="rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-3">
            <label className="text-[0.7rem] font-bold uppercase text-[#64748b]">Tipo de Enlace Químico</label>
            <div
              className="mt-1 text-[1.1rem] font-extrabold"
              id="bondTypeDisplay"
              style={{ color: bondColor }}
            >
              {bondType}
            </div>
            <div className="mt-0.5 text-[0.8rem] text-[#64748b]" id="electronegativityDelta">
              {deltaEnText}
            </div>
          </div>

          <div className="rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-3">
            <label className="text-[0.7rem] font-bold uppercase text-[#64748b]">Regla del Octeto / Dueto</label>
            <div className="mt-1 text-[0.85rem] text-[#334155]" id="octetStatusDisplay">
              {octetStatus}
            </div>
          </div>

          <div className="rounded-[10px] border border-[#bfdbfe] bg-[#eff6ff] p-3">
            <label className="text-[0.7rem] font-bold uppercase text-[#1d4ed8]">
              Compuesto Cotidiano Identificado
            </label>
            <div className="mt-1 text-[1.1rem] font-extrabold text-[#0f172a]" id="compoundNameDisplay">
              {compoundName}
            </div>
            <p className="mt-1 text-[0.8rem] text-[#334155]" id="compoundDescDisplay">
              {compoundDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
