import React, { createContext, useContext, useState } from 'react';

interface ComparisonContextType {
  compareIds: string[];
  addToCompare: (venueId: string) => boolean; // returns true if added, false if already in or full
  removeFromCompare: (venueId: string) => void;
  isInCompare: (venueId: string) => boolean;
  clearCompare: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareIds, setCompareIds] = useState<string[]>(['venue_1', 'venue_2']);

  const addToCompare = (venueId: string): boolean => {
    if (compareIds.includes(venueId)) {
      return false;
    }
    if (compareIds.length >= 3) {
      return false; // max 3
    }
    setCompareIds(prev => [...prev, venueId]);
    return true;
  };

  const removeFromCompare = (venueId: string) => {
    setCompareIds(prev => prev.filter(id => id !== venueId));
  };

  const isInCompare = (venueId: string) => {
    return compareIds.includes(venueId);
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  return (
    <ComparisonContext.Provider
      value={{
        compareIds,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = (): ComparisonContextType => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
