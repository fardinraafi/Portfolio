// Tiny Upstash Redis client (REST, no packages) + shared rate limiter.
// Works with either env var pair Vercel's Upstash integration creates:
//   KV_REST_API_URL + KV_REST_API_TOKEN   or   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
// If neither is set, everything falls back to a per-instance in-memory limiter and logging is skipped.
const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const enabled = !!(URL && TOKEN);

async function pipeline(cmds) {
    if (!enabled) return null;
    try {
        const r = await fetch(URL.replace(/\/$/, '') + '/pipeline', {
            method: 'POST', headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds)
        });
        if (!r.ok) return null;
        return (await r.json()).map(x => x.result);
    } catch (e) { return null; }
}

const mem = new Map();
function memLimit(key, limit, windowSec) {
    const now = Date.now(), arr = (mem.get(key) || []).filter(t => now - t < windowSec * 1000);
    arr.push(now); mem.set(key, arr); if (mem.size > 5000) mem.clear();
    return arr.length > limit;
}

// true = over the limit. Fixed window per key, shared across all Vercel instances when Redis is on.
async function limited(key, limit, windowSec) {
    if (!enabled) return memLimit(key, limit, windowSec);
    const k = 'rl:' + key + ':' + Math.floor(Date.now() / 1000 / windowSec);
    const res = await pipeline([['INCR', k], ['EXPIRE', k, String(windowSec + 5)]]);
    if (!res) return memLimit(key, limit, windowSec); // Redis hiccup: fail soft
    return res[0] > limit;
}

const ipOf = req => String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'x';

module.exports = { enabled, pipeline, limited, ipOf };
