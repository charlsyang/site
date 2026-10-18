#!/usr/bin/env node

/**
 * Media Placeholder Generator
 *
 * Scans /public/visuals/ directory and generates:
 * - Blur placeholders for images (using Sharp)
 * - First-frame posters for videos (FFmpeg → Sharp, committed to
 *   /public/visuals/posters/) and blur placeholders derived from them
 * - Complete media manifest with metadata
 *
 * Output: data/visuals.json, public/visuals/posters/*.webp
 *
 * Usage:
 *   node scripts/generate-media.mjs            # posters only when missing/stale
 *   node scripts/generate-media.mjs --posters  # re-extract every poster
 *
 * Features:
 * - Smart caching: skips files that haven't changed (based on mtime)
 * - Auto-generates alt text from filename
 * - Handles both images and videos uniformly
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { exec } from "child_process";
import { promisify } from "util";
import crypto from "crypto";

const execAsync = promisify(exec);

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const PROJECT_ROOT = path.resolve(__dirname, "..");
const VISUALS_DIR = path.join(PROJECT_ROOT, "public", "visuals");
const OUTPUT_FILE = path.join(PROJECT_ROOT, "data", "visuals.json");
const CACHE_FILE = path.join(PROJECT_ROOT, "data", ".visuals-cache.json");
const POSTERS_DIR = path.join(VISUALS_DIR, "posters");

const FORCE_POSTERS = process.argv.includes("--posters");

// Supported extensions
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".avif"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

// Placeholder settings
const PLACEHOLDER_WIDTH = 16; // Tiny size for blur effect
const PLACEHOLDER_QUALITY = 50;
const BLUR_SIGMA = 1;

// Poster settings (largest tile is ~650 CSS px wide on big desktops at 2x)
const POSTER_MAX_WIDTH = 1280;
const POSTER_QUALITY = 80;

/**
 * Convert filename to human-readable alt text
 * e.g., "aura-icons.png" → "Aura icons"
 */
function filenameToAlt(filename) {
  const name = path.basename(filename, path.extname(filename));
  return name
    .replace(/[-_]/g, " ") // Replace dashes/underscores with spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → camel Case
    .replace(/\b\w/g, (c) => c.toUpperCase()) // Capitalize first letter of each word
    .trim();
}

/**
 * Generate blur placeholder for an image file
 */
async function generateImagePlaceholder(imagePath) {
  const buffer = await sharp(imagePath)
    .resize(PLACEHOLDER_WIDTH, null, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .blur(BLUR_SIGMA)
    .jpeg({ quality: PLACEHOLDER_QUALITY })
    .toBuffer();

  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

/**
 * Ensure a first-frame poster exists for a video (re-extracted when missing,
 * older than the video, or with --posters). Returns its absolute path, or
 * null when there is no poster and FFmpeg isn't available.
 */
async function ensureVideoPoster(videoPath, ffmpegAvailable) {
  const posterPath = path.join(
    POSTERS_DIR,
    `${path.basename(videoPath, path.extname(videoPath))}.webp`
  );
  const isFresh =
    fs.existsSync(posterPath) &&
    fs.statSync(posterPath).mtimeMs >= fs.statSync(videoPath).mtimeMs;
  if (isFresh && !FORCE_POSTERS) return posterPath;
  if (!ffmpegAvailable) return fs.existsSync(posterPath) ? posterPath : null;

  const tempDir = path.join(PROJECT_ROOT, "data", ".temp");
  const tempFrame = path.join(
    tempDir,
    `frame-${crypto.randomBytes(8).toString("hex")}.png`
  );
  fs.mkdirSync(tempDir, { recursive: true });
  fs.mkdirSync(POSTERS_DIR, { recursive: true });

  try {
    // First decoded frame = what playback shows at t=0, so poster → video is seamless
    await execAsync(
      `ffmpeg -y -i "${videoPath}" -frames:v 1 "${tempFrame}" 2>/dev/null`
    );
    await sharp(tempFrame)
      .resize(POSTER_MAX_WIDTH, null, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: POSTER_QUALITY })
      .toFile(posterPath);
    return posterPath;
  } finally {
    if (fs.existsSync(tempFrame)) fs.unlinkSync(tempFrame);
  }
}

/**
 * Load cache of previously processed files
 */
function loadCache() {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * Save cache of processed files
 */
function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * Main function
 */
async function main() {
  console.log("\n📁 Scanning /public/visuals...\n");

  // Ensure data directory exists
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Check if FFmpeg is available
  let ffmpegAvailable = true;
  try {
    await execAsync("ffmpeg -version");
  } catch {
    ffmpegAvailable = false;
    console.warn(
      "⚠️  FFmpeg not found. Using committed posters; videos without one will be skipped."
    );
    console.warn("   Install with: brew install ffmpeg\n");
  }

  // Load cache
  const cache = loadCache();

  // Scan visuals directory
  const files = fs
    .readdirSync(VISUALS_DIR)
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return (
        IMAGE_EXTENSIONS.includes(ext) || VIDEO_EXTENSIONS.includes(ext)
      );
    })
    .sort(); // Consistent ordering

  console.log(`Found ${files.length} media files\n`);

  const results = [];
  let newCount = 0;
  let cachedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(VISUALS_DIR, file);
    const ext = path.extname(file).toLowerCase();
    const isVideo = VIDEO_EXTENSIONS.includes(ext);
    const type = isVideo ? "video" : "image";
    const src = `/visuals/${file}`;

    // Get file stats for cache checking
    const stat = fs.statSync(filePath);
    let mtime = stat.mtimeMs;

    let poster;
    if (isVideo) {
      try {
        const posterPath = await ensureVideoPoster(filePath, ffmpegAvailable);
        if (posterPath) {
          poster = `/visuals/posters/${path.basename(posterPath)}`;
          mtime = Math.max(mtime, fs.statSync(posterPath).mtimeMs);
        }
      } catch (error) {
        console.error(`  ✗ ${file} poster - Error: ${error.message}`);
      }
    }

    // Check cache
    const cached = cache[src];
    if (cached && cached.mtime === mtime && cached.blurDataURL) {
      // Use cached result
      results.push({
        id: String(i + 1),
        src,
        alt: cached.alt || filenameToAlt(file),
        type,
        blurDataURL: cached.blurDataURL,
        ...(poster && { poster }),
      });
      cachedCount++;
      console.log(`  ✓ ${file} (cached)`);
      continue;
    }

    // Skip videos without a poster to derive a placeholder from
    if (isVideo && !poster) {
      results.push({
        id: String(i + 1),
        src,
        alt: filenameToAlt(file),
        type,
        blurDataURL: null,
      });
      skippedCount++;
      console.log(`  ⊘ ${file} (skipped - no poster and no FFmpeg)`);
      continue;
    }

    // Generate placeholder
    try {
      const blurDataURL = await generateImagePlaceholder(
        isVideo ? path.join(PROJECT_ROOT, "public", poster) : filePath
      );

      const alt = filenameToAlt(file);

      results.push({
        id: String(i + 1),
        src,
        alt,
        type,
        blurDataURL,
        ...(poster && { poster }),
      });

      // Update cache
      cache[src] = {
        mtime,
        alt,
        blurDataURL,
      };

      newCount++;
      const size = Buffer.byteLength(blurDataURL, "utf-8");
      console.log(`  ✓ ${file} (${type}, ${size} bytes)`);
    } catch (error) {
      console.error(`  ✗ ${file} - Error: ${error.message}`);
      results.push({
        id: String(i + 1),
        src,
        alt: filenameToAlt(file),
        type,
        blurDataURL: null,
      });
    }
  }

  // Save cache
  saveCache(cache);

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

  // Summary
  console.log("\n" + "─".repeat(40));
  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`   ${results.length} items total`);
  console.log(`   ${newCount} new/updated`);
  console.log(`   ${cachedCount} cached`);
  if (skippedCount > 0) {
    console.log(`   ${skippedCount} skipped (no poster and no FFmpeg)`);
  }
  console.log();
}

// Run
main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});

