import type React from "react"

import { useState } from "react"
import api from "../lib/api"

interface ArticleGenerationFormProps {
  onArticleGenerated: (article: any) => void
}

export default function ArticleGenerationForm({ onArticleGenerated }: ArticleGenerationFormProps) {
  const [formData, setFormData] = useState({
    topic: "",
    articleType: "pillar" as "pillar" | "supporting",
    primaryKeyword: "",
    secondaryKeywords: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.post("generate", {
        ...formData,
        secondaryKeywords: formData.secondaryKeywords.split(",").map((k) => k.trim()),
      })
      onArticleGenerated(response.data)
      setFormData({ topic: "", articleType: "pillar", primaryKeyword: "", secondaryKeywords: "" })
    } catch (err) {
      setError("Failed to generate article. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="bg-secondary rounded-lg border border-border p-6 transition-colors">
        <h2 className="text-2xl font-bold mb-6">Generate SEO Article</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="e.g., Gut Health Benefits, Probiotics for IBS"
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">The main topic for your article</p>
          </div>

          {/* Article Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Article Type</label>
              <select
                name="articleType"
                value={formData.articleType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors appearance-none cursor-pointer"
              >
                <option value="pillar">Pillar Article (2500-3000 words)</option>
                <option value="supporting">Supporting Article (1000-1500 words)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content Variant</label>
              <select
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors appearance-none cursor-pointer"
                defaultValue="seo"
              >
                <option value="seo">SEO Optimized</option>
                <option value="geo">AI/GEO Optimized</option>
              </select>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium mb-2">Primary Keyword</label>
            <input
              type="text"
              name="primaryKeyword"
              value={formData.primaryKeyword}
              onChange={handleInputChange}
              placeholder="e.g., healthy gut microbiome"
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Your main target keyword (0.8-1.2% density)</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Secondary Keywords</label>
            <input
              type="text"
              name="secondaryKeywords"
              value={formData.secondaryKeywords}
              onChange={handleInputChange}
              placeholder="e.g., probiotics, digestive health, gut bacteria, microbiome diversity"
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-1">Comma-separated related keywords</p>
          </div>

          {/* Options */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium">Content Options</h3>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-sm">Include FAQ Section (5-8 questions)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-sm">Add Medical Citations (NIH, NHS, CDC)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-sm">Generate JSON-LD Schema Markup</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-sm">Include "Healthy Gut AI" CTA Section</span>
            </label>
          </div>

          {/* Error Message */}
          {error && <div className="bg-red-500/20 border border-red-500 text-red-900 px-4 py-3 rounded">{error}</div>}

          {/* Loading State */}
          {loading && (
            <div className="bg-accent/20 border border-accent text-accent px-4 py-3 rounded">
              Generating your SEO-optimized article... This may take a minute.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Generating Article...
              </span>
            ) : (
              "Generate Article"
            )}
          </button>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-secondary rounded-lg border border-border p-6 transition-colors">
          <h3 className="font-bold mb-2">Pillar Articles</h3>
          <p className="text-sm text-muted-foreground">2500-3000 words, comprehensive guides for your main topics</p>
        </div>
        <div className="bg-secondary rounded-lg border border-border p-6 transition-colors">
          <h3 className="font-bold mb-2">Supporting Articles</h3>
          <p className="text-sm text-muted-foreground">1000-1500 words, targeted content for related keywords</p>
        </div>
        <div className="bg-secondary rounded-lg border border-border p-6 transition-colors">
          <h3 className="font-bold mb-2">AI-Ready Format</h3>
          <p className="text-sm text-muted-foreground">Optimized for both search engines and AI answer engines</p>
        </div>
      </div>
    </div>
  )
}
