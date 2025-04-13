
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import MusicPlayer from "@/components/MusicPlayer";
import SongList from "@/components/SongList";
import { Song } from "@/lib/musicApi";
import { HeartIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLikedSongs = async () => {
      setLoading(true);
      
      try {
        // For now, we'll use localStorage for simplicity
        // In a real app, this would be fetched from the database
        const storedLikedSongs = localStorage.getItem("likedSongs");
        if (storedLikedSongs) {
          setLikedSongs(JSON.parse(storedLikedSongs));
        }
      } catch (error) {
        console.error("Error fetching liked songs:", error);
        toast({
          title: "Error",
          description: "Could not load your liked songs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, [user]);

  return (
    <div className="flex h-screen bg-spotify-dark text-spotify-white">
      <Sidebar />
      
      <main className="flex-1 overflow-auto pb-20">
        {/* Header */}
        <div className="bg-gradient-to-b from-purple-900 to-spotify-dark p-8">
          <div className="flex items-end gap-6">
            <div className="w-52 h-52 bg-gradient-to-br from-purple-700 to-purple-900 shadow-xl flex items-center justify-center">
              <HeartIcon size={64} className="text-spotify-green" />
            </div>
            
            <div>
              <h4 className="text-sm uppercase font-bold">Playlist</h4>
              <h1 className="text-5xl font-bold mb-6">Liked Songs</h1>
              <p className="text-spotify-lightGray">
                {likedSongs.length} {likedSongs.length === 1 ? 'song' : 'songs'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-spotify-green"></div>
            </div>
          ) : likedSongs.length > 0 ? (
            <SongList songs={likedSongs} />
          ) : (
            <div className="text-center py-16">
              <HeartIcon size={48} className="mx-auto mb-4 text-spotify-lightGray" />
              <h2 className="text-2xl font-bold mb-2">Songs you like will appear here</h2>
              <p className="text-spotify-lightGray mb-6">Save songs by tapping the heart icon</p>
            </div>
          )}
        </div>
      </main>
      
      <MusicPlayer />
    </div>
  );
};

export default LikedSongs;
