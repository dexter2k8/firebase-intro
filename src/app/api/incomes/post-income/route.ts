import { AxiosError } from "axios";
import { addDoc, collection } from "firebase/firestore";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { IPostIncome } from "./types";

export async function POST(req: NextRequest) {
  const body: IPostIncome = await req.json();

  try {
    const token = cookies().get("funds-explorer-token")?.value;
    if (!validateUser(token)) return NextResponse.json("Invalid token", { status: 401 });

    const incomesRef = collection(db, "incomes");
    await addDoc(incomesRef, { ...body });

    return NextResponse.json("Fund created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
