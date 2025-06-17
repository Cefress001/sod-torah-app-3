import React, { useState, useEffect, useCallback } from 'react';
import { Page, AcceptedTikkun, JournalReading } from '../types'; // Assuming JournalReading might be added later

interface JournalPageProps {
  onNavigate: (page: Page) => void;
}

const TIKKUN_STORAGE_KEY = 'sodicMirrorAcceptedTikkunim';
const READINGS_STORAGE_KEY = 'sodicMirrorReadingsHistory'; // For future use

const JournalPage: React.FC<JournalPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'planner' | 'history' | 'arc'>('planner');
  const [tikkunim, setTikkunim] = useState<AcceptedTikkun[]>([]);
  const [editingTikkunId, setEditingTikkunId] = useState<string | null>(null);
  const [ohrChozerText, setOhrChozerText] = useState<string>("");
  // const [readings, setReadings] = useState<JournalReading[]>([]); // For future use

  const loadTikkunim = useCallback(() => {
    const storedTikkunim = localStorage.getItem(TIKKUN_STORAGE_KEY);
    if (storedTikkunim) {
      setTikkunim(JSON.parse(storedTikkunim).sort((a: AcceptedTikkun, b: AcceptedTikkun) => new Date(b.dateAccepted).getTime() - new Date(a.dateAccepted).getTime()));
    }
  }, []);

  useEffect(() => {
    loadTikkunim();
    // Load readings history if implemented
  }, [loadTikkunim]);

  const handleToggleComplete = (id: string) => {
    const updatedTikkunim = tikkunim.map(t => {
      if (t.id === id) {
        const nowCompleted = !t.isCompleted;
        if (nowCompleted) { // If marking as complete
            setEditingTikkunId(id); // Open Ohr Chozer input
            setOhrChozerText(t.ohrChozerLog || ""); // Pre-fill if already exists
        }
        return { ...t, isCompleted: nowCompleted, dateCompleted: nowCompleted ? new Date().toISOString() : undefined };
      }
      return t;
    });
    setTikkunim(updatedTikkunim);
    localStorage.setItem(TIKKUN_STORAGE_KEY, JSON.stringify(updatedTikkunim));
  };

  const handleSaveOhrChozer = (id: string) => {
    const updatedTikkunim = tikkunim.map(t => 
      t.id === id ? { ...t, ohrChozerLog: ohrChozerText } : t
    );
    setTikkunim(updatedTikkunim);
    localStorage.setItem(TIKKUN_STORAGE_KEY, JSON.stringify(updatedTikkunim));
    setEditingTikkunId(null);
    setOhrChozerText("");
  };
  
  const handleDeleteTikkun = (id: string) => {
    if(window.confirm("Are you sure you want to delete this Tikkun? This action cannot be undone.")){
        const updatedTikkunim = tikkunim.filter(t => t.id !== id);
        setTikkunim(updatedTikkunim);
        localStorage.setItem(TIKKUN_STORAGE_KEY, JSON.stringify(updatedTikkunim));
    }
  };

  return (
    <div className="p-2 sm:p-4 h-full flex flex-col text-indigo-100 bg-slate-950">
      <h1 className="font-cinzel text-2xl sm:text-3xl text-yellow-300 text-center mb-4">The Journal</h1>
      
      <div className="flex justify-center mb-4 border-b border-indigo-700">
        {(['planner', 'history', 'arc'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-cinzel text-sm sm:text-base transition-colors duration-200
                        ${activeTab === tab ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-indigo-300 hover:text-yellow-300'}`}
          >
            {tab === 'planner' ? 'Avodah Planner' : tab === 'history' ? 'Reading History' : 'Tikkun Story Arc'}
          </button>
        ))}
      </div>

      {activeTab === 'planner' && (
        <div className="overflow-y-auto flex-grow p-1 sm:p-2 space-y-3 content-scroll">
          {tikkunim.length === 0 && <p className="text-center text-indigo-300 mt-8">No Tikkunim accepted yet. Visit the Oracle to find guidance.</p>}
          {tikkunim.map(tikkun => (
            <div key={tikkun.id} className={`p-3 rounded-lg shadow-md ${tikkun.isCompleted ? 'bg-green-900/30 border-l-4 border-green-500' : 'bg-slate-800 border-l-4 border-yellow-500'}`}>
              <div className="flex justify-between items-start">
                <div>
                    <p className={`font-semibold text-base sm:text-lg ${tikkun.isCompleted ? 'text-green-300 line-through' : 'text-yellow-200'}`}>{tikkun.text}</p>
                    <p className="text-xs text-indigo-400 mt-1">From card: {tikkun.cardName} (Kavanah: "{tikkun.readingKavanah.substring(0,30)}...")</p>
                    <p className="text-xs text-indigo-400">Accepted: {new Date(tikkun.dateAccepted).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end space-y-1 ml-2">
                    <button
                        onClick={() => handleToggleComplete(tikkun.id)}
                        className={`text-xs py-1 px-2 rounded transition-colors duration-200 whitespace-nowrap
                                    ${tikkun.isCompleted ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    >
                        {tikkun.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                     <button
                        onClick={() => handleDeleteTikkun(tikkun.id)}
                        className="text-xs py-1 px-2 rounded bg-red-700 hover:bg-red-800 text-white transition-colors"
                    >
                        Delete
                    </button>
                </div>
              </div>
              {tikkun.isCompleted && tikkun.dateCompleted && (
                <p className="text-xs text-green-400 mt-1">Completed: {new Date(tikkun.dateCompleted).toLocaleDateString()}</p>
              )}
              {editingTikkunId === tikkun.id && (
                <div className="mt-3 border-t border-indigo-700 pt-3 animate-fadeIn">
                  <h4 className="font-cinzel text-yellow-300 mb-1">Ohr Chozer - Returning Light</h4>
                  <textarea
                    value={ohrChozerText}
                    onChange={(e) => setOhrChozerText(e.target.value)}
                    rows={3}
                    className="w-full p-2 rounded bg-slate-700 border border-indigo-500 text-indigo-100 focus:ring-yellow-400 focus:border-yellow-400"
                    placeholder="How has this action changed the flow? What did you learn?"
                  />
                  <button
                    onClick={() => handleSaveOhrChozer(tikkun.id)}
                    className="mt-2 bg-purple-600 hover:bg-purple-700 text-white text-sm py-1.5 px-3 rounded transition-colors"
                  >
                    Save Reflection
                  </button>
                </div>
              )}
              {tikkun.isCompleted && tikkun.ohrChozerLog && editingTikkunId !== tikkun.id && (
                <div className="mt-2 pt-2 border-t border-indigo-700/50">
                    <p className="text-xs font-semibold text-yellow-300">Reflection:</p>
                    <p className="text-xs text-indigo-200 whitespace-pre-wrap">{tikkun.ohrChozerLog}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="flex-grow p-4 text-center">
          <p className="text-indigo-300">Reading History feature coming soon. Past readings will be stored and reviewable here.</p>
          {/* Placeholder for listing JournalReadings */}
        </div>
      )}

      {activeTab === 'arc' && (
        <div className="flex-grow p-4 text-center">
          <p className="text-indigo-300">Tikkun Story Arc feature coming soon. This will visually map your journey and growth patterns.</p>
          {/* Placeholder for Story Arc visualization */}
        </div>
      )}
    </div>
  );
};

export default JournalPage;
