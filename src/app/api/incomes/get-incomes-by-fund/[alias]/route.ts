import { AxiosError } from "axios";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { NextRequest } from "next/server";
import type { IIncome } from "../../get-incomes/types";

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const alias = req.nextUrl.pathname.split("/").pop() ?? "";

    const incomesRef = collection(db, "incomes");
    // * SEE OBSERVATIONS at end of get-incomes file
    const q = query(
      incomesRef,
      where("fund_alias", "==", alias),
      where("user_id", "==", uid),
      orderBy("updated_at", "desc")
    );

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
