import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3.5 py-2.5 bg-zinc-950/85 border border-zinc-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 transition-all outline-none ${
            error ? "border-red-500/80 focus:border-red-500/80 focus:ring-red-500/30" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full min-h-[100px] px-3.5 py-2.5 bg-zinc-950/85 border border-zinc-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 transition-all outline-none resize-y ${
            error ? "border-red-500/80 focus:border-red-500/80 focus:ring-red-500/30" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
