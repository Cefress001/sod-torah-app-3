import React from 'react';
import { PathModalState } from '../types'; // Updated type import

interface PathInfoModalProps { // Renamed props interface
  modalState: PathModalState;
  onClose: () => void;
}

const PathInfoModal: React.FC<PathInfoModalProps> = ({ modalState, onClose }) => {
  if (!modalState.visible || !modalState.data) {
    return null;
  }

  const { from, to, interpretation, tikun, source } = modalState.data;

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center z-40 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pathModalTitle"
    >
      <div 
        className="bg-slate-900 p-6 sm:p-8 border border-yellow-400 rounded-xl shadow-2xl w-full max-w-lg relative text-indigo-100 font-cardo animate-fadeIn max-h-[90vh] overflow-y-auto content-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-4 text-indigo-400 hover:text-yellow-400 text-3xl font-sans transition-colors duration-200 z-10"
          aria-label="Close path information"
        >
          &times;
        </button>
        <h3 id="pathModalTitle" className="font-cinzel text-2xl sm:text-3xl text-yellow-400 text-center mb-6">
          Path: {from} &harr; {to}
        </h3>
        <p className="mb-4 text-base sm:text-lg leading-relaxed">{interpretation}</p>
        <p className="mb-4 text-base sm:text-lg leading-relaxed">
          <strong className="text-yellow-400 font-bold">General Tikkun:</strong> {tikun}
        </p>
        
        <p className="text-sm sm:text-base text-center mt-8">
          <em className="text-indigo-400">Source: {source}</em>
        </p>
      </div>
    </div>
  );
};

export default PathInfoModal; // Renamed export
