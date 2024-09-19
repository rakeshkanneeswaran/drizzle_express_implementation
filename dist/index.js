"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
const userRouter_1 = require("./router/userRouter");
const postRouter_1 = require("./router/postRouter");
app.use(express_1.default.json());
app.use("/user", userRouter_1.userRouter);
app.use("/post", postRouter_1.postRouter);
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:3000");
});
