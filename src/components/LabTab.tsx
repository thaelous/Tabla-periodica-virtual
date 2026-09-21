import React, { useEffect, useRef, useState } from 'react';
import { GuidedExperiment, LabParticle, PrecipitateParticle } from '../types';
import { playBurnerClick, playChimeSound, playFizzSound } from '../utils/audio';

const guidedCurriculum: Record<string, GuidedExperiment> = {
  alkali: {
    title: '1. Reacción Redox & Desprendimiento de H₂',
    subtitle: 'Sodio metálico en agua: efervescencia y causticidad',
    steps: [
      {
        stepNum: 'Paso 1 de 2 • Dosificación',
        action: 'Haz clic en \'+ Na\' para dosificar Sodio metálico.',
        why: 'El Sodio posee un único electrón en 3s¹ con baja energía de ionización. Al contacto con el agua, cede ese electrón violentamente reduciendo protones a gas H₂ inflamable.',
        requiredType: 'reagent',
        requiredValue: 'Na',
        calloutId: 'btn-reag-Na',
        eq: '2Na (s) + 2H₂O (l) ➔ 2NaOH (aq) + H₂ (g)↑ + ΔH',
        log: '<b>Fenómeno Redox:</b> Oxidación enérgica de Na a Na⁺. La reducción del agua genera gas H₂ y soda cáustica alcalina.'
      },
      {
        stepNum: 'Paso 2 de 2 • Comprobación',
        action: 'Haz clic en \'+ Fenolftaleína\' para comprobar la alcalinidad.',
        why: 'La formación de iones hidróxido (OH⁻) eleva el pH a >13. La fenolftaleína perderá protones virando su estructura cromófora a rosa fucsia intenso.',
        requiredType: 'phenol',
        calloutId: 'btn-reag-phenol',
        eq: 'NaOH (aq) ➔ Na⁺ + OH⁻ [pH > 13]',
        log: '<b>Comprobación de pH:</b> El viraje cromático a fucsia confirma la naturaleza alcalina de la solución.'
      }
    ]
  },
  titration: {
    title: '2. Neutralización Ácido-Base',
    subtitle: 'HCl + NaOH con viraje de Fenolftaleína a pH 7',
    steps: [
      {
        stepNum: 'Paso 1 de 3 • Acidificación',
        action: 'Haz clic en \'+ HCl\' para acidificar el disolvente.',
        why: 'El ácido clorhídrico suministra gran cantidad de iones hidronio (H₃O⁺). El pH caerá a ~1.5.',
        requiredType: 'reagent',
        requiredValue: 'HCl',
        calloutId: 'btn-reag-HCl',
        eq: 'HCl (aq) + H₂O ➔ H₃O⁺ + Cl⁻',
        log: '<b>Acidificación:</b> Disolución ácida transparente con exceso de protones libres.'
      },
      {
        stepNum: 'Paso 2 de 3 • Indicador',
        action: 'Añade \'+ Fenolftaleína\' para monitorear el pH.',
        why: 'En pH ácido (<8.2), la fenolftaleína es incolora y permanece a la espera del punto de equivalencia.',
        requiredType: 'phenol',
        calloutId: 'btn-reag-phenol',
        eq: 'Medio ácido con indicador incoloro listo.',
        log: '<b>Indicador presente:</b> La fenolftaleína está incolora a la espera del punto de equivalencia.'
      },
      {
        stepNum: 'Paso 3 de 3 • Neutralización',
        action: 'Agrega \'+ NaOH\' para neutralizar el ácido.',
        why: 'Los protones H⁺ y los iones OH⁻ reaccionan estequiométricamente para formar agua neutra (H₂O) y cloruro sódico (NaCl).',
        requiredType: 'reagent',
        requiredValue: 'NaOH',
        calloutId: 'btn-reag-NaOH',
        eq: 'HCl (aq) + NaOH (aq) ➔ NaCl (aq) + H₂O (l)',
        log: '<b>Punto de Equivalencia:</b> Neutralización completa alcanzada (pH 7.00). Sal neutra en solución.'
      }
    ]
  },
  precipitate: {
    title: '3. Síntesis y Cristalización de Yoduro de Plomo',
    subtitle: 'Formación de microcristales amarillos insolubles',
    steps: [
      {
        stepNum: 'Paso 1 de 2 • Solvatación',
        action: 'Agrega \'+ KI\' (Yoduro de Potasio).',
        why: 'Los iones K⁺ e I⁻ se disocian homogéneamente en la red acuosa.',
        requiredType: 'reagent',
        requiredValue: 'KI',
        calloutId: 'btn-reag-KI',
        eq: 'KI (s) ➔ K⁺ (aq) + I⁻ (aq)',
        log: '<b>Solvatación:</b> Iones yoduro hidratados libres en la red líquida.'
      },
      {
        stepNum: 'Paso 2 de 2 • Cristalización',
        action: 'Haz clic en \'Agitador: OFF\' para encenderlo y precipitar.',
        why: 'La convección forzada supera el producto de solubilidad (Ksp) nucleando microcristales hexagonales de PbI₂ amarillos brillantes.',
        requiredType: 'stirrer',
        requiredValue: true,
        calloutId: 'btnStirrer',
        eq: 'Pb²⁺ (aq) + 2I⁻ (aq) ➔ PbI₂ (s)↓',
        log: '<b>Precipitación de Red Cristalina:</b> Formación de microcristales insolubles de Yoduro de Plomo.'
      }
    ]
  },
  complex: {
    title: '4. Complejos de Coordinación Acuo de Cobre',
    subtitle: 'CuSO₄ + H₂O: Hidratación catiónica azul',
    steps: [
      {
        stepNum: 'Paso 1 de 2 • Disolución',
        action: 'Dosifica \'+ CuSO₄\' para introducir el catión Cobre(II).',
        why: 'El Cu²⁺ atrae ligandos de agua para formar el complejo [Cu(H₂O)₆]²⁺ responsable del color azul celeste.',
        requiredType: 'reagent',
        requiredValue: 'CuSO4',
        calloutId: 'btn-reag-CuSO4',
        eq: 'CuSO₄ (s) + 6H₂O ➔ [Cu(H₂O)₆]²⁺ (aq) + SO₄²⁻',
        log: '<b>Complejación Acuosa:</b> La absorción de fotones de luz roja por campo cristalino produce el color azul.'
      },
      {
        stepNum: 'Paso 2 de 2 • Homogeneización',
        action: 'Enciende el \'Agitador\' para distribuir el soluto.',
        why: 'La agitación forzada asegura que el gradiente de concentración molar sea homogéneo en todo el volumen.',
        requiredType: 'stirrer',
        requiredValue: true,
        calloutId: 'btnStirrer',
        eq: 'Disolución homogénea de sulfato cúprico.',
        log: '<b>Homogeneización completa:</b> Concentración molar uniforme de Cu²⁺ en todo el vaso.'
      }
    ]
  },
  effervescence: {
    title: '5. Descomposición de Carbonatos (CO₂)',
    subtitle: 'NaHCO₃ + HCl: Liberación violenta de gas',
    steps: [
      {
        stepNum: 'Paso 1 de 2 • Acidificación previa',
        action: 'Agrega \'+ HCl\' para suministrar protones al agua.',
        why: 'El bicarbonato necesita protones libres para protonarse a ácido carbónico.',
        requiredType: 'reagent',
        requiredValue: 'HCl',
        calloutId: 'btn-reag-HCl',
        eq: 'HCl (aq) ➔ H⁺ (aq) + Cl⁻ (aq)',
        log: '<b>Medio protonado:</b> Concentración ácida preparada para degradar el carbonato.'
      },
      {
        stepNum: 'Paso 2 de 2 • Descomposición',
        action: 'Agrega \'+ NaHCO₃\' (Bicarbonato).',
        why: 'El ácido carbónico formado (H₂CO₃) es inestable y se disocia instantáneamente en agua y gas CO₂ con burbujeo vigoroso.',
        requiredType: 'reagent',
        requiredValue: 'NaHCO3',
        calloutId: 'btn-reag-NaHCO3',
        eq: 'NaHCO₃ + HCl ➔ NaCl + H₂O + CO₂↑',
        log: '<b>Efervescencia Termodinámica:</b> Desprendimiento inmediato de burbujas de dióxido de carbono.'
      }
    ]
  },
  evaporation: {
    title: '6. Termodinámica & Evaporación',
    subtitle: 'Ebullición a 100 °C y concentración de masa',
    steps: [
      {
        stepNum: 'Paso 1 de 2 • Aporte Térmico',
        action: 'Haz clic en \'Mechero: OFF\' para encender el calentamiento.',
        why: 'El mechero transferirá calor latente de ebullición alcanzando los 100 °C y evaporando el solvente.',
        requiredType: 'burner',
        requiredValue: true,
        calloutId: 'btnBurner',
        eq: 'H₂O (l) + ΔH ➔ H₂O (g)↑',
        log: '<b>Ebullición Activa:</b> Las moléculas de agua superan la barrera intermolecular y pasan a vapor.'
      },
      {
        stepNum: 'Paso 2 de 2 • Convección',
        action: 'Enciende el \'Agitador\' para evitar sobrecalentamiento local.',
        why: 'La agitación distribuye uniformemente la energía cinética previniendo burbujeos violentos por desequilibrio térmico.',
        requiredType: 'stirrer',
        requiredValue: true,
        calloutId: 'btnStirrer',
        eq: 'Convección forzada homogénea.',
        log: '<b>Equilibrio Térmico:</b> Temperatura y energía molecular balanceada en todo el fluido.'
      }
    ]
  }
};

export const LabTab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeExpKey, setActiveExpKey] = useState<string>('alkali');
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Lab physical state refs to avoid recreation in requestAnimationFrame
  const labRef = useRef({
    temperature: 22.0,
    pH: 7.0,
    volume: 250,
    color: [56, 189, 248, 0.4] as [number, number, number, number],
    targetColor: [56, 189, 248, 0.4] as [number, number, number, number],
    isStirring: false,
    isBurnerOn: false,
    particles: [] as LabParticle[],
    precipitates: [] as PrecipitateParticle[],
    stirAngle: 0
  });

  // UI state for reactive labels
  const [tempDisp, setTempDisp] = useState('22.0');
  const [phDisp, setPhDisp] = useState('7.00');
  const [volDisp, setVolDisp] = useState('250');
  const [isStirring, setIsStirring] = useState(false);
  const [isBurnerOn, setIsBurnerOn] = useState(false);

  const [activeEq, setActiveEq] = useState('H₂O (l) [Solución acuosa base]');
  const [labLog, setLabLog] = useState(
    'El vaso contiene 250 mL de agua pura neutra a 22 °C. Sigue las instrucciones que el tutor resalta en pantalla.'
  );

  const exp = guidedCurriculum[activeExpKey];
  const step = exp.steps[stepIndex] || exp.steps[0];

  const evaluateStep = (actionType?: string, actionVal?: string | boolean) => {
    const curStep = exp.steps[stepIndex];
    let conditionMet = false;

    if (curStep.requiredType === 'burner' && labRef.current.isBurnerOn === curStep.requiredValue) {
      conditionMet = true;
    } else if (curStep.requiredType === 'stirrer' && labRef.current.isStirring === curStep.requiredValue) {
      conditionMet = true;
    } else if (
      actionType === curStep.requiredType &&
      (!curStep.requiredValue || curStep.requiredValue === actionVal)
    ) {
      conditionMet = true;
    }

    if (conditionMet && stepIndex < exp.steps.length - 1) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      playChimeSound();
      setActiveEq(exp.steps[nextIndex].eq);
      setLabLog(exp.steps[nextIndex].log);
    }
  };

  const handleSelectExp = (key: string) => {
    handleReset();
    setActiveExpKey(key);
    setStepIndex(0);
    const newExp = guidedCurriculum[key];
    setActiveEq(newExp.steps[0].eq);
    setLabLog(newExp.steps[0].log);
  };

  const addReagent = (reagent: string) => {
    const lab = labRef.current;
    if (reagent === 'Na') {
      playFizzSound(1.2);
      lab.pH = 13.8;
      lab.targetColor = [248, 113, 113, 0.6];
      lab.temperature += 24;
      for (let i = 0; i < 35; i++) {
        lab.particles.push({
          x: 140 + (Math.random() - 0.5) * 40,
          y: 180 + Math.random() * 60,
          vx: (Math.random() - 0.5) * 2,
          vy: -2 - Math.random() * 2,
          size: 2 + Math.random() * 3,
          alpha: 1,
          type: 'h2'
        });
      }
      setLabLog(
        '<b>Reacción de Sodio:</b> Oxidación enérgica Na ➔ Na⁺ + e⁻. Reducción de protones a gas H₂ inflamable.'
      );
    } else if (reagent === 'Ca') {
      playFizzSound(1.0);
      lab.pH = 11.5;
      lab.targetColor = [251, 146, 60, 0.5];
      lab.temperature += 8;
      setLabLog('<b>Reacción de Calcio:</b> Formación de hidróxido de calcio moderadamente alcalino.');
    } else if (reagent === 'Mg') {
      playFizzSound(0.8);
      lab.pH = 9.2;
      lab.targetColor = [254, 240, 138, 0.4];
      setLabLog('<b>Reacción de Magnesio:</b> Cinética química lenta que se incrementa en caliente.');
    } else if (reagent === 'CuSO4') {
      playChimeSound();
      lab.pH = 5.2;
      lab.targetColor = [2, 132, 199, 0.7];
      setLabLog('<b>Disolución de CuSO₄:</b> Hidratación catiónica formando [Cu(H₂O)₆]²⁺ azul intenso.');
    } else if (reagent === 'KI') {
      playChimeSound();
      lab.pH = 7.1;
      lab.targetColor = [253, 224, 71, 0.5];
      setLabLog('<b>Disolución de KI:</b> Iones potasio e yoduro libres en el disolvente acuoso.');
    } else if (reagent === 'HCl') {
      playChimeSound();
      lab.pH = 1.4;
      lab.targetColor = [239, 68, 68, 0.5];
      setLabLog(
        '<b>Adición de HCl:</b> Ácido fuerte que incrementa exponencialmente los iones hidronio (H₃O⁺).'
      );
    } else if (reagent === 'NaOH') {
      playChimeSound();
      lab.pH = 13.0;
      lab.targetColor = [59, 130, 246, 0.4];
      setLabLog(
        '<b>Adición de NaOH:</b> Aporte de iones hidróxido (OH⁻), neutralizando el ácido o alcalinizando.'
      );
    } else if (reagent === 'NaHCO3') {
      playFizzSound(1.6);
      lab.pH = 8.3;
      lab.targetColor = [203, 213, 225, 0.5];
      for (let i = 0; i < 40; i++) {
        lab.particles.push({
          x: 130 + (Math.random() - 0.5) * 60,
          y: 190 + Math.random() * 50,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -2.2 - Math.random() * 2,
          size: 1.8 + Math.random() * 2.5,
          alpha: 1,
          type: 'co2'
        });
      }
      setLabLog('<b>Descomposición de NaHCO₃:</b> Liberación inmediata de dióxido de carbono (CO₂) gaseoso.');
    }
    evaluateStep('reagent', reagent);
  };

  const addPhenol = () => {
    const lab = labRef.current;
    playChimeSound();
    if (lab.pH >= 8.2) {
      lab.targetColor = [236, 72, 153, 0.75];
      setLabLog('<b>Fenolftaleína:</b> Viraje quinónico a fucsia por desprotonación en medio básico.');
    } else {
      setLabLog('<b>Fenolftaleína:</b> Molécula en estado incoloro neutro o ácido (pH < 8.2).');
    }
    evaluateStep('phenol', 'phenol');
  };

  const toggleStirrer = () => {
    playBurnerClick();
    const lab = labRef.current;
    lab.isStirring = !lab.isStirring;
    setIsStirring(lab.isStirring);

    if (activeExpKey === 'precipitate' && lab.isStirring && lab.precipitates.length === 0) {
      lab.targetColor = [250, 204, 21, 0.7];
      for (let i = 0; i < 45; i++) {
        lab.precipitates.push({
          x: 75 + Math.random() * 170,
          size: 1.5 + Math.random() * 2.5,
          color: '#facc15'
        });
      }
    }
    evaluateStep('stirrer', lab.isStirring);
  };

  const toggleBurner = () => {
    playBurnerClick();
    const lab = labRef.current;
    lab.isBurnerOn = !lab.isBurnerOn;
    setIsBurnerOn(lab.isBurnerOn);
    evaluateStep('burner', lab.isBurnerOn);
  };

  const handleReset = () => {
    playChimeSound();
    const lab = labRef.current;
    lab.temperature = 22.0;
    lab.pH = 7.0;
    lab.volume = 250;
    lab.color = [56, 189, 248, 0.4];
    lab.targetColor = [56, 189, 248, 0.4];
    lab.particles = [];
    lab.precipitates = [];
    lab.isBurnerOn = false;
    lab.isStirring = false;
    setIsBurnerOn(false);
    setIsStirring(false);
    setActiveEq('H₂O (l) [Solución estándar estable]');
    setLabLog(
      'Vaso de precipitados limpio con 250 mL de H₂O a 22 °C. Listo para nuevos experimentos.'
    );
  };

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const lctx = canvas.getContext('2d');
    if (!lctx) return;

    let animId: number;

    const update = () => {
      const lab = labRef.current;

      if (lab.isBurnerOn) {
        if (lab.temperature < 100.0) {
          lab.temperature += 0.3;
        } else {
          if (lab.volume > 80) lab.volume -= 0.04;
          if (Math.random() < 0.6) {
            lab.particles.push({
              x: 100 + Math.random() * 120,
              y: 260,
              vx: (Math.random() - 0.5) * 0.8,
              vy: -2.5 - Math.random() * 1.5,
              size: 2 + Math.random() * 4,
              alpha: 0.8,
              type: 'steam'
            });
          }
        }
      } else {
        if (lab.temperature > 22.0) lab.temperature -= 0.08;
      }

      if (lab.isStirring) lab.stirAngle += 0.25;

      for (let i = 0; i < 4; i++) {
        lab.color[i] += (lab.targetColor[i] - lab.color[i]) * 0.04;
      }

      for (let i = lab.particles.length - 1; i >= 0; i--) {
        const p = lab.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.012;
        if (p.alpha <= 0 || p.y < 60) lab.particles.splice(i, 1);
      }

      // Render
      lctx.clearRect(0, 0, canvas.width, canvas.height);

      const bx = 60,
        by = 60,
        bw = 200,
        bh = 240;

      // Flame
      if (lab.isBurnerOn) {
        const fx = bx + bw / 2;
        const fy = by + bh + 30;
        lctx.save();
        lctx.fillStyle = '#f97316';
        lctx.shadowColor = '#ea580c';
        lctx.shadowBlur = 15;
        lctx.beginPath();
        lctx.ellipse(fx, fy - 10, 14, 24 + Math.random() * 6, 0, 0, Math.PI * 2);
        lctx.fill();

        lctx.fillStyle = '#38bdf8';
        lctx.beginPath();
        lctx.ellipse(fx, fy - 2, 6, 12, 0, 0, Math.PI * 2);
        lctx.fill();
        lctx.restore();
      }

      // Stand
      lctx.fillStyle = '#475569';
      lctx.fillRect(bx + bw / 2 - 25, by + bh + 30, 50, 20);

      // Liquid
      const liquidHeight = (lab.volume / 300) * 160;
      const liquidTop = by + bh - liquidHeight;

      lctx.save();
      lctx.fillStyle = `rgba(${Math.round(lab.color[0])}, ${Math.round(lab.color[1])}, ${Math.round(
        lab.color[2]
      )}, ${lab.color[3]})`;
      lctx.beginPath();
      lctx.roundRect(bx + 4, liquidTop, bw - 8, liquidHeight - 4, [0, 0, 22, 22]);
      lctx.fill();

      // Stirring vortex
      if (lab.isStirring) {
        lctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        lctx.beginPath();
        lctx.ellipse(bx + bw / 2, liquidTop, 24, 8, 0, 0, Math.PI * 2);
        lctx.fill();
      }

      // Precipitates
      lab.precipitates.forEach(pr => {
        lctx.fillStyle = pr.color;
        lctx.beginPath();
        lctx.arc(pr.x, by + bh - 8, pr.size, 0, Math.PI * 2);
        lctx.fill();
      });

      // Magnetic stir bar
      lctx.save();
      lctx.translate(bx + bw / 2, by + bh - 10);
      if (lab.isStirring) lctx.rotate(lab.stirAngle);
      lctx.fillStyle = '#ffffff';
      lctx.strokeStyle = '#94a3b8';
      lctx.lineWidth = 1.5;
      lctx.beginPath();
      lctx.roundRect(-16, -4, 32, 8, 3);
      lctx.fill();
      lctx.stroke();
      lctx.restore();

      lctx.restore();

      // Gas / Steam bubbles
      lab.particles.forEach(p => {
        lctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        lctx.beginPath();
        lctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        lctx.fill();
      });

      // Beaker Glass outline
      lctx.save();
      lctx.strokeStyle = 'rgba(203, 213, 225, 0.85)';
      lctx.lineWidth = 4;
      lctx.beginPath();
      lctx.roundRect(bx, by, bw, bh, [0, 0, 26, 26]);
      lctx.stroke();

      // Graduations
      lctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
      lctx.lineWidth = 2;
      for (let v = 50; v <= 250; v += 50) {
        const markY = by + bh - (v / 300) * 160;
        lctx.beginPath();
        lctx.moveTo(bx + 6, markY);
        lctx.lineTo(bx + 24, markY);
        lctx.stroke();

        lctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        lctx.font = '9px monospace';
        lctx.fillText(`${v}ml`, bx + 28, markY + 3);
      }
      lctx.restore();

      // Update state metrics in UI
      setTempDisp(lab.temperature.toFixed(1));
      setPhDisp(lab.pH.toFixed(2));
      setVolDisp(Math.round(lab.volume).toString());

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const phNum = parseFloat(phDisp);
  const phPercent = Math.min(Math.max((phNum / 14) * 100, 0), 100);

  return (
    <section id="tab-lab" className="block w-full">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[340px_1fr_380px]">
        {/* Column 1: Guided Labs & Reagents */}
        <div className="flex flex-col gap-3.5 rounded-[18px] border border-[#e2e8f0] bg-white p-5 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.05)]">
          <h3 className="text-[1.1rem] font-bold text-[#0f172a]">Prácticas Guiadas</h3>
          <p className="text-[0.8rem] text-[#64748b]">
            Selecciona una práctica. El tutor te indicará exactamente qué botón encender o qué agregar:
          </p>

          <div className="flex flex-col gap-2">
            {Object.entries(guidedCurriculum).map(([key, item]) => {
              const isActive = activeExpKey === key;
              return (
                <div
                  key={key}
                  id={`g-${key}`}
                  className={`cursor-pointer rounded-[10px] border p-[10px_12px] text-left text-[0.85rem] transition-all ${
                    isActive
                      ? 'border-[#0ea5e9] bg-[#f0f9ff]'
                      : 'border-[#e2e8f0] bg-[#f8fafc] hover:border-[#0ea5e9] hover:bg-[#f0f9ff]'
                  }`}
                  onClick={() => handleSelectExp(key)}
                >
                  <b className="mb-0.5 block text-[#0f172a]">{item.title}</b>
                  <span className="text-[0.75rem] text-[#64748b]">{item.subtitle}</span>
                </div>
              );
            })}
          </div>

          <h3 className="mt-1 text-[1rem] font-bold text-[#0f172a]">Reactivos Disponibles</h3>
          <div className="flex flex-wrap gap-1.5">
            <button
              id="btn-reag-Na"
              className={`cursor-pointer rounded-lg border-none px-3.5 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90 ${
                step.calloutId === 'btn-reag-Na' ? 'btn-callout' : ''
              }`}
              style={{ backgroundColor: '#ef4444' }}
              onClick={() => addReagent('Na')}
            >
              + Na
            </button>
            <button
              id="btn-reag-Ca"
              className={`cursor-pointer rounded-lg border-none px-3.5 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90 ${
                step.calloutId === 'btn-reag-Ca' ? 'btn-callout' : ''
              }`}
              style={{ backgroundColor: '#f97316' }}
              onClick={() => addReagent('Ca')}
            >
              + Ca
            </button>
            <button
              id="btn-reag-Mg"
              className={`cursor-pointer rounded-lg border-none px-3.5 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90 ${
                step.calloutId === 'btn-reag-Mg' ? 'btn-callout' : ''
              }`}
              style={{ backgroundColor: '#eab308' }}
              onClick={() => addReagent('Mg')}
            >
              + Mg
            </button>
            <button
              id="btn-reag-CuSO4"
              className={`cursor-pointer rounded-lg border-none px-3.5 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90 ${
                step.calloutId === 'btn-reag-CuSO4' ? 'btn-callout' : ''
              }`}
              style={{ backgroundColor: '#3b82f6' }}
              onClick={() => addReagent('CuSO4')}
            >
              + CuSO₄
            </button>
            <button
              id="btn-reag-KI"
              className={`cursor-pointer rounded-lg border-none px-3.5 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90 ${
                step.calloutId === 'btn-reag-KI' ? 'btn-callout' : ''
              }`}
              style={{ backgroundColor: '#eab308' }}
              onClick={() => addReagent('KI')}
            >
              + KI
            </button>
            <button
              id="btn-reag-HCl"
              className={`cursor-pointer rounded-lg border-none px-3.5 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90 ${
                step.calloutId === 'btn-reag-HCl' ? 'btn-callout' : ''
              }`}
              style={{ backgroundColor: '#10b981' }}
              onClick={() => addReagent('HCl')}
            >
              + HCl (Ácido)
            </button>
            <button
              id="btn-reag-NaOH"
              className={`cursor-pointer rounded-lg border-none px-3.5 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90 ${
                step.calloutId === 'btn-reag-NaOH' ? 'btn-callout' : ''
              }`}
              style={{ backgroundColor: '#059669' }}
              onClick={() => addReagent('NaOH')}
            >
              + NaOH (Base)
            </button>
            <button
              id="btn-reag-NaHCO3"
              className={`cursor-pointer rounded-lg border-none px-3.5 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90 ${
                step.calloutId === 'btn-reag-NaHCO3' ? 'btn-callout' : ''
              }`}
              style={{ backgroundColor: '#8b5cf6' }}
              onClick={() => addReagent('NaHCO3')}
            >
              + NaHCO₃
            </button>
            <button
              id="btn-reag-phenol"
              className={`cursor-pointer rounded-lg border-none px-3.5 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90 ${
                step.calloutId === 'btn-reag-phenol' ? 'btn-callout' : ''
              }`}
              style={{ backgroundColor: '#ec4899' }}
              onClick={addPhenol}
            >
              + Fenolftaleína
            </button>
          </div>
        </div>

        {/* Column 2: Virtual Beaker Stage & Burner Controls */}
        <div className="flex flex-col gap-3.5 rounded-[18px] border border-[#e2e8f0] bg-white p-4 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.05)]">
          <div className="relative flex min-h-[480px] flex-col items-center justify-center rounded-[16px] bg-[#0b1329] p-5">
            {/* Metrics banner */}
            <div className="pointer-events-none absolute left-5 right-5 top-5 flex justify-between gap-2">
              <div className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(15,23,42,0.75)] px-3 py-1.5 text-[0.8rem] font-bold text-white backdrop-blur-[8px]">
                Temp: {tempDisp} °C
              </div>
              <div className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(15,23,42,0.75)] px-3 py-1.5 text-[0.8rem] font-bold text-white backdrop-blur-[8px]">
                pH: {phDisp}
              </div>
              <div className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(15,23,42,0.75)] px-3 py-1.5 text-[0.8rem] font-bold text-white backdrop-blur-[8px]">
                Volumen: {volDisp} mL
              </div>
            </div>

            <canvas ref={canvasRef} width={320} height={380} id="labCanvas" className="h-[380px] w-full max-w-[320px] rounded-xl" />

            <div className="mt-2.5 flex w-full flex-wrap justify-center gap-2.5">
              <button
                id="btnStirrer"
                className={`cursor-pointer rounded-lg border-none px-3.5 py-2 text-[0.85rem] font-bold text-white transition-all ${
                  step.calloutId === 'btnStirrer' ? 'btn-callout' : ''
                }`}
                style={{ backgroundColor: isStirring ? '#22c55e' : '#6366f1' }}
                onClick={toggleStirrer}
              >
                {isStirring ? 'Agitador: ON' : 'Agitador: OFF'}
              </button>
              <button
                id="btnBurner"
                className={`cursor-pointer rounded-lg border-none px-3.5 py-2 text-[0.85rem] font-bold text-white transition-all ${
                  step.calloutId === 'btnBurner' ? 'btn-callout' : ''
                }`}
                style={{ backgroundColor: isBurnerOn ? '#ef4444' : '#f97316' }}
                onClick={toggleBurner}
              >
                {isBurnerOn ? 'Mechero: ON' : 'Mechero: OFF'}
              </button>
              <button
                className="cursor-pointer rounded-lg border-none bg-[#64748b] px-3.5 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90"
                onClick={handleReset}
              >
                Limpiar Vaso
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Active Tutor, pH monitor & Reaction display */}
        <div className="flex flex-col gap-3.5 rounded-[18px] border border-[#e2e8f0] bg-white p-5 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-2 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] p-3.5">
            <div className="text-[0.7rem] font-extrabold uppercase tracking-[0.5px] text-[#1d4ed8]">
              {step.stepNum}
            </div>
            <div className="text-[0.95rem] font-bold text-[#0f172a]">{step.action}</div>
            <div className="text-[0.8rem] leading-[1.4] text-[#334155]">{step.why}</div>
          </div>

          <div>
            <label className="text-[0.75rem] font-bold uppercase text-[#64748b]">Monitor de Escala de pH</label>
            <div className="relative my-1.5 h-2 rounded-[4px] bg-[linear-gradient(to_right,#ef4444,#eab308,#22c55e,#3b82f6,#8b5cf6)]">
              <div
                className="absolute top-[-4px] h-4 w-1 -translate-x-1/2 rounded-[2px] bg-white shadow-[0_0_4px_black] transition-[left] duration-400 ease-out"
                id="phNeedle"
                style={{ left: `${phPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[0.7rem] font-bold text-[#64748b]">
              <span>0 Ácido</span>
              <span>7 Neutro</span>
              <span>14 Básico</span>
            </div>
          </div>

          <div>
            <label className="text-[0.75rem] font-bold uppercase text-[#64748b]">Ecuación Química en Curso</label>
            <div
              className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-2.5 text-[0.85rem] font-bold text-[#0369a1]"
              id="activeEqDisplay"
            >
              {activeEq}
            </div>
          </div>

          <div>
            <label className="text-[0.75rem] font-bold uppercase text-[#64748b]">
              Explicación Científica del Fenómeno
            </label>
            <div
              className="min-h-[100px] rounded-[10px] border border-dashed border-[#e2e8f0] bg-[#f8fafc] p-3 font-mono text-[0.8rem] leading-[1.4] text-[#334155]"
              id="labLogText"
              dangerouslySetInnerHTML={{ __html: labLog }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
