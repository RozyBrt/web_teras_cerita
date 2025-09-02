import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  messages: text("messages").notNull(), // JSON string of messages
  startedAt: timestamp("started_at").notNull().default(sql`now()`),
  endedAt: timestamp("ended_at"),
});

export const stressAssessments = pgTable("stress_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id"),
  question1: integer("question1").notNull(), // How are you feeling today? (1-5)
  question2: integer("question2").notNull(), // How often do you feel anxious? (1-5) 
  question3: integer("question3").notNull(), // Do you have energy for activities? (1-5)
  question4: integer("question4").notNull(), // How difficult is it to concentrate? (1-5)
  question5: integer("question5").notNull(), // How burdened do you feel? (1-5)
  stressScore: integer("stress_score").notNull(),
  stressLevel: text("stress_level").notNull(),
  completedAt: timestamp("completed_at").notNull().default(sql`now()`),
});

export const emergencyRequests = pgTable("emergency_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name"),
  contact: text("contact").notNull(),
  message: text("message"),
  isResolved: boolean("is_resolved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  startedAt: true,
});

export const insertStressAssessmentSchema = createInsertSchema(stressAssessments).omit({
  id: true,
  completedAt: true,
  stressScore: true,
  stressLevel: true,
});

export const insertEmergencyRequestSchema = createInsertSchema(emergencyRequests).omit({
  id: true,
  isResolved: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type StressAssessment = typeof stressAssessments.$inferSelect;
export type InsertStressAssessment = z.infer<typeof insertStressAssessmentSchema>;
export type EmergencyRequest = typeof emergencyRequests.$inferSelect;
export type InsertEmergencyRequest = z.infer<typeof insertEmergencyRequestSchema>;
