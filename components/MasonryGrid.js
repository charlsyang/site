import styled, { keyframes, css } from "styled-components";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { QUERIES } from "../utils/constants";
import Icon from "./Icon";
import Button from "./Button";

// ============================================
// Utility Functions
// ============================================

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Distribute items across rows using round-robin,
 * then equalize row lengths by duplicating items
 */
function distributeItems(items, rowCount) {
  // Initialize empty rows
  const rows = Array.from({ length: rowCount }, () => []);

  // Round-robin distribution
  items.forEach((item, index) => {
    const rowIndex = index % rowCount;
    rows[rowIndex].push(item);
  });

  // Find max length
  const maxLength = Math.max(...rows.map((row) => row.length));

  // Equalize by borrowing items from OTHER rows (no repeats within same row)
  rows.forEach((row, rowIdx) => {
    let dupIndex = 0;
    while (row.length < maxLength) {
      // Pick from a different row (round-robin through other rows, skip self)
      let sourceRowIndex = (rowIdx + 1 + dupIndex) % rowCount;
      if (sourceRowIndex === rowIdx) {
        sourceRowIndex = (sourceRowIndex + 1) % rowCount;
      }
      const sourceRow = rows[sourceRowIndex];
      const sourceItem = sourceRow[dupIndex % sourceRow.length];

      row.push({
        ...sourceItem,
        id: `${sourceItem.id}-dup-${rowIdx}-${dupIndex}`,
        isDuplicate: true,
      });
      dupIndex++;
    }
  });

  return rows;
}

/**
 * Shuffle items ensuring each item moves to a different row than before.
 *
 * Strategy: Constrained Random Assignment
 * - Each item can go to ANY row except its current row
 * - Rows are kept balanced (equal items per row)
 * - Provides true randomness while guaranteeing row changes
 */
function shuffleWithRowChange(currentRowData, rowCount) {
  // Flatten current rows, tagging each item with its current row
  const items = currentRowData.flatMap((row, rowIndex) =>
    row
      .filter((item) => !item.isDuplicate)
      .map((item) => ({ ...item, _prevRow: rowIndex }))
  );

  const totalItems = items.length;
  const baseItemsPerRow = Math.floor(totalItems / rowCount);
  const extraItems = totalItems % rowCount;

  // Calculate target size for each row
  const targetSizes = Array.from(
    { length: rowCount },
    (_, i) => baseItemsPerRow + (i < extraItems ? 1 : 0)
  );

  // Initialize new rows
  const newRows = Array.from({ length: rowCount }, () => []);
  const rowSizes = Array(rowCount).fill(0);

  // Shuffle items to randomize assignment order
  const shuffledItems = shuffleArray([...items]);

  // Assign each item to a random valid row
  for (const item of shuffledItems) {
    // Find all valid rows (not full, and not the item's previous row)
    const validRows = [];
    for (let r = 0; r < rowCount; r++) {
      if (r !== item._prevRow && rowSizes[r] < targetSizes[r]) {
        validRows.push(r);
      }
    }

    // If no valid rows (edge case), allow previous row as fallback
    let targetRow;
    if (validRows.length > 0) {
      targetRow = validRows[Math.floor(Math.random() * validRows.length)];
    } else {
      // Fallback: find any row with space
      for (let r = 0; r < rowCount; r++) {
        if (rowSizes[r] < targetSizes[r]) {
          targetRow = r;
          break;
        }
      }
    }

    // Clean up and assign
    const cleanItem = { ...item };
    delete cleanItem._prevRow;
    newRows[targetRow].push(cleanItem);
    rowSizes[targetRow]++;
  }

  // Shuffle within each row for extra randomness, then flatten
  return newRows.flatMap((row) => shuffleArray(row));
}

// ============================================
// Animation Configuration
// ============================================

// Duration calculation: seconds per item for consistent scroll speed
// Calibrated from: 17 items / 3 rows = ~6 items per row @ 40s = ~6.67s per item
const SECONDS_PER_ITEM = 10;

/** Shared gutter token — between rows and between tiles (rounded to whole px) */
const MASONRY_ROW_GAP = "0.9vh";
/** Phone: fixed px so row + intra-row gutters stay uniform (vh drifts with band height) */
const MASONRY_ROW_GAP_PHONE = "4px";
/** Item aspect-ratio width/height (matches ItemWrapper) */
const ITEM_ASPECT = 3 / 2;
/** Fraction of a loop each successive row starts ahead of the previous one */
const ROW_STAGGER = 0.3;

/**
 * Calculate animation duration based on item count and row distribution
 * This ensures consistent perceived scroll speed regardless of content count
 */
function calculateDuration(itemCount, rowCount) {
  const itemsPerRow = Math.ceil(itemCount / rowCount);
  return itemsPerRow * SECONDS_PER_ITEM;
}

// ============================================
// Crossfade Configuration
// ============================================
const CROSSFADE_DURATION = 0.5; // seconds (for Motion)
const CROSSFADE_BLUR = 16; // pixels
/** Phone: blur cost grows with radius and runs on all 15 tiles at once */
const CROSSFADE_BLUR_PHONE = 6;
const CROSSFADE_EASE = [0.4, 0, 0.2, 1];

// Motion animation variants for crossfade (used on shuffle)
function makeCrossfadeVariants(blur) {
  return {
    initial: { opacity: 0, filter: `blur(${blur}px)` },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: `blur(${blur}px)` },
  };
}
const crossfadeVariants = makeCrossfadeVariants(CROSSFADE_BLUR);
const crossfadeVariantsPhone = makeCrossfadeVariants(CROSSFADE_BLUR_PHONE);

const crossfadeTransition = {
  duration: CROSSFADE_DURATION,
  ease: CROSSFADE_EASE,
};

// ============================================
// MasonryItem Component (with blur placeholder support)
// ============================================

function MasonryItem({ item, shuffleKey, isPhone = false }) {
  const blur = isPhone ? CROSSFADE_BLUR_PHONE : CROSSFADE_BLUR;
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);
  const [placeholderHidden, setPlaceholderHidden] = useState(false);

  // Refs for checking if media is already loaded (cached)
  const imgRef = useRef(null);
  const videoRef = useRef(null);

  // Track if this is the first render of this component instance
  // Fresh mount = true, re-render (shuffle) = false
  const isFirstRenderRef = useRef(true);

  // Reset loaded state when item changes
  useEffect(() => {
    if (isFirstRenderRef.current) {
      // First render of this component instance (initial load or exit broken mode)
      // Keep placeholder visible, let animation play
      isFirstRenderRef.current = false;
    } else {
      // Re-render with different item (shuffle)
      // Hide placeholder immediately to avoid crossfade interference
      setPlaceholderHidden(true);
    }
    setIsLoaded(false);
  }, [item.src, shuffleKey]);

  // Check if media is already loaded from cache on mount
  // This handles the case where onLoad fires before React attaches the listener
  useEffect(() => {
    // For images: check if already complete (cached)
    if (item.type !== "video" && imgRef.current) {
      if (imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        setIsLoaded(true);
      }
    }
    // For videos: check if enough data is loaded (readyState >= 2 means HAVE_CURRENT_DATA)
    if (item.type === "video" && videoRef.current) {
      if (videoRef.current.readyState >= 2) {
        setIsLoaded(true);
      }
    }
  }, [item.src, item.type, shuffleKey]);

  // Videos count as loaded once their first-frame poster is ready, so the tile
  // unblurs even when autoplay is blocked (iOS Low Power Mode never fires
  // loadeddata without playback).
  useEffect(() => {
    if (item.type !== "video" || !item.poster) return;
    const poster = new Image();
    poster.onload = () => setIsLoaded(true);
    poster.src = item.poster;
    if (poster.complete && poster.naturalWidth > 0) setIsLoaded(true);
    return () => {
      poster.onload = null;
    };
  }, [item.poster, item.type, shuffleKey]);

  // Hide placeholder after unblur animation completes
  useEffect(() => {
    if (isLoaded && !placeholderHidden) {
      // Wait for animation to complete, then hide placeholder
      const timer = setTimeout(() => {
        setPlaceholderHidden(true);
      }, CROSSFADE_DURATION * 1000 + 50); // Animation duration + small buffer

      return () => clearTimeout(timer);
    }
  }, [isLoaded, placeholderHidden]);

  // Determine if this is a fresh mount (use placeholder-based animation)
  // vs a shuffle (use crossfade variants)
  // Fresh mount: placeholder not yet hidden
  // Shuffle: placeholder was immediately hidden
  const isFreshMount = !placeholderHidden || !isLoaded;
  const usePlaceholderAnimation = isFreshMount && !placeholderHidden;

  // Determine if we should show blur placeholder
  const hasPlaceholder = !!item.blurDataURL;

  // Show placeholder on fresh mounts until animation completes
  const showPlaceholder = hasPlaceholder && !placeholderHidden;

  return (
    <ItemWrapper
      style={
        // Show blur placeholder as background during reveal
        showPlaceholder
          ? {
              backgroundImage: `url(${item.blurDataURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
      aria-hidden={item.isDuplicate ? "true" : undefined}
    >
      <AnimatePresence mode="popLayout">
        <MediaLayer
          key={`${item.src}-${shuffleKey}`}
          variants={isPhone ? crossfadeVariantsPhone : crossfadeVariants}
          // Fresh mount: start hidden, animate in when loaded
          // Shuffle: use crossfade variants
          initial={
            usePlaceholderAnimation
              ? hasPlaceholder
                ? { opacity: 0, filter: `blur(${blur}px)` }
                : false
              : "initial"
          }
          animate={
            usePlaceholderAnimation
              ? isLoaded || !hasPlaceholder
                ? { opacity: 1, filter: "blur(0px)" }
                : { opacity: 0, filter: `blur(${blur}px)` }
              : "animate"
          }
          exit="exit"
          transition={crossfadeTransition}
        >
          {item.type === "video" ? (
            <Video
              ref={videoRef}
              src={item.src}
              poster={item.poster}
              autoPlay={prefersReducedMotion === false}
              loop
              muted
              playsInline
              draggable={false}
              onLoadedData={() => setIsLoaded(true)}
            />
          ) : (
            <Img
              ref={imgRef}
              src={item.src}
              alt={item.alt || ""}
              draggable={false}
              onLoad={() => setIsLoaded(true)}
            />
          )}
        </MediaLayer>
      </AnimatePresence>
    </ItemWrapper>
  );
}

// ============================================
// Marquee (one compositor animation per tile)
// ============================================

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Row offset (1.0, 1.3, 1.6, …) — loop phase and reduced-motion stagger */
function getRowOffset(rowIndex) {
  return 1 + rowIndex * ROW_STAGGER;
}

/** Resolve a px / vh / vw / rem token to CSS px */
function resolveLength(token) {
  const value = parseFloat(token);
  if (!Number.isFinite(value)) return 0;
  if (token.endsWith("vh")) return (value * window.innerHeight) / 100;
  if (token.endsWith("vw")) return (value * window.innerWidth) / 100;
  if (token.endsWith("rem")) {
    const rootSize = getComputedStyle(document.documentElement).fontSize;
    return value * parseFloat(rootSize);
  }
  return value;
}

const timelineNow = () => document.timeline.currentTime ?? performance.now();

/**
 * Scrolls every tile with its own Web Animation so motion runs on the
 * compositor (no per-frame JS).
 *
 * Geometry is whole CSS px: row height (even, so the 3:2 tile width is whole),
 * gap, pitch and loop. Every tile in a row shares identical keyframes
 * (loop − tileW → −tileW) and one startTime; its place in the row is a
 * negative delay worth a whole number of px. Every tile's x therefore has the
 * same sub-pixel fraction on every frame, so tiles snap to device pixels
 * together and the gaps stay uniform. A tile wraps from −tileW to
 * loop − tileW, both fully outside the band; there are no clones.
 *
 * Animations are reused across shuffles and resizes (keyframes and timing are
 * updated in place), and pause/resume re-locks every tile to one startTime.
 * Phase and speed match the former per-tile CSS animation: one pitch every
 * `duration / count` seconds, rows staggered by ROW_STAGGER.
 */
function useMarqueeAnimations({
  gridRef,
  enabled,
  paused,
  duration,
  direction,
  layoutKey,
}) {
  // Motion time in seconds while stopped; startRef holds the shared startTime
  // while running. Both survive shuffles and easter-egg resets.
  const elapsedRef = useRef(0);
  const startRef = useRef(null);
  const animsRef = useRef(new Map());

  useEffect(() => {
    const anims = animsRef.current;
    return () => {
      anims.forEach((anim) => anim.cancel());
      anims.clear();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const grid = gridRef.current;
    const anims = animsRef.current;
    const rowEls = grid ? Array.from(grid.querySelectorAll(":scope > ul")) : [];

    const elapsedNow = () =>
      startRef.current === null
        ? elapsedRef.current
        : (timelineNow() - startRef.current) / 1000;

    const cancelExcept = (keep) => {
      anims.forEach((anim, el) => {
        if (keep.has(el)) return;
        anim.cancel();
        anims.delete(el);
      });
    };

    if (
      !grid ||
      rowEls.length === 0 ||
      !enabled ||
      typeof grid.animate !== "function"
    ) {
      elapsedRef.current = elapsedNow();
      startRef.current = null;
      cancelExcept(new Set());
      if (grid) delete grid.dataset.marquee;
      return;
    }

    const apply = () => {
      const cs = getComputedStyle(grid);
      const gapToken = cs.getPropertyValue("--masonry-row-gap").trim();
      const gap = Math.max(1, Math.round(resolveLength(gapToken)));
      const contentH =
        grid.clientHeight -
        parseFloat(cs.paddingTop) -
        parseFloat(cs.paddingBottom);
      const rowCount = rowEls.length;
      const rowH = Math.max(
        2,
        Math.floor((contentH - (rowCount - 1) * gap) / rowCount / 2) * 2
      );
      const tileW = rowH * ITEM_ASPECT;
      const pitch = tileW + gap;

      grid.style.setProperty("--masonry-gap-px", `${gap}px`);
      grid.style.setProperty("--masonry-row-h", `${rowH}px`);
      grid.style.setProperty("--masonry-tile-w", `${tileW}px`);
      grid.dataset.marquee = "";

      const keep = new Set();
      rowEls.forEach((row, rowIndex) => {
        const tiles = Array.from(row.querySelectorAll(":scope > li"));
        const loop = tiles.length * pitch;
        const speed = loop / duration; // px/s
        // Former CSS delay (−count·0.5s) plus the row's offset fraction
        const phase = Math.round(
          speed * tiles.length * 0.5 + loop * (getRowOffset(rowIndex) - 1)
        );
        const ends = [
          `translate3d(${loop - tileW}px, 0, 0)`,
          `translate3d(${-tileW}px, 0, 0)`,
        ];
        if (direction === "right") ends.reverse();
        const keyframes = ends.map((transform) => ({ transform }));

        tiles.forEach((el, i) => {
          keep.add(el);
          const leadPx = (((phase - i * pitch) % loop) + loop) % loop;
          const timing = {
            duration: duration * 1000,
            delay: -(leadPx / speed) * 1000,
            iterations: Infinity,
            easing: "linear",
          };
          const key = `${loop}|${tileW}|${leadPx}|${duration}|${direction}`;
          let anim = anims.get(el);
          if (!anim) {
            anim = el.animate(keyframes, timing);
            anims.set(el, anim);
          } else if (anim.marqueeKey !== key) {
            anim.effect.setKeyframes(keyframes);
            anim.effect.updateTiming(timing);
          }
          anim.marqueeKey = key;
        });
      });
      cancelExcept(keep);
    };

    // Pin every animation to the shared clock (running) or the shared hold time
    const lock = () => {
      const start = startRef.current;
      anims.forEach((anim) => {
        if (start !== null) {
          if (anim.playState !== "running" || anim.startTime !== start) {
            anim.startTime = start;
          }
        } else {
          if (anim.playState !== "paused") anim.pause();
          anim.currentTime = elapsedRef.current * 1000;
        }
      });
    };

    let onScreen = true;
    const sync = () => {
      const run = !paused && onScreen && !document.hidden;
      if (run && startRef.current === null) {
        startRef.current = timelineNow() - elapsedRef.current * 1000;
      } else if (!run && startRef.current !== null) {
        elapsedRef.current = elapsedNow();
        startRef.current = null;
      }
      lock();
    };

    apply();
    sync();

    const resizeObserver = new ResizeObserver(() => {
      apply();
      lock();
    });
    resizeObserver.observe(grid);

    const intersectionObserver = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1].isIntersecting;
      sync();
      grid.querySelectorAll("video").forEach((video) => {
        if (onScreen) video.play().catch(() => {});
        else video.pause();
      });
    });
    intersectionObserver.observe(grid);

    document.addEventListener("visibilitychange", sync);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [gridRef, enabled, paused, duration, direction, layoutKey]);
}

// ============================================
// InfiniteMasonryRow Component
// ============================================

function InfiniteMasonryRow({
  items,
  offset = 1,
  shuffleKey = 0,
  isPhone = false,
  className,
}) {
  return (
    <RowWrapper style={{ "--offset": offset }} className={className}>
      {items.map((item, index) => (
        <MasonryItem
          key={index}
          item={item}
          shuffleKey={shuffleKey}
          isPhone={isPhone}
        />
      ))}
    </RowWrapper>
  );
}

// ============================================
// BrokenPhysicsMode Component (Easter Egg)
// Runs Matter.js HEADLESS (no canvas) with DOM elements
// ============================================

// Preload Matter.js on first shuffle click so it's ready by the triggering click
let matterPreloadPromise = null;
function preloadMatter() {
  if (!matterPreloadPromise) {
    matterPreloadPromise = import("matter-js").then((m) => m.default);
  }
  return matterPreloadPromise;
}

const CONTACT_BUTTON_URL =
  "https://twitter.com/messages/compose?recipient_id=841462952750325760";

function BrokenPhysicsMode({ capturedPositions, onReset, containerRef }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const matterRef = useRef(null); // Store Matter.js module reference
  const groundRef = useRef(null); // Store ground body for resize updates
  const wallsRef = useRef({ left: null, right: null }); // Store wall bodies
  const dragRef = useRef({
    isDragging: false,
    body: null,
    constraint: null,
    lastMouse: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
  });
  const [bodies, setBodies] = useState([]);

  // Use captured positions immediately for rendering
  const itemData = capturedPositions || [];

  useEffect(() => {
    if (!containerRef.current || itemData.length === 0) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    let cleanupPhysics = null;
    let cancelled = false;

    // Use preloaded Matter.js (started on first shuffle click)
    preloadMatter().then((Matter) => {
      if (cancelled) return;

      matterRef.current = Matter;

      function startPhysics() {
        // Create Matter.js engine (HEADLESS - no renderer!)
        const engine = Matter.Engine.create({
          gravity: { x: 0, y: 1.5 },
        });
        engineRef.current = engine;

        // Create ground and walls
        // Walls are pushed further out to avoid colliding with items
        // that are partially scrolled off-screen when captured
        const wallThickness = 60;
        const wallOffset = 200; // Extra buffer for scrolled items
        const ground = Matter.Bodies.rectangle(
          rect.width / 2,
          rect.height + wallThickness / 2,
          rect.width + wallOffset * 2,
          wallThickness,
          { isStatic: true }
        );
        const leftWall = Matter.Bodies.rectangle(
          -wallOffset - wallThickness / 2,
          rect.height / 2,
          wallThickness,
          rect.height * 2,
          { isStatic: true }
        );
        const rightWall = Matter.Bodies.rectangle(
          rect.width + wallOffset + wallThickness / 2,
          rect.height / 2,
          wallThickness,
          rect.height * 2,
          { isStatic: true }
        );

        // Store refs for resize updates
        groundRef.current = ground;
        wallsRef.current = { left: leftWall, right: rightWall };

        Matter.Composite.add(engine.world, [ground, leftWall, rightWall]);

        // Create bodies for each media item
        const mediaBodies = itemData.map((item, i) => {
          const body = Matter.Bodies.rectangle(
            item.x,
            item.y,
            item.width * 0.7,
            item.height * 0.7,
            {
              restitution: 0.2,
              friction: 0.3,
              frictionAir: 0.05,
              chamfer: { radius: 50 }, // Rounded corners allow visual overlap
            }
          );

          // Store item data on the body for reference
          body.itemId = item.id;

          // Upward burst only
          Matter.Body.setVelocity(body, {
            x: 0,
            y: -4 - Math.random() * 6,
          });

          return { body, ...item };
        });

        mediaBodies.forEach(({ body }) => {
          Matter.Composite.add(engine.world, body);
        });

        setBodies(mediaBodies);

        // Create runner
        const runner = Matter.Runner.create();
        runnerRef.current = runner;

        // Start the engine (NO renderer - headless mode!)
        Matter.Runner.run(runner, engine);

        // Animation loop to sync DOM with physics bodies
        let animationId;
        const updateBodies = () => {
          setBodies((prev) =>
            prev.map((item) => ({
              ...item,
              x: item.body.position.x,
              y: item.body.position.y,
              angle: item.body.angle,
            }))
          );
          animationId = requestAnimationFrame(updateBodies);
        };
        animationId = requestAnimationFrame(updateBodies);

        // Return cleanup for startPhysics
        return () => {
          cancelAnimationFrame(animationId);
          Matter.Runner.stop(runner);
          Matter.Composite.clear(engine.world);
          Matter.Engine.clear(engine);
        };
      } // end startPhysics

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (!cancelled) {
          cleanupPhysics = startPhysics();
        }
      }, 50);
    });

    // Cleanup
    return () => {
      cancelled = true;
      if (cleanupPhysics) cleanupPhysics();
    };
  }, [containerRef, itemData.length]);

  // Responsive ground/walls: update positions on container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wallThickness = 60;
    const wallOffset = 200;

    const handleResize = (entries) => {
      // Read Matter from ref inside callback (it's loaded async)
      const Matter = matterRef.current;
      if (!Matter || !groundRef.current) return;

      const { width, height } = entries[0].contentRect;

      // Update ground position
      Matter.Body.setPosition(groundRef.current, {
        x: width / 2,
        y: height + wallThickness / 2,
      });

      // Update wall positions
      if (wallsRef.current.left) {
        Matter.Body.setPosition(wallsRef.current.left, {
          x: -wallOffset - wallThickness / 2,
          y: height / 2,
        });
      }
      if (wallsRef.current.right) {
        Matter.Body.setPosition(wallsRef.current.right, {
          x: width + wallOffset + wallThickness / 2,
          y: height / 2,
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  // Handle drag start on physics items
  const handlePointerDown = useCallback(
    (e, item) => {
      const Matter = matterRef.current;
      const engine = engineRef.current;
      if (!Matter || !engine) return;

      e.preventDefault();
      e.stopPropagation();

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate offset from click point to body center
      // This keeps the card where the cursor grabbed it instead of snapping center to cursor
      const offsetX = mouseX - item.body.position.x;
      const offsetY = mouseY - item.body.position.y;

      // Create a constraint to drag the body
      // pointB is the offset from body center where we "grabbed" it
      const constraint = Matter.Constraint.create({
        pointA: { x: mouseX, y: mouseY },
        bodyB: item.body,
        pointB: { x: offsetX, y: offsetY },
        stiffness: 0.2,
        length: 0,
      });

      Matter.Composite.add(engine.world, constraint);

      dragRef.current = {
        isDragging: true,
        body: item.body,
        constraint,
        lastMouse: { x: mouseX, y: mouseY },
        velocity: { x: 0, y: 0 },
      };

      // Capture pointer for smooth dragging even outside element
      e.target.setPointerCapture(e.pointerId);
    },
    [containerRef]
  );

  const handlePointerMove = useCallback(
    (e) => {
      const Matter = matterRef.current;
      const drag = dragRef.current;
      if (!Matter || !drag.isDragging || !drag.constraint) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Track velocity for throwing
      drag.velocity = {
        x: mouseX - drag.lastMouse.x,
        y: mouseY - drag.lastMouse.y,
      };

      // Update constraint point
      drag.constraint.pointA.x = mouseX;
      drag.constraint.pointA.y = mouseY;

      drag.lastMouse = { x: mouseX, y: mouseY };
    },
    [containerRef]
  );

  const handlePointerUp = useCallback((e) => {
    const Matter = matterRef.current;
    const engine = engineRef.current;
    const drag = dragRef.current;
    if (!Matter || !engine || !drag.isDragging) return;

    // Remove constraint
    if (drag.constraint) {
      Matter.Composite.remove(engine.world, drag.constraint);
    }

    // Apply throw velocity
    if (drag.body) {
      const throwMultiplier = 0.8;
      Matter.Body.setVelocity(drag.body, {
        x: drag.velocity.x * throwMultiplier,
        y: drag.velocity.y * throwMultiplier,
      });
    }

    dragRef.current = {
      isDragging: false,
      body: null,
      constraint: null,
      lastMouse: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
    };

    // Release pointer capture
    e.target.releasePointerCapture(e.pointerId);
  }, []);

  // Use physics bodies if available, otherwise show initial static positions
  const displayBodies = bodies.length > 0 ? bodies : itemData;

  return (
    <PhysicsOverlay>
      {/* Message + CTA - now fully interactive, no canvas blocking them! */}
      <BrokenMessage>
        <p>Your love for my work has broken through.</p>
        <p>Break the ice next?</p>
      </BrokenMessage>
      <ContactButton
        variant="secondary"
        size="sm"
        endIcon={<Icon name="arrowUpRight" />}
        forwardedAs="a"
        href={CONTACT_BUTTON_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        DM on Twitter
      </ContactButton>

      {/* Physics items as DOM elements - draggable via pointer events */}
      {displayBodies.map((item) => (
        <PhysicsItem
          key={item.id}
          style={{
            width: item.width,
            height: item.height,
            transform: `translate(${item.x - item.width / 2}px, ${
              item.y - item.height / 2
            }px) rotate(${item.angle || 0}rad)`,
          }}
          onPointerDown={(e) => handlePointerDown(e, item)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {item.isVideo ? (
            <Video
              src={item.src}
              poster={item.posterDataUrl || undefined}
              autoPlay={prefersReducedMotion === false}
              loop
              muted
              playsInline
              draggable={false}
            />
          ) : (
            <Img src={item.src} alt="" draggable={false} />
          )}
        </PhysicsItem>
      ))}
      <FixButtonStyled
        iconOnly
        variant="elevated"
        size="lg"
        icon={<Icon name="fix" />}
        onClick={onReset}
        aria-label="Fix layout"
      />
    </PhysicsOverlay>
  );
}

// ============================================
// MasonryGrid Component
// ============================================

// Easter egg configuration

// Threshold for triggering the easter egg
const EASTER_EGG_CLICKS = 3;
const EASTER_EGG_WINDOW = 10000; // 10 seconds in ms

export default function MasonryGrid({
  items,
  rows = 3,
  duration, // Optional: auto-calculated if not provided
  direction = "left",
  showPauseButton = true,
  showRefreshButton = true,
  className,
}) {
  // Calculate duration based on item count for consistent scroll speed
  const effectiveDuration = duration ?? calculateDuration(items.length, rows);
  // Pause state (manual toggle only)
  const [userPaused, setUserPaused] = useState(false);

  // Client-only rendering to avoid hydration mismatch from shuffle
  const [mounted, setMounted] = useState(false);

  // Shuffled items state (allows re-shuffling)
  const [shuffledItems, setShuffledItems] = useState([]);

  // Shuffle version - increments on each refresh to force all items to animate
  // When 0 (initial mount), items appear without animation
  // When > 0 (user clicked shuffle), items animate with crossfade
  const [shuffleVersion, setShuffleVersion] = useState(0);

  // Button disabled state during animation
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Icon flip animation state
  const [isFlipping, setIsFlipping] = useState(false);

  // Shuffle button visibility state (delayed for normal users, immediate for reduced motion)
  const [shuffleButtonVisible, setShuffleButtonVisible] = useState(false);

  // Track if user prefers reduced motion (using Motion's built-in hook)
  const prefersReducedMotion = usePrefersReducedMotion();

  // Phone layout: icon refresh only — no Shuffle label, pause, or easter egg
  const isPhone = useMediaQuery(QUERIES.phoneAndBelow);

  // Easter egg state
  const [isBroken, setIsBroken] = useState(false);
  const [capturedPositions, setCapturedPositions] = useState(null);
  const clickTimestampsRef = useRef([]);
  const gridRef = useRef(null);

  // Pre-captured video frames (captured during idle time, not during easter egg trigger)
  const videoFramesRef = useRef(new Map());

  useEffect(() => {
    // Shuffle once on mount
    setShuffledItems(shuffleArray(items));
    setMounted(true);
  }, [items]);

  // Phone has no physics mode; clear a leftover desktop egg so the grid isn't empty
  useEffect(() => {
    if (!isPhone || !isBroken) return;
    setIsBroken(false);
    setCapturedPositions(null);
    clickTimestampsRef.current = [];
  }, [isPhone, isBroken]);

  // Handle shuffle/refresh button visibility
  useEffect(() => {
    if (!mounted) return;

    if (isPhone || prefersReducedMotion) {
      setShuffleButtonVisible(true);
    } else {
      // Desktop: show shuffle button after 1 second
      const timeoutId = setTimeout(() => {
        setShuffleButtonVisible(true);
        // Trigger the icon flip animation on initial reveal
        setIsFlipping(true);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [mounted, prefersReducedMotion, isPhone]);

  // Pause/resume videos when reduced motion preference changes (WCAG 2.2.2)
  // Using our own listener to ensure DevTools emulation is detected
  // Also re-runs on shuffle to catch newly rendered videos
  useEffect(() => {
    if (!mounted || !gridRef.current) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateVideos = (shouldReduce) => {
      const videos = gridRef.current?.querySelectorAll("video");
      if (!videos) return;

      videos.forEach((video) => {
        if (shouldReduce) {
          video.pause();
        } else {
          video.play().catch(() => {});
        }
      });
    };

    // Initial check (and after shuffle)
    // Small delay to ensure new videos have rendered
    const timeoutId = setTimeout(() => updateVideos(mediaQuery.matches), 50);

    // Listen for changes (DevTools emulation or system settings)
    const handleChange = (e) => updateVideos(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      clearTimeout(timeoutId);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [mounted, shuffleVersion]);

  // Pre-capture video frames once after videos load (for easter egg poster fallback)
  // Skip on phone — easter egg is disabled there.
  useEffect(() => {
    if (!mounted || isPhone || !gridRef.current) return;

    const captureVideoFrames = () => {
      const container = gridRef.current;
      if (!container) return;

      const videoElements = container.querySelectorAll("video");
      videoElements.forEach((videoEl) => {
        const src = videoEl.src;
        // Skip if already captured or video not ready
        if (videoFramesRef.current.has(src) || !videoEl.videoWidth) return;

        try {
          const canvas = document.createElement("canvas");
          canvas.width = videoEl.videoWidth;
          canvas.height = videoEl.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          videoFramesRef.current.set(src, dataUrl);
        } catch (e) {
          // Ignore capture failures
        }
      });
    };

    // Capture once after videos have had time to load
    const timeoutId = setTimeout(captureVideoFrames, 2000);

    return () => clearTimeout(timeoutId);
  }, [mounted, isPhone]);

  // Distribute items across rows
  const rowData = useMemo(() => {
    if (shuffledItems.length === 0) return [];
    return distributeItems(shuffledItems, rows);
  }, [shuffledItems, rows]);

  // Handle refresh - ensures items move to different rows
  const handleRefresh = useCallback(() => {
    // Ignore clicks during animation (debounce without visual indicator)
    if (isRefreshing) return;

    // Trigger icon flip animation
    setIsFlipping(true);

    // Desktop only: Matter preload + easter egg click tracking
    if (!isPhone) {
      // Preload Matter.js on first click so it's ready by the triggering click
      preloadMatter();

      // Track click timestamps for easter egg
      const now = Date.now();
      clickTimestampsRef.current = [
        ...clickTimestampsRef.current.filter((t) => now - t < EASTER_EGG_WINDOW),
        now,
      ];

      // Check if easter egg should trigger
      if (clickTimestampsRef.current.length >= EASTER_EGG_CLICKS) {
        clickTimestampsRef.current = []; // Reset

        // Capture item positions BEFORE hiding the grid
        if (gridRef.current) {
          const container = gridRef.current;
          const rect = container.getBoundingClientRect();
          const mediaElements = container.querySelectorAll("li");
          const positions = [];

          // Fast position capture - no canvas work here
          // Video frames were pre-captured during idle time
          mediaElements.forEach((el, index) => {
            const elRect = el.getBoundingClientRect();
            const mediaSrc =
              el.querySelector("img")?.src || el.querySelector("video")?.src;
            const isVideo = !!el.querySelector("video");

            if (mediaSrc) {
              // Look up pre-captured video frame (no capture during easter egg)
              const posterDataUrl = isVideo
                ? videoFramesRef.current.get(mediaSrc) ||
                  el.querySelector("video")?.getAttribute("poster") ||
                  null
                : null;

              positions.push({
                id: index,
                x: elRect.left - rect.left + elRect.width / 2,
                y: elRect.top - rect.top + elRect.height / 2,
                width: elRect.width,
                height: elRect.height,
                src: mediaSrc,
                isVideo,
                posterDataUrl,
                angle: 0,
              });
            }
          });

          setCapturedPositions(positions);
        }

        setIsBroken(true);
        return;
      }
    }

    setIsRefreshing(true);
    // Increment shuffle version to force all items to animate (even same src in same slot)
    setShuffleVersion((v) => v + 1);
    // Use row-aware shuffle to ensure items change rows
    const newShuffle =
      rowData.length > 0
        ? shuffleWithRowChange(rowData, rows)
        : shuffleArray(items);
    setShuffledItems(newShuffle);
    // Re-enable button after animation completes
    setTimeout(() => setIsRefreshing(false), CROSSFADE_DURATION * 1000);
  }, [isRefreshing, items, rowData, rows, isPhone]);

  useMarqueeAnimations({
    gridRef,
    enabled: mounted && prefersReducedMotion === false,
    paused: userPaused,
    duration: effectiveDuration,
    direction,
    layoutKey: isBroken ? null : rowData,
  });

  // Handle reset from broken mode
  const handleFixBroken = useCallback(() => {
    setIsBroken(false);
    setCapturedPositions(null);
    // Reshuffle items when fixing
    setShuffleVersion((v) => v + 1);
    setShuffledItems(shuffleArray(items));
  }, [items]);

  // Handle empty state
  if (!items || items.length === 0) {
    return (
      <EmptyState className={className}>
        <p>No images to display</p>
      </EmptyState>
    );
  }

  // Don't render until client-side to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <GridWrapper
      ref={gridRef}
      className={className}
      aria-label="Visual gallery"
    >
      {!isBroken &&
        rowData.map((rowItems, rowIndex) => (
          <InfiniteMasonryRow
            key={rowIndex}
            items={rowItems}
            offset={getRowOffset(rowIndex)}
            shuffleKey={shuffleVersion}
            isPhone={isPhone}
          />
        ))}
      {!isBroken && (
        <ButtonGroup>
          <AnimatePresence>
            {showRefreshButton &&
              shuffleButtonVisible &&
              (isPhone ? (
                <Button
                  key="refresh-button"
                  iconOnly
                  size="lg"
                  variant="elevated"
                  icon={
                    <RefreshIcon
                      name="refresh"
                      $flipping={isFlipping}
                      onAnimationEnd={() => setIsFlipping(false)}
                    />
                  }
                  onClick={handleRefresh}
                  aria-label="Refresh gallery"
                />
              ) : (
                <ShuffleButtonWrapper
                  key="shuffle-button"
                  initial={prefersReducedMotion ? false : { width: 40 }}
                  animate={{ width: "auto" }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                >
                  <Button
                    size="lg"
                    variant="elevated"
                    startIcon={
                      <RefreshIcon
                        name="refresh"
                        $flipping={isFlipping}
                        onAnimationEnd={() => setIsFlipping(false)}
                      />
                    }
                    onClick={handleRefresh}
                    aria-label="Shuffle media"
                  >
                    <ShuffleText
                      initial={
                        prefersReducedMotion
                          ? false
                          : { opacity: 0, filter: "blur(8px)" }
                      }
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.05,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                    >
                      Shuffle
                    </ShuffleText>
                  </Button>
                </ShuffleButtonWrapper>
              ))}
          </AnimatePresence>
          {showPauseButton && !isPhone && (
            <PauseButton
              iconOnly
              size="lg"
              variant="elevated"
              icon={
                <AnimatePresence initial={false}>
                  <IconCrossfade
                    key={userPaused ? "play" : "pause"}
                    initial={{ opacity: 0, filter: "blur(2px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(2px)" }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <Icon name={userPaused ? "play" : "pause"} />
                  </IconCrossfade>
                </AnimatePresence>
              }
              onClick={() => setUserPaused(!userPaused)}
              aria-label={userPaused ? "Resume animation" : "Pause animation"}
              aria-pressed={userPaused}
            />
          )}
        </ButtonGroup>
      )}
      {!isPhone && isBroken && capturedPositions && (
        <BrokenPhysicsMode
          capturedPositions={capturedPositions}
          onReset={handleFixBroken}
          containerRef={gridRef}
        />
      )}
    </GridWrapper>
  );
}

// ============================================
// Styled Components
// ============================================

// Shared styles for media item containers (used by both ItemWrapper and PhysicsItem)
const sharedMediaItemStyles = css`
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-bg-hover);
`;

const ItemWrapper = styled.li`
  ${sharedMediaItemStyles}
  flex-shrink: 0;

  /* Static layout (reduced motion): size from row height */
  position: relative;
  height: 100%;
  aspect-ratio: 3 / 2;

  /* Marquee: whole-px box, x animated by useMarqueeAnimations */
  [data-marquee] & {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--masonry-tile-w);
    height: var(--masonry-row-h);
    will-change: transform;
  }
`;

/* Layer for crossfade - Motion handles animations */
const MediaLayer = styled(motion.div)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
`;

const RowWrapper = styled.ul`
  position: relative;
  flex: 1;
  min-height: 0; /* Allow flex item to shrink */
  display: flex;
  flex-direction: row;
  gap: var(--masonry-row-gap);

  /* Reset list styles */
  list-style: none;
  padding: 0;
  margin: 0;

  [data-marquee] > & {
    flex: 0 0 var(--masonry-row-h);
  }

  @media (prefers-reduced-motion: reduce) {
    /* Stagger each row using the offset variable (1.0, 1.3, 1.6 for 3 rows) */
    transform: translateX(calc((var(--offset) - 1) * -15%));
  }
`;

const GridWrapper = styled.section`
  --masonry-row-gap: ${MASONRY_ROW_GAP};
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--masonry-row-gap);
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: var(--spacing-1x) 0;

  @media ${QUERIES.phoneAndBelow} {
    --masonry-row-gap: ${MASONRY_ROW_GAP_PHONE};
  }

  /* Whole-px rows and gap; leftover px split above and below */
  &[data-marquee] {
    gap: var(--masonry-gap-px);
    justify-content: center;
  }
`;

const Img = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  user-select: none;
  -webkit-user-drag: none;
`;

const Video = styled.video`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  user-select: none;
  -webkit-user-drag: none;
`;

const ButtonGroup = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;

  display: flex;
  gap: 12px;

  @media ${QUERIES.phoneAndBelow} {
    bottom: 12px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-muted, #888);
  font-family: var(--font-sans);
`;

// ============================================
// Physics Mode Styled Components
// ============================================

const PhysicsOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  background: var(--color-bg-solid);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding-top: 8%;
`;

const FadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Motion wrapper for shuffle button expansion animation
const ShuffleButtonWrapper = styled(motion.div)`
  display: inline-flex;
`;

// Motion text for fade/blur reveal
const ShuffleText = styled(motion.span)``;

// Wrapper for play/pause icon crossfade animation
const IconCrossfade = styled(motion.span)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Pause button - hidden via CSS when reduced motion is preferred
const PauseButton = styled(Button)`
  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const Flip = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
  }
  20% {
    /* Quick toss upward */
    transform: translateY(-12px) rotate(100deg);
  }
  40% {
    /* Peak - hangs in the air */
    transform: translateY(-16px) rotate(200deg);
  }
  55% {
    /* Still near peak, rotation continues */
    transform: translateY(-14px) rotate(280deg);
  }
  75% {
    /* Falling back down */
    transform: translateY(-10px) rotate(340deg);
  }
  90% {
    /* Almost landed, slight overshoot */
    transform: translateY(3px) rotate(355deg);
  }
  100% {
    /* Settle */
    transform: translateY(0) rotate(360deg);
  }
`;

const RefreshIcon = styled(Icon)`
  transform-origin: center;
  ${(props) =>
    props.$flipping &&
    css`
      animation: ${Flip} 0.65s cubic-bezier(0.22, 1, 0.36, 1);
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const BrokenMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text-muted);
  animation: ${FadeIn} 0.3s ease-out 0.8s both;
`;

const ContactButton = styled(Button)`
  animation: ${FadeIn} 0.3s ease-out 0.8s both;
`;

const PhysicsItem = styled.div`
  ${sharedMediaItemStyles}
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  /* Now using pointer-events: auto for DOM-based dragging! */
  pointer-events: auto;
  will-change: transform;
  touch-action: none; /* Prevent scroll interference on touch devices */
  user-select: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

// FixButtonStyled extends Button with positioning and animation
const FixButtonStyled = styled(Button)`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;

  /* Animation */
  animation: ${FadeIn} 0.3s ease-out 0.8s both;
`;
