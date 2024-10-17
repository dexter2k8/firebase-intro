import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { auth } from "@/services/firebase";
import { onIdTokenChanged } from "firebase/auth";

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

    const authenticated = await new Promise<boolean>((resolve) => {
      onIdTokenChanged(auth, async (user) => {
        if (user) {
          const newToken = await user.getIdToken();
          cookies().set({
            name: "funds-explorer-token",
            value: newToken,
            httpOnly: true,
            maxAge: 60 * 60, // 1 hour
            path: "/",
          });
          resolve(true); // Usuário autenticado
        } else {
          resolve(false); // Nenhum usuário autenticado
        }
      });
    });

    if (!authenticated) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json(true, { status: 200 });
  } catch (error) {
    console.error("Erro ao verificar token de App Check:", error);
    return NextResponse.json({ message: "Falha ao verificar o token." }, { status: 500 });
  }
}
