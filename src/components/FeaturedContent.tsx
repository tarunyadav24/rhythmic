
import { Album } from "@/lib/musicApi";
import AlbumCard from "./AlbumCard";
import { useNavigate } from "react-router-dom";

interface FeaturedContentProps {
  title: string;
  albums: Album[];
}

const FeaturedContent = ({ title, albums }: FeaturedContentProps) => {
  const navigate = useNavigate();

  const handleAlbumClick = (album: Album) => {
    navigate(`/album/${album.id}`);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <a href="#" className="text-sm text-spotify-lightGray hover:underline">
          See all
        </a>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {albums.map((album) => (
          <AlbumCard 
            key={album.id} 
            album={album} 
            onClick={handleAlbumClick} 
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedContent;
