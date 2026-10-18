// Property test for MasonryGrid's shuffle: run `npm run test:shuffle`.
// Chains SHUFFLES shuffles per case (phone and desktop both render 3 rows)
// and asserts every item changes row, no slot keeps its src, rows stay
// balanced and equal length, and no row shows a src twice.
import assert from "node:assert/strict";
import {
  shuffleArray,
  distributeItems,
  shuffleWithRowChange,
  layoutItems,
} from "../utils/masonryLayout.js";
import visuals from "../data/visuals.json" with { type: "json" };

const SHUFFLES = Number(process.env.SHUFFLES) || 10000;

const synthetic = (n) =>
  Array.from({ length: n }, (_, i) => ({ id: `m${i}`, src: `/m${i}.jpg` }));

const cases = [
  { name: "site data (phone + desktop)", items: visuals, rows: 3 },
  ...[12, 16, 17, 20, 31].map((n) => ({ name: `${n} items`, items: synthetic(n), rows: 3 })),
  { name: "15 items", items: synthetic(15), rows: 2 },
  { name: "15 items", items: synthetic(15), rows: 4 },
];

function check(prev, next, items, rowCount) {
  assert.equal(next.length, rowCount);
  const length = Math.ceil(items.length / rowCount);
  next.forEach((row) => assert.equal(row.length, length, "row lengths differ"));

  const sizes = next.map((row) => row.filter((i) => !i.isDuplicate).length);
  assert.ok(Math.max(...sizes) - Math.min(...sizes) <= 1, `unbalanced ${sizes}`);
  assert.deepEqual(
    layoutItems(next).map((i) => i.src).sort(),
    items.map((i) => i.src).sort(),
    "items lost or repeated"
  );

  const homeRow = new Map();
  prev.forEach((row, r) =>
    row.forEach((i) => !i.isDuplicate && homeRow.set(i.src, r))
  );
  let sameRow = 0;
  let sameSlot = 0;
  let sameRowAny = 0;
  next.forEach((row, r) => {
    assert.equal(new Set(row.map((i) => i.src)).size, row.length, "src repeated in a row");
    const before = new Set(prev[r].map((i) => i.src));
    row.forEach((item, i) => {
      if (!item.isDuplicate && homeRow.get(item.src) === r) sameRow++;
      if (prev[r][i].src === item.src) sameSlot++;
      if (before.has(item.src)) sameRowAny++;
    });
  });
  return { sameRow, sameSlot, sameRowAny };
}

let failed = false;
for (const { name, items, rows } of cases) {
  let layout = distributeItems(shuffleArray(items), rows);
  const totals = { sameRow: 0, sameSlot: 0, sameRowAny: 0 };
  const slotCounts = new Map();
  for (let t = 0; t < SHUFFLES; t++) {
    const next = shuffleWithRowChange(layout, rows);
    const r = check(layout, next, items, rows);
    Object.keys(totals).forEach((k) => (totals[k] += r[k]));
    next[0].forEach((item, i) => {
      if (i === 0) slotCounts.set(item.src, (slotCounts.get(item.src) || 0) + 1);
    });
    layout = next;
  }
  // Randomness sanity: every item reaches row 0 slot 0 with a share near 1/N
  const shares = items.map((i) => (slotCounts.get(i.src) || 0) / SHUFFLES);
  const expected = 1 / items.length;
  const spread = Math.max(...shares.map((s) => Math.abs(s - expected))) / expected;
  const ok = totals.sameRow === 0 && totals.sameSlot === 0 && spread < 0.5;
  if (!ok) failed = true;
  console.log(
    `${ok ? "ok  " : "FAIL"} ${name}, ${rows} rows: ${SHUFFLES} shuffles, ` +
      `same row ${totals.sameRow}, same slot ${totals.sameSlot}, ` +
      `media still visible in its old row (clones) ${totals.sameRowAny}, ` +
      `slot (0,0) share spread ±${Math.round(spread * 100)}%`
  );
}
process.exit(failed ? 1 : 0);
