import { AxiosError } from "axios";
import { deleteDoc, doc } from "firebase/firestore";
import { cookies } from "next/headers";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = await validateUser(token);
    if (!uid) return Response.json("Invalid token", { status: 401 });

    const id = req.nextUrl.pathname.split("/").pop() ?? "";

    const incomesRef = doc(db, "incomes", id);
    await deleteDoc(incomesRef);

    return Response.json("Fund deleted", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return Response.json(error.response?.data.message, { status: error.response?.status });
    }
    return Response.json("Internal Server Error", { status: 500 });
  }
}
