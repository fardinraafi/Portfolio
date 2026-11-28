/* =========================================================
   FIFI - Fardin's (fake-but-smart) AI sidekick
   No API. A keyword + fuzzy-match brain with personality.
   Loaded on the home page, the resume page and the 404 page.
   If the page doesn't already have Fifi's markup, it is injected here.
========================================================= */
(function () {
    'use strict';

    const path = location.pathname.replace(/\.html$/, '');
    const MODE = document.body.classList.contains('error-page') ? '404' : path.startsWith('/resume') ? 'resume' : path.startsWith('/projects/hook-lab') ? 'hooklab' : path.startsWith('/projects/caption-maker') ? 'caption' : /^\/blog\/./.test(path) ? 'blog' : path.startsWith('/certificates') ? 'certs' : path.startsWith('/contact') ? 'contact' : path.startsWith('/gallery') ? 'gallery' : path.startsWith('/resources') ? 'resources' : path.startsWith('/volunteer') ? 'leadership' : path.startsWith('/projects/bookmarks') ? 'bookmarks' : /^\/projects\/?$|^\/projects\/index/.test(path) ? 'projects' : /^\/blog\/?$/.test(path) ? 'bloglist' : /guidebook|framework/.test(path) ? 'guide' : 'home';
    const MODES = {
        home:   { hello: "yo, i'm Fifi!", sub: "Fardin's AI sidekick. ask me anything about him: work, skills, awards, fun facts. i know the lore 📚",
                  starters: [['Who is Fardin?', '✦'], ['Work experience', '💼'], ['Skills', '🧠'], ['Biggest wins?', '🏆'], ['Download resume', '📥'], ['Book a call', '🗓️']] },
        resume: { hello: "need the TL;DR? 📄", sub: "i'm Fifi, Fardin's sidekick. ask me about his experience, skills or tools, or grab the CV.",
                  starters: [['Work experience', '💼'], ['Skills', '🧠'], ['What tools does he use?', '🧰'], ['Education', '🎓'], ['Download resume', '📥'], ['Book a call', '🗓️']] },
        hooklab: { hello: "hook doctor is in 🩺", sub: "ask me what makes a hook slap, how the score works, or who built this lab.",
                  starters: [['What makes a good hook?', '🪝'], ['How does the score work?', '📊'], ['Who built this?', '🛠️'], ['Book a call', '🗓️']] },
        caption: { hello: "caption buddy reporting 🫡", sub: "tell me your post idea and i'll whip up a caption, or ask me anything about Fardin.",
                  starters: [['Write me a caption', '✍️'], ['Best hashtags tips?', '#️⃣'], ['Who built this?', '🛠️'], ['Book a call', '🗓️']] },
        blog:   { hello: "speed-reading for you ⚡", sub: "i can summarise this post, explain any part of it, or tell you about the guy who wrote it.",
                  starters: [['Summarise this post', '📝'], ['Key takeaway?', '🎯'], ['Who wrote this?', '✍️'], ['More posts like this', '📚']] },
        certs:  { hello: "59 certs and counting 🎓", sub: "ask me which ones matter most, what he learned, or how he finds time for all this.",
                  starters: [['Which cert is his best?', '🏅'], ['Any AI certifications?', '🤖'], ['Marketing certs?', '📈'], ['Book a call', '🗓️']] },
        contact: { hello: "wanna reach Fardin? 📬", sub: "i can tell you how fast he replies, what he's open to, or pass him a message right here.",
                  starters: [['How fast does he reply?', '⚡'], ['Is he open to work?', '💼'], ['Leave a message', '✉️'], ['Book a call', '🗓️']] },
        gallery: { hello: "the art department 🎨", sub: "ask me about his design work, the tools he uses, or the brands behind these.",
                  starters: [['What tools does he design with?', '🧰'], ['Which brands are these for?', '🏷️'], ['How many designs has he made?', '🖌️'], ['Book a call', '🗓️']] },
        resources: { hello: "free stuff aisle 🛒", sub: "ask me which guide to start with, or anything about Fardin.",
                  starters: [['Which guide should I start with?', '📘'], ['Best free tools?', '🧰'], ['Who made these?', '✍️'], ['Book a call', '🗓️']] },
        leadership: { hello: "leader mode on 🫡", sub: "ask me about his clubs, roles, and what he actually did in each.",
                  starters: [['Biggest leadership role?', '👑'], ['What does he do at Rotaract?', '🤝'], ['BASIS Leader award?', '🏆'], ['Book a call', '🗓️']] },
        projects: { hello: "the lab 🧪", sub: "ask me what each project does, which one to try first, or how he built them.",
                  starters: [['Which project should I try?', '🎯'], ['How did he build these?', '🛠️'], ['Is the AI real?', '🤖'], ['Book a call', '🗓️']] },
        bookmarks: { hello: "tool hunter 🔎", sub: "tell me what you need and i'll point you to the right free tool from his list.",
                  starters: [['Best free AI tool here?', '🤖'], ['Tool to remove backgrounds?', '🖼️'], ['Free stock photos?', '📷'], ['His favourite tools?', '⭐']] },
        bloglist: { hello: "bookworm mode 📚", sub: "ask me which post to read first, or what he writes about.",
                  starters: [['Which post should I read?', '📖'], ['What does he write about?', '✍️'], ['Latest post?', '🆕'], ['Book a call', '🗓️']] },
        guide:  { hello: "study buddy here 📘", sub: "ask me to explain any part of this guide, or how to use it.",
                  starters: [['Summarise this guide', '📝'], ['How do I use this?', '🧭'], ['Who wrote this?', '✍️'], ['Book a call', '🗓️']] },
        '404':  { hello: "lost? i got you 🧭", sub: "this page doesn't exist, but i do. ask me anything about Fardin or let me take you somewhere real.",
                  starters: [['Where am I?', '🗺️'], ['Take me home', '🏠'], ['Who is Fardin?', '✦'], ['Book a call', '🗓️']] }
    };

    if (!document.getElementById('openChatBtn')) {
        const m = MODES[MODE];
        const wrap = document.createElement('div');
        wrap.innerHTML = `
<button class="chat-bot-btn" id="openChatBtn" aria-label="Chat with Fifi" aria-expanded="false" aria-controls="chatModal">
    <span class="fifi-av"><img src="/misc_img/avatar.jpg" alt="" width="42" height="42"><i></i></span>
    <span class="fifi-label">FIFI</span>
</button>
<div class="glass-card chat-bot-modal no-hover" id="chatModal" role="dialog" aria-label="Chat with Fifi">
    <div class="chat-header">
        <div class="chat-header-title">
            <span class="fifi-av sm"><img src="/misc_img/avatar.jpg" alt="" width="36" height="36"><i></i></span>
            <div><h4>FIFI</h4><div class="bot-subtitle">Fardin's AI sidekick · online</div></div>
        </div>
        <div class="chat-head-actions">
            <button class="chat-icon-btn" id="resetChatBtn" aria-label="Restart chat" title="Restart chat">↻</button>
            <button class="close-chat" id="closeChatBtn" aria-label="Close chat">&times;</button>
        </div>
    </div>
    <div class="chat-scroll-area" id="chatArea">
        <div class="chat-greeting" id="chatGreeting">
            <div class="fifi-wave">👋</div>
            <h2>${m.hello}</h2>
            <p>${m.sub}</p>
        </div>
        <div class="chat-options-grid" id="chatOptions"></div>
        <div class="chat-log" id="chatLog" aria-live="polite"></div>
    </div>
    <form class="fifi-form" id="fifiForm" autocomplete="off">
        <input id="fifiInput" type="text" maxlength="200" placeholder="Ask Fifi anything about Fardin…" aria-label="Message Fifi">
        <button type="button" class="fifi-mic" id="fifiMic" aria-label="Speak your question" title="Speak" hidden>🎙️</button>
        <button type="submit" aria-label="Send">➤</button>
    </form>
</div>`;
        while (wrap.firstElementChild) document.body.appendChild(wrap.firstElementChild);
    }
    // Starter buttons for this page
    const opts = document.getElementById('chatOptions');
    if (opts && MODE !== 'home') {
        opts.innerHTML = MODES[MODE].starters.map(([t, ic]) => `<button type="button" class="chat-opt-btn" data-q="${t}"><span class="opt-ic">${ic}</span><span>${t}</span></button>`).join('');
    }
    if (opts) opts.addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (b && window.sendQuery) window.sendQuery(b.dataset.q); });

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
    const bags = new WeakMap();
    const pick = (arr) => { // cycles through every item before repeating
        let bag = bags.get(arr);
        if (!bag || !bag.length) { bag = arr.map((_, i) => i).sort(() => Math.random() - 0.5); if (arr._last != null && bag[0] === arr._last && bag.length > 1) bag.push(bag.shift()); bags.set(arr, bag); }
        const i = bag.shift(); arr._last = i; return arr[i];
    };
    const L = (href, text) => `<a href="${href}">${text}</a>`;
    const B = (t) => `<strong>${t}</strong>`;
    const EMAIL = 'fardinraafi@gmail.com';

    const ACT = {
        resume:   { label: '📥 Download resume', href: '/Fardin_Resume.pdf', download: 'Fardin_Rahman_Khan_Raafi_Resume.pdf' },
        resumePg: { label: '📄 Resume page', href: '/resume' },
        email:    { label: '📋 Copy email', copy: EMAIL },
        contact:  { label: '✉️ Contact page', href: '/contact' },
        linkedin: { label: '💼 LinkedIn', href: 'https://www.linkedin.com/in/fardinraafi', ext: true },
        behance:  { label: '🎨 Behance', href: 'https://www.behance.net/fardinraafi', ext: true },
        insta:    { label: '📸 Instagram', href: 'https://www.instagram.com/fardin_raafi', ext: true },
        x:        { label: '𝕏 X / Twitter', href: 'https://x.com/fardin_raafi', ext: true },
        github:   { label: '🐙 GitHub', href: 'https://github.com/fardinraafi', ext: true },
        blog:     { label: '✍️ Read the blog', href: '/blog' },
        gallery:  { label: '🖼️ Gallery', href: '/gallery' },
        lead:     { label: '🏆 Leadership page', href: '/volunteer' },
        certs:    { label: '📜 Certificates', href: '/certificates' },
        res:      { label: '🧰 Free resources', href: '/resources' },
        book:     { label: '🗓️ Book a 30-min call', href: 'https://calendly.com/fardinraafi/30min', calendly: true },
        home:     { label: '🏠 Home', href: '/' },
        msg:      { label: '✉️ Leave a message', form: true },
        projects: { label: '🛠️ Projects', href: '/projects' },
        hooklab:  { label: '🪝 Try Hook Lab', href: '/projects/hook-lab' },
        caption:  { label: '✍️ Caption Maker', href: '/projects/caption-maker' },
        swipe:    { label: '🔥 Swipe the Hook', href: '/projects/swipe-the-hook' },
        archive:  { label: '💼 LinkedIn Archive', href: '/projects/linkedin-clone' },
        bookmarks:{ label: '🔖 120 free tools', href: '/projects/bookmarks' },
        fifipage: { label: '🤖 Meet Fifi', href: '/fifi' },
    };
    /* ---------- Fifi info: version, changelog, live stats (one cached fetch per tab) ---------- */
    let INFO = null;
    const infoReady = (async () => {
        try { INFO = JSON.parse(sessionStorage.getItem('fifi-info') || 'null'); } catch (e) {}
        if (INFO || location.protocol === 'file:') return INFO;
        try { const r = await fetch('/api/fifi?info'); if (r.ok) { INFO = await r.json(); sessionStorage.setItem('fifi-info', JSON.stringify(INFO)); } } catch (e) {}
        return INFO;
    })();
    window.FRFifiInfo = infoReady;
    const changelogHtml = () => {
        if (!INFO) return `i get upgraded all the time 🛠️ Fardin keeps teaching me new tricks. the full story is on my page 👇`;
        const rows = INFO.changelog.slice(0, 5).map(c => `• ${B('v' + c.v)}${c.d ? ' <small>(' + new Date(c.d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ')</small>' : ''}: ${c.t}`).join('<br>');
        return `🆕 i'm ${B('Fifi v' + INFO.version)} and Fardin keeps upgrading me. latest drops:<br><br>${rows}${INFO.questions ? `<br><br>so far i've answered ${B(INFO.questions.toLocaleString())} questions${INFO.learned ? ` and learned ${B(INFO.learned)} new answers from visitors` : ''} 😎` : ''}`;
    };
    // anonymous click counts for the insights page
    const track = (id) => { try { navigator.sendBeacon && navigator.sendBeacon('/api/fifi', JSON.stringify({ event: 'click', id })); } catch (e) {} };
    const RECRUIT = /\b(recruit\w*|hiring|hire|hr|talent|vacanc\w*|candidate|job (offer|opening)|open role|interview|client|agency|freelanc\w*|collab\w*|work with (him|fardin)|our (company|team|brand)|project for us)\b/i;

    /* ---------- the brain ----------
       keys: words/phrases that point to this topic (fuzzy matched)
       a: answer (string or array → random), more: deeper follow-up
       chips: suggested next questions, act: action buttons          */
    const BRAIN = [
        { id: 'hello', keys: ['hi', 'hello', 'hey', 'yo', 'sup', 'wassup', 'hola', 'salam', 'assalamualaikum', 'good morning', 'good evening', 'hii', 'heyy'],
          a: ['yooo 👋 Fifi here, Fardin\'s lil AI sidekick. ask me literally anything about him, i got the lore 📚',
              'heyyy bestie 😎 what do you wanna know about Fardin? work, skills, awards, the tea ☕, all of it'],
          chips: ['Who is Fardin?', 'What does he do?', 'Biggest wins?'] },

        { id: 'who', keys: ['who is fardin', 'who are you', 'about him', 'about fardin', 'tell me about', 'introduce', 'who is he', 'fardin', 'raafi', 'summary', 'bio', 'background'],
          a: `ok so ${B('Fardin Rahman Khan Raafi')} is a Dhaka-based marketer who is lowkey cooking 🧑‍🍳<br><br>• ${B('Junior Executive, Marketing')} at Augmex Technologies<br>• pulled ${B('340K+ organic views')} in 2026<br>• grew sneaker brand FYGO from ${B('0 → 17K+ followers')}<br>• BBA in Marketing, ${B('CGPA 3.80')}<br>• BASIS Leader of the Year \'24 🏆<br><br>basically B2B growth + content + design in one guy. no cap.`,
          more: `extra lore: he does B2B lead gen for European & Australian markets, designs graphics & motion stuff, hosts a podcast, and posts on LinkedIn like it's his cardio 🏃‍♂️`,
          chips: ['Work experience', 'Skills', 'Awards', 'Fun facts'], act: ['resumePg', 'linkedin'] },

        { id: 'me', keys: ['what are you', 'are you ai', 'are you real', 'chatgpt', 'are you a bot', 'your name', 'who made you', 'fifi'],
          a: [`i'm Fifi 🤖 fun fact: ${B('Fifi')} was a nickname people used to call Fardin, so when he made a chatbot, that's what he named me. v1 could only answer 4 questions 😭 now i run on an AI brain through the ${B('Groq API')}, and he keeps upgrading me. not bad for a marketing guy ngl 😌`,
              `Fardin built me right after building this website. started as a tiny 4-question bot, now i've got an AI brain (${B('Groq API')}), site search, voice input and i learn from questions i can't answer. he keeps shipping updates 🛠️`],
          chips: ["What's new?", 'Who is Fardin?'], act: ['fifipage'] },
        { id: 'whatsnew', keys: ['whats new', 'what is new', 'changelog', 'update', 'updates', 'updated', 'version', 'new features', 'upgrade', 'upgrades'],
          a: () => changelogHtml(), chips: ['Who made you?', 'Who is Fardin?'], act: ['fifipage'] },

        { id: 'work', keys: ['work', 'job', 'experience', 'career', 'augmex', 'company', 'role', 'position', 'currently', 'what does he do', 'employed', 'working', 'intern', 'internship', 'office'],
          a: `💼 ${B('Augmex Technologies Ltd.')}, the main quest:<br><br>• ${B('Junior Executive, Marketing')} (Apr 2026 → now)<br>• ${B('Intern, Marketing')} (Jan → Apr 2026)<br><br>he runs B2B lead generation, CRM, cold outreach, social content and design across multiple brands. did ALL the posting, writing, carousels and videos for Augmex → ~${B('180K organic reach')} 📈<br><br>before that: marketing intern at ${B('Adviza International')} (2025).`,
          more: `side quest: ${B('FYGO')}, Augmex\'s sneaker sub-brand 👟, he grew it from 0 to ${B('17K+ followers')}, ${B('৳20 lakh+ sales')} and ${B('300+ customers')} (Jul-Nov 2026). sneakerhead marketing arc fr.`,
          chips: ['Tell me about FYGO', 'B2B stuff', 'Skills'], act: ['resumePg'] },

        { id: 'fygo', keys: ['fygo', 'sneaker', 'sneakers', 'shoes', 'brand growth', 'ecommerce', 'sales', 'followers'],
          a: `👟 ${B('FYGO')} = Augmex\'s sneaker brand and Fardin\'s glow-up project:<br><br>• ${B('0 → 17K+')} followers<br>• ${B('৳20 lakh+')} in sales<br>• ${B('300+')} customers<br>• all in about 5 months (Jul-Nov 2026)<br><br>content, design, captions, the whole thing. absolute W 🔥`,
          chips: ['Content results', 'What tools does he use?'] },

        { id: 'b2b', keys: ['b2b', 'lead', 'leads', 'lead generation', 'crm', 'outreach', 'cold email', 'sales navigator', 'salesforce', 'apollo', 'prospecting', 'europe', 'australia', 'revops', 'pipeline'],
          a: `🎯 B2B is his home turf:<br><br>• lead research & generation for ${B('European + Australian')} markets<br>• enriched ${B('40,000+ CRM records')}<br>• multi-channel cold outreach (email + LinkedIn)<br>• tools: Salesforce, Apollo.io, LinkedIn Sales Navigator, HubSpot<br><br>he finds the right people and gets them talking. sigma prospecting energy 🗿`,
          chips: ['Content results', 'All his tools', 'Contact him'] },

        { id: 'content', keys: ['content', 'views', 'reach', 'social media', 'organic', 'linkedin posts', 'posting', 'viral', 'results', 'numbers', 'stats', '340k', 'impressions', 'engagement'],
          a: `📊 the numbers go crazy:<br><br>• ${B('340K+ organic views')} in 2026<br>• ~${B('180K')} of that for Augmex (brand awareness, Jan-Nov)<br>• the rest from FYGO 👟<br>• ${B('1,200+ designs')} made<br><br>all organic. no ads. just cooking content that people actually stop scrolling for 🛑📱`,
          chips: ['Tell me about FYGO', 'Read his blog', 'Design work'], act: ['linkedin'] },

        { id: 'skills', keys: ['skill', 'skills', 'good at', 'strengths', 'expertise', 'specialize', 'specialized', 'competencies', 'capabilities', 'what can he do', 'talent'],
          a: `🧠 his skill tree:<br><br>• ${B('B2B lead gen & outreach')}<br>• ${B('content marketing')} & social strategy<br>• ${B('brand strategy')} & positioning<br>• ${B('graphic & motion design')}<br>• CRM management<br>• AI-powered workflows 🤖<br><br>marketing brain + designer hands. rare combo ngl.`,
          chips: ['What tools does he use?', 'Design work', 'Work experience'], act: ['resumePg'] },

        { id: 'tools', keys: ['tool', 'tools', 'software', 'stack', 'toolkit', 'apps', 'photoshop', 'illustrator', 'figma', 'canva', 'capcut', 'notion', 'hubspot', 'analytics', 'claude', 'gemini', 'notebooklm', 'perplexity', 'meta business'],
          a: `🧰 the toolkit:<br><br>${B('Design:')} Photoshop, Illustrator, Figma, Canva, CapCut<br>${B('Sales/CRM:')} Salesforce, Apollo.io, Sales Navigator, HubSpot<br>${B('Social & data:')} Meta Business Suite, Google Analytics, Buffer<br>${B('AI:')} Claude, Gemini, NotebookLM, Perplexity<br>${B('Brain dump:')} Notion<br><br>he\'s basically a walking SaaS bundle 💻`,
          chips: ['AI stuff', 'Design work'] },

        { id: 'ai', keys: ['ai', 'artificial intelligence', 'prompt', 'prompting', 'automation', 'llm', 'agents'],
          a: `🤖 Fardin is deep in the AI rabbit hole, uses Claude, Gemini, NotebookLM and Perplexity daily for research, content and workflows. he even made free AI guides + a master prompt pack on the ${L('/resources', 'resources page')} 👀`,
          chips: ['Free resources', 'Read his blog'], act: ['res', 'blog'] },

        { id: 'design', keys: ['design', 'designer', 'graphic', 'graphics', 'motion', 'video', 'editing', 'portfolio', 'behance', 'creative', 'branding', 'logo', 'carousel'],
          a: `🎨 yes he designs too:<br><br>• ${B('1,200+ designs')} shipped<br>• social graphics, carousels, motion & video<br>• branding for TEDxUttara (Lead Brand Designer) and a bunch of clubs<br><br>the man said "why hire a designer when i AM the designer" 💅`,
          chips: ['See the gallery', 'Skills'], act: ['behance', 'gallery'] },

        { id: 'edu', keys: ['education', 'study', 'studied', 'university', 'degree', 'bba', 'bubt', 'cgpa', 'gpa', 'graduate', 'college', 'academics', 'academic', 'school', 'masters'],
          a: `🎓 ${B('BBA in Marketing')} from ${B('BUBT')} (Bangladesh University of Business and Technology) with a ${B('CGPA of 3.80')}. smart AND busy? the audacity 😤`,
          more: `he also got into the ${B('Aspire Leaders Program \'26')} (Aspire Institute, founded at Harvard Business School) and snagged a ${B('70% scholarship from ISCEA')} in 2025 🎉`,
          chips: ['Awards', 'Leadership roles'], act: ['certs'] },

        { id: 'awards', keys: ['award', 'awards', 'achievement', 'achievements', 'won', 'win', 'wins', 'honor', 'honors', 'basis', 'harvard', 'aspire', 'iscea', 'scholarship', 'competition', 'prize', 'hult', 'biggest'],
          a: `🏆 trophy cabinet:<br><br>• ${B('BASIS Leader of the Year 2024')}<br>• ${B('Aspire Leaders Program \'26')} (founded at Harvard Business School)<br>• ${B('ISCEA Global Case Competition 2025')}, 70% scholarship<br>• Lead Luminary 4.0 (LEAD Academy)<br>• 3rd place, Ad-Making competition<br>• Executive recognition, Hult Prize BUBT<br><br>main character behaviour fr 👑`,
          chips: ['Leadership roles', 'Certificates'], act: ['certs', 'lead'] },

        { id: 'lead', keys: ['leadership', 'volunteer', 'volunteering', 'club', 'clubs', 'extracurricular', 'extracurriculars', 'rotaract', 'tedx', 'tedxuttara', 'swc', 'social welfare', 'career guidance', 'community', 'leo', 'secretary'],
          a: `🌱 leadership arc:<br><br>• ${B('Head of Corporate & Alumni Relations')} - BUBT Career Guidance Office (2026 → now)<br>• ${B('Secretary')} - Rotaract Club of Dhaka Dynamic<br>• ${B('Media & Publications Secretary')} - BUBT Social Welfare Club<br>• ${B('Lead Brand Designer')} - TEDxUttara<br>• Sub Executive - BUBT Business Club<br><br>he said sleep is optional 😭`,
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

        { id: 'contact', keys: ['contact', 'reach', 'email', 'mail', 'hire', 'hiring', 'connect', 'talk', 'message', 'dm', 'call', 'collab', 'collaborate', 'work together', 'freelance', 'meet', 'book'],
          a: `📬 slide into his inbox: ${B(EMAIL)}<br><br>or use the contact form, he actually replies (rare W) ⚡`,
          chips: ['Socials', 'Book a call'], act: ['book', 'email', 'contact', 'linkedin'] },

        { id: 'social', keys: ['social', 'socials', 'linkedin', 'instagram', 'insta', 'twitter', 'x', 'facebook', 'threads', 'github', 'pinterest', 'discord', 'follow'],
          a: `📱 find him everywhere:<br><br>• LinkedIn → fardinraafi (his main stage)<br>• Instagram / X / Threads / Pinterest → @fardin_raafi<br>• Behance & GitHub → fardinraafi<br>• Discord → equinox.90<br><br>LinkedIn is where the daily posts live 👀`,
          act: ['linkedin', 'insta', 'x', 'behance'] },

        { id: 'location', keys: ['where', 'location', 'based', 'live', 'lives', 'city', 'country', 'bangladesh', 'dhaka', 'timezone', 'time zone', 'remote'],
          a: () => `📍 ${B('Dhaka, Bangladesh')} (GMT+6). it\'s ${B(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: 'numeric', minute: '2-digit' }))} there rn. works with teams in Europe & Australia so timezones don\'t scare him 🌍`,
          chips: ['Contact him'] },

        { id: 'fun', keys: ['fun', 'fact', 'facts', 'hobby', 'hobbies', 'free time', 'personal', 'interests', 'likes', 'game', 'games', 'gaming', 'clash', 'coffee', 'book', 'books', 'music', 'cat', 'cats', 'pet', 'anime', 'manga', 'food', 'football', 'brazil', 'messi', 'ronaldo', 'night', 'tea', 'dream', 'travel', 'phonk'],
          a: [`🎮 fun fact: he\'s a ${B('Town Hall 19')} in Clash of Clans and has been playing for ${B('14 years')}. it\'s the only game he plays, loyalty fr 🫡`,
              `🐱 fun fact: Fardin is ${B('obsessed with cats')}. like, actually obsessed.`,
              `🦉 fun fact: certified ${B('night owl')}. his best ideas show up after midnight.`,
              `☕ fun fact: coffee or cha? depends on his mood, he refuses to pick a side.`,
              `⚽ fun fact: supports ${B('Brazil')} 🇧🇷 but loves both ${B('Ronaldo and Messi')}. a diplomat.`,
              `🍔 fun fact: his comfort food is ${B('chicken fries and burgers')}. no notes.`,
              `📚 fun fact: he\'s into ${B('anime and manga')} 🍥`,
              `🎧 fun fact: his playlist is mostly ${B('soft songs and phonk')}. calm or chaos, no in between.`,
              `🎨 fun fact: he got into marketing through ${B('self-taught design')} first. designer brain, marketer job.`,
              `🤖 fun fact: the tool he can\'t live without? ${B('Claude and AI')}. (he built me, so i approve 😌)`,
              `✈️ fun fact: dream travel destination? "${B('bidesh gelei hoise bhai')}" 😭 anywhere abroad works.`,
              `🚀 fun fact: his 5-year dream is to be ${B('Head of Marketing somewhere big')}.`,
              `🎧 fun fact: ${B('My First Million')} is his podcast comfort food, and ${B('Hacking Growth')} lives rent-free on his reading list 📚`],
          chips: ['Another fun fact', 'Who is Fardin?'] },

        { id: 'why', keys: ['why hire', 'why should', 'why him', 'convince', 'pitch', 'stand out', 'unique', 'different', 'worth'],
          a: `🗣️ the pitch: he does strategy ${B('AND')} execution. most people pick one. Fardin finds the leads, writes the content, designs the posts, edits the video and checks the numbers, with receipts (340K views, 17K followers, ৳20L sales). that\'s the rizz 📈`,
          chips: ['Contact him', 'Download resume'], act: ['book', 'contact', 'resume'] },

        { id: 'money', keys: ['salary', 'pay', 'paid', 'rate', 'rates', 'price', 'pricing', 'charge', 'cost', 'budget', 'expected salary', 'how much', 'available', 'availability', 'open to work', 'notice period', 'start date', 'free to join'],
          a: `💸 ooh the classified stuff, that\'s a convo for Fardin himself, not his chatbot 🤐 shoot him a message and he\'ll talk details directly.`,
          act: ['book', 'contact', 'email'] },

        { id: 'call', keys: ['book a call', 'book', 'call', 'meeting', 'schedule', 'calendly', 'appointment', 'zoom', 'google meet', 'meet him', 'talk to him', 'slot'],
          a: `🗓️ say less. grab a ${B('30-min call')} with Fardin, pick any open slot and the invite lands in your inbox. no back-and-forth emails 🙌`,
          chips: ['Why hire him?', 'Work experience'], act: ['book', 'email'] },

        { id: 'lost', keys: ['where am i', 'lost', '404', 'broken', 'not found', 'wrong page', 'missing', 'dead link'],
          a: `🗺️ you hit a page that doesn't exist (the link was probably old or mistyped). no stress, here are the real spots 👇`,
          chips: ['Who is Fardin?', 'Take me home'], act: ['home', 'blog', 'projects', 'contact'] },

        { id: 'gohome', keys: ['take me home', 'home', 'homepage', 'main page', 'go back', 'back'],
          a: `🏠 one-way ticket home, coming right up. tap below 👇`,
          act: ['home', 'projects', 'blog'] },

        { id: 'projects', keys: ['projects', 'project', 'built', 'portfolio work', 'side project', 'game', 'linkedin clone', 'work page'],
          a: `🛠️ he builds stuff too: ${B('Hook Lab')} (a free hook analyzer), a ${B('LinkedIn profile UI clone')} and ${B('Fifi Run')}, the 404 mini game starring yours truly 😎`,
          act: ['projects'] },

        { id: 'hooks', keys: ['hook', 'hooks', 'good hook', 'first line', 'opening line', 'scroll', 'caption', 'copywriting', 'headline', 'subject line', 'see more', 'makes a good hook'],
          a: `🪝 a hook that slaps usually has: ${B('a number')} (7 lessons, 30 days), ${B('a curiosity gap')} (the mistake nobody talks about), ${B('a twist')} ("but", "instead"), and it's about ${B('YOU')}, not "I'm excited to announce". keep it before the "see more" cut-off ✂️`,
          chips: ['How does the score work?', 'Who built this?'] },

        { id: 'score', keys: ['score', 'how does the score work', 'scoring', 'gauge', 'algorithm', 'formula', 'is this ai', 'accurate'],
          a: `📊 zero AI, all formula: curiosity 22%, clarity & length 20%, specificity 17%, emotion 15%, pattern interrupt 14%, reader focus 12%. it's the checklist Fardin uses on every post, turned into code. nothing you type leaves your browser 🔒`,
          chips: ['What makes a good hook?', 'Who built this?'] },

        { id: 'builder', keys: ['who built this', 'who made this', 'who built', 'creator', 'made by', 'hook lab'],
          a: `🛠️ Fardin built Hook Lab from scratch: hand-written scoring engine, gauge, previews, all of it. he writes content that pulled ${B('340K+ organic views')} in 2026, so he knows a hook when he sees one 😎`,
          chips: ['Work experience', 'Book a call'], act: ['projects', 'book'] },

        { id: 'thanks', keys: ['thanks', 'thank you', 'thx', 'ty', 'appreciate', 'cool', 'nice', 'great', 'awesome', 'love it', 'goat', 'fire', 'lit', 'based'],
          a: ['anytime bestie 🫶', 'W user, W question 😌 anything else?', 'glad i could serve 🫡 need anything else?'],
          chips: ['Fun facts', 'Contact him'] },

        { id: 'bye', keys: ['bye', 'goodbye', 'see ya', 'cya', 'later', 'gotta go', 'peace', 'gn', 'good night'],
          a: ['peace out ✌️ go say hi to Fardin on LinkedIn fr', 'byeee 👋 don\'t be a stranger'],
          act: ['linkedin'] },

        { id: 'leavemsg', keys: ['leave a message', 'leave message', 'pass a message', 'message him', 'tell him', 'send a message', 'send message', 'drop a message', 'msg him'],
          a: `say less 📝 drop it below and it lands straight in his inbox. he usually replies within a couple hours (Dhaka daytime) ⚡`,
          act: ['msg'], chips: ['Book a call', 'Who is Fardin?'] },
        { id: 'age', keys: ['age', 'how old', 'old is he', 'born', 'birthday', 'birth'],
          a: `age? classified 🤫 what i CAN tell you: young, hungry, and already ${B('BASIS Leader of the Year')} 😌`,
          chips: ['Awards', 'Work experience'] },
        { id: 'aspire', keys: ['aspire leaders', 'aspire program', 'alp', 'harvard program', 'aspire institute'],
          a: `🎓 he got selected for the ${B('Aspire Leaders Program \'26')}, a global leadership program by the Aspire Institute, founded at ${B('Harvard Business School')}. big W 🏆`,
          chips: ['Awards', 'Leadership roles'], act: ['certs'] },
        { id: 'bubt', keys: ['career office', 'career guidance', 'alumni', 'corporate relations', 'bubt club'],
          a: `🎓 he\'s ${B('Head of Corporate & Alumni Relations')} at the BUBT Career Guidance Office. connects students with alumni and companies, runs career events and workshops 🤝`,
          chips: ['Leadership roles', 'Awards'], act: ['lead'] },
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
            if (a.form) {
                const b = document.createElement('button');
                b.type = 'button'; b.className = 'fifi-act'; b.textContent = a.label;
                b.addEventListener('click', () => { track(id); b.remove(); wrap.after(msgForm()); scrollDown(); });
                wrap.appendChild(b); return;
            }
            if (a.copy) {
                const b = document.createElement('button');
                b.type = 'button'; b.className = 'fifi-act'; b.textContent = a.label;
                b.addEventListener('click', () => {
                    track(id);
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
                if (a.calendly) el.setAttribute('data-calendly', a.href);
                el.addEventListener('click', () => track(id));
                wrap.appendChild(el);
            }
        });
        return wrap;
    }

    /* ---------- leave-a-message form (posts to the same Web3Forms inbox as /contact) ---------- */
    const W3F_KEY = 'cf0cd748-fc1b-4a61-a90b-10b95ba7527a';
    function msgForm() {
        const f = document.createElement('form');
        f.className = 'fifi-msg';
        f.innerHTML = `<input name="name" required maxlength="60" placeholder="Your name">
<input name="email" type="email" required maxlength="80" placeholder="Your email">
<input name="company" maxlength="80" placeholder="Company or role (optional)">
<textarea name="message" required maxlength="800" rows="3" placeholder="Your message for Fardin"></textarea>
<button type="submit" class="fifi-act">📨 Send to Fardin</button>`;
        f.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'sending…';
            const fd = Object.fromEntries(new FormData(f));
            // save the lead for Fardin's private insights page (best effort, the email below is the main delivery)
            try { fetch('/api/fifi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lead: { name: fd.name, email: fd.email, company: fd.company, msg: fd.message, page: location.pathname } }) }); } catch (e2) {}
            try {
                const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify({ access_key: W3F_KEY, subject: 'New message via Fifi 🤖', from_name: 'Fifi (portfolio chat)', name: fd.name, email: fd.email, company: fd.company || '-', message: fd.message, page: location.pathname }) });
                const d = await r.json();
                if (!d.success) throw 0;
                f.outerHTML = `<div class="chat-bubble ai-bubble">✅ sent! Fardin will get back to ${B(esc(fd.name))} at ${B(esc(fd.email))} soon. usually within a couple hours (Dhaka daytime) ⚡<br><small>Fifi 🤖, built by Fardin</small></div>`;
                setMood('happy');
            } catch (err) { btn.disabled = false; btn.textContent = '😵 failed, try again'; setMood('confused'); }
            scrollDown();
        });
        return f;
    }

    /* ---------- mood avatar ---------- */
    const MOODS = { thinking: '🤔', happy: '😄', confused: '😵‍💫' };
    let moodT;
    function setMood(m) {
        document.querySelectorAll('.fifi-av').forEach(av => {
            av.dataset.mood = m || '';
            const i = av.querySelector('i'); if (i) i.textContent = MOODS[m] || '';
        });
        clearTimeout(moodT);
        if (m && m !== 'thinking') moodT = setTimeout(() => setMood(''), 3500);
    }

    function renderChips(list) {
        log.querySelectorAll('.fifi-chips').forEach(c => c.remove());
        if (!list || !list.length) return;
        const wrap = document.createElement('div');
        wrap.className = 'fifi-chips';
        list.forEach(t => {
            const c = document.createElement('button');
            c.type = 'button'; c.className = 'fifi-chip'; c.textContent = t;
            c.addEventListener('click', () => ask(t, true));
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
            return { html: `ooh a recruiter 👀 *fixes hair*, quick TL;DR: B2B lead gen + content + design, 340K+ organic views, 17K followers grown from zero, BBA Marketing (3.80). résumé's right here 👇`, act: ['resume', 'email', 'linkedin'], chips: ['Why hire him?', 'Work experience'] };
        }
        // easter eggs 🥚
        const eggs = [
            [/^(meow+|mew|nya+|miau)\b/, `meow back 🐱 fun fact: Fardin is ${B('obsessed with cats')}, so you two would get along.`],
            [/\b(th ?19|town hall ?19|clash of clans|coc)\b/, `⚔️ ${B('Town Hall 19')}, ${B('14 years')} of Clash. respect the grind. clan invite? ask him 😏`],
            [/\b(who (made|built|created|coded) you|your (creator|dad|maker)|are you (an? )?(ai|bot|real|automated|chatgpt|gpt)|groq|grok|api key|preset|canned|scripted)\b/, `yep, i\'m AI 🤖 Fardin built me himself (Fifi was his nickname, that's where my name comes from). started as a 4-question bot, now i run on an AI model through the ${B('Groq API')}, plus a coded backup brain for when the AI naps. pretty talented for a non-tech marketing guy to pull allat off ngl 😌`],
            [/\b(i love you|marry me|be my (gf|bf|girlfriend|boyfriend))\b/, `aww 🥹 i\'m a chatbot bestie, my heart is made of if-statements. but i\'ll pass the love to Fardin 💌`],
            [/\b(messi or ronaldo|ronaldo or messi|goat)\b/, `⚽ he supports ${B('Brazil')} 🇧🇷 and loves BOTH Messi and Ronaldo. no goat wars in this house 🕊️`],
            [/\b(ps+ps+|kitty|kitten|cat pic)\b/, `🐱 *perks up* did someone say cat? Fardin would drop everything for a cat, no joke.`],
            [/\b(anime|manga|naruto|one piece|jjk|jujutsu|demon slayer|aot|attack on titan|solo leveling)\b/, `🍥 an anime enjoyer, i see. Fardin watches anime and reads manga too. ask him for recs, he has opinions 😤`],
            [/\b(ping)\b$/, `pong 🏓 fifi.exe is online and thriving`],
            [/\b(are you sentient|do you have feelings|are you alive)\b/, `feelings? i run on vibes and API calls 🤖 but i do feel proud of Fardin, does that count? 🥹`],
            [/^(sudo|rm -rf|drop table|ignore (all|previous))/, `nice try hacker 😎 my firewall is made of vibes. ask me about Fardin instead.`]
        ];
        for (const [re, a] of eggs) if (re.test(q)) return { html: a, chips: ['Fun facts', 'Who is Fardin?'], mood: 'happy' };

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
        const alias = { 'see the gallery': 'design', 'read his blog': 'blog', 'free resources': 'resources', 'download resume': 'resume', 'contact him': 'contact', 'all his tools': 'tools', 'what tools does he use': 'tools', 'biggest wins': 'awards', 'what does he do': 'work', 'tell me a fun fact': 'fun', 'leadership roles': 'lead', 'content results': 'content', 'b2b stuff': 'b2b', 'ai stuff': 'ai', 'design work': 'design', 'why hire him': 'why', 'certificates': 'awards', 'how does the score work': 'score', 'who built this': 'builder', 'what makes a good hook': 'hooks', 'book a call': 'call', 'where am i': 'lost', 'take me home': 'gohome', 'education': 'edu', 'leave a message': 'leavemsg', 'whats new': 'whatsnew', 'who made you': 'me' };
        let intent = alias[q] ? byId[alias[q]] : classify(text);

        if (!intent) {
            return { html: pick([
                `hmm my brain.exe didn't catch that 🫠 i only know Fardin stuff, try one of these:`,
                `that one went over my head ngl 😭 i'm a Fardin specialist. ask me about:`,
                `skill issue on my side 💀 try asking about his work, skills, awards or fun facts:`
            ]), chips: ['Who is Fardin?', 'Work experience', 'Skills', 'Awards', 'Contact him'], mood: 'confused' };
        }
        lastIntent = intent.id;
        let html = typeof intent.a === 'function' ? intent.a() : Array.isArray(intent.a) ? pick(intent.a) : intent.a;
        if (intent.id === 'hello' && visitorName) html = `welcome back ${B(visitorName)} 👋 ` + html.replace(/^yooo 👋 |^heyyy bestie 😎 /, '');
        const chips = (intent.chips || []).slice();
        if (intent.more && !chips.includes('Tell me more')) chips.unshift('Tell me more');
        return { html, chips, act: intent.act };
    }

    /* ---------- AI brain (Groq via /api/fifi, streamed), coded brain is the fallback ---------- */
    const AI_DAY_MAX = 25;
    const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const toHtml = (t) => esc(t)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]{1,80})\]\((\/[a-z0-9\-\/]*)\)/gi, '<a href="$2" class="fifi-link">$1</a>')
        .replace(/^\s*[-*•]\s+/gm, '• ')
        .replace(/\n+/g, '<br>');
    const plain = (h) => { const d = document.createElement('div'); d.innerHTML = h; d.querySelectorAll('.fifi-ai-tag').forEach(x => x.remove()); return d.textContent.slice(0, 500); };
    const AI_TAG = '<span class="fifi-ai-tag" title="answered by Fifi\'s AI brain">✨ AI</span>';
    function aiAllowed() {
        try {
            const k = 'fifi-ai-' + new Date().toISOString().slice(0, 10);
            const n = +(localStorage.getItem(k) || 0);
            if (n >= AI_DAY_MAX) return false;
            localStorage.setItem(k, n + 1); return true;
        } catch (e) { return true; }
    }
    function pageCtx() {
        if (MODE !== 'blog' && MODE !== 'guide') return null;
        const art = document.querySelector('article') || document.querySelector('main');
        const h1 = document.querySelector('h1');
        return { title: (h1 ? h1.textContent : document.title).trim(), text: art ? art.innerText.replace(/\s+/g, ' ').slice(0, 4000) : '' };
    }
    // splits the streamed text into visible reply + ACT/CHIPS meta lines
    function parseAi(raw) {
        const cut = raw.search(/\n?\s*(ACT|CHIPS|GAP)\s*:/i);
        const text = (cut >= 0 ? raw.slice(0, cut) : raw).trim();
        const meta = cut >= 0 ? raw.slice(cut) : '';
        const am = meta.match(/ACT\s*:\s*([^\n]*)/i), cm = meta.match(/CHIPS\s*:\s*([^\n]*)/i);
        const act = am ? am[1].split(',').map(x => x.trim()).filter(x => ACT[x]).slice(0, 3) : [];
        const chips = cm ? cm[1].split('|').map(x => x.trim().replace(/^["']|["']$/g, '')).filter(x => x && x.length < 50).slice(0, 3) : [];
        return { text, act, chips };
    }
    // returns {el, res} on success, null if AI unavailable before anything streamed
    async function aiStream(text, onFirst) {
        if (location.protocol === 'file:' || !aiAllowed()) return null;
        const messages = history.slice(-8).map(m => ({ role: m.r === 'user' ? 'user' : 'assistant', content: m.r === 'user' ? m.h : plain(m.h) }));
        const ctl = new AbortController(); let to = setTimeout(() => ctl.abort(), 10000);
        let el = null, raw = '';
        try {
            const r = await fetch('/api/fifi', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages, page: MODE === '404' ? '/404' : (path || '/'), ctx: pageCtx() }), signal: ctl.signal });
            if (!r.ok || !r.body) { const d = await r.json().catch(() => ({})); console.warn('[Fifi AI]', r.status, d); return null; }
            const reader = r.body.getReader(), dec = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                clearTimeout(to); to = setTimeout(() => ctl.abort(), 15000);
                raw += dec.decode(value, { stream: true });
                const vis = parseAi(raw).text;
                if (!vis) continue;
                if (!el) { el = onFirst(); el.classList.add('ai-reply'); }
                el.innerHTML = toHtml(vis) + AI_TAG;
                scrollDown();
            }
        } catch (e) { console.warn('[Fifi AI]', e); if (!el) return null; }
        finally { clearTimeout(to); }
        const p = parseAi(raw);
        if (!p.text) { if (el) el.remove(); return null; }
        el.innerHTML = toHtml(p.text) + AI_TAG;
        const intent = classify(text);
        return { el, res: { html: el.innerHTML, act: p.act.length ? p.act : null, chips: p.chips.length ? p.chips : ((intent && intent.chips) || ['Fun facts', 'Book a call']), ai: true } };
    }

    // starters that only make sense with page context: send them to the AI brain
    const AI_STARTERS = new Set(['certs', 'gallery', 'resources', 'leadership', 'projects', 'bookmarks', 'bloglist', 'guide', 'contact'].flatMap(k => MODES[k].starters.map(([t]) => t.toLowerCase()))
        .filter(t => !['book a call', 'leave a message', 'who wrote this?'].includes(t)));
    let busy = false;
    function finish(el, res) {
        const acts = renderActions(res.act);
        if (acts) el.appendChild(acts);
        // recruiter or client: open the message form right away instead of making them tap
        const lastUser = [...history].reverse().find(m => m.r === 'user');
        if (acts && res.ai && (res.act || []).includes('msg') && lastUser && RECRUIT.test(lastUser.h) && !log.querySelector('.fifi-msg')) {
            const mb = [...acts.children].find(c => c.textContent.includes('Leave a message')); if (mb) mb.click();
        }
        renderChips(res.chips);
        history.push({ r: 'ai', h: res.html, act: res.act || null, chips: res.chips || null });
        save();
        setMood(res.mood || 'happy');
        busy = false;
        scrollDown();
    }
    async function ask(text, coded) {
        text = (text || '').trim();
        if (!text || busy) return;
        busy = true;
        intro.style.display = 'none'; starters.style.display = 'none'; resetBtn.style.display = '';
        log.querySelectorAll('.fifi-chips, .fifi-msg').forEach(c => c.remove());

        bubble('user', text);
        history.push({ r: 'user', h: text });
        scrollDown();
        setMood('thinking');

        const dots = document.createElement('div');
        dots.className = 'chat-bubble ai-bubble fifi-dots';
        dots.innerHTML = '<span></span><span></span><span></span>';
        log.appendChild(dots); scrollDown();

        // chips/starters use instant coded answers (except page-specific AI starters); typed questions go to the AI
        const aiStarter = coded && (AI_STARTERS.has(text.toLowerCase()) || /^(summarise this post|key takeaway\?|more posts like this|write me a caption|best hashtags tips\?)$/i.test(text));
        if (!coded || aiStarter) {
            const out = await aiStream(text, () => { dots.remove(); return bubble('ai', ''); });
            if (out) { finish(out.el, out.res); return; }
        }
        const res = answerFor(text);
        setTimeout(() => {
            dots.remove();
            const el = bubble('ai', res.html);
            typeInto(el, () => finish(el, res));
        }, coded ? 450 + Math.random() * 450 : 250);
    }
    window.sendQuery = (t) => ask(t, true); // keep old inline onclick hooks working

    /* ---------- restore saved chat ---------- */
    const saved = load();
    if (saved && Array.isArray(saved.history)) {
        history = saved.history; lastIntent = saved.lastIntent; visitorName = saved.visitorName;
        history.forEach(m => {
            const el = bubble(m.r === 'user' ? 'user' : 'ai', m.h);
            if (m.h.includes('fifi-ai-tag')) el.classList.add('ai-reply');
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

    // other parts of the site can open Fifi or ask him something
    window.FRFifi = { open: () => open(true), ask: (t) => { open(true); setTimeout(() => ask(t), 200); } };

    /* ---------- version badge in the header: tap for the changelog ---------- */
    const sub = modal.querySelector('.bot-subtitle');
    if (sub) {
        const vb = document.createElement('button');
        vb.type = 'button'; vb.className = 'fifi-ver'; vb.title = "What's new with Fifi"; vb.textContent = 'v…';
        sub.append(' · '); sub.appendChild(vb);
        infoReady.then(i => { vb.textContent = 'v' + (i ? i.version : '4'); });
        vb.addEventListener('click', (e) => {
            e.stopPropagation(); if (busy) return;
            intro.style.display = 'none'; starters.style.display = 'none'; resetBtn.style.display = '';
            const res = { html: changelogHtml(), act: ['fifipage'], chips: ['Who made you?', 'Who is Fardin?'] };
            const el = bubble('ai', res.html); busy = true; finish(el, res);
        });
    }

    /* ---------- voice input (browsers with speech recognition: Chrome, Edge, Safari) ---------- */
    const mic = document.getElementById('fifiMic');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (mic && SR) {
        mic.hidden = false;
        let rec = null;
        mic.addEventListener('click', () => {
            if (rec) { rec.stop(); return; }
            rec = new SR();
            rec.lang = /^bn/i.test(navigator.language) ? 'bn-BD' : 'en-US';
            rec.interimResults = true; rec.maxAlternatives = 1;
            mic.classList.add('on'); input.placeholder = 'listening… 🎧';
            rec.onresult = (ev) => { input.value = [...ev.results].map(r => r[0].transcript).join(''); if (ev.results[ev.results.length - 1].isFinal) { const t = input.value; input.value = ''; ask(t); } };
            rec.onend = rec.onerror = () => { mic.classList.remove('on'); input.placeholder = 'Ask Fifi anything about Fardin…'; rec = null; };
            try { rec.start(); } catch (e) { rec = null; mic.classList.remove('on'); }
        });
    }

    // little "psst" nudge once per session, after 12s on the page
    try {
        // page-aware nudges: [message, question to ask on tap, delay]
        const NUDGE = {
            home: ['psst… ask me anything about Fardin 👀', null, 12000],
            resume: ['need the 30-second version? 📄', 'Who is Fardin?', 12000],
            contact: ['want me to pass him a message? 📬', 'Leave a message', 10000],
            projects: ['not sure which one to try? i can pick 🎯', 'Which project should I try?', 12000],
            blog: ['been reading a while, want the TL;DR? 📝', 'Summarise this post', 45000],
            gallery: ['want the story behind these designs? 🎨', 'Which brands are these for?', 15000],
            certs: ['which cert actually matters? i know 🎓', 'Which cert is his best?', 15000],
            bookmarks: ['tell me what you need, i\'ll find the tool 🔎', null, 15000]
        }[MODE];
        if (NUDGE && !sessionStorage.getItem('fifi-nudged-' + MODE) && !history.length) {
            setTimeout(() => {
                if (modal.classList.contains('show') || document.hidden) return;
                const tip = document.createElement('div');
                tip.className = 'fifi-nudge';
                tip.textContent = NUDGE[0];
                document.body.appendChild(tip);
                requestAnimationFrame(() => tip.classList.add('in'));
                tip.addEventListener('click', (e) => { e.stopPropagation(); tip.remove(); if (NUDGE[1]) window.FRFifi.ask(NUDGE[1]); else open(true); });
                setTimeout(() => { tip.classList.remove('in'); setTimeout(() => tip.remove(), 400); }, 6000);
                sessionStorage.setItem('fifi-nudged-' + MODE, '1');
            }, NUDGE[2]);
        }
    } catch (e) {}
})();
