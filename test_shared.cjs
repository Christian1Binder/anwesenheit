/* Regressions- und Fehlertests für die echten Funktionen der ausgelieferten HTML.
   Die Datei-I/O ist simuliert. Kein Nachweis für SMB-Sperren oder Edge-Richtlinien. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const core=html.split('// CORE START: reine Berechnungen ohne Oberfläche; separat prüfbar.')[1].split('// CORE END')[0];
const sharedModule=html.split('// SHARED JS START')[1].split('// SHARED JS END')[0];
const subset=sharedModule.slice(0,sharedModule.indexOf('function profileDialog()'));
const memory=new Map(),warnings=[];
const ctx={console,crypto,Date,localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)},
 render(){},renderSharedBar(){},toast:m=>warnings.push(m),close(){},history:[],dirty:false,window:{},setTimeout(){},db:null};
vm.createContext(ctx);
vm.runInContext(core+'\n'+html.slice(html.indexOf('function validateCellNotes('),html.indexOf('function notesForCell('))+'\n'+html.slice(html.indexOf('function validateDayNotes('),html.indexOf('function dayNotesRow('))+'\n'+html.split('function validateStaffing(s){')[1].split('function coverageFor')[0].replace(/^/, 'function validateStaffing(s){')+'\n'+subset+'\nglobalThis.t={migrate,validate,validateRequest,applyDecision,requestStatus,requestsFor,requestAssignment,dayStats,summarize,parseEnvelope,writeFileText,readFileText,scanRequests,publishData,acquireLease,releaseLease,assertUnchanged,canEditPlan,shared,profile,sessionId};',ctx);
const t=ctx.t;
const p={id:'m1',name:'Testperson',team:'Testteam',schedule:{1:{start:'08:00',hours:8},2:{start:'08:00',hours:6},3:{start:'08:00',hours:8},4:{start:'08:00',hours:8},5:{start:'08:00',hours:8}}};
const base=()=>({version:3,id:'plan1',demo:false,people:[p],projects:[],assignments:[],requests:[],decisions:[]});
const req=(extra={})=>({format:'teamplan-request',version:1,id:crypto.randomUUID(),planId:'plan1',type:'leave',personId:'m1',personName:'Testperson',createdBy:'Testperson',createdAt:new Date().toISOString(),start:'2026-09-07',end:'2026-09-07',mode:'morning',timeStart:'09:00',timeEnd:'11:00',days:[0,1,2,3,4,5,6],note:'',...extra});
const clone=x=>JSON.parse(JSON.stringify(x));
let data=base(),r=req();data.requests.push(r);t.validate(data);
assert.equal(t.requestStatus(r,data),'pending');assert.equal(t.summarize(p,data.assignments,r,data.projects).free,8);
let approved=t.applyDecision(data,r,'approved','Planer','');t.validate(approved);
assert.equal(approved.assignments.length,1);assert.equal(t.summarize(p,approved.assignments,r,approved.projects).absence,4);
assert.equal(t.summarize(p,approved.assignments,r,approved.projects).free,4);
assert.throws(()=>t.applyDecision(approved,r,'approved','Planer',''),/bereits/);
let changed=clone(approved);changed.assignments[0].end='2026-09-08';assert.throws(()=>t.validate(changed),/Antrag ändern/);
changed=clone(approved);changed.assignments=[];assert.throws(()=>t.validate(changed),/passen nicht/);
const tampered={...r,end:'2026-09-08'};assert.equal(t.requestsFor(approved,[tampered])[0].end,r.end);
let rejected=t.applyDecision(data,r,'rejected','Planer','Anderer Zeitraum');assert.equal(rejected.assignments.length,0);
const cancel=req({type:'cancel',targetId:r.id,note:'Rücknahme'});approved.requests.push(cancel);
const cancelled=t.applyDecision(approved,cancel,'approved','Planer','',t.requestsFor(approved,[]));
assert.equal(cancelled.assignments.length,0);assert.equal(t.requestStatus(r,cancelled),'cancelled');assert.equal(t.summarize(p,cancelled.assignments,r,cancelled.projects).free,8);
data.requests.push(cancel);const withdrawn=t.applyDecision(data,cancel,'approved','Planer','',t.requestsFor(data,[]));assert.equal(t.requestStatus(r,withdrawn),'cancelled');
assert.throws(()=>t.applyDecision(withdrawn,r,'approved','Planer',''),/bereits/);
const cancelRejected=t.applyDecision(approved,cancel,'rejected','Planer','Noch gebunden',t.requestsFor(approved,[]));assert.equal(t.requestStatus(r,cancelRejected),'approved');assert.equal(cancelRejected.assignments.length,1);
for(const extra of [{end:'2026-02-31'},{days:[]},{timeEnd:'08:00'},{planId:'other'},{id:'../escape'}])assert.throws(()=>t.validateRequest(req(extra),'plan1'));
const tue=req({start:'2026-09-08',end:'2026-09-08'});let half=t.applyDecision(base(),tue,'approved','Planer','');assert.equal(t.summarize(p,half.assignments,tue,half.projects).booked,3);
const hour=req({mode:'clock',timeStart:'09:15',timeEnd:'10:45'});const hours=t.applyDecision(base(),hour,'approved','Planer','');assert.equal(t.summarize(p,hours.assignments,hour,hours.projects).booked,1.5);
const cross=req({start:'2026-12-31',end:'2027-01-04',mode:'full'});const crossData=t.applyDecision(base(),cross,'approved','Planer','');assert.equal(t.summarize(p,crossData.assignments,cross,crossData.projects).booked,24);
assert.throws(()=>t.applyDecision(base(),req({start:'2026-09-12',end:'2026-09-12'}),'approved','Planer',''),/keine Arbeitsstunden/);
const detachedProject={id:'detach',name:'Abgabe',color:'#222222',kind:'detached'},detach={...t.requestAssignment(req({mode:'full'}),'detach'),id:'abgabe'};delete detach.requestId;
const unavailable=t.dayStats(p,[detach],r.start,[detachedProject]);assert.equal(unavailable.free,0);assert.equal(unavailable.detached,8);assert.equal(unavailable.project,0);assert.equal(unavailable.absence,0);
const back=t.dayStats(p,[detach],'2026-09-08',[detachedProject]);assert.equal(back.free,6);assert.equal(back.detached,0);
const overlap=t.dayStats(p,[detach,{...t.requestAssignment(hour),'projectId':'work'}],r.start,[detachedProject,{id:'work',kind:'work'}]);assert.equal(overlap.conflict,true);
const migrated=t.migrate({version:2,id:'legacy',demo:false,people:[p],projects:[],assignments:[]});t.validate(migrated);assert.equal(migrated.version,3);assert.equal(migrated.decisions.length,0);
const v1=t.migrate({version:1,id:'legacy1',demo:false,people:[{id:'m1',name:'Person',team:'Team',hours:30}],projects:[],assignments:[]});t.validate(v1);assert.equal(v1.people[0].schedule[1].hours,6);

class Dir{
 constructor(name){this.name=name;this.kind='directory';this.nodes=new Map();this.failWrite=false;this.beforeWrite=null}
 async getDirectoryHandle(n,o={}){if(!this.nodes.has(n)){if(!o.create)throw Object.assign(Error('Missing'),{name:'NotFoundError'});this.nodes.set(n,new Dir(n))}return this.nodes.get(n)}
 async getFileHandle(n,o={}){if(!this.nodes.has(n)){if(!o.create)throw Object.assign(Error('Missing'),{name:'NotFoundError'});this.nodes.set(n,{kind:'file',text:''})}const entry=this.nodes.get(n),dir=this;return {kind:'file',getFile:async()=>({size:entry.text.length,text:async()=>entry.text}),createWritable:async()=>{if(dir.failWrite)throw Error('Disk full');let staged='';return {write:async text=>{if(dir.beforeWrite)await dir.beforeWrite(n);staged=text},close:async()=>{entry.text=staged},abort:async()=>{}}}}}
 async *entries(){for(const [n,v]of this.nodes)yield[n,v]}
}
async function setup(){const dir=new Dir('Testordner'),env={format:'teamplan-share',version:1,revision:1,token:crypto.randomUUID(),updatedAt:new Date().toISOString(),updatedBy:'Planer',data:base()};const text=JSON.stringify(env,null,2);await t.writeFileText(dir,'teamplan.json',text);await dir.getDirectoryHandle('Antraege',{create:true});await dir.getDirectoryHandle('Sicherungen',{create:true});Object.assign(t.shared,{dir,base:env,baseText:text,incoming:[],errors:[],lease:null});ctx.db=env.data;ctx.dirty=false;Object.assign(t.profile,{role:'planner',name:'Planer',mode:'shared'});await t.acquireLease();return dir}
(async()=>{
 const dir=await setup();assert.equal(t.canEditPlan(),true);
 let next=clone(ctx.db);next.people[0].name='Geändert';ctx.dirty=true;await t.publishData(next);assert.equal(t.shared.base.revision,2);assert.equal(ctx.db.people[0].name,'Geändert');assert.equal(ctx.dirty,false);
 const backups=await dir.getDirectoryHandle('Sicherungen');assert.equal(backups.nodes.size,1);assert.equal(t.parseEnvelope([...backups.nodes.values()][0].text).revision,1);
 const changedText=(await t.readFileText(dir,'teamplan.json')).replace('Geändert','Extern');dir.nodes.get('teamplan.json').text=changedText;
 await assert.rejects(()=>t.publishData(next),/inzwischen geändert/);assert.equal(await t.readFileText(dir,'teamplan.json'),changedText);
 const otherDir=await setup();const before=await t.readFileText(otherDir,'teamplan.json');(await otherDir.getDirectoryHandle('Sicherungen')).failWrite=true;
 await assert.rejects(()=>t.publishData(base()),/Disk full/);assert.equal(await t.readFileText(otherDir,'teamplan.json'),before);
 const lost=await setup();await t.writeFileText(lost,'bearbeitung.json',JSON.stringify({sessionId:'other',name:'Andere Person',expiresAt:new Date(Date.now()+60000).toISOString()}));await assert.rejects(()=>t.publishData(base()),/anderen Person/);
 warnings.length=0;await t.acquireLease();assert(warnings.some(s=>s.includes('Andere Person')));
 const final=await setup();const folder=await final.getDirectoryHandle('Antraege');let a=req(),b=req({id:crypto.randomUUID()});await Promise.all([t.writeFileText(folder,a.id+'.json',JSON.stringify(a)),t.writeFileText(folder,b.id+'.json',JSON.stringify(b))]);
 await t.writeFileText(folder,'broken.json','{bad');const scan=await t.scanRequests(final,'plan1');assert.equal(scan.incoming.length,2);assert.equal(scan.errors.length,1);
 const remove=await t.releaseLease();assert(!t.canEditPlan());
 console.log('PASS: request → approval → cancellation; immutable decision snapshot; rejection and pending withdrawal; no double booking; individual halves; 90 minutes; year boundary; detached capacity and conflicts; v1/v2 migration; stale-version stop; failed backup preserves main plan; foreign editor stop; separate concurrent request files; corrupt request isolation; explicit release.');
})().catch(e=>{console.error(e);process.exitCode=1});
