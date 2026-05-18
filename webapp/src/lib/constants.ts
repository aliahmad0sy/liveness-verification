export const CURRENCIES = [
  { code: "USD", name: "US Dollar", nameAr: "دولار أمريكي", symbol: "$", type: "FIAT" as const, decimals: 2, emoji: "🇺🇸" },
  { code: "EUR", name: "Euro", nameAr: "يورو", symbol: "€", type: "FIAT" as const, decimals: 2, emoji: "🇪🇺" },
  { code: "AED", name: "UAE Dirham", nameAr: "درهم إماراتي", symbol: "د.إ", type: "FIAT" as const, decimals: 2, emoji: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", nameAr: "ريال سعودي", symbol: "ر.س", type: "FIAT" as const, decimals: 2, emoji: "🇸🇦" },
  { code: "SYP", name: "Syrian Pound", nameAr: "ليرة سورية", symbol: "ل.س", type: "FIAT" as const, decimals: 0, emoji: "🇸🇾" },
  { code: "EGP", name: "Egyptian Pound", nameAr: "جنيه مصري", symbol: "ج.م", type: "FIAT" as const, decimals: 2, emoji: "🇪🇬" },
  { code: "TRY", name: "Turkish Lira", nameAr: "ليرة تركية", symbol: "₺", type: "FIAT" as const, decimals: 2, emoji: "🇹🇷" },
  { code: "USDT", name: "Tether", nameAr: "تيثر", symbol: "USDT", type: "CRYPTO" as const, decimals: 6, emoji: "💰", network: "TRC20" },
  { code: "BTC", name: "Bitcoin", nameAr: "بيتكوين", symbol: "₿", type: "CRYPTO" as const, decimals: 8, emoji: "₿" },
  { code: "ETH", name: "Ethereum", nameAr: "إيثيريوم", symbol: "Ξ", type: "CRYPTO" as const, decimals: 8, emoji: "Ξ" },
  { code: "LTC", name: "Litecoin", nameAr: "لايتكوين", symbol: "Ł", type: "CRYPTO" as const, decimals: 8, emoji: "Ł" },
  { code: "BNB", name: "Binance Coin", nameAr: "بينانس كوين", symbol: "BNB", type: "CRYPTO" as const, decimals: 8, emoji: "🔶" },
  { code: "SOL", name: "Solana", nameAr: "سولانا", symbol: "SOL", type: "CRYPTO" as const, decimals: 8, emoji: "◎" },
  { code: "TRX", name: "TRON", nameAr: "ترون", symbol: "TRX", type: "CRYPTO" as const, decimals: 6, emoji: "🔴" },
  { code: "USDC", name: "USD Coin", nameAr: "يو إس دي كوين", symbol: "USDC", type: "CRYPTO" as const, decimals: 6, emoji: "🔵" },
  { code: "PayPal", name: "PayPal", nameAr: "باي بال", symbol: "PP", type: "EBANK" as const, decimals: 2, emoji: "🅿️" },
  { code: "Payeer", name: "Payeer", nameAr: "باير", symbol: "PR", type: "EBANK" as const, decimals: 2, emoji: "💳" },
  { code: "PerfectMoney", name: "Perfect Money", nameAr: "برفكت موني", symbol: "PM", type: "EBANK" as const, decimals: 2, emoji: "💵" },
] as const;

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  DEPOSIT: "إيداع",
  WITHDRAWAL: "سحب",
  TRANSFER_IN: "استلام تحويل",
  TRANSFER_OUT: "إرسال تحويل",
  EXCHANGE: "تحويل عملة",
  CARD_FUNDING: "تمويل بطاقة",
  CARD_PAYMENT: "دفع بالبطاقة",
  MASS_PAYOUT: "دفع جماعي",
  FEE: "رسوم",
  COMMISSION: "عمولة",
};

export const TRANSACTION_STATUS_LABELS: Record<string, string> = {
  PENDING: "معلق",
  PROCESSING: "قيد المعالجة",
  COMPLETED: "مكتمل",
  FAILED: "فشل",
  CANCELLED: "ملغي",
  REFUNDED: "مُستردّ",
};

export const KYC_STATUS_LABELS: Record<string, string> = {
  NONE: "غير مقدم",
  PENDING: "قيد المراجعة",
  APPROVED: "موافق عليه",
  REJECTED: "مرفوض",
};

export const RATE_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes in ms

export const CARD_ISSUANCE_FEE = 5; // USD

export const AGENT_COMMISSION_RATES = {
  min: 0.01,
  max: 0.015,
  minGuarantee: 1, // USD
};

export const PAGINATION_LIMIT = 20;
