"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
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

export default function SalesPieChart({ data, darkMode, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const seriesRef = useRef<am5percent.PieSeries | null>(null);
  const legendRef = useRef<am5.Legend | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useLayoutEffect(() => {
    if (!ref.current || rootRef.current) return;

    const root = am5.Root.new(ref.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();
    rootRef.current = root;

    // Donut with radial gradient - https://www.amcharts.com/demos/donut-with-radial-gradient/
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        radius: am5.percent(90),
        innerRadius: am5.percent(50),
        layout: root.horizontalLayout,
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Body Types",
        valueField: "value",
        categoryField: "category",
      })
    );

    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);

    series.slices.template.setAll({
      strokeOpacity: 0,
      cursorOverStyle: "pointer",
      tooltipText: "{category}: {value}",
      fillGradient: am5.RadialGradient.new(root, {
        stops: [
          { brighten: -0.8 },
          { brighten: -0.8 },
          { brighten: -0.5 },
          { brighten: 0 },
          { brighten: -0.5 },
        ],
      }),
    });

    series.slices.template.events.on("click", (ev) => {
      const item = ev.target.dataItem?.dataContext as ChartDatum | undefined;
      if (item?.category) onSelectRef.current?.(item.category);
    });

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerY: am5.percent(50),
        y: am5.percent(50),
        layout: root.verticalLayout,
      })
    );

    legend.valueLabels.template.setAll({ textAlign: "right" });
    legend.labels.template.setAll({
      maxWidth: 100,
      width: 100,
      oversizedBehavior: "wrap",
      fontSize: 12,
    });
    legend.valueLabels.template.setAll({
      fontSize: 12,
    });

    seriesRef.current = series;
    legendRef.current = legend;

    series.appear(1000, 100);

    return () => {
      root.dispose();
      rootRef.current = null;
      seriesRef.current = null;
      legendRef.current = null;
    };
  }, []);

  useEffect(() => {
    const series = seriesRef.current;
    const legend = legendRef.current;
    if (!series || !legend) return;

    const textColor = darkMode ? am5.color(0xe8eef7) : am5.color(0x0f172a);

    legend.labels.template.setAll({ fill: textColor });
    legend.valueLabels.template.setAll({ fill: textColor });

    series.data.setAll(data);
    legend.data.setAll(series.dataItems);
  }, [data, darkMode]);

  return <div ref={ref} className="h-[320px] w-full" />;
}
