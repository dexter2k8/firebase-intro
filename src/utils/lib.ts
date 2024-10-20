import type { FactoryArg } from "imask";
import moment from "moment";
import jwt, { JwtPayload } from "jsonwebtoken";

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

const validKids = [
  "718f4df92ad175f6a0307ab65d8f67f054fa1e5f",
  "8d9befd3effcbbc82c83ad0c972c8ea978f6f137",
];
export function isValidToken(token?: string): boolean {
  if (!token) return false;

  const decoded = jwt.decode(token, { complete: true }) as JwtPayload;
  if (!decoded?.header.kid || !validKids.includes(decoded?.header.kid)) {
    return false;
  }

  const current = moment();
  const exp = moment.unix(decoded?.payload.exp);
  if (current.isAfter(exp)) {
    return false;
  }

  return true;
}
