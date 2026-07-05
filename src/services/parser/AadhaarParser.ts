import { AadhaarData } from '../../types/Aadhaar';
import { DEMO_DATA } from '../../constants/App';

export interface AadhaarParserService {
  parse(text: string): Promise<AadhaarData>;
}

class AadhaarParserServiceImpl implements AadhaarParserService {
  async parse(text: string): Promise<AadhaarData> {
    // TODO: Implement actual parsing logic (e.g., Regex patterns to extract fields from raw OCR text)
    // Wrapped in a promise to standardize async service layer
    return Promise.resolve(DEMO_DATA.EMPLOYEE);
  }
}

export const aadhaarParser = new AadhaarParserServiceImpl();