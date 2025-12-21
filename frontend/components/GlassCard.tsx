import React from "react";


type GlassCardProps = {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function GlassCard({
  title,
  right,
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/15",
        "bg-white/10 backdrop-blur-xl",
        "shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
        className,
      ].join(" ")}
    >
      {(title || right) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="text-base font-semibold text-white">{title}</div>
          {right}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
