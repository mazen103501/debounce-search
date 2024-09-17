import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface SearchResultProps {
  result: {
    place_id: number;
    display_name: string;
    [key: string]: any; // Allow other properties
  };
}

export const SearchResult: React.FC<SearchResultProps> = ({ result }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(
      favorites.some((fav: any) => fav.place_id === result.place_id)
    );
  }, [result.place_id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorite) {
      const newFavorites = favorites.filter(
        (fav: any) => fav.place_id !== result.place_id
      );
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(result);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  return (
    <li>
      <Link to={`/location/${result.place_id}`}>{result.display_name}</Link>
      <button onClick={toggleFavorite}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </li>
  );
};
