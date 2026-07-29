"use client";

import { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  Menu,
  Moon,
  Printer,
  Sun,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { exportCSV, exportExcel, printDashboard } from "@/lib/exportData";
import { toggleDarkMode } from "@/store/slices/themeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { CarSale } from "@/types/car";

interface Props {
  cars: CarSale[];
  children: React.ReactNode;
}

export default function AdminShell({ cars, children }: Props) {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((s) => s.theme.darkMode);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-shell min-h-screen">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={[
          "admin-content flex min-h-screen flex-col",
          collapsed ? "admin-content-collapsed" : "admin-content-expanded",
        ].join(" ")}
      >
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="no-print flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
              <div className="min-w-0">
                <p className="text-label text-[var(--accent)]">Admin / Dashboard</p>
                <h1 className="truncate font-heading text-[1.15rem] font-bold tracking-tight md:text-[1.25rem]">
                  Car Sales Analytics
                </h1>
              </div>
            </div>

            <div className="no-print flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => exportCSV(cars)}
                className="hidden cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-[0.78rem] font-semibold hover:border-[var(--accent)] sm:inline-flex"
              >
                <Download size={14} />
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => exportExcel(cars)}
                className="hidden cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-[0.78rem] font-semibold hover:border-[var(--accent)] md:inline-flex"
              >
                <FileSpreadsheet size={14} />
                Export Excel
              </button>
              <button
                type="button"
                onClick={printDashboard}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-[0.78rem] font-semibold hover:border-[var(--accent)]"
              >
                <Printer size={14} />
                Print
              </button>
              <button
                type="button"
                onClick={() => dispatch(toggleDarkMode())}
                aria-label="Toggle dark mode"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)]"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 py-5 md:px-6 md:py-6">{children}</div>
      </div>
    </div>
  );
}
