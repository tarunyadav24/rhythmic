
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { Song } from "@/lib/musicApi";
import { toast } from "@/hooks/use-toast";

interface PlayerContextType {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  play: (song: Song) => void;
  playQueue: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  seekTo: (position: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.7);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;
    
    // Cleanup
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);
  
  // Set up event listeners for the audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => next();
    const handleError = (e: any) => {
      console.error("Audio error:", e);
      toast({
        title: "Playback Error",
        description: "There was a problem playing this track. Skipping to next song.",
        variant: "destructive",
      });
      next();
    };
    
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    
    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);
  
  // When currentSong changes, load and play the new song
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    
    const audio = audioRef.current;
    
    // Only change the source if we have a new song
    if (audio.src !== currentSong.audioUrl) {
      console.log("Loading new song:", currentSong.title);
      audio.src = currentSong.audioUrl;
      audio.load();
      
      if (isPlaying) {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Playback prevented:", error);
            setIsPlaying(false);
          });
        }
      }
    } else if (isPlaying && audio.paused) {
      // If the source is the same but we should be playing and we're paused, play
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Playback prevented:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSong, isPlaying]);
  
  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Play a specific song
  const play = (song: Song) => {
    if (!song) return;
    console.log("Playing single song:", song.title);
    setCurrentSong(song);
    setQueue([song]);
    setQueueIndex(0);
    setIsPlaying(true);
  };
  
  // Play a queue of songs starting at a specific index
  const playQueue = (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;
    
    console.log(`Playing queue starting at index ${startIndex}:`, songs[startIndex].title);
    setQueue(songs);
    setQueueIndex(startIndex);
    setCurrentSong(songs[startIndex]);
    setIsPlaying(true);
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (currentSong) {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Playback prevented:", error);
            setIsPlaying(false);
          });
        }
      }
    }
  };
  
  // Pause playback
  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  };
  
  // Play next song in queue
  const next = () => {
    if (queue.length === 0) return;
    
    const newIndex = (queueIndex + 1) % queue.length;
    setQueueIndex(newIndex);
    setCurrentSong(queue[newIndex]);
  };
  
  // Play previous song in queue
  const previous = () => {
    if (queue.length === 0) return;
    
    const newIndex = queueIndex === 0 ? queue.length - 1 : queueIndex - 1;
    setQueueIndex(newIndex);
    setCurrentSong(queue[newIndex]);
  };
  
  // Set volume (0-1)
  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };
  
  // Seek to a position in the song
  const seekTo = (position: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = position;
    setProgress(position);
  };
  
  const value = {
    currentSong,
    queue,
    isPlaying,
    volume,
    progress,
    duration,
    play,
    playQueue,
    togglePlay,
    pause,
    next,
    previous,
    setVolume,
    seekTo,
  };
  
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
