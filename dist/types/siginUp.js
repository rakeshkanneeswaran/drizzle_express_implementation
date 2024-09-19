"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.siginInSchema = exports.siginUpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.siginUpSchema = zod_1.default.object({
    email: zod_1.default.string()
});
exports.siginInSchema = zod_1.default.object({
    email: zod_1.default.string()
});
