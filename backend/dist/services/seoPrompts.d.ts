/**
 * SEO Content Generation Prompts
 * Two-prompt system for medical-grade SEO and AI citability optimization
 */
export interface PromptContext {
    topic: string;
    articleType: "pillar" | "supporting";
    primaryKeyword: string;
    secondaryKeywords: string[];
}
/**
 * PROMPT 1: Medical-Grade SEO Article Generation
 * Generates structured, scannable content optimized for search engines
 */
export declare function buildMedicalSEOPrompt(ctx: PromptContext): string;
/**
 * PROMPT 2: GEO (Generative Engine Optimization) for AI Citability
 * Optimizes content for AI answer engines (ChatGPT, Claude, Perplexity)
 */
export declare function buildGEOOptimizationPrompt(ctx: PromptContext, originalContent: string): string;
/**
 * Build URL slug from title
 */
export declare function generateSlug(title: string): string;
/**
 * Generate meta description
 */
export declare function generateMetaDescription(content: string, primaryKeyword: string): string;
/**
 * Calculate SEO readability score
 */
export declare function calculateSEOScore(content: string): number;
/**
 * Generate JSON-LD schema for article
 */
export declare function generateJsonLdSchema(article: {
    title: string;
    description: string;
    content: string;
    keywords: string[];
}): object;
//# sourceMappingURL=seoPrompts.d.ts.map