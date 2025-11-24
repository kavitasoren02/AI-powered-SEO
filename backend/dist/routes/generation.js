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
const express_1 = __importDefault(require("express"));
const GenerationRequest_js_1 = require("../models/GenerationRequest.js");
const Article_js_1 = require("../models/Article.js");
const contentGenerator_js_1 = require("../services/contentGenerator.js");
const router = express_1.default.Router();
// Generate SEO Article
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topic, articleType, primaryKeyword, secondaryKeywords } = req.body;
        // Create generation request
        const genRequest = new GenerationRequest_js_1.GenerationRequest({
            topic,
            articleType,
            primaryKeyword,
            secondaryKeywords,
            status: "processing",
        });
        yield genRequest.save();
        // Trigger content generation
        const content = yield (0, contentGenerator_js_1.generateSEOContent)({
            topic,
            articleType,
            primaryKeyword,
            secondaryKeywords,
        });
        // Create article from generated content
        const article = new Article_js_1.Article(Object.assign(Object.assign({}, content), { topic }));
        yield article.save();
        // Update generation request
        genRequest.status = "completed";
        genRequest.prompt1Response = content.content;
        yield genRequest.save();
        res.status(201).json({
            article,
            generationRequest: genRequest,
        });
    }
    catch (error) {
        console.error("Error generating article:", error);
        res.status(500).json({ error: "Failed to generate article" });
    }
}));
// Get generation status
router.get("/status/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genRequest = yield GenerationRequest_js_1.GenerationRequest.findById(req.params.id);
        if (!genRequest) {
            return res.status(404).json({ error: "Generation request not found" });
        }
        res.json(genRequest);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch status" });
    }
}));
// Get generation history
router.get("/history", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield GenerationRequest_js_1.GenerationRequest.find().sort({ createdAt: -1 }).limit(50);
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
}));
exports.default = router;
//# sourceMappingURL=generation.js.map