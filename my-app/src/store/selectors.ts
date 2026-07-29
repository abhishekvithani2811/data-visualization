import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import type { CarSale } from "@/types/car";
import { formatStateName } from "@/lib/states";

const selectCars = (state: RootState) => state.cars.data;
const selectFilters = (state: RootState) => state.filters;

export const selectFilteredCars = createSelector(
  [selectCars, selectFilters],
  (cars, filters) => {
    const search = filters.search.trim().toLowerCase();
    const [minPrice, maxPrice] = filters.priceRange;
    const [startDate, endDate] = filters.dateRange;

    return cars.filter((car) => {
      if (search) {
        const haystack = [
          car.make,
          car.makeName,
          car.model,
          car.body,
          car.bodyType,
          car.state,
          car.stateName,
          car.seller,
          car.vin,
          car.color,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(search)) return false;
      }

      if (filters.makes.length && !filters.makes.includes(car.makeName || car.make)) {
        return false;
      }

      if (
        filters.states.length &&
        !filters.states.includes(car.stateName || car.state.toUpperCase())
      ) {
        return false;
      }

      if (
        filters.bodies.length &&
        !filters.bodies.includes(car.bodyType || car.body)
      ) {
        return false;
      }

      const price = car.sellingprice ?? 0;
      if (price < minPrice || price > maxPrice) return false;

      if (startDate || endDate) {
        if (!car.saledate) return false;
        const sale = new Date(car.saledate).getTime();
        if (startDate && sale < new Date(startDate).getTime()) return false;
        if (endDate && sale > new Date(endDate).getTime() + 86400000 - 1) return false;
      }

      if (filters.chartFilter) {
        const key = filters.chartFilter.toLowerCase();
        const match =
          (car.makeName || car.make).toLowerCase() === key ||
          (car.bodyType || car.body).toLowerCase() === key ||
          (car.stateName || car.state).toLowerCase() === key;
        if (!match) return false;
      }

      return true;
    });
  }
);

export const selectFilterOptions = createSelector([selectCars], (cars) => {
  const makes = new Set<string>();
  const states = new Set<string>();
  const bodies = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = 0;

  cars.forEach((car) => {
    if (car.makeName || car.make) makes.add(car.makeName || car.make);
    if (car.stateName || car.state) states.add(car.stateName || car.state.toUpperCase());
    if (car.bodyType || car.body) bodies.add(car.bodyType || car.body);
    if (car.sellingprice != null) {
      minPrice = Math.min(minPrice, car.sellingprice);
      maxPrice = Math.max(maxPrice, car.sellingprice);
    }
  });

  return {
    makes: Array.from(makes).sort(),
    states: Array.from(states).sort(),
    bodies: Array.from(bodies).sort(),
    minPrice: Number.isFinite(minPrice) ? Math.floor(minPrice) : 0,
    maxPrice: maxPrice || 100000,
  };
});

export const selectKpis = createSelector([selectFilteredCars], (cars) => {
  const totalCars = cars.length;
  const prices = cars
    .map((c) => c.sellingprice)
    .filter((p): p is number => p != null);
  const odometers = cars
    .map((c) => c.odometer)
    .filter((o): o is number => o != null);
  const sellers = new Set(cars.map((c) => c.seller).filter(Boolean));

  const totalRevenue = prices.reduce((a, b) => a + b, 0);
  const avgPrice = prices.length ? totalRevenue / prices.length : 0;
  const highestPrice = prices.length ? Math.max(...prices) : 0;
  const avgOdometer = odometers.length
    ? odometers.reduce((a, b) => a + b, 0) / odometers.length
    : 0;

  return {
    totalCars,
    totalRevenue,
    avgPrice,
    highestPrice,
    totalSellers: sellers.size,
    avgOdometer,
  };
});

export const selectSalesByMake = createSelector([selectFilteredCars], (cars) => {
  const map = new Map<string, number>();
  cars.forEach((car) => {
    const make = car.makeName || car.make || "Unknown";
    map.set(make, (map.get(make) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
});

export const selectSalesByBody = createSelector([selectFilteredCars], (cars) => {
  const map = new Map<string, number>();
  cars.forEach((car) => {
    const body = car.bodyType || car.body || "Unknown";
    map.set(body, (map.get(body) ?? 0) + 1);
  });
  return Array.from(map.entries()).map(([category, value]) => ({
    category,
    value,
  }));
});

/** Top 3 states by volume - monthly sales count (aligned months for comparison) */
export const selectStateSalesTrends = createSelector(
  [selectFilteredCars],
  (cars) => {
    const stateCounts = new Map<string, number>();
    const monthly = new Map<string, Map<string, number>>();
    const allMonths = new Set<string>();

    cars.forEach((car) => {
      if (!car.saledate) return;
      const state = (car.stateName || car.state || "").trim();
      if (!state) return;

      stateCounts.set(state, (stateCounts.get(state) ?? 0) + 1);

      const d = new Date(car.saledate);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
      allMonths.add(monthKey);

      if (!monthly.has(state)) monthly.set(state, new Map());
      const byMonth = monthly.get(state)!;
      byMonth.set(monthKey, (byMonth.get(monthKey) ?? 0) + 1);
    });

    const topStates = Array.from(stateCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    const months = Array.from(allMonths).sort((a, b) => a.localeCompare(b));

    return topStates.map((name) => {
      const byMonth = monthly.get(name) ?? new Map();
      // Fill every month so series align for month-by-month compare
      const data = months.map((monthKey) => ({
        date: new Date(monthKey).getTime(),
        value: byMonth.get(monthKey) ?? 0,
      }));
      return { name: formatStateName(name), data };
    });
  }
);

export const selectTopMakes = createSelector([selectFilteredCars], (cars) => {
  const map = new Map<string, number>();
  cars.forEach((car) => {
    const make = car.makeName || car.make || "Unknown";
    map.set(make, (map.get(make) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
});

export const selectRecentSales = createSelector([selectFilteredCars], (cars) => {
  return [...cars]
    .sort((a, b) => {
      const da = a.saledate ? new Date(a.saledate).getTime() : 0;
      const db = b.saledate ? new Date(b.saledate).getTime() : 0;
      return db - da;
    })
    .slice(0, 6);
});

export function generateInsights(cars: CarSale[]): string[] {
  if (!cars.length) return ["No data available for insights."];

  const insights: string[] = [];

  const makeAvg = new Map<string, { sum: number; n: number }>();
  const stateCount = new Map<string, number>();
  const bodyCount = new Map<string, number>();
  let auto = 0;
  let manual = 0;

  cars.forEach((car) => {
    const make = car.makeName || car.make;
    if (make && car.sellingprice != null) {
      const curr = makeAvg.get(make) ?? { sum: 0, n: 0 };
      curr.sum += car.sellingprice;
      curr.n += 1;
      makeAvg.set(make, curr);
    }
    const state = car.stateName || car.state;
    if (state) stateCount.set(state, (stateCount.get(state) ?? 0) + 1);
    const body = car.bodyType || car.body;
    if (body) bodyCount.set(body, (bodyCount.get(body) ?? 0) + 1);
    if (car.transmission.includes("auto")) auto += 1;
    if (car.transmission.includes("manual")) manual += 1;
  });

  let topMake = "";
  let topAvg = 0;
  makeAvg.forEach((v, k) => {
    const avg = v.sum / v.n;
    if (avg > topAvg) {
      topAvg = avg;
      topMake = k;
    }
  });
  if (topMake) {
    insights.push(
      `${topMake} has the highest average selling price ($${Math.round(topAvg).toLocaleString()}).`
    );
  }

  const topState = Array.from(stateCount.entries()).sort((a, b) => b[1] - a[1])[0];
  if (topState) {
    insights.push(
      `${topState[0].toUpperCase()} leads with ${topState[1]} sales in the current view.`
    );
  }

  const total = cars.length;
  const topBody = Array.from(bodyCount.entries()).sort((a, b) => b[1] - a[1])[0];
  if (topBody) {
    const pct = Math.round((topBody[1] / total) * 100);
    insights.push(`${topBody[0]}s account for ${pct}% of sales.`);
  }

  if (auto || manual) {
    insights.push(
      auto >= manual
        ? "Automatic cars dominate sales volume."
        : "Manual cars are more common in this filtered set."
    );
  }

  const prices = cars
    .filter((c) => c.sellingprice != null)
    .map((c) => c.sellingprice as number);
  if (prices.length) {
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    insights.push(`Average selling price sits at $${avg.toLocaleString()}.`);
  }

  return insights.slice(0, 5);
}
