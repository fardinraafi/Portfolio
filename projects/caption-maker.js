/* Caption Maker: template-based caption + hashtag generator (runs fully in the browser) */
(() => {
    const $ = id => document.getElementById(id);
    const inp = $('cmIn'), out = $('cmOut'), cnt = $('cmCount');
    const pick = a => a[Math.floor(Math.random() * a.length)];

    const PLATS = { instagram: ['📸', 'Instagram', 8], linkedin: ['💼', 'LinkedIn', 4], x: ['', '𝕏 / X', 2], facebook: ['👥', 'Facebook', 3] };
    const STYLES = {
        professional: '💼 Professional', witty: '😏 Witty', story: '📖 Storytelling', genz: '🔥 Gen-Z',
        inspire: '🌱 Inspirational', short: '⚡ Short & punchy', sales: '🛒 Salesy'
    };
    let plat = 'instagram', style = 'professional', last = '';

    const EX = ['launched our new sneaker drop, limited pairs', 'got my first marketing certificate', 'our team day trip to a resort', '5 tips to write better LinkedIn posts', 'new cafe opening in Dhaka this Friday'];

    // T = topic as typed, K = short keyword phrase
    const BANK = {
        professional: {
            hook: ['Quick update: {T}.', 'Proud to share: {T}.', 'Here is something worth your attention: {T}.', 'A milestone for us: {T}.'],
            body: ['It took focus, teamwork and a lot of learning along the way.', 'Every step taught us something we will carry into what comes next.', 'This is what consistent work looks like when it finally shows.'],
            cta: ['What do you think? Share your thoughts below.', 'Would love to hear your take in the comments.', 'Follow for more updates like this.'],
            e: ['📌', '🚀', '✅', '📈']
        },
        witty: {
            hook: ['Plot twist: {T}.', 'Nobody asked, but {T}.', 'Breaking news (to my mom, mostly): {T}.', 'Not to brag, but {T}. Okay, a little bragging.'],
            body: ['My coffee and I are both very tired and very proud.', 'Is it a big deal? My group chat says yes.', 'Google Calendar said it was impossible. Google Calendar was wrong.'],
            cta: ['Drop an emoji if you relate.', 'Tag someone who needs to see this.', 'Your move, comments section.'],
            e: ['😏', '😂', '🤌', '💅']
        },
        story: {
            hook: ['A few months ago, I would not have believed this: {T}.', 'Let me tell you how this happened: {T}.', 'It started with a small idea. Today, {T}.'],
            body: ['There were late nights, doubts and a few "should I quit?" moments.\n\nBut every small step added up.', 'Behind it are people who believed in it early, and a lot of trial and error.', 'The truth is, nothing about it was overnight.'],
            cta: ['If you are working on something similar, keep going.', 'What is a story like this from your life? Tell me below.', 'Save this for the days you need a reminder.'],
            e: ['📖', '✨', '🙏', '💭']
        },
        genz: {
            hook: ['no thoughts just vibes: {T} 💀', 'ok but {T} and we are so back', 'POV: {T}', 'main character energy because {T}'],
            body: ['lowkey proud, highkey tired.', 'this one hits different fr.', 'manifested it, then actually did the work. iykyk.'],
            cta: ['drop a 🔥 if you are seated', 'send this to your bestie', 'comment "real" if you get it'],
            e: ['🔥', '💀', '✨', '🫶']
        },
        inspire: {
            hook: ['Small steps still move you forward. Today, {T}.', 'Reminder: progress is progress. {T}.', 'Dream it, then do it. {T}.'],
            body: ['You do not need to have it all figured out to start.', 'Growth is quiet most days. Then one day it shows.', 'Keep showing up. That is the whole secret.'],
            cta: ['Who needs to hear this today? Tag them.', 'Save this for your next slow day.', 'Share this with someone chasing a goal.'],
            e: ['🌱', '💫', '🌟', '🙌']
        },
        short: {
            hook: ['{T}.', '{T}. Done.', 'It is official: {T}.', 'Big news. {T}.'],
            body: [''], cta: ['More soon.', 'Stay tuned.', 'Thoughts?'],
            e: ['⚡', '🎯', '👀']
        },
        sales: {
            hook: ['🚨 Don\'t miss this: {T}!', 'You asked, we delivered: {T}.', 'This is the one you have been waiting for: {T}.'],
            body: ['Stock and time are limited, so do not wait too long.', 'Made for people who want the best without the hassle.', 'Once it is gone, it is gone.'],
            cta: ['Tap the link in bio to grab yours.', 'DM us now to order.', 'Shop now before it sells out.'],
            e: ['🛒', '🔥', '⏳', '💥']
        }
    };

    const STOP = new Set('a an the and or but of to in on at for with from by is are was were be been am i we you my our your me us it its this that these those just so very really new got get have has had will can about into over up out off then than as do did done im our ours some more most first one two three five after before when while since because even still only also every going went made make makes this weekend today tomorrow friday saturday sunday monday tuesday wednesday thursday'.split(' '));
    const THEME = [
        [/sneaker|shoe|kicks|drop/, ['sneakers', 'sneakerhead', 'kicks', 'newdrop']],
        [/market|brand|content|seo|ads?\b|social/, ['marketing', 'digitalmarketing', 'contentmarketing', 'branding']],
        [/linkedin|career|job|hire|intern/, ['linkedin', 'careergrowth', 'personalbranding']],
        [/certif|course|learn|study|class/, ['learning', 'growthmindset', 'upskill']],
        [/cafe|coffee|food|restaurant|eat/, ['foodie', 'cafe', 'coffeetime']],
        [/trip|travel|tour|resort|beach/, ['travel', 'wanderlust', 'teamtrip']],
        [/team|office|company|work/, ['teamwork', 'worklife', 'companyculture']],
        [/launch|open|start|new/, ['launch', 'newbeginnings', 'comingsoon']],
        [/dhaka|bangladesh|bd\b/, ['dhaka', 'bangladesh']],
        [/tip|how to|guide/, ['tips', 'howto', 'protips']],
        [/ai\b|chatgpt|claude|gemini/, ['ai', 'artificialintelligence', 'aitools']],
        [/design|logo|poster/, ['design', 'graphicdesign', 'creative']]
    ];

    function hashtags(txt, n) {
        const low = txt.toLowerCase(), tags = [];
        THEME.forEach(([re, t]) => { if (re.test(low)) tags.push(...t); });
        low.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !STOP.has(w)).forEach(w => tags.push(w));
        const uniq = [...new Set(tags)];
        for (let i = uniq.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [uniq[i], uniq[j]] = [uniq[j], uniq[i]]; }
        return uniq.slice(0, n).map(t => '#' + t);
    }

    function clean(t) {
        t = t.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
        return t;
    }
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

    function makeTemplate(raw) {
        let B = BANK[style];
        // don't push sales lines on posts that aren't selling anything
        if (style === 'sales' && !/\b(sale|sell|buy|shop|order|price|offer|discount|drop|launch|product|stock|deal|available)\b/i.test(raw)) B = BANK.witty;
        const emo = $('cmEmoji').checked;
        let tries = 0, txt;
        do {
            let hook = pick(B.hook).replace('{T}', raw);
            if (style !== 'genz') hook = cap(hook); else hook = hook.toLowerCase();
            const e = emo && !/\p{Extended_Pictographic}/u.test(hook) ? ' ' + pick(B.e) : '';
            const body = pick(B.body), cta = pick(B.cta);
            const parts = [hook + e];
            if (body && plat !== 'x') parts.push(body);
            parts.push(cta + (emo && style !== 'short' ? ' ' + pick(B.e) : ''));
            txt = parts.join('\n\n');
            if (!emo) txt = txt.replace(/\p{Extended_Pictographic}️?/gu, '').replace(/ +\n/g, '\n').trim();
        } while (txt === last && ++tries < 8);
        last = txt;
        return txt;
    }

    function show(txt, tags) {
        out.classList.remove('empty', 'pop'); void out.offsetWidth; out.classList.add('pop');
        out.textContent = txt;
        if (tags.length) {
            const s = document.createElement('span'); s.className = 'tags';
            s.textContent = (plat === 'instagram' ? '\n\n.\n.\n' : '\n\n') + tags.join(' ');
            out.appendChild(s);
        }
        const len = out.textContent.length;
        cnt.textContent = len + ' chars' + (plat === 'x' && len > 280 ? ' · over 280!' : '');
        $('cmRe').disabled = $('cmCopy').disabled = false;
    }

    let busy = false, prevAI = '';
    async function make() {
        const raw = clean(inp.value);
        if (!raw) { inp.focus(); toast('Type what your post is about first ✍️'); return; }
        if (busy) return; busy = true;
        const go = $('cmGo'), re = $('cmRe');
        go.disabled = re.disabled = true; go.textContent = '✨ Writing…';
        out.classList.remove('empty'); out.style.opacity = '.45';
        let txt = null;
        try {
            const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 15000);
            const r = await fetch('/api/caption', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal,
                body: JSON.stringify({ idea: raw, style, plat, emoji: $('cmEmoji').checked, tags: $('cmTags').checked, prev: prevAI }) });
            clearTimeout(to);
            if (r.ok) { const d = await r.json(); txt = d.caption || null; }
            else console.warn('[Caption AI]', r.status, await r.text().catch(() => ''));
        } catch (e) { console.warn('[Caption AI]', e); }
        out.style.opacity = '';
        if (txt) {
            prevAI = txt;
            const lines = txt.split('\n');
            const tagLine = /^\s*(#\S+\s*)+$/.test(lines[lines.length - 1] || '') ? lines.pop().trim() : '';
            show(lines.join('\n').trim(), tagLine ? tagLine.split(/\s+/) : []);
        } else {
            show(makeTemplate(raw), $('cmTags').checked ? hashtags(raw, PLATS[plat][2]) : []);
        }
        go.disabled = false; go.textContent = '✨ Generate caption';
        busy = false;
    }

    function toast(m) { const t = $('hlToast'); t.textContent = m; t.classList.add('in'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('in'), 1800); }

    $('cmPlat').innerHTML = Object.entries(PLATS).map(([k, [ic, n]]) => `<button type="button" class="hl-plat${k === plat ? ' on' : ''}" data-p="${k}">${ic ? ic + ' ' : ''}${n}</button>`).join('');
    $('cmStyles').innerHTML = Object.entries(STYLES).map(([k, n]) => `<button type="button" class="hl-chip${k === style ? ' on' : ''}" data-s="${k}">${n}</button>`).join('');
    $('cmEx').innerHTML = EX.map(e => `<button type="button">${e}</button>`).join('');

    $('cmPlat').addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (!b) return; plat = b.dataset.p; $('cmPlat').querySelectorAll('.hl-plat').forEach(x => x.classList.toggle('on', x === b)); });
    $('cmStyles').addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (!b) return; style = b.dataset.s; $('cmStyles').querySelectorAll('.hl-chip').forEach(x => x.classList.toggle('on', x === b)); });
    $('cmEx').addEventListener('click', e => { if (e.target.tagName === 'BUTTON') { inp.value = e.target.textContent; inp.focus(); } });
        $('cmGo').addEventListener('click', make);
    $('cmRe').addEventListener('click', make);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) make(); });
    $('cmCopy').addEventListener('click', () => {
        const t = out.textContent;
        (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('Copied ✅'), () => toast('Select and copy manually'));
    });
})();
