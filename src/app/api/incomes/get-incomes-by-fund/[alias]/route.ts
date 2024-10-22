import { AxiosError } from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { isValidToken } from "@/utils/lib";
import type { NextRequest } from "next/server";
import type { IIncome } from "../../get-incomes/types";

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("funds-explorer-token")?.value;
    if (!isValidToken(token)) return NextResponse.json("Invalid token", { status: 401 });

    const alias = req.nextUrl.pathname.split("/").pop() ?? "";

    const incomesRef = collection(db, "incomes");
    const q = query(incomesRef, where("fund_alias", "==", alias));
    const response = await getDocs(q);

    const data = response?.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as IIncome[];
    const count = data?.length;

    return NextResponse.json({ data, count }, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
