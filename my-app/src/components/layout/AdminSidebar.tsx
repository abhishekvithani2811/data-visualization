"use client";

import {
  Car,
  ChevronLeft,
  LayoutDashboard,
  UserRound,
} from "lucide-react";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar overlay"
        className={[
          "fixed inset-0 z-40 cursor-pointer bg-black/40 transition-opacity duration-300 lg:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onCloseMobile}
      />

      <aside
        className={[
          "sidebar-panel no-print fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)]",
          collapsed ? "is-collapsed" : "is-expanded",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={onToggle}
          className="sidebar-toggle absolute top-5 z-[60] hidden h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[var(--sidebar-border)] bg-[var(--bg-elevated)] text-[var(--fg-muted)] shadow-sm transition hover:bg-[var(--accent)] hover:text-white lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <ChevronLeft
            size={14}
            className={[
              "transition-transform duration-300",
              collapsed ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        <div className="sidebar-row sidebar-header">
          <div className="sidebar-icon brand-icon">
            <Car size={18} strokeWidth={2.25} />
          </div>
          <span className="sidebar-text font-heading text-[1.05rem] font-bold text-white">
            AutoAdmin
          </span>
        </div>

        <nav className="flex-1 py-4">
          <button
            type="button"
            className="sidebar-row sidebar-nav-item is-active cursor-pointer"
            title="Dashboard"
          >
            <span className="sidebar-icon nav-icon">
              <LayoutDashboard size={18} strokeWidth={2} />
            </span>
            <span className="sidebar-text text-[0.9rem] font-semibold">
              Dashboard
            </span>
          </button>
        </nav>

        <div className="border-t border-[var(--sidebar-border)] py-3">
          <div className="sidebar-row sidebar-user">
            <div className="sidebar-icon user-icon">
              <UserRound size={18} strokeWidth={2} />
            </div>
            <div className="sidebar-text leading-tight">
              <p className="text-[0.85rem] font-semibold text-white">Admin User</p>
              <p className="text-[0.72rem] text-[var(--sidebar-muted)]">
                vehicle-analytics
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
