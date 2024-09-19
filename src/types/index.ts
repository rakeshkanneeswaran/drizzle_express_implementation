import { emit } from 'process';
import zod from 'zod';

export const siginUpSchema = zod.object({
    email: zod.string()
})

export const siginInSchema = zod.object({
    email: zod.string()
})

export const postSchema = zod.object({
    id: zod.string(),
    title: zod.string()
})

export const postUpdateSchema = zod.object({
    userId: zod.string(),
    postId: zod.string(),
    title: zod.string()
})


