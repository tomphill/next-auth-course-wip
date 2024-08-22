import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./usersSchema";

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .unique(),
  token: text("token"),
  tokenExpiry: timestamp("token_expiry"),
});
