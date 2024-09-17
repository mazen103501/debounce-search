import React, { useState, useEffect } from "react";

interface SearchResultType {
  place_id: number;
  display_name: string;
  [key: string]: any;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<SearchResultType[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  const removeFavorite = (place_id: number) => {
    const updatedFavorites = favorites.filter(
      (fav) => fav.place_id !== place_id
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <h1>Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorite locations</p>
      ) : (
        <ul>
          {favorites.map((fav) => (
            <li key={fav.place_id}>
              {fav.display_name}
              <button onClick={() => removeFavorite(fav.place_id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
