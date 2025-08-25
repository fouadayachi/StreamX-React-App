/* eslint-disable no-console */
// src/store/movieStore.ts
import { create } from "zustand";

import axiosInstance from "../config/axios";

export interface BaseMedia {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  media_type?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
  videos?: { results: any[] };
  credits?: { cast: any[]; crew: any[] };
  similar?: { results: BaseMedia[] };
}

interface Movie extends BaseMedia {}

interface TVShow extends BaseMedia {
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: {
    season_number: number;
    episode_count: number;
    air_date?: string;
    name: string;
    overview: string;
    poster_path?: string;
  }[];
}

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path?: string;
  air_date?: string;
}

interface MovieStore {
  trendingMovies: Movie[];
  popularMovies: Movie[];
  popularTV: TVShow[];
  topRatedMovies: Movie[];
  topRatedTV: TVShow[];
  upcomingMovies: Movie[];
  nowPlayingMovies: Movie[];
  comedyMovies: Movie[];
  actionMovies: Movie[];
  dramaMovies: Movie[];
  thrillerMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  animationMovies: Movie[];
  comedyTV: TVShow[];
  actionAdventureTV: TVShow[];
  dramaTV: TVShow[];
  documentaryTV: TVShow[];
  sciFiFantasyTV: TVShow[];
  myList: BaseMedia[]; // User's personal list of movies/TV shows
  episodes: Episode[]; // List of episodes for TV shows
  selectedMovie?: Movie;
  selectedTV?: TVShow;
  searchResults: BaseMedia[]; // New: To store search results
  searchQuery: string;
  loading: boolean;
  error: string | null;

  fetchTrendingMovies: () => Promise<void>;
  fetchPopularMovies: () => Promise<void>;
  fetchPopularTV: () => Promise<void>;
  fetchTopRatedMovies: () => Promise<void>;
  fetchTopRatedTV: () => Promise<void>;
  fetchUpcomingMovies: () => Promise<void>;
  fetchNowPlayingMovies: () => Promise<void>;
  fetchComedyMovies: () => Promise<void>;
  fetchActionMovies: () => Promise<void>;
  fetchDramaMovies: () => Promise<void>;
  fetchThrillerMovies: () => Promise<void>;
  fetchHorrorMovies: () => Promise<void>;
  fetchRomanceMovies: () => Promise<void>;
  fetchAnimationMovies: () => Promise<void>;
  fetchComedyTV: () => Promise<void>;
  fetchActionAdventureTV: () => Promise<void>;
  fetchDramaTV: () => Promise<void>;
  fetchDocumentaryTV: () => Promise<void>;
  fetchSciFiFantasyTV: () => Promise<void>;
  fetchMovieById: (id: number) => Promise<void>;
  fetchTVById: (id: number) => Promise<void>;
  fetchEpisodes: (tvId: number, seasonNumber: number) => Promise<void>;
  addToMyList: (item: BaseMedia) => void;
  removeFromMyList: (id: number) => void;
  isItemInMyList: (id: number) => boolean;
  setSearchQuery: (query: string) => void;
  fetchSearchResults: (query: string) => Promise<void>;
}
export const useMovieStore = create<MovieStore>((set, get) => ({
  trendingMovies: [],
  popularMovies: [],
  popularTV: [],
  topRatedMovies: [],
  topRatedTV: [],
  upcomingMovies: [],
  nowPlayingMovies: [],
  comedyMovies: [],
  actionMovies: [],
  dramaMovies: [],
  thrillerMovies: [],
  horrorMovies: [],
  romanceMovies: [],
  animationMovies: [],
  comedyTV: [],
  actionAdventureTV: [],
  dramaTV: [],
  documentaryTV: [],
  sciFiFantasyTV: [],
  myList: [],
  episodes: [],
  searchResults: [],
  searchQuery: "",
  loading: false,
  error: null,

  // My List In-Memory Operations
  addToMyList: (item: BaseMedia) => {
    set((state) => {
      // Check if the item is already in the list to avoid duplicates
      if (!state.myList.some((i) => i.id === item.id)) {
        console.log("Adding item to My List (in-memory):", item.id);

        return { myList: [...state.myList, item] };
      }
      console.log("Item already in My List:", item.id);

      return state; // No change if item already exists
    });
  },

  removeFromMyList: (id: number) => {
    set((state) => {
      const updatedList = state.myList.filter((item) => item.id !== id);

      if (updatedList.length < state.myList.length) {
        console.log("Removing item from My List (in-memory):", id);

        return { myList: updatedList };
      }
      console.log("Item not found in My List to remove:", id);

      return state; // No change if item not found
    });
  },

  isItemInMyList: (id: number) => {
    return get().myList.some((item) => item.id === id);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  fetchSearchResults: async (query: string) => {
    set({ loading: true, error: null });
    try {
      if (!query.trim()) {
        set({ searchResults: [], loading: false }); // Clear results if query is empty

        return;
      }
      const res = await axiosInstance.get<{ results: BaseMedia[] }>(
        "/search/multi",
        {
          params: { query: query },
        },
      );
      // Filter out people (media_type 'person') as they aren't directly playable content
      const filteredResults = res.data.results.filter(
        (item) =>
          item.media_type !== "person" &&
          item.poster_path &&
          item.backdrop_path,
      );

      set({ searchResults: filteredResults, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  // Existing fetch functions (omitted for brevity, assume they are present as before)
  fetchTrendingMovies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: Movie[] }>(
        "/trending/all/week",
      );

      set({ trendingMovies: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchPopularMovies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: Movie[] }>(
        "/movie/popular",
      );

      set({ popularMovies: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchPopularTV: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: TVShow[] }>("/tv/popular");

      set({ popularTV: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTopRatedMovies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: Movie[] }>(
        "/movie/top_rated",
      );

      set({ topRatedMovies: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTopRatedTV: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: TVShow[] }>(
        "/tv/top_rated",
      );

      set({ topRatedTV: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchUpcomingMovies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: Movie[] }>(
        "/movie/upcoming",
      );

      set({ upcomingMovies: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchNowPlayingMovies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: Movie[] }>(
        "/movie/now_playing",
      );

      set({ nowPlayingMovies: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchComedyMovies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: Movie[] }>(
        "/discover/movie",
        { params: { with_genres: 35 } },
      );

      set({ comedyMovies: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchActionMovies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: Movie[] }>(
        "/discover/movie",
        { params: { with_genres: 28 } },
      );

      set({ actionMovies: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchDramaMovies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: Movie[] }>(
        "/discover/movie",
        { params: { with_genres: 18 } },
      );

      set({ dramaMovies: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchThrillerMovies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: Movie[] }>(
        "/discover/movie",
        { params: { with_genres: 53 } },
      );

      set({ thrillerMovies: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchHorrorMovies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: Movie[] }>(
        "/discover/movie",
        { params: { with_genres: 27 } },
      );

      set({ horrorMovies: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchRomanceMovies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: Movie[] }>(
        "/discover/movie",
        { params: { with_genres: 10749 } },
      );

      set({ romanceMovies: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchAnimationMovies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: Movie[] }>(
        "/discover/movie",
        { params: { with_genres: 16 } },
      );

      set({ animationMovies: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchComedyTV: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: TVShow[] }>(
        "/discover/tv",
        { params: { with_genres: 35 } },
      );

      set({ comedyTV: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchActionAdventureTV: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: TVShow[] }>(
        "/discover/tv",
        { params: { with_genres: 10759 } },
      );

      set({ actionAdventureTV: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchDramaTV: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: TVShow[] }>(
        "/discover/tv",
        { params: { with_genres: 18 } },
      );

      set({ dramaTV: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchDocumentaryTV: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: TVShow[] }>(
        "/discover/tv",
        { params: { with_genres: 99 } },
      );

      set({ documentaryTV: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchSciFiFantasyTV: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ results: TVShow[] }>(
        "/discover/tv",
        { params: { with_genres: 10765 } },
      );

      set({ sciFiFantasyTV: res.data.results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchMovieById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<Movie>(`/movie/${id}`, {
        params: { append_to_response: "videos,credits,similar" },
      });

      set({ selectedMovie: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTVById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<TVShow>(`/tv/${id}`, {
        params: { append_to_response: "videos,credits,similar" },
      });

      set({ selectedTV: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchEpisodes: async (tvId: number, seasonNumber: number) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ episodes: Episode[] }>(
        `/tv/${tvId}/season/${seasonNumber}`,
      );

      set({ episodes: res.data.episodes || [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
