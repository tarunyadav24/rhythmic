
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTopTracks, fetchFeaturedAlbums, fetchPopularArtists, Album, Song, Artist } from "@/lib/musicApi";
import Sidebar from "@/components/Sidebar";
import MusicPlayer from "@/components/MusicPlayer";
import SongList from "@/components/SongList";
import FeaturedContent from "@/components/FeaturedContent";
import SearchBar from "@/components/SearchBar";
import PopularArtistsList from "@/components/PopularArtistsList";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  // Fetch top tracks
  const { 
    data: topTracks = [], 
    isLoading: isLoadingTracks,
    error: tracksError
  } = useQuery({
    queryKey: ['topTracks'],
    queryFn: fetchTopTracks,
  });
  
  // Fetch featured albums
  const { 
    data: featuredAlbums = [], 
    isLoading: isLoadingAlbums,
    error: albumsError
  } = useQuery({
    queryKey: ['featuredAlbums'],
    queryFn: fetchFeaturedAlbums,
  });
  
  // Fetch popular artists
  const {
    data: popularArtists = [],
    isLoading: isLoadingArtists,
    error: artistsError
  } = useQuery({
    queryKey: ['popularArtists'],
    queryFn: fetchPopularArtists,
  });
  
  // Handle search
  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  return (
    <div className="flex h-screen bg-spotify-dark text-spotify-white">
      <Sidebar />
      
      <main className="flex-1 overflow-auto pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-spotify-dark/90 backdrop-blur-sm p-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button className="bg-black/40 rounded-full p-1">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="white">
                  <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z"></path>
                </svg>
              </button>
              <button className="bg-black/40 rounded-full p-1">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="white">
                  <path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0z"></path>
                </svg>
              </button>
            </div>
            
            <SearchBar onSearch={handleSearch} className="w-80" />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Welcome section */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold mb-6">Good day</h1>
            
            {/* Featured albums */}
            {isLoadingAlbums ? (
              <div className="flex justify-center py-10">
                <div className="h-10 w-10 border-4 border-t-spotify-green border-opacity-50 rounded-full animate-spin"></div>
              </div>
            ) : albumsError ? (
              <div className="text-center py-10 text-red-400">
                Failed to load featured content
              </div>
            ) : (
              <FeaturedContent title="Featured Albums" albums={featuredAlbums} />
            )}
          </section>
          
          {/* Popular Artists */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Popular Artists</h2>
            
            {isLoadingArtists ? (
              <div className="flex justify-center py-10">
                <div className="h-10 w-10 border-4 border-t-spotify-green border-opacity-50 rounded-full animate-spin"></div>
              </div>
            ) : artistsError ? (
              <div className="text-center py-10 text-red-400">
                Failed to load popular artists
              </div>
            ) : (
              <PopularArtistsList artists={popularArtists} />
            )}
          </section>
          
          {/* Top tracks */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Popular Tracks</h2>
            
            {isLoadingTracks ? (
              <div className="flex justify-center py-10">
                <div className="h-10 w-10 border-4 border-t-spotify-green border-opacity-50 rounded-full animate-spin"></div>
              </div>
            ) : tracksError ? (
              <div className="text-center py-10 text-red-400">
                Failed to load tracks
              </div>
            ) : (
              <SongList songs={topTracks} />
            )}
          </section>
        </div>
      </main>
      
      {/* Music player at the bottom */}
      <MusicPlayer />
    </div>
  );
};

export default Index;
