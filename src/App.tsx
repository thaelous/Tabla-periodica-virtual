/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { LabTab } from './components/LabTab';
import { MoleculeBuilderTab } from './components/MoleculeBuilderTab';
import { PeriodicTableTab } from './components/PeriodicTableTab';
import { QuantumInspectorModal } from './components/QuantumInspectorModal';
import { QuizTab } from './components/QuizTab';
import { ToolsTab } from './components/ToolsTab';
import { ActiveTab, ChemicalElement } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tab-table');
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f5f9] text-[#0f172a]">
      <Header activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="mx-auto w-full max-w-[1440px] flex-1 p-5">
        {activeTab === 'tab-table' && (
          <PeriodicTableTab onSelectElement={el => setSelectedElement(el)} />
        )}
        {activeTab === 'tab-tools' && <ToolsTab />}
        {activeTab === 'tab-lab' && <LabTab />}
        {activeTab === 'tab-builder' && <MoleculeBuilderTab />}
        {activeTab === 'tab-quiz' && <QuizTab />}
      </main>

      <QuantumInspectorModal
        element={selectedElement}
        onClose={() => setSelectedElement(null)}
      />
    </div>
  );
}
