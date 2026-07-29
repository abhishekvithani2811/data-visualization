"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export interface StateTrendSeries {
  name: string;
  data: { date: number; value: number }[];
}

interface Props {
  seriesData: StateTrendSeries[];
  darkMode: boolean;
}

const COLORS = [0x0d9488, 0x0369a1, 0xb45309];

export default function StateSalesTrendChart({ seriesData, darkMode }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const chartRef = useRef<am5xy.XYChart | null>(null);
  const legendRef = useRef<am5.Legend | null>(null);

  useLayoutEffect(() => {
    if (!ref.current || rootRef.current) return;

    const root = am5.Root.new(ref.current);
    root._logo?.dispose();

    const myTheme = am5.Theme.new(root);
    myTheme.rule("AxisLabel", ["minor"]).setAll({ dy: 1 });
    myTheme.rule("Grid", ["x"]).setAll({ strokeOpacity: 0.08 });
    myTheme.rule("Grid", ["x", "minor"]).setAll({ strokeOpacity: 0.05 });

    root.setThemes([am5themes_Animated.new(root), myTheme]);
    rootRef.current = root;

    // https://www.amcharts.com/demos/highlighting-line-chart-series-on-legend-hover/
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        maxTooltipDistance: 0,
        layout: root.verticalLayout,
        paddingRight: 8,
      })
    );
    chartRef.current = chart;

    chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.1,
        baseInterval: { timeUnit: "month", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true,
          minGridDistance: 50,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, { behavior: "none" })
    );
    cursor.lineY.set("visible", false);

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 12,
        layout: root.horizontalLayout,
      })
    );
    legendRef.current = legend;

    legend.itemContainers.template.events.on("pointerover", (e) => {
      const series = e.target.dataItem?.dataContext as
        | am5xy.LineSeries
        | undefined;
      if (!series) return;

      chart.series.each((chartSeries) => {
        if (chartSeries !== series) {
          chartSeries.strokes.template.setAll({
            strokeOpacity: 0.12,
            stroke: am5.color(0x94a3b8),
          });
          chartSeries.fills.template.setAll({ fillOpacity: 0.03 });
        } else {
          chartSeries.strokes.template.setAll({
            strokeWidth: 3,
            strokeOpacity: 1,
          });
          chartSeries.fills.template.setAll({ fillOpacity: 0.28 });
        }
      });
    });

    legend.itemContainers.template.events.on("pointerout", () => {
      chart.series.each((chartSeries) => {
        chartSeries.strokes.template.setAll({
          strokeOpacity: 1,
          strokeWidth: 2,
          stroke: chartSeries.get("fill"),
        });
        chartSeries.fills.template.setAll({ fillOpacity: 0.16 });
      });
    });

    return () => {
      root.dispose();
      rootRef.current = null;
      chartRef.current = null;
      legendRef.current = null;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const chart = chartRef.current;
    const legend = legendRef.current;
    if (!root || !chart || !legend) return;

    const textColor = darkMode ? am5.color(0xe8eef7) : am5.color(0x0f172a);
    const gridColor = darkMode ? am5.color(0x243049) : am5.color(0xd5dde7);

    chart.xAxes.each((axis) => {
      axis.get("renderer").labels.template.setAll({
        fill: textColor,
        fontSize: 11,
      });
      axis.get("renderer").grid.template.setAll({ stroke: gridColor });
    });
    chart.yAxes.each((axis) => {
      axis.get("renderer").labels.template.setAll({
        fill: textColor,
        fontSize: 11,
      });
      axis.get("renderer").grid.template.setAll({ stroke: gridColor });
    });
    legend.labels.template.setAll({ fill: textColor, fontSize: 12 });
    legend.valueLabels.template.setAll({ fill: textColor, fontSize: 12 });

    chart.series.clear();

    const xAxis = chart.xAxes.getIndex(0) as am5xy.DateAxis<am5xy.AxisRenderer>;
    const yAxis = chart.yAxes.getIndex(0) as am5xy.ValueAxis<am5xy.AxisRenderer>;

    seriesData.forEach((item, index) => {
      const color = am5.color(COLORS[index % COLORS.length]);
      const series = chart.series.push(
        am5xy.SmoothedXLineSeries.new(root, {
          name: item.name,
          xAxis,
          yAxis,
          valueYField: "value",
          valueXField: "date",
          legendValueText: "{valueY}",
          fill: color,
          stroke: color,
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{name}: {valueY}",
          }),
        })
      );

      series.strokes.template.setAll({
        strokeWidth: 2,
        stroke: color,
      });

      // Soft colored area under each line for easier visual compare
      series.fills.template.setAll({
        visible: true,
        fillOpacity: 0.16,
        fill: color,
      });

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 4,
            fill: color,
            stroke: darkMode ? am5.color(0x101826) : am5.color(0xffffff),
            strokeWidth: 2,
          }),
        })
      );

      series.data.setAll(item.data);
      series.appear(800);
    });

    legend.data.setAll(chart.series.values);
    chart.appear(800, 100);
  }, [seriesData, darkMode]);

  return <div ref={ref} className="h-[360px] w-full" />;
}
