import mongoose, { Schema, type Document } from "mongoose"

interface IGenerationRequest extends Document {
  topic: string
  articleType: "pillar" | "supporting"
  primaryKeyword: string
  secondaryKeywords: string[]
  prompt1Response?: string
  prompt2Response?: string
  status: "pending" | "processing" | "completed" | "failed"
  error?: string
  createdAt: Date
  updatedAt: Date
}

const GenerationRequestSchema = new Schema<IGenerationRequest>(
  {
    topic: { type: String, required: true },
    articleType: { type: String, enum: ["pillar", "supporting"], required: true },
    primaryKeyword: { type: String, required: true },
    secondaryKeywords: [String],
    prompt1Response: String,
    prompt2Response: String,
    status: { type: String, enum: ["pending", "processing", "completed", "failed"], default: "pending" },
    error: String,
  },
  { timestamps: true },
)

export const GenerationRequest = mongoose.model<IGenerationRequest>("GenerationRequest", GenerationRequestSchema)
