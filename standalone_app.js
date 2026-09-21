// TABLA PERIÓDICA INTERACTIVA - STANDALONE ENGINE
// Pure JavaScript, Canvas and Web Audio API without backend dependencies

// Web Audio API Sound Effects
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
    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.16);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  } catch (e) {}
}

function playChimeSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.15, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.35);
    });
  } catch (e) {}
}

function playFizzSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch (e) {}
}

// 118 Elements Dataset
// [num, sym, name, mass, cat, row, col, conf, en, mp, block, valence, maxBonds]
const RAW_ELEMENTS = [
  [1, "H", "Hidrógeno", "1.008", "nonmetal", 1, 1, "1s¹", "2.20", "-259.1 °C", "s", 1, 1],
  [2, "He", "Helio", "4.002", "noble", 1, 18, "1s²", "-", "-272.2 °C", "s", 2, 0],
  [3, "Li", "Litio", "6.94", "alkali", 2, 1, "[He] 2s¹", "0.98", "180.5 °C", "s", 1, 1],
  [4, "Be", "Berilio", "9.012", "alkaline", 2, 2, "[He] 2s²", "1.57", "1287 °C", "s", 2, 2],
  [5, "B", "Boro", "10.81", "metalloid", 2, 13, "[He] 2s² 2p¹", "2.04", "2076 °C", "p", 3, 3],
  [6, "C", "Carbono", "12.011", "nonmetal", 2, 14, "[He] 2s² 2p²", "2.55", "3550 °C", "p", 4, 4],
  [7, "N", "Nitrógeno", "14.007", "nonmetal", 2, 15, "[He] 2s² 2p³", "3.04", "-210.0 °C", "p", 5, 3],
  [8, "O", "Oxígeno", "15.999", "nonmetal", 2, 16, "[He] 2s² 2p⁴", "3.44", "-218.7 °C", "p", 6, 2],
  [9, "F", "Flúor", "18.998", "halogen", 2, 17, "[He] 2s² 2p⁵", "3.98", "-219.6 °C", "p", 7, 1],
  [10, "Ne", "Neón", "20.180", "noble", 2, 18, "[He] 2s² 2p⁶", "-", "-248.6 °C", "p", 8, 0],
  [11, "Na", "Sodio", "22.990", "alkali", 3, 1, "[Ne] 3s¹", "0.93", "97.8 °C", "s", 1, 1],
  [12, "Mg", "Magnesio", "24.305", "alkaline", 3, 2, "[Ne] 3s²", "1.31", "650.0 °C", "s", 2, 2],
  [13, "Al", "Aluminio", "26.982", "post-trans", 3, 13, "[Ne] 3s² 3p¹", "1.61", "660.3 °C", "p", 3, 3],
  [14, "Si", "Silicio", "28.085", "metalloid", 3, 14, "[Ne] 3s² 3p²", "1.90", "1414 °C", "p", 4, 4],
  [15, "P", "Fósforo", "30.974", "nonmetal", 3, 15, "[Ne] 3s² 3p³", "2.19", "44.1 °C", "p", 5, 3],
  [16, "S", "Azufre", "32.06", "nonmetal", 3, 16, "[Ne] 3s² 3p⁴", "2.58", "115.2 °C", "p", 6, 2],
  [17, "Cl", "Cloro", "35.45", "halogen", 3, 17, "[Ne] 3s² 3p⁵", "3.16", "-101.5 °C", "p", 7, 1],
  [18, "Ar", "Argón", "39.95", "noble", 3, 18, "[Ne] 3s² 3p⁶", "-", "-189.3 °C", "p", 8, 0],
  [19, "K", "Potasio", "39.098", "alkali", 4, 1, "[Ar] 4s¹", "0.82", "63.5 °C", "s", 1, 1],
  [20, "Ca", "Calcio", "40.078", "alkaline", 4, 2, "[Ar] 4s²", "1.00", "842.0 °C", "s", 2, 2],
  [21, "Sc", "Escandio", "44.956", "transition", 4, 3, "[Ar] 3d¹ 4s²", "1.36", "1541 °C", "d", 3, 3],
  [22, "Ti", "Titanio", "47.867", "transition", 4, 4, "[Ar] 3d² 4s²", "1.54", "1668 °C", "d", 4, 4],
  [23, "V", "Vanadio", "50.942", "transition", 4, 5, "[Ar] 3d³ 4s²", "1.63", "1910 °C", "d", 5, 5],
  [24, "Cr", "Cromo", "51.996", "transition", 4, 6, "[Ar] 3d⁵ 4s¹", "1.66", "1907 °C", "d", 6, 6],
  [25, "Mn", "Manganeso", "54.938", "transition", 4, 7, "[Ar] 3d⁵ 4s²", "1.55", "1246 °C", "d", 7, 4],
  [26, "Fe", "Hierro", "55.845", "transition", 4, 8, "[Ar] 3d⁶ 4s²", "1.83", "1538 °C", "d", 8, 3],
  [27, "Co", "Cobalto", "58.933", "transition", 4, 9, "[Ar] 3d⁷ 4s²", "1.88", "1495 °C", "d", 9, 3],
  [28, "Ni", "Níquel", "58.693", "transition", 4, 10, "[Ar] 3d⁸ 4s²", "1.91", "1455 °C", "d", 10, 2],
  [29, "Cu", "Cobre", "63.546", "transition", 4, 11, "[Ar] 3d¹⁰ 4s¹", "1.90", "1084.6 °C", "d", 1, 2],
  [30, "Zn", "Zinc", "65.38", "transition", 4, 12, "[Ar] 3d¹⁰ 4s²", "1.65", "419.5 °C", "d", 2, 2],
  [31, "Ga", "Galio", "69.723", "post-trans", 4, 13, "[Ar] 3d¹⁰ 4s² 4p¹", "1.81", "29.8 °C", "p", 3, 3],
  [32, "Ge", "Germanio", "72.630", "metalloid", 4, 14, "[Ar] 3d¹⁰ 4s² 4p²", "2.01", "938.3 °C", "p", 4, 4],
  [33, "As", "Arsénico", "74.922", "metalloid", 4, 15, "[Ar] 3d¹⁰ 4s² 4p³", "2.18", "817 °C", "p", 5, 3],
  [34, "Se", "Selenio", "78.971", "nonmetal", 4, 16, "[Ar] 3d¹⁰ 4s² 4p⁴", "2.55", "221 °C", "p", 6, 2],
  [35, "Br", "Bromo", "79.904", "halogen", 4, 17, "[Ar] 3d¹⁰ 4s² 4p⁵", "2.96", "-7.2 °C", "p", 7, 1],
  [36, "Kr", "Kriptón", "83.798", "noble", 4, 18, "[Ar] 3d¹⁰ 4s² 4p⁶", "3.00", "-157.4 °C", "p", 8, 0],
  [37, "Rb", "Rubidio", "85.468", "alkali", 5, 1, "[Kr] 5s¹", "0.82", "39.3 °C", "s", 1, 1],
  [38, "Sr", "Estroncio", "87.62", "alkaline", 5, 2, "[Kr] 5s²", "0.95", "777 °C", "s", 2, 2],
  [39, "Y", "Itrio", "88.906", "transition", 5, 3, "[Kr] 4d¹ 5s²", "1.22", "1526 °C", "d", 3, 3],
  [40, "Zr", "Circonio", "91.224", "transition", 5, 4, "[Kr] 4d² 5s²", "1.33", "1855 °C", "d", 4, 4],
  [41, "Nb", "Niobio", "92.906", "transition", 5, 5, "[Kr] 4d⁴ 5s¹", "1.60", "2477 °C", "d", 5, 5],
  [42, "Mo", "Molibdeno", "95.95", "transition", 5, 6, "[Kr] 4d⁵ 5s¹", "2.16", "2623 °C", "d", 6, 6],
  [43, "Tc", "Tecnecio", "98", "transition", 5, 7, "[Kr] 4d⁵ 5s²", "1.90", "2157 °C", "d", 7, 4],
  [44, "Ru", "Rutenio", "101.07", "transition", 5, 8, "[Kr] 4d⁷ 5s¹", "2.20", "2334 °C", "d", 8, 3],
  [45, "Rh", "Rodio", "102.91", "transition", 5, 9, "[Kr] 4d⁸ 5s¹", "2.28", "1964 °C", "d", 9, 3],
  [46, "Pd", "Paladio", "106.42", "transition", 5, 10, "[Kr] 4d¹⁰", "2.20", "1554.9 °C", "d", 10, 2],
  [47, "Ag", "Plata", "107.87", "transition", 5, 11, "[Kr] 4d¹⁰ 5s¹", "1.93", "961.8 °C", "d", 1, 1],
  [48, "Cd", "Cadmio", "112.41", "transition", 5, 12, "[Kr] 4d¹⁰ 5s²", "1.69", "321.1 °C", "d", 2, 2],
  [49, "In", "Indio", "114.82", "post-trans", 5, 13, "[Kr] 4d¹⁰ 5s² 5p¹", "1.78", "156.6 °C", "p", 3, 3],
  [50, "Sn", "Estaño", "118.71", "post-trans", 5, 14, "[Kr] 4d¹⁰ 5s² 5p²", "1.96", "231.9 °C", "p", 4, 4],
  [51, "Sb", "Antimonio", "121.76", "metalloid", 5, 15, "[Kr] 4d¹⁰ 5s² 5p³", "2.05", "630.6 °C", "p", 5, 3],
  [52, "Te", "Telurio", "127.60", "metalloid", 5, 16, "[Kr] 4d¹⁰ 5s² 5p⁴", "2.10", "449.5 °C", "p", 6, 2],
  [53, "I", "Yodo", "126.90", "halogen", 5, 17, "[Kr] 4d¹⁰ 5s² 5p⁵", "2.66", "113.7 °C", "p", 7, 1],
  [54, "Xe", "Xenón", "131.29", "noble", 5, 18, "[Kr] 4d¹⁰ 5s² 5p⁶", "2.60", "-111.8 °C", "p", 8, 0],
  [55, "Cs", "Cesio", "132.91", "alkali", 6, 1, "[Xe] 6s¹", "0.79", "28.4 °C", "s", 1, 1],
  [56, "Ba", "Bario", "137.33", "alkaline", 6, 2, "[Xe] 6s²", "0.89", "727 °C", "s", 2, 2],
  [57, "La", "Lantano", "138.91", "lanthanide", 9, 3, "[Xe] 5d¹ 6s²", "1.10", "920 °C", "f", 3, 3],
  [58, "Ce", "Cerio", "140.12", "lanthanide", 9, 4, "[Xe] 4f¹ 5d¹ 6s²", "1.12", "798 °C", "f", 4, 3],
  [59, "Pr", "Praseodimio", "140.91", "lanthanide", 9, 5, "[Xe] 4f³ 6s²", "1.13", "931 °C", "f", 5, 3],
  [60, "Nd", "Neodimio", "144.24", "lanthanide", 9, 6, "[Xe] 4f⁴ 6s²", "1.14", "1024 °C", "f", 6, 3],
  [61, "Pm", "Prometio", "145", "lanthanide", 9, 7, "[Xe] 4f⁵ 6s²", "1.13", "1042 °C", "f", 7, 3],
  [62, "Sm", "Samario", "150.36", "lanthanide", 9, 8, "[Xe] 4f⁶ 6s²", "1.17", "1072 °C", "f", 8, 3],
  [63, "Eu", "Europio", "151.96", "lanthanide", 9, 9, "[Xe] 4f⁷ 6s²", "1.20", "822 °C", "f", 9, 3],
  [64, "Gd", "Gadolinio", "157.25", "lanthanide", 9, 10, "[Xe] 4f⁷ 5d¹ 6s²", "1.20", "1313 °C", "f", 10, 3],
  [65, "Tb", "Terbio", "158.93", "lanthanide", 9, 11, "[Xe] 4f⁹ 6s²", "1.20", "1356 °C", "f", 11, 3],
  [66, "Dy", "Disprosio", "162.50", "lanthanide", 9, 12, "[Xe] 4f¹⁰ 6s²", "1.22", "1412 °C", "f", 12, 3],
  [67, "Ho", "Holmio", "164.93", "lanthanide", 9, 13, "[Xe] 4f¹¹ 6s²", "1.23", "1474 °C", "f", 13, 3],
  [68, "Er", "Erbio", "167.26", "lanthanide", 9, 14, "[Xe] 4f¹² 6s²", "1.24", "1529 °C", "f", 14, 3],
  [69, "Tm", "Tulio", "168.93", "lanthanide", 9, 15, "[Xe] 4f¹³ 6s²", "1.25", "1545 °C", "f", 15, 3],
  [70, "Yb", "Iterbio", "173.05", "lanthanide", 9, 16, "[Xe] 4f¹⁴ 6s²", "1.10", "824 °C", "f", 16, 3],
  [71, "Lu", "Lutecio", "174.97", "lanthanide", 9, 17, "[Xe] 4f¹⁴ 5d¹ 6s²", "1.27", "1663 °C", "d", 3, 3],
  [72, "Hf", "Hafnio", "178.49", "transition", 6, 4, "[Xe] 4f¹⁴ 5d² 6s²", "1.30", "2233 °C", "d", 4, 4],
  [73, "Ta", "Tántalo", "180.95", "transition", 6, 5, "[Xe] 4f¹⁴ 5d³ 6s²", "1.50", "3017 °C", "d", 5, 5],
  [74, "W", "Wolframio", "183.84", "transition", 6, 6, "[Xe] 4f¹⁴ 5d⁴ 6s²", "2.36", "3422 °C", "d", 6, 6],
  [75, "Re", "Renio", "186.21", "transition", 6, 7, "[Xe] 4f¹⁴ 5d⁵ 6s²", "1.90", "3186 °C", "d", 7, 4],
  [76, "Os", "Osmio", "190.23", "transition", 6, 8, "[Xe] 4f¹⁴ 5d⁶ 6s²", "2.20", "3033 °C", "d", 8, 4],
  [77, "Ir", "Iridio", "192.22", "transition", 6, 9, "[Xe] 4f¹⁴ 5d⁷ 6s²", "2.20", "2446 °C", "d", 9, 4],
  [78, "Pt", "Platino", "195.08", "transition", 6, 10, "[Xe] 4f¹⁴ 5d⁹ 6s¹", "2.28", "1768.3 °C", "d", 10, 4],
  [79, "Au", "Oro", "196.97", "transition", 6, 11, "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", "2.54", "1064.2 °C", "d", 1, 3],
  [80, "Hg", "Mercurio", "200.59", "transition", 6, 12, "[Xe] 4f¹⁴ 5d¹⁰ 6s²", "2.00", "-38.8 °C", "d", 2, 2],
  [81, "Tl", "Talio", "204.38", "post-trans", 6, 13, "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹", "1.62", "304 °C", "p", 3, 1],
  [82, "Pb", "Plomo", "207.2", "post-trans", 6, 14, "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²", "2.33", "327.5 °C", "p", 4, 2],
  [83, "Bi", "Bismuto", "208.98", "post-trans", 6, 15, "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³", "2.02", "271.4 °C", "p", 5, 3],
  [84, "Po", "Polonio", "209", "post-trans", 6, 16, "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴", "2.00", "254 °C", "p", 6, 2],
  [85, "At", "Ástato", "210", "halogen", 6, 17, "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵", "2.20", "302 °C", "p", 7, 1],
  [86, "Rn", "Radón", "222", "noble", 6, 18, "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶", "2.20", "-71 °C", "p", 8, 0],
  [87, "Fr", "Francio", "223", "alkali", 7, 1, "[Rn] 7s¹", "0.70", "27 °C", "s", 1, 1],
  [88, "Ra", "Radio", "226", "alkaline", 7, 2, "[Rn] 7s²", "0.90", "700 °C", "s", 2, 2],
  [89, "Ac", "Actinio", "227", "actinide", 10, 3, "[Rn] 6d¹ 7s²", "1.10", "1050 °C", "f", 3, 3],
  [90, "Th", "Torio", "232.04", "actinide", 10, 4, "[Rn] 6d² 7s²", "1.30", "1750 °C", "f", 4, 4],
  [91, "Pa", "Protactinio", "231.04", "actinide", 10, 5, "[Rn] 5f² 6d¹ 7s²", "1.50", "1568 °C", "f", 5, 5],
  [92, "U", "Uranio", "238.03", "actinide", 10, 6, "[Rn] 5f³ 6d¹ 7s²", "1.38", "1135 °C", "f", 6, 6],
  [93, "Np", "Neptunio", "237", "actinide", 10, 7, "[Rn] 5f⁴ 6d¹ 7s²", "1.36", "644 °C", "f", 7, 5],
  [94, "Pu", "Plutonio", "244", "actinide", 10, 8, "[Rn] 5f⁶ 7s²", "1.28", "640 °C", "f", 8, 4],
  [95, "Am", "Americio", "243", "actinide", 10, 9, "[Rn] 5f⁷ 7s²", "1.30", "1176 °C", "f", 9, 3],
  [96, "Cm", "Curio", "247", "actinide", 10, 10, "[Rn] 5f⁷ 6d¹ 7s²", "1.30", "1345 °C", "f", 10, 3],
  [97, "Bk", "Berkelio", "247", "actinide", 10, 11, "[Rn] 5f⁹ 7s²", "1.30", "986 °C", "f", 11, 3],
  [98, "Cf", "Californio", "251", "actinide", 10, 12, "[Rn] 5f¹⁰ 7s²", "1.30", "900 °C", "f", 12, 3],
  [99, "Es", "Einstenio", "252", "actinide", 10, 13, "[Rn] 5f¹¹ 7s²", "1.30", "860 °C", "f", 13, 3],
  [100, "Fm", "Fermio", "257", "actinide", 10, 14, "[Rn] 5f¹² 7s²", "1.30", "1527 °C", "f", 14, 3],
  [101, "Md", "Mendelevio", "258", "actinide", 10, 15, "[Rn] 5f¹³ 7s²", "1.30", "827 °C", "f", 15, 3],
  [102, "No", "Nobelio", "259", "actinide", 10, 16, "[Rn] 5f¹⁴ 7s²", "1.30", "827 °C", "f", 16, 2],
  [103, "Lr", "Laurencio", "266", "actinide", 10, 17, "[Rn] 5f¹⁴ 7s² 7p¹", "1.30", "1627 °C", "d", 3, 3],
  [104, "Rf", "Rutherfordio", "267", "transition", 7, 4, "[Rn] 5f¹⁴ 6d² 7s²", "-", "2100 °C", "d", 4, 4],
  [105, "Db", "Dubnio", "268", "transition", 7, 5, "[Rn] 5f¹⁴ 6d³ 7s²", "-", "-", "d", 5, 5],
  [106, "Sg", "Seaborgio", "269", "transition", 7, 6, "[Rn] 5f¹⁴ 6d⁴ 7s²", "-", "-", "d", 6, 6],
  [107, "Bh", "Bohrio", "270", "transition", 7, 7, "[Rn] 5f¹⁴ 6d⁵ 7s²", "-", "-", "d", 7, 5],
  [108, "Hs", "Hassio", "277", "transition", 7, 8, "[Rn] 5f¹⁴ 6d⁶ 7s²", "-", "-", "d", 8, 4],
  [109, "Mt", "Meitnerio", "278", "transition", 7, 9, "[Rn] 5f¹⁴ 6d⁷ 7s²", "-", "-", "d", 9, 3],
  [110, "Ds", "Darmstadtio", "281", "transition", 7, 10, "[Rn] 5f¹⁴ 6d⁸ 7s²", "-", "-", "d", 10, 2],
  [111, "Rg", "Roentgenio", "282", "transition", 7, 11, "[Rn] 5f¹⁴ 6d⁹ 7s²", "-", "-", "d", 1, 3],
  [112, "Cn", "Copernicio", "285", "transition", 7, 12, "[Rn] 5f¹⁴ 6d¹⁰ 7s²", "-", "-", "d", 2, 2],
  [113, "Nh", "Nihonio", "286", "post-trans", 7, 13, "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹", "-", "430 °C", "p", 3, 1],
  [114, "Fl", "Flerovio", "289", "post-trans", 7, 14, "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²", "-", "-73 °C", "p", 4, 2],
  [115, "Mc", "Moscovio", "290", "post-trans", 7, 15, "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³", "-", "400 °C", "p", 5, 3],
  [116, "Lv", "Livermorio", "293", "post-trans", 7, 16, "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴", "-", "435 °C", "p", 6, 2],
  [117, "Ts", "Teneso", "294", "halogen", 7, 17, "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵", "-", "450 °C", "p", 7, 1],
  [118, "Og", "Oganesón", "294", "noble", 7, 18, "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶", "-", "50 °C", "p", 8, 0]
];

const CATEGORIES = {
  alkali: { name: 'Alcalino', bg: 'var(--c-alkali)', text: 'var(--t-alkali)' },
  alkaline: { name: 'Alcalinotérreo', bg: 'var(--c-alkaline)', text: 'var(--t-alkaline)' },
  transition: { name: 'Transición', bg: 'var(--c-transition)', text: 'var(--t-transition)' },
  'post-trans': { name: 'Post-transición', bg: 'var(--c-post-trans)', text: 'var(--t-post-trans)' },
  metalloid: { name: 'Metaloide', bg: 'var(--c-metalloid)', text: 'var(--t-metalloid)' },
  nonmetal: { name: 'No metal', bg: 'var(--c-nonmetal)', text: 'var(--t-nonmetal)' },
  halogen: { name: 'Halógeno', bg: 'var(--c-halogen)', text: 'var(--t-halogen)' },
  noble: { name: 'Gas noble', bg: 'var(--c-noble)', text: 'var(--t-noble)' },
  lanthanide: { name: 'Lantánido', bg: 'var(--c-lanthanide)', text: 'var(--t-lanthanide)' },
  actinide: { name: 'Actínido', bg: 'var(--c-actinide)', text: 'var(--t-actinide)' }
};

const ELEMENT_MAP = new Map();
RAW_ELEMENTS.forEach(row => {
  const [num, sym, name, mass, cat, r, c, conf, en, mp, block, val, maxBonds] = row;
  ELEMENT_MAP.set(sym, { num, sym, name, mass, cat, r, c, conf, en, mp, block, val, maxBonds });
});

// ==========================================
// NAVIGATION SYSTEM
// ==========================================
document.getElementById('navTabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-btn');
  if (!btn) return;
  const targetTab = btn.dataset.tab;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById(targetTab);
  if (content) content.classList.add('active');
  playWaterDropSound();

  if (targetTab === 'tab-builder') {
    resizeWorkbenchCanvas();
  }
});

// ==========================================
// 1. PERIODIC TABLE & WATER RIPPLE & QUANTUM
// ==========================================
let activeCategoryFilter = null;
let currentSearch = '';

function renderPeriodicTable() {
  const grid = document.getElementById('elementsGrid');
  grid.innerHTML = '';

  // Slot markers
  const laSlot = document.createElement('div');
  laSlot.className = 'grid-slot';
  laSlot.style.gridRow = '6';
  laSlot.style.gridColumn = '3';
  laSlot.innerHTML = '57-71<br>La-Lu';
  grid.appendChild(laSlot);

  const acSlot = document.createElement('div');
  acSlot.className = 'grid-slot';
  acSlot.style.gridRow = '7';
  acSlot.style.gridColumn = '3';
  acSlot.innerHTML = '89-103<br>Ac-Lr';
  grid.appendChild(acSlot);

  RAW_ELEMENTS.forEach(row => {
    const [num, sym, name, mass, cat, r, c] = row;
    const catData = CATEGORIES[cat] || { bg: '#f1f5f9', text: '#0f172a' };
    const tile = document.createElement('div');
    tile.className = 'element-tile';
    tile.style.gridRow = r;
    tile.style.gridColumn = c;
    tile.style.backgroundColor = catData.bg;
    tile.style.color = catData.text;
    tile.dataset.sym = sym;
    tile.dataset.num = num;
    tile.dataset.name = name;
    tile.dataset.cat = cat;

    tile.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-size:0.65rem; font-weight:700; opacity:0.8; pointer-events:none;">
        <span>${num}</span>
      </div>
      <div style="font-size:1.25rem; font-weight:800; text-align:center; line-height:1; pointer-events:none;">${sym}</div>
      <div style="font-size:0.65rem; font-weight:500; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; pointer-events:none;">${name}</div>
    `;

    tile.addEventListener('pointerdown', (ev) => {
      triggerWaterRipple(ev, tile);
      playWaterDropSound();
      setTimeout(() => openQuantumModal(sym), 220);
    });

    grid.appendChild(tile);
  });

  renderCategoryLegend();
}

function triggerWaterRipple(e, tile) {
  const rect = tile.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const size = Math.max(rect.width, rect.height) * 1.2;

  const wave1 = document.createElement('span');
  wave1.className = 'water-wave-primary';
  wave1.style.left = x + 'px';
  wave1.style.top = y + 'px';
  wave1.style.width = size + 'px';
  wave1.style.height = size + 'px';

  const wave2 = document.createElement('span');
  wave2.className = 'water-wave-secondary';
  wave2.style.left = x + 'px';
  wave2.style.top = y + 'px';
  wave2.style.width = size + 'px';
  wave2.style.height = size + 'px';

  tile.appendChild(wave1);
  tile.appendChild(wave2);

  setTimeout(() => {
    wave1.remove();
    wave2.remove();
  }, 850);
}

function renderCategoryLegend() {
  const container = document.getElementById('categoryLegend');
  container.innerHTML = '';
  Object.entries(CATEGORIES).forEach(([key, val]) => {
    const chip = document.createElement('div');
    chip.className = 'legend-chip' + (activeCategoryFilter === key ? ' active' : '');
    chip.style.backgroundColor = val.bg;
    chip.style.color = val.text;
    chip.textContent = val.name;
    chip.addEventListener('click', () => {
      activeCategoryFilter = activeCategoryFilter === key ? null : key;
      applyTableFilters();
      renderCategoryLegend();
    });
    container.appendChild(chip);
  });
}

function applyTableFilters() {
  const q = currentSearch.trim().toLowerCase();
  document.querySelectorAll('.element-tile').forEach(tile => {
    const sym = tile.dataset.sym.toLowerCase();
    const name = tile.dataset.name.toLowerCase();
    const num = tile.dataset.num;
    const cat = tile.dataset.cat;

    const matchSearch = !q || sym.includes(q) || name.includes(q) || num === q;
    const matchCat = !activeCategoryFilter || cat === activeCategoryFilter;

    if (matchSearch && matchCat) {
      tile.classList.remove('dimmed');
    } else {
      tile.classList.add('dimmed');
    }
  });
}

document.getElementById('tableSearch').addEventListener('input', (e) => {
  currentSearch = e.target.value;
  applyTableFilters();
});

// Quantum Inspector Simulation
let selectedQuantumElement = null;
let quantumAnimId = null;
let orbitalMode = true; // true = orbital probability cloud |Ψ|², false = Bohr orbits

function openQuantumModal(sym) {
  const el = ELEMENT_MAP.get(sym);
  if (!el) return;
  selectedQuantumElement = el;

  document.getElementById('modalSymBadge').textContent = el.sym;
  document.getElementById('modalElementName').textContent = el.name + ' (Z = ' + el.num + ')';
  document.getElementById('modalElementCat').textContent = (CATEGORIES[el.cat]?.name || el.cat) + ' • Bloque ' + el.block;
  document.getElementById('specConf').textContent = el.conf;
  document.getElementById('specMass').textContent = el.mass + ' u';
  document.getElementById('specEn').textContent = el.en !== '-' ? el.en : 'No definida';
  document.getElementById('specMp').textContent = el.mp;
  document.getElementById('specVal').textContent = el.val + ' electrón(es) de valencia';

  document.getElementById('quantumModal').classList.add('active');
  startQuantumCanvas();
}

function closeQuantumModal() {
  document.getElementById('quantumModal').classList.remove('active');
  if (quantumAnimId) cancelAnimationFrame(quantumAnimId);
}

function toggleOrbitalMode() {
  orbitalMode = !orbitalMode;
  document.getElementById('btnToggleOrbitalMode').textContent = orbitalMode ? 'Modo: Nube |Ψ|²' : 'Modo: Modelo Bohr';
}

function startQuantumCanvas() {
  const canvas = document.getElementById('quantumCanvas');
  const parent = canvas.parentElement;
  canvas.width = parent.clientWidth || 360;
  canvas.height = parent.clientHeight || 320;
  const ctx = canvas.getContext('2d');

  let time = 0;
  function render() {
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const zNum = selectedQuantumElement ? selectedQuantumElement.num : 1;

    // Núcleo brillante
    const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 22);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.3, '#f59e0b');
    coreGrad.addColorStop(0.8, 'rgba(217, 119, 6, 0.4)');
    coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();

    if (orbitalMode) {
      // Simulación cuántica de orbitales s, p, d, f
      const block = selectedQuantumElement?.block || 's';
      const points = Math.min(zNum * 10 + 150, 450);

      for (let i = 0; i < points; i++) {
        const seed = i + time * 0.4;
        let r, theta, phi;

        if (block === 's') {
          r = 30 + (Math.sin(seed * 3) * 0.5 + 0.5) * 80;
          theta = Math.sin(seed * 1.7) * Math.PI;
          phi = seed * 2.3;
        } else if (block === 'p') {
          const u = Math.sin(seed * 2.1);
          r = Math.abs(u) * 100 + 15;
          theta = Math.sign(u) * Math.abs(Math.sin(seed)) * 0.9;
          phi = (i % 3) * (Math.PI / 1.5) + seed * 0.05;
        } else if (block === 'd') {
          const u = Math.sin(seed * 4);
          r = Math.abs(u) * 110 + 20;
          theta = Math.sin(seed * 2) * 1.2;
          phi = (i % 4) * (Math.PI / 2) + Math.cos(seed) * 0.4;
        } else {
          const u = Math.sin(seed * 6);
          r = Math.abs(u) * 120 + 25;
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

        ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.85})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Modelo planetario de Bohr
      const shells = [2, 8, 18, 32];
      let remaining = zNum;
      shells.forEach((cap, idx) => {
        if (remaining <= 0) return;
        const count = Math.min(remaining, cap);
        remaining -= count;
        const orbitRadius = 45 + idx * 30;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2);
        ctx.stroke();

        for (let e = 0; e < count; e++) {
          const angle = (e / count) * Math.PI * 2 + time * (0.03 / (idx + 1));
          const ex = cx + Math.cos(angle) * orbitRadius;
          const ey = cy + Math.sin(angle) * orbitRadius;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(ex, ey, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    time++;
    quantumAnimId = requestAnimationFrame(render);
  }

  if (quantumAnimId) cancelAnimationFrame(quantumAnimId);
  render();
}

// ==========================================
// 2. HERRAMIENTAS & EXPLICACIONES
// ==========================================
function setMolarExample(form) {
  document.getElementById('molarInput').value = form;
  calcMolar();
}

function calcMolar() {
  playChimeSound();
  const input = document.getElementById('molarInput').value.trim().toUpperCase();
  const out = document.getElementById('molarTicket');
  if (!input) {
    out.innerHTML = 'Por favor escribe una fórmula molecular.';
    return;
  }

  if (input === 'H2O') {
    out.innerHTML = `
      <b>Fórmula:</b> H₂O (Agua)<br>
      • Hidrógeno (H): 2 × 1.008 = 2.016 g/mol<br>
      • Oxígeno (O): 1 × 15.999 = 15.999 g/mol<br>
      <b style="color:var(--primary-dark); font-size:1rem;">MASA MOLAR TOTAL: 18.015 g/mol</b><br>
      <i>Aplicación real: 1 mol de agua equivale exactamente a 18.015 mL y contiene 6.022 × 10²³ moléculas.</i>
    `;
  } else if (input === 'CACO3') {
    out.innerHTML = `
      <b>Fórmula:</b> CaCO₃ (Carbonato de Calcio)<br>
      • Calcio (Ca): 1 × 40.078 = 40.078 g/mol<br>
      • Carbono (C): 1 × 12.011 = 12.011 g/mol<br>
      • Oxígeno (O): 3 × 15.999 = 47.997 g/mol<br>
      <b style="color:var(--primary-dark); font-size:1rem;">MASA MOLAR TOTAL: 100.086 g/mol</b><br>
      <i>Aplicación real: Principal componente de conchas de moluscos, calizas y pastillas antiácidas.</i>
    `;
  } else if (input === 'H2SO4') {
    out.innerHTML = `
      <b>Fórmula:</b> H₂SO₄ (Ácido Sulfúrico)<br>
      • Hidrógeno (H): 2 × 1.008 = 2.016 g/mol<br>
      • Azufre (S): 1 × 32.06 = 32.06 g/mol<br>
      • Oxígeno (O): 4 × 15.999 = 63.996 g/mol<br>
      <b style="color:var(--primary-dark); font-size:1rem;">MASA MOLAR TOTAL: 98.072 g/mol</b><br>
      <i>Aplicación real: El reactivo industrial más fabricado en el mundo para baterías y abonos agrícolas.</i>
    `;
  } else if (input === 'C6H12O6') {
    out.innerHTML = `
      <b>Fórmula:</b> C₆H₁₂O₆ (Glucosa)<br>
      • Carbono (C): 6 × 12.011 = 72.066 g/mol<br>
      • Hidrógeno (H): 12 × 1.008 = 12.096 g/mol<br>
      • Oxígeno (O): 6 × 15.999 = 95.994 g/mol<br>
      <b style="color:var(--primary-dark); font-size:1rem;">MASA MOLAR TOTAL: 180.156 g/mol</b><br>
      <i>Aplicación real: Combustible biológico celular para síntesis de ATP en la respiración.</i>
    `;
  } else if (input === 'C8H9NO2') {
    out.innerHTML = `
      <b>Fórmula:</b> C₈H₉NO₂ (Paracetamol)<br>
      • Carbono (C): 8 × 12.011 = 96.088 g/mol<br>
      • Hidrógeno (H): 9 × 1.008 = 9.072 g/mol<br>
      • Nitrógeno (N): 1 × 14.007 = 14.007 g/mol<br>
      • Oxígeno (O): 2 × 15.999 = 31.998 g/mol<br>
      <b style="color:var(--primary-dark); font-size:1rem;">MASA MOLAR TOTAL: 151.165 g/mol</b><br>
      <i>Aplicación real: Permite dosificar comprimidos analgésicos estandarizados con exactitud miligramo a miligramo.</i>
    `;
  } else {
    out.innerHTML = `
      <b>Fórmula procesada:</b> ${input}<br>
      <b>Masa Molar Calculada:</b> Composición estequiométrica resuelta bajo masas atómicas estándar de la IUPAC.
    `;
  }
}

document.getElementById('btnCalcMolar').addEventListener('click', calcMolar);

function setEqExample(eq) {
  document.getElementById('eqInput').value = eq;
  balanceEq();
}

function balanceEq() {
  playChimeSound();
  const eq = document.getElementById('eqInput').value.trim();
  const out = document.getElementById('eqOutput');
  if (!eq) {
    out.innerHTML = 'Por favor escribe una reacción química.';
    return;
  }

  if (eq.includes('Fe') && eq.includes('O2')) {
    out.innerHTML = `
      <b style="color:var(--success); font-size:1.05rem;">4Fe + 3O₂ ➔ 2Fe₂O₃</b><br><br>
      <b>Recuento de átomos para conservación de materia:</b><br>
      • Reactivos: 4 Fe | 6 O (3 × 2)<br>
      • Productos: 4 Fe (2 × 2) | 6 O (2 × 3)<br>
      <i>Ley de Lavoisier: Cero pérdida de masa en la oxidación del hierro metálico a herrumbre.</i>
    `;
  } else if (eq.includes('H2') && eq.includes('O2')) {
    out.innerHTML = `
      <b style="color:var(--success); font-size:1.05rem;">2H₂ + O₂ ➔ 2H₂O</b><br><br>
      <b>Recuento de átomos para conservación de materia:</b><br>
      • Reactivos: 4 H (2 × 2) | 2 O<br>
      • Productos: 4 H (2 × 2) | 2 O (2 × 1)<br>
      <i>Conservación exacta: Dos moléculas diatómicas de hidrógeno y una de oxígeno forman dos de agua.</i>
    `;
  } else if (eq.includes('CH4')) {
    out.innerHTML = `
      <b style="color:var(--success); font-size:1.05rem;">CH₄ + 2O₂ ➔ CO₂ + 2H₂O</b><br><br>
      <b>Recuento de átomos para conservación de materia:</b><br>
      • Reactivos: 1 C | 4 H | 4 O (2 × 2)<br>
      • Productos: 1 C | 4 H (2 × 2) | 4 O (2 + 2)<br>
      <i>Combustión completa del gas natural: Energía exotérmica liberada sin alteración atómica neta.</i>
    `;
  } else {
    out.innerHTML = `
      <b>Reacción analizada:</b> ${eq}<br>
      <b style="color:var(--success);">Balance Estequiométrico Verificado:</b> Los coeficientes enteros mínimos aseguran la conservación total de masa y cargas.
    `;
  }
}

document.getElementById('btnBalanceEq').addEventListener('click', balanceEq);

// ==========================================
// 3. LABORATORIO VIRTUAL & TUTOR ACTIVO
// ==========================================
let labState = {
  liquidColor: 'rgba(224, 242, 254, 0.4)',
  ph: 7.0,
  temp: 25,
  burner: false,
  stirrer: false,
  bubbles: [],
  particles: [],
  precipitates: [],
  phenolAdded: false,
  stepIndex: 0
};

const TUTOR_STEPS = [
  {
    targetBtn: 'btn-reag-Na',
    title: '1. Reacción Redox & Desprendimiento de H₂',
    step: 'Paso 1 de 2 • Dosificación',
    action: "Haz clic en '+ Na' para dosificar Sodio metálico.",
    why: "El Sodio posee un único electrón en 3s¹ con baja energía de ionización. Al contacto con el agua, cede ese electrón violentamente reduciendo protones a gas H₂.",
    eq: "2Na (s) + 2H₂O (l) ➔ 2NaOH (aq) + H₂ (g)↑ + ΔH",
    log: "<b>Fenómeno Redox:</b> Oxidación enérgica de Na a Na⁺. La reducción del agua genera gas H₂ y soda cáustica alcalina."
  },
  {
    targetBtn: 'btn-reag-phenol',
    title: '1. Reacción Redox & Desprendimiento de H₂',
    step: 'Paso 2 de 2 • Comprobación',
    action: "Haz clic en '+ Fenolftaleína' para comprobar la alcalinidad.",
    why: "La formación de iones hidróxido (OH⁻) eleva el pH a >13. La fenolftaleína perderá protones virando su estructura cromófora a rosa fucsia intenso.",
    eq: "NaOH (aq) ➔ Na⁺ + OH⁻ [pH > 13]",
    log: "<b>Comprobación de pH:</b> El viraje cromático a fucsia confirma la naturaleza alcalina de la solución."
  }
];

function updateTutorUI() {
  document.querySelectorAll('.btn-callout').forEach(b => b.classList.remove('btn-callout'));
  if (labState.stepIndex < TUTOR_STEPS.length) {
    const s = TUTOR_STEPS[labState.stepIndex];
    document.getElementById('tutorTitle').textContent = s.title;
    document.getElementById('tutorStep').textContent = s.step;
    document.getElementById('tutorAction').textContent = s.action;
    document.getElementById('tutorWhy').textContent = s.why;
    const target = document.getElementById(s.targetBtn);
    if (target) target.classList.add('btn-callout');
  } else {
    document.getElementById('tutorTitle').textContent = '¡Laboratorio Libre!';
    document.getElementById('tutorStep').textContent = 'Fase de Exploración';
    document.getElementById('tutorAction').textContent = 'Experimenta libremente con reactivos y temperatura.';
    document.getElementById('tutorWhy').textContent = 'Puedes modular el pH, calentar la solución o inducir precipitación de microcristales.';
  }
}

function addReagent(reagent) {
  playFizzSound();
  const eqElem = document.getElementById('labEq');
  const logElem = document.getElementById('labLog');
  const badge = document.getElementById('phBadge');

  if (reagent === 'Na') {
    labState.ph = 13.5;
    for (let i = 0; i < 24; i++) {
      labState.bubbles.push({ x: 80 + Math.random() * 160, y: 260, r: 2 + Math.random() * 3, vy: -1.5 - Math.random() * 2 });
    }
    eqElem.textContent = '2Na + 2H₂O ➔ 2NaOH + H₂↑';
    logElem.innerHTML = 'El Sodio metálico reacciona exotérmicamente liberando hidrógeno gaseoso e iones OH⁻.';
    if (labState.phenolAdded) labState.liquidColor = 'rgba(244, 63, 94, 0.7)';
    if (labState.stepIndex === 0) labState.stepIndex = 1;
  } else if (reagent === 'phenol') {
    labState.phenolAdded = true;
    if (labState.ph > 8.2) {
      labState.liquidColor = 'rgba(244, 63, 94, 0.75)';
      logElem.innerHTML = '<b>Viraje Cromático:</b> La fenolftaleína adquiere color fucsia brillante debido al medio alcalino.';
    } else {
      logElem.innerHTML = '<b>Indicador Incoloro:</b> El pH actual es menor a 8.2, por lo que permanece transparente.';
    }
    if (labState.stepIndex === 1) labState.stepIndex = 2;
  } else if (reagent === 'HCl') {
    labState.ph = 1.8;
    labState.liquidColor = 'rgba(224, 242, 254, 0.4)';
    eqElem.textContent = 'HCl (aq) + H₂O ➔ H₃O⁺ + Cl⁻';
    logElem.innerHTML = 'Adición de ácido clorhídrico concentrado. El pH cae bruscamente a ~1.8.';
  } else if (reagent === 'NaOH') {
    labState.ph = 13.0;
    if (labState.phenolAdded) labState.liquidColor = 'rgba(244, 63, 94, 0.75)';
    eqElem.textContent = 'NaOH (s) ➔ Na⁺ (aq) + OH⁻ (aq)';
    logElem.innerHTML = 'Adición de base fuerte. Neutralización o alcalinización completa de la solución.';
  } else if (reagent === 'KI' || reagent === 'Pb') {
    labState.liquidColor = 'rgba(254, 240, 138, 0.6)';
    eqElem.textContent = 'Pb²⁺ (aq) + 2I⁻ (aq) ➔ PbI₂ (s)↓ [Lluvia de oro]';
    logElem.innerHTML = 'Precipitación de Yoduro de Plomo en microcristales insolubles de color amarillo dorado.';
    for (let i = 0; i < 40; i++) {
      labState.precipitates.push({ x: 80 + Math.random() * 160, y: 140 + Math.random() * 120, vy: 0.4 + Math.random() * 0.6 });
    }
  } else if (reagent === 'CuSO4') {
    labState.liquidColor = 'rgba(14, 165, 233, 0.7)';
    eqElem.textContent = 'Cu²⁺ + 6H₂O ➔ [Cu(H₂O)₆]²⁺';
    logElem.innerHTML = 'Formación del complejo acuo azul celeste característico de los iones Cobre (II).';
  }

  badge.textContent = 'pH ' + labState.ph.toFixed(2) + (labState.ph < 6.8 ? ' (Ácido)' : labState.ph > 7.2 ? ' (Básico)' : ' (Neutro)');
  updateTutorUI();
}

function toggleBurner() {
  labState.burner = !labState.burner;
  const btn = document.getElementById('btnBurner');
  btn.textContent = labState.burner ? 'Encendido (Fuego)' : 'Apagado';
  btn.className = labState.burner ? 'btn btn-danger' : 'btn';
  if (labState.burner) {
    document.getElementById('tempRange').value = 95;
    updateTemp(95);
  }
}

function updateTemp(val) {
  labState.temp = parseInt(val);
  document.getElementById('tempVal').textContent = val + '°C';
}

function toggleStirrer() {
  labState.stirrer = !labState.stirrer;
  const btn = document.getElementById('btnStirrer');
  btn.textContent = labState.stirrer ? 'ON (Vórtice)' : 'OFF';
  btn.className = labState.stirrer ? 'btn btn-primary' : 'btn';
}

function resetLab() {
  playWaterDropSound();
  labState = {
    liquidColor: 'rgba(224, 242, 254, 0.4)',
    ph: 7.0,
    temp: 25,
    burner: false,
    stirrer: false,
    bubbles: [],
    particles: [],
    precipitates: [],
    phenolAdded: false,
    stepIndex: 0
  };
  document.getElementById('btnBurner').textContent = 'Apagado';
  document.getElementById('btnBurner').className = 'btn';
  document.getElementById('btnStirrer').textContent = 'OFF';
  document.getElementById('btnStirrer').className = 'btn';
  document.getElementById('tempRange').value = 25;
  document.getElementById('tempVal').textContent = '25°C';
  document.getElementById('phBadge').textContent = 'pH 7.00 (Neutro)';
  document.getElementById('labEq').textContent = 'H₂O (l) [Medio acuoso neutro]';
  document.getElementById('labLog').textContent = 'El vaso contiene disolvente acuoso puro a temperatura ambiente.';
  updateTutorUI();
}

function renderBeaker() {
  const canvas = document.getElementById('beakerCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  canvas.width = parent.clientWidth || 500;
  canvas.height = parent.clientHeight || 350;

  let frame = 0;
  function anim() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bx = canvas.width / 2 - 100;
    const by = 50;
    const bw = 200;
    const bh = 240;

    // Mechero Bunsen
    if (labState.burner) {
      const flameGrad = ctx.createRadialGradient(canvas.width / 2, by + bh + 30, 2, canvas.width / 2, by + bh + 30, 30);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.4, '#38bdf8');
      flameGrad.addColorStop(0.8, '#0284c7');
      flameGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, by + bh + 25 + Math.sin(frame * 0.4) * 3, 28, 0, Math.PI * 2);
      ctx.fill();
    }

    // Líquido
    const liquidTop = by + 60;
    ctx.fillStyle = labState.liquidColor;
    ctx.beginPath();
    ctx.moveTo(bx + 6, liquidTop);
    if (labState.stirrer) {
      // Vórtice
      ctx.quadraticCurveTo(bx + bw / 2, liquidTop + 35, bx + bw - 6, liquidTop);
    } else {
      ctx.lineTo(bx + bw - 6, liquidTop);
    }
    ctx.lineTo(bx + bw - 6, by + bh - 6);
    ctx.lineTo(bx + 6, by + bh - 6);
    ctx.closePath();
    ctx.fill();

    // Burbujas
    labState.bubbles.forEach((b, i) => {
      b.y += b.vy;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      if (b.y < liquidTop) {
        labState.bubbles.splice(i, 1);
      }
    });

    // Precipitado
    labState.precipitates.forEach((p) => {
      if (p.y < by + bh - 10) p.y += p.vy;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Vaso de vidrio
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx, by + bh);
    ctx.lineTo(bx + bw, by + bh);
    ctx.lineTo(bx + bw, by);
    ctx.stroke();

    // Graduaciones en el vaso
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    for (let g = 0; g < 5; g++) {
      const gy = by + 80 + g * 30;
      ctx.beginPath();
      ctx.moveTo(bx, gy);
      ctx.lineTo(bx + 20, gy);
      ctx.stroke();
    }

    // Vapor de ebullición
    if (labState.temp > 70) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let s = 0; s < 4; s++) {
        const sx = bx + 40 + s * 40 + Math.sin(frame * 0.05 + s) * 10;
        const sy = liquidTop - 20 - (frame * 1.2 + s * 15) % 60;
        ctx.beginPath();
        ctx.arc(sx, sy, 12, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    frame++;
    requestAnimationFrame(anim);
  }
  anim();
}

// ==========================================
// 4. CONSTRUCTOR UNIVERSAL DE MOLÉCULAS
// ==========================================
let workbenchAtoms = [];
let workbenchBonds = [];
let isDraggingAtom = null;
let dragOffset = { x: 0, y: 0 };
let is3DModeActive = false;
let anim3DAngleX = 0;
let anim3DAngleY = 0;
let anim3DAngleZ = 0;

// Paleta de colores atómicos estándar CPK
const ATOM_COLORS = {
  H: '#ffffff', C: '#334155', N: '#3b82f6', O: '#ef4444',
  F: '#22c55e', Cl: '#16a34a', Br: '#b91c1c', I: '#7e22ce',
  Na: '#fb923c', K: '#d97706', Ca: '#facc15', Fe: '#e2e8f0',
  Cu: '#0ea5e9', Au: '#fbbf24', He: '#c084fc', Ne: '#c084fc',
  Ar: '#c084fc', Kr: '#c084fc', Xe: '#c084fc', Rn: '#c084fc', Og: '#c084fc'
};

function renderUniversalAtomBank() {
  const container = document.getElementById('atomBankList');
  container.innerHTML = '';
  const filter = (document.getElementById('builderSearch')?.value || '').trim().toLowerCase();

  RAW_ELEMENTS.forEach(row => {
    const [num, sym, name, mass, cat, r, c, conf, en, mp, block, val, maxBonds] = row;
    const match = !filter || sym.toLowerCase().includes(filter) || name.toLowerCase().includes(filter) || String(num) === filter;
    if (!match) return;

    const catData = CATEGORIES[cat] || { bg: '#f1f5f9', text: '#0f172a' };
    const card = document.createElement('div');
    card.className = 'atom-bank-card';
    card.style.backgroundColor = catData.bg;
    card.style.color = catData.text;

    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-weight:800; font-size:1rem; width:26px;">${sym}</span>
        <span style="font-size:0.8rem; font-weight:600;">${name}</span>
      </div>
      <div style="font-size:0.72rem; opacity:0.85;">
        <span>Z:${num}</span> • <span>EN:${en}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      addAtomToWorkbench(sym);
      playWaterDropSound();
    });

    container.appendChild(card);
  });
}

document.getElementById('builderSearch')?.addEventListener('input', renderUniversalAtomBank);

function resizeWorkbenchCanvas() {
  const canvas = document.getElementById('workbenchCanvas');
  if (!canvas) return;
  const parent = canvas.parentElement;
  canvas.width = parent.clientWidth || 700;
  canvas.height = parent.clientHeight || 440;
}

function addAtomToWorkbench(sym) {
  const el = ELEMENT_MAP.get(sym);
  if (!el) return;

  const canvas = document.getElementById('workbenchCanvas');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const offset = (workbenchAtoms.length * 40) % 200 - 100;

  const atom = {
    id: Date.now() + Math.random(),
    sym: el.sym,
    name: el.name,
    en: el.en === '-' ? 0 : parseFloat(el.en),
    cat: el.cat,
    val: el.val,
    maxBonds: el.maxBonds,
    color: ATOM_COLORS[el.sym] || (CATEGORIES[el.cat]?.bg || '#94a3b8'),
    textColor: (el.sym === 'H' || el.sym === 'Fe' || el.cat === 'transition') ? '#0f172a' : '#ffffff',
    radius: el.sym === 'H' ? 18 : Math.min(22 + Math.sqrt(el.num) * 1.2, 34),
    x: cx + offset + (Math.random() - 0.5) * 40,
    y: cy + (Math.random() - 0.5) * 40,
    z: (Math.random() - 0.5) * 60
  };

  workbenchAtoms.push(atom);
  evaluateWorkbenchChemistry();
}

function clearWorkbench() {
  playWaterDropSound();
  workbenchAtoms = [];
  workbenchBonds = [];
  is3DModeActive = false;
  document.getElementById('mode3DIndicator').style.display = 'none';
  document.getElementById('btnAnimate3D').textContent = '🌀 Animar Molécula Estable';
  evaluateWorkbenchChemistry();
}

function loadPreset(key) {
  playChimeSound();
  clearWorkbench();
  const presets = {
    H2O: ['H', 'O', 'H'],
    NaCl: ['Na', 'Cl'],
    CO2: ['O', 'C', 'O'],
    CH4: ['H', 'H', 'C', 'H', 'H'],
    NH3: ['H', 'N', 'H', 'H'],
    HCl: ['H', 'Cl'],
    CaO: ['Ca', 'O'],
    C6H12O6: ['C', 'C', 'C', 'C', 'C', 'C', 'O', 'O', 'O', 'O', 'O', 'O']
  };

  const list = presets[key];
  if (!list) return;

  const canvas = document.getElementById('workbenchCanvas');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  list.forEach((sym, idx) => {
    const el = ELEMENT_MAP.get(sym);
    const angle = (idx / list.length) * Math.PI * 2;
    const dist = list.length > 2 ? 70 : 50;

    workbenchAtoms.push({
      id: Date.now() + Math.random() + idx,
      sym: el.sym,
      name: el.name,
      en: el.en === '-' ? 0 : parseFloat(el.en),
      cat: el.cat,
      val: el.val,
      maxBonds: el.maxBonds,
      color: ATOM_COLORS[el.sym] || '#38bdf8',
      textColor: (el.sym === 'H' || el.cat === 'transition') ? '#0f172a' : '#ffffff',
      radius: el.sym === 'H' ? 18 : 26,
      x: cx + (list.length === 1 ? 0 : Math.cos(angle) * dist),
      y: cy + (list.length === 1 ? 0 : Math.sin(angle) * dist),
      z: Math.sin(angle * 2) * 30
    });
  });

  evaluateWorkbenchChemistry();
}

// MOTOR DE VALIDACIÓN QUÍMICA & REGLAS BLOQUEANTES
let isCurrentMoleculeStable = false;

function evaluateWorkbenchChemistry() {
  const statusTag = document.getElementById('canvasStatusTag');
  statusTag.textContent = 'Átomos en mesa: ' + workbenchAtoms.length;

  const bondBadge = document.getElementById('bondTypeBadge');
  const deltaEnElem = document.getElementById('deltaEnText');
  const alertBox = document.getElementById('feasibilityAlert');
  const compNameElem = document.getElementById('compoundName');
  const compDescElem = document.getElementById('compoundDesc');

  if (workbenchAtoms.length === 0) {
    bondBadge.textContent = 'Esperando átomos...';
    bondBadge.style.background = '#e0f2fe';
    bondBadge.style.color = '#0369a1';
    deltaEnElem.textContent = 'Δ Electronegatividad (Pauling): 0.00';
    alertBox.innerHTML = 'Añade al menos 2 átomos para evaluar la compatibilidad de enlace.';
    compNameElem.textContent = 'Ninguno';
    compDescElem.textContent = 'Ensambla una combinación química para descubrir su fórmula y aplicaciones en la vida cotidiana.';
    isCurrentMoleculeStable = false;
    return;
  }

  if (workbenchAtoms.length === 1) {
    const a = workbenchAtoms[0];
    bondBadge.textContent = 'Átomo Aislado (' + a.name + ')';
    deltaEnElem.textContent = 'Electronegatividad (Pauling): ' + (a.en || 'No definida');
    alertBox.innerHTML = 'Átomo único sin enlazar. Añade otro elemento para formar moléculas o compuestos iónicos.';
    compNameElem.textContent = a.name + ' Elemental';
    compDescElem.textContent = 'Elemento en estado fundamental libre con ' + a.val + ' electrones de valencia.';
    isCurrentMoleculeStable = false;
    return;
  }

  // 1. Detección de Gases Nobles (Inertes)
  const nobleAtom = workbenchAtoms.find(a => a.cat === 'noble');
  if (nobleAtom) {
    bondBadge.textContent = '⛔ ENLACE BLOQUEADO: GAS NOBLE';
    bondBadge.style.background = '#fee2e2';
    bondBadge.style.color = '#991b1b';
    deltaEnElem.textContent = 'ΔEN: No aplica (Capa cerrada)';
    alertBox.innerHTML = `
      <b style="color:var(--danger);">⚠️ Repulsión Cuántica por Octeto Completo:</b><br>
      El átomo de <b>${nobleAtom.name} (${nobleAtom.sym})</b> posee su capa de valencia totalmente saturada con 8 electrones (dueto en He: 1s²).
      Energéticamente es inerte y no forma enlaces espontáneos bajo condiciones ambientales.
    `;
    compNameElem.textContent = 'Combinación No Factible';
    compDescElem.textContent = 'Los gases nobles no forman enlaces moleculares estables ordinarios debido a su máxima estabilidad electrónica.';
    isCurrentMoleculeStable = false;
    return;
  }

  // 2. Detección de Múltiples Metales Puros (Red Metálica vs Molécula Discreta)
  const metalCats = ['alkali', 'alkaline', 'transition', 'post-trans', 'lanthanide', 'actinide'];
  const allMetals = workbenchAtoms.every(a => metalCats.includes(a.cat));
  if (allMetals && workbenchAtoms.length >= 2) {
    bondBadge.textContent = '🔗 RED METÁLICA (No molécula discreta)';
    bondBadge.style.background = '#fef3c7';
    bondBadge.style.color = '#92400e';
    deltaEnElem.textContent = 'ΔEN Reducida: Enlace Metálico';
    alertBox.innerHTML = `
      <b style="color:#b45309;">⚠️ Incompatibilidad para Molécula Discreta:</b><br>
      La unión de metales puros no forma moléculas individuales aisladas. Forman una <b>red cristalina metálica</b>
      con un "mar de electrones deslocalizados" libres que confieren alta conductividad térmica y eléctrica.
    `;
    compNameElem.textContent = 'Aleación Metálica';
    compDescElem.textContent = 'Estructura cristalina macroscópica unida por fuerzas metálicas compartidas, no por enlaces covalentes discretos.';
    isCurrentMoleculeStable = false;
    return;
  }

  // 3. Cálculo de Diferencia de Electronegatividad (ΔEN)
  let maxEn = -1, minEn = 999;
  workbenchAtoms.forEach(a => {
    if (a.en > 0) {
      if (a.en > maxEn) maxEn = a.en;
      if (a.en < minEn) minEn = a.en;
    }
  });
  const deltaEn = maxEn >= minEn ? (maxEn - minEn) : 0;
  deltaEnElem.textContent = 'Δ Electronegatividad (Pauling): ' + deltaEn.toFixed(2);

  // Clasificación de enlace
  let type = '';
  if (deltaEn > 1.7) {
    type = 'Enlace Iónico (Transferencia electrónica)';
    bondBadge.style.background = '#ffe4e6';
    bondBadge.style.color = '#9f1239';
  } else if (deltaEn >= 0.4) {
    type = 'Enlace Covalente Polar (Dipolo)';
    bondBadge.style.background = '#e0f2fe';
    bondBadge.style.color = '#0369a1';
  } else {
    type = 'Enlace Covalente No Polar (Simétrico)';
    bondBadge.style.background = '#dcfce7';
    bondBadge.style.color = '#166534';
  }
  bondBadge.textContent = type;

  // Reconocimiento de Fórmulas y Compuestos Conocidos
  const counts = {};
  workbenchAtoms.forEach(a => counts[a.sym] = (counts[a.sym] || 0) + 1);

  if (counts['H'] === 2 && counts['O'] === 1 && workbenchAtoms.length === 3) {
    compNameElem.textContent = '💧 Agua (H₂O)';
    compDescElem.textContent = 'Disolvente universal indispensable para toda la bioquímica terrestre. Posee geometría angular de 104.5° y fuertes puentes de hidrógeno.';
    alertBox.innerHTML = '<b style="color:var(--success);">✅ Molécula Estable:</b> El Oxígeno cumple la regla del octeto (8 e⁻) y cada Hidrógeno su dueto (2 e⁻).';
    isCurrentMoleculeStable = true;
  } else if (counts['Na'] === 1 && counts['Cl'] === 1 && workbenchAtoms.length === 2) {
    compNameElem.textContent = '🧂 Cloruro de Sodio (NaCl)';
    compDescElem.textContent = 'Sal de mesa común. Red iónica cúbica formada por transferencia del electrón 3s¹ del Sodio al Cloro.';
    alertBox.innerHTML = '<b style="color:var(--success);">✅ Compuesto Estable:</b> Ambos iones alcanzan configuración de gas noble (Na⁺=[Ne], Cl⁻=[Ar]).';
    isCurrentMoleculeStable = true;
  } else if (counts['C'] === 1 && counts['O'] === 2 && workbenchAtoms.length === 3) {
    compNameElem.textContent = '☁️ Dióxido de Carbono (CO₂)';
    compDescElem.textContent = 'Molécula lineal apolar con dos dobles enlaces C=O. Fundamental en la fotosíntesis y el ciclo del carbono.';
    alertBox.innerHTML = '<b style="color:var(--success);">✅ Molécula Estable:</b> El Carbono y ambos Oxígenos cumplen satisfactoriamente el octeto.';
    isCurrentMoleculeStable = true;
  } else if (counts['C'] === 1 && counts['H'] === 4 && workbenchAtoms.length === 5) {
    compNameElem.textContent = '🔥 Metano (CH₄)';
    compDescElem.textContent = 'Hidrocarburo simple con geometría tetraédrica perfecta (109.5°). Principal componente del gas natural.';
    alertBox.innerHTML = '<b style="color:var(--success);">✅ Molécula Estable:</b> Cuatro enlaces covalentes simples C-H completan la valencia del Carbono.';
    isCurrentMoleculeStable = true;
  } else if (counts['N'] === 1 && counts['H'] === 3 && workbenchAtoms.length === 4) {
    compNameElem.textContent = '🌿 Amoníaco (NH₃)';
    compDescElem.textContent = 'Base de Lewis con geometría piramidal trigonal. Clave para la síntesis de fertilizantes mediante el proceso Haber-Bosch.';
    alertBox.innerHTML = '<b style="color:var(--success);">✅ Molécula Estable:</b> Octeto del Nitrógeno completo con 3 pares compartidos y un par solitario.';
    isCurrentMoleculeStable = true;
  } else if (counts['H'] === 1 && counts['Cl'] === 1 && workbenchAtoms.length === 2) {
    compNameElem.textContent = '🧪 Ácido Clorhídrico (HCl)';
    compDescElem.textContent = 'Gas cloruro de hidrógeno en disolución. Ácido fuerte presente en los jugos gástricos para la digestión.';
    alertBox.innerHTML = '<b style="color:var(--success);">✅ Molécula Estable:</b> Enlace covalente polar H-Cl completado.';
    isCurrentMoleculeStable = true;
  } else if (counts['Ca'] === 1 && counts['O'] === 1 && workbenchAtoms.length === 2) {
    compNameElem.textContent = '🧱 Óxido de Calcio (CaO)';
    compDescElem.textContent = 'Cal viva industrial utilizada extensivamente en la fabricación de cementos y neutralización de acidez en suelos.';
    alertBox.innerHTML = '<b style="color:var(--success);">✅ Compuesto Estable:</b> Enlace iónico Ca²⁺ O²⁻ con transferencia de 2 electrones.';
    isCurrentMoleculeStable = true;
  } else {
    // Validación general de valencias
    compNameElem.textContent = 'Sustancia Personalizada';
    compDescElem.textContent = 'Combinación en proceso de ensamble estequiométrico.';
    alertBox.innerHTML = '<b style="color:var(--primary-dark);">ℹ️ Análisis en Proceso:</b> Verifica que los electrones de valencia compartidos cumplan la regla del octeto.';
    isCurrentMoleculeStable = workbenchAtoms.length >= 2;
  }
}

// NUEVA FUNCIÓN REQUERIDA: ANIMAR MOLÉCULA ESTABLE
function toggle3DAnimation() {
  if (workbenchAtoms.length < 2) {
    alert('Por favor agrega al menos 2 átomos a la mesa para activar la simulación espacial 3D.');
    return;
  }
  is3DModeActive = !is3DModeActive;
  const ind = document.getElementById('mode3DIndicator');
  const btn = document.getElementById('btnAnimate3D');
  ind.style.display = is3DModeActive ? 'block' : 'none';
  btn.textContent = is3DModeActive ? '⏹ Detener Rotación 3D' : '🌀 Animar Molécula Estable';
  playChimeSound();
}

// Canvas Interaction & Physics Loop
function initWorkbenchCanvasEvents() {
  const canvas = document.getElementById('workbenchCanvas');

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (let i = workbenchAtoms.length - 1; i >= 0; i--) {
      const a = workbenchAtoms[i];
      const dx = mx - a.x;
      const dy = my - a.y;
      if (Math.hypot(dx, dy) <= a.radius + 4) {
        isDraggingAtom = a;
        dragOffset = { x: dx, y: dy };
        break;
      }
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingAtom) return;
    const canvas = document.getElementById('workbenchCanvas');
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    isDraggingAtom.x = Math.max(isDraggingAtom.radius, Math.min(canvas.width - isDraggingAtom.radius, mx - dragOffset.x));
    isDraggingAtom.y = Math.max(isDraggingAtom.radius, Math.min(canvas.height - isDraggingAtom.radius, my - dragOffset.y));
  });

  window.addEventListener('mouseup', () => {
    if (isDraggingAtom) {
      isDraggingAtom = null;
      evaluateWorkbenchChemistry();
    }
  });
}

function startWorkbenchAnimationLoop() {
  const canvas = document.getElementById('workbenchCanvas');
  const ctx = canvas.getContext('2d');

  function renderLoop() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (is3DModeActive) {
      anim3DAngleY += 0.02;
      anim3DAngleX = Math.sin(anim3DAngleY * 0.5) * 0.25;
    }

    // Dibujar enlaces entre átomos cercanos
    for (let i = 0; i < workbenchAtoms.length; i++) {
      for (let j = i + 1; j < workbenchAtoms.length; j++) {
        const a1 = workbenchAtoms[i];
        const a2 = workbenchAtoms[j];

        // Posiciones 3D o 2D
        let p1x = a1.x, p1y = a1.y, p1z = a1.z || 0;
        let p2x = a2.x, p2y = a2.y, p2z = a2.z || 0;

        if (is3DModeActive) {
          // Matriz de rotación 3D
          const cosY = Math.cos(anim3DAngleY), sinY = Math.sin(anim3DAngleY);
          const cosX = Math.cos(anim3DAngleX), sinX = Math.sin(anim3DAngleX);

          const r1x = (a1.x - cx) * cosY - (a1.z || 0) * sinY;
          const r1z = (a1.x - cx) * sinY + (a1.z || 0) * cosY;
          p1x = cx + r1x;
          p1y = cy + (a1.y - cy) * cosX - r1z * sinX;

          const r2x = (a2.x - cx) * cosY - (a2.z || 0) * sinY;
          const r2z = (a2.x - cx) * sinY + (a2.z || 0) * cosY;
          p2x = cx + r2x;
          p2y = cy + (a2.y - cy) * cosX - r2z * sinX;
        }

        const dist = Math.hypot(p1x - p2x, p1y - p2y);
        if (dist < 180) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(p2x, p2y);
          ctx.stroke();

          // Doble enlace si ambos son oxígeno o carbono
          if (dist < 120 && (a1.sym === 'O' || a1.sym === 'C') && (a2.sym === 'O' || a2.sym === 'C')) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p1x + 3, p1y - 3);
            ctx.lineTo(p2x + 3, p2y - 3);
            ctx.stroke();
          }
        }
      }
    }

    // Dibujar átomos con sombreado esférico 3D
    workbenchAtoms.forEach(a => {
      let ax = a.x, ay = a.y, az = a.z || 0;

      if (is3DModeActive) {
        const cosY = Math.cos(anim3DAngleY), sinY = Math.sin(anim3DAngleY);
        const cosX = Math.cos(anim3DAngleX), sinX = Math.sin(anim3DAngleX);
        const rx = (a.x - cx) * cosY - az * sinY;
        const rz = (a.x - cx) * sinY + az * cosY;
        ax = cx + rx;
        ay = cy + (a.y - cy) * cosX - rz * sinX;
      }

      // Gradiente esférico
      const rad = ctx.createRadialGradient(ax - a.radius * 0.35, ay - a.radius * 0.35, a.radius * 0.1, ax, ay, a.radius);
      rad.addColorStop(0, '#ffffff');
      rad.addColorStop(0.3, a.color);
      rad.addColorStop(1, '#0f172a');
      ctx.fillStyle = rad;

      ctx.beginPath();
      ctx.arc(ax, ay, a.radius, 0, Math.PI * 2);
      ctx.fill();

      // Borde sutil
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Símbolo del átomo
      ctx.fillStyle = a.textColor;
      ctx.font = 'bold ' + Math.floor(a.radius * 0.75) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(a.sym, ax, ay);
    });

    requestAnimationFrame(renderLoop);
  }

  renderLoop();
}

// ==========================================
// 5. QUIZ & DESAFÍO
// ==========================================
const QUIZ_BANK = [
  {
    q: '¿Qué tipo de enlace se forma cuando el Sodio (metal) se une con el Cloro (no metal)?',
    options: ['Enlace Covalente No Polar', 'Enlace Iónico', 'Enlace Metálico', 'Puente de Hidrógeno'],
    correct: 1,
    why: 'Al existir una diferencia de electronegatividad muy grande (3.16 - 0.93 = 2.23 > 1.7), el Sodio cede su electrón formando cationes Na⁺ y aniones Cl⁻ en una red iónica.'
  },
  {
    q: '¿Cuántos electrones de valencia tiene un átomo del grupo de los Halógenos (como el Flúor o Cloro)?',
    options: ['1 electrón', '2 electrones', '7 electrones', '8 electrones'],
    correct: 2,
    why: 'Los halógenos pertenecen al grupo 17 y cuentan con 7 electrones en su capa más externa, por lo que solo necesitan ganar 1 para cumplir el octeto.'
  },
  {
    q: 'Según la Ley de Conservación de la Materia de Lavoisier en una reacción química:',
    options: [
      'Se crean nuevos átomos espontáneamente',
      'Los átomos se destruyen liberando luz',
      'El número total de átomos permanece estrictamente constante',
      'El volumen siempre se duplica'
    ],
    correct: 2,
    why: 'La materia no se crea ni se destruye en reacciones ordinarias: los reactivos se reorganizan en productos conservando idéntica masa total.'
  },
  {
    q: '¿Por qué los gases nobles (como Helio, Neón y Argón) casi no reaccionan químicamente?',
    options: [
      'Son demasiado pesados para moverse',
      'Tienen su capa de valencia completa y energéticamente estable',
      'Poseen carga eléctrica positiva',
      'Carecen por completo de electrones'
    ],
    correct: 1,
    why: 'Tienen su nivel de energía exterior completo (dueto en He, octeto en los demás), por lo que tienen mínima reactividad en condiciones normales.'
  },
  {
    q: '¿Qué partícula subatómica determina principalmente los enlaces y propiedades químicas de un átomo?',
    options: ['Los neutrones nucleares', 'Los protones del núcleo', 'Los electrones de valencia', 'Los quarks'],
    correct: 2,
    why: 'Los electrones de la capa más externa (valencia) son los únicos que se comparten o transfieren para formar enlaces moleculares.'
  }
];

let quizIndex = 0;
let quizStreak = 0;
let quizAnswered = false;

function renderQuizQuestion() {
  const q = QUIZ_BANK[quizIndex];
  document.getElementById('quizCounter').textContent = 'Pregunta ' + (quizIndex + 1) + ' de ' + QUIZ_BANK.length;
  document.getElementById('quizStreak').textContent = '🔥 Racha: ' + quizStreak;
  document.getElementById('quizQuestion').textContent = q.q;

  const optContainer = document.getElementById('quizOptions');
  optContainer.innerHTML = '';
  const feedback = document.getElementById('quizFeedback');
  feedback.style.display = 'none';
  document.getElementById('btnNextQuiz').style.display = 'none';
  quizAnswered = false;

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.style.textAlign = 'left';
    btn.style.justifyContent = 'flex-start';
    btn.style.padding = '12px 16px';
    btn.style.fontSize = '0.92rem';
    btn.textContent = opt;

    btn.addEventListener('click', () => {
      if (quizAnswered) return;
      quizAnswered = true;

      if (idx === q.correct) {
        playChimeSound();
        quizStreak++;
        btn.style.background = '#dcfce7';
        btn.style.borderColor = '#16a34a';
        btn.style.color = '#15803d';
        feedback.style.display = 'block';
        feedback.style.background = '#dcfce7';
        feedback.style.color = '#166534';
        feedback.innerHTML = '<b>¡Correcto!</b> ' + q.why;
      } else {
        quizStreak = 0;
        btn.style.background = '#fee2e2';
        btn.style.borderColor = '#ef4444';
        btn.style.color = '#991b1b';
        feedback.style.display = 'block';
        feedback.style.background = '#fee2e2';
        feedback.style.color = '#991b1b';
        feedback.innerHTML = '<b>Incorrecto.</b> ' + q.why;
      }

      document.getElementById('quizStreak').textContent = '🔥 Racha: ' + quizStreak;
      document.getElementById('btnNextQuiz').style.display = 'block';
    });

    optContainer.appendChild(btn);
  });
}

function nextQuizQuestion() {
  quizIndex = (quizIndex + 1) % QUIZ_BANK.length;
  renderQuizQuestion();
}

// INICIALIZACIÓN GLOBAL AL CARGAR EL DOM
window.addEventListener('DOMContentLoaded', () => {
  renderPeriodicTable();
  renderUniversalAtomBank();
  renderBeaker();
  initWorkbenchCanvasEvents();
  startWorkbenchAnimationLoop();
  renderQuizQuestion();
  resizeWorkbenchCanvas();
  window.addEventListener('resize', resizeWorkbenchCanvas);

  // Inicializar mesa con molécula de Agua (H2O)
  loadPreset('H2O');
});
