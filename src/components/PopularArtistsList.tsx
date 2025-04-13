
import { Artist } from "@/lib/musicApi";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

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
        <Card key={artist.id} className="bg-spotify-darkGray/50 border-none hover:bg-spotify-darkGray/70 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={artist.imageUrl} 
                alt={artist.name}
                className="w-16 h-16 rounded-full object-cover"
                onError={handleImageError}
                onClick={() => handleArtistClick(artist)}
                style={{ cursor: 'pointer' }}
              />
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
                  <div 
                    key={track.id} 
                    className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md group"
                  >
                    <div className="flex items-center flex-1">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {isCurrentlyPlaying ? (
                          <button onClick={() => togglePlay()} className="text-spotify-green">
                            <Pause size={16} />
                          </button>
                        ) : (
                          <button onClick={() => handlePlayTrack(track)} className="text-white opacity-0 group-hover:opacity-100">
                            <Play size={16} />
                          </button>
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
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PopularArtistsList;
