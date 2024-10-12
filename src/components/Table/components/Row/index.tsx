import "./styles.css";
import type { IRow } from "./types";

export default function Row({
  columns,
  colWidths,
  row,
  rowIndex,
  checked,
  checkboxSelection,
  rowClick,
}: IRow) {
  return (
    <tr className="ds-table__row" onClick={() => rowClick?.(rowIndex)}>
      {columns.map((col, j) => {
        const value = col.valueGetter ? col.valueGetter(row) : row[col.field];

        //--- Get column width for fixed columns
        let colWidth;
        if (col.fixed) {
          const fixedCols =
            col.fixed === "left"
              ? colWidths.filter((_, k) => columns[k].fixed !== undefined && k < j)
              : colWidths.filter((_, k) => columns[k].fixed !== undefined && k > j);
          colWidth = fixedCols.reduce((a, b) => a + b, 0);
        }

        const stickyStyle = col.fixed
          ? col.fixed === "left"
            ? { left: colWidth }
            : { right: colWidth }
          : {};

        const dataClasses = ["ds-table__row--td "];
        if (checked?.includes(rowIndex)) dataClasses.push("ds-table__row--selected");
        if (col.fixed) dataClasses.push(`ds-table__fixed`);
        const dataClass = dataClasses.join(" ");

        const labelClasses = ["ds-table__row--label"];
        labelClasses.push(`ds-table__cell--${col.align || "left"}`);
        if (rowClick || checkboxSelection) labelClasses.push("ds-table__row--cursor");
        const labelClass = labelClasses.join(" ");

        return (
          <td key={j} className={dataClass} style={stickyStyle}>
            <label className={labelClass} htmlFor={String(rowIndex)}>
              {col.render ? col.render(value) : value}
            </label>
          </td>
        );
      })}
    </tr>
  );
}
