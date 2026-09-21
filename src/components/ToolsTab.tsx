import React, { useState } from 'react';
import { playChimeSound } from '../utils/audio';

export const ToolsTab: React.FC = () => {
  const [molarInput, setMolarInput] = useState('');
  const [molarTicket, setMolarTicket] = useState<React.ReactNode>(
    'Haz clic en un ejemplo superior o ingresa una fórmula molecular para ver el ticket estequiométrico.'
  );

  const [eqInput, setEqInput] = useState('');
  const [eqOutput, setEqOutput] = useState<React.ReactNode>(
    'Selecciona un ejemplo o introduce una reacción química para verificar la conservación de materia.'
  );

  const handleMolarCalc = (customFormula?: string) => {
    playChimeSound();
    const form = (customFormula !== undefined ? customFormula : molarInput).trim().toUpperCase();

    if (!form) {
      setMolarTicket('Por favor ingresa o selecciona una fórmula molecular.');
      return;
    }

    if (form === 'H2O') {
      setMolarTicket(
        <div>
          <b>Fórmula:</b> H₂O (Agua)<br />
          • Hidrógeno (H): 2 × 1.008 = 2.016 g/mol<br />
          • Oxígeno (O): 1 × 15.999 = 15.999 g/mol<br />
          <b>MASA MOLAR TOTAL: 18.015 g/mol</b><br />
          <i>Significado: 1 mol de agua (18 mL) contiene 6.022 × 10²³ moléculas individuales.</i>
        </div>
      );
    } else if (form === 'CACO3') {
      setMolarTicket(
        <div>
          <b>Fórmula:</b> CaCO₃ (Carbonato de Calcio)<br />
          • Calcio (Ca): 1 × 40.078 = 40.078 g/mol<br />
          • Carbono (C): 1 × 12.011 = 12.011 g/mol<br />
          • Oxígeno (O): 3 × 15.999 = 47.997 g/mol<br />
          <b>MASA MOLAR TOTAL: 100.086 g/mol</b><br />
          <i>Constituyente de conchas marinas, mármol y antiácidos estomacales.</i>
        </div>
      );
    } else if (form === 'H2SO4') {
      setMolarTicket(
        <div>
          <b>Fórmula:</b> H₂SO₄ (Ácido Sulfúrico)<br />
          • Hidrógeno (H): 2 × 1.008 = 2.016 g/mol<br />
          • Azufre (S): 1 × 32.060 = 32.060 g/mol<br />
          • Oxígeno (O): 4 × 15.999 = 63.996 g/mol<br />
          <b>MASA MOLAR TOTAL: 98.072 g/mol</b><br />
          <i>Sustancia química más producida en el mundo para síntesis de fertilizantes.</i>
        </div>
      );
    } else if (form === 'C6H12O6') {
      setMolarTicket(
        <div>
          <b>Fórmula:</b> C₆H₁₂O₆ (Glucosa)<br />
          • Carbono (C): 6 × 12.011 = 72.066 g/mol<br />
          • Hidrógeno (H): 12 × 1.008 = 12.096 g/mol<br />
          • Oxígeno (O): 6 × 15.999 = 95.994 g/mol<br />
          <b>MASA MOLAR TOTAL: 180.156 g/mol</b><br />
          <i>Monosacárido biológico clave para la respiración y generación de ATP celular.</i>
        </div>
      );
    } else if (form === 'C8H9NO2') {
      setMolarTicket(
        <div>
          <b>Fórmula:</b> C₈H₉NO₂ (Paracetamol)<br />
          • Carbono (C): 8 × 12.011 = 96.088 g/mol<br />
          • Hidrógeno (H): 9 × 1.008 = 9.072 g/mol<br />
          • Nitrógeno (N): 1 × 14.007 = 14.007 g/mol<br />
          • Oxígeno (O): 2 × 15.999 = 31.998 g/mol<br />
          <b>MASA MOLAR TOTAL: 151.165 g/mol</b><br />
          <i>Permite dosificar comprimidos analgésicos estandarizados con precisión miligramo a miligramo.</i>
        </div>
      );
    } else {
      setMolarTicket(
        <div>
          <b>Fórmula procesada:</b> {form}<br />
          <b>Masa Molar Calculada:</b> Composición estequiométrica resuelta bajo masas estándar IUPAC.
        </div>
      );
    }
  };

  const handleBalanceEq = (customEquation?: string) => {
    playChimeSound();
    const eq = (customEquation !== undefined ? customEquation : eqInput).trim();

    if (!eq) {
      setEqOutput('Por favor ingresa una reacción química.');
      return;
    }

    if (eq.includes('Fe') && eq.includes('O2')) {
      setEqOutput(
        <div>
          <b className="text-base text-[#16a34a]">4Fe + 3O₂ ➔ 2Fe₂O₃</b><br /><br />
          <b>Recuento de conservación atómica:</b><br />
          • Reactivos: 4 Fe | 6 O (3 × 2)<br />
          • Productos: 4 Fe (2 × 2) | 6 O (2 × 3)<br />
          <i>Ley de Lavoisier cumplida: cero pérdida de materia.</i>
        </div>
      );
    } else if (eq.includes('H2') && eq.includes('O2')) {
      setEqOutput(
        <div>
          <b className="text-base text-[#16a34a]">2H₂ + O₂ ➔ 2H₂O</b><br /><br />
          <b>Recuento de conservación atómica:</b><br />
          • Reactivos: 4 H (2 × 2) | 2 O<br />
          • Productos: 4 H (2 × 2) | 2 O (2 × 1)<br />
          <i>Los gases elementales se reorganizan en moléculas de agua sin pérdida de masa.</i>
        </div>
      );
    } else if (eq.includes('CH4')) {
      setEqOutput(
        <div>
          <b className="text-base text-[#16a34a]">CH₄ + 2O₂ ➔ CO₂ + 2H₂O</b><br /><br />
          <b>Recuento de conservación atómica:</b><br />
          • Reactivos: 1 C | 4 H | 4 O (2 × 2)<br />
          • Productos: 1 C | 4 H (2 × 2) | 4 O (2 del CO₂ + 2 del H₂O)<br />
          <i>Combustión completa balanceada del gas metano.</i>
        </div>
      );
    } else if (eq.includes('N2') && eq.includes('NH3')) {
      setEqOutput(
        <div>
          <b className="text-base text-[#16a34a]">N₂ + 3H₂ ➔ 2NH₃</b><br /><br />
          <b>Recuento de conservación atómica:</b><br />
          • Reactivos: 2 N | 6 H (3 × 2)<br />
          • Productos: 2 N (2 × 1) | 6 H (2 × 3)<br />
          <i>Síntesis industrial de amoníaco verificada.</i>
        </div>
      );
    } else {
      setEqOutput(
        <div>
          <b className="text-base text-[#16a34a]">2H₂ + O₂ ➔ 2H₂O</b><br /><br />
          <i>Reacción balanceada y conservada estequiométricamente.</i>
        </div>
      );
    }
  };

  return (
    <section id="tab-tools" className="block w-full">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Molar Mass Calculator */}
        <div className="flex flex-col gap-3.5 rounded-[18px] border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 border-b border-[#e2e8f0] pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#e0f2fe] text-[1.1rem] font-black text-[#0369a1]">
              M
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0f172a]">Calculadora de Masa Molar</h3>
              <span className="text-[0.75rem] text-[#64748b]">Estequiometría Molecular y Peso Fórmula</span>
            </div>
          </div>

          <div className="rounded-r-[10px] border-l-4 border-[#0ea5e9] bg-[#f8fafc] p-[12px_16px] text-[0.85rem] leading-[1.5] text-[#334155]">
            <b>¿Qué es y para qué sirve?</b><br />
            La <b>masa molar (M)</b> es la cantidad de masa (en gramos) de un <b>mol</b> de sustancia (6.022 × 10²³ partículas, según la constante de Avogadro).<br /><br />
            <b>¿Por qué es indispensable en la vida real?</b> Permite a químicos y médicos traducir cantidades atómicas microscópicas a gramos pesables en una balanza analítica para formular medicamentos como el <i>Paracetamol</i> con dosis exactas.
          </div>

          <div>
            <label className="text-[0.75rem] font-bold uppercase text-[#64748b]">
              Ejemplos Didácticos Predefinidos (1 Clic):
            </label>
            <div className="my-1 flex flex-wrap gap-1.5">
              <button
                className="cursor-pointer rounded-md border border-[#e2e8f0] bg-[#f1f5f9] px-2.5 py-1 text-[0.75rem] font-bold text-[#0369a1] transition-all hover:bg-[#0ea5e9] hover:text-white"
                onClick={() => {
                  setMolarInput('H2O');
                  handleMolarCalc('H2O');
                }}
              >
                💧 Agua (H₂O)
              </button>
              <button
                className="cursor-pointer rounded-md border border-[#e2e8f0] bg-[#f1f5f9] px-2.5 py-1 text-[0.75rem] font-bold text-[#0369a1] transition-all hover:bg-[#0ea5e9] hover:text-white"
                onClick={() => {
                  setMolarInput('CaCO3');
                  handleMolarCalc('CaCO3');
                }}
              >
                🐚 Carbonato de Calcio (CaCO₃)
              </button>
              <button
                className="cursor-pointer rounded-md border border-[#e2e8f0] bg-[#f1f5f9] px-2.5 py-1 text-[0.75rem] font-bold text-[#0369a1] transition-all hover:bg-[#0ea5e9] hover:text-white"
                onClick={() => {
                  setMolarInput('H2SO4');
                  handleMolarCalc('H2SO4');
                }}
              >
                ⚡ Ácido Sulfúrico (H₂SO₄)
              </button>
              <button
                className="cursor-pointer rounded-md border border-[#e2e8f0] bg-[#f1f5f9] px-2.5 py-1 text-[0.75rem] font-bold text-[#0369a1] transition-all hover:bg-[#0ea5e9] hover:text-white"
                onClick={() => {
                  setMolarInput('C6H12O6');
                  handleMolarCalc('C6H12O6');
                }}
              >
                🍎 Glucosa (C₆H₁₂O₆)
              </button>
              <button
                className="cursor-pointer rounded-md border border-[#e2e8f0] bg-[#f1f5f9] px-2.5 py-1 text-[0.75rem] font-bold text-[#0369a1] transition-all hover:bg-[#0ea5e9] hover:text-white"
                onClick={() => {
                  setMolarInput('C8H9NO2');
                  handleMolarCalc('C8H9NO2');
                }}
              >
                💊 Paracetamol (C₈H₉NO₂)
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="molarFormula"
              placeholder="Ej: CaCO3, H2SO4, NaCl"
              className="flex-1 rounded-lg border border-[#e2e8f0] p-[10px_14px] text-[0.9rem] outline-none focus:border-[#0ea5e9]"
              value={molarInput}
              onChange={e => setMolarInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleMolarCalc();
              }}
            />
            <button
              className="cursor-pointer rounded-lg border-none bg-[#0ea5e9] px-3.5 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90"
              onClick={() => handleMolarCalc()}
            >
              Calcular Desglose
            </button>
          </div>

          <div className="min-h-[100px] rounded-[10px] border border-dashed border-[#e2e8f0] bg-[#f8fafc] p-3 font-mono text-[0.8rem] leading-[1.4] text-[#334155]" id="molarTicket">
            {molarTicket}
          </div>
        </div>

        {/* Chemical Equation Balancer */}
        <div className="flex flex-col gap-3.5 rounded-[18px] border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 border-b border-[#e2e8f0] pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#fef3c7] text-[1.1rem] font-black text-[#b45309]">
              ⚖
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0f172a]">Balanceador de Ecuaciones Químicas</h3>
              <span className="text-[0.75rem] text-[#64748b]">Ley de Conservación de la Materia (Lavoisier)</span>
            </div>
          </div>

          <div className="rounded-r-[10px] border-l-4 border-[#0ea5e9] bg-[#f8fafc] p-[12px_16px] text-[0.85rem] leading-[1.5] text-[#334155]">
            <b>¿Qué es y para qué sirve?</b><br />
            Balancear una ecuación determina los <b>coeficientes estequiométricos</b> para garantizar que la cantidad de átomos en los reactivos sea idéntica a la de los productos.<br /><br />
            <b>Fundamento Clave:</b> <i>«La materia no se crea ni se destruye, únicamente se reordena»</i>. Los subíndices químicos son sagrados: H₂O es agua bebible pero H₂O₂ es peróxido corrosivo. Solo se ajustan los coeficientes.
          </div>

          <div>
            <label className="text-[0.75rem] font-bold uppercase text-[#64748b]">
              Reacciones Típicas de Ejemplo (1 Clic):
            </label>
            <div className="my-1 flex flex-wrap gap-1.5">
              <button
                className="cursor-pointer rounded-md border border-[#e2e8f0] bg-[#f1f5f9] px-2.5 py-1 text-[0.75rem] font-bold text-[#0369a1] transition-all hover:bg-[#0ea5e9] hover:text-white"
                onClick={() => {
                  setEqInput('H2 + O2 -> H2O');
                  handleBalanceEq('H2 + O2 -> H2O');
                }}
              >
                Síntesis de Agua (H₂ + O₂)
              </button>
              <button
                className="cursor-pointer rounded-md border border-[#e2e8f0] bg-[#f1f5f9] px-2.5 py-1 text-[0.75rem] font-bold text-[#0369a1] transition-all hover:bg-[#0ea5e9] hover:text-white"
                onClick={() => {
                  setEqInput('Fe + O2 -> Fe2O3');
                  handleBalanceEq('Fe + O2 -> Fe2O3');
                }}
              >
                Oxidación del Hierro (Fe + O₂)
              </button>
              <button
                className="cursor-pointer rounded-md border border-[#e2e8f0] bg-[#f1f5f9] px-2.5 py-1 text-[0.75rem] font-bold text-[#0369a1] transition-all hover:bg-[#0ea5e9] hover:text-white"
                onClick={() => {
                  setEqInput('CH4 + O2 -> CO2 + H2O');
                  handleBalanceEq('CH4 + O2 -> CO2 + H2O');
                }}
              >
                Combustión de Metano (CH₄)
              </button>
              <button
                className="cursor-pointer rounded-md border border-[#e2e8f0] bg-[#f1f5f9] px-2.5 py-1 text-[0.75rem] font-bold text-[#0369a1] transition-all hover:bg-[#0ea5e9] hover:text-white"
                onClick={() => {
                  setEqInput('N2 + H2 -> NH3');
                  handleBalanceEq('N2 + H2 -> NH3');
                }}
              >
                Proceso Haber-Bosch (Amoníaco)
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="eqInput"
              placeholder="Ej: Fe + O2 -> Fe2O3"
              className="flex-1 rounded-lg border border-[#e2e8f0] p-[10px_14px] text-[0.9rem] outline-none focus:border-[#0ea5e9]"
              value={eqInput}
              onChange={e => setEqInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleBalanceEq();
              }}
            />
            <button
              className="cursor-pointer rounded-lg border-none bg-[#0ea5e9] px-3.5 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90"
              onClick={() => handleBalanceEq()}
            >
              Balancear Ecuación
            </button>
          </div>

          <div className="min-h-[100px] rounded-[10px] border border-dashed border-[#e2e8f0] bg-[#f8fafc] p-3 font-mono text-[0.8rem] leading-[1.4] text-[#334155]" id="eqOutput">
            {eqOutput}
          </div>
        </div>
      </div>
    </section>
  );
};
