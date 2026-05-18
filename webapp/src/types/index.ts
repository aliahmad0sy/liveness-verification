export type UserRole = "USER" | "MERCHANT" | "AGENT" | "ADMIN" | "SUPER_ADMIN";
export type KYCStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";
export type TransactionType =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "EXCHANGE"
  | "CARD_FUNDING"
  | "CARD_PAYMENT"
  | "MASS_PAYOUT"
  | "FEE"
  | "COMMISSION";
export type TransactionStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";
export type CurrencyType = "FIAT" | "CRYPTO" | "EBANK";
export type CardStatus = "ACTIVE" | "FROZEN" | "EXPIRED" | "CANCELLED";

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  kycStatus: KYCStatus;
  isActive: boolean;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  referralCode?: string;
  avatarUrl?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  symbol: string;
  type: CurrencyType;
  decimals: number;
  isActive: boolean;
  logoUrl?: string;
  network?: string;
  sortOrder: number;
}

export interface Wallet {
  id: string;
  userId: string;
  currencyId: string;
  balance: string;
  lockedBalance: string;
  depositAddress?: string;
  currency: Currency;
}

export interface Transaction {
  id: string;
  reference: string;
  type: TransactionType;
  status: TransactionStatus;
  fromCurrencyCode: string;
  toCurrencyCode?: string;
  fromAmount: string;
  toAmount?: string;
  fee: string;
  exchangeRate?: string;
  description?: string;
  createdAt: Date;
  sender?: Partial<User>;
  receiver?: Partial<User>;
}

export interface Card {
  id: string;
  maskedNumber: string;
  cardHolder: string;
  expiryMonth: number;
  expiryYear: number;
  balance: string;
  status: CardStatus;
  network: string;
  createdAt: Date;
}

export interface ExchangeRate {
  fromCurrencyId: string;
  toCurrencyId: string;
  rate: string;
  fee: string;
  fromCode: string;
  toCode: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
