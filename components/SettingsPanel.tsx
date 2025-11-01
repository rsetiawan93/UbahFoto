import React, { useState, useEffect, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { MENU_ITEMS, HEADSHOT_STYLES } from '../constants';
import { type MenuItemKey, type GenerationSettings } from '../types';

interface SettingsPanelProps {
  activeMenu: MenuItemKey;
  onGenerate: (image: { data: string; mimeType: string } | null, settings: GenerationSettings, menuKey: MenuItemKey) => void;
  onCrop: (croppedImageDataBase64: string) => void;
  isLoading: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
): Promise<string> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
      throw new Error('Could not get canvas context');
  }

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  );
  
  return canvas.toDataURL('image/png').split(',')[1];
}


const FileInput: React.FC<{
  imagePreview: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  activeMenu: MenuItemKey;
  crop: Crop | undefined;
  setCrop: (c: Crop) => void;
  setCompletedCrop: (c: PixelCrop) => void;
  imgRef: React.RefObject<HTMLImageElement>;
  aspect: number | undefined;
}> = ({ imagePreview, onFileChange, activeMenu, crop, setCrop, setCompletedCrop, imgRef, aspect }) => {
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  if (imagePreview) {
    return (
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          {activeMenu === 'crop' ? 'Pilih Area Pangkas' : 'Pratinjau Gambar'}
        </label>
        <div className={`relative ${activeMenu === 'crop' ? '' : 'aspect-square'} rounded-md overflow-hidden border-2 border-gray-600 bg-gray-900 flex items-center justify-center`}>
          {activeMenu === 'crop' ? (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              className="max-w-full max-h-full"
            >
              <img
                ref={imgRef}
                src={imagePreview}
                alt="Image preview"
                className="max-w-full max-h-[50vh] object-contain"
                onLoad={onImageLoad}
              />
            </ReactCrop>
          ) : (
            <img src={imagePreview} alt="Image preview" className="max-w-full max-h-full object-contain" />
          )}
           <label
            htmlFor="file-upload"
            className="absolute bottom-2 right-2 cursor-pointer bg-gray-900/70 text-white rounded-md p-2 text-xs hover:bg-indigo-600 transition-colors"
          >
            Ganti Gambar
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/gif" onChange={onFileChange} />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-400 mb-2">
        Unggah Gambar
      </label>
      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md bg-gray-800 hover:border-indigo-500 transition-colors">
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-gray-500">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none">
              <span>Pilih file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/gif" onChange={onFileChange} />
            </label>
            <p className="pl-1">atau tarik dan lepas</p>
          </div>
          <p className="text-xs text-gray-600">PNG, JPG, GIF hingga 10MB</p>
        </div>
      </div>
    </div>
  );
};


const PromptInput: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ label, placeholder, value, onChange }) => (
    <div className="mt-6">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2">
            {label}
        </label>
        <textarea
            id="prompt"
            name="prompt"
            rows={4}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-500"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        ></textarea>
    </div>
);


const HeadshotSettings: React.FC<{
  selectedStyle: string;
  onStyleSelect: (stylePrompt: string) => void;
}> = ({ selectedStyle, onStyleSelect }) => (
  <div className="mt-6">
    <label className="block text-sm font-medium text-gray-400 mb-2">Pilih Gaya Headshot</label>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {HEADSHOT_STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => onStyleSelect(style.prompt)}
          className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none ${
            selectedStyle === style.prompt ? 'border-indigo-500 scale-105 shadow-lg' : 'border-gray-700 hover:border-indigo-600'
          }`}
        >
          <img src={style.imageUrl} alt={style.name} className="w-full h-24 object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
          <p className="absolute bottom-2 left-2 text-white text-xs font-semibold">{style.name}</p>
          {selectedStyle === style.prompt && (
             <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  </div>
);

const RemoveObjectSettings: React.FC<{ prompt: string; setPrompt: (s: string) }> = ({ prompt, setPrompt }) => (
  <PromptInput label="Deskripsi Objek yang Ingin Dihapus" placeholder="Contoh: Orang yang memakai topi merah di sebelah kiri..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
);

const EnhanceQualitySettings: React.FC<{ level: number; setLevel: (n: number) }> = ({ level, setLevel }) => (
  <div className="mt-6">
      <label htmlFor="enhancement-level" className="block text-sm font-medium text-gray-400 mb-2">Tingkat Peningkatan</label>
      <input type="range" id="enhancement-level" name="enhancement-level" min="1" max="4" value={level} onChange={(e) => setLevel(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Rendah</span>
          <span>Sedang</span>
          <span>Tinggi</span>
          <span>Ultra</span>
      </div>
  </div>
);

const ChangeStyleSettings: React.FC<{ prompt: string; setPrompt: (s: string) }> = ({ prompt, setPrompt }) => (
  <PromptInput label="Deskripsi Gaya Artistik" placeholder="Contoh: Lukisan cat minyak, gaya anime, seni piksel..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
);

const CropSettings: React.FC<{
  aspect: number | undefined;
  setAspect: (n: number | undefined) => void;
}> = ({ aspect, setAspect }) => {
  const aspectRatios = [
    { name: 'Bebas', value: undefined },
    { name: '1:1', value: 1 / 1 },
    { name: '4:3', value: 4 / 3 },
    { name: '16:9', value: 16 / 9 },
  ];

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-400 mb-2">Rasio Aspek</label>
      <div className="flex flex-wrap gap-2">
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.name}
            onClick={() => setAspect(ratio.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              aspect === ratio.value ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {ratio.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const GenerateImageSettings: React.FC<{ 
  prompt: string; 
  setPrompt: (s: string);
  numberOfImages: number;
  setNumberOfImages: (n: number) => void;
  aspectRatio: string;
  setAspectRatio: (r: string) => void;
}> = ({ prompt, setPrompt, numberOfImages, setNumberOfImages, aspectRatio, setAspectRatio }) => {
    const aspectRatios = [
        { name: 'Persegi (1:1)', value: '1:1' },
        { name: 'Lanskap (16:9)', value: '16:9' },
        { name: 'Potret (9:16)', value: '9:16' },
        { name: 'Klasik (4:3)', value: '4:3' },
        { name: 'Vertikal (3:4)', value: '3:4' },
    ];
    
    return (
    <>
      <PromptInput label="Deskripsi Gambar yang Ingin Dibuat" placeholder="Contoh: Astronot sedang bersantai di pantai tropis, gaya seni digital" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="number-of-images" className="block text-sm font-medium text-gray-400 mb-2">Jumlah Gambar</label>
          <input
            type="number"
            id="number-of-images"
            name="number-of-images"
            min="1"
            max="4"
            value={numberOfImages}
            onChange={(e) => setNumberOfImages(Math.max(1, Math.min(4, parseInt(e.target.value, 10))))}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-400 mb-2">Rasio Aspek</label>
          <select
            id="aspect-ratio"
            name="aspect-ratio"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            {aspectRatios.map(ratio => (
              <option key={ratio.value} value={ratio.value}>{ratio.name}</option>
            ))}
          </select>
        </div>
      </div>
    </>
    )
};


const SettingsPanel: React.FC<SettingsPanelProps> = ({ activeMenu, onGenerate, onCrop, isLoading }) => {
  const activeMenuItem = MENU_ITEMS.find((item) => item.key === activeMenu);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [enhancementLevel, setEnhancementLevel] = useState(2);
  const [headshotStyle, setHeadshotStyle] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // State for image generation settings
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [imageAspectRatio, setImageAspectRatio] = useState('1:1');

  // State for cropping tool
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(1);
  const imgRef = useRef<HTMLImageElement>(null);


  useEffect(() => {
    // Reset state when active menu changes
    setImageFile(null);
    setImagePreview(null);
    setPrompt('');
    setEnhancementLevel(2);
    setHeadshotStyle('');
    setNumberOfImages(1);
    setImageAspectRatio('1:1');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setAspect(activeMenu === 'crop' ? 1 : undefined);
    setValidationError(null);
  }, [activeMenu]);

  useEffect(() => {
    if (aspect && imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, aspect);
        setCrop(newCrop);
    }
  }, [aspect]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 10 * 1024 * 1024) {
            setValidationError("Ukuran file tidak boleh melebihi 10MB.");
            return;
        }
        setImageFile(file);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setValidationError(null);

    if (activeMenu === 'generate-image') {
        if (!prompt.trim()) {
            setValidationError("Silakan masukkan deskripsi gambar.");
            return;
        }
        const settings: GenerationSettings = { prompt, numberOfImages, imageAspectRatio };
        onGenerate(null, settings, activeMenu);
        return;
    }
    
    if (!imageFile) {
      setValidationError("Silakan unggah gambar terlebih dahulu.");
      return;
    }

    if (activeMenu === 'crop') {
        if (!completedCrop || !imgRef.current || completedCrop.width === 0) {
            setValidationError("Silakan pilih area untuk dipangkas.");
            return;
        }
        try {
            const croppedBase64 = await getCroppedImg(imgRef.current, completedCrop);
            onCrop(croppedBase64);
        } catch (e: any) {
            setValidationError(`Gagal memangkas gambar: ${e.message}`);
        }
        return;
    }

    if (activeMenu === 'headshot' && !headshotStyle) {
      setValidationError("Silakan pilih gaya headshot.");
      return;
    }
    
    if ( (activeMenu === 'remove-object' || activeMenu === 'change-style') && !prompt.trim() ) {
        setValidationError("Silakan isi deskripsi yang diperlukan.");
        return;
    }

    const imageData = await fileToBase64(imageFile);
    const settings: GenerationSettings = { prompt, enhancementLevel, headshotStyle };
    onGenerate({ data: imageData, mimeType: imageFile.type }, settings, activeMenu);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'generate-image':
        return <GenerateImageSettings 
            prompt={prompt} 
            setPrompt={setPrompt}
            numberOfImages={numberOfImages}
            setNumberOfImages={setNumberOfImages}
            aspectRatio={imageAspectRatio}
            setAspectRatio={setImageAspectRatio}
        />;
      case 'headshot':
        return <HeadshotSettings selectedStyle={headshotStyle} onStyleSelect={setHeadshotStyle} />;
      case 'remove-object':
        return <RemoveObjectSettings prompt={prompt} setPrompt={setPrompt} />;
      case 'enhance-quality':
        return <EnhanceQualitySettings level={enhancementLevel} setLevel={setEnhancementLevel} />;
      case 'change-style':
        return <ChangeStyleSettings prompt={prompt} setPrompt={setPrompt} />;
      case 'crop':
        return <CropSettings aspect={aspect} setAspect={setAspect} />;
      default:
        return <p>Pilih menu untuk memulai.</p>;
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Memproses...";
    if (activeMenu === 'crop') return "Pangkas Gambar";
    return "Hasilkan Gambar";
  }
  
  const isButtonDisabled = isLoading;

  return (
    <main className="w-full md:w-[30%] flex-shrink-0 bg-gray-800/50 p-4 sm:p-6 md:p-8 overflow-y-auto h-full">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{activeMenuItem?.label}</h2>
          <p className="text-gray-400 mt-1">{activeMenuItem?.description}</p>
        </header>
        
        <div id="tutorial-upload" className="bg-gray-900/50 p-4 sm:p-6 rounded-xl border border-gray-700">
            {activeMenu !== 'generate-image' && (
              <FileInput
                  imagePreview={imagePreview}
                  onFileChange={handleFileChange}
                  activeMenu={activeMenu}
                  crop={crop}
                  setCrop={setCrop}
                  setCompletedCrop={setCompletedCrop}
                  imgRef={imgRef}
                  aspect={aspect}
              />
            )}
            <div id="tutorial-settings">
              {renderContent()}
            </div>
        </div>
        
        {validationError && (
            <div className="mt-4 text-center p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-300">{validationError}</p>
            </div>
        )}

        <div className="mt-8">
          <button
            id="tutorial-generate-button"
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : (
              getButtonText()
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default SettingsPanel;