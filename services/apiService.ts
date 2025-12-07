import { ExtractedData } from '../types';

export const extractArticleData = async (url: string): Promise<ExtractedData> => {
  try {
    const response = await fetch('https://graphic-abstract-api.vercel.app/api/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.data) {
        throw new Error(result.message || 'Extraction failed');
    }

    return result.data;
  } catch (error) {
    console.error("Extraction error:", error);
    throw error;
  }
};
