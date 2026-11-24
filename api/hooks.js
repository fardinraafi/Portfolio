// Swipe the Hook: generates a fresh round of good/bad hooks with Groq (key in GROQ_API_KEY env var).
const MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];
const TOPICS = ['marketing', 'careers', 'startups', 'personal finance', 'fitness', 'AI tools', 'design', 'sales', 'freelancing', 'productivity', 'food business', 'e-commerce', 'student life', 'content creation', 'leadership', 'sneakers', 'remote work', 'job hunting', 'branding', 'side hustles'];
const hits = new Map();
function limited(ip) {
    const now = Date.now(), arr = (hits.get(ip) || []).filter(t => now - t < 3600e3);
    arr.push(now); hits.set(ip, arr); if (hits.size > 5000) hits.clear();
    return arr.length > 20;
}
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

module.exports = async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    const origin = req.headers.origin || '';
    if (origin && !/^https:\/\/(www\.)?fardinraafi\.com$|\.vercel\.app$|^http:\/\/localhost/.test(origin)) return res.status(403).json({ error: 'forbidden' });
    if (!process.env.GROQ_API_KEY) return res.status(503).json({ error: 'no key' });
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'x';
    if (limited(ip)) return res.status(429).json({ error: 'slow down' });

    const topics = shuffle(TOPICS.slice()).slice(0, 6).join(', ');
    const good = 6 + Math.floor(Math.random() * 4); // 6 to 9 good hooks, so players can't guess the ratio
    const sys = `You create a game round of social media hooks (the first line of a post).
Return ONLY JSON: {"hooks":[{"text":"...","good":true,"why":"..."}]} with exactly 15 items.
- Exactly ${good} good hooks and ${15 - good} bad hooks, in random order.
- Topics to mix: ${topics}. Platforms: LinkedIn, Instagram, X, YouTube.
- Good hooks: specific numbers, curiosity gaps, bold contrarian takes, relatable pain, story openers, clear payoff. Under 20 words.
- Bad hooks: vague, generic, boring, cliche ("In today's fast-paced world"), humble-brag, starting with "I am excited to announce", clickbait with no substance, too long and rambling, or all hype. Some bad ones should be subtly bad (sound OK at first glance), not all obvious.
- "why": one short reason, under 14 words, written casually.
- Never use em dashes or en dashes. Every hook must be different and original.`;
    try {
        let r, err = '';
        for (const model of MODELS) {
            r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.GROQ_API_KEY },
                body: JSON.stringify({ model, temperature: 1, max_tokens: 3000, reasoning_effort: 'low', include_reasoning: false,
                    response_format: { type: 'json_object' },
                    messages: [{ role: 'system', content: sys }, { role: 'user', content: 'New round, seed ' + Math.random().toString(36).slice(2, 8) }] })
            });
            if (r.ok) break; err = (await r.text()).slice(0, 200);
        }
        if (!r.ok) return res.status(502).json({ error: 'upstream ' + r.status, detail: err });
        const d = await r.json();
        const raw = (d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content) || '{}';
        let j; try { j = JSON.parse(raw); } catch (e) { return res.status(502).json({ error: 'bad json' }); }
        const fix = s => String(s || '').replace(/\s*[—–]\s*/g, ', ').trim().slice(0, 220);
        const hooks = (Array.isArray(j.hooks) ? j.hooks : [])
            .filter(h => h && h.text && typeof h.good === 'boolean')
            .map(h => ({ text: fix(h.text), good: h.good, why: fix(h.why).slice(0, 120) }))
            .slice(0, 15);
        if (hooks.length < 10) return res.status(502).json({ error: 'too few' });
        return res.status(200).json({ hooks });
    } catch (e) { return res.status(502).json({ error: 'fetch failed' }); }
};
