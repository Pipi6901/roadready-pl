# -*- coding: utf-8 -*-
"""Prints the next questions still lacking a translation into a language.

Usage: python scripts/katalog_next.py <lang> [count] [--licence B] [--offset N]

Output, one question per line, tab-separated: id, class (b/s), Polish text,
then the A/B/C options for specialist questions. Order: questions asked for
the given licence first (default B — the common case), then everything else,
each in section order. Counts what is done so far, so a hand-translated
chunk folder (content/katalog/translations/<lang>/*.json) is picked up.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
# import_katalog re-wraps stdout as UTF-8 on import; do not wrap it again here.
from import_katalog import OUT_DIR, generated_files  # noqa: E402

lang = sys.argv[1]
count = int(sys.argv[2]) if len(sys.argv) > 2 and not sys.argv[2].startswith('--') else 60
licence = sys.argv[sys.argv.index('--licence') + 1] if '--licence' in sys.argv else 'B'
offset = int(sys.argv[sys.argv.index('--offset') + 1]) if '--offset' in sys.argv else 0

with open(os.path.join(OUT_DIR, 'content.json'), encoding='utf-8') as f:
    content = json.load(f)
done = set(content['translations'].get(lang, {}))
gen_dir = os.path.join(OUT_DIR, 'translations')
if os.path.isdir(gen_dir):
    for loc, path in generated_files(gen_dir):
        if loc == lang:
            with open(path, encoding='utf-8') as f:
                done.update(json.load(f))

topic_order = {t['id']: i for i, t in enumerate(content['topics'])}
todo = [q for q in content['questions'] if q['id'] not in done]
todo.sort(key=lambda q: (0 if licence in q['licences'] else 1, topic_order.get(q['topicId'], 99)))
print(f'# {lang}: done {len(done)} of {len(content["questions"])}, left {len(todo)}; showing {offset}..{offset + count}', file=sys.stderr)
for q in todo[offset:offset + count]:
    cells = [q['id'], 'b' if q['category'] == 'basic' else 's', q['text']]
    if q['category'] != 'basic':
        cells += [o['text'] for o in q['options']]
    print('\t'.join(cells))
