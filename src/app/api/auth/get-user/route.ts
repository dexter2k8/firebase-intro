import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { IFirebaseUser } from "./types";
import type { IGetCurrentUser } from "@/store/useAuth/types";

export async function GET() {
  const token = cookies().get("funds-explorer-token")?.value;
  if (!token) return NextResponse.json({ message: "Token não fornecido." }, { status: 400 });

  const result = jwt.decode(token) as IFirebaseUser | null;
  if (result === null) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const user: IGetCurrentUser = {
    name: result.name,
    email: result.email,
    avatar: result.picture,
    uid: result.user_id,
  };

  return NextResponse.json(user, { status: 200 });
}
