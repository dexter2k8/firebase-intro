import { onIdTokenChanged } from "firebase/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token } = body;
  if (!token) return NextResponse.json(false, { status: 200 });

  try {
    if (!validateUser(token)) return NextResponse.json(false, { status: 200 });

    const isAuthenticated = await new Promise<boolean>((resolve) => {
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

    return NextResponse.json(isAuthenticated, { status: 200 });
  } catch (error) {
    console.error("Erro ao verificar token de App Check:", error);
    return NextResponse.json({ message: "Falha ao verificar o token." }, { status: 500 });
  }
}
