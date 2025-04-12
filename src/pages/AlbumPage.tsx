
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAlbumTracks, Album, Song } from "@/lib/musicApi";
import Sidebar from "@/components/Sidebar";
import MusicPlayer from "@/components/MusicPlayer";
import SongList from "@/components/SongList";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, Heart, Clock, ArrowLeft } from "lucide-react";
import { generateGradient } from "@/lib/utils";

const AlbumPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playQueue, isPlaying, currentSong, togglePlay } = usePlayer();
  
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gradientBg, setGradientBg] = useState("linear-gradient(180deg, rgba(47,47,47,1) 0%, rgba(18,18,18,1) 100%)");
  const [isLiked, setIsLiked] = useState(false);
  
  // Check if album's songs are currently playing
  const isAlbumPlaying = isPlaying && 
    currentSong && 
    tracks.some(track => track.id === currentSong.id);
  
  // Load album data
  useEffect(() => {
    const loadAlbum = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch album tracks
        const fetchedTracks = await fetchAlbumTracks(id);
        
        if (fetchedTracks.length > 0) {
          // Use the first track to get album info
          const firstTrack = fetchedTracks[0];
          
          const albumData: Album = {
            id,
            title: firstTrack.album,
            artist: firstTrack.artist,
            cover: firstTrack.cover,
            songs: fetchedTracks,
          };
          
          setAlbum(albumData);
          setTracks(fetchedTracks);
          
          // Generate gradient based on album cover
          const gradient = await generateGradient(firstTrack.cover);
          setGradientBg(gradient);
        } else {
          setError("No tracks found for this album");
        }
      } catch (err) {
        console.error("Error loading album:", err);
        setError("Failed to load album");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAlbum();
  }, [id]);
  
  // Handle play/pause for the entire album
  const handlePlayAlbum = () => {
    if (isAlbumPlaying) {
      togglePlay();
    } else {
      playQueue(tracks);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen bg-spotify-dark text-spotify-white">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-16 w-16 border-4 border-t-spotify-green border-opacity-50 rounded-full animate-spin"></div>
        </main>
        <MusicPlayer />
      </div>
    );
  }
  
  if (error || !album) {
    return (
      <div className="flex h-screen bg-spotify-dark text-spotify-white">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Album not found</h2>
            <p className="text-spotify-lightGray mb-6">{error || "This album could not be loaded"}</p>
            <button 
              onClick={() => navigate(-1)} 
              className="bg-spotify-green text-black px-6 py-2 rounded-full font-semibold"
            >
              Go Back
            </button>
          </div>
        </main>
        <MusicPlayer />
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-spotify-dark text-spotify-white">
      <Sidebar />
      
      <main className="flex-1 overflow-auto pb-20">
        {/* Album header with gradient background */}
        <div 
          style={{ background: gradientBg }}
          className="relative pt-16 pb-6 px-6"
        >
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-4 left-4 bg-black/30 rounded-full p-2 text-white"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-white">
            <img 
              src={album.cover} 
              alt={album.title} 
              className="w-48 h-48 md:w-56 md:h-56 shadow-lg"
            />
            
            <div className="text-center md:text-left">
              <p className="text-sm uppercase font-semibold mb-2">Album</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{album.title}</h1>
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                <span className="font-semibold">{album.artist}</span>
                <span className="hidden md:inline">•</span>
                <span className="text-spotify-lightGray">{tracks.length} songs</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Album controls */}
        <div className="bg-gradient-to-b from-black/20 to-transparent px-6 py-4 flex items-center gap-6">
          <button 
            onClick={handlePlayAlbum}
            className="bg-spotify-green text-black rounded-full p-3 hover:scale-105 transition-transform"
          >
            {isAlbumPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="text-spotify-lightGray hover:text-spotify-white"
          >
            <Heart size={24} fill={isLiked ? "#1DB954" : "none"} />
          </button>
        </div>
        
        {/* Track list */}
        <div className="px-6 py-4">
          <SongList songs={tracks} />
        </div>
      </main>
      
      {/* Music player at the bottom */}
      <MusicPlayer />
    </div>
  );
};

export default AlbumPage;
