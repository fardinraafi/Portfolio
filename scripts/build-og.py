#!/usr/bin/env python3
"""Branded 1200x630 share cards (og:image) for each page. Run from repo root:
    python3 scripts/build-og.py <syne800.ttf> <dmsans.ttf> <dmsans700.ttf>
Writes misc_img/og/<slug>.jpg and points each page's og:image / twitter:image at it."""
import re, sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SYNE, DM, DMB = sys.argv[1:4]
W, H = 1200, 630
C1, C2, C3 = (37, 99, 235), (124, 58, 237), (219, 39, 119)
L1, L2, L3 = (96, 165, 250), (167, 139, 250), (244, 114, 182)  # lighter tints for text on dark
PAGES = [  # file, slug, kicker, title, subtitle
    ('certificates.html', 'certificates', 'CERTIFICATES', '58 certificates\n& awards', 'HubSpot, Google, OpenAI, Grameenphone and more'),
    ('contact.html', 'contact', "LET'S TALK", 'Work with\nFardin Raafi', 'Marketing, branding & B2B growth · Dhaka'),
    ('gallery.html', 'gallery', 'GALLERY', 'Design work\n& campaigns', 'Posters, social creatives and brand visuals'),
    ('resources.html', 'resources', 'FREE RESOURCES', 'Marketing guides\nthat actually help', 'Frameworks, prompts and playbooks'),
    ('resume.html', 'resume', 'RESUME', 'Marketing Executive\n@ Augmex', 'Lead gen · Content · Design · 340K+ views'),
    ('volunteer.html', 'leadership', 'LEADERSHIP', 'Leadership &\ncommunity', 'Rotaract, BUBT Career Office, Hult Prize, TEDx'),
    ('blog.html', 'blog', 'BLOG', 'Marketing, AI &\npersonal branding', 'Case studies and honest takes'),
    ('projects/index.html', 'projects', 'PROJECTS', 'Free tools &\ngames I built', 'Hook Lab · Swipe the Hook · Caption Maker'),
    ('projects/hook-lab.html', 'hook-lab', 'FREE TOOL', 'Hook Lab', 'Will your first line stop the scroll?'),
    ('projects/swipe-the-hook.html', 'swipe-the-hook', 'FREE GAME', 'Swipe the Hook', 'Swipe right on scroll-stoppers. Can you beat 15/15?'),
    ('projects/caption-maker.html', 'caption-maker', 'FREE TOOL', 'Caption Maker', 'AI captions & hashtags in 7 styles'),
    ('projects/bookmarks.html', 'bookmarks', 'MY BOOKMARKS', '120 free tools\nI actually use', 'AI, design, SEO, stock photos and fun'),
    ('projects/linkedin-clone.html', 'linkedin-archive', 'LINKEDIN ARCHIVE', 'My whole LinkedIn,\none page', '24 roles · 58 certs · 164 posts'),
    ('human-content-framework-by-fardin-rahman-khan-raafi.html', 'human-content-framework', 'GUIDEBOOK', 'The Human Content\nFramework', 'Write content people actually feel'),
    ('self-training-guidebook-masterprompt-by-fardinraafi.html', 'masterprompt-guidebook', 'GUIDEBOOK', 'Self-Training\nMasterprompt', 'Train AI to work like you'),
]


def card(kicker, title, sub, avatar):
    im = Image.new('RGB', (W, H), (2, 6, 23))
    glow = Image.new('RGB', (W, H), (2, 6, 23)); g = ImageDraw.Draw(glow)
    for (x, y, r, c) in [(150, 120, 380, C1), (1060, 160, 360, C2), (900, 640, 420, C3)]:
        g.ellipse((x - r, y - r, x + r, y + r), fill=tuple(int(v * .42) for v in c))
    im = Image.blend(im, glow.filter(ImageFilter.GaussianBlur(140)), 1)
    d = ImageDraw.Draw(im)
    dots = Image.new('RGB', (W, H), (0, 0, 0)); dd = ImageDraw.Draw(dots)
    for gx in range(24, W, 48):
        for gy in range(24, H, 48): dd.ellipse((gx - 1, gy - 1, gx + 1, gy + 1), fill=(255, 255, 255))
    im = Image.blend(im, Image.composite(Image.new('RGB', (W, H), (90, 100, 140)), im, dots.convert('L')), .35); d = ImageDraw.Draw(im)
    fk, fs, fb = ImageFont.truetype(DMB, 26), ImageFont.truetype(DM, 34), ImageFont.truetype(DMB, 28)
    x = 80
    d.rounded_rectangle((x, 92, x + d.textlength(kicker, font=fk) + 40, 140), radius=24, fill=(124, 58, 237))
    d.text((x + 20, 101), kicker, font=fk, fill='white')
    size = 92
    while size > 50:  # fit title
        ft = ImageFont.truetype(SYNE, size)
        if max(d.textlength(l, font=ft) for l in title.split('\n')) < 760: break
        size -= 4
    y = 175
    for line in title.split('\n'):
        # gradient text
        tw = int(d.textlength(line, font=ft)); th = size + 20
        mask = Image.new('L', (tw + 10, th)); ImageDraw.Draw(mask).text((0, 0), line, font=ft, fill=255)
        grad = Image.new('RGB', (tw + 10, th))
        for gx in range(tw + 10):
            t = gx / max(1, tw)
            c = tuple(int(255 * (1 - t * .15)) for _ in range(3)) if line == title.split('\n')[0] else \
                tuple(int(L1[k] + (L2[k] - L1[k]) * min(1, t * 2) + (L3[k] - L2[k]) * max(0, t * 2 - 1)) for k in range(3))
            ImageDraw.Draw(grad).line([(gx, 0), (gx, th)], fill=c)
        im.paste(grad, (x, y), mask); y += int(size * 1.08)
    d.text((x, y + 22), sub, font=fs, fill=(203, 213, 225))
    # footer: avatar + name + url
    av = Image.open(avatar).convert('RGB').resize((84, 84))
    m = Image.new('L', (84, 84)); ImageDraw.Draw(m).ellipse((0, 0, 83, 83), fill=255)
    im.paste(av, (x, H - 132), m)
    d.ellipse((x - 3, H - 135, x + 87, H - 45), outline=(124, 58, 237), width=3)
    d.text((x + 108, H - 122), 'Fardin Rahman Khan Raafi', font=fb, fill='white')
    d.text((x + 108, H - 84), 'fardinraafi.com', font=ImageFont.truetype(DM, 26), fill=(147, 197, 253))
    fr = ImageFont.truetype(SYNE, 64)
    d.text((W - 80 - d.textlength('FRKR', font=fr), H - 120), 'FR', font=fr, fill='white')
    d.text((W - 80 - d.textlength('KR', font=fr), H - 120), 'KR', font=fr, fill=(167, 139, 250))
    return im


os.makedirs('misc_img/og', exist_ok=True)
for f, slug, k, t, s in PAGES:
    if not os.path.exists(f): print('skip', f); continue
    card(k, t, s, 'misc_img/avatar-320.webp').save(f'misc_img/og/{slug}.jpg', quality=86, optimize=True, progressive=True)
    url = f'https://fardinraafi.com/misc_img/og/{slug}.jpg'
    h = open(f, encoding='utf-8').read()
    h = re.sub(r'(<meta property="og:image" content=")[^"]*', r'\g<1>' + url, h)
    h = re.sub(r'(<meta name="twitter:image" content=")[^"]*', r'\g<1>' + url, h)
    if '<meta property="og:image:width"' not in h:
        h = h.replace(f'<meta property="og:image" content="{url}">', f'<meta property="og:image" content="{url}">\n    <meta property="og:image:width" content="1200">\n    <meta property="og:image:height" content="630">', 1)
    open(f, 'w', encoding='utf-8').write(h)
    print('ok', slug)
