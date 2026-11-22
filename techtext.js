/* =========================================================
   TECH-TEXT TITLE EFFECT (shared)
   Canvas letters with type-in intro, scanner sweep, hover outlines and draggable letters.
   Usage: createTechText(wrapEl, containerEl, 'Text', () => 'center'|'left', introDelaySeconds)
   The wrap gets the class "tt-on", which hides the real <h1> visually (kept for SEO).
========================================================= */
function createTechText(wrap, container, TEXT, ALIGN, INTRO_DELAY) {
    if (!wrap || !container) return;
    const canvas = container.querySelector('canvas');
    const ctx = canvas && canvas.getContext('2d');
    const layer = document.createElement('canvas');      // letters are drawn here, then coloured with the gradient
    const lctx = layer.getContext('2d');
    const scratch = document.createElement('canvas');     // used for measuring text
    const sctx = scratch.getContext('2d');
    if (!ctx || !lctx || !sctx) return;                   // no canvas support: the normal <h1> stays visible
    wrap.classList.add('tt-on');

    const LABEL_FONT = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    const SPRING = 320;
    const S = {
        text: TEXT, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: -0.03,
        sideMargin: 24, dashLength: 4, dashGap: 2, strokeWidth: 1.5, specks: 15,
        bounce: 0.4, speed: 1, introDuration: 1.6, gradientSeconds: 5
    };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const approach = (c, t, dt, sec) => c + (t - c) * (1 - Math.exp(-dt / sec));
    const clamp01 = v => Math.min(1, Math.max(0, Number(v) || 0));
    const smoothstep = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
    const noise = (...vals) => {
        let h = 2166136261;
        for (const v of vals) { h = Math.imul(h ^ (v | 0), 16777619); h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15; }
        return (h >>> 0) / 4294967296;
    };
    const signed = v => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0');

    let width = 1, height = 1, dpr = 1, raf = 0, last = performance.now(), visible = true, sizeDirty = true;
    let layoutKey = '', word = null, glyphs = [], clock = 0, pulse = 0, placed = false, dragging = -1, cursor = '';
    let introClock = 0, introducing = !reduced, fontsReady = !document.fonts, fontSize = 64, gradClock = 0;
    const pointer = { x: 0, y: 0, inside: false }, grab = { x: 0, y: 0 }, lens = { x: 0, y: 0 };
    const frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

    const fontFor = size => `${S.fontWeight} ${size}px ${S.fontFamily}`;
    const setFont = (t, size) => {
        t.font = fontFor(size);
        if ('letterSpacing' in t) t.letterSpacing = `${S.letterSpacing * size}px`;
        t.textAlign = 'left'; t.textBaseline = 'alphabetic';
    };
    const isDark = () => document.body.classList.contains('dark-mode');
    const accent = () => (isDark() ? '#A78BFA' : '#7C3AED');

    // One small pre-rendered image per letter: solid fill, or dashed outline
    const sprite = (view, g, stroke) => {
        const pad = Math.ceil(S.strokeWidth * 2 + 4);
        const left = g.box.x1 - pad, top = g.box.y1 - pad;
        const w = g.box.x2 - g.box.x1 + pad * 2, h = g.box.y2 - g.box.y1 + pad * 2;
        const image = document.createElement('canvas');
        image.width = Math.max(1, Math.ceil(w * dpr)); image.height = Math.max(1, Math.ceil(h * dpr));
        const c = image.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
        setFont(c, view.size);
        if (stroke) {
            c.lineJoin = 'round'; c.lineWidth = S.strokeWidth * 2; c.strokeStyle = '#fff';
            c.setLineDash([S.dashLength, S.dashGap]);
            c.strokeText(g.char, g.x, view.baseline);
            c.setLineDash([]);
            c.globalCompositeOperation = 'destination-out';
            c.fillText(g.char, g.x, view.baseline);
        } else {
            c.fillStyle = '#fff';
            c.fillText(g.char, g.x, view.baseline);
        }
        return { image, left, top };
    };

    const ensureLayout = () => {
        const key = [fontSize, width, height, dpr, fontsReady, ALIGN()].join('|');
        if (key === layoutKey && word) return word;
        layoutKey = key;
        setFont(sctx, fontSize);
        let m = sctx.measureText(S.text);
        const avail = width - S.sideMargin * 2;
        const fit = Math.min(1, avail / Math.max(m.actualBoundingBoxLeft + m.actualBoundingBoxRight, 1),
            (height * 0.66) / Math.max(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent, 1));
        const size = fontSize * fit;
        setFont(sctx, size);
        m = sctx.measureText(S.text);
        const inkW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
        const x = (ALIGN() === 'center' ? (width - inkW) / 2 : S.sideMargin) + m.actualBoundingBoxLeft;
        const inkH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        const baseline = (height - inkH) / 2 + m.actualBoundingBoxAscent;
        word = { size, baseline, left: x - m.actualBoundingBoxLeft, right: x + m.actualBoundingBoxRight,
                 top: baseline - m.actualBoundingBoxAscent, bottom: baseline + m.actualBoundingBoxDescent };

        const prev = glyphs; glyphs = [];
        let prefix = '';
        Array.from(S.text).forEach((char, i) => {
            prefix += char;
            const own = sctx.measureText(char);
            const gx = x + sctx.measureText(prefix).width - own.width;
            if (!char.trim()) return;
            const base = { char, x: gx, box: { x1: gx - own.actualBoundingBoxLeft, y1: baseline - own.actualBoundingBoxAscent,
                                               x2: gx + own.actualBoundingBoxRight, y2: baseline + own.actualBoundingBoxDescent } };
            const kept = prev[glyphs.length];
            const same = kept && kept.index === i;
            glyphs.push({ ...base, index: i,
                offset: same ? kept.offset : { x: 0, y: 0 }, velocity: same ? kept.velocity : { x: 0, y: 0 },
                outline: same ? kept.outline : 0, shown: same ? kept.shown : (introducing ? 0 : 1),
                fill: sprite(word, base, false), dashes: sprite(word, base, true) });
        });
        if (dragging >= glyphs.length) dragging = -1;
        return word;
    };

    const glyphAt = (x, y) => {
        if (!word || y < word.top - 24 || y > word.bottom + 24) return -1;
        let best = -1, bestD = Infinity;
        glyphs.forEach((g, i) => {
            const x1 = g.box.x1 + g.offset.x, x2 = g.box.x2 + g.offset.x;
            const d = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
            if (d < bestD) { bestD = d; best = i; }
        });
        return bestD < 28 ? best : -1;
    };

    const blit = (t, art, dx, dy) => t.drawImage(art.image, Math.round((art.left + dx) * dpr), Math.round((art.top + dy) * dpr));
    const crisp = v => (Math.round(v * dpr) + 0.5) / dpr;

    const perimeterPoint = (dist, w, h) => {
        const p = 2 * (w + h);
        let d = ((dist % p) + p) % p;
        if (d < w) return [frame.x1 + d, frame.y1, 0, -1]; d -= w;
        if (d < h) return [frame.x2, frame.y1 + d, 1, 0]; d -= h;
        if (d < w) return [frame.x2 - d, frame.y2, 0, 1]; d -= w;
        return [frame.x1, frame.y2 - d, -1, 0];
    };

    const drawSpecks = (a, col) => {
        const w = frame.x2 - frame.x1, h = frame.y2 - frame.y1;
        if (w < 2 || h < 2) return;
        const perim = 2 * (w + h), seed = frame.index + 1, grid = 3;
        ctx.fillStyle = col; ctx.strokeStyle = col;
        for (let k = 0; k < S.specks; k++) {
            const period = 0.5 + noise(seed, k, 11) * 1.2;
            const t = pulse / period + noise(seed, k, 17), cycle = Math.floor(t), life = t - cycle;
            if (life > 0.7) continue;
            const [px, py, nx, ny] = perimeterPoint(noise(seed, k, cycle) * perim, w, h);
            const pick = noise(seed, k, cycle, 2);
            const size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
            const large = size >= 8;
            const out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
            const x = frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid;
            const y = frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid;
            const tone = noise(seed, k, cycle, 3);
            const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
            ctx.globalAlpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
            const l = Math.round(x - size / 2), tp = Math.round(y - size / 2);
            if (tone < 0.26 || (large && tone < 0.78)) {
                ctx.strokeRect(l + 0.5, tp + 0.5, size, size);
                if (large && tone > 0.5) ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
            } else ctx.fillRect(l, tp, size, size);
        }
        for (let j = 0; j < 2; j++) {
            const head = (pulse * 0.42 * S.speed + j * 0.5) * perim;
            for (let i = 0; i < 4; i++) {
                const [x, y] = perimeterPoint(head - i * 6, w, h);
                const size = i === 0 ? 3 : 2;
                ctx.globalAlpha = a * [0.95, 0.55, 0.32, 0.16][i];
                ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
            }
        }
        ctx.globalAlpha = 1;
    };

    const drawFrame = col => {
        const g = glyphs[frame.index];
        if (!g || frame.alpha < 0.01) return;
        const a = frame.alpha;
        const x1 = crisp(frame.x1), y1 = crisp(frame.y1), x2 = crisp(frame.x2), y2 = crisp(frame.y2);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 1;
        const moved = Math.hypot(g.offset.x, g.offset.y);
        if (moved > 1) {   // dashed tether back to where the letter belongs
            const hx = (g.box.x1 + g.box.x2) / 2, hy = (g.box.y1 + g.box.y2) / 2;
            ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + g.offset.x, hy + g.offset.y);
            ctx.setLineDash([3, 4]); ctx.globalAlpha = 0.45 * a; ctx.stroke(); ctx.setLineDash([]);
            ctx.globalAlpha = 0.7 * a; ctx.fillRect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4);
        }
        ctx.beginPath(); ctx.rect(x1, y1, x2 - x1, y2 - y1); ctx.globalAlpha = 0.5 * a; ctx.stroke();
        ctx.beginPath();
        for (const [cx, cy] of [[x1, y1], [x2, y1], [x2, y2], [x1, y2]]) ctx.rect(Math.round(cx) - 2, Math.round(cy) - 2, 5, 5);
        ctx.globalAlpha = 0.95 * a; ctx.fill();
        drawSpecks(a, col);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.font = LABEL_FONT; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; ctx.fillStyle = col; ctx.globalAlpha = 0.7 * a;
        const label = moved > 1
            ? `${signed(Math.round(g.offset.x))}, ${signed(Math.round(-g.offset.y))}`
            : `${g.char}  ${Math.round(g.box.x2 - g.box.x1)} × ${Math.round(g.box.y2 - g.box.y1)}`;
        ctx.fillText(label, Math.round(frame.x1), Math.round(frame.y1) - 7);
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    // The brand gradient, sliding back and forth like .gradient-text in style.css
    const paintGradient = view => {
        const W = Math.max(1, (view.right - view.left) * dpr);
        const t = reduced ? 0 : (0.5 - 0.5 * Math.cos((gradClock / S.gradientSeconds) * Math.PI));
        const x0 = view.left * dpr - W * t;
        const g = lctx.createLinearGradient(x0, view.top * dpr, x0 + 2 * W, view.bottom * dpr);
        g.addColorStop(0, '#2563EB'); g.addColorStop(0.5, '#7C3AED'); g.addColorStop(1, '#DB2777');
        lctx.globalCompositeOperation = 'source-in';
        lctx.globalAlpha = 1;
        lctx.fillStyle = g;
        lctx.fillRect(0, 0, layer.width, layer.height);
        lctx.globalCompositeOperation = 'source-over';
    };

    const tick = now => {
        raf = 0;
        if (sizeDirty) {
            sizeDirty = false;
            width = Math.max(1, container.clientWidth); height = Math.max(1, container.clientHeight);
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            fontSize = parseFloat(getComputedStyle(container).fontSize) || 64;
            const pw = Math.round(width * dpr), ph = Math.round(height * dpr);
            if (canvas.width !== pw) { canvas.width = pw; layer.width = pw; }
            if (canvas.height !== ph) { canvas.height = ph; layer.height = ph; }
        }
        const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
        last = now;
        const view = ensureLayout();
        const damping = 2 * Math.sqrt(SPRING) * (1 - clamp01(S.bounce) * 0.96);

        // Intro: letters type in one by one
        if (introducing && fontsReady) introClock += dt;
        const progress = introducing ? clamp01((introClock - INTRO_DELAY) / S.introDuration) : 1;
        if (introducing && progress >= 1) introducing = false;

        const sweeping = !introducing && !reduced && !pointer.inside && dragging < 0;
        if (sweeping) clock += dt * S.speed;
        pulse += dt; gradClock += dt;
        let tx = pointer.x, ty = pointer.y;
        if (sweeping) {   // the idle "scanner"
            tx = view.left + (view.right - view.left) * (0.5 - 0.5 * Math.cos(clock * 0.45));
            ty = view.top + (view.bottom - view.top) * (0.45 + 0.1 * Math.sin(clock * 0.8));
        }
        const active = !introducing && (pointer.inside || sweeping || dragging >= 0);
        if (active && !placed) { lens.x = tx; lens.y = ty; }
        if (active) { const lag = pointer.inside ? 0.05 : 0.22; lens.x = approach(lens.x, tx, dt, lag); lens.y = approach(lens.y, ty, dt, lag); }
        placed = active;

        // Spring physics for dragged letters
        glyphs.forEach((g, i) => {
            if (i === dragging) {
                g.offset.x = approach(g.offset.x, pointer.x - grab.x, dt, 0.03);
                g.offset.y = approach(g.offset.y, pointer.y - grab.y, dt, 0.03);
                g.velocity.x = g.velocity.y = 0;
                return;
            }
            const { offset: o, velocity: v } = g;
            if (Math.abs(o.x) < 0.05 && Math.abs(o.y) < 0.05 && Math.hypot(v.x, v.y) < 0.5) { o.x = o.y = v.x = v.y = 0; return; }
            v.x += (-SPRING * o.x - damping * v.x) * dt; v.y += (-SPRING * o.y - damping * v.y) * dt;
            o.x += v.x * dt; o.y += v.y * dt;
        });

        let typing = -1;
        if (introducing) {
            const step = 0.86 / glyphs.length;
            const at = Math.min(glyphs.length - 1, Math.floor(progress / step));
            typing = progress < 0.93 ? at : -1;
            glyphs.forEach((g, i) => { g.shown = i < at ? 1 : i === at ? smoothstep(0, step * 0.3, progress - i * step) : 0; });
        } else glyphs.forEach(g => { g.shown = 1; });

        const focus = introducing ? typing : dragging >= 0 ? dragging : active ? glyphAt(lens.x, lens.y) : -1;
        if (focus >= 0) {
            const g = glyphs[focus];
            const bx1 = g.box.x1 + g.offset.x - 6, by1 = g.box.y1 + g.offset.y - 6, bx2 = g.box.x2 + g.offset.x + 6, by2 = g.box.y2 + g.offset.y + 6;
            if (frame.index < 0 || frame.alpha < 0.02) { frame.x1 = bx1; frame.y1 = by1; frame.x2 = bx2; frame.y2 = by2; }
            const glide = focus === dragging ? 0.02 : 0.08;
            frame.x1 = approach(frame.x1, bx1, dt, glide); frame.y1 = approach(frame.y1, by1, dt, glide);
            frame.x2 = approach(frame.x2, bx2, dt, glide); frame.y2 = approach(frame.y2, by2, dt, glide);
            frame.index = focus;
        }
        frame.alpha = approach(frame.alpha, focus >= 0 ? 1 : 0, dt, 0.1);

        glyphs.forEach((g, i) => {
            const target = introducing ? (i === typing || (typing >= 0 && i > typing) ? 1 : 0) : (i === focus && i !== dragging ? 1 : 0);
            if (introducing && g.shown === 0) g.outline = target;
            g.outline = approach(g.outline, target, dt, 0.09);
            if (Math.abs(g.outline - target) < 0.002) g.outline = target;
        });

        const hovering = !introducing && focus >= 0 && pointer.inside;
        const next = dragging >= 0 ? 'grabbing' : hovering ? 'grab' : '';
        if (next !== cursor) { cursor = next; container.style.cursor = next; }

        // 1) letters onto the layer (white), 2) colour them with the gradient, 3) copy to screen
        lctx.setTransform(1, 0, 0, 1, 0, 0);
        lctx.clearRect(0, 0, layer.width, layer.height);
        for (const g of glyphs) {
            const moved = Math.hypot(g.offset.x, g.offset.y);
            if (moved > 1) { lctx.globalAlpha = Math.min(1, moved / 24) * 0.55; blit(lctx, g.dashes, 0, 0); }
        }
        for (const g of glyphs) {
            if (g.shown < 0.001) continue;
            if (g.outline < 0.999) { lctx.globalAlpha = (1 - g.outline) * g.shown; blit(lctx, g.fill, g.offset.x, g.offset.y); }
            if (g.outline > 0.001) { lctx.globalAlpha = g.outline * g.shown; blit(lctx, g.dashes, g.offset.x, g.offset.y); }
        }
        lctx.globalAlpha = 1;
        paintGradient(view);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(layer, 0, 0);
        drawFrame(accent());

        if (visible) raf = requestAnimationFrame(tick);   // keeps running for the moving gradient
    };

    const wake = () => { if (raf || !visible) return; last = performance.now(); raf = requestAnimationFrame(tick); };
    const resize = () => { sizeDirty = true; layoutKey = ''; wake(); };
    const locate = e => { const r = container.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; };

    container.addEventListener('pointermove', e => { locate(e); pointer.inside = true; wake(); }, { passive: true });
    container.addEventListener('pointerenter', e => { locate(e); pointer.inside = true; wake(); }, { passive: true });
    container.addEventListener('pointerleave', () => { if (dragging < 0) pointer.inside = false; }, { passive: true });
    container.addEventListener('pointerdown', e => {
        locate(e); pointer.inside = true;
        if (introducing || (e.pointerType === 'mouse' && e.button !== 0)) return;
        const index = glyphAt(pointer.x, pointer.y);
        if (index >= 0) {
            dragging = index;
            grab.x = pointer.x - glyphs[index].offset.x; grab.y = pointer.y - glyphs[index].offset.y;
            container.setPointerCapture && container.setPointerCapture(e.pointerId);
        }
        wake();
    });
    const release = e => {
        if (dragging < 0) return;
        dragging = -1;
        try { container.releasePointerCapture(e.pointerId); } catch (err) {}
        const r = container.getBoundingClientRect();
        pointer.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (e.pointerType !== 'mouse') pointer.inside = false;
    };
    container.addEventListener('pointerup', release);
    container.addEventListener('pointercancel', release);

    new ResizeObserver(resize).observe(container);
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; wake(); }).observe(container);
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; wake(); });
    if (document.fonts) {
        document.fonts.load(fontFor(64), S.text).finally(() => document.fonts.ready.then(() => { fontsReady = true; resize(); }));
    }
    resize();
}
window.createTechText = createTechText;
