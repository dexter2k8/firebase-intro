import { AxiosError } from "axios";
import admin from "firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { IUser } from "@/store/useAuth/types";

export async function GET() {
  const token = cookies().get("funds-explorer-token")?.value;
  if (!token) return NextResponse.json({ message: "Token não fornecido." }, { status: 400 });

  try {
    const listUsers = await admin.auth().listUsers();

    if (!listUsers) {
      return NextResponse.json({ message: "Not users found" }, { status: 401 });
    }

    const users: IUser[] = listUsers.users.map((user) => ({
      uid: user.uid,
      email: user.email as string,
      name: user.displayName as string,
      avatar: user.photoURL as string,
    }));

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
// This line indicates that this function should be executed in Node.js environment.
// It's necessary to use the "edge" runtime, necessary to firebase-admin don't crash on vercel
export const runtime = "nodejs";
