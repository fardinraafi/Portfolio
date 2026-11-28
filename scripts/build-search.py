#!/usr/bin/env python3
"""Builds api/_site.json: small text chunks from every blog post so Fifi can quote the exact
paragraph and link to it. Run after adding or editing a post (build-ai.py runs it for you)."""
import glob, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def clean(t):
    t = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', t)            # images
    t = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', t)         # links -> text
    t = re.sub(r'[*_`>#]', '', t)
    return re.sub(r'\s+', ' ', t).strip()


def main():
    chunks = []
    for f in sorted(glob.glob(os.path.join(ROOT, 'blog', '*.md'))):
        slug = os.path.basename(f)[:-3]
        lines = open(f, encoding='utf-8').read().split('\n')
        title = lines[0].lstrip('# ').strip()
        sec, buf = '', []

        def flush():
            text = clean(' '.join(buf))
            if len(text) > 60:
                for i in range(0, len(text), 700):
                    chunks.append({'u': '/blog/' + slug, 't': title, 's': sec, 'x': text[i:i + 700]})
            buf.clear()

        for ln in lines[1:]:
            if ln.startswith(('By ', 'Original:', '**TL;DR')) or ln.startswith('!['):
                continue
            if ln.startswith('#'):
                flush(); sec = clean(ln); continue
            if re.match(r'^(Written by|---)', ln):
                break
            buf.append(ln)
            if sum(len(b) for b in buf) > 650: flush()
        flush()
    out = os.path.join(ROOT, 'api', '_site.json')
    json.dump(chunks, open(out, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f'search index: {len(chunks)} chunks ({os.path.getsize(out) // 1024} KB)')


if __name__ == '__main__':
    main()
