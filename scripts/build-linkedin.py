# Builds the sanitized public data file for /projects/linkedin-clone from a LinkedIn export folder.
# Usage: python3 -I build_li.py <export_dir> <out_json>
import csv, json, re, sys, os, html, collections
src, out = sys.argv[1], sys.argv[2]
R = lambda f: list(csv.DictReader(open(os.path.join(src, f), encoding='utf-8-sig')))
clean = lambda s: html.unescape((s or '').replace('\u2014', ', ').replace('\u2013', '-')).strip()
p = R('Profile.csv')[0]
summary = clean(p['Summary'])
summary = re.sub(r'(🔷)', r'\n\n\1', summary).replace('Check out my website!', '\n\nCheck out my website!')
profile = {  # address + birth date intentionally excluded
    'name': clean(p['First Name'] + ' ' + p['Last Name']), 'headline': clean(p['Headline']), 'summary': summary.strip(),
    'industry': clean(p['Industry']), 'location': clean(p['Geo Location']), 'website': 'https://fardinraafi.com',
    'linkedin': 'https://www.linkedin.com/in/fardinraafi'}
def ym(s):
    m = re.match(r'([A-Za-z]{3}) (\d{4})', s or '')
    if m: return int(m.group(2)) * 12 + 'JanFebMarAprMayJunJulAugSepOctNovDec'.index(m.group(1)) // 3
    m = re.match(r'(\d{4})', s or ''); return int(m.group(1)) * 12 if m else 0
pos = [dict(company=clean(x['Company Name']), title=clean(x['Title']), desc=clean(x['Description']), location=clean(x['Location']),
            start=x['Started On'], end=x['Finished On']) for x in R('Positions.csv')]
pos.sort(key=lambda x: (ym(x['end']) if x['end'] else 10**9, ym(x['start'])), reverse=True)
edu = [dict(school=clean(x['School Name']), degree=clean(x['Degree Name']), start=x['Start Date'], end=x['End Date'], activities=clean(x['Activities'])) for x in R('Education.csv')]
endo = collections.Counter(x['Skill Name'] for x in R('Endorsement_Received_Info.csv') if x['Endorsement Status'] == 'ACCEPTED')  # counts only, no names
skills = [dict(name=clean(x['Name']), endorsements=endo.get(x['Name'], 0)) for x in R('Skills.csv')]
match = json.load(open('/tmp/certmatch.json'))
certs = []
for i, x in enumerate(R('Certifications.csv')):  # license numbers intentionally excluded
    c = dict(name=clean(x['Name']).rstrip('.: '), issuer=clean(x['Authority']), issued=x['Started On'], expires=x['Finished On'], url=x['Url'].strip())
    if str(i) in match: c['img'] = match[str(i)]
    certs.append(c)
certs.sort(key=lambda c: ym(c['issued']), reverse=True)
honors = [dict(title=clean(x['Title']), desc=clean(x['Description']), date=x['Issued On']) for x in R('Honors.csv')]
projects = [dict(title=clean(x['Title']), desc=clean(x['Description']), url=x['Url'], start=x['Started On'], end=x['Finished On']) for x in R('Projects.csv')]
vol = [dict(org=clean(x['Company Name']), role=clean(x['Role']), cause=x['Cause'], start=x['Started On'], end=x['Finished On'], desc=clean(x['Description'])) for x in R('Volunteering.csv')]
recs = [dict(name=clean(x['First Name'] + ' ' + x['Last Name']), title=clean(x['Job Title']), company=clean(x['Company']), text=clean(x['Text']), date=x['Creation Date'].split(',')[0])
        for x in R('Recommendations_Received.csv') if x['Status'] == 'VISIBLE']
posts = []
for x in R('Shares.csv'):  # public posts only; media links skipped (they carry access tokens)
    if x['Visibility'] not in ('MEMBER_NETWORK', 'PUBLIC'): continue
    t = clean(x['ShareCommentary']).replace('""', '"')
    t = re.sub(r'\\n|\r', '\n', t)
    t = re.sub(r'"\s*\n\s*"', '\n', t).strip().strip('"').strip()
    t = re.sub(r'(?m)^"(?=\S)', '', t); t = re.sub(r'(?m)(?<=\S)"$', '', t)
    t = re.sub(r'\n{3,}', '\n\n', t)
    posts.append(dict(date=x['Date'][:10], text=t, link=x['ShareLink'], shared=x['SharedUrl'] if x['SharedUrl'].startswith('http') and 'licdn' not in x['SharedUrl'] else ''))
posts.sort(key=lambda p: p['date'], reverse=True)
BLOG = {'200k-hidden': 'free-ai-developer-tools-for-students', 'ai-certification': 'ai-certifications-hype-vs-practical-skills', 'chatgpt-ads': 'chatgpt-ads-future-of-ai-marketing',
        'keyboard-dying': 'ai-voice-dictation-keyboard-is-dying', 'case-study-series-1-brainrot': 'brainrot-marketing-case-study', 'modern-marketing-why-brands': 'why-brands-pay-to-get-roasted'}
arts = []
adir = os.path.join(src, 'Articles/Articles')
for f in sorted(os.listdir(adir)):
    if re.match(r'\d{4}-\d{2}-\d{2} ', f): continue  # drafts / copies
    s = open(os.path.join(adir, f), encoding='utf-8').read()
    t = re.search(r'<title>(.*?)</title>', s, re.S) or re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S)
    title = clean(re.sub(r'<[^>]+>', '', t.group(1))) if t else f
    body = clean(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', re.search(r'<body.*?>(.*)</body>', s, re.S).group(1))))
    pub = re.search(r'Published on\s*([0-9\-/: ]+)', s) or re.search(r'(\d{4}-\d{2}-\d{2})', s)
    slug = next((v for k, v in BLOG.items() if f.startswith(k)), '')
    body = re.sub(r'^.*?Published on [0-9\-: ]+', '', body).strip()
    arts.append(dict(title=title, excerpt=body[:220].rsplit(' ', 1)[0] + '…', date=(pub.group(1).strip()[:10] if pub else ''),
                     blog='/blog/' + slug if slug else '', linkedin='https://www.linkedin.com/pulse/' + f[:-5]))
data = dict(profile=profile, positions=pos, education=edu, skills=skills, certifications=certs, honors=honors, projects=projects,
            volunteering=vol, recommendations=recs, posts=posts, articles=arts, exported='2026-11-24')
json.dump(data, open(out, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print({k: len(v) for k, v in data.items() if isinstance(v, list)}, os.path.getsize(out) // 1024, 'KB')
