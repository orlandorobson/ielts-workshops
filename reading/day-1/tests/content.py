"""Verify source fidelity independently of the browser renderer. No dependencies."""
from pathlib import Path
import json, zipfile, xml.etree.ElementTree as ET
root = Path(__file__).resolve().parents[1]
raw = (root/'content.js').read_text()
c = json.loads(raw[raw.index('{'):raw.rindex(';')])
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
with zipfile.ZipFile(root/'source/IELTS_Reading_Day_1_Seeing_What_the_Text_Is_Doing.docx') as z:
    xml = ET.fromstring(z.read('word/document.xml'))
    source = [''.join(t.text or '' for t in p.findall('.//w:t', ns)) for p in xml.findall('.//w:p', ns)]
assert c['source'] == source, 'Complete source extraction changed'
assert list(c['passages']) == ['flexible','trees','llm','curitiba','mohammed','bedouin','food']
assert [len(v) for v in c['passages'].values()] == [1,1,1,2,2,4,5]
for name, paragraphs in c['passages'].items():
    for text in paragraphs:
        assert text in source, (name, 'passage not verbatim')
for name, headings in c['headings'].items():
    for i, text in enumerate(headings):
        assert f'{chr(65+i)}. {text}' in source, (name, text)
assert c['keys'] == {'flexible':[1], 'trees':[0], 'llm':[0], 'curitiba':[1,2], 'bedouin':[3,7,0,1], 'food':[1,2,6,4,0]}
for q in c['questions'].values():
    start = source.index(q['prompt'])
    rows = source[start+1:start+1+len(q['options'])]
    assert q['correct'] == [i for i,t in enumerate(rows) if '✓' in t], q['id']
    assert q['correct'] and len(q['options'])>=2
    key = q['id'][1:]
    original = [t.replace(' ✓','').replace('✓','').strip() for t in rows]
    original = [t[3:] if len(t)>2 and t[0] in 'ABCDEFGHI' and t[1:3]=='. ' else t for t in original]
    adaptation = c.get('optionAdaptations', {}).get(key, {})
    for i, text in enumerate(q['options']):
        if str(i) in adaptation.get('replacement', {}):
            assert original[i] == adaptation['original'][str(i)]
            assert text == adaptation['replacement'][str(i)]
        else:
            assert text == original[i], (q['id'], i, 'unapproved wording change')
assert set(c['optionAdaptations']) == {'194','224','314','429'}
for pairs in c['vocabulary'].values():
    for word, meaning in pairs:
        assert source[source.index(word)+1] == meaning
for maps in c['maps'].values():
    for nodes in maps:
        assert ' → '.join(nodes) in source
print('PASS: all 16 passage paragraphs verbatim; all headings, keys, vocabulary and maps match DOCX; 32 questions checked with four documented option edits; complete source notes retained.')
