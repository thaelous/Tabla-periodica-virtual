import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { playBurnerClick, playChimeSound } from '../utils/audio';

const quizBank: QuizQuestion[] = [
  {
    q: '¿Qué tipo de enlace se forma cuando el Sodio (metal) se une con el Cloro (no metal)?',
    options: ['Enlace Covalente No Polar', 'Enlace Iónico', 'Enlace Metálico', 'Puente de Hidrógeno'],
    correct: 1,
    why: 'Al tener una diferencia de electronegatividad muy grande (3.16 - 0.93 = 2.23 > 1.7), el Sodio cede su electrón y se forma un enlace iónico.'
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
      'Se crean nuevos átomos',
      'Los átomos se destruyen',
      'El número total de átomos permanece constante',
      'El volumen siempre aumenta'
    ],
    correct: 2,
    why: 'La materia no se crea ni se destruye en reacciones químicas ordinarias: los átomos únicamente se reordenan para formar nuevas moléculas.'
  },
  {
    q: '¿Por qué los gases nobles (como Helio, Neón y Argón) casi no reaccionan con otros elementos?',
    options: [
      'Son muy pesados',
      'Ya tienen su capa de valencia completa y estable',
      'Tienen carga positiva',
      'No tienen electrones'
    ],
    correct: 1,
    why: 'Tienen su nivel de energía completo (dueto en el He, octeto en los demás), por lo que poseen máxima estabilidad química.'
  },
  {
    q: '¿Qué partícula subatómica determina principalmente las propiedades químicas y los enlaces de un átomo?',
    options: ['Los neutrones', 'Los protones del núcleo', 'Los electrones de valencia', 'Los mesones'],
    correct: 2,
    why: 'Los electrones de la capa más externa (valencia) son los únicos que interactúan, se comparten o se transfieren para formar enlaces.'
  }
];

export const QuizTab: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = quizBank[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedAnswer(idx);
    setIsAnswered(true);

    if (idx === currentItem.correct) {
      playChimeSound();
      setStreak(prev => prev + 1);
    } else {
      playBurnerClick();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizBank.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setStreak(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsFinished(false);
  };

  return (
    <section id="tab-quiz" className="block w-full">
      <div className="mx-auto flex max-w-[760px] flex-col gap-4">
        <div className="rounded-[18px] border border-[#e2e8f0] bg-white p-7 text-center shadow-[0_4px_14px_-2px_rgba(0,0,0,0.05)]">
          {!isFinished ? (
            <>
              <div className="mb-3.5 flex items-center justify-between">
                <span className="text-[0.85rem] font-bold text-[#64748b]" id="quizQuestionCount">
                  Pregunta {currentIndex + 1} de {quizBank.length}
                </span>
                <div
                  className="rounded-[20px] bg-[#fef3c7] px-3 py-1 text-[0.85rem] font-extrabold text-[#b45309]"
                  id="streakBadge"
                >
                  🔥 Racha: {streak}
                </div>
              </div>

              <h2 className="mb-5 text-[1.3rem] font-bold text-[#0f172a]" id="quizQuestionText">
                {currentItem.q}
              </h2>

              <div id="quizOptionsContainer" className="flex flex-col gap-2.5">
                {currentItem.options.map((opt, idx) => {
                  let optClasses =
                    'cursor-pointer rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4.5 py-3.5 text-[0.95rem] font-semibold text-[#1e293b] transition-all hover:border-[#0ea5e9] hover:bg-[#f0f9ff]';

                  if (isAnswered) {
                    if (idx === currentItem.correct) {
                      optClasses =
                        'rounded-xl border !border-[#22c55e] !bg-[#dcfce7] px-4.5 py-3.5 text-[0.95rem] font-semibold !text-[#15803d]';
                    } else if (idx === selectedAnswer) {
                      optClasses =
                        'rounded-xl border !border-[#ef4444] !bg-[#fee2e2] px-4.5 py-3.5 text-[0.95rem] font-semibold !text-[#b91c1c]';
                    }
                  }

                  return (
                    <div
                      key={idx}
                      className={optClasses}
                      style={{ pointerEvents: isAnswered ? 'none' : 'auto' }}
                      onClick={() => handleSelectOption(idx)}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>

              {isAnswered && (
                <div
                  className={`mt-4 rounded-[10px] p-3 text-[0.9rem] font-bold ${
                    selectedAnswer === currentItem.correct
                      ? 'bg-[#dcfce7] text-[#15803d]'
                      : 'bg-[#fee2e2] text-[#b91c1c]'
                  }`}
                  id="quizFeedback"
                >
                  {selectedAnswer === currentItem.correct ? '✔ ¡Correcto! ' : '✘ Incorrecto. '}
                  {currentItem.why}
                </div>
              )}

              {isAnswered && (
                <button
                  className="mt-4 cursor-pointer rounded-lg border-none bg-[#0ea5e9] px-4 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90"
                  id="btnNextQuestion"
                  onClick={handleNext}
                >
                  Siguiente Pregunta ➔
                </button>
              )}
            </>
          ) : (
            <>
              <div className="mb-3.5 text-[0.85rem] font-bold text-[#64748b]">¡Cuestionario Completado!</div>
              <h2 className="mb-5 text-[1.3rem] font-bold text-[#0f172a]">
                ¡Excelente trabajo! Lograste una racha final de {streak} aciertos.
              </h2>
              <button
                className="cursor-pointer rounded-lg border-none bg-[#0ea5e9] px-4 py-2 text-[0.85rem] font-bold text-white transition-opacity hover:opacity-90"
                onClick={handleRestart}
              >
                Reiniciar Desafío
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
