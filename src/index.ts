
import express from 'express';
const app = express();
import * as schema from './drizzle/schema'
import { db } from './drizzle/db';
const PORT = 3000;
import { userRouter } from './router/userRouter';
import { postRouter } from './router/postRouter';
app.use(express.json())

app.use("/user", userRouter)
app.use("/post", postRouter)




app.listen(PORT, () => {
    console.log("Server is running on http://localhost:3000")
})

