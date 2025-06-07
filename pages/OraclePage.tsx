
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { 
    Page, OracleSessionState, CardData, SefirahName, 
    SefirahDisplayState, PathDisplayState, OracleRevelationStep, TreeInstruction, ParsedAIResponse, ParsedAIPhrase,
    SefirahQualitativeState, SefirahVisualEffect, PathQualitativeState, PathVisualEffect, TooltipState
} from '../types';
import { 
    EXAMPLE_CARD, ALL_CARDS, SEFIROT_DATA, PATHS_DATA, SEFIRAH_TONES,
    SEFIRAH_EFFECT_CLASSES, PATH_EFFECT_CLASSES, SEFIRAH_STATE_FILL_CLASSES, PATH_STATE_STROKE_CLASSES
} from '../constants';
import TreeOfLifeSVG from '../components/TreeOfLifeSVG';
import Tooltip from '../components/Tooltip';

interface OraclePageProps {
  kavanah: string;
  onNavigate: (page: Page) => void;
}

const initializeSefirahDisplayStates = (): Record<SefirahName, SefirahDisplayState> => {
  const states = {} as Record<SefirahName, SefirahDisplayState>;
  SEFIROT_DATA.forEach(sef => {
    states[sef.id] = {
      qualitativeState: SefirahQualitativeState.Neutral,
      visualEffect: SefirahVisualEffect.None,
      currentFillClass: sef.defaultFillClass,
      currentStrokeClass: sef.defaultStrokeClass,
      animationClass: '',
      opacityClass: 'opacity-70', // Dimmer for background
      tooltipContent: `${sef.displayName} (Neutral)`
    };
  });
  return states;
};

const initializePathDisplayStates = (): Record<string, PathDisplayState> => {
    const states = {} as Record<string, PathDisplayState>;
    PATHS_DATA.forEach(path => {
        states[path.id] = {
            qualitativeState: PathQualitativeState.Neutral,
            visualEffect: PathVisualEffect.None,
            currentStrokeClass: 'stroke-indigo-700 opacity-50', // Default neutral path
            animationClass: '',
            strokeDasharray: undefined, // PathInfo doesn't have visualEffect; initial display visualEffect is None.
            tooltipContent: `${path.tooltip} (Neutral)`
        };
    });
    return states;
};

const OraclePage: React.FC<OraclePageProps> = ({ kavanah, onNavigate }) => {
  const [session, setSession] = useState<OracleSessionState>({
    kavanah: kavanah || "Guidance for my path.",
    card: null,
    currentRevelationStep: OracleRevelationStep.Initial,
    parsedResponse: null,
    isLoading: false,
    error: null,
  });
  const [sefirahStates, setSefirahStates] = useState<Record<SefirahName, SefirahDisplayState>>(initializeSefirahDisplayStates());
  const [pathStates, setPathStates] = useState<Record<string, PathDisplayState>>(initializePathDisplayStates());
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, content: '', x: 0, y: 0, type: undefined });
  
  const interpretationAreaRef = useRef<HTMLDivElement>(null);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const drawCard = useCallback(() => {
    const drawnCard = ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)] || EXAMPLE_CARD;
    setSession(prev => ({ 
        ...prev, 
        card: drawnCard, 
        currentRevelationStep: OracleRevelationStep.Initial, 
        parsedResponse: null, 
        error: null,
        isLoading: false, // Reset loading state
    }));
    // Reset tree states to neutral
    setSefirahStates(initializeSefirahDisplayStates());
    setPathStates(initializePathDisplayStates());
  }, []);

  useEffect(() => {
    if (!session.card && kavanah) { // Only draw if kavanah is present (meaning user came from Altar)
      drawCard();
    }
  }, [session.card, kavanah, drawCard]);

  const parseAIResponse = (responseText: string): ParsedAIResponse | null => {
    try {
        const phase1Match = responseText.match(/<Phase1>([\s\S]*?)<\/Phase1>/);
        const phase2Match = responseText.match(/<Phase2>([\s\S]*?)<\/Phase2>/);
        const phase3Match = responseText.match(/<Phase3>([\s\S]*?)<\/Phase3>/);

        if (!phase1Match || !phase2Match || !phase3Match) {
            console.error("Failed to parse all phases from AI response.");
            return null;
        }
        
        const parsePhaseContent = (phaseText: string): ParsedAIPhrase => {
            const instructions: TreeInstruction[] = [];
            let currentText = phaseText;

            const instructionRegex = /<Tree_Instruction\s+([^>]*?)\s*\/>/g;
            let match;
            
            // Remove instructions from text and store them
            currentText = currentText.replace(instructionRegex, (fullMatch, attributesString) => {
                const attrs = attributesString.match(/(\w+)="([^"]*)"/g);
                if (attrs) {
                    const instruction: Partial<TreeInstruction> & {targetType?: string} = {};
                    attrs.forEach((attr:string) => {
                        const [_, key, value] = attr.match(/(\w+)="([^"]*)"/) || [];
                        if (key === 'sefirah') {
                            instruction.type = 'sefirah';
                            instruction.target = value as SefirahName;
                        } else if (key === 'path') {
                            instruction.type = 'path';
                            instruction.target = value; // Path ID like "Sefirah1-Sefirah2"
                        } else if (key === 'state') {
                            instruction.qualitativeState = value as SefirahQualitativeState | PathQualitativeState;
                        } else if (key === 'effect') {
                            instruction.visualEffect = value as SefirahVisualEffect | PathVisualEffect;
                        }
                    });
                    if(instruction.type && instruction.target && instruction.qualitativeState && instruction.visualEffect){
                       instructions.push(instruction as TreeInstruction);
                    }
                }
                return ''; // Remove the tag from the text
            });
            
            return { text: currentText.trim(), instructions };
        };

        return {
            phase1: parsePhaseContent(phase1Match[1]),
            phase2: parsePhaseContent(phase2Match[1]),
            phase3: parsePhaseContent(phase3Match[1]),
        };
    } catch (e) {
        console.error("Error parsing AI response:", e);
        return null;
    }
  };
  
  const handleBeginInterpretation = useCallback(async () => {
    if (!session.card) {
      setSession(prev => ({ ...prev, error: "No card drawn for interpretation." }));
      return;
    }
    
    setSession(prev => ({ ...prev, isLoading: true, error: null, currentRevelationStep: OracleRevelationStep.Initial, parsedResponse: null }));
    setSefirahStates(initializeSefirahDisplayStates()); // Reset tree for new interpretation
    setPathStates(initializePathDisplayStates());

    const masterPrompt = `
OBJECTIVE:
To function as "HaMefaresh HaPenimi," a Kabbalistic Oracle. Your task is to generate a profound, multi-layered interpretation for a given Tarot-Sod card reading. The response must be structured into three distinct, machine-readable phases for progressive reveal. Crucially, you must embed specific "<Tree_Instruction>" tags within your text to direct the real-time animation of an accompanying Tree of Life diagram. Your tone is prophetic, wise, and focused on actionable Tikkun.

INPUT VARIABLES:
*   [User_Kavanah]: ${session.kavanah}
*   [Card_Data]: { Name: "${session.card.name}", Keywords: "${session.card.keywords?.join(', ')}", Sefirotic_Mappings: "${session.card.sefirah.join(', ')}", Klipah_Warning: "${session.card.klipah_warning || 'None'}" }

CORE INSTRUCTIONS:
1.  **Phased Response:** You MUST structure your entire output into three sections: "<Phase1>", "<Phase2>", and "<Phase3>".
2.  **Tree Integration:** You MUST embed "<Tree_Instruction>" tags at the precise point in the text where a visual change should occur on the Tree. Use the Sefirah Names: ${SEFIROT_DATA.map(s => s.id).join(', ')}. Use Path IDs by combining Sefirah names like "Keter-Chokhmah", "Gevurah-Tiferet", etc.
3.  **Authenticity:** Ground all interpretations in Kabbalistic principles (Lurianic, Zoharic, etc.).
4.  **Prophetic, Not Predictive:** Focus on spiritual laws, energetic states, and paths of rectification.
5.  **Tikkun-Oriented:** All guidance must lead to concrete, embodied action.

OUTPUT STRUCTURE & TAGS:

"<Phase1>"
    **Module: Olam Atzilut (The Divine Will)**
    (Your interpretation text for this module...)
    <Tree_Instruction sefirah="[Sefirah_Name]" state="[SefirahQualitativeState]" effect="[SefirahVisualEffect]" />
    (Continue text...)
"</Phase1>"

"<Phase2>"
    **Module: Olam Beriah (The Spiritual Law)**
    (Your interpretation text...)
    <Tree_Instruction path="[Sefirah1ID-Sefirah2ID]" state="[PathQualitativeState]" effect="[PathVisualEffect]" />
    **Module: Olam Yetzirah (The Soul Response)**
    (Your interpretation text...)
    <Tree_Instruction sefirah="[Sefirah_Name]" state="[SefirahQualitativeState]" effect="[SefirahVisualEffect]" />
    (Continue text...)
"</Phase2>"

"<Phase3>"
    **Module: Olam Assiyah (The Actionable Tikkun)**
    (Your interpretation text, including specific Tikkunim. These Tikkunim do NOT need special tags, just make them clear in the text.)
    <Tree_Instruction sefirah="[Sefirah_Name_For_Tikkun]" state="Open" effect="soft_glow" />
    **Module: Final Synthesis (The Unification)**
    (Your text...)
"</Phase3>"

TREE INSTRUCTION ATTRIBUTES:
*   sefirah: Name of the Sefirah (e.g., "Gevurah"). Must be one of: ${Object.values(SefirahName).join(', ')}.
*   path: The two Sefirot the path connects, as ID (e.g., "Tiferet-Yesod"). Ensure format is SefirahName1-SefirahName2.
*   state: The qualitative state. Options for Sefirah: ${Object.values(SefirahQualitativeState).join(', ')}. Options for Path: ${Object.values(PathQualitativeState).join(', ')}.
*   effect: The specific animation. Options for Sefirah: ${Object.values(SefirahVisualEffect).join(', ')}. Options for Path: ${Object.values(PathVisualEffect).join(', ')}.

Example: <Tree_Instruction sefirah="Gevurah" state="Overactive" effect="fast_pulse" />
Example: <Tree_Instruction path="Gevurah-Tiferet" state="Ruptured" effect="crack_effect" />
`;
    
    const tone = SEFIRAH_TONES[session.card.primarySefirahTone];
    const systemInstruction = `You are HaMefaresh HaPenimi, the Inner Oracle. Your tone is ${tone}. Adhere strictly to the OUTPUT STRUCTURE & TAGS. Ensure all Tree_Instruction tags are well-formed and use valid attribute values.`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17", // Ensure this is the correct model
        contents: masterPrompt,
        config: { systemInstruction }
      });
      const text = response.text || "";
      const parsed = parseAIResponse(text);

      if (parsed) {
        setSession(prev => ({
          ...prev,
          parsedResponse: parsed,
          rawResponseForDebug: text, // For debugging
          isLoading: false,
          currentRevelationStep: OracleRevelationStep.Phase1Revealed, // Auto-reveal first phase
        }));
      } else {
        setSession(prev => ({ ...prev, isLoading: false, error: "Failed to parse Oracle's wisdom. Raw: " + text.substring(0, 500)}));
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      let errorMessage = "Failed to consult the Oracle.";
      if (error instanceof Error) errorMessage += ` Details: ${error.message}`;
      setSession(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  }, [session.card, session.kavanah, ai.models]);

  const applyTreeInstructions = (instructions: TreeInstruction[]) => {
    setSefirahStates(prevStates => {
        const newStates = { ...prevStates };
        instructions.filter(inst => inst.type === 'sefirah').forEach(inst => {
            const targetSefirah = inst.target as SefirahName;
            const sefirahInfo = SEFIROT_DATA.find(s => s.id === targetSefirah);
            if (sefirahInfo && newStates[targetSefirah]) {
                const qState = inst.qualitativeState as SefirahQualitativeState;
                const vEffect = inst.visualEffect as SefirahVisualEffect;
                newStates[targetSefirah] = {
                    ...newStates[targetSefirah],
                    qualitativeState: qState,
                    visualEffect: vEffect,
                    currentFillClass: SEFIRAH_STATE_FILL_CLASSES[qState]?.(sefirahInfo.baseColorName) || sefirahInfo.defaultFillClass,
                    animationClass: SEFIRAH_EFFECT_CLASSES[vEffect] || '',
                    opacityClass: qState === SefirahQualitativeState.Suppressed ? 'opacity-30' : 'opacity-100',
                    tooltipContent: `${sefirahInfo.displayName} (${qState}, ${vEffect})`
                };
            }
        });
        return newStates;
    });

    setPathStates(prevStates => {
        const newStates = { ...prevStates };
        instructions.filter(inst => inst.type === 'path').forEach(inst => {
            // Path target is like "Sefirah1-Sefirah2". Need to find the matching Path ID.
            const targetPathId = PATHS_DATA.find(p => {
                const parts = inst.target.split('-');
                return (p.sefirot[0] === parts[0] && p.sefirot[1] === parts[1]) || (p.sefirot[0] === parts[1] && p.sefirot[1] === parts[0]);
            })?.id;

            if (targetPathId && newStates[targetPathId]) {
                const qState = inst.qualitativeState as PathQualitativeState;
                const vEffect = inst.visualEffect as PathVisualEffect;
                 newStates[targetPathId] = {
                    ...newStates[targetPathId],
                    qualitativeState: qState,
                    visualEffect: vEffect,
                    currentStrokeClass: PATH_STATE_STROKE_CLASSES[qState] || 'stroke-indigo-700',
                    animationClass: PATH_EFFECT_CLASSES[vEffect] || '',
                    strokeDasharray: (vEffect === PathVisualEffect.SmoothFlow || vEffect === PathVisualEffect.ErraticFlow) ? '10, 5' : undefined,
                    tooltipContent: `${PATHS_DATA.find(p=>p.id===targetPathId)?.tooltip || 'Path'} (${qState}, ${vEffect})`
                };
            }
        });
        return newStates;
    });
  };

  useEffect(() => {
    // Apply instructions when a new phase is revealed
    if (session.parsedResponse && session.currentRevelationStep > OracleRevelationStep.Initial && session.currentRevelationStep <= OracleRevelationStep.Phase3Revealed) {
        let instructionsToApply: TreeInstruction[] = [];
        if (session.currentRevelationStep === OracleRevelationStep.Phase1Revealed) {
            instructionsToApply = session.parsedResponse.phase1.instructions;
        } else if (session.currentRevelationStep === OracleRevelationStep.Phase2Revealed) {
            instructionsToApply = session.parsedResponse.phase2.instructions;
        } else if (session.currentRevelationStep === OracleRevelationStep.Phase3Revealed) {
            instructionsToApply = session.parsedResponse.phase3.instructions;
        }
        if (instructionsToApply.length > 0) {
          applyTreeInstructions(instructionsToApply);
        }
    }
    // Scroll to bottom of interpretation area
    if (interpretationAreaRef.current) {
        interpretationAreaRef.current.scrollTop = interpretationAreaRef.current.scrollHeight;
    }
  }, [session.currentRevelationStep, session.parsedResponse]);


  const handleNextStep = () => {
    if (session.currentRevelationStep === OracleRevelationStep.Initial && !session.isLoading && session.card) {
        handleBeginInterpretation(); // Fetch AI response
    } else if (session.currentRevelationStep < OracleRevelationStep.Phase3Revealed && session.parsedResponse) {
        setSession(prev => ({...prev, currentRevelationStep: prev.currentRevelationStep + 1}));
    } else if (session.currentRevelationStep === OracleRevelationStep.Phase3Revealed) {
        setSession(prev => ({...prev, currentRevelationStep: OracleRevelationStep.Complete}));
    } else if (session.currentRevelationStep === OracleRevelationStep.Complete) {
        // Placeholder for "Download PDF" or other completion action
        alert("Reading complete. PDF Download feature coming soon. You can start a new reading via the Altar.");
        // Optionally, reset or navigate:
        // drawCard(); 
        // onNavigate(Page.Altar);
    }
  };

  const getButtonText = () => {
    if (session.isLoading) return "Interpreting...";
    switch (session.currentRevelationStep) {
      case OracleRevelationStep.Initial: return "Begin the Interpretation";
      case OracleRevelationStep.Phase1Revealed: return "Unfold the Blueprint (Phase 2)";
      case OracleRevelationStep.Phase2Revealed: return "Receive the Tikkun (Phase 3)";
      case OracleRevelationStep.Phase3Revealed: return "View Final Synthesis";
      case OracleRevelationStep.Complete: return "Reading Complete (Review/Download)";
      default: return "Proceed";
    }
  };
  
  const handleTreeElementHover = (content: string, x: number, y: number, type: 'sefirah' | 'path') => {
    setTooltip({ visible: true, content, x: x + 15, y: y - 10, type });
  };
  const handleTreeElementMouseLeave = () => setTooltip(prev => ({ ...prev, visible: false }));


  if (!kavanah) { // If landed directly on Oracle page without kavanah from Altar
    return (
      <div className="p-4 sm:p-6 h-full flex flex-col justify-center items-center text-center">
        <p className="text-xl text-yellow-300 mb-4">Please begin your journey at the Altar to set your Kavanah.</p>
        <button 
            onClick={() => onNavigate(Page.Altar)}
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2 px-6 rounded-lg transition-colors"
        >
            Go to Altar
        </button>
      </div>
    );
  }

  if (!session.card && !session.isLoading) { // Card not drawn yet but kavanah is present
     return (
      <div className="p-4 sm:p-6 h-full flex flex-col justify-center items-center text-center">
        <p className="text-xl text-yellow-300">Preparing the Oracle space...</p>
      </div>
    );
  }
  
  const renderPhaseContent = (phaseKey: 'phase1' | 'phase2' | 'phase3', title: string) => {
    if (!session.parsedResponse?.[phaseKey]?.text) return null;
    return (
        <div className="mb-4 p-3 bg-slate-800/50 rounded animate-fadeIn">
            <h4 className="font-frank text-xl text-yellow-300 mb-2">{title}</h4>
            <p className="whitespace-pre-wrap text-indigo-100 leading-relaxed">{session.parsedResponse[phaseKey].text}</p>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col md:flex-row p-1 sm:p-2 bg-slate-950 overflow-hidden">
      {/* Left Panel: Oracle's Scroll */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col p-2 md:pr-1 mb-2 md:mb-0 h-full parchment-bg text-slate-800 rounded-md shadow-xl">
        {session.card && (
            <div className="mb-3 p-3 border-b border-slate-400 text-center">
            <h2 className="font-frank text-2xl sm:text-3xl text-slate-700">{session.card.name}</h2>
            <p className="text-sm text-slate-600 mt-1">Kavanah: "{session.kavanah}"</p>
             {session.card.klipah_warning && <p className="text-xs text-red-600 mt-1"><strong>Warning:</strong> {session.card.klipah_warning}</p>}
            </div>
        )}
        
        <div ref={interpretationAreaRef} className="overflow-y-auto flex-grow mb-3 p-2 space-y-2 content-scroll">
            {session.isLoading && session.currentRevelationStep === OracleRevelationStep.Initial && <p className="text-slate-600 text-center py-4">Receiving Divine Insight...</p>}
            {session.error && <p className="text-red-600 text-center p-2 bg-red-200/50 rounded">{session.error}</p>}
            
            {session.currentRevelationStep >= OracleRevelationStep.Phase1Revealed && renderPhaseContent('phase1', "Phase 1: Atzilut - The Divine Will")}
            {session.currentRevelationStep >= OracleRevelationStep.Phase2Revealed && renderPhaseContent('phase2', "Phase 2: Beriah & Yetzirah - Spiritual Law & Soul Response")}
            {session.currentRevelationStep >= OracleRevelationStep.Phase3Revealed && renderPhaseContent('phase3', "Phase 3: Assiyah & Synthesis - Action & Unification")}
        </div>

        <div className="mt-auto p-1">
          <button
            onClick={handleNextStep}
            disabled={session.isLoading || (!session.card && session.currentRevelationStep === OracleRevelationStep.Initial)}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-slate-900 font-bold py-3 px-4 rounded transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-base"
          >
            {getButtonText()}
          </button>
        </div>
      </div>

      {/* Right Panel: Tree of Life Canvas */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col items-center p-2 md:pl-1 h-full">
        <div className="flex-grow w-full aspect-[400/600] max-h-full bg-slate-900 rounded-md shadow-inner">
          {session.card ? (
            <TreeOfLifeSVG 
                sefirahStates={sefirahStates} 
                pathStates={pathStates}
                currentCard={session.card} 
                interactivePaths={true} // Enable hover for tooltips
                interactiveSefirot={true} // Enable hover for tooltips
                onSefirahMouseEnter={(e, sef) => handleTreeElementHover(sefirahStates[sef.id]?.tooltipContent || sef.displayName, e.clientX, e.clientY, 'sefirah')}
                onPathMouseEnter={(e, path) => handleTreeElementHover(pathStates[path.id]?.tooltipContent || path.tooltip, e.clientX, e.clientY, 'path')}
                onElementMouseLeave={handleTreeElementMouseLeave}
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center text-indigo-400">Awaiting Card...</div>
          )}
        </div>
      </div>
      <Tooltip tooltipState={tooltip} />
    </div>
  );
};

export default OraclePage;
