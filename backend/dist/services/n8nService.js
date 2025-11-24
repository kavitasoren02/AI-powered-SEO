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
exports.N8nService = void 0;
const axios_1 = __importDefault(require("axios"));
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/trigger";
const N8N_API_URL = process.env.N8N_API_URL || "http://localhost:5678/api/v1";
const N8N_API_KEY = process.env.N8N_API_KEY;
class N8nService {
    /**
     * Trigger n8n workflow for content generation
     */
    static triggerWorkflow(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(N8N_WEBHOOK_URL, payload, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    timeout: 60000, // 60 second timeout
                });
                console.log("[n8n] Workflow triggered successfully:", response.data);
                return response.data.executionId || response.data.id;
            }
            catch (error) {
                console.error("[n8n] Failed to trigger workflow:", error);
                throw new Error("Failed to trigger n8n workflow");
            }
        });
    }
    /**
     * Get workflow execution status
     */
    static getExecutionStatus(executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield axios_1.default.get(`${N8N_API_URL}/executions/${executionId}`, {
                    headers: {
                        "X-N8N-API-KEY": N8N_API_KEY,
                    },
                });
                return {
                    status: response.data.finished ? "active" : "inactive",
                    executionId: response.data.id,
                    result: (_b = (_a = response.data.data) === null || _a === void 0 ? void 0 : _a.resultData) === null || _b === void 0 ? void 0 : _b.runData,
                };
            }
            catch (error) {
                console.error("[n8n] Failed to get execution status:", error);
                return { status: "error" };
            }
        });
    }
    /**
     * Get workflow list
     */
    static listWorkflows() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${N8N_API_URL}/workflows`, {
                    headers: {
                        "X-N8N-API-KEY": N8N_API_KEY,
                    },
                });
                return response.data.data || [];
            }
            catch (error) {
                console.error("[n8n] Failed to list workflows:", error);
                return [];
            }
        });
    }
    /**
     * Get workflow details
     */
    static getWorkflow(workflowId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${N8N_API_URL}/workflows/${workflowId}`, {
                    headers: {
                        "X-N8N-API-KEY": N8N_API_KEY,
                    },
                });
                return response.data;
            }
            catch (error) {
                console.error("[n8n] Failed to get workflow details:", error);
                return null;
            }
        });
    }
}
exports.N8nService = N8nService;
exports.default = N8nService;
//# sourceMappingURL=n8nService.js.map