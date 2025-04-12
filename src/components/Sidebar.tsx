
import { Home, Search, Library, PlusSquare, HeartIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-spotify-black text-spotify-white transition-all duration-300",
        collapsed ? "w-16" : "w-60",
        className
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <span className="text-xl font-bold text-spotify-white">Rhythmic</span>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="text-spotify-lightGray hover:text-spotify-white p-1 rounded-full"
        >
          {collapsed ? ">>" : "<<"}
        </button>
      </div>

      {/* Main navigation */}
      <nav className="p-2">
        <ul className="space-y-2">
          <NavItem
            to="/"
            icon={<Home size={24} />}
            label="Home"
            collapsed={collapsed}
          />
          <NavItem
            to="/search"
            icon={<Search size={24} />}
            label="Search"
            collapsed={collapsed}
          />
          <NavItem
            to="/library"
            icon={<Library size={24} />}
            label="Your Library"
            collapsed={collapsed}
          />
        </ul>
      </nav>

      {/* Playlists section */}
      <div className="mt-8 p-2">
        <ul className="space-y-2">
          <NavItem
            to="/create-playlist"
            icon={<PlusSquare size={24} />}
            label="Create Playlist"
            collapsed={collapsed}
          />
          <NavItem
            to="/liked-songs"
            icon={<HeartIcon size={24} />}
            label="Liked Songs"
            collapsed={collapsed}
          />
        </ul>
      </div>

      {/* Separator */}
      <div className="mx-4 my-4 border-t border-spotify-darkGray" />

      {/* Playlists */}
      {!collapsed && (
        <div className="px-4 py-2 flex-1 overflow-y-auto">
          <h2 className="text-sm font-semibold text-spotify-lightGray mb-2">PLAYLISTS</h2>
          <ul className="space-y-1">
            {["Top Hits", "Discover Weekly", "Rock Classics", "Chill Vibes", "Workout Mix"].map((playlist) => (
              <li key={playlist}>
                <a
                  href="#"
                  className="text-sm text-spotify-lightGray hover:text-spotify-white transition-colors duration-200 block py-1"
                >
                  {playlist}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon, label, collapsed }: NavItemProps) => {
  if (collapsed) {
    return (
      <li>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to={to}
                className="flex items-center justify-center p-3 text-spotify-lightGray hover:text-spotify-white transition-colors duration-200 rounded"
              >
                {icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </li>
    );
  }

  return (
    <li>
      <Link
        to={to}
        className="flex items-center p-3 text-spotify-lightGray hover:text-spotify-white transition-colors duration-200 rounded"
      >
        <span className="mr-4">{icon}</span>
        <span className="font-medium">{label}</span>
      </Link>
    </li>
  );
};

export default Sidebar;
