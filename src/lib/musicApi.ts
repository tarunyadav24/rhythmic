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

// Artist interface
export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  topTracks: Song[];
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

// Mock popular artists data
const MOCK_ARTISTS: Artist[] = [
  {
    id: "mock-artist-1",
    name: "Queen",
    imageUrl: getRandomPlaceholder(),
    topTracks: [
      {
        id: "mock-queen-track-1",
        title: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        duration: 354,
        cover: getRandomPlaceholder(),
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      },
      {
        id: "mock-queen-track-2",
        title: "Don't Stop Me Now",
        artist: "Queen",
        album: "Jazz",
        duration: 210,
        cover: getRandomPlaceholder(),
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
      }
    ]
  },
  {
    id: "mock-artist-2",
    name: "Michael Jackson",
    imageUrl: getRandomPlaceholder(),
    topTracks: [
      {
        id: "mock-mj-track-1",
        title: "Billie Jean",
        artist: "Michael Jackson",
        album: "Thriller",
        duration: 294,
        cover: getRandomPlaceholder(),
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
      },
      {
        id: "mock-mj-track-2",
        title: "Beat It",
        artist: "Michael Jackson",
        album: "Thriller",
        duration: 258,
        cover: getRandomPlaceholder(),
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
      }
    ]
  },
  {
    id: "mock-artist-3",
    name: "The Beatles",
    imageUrl: getRandomPlaceholder(),
    topTracks: [
      {
        id: "mock-beatles-track-1",
        title: "Hey Jude",
        artist: "The Beatles",
        album: "The Beatles Again",
        duration: 431,
        cover: getRandomPlaceholder(),
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
      },
      {
        id: "mock-beatles-track-2",
        title: "Let It Be",
        artist: "The Beatles",
        album: "Let It Be",
        duration: 243,
        cover: getRandomPlaceholder(),
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
      }
    ]
  },
  {
    id: "mock-artist-4",
    name: "Adele",
    imageUrl: getRandomPlaceholder(),
    topTracks: [
      {
        id: "mock-adele-track-1",
        title: "Hello",
        artist: "Adele",
        album: "25",
        duration: 367,
        cover: getRandomPlaceholder(),
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
      },
      {
        id: "mock-adele-track-2",
        title: "Rolling in the Deep",
        artist: "Adele",
        album: "21",
        duration: 228,
        cover: getRandomPlaceholder(),
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
      }
    ]
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

// Transform artist from API format to our app format
const transformArtist = (item: any): Artist => {
  // Ensure we have a valid cover image
  let imageUrl;
  try {
    imageUrl = `https://api.napster.com/imageserver/v2/artists/${item.id}/images/500x500.jpg`;
  } catch (error) {
    imageUrl = getRandomPlaceholder();
  }
  
  return {
    id: item.id,
    name: item.name,
    imageUrl: imageUrl,
    topTracks: [], // Tracks will be populated separately
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

// Fetch popular artists and their top tracks
export const fetchPopularArtists = async (): Promise<Artist[]> => {
  try {
    const response = await fetch(`${BASE_URL}/artists/top?apikey=${API_KEY}&limit=4`);
    
    if (!response.ok) {
      console.warn("Failed to fetch popular artists from API, using mock data");
      return MOCK_ARTISTS;
    }
    
    const data = await response.json();
    const artists = data.artists.map(transformArtist);
    
    // For each artist, fetch their top tracks
    const artistsWithTracks = await Promise.all(
      artists.map(async (artist) => {
        try {
          const tracksResponse = await fetch(`${BASE_URL}/artists/${artist.id}/tracks/top?apikey=${API_KEY}&limit=2`);
          
          if (!tracksResponse.ok) {
            throw new Error(`Failed to fetch tracks for artist ${artist.id}`);
          }
          
          const tracksData = await tracksResponse.json();
          artist.topTracks = tracksData.tracks.map(transformSong);
          return artist;
        } catch (error) {
          console.error(`Error fetching tracks for artist ${artist.name}:`, error);
          
          // Use mock tracks for this artist
          const mockArtist = MOCK_ARTISTS.find(a => a.name.toLowerCase() === artist.name.toLowerCase());
          artist.topTracks = mockArtist ? mockArtist.topTracks : MOCK_TRACKS.slice(0, 2);
          return artist;
        }
      })
    );
    
    return artistsWithTracks;
  } catch (error) {
    console.error("Error fetching popular artists:", error);
    toast({
      title: "Using mock data",
      description: "API key seems invalid. Using mock data instead.",
      variant: "default",
    });
    return MOCK_ARTISTS;
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
