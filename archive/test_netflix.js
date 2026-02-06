// Quick test - Generate Netflix banner with improved prompt
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGO_DEV_API_KEY = 'pk_apuZ7NwNTdajJRqvjVXWoA';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCa8eEjR3FExmFgzQETD96S7JrXnD789eQ';

const OUTPUT_DIR = path.join(__dirname, 'netflix_test');

// Fetch logo
async function fetchLogoBase64(domain) {
    const logoUrl = `https://img.logo.dev/${domain}?token=${LOGO_DEV_API_KEY}&size=200`;
    const response = await fetch(logoUrl);
    if (!response.ok) return null;
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
}

// Create prompt with improvements
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

// Generate banner
async function generateBanner(companyName, website, logoBase64, variant) {
    const prompt = createBannerPrompt(companyName, website, variant, !!logoBase64);
    const parts = [{ text: prompt }];

    if (logoBase64) {
        parts.push({ text: "Company logo:" });
        parts.push({ inlineData: { mimeType: "image/png", data: logoBase64 } });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { responseModalities: ["image", "text"] }
        })
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    const imagePart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    return imagePart?.inlineData?.data || null;
}

// Main
async function main() {
    console.log('🎬 Generating Netflix banners with improved prompt...\n');

    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    console.log('📥 Fetching Netflix logo...');
    const logoBase64 = await fetchLogoBase64('netflix.com');

    console.log('🎨 Generating light banner...');
    const lightBanner = await generateBanner('Netflix', 'https://netflix.com', logoBase64, 'light');
    if (lightBanner) {
        fs.writeFileSync(path.join(OUTPUT_DIR, 'netflix_light_raw.png'), Buffer.from(lightBanner, 'base64'));
        console.log('  ✅ Light banner saved');
    }

    console.log('🌙 Generating dark banner...');
    const darkBanner = await generateBanner('Netflix', 'https://netflix.com', logoBase64, 'dark');
    if (darkBanner) {
        fs.writeFileSync(path.join(OUTPUT_DIR, 'netflix_dark_raw.png'), Buffer.from(darkBanner, 'base64'));
        console.log('  ✅ Dark banner saved');
    }

    console.log(`\n📁 Raw banners saved to: ${OUTPUT_DIR}`);
    console.log('Run: node crop_banners.js to apply smart cropping');
}

main().catch(console.error);
