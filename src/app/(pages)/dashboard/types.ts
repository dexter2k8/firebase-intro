import dayjs from "dayjs";
import type { ISegmentedControlItem } from "@/components/SegmentedControl";

export const patrimonyColors = ["#00579A", "#029BE4", "#4FC3F6"];
export const profitColors = ["#006400", "#32CD32", "#7CFC00"];
export const segmentedTypes: ISegmentedControlItem[] = [
  { key: 1, label: "All" },
  { key: 2, label: "Ação" },
  { key: 3, label: "FII" },
  { key: 4, label: "BDR" },
];

export const segmentedRange: ISegmentedControlItem[] = [
  { key: 1, label: "6M" },
  { key: 2, label: "12M" },
  { key: 3, label: "YTD" },
];

const currentDate = dayjs(new Date());

export function getDate(key: number): string | undefined {
  const date: { [key: number]: string } = {
    1: currentDate.subtract(6, "month").startOf("month").format("YYYY-MM-DD"),
    2: currentDate.subtract(12, "month").startOf("month").format("YYYY-MM-DD"),
    3: dayjs().startOf("year").format("YYYY-MM-DD"),
  };
  return date[key];
}

// last day of previous month
export const endDate = currentDate.subtract(1, "month").endOf("month").format("YYYY-MM-DD");
