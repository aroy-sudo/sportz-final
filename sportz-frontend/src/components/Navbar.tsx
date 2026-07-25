import Link from "next/link";
import { Activity } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white overflow-hidden">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
              Sportz
            </span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Live Matches
            </Link>
            <Link 
              href="/admin" 
              className="text-sm font-medium bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-full border border-white/10 transition-all hover:border-white/20"
            >
              Admin Panel
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
