import React, { useState, useLayoutEffect } from 'react';
import { type TutorialStep } from '../types';

interface TutorialProps {
  step: TutorialStep;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
  currentStepIndex: number;
  totalSteps: number;
}

const Tutorial: React.FC<TutorialProps> = ({ 
    step, onNext, onPrev, onSkip, isFirst, isLast, currentStepIndex, totalSteps
}) => {
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    const updatePosition = () => {
      if (step.targetId) {
        const elem = document.getElementById(step.targetId);
        if (elem) {
          const rect = elem.getBoundingClientRect();
          setHighlightRect(rect);
          
          let newTop = 0, newLeft = 0;
          const offset = 12; // 12px gap between element and popover

          switch (step.position) {
            case 'bottom':
              newTop = rect.bottom + offset;
              newLeft = rect.left + rect.width / 2;
              break;
            case 'top':
              newTop = rect.top - offset;
              newLeft = rect.left + rect.width / 2;
              break;
            case 'left':
              newTop = rect.top + rect.height / 2;
              newLeft = rect.left - offset;
              break;
            case 'right':
              newTop = rect.top + rect.height / 2;
              newLeft = rect.right + offset;
              break;
            case 'center':
                newTop = window.innerHeight / 2;
                newLeft = window.innerWidth / 2;
          }
          setPopoverPos({ top: newTop, left: newLeft });

        }
      } else {
        setHighlightRect(null);
        setPopoverPos({ top: window.innerHeight / 2, left: window.innerWidth / 2 });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [step]);
  
  const getPopoverTransform = () => {
      switch (step.position) {
        case 'bottom': return 'translate(-50%, 0)';
        case 'top': return 'translate(-50%, -100%)';
        case 'left': return 'translate(-100%, -50%)';
        case 'right': return 'translate(0, -50%)';
        case 'center': return 'translate(-50%, -50%)';
      }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        style={{
            clipPath: highlightRect 
                ? `path(evenodd, "M0 0 H ${window.innerWidth} V ${window.innerHeight} H 0 Z M ${highlightRect.x - 4} ${highlightRect.y - 4} H ${highlightRect.x + highlightRect.width + 4} V ${highlightRect.y + highlightRect.height + 4} H ${highlightRect.x - 4} Z")`
                : 'none'
        }}
      ></div>
      <div
          className="absolute bg-transparent border-2 border-indigo-400 rounded-lg pointer-events-none transition-all duration-300 shadow-[0_0_20px_5px] shadow-indigo-500/50"
          style={{
              top: (highlightRect?.top ?? 0) - 6,
              left: (highlightRect?.left ?? 0) - 6,
              width: (highlightRect?.width ?? 0) + 12,
              height: (highlightRect?.height ?? 0) + 12,
              opacity: highlightRect ? 1 : 0,
          }}
      ></div>

      <div
        className="absolute w-full max-w-sm bg-gray-800 text-white p-5 rounded-lg shadow-2xl border border-gray-700 transition-all duration-300"
        style={{ 
            top: popoverPos.top, 
            left: popoverPos.left,
            transform: getPopoverTransform(),
        }}
      >
        <h3 className="text-lg font-bold text-indigo-400 mb-2">{step.title}</h3>
        <p className="text-sm text-gray-300 mb-4">{step.content}</p>
        
        <div className="flex justify-between items-center">
          <button onClick={onSkip} className="text-xs text-gray-500 hover:text-white">Lewati</button>
          
          <div className="flex items-center gap-2">
            {!isFirst && <button onClick={onPrev} className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md">Sebelumnya</button>}
            <button onClick={onNext} className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-md">
                {isLast ? 'Selesai' : 'Berikutnya'}
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-4">
            <div className="flex gap-1.5">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <div 
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentStepIndex ? 'bg-indigo-500' : 'bg-gray-600'}`}
                    />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Tutorial;