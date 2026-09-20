# -*- coding: utf-8 -*-
"""Prints the next questions still lacking a translation — or an explanation —
in a language.

Usage: python scripts/katalog_next.py <lang> [count] [--licence B] [--offset N] [--expl]

Without --expl: questions with no translation into <lang>. Output, one per
line, tab-separated: id, class (b/s), Polish text, then the A/B/C options for
specialist questions.

With --expl: questions with no explanation in <lang> (`pl` = the question's
own explanation, any other language = the explanation of its translation
entry). Output: id, class, correct answer (T/N or A/B/C), Polish text, options,
then the text/options already translated into <lang> so the writer sees the
wording the learner sees, and finally the Polish explanation to translate.

Order: questions asked for the given licence first (default B — the common
case), then everything else, each in section order. Counts what is done so
far, so hand-written chunk folders (content/katalog/translations/<lang>/*.json,
content/katalog/explanations/<lang>/*.json) are picked up.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
# import_katalog re-wraps stdout as UTF-8 on import; do not wrap it again here.
from import_katalog import OUT_DIR, generated_files  # noqa: E402

lang = sys.argv[1]
count = int(sys.argv[2]) if len(sys.argv) > 2 and not sys.argv[2].startswith('--') else 60
licence = sys.argv[sys.argv.index('--licence') + 1] if '--licence' in sys.argv else 'B'
offset = int(sys.argv[sys.argv.index('--offset') + 1]) if '--offset' in sys.argv else 0
expl = '--expl' in sys.argv

with open(os.path.join(OUT_DIR, 'content.json'), encoding='utf-8') as f:
    content = json.load(f)
translations = content['translations']


def chunk_ids(folder, loc):
    ids = set()
    d = os.path.join(OUT_DIR, folder)
    if os.path.isdir(d):
        for l, path in generated_files(d):
            if l == loc:
                with open(path, encoding='utf-8') as f:
                    ids.update(k for k, v in json.load(f).items() if v)
    return ids


if expl:
    if lang == 'pl':
        done = {q['id'] for q in content['questions'] if q['explanation']}
    else:
        done = {qid for qid, e in translations.get(lang, {}).items() if e.get('explanation')}
    done |= chunk_ids('explanations', lang)
else:
    done = set(translations.get(lang, {})) | chunk_ids('translations', lang)

topic_order = {t['id']: i for i, t in enumerate(content['topics'])}
todo = [q for q in content['questions'] if q['id'] not in done]
todo.sort(key=lambda q: (0 if licence in q['licences'] else 1, topic_order.get(q['topicId'], 99)))
what = 'explanation' if expl else 'translation'
print(f'# {lang} {what}: done {len(done)} of {len(content["questions"])}, left {len(todo)}; showing {offset}..{offset + count}', file=sys.stderr)
for q in todo[offset:offset + count]:
    cells = [q['id'], 'b' if q['category'] == 'basic' else 's']
    if expl:
        cells.append(q['correctOptionId'])
    cells.append(q['text'])
    if q['category'] != 'basic':
        cells += [o['text'] for o in q['options']]
    if expl and lang != 'pl':
        tr = translations.get(lang, {}).get(q['id'])
        if tr:
            cells.append(tr['text'])
            cells += [tr['options'].get(o['id'], '') for o in q['options']]
        cells.append(q['explanation'])
    print('\t'.join(cells))
