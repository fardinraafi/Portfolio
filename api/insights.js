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

    // actions: teach Fifi an answer, forget one, dismiss a gap, delete a lead
    if (req.method === 'POST') {
        let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } } b = b || {};
        const q = String(b.q || '').slice(0, 200).trim(), a = String(b.a || '').replace(/[\u2014\u2013]/g, ',').slice(0, 600).trim(), raw = String(b.raw || '');
        if (b.action === 'learn' && q && a) await R.pipeline([['HSET', 'fifi:learned', q, a], ...(raw ? [['LREM', 'fifi:gaps', '0', raw]] : [])]);
        else if (b.action === 'unlearn' && q) await R.pipeline([['HDEL', 'fifi:learned', q]]);
        else if (b.action === 'dismiss' && raw) await R.pipeline([['LREM', 'fifi:gaps', '0', raw]]);
        else if (b.action === 'dellead' && raw) await R.pipeline([['LREM', 'fifi:leads', '0', raw]]);
        else return res.status(400).json({ error: 'Bad action.' });
        return res.status(200).json({ ok: true });
    }
    const out = await R.pipeline([['LRANGE', 'fifi:q', '0', '2999'], ['HGETALL', 'fifi:days'], ['HGETALL', 'fifi:pages'], ['LRANGE', 'fifi:gaps', '0', '999'], ['HGETALL', 'fifi:learned'], ['LRANGE', 'fifi:leads', '0', '499'], ['HGETALL', 'fifi:clicks']]);
    if (!out) return res.status(502).json({ error: 'Could not reach Upstash.' });
    const qs = (out[0] || []).map(x => { try { return JSON.parse(x); } catch (e) { return null; } }).filter(Boolean);
    const pairs = arr => { const o = {}; for (let i = 0; i < (arr || []).length; i += 2) o[arr[i]] = +arr[i + 1]; return o; };
    const pairsStr = arr => { const o = {}; for (let i = 0; i < (arr || []).length; i += 2) o[arr[i]] = arr[i + 1]; return o; };
    const hours = list => { const h = Array(24).fill(0); list.forEach(x => { h[(new Date(x.t).getUTCHours() + 6) % 24]++; }); return h; }; // Dhaka time
    const words = {};
    qs.forEach(x => new Set(x.q.toLowerCase().match(/[a-zঀ-৿']{3,}/g) || []).forEach(w => { if (!STOP.has(w)) words[w] = (words[w] || 0) + 1; }));
    const top = Object.entries(words).sort((a, b) => b[1] - a[1]).slice(0, 30);
    const withRaw = arr => (arr || []).map(x => { try { return Object.assign(JSON.parse(x), { raw: x }); } catch (e) { return null; } }).filter(Boolean);
    const gaps = withRaw(out[3]);
    return res.status(200).json({ learned: pairsStr(out[4]), leads: withRaw(out[5]), clicks: pairs(out[6]), hours: hours(qs), gaps, all: qs.map(x => x.q), total: qs.length, days: pairs(out[1]), pages: pairs(out[2]), words: top, recent: qs.slice(0, 300) });
};
