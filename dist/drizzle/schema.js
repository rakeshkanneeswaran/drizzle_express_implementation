"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostTable = exports.UserTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.UserTable = (0, pg_core_1.pgTable)("UserTable", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
});
exports.PostTable = (0, pg_core_1.pgTable)("PostTable", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    userId: (0, pg_core_1.uuid)("userId").notNull().references(() => {
        return exports.UserTable.id;
    })
});
