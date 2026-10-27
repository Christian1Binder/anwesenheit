// Smoke-Test der gesamten Initialisierung mit minimalen DOM-Testdoubles.
// Prüft erzeugte Tabellen und sichtbare Zustände, ersetzt keine visuelle Browserprüfung.
const fs=require('fs'),vm=require('vm'),crypto=require('crypto'),assert=require('assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8'),nodes=new Map();
function node(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',dataset:{},style:{},hidden:false,selectedOptions:[{textContent:''}],classList:{toggle(){},add(){},remove(){}},setAttribute(){},querySelectorAll(){return []},addEventListener(){},showModal(){},close(){}});return nodes.get(id)}
node('#initial-data').textContent=html.match(/<script id="initial-data"[^>]*>([\s\S]*?)<\/script>/)[1];node('#printKind').value='brief';
const ctx={console,crypto,Date,setTimeout(){},setInterval(){},clearTimeout(){},localStorage:{getItem(){return null},setItem(){}},document:{querySelector:node,querySelectorAll(){return []},addEventListener(){},body:node('body')},window:{addEventListener(){}}};vm.createContext(ctx);
for(const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g))if(!m[1].includes('application/json'))vm.runInContext(m[2],ctx);
assert(!node('main').innerHTML.includes('Startdaten konnten'),node('main').innerHTML);
assert.equal((node('#boardBody').innerHTML.match(/<tr>/g)||[]).length,45);
assert.equal(node('#boardView').hidden,false);assert.equal(node('#reportView').hidden,true);assert.equal(node('body').dataset.printKind,'board');
for(const v of ['month','year']){vm.runInContext(`view='${v}';render()`,ctx);assert.equal((node('#boardBody').innerHTML.match(/<tr>/g)||[]).length,45)}
vm.runInContext("surface='report';render()",ctx);assert.equal(node('#boardView').hidden,true);assert.equal(node('#reportView').hidden,false);
vm.runInContext("surface='plan';render()",ctx);assert.equal(node('#planView').hidden,false);
vm.runInContext("surface='requests';render()",ctx);assert.equal(node('#requestsView').hidden,false);
console.log('PASS: komplette Initialisierung, Startansicht mit 45 Personen, Monat/Jahr sowie Wechsel in Bericht, Planung und Urlaubsanträge.');

vm.runInContext("surface='projects';view='week';render()",ctx);
assert.equal(node('#projectOverview').hidden,false);
assert(node('#projectOverviewBody').innerHTML.includes('Ohne Bedarf'));
for(const v of ['month','year'])vm.runInContext(`view='${v}';render()`,ctx);
console.log('PASS: Vorhabenansicht Woche/Monat/Jahr.');
vm.runInContext(`
const testPerson={id:'t',name:'Test',schedule:{1:{start:'08:00',hours:8}}};
const testProject={id:'w',name:'Arbeit',kind:'work',staffing:{start:'2026-10-26',end:'2026-11-02',timeStart:'08:00',timeEnd:'16:00',needed:1,days:[1]}};
const a={id:'a',personId:'t',projectId:'w',start:'2026-10-26',end:'2026-10-26',days:[1],mode:'clock',timeStart:'08:00',timeEnd:'16:00',load:100};
const data={people:[testPerson],projects:[testProject,{id:'u',kind:'absence'}],assignments:[a]};
globalThis.fixture={data,a,testProject};
`,ctx);
const run=x=>vm.runInContext(x,ctx);
assert.equal(run("coverageFor(testProject,'2026-10-26',data).covered"),1);
assert.equal(run("coverageFor(testProject,'2026-10-27',data).active"),false);
assert.equal(run("coverageFor(testProject,'2026-10-26',{...data,assignments:[{...a,timeEnd:'12:00'}]}).missing"),1);
assert.equal(run("coverageFor(testProject,'2026-10-26',{...data,assignments:[{...a,mode:'percent'}]}).covered"),0);
assert.equal(run("coverageFor(testProject,'2026-10-26',{...data,assignments:[{...a,timeEnd:'12:00'},{...a,id:'b',timeStart:'12:00'}]}).covered"),1);
assert.equal(run("coverageFor(testProject,'2026-10-26',{...data,assignments:[a,{...a,id:'b',projectId:'u'}]}).covered"),0);
assert.equal(run("buildWeekCopy(data,'2026-10-26','2026-11-02',['t']).items.length"),1);
assert.equal(run("buildWeekCopy({...data,assignments:[a,{...a,id:'b',start:'2026-11-02',end:'2026-11-02'}]},'2026-10-26','2026-11-02',['t']).duplicates"),1);
assert.equal(run("buildWeekCopy({...data,assignments:[{...a,end:'2026-11-30'}]},'2026-10-26','2026-11-02',['t']).items.length"),0);
assert.equal(run("buildWeekCopy({...data,assignments:[a,{...a,id:'b',projectId:'u',start:'2026-11-02',end:'2026-11-02'}]},'2026-10-26','2026-11-02',['t']).conflicts"),1);
assert.equal(run("buildWeekCopy({...data,assignments:[{...a,projectId:'u'}]},'2026-10-26','2026-11-02',['t']).items.length"),0);
assert.throws(()=>run("buildWeekCopy(data,'2026-10-27','2026-11-02',['t'])"));
assert.equal(run("buildWeekCopy(data,'2026-10-26','2027-01-04',['t']).items[0].start"),'2027-01-04');
console.log('PASS: vollständige/teilweise/flexible Besetzung, angrenzende Buchungen, Konflikte, Wochenkopie, Duplikate, Serien, Urlaubsausschluss, Jahreswechsel.');
assert.equal(run("view='month';boardCompact"),true);
assert.equal(run("makeQuickAssignment({...data,assignments:[]},'t','w','2026-10-26','morning').mode"),'morning');
assert.throws(()=>run("makeQuickAssignment(data,'t','w','2026-10-26','full')"));
assert.throws(()=>run("makeQuickAssignment({...data,assignments:[]},'t','w','2026-10-27','full')"));
assert.equal(run("makeQuickAssignment({...data,assignments:[{...a,mode:'morning'}]},'t','w','2026-10-26','afternoon').mode"),'afternoon');
run("validateDayNotes({'2026-10-26':'Besprechung'})");
assert.throws(()=>run("validateDayNotes({'2026-02-30':'Ungültig'})"));
assert.throws(()=>run("validateDayNotes({'2026-10-26':'x'.repeat(1001)})"));
run("db.dayNotes={'2026-10-26':'<script>test</script>'};anchor='2026-10-26';surface='board';view='month';render()");
assert(node('#boardHead').innerHTML.includes('&lt;script&gt;'));
assert(node('#dayNotePrint').innerHTML.includes('&lt;script&gt;'));
assert.equal(run("JSON.parse(JSON.stringify(snapshotData())).dayNotes['2026-10-26']"),'<script>test</script>');
assert(html.includes("connect-src 'none'"));
assert(!html.includes('clone.querySelector(\'#initial-data\').textContent='));
assert(!/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(html.replace(/\/\*[\s\S]*?\*\//g,'')));
const embedded=JSON.parse(html.match(/<script id="initial-data"[^>]*>([\s\S]*?)<\/script>/)[1]);
assert.equal(embedded.demo,true);assert.equal(embedded.people.length,0);assert.equal(embedded.assignments.length,0);
console.log('PASS: Schnellzuweisung, Halbtage, Konflikt-/Arbeitszeitprüfung, Notizvalidierung, XSS-Escaping, lokale Sicherung, keine Netzwerk-API und leere Demo-Startdaten.');

run("validateCellNotes({t:{'2026-10-26':'Test'}})");
assert.throws(()=>run("validateCellNotes({t:{'2026-02-30':'Test'}})"));
run("db.cellNotes={m0:{'2026-10-26':'<b>Nur Person 0</b>'}};render()");
assert(run("cellNoteTooltip('m0',{start:'2026-10-26',end:'2026-10-26'})").includes('Nur Person 0'));
assert.equal(run("cellNoteTooltip('m1',{start:'2026-10-26',end:'2026-10-26'})"),'');
assert.equal(run("cellNoteTooltip('m0',{start:'2026-10-27',end:'2026-10-27'})"),'');
assert(node('#boardBody').innerHTML.includes('comment-corner'));
assert(node('#dayNotePrint').innerHTML.includes('&lt;b&gt;Nur Person 0'));
console.log('PASS: personenbezogene Kommentare, Tagesabgrenzung, Validierung, Markierung und sicherer Druck.');
