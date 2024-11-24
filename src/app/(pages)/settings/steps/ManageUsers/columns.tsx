import Image from "next/image";
import TableActions from "@/components/TableActions";
import type { TGridColDef } from "@/components/Table/types";
import type { IActions } from "@/components/TableActions/types";
import type { IUser } from "@/store/useAuth/types";

export function getColumns({ onAction }: IActions) {
  const columns: TGridColDef<IUser>[] = [
    {
      field: "name",
      label: "NAME",
    },
    {
      field: "email",
      label: "EMAIL",
    },
    {
      field: "avatar",
      label: "AVATAR",
      render(value) {
        return (
          <>
            {value ? (
              <Image
                src={value as string}
                alt="avatar"
                width={28}
                height={28}
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <p>N/A</p>
            )}
          </>
        );
      },
    },
    {
      field: "actions" as keyof IUser,
      label: "ACTIONS",
      valueGetter: (row) => row.uid,
      render: (value) => <TableActions id={value as string} onAction={onAction} />,
    },
  ];

  return columns;
}
