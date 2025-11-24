import type React from "react"

import { useState } from "react"
import api from "../lib/api"

interface ArticleEditModalProps {
    article: {
        _id: string
        title: string
        content: string
        metaDescription: string
        keywords: string[]
        topic: string
    }
    onClose: () => void
    onSave: () => void
}

export default function ArticleEditModal({ article, onClose, onSave }: ArticleEditModalProps) {
    const [formData, setFormData] = useState({
        title: article.title,
        content: article.content,
        metaDescription: article.metaDescription,
        keywords: article.keywords.join(", "),
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await api.put(`articles/${article._id}`, {
                ...formData,
                keywords: formData.keywords.split(",").map((k) => k.trim()),
            })
            onSave()
            onClose()
        } catch (error) {
            console.error("[v0] Failed to save article:", error)
            alert("Failed to save article")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card bg-white rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Article</h1>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors text-2xl">
                        ✕
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block font-medium mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    {/* Meta Description */}
                    <div>
                        <label className="block font-medium mb-2">Meta Description</label>
                        <textarea
                            name="metaDescription"
                            value={formData.metaDescription}
                            onChange={handleChange}
                            maxLength={160}
                            rows={3}
                            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            placeholder="Max 160 characters"
                        />
                        <p className="text-xs text-muted-foreground mt-1">{formData.metaDescription.length}/160</p>
                    </div>

                    {/* Keywords */}
                    <div>
                        <label className="block font-medium mb-2">Keywords (comma separated)</label>
                        <input
                            type="text"
                            name="keywords"
                            value={formData.keywords}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="e.g., keyword1, keyword2, keyword3"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block font-medium mb-2">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={8}
                            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            placeholder="Article content..."
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    )
}
