"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSEOContent = generateSEOContent;
const generative_ai_1 = require("@google/generative-ai");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const seoPrompts_js_1 = require("./seoPrompts.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
}
if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable is not set");
}
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const groqClient = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY,
});
function generateSEOContent(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            console.log("[ContentGenerator] Starting generation for:", req.topic);
            // Step 1: Generate with Gemini (medical-grade SEO)
            const prompt1 = (0, seoPrompts_js_1.buildMedicalSEOPrompt)(req);
            const geminiResponse = yield generateWithGemini(prompt1);
            console.log("[ContentGenerator] Gemini generation complete", geminiResponse);
            // Step 2: Parse Gemini response
            let parsedContent = parseJson(geminiResponse);
            if (!parsedContent.content) {
                parsedContent = Object.assign(Object.assign({}, parsedContent), { content: geminiResponse });
            }
            console.log({ parsedContent });
            // Step 3: Optimize with Groq (GEO optimization)
            const prompt2 = (0, seoPrompts_js_1.buildGEOOptimizationPrompt)(req, parsedContent.content);
            const groqResponse = yield generateWithGroq(prompt2);
            console.log("[ContentGenerator] Groq optimization complete");
            const geoOptimized = parseJson(groqResponse);
            // Step 4: Merge results
            const finalContent = geoOptimized.optimizedContent || parsedContent.content;
            // Step 5: Calculate metrics
            const wordCount = finalContent.split(/\s+/).length;
            const readabilityScore = (0, seoPrompts_js_1.calculateSEOScore)(finalContent);
            const metaDescription = (0, seoPrompts_js_1.generateMetaDescription)(finalContent, req.primaryKeyword);
            // Step 6: Generate structured data
            const jsonLdSchema = (0, seoPrompts_js_1.generateJsonLdSchema)({
                title: parsedContent.title,
                description: metaDescription,
                content: finalContent,
                keywords: [req.primaryKeyword, ...req.secondaryKeywords],
            });
            console.log("[ContentGenerator] Generation complete");
            return {
                title: parsedContent.title || `${req.primaryKeyword} - Complete Guide`,
                slug: (0, seoPrompts_js_1.generateSlug)(parsedContent.title || req.primaryKeyword),
                content: finalContent,
                metaDescription,
                keywords: [req.primaryKeyword, ...req.secondaryKeywords],
                wordCount,
                readabilityScore,
                seoScore: Math.round((readabilityScore / 100) * 50 + 50), // Normalized to 0-100
                jsonLdSchema,
                faqs: parsedContent.faqs ||
                    ((_a = geoOptimized.quotableSnippets) === null || _a === void 0 ? void 0 : _a.map((snippet) => ({
                        question: extractQuestion(snippet),
                        answer: snippet,
                    }))) ||
                    [],
                ctas: parsedContent.ctas || [
                    {
                        text: `Explore ${req.primaryKeyword} with Healthy Gut AI`,
                        type: "soft",
                    },
                    {
                        text: "Start Your Personalized Health Plan Today",
                        type: "direct",
                    },
                ],
            };
        }
        catch (error) {
            console.error("[ContentGenerator] Error:", error);
            throw new Error("Failed to generate SEO content");
        }
    });
}
function generateWithGemini(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield geminiModel.generateContent(prompt);
            const response = result.response;
            return response.text();
        }
        catch (error) {
            console.error("[Gemini] API error:", error);
            throw error;
        }
    });
}
function generateWithGroq(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const response = yield groqClient.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert SEO content optimizer specializing in E-E-A-T principles for medical content.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                max_tokens: 4096,
                temperature: 0.7,
            });
            const content = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
            return content !== null && content !== void 0 ? content : "";
        }
        catch (error) {
            console.error("[Groq] API error:", error);
            throw error;
        }
    });
}
function parseJson(text) {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch && jsonMatch[1]) {
        try {
            return JSON.parse(jsonMatch[1]);
        }
        catch (_a) {
            console.warn("[Parser] Failed to parse JSON inside code block");
        }
    }
    // Try direct JSON parsing
    try {
        return JSON.parse(text);
    }
    catch (e) {
        console.warn("[Parser] Text is not valid JSON");
        return {};
    }
}
function extractQuestion(text) {
    // Extract a question from the text
    const lines = text.split("\n");
    for (const line of lines) {
        if (line.includes("?")) {
            return line.trim();
        }
    }
    return "How does this information help?";
}
//# sourceMappingURL=contentGenerator.js.map