import React, { useState, useEffect } from 'react';
import { Page, DailyVesselData } from '../types';
import DailyVessel from '../components/DailyVessel';
import { DAILY_VESSELS } from '../constants';

interface AltarPageProps {
  onNavigate: (page: Page) => void;
  onStartNewReading: (kavanah: string) => void;
}

const ONBOARDING_KEY = 'sodicMirrorOnboardingComplete';

const AltarPage: React.FC<AltarPageProps> = ({ onNavigate, onStartNewReading }) => {
  const [dailyVessel, setDailyVessel] = useState<DailyVesselData | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [kavanah, setKavanah] = useState<string>("");
  const [showKavanahInput, setShowKavanahInput] = useState<boolean>(false);


  useEffect(() => {
    // Select a daily vessel
    setDailyVessel(DAILY_VESSELS[Math.floor(Math.random() * DAILY_VESSELS.length)]);
    
    // Check onboarding status
    const onboardingComplete = localStorage.getItem(ONBOARDING_KEY);
    if (!onboardingComplete) {
      setShowOnboarding(true);
      setOnboardingStep(1);
    }
  }, []);

  const handleOnboardingNext = () => {
    if (onboardingStep === 1) setOnboardingStep(2);
    else if (onboardingStep === 2) setOnboardingStep(3);
    else if (onboardingStep === 3) { // Sanctification
        // Simulate press and hold with a button click for simplicity
        localStorage.setItem(ONBOARDING_KEY, 'true');
        setShowOnboarding(false);
    }
  };
  
  const handleBeginReadingClick = () => {
    setShowKavanahInput(true);
  };

  const handleKavanahSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!kavanah.trim()){
        alert("Please enter your Kavanah (intention).");
        return;
    }
    onStartNewReading(kavanah);
  };


  if (showOnboarding) {
    return (
      <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col justify-center items-center text-center bg-slate-950 animate-fadeIn">
        {onboardingStep === 1 && (
          <>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-yellow-300 mb-6">Welcome to the Sodic Mirror</h2>
            <p className="text-indigo-200 mb-8 text-lg leading-relaxed max-w-md">
              This is not a tool for prediction, but a mirror for your soul's alignment.
              Proceed with reverence.
            </p>
            <button 
              onClick={handleOnboardingNext}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Accept
            </button>
          </>
        )}
        {onboardingStep === 2 && (
          <>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-yellow-300 mb-6">The Power of Kavanah</h2>
            <p className="text-indigo-200 mb-8 text-lg leading-relaxed max-w-md">
              Kavanah is sacred intention. Before each reading, take a moment to focus your heart on the guidance you seek. Your intention shapes the vessel.
            </p>
            <button 
              onClick={handleOnboardingNext}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Understand
            </button>
          </>
        )}
        {onboardingStep === 3 && (
          <>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-yellow-300 mb-6">Sanctify the Vessel</h2>
            <p className="text-indigo-200 mb-8 text-lg leading-relaxed max-w-md">
              Take a breath. Consecrate this space and your intention.
            </p>
            <button 
              onClick={handleOnboardingNext} // Simulate "press and hold for 7 seconds" with a click
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-full transition-colors duration-200 text-lg shadow-xl animate-sef-slow-pulse"
            >
              Sanctify (Press to Continue)
            </button>
          </>
        )}
      </div>
    );
  }


  return (
    <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col justify-center items-center text-center bg-slate-950">
      {/* Pulsing flame/Etz HaChayim symbol - Placeholder */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-yellow-500/30 rounded-full flex items-center justify-center mb-8 sm:mb-12 animate-sef-slow-pulse">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full shadow-xl"></div>
      </div>
      
      <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-yellow-300 mb-10 sm:mb-12">The Altar</h1>

      {!showKavanahInput ? (
        <button
            onClick={handleBeginReadingClick}
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 sm:py-4 px-10 sm:px-12 rounded-lg transition-colors duration-200 text-lg sm:text-xl shadow-lg mb-10"
        >
            Begin a New Reading
        </button>
      ) : (
        <form onSubmit={handleKavanahSubmit} className="w-full max-w-md mb-10 animate-fadeIn">
            <label htmlFor="kavanah" className="block font-cinzel text-yellow-200 text-lg mb-3">
                What is the Tikkun your soul seeks?
            </label>
            <textarea
                id="kavanah"
                value={kavanah}
                onChange={(e) => setKavanah(e.target.value)}
                rows={3}
                className="w-full p-3 rounded bg-slate-800 border border-indigo-600 text-indigo-100 focus:ring-yellow-400 focus:border-yellow-400 text-lg"
                placeholder="Enter your intention here..."
            />
            <button
                type="submit"
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-lg"
            >
                Proceed to Oracle
            </button>
             <button
                type="button"
                onClick={() => setShowKavanahInput(false)}
                className="mt-2 w-full text-indigo-300 hover:text-yellow-300 py-2"
            >
                Cancel
            </button>
        </form>
      )}


      {dailyVessel && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4">
            <DailyVessel vessel={dailyVessel} />
        </div>
      )}
    </div>
  );
};

export default AltarPage;
