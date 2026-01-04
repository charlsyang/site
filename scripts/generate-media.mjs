#!/usr/bin/env node

/**
 * Media Placeholder Generator
 *
 * Scans /public/visuals/ directory and generates:
 * - Blur placeholders for images (using Sharp)
 * - Blur placeholders for videos (using FFmpeg to extract frame, then Sharp)
 * - Complete media manifest with metadata
 *
 * Output: data/visuals.json
 *
 * Usage:
 *   node scripts/generate-media.js
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

// Supported extensions
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".avif"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

// Placeholder settings
const PLACEHOLDER_WIDTH = 16; // Tiny size for blur effect
const PLACEHOLDER_QUALITY = 50;
const BLUR_SIGMA = 1;

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
 * Generate blur placeholder for a video file
 * Extracts first frame using FFmpeg, then processes like an image
 */
async function generateVideoPlaceholder(videoPath) {
  const tempDir = path.join(PROJECT_ROOT, "data", ".temp");
  const tempFrame = path.join(
    tempDir,
    `frame-${crypto.randomBytes(8).toString("hex")}.jpg`
  );

  // Ensure temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  try {
    // Extract first frame with FFmpeg
    // -ss 0.1: seek to 0.1s (avoids potential black first frame)
    // -vframes 1: extract only 1 frame
    // -q:v 2: high quality JPEG
    await execAsync(
      `ffmpeg -y -ss 0.1 -i "${videoPath}" -vframes 1 -q:v 2 "${tempFrame}" 2>/dev/null`
    );

    // Process like an image
    const blurDataURL = await generateImagePlaceholder(tempFrame);

    return blurDataURL;
  } finally {
    // Cleanup temp frame
    if (fs.existsSync(tempFrame)) {
      fs.unlinkSync(tempFrame);
    }
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
    console.warn("⚠️  FFmpeg not found. Video placeholders will be skipped.");
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
    const mtime = stat.mtimeMs;

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
      });
      cachedCount++;
      console.log(`  ✓ ${file} (cached)`);
      continue;
    }

    // Skip videos if FFmpeg not available
    if (isVideo && !ffmpegAvailable) {
      results.push({
        id: String(i + 1),
        src,
        alt: filenameToAlt(file),
        type,
        blurDataURL: null,
      });
      skippedCount++;
      console.log(`  ⊘ ${file} (skipped - no FFmpeg)`);
      continue;
    }

    // Generate placeholder
    try {
      const blurDataURL = isVideo
        ? await generateVideoPlaceholder(filePath)
        : await generateImagePlaceholder(filePath);

      const alt = filenameToAlt(file);

      results.push({
        id: String(i + 1),
        src,
        alt,
        type,
        blurDataURL,
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
    console.log(`   ${skippedCount} skipped (no FFmpeg)`);
  }
  console.log();
}

// Run
main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});

