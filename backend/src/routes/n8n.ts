import express, { type Router, type Request, type Response } from "express"
import { N8nService } from "../services/n8nService.js"
import { GenerationRequest } from "../models/GenerationRequest.js"
import { Article } from "../models/Article.js"

const router: Router = express.Router()

// Trigger n8n workflow
router.post("/trigger", async (req: Request, res: Response) => {
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

    // Trigger n8n workflow
    const executionId = await N8nService.triggerWorkflow({
      topic,
      articleType,
      primaryKeyword,
      secondaryKeywords,
      webhookId: genRequest._id.toString(),
    })

    res.json({
      message: "Workflow triggered successfully",
      generationRequestId: genRequest._id,
      executionId,
    })
  } catch (error) {
    console.error("Error triggering workflow:", error)
    res.status(500).json({ error: "Failed to trigger workflow" })
  }
})

// Webhook endpoint for n8n to post results back
router.post("/webhook/result", async (req: Request, res: Response) => {
  try {
    const { webhookId, content, metadata } = req.body

    // Find generation request
    const genRequest = await GenerationRequest.findByIdAndUpdate(
      webhookId,
      {
        status: "completed",
        prompt1Response: content,
      },
      { new: true },
    )

    if (!genRequest) {
      return res.status(404).json({ error: "Generation request not found" })
    }

    // Create article from generated content
    const article = new Article({
      title: metadata.title,
      slug: metadata.slug,
      content,
      metaDescription: metadata.metaDescription,
      keywords: metadata.keywords,
      wordCount: metadata.wordCount,
      readabilityScore: metadata.readabilityScore,
      jsonLdSchema: metadata.jsonLdSchema,
      faqs: metadata.faqs,
      ctas: metadata.ctas,
      topic: genRequest.topic,
      status: "draft",
    })

    await article.save()

    console.log("[n8n] Article created from workflow result:", article._id)
    res.json({ message: "Result processed successfully", articleId: article._id })
  } catch (error) {
    console.error("[n8n] Error processing webhook result:", error)
    res.status(500).json({ error: "Failed to process result" })
  }
})

// Get workflow status
router.get("/status/:executionId", async (req: Request, res: Response) => {
  try {
    const status = await N8nService.getExecutionStatus(req.params.executionId ?? "")
    res.json(status)
  } catch (error) {
    res.status(500).json({ error: "Failed to get status" })
  }
})

// List n8n workflows
router.get("/workflows", async (req: Request, res: Response) => {
  try {
    const workflows = await N8nService.listWorkflows()
    res.json(workflows)
  } catch (error) {
    res.status(500).json({ error: "Failed to list workflows" })
  }
})

// Get workflow details
router.get("/workflows/:id", async (req: Request, res: Response) => {
  try {
    const workflow = await N8nService.getWorkflow(req.params.id ?? "")
    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" })
    }
    res.json(workflow)
  } catch (error) {
    res.status(500).json({ error: "Failed to get workflow details" })
  }
})

export default router
