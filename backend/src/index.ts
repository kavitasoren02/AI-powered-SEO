import express, { type Express, type Request, type Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/database.js"
import articlesRouter from "./routes/articles.js"
import generationRouter from "./routes/generation.js"
import n8nRouter from "./routes/n8n.js"

dotenv.config()

const requiredEnvVars = ["GEMINI_API_KEY", "GROQ_API_KEY", "MONGODB_URI"]
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`)
  process.exit(1)
}

const app: Express = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }))
app.use(express.json())

// Connect to MongoDB
connectDB()

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "Server is running", timestamp: new Date() })
})

// Routes
app.use("/api/articles", articlesRouter)
app.use("/api/generate", generationRouter)
app.use("/api/n8n", n8nRouter)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
