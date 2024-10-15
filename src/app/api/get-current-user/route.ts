import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { IFirebaseUser, IGetCurrentUser } from "./types";

export async function POST() {
  const token = cookies().get("funds-explorer-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Token não fornecido." }, { status: 400 });
  }

  const result = jwt.decode(token as string) as IFirebaseUser | null;
  if (result === null) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const user: IGetCurrentUser = {
    name: result.name,
    email: result.email,
    avatar: result.picture,
  };

  return NextResponse.json(user, { status: 200 });
}
