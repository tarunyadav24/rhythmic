
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  if (!user) return null;
  
  const userEmail = user.email || "";
  const userInitial = userEmail.charAt(0).toUpperCase();
  
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSignOut}
        disabled={isLoggingOut}
        className="hidden md:flex"
      >
        <LogOut className="mr-2 h-4 w-4" />
        {isLoggingOut ? "Signing out..." : "Sign out"}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="rounded-full p-0 w-8 h-8">
            <Avatar className="h-8 w-8 border border-white/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-spotify-green text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <User className="mr-2 h-4 w-4" />
            <span className="truncate">{userEmail}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="md:hidden"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfile;
