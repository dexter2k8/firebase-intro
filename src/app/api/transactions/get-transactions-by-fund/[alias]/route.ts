import { AxiosError } from "axios";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { NextRequest } from "next/server";
import type { ITransaction } from "../../get-transactions/types";

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const alias = req.nextUrl.pathname.split("/").pop() ?? "";

    const transactionsRef = collection(db, "transactions");
    const q = query(
      transactionsRef,
      where("fund_alias", "==", alias),
      where("user_id", "==", uid),
      orderBy("bought_at", "desc")
    );
    const response = await getDocs(q);

    const data = response?.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as ITransaction[];
    const count = data?.length;

    return NextResponse.json({ data, count }, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
