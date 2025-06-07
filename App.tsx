import React, { useState, useCallback } from 'react';
import { Page } from './types';
import BottomNav from './components/BottomNav';
import AltarPage from './pages/AltarPage';
import OraclePage from './pages/OraclePage';
import CompassPage from './pages/CompassPage';
import JournalPage from './pages/JournalPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Altar);
  const [kavanahForOracle, setKavanahForOracle] = useState<string>(""); // Used to pass kavanah from Altar to Oracle

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const startNewReading = useCallback((kavanah: string) => {
    setKavanahForOracle(kavanah);
    setCurrentPage(Page.Oracle);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Altar:
        return <AltarPage onNavigate={handleNavigate} onStartNewReading={startNewReading} />;
      case Page.Oracle:
        return <OraclePage kavanah={kavanahForOracle} onNavigate={handleNavigate} />;
      case Page.Compass:
        return <CompassPage onNavigate={handleNavigate} />;
      case Page.Journal:
        return <JournalPage onNavigate={handleNavigate} />;
      default:
        return <AltarPage onNavigate={handleNavigate} onStartNewReading={startNewReading} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950">
      <main className="flex-grow overflow-y-auto">
        {renderPage()}
      </main>
      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
