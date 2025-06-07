export enum Page {
  Altar = "Altar",
  Oracle = "Oracle",
  Compass = "Compass",
  Journal = "Journal",
}

export enum SefirahName {
  Keter = "Keter",
  Chokhmah = "Chokhmah",
  Binah = "Binah",
  Chesed = "Chesed",
  Gevurah = "Gevurah",
  Tiferet = "Tiferet",
  Netzach = "Netzach",
  Hod = "Hod",
  Yesod = "Yesod",
  Malchut = "Malchut",
}

// As per Oracle Blueprint Section E (Tree's Visual Language)
export enum SefirahQualitativeState {
  Neutral = "Neutral", // Default resting state
  Open = "Open", // Balanced
  Overactive = "Overactive",
  Suppressed = "Suppressed", // Empty
  Blocked = "Blocked", // Cracked
}

export enum SefirahVisualEffect {
  None = "None",
  SteadyGlow = "steady_glow",
  FastPulse = "fast_pulse",
  FadeDim = "fade_dim", // For Suppressed
  FlickerStatic = "flicker_static", // For Blocked
  SoftGlow = "soft_glow", // For Tikkun indication
}

export enum PathQualitativeState {
  Neutral = "Neutral",
  Healthy = "Healthy",
  Strained = "Strained",
  Ruptured = "Ruptured", // Or Blocked path
}

export enum PathVisualEffect {
  None = "None",
  SmoothFlow = "smooth_flow",
  ErraticFlow = "erratic_flow",
  CrackEffect = "crack_effect",
}


export interface SefirahInfo {
  id: SefirahName;
  displayName: string;
  cx: number;
  cy: number;
  r: number;
  textX: number;
  textY: number;
  baseColorName: string; // e.g., 'indigo', 'red' for Tailwind class generation
  defaultFillClass: string;
  defaultStrokeClass: string;
  corePrinciple?: string; 
  divineName?: string; 
  associatedMiddot?: string[]; 
}

export interface FlowData { // From original Path data, may be used by Compass
  from: string;
  to: string;
  interpretation: string;
  tikun: string;
  source: string;
}

export interface PathInfo {
  id: string; // e.g., "path-Keter-Chokhmah"
  d: string;
  tooltip: string; 
  textureDescription?: string; 
  flow: FlowData; // Original flow data
  sefirot: [SefirahName, SefirahName]; // The two sefirot it connects
}

export interface CardData {
  id: string; 
  name: string; 
  sefirah: SefirahName[]; 
  primarySefirahTone: SefirahName; 
  // vessel: Partial<Record<SefirahName, SefirahState>>; // Old state mapping, may not be directly used by Oracle v9
  vessel?: Partial<Record<SefirahName, SefirahQualitativeState>>; // For initial card state if needed, but AI instructions will override
  sound_cue_id?: string; 
  haptic_feedback_pattern?: string; 
  animation_script?: string; 
  klipah_warning?: string;
  image?: string; 
  description?: string; 
  keywords?: string[]; 
}

export interface SefirahDisplayState {
  qualitativeState: SefirahQualitativeState;
  visualEffect: SefirahVisualEffect;
  currentFillClass: string;
  currentStrokeClass: string;
  animationClass: string;
  opacityClass: string;
  tooltipContent?: string; // For dynamic tooltips based on AI
}

export interface PathDisplayState {
  qualitativeState: PathQualitativeState;
  visualEffect: PathVisualEffect;
  currentStrokeClass: string;
  animationClass: string;
  strokeDasharray?: string; // For flow animations
  tooltipContent?: string; // For dynamic tooltips
}


export interface TooltipState {
  visible: boolean;
  content: string;
  x: number;
  y: number;
  type?: 'sefirah' | 'path'; // To distinguish tooltip source
}

export interface PathModalState { 
  visible: boolean;
  data: FlowData | null;
}

export interface SefirahModalState {
    visible: boolean;
    data: SefirahInfo | null;
}


export interface DailyVesselData {
  name: string;
  description: string;
  related_sefirah?: SefirahName;
}

// --- Oracle Page v9.0 Specific Types ---
export enum OracleRevelationStep {
    Initial = 0,      // Waiting to begin
    Phase1Revealed = 1, // Atzilut shown
    Phase2Revealed = 2, // Beriah & Yetzirah shown
    Phase3Revealed = 3, // Assiyah & Synthesis shown
    Complete = 4,       // Full reading displayed
}

export interface TreeInstruction {
    type: 'sefirah' | 'path';
    target: SefirahName | string; // SefirahName or Path ID (e.g., "Gevurah-Tiferet")
    qualitativeState: SefirahQualitativeState | PathQualitativeState;
    visualEffect: SefirahVisualEffect | PathVisualEffect;
    // originalTag: string; // For debugging
}

export interface ParsedAIPhrase {
    text: string;
    instructions: TreeInstruction[];
}

export interface ParsedAIResponse {
    phase1: ParsedAIPhrase;
    phase2: ParsedAIPhrase;
    phase3: ParsedAIPhrase;
}

export interface OracleSessionState { 
  kavanah: string;
  card: CardData | null;
  currentRevelationStep: OracleRevelationStep;
  parsedResponse: ParsedAIResponse | null; // Stores the structured AI output
  rawResponseForDebug?: string; // Store the raw AI response for debugging
  isLoading: boolean;
  error: string | null;
  // Suggested Tikkunim are now part of Phase3 text, not a separate list here.
}

// Sefirah Tones (used by AI prompt, kept from previous version)
export type SefirahTone = 
  | "Compassionate and Expansive"
  | "Discerning and Structural"
  | "Harmonizing and Balancing"
  | "Victorious and Enduring"
  | "Majestic and Rational"
  | "Foundational and Generative"
  | "Receptive and Manifesting"
  | "Wise and Pure Potential"
  | "Understanding and Formative"
  | "Transcendent and Unified";

export const SEFIRAH_TONES: Record<SefirahName, SefirahTone> = {
    [SefirahName.Keter]: "Transcendent and Unified",
    [SefirahName.Chokhmah]: "Wise and Pure Potential",
    [SefirahName.Binah]: "Understanding and Formative",
    [SefirahName.Chesed]: "Compassionate and Expansive",
    [SefirahName.Gevurah]: "Discerning and Structural",
    [SefirahName.Tiferet]: "Harmonizing and Balancing",
    [SefirahName.Netzach]: "Victorious and Enduring",
    [SefirahName.Hod]: "Majestic and Rational",
    [SefirahName.Yesod]: "Foundational and Generative",
    [SefirahName.Malchut]: "Receptive and Manifesting",
};

// Types for Journal
export interface AcceptedTikkun {
  id: string; 
  text: string;
  readingKavanah: string; 
  cardName: string; 
  dateAccepted: string; 
  isCompleted: boolean;
  ohrChozerLog?: string; 
  dateCompleted?: string; 
}

export interface JournalReading { // Unused for now, but kept for future
  id: string; 
  date: string; 
  kavanah: string;
  card: CardData; 
  oracleResponses: Partial<Record<string, string>>; // Generic record for simplicity if storing old format
}

// Types for Glossary
export interface GlossaryTerm {
    term: string;
    definition: string;
    relatedSefirah?: SefirahName;
}

// Old SefirahState, keep for mapping if necessary, but new system uses QualitativeState + VisualEffect
export enum OldSefirahState { 
  Default = "default",
  Open = "open",
  Blocked = "blocked",
  Overactive = "overactive",
  Suppressed = "suppressed",
}
