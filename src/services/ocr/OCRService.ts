import { OCRResult } from '../../types/OCR';
import { OCR_SIMULATION_DURATION_MS, OCR_MOCK_CONFIDENCE, OCR_MOCK_RAW_TEXT } from '../../constants/OCR';

export interface OCRService {
  extract(imageFront: string, imageBack: string): Promise<OCRResult>;
}

class OCRServiceImpl implements OCRService {
  async extract(imageFront: string, imageBack: string): Promise<OCRResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          rawText: OCR_MOCK_RAW_TEXT,
          confidence: OCR_MOCK_CONFIDENCE,
        });
      }, OCR_SIMULATION_DURATION_MS);
    });
  }
}

export const ocrService = new OCRServiceImpl();