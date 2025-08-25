import { useEffect } from "react";

import DefaultLayout from "@/layouts/default";
import MovieRow from "@/components/MovieRow"; // Re-using MovieRow for TV shows as well
import { useMovieStore } from "@/store/useMovieStore";

export default function SeriesPage() {
  const {
    popularTV,
    topRatedTV,
    comedyTV,
    actionAdventureTV,
    dramaTV,
    documentaryTV,
    sciFiFantasyTV,
    fetchPopularTV,
    fetchTopRatedTV,
    fetchComedyTV,
    fetchActionAdventureTV,
    fetchDramaTV,
    fetchDocumentaryTV,
    fetchSciFiFantasyTV,
    loading,
    error,
  } = useMovieStore();

  useEffect(() => {
    fetchPopularTV();
    fetchTopRatedTV();
    fetchComedyTV();
    fetchActionAdventureTV();
    fetchDramaTV();
    fetchDocumentaryTV();
    fetchSciFiFantasyTV();
  }, [
    fetchPopularTV,
    fetchTopRatedTV,
    fetchComedyTV,
    fetchActionAdventureTV,
    fetchDramaTV,
    fetchDocumentaryTV,
    fetchSciFiFantasyTV,
  ]);

  return (
    <DefaultLayout>
      <div className="bg-black text-white min-h-screen pt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 px-6">
          All TV Series
        </h1>
        {error && <p className="text-red-500 text-center py-4">{error}</p>}
        {loading && <p className="text-center py-4">Loading TV Series...</p>}

        <MovieRow
          loading={loading}
          movies={popularTV}
          title="Popular TV Shows"
          type="tv"
        />
        <MovieRow
          loading={loading}
          movies={topRatedTV}
          title="Top Rated TV Shows"
          type="tv"
        />
        <MovieRow
          loading={loading}
          movies={actionAdventureTV}
          title="Action & Adventure Series"
          type="tv"
        />
        <MovieRow
          loading={loading}
          movies={comedyTV}
          title="Comedy Series"
          type="tv"
        />
        <MovieRow
          loading={loading}
          movies={dramaTV}
          title="Drama Series"
          type="tv"
        />
        <MovieRow
          loading={loading}
          movies={documentaryTV}
          title="Documentary Series"
          type="tv"
        />
        <MovieRow
          loading={loading}
          movies={sciFiFantasyTV}
          title="Sci-Fi & Fantasy Series"
          type="tv"
        />
      </div>
    </DefaultLayout>
  );
}
