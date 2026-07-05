import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OnboardingData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  aadhaarNumber: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  employeePhoto: string | null;
  uploadedDocuments: string[];
}

const defaultData: OnboardingData = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  aadhaarNumber: '',
  address: '',
  city: '',
  state: '',
  pinCode: '',
  employeePhoto: null,
  uploadedDocuments: [],
};

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  resetData: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const resetData = () => {
    setData(defaultData);
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}