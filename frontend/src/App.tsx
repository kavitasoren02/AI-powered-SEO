import { ThemeProvider } from "./context/ThemeContext"
import Header from "./components/Header"
import Dashboard from "./components/Dashboard"

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Dashboard />
      </div>
    </ThemeProvider>
  )
}

export default App
