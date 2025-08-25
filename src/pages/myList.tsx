import DefaultLayout from "@/layouts/default";
import MovieRow from "@/components/MovieRow"; // Re-use the MovieRow component
import { useMovieStore } from "@/store/useMovieStore";

export default function MyListPage() {
  const { myList, loading, error } = useMovieStore();

  return (
    <DefaultLayout>
      <div className="bg-black text-white min-h-screen pt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 px-6">
          My List
        </h1>
        {error && <p className="text-red-500 text-center py-4">{error}</p>}
        {loading && <p className="text-center py-4">Loading your list...</p>}

        {myList.length > 0 ? (
          <MovieRow movies={myList} title="My Saved Titles" type="mixed" />
        ) : (
          <p className="text-center text-gray-400">
            Your list is empty. Add some movies or TV shows!
          </p>
        )}
      </div>
    </DefaultLayout>
  );
}
