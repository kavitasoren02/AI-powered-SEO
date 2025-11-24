interface ContentGenerationRequest {
    topic: string;
    articleType: "pillar" | "supporting";
    primaryKeyword: string;
    secondaryKeywords: string[];
}
interface GeneratedContent {
    title: string;
    slug: string;
    content: string;
    metaDescription: string;
    keywords: string[];
    wordCount: number;
    readabilityScore: number;
    seoScore: number;
    jsonLdSchema: object;
    faqs: Array<{
        question: string;
        answer: string;
    }>;
    ctas: Array<{
        text: string;
        type: "soft" | "direct";
    }>;
}
export declare function generateSEOContent(req: ContentGenerationRequest): Promise<GeneratedContent>;
export {};
//# sourceMappingURL=contentGenerator.d.ts.map