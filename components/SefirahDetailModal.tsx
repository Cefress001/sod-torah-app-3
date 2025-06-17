import React from 'react';
import { SefirahModalState } from '../types';

interface SefirahDetailModalProps {
  modalState: SefirahModalState;
  onClose: () => void;
}

const SefirahDetailModal: React.FC<SefirahDetailModalProps> = ({ modalState, onClose }) => {
  if (!modalState.visible || !modalState.data) {
    return null;
  }

  const { displayName, corePrinciple, divineName, associatedMiddot, baseColorName } = modalState.data;
  const borderColorClass = `border-${baseColorName}-500`; // Needs Tailwind JIT to pick this up

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center z-40 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sefirahDetailTitle"
    >
      <div 
        className={`bg-slate-900 p-6 sm:p-8 border ${borderColorClass} border-t-4 rounded-xl shadow-2xl w-full max-w-md relative text-indigo-100 font-cardo animate-fadeIn max-h-[90vh] overflow-y-auto content-scroll`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-4 text-indigo-400 hover:text-yellow-400 text-3xl font-sans transition-colors duration-200 z-10"
          aria-label="Close Sefirah detail"
        >
          &times;
        </button>
        <h3 id="sefirahDetailTitle" className={`font-cinzel text-2xl sm:text-3xl text-${baseColorName}-400 text-center mb-6`}>
          {displayName}
        </h3>
        {corePrinciple && <p className="mb-3 text-base sm:text-lg leading-relaxed"><strong className={`text-${baseColorName}-300`}>Core Principle:</strong> {corePrinciple}</p>}
        {divineName && <p className="mb-3 text-base sm:text-lg leading-relaxed"><strong className={`text-${baseColorName}-300`}>Divine Name:</strong> {divineName}</p>}
        {associatedMiddot && associatedMiddot.length > 0 && (
          <div className="mb-3">
            <strong className={`text-${baseColorName}-300 text-base sm:text-lg`}>Associated Middot (Virtues):</strong>
            <ul className="list-disc list-inside ml-4 text-indigo-200 text-sm sm:text-base">
              {associatedMiddot.map(middah => <li key={middah}>{middah}</li>)}
            </ul>
          </div>
        )}
         <p className="text-xs text-indigo-400 text-center mt-6">Tap outside or use '×' to close.</p>
      </div>
    </div>
  );
};

export default SefirahDetailModal;
