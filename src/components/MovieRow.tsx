/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button } from "@heroui/button";
import { Check, Play, Plus } from "lucide-react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { BaseMedia, useMovieStore } from "@/store/useMovieStore";

interface Movie extends BaseMedia {}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  type: "movie" | "tv" | "mixed"; // 'mixed' for both movies and TV shows
  loading?: boolean; // New prop: Indicates if the data for this row is loading
}

// Skeleton Card Component for MovieRow
const MovieRowSkeletonCard: FC = () => (
  <div className="group relative overflow-hidden rounded-lg w-full text-left bg-neutral-900 shadow-lg animate-pulse">
    <div className="w-full aspect-[2/3] bg-neutral-700 flex items-center justify-center">
      {/* Placeholder for image */}
    </div>
    <div className="p-3">
      <div className="h-4 bg-neutral-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-neutral-700 rounded w-1/2" />
      <div className="flex gap-2 mt-3">
        <div className="h-8 w-1/2 bg-neutral-700 rounded-md" />
        <div className="h-8 w-1/2 bg-neutral-700 rounded-md" />
      </div>
    </div>
  </div>
);

const MovieRow: FC<MovieRowProps> = ({
  title,
  movies,
  type,
  loading = false,
}) => {
  const navigate = useNavigate();
  const { addToMyList, removeFromMyList, isItemInMyList } = useMovieStore();

  const handleClick = (movie: Movie) => {
    if (type === "tv" || movie.media_type === "tv") {
      navigate(`/tv/${movie.id}`);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  const handleMyListClick = (event: React.MouseEvent, movie: Movie) => {
    event.stopPropagation();
    if (isItemInMyList(movie.id)) {
      removeFromMyList(movie.id);
    } else {
      addToMyList(movie);
    }
  };

  // New: Play button logic (stops propagation and opens embed in new tab)
  const handlePlayClick = (event: React.MouseEvent, movie: Movie) => {
    event.stopPropagation();
    const isTv =
      type === "tv" ||
      movie.media_type === "tv" ||
      (movie.title == null && !!movie.name);
    const url = isTv
      ? `https://vidsrc.xyz/embed/tv/${movie.id}`
      : `https://vidsrc.xyz/embed/movie/${movie.id}`;
    window.open(url, "_blank");
  };

  // Determine which items to display: skeletons or actual movies
  const itemsToDisplay =
    loading || movies.length === 0
      ? Array.from({ length: 6 }).map((_, index) => ({
          id: `skeleton-${index}`,
        })) // Create placeholder objects for skeletons
      : movies;

  return (
    <div className="px-6 py-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <Swiper
        navigation
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
        className="movie-carousel"
        modules={[Navigation, Pagination]}
        pagination={{ clickable: true }}
        slidesPerView={6}
        spaceBetween={12}
      >
        {itemsToDisplay.map((item) => (
          <SwiperSlide key={item.id}>
            {loading || movies.length === 0 ? ( // Display skeleton if loading or no movies yet
              <MovieRowSkeletonCard />
            ) : (
              // Display actual movie card
              <div
                className="group relative cursor-pointer overflow-hidden rounded-lg w-full text-left"
                onClick={() => handleClick(item as Movie)} // Cast to Movie for handleClick
              >
                {/* Poster */}
                {(item as Movie).poster_path ? (
                  <img
                    alt={(item as Movie).title || (item as Movie).name}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
                    src={`https://image.tmdb.org/t/p/w500${(item as Movie).poster_path}`}
                  />
                ) : (
                  <div className="w-full h-auto bg-neutral-700 flex items-center justify-center aspect-[2/3] text-gray-400 text-sm p-4 text-center">
                    No Poster Available
                  </div>
                )}

                {/* Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="font-semibold text-lg truncate text-white">
                    {(item as Movie).title || (item as Movie).name}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-300 mt-1">
                    <span>
                      {(item as Movie).release_date?.slice(0, 4) ||
                        (item as Movie).first_air_date?.slice(0, 4) ||
                        "—"}
                    </span>
                    <span>
                      ⭐ {(item as Movie).vote_average?.toFixed(1) || "N/A"}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      className="bg-white text-black font-bold hover:opacity-90"
                      size="sm"
                      startContent={<Play size={16} />}
                      onClick={(e) => handlePlayClick(e, item as Movie)}
                    >
                      Play
                    </Button>
                    <Button
                      className={
                        isItemInMyList((item as Movie).id)
                          ? "bg-gray-600 text-white font-bold hover:bg-gray-700"
                          : "bg-[#e50914] text-white font-bold hover:bg-red-700"
                      }
                      size="sm"
                      startContent={
                        isItemInMyList((item as Movie).id) ? (
                          <Check size={16} />
                        ) : (
                          <Plus size={16} />
                        )
                      }
                      onClick={(e) => handleMyListClick(e, item as Movie)}
                    >
                      {isItemInMyList((item as Movie).id)
                        ? "My List"
                        : "My List"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        /* Navigation buttons */
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          padding: 14px;
          border-radius: 50%;
          transition: all 0.25s ease;
        }

        /* Pagination styling */
        .swiper-pagination {
          display : none;
        }
      `}</style>
    </div>
  );
};

export default MovieRow;
