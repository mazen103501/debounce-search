// Define the type for the search result
interface SearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
}

// Debounce function
const debounce = (
  func: (query: string, signal: AbortSignal) => void,
  delay: number
) => {
  let timeoutId: number;
  let abortController: AbortController | null = null;

  return (query: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();
    const signal = abortController.signal;

    timeoutId = window.setTimeout(() => {
      func(query, signal);
    }, delay);
  };
};

// Search locations function
const searchLocations = async (
  query: string,
  signal: AbortSignal
): Promise<void> => {
  setLoading(true);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
      { signal }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: SearchResult[] = await response.json();
    updateErrorMessage(""); // Clear any previous error message
    displayResults(data);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error fetching data:", error);
        updateErrorMessage("Error fetching data: " + error.message);
      }
    } else {
      console.error("Unknown error", error);
      updateErrorMessage("Unknown error");
    }
  } finally {
    setLoading(false); // Hide loading indicator
  }
};

// Display results function
const displayResults = (results: SearchResult[]): void => {
  const resultsList = document.getElementById("results-list");
  if (resultsList) {
    resultsList.innerHTML = "";
    results.forEach((result) => {
      const listItem = document.createElement("li");
      listItem.textContent = result.display_name;
      resultsList.appendChild(listItem);
    });
  }
};

// Debounced search function
const debouncedSearch = debounce(searchLocations, 1000);

// Event listener for the input field
document.getElementById("search-input")?.addEventListener("input", (event) => {
  const target = event.target as HTMLInputElement;
  updateErrorMessage(""); // Clear any previous error message

  // Clear the results if the input is empty and return early from the function to avoid making a request
  if (target.value.length === 0) {
    displayResults([]);
    setLoading(false); // Hide loading indicator
    return;
  }

  debouncedSearch(target.value);
});

// Update Error Message In The DOM
const updateErrorMessage = (message: string) => {
  const errorSpan = document.querySelector(".search-container span");
  if (errorSpan) {
    errorSpan.textContent = message;
  }
};

// Set Loading State
const setLoading = (isLoading: boolean) => {
  const loadingDiv = document.getElementById("loading");
  if (loadingDiv) {
    loadingDiv.style.display = isLoading ? "block" : "none";
  }
};
