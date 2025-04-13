
import { Song } from "@/lib/musicApi";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, MoreHorizontal, Heart } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface SongListProps {
  songs: Song[];
  title?: string;
}

const SongList = ({ songs, title }: SongListProps) => {
  const { play, playQueue, isPlaying, currentSong, togglePlay } = usePlayer();
  const { toast } = useToast();
  const [likedSongs, setLikedSongs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load liked songs from localStorage
    const storedLikedSongs = localStorage.getItem('likedSongs');
    if (storedLikedSongs) {
      const songsArray = JSON.parse(storedLikedSongs) as Song[];
      const likedMap: Record<string, boolean> = {};
      songsArray.forEach(song => {
        likedMap[song.id] = true;
      });
      setLikedSongs(likedMap);
    }
  }, []);

  const handlePlaySong = (song: Song, index: number) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      // This ensures we're starting from the correct song in the queue
      const songsToPlay = [...songs]; // Create a copy to avoid mutating props
      playQueue(songsToPlay, index);
    }
  };

  const toggleLikeSong = (song: Song) => {
    const newLikedSongs = { ...likedSongs };
    
    if (newLikedSongs[song.id]) {
      delete newLikedSongs[song.id];
      toast({
        description: `Removed "${song.title}" from your liked songs`,
      });
    } else {
      newLikedSongs[song.id] = true;
      toast({
        description: `Added "${song.title}" to your liked songs`,
      });
    }
    
    setLikedSongs(newLikedSongs);
    
    // Update localStorage with the full song objects
    const likedSongsList = songs.filter(s => newLikedSongs[s.id]);
    localStorage.setItem('likedSongs', JSON.stringify(likedSongsList));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Set a fallback image if the original one fails to load
    e.currentTarget.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=300&h=300';
  };

  if (songs.length === 0) {
    return (
      <div className="p-4 text-center text-spotify-lightGray">
        No songs found
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      
      <div className="grid grid-cols-[16px_4fr_3fr_1fr_1fr] px-4 py-2 border-b border-spotify-darkGray text-spotify-lightGray text-sm">
        <div className="text-center">#</div>
        <div>TITLE</div>
        <div>ALBUM</div>
        <div></div>
        <div className="text-right">DURATION</div>
      </div>
      
      <div>
        {songs.map((song, index) => {
          const isCurrentSong = currentSong?.id === song.id;
          const isCurrentlyPlaying = isCurrentSong && isPlaying;
          const isLiked = !!likedSongs[song.id];
          
          return (
            <div 
              key={song.id}
              className="grid grid-cols-[16px_4fr_3fr_1fr_1fr] px-4 py-2 hover:bg-white/5 rounded-md text-sm group hover-trigger"
            >
              <div className="flex items-center justify-center">
                {isCurrentlyPlaying ? (
                  <span className="animate-pulse-opacity text-spotify-green">
                    ♫
                  </span>
                ) : (
                  <div className="flex items-center">
                    <span className="group-hover:hidden">{index + 1}</span>
                    <button 
                      className="hidden group-hover:block text-white" 
                      onClick={() => handlePlaySong(song, index)}
                    >
                      <Play size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center">
                <img 
                  src={song.cover} 
                  alt={song.title} 
                  className="h-10 w-10 mr-3 object-cover rounded-sm bg-spotify-darkGray/30" 
                  onError={handleImageError}
                />
                <div className="truncate">
                  <div className={`font-medium truncate ${isCurrentSong ? 'text-spotify-green' : ''}`}>
                    {song.title}
                  </div>
                  <div className="text-xs text-spotify-lightGray truncate">
                    {song.artist}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-spotify-lightGray truncate">
                {song.album}
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <button 
                  onClick={() => toggleLikeSong(song)} 
                  className={`opacity-70 hover:opacity-100 transition-opacity ${isLiked ? 'text-spotify-green' : 'text-spotify-lightGray'}`}
                >
                  <Heart size={16} fill={isLiked ? "#1DB954" : "none"} />
                </button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-spotify-lightGray hover:text-white hover-target">
                      <MoreHorizontal size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-spotify-darkGray border-spotify-lightGray/20 text-spotify-white">
                    <DropdownMenuItem 
                      onClick={() => handlePlaySong(song, index)}
                      className="cursor-pointer hover:bg-white/10"
                    >
                      Play
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => toggleLikeSong(song)}
                      className="cursor-pointer hover:bg-white/10"
                    >
                      {isLiked ? "Remove from Liked Songs" : "Add to Liked Songs"}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigator.clipboard.writeText(song.title)}
                      className="cursor-pointer hover:bg-white/10"
                    >
                      Copy song name
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center justify-end text-spotify-lightGray">
                {formatTime(song.duration)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SongList;
