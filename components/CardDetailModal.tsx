
import React from 'react';
import { CardData, SefirahName, SefirahQualitativeState } from '../types'; 
import { SEFIROT_DATA } from '../constants'; 

interface CardDetailModalProps {
  modalState: { visible: boolean; data: CardData | null };
  onClose: () => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ modalState, onClose }) => {
  if (!modalState.visible || !modalState.data) {
    return null;
  }

  const { name, description, sefirah, vessel, klipah_warning, keywords, primarySefirahTone } = modalState.data;
  const primarySefirahInfo = SEFIROT_DATA.find(s => s.id === primarySefirahTone);

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center z-40 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cardDetailTitle"
    >
      <div 
        className="bg-slate-900 p-6 sm:p-8 border border-yellow-400 rounded-xl shadow-2xl w-full max-w-lg relative text-indigo-100 font-cardo animate-fadeIn max-h-[90vh] overflow-y-auto content-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-4 text-indigo-400 hover:text-yellow-400 text-3xl font-sans transition-colors duration-200 z-10"
          aria-label="Close card detail"
        >
          &times;
        </button>
        <h3 id="cardDetailTitle" className="font-cinzel text-2xl sm:text-3xl text-yellow-400 text-center mb-6">
          {name}
        </h3>
        
        {description && <p className="mb-4 text-base sm:text-lg leading-relaxed">{description}</p>}
        
        {klipah_warning && (
            <p className="mb-4 p-3 bg-red-900/30 border-l-4 border-red-500 rounded text-red-200 text-sm">
                <strong className="font-bold">Klipah Warning:</strong> {klipah_warning}
            </p>
        )}

        <div className="mb-4">
            <strong className="text-yellow-300">Primary Sefirot:</strong>
            <ul className="list-disc list-inside ml-4 text-indigo-200 text-sm">
                {sefirah.map(sefId => {
                    const sefInfo = SEFIROT_DATA.find(s => s.id === sefId);
                    const state = vessel?.[sefId] || SefirahQualitativeState.Neutral;
                    return (
                        <li key={sefId}>
                            {sefInfo?.displayName || sefId}
                            {state !== SefirahQualitativeState.Neutral && <span className="italic text-indigo-400"> ({state})</span>}
                            {sefId === primarySefirahTone && <span className="text-yellow-200 font-bold"> (Primary Tone)</span>}
                        </li>
                    );
                })}
            </ul>
        </div>
        
        {keywords && keywords.length > 0 && (
            <p className="text-sm text-indigo-300 mb-4">
                <strong className="text-yellow-300">Keywords:</strong> {keywords.join(', ')}
            </p>
        )}
        
        {/* Placeholder for GSMT v5.0 specific fields like sound_cue_id, haptic_feedback_pattern if they were to be displayed */}
        {/* <p className="text-xs text-indigo-400">Sound Cue: {sound_cue_id || 'N/A'}</p> */}

        <p className="text-xs text-indigo-400 text-center mt-6">Tap outside or use '×' to close.</p>
      </div>
    </div>
  );
};

export default CardDetailModal;
