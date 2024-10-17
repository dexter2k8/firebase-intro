import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { IGetCurrentUser } from "@/store/useAuth/types";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ message: error?.code as string }, { status: 401 });
  }
}
