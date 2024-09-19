import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { Router } from "express";
import { postSchema, postUpdateSchema } from "../types";
import { db } from "../drizzle/db";
import { PostTable, UserTable } from "../drizzle/schema";

const router = Router();

router.post("/", async (req, res) => {
    // Validate request body against schema
    const { success, data, error } = postSchema.safeParse(req.body);

    if (!success) {
        // Respond with validation errors
        return res.status(400).json({
            message: "Validation failed",
            errors: error?.issues
        });
    }

    try {
        // Check if the user exists
        const existingUser = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.id, data.id));

        if (existingUser.length === 0) {
            // User does not exist, return a 404 response
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        // Insert the new post
        const postAdded = await db
            .insert(PostTable)
            .values({
                title: data.title,
                userId: data.id
            })
            .returning({
                postId: PostTable.id,
                userId: PostTable.userId,
                title: PostTable.title
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
    } catch (err) {
        // Log the error and respond with a generic error message
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error
        });
    }
});

router.put("/", async (req, res) => {
    const { success, data, error } = postUpdateSchema.safeParse(req.body);

    if (!success) {
        // Respond with validation errors
        return res.status(400).json({
            message: "Validation failed",
            errors: error?.issues
        });
    }

    try {
        // Check if the user exists
        const existingUser = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.id, data.userId));

        if (existingUser.length === 0) {
            // User does not exist, return a 404 response
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        // Update the post
        const postUpdated = await db
            .update(PostTable)
            .set({
                title: data.title
            })
            .where(and(eq(PostTable.id, data.postId), eq(PostTable.userId, data.userId))).returning({
                postId: PostTable.id,
                title: PostTable.title
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
    } catch (err) {
        // Log the error and respond with a generic error message
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error
        });
    }
});

export const postRouter = router;
