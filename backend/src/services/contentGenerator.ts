import { GoogleGenerativeAI } from "@google/generative-ai"
import Groq from "groq-sdk"
import {
  buildMedicalSEOPrompt,
  buildGEOOptimizationPrompt,
  generateSlug,
  generateMetaDescription,
  calculateSEOScore,
  generateJsonLdSchema,
} from "./seoPrompts.js"
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set")
}

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY environment variable is not set")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

interface ContentGenerationRequest {
  topic: string
  articleType: "pillar" | "supporting"
  primaryKeyword: string
  secondaryKeywords: string[]
}

interface GeneratedContent {
  title: string
  slug: string
  content: string
  metaDescription: string
  keywords: string[]
  wordCount: number
  readabilityScore: number
  seoScore: number
  jsonLdSchema: object
  faqs: Array<{ question: string; answer: string }>
  ctas: Array<{ text: string; type: "soft" | "direct" }>
}

export async function generateSEOContent(req: ContentGenerationRequest): Promise<GeneratedContent> {
  try {
    console.log("[ContentGenerator] Starting generation for:", req.topic)

    // Step 1: Generate with Gemini (medical-grade SEO)
    const prompt1 = buildMedicalSEOPrompt(req)
    const geminiResponse = await generateWithGemini(prompt1)
    console.log("[ContentGenerator] Gemini generation complete", geminiResponse)

    // Step 2: Parse Gemini response
    let parsedContent: any = parseJson(geminiResponse)
    if (!parsedContent.content) {
      parsedContent = {
        ...parsedContent,
        content: geminiResponse,
      }
    }

    console.log({parsedContent})

    // Step 3: Optimize with Groq (GEO optimization)
    const prompt2 = buildGEOOptimizationPrompt(req, parsedContent.content)
    const groqResponse = await generateWithGroq(prompt2)
    console.log("[ContentGenerator] Groq optimization complete")

    const geoOptimized = parseJson(groqResponse)

    // Step 4: Merge results
    const finalContent = geoOptimized.optimizedContent || parsedContent.content

    // Step 5: Calculate metrics
    const wordCount = finalContent.split(/\s+/).length
    const readabilityScore = calculateSEOScore(finalContent)
    const metaDescription = generateMetaDescription(finalContent, req.primaryKeyword)

    // Step 6: Generate structured data
    const jsonLdSchema = generateJsonLdSchema({
      title: parsedContent.title,
      description: metaDescription,
      content: finalContent,
      keywords: [req.primaryKeyword, ...req.secondaryKeywords],
    })

    console.log("[ContentGenerator] Generation complete")

    return {
      title: parsedContent.title || `${req.primaryKeyword} - Complete Guide`,
      slug: generateSlug(parsedContent.title || req.primaryKeyword),
      content: finalContent,
      metaDescription,
      keywords: [req.primaryKeyword, ...req.secondaryKeywords],
      wordCount,
      readabilityScore,
      seoScore: Math.round((readabilityScore / 100) * 50 + 50), // Normalized to 0-100
      jsonLdSchema,
      faqs:
        parsedContent.faqs ||
        geoOptimized.quotableSnippets?.map((snippet: string) => ({
          question: extractQuestion(snippet),
          answer: snippet,
        })) ||
        [],
      ctas: parsedContent.ctas || [
        {
          text: `Explore ${req.primaryKeyword} with Healthy Gut AI`,
          type: "soft" as const,
        },
        {
          text: "Start Your Personalized Health Plan Today",
          type: "direct" as const,
        },
      ],
    }
  } catch (error) {
    console.error("[ContentGenerator] Error:", error)
    throw new Error("Failed to generate SEO content")
  }
}

async function generateWithGemini(prompt: string): Promise<string> {
  try {
    const result = await geminiModel.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error("[Gemini] API error:", error)
    throw error
  }
}

async function generateWithGroq(prompt: string): Promise<string> {
  try {
    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert SEO content optimizer specializing in E-E-A-T principles for medical content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 4096,
      temperature: 0.7,
    })

    const content = response?.choices?.[0]?.message?.content
    return content ?? ""
  } catch (error) {
    console.error("[Groq] API error:", error)
    throw error
  }
}

function parseJson(text: string): any {
  // Try to extract JSON from markdown code blocks
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/)
  if (jsonMatch && jsonMatch[1]) {
    try {
      return JSON.parse(jsonMatch[1])
    } catch {
      console.warn("[Parser] Failed to parse JSON inside code block")
    }
  }

  // Try direct JSON parsing
  try {
    return JSON.parse(text)
  } catch (e) {
    console.warn("[Parser] Text is not valid JSON")
    return {}
  }
}

function extractQuestion(text: string): string {
  // Extract a question from the text
  const lines = text.split("\n")
  for (const line of lines) {
    if (line.includes("?")) {
      return line.trim()
    }
  }
  return "How does this information help?"
}
