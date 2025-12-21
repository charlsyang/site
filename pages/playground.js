import Head from "../components/Head";
import styled, { keyframes } from "styled-components";
import { useState, useEffect, useMemo, useRef } from "react";
import { QUERIES } from "../utils/constants";
import Image from "next/image";

// ============================================
// Sample Media Data for Testing
// ============================================

const SAMPLE_MEDIA = [
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
 * Distribute items across columns using round-robin,
 * then equalize column lengths by duplicating items
 */
function distributeItems(items, columnCount) {
  // Initialize empty columns
  const columns = Array.from({ length: columnCount }, () => []);

  // Round-robin distribution
  items.forEach((item, index) => {
    const columnIndex = index % columnCount;
    columns[columnIndex].push(item);
  });

  // Find max length
  const maxLength = Math.max(...columns.map((col) => col.length));

  // Equalize by borrowing items from OTHER columns (no repeats within same column)
  columns.forEach((column, colIndex) => {
    let dupIndex = 0;
    while (column.length < maxLength) {
      // Pick from a different column (round-robin through other columns, skip self)
      let sourceColIndex = (colIndex + 1 + dupIndex) % columnCount;
      if (sourceColIndex === colIndex) {
        sourceColIndex = (sourceColIndex + 1) % columnCount;
      }
      const sourceColumn = columns[sourceColIndex];
      const sourceItem = sourceColumn[dupIndex % sourceColumn.length];

      column.push({
        ...sourceItem,
        id: `${sourceItem.id}-dup-${colIndex}-${dupIndex}`,
        isDuplicate: true,
      });
      dupIndex++;
    }
  });

  return columns;
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

// ============================================
// MasonryItem Component
// ============================================

function MasonryItem({ item, index, animationPaused }) {
  return (
    <ItemWrapper
      style={{ "--index": index }}
      $paused={animationPaused}
      aria-hidden={item.isDuplicate ? "true" : undefined}
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
    </ItemWrapper>
  );
}

// ============================================
// InfiniteMasonryColumn Component
// ============================================

function InfiniteMasonryColumn({
  items,
  count,
  duration = 30,
  offset = 1.2,
  direction = "up",
  animationPaused = false,
  className,
}) {
  return (
    <ColumnWrapper
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
          key={item.id}
          item={item}
          index={index}
          animationPaused={animationPaused}
        />
      ))}
    </ColumnWrapper>
  );
}

// ============================================
// MasonryGrid Component
// ============================================

function MasonryGrid({
  items,
  columns = 3,
  duration = 30,
  gap = 16,
  direction = "up",
  showPauseButton = true,
  className,
}) {
  // Pause state (manual toggle only)
  const [userPaused, setUserPaused] = useState(false);

  // Client-only rendering to avoid hydration mismatch from shuffle
  const [mounted, setMounted] = useState(false);
  const shuffledItemsRef = useRef(null);

  useEffect(() => {
    // Shuffle once on mount, store in ref to avoid re-renders
    shuffledItemsRef.current = shuffleArray(items);
    setMounted(true);
  }, [items]);

  // Distribute items across columns
  const columnData = useMemo(() => {
    if (!shuffledItemsRef.current) return [];
    return distributeItems(shuffledItemsRef.current, columns);
  }, [mounted, columns]);

  // Calculate offset for each column to create stagger
  const getColumnOffset = (columnIndex) => {
    const baseOffset = 1;
    return baseOffset + columnIndex * 0.3;
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
    <GridWrapper className={className} aria-label="Visual gallery">
      {columnData.map((columnItems, columnIndex) => (
        <InfiniteMasonryColumn
          key={columnIndex}
          items={columnItems}
          count={columnItems.length}
          duration={duration}
          offset={getColumnOffset(columnIndex)}
          direction={direction}
          animationPaused={userPaused}
        />
      ))}
      {showPauseButton && (
        <PauseButton
          onClick={() => setUserPaused(!userPaused)}
          aria-label={userPaused ? "Resume animation" : "Pause animation"}
          aria-pressed={userPaused}
        >
          {userPaused ? <PlayIcon /> : <PauseIcon />}
        </PauseButton>
      )}
    </GridWrapper>
  );
}

// ============================================
// Styled Components
// ============================================

const scrollUp = keyframes`
  100% {
    translate: 0 var(--destination-y);
  }
`;

// ItemWrapper defined first so GridWrapper can reference it in :has()
const ItemWrapper = styled.li`
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  /* Fixed aspect ratio ensures all items have same height relative to width */
  aspect-ratio: 3 / 2;

  /* Inset: controls gap between items */
  --inset: -0.8;

  --origin-y: calc(((var(--count) - var(--index)) + var(--inset, 0)) * 100%);
  --destination-y: calc((var(--index) + 1) * -100%);

  --delay: calc(
    (var(--duration) / var(--count)) *
      (var(--index, 0) - (var(--count) * var(--offset)))
  );

  /* Initial position */
  translate: 0 var(--origin-y);

  /* Animation */
  animation: ${scrollUp} var(--duration)
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

const ColumnWrapper = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;

  /* Reset list styles */
  list-style: none;
  padding: 0;
  margin: 0;

  /* Reduced motion: add gap and stagger columns */
  @media (prefers-reduced-motion: reduce) {
    gap: 0.6vw;
    /* Stagger each column using the offset variable (1.0, 1.3, 1.6 for 3 cols) */
    transform: translateY(calc((var(--offset) - 1) * -15%));
  }
`;

const GridWrapper = styled.section`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6vw;
  height: 100%;
  overflow: hidden;
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

const PauseButton = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;

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
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:active {
    transform: scale(0.95);
  }

  /* Accessible focus state */
  &:focus-visible {
    outline: 2px solid var(--color-accent, #6366f1);
    outline-offset: 2px;
  }

  /* Hide when reduced motion is preferred (no animation to pause) */
  @media (prefers-reduced-motion: reduce) {
    display: none;
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
// Playground Page
// ============================================

export default function Playground() {
  return (
    <>
      <Head title="Playground" />
      <Main>
        <Header>
          <Title>Charlsy Yang</Title>
          <Subtitle>Software designer.</Subtitle>
        </Header>
        <GridContainer>
          <MasonryGrid
            items={SAMPLE_MEDIA}
            columns={3}
            duration={40}
            gap={12}
            direction="up"
          />
        </GridContainer>
      </Main>
    </>
  );
}

Playground.noLayout = true;

// ============================================
// Page Styles
// ============================================

const Main = styled.main`
  height: 100vh;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  padding: 1rem;
`;

const Header = styled.header`
  flex: 0 0 33.333%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h1`
  font-family: var(--font-sans);
  font-weight: var(--font-weight-normal);
  font-size: var(--font-size-m);
  color: var(--color-text-base);
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: var(--font-size-m);
  color: var(--color-text-muted);
  max-width: 400px;
  margin: 0;
`;

const GridContainer = styled.div`
  flex: 0 0 66.666%;
  min-height: 0; /* Required for flex child to shrink */
  margin-right: 3rem;
  border-radius: 16px;
  overflow: hidden;
  background-color: var(--color-bg-solid);
  padding: 0 0.6vw;
`;
