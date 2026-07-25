"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useWebSocket } from "@/providers/WebSocketProvider";
import MatchCard from "@/components/MatchCard";
import { Activity } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/matches`, fetcher);
  const [matches, setMatches] = useState<any[]>([]);
  const { lastMessage, isConnected } = useWebSocket();

  // Initialize matches when data is fetched
  useEffect(() => {
    if (data?.data) {
      setMatches(data.data);
    }
  }, [data]);

  // Listen for WebSocket global broadcasts
  useEffect(() => {
    if (lastMessage?.type === "match_created") {
      setMatches((prev) => [lastMessage.data, ...prev]);
    } else if (lastMessage?.type === "score_update") {
        // Technically, score updates are broadcast to the match channel, but if we received it...
        setMatches((prev) => 
            prev.map(m => m.id === lastMessage.matchId ? { ...m, homeScore: lastMessage.data.homeScore, awayScore: lastMessage.data.awayScore } : m)
        );
    }
  }, [lastMessage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-primary mt-10">Failed to load matches</div>;
  }

  return (
    <div className="animate-slide-down">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-heading font-black text-white tracking-tight">
            Live Matches
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time updates and scores from around the globe.
          </p>
        </div>
        
        {/* Connection Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium">
          <Activity className={`w-4 h-4 ${isConnected ? "text-accent animate-pulse" : "text-gray-500"}`} />
          <span className={isConnected ? "text-accent" : "text-gray-400"}>
            {isConnected ? "Connected to Live Servers" : "Reconnecting..."}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match: any) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
      
      {matches.length === 0 && (
        <div className="text-center py-20 glass rounded-2xl">
          <p className="text-gray-400 text-lg">No matches scheduled yet.</p>
        </div>
      )}
    </div>
  );
}
