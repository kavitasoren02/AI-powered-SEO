import express, { type Router, type Request, type Response } from "express"
import { GenerationRequest } from "../models/GenerationRequest.js"
import { Article } from "../models/Article.js"
import { generateSEOContent } from "../services/contentGenerator.js"

const router: Router = express.Router()

// Generate SEO Article
router.post("/", async (req: Request, res: Response) => {
  try {
    const { topic, articleType, primaryKeyword, secondaryKeywords } = req.body

    // Create generation request
    const genRequest = new GenerationRequest({
      topic,
      articleType,
      primaryKeyword,
      secondaryKeywords,
      status: "processing",
    })

    await genRequest.save()

    // Trigger content generation
    const content = await generateSEOContent({
      topic,
      articleType,
      primaryKeyword,
      secondaryKeywords,
    })

    // Create article from generated content
    const article = new Article({
      ...content,
      topic,
    })

    await article.save()

    // Update generation request
    genRequest.status = "completed"
    genRequest.prompt1Response = content.content
    await genRequest.save()

    res.status(201).json({
      article,
      generationRequest: genRequest,
    })
  } catch (error) {
    console.error("Error generating article:", error)
    res.status(500).json({ error: "Failed to generate article" })
  }
})

// Get generation status
router.get("/status/:id", async (req: Request, res: Response) => {
  try {
    const genRequest = await GenerationRequest.findById(req.params.id)
    if (!genRequest) {
      return res.status(404).json({ error: "Generation request not found" })
    }
    res.json(genRequest)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch status" })
  }
})

// Get generation history
router.get("/history", async (req: Request, res: Response) => {
  try {
    const requests = await GenerationRequest.find().sort({ createdAt: -1 }).limit(50)
    res.json(requests)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" })
  }
})

export default router
