import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface LocationDetailsProps {
  place_id: number;
  display_name: string;
  addresstags: Record<string, string>;
  admin_level: number;
  calculated_importance: number;
  calculated_postcode: string;
  calculated_wikipedia: string;
  category: string;
  centroid: { type: string; coordinates: [number, number] };
  country_code: string;
  extratags: Record<string, string>;
  geometry: { type: string; coordinates: [number, number] };
  importance: number;
  indexed_date: string;
  isarea: boolean;
  localname: string;
  names: Record<string, string>;
  osm_id: number;
  osm_type: string;
  parent_place_id: number;
  rank_address: number;
  rank_search: number;
  type: string;
}

const LocationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<LocationDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/details?place_id=${id}&format=json`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLocation(data);
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(
          favorites.some((fav: any) => fav.place_id === data.place_id)
        );
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

    fetchLocationDetails();
  }, [id]);

  const toggleFavorite = () => {
    if (!location) return;
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const newFavorites = favorites.filter(
      (fav: any) => fav.place_id !== location.place_id
    );
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!location) {
    return <div>No location details found.</div>;
  }

  const { centroid } = location;
  const lat = centroid.coordinates[1];
  const lon = centroid.coordinates[0];

  return (
    <div>
      <h1>{location.localname}</h1>
      {isFavorite && (
        <button onClick={toggleFavorite}>Remove from Favorites</button>
      )}
      <p>
        <strong>Local Name:</strong> {location.localname}
      </p>
      <p>
        <strong>Latitude:</strong> {lat}
      </p>
      <p>
        <strong>Longitude:</strong> {lon}
      </p>
      <p>
        <strong>Category:</strong> {location.category}
      </p>
      <p>
        <strong>Type:</strong> {location.type}
      </p>
      <p>
        <strong>Country Code:</strong> {location.country_code}
      </p>
      <p>
        <strong>Admin Level:</strong> {location.admin_level}
      </p>
      <p>
        <strong>Importance:</strong> {location.importance}
      </p>
      <p>
        <strong>Calculated Importance:</strong> {location.calculated_importance}
      </p>
      <p>
        <strong>Postcode:</strong> {location.calculated_postcode}
      </p>
      <p>
        <strong>Indexed Date:</strong>{" "}
        {new Date(location.indexed_date).toLocaleString()}
      </p>
      <p>
        <strong>OSM ID:</strong> {location.osm_id}
      </p>
      <p>
        <strong>OSM Type:</strong> {location.osm_type}
      </p>
      <p>
        <strong>Parent Place ID:</strong> {location.parent_place_id}
      </p>
      <p>
        <strong>Rank Address:</strong> {location.rank_address}
      </p>
      <p>
        <strong>Rank Search:</strong> {location.rank_search}
      </p>
      <p>
        <strong>Is Area:</strong> {location.isarea ? "Yes" : "No"}
      </p>
      <h2>Extra Tags</h2>
      <ul>
        {Object.entries(location.extratags).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
      <h2>Address Tags</h2>
      <ul>
        {Object.entries(location.addresstags).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationDetails;
