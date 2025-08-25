/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import { useMovieStore } from "@/store/useMovieStore";
import DefaultLayout from "@/layouts/default";

// Re-using the individual card structure from MovieRow for consistency
interface SearchResultItem {
  id: number;
  title?: string;
  name?: string;
  vote_average?: number;
  release_date?: string;
  media_type?: string;
  first_air_date?: string;
  poster_path?: string;
}

// Skeleton Card Component
const SkeletonCard = () => (
  <div className="group relative overflow-hidden rounded-lg w-full text-left bg-neutral-900 shadow-lg animate-pulse">
    <div className="w-full aspect-[2/3] bg-neutral-700 flex items-center justify-center">
      {/* Placeholder for image */}
    </div>
    <div className="p-3">
      <div className="h-4 bg-neutral-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-neutral-700 rounded w-1/2" />
    </div>
  </div>
);

export default function SearchPage() {
  const {
    searchResults,
    searchQuery,
    setSearchQuery,
    fetchSearchResults,
    loading,
    error,
  } = useMovieStore();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchQuery);
  const [debouncedSearchTerm] = useDebounce(localSearchTerm, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    setSearchQuery(debouncedSearchTerm);
    if (debouncedSearchTerm) {
      fetchSearchResults(debouncedSearchTerm);
    } else {
      useMovieStore.setState({ searchResults: [] });
    }
  }, [debouncedSearchTerm, fetchSearchResults, setSearchQuery]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    useMovieStore.setState({ searchResults: [], searchQuery: "" });
    setLocalSearchTerm("");
  }, []);

  const handleCardClick = (item: SearchResultItem) => {
    if (item.media_type === "tv") {
      navigate(`/tv/${item.id}`);
    } else {
      navigate(`/movie/${item.id}`);
    }
  };

  return (
    <DefaultLayout>
      <div className="bg-black text-white min-h-screen pt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            Discover Content
          </h1>
          <div className="relative mb-12">
            <input
              ref={inputRef}
              aria-label="Search for movies or TV shows"
              className="w-full pl-14 pr-6 py-4 text-xl rounded-full bg-neutral-800 border-2 border-transparent focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-white placeholder-neutral-400 transition-all duration-300 shadow-xl"
              placeholder="Search for movies or TV shows..."
              type="text"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              size={28}
            />
          </div>

          {error && (
            <p className="text-red-500 text-center py-4 text-lg">
              Error: {error}
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {loading && localSearchTerm.length > 0 ? (
              // Display skeleton cards while loading if a search term is present
              Array.from({ length: 18 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : !error &&
              searchResults.length === 0 &&
              localSearchTerm.length > 0 ? (
              // No results found message
              <p className="col-span-full text-center text-gray-400 text-xl">
                No results found for "{localSearchTerm}". Try a different
                search!
              </p>
            ) : !error && searchResults.length > 0 ? (
              // Display actual search results
              searchResults.map((item) => (
                <div
                  key={item.id}
                  className="group relative cursor-pointer overflow-hidden rounded-lg w-full text-left bg-neutral-900 shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  onClick={() => handleCardClick(item)}
                >
                  {/* Poster */}
                  {item.poster_path ? (
                    <img
                      alt={item.title || item.name}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    />
                  ) : (
                    <div className="w-full h-auto bg-neutral-700 flex items-center justify-center aspect-[2/3] text-gray-400 text-sm p-4 text-center">
                      No Poster Available
                    </div>
                  )}

                  {/* Overlay Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="font-semibold text-lg truncate text-white">
                      {item.title || item.name}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-300 mt-1">
                      <span>
                        {item.release_date?.slice(0, 4) ||
                          item.first_air_date?.slice(0, 4) ||
                          "—"}
                      </span>
                      <span>⭐ {item.vote_average?.toFixed(1) || "N/A"}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              !loading &&
              !error &&
              localSearchTerm.length === 0 && (
                // Initial state message when input is empty
                <p className="col-span-full text-center text-gray-400 text-xl">
                  Start typing above to find awesome movies and TV shows!
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
