import "dotenv/config";
import { Router } from "express";
import { siginUpSchema } from "../types/";
import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { UserTable } from "../drizzle/schema";

const router = Router();

router.post("/signup", async (req, res) => {
    const { success, data, error } = siginUpSchema.safeParse(req.body);
    console.log(data);

    if (!success) {
        // Respond with validation errors
        return res.status(400).json({
            message: "Validation failed",
            errors: error?.issues,
        });
    }

    try {
        // Check if the user already exists
        const existingUser = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.email, data.email));

        if (existingUser.length > 0) {
            // If the user already exists, return a conflict response
            return res.status(409).json({
                message: "User already exists",
            });
        }

        // Proceed with user creation if no existing user found
        const user = await db
            .insert(UserTable)
            .values({
                email: data.email,
            })
            .returning({ id: UserTable.id });

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
    } catch (err) {
        // Catch any database errors or issues
        return res.status(500).json({
            message: "Error creating user",
            error
        });
    }
});

export const userRouter = router;
