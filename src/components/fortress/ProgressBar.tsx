import React from "react";

type ProgressBarProps = {
  percent: number;
  className?: string;
};

export default function ProgressBar({ percent, className = "" }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden ${className}`}>
      <div
        style={{ width: `${clamped}%` }}
        className="h-full bg-emerald-500 transition-all"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
