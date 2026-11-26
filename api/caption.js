// Caption Maker AI: Vercel serverless proxy to Groq (key in GROQ_API_KEY env var).
const R = require('./_redis.js');
const MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];
const STYLES = {
    professional: 'professional and polished, confident, no slang',
    witty: 'witty and funny, clever wordplay, light self-aware humour',
    story: 'storytelling, a mini story with a beginning, a turn and a feeling',
    genz: 'Gen-Z, lowercase, internet slang (fr, no cap, lowkey, iykyk), meme energy',
    inspire: 'inspirational and uplifting, warm, motivating',
    short: 'short and punchy, one or two lines max',
    sales: 'persuasive and salesy with urgency, only if there is something to sell or promote'
};
const PLATS = {
    instagram: 'Instagram: 2 to 4 short lines, line breaks, 6 to 8 hashtags',
    linkedin: 'LinkedIn: hook line, 2 to 4 short paragraphs, professional enough for LinkedIn, 3 to 4 hashtags',
    x: 'X (Twitter): under 260 characters total INCLUDING hashtags, 1 or 2 hashtags',
    facebook: 'Facebook: friendly, 2 to 3 short lines, 2 or 3 hashtags'
};
module.exports = async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    const origin = req.headers.origin || '';
    if (origin && !/^https:\/\/(www\.)?fardinraafi\.com$|\.vercel\.app$|^http:\/\/localhost/.test(origin)) return res.status(403).json({ error: 'forbidden' });
    if (!process.env.GROQ_API_KEY) return res.status(503).json({ error: 'no key' });
    const ip = R.ipOf(req);
    if (await R.limited('cap:' + ip, 40, 3600)) return res.status(429).json({ error: 'slow down' });
    if (await R.limited('groq-day', 1200, 86400)) return res.status(429).json({ error: 'daily cap' }); // protects the free Groq quota
    let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
    const idea = String((b && b.idea) || '').trim().slice(0, 400);
    const style = STYLES[b && b.style] ? b.style : 'professional';
    const plat = PLATS[b && b.plat] ? b.plat : 'instagram';
    const prev = String((b && b.prev) || '').slice(0, 600);
    if (!idea) return res.status(400).json({ error: 'no idea' });
    const sys = `You write social media captions. Write ONE caption for the user's post idea.
Style: ${STYLES[style]}.
Platform: ${PLATS[plat]}.
Rules:
- Understand what the post is really about and its mood. A pet, a personal win, a joke, a product, an event: match it. Never add sales lines like "link in bio" or "shop now" unless the idea is actually selling something.
- Rewrite the idea in natural language. Do not paste the user's words verbatim. Fix their grammar.
- Emojis: ${b && b.emoji === false ? 'do NOT use any emojis' : 'use a few fitting emojis'}.
- Hashtags: ${b && b.tags === false ? 'do NOT add hashtags' : 'put relevant, popular hashtags on the last line'}.
- Never use em dashes or en dashes. Use commas or a normal hyphen.
- Write in the same language as the idea (English, Bangla or Banglish).
- Output ONLY the caption text. No quotes, no title, no explanation.${prev ? '\n- Make it clearly different from this previous version:\n' + prev : ''}`;
    try {
        let r, err = '';
        for (const model of MODELS) {
            r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.GROQ_API_KEY },
                body: JSON.stringify({ model, temperature: 0.95, max_tokens: 900, reasoning_effort: 'low', include_reasoning: false,
                    messages: [{ role: 'system', content: sys }, { role: 'user', content: idea }] })
            });
            if (r.ok) break; err = (await r.text()).slice(0, 200);
        }
        if (!r.ok) return res.status(502).json({ error: 'upstream ' + r.status, detail: err });
        const d = await r.json();
        let text = ((d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content) || '').trim()
            .replace(/^["“]|["”]$/g, '').replace(/\s*[—–]\s*/g, ', ');
        if (!text) return res.status(502).json({ error: 'empty' });
        return res.status(200).json({ caption: text });
    } catch (e) { return res.status(502).json({ error: 'fetch failed' }); }
};
