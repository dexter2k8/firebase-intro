"use client";
import { useState } from "react";
import { AxiosError } from "axios";
import { CiSquarePlus } from "react-icons/ci";
import { toast } from "react-toastify";
// import { API } from "@/app/paths";
import Modal from "@/components/Modal";
// import Table from "@/components/Table";
// import { useSWR } from "@/hook/useSWR";
// import api from "@/services/api";
// import { getColumns } from "./columns";
import styles from "../../styles.module.scss";
// import UserModal from "./__components__/UserModal";
// import type { IUsers } from "@/app/api/get_users/types";
import type { IActionsProps } from "@/components/TableActions/types";

export function ManageUsers() {
  const [action, setAction] = useState<IActionsProps>();
  const [loading, setLoading] = useState(false);
  const { head } = styles;
  // const columns = getColumns({ onAction: setAction });

  // const { response: userList, isLoading, mutate } = useSWR<IUsers[]>(API.GET_USERS);

  const handleDelete = async () => {
    try {
      setLoading(true);
      // await api.client.delete(`/api/delete_user/${action?.id}`);
      toast.success("User deleted successfully");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.message);
      }
    }
    // mutate();
    setAction(undefined);
    setLoading(false);
  };

  return (
    <div>
      <div className={head}>
        <h4>Funds</h4>
        <CiSquarePlus
          size="2rem"
          onClick={() => setAction({ action: "add", id: undefined })}
          style={{ cursor: "pointer" }}
        />
      </div>
      {/* <Table isLoading={isLoading} columns={columns} rows={userList || []} /> */}
      {/* <UserModal
        action={action?.action}
        userData={userList?.find((t) => t.id === action?.id)}
        open={action !== undefined && action?.action !== "delete"}
        onClose={() => setAction(undefined)}
        onMutate={mutate}
      /> */}
      <Modal
        title="Delete User"
        description="Are you sure you want to delete this user?"
        open={action?.action === "delete"}
        onClose={() => setAction(undefined)}
        okText="Delete"
        onOk={handleDelete}
        okLoading={loading}
      />
    </div>
  );
}
