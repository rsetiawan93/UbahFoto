import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import PreviewPanel from './components/PreviewPanel';
import Tutorial from './components/Tutorial';
import { type MenuItemKey, type GenerationSettings } from './types';
import { TUTORIAL_STEPS } from './constants';


const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuItemKey>('generate-image');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    const isMobile = window.innerWidth < 768;
    if (!hasSeenTutorial && !isMobile) {
      setIsTutorialActive(true);
    }
  }, []);

  const startTutorial = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      alert('Fitur tutorial hanya tersedia di tampilan desktop untuk pengalaman terbaik.');
      return;
    }
    setCurrentTutorialStep(0);
    setIsTutorialActive(true);
  };

  const handleTutorialNext = () => {
    if (currentTutorialStep < TUTORIAL_STEPS.length - 1) {
      setCurrentTutorialStep(prev => prev + 1);
    } else {
      finishTutorial();
    }
  };

  const handleTutorialPrev = () => {
    if (currentTutorialStep > 0) {
      setCurrentTutorialStep(prev => prev - 1);
    }
  };

  const finishTutorial = () => {
    setIsTutorialActive(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };


  const handleMenuSelect = (key: MenuItemKey) => {
    setActiveMenu(key);
    setGeneratedImages([]);
    setError(null);
  };

  const handleCrop = (croppedImageDataBase64: string) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    
    // Simulate a small delay for user feedback
    setTimeout(() => {
        setGeneratedImages([croppedImageDataBase64]);
        setIsLoading(false);
    }, 200);
  };


  const handleGenerate = async (
    image: { data: string; mimeType: string } | null,
    settings: GenerationSettings,
    menuKey: MenuItemKey
  ) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image, settings, menuKey }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Terjadi kesalahan pada server.');
      }
      
      if (result.images && result.images.length > 0) {
        setGeneratedImages(result.images);
      } else {
        throw new Error("Tidak ada gambar yang dihasilkan. Respons dari server tidak valid.");
      }

    } catch (e: any) {
        console.error(e);
        setError(`Gagal menghasilkan gambar: ${e.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div id="app-container" className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-gray-200 font-sans pb-28 md:pb-0">
      {isTutorialActive && (
        <Tutorial 
            step={TUTORIAL_STEPS[currentTutorialStep]}
            onNext={handleTutorialNext}
            onPrev={handleTutorialPrev}
            onSkip={finishTutorial}
            isFirst={currentTutorialStep === 0}
            isLast={currentTutorialStep === TUTORIAL_STEPS.length - 1}
            currentStepIndex={currentTutorialStep}
            totalSteps={TUTORIAL_STEPS.length}
        />
      )}
      <Sidebar activeMenu={activeMenu} onMenuSelect={handleMenuSelect} onStartTutorial={startTutorial} />
      <SettingsPanel activeMenu={activeMenu} onGenerate={handleGenerate} onCrop={handleCrop} isLoading={isLoading} />
      <PreviewPanel isLoading={isLoading} generatedImages={generatedImages} error={error} />
    </div>
  );
};

export default App;