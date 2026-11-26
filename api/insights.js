// Private Fifi insights for /fifi-insights. Requires header x-pass === INSIGHTS_PASSWORD env var.
const R = require('./_redis.js');
const crypto = require('crypto');
const STOP = new Set('the a an and or but of to in on at for with from by is are was were be been am i we you he his him it its this that these those what who how why when where which does do did can could would should will about me my your fardin raafi fifi tell any some there their them they has have had just like also not no yes ok please email number pls'.split(' '));

module.exports = async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex');
    const pass = process.env.INSIGHTS_PASSWORD || '';
    if (!pass) return res.status(503).json({ error: 'Set INSIGHTS_PASSWORD in Vercel first.' });
    const ip = R.ipOf(req);
    if (await R.limited('ins:' + ip, 20, 900)) return res.status(429).json({ error: 'Too many tries, wait 15 minutes.' });
    const got = String(req.headers['x-pass'] || '');
    const a = crypto.createHash('sha256').update(got).digest(), b = crypto.createHash('sha256').update(pass).digest();
    if (!crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: 'Wrong password.' });
    if (!R.enabled) return res.status(503).json({ error: 'Upstash is not connected yet.' });

    const out = await R.pipeline([['LRANGE', 'fifi:q', '0', '2999'], ['HGETALL', 'fifi:days'], ['HGETALL', 'fifi:pages'], ['LRANGE', 'fifi:gaps', '0', '999']]);
    if (!out) return res.status(502).json({ error: 'Could not reach Upstash.' });
    const qs = (out[0] || []).map(x => { try { return JSON.parse(x); } catch (e) { return null; } }).filter(Boolean);
    const pairs = arr => { const o = {}; for (let i = 0; i < (arr || []).length; i += 2) o[arr[i]] = +arr[i + 1]; return o; };
    const words = {};
    qs.forEach(x => new Set(x.q.toLowerCase().match(/[a-zঀ-৿']{3,}/g) || []).forEach(w => { if (!STOP.has(w)) words[w] = (words[w] || 0) + 1; }));
    const top = Object.entries(words).sort((a, b) => b[1] - a[1]).slice(0, 30);
    const gaps = (out[3] || []).map(x => { try { return JSON.parse(x); } catch (e) { return null; } }).filter(Boolean);
    return res.status(200).json({ gaps, all: qs.map(x => x.q), total: qs.length, days: pairs(out[1]), pages: pairs(out[2]), words: top, recent: qs.slice(0, 300) });
};
