import { useState, useEffect } from "react"
import ArticleGenerationForm from "./ArticleGenerationForm"
import ArticlesList from "./ArticlesList"
import StatsCard from "./StatsCard"
import api from "../lib/api"

interface Article {
  _id: string
  status: "draft" | "published" | "archived"
  wordCount: number
}

export default function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [activeTab, setActiveTab] = useState<"generate" | "view">("generate")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await api.get("/articles")
        setArticles(response.data.articles)
      } catch (error) {
        console.error("[v0] Failed to load articles:", error)
      } finally {
        // do nothing
      }
    }

    loadArticles()
  }, [refreshTrigger])

  const handleArticleGenerated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Articles" value={articles.length} icon="📄" trend="up" />
        <StatsCard label="Published" value={articles.filter((a) => a.status === "published").length} icon="✅" />
        <StatsCard
          label="Total Words"
          value={(articles.reduce((sum, a) => sum + (a.wordCount || 0), 0) / 1000).toFixed(1) + "K"}
          icon="📝"
        />
        <StatsCard label="Avg. Readability" value="7.5" icon="📊" />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab("generate")}
          className={`pb-4 px-2 border-b-2 font-medium transition-colors ${activeTab === "generate"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          Generate Article
        </button>
        <button
          onClick={() => setActiveTab("view")}
          className={`pb-4 px-2 border-b-2 font-medium transition-colors ${activeTab === "view"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          View Articles
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "generate" ? (
          <ArticleGenerationForm onArticleGenerated={handleArticleGenerated} />
        ) : (
          <ArticlesList refreshTrigger={refreshTrigger} />
        )}
      </div>
    </main>
  )
}
