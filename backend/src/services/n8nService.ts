import axios from "axios"

interface N8nTriggerPayload {
  topic: string
  articleType: "pillar" | "supporting"
  primaryKeyword: string
  secondaryKeywords: string[]
  webhookId: string
}

interface N8nWorkflowStatus {
  status: "active" | "inactive" | "error"
  executionId?: string
  result?: any
}

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/trigger"
const N8N_API_URL = process.env.N8N_API_URL || "http://localhost:5678/api/v1"
const N8N_API_KEY = process.env.N8N_API_KEY

export class N8nService {
  /**
   * Trigger n8n workflow for content generation
   */
  static async triggerWorkflow(payload: N8nTriggerPayload): Promise<string> {
    try {
      const response = await axios.post(N8N_WEBHOOK_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 60000, // 60 second timeout
      })

      console.log("[n8n] Workflow triggered successfully:", response.data)
      return response.data.executionId || response.data.id
    } catch (error) {
      console.error("[n8n] Failed to trigger workflow:", error)
      throw new Error("Failed to trigger n8n workflow")
    }
  }

  /**
   * Get workflow execution status
   */
  static async getExecutionStatus(executionId: string): Promise<N8nWorkflowStatus> {
    try {
      const response = await axios.get(`${N8N_API_URL}/executions/${executionId}`, {
        headers: {
          "X-N8N-API-KEY": N8N_API_KEY,
        },
      })

      return {
        status: response.data.finished ? "active" : "inactive",
        executionId: response.data.id,
        result: response.data.data?.resultData?.runData,
      }
    } catch (error) {
      console.error("[n8n] Failed to get execution status:", error)
      return { status: "error" }
    }
  }

  /**
   * Get workflow list
   */
  static async listWorkflows(): Promise<any[]> {
    try {
      const response = await axios.get(`${N8N_API_URL}/workflows`, {
        headers: {
          "X-N8N-API-KEY": N8N_API_KEY,
        },
      })

      return response.data.data || []
    } catch (error) {
      console.error("[n8n] Failed to list workflows:", error)
      return []
    }
  }

  /**
   * Get workflow details
   */
  static async getWorkflow(workflowId: string): Promise<any> {
    try {
      const response = await axios.get(`${N8N_API_URL}/workflows/${workflowId}`, {
        headers: {
          "X-N8N-API-KEY": N8N_API_KEY,
        },
      })

      return response.data
    } catch (error) {
      console.error("[n8n] Failed to get workflow details:", error)
      return null
    }
  }
}

export default N8nService
