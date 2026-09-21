export interface ChemicalElement {
  num: number;
  sym: string;
  name: string;
  mass: string;
  cat: string;
  r: number;
  c: number;
  cfg: string;
  en: string;
  m: string;
  block: string;
  shells: number[];
}

export interface CategoryInfo {
  name: string;
  bg: string;
  text: string;
}

export type ActiveTab = 'tab-table' | 'tab-tools' | 'tab-lab' | 'tab-builder' | 'tab-quiz';

export interface LabParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  type: 'steam' | 'h2' | 'co2';
}

export interface PrecipitateParticle {
  x: number;
  size: number;
  color: string;
}

export interface GuidedStep {
  stepNum: string;
  action: string;
  why: string;
  requiredType: 'reagent' | 'phenol' | 'stirrer' | 'burner';
  requiredValue?: string | boolean;
  calloutId?: string;
  eq: string;
  log: string;
}

export interface GuidedExperiment {
  title: string;
  subtitle: string;
  steps: GuidedStep[];
}

export interface WorkbenchAtom {
  sym: string;
  name: string;
  en: number;
  valence: number;
  color: string;
  textColor: string;
  radius: number;
  x: number;
  y: number;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  why: string;
}
