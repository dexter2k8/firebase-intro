import { AxiosError } from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/services/firebase";
import type { IGetCurrentUser } from "@/store/useAuth/types";

export async function GET() {
  const token = cookies().get("funds-explorer-token")?.value;
  if (!token) return NextResponse.json({ message: "Token não fornecido." }, { status: 400 });

  try {
    const authenticated = await new Promise<boolean>((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false); // Nenhum usuário autenticado
        }
      });
    });
    if (!authenticated) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const user: IGetCurrentUser = {
      name: auth.currentUser?.displayName as string,
      email: auth.currentUser?.email as string,
      avatar: auth.currentUser?.photoURL as string,
      uid: auth.currentUser?.uid as string,
    };

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
