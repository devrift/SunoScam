import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { OnboardingScreen } from './components/OnboardingScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ReportScreen } from './components/ReportScreen';
import { ScanBottomSheet } from './components/ScanBottomSheet';
import { SettingsModal } from './components/SettingsModal';
import { HealthDrawer } from './components/HealthDrawer';
import { HistoryModal } from './components/HistoryModal';
import { analyzeWithGemini } from './services/gemini';
import type { Screen, ScanResult, UserSettings, AttachedFile } from './types';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  language: 'Hinglish',
  sensitivity: 'Standard'
};

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const onboarded = localStorage.getItem('hasOnboarded');
    return onboarded === 'true' ? 'dashboard' : 'onboarding';
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('scamsuno_user_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isScanSheetOpen, setIsScanSheetOpen] = useState(false);
  const [scanInitialText, setScanInitialText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // History state
  const [history, setHistory] = useState<ScanResult[]>(() => {
    try {
      const saved = localStorage.getItem('scamsuno_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('scamsuno_user_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save settings to localStorage', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('scamsuno_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  }, [history]);

  // Safety: If on report screen without a result, fall back to dashboard
  useEffect(() => {
    if (currentScreen === 'report' && !currentResult) {
      if (history.length > 0) {
        setCurrentResult(history[0]);
      } else {
        setCurrentScreen('dashboard');
      }
    }
  }, [currentScreen, currentResult, history]);

  const handleGetStarted = () => {
    localStorage.setItem('hasOnboarded', 'true');
    setCurrentScreen('dashboard');
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem('hasOnboarded');
    setCurrentScreen('onboarding');
  };

  const handleOpenScanSheet = (text?: string) => {
    setScanInitialText(text || '');
    setIsScanSheetOpen(true);
    setApiError(null);
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleAnalyze = async (text: string, files: AttachedFile[]) => {
    // 1. Close bottom sheet
    setIsScanSheetOpen(false);
    setApiError(null);

    // 2. Ensure we are on Dashboard to view the 3D Orb radar
    setCurrentScreen('dashboard');
    setIsScanning(true);

    const startTime = Date.now();

    try {
      // 3. Call live Gemini API directly
      const result = await analyzeWithGemini(text, files, settings);

      // Ensure minimum 1.2s scanning effect so user sees the 3D radar sweep
      const elapsed = Date.now() - startTime;
      const delayNeeded = Math.max(0, 1200 - elapsed);

      setTimeout(() => {
        setIsScanning(false);
        setCurrentResult(result);
        setHistory((prev) => [result, ...prev.filter((item) => item.id !== result.id)]);
        setCurrentScreen('report');
      }, delayNeeded);
    } catch (err: unknown) {
      console.error('Scan error:', err);
      setIsScanning(false);
      const errMsg = err instanceof Error ? err.message : 'API Error: Check API Key in Settings';
      setApiError(errMsg);
    }
  };

  const handleSelectHistoryScan = (scan: ScanResult) => {
    setCurrentResult(scan);
    setApiError(null);
    setCurrentScreen('report');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('scamsuno_history');
  };

  // Canvas background based on appearance setting
  const canvasBgClass = settings.theme === 'slate' ? 'bg-[#121724]' : 'bg-[#0B0D13]';
  const outerBgClass = settings.theme === 'slate' ? 'bg-[#0A0D15]' : 'bg-[#07080D]';

  return (
    <div className={`min-h-screen w-full ${outerBgClass} flex items-center justify-center p-0 sm:p-3 md:p-5 overflow-x-hidden transition-colors duration-300`}>
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FF6B00]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#FF3D00]/5 rounded-full blur-[120px]" />
      </div>

      {/* Screen Frame Container (Mobile-first, Responsive) */}
      <div className={`relative w-full max-w-[410px] h-[100dvh] sm:h-[min(844px,96vh)] ${canvasBgClass} sm:rounded-[40px] sm:border-[6px] sm:border-[#1E2536] shadow-[0_24px_64px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col justify-between transition-colors duration-300 my-auto`}>
        {/* Screen Transitions */}
        <div className="relative w-full h-full flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {currentScreen === 'onboarding' && (
              <motion.div
                key="screen-onboarding"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <OnboardingScreen onGetStarted={handleGetStarted} />
              </motion.div>
            )}

            {currentScreen === 'dashboard' && (
              <motion.div
                key="screen-dashboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <DashboardScreen
                  onNavigate={setCurrentScreen}
                  onOpenScanSheet={handleOpenScanSheet}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  onOpenHealth={() => setIsHealthOpen(true)}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                  isScanning={isScanning}
                  apiError={apiError}
                />
              </motion.div>
            )}

            {currentScreen === 'report' && currentResult && (
              <motion.div
                key="screen-report"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <ReportScreen
                  result={currentResult}
                  onNavigate={setCurrentScreen}
                  onOpenScanSheet={() => handleOpenScanSheet()}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                  onOpenHealth={() => setIsHealthOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scan Input Animated Bottom Sheet with Universal File Upload */}
        <ScanBottomSheet
          isOpen={isScanSheetOpen}
          onClose={() => setIsScanSheetOpen(false)}
          onAnalyze={handleAnalyze}
          initialText={scanInitialText}
        />

        {/* Consumer Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClearHistory={handleClearHistory}
          onResetOnboarding={handleResetOnboarding}
        />

        {/* Health Status Drawer */}
        <HealthDrawer
          isOpen={isHealthOpen}
          onClose={() => setIsHealthOpen(false)}
        />

        {/* Past Scans History Modal */}
        <HistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onSelectScan={handleSelectHistoryScan}
          onClearHistory={handleClearHistory}
        />
      </div>
    </div>
  );
};

export default App;
