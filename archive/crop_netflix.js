// Crop Netflix banners specifically
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, 'netflix_test');
const OUTPUT_DIR = path.join(__dirname, 'netflix_test');

async function cropBannerToRatio(inputPath) {
    const img = await loadImage(inputPath);
    const targetWidth = 800, targetHeight = 150;

    const canvas = createCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');

    const analyzeCanvas = createCanvas(img.width, img.height);
    const analyzeCtx = analyzeCanvas.getContext('2d');
    analyzeCtx.drawImage(img, 0, 0);

    const getCornerColor = (x, y, size = 10) => {
        const data = analyzeCtx.getImageData(x, y, size, size).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
            r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
        }
        return { r: r / count, g: g / count, b: b / count };
    };

    const corners = [getCornerColor(0, 0), getCornerColor(img.width - 10, 0),
    getCornerColor(0, img.height - 10), getCornerColor(img.width - 10, img.height - 10)];
    const bgColor = {
        r: corners.reduce((s, c) => s + c.r, 0) / 4,
        g: corners.reduce((s, c) => s + c.g, 0) / 4,
        b: corners.reduce((s, c) => s + c.b, 0) / 4
    };

    const isBackground = (r, g, b, threshold = 30) =>
        Math.abs(r - bgColor.r) < threshold && Math.abs(g - bgColor.g) < threshold && Math.abs(b - bgColor.b) < threshold;

    const findVerticalBounds = () => {
        let top = 0, bottom = img.height;
        const sampleWidth = Math.min(img.width, 200);

        for (let y = 0; y < img.height; y++) {
            const data = analyzeCtx.getImageData(0, y, sampleWidth, 1).data;
            for (let i = 0; i < data.length; i += 16) {
                if (!isBackground(data[i], data[i + 1], data[i + 2])) { top = y; break; }
            }
            if (top > 0) break;
        }

        for (let y = img.height - 1; y >= 0; y--) {
            const data = analyzeCtx.getImageData(0, y, sampleWidth, 1).data;
            for (let i = 0; i < data.length; i += 16) {
                if (!isBackground(data[i], data[i + 1], data[i + 2])) { bottom = y; break; }
            }
            if (bottom < img.height) break;
        }

        return { top, bottom };
    };

    const bounds = findVerticalBounds();
    const contentCenterY = bounds.top + (bounds.bottom - bounds.top) / 2;
    const targetRatio = targetWidth / targetHeight;

    let sh = img.width / targetRatio;
    let sy = Math.max(0, Math.min(contentCenterY - sh / 2, img.height - sh));
    if (sy > bounds.top) sy = Math.max(0, bounds.top - 10);
    if (sy + sh < bounds.bottom) sh = Math.min(img.height - sy, bounds.bottom - sy + 10);

    let sw = sh * targetRatio;
    let sx = 0;
    if (sw > img.width) { sw = img.width; sh = sw / targetRatio; sy = Math.max(0, contentCenterY - sh / 2); }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
    return canvas.toBuffer('image/png');
}

async function main() {
    const files = ['netflix_light_raw.png', 'netflix_dark_raw.png'];
    for (const file of files) {
        const inputPath = path.join(INPUT_DIR, file);
        if (!fs.existsSync(inputPath)) continue;
        const outputFile = file.replace('_raw', '_cropped');
        const croppedBuffer = await cropBannerToRatio(inputPath);
        fs.writeFileSync(path.join(OUTPUT_DIR, outputFile), croppedBuffer);
        console.log(`✅ ${outputFile} saved`);
    }
}

main().catch(console.error);
