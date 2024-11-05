"use client";
import { useState } from "react";
// import {
// collection,
// doc,
// getDocs,
// orderBy,
// query,
// Timestamp,
// where,
// writeBatch,
// } from "firebase/firestore";
// import moment from "moment";
import { useSWR } from "@/hook/useSWR";
import api from "@/services/api";
// import { db } from "@/services/firebase";
import { API } from "@/utils/paths";
import ExcelReader from "../__components__/ExcelReader";
import type { IIncome } from "@/app/api/incomes/get-incomes/types";

export default function Dashboard() {
  const [incomes, setIncomes] = useState<Partial<IIncome>[]>();

  const { response: incomesData } = useSWR<{ data: IIncome[] }>(API.INCOMES.GET_INCOMES);
  // Função auxiliar para verificar se o income já existe na base de dados
  const incomeFound = (incomeExcel: Partial<IIncome>, incomesBase: IIncome[]) =>
    incomesBase?.some(
      (incomeBase) =>
        incomeBase.updated_at === incomeExcel.updated_at && incomeBase.income === incomeExcel.income
    );

  const handleAdd = async () => {
    if (!incomes) return;

    // Filtra os incomes do excel que já existem na base de dados
    const filteredIncomes = incomes.filter((income) => !incomeFound(income, incomesData.data));

    await api.post(API.INCOMES.POST_MULTIPLE_INCOMES, filteredIncomes);
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

  // const initDate = moment().startOf("year").format("YYYY-MM-DD");
  // const endDate = moment().startOf("day").format("YYYY-MM-DD");
  // const { response: portfolio } = useSWR(API.INCOMES.GET_PORTFOLIO, {
  //   initDate,
  //   endDate,
  //   type: "FII",
  // });
  const { response: incomesFund } = useSWR(API.INCOMES.GET_INCOMES_BY_FUND + "PETR4");
  // const { response: transactions } = useSWR(API.TRANSACTIONS.GET_TRANSACTIONS);
  // const { response: portfolioByType } = useSWR(API.INCOMES.GET_PORTFOLIO_BY_TYPE);
  // const { response: transactionsFund } = useSWR(
  //   API.TRANSACTIONS.GET_TRANSACTIONS_BY_FUND + "PETR4"
  // );
  const { response: funds } = useSWR(API.FUNDS.GET_FUNDS);

  console.log(funds);

  console.log(incomesFund);

  return (
    <main>
      <div>
        <h1>Dashboard</h1>
        {/* <button
          onClick={async () => {
            const uid = "xP5DC40Am1fjrM5GsvEzPEhCURG3";
            const parsedInitDate = Timestamp.fromDate(new Date(initDate ?? ""));
            const parsedEndDate = Timestamp.fromDate(new Date(endDate ?? ""));

            const incomesRef = collection(db, "incomes");

            const q = query(
              incomesRef,
              where("user_id", "==", uid),
              where("updated_at", ">=", parsedInitDate),
              where("updated_at", "<=", parsedEndDate),
              orderBy("updated_at", "desc")
            );
            const response = await getDocs(q);

            const data = response?.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as IIncome[];
            console.log(data);
          }}
        >
          GET FUND
        </button> */}
        <button onClick={handleAdd}>POST FUND</button>
        <button onClick={handleEdit}>PATCH FUND</button>
        <button onClick={handleDelete}>DELETE FUND</button>
        <ExcelReader onFile={setIncomes} />
      </div>
      {/*<div>
        <button
          onClick={() => {
            const batch = writeBatch(db);
            const ref = collection(db, "funds");

            fundsDB.forEach((db) => {
              const docRef = doc(ref, db.alias);
              batch.set(docRef, { ...db });
              // batch.set(docRef, { ...db, bought_at: Timestamp.fromDate(new Date(db.bought_at)) });
            });

            batch.commit();
          }}
        >
          POPULATE DATABASE
        </button>
      </div>*/}
    </main>
  );
}
