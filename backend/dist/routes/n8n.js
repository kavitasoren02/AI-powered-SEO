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
const n8nService_js_1 = require("../services/n8nService.js");
const GenerationRequest_js_1 = require("../models/GenerationRequest.js");
const Article_js_1 = require("../models/Article.js");
const router = express_1.default.Router();
// Trigger n8n workflow
router.post("/trigger", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Trigger n8n workflow
        const executionId = yield n8nService_js_1.N8nService.triggerWorkflow({
            topic,
            articleType,
            primaryKeyword,
            secondaryKeywords,
            webhookId: genRequest._id.toString(),
        });
        res.json({
            message: "Workflow triggered successfully",
            generationRequestId: genRequest._id,
            executionId,
        });
    }
    catch (error) {
        console.error("Error triggering workflow:", error);
        res.status(500).json({ error: "Failed to trigger workflow" });
    }
}));
// Webhook endpoint for n8n to post results back
router.post("/webhook/result", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { webhookId, content, metadata } = req.body;
        // Find generation request
        const genRequest = yield GenerationRequest_js_1.GenerationRequest.findByIdAndUpdate(webhookId, {
            status: "completed",
            prompt1Response: content,
        }, { new: true });
        if (!genRequest) {
            return res.status(404).json({ error: "Generation request not found" });
        }
        // Create article from generated content
        const article = new Article_js_1.Article({
            title: metadata.title,
            slug: metadata.slug,
            content,
            metaDescription: metadata.metaDescription,
            keywords: metadata.keywords,
            wordCount: metadata.wordCount,
            readabilityScore: metadata.readabilityScore,
            jsonLdSchema: metadata.jsonLdSchema,
            faqs: metadata.faqs,
            ctas: metadata.ctas,
            topic: genRequest.topic,
            status: "draft",
        });
        yield article.save();
        console.log("[n8n] Article created from workflow result:", article._id);
        res.json({ message: "Result processed successfully", articleId: article._id });
    }
    catch (error) {
        console.error("[n8n] Error processing webhook result:", error);
        res.status(500).json({ error: "Failed to process result" });
    }
}));
// Get workflow status
router.get("/status/:executionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const status = yield n8nService_js_1.N8nService.getExecutionStatus((_a = req.params.executionId) !== null && _a !== void 0 ? _a : "");
        res.json(status);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get status" });
    }
}));
// List n8n workflows
router.get("/workflows", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workflows = yield n8nService_js_1.N8nService.listWorkflows();
        res.json(workflows);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to list workflows" });
    }
}));
// Get workflow details
router.get("/workflows/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const workflow = yield n8nService_js_1.N8nService.getWorkflow((_a = req.params.id) !== null && _a !== void 0 ? _a : "");
        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found" });
        }
        res.json(workflow);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get workflow details" });
    }
}));
exports.default = router;
//# sourceMappingURL=n8n.js.map