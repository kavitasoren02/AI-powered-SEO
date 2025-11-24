import { useState, useEffect } from "react"
import api from "../lib/api"
import ArticleViewModal from "./ArticleViewModal"
import ArticleEditModal from "./ArticleEditModal"

interface Article {
  _id: string
  title: string
  topic: string
  metaDescription: string
  wordCount: number
  status: "draft" | "published" | "archived"
  createdAt: string
  readabilityScore?: number
  content: string
  keywords: string[]
  faqs?: Array<{ question: string; answer: string }>
  ctas?: Array<{ text: string; type: string }>
}

interface ArticlesListProps {
  refreshTrigger?: number
}

export default function ArticlesList({ refreshTrigger }: ArticlesListProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const response = await api.get("/articles")
      console.log("[v0] Fetched articles:", response.data.articles)
      setArticles(response.data.articles)
    } catch (error) {
      console.error("[v0] Failed to fetch articles:", error)
    } finally {
      setLoading(false)
    }
  }
  console.log({
    articles
  })
  useEffect(() => {
    fetchArticles()
  }, [refreshTrigger])

  const handleDelete = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      await api.delete(`/articles/${articleId}`)
      setArticles(articles.filter((a) => a._id !== articleId))
      alert("Article deleted successfully")
    } catch (error) {
      console.error("[v0] Failed to delete article:", error)
      alert("Failed to delete article")
    }
  }

  const filteredArticles = articles.filter((article) => {
    const matchesFilter = filter === "all" || article.status === filter
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading && articles.length === 0) {
    return (
      <div className="bg-secondary rounded-lg border border-border p-6 transition-colors text-center py-16">
        <p className="text-muted-foreground">Loading articles...</p>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="bg-secondary rounded-lg border border-border p-6 transition-colors text-center py-16">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-xl font-bold mb-2">No articles yet</h3>
        <p className="text-muted-foreground">Generate your first SEO article to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-secondary rounded-lg border border-border p-6 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "draft", "published"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm capitalize ${filter === status
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border active:bg-secondary/60"
                  }`}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-secondary rounded-lg border border-border p-6 transition-colors text-center py-8">
          <p className="text-muted-foreground">No articles match your search</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <div
              key={article._id}
              className="bg-secondary rounded-lg border border-border p-6 transition-colors hover:border-accent"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{article.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded capitalize ${article.status === "published"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted/20 text-muted-foreground"
                        }`}
                    >
                      {article.status}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-2">{article.metaDescription}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Topic:</span>
                      <p className="font-medium">{article.topic}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Words:</span>
                      <p className="font-medium">{article.wordCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Readability:</span>
                      <p className="font-medium">Grade {article.readabilityScore || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p className="font-medium">{new Date(article.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-col">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 text-sm whitespace-nowrap"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setEditingArticle(article)}
                    className="px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border active:bg-secondary/60 text-sm whitespace-nowrap"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 text-sm whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedArticle && (
        <ArticleViewModal
          article={selectedArticle as any}
          onClose={() => setSelectedArticle(null)}
          onStatusChange={fetchArticles}
        />
      )}

      {editingArticle && (
        <ArticleEditModal article={editingArticle} onClose={() => setEditingArticle(null)} onSave={fetchArticles} />
      )}
    </div>
  )
}
