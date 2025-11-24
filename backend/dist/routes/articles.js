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
const Article_js_1 = require("../models/Article.js");
const router = express_1.default.Router();
// Get all articles
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield Article_js_1.Article.find();
        res.json({ articles });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch articles" });
    }
}));
// Get article by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield Article_js_1.Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        res.json(article);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch article" });
    }
}));
// Create article
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = new Article_js_1.Article(req.body);
        yield article.save();
        res.status(201).json(article);
    }
    catch (error) {
        res.status(400).json({ error: "Failed to create article" });
    }
}));
// Update article
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield Article_js_1.Article.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(article);
    }
    catch (error) {
        res.status(400).json({ error: "Failed to update article" });
    }
}));
// Delete article
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Article_js_1.Article.findByIdAndDelete(req.params.id);
        res.json({ message: "Article deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ error: "Failed to delete article" });
    }
}));
exports.default = router;
//# sourceMappingURL=articles.js.map