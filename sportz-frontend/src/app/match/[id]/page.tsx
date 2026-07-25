"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useWebSocket } from "@/providers/WebSocketProvider";
import CommentaryFeed from "@/components/CommentaryFeed";
import { Activity } from "lucide-react";
import { useParams } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = Number(params.id);

  // Fetch initial data
  const { data: matchesData } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/matches`, fetcher);
  const { data: commentaryData } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/matches/${matchId}/commentary?limit=100`, fetcher);

  const [match, setMatch] = useState<any>(null);
  const [commentary, setCommentary] = useState<any[]>([]);

  const { subscribeToMatch, unsubscribeFromMatch, lastMessage, isConnected } = useWebSocket();

  // Set initial match data
  useEffect(() => {
    if (matchesData?.data) {
      const found = matchesData.data.find((m: any) => m.id === matchId);
      if (found) setMatch(found);
    }
  }, [matchesData, matchId]);

  // Set initial commentary
  useEffect(() => {
    if (commentaryData?.data) {
      setCommentary(commentaryData.data);
    }
  }, [commentaryData]);

  // WebSocket subscriptions & message handling
  useEffect(() => {
    if (matchId && isConnected) {
      subscribeToMatch(matchId);
    }
    return () => {
      if (matchId) {
        unsubscribeFromMatch(matchId);
      }
    };
  }, [matchId, isConnected, subscribeToMatch, unsubscribeFromMatch]);

  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === "score_update" && lastMessage.matchId === matchId) {
      setMatch((prev: any) => prev ? { ...prev, homeScore: lastMessage.data.homeScore, awayScore: lastMessage.data.awayScore } : prev);
    } else if (lastMessage.type === "commentary" && lastMessage.data.matchId === matchId) {
      // Backend broadcastCommentary sends the comment as data
      setCommentary((prev) => [lastMessage.data, ...prev]);
    }
  }, [lastMessage, matchId]);

  if (!match) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isLive = match.status === "live";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Match Header / Scoreboard */}
      <div className="lg:col-span-3">
        <div className="glass rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-50"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-6">
              {isLive && (
                <span className="flex items-center gap-2 px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-bold tracking-widest uppercase animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  Live Match
                </span>
              )}
              {!isLive && (
                <span className="px-4 py-1.5 bg-white/10 text-white rounded-full text-sm font-bold tracking-widest uppercase">
                  {match.status}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
              {/* Home Team */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5 flex items-center justify-center mb-4 text-4xl sm:text-5xl font-black border-4 border-white/10 shadow-2xl shadow-black/50">
                  {match.homeTeam.substring(0, 3).toUpperCase()}
                </div>
                <span className="font-heading font-bold text-xl sm:text-2xl text-center">{match.homeTeam}</span>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center px-8">
                <div className="text-6xl sm:text-8xl font-heading font-black text-white tabular-nums tracking-tighter drop-shadow-2xl">
                  {match.homeScore} - {match.awayScore}
                </div>
                {isLive && <div className="text-primary font-bold mt-2 flex items-center gap-2"><Activity className="w-4 h-4 animate-pulse"/> Connecting fans</div>}
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5 flex items-center justify-center mb-4 text-4xl sm:text-5xl font-black border-4 border-white/10 shadow-2xl shadow-black/50">
                  {match.awayTeam.substring(0, 3).toUpperCase()}
                </div>
                <span className="font-heading font-bold text-xl sm:text-2xl text-center">{match.awayTeam}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Play-by-Play Commentary */}
      <div className="lg:col-span-2">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-white">Live Play-by-Play</h2>
            {isConnected ? (
              <span className="text-xs font-bold text-accent px-3 py-1 bg-accent/10 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Connected
              </span>
            ) : (
              <span className="text-xs font-bold text-gray-500 px-3 py-1 bg-gray-500/10 rounded-full flex items-center gap-2">
                Reconnecting...
              </span>
            )}
          </div>
          <CommentaryFeed events={commentary} />
        </div>
      </div>
      
      {/* Match Stats / Details (Placeholder) */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-heading font-bold text-lg text-white mb-4">Match Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Sport</span>
              <span className="font-semibold text-white capitalize">{match.sport}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Status</span>
              <span className="font-semibold text-white capitalize">{match.status}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Kickoff</span>
              <span className="font-semibold text-white">{new Date(match.startTime).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
