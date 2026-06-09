import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestion {
  id: string;
  label: string;
  type:
    | "shortText"
    | "longText"
    | "number"
    | "email"
    | "phone"
    | "date"
    | "dropdown"
    | "radio"
    | "checkbox"
    | "file";
  required: boolean;
  options?: string[];
}

export interface IForm extends Document {
  title: string;
  description?: string;
  questions: IQuestion[];
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "shortText",
      "longText",
      "number",
      "email",
      "phone",
      "date",
      "dropdown",
      "radio",
      "checkbox",
      "file",
    ],
    required: true,
  },
  required: { type: Boolean, default: false },
  options: { type: [String], default: [] },
});

const FormSchema: Schema<IForm> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    questions: { type: [QuestionSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Form: Model<IForm> = mongoose.models.Form || mongoose.model<IForm>("Form", FormSchema);
export default Form;
