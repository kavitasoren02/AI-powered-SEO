"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_js_1 = require("./config/database.js");
const articles_js_1 = __importDefault(require("./routes/articles.js"));
const generation_js_1 = __importDefault(require("./routes/generation.js"));
const n8n_js_1 = __importDefault(require("./routes/n8n.js"));
dotenv_1.default.config();
const requiredEnvVars = ["GEMINI_API_KEY", "GROQ_API_KEY", "MONGODB_URI"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
    process.exit(1);
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express_1.default.json());
// Connect to MongoDB
(0, database_js_1.connectDB)();
// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "Server is running", timestamp: new Date() });
});
// Routes
app.use("/api/articles", articles_js_1.default);
app.use("/api/generate", generation_js_1.default);
app.use("/api/n8n", n8n_js_1.default);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map