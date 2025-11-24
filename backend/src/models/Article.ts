import mongoose, { Schema, type Document } from "mongoose"

interface IArticle extends Document {
  title: string
  slug: string
  content: string
  metaDescription: string
  keywords: string[]
  wordCount: number
  readabilityScore: number
  jsonLdSchema: object
  faqs: Array<{ question: string; answer: string }>
  ctas: Array<{ text: string; type: "soft" | "direct" }>
  topic: string
  createdAt: Date
  updatedAt: Date
  status: "draft" | "published" | "archived"
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },

    slug: { type: String, required: true, lowercase: true, unique: true, index: true },

    content: { type: String, required: true },

    metaDescription: { type: String, required: true, maxlength: 160 },

    keywords: [{ type: String }],

    wordCount: { type: Number, default: 0 },
    readabilityScore: { type: Number, default: 0 },

    jsonLdSchema: { type: Schema.Types.Mixed },

    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],

    ctas: [
      {
        text: { type: String, required: true },
        type: { type: String, enum: ["soft", "direct"], required: true },
      },
    ],

    topic: { type: String, required: true },

    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  },
  { timestamps: true },
)

export const Article = mongoose.model<IArticle>("Article", ArticleSchema)
