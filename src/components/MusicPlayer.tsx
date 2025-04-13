
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
  Heart,
  MoreHorizontal
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [visualizerBars, setVisualizerBars] = useState<number[]>([]);
  const visualizerRef = useRef<HTMLDivElement>(null);
  
  // Generate visualizer bars
  useEffect(() => {
    if (isPlaying) {
      const barsCount = 28;
      const interval = setInterval(() => {
        const newBars = Array(barsCount).fill(0).map(() => 
          Math.floor(Math.random() * 100)
        );
        setVisualizerBars(newBars);
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setVisualizerBars(Array(28).fill(5));
    }
  }, [isPlaying]);

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
    <div className="music-player-gradient fixed bottom-0 left-0 right-0 h-20 px-4 flex items-center justify-between border-t border-spotify-darkGray backdrop-blur-sm">
      {/* Visualizer */}
      <div className="absolute top-0 left-0 right-0 h-1 flex items-end justify-center space-x-[2px] overflow-hidden">
        <div ref={visualizerRef} className="flex justify-center space-x-[2px] px-4 w-full max-w-[800px]">
          {visualizerBars.map((height, index) => (
            <div 
              key={index} 
              className="w-[4px] bg-spotify-green transition-all duration-100 ease-out"
              style={{ 
                height: `${Math.max(1, height / 20)}px`, 
                opacity: isPlaying ? 0.8 : 0.3
              }}
            />
          ))}
        </div>
      </div>

      {/* Currently playing song info */}
      <div className="flex items-center w-1/4 min-w-64">
        <div className="relative group h-14 w-14">
          <img 
            src={currentSong.cover} 
            alt={currentSong.title} 
            className="h-14 w-14 object-cover rounded shadow group-hover:brightness-75 transition-all"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-white bg-black/30 p-1 rounded-full hover:bg-black/60 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
        <div className="ml-3 truncate">
          <div className="font-semibold text-sm truncate">{currentSong.title}</div>
          <div className="text-xs text-spotify-lightGray truncate">{currentSong.artist}</div>
        </div>
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="ml-4 text-spotify-lightGray hover:text-spotify-white transition-colors"
        >
          <Heart 
            size={18} 
            fill={isLiked ? "#1DB954" : "none"} 
            className={isLiked ? "text-spotify-green" : ""}
          />
        </button>
      </div>

      {/* Player controls */}
      <div className="flex flex-col items-center w-2/4 relative">
        <div className="flex items-center justify-center mb-2 space-x-4">
          <button 
            onClick={() => setIsShuffle(!isShuffle)} 
            className={`text-spotify-lightGray hover:text-spotify-white transition-colors ${isShuffle ? 'text-spotify-green' : ''}`}
          >
            <Shuffle size={18} />
          </button>
          <button 
            onClick={previous} 
            className="text-spotify-lightGray hover:text-spotify-white transition-transform hover:scale-110"
          >
            <SkipBack size={22} />
          </button>
          <button 
            onClick={togglePlay} 
            className="bg-spotify-white text-spotify-black rounded-full p-2 hover:scale-105 transition-transform shadow-md hover:shadow-lg"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button 
            onClick={next} 
            className="text-spotify-lightGray hover:text-spotify-white transition-transform hover:scale-110"
          >
            <SkipForward size={22} />
          </button>
          <button 
            onClick={() => setIsRepeat(!isRepeat)} 
            className={`text-spotify-lightGray hover:text-spotify-white transition-colors ${isRepeat ? 'text-spotify-green' : ''}`}
          >
            <Repeat size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center w-full max-w-xl space-x-2">
          <span className="text-xs text-spotify-lightGray w-8 text-right">
            {formatTime(progress)}
          </span>
          <div className="relative w-full group">
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              className="w-full"
              onValueChange={(values) => seekTo(values[0])}
            />
            <div 
              className="absolute top-1/2 left-0 h-2 bg-spotify-green/30 -translate-y-1/2 pointer-events-none rounded-full"
              style={{ width: `${(progress / (duration || 100)) * 100}%` }}
            />
          </div>
          <span className="text-xs text-spotify-lightGray w-8">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume control */}
      <div className="flex items-center justify-end w-1/4 space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-spotify-lightGray hover:text-spotify-white p-1 hover:bg-white/10 rounded transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-spotify-darkGray/90 backdrop-blur-md border-spotify-lightGray/20 text-spotify-white">
            <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
              Add to playlist
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
              View album
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button className="text-spotify-lightGray hover:text-spotify-white transition-colors">
          {getVolumeIcon()}
        </button>
        <div className="relative w-24 group">
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            className="w-24"
            onValueChange={(values) => setVolume(values[0] / 100)}
          />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-spotify-green/30 -translate-y-1/2 pointer-events-none rounded-full"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
