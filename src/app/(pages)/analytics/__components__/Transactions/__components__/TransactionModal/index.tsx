import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import SelectDate from "@/components/SelectDate";
import { useSWR } from "@/hook/useSWR";
import schema from "@/schemas/validateAddTransaction";
import api from "@/services/api";
import { currencyToNumber, formatBRL, parseDate } from "@/utils/lib";
import { API } from "@/utils/paths";
import styles from "./styles.module.scss";
import type { MouseEvent } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { IFund } from "@/app/api/funds/get-funds/types";
import type { ITransactionByFund } from "@/app/api/transactions/get-transactions-by-fund/[alias]/types";
import type { IPostTransaction } from "@/app/api/transactions/post-transaction/types";
import type { IResponse } from "@/app/api/types";
import type { IModalDefaultProps } from "@/components/Modal/types";
import type { ISelectOptions } from "@/components/Select/types";

interface IAddTransactionModalProps extends IModalDefaultProps {
  onMutate: () => void;
  transaction?: ITransactionByFund;
  fund_alias?: string;
  fundValue?: number;
}

export default function TransactionModal({
  open,
  transaction,
  onClose,
  onMutate,
  fund_alias,
  fundValue,
}: IAddTransactionModalProps) {
  const { modal, action } = styles;
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, setValue, reset } = useForm<IPostTransaction>({
    resolver: yupResolver(schema),
  });

  const { response } = useSWR<IResponse<IFund>>(API.FUNDS.GET_FUNDS);

  const fundList: ISelectOptions[] = response?.data.map((fund) => ({
    value: fund.alias,
    label: fund.alias,
  }));

  const onSubmit: SubmitHandler<IPostTransaction> = async (data) => {
    const { price, ...rest } = data;
    const parsedPrice = currencyToNumber(price);
    const parsedData = { ...rest, price: parsedPrice };

    setLoading(true);
    try {
      if (transaction) {
        await api.patch(`/api/transactions/patch-transaction/${transaction?.id}`, parsedData);
      } else await api.post("/api/transactions/post-transaction", parsedData);
      toast.success(`Transaction ${transaction ? "updated" : "added"} successfully`);
      onMutate();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.message);
      }
    }
    setLoading(false);
    reset({
      fund_alias: fund_alias || "",
      price: "R$ " + String(fundValue).replace(".", ",") || "",
    });
    onClose();
  };

  useEffect(() => {
    setValue("bought_at", parseDate(new Date()) as string);
    setValue("fund_alias", fund_alias || "");
    setValue("price", "R$ " + String(fundValue).replace(".", ","));

    if (transaction) {
      const price = String(transaction.price).replace(".", ",");
      setValue("bought_at", parseDate(transaction.bought_at) as string);
      setValue("fund_alias", transaction.fund_alias);
      setValue("price", "R$ " + formatBRL(price).value);
      setValue("quantity", transaction.quantity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction, fund_alias, fundValue]);

  const handleCloseModal = () => {
    onClose();
    reset({
      fund_alias: fund_alias || "",
      price: "R$ " + String(fundValue).replace(".", ",") || "",
    });
  };

  const handleDelete = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      await api.delete(`/api/transactions/delete-transaction/${transaction?.id}`);
      toast.success("Transaction deleted successfully");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.message);
      }
    }
    onMutate();
    handleCloseModal();
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      title={transaction ? "Edit Transaction" : "Add Transaction"}
      onOk={handleSubmit(onSubmit)}
      okLoading={loading}
      hideCross
      width="17rem"
    >
      <form className={modal}>
        {transaction && (
          <div className={action}>
            <button onClick={handleDelete}>DELETE</button>
          </div>
        )}
        <label htmlFor="price">Price</label>
        <Input.Currency name="price" control={control} />

        <label htmlFor="bought_at">Bought at</label>
        <SelectDate.Controlled control={control} name="bought_at" id="bought_at" />

        <label htmlFor="quantity">Quantity</label>
        <Input.Controlled
          type="search"
          control={control}
          name="quantity"
          id="quantity"
          mask="0000"
        />

        <label htmlFor="fund_alias">Fund</label>
        <Select.Controlled
          type="search"
          options={fundList || []}
          control={control}
          name="fund_alias"
          id="fund_alias"
        />
      </form>
    </Modal>
  );
}
