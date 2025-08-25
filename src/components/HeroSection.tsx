"use client";
import { Button } from "@heroui/react"; // ✅ HeroUI button
import { AnimatePresence, motion } from "framer-motion";
import { Info, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMovieStore } from "@/store/useMovieStore";

export default function HeroSection() {
  const { trendingMovies, fetchTrendingMovies } = useMovieStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const currentMovie = trendingMovies[currentIndex];

  useEffect(() => {
    fetchTrendingMovies();
  }, [fetchTrendingMovies]);

  useEffect(() => {
    if (trendingMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [trendingMovies]);

  // Play opens the external embed in a new tab (movie vs tv)
  const handlePlay = () => {
    if (!currentMovie) return;
    const isTv =
      currentMovie.media_type === "tv" ||
      (currentMovie.title == null && currentMovie.name);
    const url = isTv
      ? `https://vidsrc.xyz/embed/tv/${currentMovie.id}`
      : `https://vidsrc.xyz/embed/movie/${currentMovie.id}`;

    window.open(url, "_blank");
  };

  // More Info navigates to the in-app details page
  const handleMoreInfo = () => {
    if (!currentMovie) return;
    const isTv = currentMovie.media_type === "tv";

    navigate(isTv ? `/tv/${currentMovie.id}` : `/movie/${currentMovie.id}`);
  };

  return (
    <div className="relative w-full h-[100vh] text-white ">
      <AnimatePresence mode="wait">
        {currentMovie && (
          <motion.div
            key={currentMovie.id}
            animate={{ opacity: 1 }}
            className="absolute inset-0 overflow-hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              alt={currentMovie.title || currentMovie.name}
              animate={{ scale: [1, 1.05, 1] }}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
              transition={{
                duration: 10,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {currentMovie && (
        <div className="absolute bottom-20 left-10 max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            {currentMovie.title || currentMovie.name}
          </h1>
          <p className="text-lg text-gray-300 line-clamp-3">
            {currentMovie.overview}
          </p>
          <div className="flex space-x-4">
            <Button
              className="bg-white text-black font-semibold"
              radius="sm"
              size="lg"
              startContent={<Play size={20} />}
              onClick={handlePlay}
            >
              Play
            </Button>
            <Button
              className="text-white"
              radius="sm"
              size="lg"
              startContent={<Info size={20} />}
              variant="bordered"
              onClick={handleMoreInfo}
            >
              More Info
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
