/**
 * Row layout for MasonryGrid. A layout is an array of rows; each row is an
 * array of items, padded to equal length with `isDuplicate` clones so every
 * row loops at the same length. A tile's visible slot is (row, index).
 */

const pick = (array) => array[Math.floor(Math.random() * array.length)];

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** The real items of a layout, without clones, in row order */
export function layoutItems(rows) {
  return rows.flat().filter((item) => !item.isDuplicate);
}

function clone(item, rowIndex, index) {
  return { ...item, id: `${item.id}-dup-${rowIndex}-${index}`, isDuplicate: true };
}

/**
 * Equalize row lengths by borrowing items from other rows (never repeating
 * one within a row). Without `prev` the borrowing is deterministic. With
 * `prev` (the layout being replaced), a clone never shows the src its slot
 * showed before, and avoids media that was already visible in that row.
 */
function padRows(rows, prev) {
  const rowCount = rows.length;
  const maxLength = Math.max(...rows.map((row) => row.length));

  if (!prev) {
    return rows.map((row, rowIdx) => {
      const padded = [...row];
      let dupIndex = 0;
      while (padded.length < maxLength) {
        let sourceRowIndex = (rowIdx + 1 + dupIndex) % rowCount;
        if (sourceRowIndex === rowIdx) {
          sourceRowIndex = (sourceRowIndex + 1) % rowCount;
        }
        const sourceRow = rows[sourceRowIndex];
        padded.push(
          clone(sourceRow[dupIndex % sourceRow.length], rowIdx, dupIndex)
        );
        dupIndex++;
      }
      return padded;
    });
  }

  const cloned = new Set();
  return rows.map((row, rowIdx) => {
    const padded = [...row];
    const inRow = new Set(row.map((item) => item.src));
    const wasInRow = new Set((prev[rowIdx] || []).map((item) => item.src));
    while (padded.length < maxLength) {
      const index = padded.length;
      const slotSrc = prev[rowIdx]?.[index]?.src;
      const candidates = rows
        .filter((_, r) => r !== rowIdx)
        .flat()
        .filter((item) => !inRow.has(item.src));
      const preferences = [
        (item) => item.src !== slotSrc && !wasInRow.has(item.src) && !cloned.has(item.src),
        (item) => item.src !== slotSrc && !wasInRow.has(item.src),
        (item) => item.src !== slotSrc,
        () => true,
      ];
      let pool = [];
      for (const ok of preferences) {
        pool = candidates.filter(ok);
        if (pool.length > 0) break;
      }
      const source = pick(pool);
      padded.push(clone(source, rowIdx, index - row.length));
      inRow.add(source.src);
      cloned.add(source.src);
    }
    return padded;
  });
}

/**
 * Distribute items across rows using round-robin, then equalize row lengths
 * by duplicating items
 */
export function distributeItems(items, rowCount) {
  const rows = Array.from({ length: rowCount }, () => []);
  items.forEach((item, index) => {
    rows[index % rowCount].push(item);
  });
  return padRows(rows);
}

/**
 * Deal `items` into rows of `sizes`, then swap until `allowed(item, row)`
 * holds for every item. Each swap moves one disallowed item into a row it is
 * allowed in, taking an item that is allowed in its row, so the count of
 * disallowed items only falls. Returns null when no such swap exists.
 */
function dealWithRepair(items, sizes, allowed) {
  const pool = shuffleArray(items);
  const rows = sizes.map((size) => pool.splice(0, size));

  for (let r = 0; r < rows.length; r++) {
    for (let i = 0; i < rows[r].length; i++) {
      const item = rows[r][i];
      if (allowed(item, r)) continue;
      const swaps = [];
      rows.forEach((row, s) => {
        if (s === r || !allowed(item, s)) return;
        row.forEach((other, j) => {
          if (allowed(other, r)) swaps.push([s, j]);
        });
      });
      if (swaps.length === 0) return null;
      const [s, j] = pick(swaps);
      rows[r][i] = rows[s][j];
      rows[s][j] = item;
    }
  }
  return rows;
}

/**
 * Shuffle so every item moves to a different row and no slot shows the same
 * media it showed before (clones included). Rows stay balanced: the row
 * sizes are rotated by one row, which always admits an assignment where
 * every item changes row.
 */
export function shuffleWithRowChange(prevRows, rowCount = prevRows.length) {
  const prev =
    prevRows.length === rowCount
      ? prevRows
      : distributeItems(layoutItems(prevRows), rowCount);
  const items = layoutItems(prev);
  if (rowCount < 2 || items.length < 2) {
    return distributeItems(shuffleArray(items), rowCount);
  }

  const prevSizes = prev.map((row) => row.filter((i) => !i.isDuplicate).length);
  const sizes = prevSizes.map((_, r) => prevSizes[(r - 1 + rowCount) % rowCount]);

  const homeRow = new Map();
  const seenInRows = new Map();
  prev.forEach((row, r) =>
    row.forEach((item) => {
      if (!item.isDuplicate) homeRow.set(item.src, r);
      if (!seenInRows.has(item.src)) seenInRows.set(item.src, new Set());
      seenInRows.get(item.src).add(r);
    })
  );

  // Prefer rows the media wasn't visible in at all (clones count); the
  // home-row rule alone is always satisfiable.
  let rows = null;
  for (let attempt = 0; attempt < 8 && !rows; attempt++) {
    rows = dealWithRepair(items, sizes, (item, r) => !seenInRows.get(item.src).has(r));
  }
  rows ??= dealWithRepair(items, sizes, (item, r) => homeRow.get(item.src) !== r);

  // Random order within each row, then swap away any tile that would show
  // the src its slot showed before. Any other index in the row resolves it,
  // because a row never shows the same src twice.
  rows = rows.map((row, r) => {
    const ordered = shuffleArray(row);
    const before = prev[r];
    for (let i = 0; i < ordered.length; i++) {
      if (ordered[i].src !== before[i]?.src) continue;
      const others = ordered
        .map((_, j) => j)
        .filter(
          (j) =>
            j !== i &&
            ordered[j].src !== before[i]?.src &&
            ordered[i].src !== before[j]?.src
        );
      if (others.length === 0) continue;
      const j = pick(others);
      [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
    }
    return ordered;
  });

  return padRows(rows, prev);
}
