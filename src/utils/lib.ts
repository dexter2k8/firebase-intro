import jwt from "jsonwebtoken";
import moment from "moment";
import type { FactoryArg } from "imask";
import type { JwtPayload } from "jsonwebtoken";

export const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export function currencyToNumber(currency: string) {
  const cleanString = currency.replace(/[^0-9,.-]/g, "");
  const raw = cleanString.replace(/\./g, "").replace(",", ".");
  const numberValue = parseFloat(raw);
  return numberValue;
}

export function formatDate(date: string) {
  return moment(date).format("DD/MM/YYYY");
}

export function parseDate(date: string | Date) {
  if (!date) return;
  if (date instanceof Date) return moment(date).format("YYYY-MM-DD");
  const parsedDate = moment(date, "DD/MM/YYYY");
  if (!parsedDate.isValid()) return;
  return parsedDate.format("YYYY-MM-DD");
}

export const currencyMask: FactoryArg = {
  mask: "R$num.00",
  blocks: {
    num: {
      mask: Number,
      thousandsSeparator: " ",
    },
  },
};

export function formatBRL(value: string) {
  // Remove todos os caracteres que não sejam dígitos ou vírgulas
  const cleaned = value.replace(/[^\d,]/g, "");

  // Separa a parte inteira da decimal com base na vírgula
  const parts = cleaned.split(",");

  let integerPart = parts[0];
  let decimalPart = parts[1];

  // Adiciona o ponto como separador de milhar
  if (integerPart.length > 3) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  let formatted = integerPart;

  // Adiciona a vírgula como separador decimal
  if (decimalPart !== undefined) {
    decimalPart = decimalPart.slice(0, 2); // Limita a 2 casas decimais
    formatted += "," + decimalPart;
  }

  // Gera o valor "raw" com ponto como separador decimal
  const raw = formatted.replace(/\./g, "").replace(",", ".");

  return {
    value: formatted,
    raw: raw,
  };
}

const secureURL = process.env.NEXT_PUBLIC_SECURE_TOKEN_URL || "";
export async function validateUser(token?: string): Promise<string | undefined> {
  const fetchKids = await fetch(secureURL).then((res) => res.json());
  const validKids = Object.keys(fetchKids);

  if (!token) return undefined;

  const decoded = jwt.decode(token, { complete: true }) as JwtPayload;

  if (!decoded?.header.kid || !validKids.includes(decoded?.header.kid)) {
    return undefined;
  }

  const current = moment();
  const exp = moment.unix(decoded?.payload.exp);
  if (current.isAfter(exp)) {
    return undefined;
  }

  return decoded?.payload.user_id;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeToken(token: string): any {
  const [, payload] = token.split(".");
  const decodedPayload = Buffer.from(payload, "base64").toString("utf-8");
  return JSON.parse(decodedPayload);
}
