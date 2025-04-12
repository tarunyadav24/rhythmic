
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "What do you want to listen to?", 
  className = "",
  value = ""
}: SearchBarProps) => {
  const [query, setQuery] = useState(value);

  // Update query state when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 border-none focus-visible:ring-spotify-green focus-visible:ring-1"
        />
      </div>
    </form>
  );
};

export default SearchBar;
