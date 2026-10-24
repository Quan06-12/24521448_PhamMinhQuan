const sortableKeys = new Set(['name', 'team', 'status', 'location', 'joined']);
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });

export const initialQuery = Object.freeze({
  search: '', team: '', status: '', sortKey: 'name',
  sortDirection: 'ascending', page: 1, pageSize: 8,
});

function normalize(text) {
  return String(text).normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('en');
}

function positiveInteger(value, fallback) {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : fallback;
}

/** Filter → copy/sort → clamp → paginate. Does not mutate either argument. */
export function queryMembers(data, query = initialQuery) {
  const search = normalize(query.search ?? '').trim();
  const filtered = data.filter((member) => {
    const searchable = [member.name, member.title, member.team, member.status, member.location].join(' ');
    return (!search || normalize(searchable).includes(search))
      && (!query.team || member.team === query.team)
      && (!query.status || member.status === query.status);
  });
  const key = sortableKeys.has(query.sortKey) ? query.sortKey : 'name';
  const direction = query.sortDirection === 'descending' ? -1 : 1;
  filtered.sort((a, b) => direction * collator.compare(a[key], b[key]));
  const pageSize = Math.min(100, positiveInteger(query.pageSize, 8));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(pageCount, positiveInteger(query.page, 1));
  const offset = (page - 1) * pageSize;
  return Object.freeze({
    rows: Object.freeze(filtered.slice(offset, offset + pageSize)),
    total: filtered.length,
    page,
    pageCount,
    start: filtered.length ? offset + 1 : 0,
    end: Math.min(offset + pageSize, filtered.length),
  });
}

/** Filters and page-size changes always return to the first page. */
export function updateQuery(query, changes) {
  const resetPage = ['search', 'team', 'status', 'pageSize', 'sortKey', 'sortDirection']
    .some((key) => Object.hasOwn(changes, key));
  return Object.freeze({ ...query, ...changes, ...(resetPage ? { page: 1 } : {}) });
}

export function sortQuery(query, sortKey) {
  if (!sortableKeys.has(sortKey)) return query;
  const sortDirection = query.sortKey === sortKey && query.sortDirection === 'ascending'
    ? 'descending' : 'ascending';
  return updateQuery(query, { sortKey, sortDirection });
}

/** Enter selects idempotently; a pointer action or Space toggles. */
export function selectMember(selected, id, toggle = false) {
  const next = new Set(selected);
  if (toggle && next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}
