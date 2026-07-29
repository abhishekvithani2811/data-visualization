"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  format?: "number" | "currency" | "compact";
  trend?: string;
  trendUp?: boolean;
}

function formatValue(value: number, format: KpiCardProps["format"]) {
  if (format === "currency") {
    return `$${Math.round(value).toLocaleString()}`;
  }
  return Math.round(value).toLocaleString();
}

function MotionNumber({
  motionValue,
  format,
}: {
  motionValue: MotionValue<number>;
  format: KpiCardProps["format"];
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(motionValue.get(), format);
    }
    return motionValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest, format);
      }
    });
  }, [motionValue, format]);

  return <span ref={ref}>{formatValue(0, format)}</span>;
}

export default function KpiCard({
  icon: Icon,
  label,
  value,
  format = "number",
  trend = "+5%",
  trendUp = true,
}: KpiCardProps) {
  const motionValue = useMotionValue(0);
  const started = useRef(false);

  useEffect(() => {
    const from = started.current ? motionValue.get() : 0;
    started.current = true;
    const controls = animate(from, value, {
      duration: 0.45,
      ease: "easeOut",
      onUpdate: (latest) => motionValue.set(latest),
    });
    return controls.stop;
  }, [value, motionValue]);

  return (
    <div className="panel panel-lift group relative p-5">
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] transition-transform duration-200 group-hover:scale-110">
          <Icon size={20} strokeWidth={2} />
        </div>
        <span className="font-number inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2.5 py-1.5 text-[0.75rem] font-bold text-[var(--accent)] transition-transform duration-200 group-hover:scale-105">
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </span>
      </div>
      <p className="text-kpi-label mt-4">{label}</p>
      <p className="text-kpi-value mt-1 text-[var(--fg)]">
        <MotionNumber motionValue={motionValue} format={format} />
      </p>
    </div>
  );
}
