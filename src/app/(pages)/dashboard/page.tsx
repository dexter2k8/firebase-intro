"use client";
import { useState } from "react";
import { useSWR } from "@/hook/useSWR";
import api from "@/services/api";
import { API } from "@/utils/paths";
import ExcelReader from "../__components__/ExcelReader";
import type { IIncome } from "@/app/api/incomes/get-incomes/types";

export default function Dashboard() {
  const [incomes, setIncomes] = useState<Partial<IIncome>[]>();
  // const uid = "xP5DC40Am1fjrM5GsvEzPEhCURG3";
  const handleAdd = async () => {
    if (!incomes) return;

    await api.post(API.INCOMES.POST_MULTIPLE_INCOMES, incomes);
  };

  const handleEdit = async () => {
    const data = {
      fund_alias: "BBAS3",
    };

    await api.patch(API.INCOMES.PATCH_INCOME + "Vez01JLbkbk9Vlf3hQZj", data);
  };

  const handleDelete = async () => {
    await api.delete(API.INCOMES.DELETE_INCOME + "HEyNxvlFao1Zv4BPs0Jr");
  };

  const { response: incomesData } = useSWR(API.INCOMES.GET_INCOMES);
  const { response: incomesFund } = useSWR(API.INCOMES.GET_INCOMES_BY_FUND + "PETR4");
  const { response: transactions } = useSWR(API.TRANSACTIONS.GET_TRANSACTIONS);
  const { response: transactionsFund } = useSWR(
    API.TRANSACTIONS.GET_TRANSACTIONS_BY_FUND + "PETR4"
  );

  console.log({ incomesData }, { transactions }, { incomesFund }, { transactionsFund });

  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={handleAdd}>POST FUND</button>
      <button onClick={handleEdit}>PATCH FUND</button>
      <button onClick={handleDelete}>DELETE FUND</button>
      <ExcelReader onFile={setIncomes} />
    </main>
  );
}
