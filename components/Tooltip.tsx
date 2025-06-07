import React from 'react';
import { TooltipState } from '../types';

interface TooltipProps {
  tooltipState: TooltipState;
}

const Tooltip: React.FC<TooltipProps> = ({ tooltipState }) => {
  if (!tooltipState.visible) {
    return null;
  }

  const positionClasses = `left-[${tooltipState.x}px] top-[${tooltipState.y}px]`;
  
  // Determine colors based on where the tooltip is likely to appear
  // For Tree (dark bg), use light text. For Scroll (parchment bg), use dark text.
  const isOverTree = tooltipState.type === 'sefirah' || tooltipState.type === 'path';
  const colorClasses = isOverTree 
    ? 'bg-slate-900/90 text-white border-yellow-400' 
    : 'bg-slate-100/95 text-slate-800 border-slate-700';


  return (
    <div
      className={`fixed ${positionClasses} z-50 ${colorClasses} px-3 py-2 rounded text-sm shadow-lg pointer-events-none transition-opacity duration-150 ease-in-out ${tooltipState.visible ? 'opacity-100' : 'opacity-0'} max-w-md whitespace-pre-line`}
      role="tooltip"
    >
      {tooltipState.content}
    </div>
  );
};

export default Tooltip;
