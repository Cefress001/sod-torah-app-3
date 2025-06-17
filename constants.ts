import { 
  SefirahName, SefirahInfo, PathInfo, CardData, DailyVesselData, GlossaryTerm, SEFIRAH_TONES,
  SefirahQualitativeState, SefirahVisualEffect, PathQualitativeState, PathVisualEffect
} from './types';

export const SEFIROT_DATA: SefirahInfo[] = [
  { id: SefirahName.Keter, displayName: "Keter (Crown)", cx: 200, cy: 50, r: 20, textX: 200, textY: 55, baseColorName: 'indigo', defaultFillClass: 'fill-indigo-800', defaultStrokeClass: 'stroke-indigo-400', corePrinciple: "Divine Will, Unity, Potential", divineName: "Eheieh", associatedMiddot: ["Faith (Emunah)", "Humility (Anavah)"] },
  { id: SefirahName.Chokhmah, displayName: "Chokhmah (Wisdom)", cx: 125, cy: 125, r: 20, textX: 125, textY: 130, baseColorName: 'slate', defaultFillClass: 'fill-slate-700', defaultStrokeClass: 'stroke-slate-400', corePrinciple: "Primordial Wisdom, Flash of Insight", divineName: "Yah", associatedMiddot: ["Selflessness (Bittul)", "Openness"] },
  { id: SefirahName.Binah, displayName: "Binah (Understanding)", cx: 275, cy: 125, r: 20, textX: 275, textY: 130, baseColorName: 'purple', defaultFillClass: 'fill-purple-800', defaultStrokeClass: 'stroke-purple-400', corePrinciple: "Analytical Understanding, Divine Mother", divineName: "Elohim Chayim", associatedMiddot: ["Joy (Simcha)", "Discernment"] },
  { id: SefirahName.Chesed, displayName: "Chesed (Kindness)", cx: 125, cy: 200, r: 20, textX: 125, textY: 205, baseColorName: 'blue', defaultFillClass: 'fill-blue-700', defaultStrokeClass: 'stroke-blue-400', corePrinciple: "Loving-kindness, Mercy, Grace", divineName: "El", associatedMiddot: ["Love (Ahavah)", "Generosity (Nedivut)"] },
  { id: SefirahName.Gevurah, displayName: "Gevurah (Strength)", cx: 275, cy: 200, r: 20, textX: 275, textY: 205, baseColorName: 'red', defaultFillClass: 'fill-red-700', defaultStrokeClass: 'stroke-red-400', corePrinciple: "Strength, Discipline, Judgment", divineName: "Elohim Gibor", associatedMiddot: ["Awe/Fear of God (Yirat Shamayim)", "Justice (Din)"] },
  { id: SefirahName.Tiferet, displayName: "Tiferet (Beauty)", cx: 200, cy: 300, r: 20, textX: 200, textY: 305, baseColorName: 'yellow', defaultFillClass: 'fill-yellow-600', defaultStrokeClass: 'stroke-yellow-300', corePrinciple: "Beauty, Harmony, Truth", divineName: "YHVH Eloah VeDa'at", associatedMiddot: ["Compassion (Rachamim)", "Truth (Emet)"] },
  { id: SefirahName.Netzach, displayName: "Netzach (Victory)", cx: 125, cy: 400, r: 20, textX: 125, textY: 405, baseColorName: 'green', defaultFillClass: 'fill-green-700', defaultStrokeClass: 'stroke-green-400', corePrinciple: "Eternity, Victory, Endurance", divineName: "YHVH Tzvaot", associatedMiddot: ["Patience (Savlanut)", "Confidence (Bitachon)"] },
  { id: SefirahName.Hod, displayName: "Hod (Splendor)", cx: 275, cy: 400, r: 20, textX: 275, textY: 405, baseColorName: 'orange', defaultFillClass: 'fill-orange-600', defaultStrokeClass: 'stroke-orange-400', corePrinciple: "Splendor, Glory, Surrender", divineName: "Elohim Tzvaot", associatedMiddot: ["Sincerity (Temimut)", "Gratitude (Hoda'ah)"] },
  { id: SefirahName.Yesod, displayName: "Yesod (Foundation)", cx: 200, cy: 500, r: 20, textX: 200, textY: 505, baseColorName: 'cyan', defaultFillClass: 'fill-cyan-600', defaultStrokeClass: 'stroke-cyan-300', corePrinciple: "Foundation, Connection, Covenant", divineName: "Shaddai El Chai", associatedMiddot: ["Purity (Taharah)", "Integrity"] },
  { id: SefirahName.Malchut, displayName: "Malchut (Kingdom)", cx: 200, cy: 575, r: 20, textX: 200, textY: 580, baseColorName: 'stone', defaultFillClass: 'fill-stone-600', defaultStrokeClass: 'stroke-stone-400', corePrinciple: "Kingdom, Manifestation, Shekhinah", divineName: "Adonai Melekh", associatedMiddot: ["Action (Ma'aseh)", "Humility (Shiflut)"] },
];

export const PATHS_DATA: PathInfo[] = [
  { id: "path-Keter-Chokhmah", sefirot: [SefirahName.Keter, SefirahName.Chokhmah], d: "M 200,50 L 125,125", tooltip: "Keter → Chokhmah: The first breath of Will.", textureDescription: "A current of pure, unmanifest potential.", flow: {"from":"Keter","to":"Chokhmah","interpretation":"The unmanifest potential of Keter contracts into the first point of pure Will and Wisdom.","tikun":"Contemplate a goal before acting. What is your purest intention?","source":"Zohar I:15a"} },
  { id: "path-Keter-Binah", sefirot: [SefirahName.Keter, SefirahName.Binah], d: "M 200,50 L 275,125", tooltip: "Keter → Binah: The potential for form.", textureDescription: "Energy seeking containment, a whisper before a voice.", flow: {"from":"Keter","to":"Binah","interpretation":"The Will to Be seeks a vessel, a womb of understanding in which to take shape.","tikun":"Create space for a new idea. Clean your room. Clear your schedule. Prepare the vessel.","source":"Proverbs 2:3"} },
  { id: "path-Chokhmah-Binah", sefirot: [SefirahName.Chokhmah, SefirahName.Binah], d: "M 125,125 L 275,125", tooltip: "Chokhmah ↔ Binah: Insight meets Understanding.", textureDescription: "A vibrant exchange, like lightning grounding into fertile earth.", flow: {"from":"Chokhmah","to":"Binah","interpretation":"The raw flash of insight (Chokhmah) flows to Binah to be given structure and form. A block here means ideas never materialize.","tikun":"Take one abstract idea and write down three concrete steps to make it real.","source":"Proverbs 4:7"} },
  { id: "path-Chokhmah-Tiferet", sefirot: [SefirahName.Chokhmah, SefirahName.Tiferet], d: "M 125,125 L 200,300", tooltip: "Chokhmah → Tiferet: Wisdom illuminates the Heart.", textureDescription: "A clear, clarifying light descending into a warm core.", flow: {"from":"Chokhmah","to":"Tiferet","interpretation":"The highest wisdom descends to inform the center of consciousness, creating enlightened compassion.","tikun":"How does a high-level truth apply to a simple, everyday act of kindness?","source":"Psalm 111:10"} },
  { id: "path-Binah-Tiferet", sefirot: [SefirahName.Binah, SefirahName.Tiferet], d: "M 275,125 L 200,300", tooltip: "Binah → Tiferet: Understanding gives birth to Beauty.", textureDescription: "A gentle unfolding, like a complex pattern resolving into harmony.", flow: {"from":"Binah","to":"Tiferet","interpretation":"Deep understanding and discernment give birth to harmony and balance in the heart.","tikun":"Analyze a complex situation until you find the simple, beautiful truth at its center.","source":"1 Kings 3:9"} },
  { id: "path-Chesed-Gevurah", sefirot: [SefirahName.Chesed, SefirahName.Gevurah], d: "M 125,200 L 275,200", tooltip: "Chesed ↔ Gevurah: Mercy and Judgment in sacred tension.", textureDescription: "A dynamic tension, like the pull between expansion and contraction.", flow: {"from":"Chesed","to":"Gevurah","interpretation":"Expansive love (Chesed) requires the discipline of Gevurah to be effective. Strict judgment needs compassion to avoid cruelty.","tikun":"Perform an act of anonymous kindness. Then, set one firm, healthy boundary.","source":"Zohar II:168a"} },
  { id: "path-Tiferet-Netzach", sefirot: [SefirahName.Tiferet, SefirahName.Netzach], d: "M 200,300 L 125,400", tooltip: "Tiferet → Netzach: Harmony fuels Endurance.", textureDescription: "A radiant, motivating force, pushing forward with passion.", flow: {"from":"Tiferet","to":"Netzach","interpretation":"The beauty of the heart fuels the will to overcome obstacles and endure through passion and victory.","tikun":"Commit to a creative habit for one week, fueled by your love for the outcome.","source":"1 Chronicles 29:11"} },
  { id: "path-Tiferet-Hod", sefirot: [SefirahName.Tiferet, SefirahName.Hod], d: "M 200,300 L 275,400", tooltip: "Tiferet → Hod: Harmony informs Majesty.", textureDescription: "A shimmering, articulate energy, clear and resonant.", flow: {"from":"Tiferet","to":"Hod","interpretation":"The truth of the heart informs the intellect, creating authentic communication and majesty.","tikun":"Explain a heartfelt belief using clear, rational language without losing the passion.","source":"Psalm 8:1"} },
  { id: "path-Tiferet-Yesod", sefirot: [SefirahName.Tiferet, SefirahName.Yesod], d: "M 200,300 L 200,500", tooltip: "Tiferet → Yesod: Harmony flows to the Foundation.", textureDescription: "A grounding current, channeling balanced energy towards manifestation.", flow: {"from":"Tiferet","to":"Yesod","interpretation":"The integrated truth of the heart (Tiferet) must flow through the generative matrix of Yesod to be actualized. A block here means you feel authentic inside but cannot express it.","tikun":"Create something tangible that reflects an inner truth: a poem, a meal, a conversation.","source":"Genesis 1:28"} },
  { id: "path-Netzach-Hod", sefirot: [SefirahName.Netzach, SefirahName.Hod], d: "M 125,400 L 275,400", tooltip: "Netzach ↔ Hod: Passion and Intellect.", textureDescription: "A dance between focused drive and expansive vision, sometimes turbulent.", flow: {"from":"Netzach","to":"Hod","interpretation":"The passionate drive of Netzach must be balanced by the intellectual honesty of Hod. Unchecked, this leads to fanaticism or analysis paralysis.","tikun":"Fact-check a passionate belief. Infuse a dry intellectual concept with personal passion.","source":"Exodus 31:3"} },
  { id: "path-Yesod-Malkuth", sefirot: [SefirahName.Yesod, SefirahName.Malchut], d: "M 200,500 L 200,575", tooltip: "Yesod → Malkuth: The final descent into Reality.", textureDescription: "A powerful, condensing flow, bringing spirit into form.", flow: {"from":"Yesod","to":"Malkuth","interpretation":"All the assembled energies of the Tree flow through the foundation (Yesod) to manifest in the physical world (Malkuth). This is the path of creation.","tikun":"Take the final step on a project. Make the call. Ship the product. Bring it into the world.","source":"Psalm 145:13"} },
];

export const EXAMPLE_CARD: CardData = {
  id: "tower",
  name: "The Tower",
  sefirah: [SefirahName.Gevurah, SefirahName.Hod, SefirahName.Tiferet], // Sefirot involved
  primarySefirahTone: SefirahName.Gevurah, // For AI's tone
  // vessel: {} // Let AI instructions dictate specific states
  klipah_warning: "Guard against destructive pride or clinging to false structures. True foundations are within.",
  description: "Represents sudden upheaval and destruction of existing forms, often leading to revelation. It challenges false securities and forces a rebuilding on truer foundations.",
  keywords: ["destruction", "upheaval", "revelation", "change", "truth"]
};

export const ALL_CARDS: CardData[] = [
    EXAMPLE_CARD,
    {
        id: "lovers",
        name: "The Lovers",
        sefirah: [SefirahName.Binah, SefirahName.Tiferet, SefirahName.Chokhmah],
        primarySefirahTone: SefirahName.Tiferet,
        klipah_warning: "Ensure choices are made from a place of integrated values, not just fleeting desire or external pressure.",
        description: "Symbolizes relationships, choices, and the alignment of inner and outer values. It speaks to union, harmony, and decisions made from the heart.",
        keywords: ["relationship", "choice", "harmony", "union", "values"]
    },
    {
        id: "hermit",
        name: "The Hermit",
        sefirah: [SefirahName.Chokhmah, SefirahName.Chesed, SefirahName.Tiferet], 
        primarySefirahTone: SefirahName.Chokhmah,
        klipah_warning: "Introspection is valuable, but avoid complete withdrawal or isolation from the world.",
        description: "Represents introspection, solitude, wisdom, and inner guidance. The Hermit seeks truth within and offers a guiding light to others.",
        keywords: ["introspection", "solitude", "wisdom", "guidance", "inner truth"]
    }
];


export const DAILY_VESSELS: DailyVesselData[] = [
    { name: "Patience (Savlanut)", description: "Cultivate the ability to wait calmly in the face of frustration or adversity.", related_sefirah: SefirahName.Netzach },
    { name: "Humility (Anavah)", description: "Recognize your true place in the cosmos, neither puffing up with pride nor shrinking in false modesty.", related_sefirah: SefirahName.Hod },
    { name: "Generosity (Nedivut)", description: "Open your heart and hand to give freely, whether of material goods, time, or spirit.", related_sefirah: SefirahName.Chesed },
    { name: "Discipline (Gevurah)", description: "Apply focused effort and maintain healthy boundaries to achieve your goals.", related_sefirah: SefirahName.Gevurah },
    { name: "Truth (Emet)", description: "Align your words and actions with reality, and seek the underlying truth in all things.", related_sefirah: SefirahName.Tiferet },
];

// OraclePhaseConfig is removed as the prompt structure has changed for v9.0

export const GLOSSARY_TERMS: GlossaryTerm[] = [
    { term: "Tzimtzum", definition: "Divine self-contraction or withdrawal, creating conceptual space for creation. Related to Keter.", relatedSefirah: SefirahName.Keter },
    { term: "Shevirah", definition: "The 'shattering of the vessels' during creation, leading to sparks of holiness falling into the lower worlds. Represents brokenness and the potential for repair.", relatedSefirah: SefirahName.Gevurah },
    { term: "Tikkun Olam", definition: "The 'repair of the world,' humanity's task to elevate fallen sparks and restore harmony through conscious action and mitzvot.", relatedSefirah: SefirahName.Malchut },
    { term: "Kavanah", definition: "Focused intention and heartfelt sincerity in prayer or spiritual practice.", relatedSefirah: SefirahName.Tiferet },
    { term: "Middot", definition: "Ethical character traits or virtues that one cultivates, e.g., Chesed (kindness), Gevurah (discipline).", relatedSefirah: SefirahName.Tiferet },
    { term: "Partzuf", definition: "A 'Divine Persona' or configuration of Sefirot that represents a particular aspect or face of God.", relatedSefirah: SefirahName.Keter },
];


export { SEFIRAH_TONES };

// Mappings for Sefirah Visual Effects to Tailwind Animation Classes
export const SEFIRAH_EFFECT_CLASSES: Record<SefirahVisualEffect, string> = {
  [SefirahVisualEffect.None]: '',
  [SefirahVisualEffect.SteadyGlow]: 'animate-sef-steady-glow',
  [SefirahVisualEffect.FastPulse]: 'animate-sef-fast-pulse',
  [SefirahVisualEffect.FadeDim]: 'opacity-30', // Also handled by fill class
  [SefirahVisualEffect.FlickerStatic]: 'animate-sef-blocked-flicker',
  [SefirahVisualEffect.SoftGlow]: 'animate-sef-soft-glow',
};

// Mappings for Path Visual Effects to Tailwind Animation Classes
export const PATH_EFFECT_CLASSES: Record<PathVisualEffect, string> = {
  [PathVisualEffect.None]: '',
  [PathVisualEffect.SmoothFlow]: 'animate-path-smooth-flow',
  [PathVisualEffect.ErraticFlow]: 'animate-path-erratic-flow',
  [PathVisualEffect.CrackEffect]: 'animate-path-crack-effect', // May need specific stroke color for crack
};

// Base fill colors for Sefirot when affected by states like 'Open', 'Overactive'
// These are used in conjunction with effects.
export const SEFIRAH_STATE_FILL_CLASSES: Record<SefirahQualitativeState, (baseColorName: string) => string> = {
  [SefirahQualitativeState.Neutral]: (baseColorName) => `fill-${baseColorName}-800`, // Default, dark fill
  [SefirahQualitativeState.Open]: (baseColorName) => `fill-${baseColorName}-400`, // Brighter fill for open
  [SefirahQualitativeState.Overactive]: (baseColorName) => `fill-${baseColorName}-300`, // Very bright for overactive
  [SefirahQualitativeState.Suppressed]: (_baseColorName) => 'fill-slate-700', // Dim, greyish
  [SefirahQualitativeState.Blocked]: (_baseColorName) => 'fill-slate-600', // Dim, greyish, with flicker
};

export const PATH_STATE_STROKE_CLASSES: Record<PathQualitativeState, string> = {
  [PathQualitativeState.Neutral]: 'stroke-indigo-700',
  [PathQualitativeState.Healthy]: 'stroke-green-400',
  [PathQualitativeState.Strained]: 'stroke-yellow-400',
  [PathQualitativeState.Ruptured]: 'stroke-red-500',
};
