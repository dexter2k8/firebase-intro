"use client";
import { createRef, useEffect, useState } from "react";
import classes from "./styles.module.css";

export interface ISegmentedControlItem {
  key: number;
  label: React.ReactNode;
}

interface ISegmentedControlProps {
  items: ISegmentedControlItem[];
  defaultSelected?: number;
  selected?: number;
  onSelect?: (key: number) => void;
  variant?: "primary" | "secondary";
}

export default function SegmentedControl({
  items,
  defaultSelected = 0,
  selected,
  onSelect,
  variant = "primary",
}: ISegmentedControlProps) {
  const activeRef = createRef<HTMLLIElement>();
  const segmentRef = createRef<HTMLUListElement>();
  const [active, setActive] = useState<number>(defaultSelected);

  const { controlList, controlItem } = classes;

  useEffect(() => {
    if (selected) setActive(selected);
    onSelect?.(active);

    if (!segmentRef.current || !activeRef.current) return;

    const { offsetLeft, offsetWidth } = activeRef.current;
    const { style } = segmentRef.current;

    style.setProperty("--left", `${offsetLeft}px`);
    style.setProperty("--width", `${offsetWidth}px`);
  }, [active, activeRef, onSelect, segmentRef, selected]);

  return (
    <ul className={controlList} data-variant={variant} ref={segmentRef}>
      {items.map((item) => (
        <li
          key={item.key}
          className={controlItem}
          data-active={active === item.key}
          ref={active === item.key ? activeRef : undefined}
          onClick={() => setActive(item.key)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}
