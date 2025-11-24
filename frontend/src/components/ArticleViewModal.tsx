import { useState } from "react"
import api from "../lib/api"

interface ArticleViewModalProps {
    article: {
        _id: string
        title: string
        content: string
        metaDescription: string
        keywords: string[]
        topic: string
        wordCount: number
        readabilityScore: number
        status: "draft" | "published" | "archived"
        createdAt: string
        faqs?: Array<{ question: string; answer: string }>
        ctas?: Array<{ text: string; type: string }>
    }
    onClose: () => void
    onStatusChange: () => void
}

export default function ArticleViewModal({ article, onClose, onStatusChange }: ArticleViewModalProps) {
    const [loading, setLoading] = useState(false)

    const handlePublish = async () => {
        setLoading(true)
        try {
            await api.put(`articles/${article._id}`, { status: "published" })
            onStatusChange()
            onClose()
        } catch (error) {
            console.error("[v0] Failed to publish article:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUnpublish = async () => {
        setLoading(true)
        try {
            await api.put(`articles/${article._id}`, { status: "draft" })
            onStatusChange()
            onClose()
        } catch (error) {
            console.error("[v0] Failed to unpublish article:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg border border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky bg-white z-10 top-0 bg-card border-b border-border p-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{article.title}</h1>
                        <p className="text-muted-foreground text-sm mt-1">{article.topic}</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors text-2xl">
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Meta Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-secondary rounded-lg border border-border">
                        <div>
                            <span className="text-muted-foreground text-sm">Status</span>
                            <p className="font-semibold capitalize text-accent">{article.status}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground text-sm">Word Count</span>
                            <p className="font-semibold">{article.wordCount.toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground text-sm">Readability</span>
                            <p className="font-semibold">Grade {article.readabilityScore || "N/A"}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground text-sm">Created</span>
                            <p className="font-semibold">{new Date(article.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Meta Description */}
                    <div>
                        <h3 className="font-semibold mb-2">Meta Description</h3>
                        <p className="text-foreground bg-secondary p-4 rounded-lg border border-border">
                            {article.metaDescription}
                        </p>
                    </div>

                    {/* Keywords */}
                    <div>
                        <h3 className="font-semibold mb-2">Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                            {article.keywords && article.keywords.length > 0 ? (
                                article.keywords.map((keyword, idx) => (
                                    <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                        {keyword}
                                    </span>
                                ))
                            ) : (
                                <p className="text-muted-foreground">No keywords</p>
                            )}
                        </div>
                    </div>

                    {/* Article Content */}
                    <div>
                        <h3 className="font-semibold mb-2">Content</h3>
                        <div className="content-wrapper" dangerouslySetInnerHTML={{ __html: article.content }}></div>
                    </div>

                    {/* FAQs */}
                    {article.faqs && article.faqs.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">FAQs</h3>
                            <div className="space-y-3">
                                {article.faqs.map((faq, idx) => (
                                    <div key={idx} className="bg-secondary p-4 rounded-lg border border-border">
                                        <p className="font-medium text-foreground mb-2">{faq.question}</p>
                                        <p className="text-muted-foreground text-sm">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white z-10 bg-card border-t border-border p-6 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors"
                    >
                        Close
                    </button>
                    {article.status === "draft" ? (
                        <button
                            onClick={handlePublish}
                            disabled={loading}
                            className="px-4 py-2 rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Publishing..." : "Publish"}
                        </button>
                    ) : (
                        <button
                            onClick={handleUnpublish}
                            disabled={loading}
                            className="px-4 py-2 rounded-md font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors disabled:opacity-50"
                        >
                            {loading ? "Unpublishing..." : "Move to Draft"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
