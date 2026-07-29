"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface ChartDatum {
  category: string;
  value: number;
}

interface Props {
  data: ChartDatum[];
  darkMode: boolean;
  onSelect?: (category: string) => void;
}

export default function SalesBarChart({ data, darkMode, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const xAxisRef = useRef<am5xy.CategoryAxis<am5xy.AxisRenderer> | null>(null);
  const seriesRef = useRef<am5xy.ColumnSeries | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useLayoutEffect(() => {
    if (!ref.current || rootRef.current) return;

    const root = am5.Root.new(ref.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();
    rootRef.current = root;

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        paddingRight: 8,
        layout: root.verticalLayout,
      })
    );

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
    });
    xRenderer.labels.template.setAll({
      rotation: -35,
      centerY: am5.p50,
      centerX: am5.p100,
      fontSize: 11,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: xRenderer,
      })
    );
    xAxisRef.current = xAxis;

    const yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.labels.template.setAll({ fontSize: 11 });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, { renderer: yRenderer })
    );

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Sales",
        xAxis,
        yAxis,
        valueYField: "value",
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{categoryX}: {valueY}",
        }),
      })
    );

    series.columns.template.setAll({
      cornerRadiusTL: 6,
      cornerRadiusTR: 6,
      strokeOpacity: 0,
      fill: am5.color(0x0d9488),
      cursorOverStyle: "pointer",
    });

    series.columns.template.events.on("click", (ev) => {
      const item = ev.target.dataItem?.dataContext as ChartDatum | undefined;
      if (item?.category) onSelectRef.current?.(item.category);
    });

    seriesRef.current = series;

    return () => {
      root.dispose();
      rootRef.current = null;
      xAxisRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const xAxis = xAxisRef.current;
    const series = seriesRef.current;
    if (!root || !xAxis || !series) return;

    const textColor = darkMode ? am5.color(0xe8eef7) : am5.color(0x0f172a);
    const gridColor = darkMode ? am5.color(0x243049) : am5.color(0xd5dde7);

    xAxis.get("renderer").labels.template.setAll({ fill: textColor });
    xAxis.get("renderer").grid.template.setAll({
      stroke: gridColor,
      strokeOpacity: 0.45,
    });

    const yAxis = series.get("yAxis") as am5xy.ValueAxis<am5xy.AxisRenderer>;
    yAxis.get("renderer").labels.template.setAll({ fill: textColor });
    yAxis.get("renderer").grid.template.setAll({
      stroke: gridColor,
      strokeOpacity: 0.45,
    });

    series.columns.template.set(
      "fill",
      darkMode ? am5.color(0x2dd4bf) : am5.color(0x0d9488)
    );

    xAxis.data.setAll(data);
    series.data.setAll(data);
  }, [data, darkMode]);

  return <div ref={ref} className="h-[300px] w-full" />;
}
