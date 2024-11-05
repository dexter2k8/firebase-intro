import { AxiosError } from "axios";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import moment from "moment";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import { calculateIncomeDetails } from "../utils";
import type { NextRequest } from "next/server";
import type { ITransaction } from "@/app/api/transactions/get-transactions/types";
import type { IIncome } from "../../get-incomes/types";

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = await validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const alias = req.nextUrl.pathname.split("/").pop() ?? "";

    const incomesRef = collection(db, "incomes");
    const transactionsRef = collection(db, "transactions");
    // * SEE OBSERVATIONS at end of get-incomes file
    const qIncomes = query(
      incomesRef,
      where("fund_alias", "==", alias),
      where("user_id", "==", uid),
      orderBy("updated_at", "desc")
    );

    const qTransactions = query(
      transactionsRef,
      where("fund_alias", "==", alias),
      where("user_id", "==", uid),
      orderBy("bought_at", "desc")
    );

    const response = await getDocs(qIncomes);
    const transactionsDoc = await getDocs(qTransactions);

    const transactions = transactionsDoc?.docs.map((doc) => {
      const data = doc.data();
      const boughtAtDate = data.bought_at.toDate();
      const bought_at = moment(boughtAtDate).format("YYYY-MM-DD");
      return { ...data, bought_at, id: doc.id };
    }) as ITransaction[];

    const incomes = response?.docs.map((doc) => {
      const data = doc.data();
      const updatedAtDate = data.updated_at.toDate();
      const updated_at = moment(updatedAtDate).format("YYYY-MM-DD");
      return { ...data, updated_at, id: doc.id };
    }) as IIncome[];

    const data = calculateIncomeDetails(incomes, transactions);

    const count = data?.length;

    return NextResponse.json({ data, count }, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
