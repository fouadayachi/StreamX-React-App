import { useEffect } from "react";

import HeroSection from "@/components/HeroSection.tsx";
import DefaultLayout from "@/layouts/default";
import MovieRow from "@/components/MovieRow";
import { useMovieStore } from "@/store/useMovieStore";

export default function IndexPage() {
  const {
    trendingMovies,
    popularMovies,
    popularTV,
    topRatedMovies,
    topRatedTV,
    fetchTrendingMovies,
    fetchPopularMovies,
    fetchPopularTV,
    fetchTopRatedMovies,
    fetchTopRatedTV,
    loading,
    error,
  } = useMovieStore();

  useEffect(() => {
    fetchTrendingMovies();
    fetchPopularMovies();
    fetchPopularTV();
    fetchTopRatedMovies();
    fetchTopRatedTV();
  }, []);

  return (
    <DefaultLayout>
      <HeroSection />

      {error && <p className="text-red-500 text-center py-4">{error}</p>}

      <div className="bg-black text-white">
        <MovieRow
          loading={loading}
          movies={trendingMovies}
          title="Trending Now"
          type="mixed"
        />
        <MovieRow
          loading={loading}
          movies={popularMovies}
          title="Popular Movies"
          type="movie"
        />
        <MovieRow
          loading={loading}
          movies={popularTV}
          title="Popular TV Shows"
          type="tv"
        />
        <MovieRow
          movies={topRatedMovies}
          title="Top Rated Movies"
          type="movie"
        />
        <MovieRow movies={topRatedTV} title="Top Rated TV Shows" type="tv" />
      </div>
    </DefaultLayout>
  );
}
