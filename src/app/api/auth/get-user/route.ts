import { AxiosError } from "axios";
import admin from "firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { IGetCurrentUser } from "@/store/useAuth/types";

export async function GET() {
  const token = cookies().get("funds-explorer-token")?.value;
  if (!token) return NextResponse.json({ message: "Token não fornecido." }, { status: 400 });

  try {
    const authenticated = await admin.auth().verifyIdToken(token);

    if (!authenticated) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const user: IGetCurrentUser = {
      name: authenticated?.name as string,
      email: authenticated?.email as string,
      avatar: authenticated?.picture as string,
      uid: authenticated?.uid,
    };

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
