import { useEffect, useRef } from "react";
import { MessageSquare, AlertTriangle, UserMinus, ShieldAlert } from "lucide-react";

type CommentaryEvent = {
  id: number;
  minute: number;
  eventType: string;
  actor: string;
  team: string;
  message: string;
  createdAt: string;
};

export default function CommentaryFeed({ events }: { events: CommentaryEvent[] }) {
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">⚽</div>;
      case "red_card":
        return <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center"><UserMinus size={16} /></div>;
      case "yellow_card":
        return <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center"><AlertTriangle size={16} /></div>;
      case "foul":
        return <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center"><ShieldAlert size={16} /></div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-white/10 text-gray-400 flex items-center justify-center"><MessageSquare size={16} /></div>;
    }
  };

  const getEventStyles = (type: string) => {
    switch (type) {
      case "goal":
        return "border-accent/30 bg-accent/5";
      case "red_card":
        return "border-red-600/30 bg-red-600/5";
      case "yellow_card":
        return "border-yellow-500/30 bg-yellow-500/5";
      case "foul":
        return "border-orange-500/30 bg-orange-500/5";
      default:
        return "border-white/5 bg-white/5";
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 border-2 border-dashed border-white/10 rounded-2xl">
        Waiting for match events...
      </div>
    );
  }

  // Reverse events to show chronologically (assuming they come desc from backend)
  const sortedEvents = [...events].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      {sortedEvents.map((event) => (
        <div
          key={event.id}
          className={`p-4 rounded-xl border ${getEventStyles(event.eventType)} animate-slide-down flex gap-4`}
        >
          <div className="flex-shrink-0 flex flex-col items-center">
             {getEventIcon(event.eventType)}
             {event.minute !== null && event.minute !== undefined && (
               <span className="text-xs font-bold text-gray-400 mt-2">{event.minute}'</span>
             )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {event.actor && <span className="font-bold text-white">{event.actor}</span>}
              {event.team && <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{event.team}</span>}
            </div>
            <p className={event.eventType === "goal" ? "text-white font-bold text-lg" : "text-gray-300"}>
              {event.message}
            </p>
          </div>
        </div>
      ))}
      <div ref={feedEndRef} />
    </div>
  );
}
