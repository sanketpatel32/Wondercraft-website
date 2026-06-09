import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "cyan" | "green" | "red" | "yellow" | "purple" | "zinc";
}

export function Badge({ children, variant = "zinc", className = "", ...props }: BadgeProps) {
  const baseStyle =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider border transition-all duration-200";
  
  const variants = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.1)]",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    red: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    yellow: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    purple: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    zinc: "bg-zinc-850 text-zinc-400 border-zinc-700",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
