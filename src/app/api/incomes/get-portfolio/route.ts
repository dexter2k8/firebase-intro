import { AxiosError } from "axios";
import { collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";
import moment from "moment";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import { calculateMonthlySums } from "./utils";
import type { NextRequest } from "next/server";
import type { IFunds } from "../../funds/get-funds/types";
import type { ITransaction } from "../../transactions/get-transactions/types";
import type { IIncome } from "./types";

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url);
  try {
    const type = searchParams.searchParams.get("type");
    const initDate = searchParams.searchParams.get("initDate");
    const endDate = searchParams.searchParams.get("endDate");

    const parsedInitDate = Timestamp.fromDate(new Date(initDate ?? ""));
    const parsedEndDate = Timestamp.fromDate(new Date(endDate ?? ""));

    const token = cookies().get("funds-explorer-token")?.value;
    const uid = validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const incomesRef = collection(db, "incomes");
    const fundsRef = collection(db, "funds");
    const transactionsRef = collection(db, "transactions");

    const qFunds = query(fundsRef, where("type", "==", type));
    const qIncomes = query(
      incomesRef,
      where("user_id", "==", uid),
      where("updated_at", ">=", parsedInitDate),
      where("updated_at", "<=", parsedEndDate),
      orderBy("updated_at", "desc")
    );
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

    if (type) {
      const fundsDoc = await getDocs(qFunds);
      const funds = fundsDoc?.docs.map((doc) => ({ alias: doc.id })) as IFunds[];
      incomes = incomes.filter((income) => funds.some((fund) => fund.alias === income.fund_alias));
      transactions = transactions.filter((transaction) =>
        funds.some((fund) => fund.alias === transaction.fund_alias)
      );
    }

    const data = calculateMonthlySums(incomes, transactions, initDate, endDate);

    // const count = data?.length;

    return NextResponse.json({ data, incomes, transactions }, { status: 200 });
    // return NextResponse.json({ data, count }, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
