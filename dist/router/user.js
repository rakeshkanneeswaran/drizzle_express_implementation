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
const drizzle_orm_1 = require("drizzle-orm");
const express_1 = require("express");
const siginUp_1 = require("../types/siginUp");
const db_1 = require("../drizzle/db");
const schema_1 = require("../drizzle/schema");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data, error } = siginUp_1.siginUpSchema.safeParse(req.body);
    // console.log(data)
    if (!success) {
        // Respond with validation errors
        return res.status(400).json({
            message: "Validation failed",
            errors: error === null || error === void 0 ? void 0 : error.issues
        });
    }
    try {
        console.log("checkpont  1");
        const userExisit = yield db_1.db.select({
            email: schema_1.UserTable.email
        }).from(schema_1.UserTable).where((0, drizzle_orm_1.eq)(schema_1.UserTable.email, data.email));
        console.log(userExisit);
        if (userExisit.length != 0) {
            return res.json({
                "message": "email already exisit"
            });
        }
        const user = yield db_1.db
            .insert(schema_1.UserTable)
            .values({
            email: data.email
        })
            .returning({ id: schema_1.UserTable.id });
        console.log(user.length);
        if (user.length === 0) {
            // Respond with an internal server error
            return res.status(500).json({
                message: "Internal server error"
            });
        }
        console.log("logging details");
        console.log(user[0].id);
        // Respond with success message and the new user ID
        return res.status(201).json({
            message: "Signup successful",
            id: user[0].id
        });
    }
    catch (err) {
        // Catch any database errors or issues
        console.log(err);
        return res.status(500).json({
            message: "Error creating user",
            error: error
        });
    }
}));
exports.userRouter = router;
