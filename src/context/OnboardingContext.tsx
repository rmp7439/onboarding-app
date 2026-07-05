import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AadhaarData } from '../types/Aadhaar';

// 1. Logical Grouping Interfaces
export interface MediaData {
  aadhaarFrontUri?: string | null;
  aadhaarBackUri?: string | null;
  selfieUri?: string | null;
  uploadedDocuments?: string[];
}

export interface OCRMetaData {
  ocrConfidence?: number;
  ocrRawText?: string;
  editedFields?: string[];
}

// 2. Flat Data Model 
// Combines the logical groups into a single flat interface to preserve backward compatibility
// so that existing screens can continue using `data.fullName`, `updateData({ fullName: '...' })`, etc.
export interface OnboardingData extends Partial<AadhaarData>, MediaData, OCRMetaData {}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  resetData: () => void;
}

const INITIAL_DATA: OnboardingData = {
  // Personal & Document Info (from AadhaarData)
  fullName: '',
  dateOfBirth: '',
  gender: '',
  aadhaarNumber: '',
  address: '',
  city: '',
  state: '',
  pinCode: '',

  // Media Attachments (from MediaData)
  aadhaarFrontUri: null,
  aadhaarBackUri: null,
  selfieUri: null,
  uploadedDocuments: [],

  // Processing Meta (from OCRMetaData)
  ocrConfidence: 0,
  ocrRawText: '',
  editedFields: [],
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const resetData = () => {
    setData(INITIAL_DATA);
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}