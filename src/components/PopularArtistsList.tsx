
import { Artist } from "@/lib/musicApi";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, ExternalLink } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface PopularArtistsListProps {
  artists: Artist[];
}

const PopularArtistsList = ({ artists }: PopularArtistsListProps) => {
  const { play, isPlaying, currentSong, togglePlay } = usePlayer();
  const navigate = useNavigate();

  const handlePlayTrack = (track: any) => {
    if (currentSong?.id === track.id) {
      togglePlay();
    } else {
      play(track);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=300&h=300';
  };

  // Navigate to artist page (placeholder for future implementation)
  const handleArtistClick = (artist: Artist) => {
    // For future implementation
    console.log("Artist clicked:", artist.name);
  };

  if (artists.length === 0) {
    return (
      <div className="p-4 text-center text-spotify-lightGray">
        No artists found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {artists.map((artist) => (
        <motion.div
          key={artist.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="bg-gradient-to-br from-spotify-darkGray/90 to-spotify-darkGray/60 backdrop-blur-sm border-none hover:shadow-lg hover:shadow-spotify-green/10 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative group overflow-hidden rounded-full"
                >
                  <img 
                    src={artist.imageUrl} 
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={handleImageError}
                    onClick={() => handleArtistClick(artist)}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="absolute inset-0 bg-spotify-green/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-all duration-300">
                    <ExternalLink size={20} className="text-white" />
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-white">{artist.name}</h3>
                  <p className="text-xs text-spotify-lightGray">Artist</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {artist.topTracks.map((track) => {
                  const isCurrentTrack = currentSong?.id === track.id;
                  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

                  return (
                    <motion.div 
                      key={track.id} 
                      className="flex items-center justify-between p-2 hover:bg-white/10 rounded-md group"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                      <div className="flex items-center flex-1">
                        <div className="w-8 h-8 flex items-center justify-center relative">
                          {isCurrentlyPlaying ? (
                            <button 
                              onClick={() => togglePlay()} 
                              className="text-spotify-green relative z-10 hover:scale-110 transition-transform"
                            >
                              <Pause size={16} />
                              <div className="absolute -inset-1 bg-white/10 rounded-full -z-10"></div>
                            </button>
                          ) : (
                            <button 
                              onClick={() => handlePlayTrack(track)} 
                              className="text-white opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
                            >
                              <Play size={16} />
                            </button>
                          )}
                          {isCurrentlyPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-full bg-spotify-green/20 animate-pulse rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div className="ml-2">
                          <div className={`text-sm font-medium ${isCurrentTrack ? 'text-spotify-green' : 'text-white'}`}>
                            {track.title}
                          </div>
                          <div className="text-xs text-spotify-lightGray">{track.album}</div>
                        </div>
                      </div>
                      <div className="text-xs text-spotify-lightGray">
                        {formatTime(track.duration)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default PopularArtistsList;
