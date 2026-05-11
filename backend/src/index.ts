import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./routes/user"
import { authMiddleware } from "./middleware/authMiddleware"
import { accountRouter } from "./routes/account"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/v1/user", userRouter)
app.use("/api/v1/account", accountRouter)

app.get("/health", (req, res) => {
    res.json({
        message: "Backend running",
        timestamp: Date.now()
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on the port ${process.env.PORT}`)
})