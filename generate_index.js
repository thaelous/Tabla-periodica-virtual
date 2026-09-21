import fs from 'fs';

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tabla Periódica Interactiva</title>
  <meta name="description" content="Tabla periódica interactiva con inspector cuántico de orbitales, calculadora de masa molar, balanceador de ecuaciones, laboratorio virtual y constructor universal de moléculas con simulación 3D.">
  <style>
    :root {
      --bg-app: #f1f5f9;
      --surface: #ffffff;
      --surface-subtle: #f8fafc;
      --text-dark: #0f172a;
      --text-muted: #64748b;
      --border-soft: #e2e8f0;
      --border-strong: #cbd5e1;
      --primary: #0ea5e9;
      --primary-dark: #0284c7;
      --accent: #38bdf8;
      --success: #16a34a;
      --warning: #f59e0b;
      --danger: #ef4444;

      /* Pastel palette */
      --c-nonmetal: #dcfce7; --t-nonmetal: #15803d;
      --c-noble: #f3e8ff; --t-noble: #7e22ce;
      --c-alkali: #fee2e2; --t-alkali: #b91c1c;
      --c-alkaline: #ffedd5; --t-alkaline: #c2410c;
      --c-metalloid: #fef9c3; --t-metalloid: #a16207;
      --c-halogen: #e0f2fe; --t-halogen: #0369a1;
      --c-transition: #fef08a; --t-transition: #854d0e;
      --c-post-trans: #e2e8f0; --t-post-trans: #334155;
      --c-lanthanide: #fce7f3; --t-lanthanide: #be185d;
      --c-actinide: #ffe4e6; --t-actinide: #9f1239;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: var(--bg-app); color: var(--text-dark); min-height: 100vh; display: flex; flex-direction: column; }

    /* Header */
    header {
      position: sticky; top: 0; z-index: 100;
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
      gap: 12px; border-bottom: 1px solid var(--border-soft); background: #ffffff;
      padding: 12px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .brand { display: flex; align-items: center; gap: 10px; font-size: 1.25rem; font-weight: 800; color: var(--text-dark); }
    .brand-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.1rem; }
    
    .nav-tabs { display: flex; flex-wrap: wrap; gap: 4px; border-radius: 12px; border: 1px solid var(--border-soft); background: var(--surface-subtle); p: 4px; padding: 4px; }
    .nav-btn {
      border: none; border-radius: 8px; padding: 8px 16px; font-size: 0.85rem; font-weight: 600;
      background: transparent; color: var(--text-muted); cursor: pointer; transition: all 0.15s ease;
    }
    .nav-btn:hover { color: var(--text-dark); }
    .nav-btn.active { background: #ffffff; color: var(--text-dark); box-shadow: 0 2px 6px rgba(0,0,0,0.06); }

    /* Main Container */
    main { width: 100%; max-width: 1440px; margin: 0 auto; padding: 20px; flex: 1; }
    .tab-content { display: none; }
    .tab-content.active { display: block; animation: fadeIn 0.2s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

    /* Cards */
    .card { background: #ffffff; border: 1px solid var(--border-soft); border-radius: 18px; padding: 20px; box-shadow: 0 4px 14px -2px rgba(0,0,0,0.04); }
    .card-title { font-size: 1.1rem; font-weight: 700; color: var(--text-dark); margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
    .card-subtitle { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px; }

    /* Periodic Table Styles */
    .table-controls { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 16px; }
    .search-input {
      width: 280px; border-radius: 10px; border: 1px solid var(--border-soft); background: #ffffff;
      padding: 9px 14px; font-size: 0.88rem; outline: none; transition: border-color 0.15s;
    }
    .search-input:focus { border-color: var(--primary); }
    .legend-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .legend-chip {
      cursor: pointer; user-select: none; border-radius: 20px; padding: 5px 10px;
      font-size: 0.75rem; font-weight: 600; transition: transform 0.15s, box-shadow 0.15s;
    }
    .legend-chip:hover { opacity: 0.9; transform: scale(1.03); }
    .legend-chip.active { outline: 2px solid var(--primary); outline-offset: 1px; transform: scale(1.05); }

    .grid-container {
      overflow-x: auto; border-radius: 18px; border: 1px solid var(--border-soft);
      background: #ffffff; padding: 20px; box-shadow: 0 4px 14px -2px rgba(0,0,0,0.04);
    }
    .elements-grid {
      display: grid; min-width: 1180px; gap: 6px;
      grid-template-columns: repeat(18, minmax(60px, 1fr));
      grid-template-rows: repeat(10, minmax(64px, 1fr));
    }
    .grid-slot {
      display: flex; align-items: center; justify-content: center; border-radius: 10px;
      border: 1px dashed var(--border-soft); background: var(--surface-subtle);
      text-align: center; font-size: 0.7rem; font-weight: 700; color: var(--text-muted); line-height: 1.2;
    }
    .element-tile {
      border-radius: 10px; padding: 6px; display: flex; flex-direction: column;
      justify-content: space-between; cursor: pointer; transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.12s;
      user-select: none; border: 1px solid rgba(0,0,0,0.04); position: relative; overflow: hidden;
    }
    .element-tile:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 8px 16px rgba(0,0,0,0.08); z-index: 10; }
    .element-tile:active { transform: scale(0.92); }
    .element-tile.dimmed { opacity: 0.15; transform: scale(0.95); }

    /* Water ripple */
    .water-wave-primary {
      position: absolute; border-radius: 50%; border: 2.5px solid rgba(255,255,255,0.95);
      background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(56,189,248,0.35) 50%, rgba(255,255,255,0) 100%);
      transform: translate(-50%, -50%) scale(0); pointer-events: none;
      animation: waterDropWave 0.75s cubic-bezier(0.1, 0.8, 0.25, 1) forwards;
    }
    .water-wave-secondary {
      position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.7);
      transform: translate(-50%, -50%) scale(0); pointer-events: none;
      animation: waterDropWave 0.85s 0.1s cubic-bezier(0.1, 0.8, 0.25, 1) forwards;
    }
    @keyframes waterDropWave {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
      60% { opacity: 0.6; }
      100% { transform: translate(-50%, -50%) scale(4.2); opacity: 0; }
    }

    /* Modal Inspector Cuántico */
    .modal-overlay {
      position: fixed; inset: 0; z-index: 200; background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; padding: 16px;
    }
    .modal-overlay.active { display: flex; }
    .modal-card {
      background: #ffffff; border-radius: 20px; width: 100%; max-width: 860px; max-height: 90vh;
      display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
    }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid var(--border-soft); }
    .modal-body { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 24px; overflow-y: auto; }
    @media (max-width: 768px) { .modal-body { grid-template-columns: 1fr; } }
    .canvas-box { position: relative; border-radius: 14px; overflow: hidden; background: #050811; height: 320px; }
    .canvas-box canvas { width: 100%; height: 100%; display: block; }
    .modal-details { display: flex; flex-direction: column; gap: 12px; }
    .spec-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-soft); font-size: 0.85rem; }
    .spec-label { color: var(--text-muted); font-weight: 500; }
    .spec-val { color: var(--text-dark); font-weight: 700; }

    /* Callout pulse animation */
    .btn-callout {
      animation: pulseAttention 1.2s infinite ease-in-out !important;
      box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.5) !important;
    }
    @keyframes pulseAttention {
      0% { transform: scale(1); filter: brightness(1); }
      50% { transform: scale(1.06); filter: brightness(1.2); box-shadow: 0 0 14px rgba(249, 115, 22, 0.7); }
      100% { transform: scale(1); filter: brightness(1); }
    }

    /* Buttons */
    .btn {
      border: 1px solid var(--border-soft); border-radius: 10px; padding: 8px 16px;
      font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.15s; background: #ffffff; color: var(--text-dark);
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    }
    .btn:hover { background: var(--surface-subtle); border-color: var(--border-strong); }
    .btn-primary { background: var(--primary); border-color: var(--primary-dark); color: #ffffff; }
    .btn-primary:hover { background: var(--primary-dark); }
    .btn-success { background: #dcfce7; border-color: #86efac; color: #166534; }
    .btn-success:hover { background: #bbf7d0; }
    .btn-danger { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
    .btn-danger:hover { background: #fecaca; }

    /* Universal Molecule Builder Layout */
    .builder-layout { display: grid; grid-template-columns: 290px 1fr 310px; gap: 16px; align-items: start; }
    @media (max-width: 1100px) { .builder-layout { grid-template-columns: 1fr; } }

    .atom-bank-scroll { max-height: 480px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 4px; }
    .atom-bank-card {
      display: flex; align-items: center; justify-content: space-between; padding: 7px 10px;
      border-radius: 10px; border: 1px solid var(--border-soft); cursor: pointer; transition: transform 0.12s, box-shadow 0.12s;
    }
    .atom-bank-card:hover { transform: translateX(3px); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

    .workbench-canvas-wrapper {
      position: relative; border-radius: 16px; overflow: hidden; background: #0f172a;
      border: 1px solid #334155; height: 440px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
    }
    .workbench-canvas-wrapper canvas { width: 100%; height: 100%; display: block; }
    .workbench-overlay {
      position: absolute; top: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between; pointer-events: none;
    }
    .workbench-overlay > * { pointer-events: auto; }

    /* Lab Beaker Canvas */
    .beaker-wrapper {
      position: relative; border-radius: 16px; overflow: hidden; background: #0f172a;
      border: 1px solid #334155; height: 350px;
    }
    .beaker-wrapper canvas { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>

  <!-- Header -->
  <header>
    <div class="brand">
      <div class="brand-icon">P</div>
      <span>TABLA PERIÓDICA</span>
    </div>

    <nav class="nav-tabs" id="navTabs">
      <button class="nav-btn active" data-tab="tab-table">Tabla Periódica</button>
      <button class="nav-btn" data-tab="tab-tools">Herramientas & Explicaciones</button>
      <button class="nav-btn" data-tab="tab-lab">Laboratorio Virtual</button>
      <button class="nav-btn" data-tab="tab-builder">Constructor Universal de Moléculas</button>
      <button class="nav-btn" data-tab="tab-quiz">Quiz & Desafío</button>
    </nav>
  </header>

  <main>
    <!-- TAB 1: TABLA PERIÓDICA -->
    <section id="tab-table" class="tab-content active">
      <div class="table-controls">
        <input type="text" id="tableSearch" class="search-input" placeholder="Buscar por símbolo, nombre o número...">
        <div class="legend-chips" id="categoryLegend"></div>
      </div>

      <div class="grid-container">
        <div class="elements-grid" id="elementsGrid"></div>
      </div>
    </section>

    <!-- TAB 2: HERRAMIENTAS & EXPLICACIONES -->
    <section id="tab-tools" class="tab-content">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(460px, 1fr)); gap: 20px;">
        <!-- Masa Molar -->
        <div class="card">
          <div class="card-title">⚖️ Calculadora de Masa Molar</div>
          <div class="card-subtitle">Calcula el peso molecular estequiométrico bajo los pesos atómicos estándar de la IUPAC.</div>
          
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <input type="text" id="molarInput" class="search-input" style="flex: 1;" placeholder="Ej: H2O, CaCO3, H2SO4, C6H12O6...">
            <button class="btn btn-primary" id="btnCalcMolar">Calcular</button>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
            <button class="btn" style="font-size:0.75rem; padding:4px 8px;" onclick="setMolarExample('H2O')">💧 H₂O</button>
            <button class="btn" style="font-size:0.75rem; padding:4px 8px;" onclick="setMolarExample('CaCO3')">🐚 CaCO₃</button>
            <button class="btn" style="font-size:0.75rem; padding:4px 8px;" onclick="setMolarExample('H2SO4')">⚡ H₂SO₄</button>
            <button class="btn" style="font-size:0.75rem; padding:4px 8px;" onclick="setMolarExample('C6H12O6')">🍎 C₆H₁₂O₆</button>
            <button class="btn" style="font-size:0.75rem; padding:4px 8px;" onclick="setMolarExample('C8H9NO2')">💊 Paracetamol</button>
          </div>

          <div id="molarTicket" style="background: var(--surface-subtle); border: 1px solid var(--border-soft); border-radius: 12px; padding: 14px; font-size: 0.88rem; line-height: 1.6;">
            Ingresa una fórmula molecular o selecciona uno de los ejemplos directos para ver el desglose estequiométrico.
          </div>
        </div>

        <!-- Balanceador de Ecuaciones -->
        <div class="card">
          <div class="card-title">🔄 Balanceador de Ecuaciones Químicas</div>
          <div class="card-subtitle">Aplica la Ley de Conservación de la Materia de Lavoisier: los átomos no se crean ni se destruyen.</div>

          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <input type="text" id="eqInput" class="search-input" style="flex: 1;" placeholder="Ej: Fe + O2 -> Fe2O3">
            <button class="btn btn-primary" id="btnBalanceEq">Balancear</button>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
            <button class="btn" style="font-size:0.75rem; padding:4px 8px;" onclick="setEqExample('Fe + O2 -> Fe2O3')">Rust: Fe + O₂</button>
            <button class="btn" style="font-size:0.75rem; padding:4px 8px;" onclick="setEqExample('H2 + O2 -> H2O')">Agua: H₂ + O₂</button>
            <button class="btn" style="font-size:0.75rem; padding:4px 8px;" onclick="setEqExample('CH4 + O2 -> CO2 + H2O')">Metano: CH₄ + O₂</button>
          </div>

          <div id="eqOutput" style="background: var(--surface-subtle); border: 1px solid var(--border-soft); border-radius: 12px; padding: 14px; font-size: 0.88rem; line-height: 1.6;">
            Introduce una reacción química para verificar el balance de conservación atómica.
          </div>
        </div>
      </div>
    </section>

    <!-- TAB 3: LABORATORIO VIRTUAL -->
    <section id="tab-lab" class="tab-content">
      <div style="display: grid; grid-template-columns: 320px 1fr; gap: 20px; align-items: start;">
        <!-- Controles & Tutor -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Tutor Activo -->
          <div class="card" style="border-left: 4px solid var(--warning);">
            <div class="card-title" style="color: #d97706;">🎓 Tutor Activo de Laboratorio</div>
            <div id="tutorTitle" style="font-weight: 700; font-size: 0.9rem; margin-top: 4px;">1. Reacción Redox & Desprendimiento de H₂</div>
            <div id="tutorStep" style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">Paso 1 de 2 • Dosificación</div>
            <div id="tutorAction" style="font-size: 0.85rem; font-weight: 600; color: #b45309; margin-bottom: 6px;">Haz clic en '+ Na' para dosificar Sodio metálico.</div>
            <div id="tutorWhy" style="font-size: 0.78rem; color: var(--text-dark); line-height: 1.4; background: #fffbeb; padding: 8px; border-radius: 8px;">
              El Sodio posee un electrón 3s¹ que cede violentamente al agua, reduciendo protones a gas H₂ y formando hidróxido de sodio.
            </div>
          </div>

          <!-- Reactivos -->
          <div class="card">
            <div class="card-title">🧪 Banco de Reactivos</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
              <button class="btn btn-callout" id="btn-reag-Na" onclick="addReagent('Na')">+ Na (Sodio)</button>
              <button class="btn" id="btn-reag-HCl" onclick="addReagent('HCl')">+ HCl (Ácido)</button>
              <button class="btn" id="btn-reag-NaOH" onclick="addReagent('NaOH')">+ NaOH (Base)</button>
              <button class="btn" id="btn-reag-KI" onclick="addReagent('KI')">+ KI (Yoduro)</button>
              <button class="btn" id="btn-reag-Pb" onclick="addReagent('Pb')">+ Pb(NO₃)₂</button>
              <button class="btn" id="btn-reag-Cu" onclick="addReagent('CuSO4')">+ CuSO₄ (Cobre)</button>
              <button class="btn" id="btn-reag-phenol" onclick="addReagent('phenol')">+ Fenolftaleína</button>
              <button class="btn btn-danger" onclick="resetLab()">Limpiar Vaso</button>
            </div>
          </div>

          <!-- Controles de Entorno -->
          <div class="card">
            <div class="card-title">⚙️ Parámetros Físicos</div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.85rem; font-weight: 600;">🔥 Mechero Bunsen:</span>
                <button class="btn" id="btnBurner" onclick="toggleBurner()">Apagado</button>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.8rem; color: var(--text-muted);">Temp:</span>
                <input type="range" id="tempRange" min="20" max="100" value="25" style="flex: 1;" oninput="updateTemp(this.value)">
                <span id="tempVal" style="font-size: 0.85rem; font-weight: 700;">25°C</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.85rem; font-weight: 600;">🌪️ Agitador Magnético:</span>
                <button class="btn" id="btnStirrer" onclick="toggleStirrer()">OFF</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Área de Observación: Vaso de Precipitados & Telemetría -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="card" style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 0.95rem; font-weight: 700;">Vaso de Precipitados Reactivo (250 mL)</span>
              <span id="phBadge" style="font-size: 0.85rem; font-weight: 700; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 12px;">pH 7.00 (Neutro)</span>
            </div>
            <div class="beaker-wrapper">
              <canvas id="beakerCanvas"></canvas>
            </div>
          </div>

          <div class="card">
            <div class="card-title">📝 Registro Químico & Ecuación en Vivo</div>
            <div id="labEq" style="font-size: 1rem; font-weight: 700; color: var(--primary-dark); margin: 6px 0;">H₂O (l) [Medio acuoso neutro]</div>
            <div id="labLog" style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">El vaso contiene disolvente acuoso puro a temperatura ambiente.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB 4: CONSTRUCTOR UNIVERSAL DE MOLÉCULAS -->
    <section id="tab-builder" class="tab-content">
      <div class="builder-layout">
        <!-- Panel Izquierdo: Banco Universal de 118 Átomos -->
        <div class="card" style="padding: 14px;">
          <div class="card-title" style="font-size: 0.95rem;">⚛️ Banco Universal (118 Elementos)</div>
          <div class="card-subtitle" style="font-size: 0.78rem; margin-bottom: 10px;">Haz clic en cualquier elemento para añadirlo a la mesa de ensamble.</div>
          <input type="text" id="builderSearch" class="search-input" style="width: 100%; margin-bottom: 8px; font-size: 0.8rem; padding: 6px 10px;" placeholder="Filtrar por nombre, símbolo o Z...">
          <div class="atom-bank-scroll" id="atomBankList"></div>
        </div>

        <!-- Panel Central: Área de Ensamble y Canvas Interactivo -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="card" style="padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
              <div>
                <span style="font-weight: 700; font-size: 1rem;">Área de Ensamble Molecular</span>
                <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 8px;">Arrastra los átomos para unirlos o separarlos</span>
              </div>
              <div style="display: flex; gap: 8px; align-items: center;">
                <!-- NUEVO BOTÓN REQUERIDO: ANIMAR MOLÉCULA ESTABLE -->
                <button class="btn btn-primary" id="btnAnimate3D" onclick="toggle3DAnimation()">🌀 Animar Molécula Estable</button>
                <button class="btn btn-danger" onclick="clearWorkbench()">Limpiar Mesa</button>
              </div>
            </div>

            <!-- Misiones / Ejemplos Rápidos -->
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">Moléculas clave:</span>
              <button class="btn" style="font-size: 0.75rem; padding: 3px 8px;" onclick="loadPreset('H2O')">Agua (H₂O)</button>
              <button class="btn" style="font-size: 0.75rem; padding: 3px 8px;" onclick="loadPreset('NaCl')">Sal (NaCl)</button>
              <button class="btn" style="font-size: 0.75rem; padding: 3px 8px;" onclick="loadPreset('CO2')">CO₂</button>
              <button class="btn" style="font-size: 0.75rem; padding: 3px 8px;" onclick="loadPreset('CH4')">Metano (CH₄)</button>
              <button class="btn" style="font-size: 0.75rem; padding: 3px 8px;" onclick="loadPreset('NH3')">Amoníaco (NH₃)</button>
              <button class="btn" style="font-size: 0.75rem; padding: 3px 8px;" onclick="loadPreset('HCl')">HCl</button>
              <button class="btn" style="font-size: 0.75rem; padding: 3px 8px;" onclick="loadPreset('CaO')">Cal (CaO)</button>
              <button class="btn" style="font-size: 0.75rem; padding: 3px 8px;" onclick="loadPreset('C6H12O6')">Glucosa</button>
            </div>

            <div class="workbench-canvas-wrapper">
              <canvas id="workbenchCanvas"></canvas>
              <div class="workbench-overlay">
                <div id="canvasStatusTag" style="background: rgba(15,23,42,0.85); border: 1px solid #334155; border-radius: 8px; padding: 4px 10px; font-size: 0.75rem; color: #38bdf8;">
                  Átomos en mesa: 0
                </div>
                <div id="mode3DIndicator" style="display: none; background: #0284c7; color: #fff; font-size: 0.75rem; font-weight: 700; border-radius: 8px; padding: 4px 10px; animation: pulseAttention 2s infinite;">
                  Modo Rotación 3D Activo
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel Derecho: Motor de Validación de Factibilidad Química -->
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <!-- Tipo de Enlace & ΔEN -->
          <div class="card" style="padding: 14px;">
            <div class="card-title" style="font-size: 0.95rem;">🔬 Análisis de Enlace Químico</div>
            <div id="bondTypeBadge" style="background: #e0f2fe; color: #0369a1; font-weight: 800; font-size: 0.9rem; padding: 6px 12px; border-radius: 8px; text-align: center; margin: 8px 0;">
              Esperando átomos...
            </div>
            <div id="deltaEnText" style="font-size: 0.85rem; font-weight: 700; color: var(--text-dark); margin-bottom: 8px;">
              Δ Electronegatividad (Pauling): 0.00
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
              • Covalente no polar: ΔEN &lt; 0.4<br>
              • Covalente polar: 0.4 ≤ ΔEN ≤ 1.7<br>
              • Iónico: ΔEN &gt; 1.7
            </div>
          </div>

          <!-- Factibilidad & Reglas Bloqueantes -->
          <div class="card" style="padding: 14px;">
            <div class="card-title" style="font-size: 0.95rem;">🛡️ Factibilidad & Reglas Químicas</div>
            <div id="feasibilityAlert" style="margin-top: 6px; font-size: 0.82rem; line-height: 1.5; padding: 10px; border-radius: 10px; background: var(--surface-subtle); border: 1px solid var(--border-soft);">
              Añade al menos 2 átomos para evaluar la compatibilidad de enlace.
            </div>
          </div>

          <!-- Compuesto Reconocido -->
          <div class="card" style="padding: 14px;">
            <div class="card-title" style="font-size: 0.95rem;">📖 Compuesto Reconocido</div>
            <div id="compoundName" style="font-size: 1rem; font-weight: 800; color: var(--primary-dark); margin-top: 4px;">Ninguno</div>
            <div id="compoundDesc" style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; margin-top: 6px;">
              Ensambla una combinación química para descubrir su fórmula y aplicaciones en la vida cotidiana.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB 5: QUIZ & DESAFÍO -->
    <section id="tab-quiz" class="tab-content">
      <div style="max-width: 720px; margin: 0 auto;">
        <div class="card" style="padding: 24px;">
          <div id="quizContainer">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <span id="quizCounter" style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">Pregunta 1 de 5</span>
              <span id="quizStreak" style="font-size: 0.85rem; font-weight: 700; background: #fef3c7; color: #b45309; padding: 4px 10px; border-radius: 12px;">🔥 Racha: 0</span>
            </div>

            <div id="quizQuestion" style="font-size: 1.15rem; font-weight: 700; color: var(--text-dark); margin-bottom: 18px; line-height: 1.4;">
              ¿Qué tipo de enlace se forma cuando el Sodio (metal) se une con el Cloro (no metal)?
            </div>

            <div id="quizOptions" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px;"></div>

            <div id="quizFeedback" style="display: none; padding: 12px; border-radius: 10px; font-size: 0.85rem; line-height: 1.5; margin-bottom: 14px;"></div>

            <button class="btn btn-primary" id="btnNextQuiz" style="display: none; width: 100%;" onclick="nextQuizQuestion()">Siguiente Pregunta ➔</button>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Modal Inspector Cuántico -->
  <div class="modal-overlay" id="quantumModal">
    <div class="modal-card">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div id="modalSymBadge" style="width: 38px; height: 38px; border-radius: 10px; background: #e0f2fe; color: #0369a1; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem;">H</div>
          <div>
            <div id="modalElementName" style="font-size: 1.1rem; font-weight: 800;">Hidrógeno (Z = 1)</div>
            <div id="modalElementCat" style="font-size: 0.78rem; color: var(--text-muted);">No metal • Bloque s</div>
          </div>
        </div>
        <button class="btn" onclick="closeQuantumModal()" style="border: none; font-size: 1.1rem; cursor: pointer;">✕</button>
      </div>

      <div class="modal-body">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.85rem; font-weight: 700;">Simulador Cuántico 3D</span>
            <button class="btn" id="btnToggleOrbitalMode" style="font-size: 0.75rem; padding: 3px 8px;" onclick="toggleOrbitalMode()">Modo: Nube |Ψ|²</button>
          </div>
          <div class="canvas-box">
            <canvas id="quantumCanvas"></canvas>
          </div>
        </div>

        <div class="modal-details">
          <div class="spec-row"><span class="spec-label">Configuración Electrónica:</span><span class="spec-val" id="specConf">1s¹</span></div>
          <div class="spec-row"><span class="spec-label">Masa Atómica Estándar:</span><span class="spec-val" id="specMass">1.008 u</span></div>
          <div class="spec-row"><span class="spec-label">Electronegatividad (Pauling):</span><span class="spec-val" id="specEn">2.20</span></div>
          <div class="spec-row"><span class="spec-label">Punto de Fusión:</span><span class="spec-val" id="specMp">-259.1 °C</span></div>
          <div class="spec-row"><span class="spec-label">Capa de Valencia:</span><span class="spec-val" id="specVal">1 electrón</span></div>
          <div style="background: var(--surface-subtle); padding: 10px; border-radius: 10px; font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-top: 6px;">
            <b>Interpretación Mecano-Cuántica:</b> Los puntos representan la densidad de probabilidad |Ψ|² de encontrar el electrón según la solución de la Ecuación de Schrödinger.
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="/standalone_app.js"></script>
</body>
</html>
`;

fs.writeFileSync('./index.html', htmlContent);
console.log('Successfully wrote base index.html');
