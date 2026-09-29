import {database,snapshot,initialize} from '@/lib/workspace';
import {z} from 'zod';
export const dynamic='force-dynamic';
const states:Record<string,string[]>={task:['Not started','In progress','Blocked','In review','Done'],risk:['Open','Mitigating','Resolved','Accepted'],gate:['Not reviewed','Changes needed','Accepted'],register:['Unverified','In progress','Verified','Not applicable'],skill:['Not assessed','Practicing','Demonstrated'],log:['Recorded']};
const itemSchema=z.object({id:z.string().max(80),kind:z.enum(['task','risk','gate','register','skill','log']),title:z.string().trim().min(1).max(500),description:z.string().max(12000).default(''),owner:z.string().max(150).default('Unassigned'),backup:z.string().max(150).optional(),status:z.string().max(40),stream:z.string().max(80).optional(),category:z.string().max(80).optional(),priority:z.enum(['P0','P1','P2']).optional(),day:z.number().int().min(1).max(20).default(1),checks:z.array(z.object({label:z.string().max(600),done:z.boolean()})).max(30).default([]),acceptance:z.string().max(4000).optional(),notes:z.string().max(16000).default(''),evidence:z.string().max(8000).default(''),reviewer:z.string().max(150).optional(),scoreA:z.number().int().min(0).max(3).optional(),scoreB:z.number().int().min(0).max(3).optional(),seeded:z.boolean().optional(),revision:z.number().int().optional()});
const settingsSchema=z.object({startDate:z.string().max(10),holidays:z.string().max(1200),supervisor:z.string().max(150),knowledgeUrl:z.string().max(1000),incidentChannel:z.string().max(1000),departureDate:z.string().max(10),notes:z.string().max(5000),revision:z.number().int()});
function json(data:any,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store'}})}
function error(e:any){console.error('Workspace operation failed',e instanceof Error?e.message:'unknown');return json({error:e instanceof z.ZodError?'Please check the form fields.':'We couldn’t save or load the workspace. Your edits are still here; please try again.'},503)}
export async function GET(){try{return json(await snapshot())}catch(e){return error(e)}}
function validDate(s:string){if(!s)return true;return /^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;}
export async function POST(request:Request){try{
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Please save from this workspace.'},403);
 if(Number(request.headers.get('content-length')||0)>40000)return json({error:'This entry is too long.'},413);
 const body=await request.text();if(body.length>40000)return json({error:'This entry is too long.'},413);
 const input=JSON.parse(body);await initialize();const db=database();const actor=request.headers.get('oai-authenticated-user-email')||'Workspace service';const now=new Date().toISOString();let recordId='',title='',action='';
 if(input.operation==='settings'){
  const s=settingsSchema.parse(input.data);if(!validDate(s.startDate)||!validDate(s.departureDate)||s.holidays.split(/[\s,]+/).filter(Boolean).some(x=>!validDate(x)))return json({error:'Use valid dates in YYYY-MM-DD format.'},400);
  const{revision,...data}=s;const result=await db.prepare('UPDATE settings SET payload = ?, revision = revision + 1 WHERE id = ? AND revision = ?').bind(JSON.stringify(data),'workspace',revision).run();if(!result.meta.changes)return json({error:'Settings changed since you opened them. Refresh, then apply your edits.'},409);recordId='workspace';title='Project settings';action='Updated project settings';
 }else if(input.operation==='delete'){
  const old=await db.prepare('SELECT * FROM records WHERE id = ?').bind(String(input.id)).first<any>();if(!old)return json({error:'Entry not found.'},404);const oldData=JSON.parse(old.payload);if(oldData.seeded)return json({error:'Plan entries are retained as the handoff baseline.'},400);
  const result=await db.prepare('DELETE FROM records WHERE id = ? AND revision = ?').bind(String(input.id),input.revision).run();if(!result.meta.changes)return json({error:'This entry changed. Refresh before deleting it.'},409);recordId=old.id;title=oldData.title;action='Deleted entry';
 }else if(input.operation==='save'){
  const item=itemSchema.parse(input.data);if(!states[item.kind].includes(item.status))return json({error:'Choose a valid status.'},400);
  const old=await db.prepare('SELECT * FROM records WHERE id = ?').bind(item.id).first<any>();const oldData=old?JSON.parse(old.payload):null;
  if(oldData?.kind==='gate'&&oldData.seeded&&item.day!==oldData.day)return json({error:'Milestone days are fixed at 5, 10, 15 and 20.'},400);
  if(oldData?.seeded&&oldData.checks?.some((c:any)=>!item.checks.some(x=>x.label===c.label)))return json({error:'Keep the baseline completion checklist intact.'},400);
  if(oldData&&(oldData.kind!==item.kind||!!oldData.seeded!==!!item.seeded))return json({error:'The record type cannot be changed.'},400);
  if(!old&&item.seeded)return json({error:'New entries cannot replace baseline entries.'},400);
  if(['Done','Verified','Resolved','Demonstrated','Accepted'].includes(item.status)){
   if(!item.evidence.trim())return json({error:'Add evidence or a verification note before completing this entry.'},400);
   if(item.checks.some(c=>!c.done))return json({error:'Complete the checklist before marking this entry finished.'},400);
  }
  if(item.kind==='risk'&&item.status==='Accepted'&&(item.priority==='P0'||!item.reviewer?.trim()||!item.notes.trim()))return json({error:'P0 risks must be resolved. Other accepted risks need a reviewer and a documented workaround.'},400);
  if(item.kind==='register'&&item.status==='Not applicable'&&!item.notes.trim())return json({error:'Record why this item is not applicable.'},400);
  if(item.kind==='gate'&&item.status==='Accepted'){
   if(!item.reviewer?.trim())return json({error:'Name the reviewer who accepted this gate.'},400);
   const data=await snapshot();const preceding=data.items.filter((x:any)=>x.kind==='gate'&&x.day<item.day&&x.status!=='Accepted');
   const unfinished=data.items.filter((x:any)=>x.kind==='task'&&x.day<=item.day&&!(item.day===20&&x.id==='T20')&&x.status!=='Done');
   if(preceding.length||unfinished.length)return json({error:'Complete preceding gates and the required tasks before accepting this gate.'},400);
   if(item.day===20&&data.items.some((x:any)=>x.kind==='risk'&&x.priority==='P1'&&!['Resolved','Accepted'].includes(x.status)))return json({error:'Resolve or explicitly accept remaining P1 risks with a workaround and reviewer.'},400);
   if(item.day===20&&(data.items.some((x:any)=>x.kind==='risk'&&x.priority==='P0'&&x.status!=='Resolved')||data.items.some((x:any)=>x.category==='Final acceptance'&&x.status!=='Verified')))return json({error:'Resolve P0 risks and verify the final acceptance register first.'},400);
  }
  const{revision,...payload}=item;recordId=item.id;title=item.title;action=oldData?(oldData.status!==item.status?`${oldData.status} → ${item.status}`:'Updated details'):'Created entry';
  const result=old?await db.prepare('UPDATE records SET payload = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ?').bind(JSON.stringify(payload),now,item.id,revision).run():await db.prepare('INSERT OR IGNORE INTO records (id,kind,payload,revision,updated_at) VALUES (?,?,?,1,?)').bind(item.id,item.kind,JSON.stringify(payload),now).run();
  if(!result.meta.changes)return json({error:'Someone updated this entry. Your edits are preserved. Refresh the workspace before trying again.'},409);
 }else return json({error:'Unknown action.'},400);
 // An accepted gate is reopened if its required work or risk evidence regresses.
 const current=await snapshot();const gateRows=current.items.filter((x:any)=>x.kind==='gate').sort((a:any,b:any)=>a.day-b.day);let previousInvalid=false;
 for(const gate of gateRows){
  const taskGap=current.items.some((x:any)=>x.kind==='task'&&x.day<=gate.day&&!(gate.day===20&&x.id==='T20')&&x.status!=='Done');
  const finalGap=gate.day===20&&current.items.some((x:any)=>(x.kind==='risk'&&x.priority==='P0'&&x.status!=='Resolved')||(x.kind==='risk'&&x.priority==='P1'&&!['Resolved','Accepted'].includes(x.status))||(x.category==='Final acceptance'&&x.status!=='Verified'));
  if(gate.status==='Accepted'&&(taskGap||finalGap||previousInvalid)){
   const {revision,updatedAt,...payload}=gate;payload.status='Changes needed';
   await db.prepare('UPDATE records SET payload = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ?').bind(JSON.stringify(payload),now,gate.id,revision).run();
   await db.prepare('INSERT INTO activity (id,record_id,title,action,actor,created_at) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),gate.id,gate.title,'Gate reopened: required work changed','Workspace checks',now).run();gate.status='Changes needed';
  }
  if(gate.status!=='Accepted')previousInvalid=true;
 }
 await db.prepare('INSERT INTO activity (id,record_id,title,action,actor,created_at) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),recordId,title,action,actor,now).run();return json(await snapshot());
 }catch(e){if(e instanceof SyntaxError)return json({error:'Invalid request.'},400);return error(e)}}
