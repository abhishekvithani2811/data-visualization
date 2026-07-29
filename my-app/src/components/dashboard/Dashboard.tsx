"use client";

import { useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { loadCars } from "@/store/slices/carsSlice";
import { setChartFilter } from "@/store/slices/filtersSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  generateInsights,
  selectStateSalesTrends,
  selectFilteredCars,
  selectKpis,
  selectRecentSales,
  selectSalesByBody,
  selectSalesByMake,
  selectTopMakes,
} from "@/store/selectors";
import AdminShell from "@/components/layout/AdminShell";
import FilterBar from "@/components/filters/FilterBar";
import KpiCard from "@/components/kpi/KpiCard";
import SalesTable from "@/components/table/SalesTable";
import {
  InsightsWidget,
  RecentSalesWidget,
  TopCarsWidget,
} from "@/components/widgets/SideWidgets";
import { DashboardSkeleton, EmptyState } from "@/components/ui/States";
import {
  Building2,
  Car,
  DollarSign,
  Gauge,
  Star,
  TrendingUp,
} from "lucide-react";

const SalesBarChart = dynamic(
  () => import("@/components/charts/SalesBarChart"),
  { ssr: false, loading: () => <ChartFallback /> }
);
const SalesPieChart = dynamic(
  () => import("@/components/charts/SalesPieChart"),
  { ssr: false, loading: () => <ChartFallback /> }
);
const StateSalesTrendChart = dynamic(
  () => import("@/components/charts/StateSalesTrendChart"),
  { ssr: false, loading: () => <ChartFallback tall /> }
);

function ChartFallback({ tall }: { tall?: boolean }) {
  return (
    <div
      className={`skeleton w-full rounded-xl ${tall ? "h-[360px]" : "h-[300px]"}`}
    />
  );
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { loading, error, data } = useAppSelector((s) => s.cars);
  const darkMode = useAppSelector((s) => s.theme.darkMode);
  const filteredCars = useAppSelector(selectFilteredCars);
  const kpis = useAppSelector(selectKpis);
  const byMake = useAppSelector(selectSalesByMake);
  const byBody = useAppSelector(selectSalesByBody);
  const stateTrends = useAppSelector(selectStateSalesTrends);
  const topMakes = useAppSelector(selectTopMakes);
  const recent = useAppSelector(selectRecentSales);

  const insights = useMemo(
    () => generateInsights(filteredCars),
    [filteredCars]
  );

  useEffect(() => {
    const request = dispatch(loadCars());
    // Swallow promise rejections here — errors are stored in Redux state.
    // Prevents AbortError / rejected thunks from surfacing as Next.js overlays.
    void request.catch(() => undefined);
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const onChartSelect = useCallback(
    (category: string) => {
      dispatch(setChartFilter(category));
    },
    [dispatch]
  );

  return (
    <AdminShell cars={filteredCars}>
      <div className="space-y-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-[1.35rem] font-bold tracking-tight">
              Overview
            </h2>
            <p className="text-sub">
              Live Firestore sales data with Redux filters and amCharts.
            </p>
          </div>
          <p className="font-number text-[0.8rem] font-semibold text-[var(--fg-muted)]">
            
          </p>
        </div>

        <FilterBar />

        {loading && data.length === 0 && <DashboardSkeleton />}

        {!loading && error && data.length === 0 && (
          <div className="panel border-[var(--danger)] p-5 text-[var(--danger)]">
            <p className="font-semibold">Failed to load Firestore data</p>
            <p className="mt-1 text-[0.875rem]">{error}</p>
            <p className="mt-2 text-[0.75rem] opacity-80">
              Ensure Firestore rules allow read access on collection
              &quot;car_sales&quot;.
            </p>
          </div>
        )}

        {(!loading || data.length > 0) && !error && (
          <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              <KpiCard
                icon={Car}
                label="Total Cars"
                value={kpis.totalCars}
                trend="+5%"
              />
              <KpiCard
                icon={DollarSign}
                label="Total Revenue"
                value={kpis.totalRevenue}
                format="currency"
                trend="+8%"
              />
              <KpiCard
                icon={TrendingUp}
                label="Average Price"
                value={kpis.avgPrice}
                format="currency"
                trend="+3%"
              />
              <KpiCard
                icon={Star}
                label="Highest Price"
                value={kpis.highestPrice}
                format="currency"
                trend="+2%"
              />
              <KpiCard
                icon={Building2}
                label="Total Sellers"
                value={kpis.totalSellers}
                trend="+4%"
              />
              <KpiCard
                icon={Gauge}
                label="Avg Odometer"
                value={kpis.avgOdometer}
                format="compact"
                trend="-1%"
                trendUp={false}
              />
            </section>

            {!filteredCars.length ? (
              <EmptyState />
            ) : (
              <>
                <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="panel p-4 md:p-5">
                    <h3 className="text-section-title mb-1">Sales by Make</h3>
                    <p className="text-sub mb-3">
                      Click a bar to filter the table
                    </p>
                    <SalesBarChart
                      data={byMake}
                      darkMode={darkMode}
                      onSelect={onChartSelect}
                    />
                  </div>
                  <div className="panel p-4 md:p-5">
                    <h3 className="text-section-title mb-1">Body Type Mix</h3>
                    <p className="text-sub mb-3">
                      Donut chart - click a slice to filter the table
                    </p>
                    <SalesPieChart
                      data={byBody}
                      darkMode={darkMode}
                      onSelect={onChartSelect}
                    />
                  </div>
                </section>

                <section>
                  <div className="panel p-4 md:p-5">
                    <h3 className="text-section-title mb-1">
                      Top 3 States - Monthly Sales Count
                    </h3>
                    <p className="text-sub mb-3">
                      Same months aligned for each state - hover legend to
                      highlight a series
                    </p>
                    <StateSalesTrendChart
                      seriesData={stateTrends}
                      darkMode={darkMode}
                    />
                  </div>
                </section>

                <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                  <TopCarsWidget items={topMakes} />
                  <RecentSalesWidget items={recent} />
                  <InsightsWidget insights={insights} />
                </section>

                <SalesTable data={filteredCars} />
              </>
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
}
