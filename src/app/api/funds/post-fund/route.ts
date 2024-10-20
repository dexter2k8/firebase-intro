import { AxiosError } from "axios";
import type { NextRequest } from "next/server";
// import type { IResponse } from "../types";
import { db } from "@/services/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { IPostFund } from "./types";

export async function POST(req: NextRequest) {
  const body: IPostFund = await req.json();
  const { alias, ...rest } = body;

  try {
    // const token = cookies().get("funds-explorer-token")?.value;
    // if (!token) return Response.json("Token not found", { status: 401 });

    const fundsRef = collection(db, "funds");
    const newFundRef = doc(fundsRef, alias);
    await setDoc(newFundRef, { ...rest });

    return Response.json("Fund created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return Response.json(error.response?.data.message, { status: error.response?.status });
    }
    return Response.json("Internal Server Error", { status: 500 });
  }
}
