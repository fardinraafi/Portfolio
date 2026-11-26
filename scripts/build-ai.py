#!/usr/bin/env python3
"""Build AI-friendly files for fardinraafi.com. Run from the repo root after adding or editing a blog post:
    python3 scripts/build-ai.py
- blog/<slug>.md       markdown copy of every post
- llms-full.txt        everything an LLM needs in one file
- blog posts           TL;DR box, author box, markdown alternate link (idempotent)
"""
import glob, html, json, os, re
from html.parser import HTMLParser

SITE = 'https://fardinraafi.com'
DEF = ("Fardin Rahman Khan Raafi (Fardin Raafi) is a B2B Marketing Executive at Augmex Technologies in Dhaka, Bangladesh, "
       "specialising in lead generation, content marketing and design. In 2026 he drove 340K+ organic views and grew "
       "the sneaker brand FYGO from 0 to 17K+ followers.")


class MD(HTMLParser):
    """Tiny HTML to Markdown converter for blog articles."""
    SKIP = ('keep-reading', 'ai-author', 'ai-tldr', 'meta-info', 'post-crumbs')

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.skip, self.href, self.list = [], 0, None, []

    def handle_starttag(self, t, a):
        a = dict(a); cls = a.get('class') or ''; sty = a.get('style') or ''
        if self.skip:
            if t in ('div', 'section', 'nav'): self.skip += 1
            return
        if t in ('div', 'section', 'nav') and (any(c in cls for c in self.SKIP) or 'margin-top: 4rem' in sty or 'text-align: right' in sty):
            self.skip = 1; return
        if t in ('script', 'style'): self.skip = 1; return
        if t in ('h1', 'h2', 'h3', 'h4'): self.out.append('\n\n' + '#' * int(t[1]) + ' ')
        elif t == 'p': self.out.append('\n\n')
        elif t == 'br': self.out.append('  \n')
        elif t in ('ul', 'ol'): self.list.append(t); self.out.append('\n')
        elif t == 'li': self.out.append('\n' + ('1. ' if self.list and self.list[-1] == 'ol' else '- '))
        elif t in ('strong', 'b'): self.out.append('**')
        elif t in ('em', 'i'): self.out.append('*')
        elif t == 'a': self.href = a.get('href'); self.out.append('[')
        elif t == 'img' and a.get('src'):
            src = a['src'] if a['src'].startswith('http') else SITE + a['src']
            self.out.append(f'\n\n![{a.get("alt", "")}]({src})\n\n')
        elif t == 'div' and 'blog-quote' in cls: self.out.append('\n\n> ')
        elif t == 'div' and 'card-title' in cls: self.out.append('\n\n### ')
        elif t == 'div' and 'stylized-card' in cls: self.out.append('\n\n')

    def handle_endtag(self, t):
        if self.skip:
            if t in ('div', 'section', 'nav', 'script', 'style'): self.skip -= 1
            return
        if t in ('strong', 'b'): self.out.append('**')
        elif t in ('em', 'i'): self.out.append('*')
        elif t == 'a':
            h = self.href or ''
            if h.startswith('/'): h = SITE + h
            self.out.append(f']({h})'); self.href = None
        elif t in ('ul', 'ol'):
            if self.list: self.list.pop()
            self.out.append('\n')

    def handle_data(self, d):
        if not self.skip: self.out.append(re.sub(r'\s+', ' ', d))

    def text(self):
        s = ''.join(self.out)
        s = re.sub(r'[ \t]+\n', '\n', s); s = re.sub(r'\n{3,}', '\n\n', s)
        s = re.sub(r'\n> \s+', '\n> ', s)
        return s.strip()


def meta(s, name):
    m = re.search(rf'<meta (?:name|property)="{name}" content="([^"]*)"', s)
    return html.unescape(m.group(1)) if m else ''


def posts():
    out = []
    for f in sorted(glob.glob('blog/*.html')):
        s = open(f, encoding='utf-8').read()
        slug = os.path.basename(f)[:-5]
        title = html.unescape(re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S).group(1))
        title = re.sub(r'<[^>]+>', '', title).strip()
        pub = re.search(r'"datePublished": *"([^"]+)"', s); mod = re.search(r'"dateModified": *"([^"]+)"', s)
        art = re.search(r'<article[^>]*>(.*)</article>', s, re.S).group(1)
        p = MD(); p.feed(art)
        out.append(dict(f=f, slug=slug, title=title, desc=meta(s, 'description'),
                        pub=pub.group(1) if pub else '', mod=mod.group(1) if mod else '', md=p.text(), src=s))
    return out


TLDR = '<div class="ai-tldr"><b>TL;DR</b> {d}</div>'
AUTHOR = ('<div class="ai-author">'
          '<img src="/misc_img/avatar-320.webp" alt="Fardin Rahman Khan Raafi" width="64" height="64" loading="lazy">'
          '<div><span class="ai-a-k">Written by</span><a class="ai-a-n" href="/" rel="author">Fardin Rahman Khan Raafi</a>'
          '<p>{defn}</p>'
          '<div class="ai-a-l"><a href="/resume">Resume</a><a href="https://www.linkedin.com/in/fardinraafi" target="_blank" rel="noopener">LinkedIn</a>'
          '<a href="/blog">More posts</a><a href="/blog/{slug}.md">Markdown</a></div></div></div>')
CSS = ('<style id="ai-blog-css">.ai-tldr{margin:1.2rem 0 1.6rem;padding:1rem 1.2rem;border-radius:14px;background:rgba(124,58,237,.08);'
       'border-left:4px solid var(--c2);font-size:1.02rem;line-height:1.6;color:var(--text-main)}.ai-tldr b{color:var(--c2);margin-right:6px;font-family:Syne,sans-serif}'
       '.ai-author{display:flex;gap:1rem;align-items:flex-start;margin:2.5rem 0 1rem;padding:1.3rem;border-radius:18px;border:1px solid rgba(148,163,184,.25);background:rgba(148,163,184,.06)}'
       '.ai-author img{width:64px;height:64px;border-radius:50%;object-fit:cover;flex:none}.ai-a-k{display:block;font-size:.75rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted)}'
       '.ai-a-n{font-family:Syne,sans-serif;font-weight:800;font-size:1.15rem;color:var(--text-main);text-decoration:none}.ai-author p{margin:.4rem 0 .6rem!important;font-size:.95rem!important;line-height:1.55;color:var(--text-muted)}'
       '.ai-a-l{display:flex;flex-wrap:wrap;gap:.5rem}.ai-a-l a{font-size:.82rem;font-weight:700;padding:5px 12px;border-radius:100px;border:1px solid rgba(148,163,184,.3);color:var(--text-main);text-decoration:none}'
       '.ai-a-l a:hover{border-color:var(--c2)}@media(max-width:600px){.ai-author{flex-direction:column}}</style>')


def upgrade(p):
    s = p['src']; o = s
    if 'id="ai-blog-css"' not in s: s = s.replace('</head>', CSS + '\n</head>', 1)
    if 'type="text/markdown"' not in s:
        s = s.replace('</head>', f'<link rel="alternate" type="text/markdown" href="/blog/{p["slug"]}.md" title="Markdown version">\n</head>', 1)
    if 'class="ai-tldr"' not in s and p['desc']:
        s = re.sub(r'(<div class="meta-info">.*?</div>)', lambda m: m.group(1) + '\n    ' + TLDR.format(d=html.escape(p['desc'])), s, count=1, flags=re.S)
    if 'class="ai-author"' not in s:
        s = s.replace('<section class="keep-reading"', AUTHOR.format(defn=html.escape(DEF), slug=p['slug']) + '\n    <section class="keep-reading"', 1)
    # richer Person schema
    if '"jobTitle": "Marketing Executive"' not in s:
        s = s.replace('"@type": "Person",\n   "name": "Fardin Rahman Khan Raafi",',
                      '"@type": "Person",\n   "name": "Fardin Rahman Khan Raafi",\n   "alternateName": "Fardin Raafi",\n   "description": ' + json.dumps(DEF) + ',\n   "jobTitle": "Marketing Executive",\n   "worksFor": {"@type": "Organization", "name": "Augmex Technologies Ltd."},', 1)
    # richer author in BlogPosting schema
    s = re.sub(r'("author": *\{\s*"@type": *"Person",\s*"name": *"[^"]+")(?![^}]*"description")',
               lambda m: m.group(1) + f',\n     "description": {json.dumps(DEF)},\n     "jobTitle": "Marketing Executive",\n     "worksFor": {{"@type": "Organization", "name": "Augmex Technologies Ltd."}}',
               s, count=1)
    if s != o: open(p['f'], 'w', encoding='utf-8').write(s)


def main():
    ps = posts()
    for p in ps:
        upgrade(p)
        head = f"# {p['title']}\n\nBy [Fardin Rahman Khan Raafi]({SITE}/) · Published {p['pub']}" + (f" · Updated {p['mod']}" if p['mod'] and p['mod'] != p['pub'] else '')
        head += f"\nOriginal: {SITE}/blog/{p['slug']}\n\n**TL;DR:** {p['desc']}\n"
        body = re.sub(r'(?m)^# .*\n+', '', p['md'], count=1)
        open(f"blog/{p['slug']}.md", 'w', encoding='utf-8').write(head + '\n' + body + f"\n\n---\n\n*About the author:* {DEF}\n")

    llms = open('llms.txt', encoding='utf-8').read()
    resume = open('resume.md', encoding='utf-8').read() if os.path.exists('resume.md') else ''
    parts = [f"# Fardin Rahman Khan Raafi (Fardin Raafi) - full content for LLMs\n\n> {DEF}\n\nWebsite: {SITE} · Short version: {SITE}/llms.txt\n",
             "## Overview\n\n" + re.sub(r'^# .*\n+', '', llms).strip(),
             "## Resume\n\n" + re.sub(r'^# .*\n+', '', resume).strip()]
    for p in ps:
        parts.append(f"## Blog: {p['title']}\n\nURL: {SITE}/blog/{p['slug']} · Published {p['pub']}\n\n**TL;DR:** {p['desc']}\n\n" + re.sub(r'(?m)^# .*\n+', '', p['md'], count=1))
    open('llms-full.txt', 'w', encoding='utf-8').write('\n\n---\n\n'.join(parts).replace('—', ', ').replace('–', '-') + '\n')
    print(f'{len(ps)} posts -> markdown + llms-full.txt ({os.path.getsize("llms-full.txt") // 1024} KB)')


if __name__ == '__main__':
    main()
