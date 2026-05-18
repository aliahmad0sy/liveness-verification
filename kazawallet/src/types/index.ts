export type UserRole = "USER" | "MERCHANT" | "AGENT" | "ADMIN";
export type KYCStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";
export type TxType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER_IN" | "TRANSFER_OUT" | "EXCHANGE" | "CARD_FUNDING" | "CARD_PAYMENT" | "MASS_PAYOUT" | "FEE" | "COMMISSION";
export type TxStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type CurrencyType = "FIAT" | "CRYPTO" | "EBANK";
export type CardStatus = "ACTIVE" | "FROZEN" | "EXPIRED" | "CANCELLED";

export interface SessionUser {
  userId: string;
  email: string;
  role: UserRole;
  sessionId: string;
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
  hasMore: boolean;
}
