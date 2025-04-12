
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Volume1, 
  VolumeX,
  Repeat,
  Shuffle,
  Heart
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const MusicPlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    volume, 
    progress, 
    duration, 
    togglePlay, 
    next, 
    previous, 
    setVolume, 
    seekTo 
  } = usePlayer();

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // If no song is selected, return minimal player
  if (!currentSong) {
    return (
      <div className="music-player-gradient fixed bottom-0 left-0 right-0 h-20 px-4 flex items-center justify-between border-t border-spotify-darkGray">
        <div className="text-sm text-spotify-lightGray">
          Select a song to start playing
        </div>
      </div>
    );
  }

  // Volume icon based on current volume level
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <div className="music-player-gradient fixed bottom-0 left-0 right-0 h-20 px-4 flex items-center justify-between border-t border-spotify-darkGray">
      {/* Currently playing song info */}
      <div className="flex items-center w-1/4 min-w-64">
        <img 
          src={currentSong.cover} 
          alt={currentSong.title} 
          className="h-14 w-14 object-cover mr-3 rounded shadow"
        />
        <div className="truncate">
          <div className="font-semibold text-sm truncate">{currentSong.title}</div>
          <div className="text-xs text-spotify-lightGray truncate">{currentSong.artist}</div>
        </div>
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="ml-4 text-spotify-lightGray hover:text-spotify-white"
        >
          <Heart size={18} fill={isLiked ? "#1DB954" : "none"} />
        </button>
      </div>

      {/* Player controls */}
      <div className="flex flex-col items-center w-2/4">
        <div className="flex items-center justify-center mb-2 space-x-4">
          <button 
            onClick={() => setIsShuffle(!isShuffle)} 
            className={`text-spotify-lightGray hover:text-spotify-white ${isShuffle ? 'text-spotify-green' : ''}`}
          >
            <Shuffle size={18} />
          </button>
          <button 
            onClick={previous} 
            className="text-spotify-lightGray hover:text-spotify-white"
          >
            <SkipBack size={22} />
          </button>
          <button 
            onClick={togglePlay} 
            className="bg-spotify-white text-spotify-black rounded-full p-2 hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button 
            onClick={next} 
            className="text-spotify-lightGray hover:text-spotify-white"
          >
            <SkipForward size={22} />
          </button>
          <button 
            onClick={() => setIsRepeat(!isRepeat)} 
            className={`text-spotify-lightGray hover:text-spotify-white ${isRepeat ? 'text-spotify-green' : ''}`}
          >
            <Repeat size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center w-full max-w-xl space-x-2">
          <span className="text-xs text-spotify-lightGray w-8 text-right">
            {formatTime(progress)}
          </span>
          <Slider
            value={[progress]}
            max={duration || 100}
            step={1}
            className="w-full"
            onValueChange={(values) => seekTo(values[0])}
          />
          <span className="text-xs text-spotify-lightGray w-8">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume control */}
      <div className="flex items-center justify-end w-1/4 space-x-2">
        <button className="text-spotify-lightGray hover:text-spotify-white">
          {getVolumeIcon()}
        </button>
        <Slider
          value={[volume * 100]}
          max={100}
          step={1}
          className="w-24"
          onValueChange={(values) => setVolume(values[0] / 100)}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
