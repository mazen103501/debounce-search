import React, { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { SearchResult } from "./SearchResult";

interface SearchResultType {
  place_id: number;
  display_name: string;
  [key: string]: any; // Allow other properties
}

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debouncedQuery = useDebounce(query, 1000);

  useEffect(() => {
    if (debouncedQuery) {
      searchLocations(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const searchLocations = async (query: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: SearchResultType[] = await response.json();
      setResults(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <label htmlFor="search-input">Search:</label>
      <input
        type="text"
        id="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a location..."
      />
      <span>{error}</span>
      {loading && <div id="loading">Loading...</div>}
      {!loading && results.length === 0 && debouncedQuery && <p>No results</p>}
      <ul id="results-list">
        {results.map((result) => (
          <SearchResult key={result.place_id} result={result} />
        ))}
      </ul>
    </div>
  );
};

export default Search;
