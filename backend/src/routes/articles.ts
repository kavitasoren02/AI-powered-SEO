import express, { type Router, type Request, type Response } from "express"
import { Article } from "../models/Article.js"

const router: Router = express.Router()

// Get all articles
router.get("/", async (req: Request, res: Response) => {
  try {
    const articles = await Article.find()
    res.json({articles})
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch articles" })
  }
})

// Get article by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) {
      return res.status(404).json({ error: "Article not found" })
    }
    res.json(article)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch article" })
  }
})

// Create article
router.post("/", async (req: Request, res: Response) => {
  try {
    const article = new Article(req.body)
    await article.save()
    res.status(201).json(article)
  } catch (error) {
    res.status(400).json({ error: "Failed to create article" })
  }
})

// Update article
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.json(article)
  } catch (error) {
    res.status(400).json({ error: "Failed to update article" })
  }
})

// Delete article
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Article.findByIdAndDelete(req.params.id)
    res.json({ message: "Article deleted successfully" })
  } catch (error) {
    res.status(400).json({ error: "Failed to delete article" })
  }
})

export default router
