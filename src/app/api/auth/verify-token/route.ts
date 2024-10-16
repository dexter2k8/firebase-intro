import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import moment from "moment";
import { auth } from "@/services/firebase";

const validKids = [
  "718f4df92ad175f6a0307ab65d8f67f054fa1e5f",
  "8d9befd3effcbbc82c83ad0c972c8ea978f6f137",
];

export async function GET() {
  const token = cookies().get("funds-explorer-token")?.value;
  if (!token) return NextResponse.json({ message: "Token not found." }, { status: 400 });

  try {
    const decoded = jwt.decode(token, { complete: true }) as JwtPayload;
    if (!decoded?.header.kid || !validKids.includes(decoded?.header.kid)) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const current = moment();
    const exp = moment.unix(decoded?.payload.exp);
    if (current.isAfter(exp)) {
      const newToken = auth.currentUser?.getIdToken(true);
      console.log("NEW TOKEN", newToken);
    }

    return NextResponse.json(true, { status: 200 });
  } catch (error) {
    console.error("Erro ao verificar token de App Check:", error);
    return NextResponse.json({ message: "Falha ao verificar o token." }, { status: 500 });
  }
}
