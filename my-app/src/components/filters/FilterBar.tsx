"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Search, X } from "lucide-react";
import {
  resetFilters,
  setBodies,
  setDateRange,
  setMakes,
  setPriceRange,
  setSearch,
  setStates,
  setChartFilter,
} from "@/store/slices/filtersSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectFilterOptions } from "@/store/selectors";
import { useDebounce } from "@/hooks/useDebounce";
import MultiSelect from "./MultiSelect";
import DateField from "./DateField";

export default function FilterBar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);
  const options = useAppSelector(selectFilterOptions);
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    if (
      options.maxPrice > 0 &&
      filters.priceRange[1] === 100000 &&
      options.maxPrice !== 100000
    ) {
      dispatch(setPriceRange([options.minPrice, options.maxPrice]));
    }
  }, [options.minPrice, options.maxPrice, filters.priceRange, dispatch]);

  const hasActiveFilters =
    Boolean(searchInput.trim()) ||
    Boolean(filters.search.trim()) ||
    filters.makes.length > 0 ||
    filters.states.length > 0 ||
    filters.bodies.length > 0 ||
    Boolean(filters.dateRange[0]) ||
    Boolean(filters.dateRange[1]) ||
    Boolean(filters.chartFilter) ||
    filters.priceRange[0] > options.minPrice ||
    filters.priceRange[1] < options.maxPrice;

  return (
    <div className="panel no-print space-y-4 p-4 md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]">
            <Search size={16} />
          </span>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search make, model, state, VIN..."
            className="filter-search font-ui w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-2.5 pl-10 pr-3 text-[0.875rem] outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <MultiSelect
            label="Make"
            options={options.makes}
            selected={filters.makes}
            onChange={(v) => dispatch(setMakes(v))}
          />
          <MultiSelect
            label="State"
            options={options.states}
            selected={filters.states}
            onChange={(v) => dispatch(setStates(v))}
          />
          <MultiSelect
            label="Body"
            options={options.bodies}
            selected={filters.bodies}
            onChange={(v) => dispatch(setBodies(v))}
          />
          <button
            type="button"
            disabled={!hasActiveFilters}
            onClick={() => {
              setSearchInput("");
              dispatch(resetFilters());
              dispatch(setPriceRange([options.minPrice, options.maxPrice]));
            }}
            className="filter-control inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--fg-muted)] enabled:cursor-pointer enabled:hover:border-[var(--danger)] enabled:hover:text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:transform-none disabled:hover:shadow-none"
          >
            <RotateCcw size={14} />
            Reset Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-label">Price Range</span>
            <span className="font-number text-[0.8125rem] font-semibold text-[var(--fg-muted)]">
              ${filters.priceRange[0].toLocaleString("en-US")} - $
              {filters.priceRange[1].toLocaleString("en-US")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={options.minPrice}
              max={options.maxPrice}
              value={filters.priceRange[0]}
              onChange={(e) =>
                dispatch(
                  setPriceRange([
                    Math.min(Number(e.target.value), filters.priceRange[1]),
                    filters.priceRange[1],
                  ])
                )
              }
              className="w-full cursor-pointer accent-[var(--accent)]"
            />
            <input
              type="range"
              min={options.minPrice}
              max={options.maxPrice}
              value={filters.priceRange[1]}
              onChange={(e) =>
                dispatch(
                  setPriceRange([
                    filters.priceRange[0],
                    Math.max(Number(e.target.value), filters.priceRange[0]),
                  ])
                )
              }
              className="w-full cursor-pointer accent-[var(--accent)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DateField
            label="From Date"
            value={filters.dateRange[0]}
            maxDate={
              filters.dateRange[1]
                ? new Date(`${filters.dateRange[1]}T00:00:00`)
                : null
            }
            onChange={(value) =>
              dispatch(setDateRange([value, filters.dateRange[1]]))
            }
          />
          <DateField
            label="To Date"
            value={filters.dateRange[1]}
            minDate={
              filters.dateRange[0]
                ? new Date(`${filters.dateRange[0]}T00:00:00`)
                : null
            }
            onChange={(value) =>
              dispatch(setDateRange([filters.dateRange[0], value]))
            }
          />
        </div>
      </div>

      {(filters.makes.length > 0 ||
        filters.states.length > 0 ||
        filters.bodies.length > 0 ||
        filters.search ||
        filters.chartFilter) && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Chip
              label={`Search: ${filters.search}`}
              onRemove={() => {
                setSearchInput("");
                dispatch(setSearch(""));
              }}
            />
          )}
          {filters.makes.map((m) => (
            <Chip
              key={`make-${m}`}
              label={m}
              onRemove={() =>
                dispatch(setMakes(filters.makes.filter((x) => x !== m)))
              }
            />
          ))}
          {filters.states.map((s) => (
            <Chip
              key={`state-${s}`}
              label={s}
              onRemove={() =>
                dispatch(setStates(filters.states.filter((x) => x !== s)))
              }
            />
          ))}
          {filters.bodies.map((b) => (
            <Chip
              key={`body-${b}`}
              label={b}
              onRemove={() =>
                dispatch(setBodies(filters.bodies.filter((x) => x !== b)))
              }
            />
          ))}
          {filters.chartFilter && (
            <Chip
              label={`Chart: ${filters.chartFilter}`}
              onRemove={() => dispatch(setChartFilter(null))}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="font-ui inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[0.75rem] font-semibold text-[var(--accent)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
    >
      {label} <X size={12} />
    </button>
  );
}
