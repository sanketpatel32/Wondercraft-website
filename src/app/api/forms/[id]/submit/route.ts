import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Form from "@/models/form";
import Submission from "@/models/submission";
import { z } from "zod";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const form = await Form.findById(id);

    if (!form) {
      return NextResponse.json({ error: "Form template not found" }, { status: 404 });
    }

    if (!form.isActive) {
      return NextResponse.json(
        { error: "This form is paused and no longer accepting submissions." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { answers, submittedBy } = body;

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Answers payload is missing" }, { status: 400 });
    }

    const schemaShape: Record<string, z.ZodTypeAny> = {};
    const validationErrors: Record<string, string> = {};

    for (const question of form.questions) {
      const value = answers[question.id];

      if (question.required) {
        if (question.type === "checkbox") {
          if (!Array.isArray(value) || value.length === 0) {
            validationErrors[question.id] = `${question.label} is required (select at least one option).`;
          }
        } else {
          if (value === undefined || value === null || String(value).trim() === "") {
            validationErrors[question.id] = `${question.label} is required.`;
          }
        }
      }

      if (value !== undefined && value !== null && String(value).trim() !== "") {
        if (question.type === "email") {
          const emailCheck = z.string().email().safeParse(value);
          if (!emailCheck.success) {
            validationErrors[question.id] = "Please enter a valid email address.";
          }
        } else if (question.type === "number") {
          const numCheck = z.coerce.number().safeParse(value);
          if (!numCheck.success) {
            validationErrors[question.id] = "Must be a numeric value.";
          }
        }
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json({ error: "Validation failed", errors: validationErrors }, { status: 400 });
    }

    const token = "TKN-" + Math.random().toString(36).substring(2, 10).toUpperCase() + "-" + Date.now().toString().slice(-4);

    const submission = await Submission.create({
      formId: form._id,
      submittedBy: submittedBy || undefined,
      answers,
      token,
      status: "pending",
    });

    return NextResponse.json({
      message: "Submission saved successfully",
      token: submission.token,
      submissionId: submission._id,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
