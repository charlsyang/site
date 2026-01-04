# Infinite Masonry Grid — Design Document

## Overview

An auto-scrolling masonry grid component for displaying a collection of images in a Pinterest-style layout. Each column scrolls vertically in an infinite loop, with staggered starting positions to create visual depth and movement.

**Tech Stack:** React, styled-components, CSS Animations

---

## Goals

- Display images in a multi-column masonry layout
- Each column scrolls vertically in an infinite loop
- Columns appear offset from each other (not synchronized)
- Smooth, performant CSS-based animation (GPU-accelerated)
- No JavaScript required during animation
- Support pause/resume functionality
- **Hover pauses entire grid** — hovering any image stops all columns
- **Explicit pause button** — visible control for users to pause/resume
- **Reduced motion support** — start paused when `prefers-reduced-motion` is enabled
- **Randomized distribution** — images shuffled on each render for variety

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ <MasonryGrid />                                             │
│   - Receives media array, shuffles on mount                 │
│   - Distributes items across columns                        │
│   - Manages pause state (user, hover, reduced motion)       │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │<Infinite    │ │<Infinite    │ │<Infinite    │           │
│  │MasonryCol/> │ │MasonryCol/> │ │MasonryCol/> │           │
│  │             │ │             │ │             │           │
│  │ offset=1.2  │ │ offset=1.5  │ │ offset=1.9  │           │
│  │             │ │             │ │             │           │
│  │             │ │             │ │             │   ┌─────┐ │
│  │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │   │ ▶︎ ❚❚│ │
│  │ │ Item 0  │ │ │ │ Item 0  │ │ │ │ Item 0  │ │   └─────┘ │
│  │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │   Pause   │
│  │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │   Button  │
│  │ │ Item 1  │ │ │ │ Item 1  │ │ │ │ Item 1  │ │           │
│  │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │           │
│  │     ⋮       │ │     ⋮       │ │     ⋮       │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘

State flow:
  userPaused ─────┐
  isHovering ─────┼──► isPaused ──► columns + pause button
  reducedMotion ──┘
```

---

## Components

### 1. `<MasonryGrid />`

Container that orchestrates image distribution and column rendering.

#### Props

| Prop              | Type             | Default  | Description                                     |
| ----------------- | ---------------- | -------- | ----------------------------------------------- |
| `images`          | `ImageData[]`    | required | Array of image objects                          |
| `columns`         | `number`         | `3`      | Number of columns                               |
| `duration`        | `number`         | `30`     | Animation duration in seconds (higher = slower) |
| `gap`             | `number`         | `16`     | Gap between columns and items (px)              |
| `direction`       | `'up' \| 'down'` | `'up'`   | Scroll direction                                |
| `showPauseButton` | `boolean`        | `true`   | Show the pause/play control button              |
| `className`       | `string`         | —        | Container className                             |

> **Note:** The grid manages its own pause state internally. It starts paused if the user has `prefers-reduced-motion` enabled. Hovering any image also pauses the grid.

#### MediaData Shape

```typescript
interface MediaData {
  id: string;
  src: string; // Image or video source
  alt?: string; // Alt text for images
  type?: "image" | "video"; // Defaults to 'image'
}
```

> Supports both images and videos. Videos will autoplay, loop, and mute by default.

#### Responsibilities

- **Shuffle** images randomly on each render (different per refresh)
- **Distribute** shuffled images across columns via round-robin
- **Equalize** column lengths by duplicating items
- **Calculate** `offset` for each column to create stagger
- **Manage pause state**: hover, button click, reduced motion preference
- **Render pause button** when `showPauseButton` is true
- **Pass shared props** (duration, paused, gap) to columns

---

### 2. `<InfiniteMasonryColumn />`

A single column that renders items and applies the infinite scroll animation.

#### Props

| Prop         | Type             | Default  | Description                                    |
| ------------ | ---------------- | -------- | ---------------------------------------------- |
| `items`      | `MediaData[]`    | required | Media items for this column                    |
| `count`      | `number`         | required | Total item count (for `--count` CSS var)       |
| `duration`   | `number`         | `30`     | Animation duration (seconds)                   |
| `offset`     | `number`         | `1.2`    | Initial position offset multiplier (see below) |
| `gap`        | `number`         | `16`     | Gap between items (px)                         |
| `direction`  | `'up' \| 'down'` | `'up'`   | Scroll direction                               |
| `paused`     | `boolean`        | `false`  | Pause animation                                |
| `onHover`    | `() => void`     | —        | Called when any item is hovered                |
| `onHoverEnd` | `() => void`     | —        | Called when hover ends                         |
| `className`  | `string`         | —        | Column className                               |

#### CSS Variables (set on column element)

```css
--count: 8; /* number of items */
--duration: 30s; /* animation duration */
--offset: 1.2; /* initial position offset multiplier */
```

#### Offset Explained

The `offset` prop controls where items appear initially in the viewport. It's a multiplier applied to the item count when calculating animation delays:

```
--delay: (duration / count) × (index - (count × offset))
```

- **Lower offset (e.g. 1.0):** Items start closer to their origin positions
- **Higher offset (e.g. 1.5):** Items start further into their animation cycle
- **Default (1.2):** Items appear naturally distributed in the viewport at t=0

To stagger columns (so they don't scroll in sync), use different offset values:

```
Column 0: offset = 1.2
Column 1: offset = 1.5
Column 2: offset = 1.8
```

---

### 3. `<MasonryItem />`

Wrapper for individual images with consistent styling.

#### Props

| Prop        | Type        | Description                    |
| ----------- | ----------- | ------------------------------ |
| `index`     | `number`    | Item's index within column     |
| `children`  | `ReactNode` | Content (typically an `<img>`) |
| `className` | `string`    | Item className                 |

#### Inline Style

```tsx
style={{ '--index': index } as React.CSSProperties}
```

---

## State Management

### Pause State

The grid tracks pause state from three sources, combined with OR logic:

```
isPaused = userPaused || isHovering || prefersReducedMotion
```

| Source                 | Trigger                            | Controlled by    |
| ---------------------- | ---------------------------------- | ---------------- |
| `userPaused`           | Pause button click                 | Internal state   |
| `isHovering`           | Mouse enters any `<MasonryItem />` | Internal state   |
| `prefersReducedMotion` | System accessibility setting       | Media query hook |

### Reduced Motion Detection

On mount, check the user's motion preference and initialize `userPaused` accordingly:

```tsx
const [userPaused, setUserPaused] = useState(false);

useEffect(() => {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQuery.matches) {
    setUserPaused(true);
  }
}, []);
```

### Hover Behavior

When the user hovers any image in the grid, all columns pause together:

```tsx
// In MasonryGrid
const [isHovering, setIsHovering] = useState(false);

// Pass to each column
<InfiniteMasonryColumn
  onHover={() => setIsHovering(true)}
  onHoverEnd={() => setIsHovering(false)}
  paused={userPaused || isHovering}
  // ...
/>;
```

Each `<MasonryItem />` handles its own mouse events and bubbles up to the column:

```tsx
// In MasonryItem
<ItemWrapper onMouseEnter={onHover} onMouseLeave={onHoverEnd}>
  {children}
</ItemWrapper>
```

---

## Pause Button

A visible control that lets users manually pause/resume the animation.

### Placement

Position in the bottom-right corner of the grid container, floating above content:

```tsx
<GridWrapper>
  {columns}
  {showPauseButton && (
    <PauseButton onClick={() => setUserPaused(!userPaused)}>
      {isPaused ? <PlayIcon /> : <PauseIcon />}
    </PauseButton>
  )}
</GridWrapper>
```

### Styling

```css
.pause-button {
  position: absolute;
  bottom: var(--spacing-3x);
  right: var(--spacing-3x);

  /* Circular button */
  width: 40px;
  height: 40px;
  border-radius: 50%;

  /* Subtle glass effect */
  background: var(--color-bg-offset);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);

  /* Accessible focus state */
  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}
```

### Accessibility

- Use `aria-label` to describe the action: `"Pause animation"` or `"Resume animation"`
- Ensure button is keyboard accessible
- Consider `aria-pressed` for toggle state

---

## Core Animation Principle

**Key insight:** Each item animates independently using CSS. No container animation, no JavaScript during animation, no item duplication for looping.

### How It Works

1. **Each item translates itself** from an origin (below viewport) to a destination (above viewport)
2. **All items travel the same total distance** — ensures uniform speed and even spacing
3. **Negative delays** pre-position items so they're already distributed in the viewport at t=0
4. **When animation loops** — item snaps back to origin (happens off-screen, invisible to user)

---

## Animation Math

For a column with `N` items scrolling **upward**:

### Origin Position (where item starts)

Each item starts **below** the viewport. Item 0 starts furthest down.

```
--origin-y: calc((count - index) * 100%)

Example (8 items):
  Item 0: (8 - 0) × 100% = 800% below
  Item 1: (8 - 1) × 100% = 700% below
  Item 7: (8 - 7) × 100% = 100% below
```

### Destination Position (where item ends)

Each item ends **above** the viewport. Item 0 ends just above.

```
--destination-y: calc((index + 1) * -100%)

Example (8 items):
  Item 0: (0 + 1) × -100% = -100% above
  Item 1: (1 + 1) × -100% = -200% above
  Item 7: (7 + 1) × -100% = -800% above
```

### Total Travel Distance

All items travel the same distance:

```
Item 0: 800% → -100% = 900% total
Item 1: 700% → -200% = 900% total
Item 7: 100% → -800% = 900% total
```

**Same distance + same duration = same speed = even spacing maintained**

### Staggered Delays

Negative delays mean the animation starts _already in progress_:

```
--delay: calc((duration / count) × (index - (count × offset)))

Example (30s duration, 8 items, offset = 1.2):
  Item 0: (30s / 8) × (0 - 9.6) = 3.75s × -9.6 = -36s
  Item 7: (30s / 8) × (7 - 9.6) = 3.75s × -2.6 = -9.75s
```

- Item 0 has a large negative delay → already traveled into viewport at t=0
- Item 7 has a smaller negative delay → closer to its starting position

The `offset` multiplier controls how far into the cycle items begin. Varying it per column creates stagger.

---

## Animation Diagram

```
                    ┌─────────────┐
                    │   -800%     │  ← destination zone (above viewport)
                    │   -700%     │
                    │     ⋮       │     Items exit here, loop back to origin
                    │   -100%     │
 ═══════════════════╪═════════════╪══════════════
                    │             │
                    │  VIEWPORT   │  ← items visible here
                    │             │
                    │   [Item 3]  │
                    │   [Item 4]  │
                    │   [Item 5]  │
                    │             │
 ═══════════════════╪═════════════╪══════════════
                    │   +100%     │
                    │   +200%     │  ← origin zone (below viewport)
                    │     ⋮       │     Items start here
                    │   +800%     │
                    └─────────────┘

Animation: translateY(origin) → translateY(destination)
           Each item moves upward independently
           Same speed, staggered timing
```

---

## Column Stagger

To offset columns so they don't scroll in sync, vary the `offset` prop per column:

```
Column 0: offset = 1.2
Column 1: offset = 1.2 + (1 / columns) = 1.53  (for 3 columns)
Column 2: offset = 1.2 + (2 / columns) = 1.87
```

This shifts where each column's items appear in their animation cycle at t=0, creating a staggered visual effect without using time-based offsets.

---

## Image Distribution Algorithm

### Input

- Array of N media items
- C columns

### Steps

1. **Shuffle** the array randomly on each render

   - Use `useMemo` with an empty dependency array to shuffle once per mount
   - Each page refresh produces a different arrangement

2. **Distribute** using round-robin assignment:

   ```
   Item 0 → Column 0
   Item 1 → Column 1
   Item 2 → Column 2
   Item 3 → Column 0
   ... and so on
   ```

3. **Equalize** column lengths:
   - Find the column with the most items (max length)
   - For shorter columns, duplicate items from the beginning until all columns have equal length
   - Assign unique keys to duplicates: `{originalId}-dup-{index}`

### Shuffle Implementation

```tsx
// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// In component — shuffle on client after mount (SSR-safe)
const [shuffledItems, setShuffledItems] = useState(items);

useEffect(() => {
  setShuffledItems(shuffleArray(items));
}, []);
```

> **Note:** Shuffle happens in `useEffect` to avoid SSR hydration mismatch. Server renders original order; client shuffles after mount. Each page refresh produces a new arrangement.

### Example

```
Input: 10 items [A-J], 3 columns

After shuffle: [C, A, H, F, B, J, D, G, I, E]

After round-robin:
  Column 0: [C, F, D, I]    (4 items)
  Column 1: [A, B, G, E]    (4 items)
  Column 2: [H, J]          (2 items)

After equalization:
  Column 0: [C, F, D, I]    (4 items)
  Column 1: [A, B, G, E]    (4 items)
  Column 2: [H, J, H', J']  (4 items, H' and J' are duplicates)
```

**Why equalize?** Equal item counts ensure all columns have the same animation timing and loop together seamlessly.

---

## CSS Implementation (styled-components)

### Column Container

```tsx
const MasonryColumn = styled.div`
  --count: 8;
  --duration: 30s;
  --offset: 1.2;

  display: flex;
  flex-direction: column;
  gap: var(--gap, 16px);
  overflow: hidden;
  height: 100%;
`;
```

### Item Animation

```tsx
const MasonryItem = styled.div`
  flex-shrink: 0;

  /* Origin: below viewport, item 0 furthest down */
  --origin-y: calc((var(--count) - var(--index)) * 100%);

  /* Destination: above viewport, item 0 just above */
  --destination-y: calc((var(--index) + 1) * -100%);

  /* Delay: staggered based on offset */
  --delay: calc(
    (var(--duration) / var(--count)) * (var(--index) -
          (var(--count) * var(--offset)))
  );

  /* Initial position */
  translate: 0 var(--origin-y);

  /* Animation */
  animation: scroll-up var(--duration) var(--delay) infinite linear;

  @keyframes scroll-up {
    to {
      translate: 0 var(--destination-y);
    }
  }
`;
```

### Pause State (via prop)

```tsx
const MasonryItem = styled.div<{ $paused: boolean }>`
  /* ... animation properties ... */

  animation-play-state: ${({ $paused }) => ($paused ? "paused" : "running")};
`;
```

### Hover Cursor Feedback

```tsx
const MasonryItem = styled.div`
  cursor: pointer;

  /* Optional: subtle scale on hover */
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.01);
  }
`;
```

### Reduced Motion (CSS fallback)

Even though we handle this in JS, include a CSS fallback for safety:

```tsx
const MasonryItem = styled.div`
  /* ... */

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    translate: 0 0;
  }
`;
```

---

## Usage Example

### Basic Usage

```tsx
<MasonryGrid
  items={mediaItems}
  columns={3}
  duration={40}
  gap={16}
  direction="up"
/>
```

The grid handles everything internally:

- Shuffles items randomly on mount
- Starts paused if user prefers reduced motion
- Pauses when any item is hovered
- Shows a pause button by default

### Hide Pause Button

```tsx
<MasonryGrid
  items={mediaItems}
  columns={3}
  duration={40}
  showPauseButton={false}
/>
```

### With Mixed Media (Images + Videos)

```tsx
const mediaItems = [
  { id: "1", src: "/images/photo.jpg", alt: "A photo" },
  { id: "2", src: "/videos/demo.mp4", type: "video" },
  { id: "3", src: "/images/another.png", alt: "Another image" },
];

<MasonryGrid items={mediaItems} columns={3} duration={30} />;
```

### Full-Height Layout

```tsx
const GridContainer = styled.div`
  height: 100vh;
  overflow: hidden;
`;

<GridContainer>
  <MasonryGrid items={mediaItems} columns={4} duration={50} />
</GridContainer>;
```

---

## Edge Cases

| Case                         | Handling                                                               |
| ---------------------------- | ---------------------------------------------------------------------- |
| **0 items**                  | Render empty container or placeholder message                          |
| **Fewer items than columns** | Some columns empty; consider minimum requirement                       |
| **1 item**                   | All columns show same item (duplicated); works but looks repetitive    |
| **Very few items**           | Duplicates noticeable; recommend minimum 2× column count               |
| **Images still loading**     | Use fixed aspect ratio containers to prevent layout shift              |
| **Touch device hover**       | Hover pause doesn't work; rely on pause button                         |
| **Reduced motion enabled**   | Grid starts paused; user can still play via button                     |
| **Video in items**           | Pause video playback when grid is paused, not just animation           |
| **SSR hydration mismatch**   | Shuffle produces different results on server vs client; see note below |

### SSR Hydration Note

`Math.random()` produces different values on server and client, causing hydration mismatches. Solutions:

1. **Client-only shuffle** — Use `useEffect` to shuffle after mount:

```tsx
const [shuffledItems, setShuffledItems] = useState(items);

useEffect(() => {
  setShuffledItems(shuffleArray(items));
}, []);
```

2. **Seeded random** — Use a deterministic shuffle based on a stable seed (e.g., hash of item IDs)

3. **Suppress hydration warning** — If visual difference is acceptable, use `suppressHydrationWarning`

Recommended: Option 1. The initial render shows original order, then shuffles. The animation starts paused anyway (for reduced motion users), so the flash is minimal.

---

## Accessibility

| Requirement            | Implementation                                              |
| ---------------------- | ----------------------------------------------------------- |
| **Reduced motion**     | Start paused when `prefers-reduced-motion: reduce` is set   |
| **Alt text**           | Require `alt` prop for images; skip for decorative content  |
| **Pause control**      | Visible button with `aria-label` describing current action  |
| **Keyboard access**    | Pause button focusable and activatable via Enter/Space      |
| **Hover alternative**  | Pause button provides non-hover way to stop animation       |
| **Duplicate handling** | Use `aria-hidden="true"` on duplicated items                |
| **Video autoplay**     | Videos are muted by default; autoplay is accessibility-safe |

---

## Performance Considerations

- Use `will-change: transform` on animated items (sparingly)
- Stick to `transform`/`translate` — avoid properties that trigger layout
- CSS animations are GPU-accelerated and don't block main thread
- Consider lazy loading images outside viewport (optional enhancement)

---

## Summary

| Aspect                    | Implementation                                                               |
| ------------------------- | ---------------------------------------------------------------------------- |
| **Infinite loop**         | CSS `animation: infinite` — item resets to origin after reaching destination |
| **No visible jump**       | Reset happens off-screen (above viewport → below viewport)                   |
| **Even spacing**          | All items travel same distance at same speed                                 |
| **Items visible at t=0**  | Negative delays pre-position items into viewport                             |
| **Column offset**         | Varying `offset` per column shifts each column's animation phase             |
| **No duplication needed** | Each item animates independently; CSS handles the loop                       |
| **Hover pause**           | Any item hover pauses entire grid via shared state                           |
| **Explicit pause button** | Visible control in corner; toggles `userPaused` state                        |
| **Reduced motion**        | Starts paused when `prefers-reduced-motion: reduce` is active                |
| **Random distribution**   | Shuffle on mount; each refresh shows different column arrangement            |

---

## Open Questions

1. How should the gap between items factor into travel distance calculation?
2. What's the recommended minimum item count per column for seamless appearance?

---

## Additional Considerations

Based on the existing codebase patterns:

### Responsive Behavior

Use existing breakpoint constants from `utils/constants.js`:

```tsx
import { QUERIES } from "../utils/constants";

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media ${QUERIES.tabletAndBelow} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${QUERIES.phoneAndBelow} {
    grid-template-columns: 1fr;
    /* Consider disabling animation on mobile */
  }
`;
```

### Mobile Considerations

- Single column on phone may not benefit from the infinite scroll effect
- Consider a static layout on `phoneAndBelow`
- Or reduce speed significantly on mobile to save battery

### Next.js Image Optimization

Since you're using Next.js, consider using `next/image` for automatic optimization:

```tsx
import Image from "next/image";

// In MasonryItem
{
  type === "video" ? (
    <video src={src} autoPlay loop muted playsInline draggable={false} />
  ) : (
    <Image src={src} alt={alt} fill draggable={false} />
  );
}
```

### Video Handling

Videos should:

- Include `playsInline` for iOS Safari
- Use `muted` for autoplay to work
- Consider pausing videos when grid is paused (not just CSS animation)

```tsx
const videoRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
  if (isPaused) {
    videoRef.current?.pause();
  } else {
    videoRef.current?.play();
  }
}, [isPaused]);
```

### Touch Devices

Hover doesn't work on touch devices. Consider:

- Tap-to-pause behavior on mobile
- Or rely solely on the pause button for touch users

### Performance on Long Sessions

If the page stays open for extended periods:

- CSS animations are GPU-accelerated and efficient
- But many videos playing simultaneously could drain battery
- Consider intersection observer to pause videos outside viewport (if columns are very tall)
