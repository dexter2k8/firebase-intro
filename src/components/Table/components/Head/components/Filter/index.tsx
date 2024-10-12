import "./styles.css";
import { useEffect, useRef, useState } from "react";
import type { IFilter } from "./types";

export default function Filter({ value, onSearch, onClose }: IFilter) {
  const filterRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    if (!text) onSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={filterRef} className="ds-table__filter">
      <label htmlFor="ds-table-search" style={{ textAlign: "left" }}>
        Filter by:
      </label>
      <input
        id="ds-table-search"
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="ds-table__filter__buttons">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onSearch(text)}>Search</button>
      </div>
    </div>
  );
}
