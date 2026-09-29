"""Check unchanged source passages, approved overrides and strict answer keys."""
from pathlib import Path
import json,zipfile,xml.etree.ElementTree as E,subprocess
root=Path(__file__).resolve().parents[1]
s=(root/'luxury-content.js').read_text();c=json.loads(s[s.index('{'):s.rindex(';')])
with zipfile.ZipFile(root/'source'/c['sourceFile']) as z:r=E.fromstring(z.read('word/document.xml'))
n={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
s=[''.join(t.text or '' for t in p.findall('.//w:t',n)) for p in r.findall('.//w:p',n)]
assert c['source']==s[784:]
assert c['ferrari']['paragraphs']==[s[i][11:] for i in range(794,797)]
assert c['amouage']['paragraphs']==[s[i][11:] for i in range(821,826)]
assert c['ferrari']['nuance']==s[813:817]
expected={830:'3. Find an ingredient that the passage says appears in numerous Amouage compositions.',867:'6. Amouage describes its customers seeking unusual and personal products using the two-word phrase __________.',868:'7. The two-word phrase described in Paragraph A as “strong and recognisable” is __________.',871:'10. The two-word phrase immediately following “Arabian” names the tradition central to Amouage’s work: __________.',872:'11. Excessive familiarity may weaken some niche consumers’ sense of discovery or __________.'}
assert {r['sourceIndex']:r['replacement'] for r in c['revisions']}==expected
for r in c['revisions']:assert r['original']==s[r['sourceIndex']]
t=c['tasks']
for id,keys in [('ferrari-summary',['B','C','B']),('amouage-scan',['1983','Muscat','frankincense','fourteen weeks','six months']),('amouage-summary',['A','B','C','A','B']),('amouage-tfng',['FALSE','TRUE','FALSE','NOT GIVEN','FALSE']),('amouage-completion',['discerning clientele','creative identity','mature','fourteen weeks','perfume culture','individuality']),('amouage-endings',['B','F','A','D'])]:
 assert [q['answer'] for q in t[id]['items']]==keys
 for q in t[id]['items']:assert any(q['evidence'] in p for p in c[t[id]['data']]['paragraphs']),q
for id,indices in [('amouage-scan',range(828,833)),('amouage-tfng',range(859,864)),('amouage-completion',range(867,873)),('amouage-endings',range(876,880))]:
 assert [q['prompt'] for q in t[id]['items']]==[expected.get(i,s[i]) for i in indices]
for id,starts in [('ferrari-summary',[799,803,807]),('amouage-summary',[837,841,845,849,853])]:
 assert [[o['text'] for o in q['options']] for q in t[id]['items']]==[[s[i+j][3:] for j in range(3)] for i in starts]
assert [o['text'] for o in t['amouage-endings']['endings']]==[s[i][3:] for i in range(880,887)]
for q in t['amouage-completion']['items']:
 assert q['accepted']==[q['answer']]
 assert len(q['answer'].split())<=2
 assert any(q['answer'] in p for p in c['amouage']['paragraphs'])
assert t['amouage-scan']['items'][2]['accepted']==['frankincense']
# Existing teaching data and the already-live continuation are byte-for-byte unchanged.
for name in ['content.js','answer-order.js','continuation.js','continuation-content.js','continuation.css']:
 assert (root/name).read_bytes()==subprocess.check_output(['git','show','HEAD:reading/day-1/'+name])
print('PASS: all 8 new paragraphs verbatim; 28 keys; exactly 5 approved prompt overrides; source options and endings; strict completion answers and word limit; existing content unchanged.')
