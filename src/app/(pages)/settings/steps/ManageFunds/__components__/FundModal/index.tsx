import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Textarea from "@/components/Textarea";
import schema from "@/schemas/validateFund";
// import api from "@/services/api";
import styles from "./styles.module.scss";
// import type { SubmitHandler } from "react-hook-form";
// import type { IFunds } from "@/app/api/get_funds/types";
import type { IModalDefaultProps } from "@/components/Modal/types";
import type { ISelectOptions } from "@/components/Select/types";
import type { TAction } from "@/components/TableActions/types";

const typeList: ISelectOptions[] = [
  { value: "Ação", label: "Ação" },
  { value: "FII", label: "FII" },
  { value: "BDR", label: "BDR" },
];

interface IFundModalProps extends IModalDefaultProps {
  onMutate: () => void;
  fundData?: object;
  // fundData?: IFunds;
  action?: TAction;
}

export default function FundModal({ open, fundData, onClose, action, onMutate }: IFundModalProps) {
  const { modal } = styles;
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, setValue, reset } = useForm(
    // <IFunds>(
    {
      resolver: yupResolver(schema),
    }
  );

  const onSubmit =
    // : SubmitHandler<IFunds>
    //  = async (data) => {
    async () => {
      setLoading(true);
      try {
        // if (action === "add") await api.client.post("/api/post_fund", data);
        // if (action === "edit") await api.client.patch(`/api/patch_fund/${fundData?.alias}`, data);
        onMutate();
        toast.success(`Fund ${action === "add" ? "added" : "updated"} successfully`);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error?.message);
        }
      }
      setLoading(false);
      reset();
      onClose();
    };

  useEffect(() => {
    setValue("description", "");
    setValue("type", "Ação");
    // if (fundData) {
    //   setValue("alias", fundData.alias);
    //   setValue("name", fundData.name);
    //   setValue("description", fundData.description);
    //   setValue("type", fundData.type);
    //   setValue("sector", fundData.sector);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundData]);

  const handleCloseModal = () => {
    setValue("description", "");
    onClose();
    reset();
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      title={fundData ? "Edit Fund" : "Add Fund"}
      onOk={handleSubmit(onSubmit)}
      okLoading={loading}
      hideCross
      width="17rem"
    >
      <form className={modal}>
        <label htmlFor="alias">Alias</label>
        <Input.Controlled type="search" control={control} name="alias" id="alias" />

        <label htmlFor="name">Name</label>
        <Input.Controlled type="search" control={control} name="name" id="name" />

        <label htmlFor="description">Description (optional)</label>
        <Textarea.Controlled
          control={control}
          name="description"
          id="description"
          resize="none"
          rows={3}
        />

        <label htmlFor="sector">Sector (optional)</label>
        <Input.Controlled type="search" control={control} name="sector" id="sector" />

        <label htmlFor="type">Type</label>
        <Select.Controlled options={typeList} control={control} name="type" id="type" />
      </form>
    </Modal>
  );
}
