import { useTheme } from "../context/ThemeContext"

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-secondary/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Healthy Gut AI</h1>
            <p className="text-xs text-muted-foreground">SEO Content Generation</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-foreground hover:text-accent transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-foreground hover:text-accent transition-colors">
            Articles
          </a>
          <a href="#" className="text-foreground hover:text-accent transition-colors">
            Settings
          </a>
          <a href="#" className="text-foreground hover:text-accent transition-colors">
            Documentation
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border hover:bg-background transition-colors"
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <span className="text-lg">☀️</span> : <span className="text-lg">🌙</span>}
          </button>

          {/* Settings Button */}
          <button className="p-2 rounded-lg border border-border hover:bg-background transition-colors hidden md:block">
            <span className="text-lg">⚙️</span>
          </button>

          {/* Mobile Menu */}
          <button className="p-2 rounded-lg border border-border md:hidden">
            <span className="text-lg">≡</span>
          </button>
        </div>
      </div>
    </header>
  )
}
