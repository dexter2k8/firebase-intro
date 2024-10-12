"use client";
import "./styles.css";
import { useEffect, useRef, useState } from "react";
import CheckboxSelection from "./components/CheckboxSelection";
import Foot from "./components/Foot";
import Head from "./components/Head";
import Row from "./components/Row";
import type { IFilterProps, ISortProps } from "./components/Head/types";
import type { ITable } from "./types";

export default function Table({
  columns,
  rows,
  isLoading,
  onRowClick,
  pageSize,
  checkboxSelection,
  checkboxSelected,
  serverPagination,
  serverRowCount = 0,
  serverPage = 1,
  serverPageChange,
  serverFiltered,
  serverSorted,
  hideFooter,
}: ITable) {
  const [sorted, setSorted] = useState<ISortProps>();
  const [filtered, setFiltered] = useState<IFilterProps>();
  const [page, setPage] = useState<number>(1);
  const [colWidths, setColWidths] = useState<number[]>([]);
  const colRefs = useRef<(HTMLTableColElement | null)[]>([]);

  const noData = rows.length === 0;
  const colCount = columns.length + Number(checkboxSelection ? 1 : 0);
  const pageSizeNumber = pageSize ? pageSize : hideFooter ? rows.length : 10;

  const { parsedColumns, parsedRows, checked } = CheckboxSelection({
    columns,
    rows,
    checkboxSelection,
  });

  useEffect(
    () => checkboxSelected?.(checked.map((t) => rows[t])),
    [checkboxSelected, checked, rows]
  );

  // get column widths for fixed columns calculation
  useEffect(() => {
    setColWidths(
      columns.map((_, i) => colRefs.current[i]?.getBoundingClientRect().width) as number[]
    );
  }, [columns]);

  const filteredRows = serverFiltered
    ? rows
    : parsedRows.filter((row) => {
        const field = row[filtered?.field as string]?.toLowerCase();
        const filterText = filtered?.text.toLocaleLowerCase();
        return field ? field.includes(filterText) : row;
      });

  const sortedRows = serverSorted
    ? rows
    : filteredRows.slice().sort((a, b) => {
        const first = String(a[sorted?.field as string] || "");
        const second = String(b[sorted?.field as string] || "");
        if (sorted?.sort === "asc")
          return first.localeCompare(second, undefined, { numeric: true });
        if (sorted?.sort === "desc")
          return second.localeCompare(first, undefined, { numeric: true });
        return 0;
      });

  const paginatedRows = sortedRows.slice((page - 1) * pageSizeNumber, page * pageSizeNumber);

  const bodyClass = isLoading || rows.length === 0 ? "ds-table__body--loading" : "";

  return (
    <table className={`ds-table`}>
      <colgroup>
        {columns.map((col, i) => (
          <col
            key={col.field as string}
            ref={(el) => {
              colRefs.current[i] = el;
            }}
            style={{ minWidth: col.width, maxWidth: col.width }}
          />
        ))}
      </colgroup>

      <thead>
        <Head
          columns={parsedColumns}
          colWidths={colWidths}
          onSort={serverSorted ?? setSorted}
          onFilter={serverFiltered ?? setFiltered}
        />
      </thead>

      <tbody className={bodyClass}>
        {paginatedRows.map((row, i) => (
          <Row
            key={i}
            columns={parsedColumns}
            colWidths={colWidths}
            row={row}
            rowIndex={i}
            checked={checked}
            checkboxSelection={checkboxSelection}
            {...(onRowClick ? { rowClick: () => onRowClick(rows[i]) } : {})}
          />
        ))}
      </tbody>

      {!hideFooter && (
        <tfoot>
          <Foot
            colCount={colCount}
            rowCount={serverPagination ? serverRowCount : sortedRows.length}
            page={serverPagination ? serverPage : page}
            pageSize={pageSizeNumber}
            onPageChange={(pageNumber) =>
              serverPagination ? serverPageChange?.(pageNumber) : setPage(pageNumber)
            }
          />
        </tfoot>
      )}

      {(isLoading || noData) && (
        <tbody className="ds-table__loading-wrapper">
          {isLoading && <tr className="ds-table__loading" />}
          {noData && !isLoading && (
            <tr className="ds-table__no-data">
              <td>No data</td>
            </tr>
          )}
        </tbody>
      )}
    </table>
  );
}
