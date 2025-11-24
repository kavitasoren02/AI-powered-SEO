interface N8nTriggerPayload {
    topic: string;
    articleType: "pillar" | "supporting";
    primaryKeyword: string;
    secondaryKeywords: string[];
    webhookId: string;
}
interface N8nWorkflowStatus {
    status: "active" | "inactive" | "error";
    executionId?: string;
    result?: any;
}
export declare class N8nService {
    /**
     * Trigger n8n workflow for content generation
     */
    static triggerWorkflow(payload: N8nTriggerPayload): Promise<string>;
    /**
     * Get workflow execution status
     */
    static getExecutionStatus(executionId: string): Promise<N8nWorkflowStatus>;
    /**
     * Get workflow list
     */
    static listWorkflows(): Promise<any[]>;
    /**
     * Get workflow details
     */
    static getWorkflow(workflowId: string): Promise<any>;
}
export default N8nService;
//# sourceMappingURL=n8nService.d.ts.map