
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMusic, Album, Song } from "@/lib/musicApi";
import Sidebar from "@/components/Sidebar";
import MusicPlayer from "@/components/MusicPlayer";
import SearchBar from "@/components/SearchBar";
import SongList from "@/components/SongList";
import AlbumCard from "@/components/AlbumCard";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<{ songs: Song[], albums: Album[] }>({ songs: [], albums: [] });
  const [isSearching, setIsSearching] = useState(false);
  
  // Perform search when query changes or on initial load
  useEffect(() => {
    if (query) {
      const performSearch = async () => {
        setIsSearching(true);
        try {
          const results = await searchMusic(query);
          setSearchResults(results);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      };
      
      performSearch();
    }
  }, [query]);
  
  // Update search query
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setSearchParams({ q: newQuery });
  };
  
  const handleAlbumClick = (album: Album) => {
    navigate(`/album/${album.id}`);
  };
  
  return (
    <div className="flex h-screen bg-spotify-dark text-spotify-white">
      <Sidebar />
      
      <main className="flex-1 overflow-auto pb-20">
        {/* Header with search bar */}
        <div className="sticky top-0 z-10 bg-spotify-dark/90 backdrop-blur-sm p-4">
          <SearchBar onSearch={handleSearch} value={query} placeholder="Artists, songs, or albums" className="max-w-xl" />
        </div>
        
        {/* Content */}
        <div className="p-6">
          {isSearching ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 border-4 border-t-spotify-green border-opacity-50 rounded-full animate-spin"></div>
            </div>
          ) : query && (searchResults.songs.length > 0 || searchResults.albums.length > 0) ? (
            <>
              {/* Albums section */}
              {searchResults.albums.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Albums</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {searchResults.albums.map((album) => (
                      <AlbumCard 
                        key={album.id} 
                        album={album} 
                        onClick={handleAlbumClick} 
                      />
                    ))}
                  </div>
                </section>
              )}
              
              {/* Songs section */}
              {searchResults.songs.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Songs</h2>
                  <SongList songs={searchResults.songs} />
                </section>
              )}
            </>
          ) : query ? (
            <div className="text-center py-20 text-spotify-lightGray">
              <p className="text-xl mb-2">No results found for "{query}"</p>
              <p>Please check your spelling or try different keywords</p>
            </div>
          ) : (
            <div className="py-20 text-center">
              <h2 className="text-2xl font-bold mb-4">Search for music</h2>
              <p className="text-spotify-lightGray">
                Find your favorite songs, artists, albums, and more
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Music player at the bottom */}
      <MusicPlayer />
    </div>
  );
};

export default Search;
