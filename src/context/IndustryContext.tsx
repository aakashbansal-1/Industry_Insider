import React, { createContext, useContext, useState, ReactNode } from 'react';

interface IndustryContextType {
  industry: string;
  setIndustry: (industry: string) => void;
  geo: string;
  setGeo: (geo: string) => void;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

export const IndustryProvider = ({ children }: { children: ReactNode }) => {
  const [industry, setIndustry] = useState<string>('');
  const [geo, setGeo] = useState<string>('World');

  return (
    <IndustryContext.Provider value={{ industry, setIndustry, geo, setGeo }}>
      {children}
    </IndustryContext.Provider>
  );
};

export const useIndustry = () => {
  const context = useContext(IndustryContext);
  if (context === undefined) {
    throw new Error('useIndustry must be used within an IndustryProvider');
  }
  return context;
};
