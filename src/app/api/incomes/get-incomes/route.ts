import { AxiosError } from "axios";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { IIncome } from "./types";

export async function GET() {
  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = await validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const incomesRef = collection(db, "incomes");
    // * SEE OBSERVATIONS at end of file
    const q = query(incomesRef, where("user_id", "==", uid), orderBy("updated_at", "desc"));
    const response = await getDocs(q);

    const data = response?.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as IIncome[];
    const count = data?.length;

    return NextResponse.json({ data, count }, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

// Em uma query do firebase, o campo em ORDERBY precisa ser o mesmo de WHERE.
// Para consultas onde ORDERBY e WHERE são diferentes, é preciso indexar os campos.
// - Vá ao console do Firebase.
// - Acesse Firestore Database.
// - No menu à esquerda, clique em Indexes.
// - Clique em Create Index.
// - Preencha os campos:
//   - Collection: incomesRef (ou o nome da sua coleção).
//   - Fields:
//   - user_id como Ascending ou Descending (geralmente Ascending).
//   - updated_at como Descending (de acordo com sua consulta).
