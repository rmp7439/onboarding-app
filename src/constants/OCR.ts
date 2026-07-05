export const OCR_STAGES = [
  'Scanning Document',
  'Enhancing Image',
  'Reading Text',
  'Extracting Name',
  'Extracting DOB',
  'Extracting Address',
  'Preparing Review'
] as const;

export const OCR_SIMULATION_DURATION_MS = 5600;
export const OCR_MOCK_CONFIDENCE = 98;
export const OCR_MOCK_RAW_TEXT = "MOCK_OCR_RAW_TEXT_FROM_DOCUMENT";