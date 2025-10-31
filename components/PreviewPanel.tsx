import React, { useState } from 'react';
import { SpinnerIcon, DownloadIcon } from './icons';

interface PreviewPanelProps {
  isLoading: boolean;
  generatedImages: string[];
  error: string | null;
}

const Placeholder: React.FC = () => (
  <div className="text-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <h3 className="mt-4 text-lg font-medium text-gray-300">Hasil Gambar</h3>
    <p className="mt-1 text-sm text-gray-500">
        Gambar yang telah digenerate akan muncul di sini.
    </p>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="text-center">
    <SpinnerIcon className="mx-auto h-16 w-16 text-indigo-400" />
    <h3 className="mt-4 text-lg font-medium text-gray-300">Sedang Membuat Keajaiban...</h3>
    <p className="mt-1 text-sm text-gray-500">
        AI sedang bekerja, mohon tunggu sebentar.
    </p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-white">Oops! Terjadi Kesalahan</h3>
        <p className="mt-1 text-sm text-red-400/80 break-words max-w-xs mx-auto">
            {message}
        </p>
    </div>
);


const PreviewPanel: React.FC<PreviewPanelProps> = ({ isLoading, generatedImages, error }) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const handleDownload = (imageData: string, index: number) => {
    if (!imageData) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageData}`;
    link.download = `ubah-foto-${Date.now()}-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    if (error) {
      return <ErrorState message={error} />;
    }
    if (generatedImages.length > 0) {
      return (
        <>
          {zoomedImage && (
            <div 
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 cursor-zoom-out"
              onClick={() => setZoomedImage(null)}
            >
              <img 
                src={`data:image/png;base64,${zoomedImage}`} 
                alt="Generated result zoomed" 
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
          )}

          {generatedImages.length === 1 ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <button 
                  onClick={() => setZoomedImage(generatedImages[0])}
                  className="w-full flex-1 min-h-0 flex items-center justify-center focus:outline-none cursor-zoom-in"
                  aria-label="Zoom into image"
              >
                <img 
                    src={`data:image/png;base64,${generatedImages[0]}`} 
                    alt="Generated result" 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              </button>
              <button
                  onClick={() => handleDownload(generatedImages[0], 0)}
                  className="flex-shrink-0 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
              >
                  <DownloadIcon className="w-5 h-5" />
                  Unduh Gambar
              </button>
            </div>
          ) : (
            <div className="w-full h-full grid grid-cols-2 gap-4 overflow-y-auto p-1">
              {generatedImages.map((image, index) => (
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden">
                  <img
                    src={`data:image/png;base64,${image}`}
                    alt={`Generated result ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => setZoomedImage(image)}
                      className="text-white p-2 rounded-full bg-gray-900/50 hover:bg-gray-900/80 transition-colors"
                      aria-label="Zoom"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-3a1 1 0 011 1v2h2a1 1 0 110 2H9v2a1 1 0 11-2 0V9H5a1 1 0 110-2h2V5a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    </button>
                     <button
                      onClick={() => handleDownload(image, index)}
                      className="text-white p-2 rounded-full bg-gray-900/50 hover:bg-gray-900/80 transition-colors"
                      aria-label="Download"
                    >
                      <DownloadIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      );
    }
    return <Placeholder />;
  };

  return (
    <aside className="w-full md:w-[50%] flex-shrink-0 h-full bg-gray-900 p-8 flex flex-col items-center justify-center border-l border-gray-800 overflow-auto">
      <div id="tutorial-preview" className={`w-full h-full max-w-2xl flex flex-col items-center justify-center bg-gray-800 rounded-xl ${generatedImages.length > 0 ? 'p-2' : 'p-4 border-2 border-dashed border-gray-700'}`}>
        {renderContent()}
      </div>
    </aside>
  );
};

export default PreviewPanel;