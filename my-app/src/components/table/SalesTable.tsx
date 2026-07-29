"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { CarSale } from "@/types/car";

interface Props {
  data: CarSale[];
}

type SortKey =
  | "makeName"
  | "model"
  | "stateName"
  | "bodyType"
  | "sellingprice"
  | "odometer"
  | "year";

export default function SalesTable({ data }: Props) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [sortKey, setSortKey] = useState<SortKey>("sellingprice");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [tableSearch, setTableSearch] = useState("");

  const filtered = useMemo(() => {
    const q = tableSearch.trim().toLowerCase();
    let rows = data;
    if (q) {
      rows = rows.filter((car) =>
        [car.makeName, car.make, car.model, car.stateName, car.bodyType, car.vin]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    rows = [...rows].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return rows;
  }, [data, tableSearch, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortBtn = ({ label, keyName }: { label: string; keyName: SortKey }) => (
    <button
      type="button"
      onClick={() => toggleSort(keyName)}
      className="inline-flex cursor-pointer items-center gap-1 font-semibold"
    >
      {label}
      {sortKey === keyName ? (
        sortDir === "asc" ? (
          <ArrowUp size={12} />
        ) : (
          <ArrowDown size={12} />
        )
      ) : null}
    </button>
  );

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-section-title">Recent Sales Table</h3>
          <p className="text-sub">
            <span className="font-number">{filtered.length}</span> records ·
            pagination + sorting
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"
          />
          <input
            value={tableSearch}
            onChange={(e) => {
              setTableSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search in table..."
            className="font-ui w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-2 pl-9 pr-3 text-[0.875rem] outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="font-ui w-full min-w-[720px] text-left text-[0.875rem]">
          <thead className="sticky top-0 z-10 bg-[var(--bg-muted)] text-[var(--fg-muted)]">
            <tr>
              <th className="px-4 py-3">
                <SortBtn label="Make" keyName="makeName" />
              </th>
              <th className="px-4 py-3">
                <SortBtn label="Model" keyName="model" />
              </th>
              <th className="px-4 py-3">
                <SortBtn label="State" keyName="stateName" />
              </th>
              <th className="px-4 py-3">
                <SortBtn label="Body" keyName="bodyType" />
              </th>
              <th className="px-4 py-3">
                <SortBtn label="Price" keyName="sellingprice" />
              </th>
              <th className="px-4 py-3">
                <SortBtn label="Odometer" keyName="odometer" />
              </th>
              <th className="px-4 py-3">
                <SortBtn label="Year" keyName="year" />
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((car) => (
              <tr
                key={car.id}
                className="border-t border-[var(--border)] hover:bg-[var(--bg-muted)]/60"
              >
                <td className="px-4 py-3 font-medium capitalize">
                  {car.makeName || car.make}
                </td>
                <td className="px-4 py-3 capitalize">{car.model}</td>
                <td className="px-4 py-3 uppercase">
                  {car.stateName || car.state}
                </td>
                <td className="px-4 py-3 capitalize">
                  {car.bodyType || car.body}
                </td>
                <td className="font-number px-4 py-3 font-semibold">
                  {car.sellingprice != null
                    ? `$${car.sellingprice.toLocaleString()}`
                    : "-"}
                </td>
                <td className="font-number px-4 py-3">
                  {car.odometer != null
                    ? car.odometer.toLocaleString()
                    : "-"}
                </td>
                <td className="font-number px-4 py-3">{car.year ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 text-[0.875rem]">
        <span className="font-number text-[var(--fg-muted)]">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} />
            Prev
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
