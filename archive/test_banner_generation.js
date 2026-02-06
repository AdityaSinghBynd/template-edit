// Banner Generation Test Script
// Uses logo.dev API to fetch logos and generates banners for 50 companies

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGO_DEV_API_KEY = 'pk_apuZ7NwNTdajJRqvjVXWoA';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCa8eEjR3FExmFgzQETD96S7JrXnD789eQ';

// 50 well-known companies for testing
const COMPANIES = [
    { name: 'Apple', domain: 'apple.com' },
    { name: 'Google', domain: 'google.com' },
    { name: 'Microsoft', domain: 'microsoft.com' },
];

// Output directory
const OUTPUT_DIR = path.join(__dirname, 'banner_test_results');

// Get logo URL from logo.dev
function getLogoUrl(domain) {
    return `https://img.logo.dev/${domain}?token=${LOGO_DEV_API_KEY}&size=200`;
}

// Fetch logo and convert to base64
async function fetchLogoBase64(domain) {
    try {
        const logoUrl = getLogoUrl(domain);
        const response = await fetch(logoUrl);
        if (!response.ok) return null;

        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return base64;
    } catch (e) {
        console.error(`Failed to fetch logo for ${domain}:`, e.message);
        return null;
    }
}

// Create banner prompt (matching OnboardingWizard logic)
function createBannerPrompt(companyName, website, variant, hasLogo) {
    return `Create an email newsletter header banner.

COMPANY: ${companyName}
WEBSITE: ${website}

STYLE:
- ${variant === 'light'
            ? 'LIGHT MODE: Warm cream/off-white background with subtle gradient. Use DARK text. Add soft decorative elements (geometric shapes, brand-colored accents) on the right side.'
            : 'DARK MODE: Rich dark brand color background (NOT pure black) with subtle depth. WHITE/light text. Can have subtle gradient or glow effects.'}
- HIGH CONTRAST between text and background is mandatory
- Show ONLY: the logo + the text "${companyName}". Nothing else. No URLs!

SIZE GUIDELINES (STRICT):
- Logo: SMALL/MICRO sized, ONLY 10-15% of banner height. DO NOT MAKE IT HUGE.
- Company name: Small, elegant, and proportional to the logo.
- MAXIMIZE WHITESPACE. The content should feel "small" in a vast space.

LAYOUT (CRITICAL):
- This will be cropped to 800×150 pixels (thin horizontal strip)
- STRICT LEFT ALIGNMENT: Place logo on the FAR LEFT, company name next to it.
- DO NOT CENTER. Content must be on the LEFT.
- Leave TOP and BOTTOM areas as plain background (will be cropped away)
- Subtle decorative elements can go on the FAR RIGHT side

${hasLogo ? 'LOGO: Use the EXACT provided logo, unmodified.' : ''}

Output: Elegant, balanced banner with medium-sized content in center strip.`;
}

// Smart cropping logic (ported from crop_banners.js)
const sharp = (await import('sharp')).default;

async function smartCropBanner(imageBuffer) {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    // Target aspect ratio 800:150 = 5.33
    const targetRatio = 800 / 150;
    const targetHeight = Math.round(width / targetRatio);

    // Scan for content (logo/text) to center the crop
    // We'll use a simple approach: scan for non-background pixels in the middle column
    // For a more robust solution, we'd use edge detection, but this works well for generated banners

    // Default to center crop if we can't be smarter
    const top = Math.max(0, Math.round((height - targetHeight) / 2));

    console.log(`  ✂️ Cropping: ${width}x${height} -> ${width}x${targetHeight} (Ratio: ${targetRatio.toFixed(2)})`);

    return image
        .extract({ left: 0, top: top, width: width, height: targetHeight })
        .resize(800, 150, { fit: 'fill' }) // Ensure exact output dimensions
        .toBuffer();
}

// Generate banner using Gemini
async function generateBanner(companyName, website, logoBase64, variant) {
    const prompt = createBannerPrompt(companyName, website, variant, !!logoBase64);

    // LOG THE PROMPT FOR USER REVIEW
    console.log(`\n📄 PROMPT USED FOR ${companyName} (${variant}):`);
    console.log(`--------------------------------------------------`);
    console.log(prompt);
    console.log(`--------------------------------------------------\n`);

    const parts = [{ text: prompt }];

    if (logoBase64) {
        parts.push({ text: "Company logo:" });
        parts.push({ inlineData: { mimeType: "image/png", data: logoBase64 } });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                    responseModalities: ["image", "text"]
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API error: ${error}`);
        }

        const data = await response.json();
        const imagePart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

        if (imagePart?.inlineData?.data) {
            const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
            // Apply cropping
            const croppedBuffer = await smartCropBanner(buffer);
            return croppedBuffer.toString('base64');
        }
        return null;
    } catch (e) {
        console.error(`Failed to generate banner for ${companyName}:`, e.message);
        return null;
    }
}

// Save base64 image to file
function saveImage(base64Data, filename) {
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filename, buffer);
}

// Main test function
async function runTest() {
    console.log('🚀 Banner Generation Test (Cropped)');
    console.log('='.repeat(50));

    // Create output directory for cropped results
    const CROP_DIR = path.join(__dirname, 'banner_test_results_cropped');
    if (!fs.existsSync(CROP_DIR)) {
        fs.mkdirSync(CROP_DIR, { recursive: true });
    }

    const results = {
        success: [],
        failed: [],
        logoFailed: []
    };

    // ONLY TEST STRIDE VENTURES
    const company = { name: 'Stride Ventures', domain: 'strideventures.global' };
    console.log(`\nProcessing ${company.name}...`);

    // Fetch logo
    console.log(`  📥 Fetching logo from logo.dev...`);
    const logoBase64 = await fetchLogoBase64(company.domain);

    if (!logoBase64) {
        console.log(`  ⚠️ Could not fetch logo, will generate without it`);
        results.logoFailed.push(company.name);
    }

    // Generate light banner
    console.log(`  🎨 Generating light banner...`);
    const lightBanner = await generateBanner(company.name, `https://${company.domain}`, logoBase64, 'light');

    if (lightBanner) {
        const lightPath = path.join(CROP_DIR, `${company.name.toLowerCase().replace(/\s+/g, '_')}_light_cropped.png`);
        saveImage(lightBanner, lightPath);
        console.log(`  ✅ Light banner saved: ${lightPath}`);
    } else {
        console.log(`  ❌ Light banner generation failed`);
    }

    // Generate dark banner
    console.log(`  🌙 Generating dark banner...`);
    const darkBanner = await generateBanner(company.name, `https://${company.domain}`, logoBase64, 'dark');

    if (darkBanner) {
        const darkPath = path.join(CROP_DIR, `${company.name.toLowerCase().replace(/\s+/g, '_')}_dark_cropped.png`);
        saveImage(darkBanner, darkPath);
        console.log(`  ✅ Dark banner saved: ${darkPath}`);
    } else {
        console.log(`  ❌ Dark banner generation failed`);
    }

    console.log('\n✅ Test Complete');
}

// Run the test
runTest().catch(console.error);
