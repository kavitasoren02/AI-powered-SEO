/**
 * SEO Content Generation Prompts
 * Two-prompt system for medical-grade SEO and AI citability optimization
 */

export interface PromptContext {
  topic: string
  articleType: "pillar" | "supporting"
  primaryKeyword: string
  secondaryKeywords: string[]
}

/**
 * PROMPT 1: Medical-Grade SEO Article Generation
 * Generates structured, scannable content optimized for search engines
 */
export function buildMedicalSEOPrompt(ctx: PromptContext): string {
  const wordCount = ctx.articleType === "pillar" ? "2500-3000" : "1000-1500"

  return `You are an expert medical content writer specializing in gut health and gastroenterology. 
Generate a comprehensive, evidence-based article about "${ctx.topic}" optimized for search engines.

ARTICLE SPECIFICATIONS:
- Target word count: ${wordCount} words
- Primary keyword: "${ctx.primaryKeyword}"
- Secondary keywords: ${ctx.secondaryKeywords.join(", ")}
- Keyword density: 0.8-1.2% for primary keyword
- Readability: Grade 7-9 level (Flesch Reading Ease 60-80)

STRUCTURE REQUIREMENTS:
1. H1 Title (include primary keyword naturally)
2. Meta description (150-160 characters, include primary keyword)
3. Introduction (100-150 words, include primary keyword in first 100 words)
4. Multiple H2 sections with H3 subsections
5. Include tables comparing diet options or probiotics
6. Include bullet point lists for easy scanning
7. "When to see a doctor" section with medical guidelines
8. FAQ section with 5-8 question-answer pairs

E-E-A-T REQUIREMENTS (Experience, Expertise, Authoritativeness, Trustworthiness):
- Include citations from: NIH, NHS, CDC, Mayo Clinic, peer-reviewed journals
- Add medical disclaimers: "Consult with a healthcare provider before..."
- Quote medical professionals where relevant
- Include recent scientific studies (published within last 5 years)
- Add "Medical review" statement

CONTENT OPTIMIZATION:
- Natural keyword distribution throughout
- Question-led headings for featured snippet optimization
- Include long-tail keyword variations
- Create snippet-ready answers (40-60 words per key answer)
- Include statistics and data points
- Use transition words for better flow

CALL-TO-ACTIONS (generate 2 variants):
1. Soft CTA: Educational tone, value-first approach
   Example: "Learn how Healthy Gut AI helps you personalize your gut health journey"
2. Direct CTA: Action-oriented, conversion-focused
   Example: "Start your personalized health assessment with Healthy Gut AI today"

OUTPUT FORMAT (JSON):
{
  "title": "H1 Title with primary keyword",
  "slug": "url-slug-format",
  "metaDescription": "150-160 character meta description",
  "content": "Full article content with HTML structure",
  "keywords": ["primary keyword", "secondary1", "secondary2"],
  "faqs": [
    {
      "question": "What is...?",
      "answer": "Concise answer (snippet-ready)"
    }
  ],
  "ctas": [
    {
      "text": "Soft CTA text",
      "type": "soft"
    },
    {
      "text": "Direct CTA text", 
      "type": "direct"
    }
  ],
  "medicalDisclaimer": "Standard medical disclaimer",
  "citations": ["Citation 1", "Citation 2"],
  "statistics": ["Stat 1", "Stat 2"]
}

Generate the article now:`
}

/**
 * PROMPT 2: GEO (Generative Engine Optimization) for AI Citability
 * Optimizes content for AI answer engines (ChatGPT, Claude, Perplexity)
 */
export function buildGEOOptimizationPrompt(ctx: PromptContext, originalContent: string): string {
  return `You are an expert in GEO (Generative Engine Optimization) for AI answer engines.
Optimize this article about "${ctx.topic}" for maximum citability by AI systems.

ORIGINAL ARTICLE:
${originalContent}

GEO OPTIMIZATION REQUIREMENTS:

1. QUESTION-LED HEADINGS
   - Rewrite section headers as questions users ask
   - Examples: "How does probiotics improve gut health?" instead of "Probiotics Benefits"
   - Include variations of the primary keyword in questions

2. SNIPPET-READY ANSWERS
   - Create 40-60 word direct answers under each question
   - Make answers standalone and independently citeable
   - Include key facts that AI systems extract for answers
   - Format: Problem → Solution → Benefit

3. STRUCTURED DATA & TABLES
   - Convert lists into comparison tables where appropriate
   - Create data tables for: Probiotic strains vs benefits, Foods vs fiber content
   - Include visual separators for easy machine parsing

4. AI-CITEABLE SECTIONS
   - Create "Key Takeaways" section (3-5 bullet points)
   - Add "Quick Facts" box with concise information
   - Include "Expert Consensus" section with quoted research

5. NATURAL CTA INTEGRATION
   - Weave "Healthy Gut AI" into relevant sections
   - Position as complement to information, not promotion
   - Examples of integration points:
     * "While diet is primary, tools like Healthy Gut AI help track patterns"
     * "Healthy Gut AI can personalize recommendations based on your microbiome"

6. SEMANTIC CLARITY
   - Use clear entity definitions (e.g., "Probiotics are living beneficial bacteria")
   - Add context for technical terms
   - Link related concepts explicitly

7. FACT VERIFICATION FORMAT
   - Add "Verified by" sections with sources
   - Include confidence levels for claims
   - Add publication dates for studies

OUTPUT FORMAT (JSON):
{
  "optimizedContent": "GEO-optimized full article",
  "keyTakeaways": [
    "Key point 1",
    "Key point 2",
    "Key point 3"
  ],
  "quotableSnippets": [
    "40-60 word snippet that AI systems can cite directly",
    "Another key quotable passage"
  ],
  "entityDefinitions": {
    "Probiotics": "Definition and importance",
    "Microbiome": "Definition and importance"
  },
  "comparisonTables": [
    {
      "title": "Probiotic Strains Comparison",
      "rows": [
        {"strain": "Lactobacillus acidophilus", "benefit": "Digestive health"}
      ]
    }
  ],
  "ctaPlacement": [
    {
      "section": "Section title",
      "context": "How Healthy Gut AI helps here",
      "suggestion": "Natural CTA suggestion"
    }
  ],
  "aoiScores": {
    "citability": 0.9,
    "clarity": 0.85,
    "completeness": 0.88
  }
}

Optimize the article now:`
}

/**
 * Build URL slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50)
}

/**
 * Generate meta description
 */
export function generateMetaDescription(content: string, primaryKeyword: string): string {
  // Extract first 160 characters that include the primary keyword
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)

  let description = ""
  for (const sentence of sentences) {
    if (description.length > 160) break
    description += sentence.trim() + ". "
  }

  // Ensure it includes primary keyword
  if (!description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    description = `Discover everything about ${primaryKeyword}. ` + description.substring(0, 120)
  }

  return description.substring(0, 160).trim()
}

/**
 * Calculate SEO readability score
 */
export function calculateSEOScore(content: string): number {
  const sentences = content.split(/[.!?]+/).length
  const words = content.split(/\s+/).length
  const paragraphs = content.split(/\n\n+/).length

  // Flesch Reading Ease formula
  const asl = words / sentences // Average sentence length
  const sylCount = estimateSyllables(content) / words // Average syllables per word

  let score = 206.835 - 1.015 * asl - 84.6 * sylCount
  score = Math.max(0, Math.min(100, score))

  return Math.round(score)
}

/**
 * Estimate syllable count
 */
function estimateSyllables(text: string): number {
  let count = 0
  const words = text.split(/\s+/)

  words.forEach((word) => {
    word = word.toLowerCase().replace(/[^a-z]/g, "")
    if (word.length <= 3) count++
    else count += (word.match(/[aeiou]/g) || []).length
  })

  return count
}

/**
 * Generate JSON-LD schema for article
 */
export function generateJsonLdSchema(article: {
  title: string
  description: string
  content: string
  keywords: string[]
}): object {
  const now = new Date().toISOString()

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: now,
    dateModified: now,
    author: {
      "@type": "Organization",
      name: "Healthy Gut AI",
      url: "https://healthygutai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://healthygutai.com/logo.png",
        width: 250,
        height: 250,
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Healthy Gut AI",
      logo: {
        "@type": "ImageObject",
        url: "https://healthygutai.com/logo.png",
        width: 600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://healthygutai.com/articles/${article.title.toLowerCase().replace(/\s+/g, "-")}`,
    },
    keywords: article.keywords.join(", "),
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "Healthy Gut AI",
      url: "https://healthygutai.com",
    },
  }
}
