"use client";
import { createRef, Fragment, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import classes from "./styles.module.css";

export interface ISegmentedControlItem {
  key: number;
  label: React.ReactNode;
  description?: string;
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
        <Fragment key={item.key}>
          <li
            className={controlItem}
            data-active={active === item.key}
            data-tooltip-id="segmented-tooltip"
            data-tooltip-content={item.description}
            ref={active === item.key ? activeRef : undefined}
            onClick={() => setActive(item.key)}
          >
            {item.label}
          </li>
          <Tooltip id="segmented-tooltip" style={{ maxWidth: "18rem" }} />
        </Fragment>
      ))}
    </ul>
  );
}
