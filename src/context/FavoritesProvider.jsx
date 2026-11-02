import { FavoritesContext } from "./FavoritesContext";
import { usePersistentFavorites } from "../hooks/usePersistentFavorites";

export function FavoritesProvider({ children }) {
  const value = usePersistentFavorites();
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

