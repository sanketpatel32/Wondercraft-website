import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubmission extends Document {
  formId: mongoose.Types.ObjectId;
  submittedBy?: mongoose.Types.ObjectId;
  answers: Map<string, any>;
  token: string;
  status: "pending" | "in-progress" | "completed" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema: Schema<ISubmission> = new Schema(
  {
    formId: { type: Schema.Types.ObjectId, ref: "Form", required: true },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User" },
    answers: { type: Map, of: Schema.Types.Mixed, required: true },
    token: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Submission: Model<ISubmission> =
  mongoose.models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema);
export default Submission;
