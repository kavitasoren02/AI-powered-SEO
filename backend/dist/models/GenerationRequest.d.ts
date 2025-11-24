import mongoose, { type Document } from "mongoose";
interface IGenerationRequest extends Document {
    topic: string;
    articleType: "pillar" | "supporting";
    primaryKeyword: string;
    secondaryKeywords: string[];
    prompt1Response?: string;
    prompt2Response?: string;
    status: "pending" | "processing" | "completed" | "failed";
    error?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const GenerationRequest: mongoose.Model<IGenerationRequest, {}, {}, {}, mongoose.Document<unknown, {}, IGenerationRequest, {}, mongoose.DefaultSchemaOptions> & IGenerationRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IGenerationRequest>;
export {};
//# sourceMappingURL=GenerationRequest.d.ts.map