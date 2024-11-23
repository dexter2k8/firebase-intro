import { Tooltip } from "react-tooltip";
import TableActions from "@/components/TableActions";
import { useAuth } from "@/store/useAuth";
import type { IFund } from "@/app/api/funds/get-funds/types";
import type { TGridColDef } from "@/components/Table/types";
import type { IActions } from "@/components/TableActions/types";

export function GetColumns({ onAction }: IActions) {
  const { isAdmin } = useAuth();
  const columns: TGridColDef<IFund>[] = [
    {
      field: "alias",
      label: "ALIAS",
      filterable: true,
    },
    {
      field: "name",
      label: "NAME",
    },
    {
      field: "type",
      label: "TYPE",
    },
    {
      field: "description",
      label: "DESCRIPTION",
      render(value) {
        return (
          <>
            <p
              data-tooltip-id="description-tooltip"
              data-tooltip-content={value}
              style={{ maxWidth: "18rem", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {value || "N/A"}
            </p>
            <Tooltip id="description-tooltip" style={{ maxWidth: "18rem", textWrap: "wrap" }} />
          </>
        );
      },
    },
  ];

  if (isAdmin) {
    columns.push({
      field: "actions" as keyof IFund,
      label: "ACTIONS",
      valueGetter: (row) => row.alias,
      render: (value) => <TableActions id={value as string} onAction={onAction} />,
    });
  }

  return columns;
}
