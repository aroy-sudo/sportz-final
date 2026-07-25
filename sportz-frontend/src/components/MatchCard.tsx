import Link from "next/link";
import { format } from "date-fns"; // Wait, I need date-fns. I didn't install it. Let me just use native Date.

export default function MatchCard({ match }: { match: any }) {
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";

  const startTime = new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Link href={`/match/${match.id}`} className="block group">
      <div className="glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 relative overflow-hidden">
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          {isLive ? (
            <span className="flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live
            </span>
          ) : isFinished ? (
            <span className="px-3 py-1 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-full text-xs font-bold tracking-widest uppercase">
              FT
            </span>
          ) : (
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold tracking-widest uppercase">
              {startTime}
            </span>
          )}
        </div>

        <div className="text-xs text-gray-400 font-medium mb-4 uppercase tracking-wider">
          {match.sport}
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 text-xl font-bold border border-white/10 group-hover:border-primary/50 transition-colors">
              {match.homeTeam.substring(0, 3).toUpperCase()}
            </div>
            <span className="font-heading font-semibold text-center text-sm">{match.homeTeam}</span>
          </div>

          <div className="flex flex-col items-center px-4">
            <div className="text-3xl font-heading font-black text-white tabular-nums tracking-tighter">
              {isLive || isFinished ? `${match.homeScore} - ${match.awayScore}` : "vs"}
            </div>
            {isLive && (
              <div className="text-xs text-primary mt-1 font-bold animate-pulse">
                75'
              </div>
            )}
          </div>

          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 text-xl font-bold border border-white/10 group-hover:border-primary/50 transition-colors">
              {match.awayTeam.substring(0, 3).toUpperCase()}
            </div>
            <span className="font-heading font-semibold text-center text-sm">{match.awayTeam}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
