import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import PreviewPanel from './components/PreviewPanel';
import Tutorial from './components/Tutorial';
import { type MenuItemKey, type GenerationSettings } from './types';
import { TUTORIAL_STEPS } from './constants';


const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuItemKey>('headshot');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setIsTutorialActive(true);
    }
  }, []);

  const startTutorial = () => {
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

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    try {
        if (menuKey === 'generate-image') {
            if (!settings.prompt) {
                throw new Error("Silakan masukkan prompt untuk membuat gambar.");
            }
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: settings.prompt,
                config: {
                  numberOfImages: settings.numberOfImages || 1,
                  aspectRatio: settings.imageAspectRatio || '1:1',
                  outputMimeType: 'image/png',
                },
            });

            const images = response.generatedImages?.map(img => img.image?.imageBytes).filter(Boolean) as string[];

            if (images.length > 0) {
                setGeneratedImages(images);
            } else {
                throw new Error("Tidak ada gambar yang dihasilkan. Respons API tidak valid.");
            }
            return;
        }
        
        if (!image) {
            throw new Error("Silakan unggah gambar terlebih dahulu untuk mode ini.");
        }

        let fullPrompt = '';
        switch (menuKey) {
            case 'headshot':
                if (!settings.headshotStyle) {
                    throw new Error("Silakan pilih gaya headshot.");
                }
                fullPrompt = `Generate a professional headshot of the person in this photo. The style should be: ${settings.headshotStyle}. Preserve the person's facial features and likeness accurately. The final image should be a high-quality portrait.`;
                break;
            case 'remove-object':
                fullPrompt = `Remove this from the image: ${settings.prompt}. Fill in the empty space realistically as if the object was never there.`;
                break;
            case 'enhance-quality':
                const levels: { [key: number]: string } = {
                  1: 'Slightly improve',
                  2: 'Improve',
                  3: 'Significantly improve',
                  4: 'Dramatically improve and upscale'
                };
                const enhancementDescription = levels[settings.enhancementLevel || 2];
                fullPrompt = `${enhancementDescription} the quality, sharpness, and detail of this image. Fix any compression artifacts or blurriness.`;
                break;
            case 'change-style':
                fullPrompt = `Recreate this image in the style of: ${settings.prompt}.`;
                break;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: image.data,
                            mimeType: image.mimeType,
                        },
                    },
                    {
                        text: fullPrompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstPart = response.candidates?.[0]?.content?.parts?.[0];
        if (firstPart && firstPart.inlineData) {
            setGeneratedImages([firstPart.inlineData.data]);
        } else {
            throw new Error("Tidak ada gambar yang dihasilkan. Respons API tidak valid.");
        }

    } catch (e: any) {
        console.error(e);
        setError(`Gagal menghasilkan gambar: ${e.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div id="app-container" className="flex flex-col md:flex-row h-screen bg-gray-900 text-gray-200 font-sans">
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