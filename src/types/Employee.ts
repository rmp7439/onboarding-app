import { AadhaarData } from './Aadhaar';

export interface Employee extends Partial<AadhaarData> {
  selfieUri?: string | null;
  uploadedDocuments?: string[];
}