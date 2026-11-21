/* =========================================================
   FIFI — Fardin's (fake-but-smart) AI sidekick
   No API. A keyword + fuzzy-match brain with personality.
   Only loaded on the home page.
========================================================= */
(function () {
    'use strict';

    const btn = document.getElementById('openChatBtn');
    const modal = document.getElementById('chatModal');
    if (!btn || !modal) return;

    const area = document.getElementById('chatArea');
    const log = document.getElementById('chatLog');
    const intro = document.getElementById('chatGreeting');
    const starters = document.getElementById('chatOptions');
    const form = document.getElementById('fifiForm');
    const input = document.getElementById('fifiInput');
    const closeBtn = document.getElementById('closeChatBtn');
    const resetBtn = document.getElementById('resetChatBtn');
    const STORE = 'fifi-chat-v2';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- tiny helpers ---------- */
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const L = (href, text) => `<a href="${href}">${text}</a>`;
    const B = (t) => `<strong>${t}</strong>`;
    const EMAIL = 'fardinraafi@gmail.com';

    const ACT = {
        resume:   { label: '📥 Download resume', href: '/Fardin_Resume.pdf', download: 'Fardin_Rahman_Khan_Raafi_Resume.pdf' },
        resumePg: { label: '📄 Resume page', href: '/resume.html' },
        email:    { label: '📋 Copy email', copy: EMAIL },
        contact:  { label: '✉️ Contact page', href: '/contact.html' },
        linkedin: { label: '💼 LinkedIn', href: 'https://www.linkedin.com/in/fardinraafi', ext: true },
        behance:  { label: '🎨 Behance', href: 'https://www.behance.net/fardinraafi', ext: true },
        insta:    { label: '📸 Instagram', href: 'https://www.instagram.com/fardin_raafi', ext: true },
        x:        { label: '𝕏 X / Twitter', href: 'https://x.com/fardin_raafi', ext: true },
        github:   { label: '🐙 GitHub', href: 'https://github.com/fardinraafi', ext: true },
        blog:     { label: '✍️ Read the blog', href: '/blog.html' },
        gallery:  { label: '🖼️ Gallery', href: '/gallery.html' },
        lead:     { label: '🏆 Leadership page', href: '/volunteer.html' },
        certs:    { label: '📜 Certificates', href: '/certificates.html' },
        res:      { label: '🧰 Free resources', href: '/resources.html' },
    };

    /* ---------- the brain ----------
       keys: words/phrases that point to this topic (fuzzy matched)
       a: answer (string or array → random), more: deeper follow-up
       chips: suggested next questions, act: action buttons          */
    const BRAIN = [
        { id: 'hello', keys: ['hi', 'hello', 'hey', 'yo', 'sup', 'wassup', 'hola', 'salam', 'assalamualaikum', 'good morning', 'good evening', 'hii', 'heyy'],
          a: ['yooo 👋 Fifi here, Fardin\'s lil AI sidekick. ask me literally anything about him, i got the lore 📚',
              'heyyy bestie 😎 what do you wanna know about Fardin? work, skills, awards, the tea ☕ — all of it'],
          chips: ['Who is Fardin?', 'What does he do?', 'Biggest wins?'] },

        { id: 'who', keys: ['who is fardin', 'who are you', 'about him', 'about fardin', 'tell me about', 'introduce', 'who is he', 'fardin', 'raafi', 'summary', 'bio', 'background'],
          a: `ok so ${B('Fardin Rahman Khan Raafi')} is a Dhaka-based marketer who is lowkey cooking 🧑‍🍳<br><br>• ${B('Junior Executive, Marketing')} at Augmex Technologies<br>• pulled ${B('340K+ organic views')} in 2026<br>• grew sneaker brand FYGO from ${B('0 → 17K+ followers')}<br>• BBA in Marketing, ${B('CGPA 3.80')}<br>• BASIS Leader of the Year \'24 🏆<br><br>basically B2B growth + content + design in one guy. no cap.`,
          more: `extra lore: he does B2B lead gen for European & Australian markets, designs graphics & motion stuff, hosts a podcast, and posts on LinkedIn like it's his cardio 🏃‍♂️`,
          chips: ['Work experience', 'Skills', 'Awards', 'Fun facts'], act: ['resumePg', 'linkedin'] },

        { id: 'me', keys: ['what are you', 'are you ai', 'are you real', 'chatgpt', 'are you a bot', 'your name', 'who made you', 'fifi'],
          a: ['i\'m Fifi 🤖 — not ChatGPT, not Gemini, just a hand-coded brain Fardin built that knows everything about him. zero API, 100% homemade rizz ✨',
              'real? emotionally yes 💅 technically i\'m a bunch of JavaScript that knows Fardin\'s whole résumé by heart'],
          chips: ['Who is Fardin?', 'Tell me a fun fact'] },

        { id: 'work', keys: ['work', 'job', 'experience', 'career', 'augmex', 'company', 'role', 'position', 'currently', 'what does he do', 'employed', 'working', 'intern', 'internship', 'office'],
          a: `💼 ${B('Augmex Technologies Ltd.')} — the main quest:<br><br>• ${B('Junior Executive, Marketing')} (Apr 2026 → now)<br>• ${B('Intern, Marketing')} (Jan → Apr 2026)<br><br>he runs B2B lead generation, CRM, cold outreach, social content and design across multiple brands. did ALL the posting, writing, carousels and videos for Augmex → ~${B('180K organic reach')} 📈<br><br>before that: marketing intern at ${B('Adviza International')} (2025).`,
          more: `side quest: ${B('FYGO')}, Augmex\'s sneaker sub-brand 👟 — he grew it from 0 to ${B('17K+ followers')}, ${B('৳20 lakh+ sales')} and ${B('300+ customers')} (Jul–Nov 2026). sneakerhead marketing arc fr.`,
          chips: ['Tell me about FYGO', 'B2B stuff', 'Skills'], act: ['resumePg'] },

        { id: 'fygo', keys: ['fygo', 'sneaker', 'sneakers', 'shoes', 'brand growth', 'ecommerce', 'sales', 'followers'],
          a: `👟 ${B('FYGO')} = Augmex\'s sneaker brand and Fardin\'s glow-up project:<br><br>• ${B('0 → 17K+')} followers<br>• ${B('৳20 lakh+')} in sales<br>• ${B('300+')} customers<br>• all in about 5 months (Jul–Nov 2026)<br><br>content, design, captions, the whole thing. absolute W 🔥`,
          chips: ['Content results', 'What tools does he use?'] },

        { id: 'b2b', keys: ['b2b', 'lead', 'leads', 'lead generation', 'crm', 'outreach', 'cold email', 'sales navigator', 'salesforce', 'apollo', 'prospecting', 'europe', 'australia', 'revops', 'pipeline'],
          a: `🎯 B2B is his home turf:<br><br>• lead research & generation for ${B('European + Australian')} markets<br>• enriched ${B('40,000+ CRM records')}<br>• multi-channel cold outreach (email + LinkedIn)<br>• tools: Salesforce, Apollo.io, LinkedIn Sales Navigator, HubSpot<br><br>he finds the right people and gets them talking. sigma prospecting energy 🗿`,
          chips: ['Content results', 'All his tools', 'Contact him'] },

        { id: 'content', keys: ['content', 'views', 'reach', 'social media', 'organic', 'linkedin posts', 'posting', 'viral', 'results', 'numbers', 'stats', '340k', 'impressions', 'engagement'],
          a: `📊 the numbers go crazy:<br><br>• ${B('340K+ organic views')} in 2026<br>• ~${B('180K')} of that for Augmex (brand awareness, Jan–Nov)<br>• the rest from FYGO 👟<br>• ${B('1,200+ designs')} made<br><br>all organic. no ads. just cooking content that people actually stop scrolling for 🛑📱`,
          chips: ['Tell me about FYGO', 'Read his blog', 'Design work'], act: ['linkedin'] },

        { id: 'skills', keys: ['skill', 'skills', 'good at', 'strengths', 'expertise', 'specialize', 'specialized', 'competencies', 'capabilities', 'what can he do', 'talent'],
          a: `🧠 his skill tree:<br><br>• ${B('B2B lead gen & outreach')}<br>• ${B('content marketing')} & social strategy<br>• ${B('brand strategy')} & positioning<br>• ${B('graphic & motion design')}<br>• CRM management<br>• AI-powered workflows 🤖<br><br>marketing brain + designer hands. rare combo ngl.`,
          chips: ['What tools does he use?', 'Design work', 'Work experience'], act: ['resumePg'] },

        { id: 'tools', keys: ['tool', 'tools', 'software', 'stack', 'toolkit', 'apps', 'photoshop', 'illustrator', 'figma', 'canva', 'capcut', 'notion', 'hubspot', 'analytics', 'claude', 'gemini', 'notebooklm', 'perplexity', 'meta business'],
          a: `🧰 the toolkit:<br><br>${B('Design:')} Photoshop, Illustrator, Figma, Canva, CapCut<br>${B('Sales/CRM:')} Salesforce, Apollo.io, Sales Navigator, HubSpot<br>${B('Social & data:')} Meta Business Suite, Google Analytics, Buffer<br>${B('AI:')} Claude, Gemini, NotebookLM, Perplexity<br>${B('Brain dump:')} Notion<br><br>he\'s basically a walking SaaS bundle 💻`,
          chips: ['AI stuff', 'Design work'] },

        { id: 'ai', keys: ['ai', 'artificial intelligence', 'prompt', 'prompting', 'automation', 'llm', 'agents'],
          a: `🤖 Fardin is deep in the AI rabbit hole — uses Claude, Gemini, NotebookLM and Perplexity daily for research, content and workflows. he even made free AI guides + a master prompt pack on the ${L('/resources.html', 'resources page')} 👀`,
          chips: ['Free resources', 'Read his blog'], act: ['res', 'blog'] },

        { id: 'design', keys: ['design', 'designer', 'graphic', 'graphics', 'motion', 'video', 'editing', 'portfolio', 'behance', 'creative', 'branding', 'logo', 'carousel'],
          a: `🎨 yes he designs too:<br><br>• ${B('1,200+ designs')} shipped<br>• social graphics, carousels, motion & video<br>• branding for TEDxUttara (Lead Brand Designer) and a bunch of clubs<br><br>the man said "why hire a designer when i AM the designer" 💅`,
          chips: ['See the gallery', 'Skills'], act: ['behance', 'gallery'] },

        { id: 'edu', keys: ['education', 'study', 'studied', 'university', 'degree', 'bba', 'bubt', 'cgpa', 'gpa', 'graduate', 'college', 'academics', 'academic', 'school', 'masters'],
          a: `🎓 ${B('BBA in Marketing')} from ${B('BUBT')} (Bangladesh University of Business and Technology) with a ${B('CGPA of 3.80')}. smart AND busy? the audacity 😤`,
          more: `he also got into the ${B('Aspire Leaders Program \'26')} (Aspire Institute, founded at Harvard Business School) and snagged a ${B('70% scholarship from ISCEA')} in 2025 🎉`,
          chips: ['Awards', 'Leadership roles'], act: ['certs'] },

        { id: 'awards', keys: ['award', 'awards', 'achievement', 'achievements', 'won', 'win', 'wins', 'honor', 'honors', 'basis', 'harvard', 'aspire', 'iscea', 'scholarship', 'competition', 'prize', 'hult', 'biggest'],
          a: `🏆 trophy cabinet:<br><br>• ${B('BASIS Leader of the Year 2024')}<br>• ${B('Aspire Leaders Program \'26')} (founded at Harvard Business School)<br>• ${B('ISCEA Global Case Competition 2025')} — 70% scholarship<br>• Lead Luminary 4.0 (LEAD Academy)<br>• 3rd place, Ad-Making competition<br>• Executive recognition, Hult Prize BUBT<br><br>main character behaviour fr 👑`,
          chips: ['Leadership roles', 'Certificates'], act: ['certs', 'lead'] },

        { id: 'lead', keys: ['leadership', 'volunteer', 'volunteering', 'club', 'clubs', 'extracurricular', 'extracurriculars', 'rotaract', 'tedx', 'tedxuttara', 'swc', 'social welfare', 'career guidance', 'community', 'leo', 'secretary'],
          a: `🌱 leadership arc:<br><br>• ${B('Head of Corporate & Alumni Relations')} — BUBT Career Guidance Office (2026 → now)<br>• ${B('Secretary')} — Rotaract Club of Dhaka Dynamic<br>• ${B('Media & Publications Secretary')} — BUBT Social Welfare Club<br>• ${B('Lead Brand Designer')} — TEDxUttara<br>• Sub Executive — BUBT Business Club<br><br>he said sleep is optional 😭`,
          chips: ['Awards', 'See the gallery'], act: ['lead', 'gallery'] },

        { id: 'podcast', keys: ['podcast', 'host', 'hosting', 'show', 'interview', 'speaking', 'public speaking'],
          a: `🎙️ yep, he hosts a podcast with Augmex and has interviewed founders on it. also does public speaking + hosts club meetings. the mic likes him 🎤`,
          chips: ['Fun facts', 'Content results'] },

        { id: 'blog', keys: ['blog', 'blogs', 'article', 'articles', 'writing', 'write', 'read', 'case study', 'thoughts', 'insights'],
          a: `✍️ he writes about B2B growth, marketing case studies, branding and AI. think "${B('ChatGPT Ads just crossed $1B')}" type takes. go read, it\'s not boring i promise 📖`,
          chips: ['AI stuff', 'Free resources'], act: ['blog'] },

        { id: 'resources', keys: ['resource', 'resources', 'free', 'playbook', 'guide', 'guidebook', 'framework', 'download', 'template'],
          a: `🎁 free stuff alert: he dropped a ${B('Marketing Playbook')}, a ${B('Human Content Framework')} and a ${B('self-training AI guidebook + master prompt')}. all free on the resources page. W creator behaviour.`,
          chips: ['Read his blog'], act: ['res'] },

        { id: 'resume', keys: ['resume', 'cv', 'curriculum', 'pdf'],
          a: `📄 say less. grab the PDF or peep the interactive version 👇`,
          chips: ['Work experience', 'Contact him'], act: ['resume', 'resumePg'] },

        { id: 'contact', keys: ['contact', 'reach', 'email', 'mail', 'hire', 'hiring', 'connect', 'talk', 'message', 'dm', 'call', 'collab', 'collaborate', 'work together', 'project', 'freelance', 'meet', 'book'],
          a: `📬 slide into his inbox: ${B(EMAIL)}<br><br>or use the contact form — he actually replies (rare W) ⚡`,
          chips: ['Socials', 'Download resume'], act: ['email', 'contact', 'linkedin'] },

        { id: 'social', keys: ['social', 'socials', 'linkedin', 'instagram', 'insta', 'twitter', 'x', 'facebook', 'threads', 'github', 'pinterest', 'discord', 'follow'],
          a: `📱 find him everywhere:<br><br>• LinkedIn → fardinraafi (his main stage)<br>• Instagram / X / Threads / Pinterest → @fardin_raafi<br>• Behance & GitHub → fardinraafi<br>• Discord → equinox.90<br><br>LinkedIn is where the daily posts live 👀`,
          act: ['linkedin', 'insta', 'x', 'behance'] },

        { id: 'location', keys: ['where', 'location', 'based', 'live', 'lives', 'city', 'country', 'bangladesh', 'dhaka', 'timezone', 'time zone', 'remote'],
          a: () => `📍 ${B('Dhaka, Bangladesh')} (GMT+6). it\'s ${B(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: 'numeric', minute: '2-digit' }))} there rn. works with teams in Europe & Australia so timezones don\'t scare him 🌍`,
          chips: ['Contact him'] },

        { id: 'fun', keys: ['fun', 'fact', 'facts', 'hobby', 'hobbies', 'free time', 'personal', 'interests', 'likes', 'game', 'games', 'gaming', 'clash', 'coffee', 'book', 'books', 'music'],
          a: [`🎮 fun fact: he\'s attacking in ${B('Clash of Clans')} when he\'s not cooking campaigns. strategy brain stays on 🧠`,
              `☕ fun fact: Fardin runs on coffee. like 70% coffee, 30% marketing frameworks.`,
              `🎧 fun fact: his podcast comfort food is ${B('My First Million')}, and ${B('Hacking Growth')} lives rent-free on his reading list 📚`,
              `📱 fun fact: he doom-scrolls Instagram "for research". we believe him. (we don\'t) 🤭`],
          chips: ['Another fun fact', 'Who is Fardin?'] },

        { id: 'why', keys: ['why hire', 'why should', 'why him', 'convince', 'pitch', 'stand out', 'unique', 'different', 'worth'],
          a: `🗣️ the pitch: he does strategy ${B('AND')} execution. most people pick one. Fardin finds the leads, writes the content, designs the posts, edits the video and checks the numbers — with receipts (340K views, 17K followers, ৳20L sales). that\'s the rizz 📈`,
          chips: ['Contact him', 'Download resume'], act: ['contact', 'resume'] },

        { id: 'money', keys: ['salary', 'pay', 'paid', 'rate', 'rates', 'price', 'pricing', 'charge', 'cost', 'budget', 'expected salary', 'how much', 'available', 'availability', 'open to work', 'notice period', 'start date', 'free to join'],
          a: `💸 ooh the classified stuff — that\'s a convo for Fardin himself, not his chatbot 🤐 shoot him a message and he\'ll talk details directly.`,
          act: ['contact', 'email'] },

        { id: 'thanks', keys: ['thanks', 'thank you', 'thx', 'ty', 'appreciate', 'cool', 'nice', 'great', 'awesome', 'love it', 'goat', 'fire', 'lit', 'based'],
          a: ['anytime bestie 🫶', 'W user, W question 😌 anything else?', 'glad i could serve 🫡 need anything else?'],
          chips: ['Fun facts', 'Contact him'] },

        { id: 'bye', keys: ['bye', 'goodbye', 'see ya', 'cya', 'later', 'gotta go', 'peace', 'gn', 'good night'],
          a: ['peace out ✌️ go say hi to Fardin on LinkedIn fr', 'byeee 👋 don\'t be a stranger'],
          act: ['linkedin'] },

        { id: 'joke', keys: ['joke', 'funny', 'make me laugh', 'meme', 'brainrot', 'skibidi', 'rizz', 'sigma', 'ohio'],
          a: ['why did the marketer break up with the funnel? too many drop-offs 💔📉',
              'Fardin\'s CRM has 40K records and still no one texts me back 😔',
              'i asked Fardin for a raise. he A/B tested it. i lost. 🥲'],
          chips: ['Another joke', 'Who is Fardin?'] },
    ];
    const byId = Object.fromEntries(BRAIN.map(b => [b.id, b]));

    /* ---------- matching ---------- */
    const norm = (s) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const lev = (a, b) => {
        if (Math.abs(a.length - b.length) > 2) return 9;
        const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
        for (let j = 1; j <= b.length; j++) d[0][j] = j;
        for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        return d[a.length][b.length];
    };
    const wordHit = (w, k) => w === k || (k.length >= 5 && w.length >= 4 && lev(w, k) <= (k.length >= 8 ? 2 : 1));

    function classify(raw) {
        const q = norm(raw);
        const words = q.split(' ').filter(Boolean);
        let best = null, bestScore = 0;
        for (const intent of BRAIN) {
            let score = 0;
            for (const k of intent.keys) {
                if (k.includes(' ')) { if ((' ' + q + ' ').includes(' ' + k + ' ')) score += 3 + k.split(' ').length; }
                else if (words.some(w => wordHit(w, k))) score += k.length <= 2 ? 1 : 2;
            }
            if (score > bestScore) { bestScore = score; best = intent; }
        }
        // short greetings shouldn't beat a real question
        if (best && best.id === 'hello' && words.length > 3 && bestScore < 4) {
            const others = BRAIN.filter(b => b.id !== 'hello').map(b => [b, b.keys.filter(k => !k.includes(' ') && words.some(w => wordHit(w, k))).length]).sort((a, b) => b[1] - a[1]);
            if (others[0][1] > 0) best = others[0][0];
        }
        return bestScore > 0 ? best : null;
    }

    /* ---------- state + memory ---------- */
    let history = [];
    let lastIntent = null;
    let visitorName = null;
    const save = () => { try { localStorage.setItem(STORE, JSON.stringify({ history: history.slice(-40), lastIntent, visitorName })); } catch (e) {} };
    const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || null; } catch (e) { return null; } };

    /* ---------- rendering ---------- */
    const scrollDown = () => { area.scrollTop = area.scrollHeight; };

    function renderActions(ids) {
        if (!ids || !ids.length) return null;
        const wrap = document.createElement('div');
        wrap.className = 'fifi-actions';
        ids.forEach(id => {
            const a = ACT[id]; if (!a) return;
            if (a.copy) {
                const b = document.createElement('button');
                b.type = 'button'; b.className = 'fifi-act'; b.textContent = a.label;
                b.addEventListener('click', () => {
                    const ok = () => { b.textContent = '✅ Copied!'; setTimeout(() => b.textContent = a.label, 1800); };
                    if (navigator.clipboard) navigator.clipboard.writeText(a.copy).then(ok, () => location.href = 'mailto:' + a.copy);
                    else location.href = 'mailto:' + a.copy;
                });
                wrap.appendChild(b);
            } else {
                const el = document.createElement('a');
                el.className = 'fifi-act'; el.href = a.href; el.textContent = a.label;
                if (a.download) el.setAttribute('download', a.download);
                if (a.ext) { el.target = '_blank'; el.rel = 'noopener'; }
                wrap.appendChild(el);
            }
        });
        return wrap;
    }

    function renderChips(list) {
        log.querySelectorAll('.fifi-chips').forEach(c => c.remove());
        if (!list || !list.length) return;
        const wrap = document.createElement('div');
        wrap.className = 'fifi-chips';
        list.forEach(t => {
            const c = document.createElement('button');
            c.type = 'button'; c.className = 'fifi-chip'; c.textContent = t;
            c.addEventListener('click', () => ask(t));
            wrap.appendChild(c);
        });
        log.appendChild(wrap);
        scrollDown();
    }

    function bubble(role, html) {
        const el = document.createElement('div');
        el.className = 'chat-bubble ' + (role === 'user' ? 'user-bubble' : 'ai-bubble');
        if (role === 'user') el.textContent = html; else el.innerHTML = html;
        log.appendChild(el);
        return el;
    }

    // Types out HTML without breaking tags: hide every text node, then reveal it char by char.
    function typeInto(el, done) {
        if (reduceMotion) { done(); return; }
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const nodes = []; let n;
        while ((n = walker.nextNode())) { nodes.push([n, n.textContent]); n.textContent = ''; }
        const total = nodes.reduce((s, [, t]) => s + t.length, 0);
        const step = Math.max(1, Math.ceil(total / 90)); // whole reply types in ~1.3s max
        let i = 0, k = 0;
        el.classList.add('typing-now');
        (function tick() {
            let left = step;
            while (left > 0 && i < nodes.length) {
                const [node, txt] = nodes[i];
                const take = Math.min(left, txt.length - k);
                node.textContent += txt.substr(k, take);
                k += take; left -= take;
                if (k >= txt.length) { i++; k = 0; }
            }
            scrollDown();
            if (i < nodes.length) setTimeout(tick, 14);
            else { el.classList.remove('typing-now'); done(); }
        })();
    }

    function showIntroIfEmpty() {
        const empty = history.length === 0;
        intro.style.display = empty ? '' : 'none';
        starters.style.display = empty ? '' : 'none';
        resetBtn.style.display = empty ? 'none' : '';
    }

    /* ---------- answering ---------- */
    function answerFor(text) {
        const q = norm(text);

        // name capture: "i'm sara", "my name is sara"
        const nm = q.match(/^(?:hi |hello |hey )?(?:im|i am|my name is|this is|call me)\s+([a-z]{2,15})$/);
        if (nm && !['fine', 'good', 'ok', 'okay', 'here', 'bored', 'hiring', 'a', 'recruiter'].includes(nm[1])) {
            visitorName = nm[1][0].toUpperCase() + nm[1].slice(1);
            return { html: `nice to meet you ${B(visitorName)} 🤝 what do you wanna know about Fardin?`, chips: ['Who is Fardin?', 'Work experience', 'Fun facts'] };
        }
        // recruiter / hiring manager vibe
        if (/\b(recruiter|hr|hiring manager|talent)\b/.test(q)) {
            return { html: `ooh a recruiter 👀 *fixes hair* — quick TL;DR: B2B lead gen + content + design, 340K+ organic views, 17K followers grown from zero, BBA Marketing (3.80). résumé's right here 👇`, act: ['resume', 'email', 'linkedin'], chips: ['Why hire him?', 'Work experience'] };
        }
        // follow-ups
        if (/^(more|tell me more|go on|and|continue|elaborate|explain more|what else|more info|details|another one|again)$/.test(q) || /^another (fun fact|joke)$/.test(q)) {
            if (/joke/.test(q)) lastIntent = 'joke';
            if (/fun fact/.test(q)) lastIntent = 'fun';
            const prev = byId[lastIntent];
            if (prev) {
                if (prev.more && !/another/.test(q)) return { html: prev.more, chips: prev.chips, act: prev.act };
                if (Array.isArray(prev.a)) return { html: pick(prev.a), chips: prev.chips, act: prev.act };
                return { html: `that's all the tea on that one ☕ wanna explore something else?`, chips: prev.chips || ['Who is Fardin?', 'Fun facts'], act: prev.act };
            }
            return { html: `more of what bestie? 😅 try one of these 👇`, chips: ['Work experience', 'Skills', 'Awards', 'Fun facts'] };
        }
        // chip aliases
        const alias = { 'see the gallery': 'design', 'read his blog': 'blog', 'free resources': 'resources', 'download resume': 'resume', 'contact him': 'contact', 'all his tools': 'tools', 'what tools does he use': 'tools', 'biggest wins': 'awards', 'what does he do': 'work', 'tell me a fun fact': 'fun', 'leadership roles': 'lead', 'content results': 'content', 'b2b stuff': 'b2b', 'ai stuff': 'ai', 'design work': 'design', 'why hire him': 'why', 'certificates': 'awards' };
        let intent = alias[q] ? byId[alias[q]] : classify(text);

        if (!intent) {
            return { html: pick([
                `hmm my brain.exe didn't catch that 🫠 i only know Fardin stuff — try one of these:`,
                `that one went over my head ngl 😭 i'm a Fardin specialist. ask me about:`,
                `skill issue on my side 💀 try asking about his work, skills, awards or fun facts:`
            ]), chips: ['Who is Fardin?', 'Work experience', 'Skills', 'Awards', 'Contact him'] };
        }
        lastIntent = intent.id;
        let html = typeof intent.a === 'function' ? intent.a() : Array.isArray(intent.a) ? pick(intent.a) : intent.a;
        if (intent.id === 'hello' && visitorName) html = `welcome back ${B(visitorName)} 👋 ` + html.replace(/^yooo 👋 |^heyyy bestie 😎 /, '');
        const chips = (intent.chips || []).slice();
        if (intent.more && !chips.includes('Tell me more')) chips.unshift('Tell me more');
        return { html, chips, act: intent.act };
    }

    let busy = false;
    function ask(text) {
        text = (text || '').trim();
        if (!text || busy) return;
        busy = true;
        intro.style.display = 'none'; starters.style.display = 'none'; resetBtn.style.display = '';
        log.querySelectorAll('.fifi-chips').forEach(c => c.remove());

        bubble('user', text);
        history.push({ r: 'user', h: text });
        scrollDown();

        const dots = document.createElement('div');
        dots.className = 'chat-bubble ai-bubble fifi-dots';
        dots.innerHTML = '<span></span><span></span><span></span>';
        log.appendChild(dots); scrollDown();

        const res = answerFor(text);
        setTimeout(() => {
            dots.remove();
            const el = bubble('ai', res.html);
            typeInto(el, () => {
                const acts = renderActions(res.act);
                if (acts) el.appendChild(acts);
                renderChips(res.chips);
                history.push({ r: 'ai', h: res.html, act: res.act || null, chips: res.chips || null });
                save();
                busy = false;
                scrollDown();
            });
        }, 450 + Math.random() * 450);
    }
    window.sendQuery = ask; // keep old inline onclick hooks working

    /* ---------- restore saved chat ---------- */
    const saved = load();
    if (saved && Array.isArray(saved.history)) {
        history = saved.history; lastIntent = saved.lastIntent; visitorName = saved.visitorName;
        history.forEach(m => {
            const el = bubble(m.r === 'user' ? 'user' : 'ai', m.h);
            if (m.r !== 'user') { const acts = renderActions(m.act); if (acts) el.appendChild(acts); }
        });
        const lastAi = [...history].reverse().find(m => m.r === 'ai');
        if (lastAi) renderChips(lastAi.chips);
    }
    showIntroIfEmpty();

    /* ---------- open / close / reset ---------- */
    const open = (v) => {
        modal.classList.toggle('show', v);
        btn.setAttribute('aria-expanded', v);
        document.body.classList.toggle('fifi-open', v);
        if (v) { scrollDown(); if (window.matchMedia('(min-width: 901px)').matches) setTimeout(() => input.focus(), 250); }
    };
    btn.addEventListener('click', (e) => { e.stopPropagation(); open(!modal.classList.contains('show')); });
    closeBtn.addEventListener('click', () => open(false));
    document.addEventListener('click', (e) => {
        if (modal.classList.contains('show') && !modal.contains(e.target) && !btn.contains(e.target) && e.target.isConnected) open(false);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('show')) open(false); });

    resetBtn.addEventListener('click', () => {
        history = []; lastIntent = null; log.innerHTML = '';
        try { localStorage.removeItem(STORE); } catch (e) {}
        showIntroIfEmpty();
    });

    form.addEventListener('submit', (e) => { e.preventDefault(); const t = input.value; input.value = ''; ask(t); });

    // little "psst" nudge once per session, after 12s on the page
    try {
        if (!sessionStorage.getItem('fifi-nudged') && !history.length) {
            setTimeout(() => {
                if (modal.classList.contains('show')) return;
                const tip = document.createElement('div');
                tip.className = 'fifi-nudge';
                tip.textContent = 'psst… ask me anything about Fardin 👀';
                document.body.appendChild(tip);
                requestAnimationFrame(() => tip.classList.add('in'));
                tip.addEventListener('click', () => { tip.remove(); open(true); });
                setTimeout(() => { tip.classList.remove('in'); setTimeout(() => tip.remove(), 400); }, 6000);
                sessionStorage.setItem('fifi-nudged', '1');
            }, 12000);
        }
    } catch (e) {}
})();
