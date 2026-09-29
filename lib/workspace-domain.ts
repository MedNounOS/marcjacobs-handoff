import {z} from 'zod';
const states:Record<string,string[]>={task:['Not started','In progress','Blocked','In review','Done'],risk:['Open','Mitigating','Resolved','Accepted'],gate:['Not reviewed','Changes needed','Accepted'],register:['Unverified','In progress','Verified','Not applicable'],skill:['Not assessed','Practicing','Demonstrated'],log:['Recorded']};
const itemSchema=z.object({id:z.string().max(80),kind:z.enum(['task','risk','gate','register','skill','log']),title:z.string().trim().min(1).max(500),description:z.string().max(12000).default(''),owner:z.string().max(150).default('Unassigned'),backup:z.string().max(150).optional(),status:z.string().max(40),stream:z.string().max(80).optional(),category:z.string().max(80).optional(),priority:z.enum(['P0','P1','P2']).optional(),day:z.number().int().min(1).max(20).default(1),checks:z.array(z.object({label:z.string().max(600),done:z.boolean()})).max(30).default([]),acceptance:z.string().max(4000).optional(),notes:z.string().max(16000).default(''),evidence:z.string().max(8000).default(''),reviewer:z.string().max(150).optional(),scoreA:z.number().int().min(0).max(3).optional(),scoreB:z.number().int().min(0).max(3).optional(),seeded:z.boolean().optional(),revision:z.number().int().optional()});
const settingsSchema=z.object({startDate:z.string().max(10),holidays:z.string().max(1200),supervisor:z.string().max(150),knowledgeUrl:z.string().max(1000),incidentChannel:z.string().max(1000),departureDate:z.string().max(10),notes:z.string().max(5000),revision:z.number().int()});

export type Snapshot={items:any[];settings:any;activity:any[]};
function fail(message:string):never{throw new Error(message)}
function validDate(s:string){return !s||(/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s)}
export function applyChange(original:Snapshot,input:any,actor:string,now=new Date().toISOString()):Snapshot{
 const data:Snapshot=structuredClone(original);let id='',title='',action='';
 if(input.operation==='settings'){
  const s=settingsSchema.parse(input.data);
  if(s.revision!==data.settings.revision)fail('Settings changed since you opened them. Refresh, then apply your edits.');
  if(!validDate(s.startDate)||!validDate(s.departureDate)||s.holidays.split(/[\s,]+/).filter(Boolean).some(x=>!validDate(x)))fail('Use valid dates in YYYY-MM-DD format.');
  data.settings={...s,revision:s.revision+1};id='workspace';title='Project settings';action='Updated project settings';
 }else if(input.operation==='delete'){
  const item=data.items.find(x=>x.id===input.id);if(!item)fail('Entry not found.');
  if(item.seeded)fail('Plan entries are retained as the handoff baseline.');
  if(item.revision!==input.revision)fail('This entry changed. Refresh before deleting it.');
  id=item.id;title=item.title;action='Deleted entry';data.items=data.items.filter(x=>x.id!==id);
 }else if(input.operation==='save'){
  const item=itemSchema.parse(input.data);const old=data.items.find(x=>x.id===item.id);
  if(!states[item.kind].includes(item.status))fail('Choose a valid status.');
  if(old&&old.revision!==item.revision)fail('Someone updated this entry. Your edits are preserved. Refresh before trying again.');
  if(old&&(old.kind!==item.kind||!!old.seeded!==!!item.seeded))fail('The record type cannot be changed.');
  if(!old&&item.seeded)fail('New entries cannot replace baseline entries.');
  if(old?.kind==='gate'&&old.seeded&&old.day!==item.day)fail('Milestone days are fixed at 5, 10, 15 and 20.');
  if(old?.seeded&&old.checks.some((c:any)=>!item.checks.some(x=>x.label===c.label)))fail('Keep the baseline completion checklist intact.');
  if(['Done','Verified','Resolved','Demonstrated','Accepted'].includes(item.status)){
   if(!item.evidence.trim())fail('Add evidence or a verification note before completing this entry.');
   if(item.checks.some(c=>!c.done))fail('Complete the checklist before marking this entry finished.');
  }
  if(item.kind==='risk'&&item.status==='Accepted'&&(item.priority==='P0'||!item.reviewer?.trim()||!item.notes.trim()))fail('P0 risks must be resolved. Other accepted risks need a reviewer and a documented workaround.');
  if(item.kind==='register'&&item.status==='Not applicable'&&!item.notes.trim())fail('Record why this item is not applicable.');
  if(item.kind==='gate'&&item.status==='Accepted'){
   if(!item.reviewer?.trim())fail('Name the reviewer who accepted this gate.');
   if(data.items.some(x=>x.kind==='gate'&&x.day<item.day&&x.status!=='Accepted')||taskGap(data,item))fail('Complete preceding gates and the required tasks before accepting this gate.');
   if(finalGap(data,item))fail('Resolve P0 risks, resolve or accept P1 risks, and verify the final acceptance register first.');
  }
  id=item.id;title=item.title;action=old?(old.status!==item.status?`${old.status} → ${item.status}`:'Updated details'):'Created entry';
  const next={...item,revision:(old?.revision||0)+1,updatedAt:now};data.items=old?data.items.map(x=>x.id===id?next:x):[...data.items,next];
 }else fail('Unknown action.');
 let previousInvalid=false;
 for(const g of data.items.filter(x=>x.kind==='gate').sort((a,b)=>a.day-b.day)){
  if(g.status==='Accepted'&&(taskGap(data,g)||finalGap(data,g)||previousInvalid)){
   g.status='Changes needed';g.revision++;g.updatedAt=now;
   data.activity.unshift({id:crypto.randomUUID(),record_id:g.id,title:g.title,action:'Gate reopened: required work changed',actor:'Workspace checks',created_at:now});
  }
  if(g.status!=='Accepted')previousInvalid=true;
 }
 data.activity.unshift({id:crypto.randomUUID(),record_id:id,title,action,actor,created_at:now});
 data.activity=data.activity.slice(0,150);return data;
}
function taskGap(data:Snapshot,gate:any){return data.items.some(x=>x.kind==='task'&&x.day<=gate.day&&!(gate.day===20&&x.id==='T20')&&x.status!=='Done')}
function finalGap(data:Snapshot,gate:any){return gate.day===20&&data.items.some(x=>(x.kind==='risk'&&x.priority==='P0'&&x.status!=='Resolved')||(x.kind==='risk'&&x.priority==='P1'&&!['Resolved','Accepted'].includes(x.status))||(x.category==='Final acceptance'&&x.status!=='Verified'))}
