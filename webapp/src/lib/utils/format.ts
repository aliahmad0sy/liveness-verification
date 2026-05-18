export function formatCurrency(
  amount: string | number,
  currencyCode: string,
  locale: string = "ar-SA"
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0";

  const cryptoCurrencies = ["BTC", "ETH", "LTC", "TRX", "BNB", "SOL", "TON"];
  const isCrypto = cryptoCurrencies.includes(currencyCode.toUpperCase());

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: isCrypto ? 6 : 2,
    maximumFractionDigits: isCrypto ? 8 : 2,
  }).format(num);
}

export function formatDate(date: Date | string, locale: string = "ar-SA"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `منذ ${days} يوم`;
  if (hours > 0) return `منذ ${hours} ساعة`;
  if (minutes > 0) return `منذ ${minutes} دقيقة`;
  return "الآن";
}

export function truncateAddress(address: string, chars: number = 6): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function maskCardNumber(cardNumber: string): string {
  return `•••• •••• •••• ${cardNumber.slice(-4)}`;
}
