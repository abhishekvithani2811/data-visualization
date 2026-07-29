"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export default function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div ref={ref} className="relative min-w-[140px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "filter-control font-ui flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border bg-[var(--bg-elevated)] px-3 py-2.5 text-[0.875rem] font-medium",
          open
            ? "border-[var(--accent)] shadow-[0_6px_14px_rgba(13,148,136,0.12)]"
            : "border-[var(--border)]",
        ].join(" ")}
      >
        <span>
          {label}
          {selected.length > 0 ? ` (${selected.length})` : ""}
        </span>
        <ChevronDown
          size={14}
          className={[
            "text-[var(--fg-muted)] transition-transform duration-200",
            open ? "rotate-180 text-[var(--accent)]" : "",
          ].join(" ")}
        />
      </button>
      {open && (
        <div className="dropdown-pop absolute z-30 mt-2 max-h-56 w-56 overflow-auto rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 shadow-lg">
          {options.map((option) => {
            const checked = selected.includes(option);
            return (
              <label
                key={option}
                className={[
                  "multi-option font-ui flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[0.875rem]",
                  checked ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "",
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(option)}
                  className="cursor-pointer accent-[var(--accent)]"
                />
                <span className="capitalize">{option}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
