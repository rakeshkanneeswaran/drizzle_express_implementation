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
exports.postRouter = void 0;
require("dotenv/config");
const drizzle_orm_1 = require("drizzle-orm");
const express_1 = require("express");
const types_1 = require("../types");
const db_1 = require("../drizzle/db");
const schema_1 = require("../drizzle/schema");
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body against schema
    const { success, data, error } = types_1.postSchema.safeParse(req.body);
    if (!success) {
        // Respond with validation errors
        return res.status(400).json({
            message: "Validation failed",
            errors: error === null || error === void 0 ? void 0 : error.issues
        });
    }
    try {
        // Check if the user exists
        const existingUser = yield db_1.db
            .select()
            .from(schema_1.UserTable)
            .where((0, drizzle_orm_1.eq)(schema_1.UserTable.id, data.id));
        if (existingUser.length === 0) {
            // User does not exist, return a 404 response
            return res.status(404).json({
                message: "User does not exist"
            });
        }
        // Insert the new post
        const postAdded = yield db_1.db
            .insert(schema_1.PostTable)
            .values({
            title: data.title,
            userId: data.id
        })
            .returning({
            postId: schema_1.PostTable.id,
            userId: schema_1.PostTable.userId,
            title: schema_1.PostTable.title
        });
        if (postAdded.length === 0) {
            // Handle any insertion failure
            return res.status(500).json({
                message: "Failed to create post"
            });
        }
        // Respond with success message and post details
        return res.status(201).json({
            message: "Post added successfully",
            post: postAdded[0]
        });
    }
    catch (err) {
        // Log the error and respond with a generic error message
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error
        });
    }
}));
router.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data, error } = types_1.postUpdateSchema.safeParse(req.body);
    if (!success) {
        // Respond with validation errors
        return res.status(400).json({
            message: "Validation failed",
            errors: error === null || error === void 0 ? void 0 : error.issues
        });
    }
    try {
        // Check if the user exists
        const existingUser = yield db_1.db
            .select()
            .from(schema_1.UserTable)
            .where((0, drizzle_orm_1.eq)(schema_1.UserTable.id, data.userId));
        if (existingUser.length === 0) {
            // User does not exist, return a 404 response
            return res.status(404).json({
                message: "User does not exist"
            });
        }
        // Update the post
        const postUpdated = yield db_1.db
            .update(schema_1.PostTable)
            .set({
            title: data.title
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.PostTable.id, data.postId), (0, drizzle_orm_1.eq)(schema_1.PostTable.userId, data.userId))).returning({
            postId: schema_1.PostTable.id,
            title: schema_1.PostTable.title
        });
        if (postUpdated.length == 0) {
            // Handle case where no rows were updated
            return res.status(500).json({
                message: "Failed to update post or no changes made"
            });
        }
        // Respond with success message
        return res.status(200).json({
            message: "Post updated successfully",
            postId: postUpdated[0].postId,
            title: postUpdated[0].title
        });
    }
    catch (err) {
        // Log the error and respond with a generic error message
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error
        });
    }
}));
exports.postRouter = router;
