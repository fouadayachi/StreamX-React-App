/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/* eslint-disable import/order */
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import MovieRow from "../components/MovieRow";
import { useMovieStore } from "../store/useMovieStore";

import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Play, Plus, Check } from "lucide-react"; // Info is not used here
import "swiper/css";
import "swiper/css/navigation";

// Skeleton Component for TVShowDetails
const TVShowDetailsSkeleton = () => (
  <div className="bg-black text-white min-h-screen animate-pulse">
    {/* Banner Skeleton */}
    <div className="relative h-[70vh] bg-neutral-900">
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      <div className="absolute bottom-12 left-10 max-w-2xl w-3/4">
        <div className="h-12 bg-neutral-700 rounded w-full mb-4" />
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="h-5 bg-neutral-700 rounded w-1/6" />
          <div className="h-5 bg-neutral-700 rounded w-1/12" />
          <div className="h-5 bg-neutral-700 rounded w-1/12" />
          <div className="h-5 bg-neutral-700 rounded w-1/4" />
        </div>
        <div className="mt-4 h-6 bg-neutral-700 rounded w-full mb-2" />
        <div className="h-6 bg-neutral-700 rounded w-11/12 mb-2" />
        <div className="h-6 bg-neutral-700 rounded w-10/12" />
        <div className="flex space-x-4 mt-6">
          <div className="h-12 w-32 bg-neutral-700 rounded-sm" />
          <div className="h-12 w-32 bg-neutral-700 rounded-sm" />
        </div>
      </div>
    </div>

    {/* Trailer Skeleton */}
    <div className="p-10">
      <div className="h-8 bg-neutral-900 rounded w-1/4 mb-4" />
      <div className="h-[500px] bg-neutral-900 rounded-xl w-full" />
    </div>

    {/* Episodes Skeleton */}
    <div className="p-10">
      <div className="h-8 bg-neutral-900 rounded w-1/4 mb-4" />
      <div className="h-10 w-48 bg-neutral-900 rounded mb-6" />{" "}
      {/* Season selector placeholder */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row bg-neutral-900 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="w-full sm:w-56 h-40 bg-neutral-700" />
            <div className="flex-1 p-4">
              <div className="h-6 bg-neutral-700 rounded w-3/4 mb-2" />
              <div className="h-4 bg-neutral-700 rounded w-full mb-1" />
              <div className="h-4 bg-neutral-700 rounded w-11/12" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Cast Skeleton */}
    <div className="p-10">
      <div className="h-8 bg-neutral-900 rounded w-1/4 mb-4" />
      <div className="grid grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-neutral-900 rounded-2xl overflow-hidden h-[300px]"
          >
            <div className="w-full h-[250px] bg-neutral-700" />
            <div className="p-3">
              <div className="h-4 bg-neutral-700 rounded w-3/4 mb-1" />
              <div className="h-3 bg-neutral-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Similar Titles Skeleton */}
    <div className="p-10">
      <div className="h-8 bg-neutral-900 rounded w-1/4 mb-4" />
      {/* MovieRowSkeletonCard will be rendered by MovieRow internally */}
      <div className="grid grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-lg w-full text-left bg-neutral-900 shadow-lg animate-pulse"
          >
            <div className="w-full aspect-[2/3] bg-neutral-700 flex items-center justify-center" />
            <div className="p-3">
              <div className="h-4 bg-neutral-700 rounded w-3/4 mb-2" />
              <div className="h-4 bg-neutral-700 rounded w-1/2" />
              <div className="flex gap-2 mt-3">
                <div className="h-8 w-1/2 bg-neutral-700 rounded-md" />
                <div className="h-8 w-1/2 bg-neutral-700 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function TVShowDetails() {
  const { id } = useParams();
  const tvId = Number(id);

  const {
    selectedTV: tvShow,
    fetchTVById,
    fetchEpisodes,
    episodes,
    loading, // shared loading flag in store
    addToMyList,
    removeFromMyList,
    isItemInMyList,
  } = useMovieStore();

  const isTvLoading = !tvShow; // Using this as the primary check for initial data load

  // Prefer first non-specials season as default (skip season_number 0 if present)
  const initialSeason = useMemo(() => {
    if (!tvShow?.seasons?.length) return null;
    const firstRegular = tvShow.seasons.find((s) => s.season_number !== 0);

    return (firstRegular ?? tvShow.seasons[0]).season_number;
  }, [tvShow]);

  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  // Fetch TV show details on mount / id change
  useEffect(() => {
    if (tvId) fetchTVById(tvId);
  }, [tvId, fetchTVById]);

  // When the show is loaded, set default season & fetch its episodes
  useEffect(() => {
    if (!tvShow || initialSeason == null || !tvId) return;
    setSelectedSeason(initialSeason);
    // Only fetch episodes if tvShow is loaded and initialSeason is set, and episodes are not already loading
    // We explicitly avoid checking the global 'loading' here for episode fetching
    // to keep the UI from blocking if only episodes are loading.
    fetchEpisodes(tvId, initialSeason);
  }, [tvShow, initialSeason, tvId, fetchEpisodes]);

  // When user changes season, fetch its episodes
  useEffect(() => {
    if (!tvId || selectedSeason == null) return;
    fetchEpisodes(tvId, selectedSeason);
  }, [tvId, selectedSeason, fetchEpisodes]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tvId]);

  // Display skeleton if initial TV show data is loading
  if (isTvLoading) {
    return <TVShowDetailsSkeleton />;
  }

  const trailerKey = tvShow.videos?.results.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube",
  )?.key;

  const cast = tvShow.credits?.cast.slice(0, 10) || [];
  const similar = tvShow.similar?.results || [];
  const isInList = isItemInMyList(tvShow.id); // Check if TV show is in My List

  const handleMyListClick = () => {
    if (isInList) {
      removeFromMyList(tvShow.id); // Pass ID for removal
    } else {
      addToMyList(tvShow); // Pass the TVShow object for addition
    }
  };

  const handlePlayClick = (playerPageUrl: string | null) => {
    if (playerPageUrl) {
      window.open(playerPageUrl, "_blank"); // Open in a new tab
    } else {
      console.log("it is not working");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Banner */}
      <div
        className="relative h-[90vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-12 left-10 max-w-2xl">
          <h1 className="text-5xl font-bold">{tvShow.name}</h1>
          <div className="flex items-center gap-4 mt-3 text-gray-300 text-sm">
            <span>{tvShow.first_air_date?.split("-")[0]}</span>
            <span className="px-2 py-0.5 bg-red-600 rounded font-semibold">
              {tvShow.vote_average?.toFixed(1)}
            </span>
            <span>
              {tvShow.number_of_seasons ?? 0} Season
              {(tvShow.number_of_seasons ?? 0) > 1 ? "s" : ""}
            </span>
            <span>{tvShow.genres?.map((g: any) => g.name).join(", ")}</span>
          </div>
          <p className="mt-4 text-lg text-gray-200">{tvShow.overview}</p>
          <div className="flex space-x-4 mt-6">
            <Button
              className="bg-white text-black font-semibold"
              radius="sm"
              size="lg"
              startContent={<Play size={20} />}
              onClick={() =>
                handlePlayClick(`https://vidsrc.xyz/embed/tv/${tvId}`)
              }
            >
              Play
            </Button>
            <Button
              className={
                isInList
                  ? "bg-gray-600 text-white font-semibold"
                  : "bg-[#e50914] text-white font-semibold"
              }
              radius="sm"
              size="lg"
              startContent={isInList ? <Check size={20} /> : <Plus size={20} />}
              onClick={handleMyListClick}
            >
              {isInList ? "My List" : "My List"}
            </Button>
          </div>
        </div>
      </div>

      {/* Trailer */}
      {trailerKey && (
        <div className="p-10">
          <h2 className="text-2xl font-bold mb-4">Trailer</h2>
          <iframe
            allowFullScreen
            className="rounded-xl border border-gray-800"
            frameBorder="0"
            height="500"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Trailer"
            width="100%"
          />
        </div>
      )}

      {/* Season selector + Episodes (fetched via store) */}
      {tvShow.seasons && tvShow.seasons.length > 0 && (
        <div className="p-10">
          <h2 className="text-2xl font-bold mb-4">Episodes</h2>

          <Select
            className="max-w-xs mb-6 text-white"
            color="danger"
            selectedKeys={
              selectedSeason !== null ? [String(selectedSeason)] : []
            }
            variant="faded"
            onSelectionChange={(keys) => {
              const next = Number(Array.from(keys as Set<string>)[0]);

              setSelectedSeason(next);
            }}
          >
            {tvShow.seasons.map((season: any) => (
              <SelectItem key={season.season_number}>{season.name}</SelectItem>
            ))}
          </Select>

          {/* Episodes fetched from store */}
          {loading && selectedSeason !== null ? ( // Use global loading for episode fetch based on selected season
            <p className="text-gray-400">Loading episodes...</p>
          ) : episodes.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Episodes</h3>
              <div className="space-y-4">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="flex flex-col sm:flex-row bg-neutral-900 rounded-lg overflow-hidden shadow-lg
    hover:bg-neutral-800 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
                    onClick={() =>
                      handlePlayClick(
                        `https://vidsrc.xyz/embed/tv/${tvId}/${selectedSeason}/${episode.episode_number}`,
                      )
                    }
                  >
                    <img
                      alt={episode.name}
                      className="w-full sm:w-56 h-40 object-cover transition-transform duration-300 hover:scale-105"
                      src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                    />
                    <div className="flex-1 p-4">
                      <h4 className="text-lg font-semibold">
                        Episode {episode.episode_number}: {episode.name}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-3">
                        {episode.overview || "No description available."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">
              No episodes available for this season.
            </p>
          )}
        </div>
      )}

      {/* Cast */}
      {cast.length > 0 && (
        <div className="p-10">
          <h2 className="text-2xl font-bold mb-4">Cast</h2>
          <Swiper
            navigation
            modules={[Navigation]}
            slidesPerView={6}
            spaceBetween={15}
          >
            {cast.map((actor: any) => (
              <SwiperSlide key={actor.id}>
                <div className="bg-gray-900 rounded-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer shadow-lg">
                  <img
                    alt={actor.name}
                    className="w-full h-[250px] object-cover"
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                        : "/no-profile.jpg"
                    }
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-bold">{actor.name}</h3>
                    <p className="text-xs text-gray-400">{actor.character}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Similar Titles */}
      {similar.length > 0 && (
        <MovieRow movies={similar} title="Similar TV Shows" type="tv" />
      )}
    </div>
  );
}
