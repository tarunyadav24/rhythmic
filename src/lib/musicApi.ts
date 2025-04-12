
import { toast } from "@/hooks/use-toast";

// Song interface
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  cover: string;
  audioUrl: string;
}

// Album interface
export interface Album {
  id: string;
  title: string;
  artist: string;
  cover: string;
  songs: Song[];
}

// We're using the Napster API for this app
const API_KEY = "ZTVhYTU3MWEtZjRhNy00MmRmLWJlNTAtNzA4MjM1MDNiMGI3";
const BASE_URL = "https://api.napster.com/v2.2";

// Convert from API format to our app format
const transformSong = (item: any): Song => {
  return {
    id: item.id,
    title: item.name,
    artist: item.artistName,
    album: item.albumName || "",
    duration: item.playbackSeconds || 30,
    cover: item.albumId 
      ? `https://api.napster.com/imageserver/v2/albums/${item.albumId}/images/500x500.jpg` 
      : "https://via.placeholder.com/150",
    audioUrl: item.previewURL || `https://listen.hs.llnwd.net/g2/FirstPlay/${item.id}.mp3`,
  };
};

const transformAlbum = (item: any): Album => {
  return {
    id: item.id,
    title: item.name,
    artist: item.artistName,
    cover: `https://api.napster.com/imageserver/v2/albums/${item.id}/images/500x500.jpg`,
    songs: [],
  };
};

// Fetch top tracks
export const fetchTopTracks = async (): Promise<Song[]> => {
  try {
    const response = await fetch(`${BASE_URL}/tracks/top?apikey=${API_KEY}&limit=20`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch top tracks");
    }
    
    const data = await response.json();
    return data.tracks.map(transformSong);
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    toast({
      title: "Error",
      description: "Failed to load top tracks. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

// Fetch featured playlists
export const fetchFeaturedAlbums = async (): Promise<Album[]> => {
  try {
    const response = await fetch(`${BASE_URL}/albums/top?apikey=${API_KEY}&limit=8`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch featured albums");
    }
    
    const data = await response.json();
    return data.albums.map(transformAlbum);
  } catch (error) {
    console.error("Error fetching albums:", error);
    toast({
      title: "Error",
      description: "Failed to load albums. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

// Fetch songs from an album
export const fetchAlbumTracks = async (albumId: string): Promise<Song[]> => {
  try {
    const response = await fetch(`${BASE_URL}/albums/${albumId}/tracks?apikey=${API_KEY}&limit=20`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tracks for album ${albumId}`);
    }
    
    const data = await response.json();
    return data.tracks.map(transformSong);
  } catch (error) {
    console.error(`Error fetching album tracks for ${albumId}:`, error);
    toast({
      title: "Error",
      description: "Failed to load album tracks. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

// Search for songs, albums or artists
export const searchMusic = async (query: string): Promise<{songs: Song[], albums: Album[]}> => {
  try {
    if (!query.trim()) {
      return { songs: [], albums: [] };
    }

    const tracksResponse = await fetch(`${BASE_URL}/search/verbose?apikey=${API_KEY}&query=${encodeURIComponent(query)}&type=track&limit=10`);
    const albumsResponse = await fetch(`${BASE_URL}/search?apikey=${API_KEY}&query=${encodeURIComponent(query)}&type=album&limit=6`);
    
    if (!tracksResponse.ok || !albumsResponse.ok) {
      throw new Error("Search request failed");
    }
    
    const tracksData = await tracksResponse.json();
    const albumsData = await albumsResponse.json();
    
    return {
      songs: tracksData.search.data.tracks.map(transformSong),
      albums: albumsData.search.data.albums.map(transformAlbum),
    };
  } catch (error) {
    console.error("Error searching music:", error);
    toast({
      title: "Search Error",
      description: "Failed to perform search. Please try again later.",
      variant: "destructive",
    });
    return { songs: [], albums: [] };
  }
};
