/* Swipe the Hook: Tinder-style hook game. Fresh AI hooks from /api/hooks, local bank as fallback. */
(() => {
    const $ = id => document.getElementById(id);
    const ROUND = 15;
    const KEY = 'sth-stats-v1';

    // fallback bank, used only if the AI is unavailable
    const BANK = [
        ['I lost 3 clients in one week. It was the best thing that happened to my business.', true, 'Contrarian twist plus real stakes.'],
        ['In today\'s fast-paced digital world, marketing is more important than ever.', false, 'The most overused opener on the internet.'],
        ['I am excited to announce that I have started a new position.', false, 'Humble announcement, zero hook.'],
        ['Your resume isn\'t the problem. Your first 7 words are.', true, 'Calls out a pain and teases a fix.'],
        ['Here are some thoughts I had about leadership recently.', false, 'Vague, no promise, no tension.'],
        ['We spent $0 on ads and hit 17K followers in 5 months. Here\'s the playbook.', true, 'Specific numbers and a clear payoff.'],
        ['Stop posting every day. Do this instead.', true, 'Bold contrarian take with a curiosity gap.'],
        ['Marketing is a very interesting field with many opportunities.', false, 'Generic statement nobody would stop for.'],
        ['My boss rejected my idea. 6 months later, it made us 2 million taka.', true, 'Mini story with conflict and a big result.'],
        ['Let me tell you about something.', false, 'Teases nothing specific.'],
        ['99% of LinkedIn posts die in the first 2 seconds. Here\'s why.', true, 'Stat plus a reason to keep reading.'],
        ['Hard work is the key to success, never give up!', false, 'Cliche motivation, heard it a million times.'],
        ['I tested 47 cold emails. Only 3 got replies. Here they are.', true, 'Real experiment, specific numbers, payoff.'],
        ['This might be a long post but please read till the end.', false, 'Begging for attention instead of earning it.'],
        ['Nobody tells you this about your first marketing job.', true, 'Insider secret curiosity gap.'],
        ['Check out our new product, it\'s amazing and you will love it!', false, 'All hype, no reason to care.'],
        ['The worst advice I ever got: "follow your passion."', true, 'Hot take people want to argue with.'],
        ['Some tips that might help you with productivity maybe.', false, 'Weak and unsure, no authority.'],
        ['I asked 100 recruiters what they look at first. 82 said the same thing.', true, 'Big sample, cliffhanger result.'],
        ['Happy Monday everyone! Hope you all have a great week ahead.', false, 'Pleasant but forgettable.'],
        ['You\'re not lazy. Your to-do list is lying to you.', true, 'Relatable pain with a twist.'],
        ['Thrilled and humbled to share this amazing journey with you all.', false, 'Humble-brag buzzword soup.'],
        ['This 9-second trick doubled our Reel views overnight.', true, 'Tiny effort, big promise, specific.'],
        ['Social media is important for businesses of all sizes nowadays.', false, 'Obvious statement, no angle.'],
        ['I got rejected from 43 jobs. Job 44 changed everything.', true, 'Underdog story with stakes.'],
        ['Click here to learn more about our services and offerings.', false, 'Sales-speak, zero curiosity.'],
        ['Your brand isn\'t boring. Your captions are.', true, 'Punchy reframe that stings a little.'],
        ['As a passionate, results-driven professional, I believe in growth.', false, 'Resume buzzwords, no substance.'],
        ['3 free tools that replaced my $200/month software stack.', true, 'Clear value and money saved.'],
        ['Just wanted to share a quick update with my network today.', false, 'Says nothing about what the update is.']
    ];

    const RANKS = [
        [15, 'Hook Whisperer 🧙', ['perfect score?? ok you clearly write hooks for a living 😳 teach me', '15/15. Fardin is shaking rn 💀 respect']],
        [13, 'Scroll Sniper 🎯', ['elite instincts fr. one more round and you\'re a hook whisperer 🔥', 'okay marketer, i see you 👀 that was clean']],
        [10, 'Solid Marketer 💼', ['solid! a couple sneaky ones got you, check the breakdown below 👇', 'not bad at all. the subtle bad ones are the real boss fight 😤']],
        [7, 'Intern Energy 📎', ['intern energy, but we all start somewhere 🫡 read the why notes and run it back', 'mid but fixable. the breakdown is basically a free lesson 📚']],
        [0, 'Certified Scroller 🫠', ['bestie you\'d like every post on linkedin 😭 run it back', 'the hooks won this round. revenge match? 😤']]
    ];

    let deck = [], idx = 0, answers = [], combo = 0, bestCombo = 0, busy = false;

    /* ---------- stats ---------- */
    const today = () => new Date().toISOString().slice(0, 10);
    function stats() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
    function saveStats(score) {
        const s = stats(), t = today();
        const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
        s.days = s.last === t ? (s.days || 1) : s.last === y ? (s.days || 0) + 1 : 1;
        s.last = t; s.games = (s.games || 0) + 1;
        const newBest = score > (s.best || 0);
        if (newBest) s.best = score;
        s.combo = Math.max(s.combo || 0, bestCombo);
        try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
        return { s, newBest };
    }
    function showStats() {
        const s = stats();
        $('stBest').textContent = s.best != null ? s.best + '/15' : '-';
        $('stDays').textContent = s.days || 0;
        $('stGames').textContent = s.games || 0;
    }

    /* ---------- flow ---------- */
    function screen(id) { ['shStart', 'shLoad', 'shPlay', 'shRes'].forEach(s => $(s).classList.toggle('on', s === id)); }
    const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

    async function start() {
        screen('shLoad');
        const lines = ['Fifi is writing your hooks…', 'mixing good ones with sneaky bad ones 😈', 'almost there…'];
        let li = 0; const lt = setInterval(() => { $('shLoadTxt').textContent = lines[++li % lines.length]; }, 1400);
        let hooks = null;
        try {
            const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 20000);
            const r = await fetch('/api/hooks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}', signal: ctl.signal });
            clearTimeout(to);
            if (r.ok) { const d = await r.json(); if (d.hooks && d.hooks.length >= 10) hooks = d.hooks; }
            else console.warn('[Swipe AI]', r.status, await r.text().catch(() => ''));
        } catch (e) { console.warn('[Swipe AI]', e); }
        clearInterval(lt);
        if (!hooks) hooks = shuffle(BANK.slice()).slice(0, ROUND).map(([text, good, why]) => ({ text, good, why }));
        deck = hooks.slice(0, ROUND); idx = 0; answers = []; combo = 0; bestCombo = 0;
        screen('shPlay');
        render();
    }

    function cardEl(h, back) {
        const c = document.createElement('div');
        c.className = 'sh-card' + (back ? ' back' : '');
        c.innerHTML = `<div class="sh-stamp yes">STOP ❤</div><div class="sh-stamp no">SCROLL ✕</div><div class="q">Would this stop your scroll?</div><p></p>`;
        c.querySelector('p').textContent = h.text;
        return c;
    }
    function render() {
        const dk = $('shDeck'); dk.innerHTML = '';
        if (deck[idx + 1]) dk.appendChild(cardEl(deck[idx + 1], true));
        const top = cardEl(deck[idx], false); dk.appendChild(top);
        $('shCount').textContent = `${idx + 1} / ${deck.length}`;
        $('shBar').style.width = (idx / deck.length * 100) + '%';
        $('shCombo').textContent = '🔥 ' + combo;
        drag(top);
    }

    function decide(yes) {
        if (busy || !deck[idx]) return; busy = true;
        const h = deck[idx], ok = yes === h.good;
        answers.push({ h, yes, ok });
        if (ok) { combo++; bestCombo = Math.max(bestCombo, combo); } else combo = 0;
        window.FRHaptic && window.FRHaptic(ok ? 10 : 18);
        const top = $('shDeck').lastElementChild;
        top.style.transition = 'transform .35s ease, opacity .35s ease';
        top.style.transform = `translateX(${(yes ? 1 : -1) * Math.max(innerWidth, 600)}px) rotate(${yes ? 22 : -22}deg)`;
        top.style.opacity = '0';
        top.querySelector(yes ? '.yes' : '.no').style.opacity = 1;
        setTimeout(() => { idx++; busy = false; idx >= deck.length ? results() : render(); }, 280);
    }

    function drag(card) {
        let x0 = 0, y0 = 0, dx = 0, dy = 0, on = false;
        const yes = card.querySelector('.yes'), no = card.querySelector('.no');
        card.addEventListener('pointerdown', e => { on = true; x0 = e.clientX; y0 = e.clientY; dx = dy = 0; card.setPointerCapture(e.pointerId); card.style.transition = 'none'; });
        card.addEventListener('pointermove', e => {
            if (!on) return;
            dx = e.clientX - x0; dy = e.clientY - y0;
            card.style.transform = `translate(${dx}px, ${dy * .3}px) rotate(${dx / 18}deg)`;
            yes.style.opacity = Math.max(0, Math.min(1, dx / 90));
            no.style.opacity = Math.max(0, Math.min(1, -dx / 90));
        });
        const end = () => {
            if (!on) return; on = false;
            if (Math.abs(dx) > 90) decide(dx > 0);
            else { card.style.transition = 'transform .3s ease'; card.style.transform = ''; yes.style.opacity = no.style.opacity = 0; }
        };
        card.addEventListener('pointerup', end); card.addEventListener('pointercancel', end);
    }

    /* ---------- results ---------- */
    function results() {
        const score = answers.filter(a => a.ok).length;
        const { s, newBest } = saveStats(score);
        const rank = RANKS.find(r => score >= r[0]);
        $('rScore').textContent = `${score}/${deck.length}`;
        $('rRank').textContent = rank[1];
        const spotted = answers.filter(a => a.ok && !a.h.good).length, bad = answers.filter(a => !a.h.good).length;
        $('rMeta').textContent = `Best combo 🔥 ${bestCombo} · Caught ${spotted}/${bad} bad hooks · ${s.days} day streak${newBest ? ' · NEW BEST 🏆' : ''}`;
        let line = rank[2][Math.floor(Math.random() * rank[2].length)];
        if (bestCombo >= 8) line += ` also a ${bestCombo}-card combo?? cooking 🔥`;
        else if (bad && spotted / bad < .5) line += ' tip: the bad ones love vague hype and humble-brags 👀';
        $('rFifi').textContent = line;
        const list = $('rList'); list.innerHTML = '';
        answers.forEach(a => {
            const it = document.createElement('div'); it.className = 'sh-item' + (a.ok ? '' : ' wrong');
            it.innerHTML = `<span class="ic">${a.ok ? '✅' : '❌'}</span><div><p></p><small></small></div>`;
            it.querySelector('p').textContent = a.h.text;
            it.querySelector('small').innerHTML = `<b>${a.h.good ? 'Good hook' : 'Bad hook'}</b> · you said ${a.yes ? 'stop ❤' : 'scroll ✕'} · `;
            it.querySelector('small').appendChild(document.createTextNode(a.h.why || ''));
            list.appendChild(it);
        });
        lastResult = { score, total: deck.length, rank: rank[1], combo: bestCombo };
        screen('shRes');
        window.scrollTo({ top: $('shRes').getBoundingClientRect().top + scrollY - 100, behavior: 'smooth' });
        showStats();
    }

    /* ---------- share card ---------- */
    let lastResult = null;
    async function share() {
        if (!lastResult) return;
        try { await document.fonts.ready; } catch (e) {}
        const W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
        const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#020617'); bg.addColorStop(1, '#1E1B4B'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
        [[180, 220, '#2563EB'], [900, 420, '#7C3AED'], [540, 1150, '#DB2777']].forEach(([x, y, c]) => { const rg = g.createRadialGradient(x, y, 0, x, y, 420); rg.addColorStop(0, c + '55'); rg.addColorStop(1, c + '00'); g.fillStyle = rg; g.fillRect(0, 0, W, H); });
        g.textAlign = 'center';
        g.fillStyle = '#C4B5FD'; g.font = '700 40px "DM Sans", sans-serif'; g.fillText('🃏 SWIPE THE HOOK', W / 2, 190);
        const tg = g.createLinearGradient(240, 0, 840, 0); tg.addColorStop(0, '#2563EB'); tg.addColorStop(.5, '#7C3AED'); tg.addColorStop(1, '#DB2777');
        g.fillStyle = tg; g.font = '800 300px Syne, sans-serif'; g.fillText(lastResult.score, W / 2, 590);
        g.fillStyle = '#94A3B8'; g.font = '700 60px Syne, sans-serif'; g.fillText(`out of ${lastResult.total}`, W / 2, 680);
        g.fillStyle = '#fff'; g.font = '800 74px Syne, sans-serif'; g.fillText(lastResult.rank, W / 2, 840);
        g.fillStyle = '#CBD5E1'; g.font = '600 44px "DM Sans", sans-serif'; g.fillText(`best combo 🔥 ${lastResult.combo}`, W / 2, 930);
        g.fillStyle = '#fff'; g.font = '700 46px "DM Sans", sans-serif'; g.fillText('Can you beat me?', W / 2, 1110);
        g.fillStyle = '#93C5FD'; g.font = '700 42px "DM Sans", sans-serif'; g.fillText('fardinraafi.com/projects/swipe-the-hook', W / 2, 1185);
        const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
        const file = new File([blob], 'swipe-the-hook-score.png', { type: 'image/png' });
        const text = `I scored ${lastResult.score}/${lastResult.total} on Swipe the Hook (${lastResult.rank}). Can you beat me? https://fardinraafi.com/projects/swipe-the-hook`;
        if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], text }); return; } catch (e) { if (e.name === 'AbortError') return; } }
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        toast('Score card downloaded 📸');
    }
    function toast(m) { const t = $('hlToast'); t.textContent = m; t.classList.add('in'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('in'), 1800); }

    $('shGo').addEventListener('click', start);
    $('rAgain').addEventListener('click', start);
    $('rShare').addEventListener('click', share);
    $('shYes').addEventListener('click', () => decide(true));
    $('shNo').addEventListener('click', () => decide(false));
    document.addEventListener('keydown', e => {
        if (!$('shPlay').classList.contains('on') || /input|textarea/i.test(document.activeElement.tagName)) return;
        if (e.key === 'ArrowRight') decide(true);
        if (e.key === 'ArrowLeft') decide(false);
    });
    showStats();
})();
