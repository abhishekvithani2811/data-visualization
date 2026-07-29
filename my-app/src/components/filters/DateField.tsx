"use client";

import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

interface DateFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  minDate?: Date | null;
  maxDate?: Date | null;
  placeholder?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date: Date | null): string | null {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function CompactSelect({
  value,
  options,
  onChange,
  widthClass = "w-[118px]",
}: {
  value: string | number;
  options: { label: string; value: string | number }[];
  onChange: (value: string | number) => void;
  widthClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const active = listRef.current.querySelector("[data-active='true']");
    if (active instanceof HTMLElement) {
      active.scrollIntoView({ block: "nearest" });
    }
  }, [open]);

  const current =
    options.find((o) => String(o.value) === String(value))?.label ?? String(value);

  return (
    <div ref={ref} className={`date-compact-select relative ${widthClass}`}>
      <button
        type="button"
        className="date-compact-trigger"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate">{current}</span>
        <ChevronDown
          size={14}
          className={open ? "rotate-180 transition-transform" : "transition-transform"}
        />
      </button>
      {open && (
        <div ref={listRef} className="date-compact-menu">
          {options.map((option) => {
            const active = String(option.value) === String(value);
            return (
              <button
                key={String(option.value)}
                type="button"
                data-active={active ? "true" : "false"}
                className={active ? "date-compact-option is-active" : "date-compact-option"}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DateField({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select date",
}: DateFieldProps) {
  const currentYear = new Date().getFullYear();
  const minYear = minDate?.getFullYear() ?? currentYear - 30;
  const maxYear = maxDate?.getFullYear() ?? currentYear + 5;

  const years = Array.from(
    { length: Math.max(1, maxYear - minYear + 1) },
    (_, i) => minYear + i
  ).reverse();

  return (
    <div className="date-field">
      <label className="text-label mb-1.5 block normal-case tracking-normal">
        {label}
      </label>
      <div className="date-field-control">
        <CalendarDays
          size={16}
          className="date-field-icon"
          aria-hidden="true"
        />
        <DatePicker
          selected={parseDate(value)}
          onChange={(date: Date | null) => onChange(formatDate(date))}
          dateFormat="dd MMM yyyy"
          placeholderText={placeholder}
          minDate={minDate ?? undefined}
          maxDate={maxDate ?? undefined}
          isClearable
                    className="date-field-input filter-control"
          calendarClassName="date-field-calendar"
          popperClassName="date-field-popper"
          popperPlacement="bottom-start"
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            changeMonth,
            changeYear,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="date-custom-header">
              <button
                type="button"
                className="date-nav-btn"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="date-header-selects">
                <CompactSelect
                  value={date.getMonth()}
                  widthClass="w-[108px]"
                  options={MONTHS.map((month, index) => ({
                    label: month,
                    value: index,
                  }))}
                  onChange={(month) => changeMonth(Number(month))}
                />
                <CompactSelect
                  value={date.getFullYear()}
                  widthClass="w-[84px]"
                  options={years.map((year) => ({
                    label: String(year),
                    value: year,
                  }))}
                  onChange={(year) => changeYear(Number(year))}
                />
              </div>

              <button
                type="button"
                className="date-nav-btn"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}
