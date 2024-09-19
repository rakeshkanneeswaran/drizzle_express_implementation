"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
require("dotenv/config");
const express_1 = require("express");
const types_1 = require("../types/");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../drizzle/db");
const schema_1 = require("../drizzle/schema");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data, error } = types_1.siginUpSchema.safeParse(req.body);
    console.log(data);
    if (!success) {
        // Respond with validation errors
        return res.status(400).json({
            message: "Validation failed",
            errors: error === null || error === void 0 ? void 0 : error.issues,
        });
    }
    try {
        // Check if the user already exists
        const existingUser = yield db_1.db
            .select()
            .from(schema_1.UserTable)
            .where((0, drizzle_orm_1.eq)(schema_1.UserTable.email, data.email));
        if (existingUser.length > 0) {
            // If the user already exists, return a conflict response
            return res.status(409).json({
                message: "User already exists",
            });
        }
        // Proceed with user creation if no existing user found
        const user = yield db_1.db
            .insert(schema_1.UserTable)
            .values({
            email: data.email,
        })
            .returning({ id: schema_1.UserTable.id });
        if (user.length === 0) {
            // Respond with an internal server error if the insert fails
            return res.status(500).json({
                message: "Internal server error",
            });
        }
        // Respond with success message and the new user ID
        return res.status(201).json({
            message: "Signup successful",
            id: user[0].id,
        });
    }
    catch (err) {
        // Catch any database errors or issues
        return res.status(500).json({
            message: "Error creating user",
            error
        });
    }
}));
exports.userRouter = router;
