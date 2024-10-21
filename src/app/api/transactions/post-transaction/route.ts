import { AxiosError } from "axios";
import { addDoc, collection } from "firebase/firestore";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { isValidToken } from "@/utils/lib";
import type { IPostTransaction } from "./types";

export async function POST(req: NextRequest) {
  const body: IPostTransaction = await req.json();

  try {
    const token = cookies().get("funds-explorer-token")?.value;
    if (!isValidToken(token)) return NextResponse.json("Invalid token", { status: 401 });

    const fundsRef = collection(db, "transactions");
    await addDoc(fundsRef, { ...body });

    return NextResponse.json("Transaction created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
