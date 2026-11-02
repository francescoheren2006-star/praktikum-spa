import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (value === null) {
    throw new Error("useFavorites harus di dalam provider");
  }
  return value;
}
