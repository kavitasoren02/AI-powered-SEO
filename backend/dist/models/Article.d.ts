import mongoose, { type Document } from "mongoose";
interface IArticle extends Document {
    title: string;
    slug: string;
    content: string;
    metaDescription: string;
    keywords: string[];
    wordCount: number;
    readabilityScore: number;
    jsonLdSchema: object;
    faqs: Array<{
        question: string;
        answer: string;
    }>;
    ctas: Array<{
        text: string;
        type: "soft" | "direct";
    }>;
    topic: string;
    createdAt: Date;
    updatedAt: Date;
    status: "draft" | "published" | "archived";
}
export declare const Article: mongoose.Model<IArticle, {}, {}, {}, mongoose.Document<unknown, {}, IArticle, {}, mongoose.DefaultSchemaOptions> & IArticle & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IArticle>;
export {};
//# sourceMappingURL=Article.d.ts.map