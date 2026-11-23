/* =========================================================
   HOOK LAB - scroll-stop scoring engine + UI
   100% formula based. Nothing leaves the browser.
   Built by Fardin Rahman Khan Raafi
========================================================= */
(function () {
    'use strict';
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const esc = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------- PLATFORMS ---------------- */
    const PLATFORMS = {
        linkedin:  { name: 'LinkedIn', cut: 140, ideal: [40, 140], words: [6, 22], icon: 'in', note: 'LinkedIn cuts posts at about 140 characters on mobile, before "…see more".' },
        instagram: { name: 'Instagram', cut: 125, ideal: [30, 125], words: [5, 20], icon: 'ig', note: 'Instagram shows roughly 125 characters of a caption before "… more".' },
        x:         { name: 'X / Threads', cut: 280, ideal: [30, 110], words: [5, 18], icon: 'x', note: 'Short, punchy openers win on X and Threads. Aim for under ~110 characters.' },
        email:     { name: 'Email subject', cut: 60, ideal: [25, 50], words: [4, 9], icon: 'mail', note: 'Inboxes cut subjects at around 50-60 characters, phones even earlier.' }
    };

    /* ---------------- WORD LISTS ---------------- */
    const W = (s) => s.split('|');
    const CURIOSITY = W("secret|secrets|nobody|no one|why|how|what|this|here's|heres|truth|mistake|mistakes|never|stop|actually|turns out|until|finally|reason|reasons|hidden|surprising|weird|strange|unexpected|lesson|lessons|learned|realized|discovered|wrong|myth|myths|lie|lies|nobody talks|the real|behind|instead|the one|thing|things|trick|hack|framework|playbook|exactly|before you|what happened|confession|then|everything|changed|happened|here's how|here's why|this is why|the day|one thing|turned|became|unpopular opinion|hot take");
    const POWER = W("free|proven|instantly|instant|easy|simple|fast|quick|ultimate|best|worst|brutal|honest|insane|crazy|massive|tiny|steal|copy|exposed|shocking|powerful|effortless|guaranteed|breakthrough|unlock|skyrocket|doubled|tripled|10x|explode|explosive|killer|deadly|fail|failed|failure|fired|quit|broke|rejected|lost|won|win|wins|winning|grew|growth|viral|million|billion|zero|unstoppable|obsessed|addicted|regret|fear|scared|embarrassing|painful|love|hate|angry|shocked|stunning|epic|legendary|secretly|forbidden|banned|dangerous|risky|bold|ruthless|genius|stupid|dumb|lazy|killing|kills|killed|dead|dying|ruin|ruining|ruined|destroy|destroyed|rejected|nightmare|disaster|obsession|game-changing|life-changing|changed everything");
    const BUZZ = W("synergy|synergies|leverage|leveraging|innovative|innovation|cutting-edge|cutting edge|solutions|solution|game-changer|game changer|paradigm|disruptive|disrupt|ecosystem|holistic|robust|seamless|seamlessly|best-in-class|world-class|next-level|delve|utilize|utilise|empower|empowering|thought leader|value-add|bandwidth|circle back|deep dive|move the needle|low-hanging fruit|scalable|optimize|optimise|streamline|revolutionize|revolutionise|journey|passionate|dynamic|results-driven|go-getter|unleash|elevate|transformative");
    const HEDGE = W("just|maybe|perhaps|kind of|sort of|i think|i guess|honestly|basically|literally|very|really|somewhat|probably|a bit|a little|might|hopefully");
    const CLICHE = W("in today's|in todays|fast-paced world|ever-changing|excited to announce|thrilled to announce|happy to announce|pleased to announce|i'm humbled|humbled to|let that sink in|agree?|thoughts?|hey guys|hi everyone|hello everyone|did you know|i am excited|i'm excited|i'm thrilled|it's no secret|at the end of the day|without further ado|as we all know|in this post|in this article|click here|check out my|new blog post|link in bio|dear connections|quick update");
    const IMPERATIVE = W("stop|steal|try|read|don't|dont|forget|imagine|learn|use|build|start|quit|ignore|write|copy|save|bookmark|watch|look|picture|try|avoid|never|do|grab|make|take|skip|kill|fire|delete");
    const CONTRAST = W("but|instead|not|vs|versus|yet|however|until|except|without|actually|unlike|rather");
    const TIME = W("second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years|morning|night|today|tonight|yesterday");
    const SPAM = W("free|buy now|act now|limited time|urgent|winner|cash|100% free|risk-free|click here|order now|$$$|guarantee|no cost");
    const STOP = new Set(W("every|daily|fast-paced|world|journey|excited|announce|opinion|unpopular|hot|take|thoughts|grew|grow|growing|changed|change|got|rejected|killing|cost|costs|warns|warn|works|work|working|happened|went|feel|think|know|want|need|use|using|share|tell|best|great|good|bad|big|small|last|first|next|cold-|everything|anything|nothing|something|today's|todays|ago|later|finally|instead|hard|easy|wrong|right|real|true|false|sure|quick|whole|via|per||a|an|the|and|or|but|if|so|to|of|in|on|for|with|at|by|from|up|about|into|over|after|is|are|was|were|be|been|being|am|do|does|did|have|has|had|i|me|my|we|our|you|your|he|she|it|its|they|them|their|this|that|these|those|here|there|what|which|who|whom|why|how|when|where|all|any|some|no|not|just|very|really|can|could|will|would|should|may|might|must|than|then|too|also|only|own|same|such|more|most|other|nobody|everyone|someone|thing|things|way|ways|get|got|make|made|like|one|two|three|i'm|im|it's|its|don't|dont|you're|youre|here's|heres|stop|start|new|today|time|year|years|day|days|week|weeks|month|months|people|lot|lots|really|actually|post|read|truth|secret|mistake|mistakes|lesson|lessons|nobody|tells|told|talk|talks|never|ever|always"));

    const hasPhrase = (lower, list) => list.filter(w => {
        if (w.includes(' ') || /[^a-z0-9']/.test(w)) return lower.includes(w);
        return new RegExp(`(^|[^a-z0-9'])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z0-9'])`).test(lower);
    });
    const EMOJI_RE = /\p{Extended_Pictographic}/gu;

    /* ---------------- SCORING ENGINE ---------------- */
    function analyze(raw, platformKey) {
        const P = PLATFORMS[platformKey];
        const text = (raw || '').trim();
        const firstLine = text.split(/\n/)[0] || '';
        const lower = text.toLowerCase();
        const words = (text.match(/[A-Za-z0-9$%'’-]+/g) || []);
        const wc = words.length, len = text.length;
        const signals = [];
        const add = (type, label, tip) => signals.push({ type, label, tip });

        if (!text) return { score: 0, metrics: { curiosity: 0, specificity: 0, emotion: 0, clarity: 0, focus: 0, originality: 0 }, signals: [], empty: true, len: 0, wc: 0, P };

        // --- Curiosity ---
        let cur = 18;
        const curHits = hasPhrase(lower, CURIOSITY);
        cur += Math.min(45, curHits.length * 15);
        if (/\?/.test(text)) { cur += 15; add('good', 'Asks a question', 'Questions open a loop the reader wants closed.'); }
        const conHits = hasPhrase(lower, CONTRAST);
        if (conHits.length) { cur += 12; add('good', 'Contrast / twist', `"${conHits[0]}" sets up tension.`); }
        if (/[:…]$|\.\.\.$|\(.*\)$/.test(text.trim()) || /:\s*$/.test(firstLine)) { cur += 12; add('good', 'Ends on a cliffhanger', 'A colon or "…" makes people click "see more".'); }
        if (/[.!]\s+(then|but|until|so)\b/i.test(text)) { cur += 15; add('good', 'Story turn', 'A "Then…" or "But…" twist pulls people into the story.'); }
        if (curHits.length) add('good', 'Curiosity words', curHits.slice(0, 3).map(w => `"${w}"`).join(', '));
        else add('warn', 'No curiosity gap', 'Tease a secret, mistake, or surprising result.');

        // --- Specificity ---
        let spec = 12;
        const nums = text.match(/(\$|৳|€|£)?\d[\d,.]*(k|m|x|%|\+)?/gi) || [];
        if (nums.length) { spec += 38 + Math.min(20, (nums.length - 1) * 10); add('good', 'Specific numbers', nums.slice(0, 3).join(', ') + ' feels concrete and credible.'); }
        else add('warn', 'No numbers', 'Numbers (7 tips, 30 days, 340K views) boost trust and clicks.');
        if (/[$৳€£%]|\b\d+(k|m|x)\b/i.test(text)) spec += 15;
        if (hasPhrase(lower, TIME).length) { spec += 15; }
        const proper = words.slice(1).filter(w => /^[A-Z][a-z]/.test(w) && !STOP.has(w.toLowerCase()));
        if (proper.length) { spec += Math.min(20, proper.length * 8); }
        if (hasPhrase(lower, W("things|stuff|something|some ways|a lot")).length) { spec -= 10; add('warn', 'Vague words', 'Swap "things/stuff" for the specific thing.'); }

        // --- Emotion ---
        let emo = 10;
        const pw = hasPhrase(lower, POWER);
        emo += Math.min(55, pw.length * 16);
        if (pw.length) add('good', 'Power words', pw.slice(0, 4).map(w => `"${w}"`).join(', '));
        const emojis = text.match(EMOJI_RE) || [];
        if (emojis.length === 1 || emojis.length === 2) emo += 10;
        if (emojis.length > 3) { emo -= 5; add('warn', 'Emoji overload', `${emojis.length} emojis. One or two is plenty.`); }
        const ex = (text.match(/!/g) || []).length;
        if (ex === 1) emo += 6;
        if (ex > 2) { emo -= 8; add('bad', 'Too many "!"', 'Excess exclamation marks read as spammy.'); }
        if (/\b(i|we)\b.*\b(failed|lost|fired|quit|broke|rejected|cried)\b/i.test(text)) { emo += 15; add('good', 'Vulnerable story', 'Admitting a struggle builds instant trust.'); }

        // --- Clarity / length ---
        let cla = 100;
        const [lo, hi] = P.ideal, [wlo, whi] = P.words;
        if (len < lo) { cla -= Math.min(40, (lo - len) * 1.4); add('warn', 'A bit short', `Aim for ${lo}-${hi} characters on ${P.name}.`); }
        if (len > hi) { cla -= Math.min(45, (len - hi) * 0.6); add('bad', 'Too long for the cut-off', `${P.name} hides text after ~${P.cut} characters.`); }
        if (wc < wlo) cla -= 10;
        if (wc > whi) cla -= Math.min(20, (wc - whi) * 3);
        const bz = hasPhrase(lower, BUZZ);
        if (bz.length) { cla -= bz.length * 12; add('bad', 'Buzzwords', bz.slice(0, 3).map(w => `"${w}"`).join(', ') + ' make eyes glaze over.'); }
        const hd = hasPhrase(lower, HEDGE);
        if (hd.length) { cla -= hd.length * 7; add('warn', 'Hedging words', hd.slice(0, 3).map(w => `"${w}"`).join(', ') + ' weaken the line.'); }
        const avgLen = words.reduce((s, w) => s + w.length, 0) / Math.max(1, wc);
        if (avgLen > 6.8) { cla -= 12; add('warn', 'Long words', 'Shorter words read faster on a phone.'); }
        if (/\b(is|are|was|were|been|being)\s+\w+ed\b/i.test(text)) cla -= 6;
        if (len >= lo && len <= hi) add('good', 'Great length', `${len} characters sits in the ${P.name} sweet spot.`);

        // --- Reader focus ---
        let foc = 38;
        const you = (lower.match(/\byou(r|'re|’re|rs|rself)?\b/g) || []).length;
        if (you) { foc += 30 + Math.min(15, (you - 1) * 8); add('good', 'Talks to "you"', 'Readers care about themselves first.'); }
        const firstWord = (words[0] || '').toLowerCase();
        if (/^(i|i'm|im|we|we're|my|our)$/.test(firstWord)) { foc -= 14; add('warn', `Starts with "${words[0]}"`, 'Lead with the reader or the payoff, not yourself.'); }
        if (IMPERATIVE.includes(firstWord)) { foc += 18; add('good', 'Opens with a command', `"${words[0]}" grabs attention immediately.`); }
        if (/\b(i|my)\b/i.test(text) && /\b\d/.test(text)) foc += 6; // personal + proof

        // --- Originality / pattern interrupt ---
        let ori = 58;
        const cl = hasPhrase(lower, CLICHE);
        if (cl.length) { ori -= cl.length * 22; add('bad', 'Cliché opener', cl.slice(0, 2).map(w => `"${w}"`).join(', ') + ' is what everyone writes.'); }
        const firstSentenceWords = (text.split(/[.!?:\n]/)[0].match(/\S+/g) || []).length;
        if (firstSentenceWords > 0 && firstSentenceWords <= 7) { ori += 14; add('good', 'Punchy first sentence', `Only ${firstSentenceWords} words before the first break.`); }
        if (/\n/.test(text)) ori += 6;
        if (/^unpopular opinion|^hot take|^controversial|^confession/i.test(text)) { ori += 16; add('good', 'Bold framing', 'Opinion openers trigger replies.'); }
        if (/^[#\p{Extended_Pictographic}]/u.test(text)) { ori -= 12; add('warn', 'Starts with emoji/hashtag', 'Start with words; the first 3 words matter most.'); }
        if (/^[A-Z\s\d!?.,'-]{12,}$/.test(text)) { ori -= 15; add('bad', 'ALL CAPS', 'Reads as shouting.'); }
        const hashtags = (text.match(/#\w+/g) || []).length;
        if (hashtags > 2) { ori -= 10; add('warn', 'Hashtags in the hook', 'Move hashtags to the end of the post.'); }

        // --- Email extras ---
        if (platformKey === 'email') {
            const sp = hasPhrase(lower, SPAM);
            if (sp.length) { cla -= 15; add('bad', 'Spam-trigger words', sp.slice(0, 3).map(w => `"${w}"`).join(', ') + ' can land you in Promotions or Spam.'); }
            if (emojis.length > 1) cla -= 8;
            if (/^[a-z]/.test(text)) { ori += 6; add('good', 'Lowercase subject', 'Looks personal, like a real email.'); }
        }

        const m = {
            curiosity: clamp(Math.round(cur)), specificity: clamp(Math.round(spec)), emotion: clamp(Math.round(emo)),
            clarity: clamp(Math.round(cla)), focus: clamp(Math.round(foc)), originality: clamp(Math.round(ori))
        };
        let score = m.curiosity * 0.22 + m.specificity * 0.17 + m.emotion * 0.15 + m.clarity * 0.2 + m.focus * 0.12 + m.originality * 0.14;
        if (wc < 3) score = Math.min(score, 30);
        if (cl.length >= 2) score = Math.min(score, 45);
        score = clamp(Math.round(score * 1.2));

        return { score, metrics: m, signals, len, wc, P, curHits, pw, nums, bz, hd, cl, you };
    }

    const GRADES = [
        [88, 'Viral-coded', '🚀', '#10B981'],
        [75, 'Thumb-stopper', '🛑', '#3B82F6'],
        [60, 'Decent hook', '👍', '#8B5CF6'],
        [40, 'Needs spice', '🧂', '#F59E0B'],
        [0, 'Scroll past', '💤', '#EF4444']
    ];
    const gradeOf = (s) => GRADES.find(g => s >= g[0]);

    /* ---------------- REWRITES ---------------- */
    function topicOf(text) {
        const words = (text.match(/[A-Za-z][A-Za-z'’-]*/g) || []);
        const lowerCl = text.toLowerCase();
        const cands = words.filter(w => {
            const l = w.toLowerCase().replace(/’/g, "'");
            return l.length > 2 && !STOP.has(l) && !BUZZ.includes(l) && !HEDGE.includes(l) && !POWER.includes(l) && !CURIOSITY.includes(l) && !IMPERATIVE.includes(l);
        });
        // prefer up to 2 consecutive content words, keep original casing for proper nouns
        let best = '';
        for (let i = 0; i < cands.length; i++) {
            const a = cands[i], b = cands[i + 1];
            const idxA = words.indexOf(a), idxB = b ? words.indexOf(b) : -1;
            if (b && idxB === idxA + 1) { best = `${a} ${b}`; break; }
        }
        if (!best) best = cands.sort((x, y) => y.length - x.length)[0] || '';
        if (!best) return 'content';
        return best.split(' ').map(w => /^[A-Z][a-z]+$/.test(w) && !/^[A-Z][a-z]+$/.test(lowerCl) ? (w === words[0] ? w.toLowerCase() : w) : w).join(' ');
    }
    const T = {
        linkedin: [
            `I wasted {time} on {topic}. Here's what actually works:`,
            `{n} {topic} mistakes nobody warns you about (the last one cost me the most):`,
            `Stop treating {topic} like a checklist. Do this instead:`,
            `Unpopular opinion: most {topic} advice is wrong. Here's why.`,
            `{Topic} isn't hard. You're just skipping step 1.`,
            `The {n}-minute {topic} habit that changed everything for me:`,
            `What {n} years of {topic} taught me in {n2} lines:`,
            `If your {topic} isn't working, read this before you quit.`,
            `I tried {n} {topic} hacks for {time}. Only one worked.`,
            `Nobody talks about the boring side of {topic}. Here's the truth:`
        ],
        instagram: [
            `{n} {topic} tips you'll wish you knew sooner 👇`,
            `Stop scrolling if your {topic} feels stuck 🛑`,
            `The {topic} secret nobody shows you on here:`,
            `POV: you finally figured out {topic} 😮‍💨`,
            `Save this before you try {topic} again 📌`,
            `I tested {n} {topic} hacks for {time}. Results:`,
            `{Topic} in {n} steps (steal step {n2}):`
        ],
        x: [
            `{Topic} is easier than you think. You're just skipping step 1.`,
            `{n} {topic} lessons I learned the hard way:`,
            `Most {topic} advice is wrong. Here's what works:`,
            `I wasted {time} on {topic} so you don't have to:`,
            `Hot take: {topic} doesn't need more effort. It needs a system.`,
            `The {topic} trick nobody talks about:`
        ],
        email: [
            `{n} {topic} ideas you can steal today`,
            `you're doing {topic} wrong (here's why)`,
            `quick question about your {topic}`,
            `the {n}-minute {topic} fix`,
            `{Topic}: what I wish I knew sooner`,
            `I tried {topic} for {time}. Here's what happened`
        ]
    };
    function fill(tpl, topic) {
        const n = pick([3, 5, 7, 9]), n2 = pick([2, 3, 4]).toString();
        const time = pick(['30 days', '6 months', '2 years', '90 days']);
        const Topic = topic.charAt(0).toUpperCase() + topic.slice(1);
        return tpl.replace(/\{n\}/g, n).replace(/\{n2\}/g, n2).replace(/\{time\}/g, time).replace(/\{Topic\}/g, Topic).replace(/\{topic\}/g, topic);
    }
    function rewrites(text, platformKey, count = 3) {
        const topic = topicOf(text || '');
        const pool = [...T[platformKey]].sort(() => Math.random() - 0.5);
        const out = [];
        for (const tpl of pool) {
            const line = fill(tpl, topic);
            if (out.some(o => o.text === line)) continue;
            out.push({ text: line, score: analyze(line, platformKey).score });
            if (out.length >= count + 2) break;
        }
        return out.sort((a, b) => b.score - a.score).slice(0, count);
    }

    /* ---------------- FORMULA LIBRARY ---------------- */
    const LIB = [
        ['Curiosity', 'The [topic] secret nobody talks about:'], ['Curiosity', "Here's what nobody tells you about [topic]:"], ['Curiosity', 'I found the reason your [topic] isn\'t working.'],
        ['Curiosity', 'This one [topic] mistake is costing you [result].'], ['Curiosity', 'Everyone gets [topic] wrong. Here\'s the fix:'],
        ['Contrarian', 'Unpopular opinion: [common belief] is overrated.'], ['Contrarian', 'Stop [common advice]. Do this instead:'], ['Contrarian', '[Popular thing] is dead. Here\'s what replaced it.'],
        ['Contrarian', 'Hot take: you don\'t need [thing everyone says you need].'], ['Contrarian', 'Most [topic] advice is wrong. Here\'s why.'],
        ['Story', 'I got rejected [number] times. Then this happened:'], ['Story', '[Time] ago I was [bad situation]. Today I [good outcome].'], ['Story', 'My boss said something that changed how I see [topic].'],
        ['Story', 'I almost quit [thing]. Glad I didn\'t. Here\'s why:'], ['Story', 'The worst [topic] mistake I ever made (and what it taught me):'],
        ['Numbers', '[Number] [topic] lessons I learned the hard way:'], ['Numbers', 'I grew [metric] from [x] to [y] in [time]. Here\'s how:'], ['Numbers', '[Number] tools that save me [time] every week:'],
        ['Numbers', 'What [number] years of [topic] taught me in [number] lines:'], ['Numbers', '[Percent]% of [people] get [topic] wrong. Are you one of them?'],
        ['Question', 'Why does nobody talk about [topic]?'], ['Question', 'What would you do with [result] in [time]?'], ['Question', 'Is [topic] actually worth it in [year]?'],
        ['Social proof', '[Big brand] does [tactic]. Here\'s how you can copy it:'], ['Social proof', 'I studied [number] viral [posts/ads]. They all had this in common:'], ['Social proof', 'How [person/brand] got [result] without [expected cost]:'],
        ['FOMO', 'If you\'re not doing [tactic] yet, you\'re already behind.'], ['FOMO', 'Save this before [platform] changes the algorithm again.'], ['FOMO', 'The [topic] window is closing. Here\'s what to do now:'],
        ['How-to', 'How to [result] without [pain point]:'], ['How-to', 'How I [result] in [time] (step by step):'], ['How-to', 'The [number]-step framework I use to [result]:'],
        ['Email', 'quick question about [topic]'], ['Email', '[Name], you\'re doing [topic] wrong'], ['Email', '[number] [topic] ideas you can steal today'], ['Email', 'the [number]-minute [topic] fix'],
        ['Email', 'last chance: [offer] ends tonight'], ['Email', 'I made a mistake (and it cost me [result])']
    ];

    /* ---------------- STATE ---------------- */
    const S = { platform: 'linkedin', mode: 'single', a: '', b: '', history: [] };
    try { Object.assign(S, JSON.parse(localStorage.getItem('hooklab-state') || '{}')); } catch (e) {}
    const urlHook = new URLSearchParams(location.search).get('h');
    if (urlHook) { S.a = urlHook.slice(0, 400); S.mode = 'single'; }
    const save = () => { try { localStorage.setItem('hooklab-state', JSON.stringify({ platform: S.platform, mode: S.mode, a: S.a, b: S.b, history: S.history.slice(0, 6) })); } catch (e) {} };

    /* ---------------- DOM ---------------- */
    const inA = $('#hlInputA'), inB = $('#hlInputB');
    const tabs = $$('.hl-plat'), modeBtns = $$('.hl-mode button');
    const lab = $('#hlLab');

    /* ---------------- GAUGE ---------------- */
    function makeGauge(svg) {
        const arc = svg.querySelector('.g-val'), needle = svg.querySelector('.g-needle'), num = svg.parentElement.querySelector('.g-num');
        const L = arc.getTotalLength();
        arc.style.strokeDasharray = L; arc.style.strokeDashoffset = L;
        let cur = 0, target = 0, raf = 0;
        const draw = (v) => {
            arc.style.strokeDashoffset = L * (1 - v / 100);
            needle.setAttribute('transform', `rotate(${-90 + v * 1.8} 120 120)`);
            num.textContent = Math.round(v);
        };
        draw(0);
        return (v) => {
            target = v;
            if (reduceMotion) { cur = v; draw(v); return; }
            cancelAnimationFrame(raf);
            const from = cur, t0 = performance.now(), dur = 700;
            const step = (now) => {
                const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
                cur = from + (target - from) * e; draw(cur);
                if (k < 1) raf = requestAnimationFrame(step);
            };
            raf = requestAnimationFrame(step);
        };
    }
    const gaugeA = makeGauge($('#gaugeA svg')), gaugeB = makeGauge($('#gaugeB svg'));

    /* ---------------- RENDER HELPERS ---------------- */
    const METRICS = [
        ['curiosity', 'Curiosity', '🧩', 'Does it open a loop the reader must close?'],
        ['specificity', 'Specificity', '🎯', 'Numbers, names and concrete details.'],
        ['emotion', 'Emotion', '🔥', 'Power words and stakes that make people feel something.'],
        ['clarity', 'Clarity & length', '✂️', 'Fits the platform cut-off with no fluff or jargon.'],
        ['focus', 'Reader focus', '👀', 'About "you", not "me". Commands beat announcements.'],
        ['originality', 'Pattern interrupt', '⚡', 'Avoids clichés and breaks the scroll rhythm.']
    ];
    function renderMetrics(el, r) {
        el.innerHTML = METRICS.map(([k, label, ic, tip]) => `
            <div class="hl-metric" title="${esc(tip)}">
                <div class="hl-m-top"><span>${ic} ${label}</span><b>${r.empty ? '-' : r.metrics[k]}</b></div>
                <div class="hl-m-bar"><i style="width:${r.empty ? 0 : r.metrics[k]}%; background:${barColor(r.metrics[k])}"></i></div>
            </div>`).join('');
    }
    const barColor = (v) => v >= 75 ? 'linear-gradient(90deg,#3B82F6,#10B981)' : v >= 50 ? 'linear-gradient(90deg,#6366F1,#A855F7)' : v >= 30 ? 'linear-gradient(90deg,#F59E0B,#F97316)' : 'linear-gradient(90deg,#EF4444,#F43F5E)';

    function highlight(text) {
        if (!text) return '<span class="hl-ph">Your hook will appear here with the good and bad parts marked.</span>';
        const lower = text.toLowerCase();
        const marks = [];
        const mark = (list, cls) => list.forEach(w => {
            const re = new RegExp(`(^|[^a-z0-9'])(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?=$|[^a-z0-9'])`, 'gi');
            let m; while ((m = re.exec(lower))) marks.push([m.index + m[1].length, m.index + m[1].length + m[2].length, cls]);
        });
        mark(CLICHE, 'mk-bad'); mark(BUZZ, 'mk-bad'); mark(HEDGE, 'mk-warn'); mark(POWER, 'mk-pow'); mark(CURIOSITY, 'mk-cur');
        const nre = /(\$|৳|€|£)?\d[\d,.]*(k|m|x|%|\+)?/gi; let m;
        while ((m = nre.exec(text))) marks.push([m.index, m.index + m[0].length, 'mk-num']);
        const yre = /\byou(r|'re|’re|rs|rself)?\b/gi;
        while ((m = yre.exec(text))) marks.push([m.index, m.index + m[0].length, 'mk-you']);
        marks.sort((a, b) => a[0] - b[0] || (b[1] - b[0]) - (a[1] - a[0]));
        let out = '', pos = 0;
        for (const [s, e, c] of marks) { if (s < pos) continue; out += esc(text.slice(pos, s)) + `<mark class="${c}">${esc(text.slice(s, e))}</mark>`; pos = e; }
        out += esc(text.slice(pos));
        return out.replace(/\n/g, '<br>');
    }

    function renderSignals(el, r) {
        if (r.empty) { el.innerHTML = ''; return; }
        const order = { bad: 0, warn: 1, good: 2 };
        el.innerHTML = r.signals.sort((a, b) => order[a.type] - order[b.type]).map(s =>
            `<div class="hl-sig ${s.type}"><span class="hl-sig-ic">${s.type === 'good' ? '✓' : s.type === 'warn' ? '!' : '✕'}</span><div><b>${esc(s.label)}</b><small>${esc(s.tip)}</small></div></div>`).join('');
    }

    /* ---------------- PHONE PREVIEW ---------------- */
    function renderPreview(text) {
        const P = PLATFORMS[S.platform];
        const t = text.trim() || 'Your hook shows up here exactly how people will see it in their feed…';
        const cut = t.length > P.cut;
        const shown = esc(cut ? t.slice(0, P.cut).replace(/\s+\S*$/, '') : t).replace(/\n/g, '<br>');
        const more = { linkedin: '…see more', instagram: '… more', x: '', email: '' }[S.platform];
        const av = '<img src="/misc_img/avatar.jpg" alt="" width="40" height="40">';
        const ph = $('#hlPhone');
        ph.dataset.p = S.platform;
        if (S.platform === 'linkedin') {
            ph.innerHTML = `<div class="pv-li"><div class="pv-head">${av}<div><b>Your Name</b><small>Marketing • 1st<br>2h • 🌐</small></div><span class="pv-follow">+ Follow</span></div>
                <p class="pv-text">${shown}${cut ? ` <span class="pv-more">${more}</span>` : ''}</p>
                <div class="pv-media"></div><div class="pv-react">👍❤️💡 <span>1,284</span><span class="r">96 comments • 41 reposts</span></div>
                <div class="pv-actions"><span>👍 Like</span><span>💬 Comment</span><span>🔁 Repost</span><span>➤ Send</span></div></div>`;
        } else if (S.platform === 'instagram') {
            ph.innerHTML = `<div class="pv-ig"><div class="pv-head">${av}<b>yourbrand</b><span class="dots">•••</span></div>
                <div class="pv-media ig"></div><div class="pv-icons">♡ 💬 ➤ <span>🔖</span></div><b class="pv-likes">4,821 likes</b>
                <p class="pv-text"><b>yourbrand</b> ${shown}${cut ? ` <span class="pv-more">${more}</span>` : ''}</p></div>`;
        } else if (S.platform === 'x') {
            ph.innerHTML = `<div class="pv-x"><div class="pv-head">${av}<div><b>Your Name <span class="v">✓</span></b> <small>@you · 2h</small></div></div>
                <p class="pv-text">${esc(t).replace(/\n/g, '<br>')}</p><div class="pv-xa"><span>💬 48</span><span>🔁 120</span><span>♡ 1.2K</span><span>📊 48K</span></div>
                <div class="pv-count ${t.length > 280 ? 'over' : ''}">${t.length}/280</div></div>`;
        } else {
            const subj = esc(t.length > 52 ? t.slice(0, 52) + '…' : t);
            ph.innerHTML = `<div class="pv-mail"><div class="pv-mail-top">Inbox</div>
                <div class="pv-row me"><span class="pv-dot"></span><div><b>Your Brand</b><em>9:41 AM</em><strong>${subj}</strong><small>Hey friend, quick one today…</small></div></div>
                <div class="pv-row"><div><b>Newsletter Weekly</b><em>8:02 AM</em><strong>Your weekly digest is here</strong><small>Top stories from this week…</small></div></div>
                <div class="pv-row"><div><b>Shop Sale</b><em>Yesterday</em><strong>Last chance: 20% off ends tonight</strong><small>Don't miss out on…</small></div></div>
                <div class="pv-row"><div><b>Team Update</b><em>Yesterday</em><strong>Notes from Monday's meeting</strong><small>Hi all, attached are…</small></div></div></div>`;
        }
        $('#hlCutNote').textContent = P.note;
    }

    /* ---------------- FIFI COACH ---------------- */
    let coachTimer = 0, lastCoach = '';
    const coachSay = (msg) => {
        if (msg === lastCoach) return; lastCoach = msg;
        const el = $('#hlCoachText'); clearTimeout(coachTimer);
        if (reduceMotion) { el.textContent = msg; return; }
        el.textContent = ''; let i = 0;
        const type = () => { el.textContent = msg.slice(0, ++i); if (i < msg.length) coachTimer = setTimeout(type, 16); };
        type();
        const av = $('#hlCoachAv'); av.classList.remove('boing'); void av.offsetWidth; av.classList.add('boing');
    };
    function coachFor(r) {
        if (r.empty) return "drop your opening line in the box and i'll judge it. lovingly. mostly 😌";
        const bad = r.signals.find(s => s.type === 'bad');
        const warn = r.signals.find(s => s.type === 'warn');
        if (r.score >= 88) return pick(["ok this hook is UNREAL. post it before someone steals it 🚀", "viral-coded fr. the algorithm is already sweating 🔥", "no notes. absolute cinema 🎬"]);
        if (r.score >= 75) return pick(["thumb-stopper! " + (warn ? `tiny fix: ${warn.tip.toLowerCase()}` : "polish one word and ship it 🛑"), "W hook. people WILL click see more 👀"]);
        if (r.signals.some(s => /Cliché/.test(s.label))) return "bestie that opener is in every 2019 LinkedIn post 💀 try one of my rewrites below";
        if (r.signals.some(s => /Buzzwords/.test(s.label))) return "too many buzzwords. my eyes glazed over and i'm a robot 🤖";
        if (bad && /long/i.test(bad.label)) return `it's getting cut off before the good part ✂️ keep it under ${r.P.cut} characters`;
        if (r.score < 70 && r.signals.some(s => /Starts with "(I|We|My|Our|I'm|Im|We're)"/i.test(s.label))) return "it opens with you, not them. flip it so the reader is the main character 👀";
        if (r.score >= 60) return pick(["decent! add a number or a twist and it levels up 📈", "solid base. now make it spicy 🌶️ (curiosity or a number)"]);
        if (r.score >= 40) return pick(["mid ngl 🧂 needs a curiosity gap. what's the secret?", "it's giving 'scroll past'. try a number + a bold claim"]);
        return pick(["this hook is asleep 💤 smash 'rewrite' and let me cook", "ain't no way this stops a thumb 😭 check the fixes below"]);
    }

    /* ---------------- MAIN UPDATE ---------------- */
    let lastRA = null;
    function update(fromTyping = false) {
        const P = PLATFORMS[S.platform];
        S.a = inA.value; S.b = inB.value;
        const rA = analyze(S.a, S.platform);
        lastRA = rA;
        gaugeA(rA.score);
        const gA = gradeOf(rA.score);
        $('#gradeA').innerHTML = rA.empty ? '<span>Waiting for your hook…</span>' : `<span style="color:${gA[3]}">${gA[2]} ${gA[1]}</span>`;
        $('#gaugeA').style.setProperty('--gc', rA.empty ? '#64748B' : gA[3]);
        renderMetrics($('#metricsA'), rA);
        renderSignals($('#signals'), rA);
        $('#hlHighlight').innerHTML = highlight(S.a.trim());
        // counters + cutoff bar
        const len = S.a.trim().length;
        $('#countA').textContent = `${len} chars · ${rA.wc} words`;
        $('#countA').classList.toggle('over', len > P.cut);
        const pct = Math.min(100, (len / P.cut) * 100);
        $('#cutA i').style.width = pct + '%';
        $('#cutA').classList.toggle('over', len > P.cut);
        $('#cutA').title = `${P.name} cut-off: ${P.cut} characters`;
        renderPreview(S.a);
        coachSay(coachFor(rA));
        // compare mode
        if (S.mode === 'ab') {
            const rB = analyze(S.b, S.platform);
            gaugeB(rB.score);
            const gB = gradeOf(rB.score);
            $('#gradeB').innerHTML = rB.empty ? '<span>Waiting for hook B…</span>' : `<span style="color:${gB[3]}">${gB[2]} ${gB[1]}</span>`;
            $('#gaugeB').style.setProperty('--gc', rB.empty ? '#64748B' : gB[3]);
            $('#countB').textContent = `${S.b.trim().length} chars`;
            renderCompare(rA, rB);
        }
        $('#hlShare').disabled = rA.empty;
        if (!fromTyping) save();
    }

    function renderCompare(rA, rB) {
        const el = $('#hlCompare');
        if (rA.empty || rB.empty) { el.innerHTML = '<p class="hl-muted">Write both hooks to see who wins.</p>'; return; }
        const win = rA.score === rB.score ? 0 : rA.score > rB.score ? 1 : 2;
        el.innerHTML = `<div class="hl-winner ${win ? 'w' + win : ''}">${win === 0 ? "🤝 It's a tie. Test both and let the data decide." : `🏆 Hook ${win === 1 ? 'A' : 'B'} wins by ${Math.abs(rA.score - rB.score)} points`}</div>` +
            METRICS.map(([k, label, ic]) => {
                const a = rA.metrics[k], b = rB.metrics[k];
                return `<div class="hl-cmp"><span class="a ${a > b ? 'lead' : ''}">${a}</span><div class="hl-cmp-bars"><i class="ba" style="width:${a / 2}%"></i><em>${ic} ${label}</em><i class="bb" style="width:${b / 2}%"></i></div><span class="b ${b > a ? 'lead' : ''}">${b}</span></div>`;
            }).join('');
        if (win && !reduceMotion && el.dataset.last !== String(win) ) { confetti(); }
        el.dataset.last = String(win);
    }

    /* ---------------- REWRITES UI ---------------- */
    function renderRewrites() {
        const list = rewrites(S.a, S.platform);
        $('#hlRewrites').innerHTML = list.map((r, i) => {
            const g = gradeOf(r.score);
            return `<div class="hl-rw" style="--d:${i * 80}ms">
                <div class="hl-rw-score" style="--gc:${g[3]}"><b>${r.score}</b><small>${g[2]}</small></div>
                <p>${esc(r.text)}</p>
                <div class="hl-rw-act"><button type="button" class="hl-btn ghost sm" data-copy="${esc(r.text)}">Copy</button><button type="button" class="hl-btn sm" data-use="${esc(r.text)}">Use this</button></div>
            </div>`;
        }).join('');
    }

    /* ---------------- SHARE CARD ---------------- */
    function wrapText(g, text, maxW) {
        const words = text.split(/\s+/), lines = []; let line = '';
        for (const w of words) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
        if (line) lines.push(line); return lines;
    }
    async function shareCard() {
        const r = lastRA; if (!r || r.empty) return;
        const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1350;
        const g = cv.getContext('2d');
        try { await document.fonts.load('800 60px Syne'); } catch (e) {}
        const bg = g.createLinearGradient(0, 0, 1080, 1350); bg.addColorStop(0, '#0B1024'); bg.addColorStop(.55, '#1E1B4B'); bg.addColorStop(1, '#3B0D3A');
        g.fillStyle = bg; g.fillRect(0, 0, 1080, 1350);
        // grid + glow
        g.strokeStyle = 'rgba(148,163,184,.07)'; g.lineWidth = 1;
        for (let x = 0; x < 1080; x += 54) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1350); g.stroke(); }
        for (let y = 0; y < 1350; y += 54) { g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
        const glow = g.createRadialGradient(540, 470, 40, 540, 470, 420); glow.addColorStop(0, 'rgba(139,92,246,.45)'); glow.addColorStop(1, 'rgba(139,92,246,0)');
        g.fillStyle = glow; g.fillRect(0, 0, 1080, 1000);
        // brand
        g.fillStyle = '#F8FAFC'; g.font = '800 40px Syne, Arial'; g.textAlign = 'left'; g.fillText('HOOK LAB', 80, 110);
        g.fillStyle = '#A78BFA'; g.font = '600 26px "DM Sans", Arial'; g.fillText(`Scroll-stop score · ${PLATFORMS[S.platform].name}`, 80, 152);
        // ring
        const gr = gradeOf(r.score);
        g.lineCap = 'round'; g.lineWidth = 34; g.strokeStyle = 'rgba(255,255,255,.08)';
        g.beginPath(); g.arc(540, 470, 190, Math.PI * .75, Math.PI * 2.25); g.stroke();
        const rg = g.createLinearGradient(350, 0, 730, 0); rg.addColorStop(0, '#3B82F6'); rg.addColorStop(.5, '#8B5CF6'); rg.addColorStop(1, '#EC4899');
        g.strokeStyle = rg; g.beginPath(); g.arc(540, 470, 190, Math.PI * .75, Math.PI * .75 + Math.PI * 1.5 * r.score / 100); g.stroke();
        g.textAlign = 'center'; g.fillStyle = '#fff'; g.font = '800 150px Syne, Arial'; g.fillText(r.score, 540, 520);
        g.font = '700 40px "DM Sans", Arial'; g.fillStyle = gr[3]; g.fillText(gr[1].toUpperCase(), 540, 700);
        // hook text
        g.textAlign = 'left'; g.fillStyle = 'rgba(255,255,255,.06)';
        g.beginPath(); g.roundRect ? g.roundRect(80, 750, 920, 270, 28) : g.rect(80, 750, 920, 270); g.fill();
        g.fillStyle = '#E2E8F0'; g.font = '600 40px "DM Sans", Arial';
        let lines = wrapText(g, '“' + (S.a.trim().replace(/\s+/g, ' ')) + '”', 840);
        if (lines.length > 4) { lines = lines.slice(0, 4); lines[3] = lines[3].replace(/\s*\S*$/, '') + '…”'; }
        lines.forEach((l, i) => g.fillText(l, 120, 815 + i * 50));
        // metric bars
        const ms = METRICS.slice(0, 6);
        ms.forEach(([k, label], i) => {
            const col = i % 3, row = Math.floor(i / 3), x = 80 + col * 315, y = 1085 + row * 85;
            g.fillStyle = '#94A3B8'; g.font = '600 24px "DM Sans", Arial'; g.fillText(`${label}`, x, y);
            g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(x, y + 16, 280, 12);
            g.fillStyle = rg; g.fillRect(x, y + 16, 280 * r.metrics[k] / 100, 12);
            g.fillStyle = '#fff'; g.font = '700 24px "DM Sans", Arial'; g.textAlign = 'right'; g.fillText(r.metrics[k], x + 280, y); g.textAlign = 'left';
        });
        g.fillStyle = '#94A3B8'; g.font = '600 26px "DM Sans", Arial'; g.textAlign = 'center';
        g.fillText('Test your hook free → fardinraafi.com/projects/hook-lab', 540, 1290);
        cv.toBlob(async (blob) => {
            const file = new File([blob], `hook-lab-score-${r.score}.png`, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] }) && matchMedia('(pointer: coarse)').matches) {
                try { await navigator.share({ files: [file], title: 'My Hook Lab score', text: `My hook scored ${r.score}/100 on Hook Lab 👀` }); return; } catch (e) {}
            }
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 4000);
            toast('Score card downloaded 📸');
        }, 'image/png');
    }

    /* ---------------- LIBRARY UI ---------------- */
    let libCat = 'All';
    function renderLibrary() {
        const q = ($('#hlLibSearch').value || '').toLowerCase();
        const cats = ['All', ...new Set(LIB.map(l => l[0]))];
        $('#hlLibCats').innerHTML = cats.map(c => `<button type="button" class="hl-chip ${c === libCat ? 'on' : ''}" data-cat="${c}">${c}</button>`).join('');
        const items = LIB.filter(([c, t]) => (libCat === 'All' || c === libCat) && (!q || t.toLowerCase().includes(q) || c.toLowerCase().includes(q)));
        $('#hlLibGrid').innerHTML = items.map(([c, t]) => `<button type="button" class="hl-formula" data-formula="${esc(t)}"><small>${c}</small><span>${esc(t).replace(/\[([^\]]+)\]/g, '<em>[$1]</em>')}</span><i>Use →</i></button>`).join('') || '<p class="hl-muted">No formulas match that search.</p>';
    }

    /* ---------------- HISTORY ---------------- */
    function pushHistory() {
        const t = S.a.trim(); if (!t || !lastRA || lastRA.wc < 3) return;
        S.history = [{ t, s: lastRA.score, p: S.platform }, ...S.history.filter(h => h.t !== t)].slice(0, 6);
        renderHistory(); save();
    }
    function renderHistory() {
        const el = $('#hlHistory');
        el.innerHTML = S.history.length ? S.history.map(h => `<button type="button" class="hl-hist" data-hist="${esc(h.t)}" data-p="${h.p}"><b style="color:${gradeOf(h.s)[3]}">${h.s}</b><span>${esc(h.t)}</span></button>`).join('') : '<p class="hl-muted">Hooks you test show up here.</p>';
    }

    /* ---------------- EFFECTS ---------------- */
    function toast(msg) {
        const t = $('#hlToast'); t.textContent = msg; t.classList.add('in');
        clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('in'), 2200);
    }
    function confetti() {
        const cv = $('#hlConfetti'), g = cv.getContext('2d');
        cv.width = innerWidth; cv.height = innerHeight;
        const cols = ['#2563EB', '#7C3AED', '#DB2777', '#10B981', '#F59E0B'];
        const ps = Array.from({ length: 110 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .4, vx: (Math.random() - .5) * 15, vy: -Math.random() * 13 - 4, r: Math.random() * 6 + 3, rot: Math.random() * 6, c: pick(cols), l: 1 }));
        const t0 = performance.now();
        const step = (now) => {
            g.clearRect(0, 0, cv.width, cv.height);
            ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.rot += .15; p.l -= .008; g.save(); g.globalAlpha = Math.max(0, p.l); g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.c; g.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); g.restore(); });
            if (now - t0 < 2600) requestAnimationFrame(step); else g.clearRect(0, 0, cv.width, cv.height);
        };
        requestAnimationFrame(step);
    }

    /* ---------------- EXAMPLES ---------------- */
    const EXAMPLES = {
        linkedin: ["In today's fast-paced world, I'm excited to announce my new journey!", 'I got rejected from 47 jobs. Then one cold email changed everything:', 'Stop posting every day. Here\'s what actually grew my reach 3x:'],
        instagram: ['New post! Check it out 🙌🔥💯✨', 'Save this before you edit your next Reel 📌', '5 caption tricks I stole from brands with 1M+ followers 👇'],
        x: ['Some thoughts on marketing today.', 'Most growth advice is wrong. Here\'s what actually worked for us:', 'I spent $0 on ads and got 17K followers. Thread:'],
        email: ['Monthly Newsletter - November Edition', 'quick question about your next campaign', '3 subject lines that doubled our open rate']
    };
    let exI = 0;

    /* ---------------- EVENTS ---------------- */
    let typingT = 0;
    const onType = () => { update(true); clearTimeout(typingT); typingT = setTimeout(() => { save(); renderRewrites(); pushHistory(); }, 900); };
    inA.addEventListener('input', onType);
    inB.addEventListener('input', onType);

    tabs.forEach(t => t.addEventListener('click', () => {
        S.platform = t.dataset.p;
        tabs.forEach(x => x.classList.toggle('on', x === t)); tabs.forEach(x => x.setAttribute('aria-selected', x === t));
        update(); renderRewrites();
    }));
    modeBtns.forEach(b => b.addEventListener('click', () => {
        S.mode = b.dataset.m;
        modeBtns.forEach(x => x.classList.toggle('on', x === b));
        lab.classList.toggle('ab', S.mode === 'ab');
        update();
        if (S.mode === 'ab' && !inB.value.trim()) inB.focus();
    }));
    $('#hlExample').addEventListener('click', () => {
        const ex = EXAMPLES[S.platform]; inA.value = ex[exI++ % ex.length]; update(); renderRewrites(); pushHistory();
    });
    $('#hlClear').addEventListener('click', () => { inA.value = ''; update(); renderRewrites(); inA.focus(); });
    $('#hlShuffle').addEventListener('click', () => { renderRewrites(); const b = $('#hlShuffle'); b.classList.remove('spin'); void b.offsetWidth; b.classList.add('spin'); });
    $('#hlShare').addEventListener('click', shareCard);
    $('#hlLink').addEventListener('click', () => {
        const url = `${location.origin}${location.pathname}?h=${encodeURIComponent(S.a.trim())}`;
        (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => toast('Link copied 🔗'), () => prompt('Copy this link:', url));
    });
    document.addEventListener('click', (e) => {
        const c = e.target.closest('[data-copy]');
        if (c) { (navigator.clipboard ? navigator.clipboard.writeText(c.dataset.copy) : Promise.reject()).then(() => toast('Copied ✅'), () => {}); return; }
        const u = e.target.closest('[data-use]');
        if (u) { inA.value = u.dataset.use; update(); renderRewrites(); pushHistory(); $('#hlLab').scrollIntoView({ behavior: 'smooth', block: 'start' }); toast('Swapped in 🔁'); return; }
        const f = e.target.closest('[data-formula]');
        if (f) {
            if (S.mode === 'ab') { modeBtns[0].click(); }
            inA.value = f.dataset.formula; update(); renderRewrites();
            $('#hlLab').scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => { const i = inA.value.indexOf('['); if (i >= 0) { inA.focus(); inA.setSelectionRange(i, inA.value.indexOf(']', i) + 1); } }, 450);
            toast('Fill in the [brackets] ✍️'); return;
        }
        const h = e.target.closest('[data-hist]');
        if (h) { const p = tabs.find(t => t.dataset.p === h.dataset.p); if (p && p.dataset.p !== S.platform) p.click(); inA.value = h.dataset.hist; update(); renderRewrites(); return; }
        const cat = e.target.closest('[data-cat]');
        if (cat) { libCat = cat.dataset.cat; renderLibrary(); }
    });
    $('#hlLibSearch').addEventListener('input', renderLibrary);
    $('#hlCoachAv').addEventListener('click', () => coachSay(pick(["psst: numbers + curiosity is the cheat code 🤫", "the first 3 words do 80% of the work. make them count", "write 10 hooks, post the best one. that's the secret 🧪", "if you'd scroll past it, so will they 👀"])));

    /* ---------------- INIT ---------------- */
    inA.value = S.a || ''; inB.value = S.b || '';
    tabs.forEach(t => { t.classList.toggle('on', t.dataset.p === S.platform); t.setAttribute('aria-selected', t.dataset.p === S.platform); });
    modeBtns.forEach(b => b.classList.toggle('on', b.dataset.m === S.mode));
    lab.classList.toggle('ab', S.mode === 'ab');
    renderLibrary(); renderHistory();
    update(); renderRewrites();
})();
