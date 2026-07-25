import { z } from "zod";

export const createMatchSchema = z.object({
  sport: z.string().min(1, "Sport is required"),
  homeTeam: z.string().min(1, "Home team is required"),
  awayTeam: z.string().min(1, "Away team is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  homeScore: z.number().int().nonnegative().default(0).optional(),
  awayScore: z.number().int().nonnegative().default(0).optional(),
});

export const updateScoreSchema = z.object({
  homeScore: z.number().int().nonnegative(),
  awayScore: z.number().int().nonnegative(),
});

export const createCommentarySchema = z.object({
  minute: z.number().int().min(0).optional(),
  eventType: z.string().optional(),
  actor: z.string().optional(),
  team: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});
