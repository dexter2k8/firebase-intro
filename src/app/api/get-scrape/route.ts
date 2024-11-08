import chrome from "chrome-aws-lambda";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const getType = (base: string) => {
  const type = {
    Ação: "acoes",
    FII: "fundos-imobiliarios",
    BDR: "bdrs",
  };
  return type[base as keyof typeof type];
};

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url);
    const param_type = searchParams.searchParams.get("type");
    const param_alias = searchParams.searchParams.get("fund_alias");

    const type = getType(param_type!);
    const fund_alias = param_alias?.toLowerCase();

    const browser = await chrome.puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
      defaultViewport: { width: 128, height: 128 },
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
    );

    await page.goto(`https://statusinvest.com.br/${type}/${fund_alias}`, {
      waitUntil: "domcontentloaded",
    });

    const value = await page.evaluate(() => {
      const element = document.querySelector(".d-md-inline-block .value");
      const shareValue = element?.textContent?.trim();
      const parsedValue = Number(shareValue?.replace(",", "."));
      return shareValue ? parsedValue : null;
    });

    const valueGrowth = await page.evaluate(() => {
      const element = document.querySelector(
        "span[title*='Variação do valor do ativo com base no dia anterior'] .v-align-middle"
      );
      const value = element?.textContent?.trim();
      const parsedValue = Number(value?.slice(0, -1).replace(",", "."));
      return value ? parsedValue : null;
    });

    const dy = await page.evaluate(() => {
      const element = document.querySelector(
        'div[title*="Dividend Yield com base nos últimos 12 meses"] .value'
      );
      const value = element?.textContent?.trim();
      const parsedValue = Number(value?.replace(",", "."));
      return value ? parsedValue : null;
    });

    const growth = await page.evaluate(() => {
      const element = document.querySelector(
        'div[title*="Valorização no preço do ativo com base nos últimos 12 meses"] .value'
      );
      const value = element?.textContent?.trim();
      const parsedValue = Number(value?.slice(0, -1).replace(",", "."));
      return value ? parsedValue : null;
    });

    const pvp = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        "div.top-info.top-info-2.top-info-md-3.top-info-lg-n.d-flex.justify-between .value"
      );
      const value = elements.length > 1 ? elements[1]?.textContent?.trim() : null;
      const parsedValue = Number(value?.replace(",", "."));
      return value ? parsedValue : null;
    });

    await browser.close();

    return new Response(JSON.stringify({ value, valueGrowth, dy, growth, pvp }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao fazer scraping:", error);
    return new Response(JSON.stringify({ message: "Erro ao buscar os dados" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
