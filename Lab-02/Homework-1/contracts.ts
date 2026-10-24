/** Documentation contracts for the dependency-free ES module implementation. */
export type MemberStatus = 'Active' | 'On leave' | 'Invited';
export interface Member {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly team: string;
  readonly status: MemberStatus;
  readonly location: string;
  /** ISO date; numeric/date sorting must not sort formatted display strings. */
  readonly joined: string;
}

export interface ColumnDef<T> {
  readonly header: string;
  readonly accessorKey: keyof T;
  readonly sortable?: boolean;
}

export interface DataGridProps<T> {
  readonly data: readonly T[];
  readonly columns: readonly ColumnDef<T>[];
  readonly ariaLabel: string;
  readonly onRowSelect?: (item: T) => void;
}

export interface QueryState {
  readonly search: string;
  readonly team: string;
  readonly status: string;
  readonly sortKey: keyof Member;
  readonly sortDirection: 'ascending' | 'descending';
  readonly page: number;
  readonly pageSize: number;
}

export interface QueryResult {
  readonly rows: readonly Member[];
  readonly total: number;
  readonly page: number;
  readonly pageCount: number;
  readonly start: number;
  readonly end: number;
}

export interface GridState {
  readonly query: QueryState;
  /** Stable record IDs, retained when records leave the current filtered page. */
  readonly selected: ReadonlySet<string>;
}

export interface GridController {
  /** Refresh data while retaining the focused record/column when possible. */
  render(): void;
  /** Remove delegated listeners; safe to call more than once. */
  destroy(): void;
}

/* Invariants:
 * 1. Query functions never mutate source records, arrays, or query state.
 * 2. Search, team, and status filters combine with AND; search is case-insensitive.
 * 3. Filtering and page-size changes reset to page 1; pagination is always clamped.
 * 4. The native table has grid/row/columnheader/gridcell roles and one tab stop.
 * 5. Arrow keys move among visible cells; headers are included; no wrapping.
 * 6. Enter selects a data row; Space toggles it. Header Enter/Space sorts.
 * 7. Selection uses stable IDs and survives sorting, pagination, and filtering.
 * 8. Rendered record strings use textContent, never raw HTML injection.
 * 9. Every selection/result change has a concise polite live announcement.
 * 10. Listener allocation is constant and all listeners can be removed.
 */
