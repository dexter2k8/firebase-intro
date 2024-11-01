import { AxiosError } from "axios";
import { collection, getDocs } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { IFund } from "./types";

export async function GET() {
  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = await validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const fundsRef = collection(db, "funds");
    const response = await getDocs(fundsRef);

    const data = response?.docs.map((doc) => ({ ...doc.data(), alias: doc.id })) as IFund[];
    const count = data?.length;

    return NextResponse.json({ data, count }, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
