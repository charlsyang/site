import styled, { keyframes, css } from "styled-components";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

// ============================================
// Sample Media Data
// ============================================

export const SAMPLE_MEDIA = [
  {
    id: "1",
    src: "/visuals/aura-icons.png",
    alt: "Aura icons",
    type: "image",
  },
  {
    id: "2",
    src: "/visuals/card-hover.mp4",
    alt: "Card hover animation",
    type: "video",
  },
  {
    id: "3",
    src: "/visuals/classic-typo.png",
    alt: "Classic typography",
    type: "image",
  },
  {
    id: "4",
    src: "/visuals/credit-card.png",
    alt: "Credit card design",
    type: "image",
  },
  {
    id: "5",
    src: "/visuals/dialogue.png",
    alt: "Dialogue interface",
    type: "image",
  },
  {
    id: "6",
    src: "/visuals/light-dark.mp4",
    alt: "Light dark mode transition",
    type: "video",
  },
  {
    id: "7",
    src: "/visuals/personalized-care.png",
    alt: "Personalized care",
    type: "image",
  },
  {
    id: "8",
    src: "/visuals/product-icons.png",
    alt: "Product icons",
    type: "image",
  },
  {
    id: "9",
    src: "/visuals/redream-teaser.mp4",
    alt: "Redream teaser",
    type: "video",
  },
  {
    id: "10",
    src: "/visuals/research-principles-icons.png",
    alt: "Research principles icons",
    type: "image",
  },
  {
    id: "11",
    src: "/visuals/rubrik-swag.png",
    alt: "Rubrik swag",
    type: "image",
  },
  {
    id: "12",
    src: "/visuals/sim-card.png",
    alt: "Sim card design",
    type: "image",
  },
  {
    id: "13",
    src: "/visuals/smart-home.png",
    alt: "Smart home interface",
    type: "image",
  },
  {
    id: "14",
    src: "/visuals/smart-mug.png",
    alt: "Smart mug product",
    type: "image",
  },
  {
    id: "15",
    src: "/visuals/tide.mp4",
    alt: "Tide animation",
    type: "video",
  },
  {
    id: "16",
    src: "/visuals/timeline.png",
    alt: "Timeline design",
    type: "image",
  },
  {
    id: "17",
    src: "/visuals/todo.mp4",
    alt: "Todo app animation",
    type: "video",
  },
];

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
// Icons
// ============================================

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 2.5v11l9-5.5-9-5.5z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 2h3v12H4V2zm5 0h3v12H9V2z" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 3a5 5 0 0 0-4.9 4H1l3 3.5L7 7H4.1a3.9 3.9 0 1 1 .73 3.36l-1.47 1.08A5.5 5.5 0 1 0 8 3z" />
  </svg>
);

const FixIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path
      d="M11.5 1.5a2.5 2.5 0 0 1 3 3L12 7l3 3-7 5-.5-4-4-.5 5-7 3-2.5zM2.5 13.5L6 10"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ============================================
// Crossfade Configuration
// ============================================
const CROSSFADE_DURATION = 0.5; // seconds (for Motion)

// Motion animation variants for crossfade
const crossfadeVariants = {
  initial: { opacity: 0, filter: "blur(16px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(16px)" },
};

const crossfadeTransition = {
  duration: CROSSFADE_DURATION,
  ease: [0.4, 0, 0.2, 1],
};

// ============================================
// MasonryItem Component (simplified with Motion)
// ============================================

function MasonryItem({ item, index, animationPaused, shuffleKey }) {
  // Skip ENTRY animation on initial mount (shuffleKey === 0)
  // But always enable EXIT animation so crossfade works on first refresh click
  const skipEntryAnimation = shuffleKey === 0;

  return (
    <ItemWrapper
      style={{ "--index": index }}
      $paused={animationPaused}
      aria-hidden={item.isDuplicate ? "true" : undefined}
    >
      <AnimatePresence mode="popLayout">
        <MediaLayer
          key={`${item.src}-${shuffleKey}`}
          variants={crossfadeVariants}
          initial={skipEntryAnimation ? false : "initial"}
          animate="animate"
          exit="exit"
          transition={crossfadeTransition}
        >
          {item.type === "video" ? (
            <Video
              src={item.src}
              autoPlay
              loop
              muted
              playsInline
              draggable={false}
            />
          ) : (
            <Img src={item.src} alt={item.alt || ""} draggable={false} />
          )}
        </MediaLayer>
      </AnimatePresence>
    </ItemWrapper>
  );
}

// ============================================
// InfiniteMasonryRow Component
// ============================================

function InfiniteMasonryRow({
  items,
  count,
  duration = 30,
  offset = 1.2,
  direction = "left",
  animationPaused = false,
  shuffleKey = 0,
  className,
}) {
  return (
    <RowWrapper
      style={{
        "--count": count,
        "--duration": `${duration}s`,
        "--offset": offset,
      }}
      $direction={direction}
      className={className}
    >
      {items.map((item, index) => (
        <MasonryItem
          key={index}
          item={item}
          index={index}
          animationPaused={animationPaused}
          shuffleKey={shuffleKey}
        />
      ))}
    </RowWrapper>
  );
}

// ============================================
// BrokenPhysicsMode Component (Easter Egg)
// ============================================

function BrokenPhysicsMode({ capturedPositions, onReset, containerRef }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const mouseConstraintRef = useRef(null);
  const [bodies, setBodies] = useState([]);

  // Use captured positions immediately for rendering
  const itemData = capturedPositions || [];

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || itemData.length === 0)
      return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const rect = container.getBoundingClientRect();

    let cleanupPhysics = null;
    let cancelled = false;

    // Dynamically import Matter.js only when physics mode is activated
    import("matter-js").then((MatterModule) => {
      if (cancelled) return;

      const Matter = MatterModule.default;

      function startPhysics() {
        // Create Matter.js engine
        const engine = Matter.Engine.create({
          gravity: { x: 0, y: 1.5 },
        });
        engineRef.current = engine;

        // Create renderer (invisible - we'll render our own items)
        const render = Matter.Render.create({
          canvas: canvas,
          engine: engine,
          options: {
            width: rect.width,
            height: rect.height,
            wireframes: false,
            background: "transparent",
            pixelRatio: window.devicePixelRatio || 1,
          },
        });
        renderRef.current = render;

        // Create ground and walls
        const wallThickness = 60;
        const ground = Matter.Bodies.rectangle(
          rect.width / 2,
          rect.height + wallThickness / 2,
          rect.width * 2,
          wallThickness,
          { isStatic: true, render: { visible: false } }
        );
        const leftWall = Matter.Bodies.rectangle(
          -wallThickness / 2,
          rect.height / 2,
          wallThickness,
          rect.height * 2,
          { isStatic: true, render: { visible: false } }
        );
        const rightWall = Matter.Bodies.rectangle(
          rect.width + wallThickness / 2,
          rect.height / 2,
          wallThickness,
          rect.height * 2,
          { isStatic: true, render: { visible: false } }
        );

        Matter.Composite.add(engine.world, [ground, leftWall, rightWall]);

        // Create bodies for each media item
        const mediaBodies = itemData.map((item, i) => {
          const body = Matter.Bodies.rectangle(
            item.x,
            item.y,
            item.width * 0.6,
            item.height * 0.6,
            {
              restitution: 0.2,
              friction: 0.3,
              frictionAir: 0.05,
              render: { visible: false },
              chamfer: { radius: 50 }, // Rounded corners allow visual overlap
            }
          );

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

        // Create mouse constraint for dragging
        const mouse = Matter.Mouse.create(canvas);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: 0.2,
            render: { visible: false },
          },
        });

        // Fix for high DPI displays
        mouse.pixelRatio = window.devicePixelRatio || 1;

        Matter.Composite.add(engine.world, mouseConstraint);
        mouseConstraintRef.current = mouseConstraint;

        // Keep the mouse in sync with rendering
        render.mouse = mouse;

        // Create runner
        const runner = Matter.Runner.create();
        runnerRef.current = runner;

        // Start the engine and renderer
        Matter.Runner.run(runner, engine);
        Matter.Render.run(render);

        // Animation loop to update body positions
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
          Matter.Render.stop(render);
          Matter.Runner.stop(runner);
          Matter.Composite.clear(engine.world);
          Matter.Engine.clear(engine);
          render.canvas = null;
          render.context = null;
          render.textures = {};
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

  // Use physics bodies if available, otherwise show initial static positions
  const displayBodies = bodies.length > 0 ? bodies : itemData;

  return (
    <PhysicsOverlay>
      <PhysicsCanvas ref={canvasRef} />
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
        >
          {item.isVideo ? (
            <Video
              src={item.src}
              autoPlay
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
      <FixButton onClick={onReset}>
        <FixIcon />
        <span>Fix it</span>
      </FixButton>
    </PhysicsOverlay>
  );
}

// ============================================
// MasonryGrid Component
// ============================================

// Easter egg configuration

// Threshold for triggering the easter egg
const EASTER_EGG_CLICKS = 15;
const EASTER_EGG_WINDOW = 10000; // 5 seconds in ms

export default function MasonryGrid({
  items,
  rows = 3,
  duration = 30,
  gap = 16,
  direction = "left",
  showPauseButton = true,
  showRefreshButton = true,
  className,
}) {
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

  // Easter egg state
  const [isBroken, setIsBroken] = useState(false);
  const [capturedPositions, setCapturedPositions] = useState(null);
  const clickTimestampsRef = useRef([]);
  const gridRef = useRef(null);

  useEffect(() => {
    // Shuffle once on mount
    setShuffledItems(shuffleArray(items));
    setMounted(true);
  }, [items]);

  // Distribute items across rows
  const rowData = useMemo(() => {
    if (shuffledItems.length === 0) return [];
    return distributeItems(shuffledItems, rows);
  }, [shuffledItems, rows]);

  // Handle refresh - ensures items move to different rows
  const handleRefresh = useCallback(() => {
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

        mediaElements.forEach((el, index) => {
          const elRect = el.getBoundingClientRect();
          const mediaSrc =
            el.querySelector("img")?.src || el.querySelector("video")?.src;
          const isVideo = !!el.querySelector("video");

          if (mediaSrc) {
            positions.push({
              id: index,
              x: elRect.left - rect.left + elRect.width / 2,
              y: elRect.top - rect.top + elRect.height / 2,
              width: elRect.width,
              height: elRect.height,
              src: mediaSrc,
              isVideo,
              angle: 0,
            });
          }
        });

        setCapturedPositions(positions);
      }

      setIsBroken(true);
      return;
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
  }, [items, rowData, rows]);

  // Handle reset from broken mode
  const handleFixBroken = useCallback(() => {
    setIsBroken(false);
    setCapturedPositions(null);
    // Reshuffle items when fixing
    setShuffleVersion((v) => v + 1);
    setShuffledItems(shuffleArray(items));
  }, [items]);

  // Calculate offset for each row to create stagger
  const getRowOffset = (rowIndex) => {
    const baseOffset = 1;
    return baseOffset + rowIndex * 0.3;
  };

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
            count={rowItems.length}
            duration={duration}
            offset={getRowOffset(rowIndex)}
            direction={direction}
            animationPaused={userPaused}
            shuffleKey={shuffleVersion}
          />
        ))}
      {!isBroken && (
        <ButtonGroup>
          {showRefreshButton && (
            <ControlButton
              onClick={handleRefresh}
              aria-label="Shuffle media"
              disabled={isRefreshing}
            >
              <RefreshIconWrapper $spinning={isRefreshing}>
                <RefreshIcon />
              </RefreshIconWrapper>
            </ControlButton>
          )}
          {showPauseButton && (
            <ControlButton
              onClick={() => setUserPaused(!userPaused)}
              aria-label={userPaused ? "Resume animation" : "Pause animation"}
              aria-pressed={userPaused}
            >
              {userPaused ? <PlayIcon /> : <PauseIcon />}
            </ControlButton>
          )}
        </ButtonGroup>
      )}
      {isBroken && capturedPositions && (
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

const scrollLeft = keyframes`
  100% {
    translate: var(--destination-x) 0;
  }
`;

const ItemWrapper = styled.li`
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;

  /* Size based on row height, width derived from aspect ratio */
  height: 100%;
  aspect-ratio: 3 / 2;

  /* Enable layering for crossfade */
  position: relative;

  /* Inset: controls gap between items */
  --inset: -0.9;

  --origin-x: calc(((var(--count) - var(--index)) + var(--inset, 0)) * 100%);
  --destination-x: calc((var(--index) + 1) * -100%);

  --delay: calc(
    (var(--duration) / var(--count)) *
      (var(--index, 0) - (var(--count) * var(--offset)))
  );

  /* Initial position */
  translate: var(--origin-x) 0;

  /* Animation */
  animation: ${scrollLeft} var(--duration)
    calc(var(--delay) - (var(--count) * 0.5s)) infinite linear;
  animation-play-state: ${({ $paused }) => ($paused ? "paused" : "running")};

  /* GPU acceleration */
  will-change: transform;

  /* Reduced motion fallback */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    translate: 0 0;
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
  flex: 1;
  min-height: 0; /* Allow flex item to shrink */
  display: flex;
  flex-direction: row;
  gap: 0;

  /* Reset list styles */
  list-style: none;
  padding: 0;
  margin: 0;

  /* Reduced motion: add gap and stagger rows */
  @media (prefers-reduced-motion: reduce) {
    gap: 0.6vw;
    /* Stagger each row using the offset variable (1.0, 1.3, 1.6 for 3 rows) */
    transform: translateX(calc((var(--offset) - 1) * -15%));
  }
`;

const GridWrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.45vw;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: var(--spacing-1x) 0;
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
  gap: 8px;

  /* Hide when reduced motion is preferred (no animation to control) */
  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RefreshIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${({ $spinning }) => ($spinning ? spinAnimation : "none")} 0.5s
    ease-in-out;
`;

const ControlButton = styled.button`
  /* Circular button */
  width: 40px;
  height: 40px;
  border-radius: 50%;

  /* Reset button styles */
  border: none;
  padding: 0;
  margin: 0;

  /* Subtle glass effect */
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.16);

  /* Center icon */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Color */
  color: rgba(255, 255, 255, 1);

  /* Cursor */
  cursor: pointer;

  /* Transitions */
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }

  /* Accessible focus state */
  &:focus-visible {
    outline: 2px solid var(--color-accent, #6366f1);
    outline-offset: 2px;
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
  background: var(--color-bg-solid, #0a0a0a);
`;

const PhysicsCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
`;

const PhysicsItem = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  pointer-events: none;
  will-change: transform;
`;

const fixButtonSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FixButton = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;

  /* Pill button */
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 24px;

  /* Reset button styles */
  border: none;
  margin: 0;

  /* Glass effect */
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  /* Color */
  color: rgba(255, 255, 255, 0.95);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;

  /* Cursor */
  cursor: pointer;

  /* Animation */
  animation: ${fixButtonSlideIn} 0.4s ease-out 0.5s both;

  /* Transitions */
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  /* Accessible focus state */
  &:focus-visible {
    outline: 2px solid var(--color-accent, #6366f1);
    outline-offset: 2px;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;
