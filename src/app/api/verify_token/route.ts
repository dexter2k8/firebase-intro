import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAppCheck } from "firebase-admin/app-check";

export async function POST() {
  const appCheck = getAppCheck();

  const token = cookies().get("funds-explorer-token")?.value;
  if (!token) return NextResponse.json({ error: "Token não fornecido." }, { status: 400 });

  try {
    const result = await appCheck.verifyToken(token);
    if (!result) return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    return NextResponse.json({ message: "Token de App Check válido.", result }, { status: 200 });
  } catch (error) {
    console.error("Erro ao verificar token de App Check:", error);
    return NextResponse.json({ error: "Falha ao verificar o token." }, { status: 500 });
  }
}
