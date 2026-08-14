export const DEPOSIT_PERCENTAGE = 0.5;

export function calculateDeposit(price: number): number {
  return Math.round(price * DEPOSIT_PERCENTAGE);
}

export function calculateBalance(
  price: number,
  deposit: number
): number {
  return Math.max(price - deposit, 0);
}

export function formatCurrency(
  value: number | null
): string {
  if (value === null) {
    return "Quote Required";
  }

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}