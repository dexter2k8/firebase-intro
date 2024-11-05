import { AxiosError } from "axios";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import moment from "moment";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { IFund } from "../../funds/get-funds/types";
import type { ITransaction } from "../../transactions/get-transactions/types";

export async function GET() {
  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = await validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const fundsRef = collection(db, "funds");
    const transactionsRef = collection(db, "transactions");

    const qFunds = query(fundsRef);

    const qTransactions = query(
      transactionsRef,
      where("user_id", "==", uid),
      orderBy("bought_at", "desc")
    );

    const transactionsDoc = await getDocs(qTransactions);
    const fundsDoc = await getDocs(qFunds);
    const funds = fundsDoc?.docs.map((doc) => ({ ...doc.data(), alias: doc.id })) as IFund[];

    const data = transactionsDoc?.docs.map((doc) => {
      const data = doc.data();
      const boughtAtDate = data.bought_at.toDate();
      const bought_at = moment(boughtAtDate).utc().format("YYYY-MM-DD");
      const fundData = funds.find((fund) => fund.alias === data.fund_alias);
      const fund = { ...fundData };
      delete fund.alias;
      return { ...data, ...fund, bought_at, id: doc.id };
    }) as ITransaction[];

    const count = data?.length;

    return Response.json({ data, count }, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
