require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY;

// Check if API Key is available
if (!apiKey) {
    console.log('⚠️ Warning: GEMINI_API_KEY is not defined in environment variables. Scorer will fallback to offline local scoring.');
}

/**
 * Designs the system instructions and formatting template for the Gemini API call.
 */
function buildPrompt(category, comment) {
    return `You are an expert software architect auditing technical debt.
Analyze the following developer comment:
Category: "${category}"
Comment: "${comment}"

Evaluate the technical debt and respond with a STRICT JSON object only. Do NOT wrap the JSON inside markdown blocks (do not use \`\`\`json). The response must be pure parseable JSON.

The JSON schema must have these exact keys:
{
  "category": "SECURITY" | "PERFORMANCE" | "MAINTENANCE" | "FEATURE",
  "riskScore": number (1 to 10 representing risk severity),
  "explanation": "A concise 1-2 sentence developer-friendly explanation of the impact of this debt.",
  "fixSuggestion": "A clear, actionable code snippet or refactoring solution resolving the comment."
}`;
}

// Helper function to introduce a sleep delay (rate limiting safety throttle)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Gemini API Client.
 * Communicates with the Google Gemini API to analyze tech debt comments.
 */
async function callGeminiAPI(category, comment) {
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // Introducing a tiny random throttle (100ms - 500ms) to reduce API rate-limiting concurrency spikes
    await sleep(Math.floor(Math.random() * 400) + 100);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: buildPrompt(category, comment)
                }]
            }]
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error(`Gemini API Error Response Body: ${errText}`);
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    
    try {
        let rawText = data.candidates[0].content.parts[0].text.trim();
        
        // Strip markdown backticks if Gemini ignored instructions and wrapped JSON in blocks
        if (rawText.startsWith('```')) {
            rawText = rawText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        }

        const parsed = JSON.parse(rawText);

        // Standardize returning structure
        return {
            category: parsed.category || category,
            riskScore: parseInt(parsed.riskScore) || 5,
            explanation: parsed.explanation || 'No explanation provided.',
            fixSuggestion: parsed.fixSuggestion || ''
        };
    } catch (parseError) {
        throw new Error(`Failed to parse Gemini response as JSON: ${parseError.message}`);
    }
}

module.exports = { callGeminiAPI };
