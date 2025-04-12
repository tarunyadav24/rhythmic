
import Sidebar from "@/components/Sidebar";
import MusicPlayer from "@/components/MusicPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LibraryIcon, Music, ListPlus, Clock, Heart } from "lucide-react";

const Library = () => {
  return (
    <div className="flex h-screen bg-spotify-dark text-spotify-white">
      <Sidebar />
      
      <main className="flex-1 overflow-auto pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-spotify-dark/90 backdrop-blur-sm p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <LibraryIcon size={24} />
              <h1 className="text-xl font-bold">Your Library</h1>
            </div>
            
            <button className="p-2 text-spotify-lightGray hover:text-spotify-white rounded-full">
              <ListPlus size={20} />
            </button>
          </div>
        </div>
        
        {/* Library content */}
        <div className="p-6">
          <Tabs defaultValue="playlists" className="w-full">
            <TabsList className="mb-6 bg-spotify-darkGray">
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
              <TabsTrigger value="albums">Albums</TabsTrigger>
              <TabsTrigger value="artists">Artists</TabsTrigger>
            </TabsList>
            
            <TabsContent value="playlists" className="mt-0">
              <div className="grid grid-cols-1 gap-4">
                {/* Liked Songs playlist */}
                <div className="bg-gradient-to-r from-spotify-purple to-indigo-600 rounded-lg p-4 flex items-center cursor-pointer">
                  <div className="w-16 h-16 mr-4 bg-gradient-to-br from-spotify-darkGray to-spotify-lightGray rounded flex items-center justify-center">
                    <Heart size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Liked Songs</h3>
                    <p className="text-sm text-gray-200">Playlist • 0 songs</p>
                  </div>
                </div>
                
                {/* Empty state message */}
                <div className="text-center py-10">
                  <div className="mx-auto w-12 h-12 rounded-full bg-spotify-darkGray flex items-center justify-center mb-4">
                    <Music size={20} className="text-spotify-lightGray" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Create your first playlist</h3>
                  <p className="text-sm text-spotify-lightGray mb-4">It's easy, we'll help you</p>
                  <button className="bg-white text-black font-semibold px-4 py-2 rounded-full text-sm">
                    Create playlist
                  </button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="albums" className="mt-0">
              <div className="text-center py-10">
                <div className="mx-auto w-12 h-12 rounded-full bg-spotify-darkGray flex items-center justify-center mb-4">
                  <LibraryIcon size={20} className="text-spotify-lightGray" />
                </div>
                <h3 className="font-bold text-lg mb-2">Your albums will appear here</h3>
                <p className="text-sm text-spotify-lightGray mb-4">Save albums by tapping the heart icon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="artists" className="mt-0">
              <div className="text-center py-10">
                <div className="mx-auto w-12 h-12 rounded-full bg-spotify-darkGray flex items-center justify-center mb-4">
                  <Clock size={20} className="text-spotify-lightGray" />
                </div>
                <h3 className="font-bold text-lg mb-2">Your artists will appear here</h3>
                <p className="text-sm text-spotify-lightGray mb-4">Follow artists you like by tapping the follow button</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <MusicPlayer />
    </div>
  );
};

export default Library;
