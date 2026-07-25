"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { createMatchSchema, updateScoreSchema, createCommentarySchema } from "@/lib/schema";
import type { z } from "zod";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminPage() {
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  // Fetch live matches
  const { data: matchesData, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/matches`,
    fetcher
  );

  const matches = matchesData?.data || [];
  const liveMatches = matches.filter((m: any) => m.status === "live");

  // Create Match Form
  const {
    register: registerMatch,
    handleSubmit: handleMatchSubmit,
    reset: resetMatch,
    formState: { errors: matchErrors, isSubmitting: isCreatingMatch },
  } = useForm<z.infer<typeof createMatchSchema>>({
    resolver: zodResolver(createMatchSchema),
  });

  const onCreateMatch = async (data: z.infer<typeof createMatchSchema>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        resetMatch();
        mutate();
        alert("Match created successfully!");
      } else {
        alert("Failed to create match");
      }
    } catch (e) {
      console.error(e);
      alert("Error creating match");
    }
  };

  // Score Form
  const {
    register: registerScore,
    handleSubmit: handleScoreSubmit,
    reset: resetScore,
  } = useForm<z.infer<typeof updateScoreSchema>>({
    resolver: zodResolver(updateScoreSchema),
  });

  const onUpdateScore = async (data: z.infer<typeof updateScoreSchema>) => {
    if (!selectedMatchId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/matches/${selectedMatchId}/score`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        resetScore();
        alert("Score updated!");
      } else {
        alert("Failed to update score");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Commentary Form
  const {
    register: registerCommentary,
    handleSubmit: handleCommentarySubmit,
    reset: resetCommentary,
  } = useForm<z.infer<typeof createCommentarySchema>>({
    resolver: zodResolver(createCommentarySchema),
  });

  const onPostCommentary = async (data: z.infer<typeof createCommentarySchema>) => {
    if (!selectedMatchId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/matches/${selectedMatchId}/commentary`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        resetCommentary();
        alert("Commentary posted!");
      } else {
        alert("Failed to post commentary");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Create Match */}
      <div className="glass p-6 rounded-2xl animate-slide-down">
        <h2 className="text-2xl font-heading font-bold text-white mb-6">Create New Match</h2>
        <form onSubmit={handleMatchSubmit(onCreateMatch)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Sport</label>
              <input
                {...registerMatch("sport")}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Football"
              />
              {matchErrors.sport && <p className="text-primary text-xs mt-1">{matchErrors.sport.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Home Team</label>
              <input
                {...registerMatch("homeTeam")}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Team A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Away Team</label>
              <input
                {...registerMatch("awayTeam")}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Team B"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Start Time</label>
              <input
                type="datetime-local"
                {...registerMatch("startTime")}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">End Time</label>
              <input
                type="datetime-local"
                {...registerMatch("endTime")}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isCreatingMatch}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition-colors mt-6"
          >
            {isCreatingMatch ? "Creating..." : "Schedule Match"}
          </button>
        </form>
      </div>

      {/* Right Column: Live Controller */}
      <div className="glass p-6 rounded-2xl animate-slide-down" style={{ animationDelay: "100ms" }}>
        <h2 className="text-2xl font-heading font-bold text-white mb-6">Live Controller</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-1">Select Live Match</label>
          <select
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setSelectedMatchId(Number(e.target.value))}
            value={selectedMatchId || ""}
          >
            <option value="" disabled>Select a match to control</option>
            {liveMatches.map((m: any) => (
              <option key={m.id} value={m.id}>
                {m.homeTeam} vs {m.awayTeam} ({m.sport})
              </option>
            ))}
          </select>
        </div>

        {selectedMatchId && (
          <div className="space-y-8">
            {/* Score Updater */}
            <div className="p-4 border border-white/5 bg-white/5 rounded-xl">
              <h3 className="font-heading font-semibold text-white mb-3">Update Score</h3>
              <form onSubmit={handleScoreSubmit(onUpdateScore)} className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Home</label>
                  <input
                    type="number"
                    {...registerScore("homeScore", { valueAsNumber: true })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Away</label>
                  <input
                    type="number"
                    {...registerScore("awayScore", { valueAsNumber: true })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <button type="submit" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                  Update
                </button>
              </form>
            </div>

            {/* Commentary Poster */}
            <div className="p-4 border border-white/5 bg-white/5 rounded-xl">
              <h3 className="font-heading font-semibold text-white mb-3">Post Commentary</h3>
              <form onSubmit={handleCommentarySubmit(onPostCommentary)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs text-gray-400 mb-1">Minute</label>
                    <input type="number" {...registerCommentary("minute", { valueAsNumber: true })} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Event Type</label>
                    <select {...registerCommentary("eventType")} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white">
                      <option value="">Normal</option>
                      <option value="goal">Goal</option>
                      <option value="red_card">Red Card</option>
                      <option value="yellow_card">Yellow Card</option>
                      <option value="foul">Foul</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Actor (Player)</label>
                    <input {...registerCommentary("actor")} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Team</label>
                    <input {...registerCommentary("team")} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Message</label>
                  <textarea {...registerCommentary("message")} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white min-h-[80px]" required></textarea>
                </div>
                <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-2 rounded-lg transition-colors">
                  Post Event
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
