import { AxiosError } from "axios";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import moment from "moment";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import { calculatePatrimonyAndIncome } from "./utils";
import type { IDonutData } from "@/app/(pages)/dashboard/__components__/Charts/Donut/types";
import type { IFund } from "../../funds/get-funds/types";
import type { ITransaction } from "../../transactions/get-transactions/types";
import type { IIncome } from "../get-incomes/types";
import type { IGetIncomesPatrimony } from "./types";

export async function GET() {
  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = await validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const incomesRef = collection(db, "incomes");
    const fundsRef = collection(db, "funds");
    const transactionsRef = collection(db, "transactions");

    const qFunds = query(fundsRef);
    const qIncomes = query(incomesRef, where("user_id", "==", uid), orderBy("updated_at", "desc"));
    const qTransactions = query(
      transactionsRef,
      where("user_id", "==", uid),
      orderBy("bought_at", "desc")
    );

    const incomesDoc = await getDocs(qIncomes);
    const transactionsDoc = await getDocs(qTransactions);

    let transactions = transactionsDoc?.docs.map((doc) => {
      const data = doc.data();
      const boughtAtDate = data.bought_at.toDate();
      const bought_at = moment(boughtAtDate).format("YYYY-MM-DD");
      return { ...data, bought_at, id: doc.id };
    }) as ITransaction[];

    let incomes = incomesDoc?.docs.map((doc) => {
      const data = doc.data();
      const updatedAtDate = data.updated_at.toDate();
      const updated_at = moment(updatedAtDate).format("YYYY-MM-DD");
      return { ...data, updated_at, id: doc.id };
    }) as IIncome[];

    const fundsDoc = await getDocs(qFunds);
    const funds = fundsDoc?.docs.map((doc) => ({ alias: doc.id, ...doc.data() })) as IFund[];
    incomes = incomes.filter((income) => funds.some((fund) => fund.alias === income.fund_alias));
    transactions = transactions.filter((transaction) =>
      funds.some((fund) => fund.alias === transaction.fund_alias)
    );

    const data: IGetIncomesPatrimony[] = calculatePatrimonyAndIncome(incomes, transactions, funds);

    const patrimony: IDonutData[] = data.map((income) => {
      return {
        name: income.type,
        value: income.total_patrimony,
      };
    });

    const profit: IDonutData[] = data.map((income) => {
      return {
        name: income.type,
        value: income.total_income,
      };
    });

    return Response.json({ patrimony, profit }, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
