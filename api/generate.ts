import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerationSettings, MenuItemKey } from '../src/types';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { image, settings, menuKey } = req.body as {
      image: { data: string; mimeType: string } | null,
      settings: GenerationSettings,
      menuKey: MenuItemKey
  };
  
  if (!process.env.API_KEY) {
    return res.status(500).json({ error: 'Kunci API Gemini tidak dikonfigurasi di server.' });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    if (menuKey === 'generate-image') {
        if (!settings.prompt) {
            return res.status(400).json({ error: "Silakan masukkan prompt untuk membuat gambar." });
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
            return res.status(200).json({ images });
        } else {
            throw new Error("Tidak ada gambar yang dihasilkan. Respons API tidak valid.");
        }
    }
    
    if (!image) {
        return res.status(400).json({ error: "Silakan unggah gambar terlebih dahulu untuk mode ini." });
    }

    let fullPrompt = '';
    switch (menuKey) {
        case 'headshot':
            if (!settings.headshotStyle) {
                return res.status(400).json({ error: "Silakan pilih gaya headshot." });
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
        return res.status(200).json({ images: [firstPart.inlineData.data] });
    } else {
        throw new Error("Tidak ada gambar yang dihasilkan. Respons API tidak valid.");
    }
  } catch (e: any) {
    console.error('Error during API call:', e);
    res.status(500).json({ error: `Gagal menghasilkan gambar: ${e.message}` });
  }
}