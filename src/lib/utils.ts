
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format seconds to mm:ss
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Generate a gradient background based on image dominant color
export async function generateGradient(imageUrl: string): Promise<string> {
  // In a real app, this would analyze the image and return a gradient
  // For now, return a default gradient
  return "linear-gradient(180deg, rgba(47,47,47,1) 0%, rgba(18,18,18,1) 100%)";
}
