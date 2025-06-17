
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Page, SefirahInfo, PathInfo, FlowData, CardData, SefirahDisplayState, SefirahName, 
  PathModalState, SefirahModalState, GlossaryTerm, TooltipState, 
  SefirahQualitativeState, SefirahVisualEffect, PathDisplayState, PathQualitativeState, PathVisualEffect
} from '../types';
import TreeOfLifeSVG from '../components/TreeOfLifeSVG';
import Modal from '../components/Modal'; 
import SefirahDetailModal from '../components/SefirahDetailModal'; 
import CardDetailModal from '../components/CardDetailModal'; 
import Tooltip from '../components/Tooltip';
import { SEFIROT_DATA, PATHS_DATA, ALL_CARDS, GLOSSARY_TERMS } from '../constants';

interface CompassPageProps {
  onNavigate: (page: Page) => void;
}

const initializeSefirotStatesForCompass = (): Record<SefirahName, SefirahDisplayState> => {
  const states = {} as Record<SefirahName, SefirahDisplayState>;
  SEFIROT_DATA.forEach(sef => {
    states[sef.id] = {
      qualitativeState: SefirahQualitativeState.Neutral,
      visualEffect: SefirahVisualEffect.None,
      currentFillClass: sef.defaultFillClass,
      currentStrokeClass: sef.defaultStrokeClass,
      animationClass: '',
      opacityClass: 'opacity-100',
      tooltipContent: `${sef.displayName} (Neutral)`
    };
  });
  return states;
};

const initializePathStatesForCompass = (): Record<string, PathDisplayState> => {
  const states = {} as Record<string, PathDisplayState>;
  PATHS_DATA.forEach(path => {
    states[path.id] = {
      qualitativeState: PathQualitativeState.Neutral,
      visualEffect: PathVisualEffect.None,
      currentStrokeClass: 'stroke-indigo-700 opacity-50', // Default neutral path for compass
      animationClass: '',
      strokeDasharray: undefined, 
      tooltipContent: `${path.tooltip} (Neutral)` 
    };
  });
  return states;
};


const CompassPage: React.FC<CompassPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'tree' | 'cards' | 'glossary'>('tree');
  const [sefirahStates, setSefirahStates] = useState<Record<SefirahName, SefirahDisplayState>>(initializeSefirotStatesForCompass());
  const [pathStates, setPathStates] = useState<Record<string, PathDisplayState>>(initializePathStatesForCompass());
  const [pathModal, setPathModal] = useState<PathModalState>({ visible: false, data: null });
  const [sefirahModal, setSefirahModal] = useState<SefirahModalState>({visible: false, data: null });
  const [cardModal, setCardModal] = useState<{visible: boolean, data: CardData | null}>({visible: false, data: null});
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, content: '', x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  const handlePathClick = useCallback((flowData: FlowData) => {
    setPathModal({ visible: true, data: flowData });
  }, []);

  const handleSefirahClick = useCallback((sefirahData: SefirahInfo) => {
    setSefirahModal({ visible: true, data: sefirahData });
  }, []);
  
  const handleCardClick = useCallback((cardData: CardData) => {
    setCardModal({ visible: true, data: cardData });
  }, []);

  const handlePathMouseEnter = (event: React.MouseEvent, path: PathInfo) => {
    let content = path.tooltip;
    if (path.textureDescription) content += `\nTexture: ${path.textureDescription}`;
    setTooltip({ visible: true, content, x: event.clientX + 15, y: event.clientY - 10, type: 'path' });
  };
  const handlePathMouseMove = (event: React.MouseEvent) => {
    if (tooltip.visible) setTooltip(prev => ({ ...prev, x: event.clientX + 15, y: event.clientY - 10 }));
  };
  const handlePathMouseLeave = () => setTooltip(prev => ({ ...prev, visible: false }));

  const filteredCards = ALL_CARDS.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.keywords?.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredGlossaryTerms = GLOSSARY_TERMS.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="p-2 sm:p-4 h-full flex flex-col text-indigo-100 bg-slate-950">
      <h1 className="font-cinzel text-2xl sm:text-3xl text-yellow-300 text-center mb-4">The Compass</h1>
      
      <div className="flex justify-center mb-4 border-b border-indigo-700">
        {(['tree', 'cards', 'glossary'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-cinzel text-sm sm:text-base transition-colors duration-200
                        ${activeTab === tab ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-indigo-300 hover:text-yellow-300'}`}
          >
            {tab === 'tree' ? 'Tree Explorer' : tab === 'cards' ? 'Card Library' : 'Glossary'}
          </button>
        ))}
      </div>

      {(activeTab === 'cards' || activeTab === 'glossary') && (
         <input 
            type="text"
            placeholder={`Search ${activeTab === 'cards' ? 'Cards' : 'Glossary'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto p-2 mb-4 rounded bg-slate-800 border border-indigo-600 text-indigo-100 focus:ring-yellow-400 focus:border-yellow-400"
        />
      )}

      {activeTab === 'tree' && (
        <div className="flex-grow w-full max-w-2xl mx-auto aspect-[400/600]">
          <TreeOfLifeSVG 
            sefirahStates={sefirahStates}
            pathStates={pathStates}
            onPathClick={handlePathClick}
            onSefirahClick={handleSefirahClick}
            // For Sefirah tooltips on Compass (if desired, currently only path tooltips are active)
            // onSefirahMouseEnter={(e, sef) => setTooltip({ visible: true, content: sefirahStates[sef.id]?.tooltipContent || sef.displayName, x: e.clientX + 15, y: e.clientY - 10, type: 'sefirah'})}
            onPathMouseEnter={handlePathMouseEnter}
            onPathMouseMove={handlePathMouseMove}
            onElementMouseLeave={handlePathMouseLeave} // Renamed from onPathMouseLeave for clarity if Sefirah hovers were added
            interactivePaths={true}
            interactiveSefirot={true}
          />
        </div>
      )}

      {activeTab === 'cards' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 p-2 overflow-y-auto flex-grow content-scroll">
          {filteredCards.map(card => (
            <button 
                key={card.id} 
                onClick={() => handleCardClick(card)}
                className="p-3 bg-slate-800 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 text-left focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <h3 className="font-cinzel text-sm sm:text-base text-yellow-300 mb-1 truncate">{card.name}</h3>
              {/* Placeholder for card image or icon */}
              <p className="text-xs text-indigo-300 line-clamp-2">{card.description || "Details available."}</p>
            </button>
          ))}
           {filteredCards.length === 0 && <p className="col-span-full text-center text-indigo-300">No cards match your search.</p>}
        </div>
      )}

      {activeTab === 'glossary' && (
        <div className="overflow-y-auto flex-grow p-2 space-y-3 content-scroll">
          {filteredGlossaryTerms.map(term => (
            <div key={term.term} className="p-3 bg-slate-800 rounded-lg shadow-md">
              <h3 className="font-cinzel text-base sm:text-lg text-yellow-300">{term.term}</h3>
              <p className="text-sm text-indigo-200 leading-relaxed">{term.definition}</p>
              {term.relatedSefirah && <p className="text-xs text-indigo-400 mt-1">Related to: {term.relatedSefirah}</p>}
            </div>
          ))}
          {filteredGlossaryTerms.length === 0 && <p className="text-center text-indigo-300">No terms match your search.</p>}
        </div>
      )}
      
      <Tooltip tooltipState={tooltip} />
      <Modal modalState={pathModal} onClose={() => setPathModal({ visible: false, data: null })} />
      <SefirahDetailModal modalState={sefirahModal} onClose={() => setSefirahModal({visible:false, data:null})} />
      <CardDetailModal modalState={cardModal} onClose={() => setCardModal({visible:false, data:null})} />
    </div>
  );
};

export default CompassPage;
