import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (venueId: string) => void;
  isFavorite: (venueId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => storage.getFavorites());

  useEffect(() => {
    storage.setFavorites(favorites);
  }, [favorites]);

  const toggleFavorite = (venueId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(venueId);
      if (exists) {
        return prev.filter(id => id !== venueId);
      } else {
        return [...prev, venueId];
      }
    });
  };

  const isFavorite = (venueId: string) => {
    return favorites.includes(venueId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
