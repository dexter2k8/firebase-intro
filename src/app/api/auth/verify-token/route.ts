import { onIdTokenChanged } from "firebase/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/services/firebase";
import type { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";

const validKids = [
  "718f4df92ad175f6a0307ab65d8f67f054fa1e5f",
  "8d9befd3effcbbc82c83ad0c972c8ea978f6f137",
];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token } = body;
  if (!token) return NextResponse.json(false, { status: 200 });

  try {
    const decoded = jwt.decode(token, { complete: true }) as JwtPayload;
    if (!decoded?.header.kid || !validKids.includes(decoded?.header.kid)) {
      return NextResponse.json(false, { status: 200 });
    }

    const authenticated = await new Promise<boolean>((resolve) => {
      onIdTokenChanged(auth, async (user) => {
        if (user) {
          const newToken = await user.getIdToken();
          cookies().set({
            name: "funds-explorer-token",
            value: newToken,
            httpOnly: true,
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
          });
          resolve(true); // Usuário autenticado
        } else {
          resolve(false); // Nenhum usuário autenticado
        }
      });
    });

    return NextResponse.json(authenticated, { status: 200 });
  } catch (error) {
    console.error("Erro ao verificar token de App Check:", error);
    return NextResponse.json({ message: "Falha ao verificar o token." }, { status: 500 });
  }
}
