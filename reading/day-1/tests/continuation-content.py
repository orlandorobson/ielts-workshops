"""Independently verify the continuation against the COMPLETE DOCX (standard library only)."""
from pathlib import Path
import json, zipfile, xml.etree.ElementTree as E
root=Path(__file__).resolve().parents[1]
r=(root/'continuation-content.js').read_text();c=json.loads(r[r.index('{'):r.rindex(';')])
n={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
with zipfile.ZipFile(root/'source'/c['sourceFile']) as z:
 xml=E.fromstring(z.read('word/document.xml'))
s=[''.join(t.text or '' for t in p.findall('.//w:t',n)) for p in xml.findall('.//w:p',n)]
assert c['source']==s[486:]
for name,paragraph_start,summary_starts,task_a,task_b,vocab in [('ev',498,[504,508,512],(542,546),(569,575),(580,604)),('football',633,[641,645,649,653,657],(701,706),(729,735),(739,765))]:
 d=c[name]
 assert d['paragraphs']==[s[i][11:] for i in range(paragraph_start,paragraph_start+len(summary_starts))]
 assert [q['options'] for q in d['summaries']]==[[s[i+j][3:] for j in range(3)] for i in summary_starts]
 for kind,(a,b) in [('taskA',task_a),('taskB',task_b)]:
  assert d[kind]['questions']==[t.split('. ',1)[1] for t in s[a:b]]
  for e in d[kind]['evidence']:assert any(e in p for p in d['paragraphs']),e
 assert d['vocabulary']==[[s[i],s[i+1]] for i in range(*vocab,2)]
 assert d['unpack']['question'] in d['taskA']['questions']
 for phrase,simple,*rest in d['unpack']['phrases']:
  i=s.index(phrase,486);assert s[i+1]==simple
 assert any(d['unpack']['extract'] in p for p in d['paragraphs'])
assert [q['answer'] for q in c['ev']['summaries']]==['B','A','C']
assert c['ev']['taskA']['answers']==['C','A','B','A']
assert c['ev']['taskB']['answers']==['A','B','C','D','D','E']
assert c['ev']['groupSummaries']==[[s[i],s[i+1]] for i in range(551,561,2)]
assert [q['answer'] for q in c['football']['summaries']]==['B','A','A','B','C']
assert c['football']['taskA']['answers']==['B','E','C','A','D']
assert c['football']['taskB']['answers']==['B','E','D','A','C','A']
assert c['football']['prompts']==[s[i] for i in [712,714,716,718,720]]
assert c['football']['completions']==['expand','improvement / progress','tactics / tactical systems','commercial / marketing','physical']
assert c['football']['smallWords']==[t.split(' = ',1) for t in s[685:690]]
assert c['football']['repairs']==[t.split(' -> ',1) for t in s[693:699]]
assert len(c['ev']['vocabulary'])==12 and len(c['football']['vocabulary'])==13
print('PASS: COMPLETE source; 8 verbatim paragraphs; 8 summary questions; 21 original task questions; all 39 answers, group prompts, repair examples and 25 vocabulary pairs.')
