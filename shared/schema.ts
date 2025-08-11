import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const faculty = pgTable("faculty", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  department: text("department").notNull(),
  office: text("office").notNull(),
  phone: text("phone"),
  officeHours: text("office_hours"),
  status: text("status").notNull().default("away"), // available, busy, away
  customMessage: text("custom_message"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertFacultySchema = createInsertSchema(faculty).omit({
  id: true,
  lastUpdated: true,
});

export const updateFacultyStatusSchema = z.object({
  status: z.enum(["available", "busy", "away"]),
  customMessage: z.string().optional(),
});

export type InsertFaculty = z.infer<typeof insertFacultySchema>;
export type Faculty = typeof faculty.$inferSelect;
export type UpdateFacultyStatus = z.infer<typeof updateFacultyStatusSchema>;
