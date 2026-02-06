// Crop Banner Script - Applies smart content-detection cropping to existing banners
// Run: node crop_banners.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, 'banner_test_results');
const OUTPUT_DIR = path.join(__dirname, 'banner_test_results_cropped');

// Smart crop function - matches OnboardingWizard logic
async function cropBannerToRatio(inputPath) {
    const img = await loadImage(inputPath);

    const targetWidth = 800;
    const targetHeight = 150;

    const canvas = createCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');

    // Analyze image to find content boundaries
    const analyzeCanvas = createCanvas(img.width, img.height);
    const analyzeCtx = analyzeCanvas.getContext('2d');
    analyzeCtx.drawImage(img, 0, 0);

    // Detect background color from corners (average of 4 corners)
    const getCornerColor = (x, y, size = 10) => {
        const data = analyzeCtx.getImageData(x, y, size, size).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
            r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
        }
        return { r: r / count, g: g / count, b: b / count };
    };

    const corners = [
        getCornerColor(0, 0),
        getCornerColor(img.width - 10, 0),
        getCornerColor(0, img.height - 10),
        getCornerColor(img.width - 10, img.height - 10)
    ];
    const bgColor = {
        r: corners.reduce((s, c) => s + c.r, 0) / 4,
        g: corners.reduce((s, c) => s + c.g, 0) / 4,
        b: corners.reduce((s, c) => s + c.b, 0) / 4
    };

    // Find content boundaries by scanning for non-background pixels
    const isBackground = (r, g, b, threshold = 30) => {
        return Math.abs(r - bgColor.r) < threshold &&
            Math.abs(g - bgColor.g) < threshold &&
            Math.abs(b - bgColor.b) < threshold;
    };

    // Scan rows to find content top and bottom
    const findVerticalBounds = () => {
        let top = 0, bottom = img.height;
        const sampleWidth = Math.min(img.width, 200);

        // Find top boundary
        for (let y = 0; y < img.height; y++) {
            const data = analyzeCtx.getImageData(0, y, sampleWidth, 1).data;
            let hasContent = false;
            for (let i = 0; i < data.length; i += 16) {
                if (!isBackground(data[i], data[i + 1], data[i + 2])) {
                    hasContent = true; break;
                }
            }
            if (hasContent) { top = y; break; }
        }

        // Find bottom boundary
        for (let y = img.height - 1; y >= 0; y--) {
            const data = analyzeCtx.getImageData(0, y, sampleWidth, 1).data;
            let hasContent = false;
            for (let i = 0; i < data.length; i += 16) {
                if (!isBackground(data[i], data[i + 1], data[i + 2])) {
                    hasContent = true; break;
                }
            }
            if (hasContent) { bottom = y; break; }
        }

        return { top, bottom };
    };

    const bounds = findVerticalBounds();
    const contentHeight = bounds.bottom - bounds.top;

    // Calculate crop area centered on content
    const targetRatio = targetWidth / targetHeight;
    const contentCenterY = bounds.top + contentHeight / 2;

    // Determine source height based on target ratio
    let sh = img.width / targetRatio;
    let sy = Math.max(0, Math.min(contentCenterY - sh / 2, img.height - sh));

    // Ensure we include all content
    if (sy > bounds.top) sy = Math.max(0, bounds.top - 10);
    if (sy + sh < bounds.bottom) sh = Math.min(img.height - sy, bounds.bottom - sy + 10);

    // Recalculate width to maintain ratio
    let sw = sh * targetRatio;
    let sx = 0; // Start from left to preserve logo

    if (sw > img.width) {
        sw = img.width;
        sh = sw / targetRatio;
        sy = Math.max(0, contentCenterY - sh / 2);
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);

    return canvas.toBuffer('image/png');
}

// Main function
async function processAllBanners() {
    console.log('🔄 Cropping banners to 800x150...');
    console.log('='.repeat(50));

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Get all PNG files
    const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.png'));
    console.log(`Found ${files.length} banners to process\n`);

    let success = 0;
    let failed = 0;

    for (const file of files) {
        const inputPath = path.join(INPUT_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, file);

        try {
            process.stdout.write(`Processing ${file}... `);
            const croppedBuffer = await cropBannerToRatio(inputPath);
            fs.writeFileSync(outputPath, croppedBuffer);
            console.log('✅');
            success++;
        } catch (e) {
            console.log(`❌ ${e.message}`);
            failed++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`\n📁 Output: ${OUTPUT_DIR}`);
}

processAllBanners().catch(console.error);
