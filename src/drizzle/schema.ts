
import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const UserTable = pgTable("UserTable", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),

})

export const PostTable = pgTable("PostTable", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    userId: uuid("userId").notNull().references(() => {
        return UserTable.id
    })
})