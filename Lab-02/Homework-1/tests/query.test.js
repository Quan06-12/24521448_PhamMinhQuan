import test from 'node:test';
import assert from 'node:assert/strict';
import { members } from '../src/members.js';
import { initialQuery, queryMembers, updateQuery, sortQuery, selectMember } from '../src/query.js';

test('initial view has eight alphabetized records and accurate page metadata', () => {
  const result = queryMembers(members);
  assert.equal(result.total, 32);
  assert.equal(result.pageCount, 4);
  assert.equal(result.rows.length, 8);
  assert.equal(result.rows[0].name, 'Amelia Bennett');
  assert.deepEqual([result.start, result.end], [1, 8]);
});

test('search ignores case, surrounding whitespace, and diacritics', () => {
  const result = queryMembers(members, { ...initialQuery, search: '  CHAU NGUYEN ' });
  assert.deepEqual(result.rows.map((row) => row.id), ['m05']);
  assert.equal(queryMembers(members, { ...initialQuery, search: 'research' }).total, 2);
});

test('search, team, and status filters combine rather than replace each other', () => {
  const result = queryMembers(members, {
    ...initialQuery, search: 'London', team: 'Engineering', status: 'Active',
  });
  assert.deepEqual(result.rows.map((row) => row.id), ['m13', 'm30']);
});

test('dates sort chronologically and descending reverses direction', () => {
  const oldest = queryMembers(members, { ...initialQuery, sortKey: 'joined' });
  const newest = queryMembers(members, { ...initialQuery, sortKey: 'joined', sortDirection: 'descending' });
  assert.equal(oldest.rows[0].id, 'm30');
  assert.equal(newest.rows[0].id, 'm32');
});

test('last page and out-of-bounds pagination remain valid', () => {
  const result = queryMembers(members, { ...initialQuery, page: 999, pageSize: 10 });
  assert.deepEqual([result.page, result.pageCount, result.start, result.end], [4, 4, 31, 32]);
  assert.equal(result.rows.length, 2);
  assert.equal(queryMembers(members, { ...initialQuery, page: -2 }).page, 1);
});

test('empty results expose one logical page and a zero range', () => {
  const result = queryMembers(members, { ...initialQuery, search: 'unfindable', page: 4 });
  assert.deepEqual([result.total, result.page, result.pageCount, result.start, result.end], [0, 1, 1, 0, 0]);
  assert.deepEqual(result.rows, []);
});

test('queries never mutate input data or state', () => {
  const query = Object.freeze({ ...initialQuery, sortDirection: 'descending' });
  const source = Object.freeze([...members]);
  const before = source.map((row) => row.id);
  queryMembers(source, query);
  assert.deepEqual(source.map((row) => row.id), before);
  assert.equal(query.page, 1);
});

test('changing any filter, sort, or page size resets pagination', () => {
  for (const changes of [{ search: 'a' }, { team: 'Design' }, { status: 'Active' }, { pageSize: 16 }, { sortKey: 'joined' }]) {
    assert.equal(updateQuery({ ...initialQuery, page: 3 }, changes).page, 1);
  }
  assert.equal(updateQuery(initialQuery, { page: 2 }).page, 2);
});

test('sort toggles current column and starts a new column ascending', () => {
  assert.equal(sortQuery(initialQuery, 'name').sortDirection, 'descending');
  assert.equal(sortQuery(initialQuery, 'joined').sortDirection, 'ascending');
  assert.equal(sortQuery(initialQuery, 'unknown'), initialQuery);
});

test('selection is immutable, idempotent for Enter, and toggles for Space', () => {
  const original = new Set(['m01']);
  const unchanged = selectMember(original, 'm01');
  const added = selectMember(unchanged, 'm02');
  const removed = selectMember(added, 'm01', true);
  assert.deepEqual([...original], ['m01']);
  assert.deepEqual([...unchanged], ['m01']);
  assert.deepEqual([...removed], ['m02']);
});

test('invalid numeric pagination and sort keys use safe defaults', () => {
  const result = queryMembers(members, { ...initialQuery, pageSize: NaN, page: Infinity, sortKey: '__proto__' });
  assert.equal(result.rows.length, 8);
  assert.equal(result.page, 1);
  assert.equal(result.rows[0].id, 'm01');
});

test('equal sort values keep source order and rows retain stable identity', () => {
  const rows = Object.freeze([
    Object.freeze({ ...members[0], id: 'second', name: 'Same' }),
    Object.freeze({ ...members[0], id: 'first', name: 'Same' }),
  ]);
  for (const sortDirection of ['ascending', 'descending']) {
    const result = queryMembers(rows, { ...initialQuery, sortDirection });
    assert.deepEqual(result.rows.map((row) => row.id), ['second', 'first']);
    assert.equal(result.rows[0], rows[0]);
  }
});

test('fractional and nonpositive page sizes are bounded without losing records', () => {
  const tiny = queryMembers(members, { ...initialQuery, pageSize: 0, page: 2.9 });
  assert.deepEqual([tiny.page, tiny.pageCount, tiny.start, tiny.end], [2, 32, 2, 2]);
  assert.equal(tiny.rows.length, 1);
  const wide = queryMembers(members, { ...initialQuery, pageSize: 1000 });
  assert.equal(wide.rows.length, members.length);
  assert.equal(wide.pageCount, 1);
});

test('empty source and result containers obey the readonly model contract', () => {
  const result = queryMembers(Object.freeze([]));
  assert.deepEqual([result.page, result.pageCount, result.start, result.end], [1, 1, 0, 0]);
  assert.throws(() => result.rows.push(members[0]), TypeError);
  assert.throws(() => { result.page = 10; }, TypeError);
});
