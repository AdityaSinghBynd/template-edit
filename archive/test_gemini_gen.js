import fs from 'fs';

const GEMINI_API_KEY = 'AIzaSyCa8eEjR3FExmFgzQETD96S7JrXnD789eQ';
const LOGO_PATH = '/Users/ishan/.gemini/antigravity/brain/49cc2e5f-cf48-49f1-a8a5-6f62c80e686b/uploaded_image_1768902682363.png';

async function testGen() {
    console.log('Testing Banner Generation with PAID API key...');

    let logoBase64 = null;
    try {
        if (fs.existsSync(LOGO_PATH)) {
            logoBase64 = fs.readFileSync(LOGO_PATH, 'base64');
            console.log('Logo loaded.');
        }
    } catch (e) {
        console.warn('Error reading logo:', e);
    }

    const imagePrompt = `Create a professional email newsletter header banner for "Sixth Sense Ventures". 
Dimensions: 800x150 pixels.
Website: https://sixthsenseventures.com/
Style: Corporate, professional, minimalist. 
${logoBase64 ? 'IMPORTANT: Incorporate the visual style, colors, and font aesthetics of the provided logo, but do NOT just copy the logo. Create a cohesive header design.' : ''}`;

    const parts = [{ text: imagePrompt }];
    if (logoBase64) {
        parts.push({
            inlineData: {
                mimeType: "image/png",
                data: logoBase64
            }
        });
    }

    try {
        console.log('Requesting gemini-2.0-flash-exp with paid key...');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
        const imgResp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: { responseModalities: ["image", "text"] }
            })
        });

        if (!imgResp.ok) {
            console.error('API Error Status:', imgResp.status);
            const errText = await imgResp.text();
            console.error('API Error Body:', errText);
        } else {
            const imgData = await imgResp.json();
            const imagePart = imgData.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
            if (imagePart) {
                console.log('SUCCESS: Banner image generated!');
                const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
                fs.writeFileSync('sixth_sense_banner_paid.png', buffer);
                console.log('Saved to: sixth_sense_banner_paid.png');
            } else {
                console.log('FAILED: No image data.', JSON.stringify(imgData, null, 2));
            }
        }
    } catch (e) {
        console.error('Script Error:', e);
    }
}

testGen();
