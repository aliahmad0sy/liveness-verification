const CRYPTO = new Set(["BTC", "ETH", "LTC", "BNB", "TRX", "SOL", "TON", "USDT", "USDC"]);

export function formatAmount(amount: string | number, code: string): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(n)) return "0";
  return new Intl.NumberFormat("ar-SA", {
    minimumFractionDigits: CRYPTO.has(code) ? 6 : 2,
    maximumFractionDigits: CRYPTO.has(code) ? 8 : 2,
  }).format(n);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(d);
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 60) return "الآن";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  return `منذ ${Math.floor(hrs / 24)} يوم`;
}
