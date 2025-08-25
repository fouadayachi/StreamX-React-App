import { Route, Routes } from "react-router-dom";

import MoviePage from "./pages/movie";
import MoviesPage from "./pages/movies";
import SeriesPage from "./pages/series";
import TvShow from "./pages/tvShow";
import MyListPage from "./pages/myList";
import SearchPage from "./pages/search";

import IndexPage from "@/pages/index";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<MoviesPage />} path="/movies" />
      <Route element={<SeriesPage />} path="/series" />
      <Route element={<MyListPage />} path="/myList" />
      <Route element={<SearchPage />} path="/search" />
      <Route element={<MoviePage />} path="/movie/:id" />
      <Route element={<TvShow />} path="/tv/:id" />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
