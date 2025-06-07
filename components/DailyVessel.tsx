import React from 'react';
import { DailyVesselData } from '../types';
import { SEFIROT_DATA } from '../constants'; 

interface DailyVesselProps {
  vessel: DailyVesselData;
}

const DailyVessel: React.FC<DailyVesselProps> = ({ vessel }) => {
  const relatedSefirahInfo = vessel.related_sefirah 
    ? SEFIROT_DATA.find(s => s.id === vessel.related_sefirah) 
    : null;
  
  // Using a consistent style for the vessel card border for simplicity.
  // Dynamic class concatenation like `border-${relatedSefirahInfo.baseColorName}-500` can be tricky with Tailwind JIT
  // unless those full class names are whitelisted or exist elsewhere.

  return (
    <div className="bg-slate-800 p-3 sm:p-4 rounded-lg shadow-lg border-l-4 border-yellow-400">
      <h3 className="font-cinzel text-lg sm:text-xl text-yellow-300 mb-1">Daily Vessel of Focus</h3>
      <p className="font-bold text-indigo-100 text-base sm:text-lg">{vessel.name}</p>
      <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">{vessel.description}</p>
      {relatedSefirahInfo && (
        <p className="text-xs text-indigo-400 mt-1">Related to: {relatedSefirahInfo.displayName}</p>
      )}
    </div>
  );
};

export default DailyVessel;
