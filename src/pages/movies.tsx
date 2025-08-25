import { useEffect } from "react";

import DefaultLayout from "@/layouts/default";
import MovieRow from "@/components/MovieRow";
import { useMovieStore } from "@/store/useMovieStore";

export default function MoviesPage() {
  const {
    popularMovies,
    topRatedMovies,
    upcomingMovies,
    nowPlayingMovies,
    comedyMovies,
    actionMovies,
    dramaMovies,
    thrillerMovies,
    horrorMovies,
    romanceMovies,
    animationMovies,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchUpcomingMovies,
    fetchNowPlayingMovies,
    fetchComedyMovies,
    fetchActionMovies,
    fetchDramaMovies,
    fetchThrillerMovies,
    fetchHorrorMovies,
    fetchRomanceMovies,
    fetchAnimationMovies,
    loading,
    error,
  } = useMovieStore();

  useEffect(() => {
    fetchPopularMovies();
    fetchTopRatedMovies();
    fetchUpcomingMovies();
    fetchNowPlayingMovies();
    fetchComedyMovies();
    fetchActionMovies();
    fetchDramaMovies();
    fetchThrillerMovies();
    fetchHorrorMovies();
    fetchRomanceMovies();
    fetchAnimationMovies();
  }, [
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchUpcomingMovies,
    fetchNowPlayingMovies,
    fetchComedyMovies,
    fetchActionMovies,
    fetchDramaMovies,
    fetchThrillerMovies,
    fetchHorrorMovies,
    fetchRomanceMovies,
    fetchAnimationMovies,
  ]);

  return (
    <DefaultLayout>
      <div className="bg-black text-white min-h-screen pt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 px-6">
          All Movies
        </h1>
        {error && <p className="text-red-500 text-center py-4">{error}</p>}
        {loading && <p className="text-center py-4">Loading movies...</p>}

        <MovieRow
          loading={loading}
          movies={popularMovies}
          title="Popular Movies"
          type="movie"
        />
        <MovieRow
          loading={loading}
          movies={topRatedMovies}
          title="Top Rated Movies"
          type="movie"
        />
        <MovieRow
          loading={loading}
          movies={upcomingMovies}
          title="Upcoming Movies"
          type="movie"
        />
        <MovieRow
          loading={loading}
          movies={nowPlayingMovies}
          title="Now Playing"
          type="movie"
        />
        <MovieRow
          loading={loading}
          movies={actionMovies}
          title="Action Movies"
          type="movie"
        />
        <MovieRow
          loading={loading}
          movies={comedyMovies}
          title="Comedy Movies"
          type="movie"
        />
        <MovieRow
          loading={loading}
          movies={dramaMovies}
          title="Drama Movies"
          type="movie"
        />
        <MovieRow
          loading={loading}
          movies={thrillerMovies}
          title="Thriller Movies"
          type="movie"
        />
        <MovieRow
          loading={loading}
          movies={horrorMovies}
          title="Horror Movies"
          type="movie"
        />
        <MovieRow
          loading={loading}
          movies={romanceMovies}
          title="Romance Movies"
          type="movie"
        />
        <MovieRow
          loading={loading}
          movies={animationMovies}
          title="Animation Movies"
          type="movie"
        />
      </div>
    </DefaultLayout>
  );
}
