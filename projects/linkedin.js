/* LinkedIn Archive: renders /projects/linkedin-data.json (sanitized export) with search, filters and backup export. */
(() => {
    const $ = (s, r = document) => r.querySelector(s);
    const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const MON = 'JanFebMarAprMayJunJulAugSepOctNovDec';
    const ym = s => { const m = /([A-Za-z]{3}) (\d{4})/.exec(s || ''); if (m) return +m[2] * 12 + MON.indexOf(m[1]) / 3; const y = /(\d{4})/.exec(s || ''); return y ? +y[1] * 12 : 0; };
    const now = (() => { const d = new Date(); return d.getFullYear() * 12 + d.getMonth(); })();
    const dur = (a, b) => {
        const s = ym(a), e = b ? ym(b) : now; if (!s) return '';
        const n = Math.max(1, Math.round(e - s) + 1), y = Math.floor(n / 12), m = n % 12;
        return [y ? y + ' yr' + (y > 1 ? 's' : '') : '', m ? m + ' mo' + (m > 1 ? 's' : '') : ''].filter(Boolean).join(' ');
    };
    const range = (a, b) => a ? `${a} - ${b || 'Present'}` : (b || '');
    const PAL = ['#2563EB', '#7C3AED', '#DB2777', '#0891B2', '#059669', '#D97706', '#4F46E5', '#BE185D'];
    const col = s => PAL[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % PAL.length];
    const ini = s => s.replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '•';
    const CAUSE = { environment: '🌱', health: '🩺', socialServices: '🤝', children: '🧒', education: '📚' };
    let D, q = '';

    /* ---------- search helpers ---------- */
    const hl = (t) => {
        const s = esc(t); if (!q) return s;
        const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        return s.replace(re, '<mark class="li-mark">$1</mark>');
    };
    const has = (...xs) => !q || xs.some(x => String(x || '').toLowerCase().includes(q));
    const moreBtn = (id) => `<button class="li-more" data-more="${id}">…see more</button>`;
    const longText = (t, id) => {
        const s = hl(t); if (!t) return '';
        return t.length > 260 && !q ? `<p class="li-p clamp" id="${id}">${s}</p>${moreBtn(id)}` : `<p class="li-p">${s}</p>`;
    };

    /* ---------- sections ---------- */
    const SECTIONS = [
        ['about', 'About'], ['experience', 'Experience'], ['education', 'Education'], ['honors', 'Honors'], ['projects', 'Projects'],
        ['volunteering', 'Volunteering'], ['certifications', 'Certifications'], ['skills', 'Skills'], ['recommendations', 'Recommendations'],
        ['activity', 'Activity'], ['articles', 'Articles']
    ];
    const sec = (id, title, count, body, extra = '') => body
        ? `<section class="li-card li-sec" id="s-${id}"><div class="li-sec-h"><h2>${title}${count != null ? ` <small>${count}</small>` : ''}</h2>${extra}</div>${body}</section>`
        : (q ? '' : `<section class="li-card li-sec" id="s-${id}"><div class="li-sec-h"><h2>${title}</h2></div><p class="li-empty">Nothing here yet.</p></section>`);

    function about() {
        const p = D.profile; if (!has(p.summary, p.headline)) return '';
        return sec('about', 'About', null, longText(p.summary, 'ab'));
    }
    function experience() {
        const groups = []; const map = {};
        D.positions.filter(x => has(x.company, x.title, x.desc, x.location)).forEach(x => {
            if (!map[x.company]) { map[x.company] = { company: x.company, roles: [] }; groups.push(map[x.company]); }
            map[x.company].roles.push(x);
        });
        const body = groups.map((g, gi) => {
            const first = g.roles[g.roles.length - 1], last = g.roles[0];
            const multi = g.roles.length > 1;
            return `<div class="li-co"><div class="li-logo" style="background:${col(g.company)}">${ini(g.company)}</div><div>
                <h3>${hl(multi ? g.company : last.title)}</h3>
                <div class="li-sub">${multi ? `${g.roles.length} roles · ${dur(first.start, last.end)}` : `${hl(g.company)} · ${range(last.start, last.end)} · ${dur(last.start, last.end)}${last.end ? '' : '<span class="li-now">Current</span>'}`}</div>
                ${multi ? '' : (last.location ? `<div class="li-sub">${hl(last.location)}</div>` : '')}
                <div class="li-roles${multi ? ' multi' : ''}">${g.roles.map((r, ri) => `<div class="li-role">
                    ${multi ? `<h4>${hl(r.title)}${r.end ? '' : '<span class="li-now">Current</span>'}</h4><div class="li-sub">${range(r.start, r.end)} · ${dur(r.start, r.end)}${r.location ? ' · ' + hl(r.location) : ''}</div>` : ''}
                    ${longText(r.desc, `ex${gi}_${ri}`)}</div>`).join('')}</div></div></div>`;
        }).join('');
        return sec('experience', 'Experience', D.positions.length, body);
    }
    const items = (id, title, list, icon, head, sub, text, tags) => {
        const L = list.filter(x => has(head(x), sub(x), text(x)));
        return sec(id, title, list.length, L.map((x, i) => `<div class="li-item"><div class="li-ic">${icon(x)}</div><div>
            <h3 class="li-name" style="font:800 1rem 'DM Sans',sans-serif;margin:0 0 2px">${hl(head(x))}</h3><div class="li-sub">${hl(sub(x))}</div>
            ${tags ? tags(x) : ''}${text(x) ? `<div style="margin-top:.45rem">${longText(text(x), id + i)}</div>` : ''}</div></div>`).join(''));
    };
    function certifications() {
        const issuers = {}; D.certifications.forEach(c => issuers[c.issuer] = (issuers[c.issuer] || 0) + 1);
        const top = Object.entries(issuers).sort((a, b) => b[1] - a[1]).slice(0, 8);
        const L = D.certifications.filter(c => has(c.name, c.issuer) && (!certFilter || c.issuer === certFilter));
        const chips = `<div class="li-filters"><button class="li-chip${certFilter ? '' : ' on'}" data-cf="">All ${D.certifications.length}</button>${top.map(([n, k]) => `<button class="li-chip${certFilter === n ? ' on' : ''}" data-cf="${esc(n)}">${esc(n.length > 26 ? n.slice(0, 24) + '…' : n)} ${k}</button>`).join('')}</div>`;
        const body = L.map(c => `<article class="li-cert">
            <button class="li-cert-img" ${c.img ? `style="background-image:url(/certs/thumb/cert-${c.img}.webp)" data-full="/certs/cert-${c.img}.webp" data-cap="${esc(c.name)}" aria-label="View certificate: ${esc(c.name)}"` : 'disabled aria-hidden="true"'}>${c.img ? '' : '🎓'}</button>
            <div class="li-cert-b"><h4>${hl(c.name)}</h4><div class="li-sub">${hl(c.issuer)}</div><div class="li-sub">Issued ${esc(c.issued || '-')}${c.expires ? ' · Expires ' + esc(c.expires) : ''}</div>
            ${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">Show credential ↗</a>` : ''}</div></article>`).join('');
        return sec('certifications', 'Certifications', D.certifications.length, (L.length || certFilter ? chips : '') + (L.length ? `<div class="li-certs">${body}</div>` : (certFilter ? '<p class="li-empty">No matches.</p>' : '')));
    }
    let certFilter = '';
    function skills() {
        const L = D.skills.filter(s => has(s.name)).sort((a, b) => b.endorsements - a.endorsements);
        return sec('skills', 'Skills', D.skills.length, L.length ? `<div class="li-skills">${L.map(s => `<span class="li-skill${s.endorsements ? ' top' : ''}">${hl(s.name)}${s.endorsements ? `<b>👍 ${s.endorsements}</b>` : ''}</span>`).join('')}</div>` : '');
    }
    function recommendations() {
        const L = D.recommendations.filter(r => has(r.name, r.title, r.company, r.text));
        return sec('recommendations', 'Recommendations', D.recommendations.length, L.length ? `<div class="li-recs">${L.map((r, i) => `<div class="li-rec">
            <div class="li-rec-h"><div class="li-ini" style="background:${col(r.name)}">${ini(r.name)}</div><div><b>${hl(r.name)}</b><span class="li-sub">${hl(r.title)}${r.company ? ' · ' + hl(r.company) : ''}</span></div></div>
            ${longText(r.text, 'rc' + i)}<span class="li-sub">${esc(r.date)}</span></div>`).join('')}</div>` : '');
    }
    let postLimit = 10, postMonth = '', postSort = 'new';
    function activity() {
        let L = D.posts.filter(p => has(p.text) && (!postMonth || p.date.startsWith(postMonth)));
        if (postSort === 'old') L = L.slice().reverse();
        // chart: posts per month
        const months = {}; D.posts.forEach(p => { const k = p.date.slice(0, 7); months[k] = (months[k] || 0) + 1; });
        const keys = Object.keys(months).sort(); const max = Math.max(...Object.values(months));
        const chart = `<div class="li-chart" aria-label="Posts per month">${keys.map(k => `<button class="li-bar-c${postMonth === k ? ' on' : ''}" data-pm="${k}" title="${months[k]} posts in ${k}"><em>${months[k]}</em><i style="height:${Math.round(months[k] / max * 100)}%"></i><span>${MON.substr((+k.slice(5) - 1) * 3, 3)}</span></button>`).join('')}</div>`;
        const shown = L.slice(0, q ? 60 : postLimit);
        const body = `${chart}${postMonth ? `<p class="li-sub" style="margin:-.4rem 0 .8rem">Showing ${L.length} posts from ${postMonth} · <button class="li-more" data-pm="">show all</button></p>` : ''}
            <div class="li-posts">${shown.map((p, i) => `<article class="li-post"><div class="li-post-h"><img src="/misc_img/avatar-320.webp" alt="" width="38" height="38" loading="lazy"><div><b>${esc(D.profile.name)}</b><span class="li-sub">${new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div></div>
                ${longText(p.text, 'po' + i)}
                <div class="li-post-a"><a href="${esc(p.link)}" target="_blank" rel="noopener">View on LinkedIn ↗</a><button data-copy="${i}">Copy text</button>${p.shared ? `<a href="${esc(p.shared)}" target="_blank" rel="noopener">Shared link ↗</a>` : ''}</div></article>`).join('') || '<p class="li-empty">No posts match.</p>'}</div>
            ${L.length > shown.length ? `<button class="li-btn sec li-loadmore" data-loadmore>Show more posts (${L.length - shown.length} left)</button>` : ''}`;
        lastPosts = shown;
        const sort = `<div class="li-sort"><button class="li-chip${postSort === 'new' ? ' on' : ''}" data-ps="new">Newest</button><button class="li-chip${postSort === 'old' ? ' on' : ''}" data-ps="old">Oldest</button></div>`;
        return (q && !L.length) ? '' : sec('activity', 'Activity', D.posts.length, body, sort);
    }
    let lastPosts = [];
    function articles() {
        const L = D.articles.filter(a => has(a.title, a.excerpt)).sort((a, b) => b.date.localeCompare(a.date));
        return sec('articles', 'Articles', D.articles.length, L.length ? `<div class="li-arts">${L.map(a => `<article class="li-art"><span class="li-sub">${esc(a.date)}</span><h4>${hl(a.title)}</h4><p>${hl(a.excerpt)}</p>
            <div class="li-post-a">${a.blog ? `<a href="${a.blog}">Read on my site</a>` : ''}<a href="${esc(a.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a></div></article>`).join('')}</div>` : '');
    }

    function render() {
        const html = [about(), experience(),
            items('education', 'Education', D.education, () => '🎓', x => x.school, x => `${x.degree}${x.start ? ' · ' + range(x.start, x.end) : ''}`, x => x.activities),
            items('honors', 'Honors & awards', D.honors, () => '🏆', x => x.title, x => x.date, x => x.desc),
            items('projects', 'Projects', D.projects, () => '🛠️', x => x.title, x => range(x.start, x.end), x => x.desc),
            items('volunteering', 'Volunteering', D.volunteering, x => CAUSE[x.cause] || '💜', x => x.role + ' · ' + x.org, x => range(x.start, x.end), x => x.desc, x => x.cause ? `<span class="li-tag">${esc(x.cause.replace(/([A-Z])/g, ' $1'))}</span>` : ''),
            certifications(), skills(), recommendations(), activity(), articles()].join('');
        $('#liFeed').innerHTML = html || '<div class="li-card li-sec"><p class="li-empty">Nothing matches “' + esc(q) + '”.</p></div>';
        const hits = q ? $('#liFeed').querySelectorAll('mark').length : 0;
        $('#liHits').classList.toggle('on', !!q);
        $('#liHits').textContent = q ? `${hits} match${hits === 1 ? '' : 'es'} for “${q}”` : '';
        document.querySelectorAll('.li-tab').forEach(t => t.style.display = (!q || document.getElementById('s-' + t.dataset.s)) ? '' : 'none');
    }

    function hero() {
        const p = D.profile;
        $('#liName').innerHTML = `${esc(p.name)} <span class="li-verified">ARCHIVE</span>`;
        $('#liHeadline').textContent = p.headline;
        $('#liMeta').innerHTML = `<span>📍 ${esc(p.location)}</span><span>🏷️ ${esc(p.industry)}</span><a href="${p.website}">fardinraafi.com</a><span>🗓️ Exported ${new Date(D.exported).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>`;
        const stats = [['experience', D.positions.length, 'Roles'], ['certifications', D.certifications.length, 'Certificates'], ['skills', D.skills.length, 'Skills'], ['activity', D.posts.length, 'Posts'], ['recommendations', D.recommendations.length, 'Recs'], ['articles', D.articles.length, 'Articles']];
        $('#liStats').innerHTML = stats.map(([s, n, l]) => `<button class="li-stat" data-go="${s}"><b>${n}</b><span>${l}</span></button>`).join('');
        $('#liTabs').innerHTML = SECTIONS.map(([s, l]) => `<button class="li-tab" data-s="${s}">${l}</button>`).join('');
        const cur = D.positions.filter(x => !x.end);
        $('#liNow').innerHTML = cur.map(x => `<li>${esc(x.title)}<span>${esc(x.company)}</span></li>`).join('');
        const yrs = {}; D.posts.forEach(x => yrs[x.date.slice(0, 4)] = 1);
        const issuers = new Set(D.certifications.map(c => c.issuer)).size;
        $('#liFacts').innerHTML = `<li>Posts in 2026<span>${D.posts.filter(x => x.date.startsWith('2026')).length}</span></li><li>Certificate issuers<span>${issuers}</span></li><li>Organisations<span>${new Set(D.positions.map(x => x.company)).size}</span></li><li>Endorsed skills<span>${D.skills.filter(s => s.endorsements).length}</span></li>`;
    }

    /* ---------- export (backup) ---------- */
    function download(name, text, type) {
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    }
    function toMarkdown() {
        const p = D.profile, L = [];
        L.push(`# ${p.name}\n\n${p.headline}\n\n${p.location} · ${p.website}\n\n## About\n\n${p.summary}`);
        L.push('## Experience\n\n' + D.positions.map(x => `### ${x.title} · ${x.company}\n${range(x.start, x.end)}${x.location ? ' · ' + x.location : ''}\n\n${x.desc}`).join('\n\n'));
        L.push('## Education\n\n' + D.education.map(x => `### ${x.school}\n${x.degree} · ${range(x.start, x.end)}\n\n${x.activities}`).join('\n\n'));
        L.push('## Honors & awards\n\n' + D.honors.map(x => `### ${x.title} (${x.date})\n\n${x.desc}`).join('\n\n'));
        L.push('## Projects\n\n' + D.projects.map(x => `### ${x.title}\n${range(x.start, x.end)}\n\n${x.desc}`).join('\n\n'));
        L.push('## Volunteering\n\n' + D.volunteering.map(x => `### ${x.role} · ${x.org}\n${range(x.start, x.end)}\n\n${x.desc}`).join('\n\n'));
        L.push('## Certifications\n\n' + D.certifications.map(c => `- **${c.name}**, ${c.issuer} (${c.issued})${c.url ? ' ' + c.url : ''}`).join('\n'));
        L.push('## Skills\n\n' + D.skills.map(s => s.name + (s.endorsements ? ` (${s.endorsements})` : '')).join(', '));
        L.push('## Recommendations\n\n' + D.recommendations.map(r => `### ${r.name}, ${r.title}\n${r.date}\n\n> ${r.text}`).join('\n\n'));
        L.push('## Articles\n\n' + D.articles.map(a => `- [${a.title}](${a.linkedin}) (${a.date})`).join('\n'));
        L.push('## Posts\n\n' + D.posts.map(x => `### ${x.date}\n${x.link}\n\n${x.text}`).join('\n\n---\n\n'));
        return L.join('\n\n') + '\n';
    }

    /* ---------- events ---------- */
    function bind() {
        document.addEventListener('click', e => {
            const t = e.target;
            const go = t.closest('[data-go]'), tab = t.closest('.li-tab');
            if (go || tab) { const el = document.getElementById('s-' + (go ? go.dataset.go : tab.dataset.s)); el && el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
            const m = t.closest('[data-more]'); if (m) { const p = document.getElementById(m.dataset.more); p.classList.remove('clamp'); m.remove(); return; }
            const cf = t.closest('[data-cf]'); if (cf) { certFilter = cf.dataset.cf; render(); return; }
            const pm = t.closest('[data-pm]'); if (pm) { postMonth = postMonth === pm.dataset.pm ? '' : pm.dataset.pm; postLimit = 10; render(); return; }
            const ps = t.closest('[data-ps]'); if (ps) { postSort = ps.dataset.ps; render(); return; }
            if (t.closest('[data-loadmore]')) { postLimit += 15; render(); return; }
            const cp = t.closest('[data-copy]'); if (cp) { const x = lastPosts[+cp.dataset.copy]; navigator.clipboard && navigator.clipboard.writeText(x.text).then(() => { cp.textContent = 'Copied ✓'; setTimeout(() => cp.textContent = 'Copy text', 1500); }); return; }
            const im = t.closest('.li-cert-img[data-full]'); if (im) { $('#liLbImg').src = im.dataset.full; $('#liLbCap').textContent = im.dataset.cap; $('#liLb').classList.add('on'); return; }
            if (t.closest('#liLb') && !t.closest('img')) $('#liLb').classList.remove('on');
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') $('#liLb').classList.remove('on');
            if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); $('#liQ').focus(); }
        });
        let tmr; $('#liQ').addEventListener('input', e => { clearTimeout(tmr); tmr = setTimeout(() => { q = e.target.value.trim().toLowerCase(); render(); }, 160); });
        $('#liJson').addEventListener('click', () => download('fardin-linkedin-archive.json', JSON.stringify(D, null, 2), 'application/json'));
        $('#liMd').addEventListener('click', () => download('fardin-linkedin-archive.md', toMarkdown(), 'text/markdown'));
        // scroll-spy for tabs
        const spy = () => {
            let cur = ''; document.querySelectorAll('.li-sec[id^="s-"]').forEach(s => { if (s.getBoundingClientRect().top < 220) cur = s.id.slice(2); });
            document.querySelectorAll('.li-tab').forEach(t => { const on = t.dataset.s === cur; if (on && !t.classList.contains('on')) t.scrollIntoView({ block: 'nearest', inline: 'center' }); t.classList.toggle('on', on); });
        };
        addEventListener('scroll', () => requestAnimationFrame(spy), { passive: true });
        window.FRSwipe && window.FRSwipe($('#liLb'), $('#liLbImg'), { next: () => {}, prev: () => {}, close: () => $('#liLb').classList.remove('on') });
    }

    fetch('/projects/linkedin-data.json').then(r => r.json()).then(d => { D = d; hero(); render(); bind(); })
        .catch(() => { $('#liFeed').innerHTML = '<div class="li-card li-sec"><p class="li-empty">Could not load the archive. Refresh to try again.</p></div>'; });
})();
