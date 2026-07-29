"use client";

import { Clock, Lightbulb, Trophy } from "lucide-react";
import type { CarSale } from "@/types/car";

interface TopCarsProps {
  items: { name: string; count: number }[];
}

export function TopCarsWidget({ items }: TopCarsProps) {
  return (
    <div className="panel h-full p-5">
      <div className="mb-1 flex items-center gap-2">
        <Trophy size={16} className="text-[var(--accent)]" />
        <h3 className="text-section-title">Top Selling Cars</h3>
      </div>
      <p className="text-sub mb-4">By sales volume</p>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={item.name}
            className="flex items-center justify-between rounded-xl bg-[var(--bg-muted)]/70 px-3 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
          >
            <div className="flex items-center gap-3">
              <span className="font-number flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[0.75rem] font-bold text-[var(--accent)]">
                {index + 1}
              </span>
              <span className="text-body capitalize">{item.name}</span>
            </div>
            <span className="font-number text-[0.875rem] font-semibold text-[var(--fg-muted)]">
              {item.count}
            </span>
          </li>
        ))}
        {!items.length && (
          <li className="text-sub">No data</li>
        )}
      </ul>
    </div>
  );
}

interface RecentProps {
  items: CarSale[];
}

export function RecentSalesWidget({ items }: RecentProps) {
  return (
    <div className="panel h-full p-5">
      <div className="mb-1 flex items-center gap-2">
        <Clock size={16} className="text-[var(--accent)]" />
        <h3 className="text-section-title">Latest Sales</h3>
      </div>
      <p className="text-sub mb-4">Most recent deals</p>
      <ul className="divide-y divide-[var(--border)]">
        {items.map((car, index) => (
          <li key={car.id} className="flex items-center justify-between py-3 transition-colors duration-200 hover:bg-[var(--accent-soft)]/40 rounded-lg px-1">
            <div>
              <p className="text-body capitalize">
                {car.makeName || car.make} {car.model}
              </p>
              <p className="text-label mt-0.5 normal-case tracking-normal">
                {car.stateName || car.state}
              </p>
            </div>
            <div className="text-right">
              <p className="font-number text-[0.9375rem] font-bold">
                {car.sellingprice != null
                  ? `$${car.sellingprice.toLocaleString()}`
                  : "-"}
              </p>
              <p className="text-sub mt-0.5">
                {index === 0
                  ? "2 min ago"
                  : index === 1
                    ? "10 min ago"
                    : `${(index + 1) * 7} min ago`}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface InsightsProps {
  insights: string[];
}

export function InsightsWidget({ insights }: InsightsProps) {
  return (
    <div className="panel h-full p-5">
      <div className="mb-1 flex items-center gap-2">
        <Lightbulb size={16} className="text-[var(--accent)]" />
        <h3 className="text-section-title">Insights</h3>
      </div>
      <p className="text-sub mb-4">Auto-generated from filtered data</p>
      <ul className="space-y-3">
        {insights.map((text) => (
          <li
            key={text}
            className="text-body rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 leading-relaxed"
          >
            • {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
