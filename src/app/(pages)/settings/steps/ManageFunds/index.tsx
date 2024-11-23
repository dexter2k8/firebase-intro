"use client";
import { useState } from "react";
import { AxiosError } from "axios";
import { CiSquarePlus } from "react-icons/ci";
import { toast } from "react-toastify";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import { useSWR } from "@/hook/useSWR";
import api from "@/services/api";
import { useAuth } from "@/store/useAuth";
import { API } from "@/utils/paths";
import { GetColumns } from "./columns";
import styles from "../../styles.module.scss";
import FundModal from "./__components__/FundModal";
import type { IFund } from "@/app/api/funds/get-funds/types";
import type { IResponse } from "@/app/api/types";
import type { IActionsProps } from "@/components/TableActions/types";

export function ManageFunds() {
  const [action, setAction] = useState<IActionsProps>();
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
  const { head } = styles;
  const columns = GetColumns({ onAction: setAction });

  const { response: fundList, isLoading, mutate } = useSWR<IResponse<IFund>>(API.FUNDS.GET_FUNDS);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/api/funds/delete-fund/${action?.id}`);
      toast.success("Fund deleted successfully");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.message);
      }
    }
    mutate();
    setAction(undefined);
    setLoading(false);
  };

  return (
    <div>
      <div className={head}>
        <h4>Funds</h4>
        {isAdmin ? (
          <CiSquarePlus
            size="2rem"
            onClick={() => setAction({ action: "add", id: undefined })}
            style={{ cursor: "pointer" }}
          />
        ) : null}
      </div>
      <Table isLoading={isLoading} columns={columns} rows={fundList?.data || []} />
      <FundModal
        action={action?.action}
        fundData={fundList?.data.find((t) => t.alias === action?.id)}
        open={action !== undefined && action?.action !== "delete"}
        onClose={() => setAction(undefined)}
        onMutate={mutate}
      />
      <Modal
        title="Delete Fund"
        description="Are you sure you want to delete this fund?"
        open={action?.action === "delete"}
        onClose={() => setAction(undefined)}
        okText="Delete"
        onOk={handleDelete}
        okLoading={loading}
      />
    </div>
  );
}
