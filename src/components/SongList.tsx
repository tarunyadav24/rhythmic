
import { Song } from "@/lib/musicApi";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, MoreHorizontal } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface SongListProps {
  songs: Song[];
  title?: string;
}

const SongList = ({ songs, title }: SongListProps) => {
  const { play, playQueue, isPlaying, currentSong, togglePlay } = usePlayer();

  const handlePlaySong = (song: Song, index: number) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playQueue(songs, index);
    }
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
              
              <div className="flex items-center justify-center">
                <button className="text-spotify-lightGray hover:text-white hover-target">
                  <MoreHorizontal size={18} />
                </button>
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
