/** Documentation contract for the dependency-free ES module implementation. */
export type ReservationStatus = 'RESERVED' | 'CHECKING_OUT' | 'PURCHASED' | 'EXPIRED' | 'RELEASED';
export type ResultCode = 'RESERVED' | 'CHECKING_OUT' | 'PURCHASED' | 'RELEASED' | 'PAYMENT_FAILED' | 'EXPIRED' | 'CONFLICT' | 'SOLD_OUT' | 'SALE_ENDED' | 'INVALID' | 'NOT_FOUND' | 'STALE' | 'KEY_REUSED';
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly originalPrice: number;
  readonly total: number;
}
export interface Reservation {
  readonly id: string;
  readonly productId: string;
  readonly buyer: string;
  readonly quantity: number;
  readonly expiresAt: number;
  readonly status: ReservationStatus;
  readonly attempt: number;
}
export interface Stock extends Product {
  readonly available: number;
  readonly held: number;
  readonly sold: number;
  readonly version: number;
}
export interface InventorySnapshot {
  readonly products: readonly Stock[];
  readonly reservations: readonly Reservation[];
  readonly saleEndsAt: number;
}
export interface Result {
  readonly ok: boolean;
  readonly code: ResultCode;
  readonly reservation?: Reservation;
}
export interface ReserveRequest {
  productId: string;
  buyer: string;
  quantity: number;
  expectedVersion: number;
  requestId: string;
}
export interface CheckoutToken { readonly reservationId: string; readonly attempt: number; }
export interface InventoryStore {
  /** All mutations are synchronous and expire locks before checking predicates. */
  snapshot(): InventorySnapshot;
  reserve(request: ReserveRequest): Result;
  release(reservationId: string): Result;
  beginCheckout(reservationId: string): Result & { token?: CheckoutToken };
  /** A completion can commit only with its matching attempt and a live lock. */
  finishCheckout(token: CheckoutToken, succeeded: boolean): Result;
  sweep(): boolean;
  verifyInvariants(): true;
}
export interface TimerOptions {
  deadline: number;
  now?: () => number;
  requestFrame?: (callback: FrameRequestCallback) => number;
  cancelFrame?: (id: number) => void;
  onTick: (remainingMs: number) => void;
  onComplete?: () => void;
}
export type CheckoutViewState =
  | { status: 'IDLE' }
  | { status: 'PENDING'; reservationId: string }
  | { status: 'SUCCESS'; reservationId: string }
  | { status: 'ERROR'; reservationId: string; code: ResultCode };

export interface CheckoutController {
  /** Starts one asynchronous payment simulation per live reservation. */
  checkout(reservationId: string, options?: { delayMs?: number; succeeds?: boolean }): Promise<Result>;
  /** Cancels the scheduled response and releases its inventory lock. */
  cancel(reservationId: string): Result;
  /** Cancels all pending responses, releases their locks and makes checkout inert. */
  dispose(): void;
  readonly pendingCount: number;
}
export interface RaceResult {
  readonly attempted: number;
  readonly firstPassWins: number;
  readonly conflicts: number;
  readonly purchased: number;
  readonly rejected: number;
}
