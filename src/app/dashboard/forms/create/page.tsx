"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/PageWrapper";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Settings, 
  Save, 
  Type,
  AlignLeft,
  Hash,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  CircleDot,
  CheckSquare,
  FileUp,
  FileCode,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionConfig {
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
  options: string[];
  newOptionText?: string;
}

const questionTypes = [
  { value: "shortText", label: "Short Text" },
  { value: "longText", label: "Paragraph Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email Address" },
  { value: "phone", label: "Phone Number" },
  { value: "date", label: "Date Picker" },
  { value: "dropdown", label: "Dropdown Select" },
  { value: "radio", label: "Single Choice (Radio)" },
  { value: "checkbox", label: "Multiple Choice (Checkbox)" },
  { value: "file", label: "File Upload" },
];

export default function CreateFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionConfig[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = () => {
    const newQ: QuestionConfig = {
      id: Math.random().toString(36).substring(2, 9),
      label: "",
      type: "shortText",
      required: false,
      options: [],
      newOptionText: "",
    };
    setQuestions([...questions, newQ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, fields: Partial<QuestionConfig>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...fields } : q))
    );
  };

  const addOption = (qId: string) => {
    const q = questions.find((q) => q.id === qId);
    if (!q || !q.newOptionText?.trim()) return;

    // Prevent duplicate options
    if (q.options.includes(q.newOptionText.trim())) {
      updateQuestion(qId, { newOptionText: "" });
      return;
    }

    updateQuestion(qId, {
      options: [...q.options, q.newOptionText.trim()],
      newOptionText: "",
    });
  };

  const removeOption = (qId: string, optionIndex: number) => {
    const q = questions.find((q) => q.id === qId);
    if (!q) return;

    updateQuestion(qId, {
      options: q.options.filter((_, idx) => idx !== optionIndex),
    });
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === questions.length - 1) return;

    const newQList = [...questions];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const temp = newQList[index];
    newQList[index] = newQList[targetIdx];
    newQList[targetIdx] = temp;
    setQuestions(newQList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please specify a form title.");
      return;
    }

    if (questions.length === 0) {
      setError("Please add at least one question.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].label.trim()) {
        setError(`Field #${i + 1} is missing a label.`);
        return;
      }
      if (
        ["dropdown", "radio", "checkbox"].includes(questions[i].type) &&
        questions[i].options.length === 0
      ) {
        setError(
          `Field #${i + 1} ("${questions[i].label}") requires at least one option.`
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          questions: questions.map(({ id, label, type, required, options }) => ({
            id,
            label: label.trim(),
            type,
            required,
            options,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create form");

      router.push("/dashboard/forms");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "shortText": return <Type className="w-3.5 h-3.5 text-cyan-400" />;
      case "longText": return <AlignLeft className="w-3.5 h-3.5 text-cyan-400" />;
      case "number": return <Hash className="w-3.5 h-3.5 text-cyan-400" />;
      case "email": return <Mail className="w-3.5 h-3.5 text-cyan-400" />;
      case "phone": return <Phone className="w-3.5 h-3.5 text-cyan-400" />;
      case "date": return <Calendar className="w-3.5 h-3.5 text-cyan-400" />;
      case "dropdown": return <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />;
      case "radio": return <CircleDot className="w-3.5 h-3.5 text-cyan-400" />;
      case "checkbox": return <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />;
      case "file": return <FileUp className="w-3.5 h-3.5 text-cyan-400" />;
      default: return <FileCode className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col space-y-6 w-full h-full">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <DashboardHeader
            title="Dynamic Form Builder"
            subtitle="Build templates for server configuration checklist collection."
          />
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* 2-Column Responsive Builder Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1 min-h-0">
          
          {/* Left Column: Form Settings & Status Panel */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-full min-h-0">
            
            {/* Specs Card — grows to match canvas area height */}
            <Card className="bg-zinc-900/60 border border-zinc-800/80 flex-1 flex flex-col min-h-0">
              <CardHeader className="pb-2 flex-shrink-0">
                <CardTitle className="text-sm font-extrabold text-white uppercase tracking-wider">Form Specs</CardTitle>
                <CardDescription>Configure primary headers and instructions for respondents.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2 flex-1 flex flex-col min-h-0">
                <Input
                  label="Form Title"
                  placeholder="e.g. Server Deployment Checklist"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-zinc-950 border-zinc-800 focus:border-cyan-500/80"
                />
                <div className="flex-1 flex flex-col min-h-0 [&>div]:flex-1 [&>div]:flex [&>div]:flex-col [&>div]:min-h-0">
                  <Textarea
                    label="Description & Instructions"
                    placeholder="e.g. Use this form to register server parameters..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 focus:border-cyan-500/80 flex-1 min-h-[120px] h-full resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Canvas Metrics & Actions Card */}
            <Card className="bg-zinc-900/60 border border-zinc-800/80 flex-shrink-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  Metrics Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium">Total Configured Fields</span>
                    <Badge variant="cyan" className="font-mono">{questions.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium">Required Fields</span>
                    <Badge variant="yellow" className="font-mono">
                      {questions.filter(q => q.required).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium">Choice-based Fields</span>
                    <Badge variant="purple" className="font-mono">
                      {questions.filter(q => ["dropdown", "radio", "checkbox"].includes(q.type)).length}
                    </Badge>
                  </div>
                </div>

                {/* Balanced Save & Cancel buttons side-by-side on the same line */}
                <div className="border-t border-zinc-800/80 pt-4 flex gap-3">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={isSubmitting} 
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider cursor-pointer h-10"
                  >
                    <Save className="w-3.5 h-3.5 text-zinc-950" />
                    Save Form
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push("/dashboard/forms")}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider cursor-pointer bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 h-10"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Fields Canvas */}
          <div className="lg:col-span-2 space-y-4 flex flex-col h-full min-h-0">
            
            {/* Canvas Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-shrink-0">
              <div>
                <h3 className="text-sm font-black text-white tracking-widest uppercase flex items-center gap-2">
                  Canvas Fields
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                    {questions.length}
                  </span>
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
                className="flex items-center gap-1.5 py-2 px-3.5 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 cursor-pointer rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Canvas Field
              </Button>
            </div>

            {/* Scrollable list container - Only canvas fields scroll when added */}
            {questions.length > 0 ? (
              <div className="lg:overflow-y-auto pr-1.5 space-y-4 max-h-none lg:max-h-[calc(100vh-225px)] flex-1 min-h-0">
                <motion.div layout className="space-y-4 pb-4">
                  <AnimatePresence initial={false}>
                    {questions.map((q, index) => {
                      const isChoiceField = ["dropdown", "radio", "checkbox"].includes(q.type);
                      return (
                        <motion.div
                          key={q.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="!p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl relative overflow-hidden transition-all duration-200 hover:border-zinc-800">
                            {/* Top header row containing field details in a single horizontal line */}
                            <div className="flex items-center justify-between border-b border-zinc-950 pb-3 mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-cyan-400 shadow-inner flex items-center justify-center">
                                  {getQuestionTypeIcon(q.type)}
                                </div>
                                <span className="text-[11px] uppercase font-black tracking-widest text-zinc-400">
                                  Field #{String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                                  {questionTypes.find(t => t.value === q.type)?.label || q.type}
                                </span>
                              </div>
                              
                              {/* Horizontal aligned minimal action toolbar */}
                              <div className="flex items-center gap-1.5 bg-zinc-950/80 border border-zinc-800/80 p-1 rounded-lg">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => moveQuestion(index, "up")}
                                  className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-500 hover:text-cyan-400 disabled:opacity-25 disabled:hover:text-zinc-500 disabled:hover:bg-transparent transition-colors cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={index === questions.length - 1}
                                  onClick={() => moveQuestion(index, "down")}
                                  className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-500 hover:text-cyan-400 disabled:opacity-25 disabled:hover:text-zinc-500 disabled:hover:bg-transparent transition-colors cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <div className="w-[1px] h-4 bg-zinc-800" />
                                <button
                                  type="button"
                                  onClick={() => removeQuestion(q.id)}
                                  className="p-1.5 rounded-md hover:bg-rose-500/10 text-zinc-500 hover:text-rose-455 transition-colors cursor-pointer"
                                  title="Delete Field"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <CardContent className="space-y-4">
                              {/* Field Label Input - Spans Full Width */}
                              <Input
                                label="Field Label / Question"
                                placeholder="e.g. Target Operating System..."
                                value={q.label}
                                onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                                required
                                className="bg-zinc-950 border-zinc-800 focus:border-cyan-500/85"
                              />

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Response Type Selector */}
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Response Type
                                  </label>
                                  <div className="relative">
                                    <select
                                      value={q.type}
                                      onChange={(e) =>
                                        updateQuestion(q.id, {
                                          type: e.target.value as any,
                                          options: ["dropdown", "radio", "checkbox"].includes(e.target.value)
                                            ? q.options.length === 0
                                              ? ["Option 1"]
                                              : q.options
                                            : [],
                                        })
                                      }
                                      className="w-full appearance-none pr-10 pl-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 rounded-lg text-sm text-zinc-300 outline-none cursor-pointer hover:bg-zinc-950/60 transition-colors font-bold uppercase text-xs tracking-wider h-[42px]"
                                    >
                                      {questionTypes.map((t) => (
                                        <option key={t.value} value={t.value} className="bg-zinc-950 text-zinc-300 font-sans normal-case">
                                          {t.label}
                                        </option>
                                      ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-zinc-500">
                                      <ChevronDown className="w-4 h-4 text-cyan-400/80" />
                                    </div>
                                  </div>
                                </div>

                                {/* Required Toggle - Custom slide-toggle switch */}
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Validation Rule
                                  </span>
                                  <div 
                                    onClick={() => updateQuestion(q.id, { required: !q.required })}
                                    className="flex items-center justify-between select-none cursor-pointer h-[42px] border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-950/90 rounded-lg px-4 hover:border-zinc-700/80 transition-all duration-200"
                                  >
                                    <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                                      Enforce Required Check
                                    </span>
                                    <div 
                                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                                        q.required ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" : "bg-zinc-800"
                                      }`}
                                    >
                                      <div 
                                        className={`w-4 h-4 rounded-full bg-zinc-950 transition-transform duration-200 ease-in-out ${
                                          q.required ? "transform translate-x-4 bg-zinc-950" : "bg-zinc-400"
                                        }`}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Options editor */}
                              {isChoiceField && (
                                <div className="bg-zinc-950/60 p-4 border border-zinc-800/80 rounded-xl space-y-4">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                                    <Settings className="w-3.5 h-3.5 text-cyan-400" />
                                    Configure Options
                                  </label>

                                  {q.options.length === 0 ? (
                                    <p className="text-xs text-zinc-500 italic">No options configured yet.</p>
                                  ) : (
                                    <div className="flex flex-wrap gap-2">
                                      {q.options.map((opt, optIdx) => (
                                        <Badge key={optIdx} variant="cyan" className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 rounded-lg">
                                          {opt}
                                          <button
                                            type="button"
                                            onClick={() => removeOption(q.id, optIdx)}
                                            className="hover:text-rose-450 ml-1 transition-colors cursor-pointer text-sm leading-none font-bold"
                                          >
                                            &times;
                                          </button>
                                        </Badge>
                                      ))}
                                    </div>
                                  )}

                                  {/* Perfectly aligned option input and button having exact height */}
                                  <div className="flex gap-2 max-w-sm items-center">
                                    <input
                                      type="text"
                                      placeholder="Add option..."
                                      value={q.newOptionText || ""}
                                      onChange={(e) => updateQuestion(q.id, { newOptionText: e.target.value })}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          addOption(q.id);
                                        }
                                      }}
                                      className="h-9 px-3.5 bg-zinc-950 border border-zinc-800 focus:border-cyan-500/80 rounded-lg text-xs text-zinc-200 outline-none flex-1 placeholder-zinc-600 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                                    />
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => addOption(q.id)}
                                      className="h-9 px-4 text-xs cursor-pointer rounded-lg font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 flex items-center justify-center"
                                    >
                                      Add
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10 flex flex-col items-center justify-center space-y-4 flex-1 min-h-0">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-500">
                  <Settings className="w-8 h-8 text-zinc-600 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-400 text-sm font-semibold">No fields configured</p>
                  <p className="text-zinc-500 text-xs max-w-xs mx-auto">Create dynamic checklist items. Press "Add Canvas Field" to define data collection elements.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addQuestion}
                  className="flex items-center gap-1.5 py-2 px-3.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 cursor-pointer rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add First Field
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
