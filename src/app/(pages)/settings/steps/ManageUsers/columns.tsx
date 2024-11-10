import Image from "next/image";
// import TableActions from "@/components/TableActions";
// import type { IUsers } from "@/app/api/get_users/types";
// import type { GridColDef } from "@/components/Table/types";
// import type { IActions } from "@/components/TableActions/types";

export function getColumns() {
  // export function getColumns({ onAction }: IActions) {
  const columns = [
    // const columns: GridColDef<IUsers>[] = [
    {
      field: "name",
      label: "NAME",
    },
    {
      field: "email",
      label: "EMAIL",
    },
    {
      field: "admin",
      label: "ADMIN",
      render: (value: string) => <p>{value ? "TRUE" : "FALSE"}</p>,
      // render: (value) => <p>{value ? "TRUE" : "FALSE"}</p>,
    },
    {
      field: "avatar",
      label: "AVATAR",
      render(value: string) {
        // render(value) {
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
    // {
    //   field: "actions" as keyof IUsers,
    //   label: "ACTIONS",
    //   valueGetter: (row) => row.id,
    //   render: (value) => <TableActions id={value as string} onAction={onAction} />,
    // },
  ];

  return columns;
}
