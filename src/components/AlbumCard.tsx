
import { Album } from "@/lib/musicApi";
import { Play } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { fetchAlbumTracks } from "@/lib/musicApi";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface AlbumCardProps {
  album: Album;
  onClick?: (album: Album) => void;
}

const AlbumCard = ({ album, onClick }: AlbumCardProps) => {
  const { playQueue } = usePlayer();
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayAlbum = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      setIsLoading(true);
      const tracks = await fetchAlbumTracks(album.id);
      
      if (tracks.length > 0) {
        playQueue(tracks);
      } else {
        toast({
          title: "No tracks found",
          description: `No playable tracks found in "${album.title}"`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error playing album:", error);
      toast({
        title: "Error",
        description: "Failed to play this album. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      className="bg-spotify-darkGray hover:bg-spotify-darkGray/90 transition-all duration-300 h-full cursor-pointer relative shadow group"
      onClick={() => onClick?.(album)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="relative mb-4">
          <img 
            src={album.cover} 
            alt={album.title} 
            className="w-full aspect-square object-cover shadow-lg rounded-md"
          />
          
          {isHovering && (
            <button
              onClick={handlePlayAlbum}
              disabled={isLoading}
              className="absolute bottom-2 right-2 bg-spotify-green text-black rounded-full p-3 shadow-lg transform transition-transform duration-300 hover:scale-105 opacity-0 group-hover:opacity-100"
            >
              {isLoading ? (
                <div className="h-6 w-6 border-2 border-t-transparent border-black rounded-full animate-spin" />
              ) : (
                <Play size={18} className="ml-0.5" />
              )}
            </button>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-base text-white truncate mb-1">{album.title}</h3>
          <p className="text-sm text-spotify-lightGray">{album.artist}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlbumCard;
