import { AxiosError } from "axios";
import { collection, doc, setDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { TPostFund } from "./types";

export async function POST(req: NextRequest) {
  const body: TPostFund = await req.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { alias, ...rest } = body;

  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = await validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const fundsRef = collection(db, "funds");
    const newFundRef = doc(fundsRef, alias);
    await setDoc(newFundRef, body);

    return NextResponse.json("Fund created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
