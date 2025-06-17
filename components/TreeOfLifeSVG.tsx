
import React from 'react';
import { SEFIROT_DATA, PATHS_DATA } from '../constants';
import { SefirahInfo, PathInfo, SefirahDisplayState, PathDisplayState, CardData, FlowData, SefirahName } from '../types';

interface TreeOfLifeSVGProps {
  sefirahStates: Record<SefirahName, SefirahDisplayState>;
  pathStates: Record<string, PathDisplayState>; 
  currentCard?: CardData | null;
  onPathClick?: (flowData: FlowData) => void; 
  onSefirahClick?: (sefirahData: SefirahInfo) => void; 
  
  onSefirahMouseEnter?: (event: React.MouseEvent, sefirah: SefirahInfo) => void;
  onPathMouseEnter?: (event: React.MouseEvent, path: PathInfo) => void;
  onPathMouseMove?: (event: React.MouseEvent, path: PathInfo) => void; // Added
  onElementMouseLeave?: () => void; 

  interactivePaths?: boolean; 
  interactiveSefirot?: boolean; 
}

const TreeOfLifeSVG: React.FC<TreeOfLifeSVGProps> = ({
  sefirahStates,
  pathStates,
  currentCard,
  onPathClick,
  onSefirahClick,
  onSefirahMouseEnter,
  onPathMouseEnter,
  onPathMouseMove, // Destructured
  onElementMouseLeave,
  interactivePaths = true,
  interactiveSefirot = true,
}) => {
  return (
    <svg
      id="tree-of-life-svg"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
    >
      <g id="paths">
        {PATHS_DATA.map((path) => {
          const pathState = pathStates[path.id];
          const baseStrokeClass = pathState?.currentStrokeClass || 'stroke-indigo-700 opacity-50';
          const animation = pathState?.animationClass || '';
          const dashArray = pathState?.strokeDasharray;

          return (
            <path
              key={path.id}
              id={path.id}
              className={`fill-none ${baseStrokeClass} stroke-[1.5px] transition-all duration-300 ease-in-out ${animation} 
                          ${interactivePaths && (onPathClick || onPathMouseEnter || onPathMouseMove) ? 'hover:stroke-yellow-400 hover:stroke-[3px] cursor-pointer' : 'pointer-events-none'}`}
              d={path.d}
              strokeDasharray={dashArray}
              onMouseEnter={interactivePaths && onPathMouseEnter ? (e) => onPathMouseEnter(e, path) : undefined}
              onMouseMove={interactivePaths && onPathMouseMove ? (e) => onPathMouseMove(e, path) : undefined}
              onMouseLeave={interactivePaths && (onPathMouseEnter || onPathMouseMove) && onElementMouseLeave ? onElementMouseLeave : undefined}
              onClick={interactivePaths && onPathClick ? () => onPathClick(path.flow) : undefined}
              aria-label={path.tooltip}
            />
          );
        })}
      </g>
      <g id="sefirot">
        {SEFIROT_DATA.map((sefirah: SefirahInfo) => {
          const stateDetails = sefirahStates[sefirah.id];
          let dynamicStrokeClass = stateDetails?.currentStrokeClass || sefirah.defaultStrokeClass;
          const fillClass = stateDetails?.currentFillClass || sefirah.defaultFillClass;
          const animation = stateDetails?.animationClass || '';
          const opacity = stateDetails?.opacityClass || 'opacity-100';


          return (
            <g
              key={sefirah.id}
              id={sefirah.id}
              className={`transition-all duration-400 ease-in-out ${opacity} 
                          ${interactiveSefirot && (onSefirahClick || onSefirahMouseEnter) ? 'cursor-pointer' : 'pointer-events-none'}`}
              role="img"
              aria-label={`${sefirah.displayName} - State: ${stateDetails?.qualitativeState || 'default'}`}
              onClick={interactiveSefirot && onSefirahClick ? () => onSefirahClick(sefirah) : undefined}
              onMouseEnter={interactiveSefirot && onSefirahMouseEnter ? (e) => onSefirahMouseEnter(e, sefirah) : undefined}
              onMouseLeave={interactiveSefirot && onSefirahMouseEnter && onElementMouseLeave ? onElementMouseLeave : undefined}
            >
              <circle
                cx={sefirah.cx}
                cy={sefirah.cy}
                r={sefirah.r}
                className={`${fillClass} ${dynamicStrokeClass} stroke-2 ${animation} origin-center`}
              />
              <text
                x={sefirah.textX}
                y={sefirah.textY}
                className="text-xs sm:text-sm fill-indigo-100 font-cinzel font-bold text-anchor-middle pointer-events-none select-none"
                dominantBaseline="middle"
              >
                {sefirah.displayName.split(" ")[0]}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default TreeOfLifeSVG;
