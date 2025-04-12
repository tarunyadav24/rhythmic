
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

// Better placeholder images for mock data
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=300&h=300"
];

// Get a random placeholder image
const getRandomPlaceholder = () => {
  return PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
};

// Mock data for when the API fails
const MOCK_TRACKS: Song[] = [
  {
    id: "mock-track-1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: 354,
    cover: getRandomPlaceholder(),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "mock-track-2",
    title: "Billie Jean",
    artist: "Michael Jackson",
    album: "Thriller",
    duration: 294,
    cover: getRandomPlaceholder(),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "mock-track-3",
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    album: "Nevermind",
    duration: 301,
    cover: getRandomPlaceholder(),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "mock-track-4",
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: "Appetite for Destruction",
    duration: 355,
    cover: getRandomPlaceholder(),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "mock-track-5",
    title: "Imagine",
    artist: "John Lennon",
    album: "Imagine",
    duration: 183,
    cover: getRandomPlaceholder(),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  }
];

const MOCK_ALBUMS: Album[] = [
  {
    id: "mock-album-1",
    title: "Thriller",
    artist: "Michael Jackson",
    cover: getRandomPlaceholder(),
    songs: []
  },
  {
    id: "mock-album-2",
    title: "Back in Black",
    artist: "AC/DC",
    cover: getRandomPlaceholder(),
    songs: []
  },
  {
    id: "mock-album-3",
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    cover: getRandomPlaceholder(),
    songs: []
  },
  {
    id: "mock-album-4",
    title: "Abbey Road",
    artist: "The Beatles",
    cover: getRandomPlaceholder(),
    songs: []
  },
  {
    id: "mock-album-5",
    title: "Hotel California",
    artist: "Eagles",
    cover: getRandomPlaceholder(),
    songs: []
  }
];

// Convert from API format to our app format
const transformSong = (item: any): Song => {
  // Ensure we have a valid cover image
  let coverUrl;
  try {
    if (item.albumId) {
      coverUrl = `https://api.napster.com/imageserver/v2/albums/${item.albumId}/images/500x500.jpg`;
    } else {
      // Use a fallback placeholder if no album ID is available
      coverUrl = getRandomPlaceholder();
    }
  } catch (error) {
    coverUrl = getRandomPlaceholder();
  }
  
  return {
    id: item.id,
    title: item.name,
    artist: item.artistName,
    album: item.albumName || "",
    duration: item.playbackSeconds || 30,
    cover: coverUrl,
    audioUrl: item.previewURL || `https://listen.hs.llnwd.net/g2/FirstPlay/${item.id}.mp3`,
  };
};

const transformAlbum = (item: any): Album => {
  // Ensure we have a valid cover image
  let coverUrl;
  try {
    coverUrl = `https://api.napster.com/imageserver/v2/albums/${item.id}/images/500x500.jpg`;
  } catch (error) {
    coverUrl = getRandomPlaceholder();
  }
  
  return {
    id: item.id,
    title: item.name,
    artist: item.artistName,
    cover: coverUrl,
    songs: [],
  };
};

// Fetch top tracks
export const fetchTopTracks = async (): Promise<Song[]> => {
  try {
    const response = await fetch(`${BASE_URL}/tracks/top?apikey=${API_KEY}&limit=20`);
    
    if (!response.ok) {
      console.warn("Failed to fetch top tracks from API, using mock data");
      return MOCK_TRACKS;
    }
    
    const data = await response.json();
    return data.tracks.map(transformSong);
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    toast({
      title: "Using mock data",
      description: "API key seems invalid. Using mock data instead.",
      variant: "default",
    });
    return MOCK_TRACKS;
  }
};

// Fetch featured playlists
export const fetchFeaturedAlbums = async (): Promise<Album[]> => {
  try {
    const response = await fetch(`${BASE_URL}/albums/top?apikey=${API_KEY}&limit=8`);
    
    if (!response.ok) {
      console.warn("Failed to fetch featured albums from API, using mock data");
      return MOCK_ALBUMS;
    }
    
    const data = await response.json();
    return data.albums.map(transformAlbum);
  } catch (error) {
    console.error("Error fetching albums:", error);
    toast({
      title: "Using mock data",
      description: "API key seems invalid. Using mock data instead.",
      variant: "default",
    });
    return MOCK_ALBUMS;
  }
};

// Fetch songs from an album
export const fetchAlbumTracks = async (albumId: string): Promise<Song[]> => {
  try {
    // If it's a mock album, return mock tracks
    if (albumId.startsWith('mock-album')) {
      return MOCK_TRACKS.map(track => ({
        ...track,
        album: MOCK_ALBUMS.find(album => album.id === albumId)?.title || track.album
      }));
    }
    
    const response = await fetch(`${BASE_URL}/albums/${albumId}/tracks?apikey=${API_KEY}&limit=20`);
    
    if (!response.ok) {
      console.warn(`Failed to fetch tracks for album ${albumId}, using mock data`);
      return MOCK_TRACKS;
    }
    
    const data = await response.json();
    return data.tracks.map(transformSong);
  } catch (error) {
    console.error(`Error fetching album tracks for ${albumId}:`, error);
    toast({
      title: "Using mock data",
      description: "API key seems invalid. Using mock data instead.",
      variant: "default",
    });
    return MOCK_TRACKS;
  }
};

// Search for songs, albums or artists
export const searchMusic = async (query: string): Promise<{songs: Song[], albums: Album[]}> => {
  try {
    if (!query.trim()) {
      return { songs: [], albums: [] };
    }

    // Try to fetch from the API first
    try {
      const tracksResponse = await fetch(`${BASE_URL}/search/verbose?apikey=${API_KEY}&query=${encodeURIComponent(query)}&type=track&limit=10`);
      const albumsResponse = await fetch(`${BASE_URL}/search?apikey=${API_KEY}&query=${encodeURIComponent(query)}&type=album&limit=6`);
      
      if (tracksResponse.ok && albumsResponse.ok) {
        const tracksData = await tracksResponse.json();
        const albumsData = await albumsResponse.json();
        
        return {
          songs: tracksData.search.data.tracks.map(transformSong),
          albums: albumsData.search.data.albums.map(transformAlbum),
        };
      }
    } catch (error) {
      console.error("API search failed:", error);
    }
    
    // If API fails, use mock data and filter by query
    console.warn("Search API failed, using filtered mock data");
    const lowercaseQuery = query.toLowerCase();
    
    return {
      songs: MOCK_TRACKS.filter(
        track => 
          track.title.toLowerCase().includes(lowercaseQuery) || 
          track.artist.toLowerCase().includes(lowercaseQuery) ||
          track.album.toLowerCase().includes(lowercaseQuery)
      ),
      albums: MOCK_ALBUMS.filter(
        album => 
          album.title.toLowerCase().includes(lowercaseQuery) || 
          album.artist.toLowerCase().includes(lowercaseQuery)
      ),
    };
  } catch (error) {
    console.error("Error searching music:", error);
    toast({
      title: "Search Error",
      description: "Failed to perform search. Using mock data instead.",
      variant: "destructive",
    });
    return { songs: [], albums: [] };
  }
};
