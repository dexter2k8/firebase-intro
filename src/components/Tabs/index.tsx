"use client";
import { createRef, useEffect, useState } from "react";
import classes from "./styles.module.css";
import type { CSSProperties } from "react";

interface ITabsProps {
  items: ITabItemProps[];
  defaultSelected?: number;
  minWidth?: CSSProperties["minWidth"];
}

export interface ITabItemProps {
  key: number;
  label: React.ReactNode;
  children?: React.ReactNode;
}

export default function Tabs({ items, defaultSelected = 0, minWidth }: ITabsProps) {
  const activeRef = createRef<HTMLLIElement>();
  const [selected, setSelected] = useState<number>(defaultSelected);
  const [offset, setOffset] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  const { activeLine, tabList, tabItem } = classes;

  useEffect(() => {
    const activeEl = activeRef.current;
    setOffset(activeEl?.offsetLeft || 0);
    setWidth(activeEl?.clientWidth || 0);
  }, [activeRef, selected]);

  return (
    <>
      <ul className={tabList} style={{ minWidth }}>
        {items.map((item) => (
          <li
            key={item.key}
            className={tabItem}
            ref={selected === item.key ? activeRef : undefined}
            onClick={() => setSelected(item.key)}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <div
        className={activeLine}
        style={{ width: width, transform: `translate(${offset}px, -3px)` }}
      />
      <div>{items[selected]?.children}</div>
    </>
  );
}
