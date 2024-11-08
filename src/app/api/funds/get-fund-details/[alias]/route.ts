import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import { validateUser } from "@/utils/lib";
import type { NextRequest } from "next/server";
import type { IFundDetails } from "./types";

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = await validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const alias = req.nextUrl.pathname.split("/").pop() ?? "";

    const quote = (await yahooFinance.quote(`${alias}.SA`)) as unknown as IFundDetails;

    // const data: IFundDetailsResponse = {
    //   alias: quote.symbol.split(".")[0],
    //   longName: quote.longName,
    //   price: quote.regularMarketPrice,
    //   variation: quote.regularMarketChangePercent,
    //   pvp: quote.priceToBook,
    //   dy: quote.trailingAnnualDividendYield * 100,
    //   growth: quote.fiftyTwoWeekChangePercent,
    // };

    const count = 1;

    return NextResponse.json({ quote, count }, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
