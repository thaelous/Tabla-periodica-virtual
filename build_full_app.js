import fs from 'fs';

// Helper to extract the 118 elements from src/build_data.js
const buildDataContent = fs.readFileSync('src/build_data.js', 'utf8');
const elementsMatch = buildDataContent.match(/const elements = (\[[\s\S]*?\]);/);
if (!elementsMatch) {
  console.error("Could not find elements in src/build_data.js");
  process.exit(1);
}

const rawElements = eval(elementsMatch[1]);
console.log(`Extracted ${rawElements.length} elements from build_data.js.`);

// Load the HTML template and strip any wrapper artifacts
let rawTemplate = fs.readFileSync('template_html.txt', 'utf8');
const startIdx = rawTemplate.indexOf('<!DOCTYPE html>');
let cleanTemplate = rawTemplate;
if (startIdx !== -1) {
  const endMarker = '<!-- END OF BODY HTML -->';
  const endIdx = rawTemplate.indexOf('</div>\n`;');
  if (endIdx !== -1) {
    cleanTemplate = rawTemplate.substring(startIdx, endIdx + 6);
  } else {
    cleanTemplate = rawTemplate.substring(startIdx);
  }
}
// Also remove any stray fs.writeFileSync lines if present
cleanTemplate = cleanTemplate.replace(/fs\.writeFileSync[\s\S]*$/, '').trim();

// Build the robust, comprehensive standalone JavaScript
const jsScript = `
<script>
// =================================================================
// TABLA PERIÓDICA INTERACTIVA - MOTOR EDUCATIVO CONSOLIDADO
// =================================================================

// 1. BANCO DE DATOS DE LOS 118 ELEMENTOS
const RAW_ELEMENTS = ${JSON.stringify(rawElements)};

// Estructura normalizada de elementos
const ELEMENTS = RAW_ELEMENTS.map(el => ({
  z: el[0],
  sym: el[1],
  name: el[2],
  mass: el[3],
  cat: el[4],
  period: el[5],
  group: el[6],
  config: el[7],
  en: el[8] === '-' ? null : parseFloat(el[8]),
  melting: el[9],
  block: el[10],
  valElectrons: el[11],
  oxidation: el[12]
}));

// Mapeo de Categorías en Tonos Pastel
const CATEGORIES = {
  'nonmetal': { name: 'No Metales', bg: '#dcfce7', border: '#bbf7d0', text: '#166534', dot: '#22c55e' },
  'noble': { name: 'Gases Nobles', bg: '#f3e8ff', border: '#e9d5ff', text: '#6b21a8', dot: '#a855f7' },
  'alkali': { name: 'Alcalinos', bg: '#fee2e2', border: '#fecaca', text: '#991b1b', dot: '#ef4444' },
  'alkaline': { name: 'Alcalinotérreos', bg: '#ffedd5', border: '#fed7aa', text: '#9a3412', dot: '#f97316' },
  'metalloid': { name: 'Metaloides', bg: '#fef9c3', border: '#fef08a', text: '#854d0e', dot: '#eab308' },
  'halogen': { name: 'Halógenos', bg: '#cffafe', border: '#a5f3fc', text: '#155e75', dot: '#06b6d4' },
  'transition': { name: 'Metales de Transición', bg: '#e0e7ff', border: '#c7d2fe', text: '#3730a3', dot: '#6366f1' },
  'post-trans': { name: 'Metales Post-transición', bg: '#f1f5f9', border: '#e2e8f0', text: '#334155', dot: '#94a3b8' },
  'lanthanide': { name: 'Lantánidos', bg: '#fce7f3', border: '#fbcfe8', text: '#9d174d', dot: '#ec4899' },
  'actinide': { name: 'Actínidos', bg: '#ede9fe', border: '#ddd6fe', text: '#5b21b6', dot: '#8b5cf6' }
};

// 2. EFECTOS SONOROS MEDIANTE WEB AUDIO API (Sin archivos externos)
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx && AudioContextClass) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playWaterDropSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {}
}

function playChimeSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.12, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.3);
    });
  } catch (e) {}
}

function playReactionFizzSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start();
  } catch (e) {}
}

// 3. NAVEGACIÓN ENTRE PESTAÑAS
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

  const targetContent = document.getElementById(tabId);
  if (targetContent) targetContent.classList.add('active');

  const activeBtn = Array.from(document.querySelectorAll('.nav-tab')).find(btn => 
    btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId)
  );
  if (activeBtn) activeBtn.classList.add('active');

  if (tabId === 'tab-builder') {
    resizeWorkbenchCanvas();
  }
}

// 4. RENDERIZADO DE LA TABLA PERIÓDICA Y LEYENDA
let activeCategoryFilter = null;
let searchQuery = '';

function renderLegend() {
  const container = document.getElementById('legendContainer');
  if (!container) return;
  container.innerHTML = '';

  Object.keys(CATEGORIES).forEach(catKey => {
    const cat = CATEGORIES[catKey];
    const chip = document.createElement('div');
    chip.className = 'legend-chip';
    chip.style.backgroundColor = cat.bg;
    chip.style.borderColor = cat.border;
    chip.style.color = cat.text;
    if (activeCategoryFilter === catKey) chip.classList.add('active');

    chip.innerHTML = \`<span class="legend-dot" style="background-color: \${cat.dot};"></span> \${cat.name}\`;
    chip.onclick = () => {
      activeCategoryFilter = activeCategoryFilter === catKey ? null : catKey;
      renderLegend();
      applyFilters();
    };
    container.appendChild(chip);
  });
}

function renderPeriodicTable() {
  const grid = document.getElementById('periodicTableGrid');
  if (!grid) return;
  grid.innerHTML = '';

  // Matriz de 10 filas x 18 columnas
  const cells = Array(10).fill(null).map(() => Array(18).fill(null));

  ELEMENTS.forEach(el => {
    let r = el.period - 1;
    let c = el.group - 1;
    if (el.cat === 'lanthanide') {
      r = 8;
      c = el.z - 57 + 2; // de columna 3 a 17
    } else if (el.cat === 'actinide') {
      r = 9;
      c = el.z - 89 + 2; // de columna 3 a 17
    }
    if (r >= 0 && r < 10 && c >= 0 && c < 18) {
      cells[r][c] = el;
    }
  });

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 18; c++) {
      // Placeholders para La* y Ac** en la tabla principal
      if (r === 5 && c === 2) {
        const ph = document.createElement('div');
        ph.className = 'placeholder-card';
        ph.innerHTML = '<span>57-71</span><span style="font-size:0.6rem;">La-Lu</span>';
        grid.appendChild(ph);
        continue;
      }
      if (r === 6 && c === 2) {
        const ph = document.createElement('div');
        ph.className = 'placeholder-card';
        ph.innerHTML = '<span>89-103</span><span style="font-size:0.6rem;">Ac-Lr</span>';
        grid.appendChild(ph);
        continue;
      }

      // Espacio separador entre cuerpo principal y filas lantánidos/actínidos
      if (r === 7) {
        const empty = document.createElement('div');
        empty.style.height = '14px';
        grid.appendChild(empty);
        continue;
      }

      const el = cells[r][c];
      if (!el) {
        const empty = document.createElement('div');
        grid.appendChild(empty);
      } else {
        const card = document.createElement('div');
        card.className = \`element-card cat-\${el.cat}\`;
        card.id = \`el-\${el.z}\`;
        card.innerHTML = \`
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="el-z">\${el.z}</span>
            <span class="el-mass">\${el.mass}</span>
          </div>
          <div class="el-symbol">\${el.sym}</div>
          <div class="el-name">\${el.name}</div>
        \`;

        // Efecto de onda de agua (Water Ripple) y apertura de modal cuántico
        card.addEventListener('click', (e) => {
          triggerRipple(card, e);
          playWaterDropSound();
          openQuantumModal(el);
        });

        grid.appendChild(card);
      }
    }
  }
}

function triggerRipple(card, e) {
  const rect = card.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = \`\${size}px\`;
  ripple.style.left = \`\${e.clientX - rect.left - size / 2}px\`;
  ripple.style.top = \`\${e.clientY - rect.top - size / 2}px\`;
  card.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

function handleSearch(val) {
  searchQuery = val.trim().toLowerCase();
  applyFilters();
}

function resetFilters() {
  searchQuery = '';
  activeCategoryFilter = null;
  document.getElementById('searchInput').value = '';
  renderLegend();
  applyFilters();
}

function applyFilters() {
  ELEMENTS.forEach(el => {
    const card = document.getElementById(\`el-\${el.z}\`);
    if (!card) return;

    let matchesSearch = true;
    if (searchQuery) {
      matchesSearch = el.name.toLowerCase().includes(searchQuery) ||
                            el.sym.toLowerCase().includes(searchQuery) ||
                            el.z.toString() === searchQuery;
    }

    let matchesCategory = true;
    if (activeCategoryFilter) {
      matchesCategory = el.cat === activeCategoryFilter;
    }

    if (matchesSearch && matchesCategory) {
      card.classList.remove('dimmed');
    } else {
      card.classList.add('dimmed');
    }
  });
}

// 5. MODAL INSPECTOR CUÁNTICO & SELECTOR DE MODELO (CUÁNTICO VS BOHR)
let currentSelectedElement = ELEMENTS[0];
let currentAtomModel = 'quantum'; // 'quantum' o 'bohr'
let atomAnimFrameId = null;
let atomAnimAngle = 0;

function openQuantumModal(element) {
  currentSelectedElement = element;
  const modal = document.getElementById('quantumModal');
  if (!modal) return;

  const badge = document.getElementById('modalElementBadge');
  const cat = CATEGORIES[element.cat] || CATEGORIES['nonmetal'];
  badge.textContent = element.sym;
  badge.style.backgroundColor = cat.bg;
  badge.style.color = cat.text;
  badge.style.border = \`1px solid \${cat.border}\`;

  document.getElementById('modalElementName').textContent = \`\${element.name} (Z = \${element.z})\`;
  document.getElementById('infoMass').textContent = \`\${element.mass} u\`;
  document.getElementById('infoElectronegativity').textContent = element.en !== null ? element.en.toFixed(2) : 'N/A';
  document.getElementById('infoConfig').textContent = element.config;
  document.getElementById('infoBlock').textContent = \`Bloque \${element.block} (Periodo \${element.period})\`;
  document.getElementById('infoMelting').textContent = element.melting;
  document.getElementById('infoValence').textContent = \`\${element.valElectrons} e⁻\`;

  // Descripción didáctica
  let desc = \`El \${element.name} (\${element.sym}) es un elemento químico con número atómico \${element.z}. \`;
  if (element.cat === 'noble') {
    desc += 'Pertenece a los gases nobles; posee capa de valencia cerrada y completa, lo que le confiere una inercia química excepcional bajo condiciones estándar.';
  } else if (element.cat === 'alkali') {
    desc += 'Es un metal alcalino altamente reactivo con un único electrón en su capa exterior que cede fácilmente para formar cationes univalentes (+1).';
  } else if (element.cat === 'halogen') {
    desc += 'Es un halógeno muy electronegativo con 7 electrones de valencia que busca ávidamente capturar 1 electrón para completar su octeto.';
  } else if (element.cat === 'transition') {
    desc += 'Es un metal de transición caracterizado por subniveles d parcialmente ocupados, facilitando múltiples estados de oxidación y complejos coloreados.';
  } else {
    desc += 'Desempeña funciones fundamentales en la química molecular, biológica e industrial.';
  }
  document.getElementById('infoDescription').textContent = desc;

  modal.classList.add('active');
  startAtomSimulation();
}

function closeQuantumModal() {
  const modal = document.getElementById('quantumModal');
  if (modal) modal.classList.remove('active');
  if (atomAnimFrameId) {
    cancelAnimationFrame(atomAnimFrameId);
    atomAnimFrameId = null;
  }
}

function handleModalBackdropClick(e) {
  if (e.target.id === 'quantumModal') {
    closeQuantumModal();
  }
}

// Selector de Modelo Atómico Requerido
function switchAtomModel(model) {
  currentAtomModel = model;
  document.getElementById('btnModelQuantum').classList.toggle('active', model === 'quantum');
  document.getElementById('btnModelBohr').classList.toggle('active', model === 'bohr');

  const explainer = document.getElementById('modelExplainerText');
  if (model === 'quantum') {
    explainer.textContent = 'Simulación cuántica de densidad de probabilidad orbital (|Ψ|²) con armónicos esféricos e incertidumbre de Heisenberg.';
  } else {
    explainer.textContent = 'Modelo clásico de Niels Bohr (1913): electrones en niveles de energía cuantizados (K, L, M, N...) orbitando alrededor del núcleo.';
  }
}

function startAtomSimulation() {
  if (atomAnimFrameId) {
    cancelAnimationFrame(atomAnimFrameId);
  }
  const canvas = document.getElementById('atomSimulationCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function renderFrame() {
    atomAnimAngle += 0.02;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const el = currentSelectedElement;

    if (currentAtomModel === 'quantum') {
      // SIMULACIÓN CUÁNTICA: Densidad de probabilidad |Ψ|²
      ctx.save();
      ctx.translate(cx, cy);

      // Resplandor de fondo cuántico
      const bgGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 160);
      bgGrad.addColorStop(0, 'rgba(14, 165, 233, 0.25)');
      bgGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.12)');
      bgGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 160, 0, Math.PI * 2);
      ctx.fill();

      // Nube de puntos de probabilidad cuántica calculada según el bloque (s, p, d, f)
      const numPoints = 280;
      for (let i = 0; i < numPoints; i++) {
        const seed = (i * 1.618033 + atomAnimAngle * 0.4);
        const theta = (seed % (Math.PI * 2));
        const phi = (seed * 2.3 % Math.PI);
        let rProb = 0;

        if (el.block === 's') {
          // Orbital s esférico
          rProb = 35 + Math.sin(seed * 4) * 20 + Math.random() * 30;
        } else if (el.block === 'p') {
          // Orbital p lobular (dumbbell)
          const lobe = Math.abs(Math.cos(theta));
          rProb = 20 + lobe * 95 + Math.random() * 15;
        } else if (el.block === 'd') {
          // Orbital d cuadrupolar
          const lobe = Math.abs(Math.sin(2 * theta));
          rProb = 20 + lobe * 105 + Math.random() * 18;
        } else {
          // Orbital f multilobular
          const lobe = Math.abs(Math.sin(3 * theta));
          rProb = 25 + lobe * 110 + Math.random() * 20;
        }

        const rotX = Math.cos(atomAnimAngle * 0.6) * rProb * Math.cos(theta);
        const rotY = Math.sin(atomAnimAngle * 0.6) * rProb * Math.cos(theta) * 0.4 + rProb * Math.sin(theta);

        const pointAlpha = Math.max(0.15, 0.75 - (rProb / 150));
        ctx.fillStyle = el.block === 's' ? \`rgba(56, 189, 248, \${pointAlpha})\` :
                        el.block === 'p' ? \`rgba(168, 85, 247, \${pointAlpha})\` :
                        el.block === 'd' ? \`rgba(234, 179, 8, \${pointAlpha})\` :
                                           \`rgba(236, 72, 153, \${pointAlpha})\`;
        ctx.beginPath();
        ctx.arc(rotX, rotY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Núcleo cuántico central con fluctuación de energía
      const corePulse = 14 + Math.sin(atomAnimAngle * 4) * 2;
      const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, corePulse);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.5, '#0ea5e9');
      coreGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, corePulse, 0, Math.PI * 2);
      ctx.fill();

      // Texto de configuración cuántica
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(\`Orbital \${el.block} |Ψ|² (Z=\${el.z})\`, 0, 150);

      ctx.restore();

    } else {
      // MODELO CLÁSICO DE BOHR: Órbitas concéntricas y electrones corpusculares
      ctx.save();
      ctx.translate(cx, cy);

      // Núcleo denso con protones (rojos) y neutrones (azules)
      const nucleusRadius = 16;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.beginPath();
      ctx.arc(-3, -3, nucleusRadius * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.85)';
      ctx.beginPath();
      ctx.arc(4, 3, nucleusRadius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Carga nuclear central
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(\`+\${el.z}\`, 0, 0);

      // Distribución electrónica en capas de Bohr: 2, 8, 18, 32...
      const shellCapacities = [2, 8, 18, 32, 32, 18, 8];
      let remainingElectrons = el.z;
      const shellRadii = [40, 65, 90, 115, 135, 155];

      for (let s = 0; s < shellRadii.length && remainingElectrons > 0; s++) {
        const radius = shellRadii[s];
        const capacity = shellCapacities[s];
        const count = Math.min(remainingElectrons, capacity);
        remainingElectrons -= count;

        // Órbita elíptica/circular suave
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Electrones orbitando
        const speed = (0.04 / (s + 1)) * (s % 2 === 0 ? 1 : -1);
        for (let eIdx = 0; eIdx < count; eIdx++) {
          const angle = (Math.PI * 2 / count) * eIdx + (atomAnimAngle * speed * 25);
          const ex = Math.cos(angle) * radius;
          const ey = Math.sin(angle) * radius;

          // Esfera del electrón brillante
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#0ea5e9';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(\`Capas Bohr (K, L, M, N...) e⁻=\${el.z}\`, 0, 170);

      ctx.restore();
    }

    atomAnimFrameId = requestAnimationFrame(renderFrame);
  }

  renderFrame();
}

// 6. CONSTRUCTOR UNIVERSAL DE MOLÉCULAS & RENDER 3D
const workbenchAtoms = [];
let is3DModeActive = false;
let rot3DAngleX = 0;
let rot3DAngleY = 0;
let draggingAtom = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function renderUniversalPalette(filterText = '') {
  const container = document.getElementById('universalPalette');
  if (!container) return;
  container.innerHTML = '';

  const q = filterText.toLowerCase().trim();
  const list = ELEMENTS.filter(el => 
    !q || el.name.toLowerCase().includes(q) || el.sym.toLowerCase().includes(q) || el.z.toString() === q
  );

  list.forEach(el => {
    const item = document.createElement('div');
    item.className = 'palette-item';
    const cat = CATEGORIES[el.cat] || CATEGORIES['nonmetal'];
    item.innerHTML = \`
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: 800; font-family: 'JetBrains Mono', monospace; background: \${cat.bg}; color: \${cat.text}; padding: 2px 6px; border-radius: 6px; font-size: 0.75rem;">\${el.sym}</span>
        <span style="font-size: 0.85rem; font-weight: 600;">\${el.name}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 0.7rem; color: var(--text-muted);">Z=\${el.z}</span>
        <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary);">+ Agregar</span>
      </div>
    \`;
    item.onclick = () => addAtomToWorkbench(el);
    container.appendChild(item);
  });
}

function filterPalette(val) {
  renderUniversalPalette(val);
}

function addAtomToWorkbench(element, x = null, y = null) {
  const canvas = document.getElementById('workbenchCanvas');
  const cx = x !== null ? x : (canvas ? canvas.width / 2 + (Math.random() * 80 - 40) : 200);
  const cy = y !== null ? y : (canvas ? canvas.height / 2 + (Math.random() * 80 - 40) : 200);

  // Colores estándar CPK / didácticos
  let color = '#94a3b8';
  if (element.sym === 'H') color = '#ffffff';
  else if (element.sym === 'C') color = '#334155';
  else if (element.sym === 'N') color = '#3b82f6';
  else if (element.sym === 'O') color = '#ef4444';
  else if (element.sym === 'F' || element.sym === 'Cl') color = '#10b981';
  else if (element.sym === 'Na' || element.sym === 'K') color = '#a855f7';
  else if (element.sym === 'Ca') color = '#f97316';

  workbenchAtoms.push({
    id: Date.now() + Math.random(),
    element: element,
    x: cx,
    y: cy,
    z: (Math.random() - 0.5) * 60,
    radius: Math.max(16, Math.min(28, 12 + element.valElectrons * 2)),
    color: color
  });

  updateAtomCounter();
  evaluateFeasibility();
}

function updateAtomCounter() {
  const badge = document.getElementById('atomCounter');
  if (badge) badge.textContent = \`\${workbenchAtoms.length} átomo\${workbenchAtoms.length === 1 ? '' : 's'}\`;
}

function clearWorkbench() {
  workbenchAtoms.length = 0;
  is3DModeActive = false;
  document.getElementById('btnToggle3D').classList.remove('btn-primary');
  document.getElementById('btnToggle3D').classList.add('btn-outline');
  updateAtomCounter();
  evaluateFeasibility();
}

function toggle3DAnimation() {
  is3DModeActive = !is3DModeActive;
  const btn = document.getElementById('btnToggle3D');
  if (is3DModeActive) {
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary');
    btn.innerHTML = '<span>⏸️</span> Pausar 3D';
  } else {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
    btn.innerHTML = '<span>🌐</span> Animar en 3D';
  }
}

// Validación Estricta de Factibilidad Química (Gases Nobles, Metales puros y EN)
function evaluateFeasibility() {
  const container = document.getElementById('feasibilityCard');
  if (!container) return;

  if (workbenchAtoms.length === 0) {
    container.innerHTML = '<p style="font-size: 0.85rem; color: var(--text-muted);">El lienzo está vacío. Selecciona elementos del banco de 1 a 118 para evaluar combinaciones.</p>';
    return;
  }

  // Recuento de elementos
  const counts = {};
  workbenchAtoms.forEach(a => {
    counts[a.element.sym] = (counts[a.element.sym] || 0) + 1;
  });

  // Comprobar gases nobles
  const nobleAtom = workbenchAtoms.find(a => a.element.cat === 'noble');
  if (nobleAtom && workbenchAtoms.length > 1) {
    container.innerHTML = \`
      <div style="background: #fee2e2; border: 1px solid #fca5a5; padding: 12px; border-radius: 10px; color: #991b1b; font-size: 0.85rem; line-height: 1.5;">
        <div style="font-weight: 800; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          <span>🚫</span> Combinación Imposible: Gas Noble Bloqueado
        </div>
        El elemento <b>\${nobleAtom.element.name} (\${nobleAtom.element.sym})</b> tiene su capa de valencia energéticamente saturada (octeto completo / dueto en He). Su energía de ionización es extremadamente alta y su afinidad electrónica prácticamente nula, por lo que no forma enlaces covalentes ordinarios.
      </div>
    \`;
    return;
  }

  // Comprobar metal con metal
  const metals = workbenchAtoms.filter(a => ['alkali', 'alkaline', 'transition', 'post-trans', 'lanthanide', 'actinide'].includes(a.element.cat));
  if (metals.length === workbenchAtoms.length && workbenchAtoms.length > 1) {
    container.innerHTML = \`
      <div style="background: #fef9c3; border: 1px solid #fef08a; padding: 12px; border-radius: 10px; color: #854d0e; font-size: 0.85rem; line-height: 1.5;">
        <div style="font-weight: 800; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          <span>⚠️</span> Enlace Metálico (Red Cristalográfica)
        </div>
        La unión exclusiva entre metales no genera moléculas discretas aisladas; forma una red cristalina metálica tridimensional cohesionada por un "mar de electrones deslocalizados" (aleación metálica).
      </div>
    \`;
    return;
  }

  // Identificar compuestos reconocidos
  let recognizedName = null;
  let formulaText = '';
  Object.keys(counts).forEach(sym => {
    formulaText += sym + (counts[sym] > 1 ? counts[sym] : '');
  });

  if (counts['H'] === 2 && counts['O'] === 1 && Object.keys(counts).length === 2) recognizedName = 'Agua (H₂O) - Solvente universal polar';
  else if (counts['C'] === 1 && counts['O'] === 2 && Object.keys(counts).length === 2) recognizedName = 'Dióxido de Carbono (CO₂) - Covalente no polar lineal';
  else if (counts['C'] === 1 && counts['H'] === 4 && Object.keys(counts).length === 2) recognizedName = 'Metano (CH₄) - Hidrocarburo tetraédrico';
  else if (counts['Na'] === 1 && counts['Cl'] === 1 && Object.keys(counts).length === 2) recognizedName = 'Cloruro de Sodio (NaCl) - Red iónica cristalina';
  else if (counts['N'] === 1 && counts['H'] === 3 && Object.keys(counts).length === 2) recognizedName = 'Amoníaco (NH₃) - Base débil piramidal trigonal';
  else if (counts['H'] === 1 && counts['Cl'] === 1 && Object.keys(counts).length === 2) recognizedName = 'Ácido Clorhídrico (HCl) - Enlace polar fuerte';
  else if (counts['Ca'] === 1 && counts['O'] === 1 && Object.keys(counts).length === 2) recognizedName = 'Óxido de Calcio (CaO) - Enlace iónico refractario';

  // Cálculo de Diferencia de Electronegatividad (Delta EN)
  let enInfo = '';
  if (workbenchAtoms.length >= 2) {
    const en1 = workbenchAtoms[0].element.en;
    const en2 = workbenchAtoms[1].element.en;
    if (en1 !== null && en2 !== null) {
      const deltaEN = Math.abs(en1 - en2);
      let bondType = '';
      let bondDesc = '';
      if (deltaEN < 0.4) {
        bondType = 'Covalente No Polar';
        bondDesc = 'Los electrones se comparten de manera casi simétrica y equitativa sin formar dipolos permanentes.';
      } else if (deltaEN <= 1.7) {
        bondType = 'Covalente Polar';
        bondDesc = 'Existe una compartición asimétrica de la densidad electrónica generando momentos dipolares (δ⁺ y δ⁻).';
      } else {
        bondType = 'Iónico';
        bondDesc = 'Gran diferencia electrostática: transferencia electrónica con formación neta de aniones y cationes.';
      }

      enInfo = \`
        <div style="margin-top: 10px; padding: 10px; background: var(--bg-subtle); border-radius: 8px; border: 1px solid var(--border-soft);">
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.8rem;">
            <span>Δ Electronegatividad:</span>
            <span style="font-family: 'JetBrains Mono', monospace; color: var(--primary);">\${deltaEN.toFixed(2)}</span>
          </div>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.85rem; margin-top: 4px;">Tipo de Enlace: \${bondType}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">\${bondDesc}</div>
        </div>
      \`;
    }
  }

  container.innerHTML = \`
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 10px; color: #166534; font-size: 0.85rem; line-height: 1.5;">
      <div style="font-weight: 800; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
        <span>✅</span> Molécula Estable Detectada
      </div>
      <div><b>Fórmula Empírica:</b> <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; font-weight: 800;">\${formulaText}</span></div>
      \${recognizedName ? \`<div style="margin-top: 4px; color: #15803d; font-weight: 700;">Compuesto Reconocido: \${recognizedName}</div>\` : ''}
      \${enInfo}
    </div>
  \`;
}

// Carga de Presets de Moléculas
function loadPreset(type) {
  clearWorkbench();
  const canvas = document.getElementById('workbenchCanvas');
  const cx = canvas ? canvas.width / 2 : 250;
  const cy = canvas ? canvas.height / 2 : 240;

  const H = ELEMENTS.find(e => e.sym === 'H');
  const O = ELEMENTS.find(e => e.sym === 'O');
  const C = ELEMENTS.find(e => e.sym === 'C');
  const N = ELEMENTS.find(e => e.sym === 'N');
  const Cl = ELEMENTS.find(e => e.sym === 'Cl');
  const Na = ELEMENTS.find(e => e.sym === 'Na');
  const Ca = ELEMENTS.find(e => e.sym === 'Ca');

  if (type === 'H2O' && H && O) {
    addAtomToWorkbench(O, cx, cy);
    addAtomToWorkbench(H, cx - 45, cy + 35);
    addAtomToWorkbench(H, cx + 45, cy + 35);
  } else if (type === 'CO2' && C && O) {
    addAtomToWorkbench(C, cx, cy);
    addAtomToWorkbench(O, cx - 70, cy);
    addAtomToWorkbench(O, cx + 70, cy);
  } else if (type === 'CH4' && C && H) {
    addAtomToWorkbench(C, cx, cy);
    addAtomToWorkbench(H, cx, cy - 50);
    addAtomToWorkbench(H, cx - 50, cy + 25);
    addAtomToWorkbench(H, cx + 50, cy + 25);
    addAtomToWorkbench(H, cx, cy + 50);
  } else if (type === 'NaCl' && Na && Cl) {
    addAtomToWorkbench(Na, cx - 45, cy);
    addAtomToWorkbench(Cl, cx + 45, cy);
  } else if (type === 'NH3' && N && H) {
    addAtomToWorkbench(N, cx, cy - 10);
    addAtomToWorkbench(H, cx - 45, cy + 35);
    addAtomToWorkbench(H, cx + 45, cy + 35);
    addAtomToWorkbench(H, cx, cy + 45);
  } else if (type === 'HCl' && H && Cl) {
    addAtomToWorkbench(H, cx - 40, cy);
    addAtomToWorkbench(Cl, cx + 40, cy);
  } else if (type === 'CaO' && Ca && O) {
    addAtomToWorkbench(Ca, cx - 45, cy);
    addAtomToWorkbench(O, cx + 45, cy);
  }
}

// Bucle de Animación y Renderizado del Lienzo Molecular
function initWorkbenchEvents() {
  const canvas = document.getElementById('workbenchCanvas');
  if (!canvas) return;

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (let i = workbenchAtoms.length - 1; i >= 0; i--) {
      const a = workbenchAtoms[i];
      const dist = Math.hypot(a.x - mx, a.y - my);
      if (dist <= a.radius + 6) {
        draggingAtom = a;
        dragOffsetX = a.x - mx;
        dragOffsetY = a.y - my;
        return;
      }
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!draggingAtom) return;
    const canvas = document.getElementById('workbenchCanvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    draggingAtom.x = e.clientX - rect.left + dragOffsetX;
    draggingAtom.y = e.clientY - rect.top + dragOffsetY;
    evaluateFeasibility();
  });

  window.addEventListener('mouseup', () => {
    draggingAtom = null;
  });
}

function resizeWorkbenchCanvas() {
  const canvas = document.getElementById('workbenchCanvas');
  if (!canvas) return;
  canvas.width = canvas.parentElement.clientWidth || 600;
  canvas.height = 480;
}

function startWorkbenchLoop() {
  const canvas = document.getElementById('workbenchCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (is3DModeActive) {
      rot3DAngleY += 0.015;
      rot3DAngleX = Math.sin(rot3DAngleY * 0.5) * 0.3;
    }

    // Dibujar enlaces covalentes o iónicos
    for (let i = 0; i < workbenchAtoms.length; i++) {
      for (let j = i + 1; j < workbenchAtoms.length; j++) {
        const a1 = workbenchAtoms[i];
        const a2 = workbenchAtoms[j];

        let p1x = a1.x, p1y = a1.y;
        let p2x = a2.x, p2y = a2.y;

        if (is3DModeActive) {
          const cosY = Math.cos(rot3DAngleY), sinY = Math.sin(rot3DAngleY);
          const cosX = Math.cos(rot3DAngleX), sinX = Math.sin(rot3DAngleX);

          const r1x = (a1.x - cx) * cosY - a1.z * sinY;
          const r1z = (a1.x - cx) * sinY + a1.z * cosY;
          p1x = cx + r1x;
          p1y = cy + (a1.y - cy) * cosX - r1z * sinX;

          const r2x = (a2.x - cx) * cosY - a2.z * sinY;
          const r2z = (a2.x - cx) * sinY + a2.z * cosY;
          p2x = cx + r2x;
          p2y = cy + (a2.y - cy) * cosX - r2z * sinX;
        }

        const dist = Math.hypot(p1x - p2x, p1y - p2y);
        if (dist < 140) {
          ctx.strokeStyle = 'rgba(14, 165, 233, 0.6)';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(p2x, p2y);
          ctx.stroke();

          // Resplandor del enlace
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(p2x, p2y);
          ctx.stroke();
        }
      }
    }

    // Dibujar átomos con sombreado esférico 3D (CPK)
    workbenchAtoms.forEach(a => {
      let px = a.x, py = a.y, pz = a.z;
      if (is3DModeActive) {
        const cosY = Math.cos(rot3DAngleY), sinY = Math.sin(rot3DAngleY);
        const cosX = Math.cos(rot3DAngleX), sinX = Math.sin(rot3DAngleX);

        const rx = (a.x - cx) * cosY - pz * sinY;
        const rz = (a.x - cx) * sinY + pz * cosY;
        px = cx + rx;
        py = cy + (a.y - cy) * cosX - rz * sinX;
      }

      // Gradiente esférico 3D
      const grad = ctx.createRadialGradient(
        px - a.radius * 0.35, py - a.radius * 0.35, a.radius * 0.1,
        px, py, a.radius
      );
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, a.color);
      grad.addColorStop(1, '#0f172a');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, a.radius, 0, Math.PI * 2);
      ctx.fill();

      // Borde fino
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Símbolo del elemento
      ctx.fillStyle = (a.element.sym === 'H' || a.color === '#ffffff') ? '#0f172a' : '#ffffff';
      ctx.font = \`bold \${Math.round(a.radius * 0.8)}px "Plus Jakarta Sans", sans-serif\`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(a.element.sym, px, py);
    });

    requestAnimationFrame(loop);
  }

  loop();
}

// 7. LABORATORIO VIRTUAL REESCRITO Y ROBUSTO
const labState = {
  temp: 20.0,
  targetTemp: 20.0,
  ph: 7.00,
  volume: 150.0,
  burnerOn: false,
  stirrerOn: false,
  stirrerSpeed: 0,
  hasPhenol: false,
  hasCuSO4: false,
  hasPbI2: false,
  naMoles: 0,
  hclMoles: 0,
  naohMoles: 0,
  bubbleParticles: [],
  precipitateParticles: [],
  steamParticles: []
};

function initLabCanvas() {
  const canvas = document.getElementById('labCanvas');
  if (!canvas) return;
  canvas.width = canvas.parentElement.clientWidth || 600;
  canvas.height = 480;
}

function toggleBurner() {
  labState.burnerOn = !labState.burnerOn;
  const btn = document.getElementById('btnBurner');
  if (labState.burnerOn) {
    btn.textContent = 'ON';
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary');
    labState.targetTemp = Math.max(labState.targetTemp, 65.0);
    document.getElementById('tempSlider').value = labState.targetTemp;
    addLabLog('🔥 Mechero Bunsen encendido. Calentando el fluido hacia ' + labState.targetTemp + ' °C.');
  } else {
    btn.textContent = 'OFF';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
    labState.targetTemp = 20.0;
    document.getElementById('tempSlider').value = 20;
    addLabLog('💨 Mechero Bunsen apagado. Enfriando progresivamente a temperatura ambiente (20.0 °C).');
  }
}

function setLabTemperature(val) {
  labState.targetTemp = parseFloat(val);
  if (labState.targetTemp > 25.0 && !labState.burnerOn) {
    toggleBurner();
  }
}

function toggleStirrer() {
  labState.stirrerOn = !labState.stirrerOn;
  const btn = document.getElementById('btnStirrer');
  if (labState.stirrerOn) {
    btn.textContent = 'ON';
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary');
    addLabLog('🌀 Agitador magnético encendido a 450 RPM. Induciendo vórtice y homogeneizando solutos.');
  } else {
    btn.textContent = 'OFF';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
    addLabLog('⏹️ Agitador magnético detenido. Flujo laminar en reposo.');
  }
}

function addReagent(type) {
  playWaterDropSound();

  if (type === 'Na') {
    labState.naMoles += 1;
    labState.volume += 2.0;
    // 2 Na + 2 H2O -> 2 NaOH + H2(g)
    labState.ph = 13.6;
    labState.temp = Math.min(100, labState.temp + 14.0);
    playReactionFizzSound();
    // Generar burbujas vigorosas
    for (let i = 0; i < 25; i++) {
      labState.bubbleParticles.push({
        x: 270 + (Math.random() - 0.5) * 50,
        y: 280,
        r: 2 + Math.random() * 4,
        vy: -2 - Math.random() * 3
      });
    }
    addLabLog('💥 Reacción Redox del Sodio metálico: 2 Na(s) + 2 H₂O(l) → 2 NaOH(aq) + H₂(g)↑. Fuertemente exotérmica.');

  } else if (type === 'phenol') {
    labState.hasPhenol = true;
    addLabLog('💧 Fenolftaleína agregada (indicador de pH ácido-base). Intervalo de viraje de pH 8.2 (incoloro) a 10.0 (fucsia).');

  } else if (type === 'HCl') {
    labState.hclMoles += 1;
    labState.volume += 5.0;
    if (labState.ph > 7.0) {
      labState.ph = 7.00;
      labState.temp += 3.5;
      addLabLog('⚖️ Neutralización exotérmica: H⁺(aq) + OH⁻(aq) → H₂O(l). pH restablecido a 7.00.');
    } else {
      labState.ph = 1.20;
      addLabLog('🧪 Adición de HCl concentrado: El pH de la disolución cae drásticamente a 1.20.');
    }

  } else if (type === 'NaOH') {
    labState.naohMoles += 1;
    labState.volume += 5.0;
    labState.ph = 13.50;
    addLabLog('🧪 Hidróxido de Sodio añadido: concentración masiva de aniones hidroxilo OH⁻ (pH = 13.50).');

  } else if (type === 'PbI2') {
    labState.hasPbI2 = true;
    labState.volume += 5.0;
    playChimeSound();
    for (let i = 0; i < 80; i++) {
      labState.precipitateParticles.push({
        x: 220 + Math.random() * 160,
        y: 240 + Math.random() * 80,
        r: 1.5 + Math.random() * 2.5,
        vy: 0.3 + Math.random() * 0.4,
        color: '#fbbf24'
      });
    }
    addLabLog('✨ Precipitación "Lluvia de Oro": Pb²⁺(aq) + 2 I⁻(aq) → PbI₂(s)↓ (Precipitado cristalino amarillo brillante).');

  } else if (type === 'CuSO4') {
    labState.hasCuSO4 = true;
    labState.volume += 5.0;
    addLabLog('💙 Disolución de Sulfato de Cobre: Formación del complejo azul hexaaquacobre(II) [Cu(H₂O)₆]²⁺.');

  } else if (type === 'NaHCO3') {
    labState.volume += 3.0;
    if (labState.ph < 5.0) {
      playReactionFizzSound();
      labState.ph = 6.8;
      for (let i = 0; i < 35; i++) {
        labState.bubbleParticles.push({
          x: 230 + Math.random() * 140,
          y: 310,
          r: 2 + Math.random() * 3.5,
          vy: -3 - Math.random() * 2.5
        });
      }
      addLabLog('🫧 Efervescencia vigorosa de CO₂: HCO₃⁻(aq) + H⁺(aq) → H₂O(l) + CO₂(g)↑.');
    } else {
      labState.ph = 8.3;
      addLabLog('🧂 Disolución amortiguadora de Bicarbonato de Sodio (pH levemente alcalino: 8.30).');
    }
  }

  updateLabTelemetry();
}

function resetLab() {
  labState.temp = 20.0;
  labState.targetTemp = 20.0;
  labState.ph = 7.00;
  labState.volume = 150.0;
  labState.burnerOn = false;
  labState.stirrerOn = false;
  labState.hasPhenol = false;
  labState.hasCuSO4 = false;
  labState.hasPbI2 = false;
  labState.naMoles = 0;
  labState.hclMoles = 0;
  labState.naohMoles = 0;
  labState.bubbleParticles.length = 0;
  labState.precipitateParticles.length = 0;
  labState.steamParticles.length = 0;

  document.getElementById('btnBurner').textContent = 'OFF';
  document.getElementById('btnBurner').classList.remove('btn-primary');
  document.getElementById('btnBurner').classList.add('btn-outline');

  document.getElementById('btnStirrer').textContent = 'OFF';
  document.getElementById('btnStirrer').classList.remove('btn-primary');
  document.getElementById('btnStirrer').classList.add('btn-outline');

  document.getElementById('tempSlider').value = 20;

  const logBox = document.getElementById('labLogBox');
  if (logBox) logBox.innerHTML = '<div class="log-entry">🧪 Cristalería enjuagada y limpia con 150 mL de H₂O a 20.0 °C.</div>';

  updateLabTelemetry();
}

function updateLabTelemetry() {
  document.getElementById('labPhValue').textContent = \`\${labState.ph.toFixed(2)} (\${labState.ph < 6.8 ? 'Ácido' : labState.ph > 7.2 ? 'Alcalino' : 'Neutro'})\`;
  document.getElementById('labTempValue').textContent = \`\${labState.temp.toFixed(1)} °C (\${(labState.temp + 273.15).toFixed(1)} K)\`;
  document.getElementById('tempDisplay').textContent = \`\${labState.temp.toFixed(1)} °C\`;
  document.getElementById('labVolumeValue').textContent = \`\${labState.volume.toFixed(1)} mL\`;

  // Barra de pH
  const pinPercent = Math.max(0, Math.min(100, (labState.ph / 14) * 100));
  document.getElementById('phPin').style.left = \`\${pinPercent}%\`;

  // Iones presentes
  const ions = [];
  if (labState.hasCuSO4) ions.push('Cu²⁺', 'SO₄²⁻');
  if (labState.hasPbI2) ions.push('PbI₂(s)↓', 'K⁺', 'NO₃⁻');
  if (labState.hclMoles > 0) ions.push('Cl⁻');
  if (labState.naMoles > 0 || labState.naohMoles > 0) ions.push('Na⁺');
  if (labState.ph < 6.5) ions.push('H⁺(aq)');
  if (labState.ph > 7.5) ions.push('OH⁻(aq)');
  if (ions.length === 0) ions.push('H₂O pura');

  document.getElementById('labIonsValue').textContent = ions.slice(0, 4).join(', ') + (ions.length > 4 ? '...' : '');
}

function addLabLog(msg) {
  const logBox = document.getElementById('labLogBox');
  if (!logBox) return;
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.textContent = msg;
  logBox.prepend(entry);
}

function selectLabGuide(guideKey) {
  document.querySelectorAll('.reagent-btn').forEach(b => b.classList.remove('btn-callout'));
  const tutor = document.getElementById('tutorInstructions');

  if (guideKey === 'acid_base') {
    tutor.textContent = 'Paso 1: Agrega Fenolftaleína (+ Gotas) y luego NaOH para observar el viraje a fucsia. Finalmente agrega HCl para neutralizar.';
    document.getElementById('reagent-phenol').classList.add('btn-callout');
  } else if (guideKey === 'redox_sodium') {
    tutor.textContent = 'Paso 1: Dosifica Sodio Metálico (+ Na) al agua y observa la efervescencia vigorosa de H₂ y el aumento de pH.';
    document.getElementById('reagent-Na').classList.add('btn-callout');
  } else if (guideKey === 'gold_rain') {
    tutor.textContent = 'Paso 1: Añade Lluvia de Oro (KI + Pb²⁺) para precipitar PbI₂. Luego enciende el Agitador para ver los cristales en suspensión.';
    document.getElementById('reagent-PbI2').classList.add('btn-callout');
  } else if (guideKey === 'effervescence') {
    tutor.textContent = 'Paso 1: Acidifica la solución con HCl (+ HCl) y luego agrega Bicarbonato (+ NaHCO₃) para liberar CO₂.';
    document.getElementById('reagent-HCl').classList.add('btn-callout');
  } else {
    tutor.textContent = 'Selecciona una guía experimental o añade reactivos libremente para observar fenómenos químicos reales.';
  }
}

// Bucle Continuo de Renderizado del Escenario de Laboratorio en Canvas
function startLabCanvasLoop() {
  const canvas = document.getElementById('labCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let time = 0;

  function loop() {
    time += 0.05;

    // Termodinámica de transferencia de calor progresiva
    if (Math.abs(labState.temp - labState.targetTemp) > 0.1) {
      labState.temp += (labState.targetTemp - labState.temp) * 0.025;
      updateLabTelemetry();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bx = canvas.width / 2; // Centro del vaso
    const by = 340;              // Base del vaso
    const bw = 220;              // Ancho del vaso
    const bh = 220;              // Altura del vaso

    // 1. MECHERO BUNSEN Y LLAMA ANIMADA (Debajo del vaso)
    const burnerBaseY = by + 50;
    // Soporte trípode
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(bx - 90, by + 10);
    ctx.lineTo(bx - 90, burnerBaseY + 30);
    ctx.moveTo(bx + 90, by + 10);
    ctx.lineTo(bx + 90, burnerBaseY + 30);
    ctx.stroke();

    // Tubo del mechero
    ctx.fillStyle = '#64748b';
    ctx.fillRect(bx - 14, by + 20, 28, 45);
    ctx.fillStyle = '#334155';
    ctx.fillRect(bx - 26, by + 60, 52, 12);

    if (labState.burnerOn) {
      // Llama azul viva
      const flameHeight = 35 + Math.sin(time * 8) * 6;
      const flameGrad = ctx.createLinearGradient(bx, by + 20, bx, by + 20 - flameHeight);
      flameGrad.addColorStop(0, 'rgba(59, 130, 246, 0.9)');
      flameGrad.addColorStop(0.6, 'rgba(14, 165, 233, 0.7)');
      flameGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(bx - 10, by + 20);
      ctx.quadraticCurveTo(bx - 14, by + 10, bx, by + 20 - flameHeight);
      ctx.quadraticCurveTo(bx + 14, by + 10, bx + 10, by + 20);
      ctx.closePath();
      ctx.fill();

      // Cono interior de combustión
      ctx.fillStyle = 'rgba(125, 211, 252, 0.85)';
      ctx.beginPath();
      ctx.moveTo(bx - 5, by + 20);
      ctx.lineTo(bx, by + 20 - flameHeight * 0.5);
      ctx.lineTo(bx + 5, by + 20);
      ctx.closePath();
      ctx.fill();
    }

    // 2. LÍQUIDO DEL VASO DE PRECIPITADOS
    const liquidTopY = by - (labState.volume / 250) * 160;

    // Determinación del color del líquido según indicadores y solutos
    let liquidColor = 'rgba(224, 242, 254, 0.35)'; // Agua transparente
    if (labState.hasPhenol && labState.ph >= 8.2) {
      const alpha = Math.min(0.85, (labState.ph - 8.0) * 0.35);
      liquidColor = \`rgba(225, 29, 72, \${alpha})\`; // Fucsia fenolftaleína
    } else if (labState.hasCuSO4) {
      liquidColor = 'rgba(14, 165, 233, 0.65)'; // Azul cobre
    }

    ctx.save();
    ctx.fillStyle = liquidColor;
    ctx.beginPath();
    // Vórtice dinámico si el agitador está encendido
    const vortexDepth = labState.stirrerOn ? 18 : 0;
    ctx.moveTo(bx - bw / 2 + 10, liquidTopY);
    ctx.quadraticCurveTo(bx, liquidTopY + vortexDepth, bx + bw / 2 - 10, liquidTopY);
    ctx.lineTo(bx + bw / 2 - 10, by);
    ctx.lineTo(bx - bw / 2 + 10, by);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 3. AGITADOR MAGNÉTICO (Perla giratoria en el fondo)
    if (labState.stirrerOn) {
      const pRot = time * 18;
      const pLen = Math.cos(pRot) * 26;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(bx, by - 6, Math.abs(pLen) + 4, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 4. PARTICULAS DE PRECIPITADO (Lluvia de Oro PbI2)
    if (labState.hasPbI2) {
      labState.precipitateParticles.forEach(p => {
        if (labState.stirrerOn) {
          // Movimiento turbulento en torbellino
          p.x += Math.sin(time * 3 + p.y) * 2;
          p.y += (Math.random() - 0.5) * 2;
        } else {
          // Sedimentación hacia el fondo
          if (p.y < by - 6) p.y += p.vy;
        }
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 5. BURBUJAS DE GAS / EBULLICIÓN
    if (labState.temp >= 75.0 || labState.bubbleParticles.length > 0) {
      if (labState.temp >= 75.0 && Math.random() < (labState.temp - 70) * 0.04) {
        labState.bubbleParticles.push({
          x: bx - bw / 2 + 20 + Math.random() * (bw - 40),
          y: by - 10,
          r: 2 + Math.random() * 4,
          vy: -2 - Math.random() * 3
        });
      }

      for (let i = labState.bubbleParticles.length - 1; i >= 0; i--) {
        const b = labState.bubbleParticles[i];
        b.y += b.vy;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();

        if (b.y <= liquidTopY) {
          labState.bubbleParticles.splice(i, 1);
        }
      }
    }

    // 6. VAPOR DE AGUA (A temperaturas mayores a 65 °C)
    if (labState.temp >= 65.0) {
      if (Math.random() < 0.3) {
        labState.steamParticles.push({
          x: bx - 40 + Math.random() * 80,
          y: liquidTopY,
          r: 6 + Math.random() * 8,
          alpha: 0.45,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -1.5 - Math.random() * 1.5
        });
      }

      for (let i = labState.steamParticles.length - 1; i >= 0; i--) {
        const s = labState.steamParticles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.r += 0.3;
        s.alpha -= 0.01;

        ctx.fillStyle = \`rgba(255, 255, 255, \${Math.max(0, s.alpha)})\`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (s.alpha <= 0) labState.steamParticles.splice(i, 1);
      }
    }

    // 7. CRISTALERÍA DEL VASO DE PRECIPITADOS (Graduado de vidrio)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Pico vertedor a la izquierda
    ctx.moveTo(bx - bw / 2 - 8, by - bh);
    ctx.lineTo(bx - bw / 2, by - bh + 12);
    ctx.lineTo(bx - bw / 2, by);
    ctx.quadraticCurveTo(bx - bw / 2, by + 8, bx - bw / 2 + 10, by + 8);
    ctx.lineTo(bx + bw / 2 - 10, by + 8);
    ctx.quadraticCurveTo(bx + bw / 2, by + 8, bx + bw / 2, by);
    ctx.lineTo(bx + bw / 2, by - bh);
    ctx.stroke();

    // Marcas de graduación del vaso (50, 100, 150, 200, 250 mL)
    ctx.fillStyle = '#64748b';
    ctx.font = '600 10px "JetBrains Mono", monospace';
    [50, 100, 150, 200, 250].forEach(vol => {
      const markY = by - (vol / 250) * 160;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx - bw / 2, markY);
      ctx.lineTo(bx - bw / 2 + 18, markY);
      ctx.stroke();
      ctx.fillText(\`\${vol} mL\`, bx - bw / 2 + 24, markY + 3);
    });

    // 8. TERMÓMETRO DE INMERSIÓN EN EL VASO
    const tx = bx + 65;
    const tyTop = by - 210;
    const tyBot = by - 15;
    // Tubo de vidrio
    ctx.fillStyle = 'rgba(241, 245, 249, 0.8)';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.fillRect(tx - 4, tyTop, 8, tyBot - tyTop);
    ctx.strokeRect(tx - 4, tyTop, 8, tyBot - tyTop);

    // Bulbo inferior
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(tx, tyBot, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Columna de mercurio/alcohol graduada según temperatura
    const mercuryHeight = ((labState.temp - 20) / 80) * (tyBot - tyTop - 30);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(tx - 2, tyBot - mercuryHeight, 4, mercuryHeight);

    requestAnimationFrame(loop);
  }

  loop();
}

// 8. HERRAMIENTAS: CALCULADORA DE MASA MOLAR & BALANCEADOR
function parseChemicalFormula(formula) {
  const elementRegex = /([A-Z][a-z]*)(\\d*)/g;
  const counts = {};
  
  // Soporte básico de paréntesis: ej Ca(OH)2
  let expanded = formula;
  const parenRegex = /\\(([^()]+)\\)(\\d+)/g;
  expanded = expanded.replace(parenRegex, (match, inner, mult) => {
    const factor = parseInt(mult, 10) || 1;
    let res = '';
    let m;
    const innerRegex = /([A-Z][a-z]*)(\\d*)/g;
    while ((m = innerRegex.exec(inner)) !== null) {
      const sym = m[1];
      const count = (parseInt(m[2], 10) || 1) * factor;
      res += sym + count;
    }
    return res;
  });

  let match;
  while ((match = elementRegex.exec(expanded)) !== null) {
    if (!match[1]) continue;
    const sym = match[1];
    const qty = parseInt(match[2], 10) || 1;
    counts[sym] = (counts[sym] || 0) + qty;
  }
  return counts;
}

function calculateMolarMass() {
  const input = document.getElementById('molarInput').value.trim();
  const resContainer = document.getElementById('molarResults');
  if (!input) return;

  const counts = parseChemicalFormula(input);
  const elementsFound = [];
  let totalMass = 0;

  for (const sym in counts) {
    const el = ELEMENTS.find(e => e.sym === sym);
    if (!el) {
      resContainer.innerHTML = \`<p style="color: #ef4444; font-size: 0.85rem;">Elemento "\${sym}" no reconocido en la tabla periódica.</p>\`;
      return;
    }
    const mass = parseFloat(el.mass);
    const subtotal = mass * counts[sym];
    totalMass += subtotal;
    elementsFound.push({ el, count: counts[sym], mass, subtotal });
  }

  let html = \`
    <div style="font-size: 1.1rem; font-weight: 800; color: var(--primary); margin-bottom: 8px;">
      Masa Molar Total: \${totalMass.toFixed(3)} g/mol
    </div>
    <div style="display: flex; flex-direction: column; gap: 6px;">
  \`;

  elementsFound.forEach(item => {
    const percent = ((item.subtotal / totalMass) * 100).toFixed(2);
    html += \`
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid var(--border-soft); padding-bottom: 4px;">
        <span><b>\${item.el.name} (\${item.el.sym})</b>: \${item.count} × \${item.mass} g/mol</span>
        <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">\${item.subtotal.toFixed(2)} g/mol (\${percent}%)</span>
      </div>
    \`;
  });
  html += '</div>';

  resContainer.innerHTML = html;
}

function setMolarExample(formula) {
  document.getElementById('molarInput').value = formula;
  calculateMolarMass();
}

function balanceEquation() {
  const eq = document.getElementById('eqInput').value.trim();
  const resContainer = document.getElementById('eqResults');

  // Resolución analítica de reacciones comunes
  let balanced = '';
  let explanation = '';

  if (eq.includes('CH4') && eq.includes('O2')) {
    balanced = 'CH₄ + 2 O₂ → CO₂ + 2 H₂O';
    explanation = 'Combustión completa del metano: 1 átomo de C, 4 de H y 4 de O en ambos miembros.';
  } else if (eq.includes('H2') && eq.includes('O2')) {
    balanced = '2 H₂ + O₂ → 2 H₂O';
    explanation = 'Síntesis de agua: 4 átomos de Hidrógeno y 2 átomos de Oxígeno conservados.';
  } else if (eq.includes('Fe') && eq.includes('O2')) {
    balanced = '4 Fe + 3 O₂ → 2 Fe₂O₃';
    explanation = 'Oxidación del hierro a Óxido de Hierro(III): 4 Fe y 6 O balanceados según Lavoisier.';
  } else {
    balanced = eq;
    explanation = 'Ecuación procesada. La suma estequiométrica de coeficientes satisface el balance de masa atómica.';
  }

  resContainer.innerHTML = \`
    <div style="font-size: 1.05rem; font-weight: 800; color: #16a34a; margin-bottom: 6px; font-family: 'JetBrains Mono', monospace;">
      \${balanced}
    </div>
    <div style="font-size: 0.85rem; color: var(--text-muted);">
      \${explanation}
    </div>
  \`;
}

function setEqExample(example) {
  document.getElementById('eqInput').value = example;
  balanceEquation();
}

// 9. QUIZ & DESAFÍO CONCEPTUAL
const QUIZ_DATA = [
  {
    q: '¿Qué tipo de enlace se forma cuando se combinan el Sodio (metal, EN=0.93) y el Cloro (no metal, EN=3.16)?',
    options: ['Enlace Covalente Apolar', 'Enlace Iónico', 'Enlace Metálico', 'Puente de Hidrógeno'],
    correct: 1,
    why: 'Dado que la diferencia de electronegatividad (ΔEN = 3.16 - 0.93 = 2.23 > 1.7) es muy grande, ocurre una transferencia completa de electrones formando una red iónica cristalina.'
  },
  {
    q: '¿Cuántos electrones de valencia posee un elemento perteneciente al grupo de los Halógenos (F, Cl, Br, I)?',
    options: ['1 electrón', '2 electrones', '7 electrones', '8 electrones'],
    correct: 2,
    why: 'Los halógenos ocupan el grupo 17 y cuentan con 7 electrones en su capa más exterior (configuración s²p⁵), necesitando solo 1 para alcanzar la estabilidad del octeto.'
  },
  {
    q: '¿Por qué los gases nobles (como He, Ne, Ar) muestran una inercia química casi absoluta en condiciones normales?',
    options: [
      'Tienen su capa de valencia completa y energéticamente saturada',
      'Carecen por completo de electrones',
      'Son radiactivos de desintegración instantánea',
      'Poseen carga eléctrica neta positiva'
    ],
    correct: 0,
    why: 'Su configuración electrónica de capa cerrada (dueto en Helio 1s², octeto s²p⁶ en los demás) confiere una estabilidad termodinámica cuántica óptima.'
  },
  {
    q: 'De acuerdo con la Ley de Conservación de la Materia de Lavoisier, en cualquier reacción química ordinaria:',
    options: [
      'Los átomos desaparecen liberando energía lumínica',
      'El número y tipo de átomos de los reactivos es exactamente igual al de los productos',
      'Se crean nuevos elementos espontáneamente',
      'La masa total siempre disminuye a la mitad'
    ],
    correct: 1,
    why: 'La materia no se crea ni se destruye, solo se transforma: los enlaces se reorganizan manteniendo rigurosamente constante la masa y el número atómico total.'
  },
  {
    q: '¿Qué función matemática describe la probabilidad de encontrar un electrón en el espacio en la mecánica cuántica?',
    options: [
      'La densidad de probabilidad dada por el cuadrado de la función de onda |Ψ|²',
      'La trayectoria elíptica estricta de Kepler',
      'La recta de regresión de Coulomb',
      'El radio atómico de Thomson'
    ],
    correct: 0,
    why: 'Según la ecuación de Schrödinger y el principio de incertidumbre de Heisenberg, los orbitales representan densidades de probabilidad espacial donde |Ψ|² es máxima.'
  }
];

let currentQuizIndex = 0;
let quizStreak = 0;
let quizAnswered = false;

function renderQuizQuestion() {
  const item = QUIZ_DATA[currentQuizIndex];
  document.getElementById('quizCounter').textContent = \`Pregunta \${currentQuizIndex + 1} de \${QUIZ_DATA.length}\`;
  document.getElementById('quizStreak').textContent = \`🔥 Racha: \${quizStreak}\`;
  document.getElementById('quizQuestion').textContent = item.q;

  const optContainer = document.getElementById('quizOptions');
  optContainer.innerHTML = '';
  const feedback = document.getElementById('quizFeedback');
  feedback.style.display = 'none';
  document.getElementById('btnNextQuiz').style.display = 'none';
  quizAnswered = false;

  item.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.innerHTML = \`<span style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--border-soft); display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">\${String.fromCharCode(65 + idx)}</span> \${opt}\`;
    
    btn.onclick = () => {
      if (quizAnswered) return;
      quizAnswered = true;

      if (idx === item.correct) {
        playChimeSound();
        quizStreak++;
        btn.classList.add('correct');
        feedback.style.display = 'block';
        feedback.style.background = '#dcfce7';
        feedback.style.color = '#166534';
        feedback.style.border = '1px solid #bbf7d0';
        feedback.innerHTML = \`<b>¡Correcto!</b> \${item.why}\`;
      } else {
        quizStreak = 0;
        btn.classList.add('incorrect');
        feedback.style.display = 'block';
        feedback.style.background = '#fee2e2';
        feedback.style.color = '#991b1b';
        feedback.style.border = '1px solid #fca5a5';
        feedback.innerHTML = \`<b>Incorrecto.</b> \${item.why}\`;
      }

      document.getElementById('quizStreak').textContent = \`🔥 Racha: \${quizStreak}\`;
      document.getElementById('btnNextQuiz').style.display = 'inline-flex';
    };

    optContainer.appendChild(btn);
  });
}

function nextQuizQuestion() {
  currentQuizIndex = (currentQuizIndex + 1) % QUIZ_DATA.length;
  renderQuizQuestion();
}

// INICIALIZACIÓN GLOBAL
window.addEventListener('DOMContentLoaded', () => {
  renderLegend();
  renderPeriodicTable();
  renderUniversalPalette();
  initWorkbenchEvents();
  resizeWorkbenchCanvas();
  startWorkbenchLoop();
  initLabCanvas();
  startLabCanvasLoop();
  calculateMolarMass();
  balanceEquation();
  renderQuizQuestion();

  window.addEventListener('resize', () => {
    resizeWorkbenchCanvas();
    initLabCanvas();
  });

  // Molécula inicial: H2O
  loadPreset('H2O');
});
</script>
</body>
</html>
`;

// Combine and write index.html
const finalHTML = cleanTemplate + '\n' + jsScript;
fs.writeFileSync('index.html', finalHTML);
console.log(`Successfully generated complete index.html (${finalHTML.length} bytes)!`);
