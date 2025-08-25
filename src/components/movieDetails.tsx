/* eslint-disable no-console */
/* eslint-disable import/order */
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { useMovieStore } from "../store/useMovieStore";
import MovieRow from "../components/MovieRow";
// import MediaPlayer from "./MediaPlayer"; // REMOVED: No longer using modal player

import "swiper/css";
import "swiper/css/navigation";
import { Play, Plus, Check } from "lucide-react";
import { Button } from "@heroui/button";

// Skeleton Component for MovieDetails (UNCHANGED)
const MovieDetailsSkeleton = () => (
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

export default function MovieDetails() {
  const { id } = useParams();

  const {
    selectedMovie: movie,
    fetchMovieById,
    loading,
    addToMyList,
    removeFromMyList,
    isItemInMyList,
  } = useMovieStore();
  // const [showMediaPlayer, setShowMediaPlayer] = useState(false); // REMOVED: No longer using modal player state

  useEffect(() => {
    if (id) fetchMovieById(Number(id));
  }, [id, fetchMovieById]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading || !movie) {
    return <MovieDetailsSkeleton />;
  }

  const trailerKey = movie.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube",
  )?.key;

  // Prepare the URL for the new tab player
  const playerPageUrl = `https://vidsrc.xyz/embed/movie/${id}`;

  const cast = movie.credits?.cast.slice(0, 10) || [];
  const similar = movie.similar?.results || [];
  const isInList = isItemInMyList(movie.id);

  const handleMyListClick = () => {
    if (isInList) {
      removeFromMyList(movie.id);
    } else {
      addToMyList(movie);
    }
  };

  const handlePlayClick = () => {
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
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-12 left-10 max-w-2xl">
          <h1 className="text-5xl font-bold">{movie.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-gray-300 text-sm">
            <span>{movie.release_date?.split("-")[0]}</span>
            <span className="px-2 py-0.5 bg-red-600 rounded font-semibold">
              {movie.vote_average?.toFixed(1)}
            </span>
            <span>{movie.runtime} min</span>
            <span>{movie.genres?.map((g) => g.name).join(", ")}</span>
          </div>
          <p className="mt-4 text-lg text-gray-200">{movie.overview}</p>
          <div className="flex space-x-4 mt-6">
            <Button
              className="bg-white text-black font-semibold"
              radius="sm"
              size="lg"
              startContent={<Play size={20} />}
              onClick={handlePlayClick} // Now opens new tab
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

      {/* Trailer - This section can now be completely removed as the player opens in a new tab */}
      {/* Keeping this for now if you want a separate inline trailer section outside the play button */}
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
            {cast.map((actor) => (
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
        <MovieRow movies={similar} title="Similar Titles" type="movie" />
      )}

      {/* Media Player Modal - REMOVED */}
      {/* <MediaPlayer videoUrl={trailerUrl} onClose={() => setShowMediaPlayer(false)} /> */}
    </div>
  );
}
