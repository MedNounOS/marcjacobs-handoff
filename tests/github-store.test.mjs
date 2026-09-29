import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {configureGitHub,workspaceRequest,connectGitHub,disconnectGitHub} from '../lib/github-store.ts';
const baseline=()=>JSON.parse(readFileSync(new URL('../workspace/workspace.json',import.meta.url),'utf8'));
test('GitHub transport preserves shared state, attribution, authentication and file concurrency',async()=>{
 configureGitHub({owner:'example',repo:'handoff',branch:'main',file:'workspace/workspace.json'});
 const originalFetch=globalThis.fetch;let data=baseline(),sha='sha-one',writes=0,conflict=false;
 globalThis.fetch=async(url,options={})=>{
  if(url==='https://api.github.com/user')return Response.json({login:'colleague'});
  if(url==='https://api.github.com/repos/example/handoff')return Response.json({permissions:{push:true}});
  if(url.startsWith('https://raw.githubusercontent.com/')){assert.equal(options.headers,undefined);return Response.json(data)}
  assert.ok(url.startsWith('https://api.github.com/repos/example/handoff/contents/workspace/workspace.json'));
  assert.equal(options.headers.Authorization,'Bearer test-placeholder-not-a-real-token');
  if(options.method==='PUT'){const body=JSON.parse(options.body);assert.equal(body.sha,sha);if(conflict)return Response.json({}, {status:409});data=JSON.parse(Buffer.from(body.content,'base64').toString('utf8'));sha='sha-two';writes++;return Response.json({content:{sha}})}
  return Response.json({sha,content:Buffer.from(JSON.stringify(data)).toString('base64')});
 };
 try{
  let response=await workspaceRequest();assert.equal((await response.json()).items.length,103);
  const item={...data.items.find(x=>x.id==='T01'),notes:'Résumé · colleague update'};
  response=await workspaceRequest({operation:'save',data:item});assert.equal(response.ok,false);assert.equal(writes,0);
  await connectGitHub('test-placeholder-not-a-real-token');
  response=await workspaceRequest({operation:'save',data:item});assert.equal(response.ok,true);assert.equal(writes,1);
  const result=await response.json();assert.equal(result.items.find(x=>x.id==='T01').notes,item.notes);assert.equal(result.activity[0].actor,'colleague');
  conflict=true;response=await workspaceRequest({operation:'save',data:{...result.items.find(x=>x.id==='T01'),notes:'conflicting'}});assert.equal(response.ok,false);assert.match((await response.json()).error,/changed during your save/);assert.equal(writes,1);
  disconnectGitHub();response=await workspaceRequest({operation:'save',data:result.items.find(x=>x.id==='T01')});assert.equal(response.ok,false);
 }finally{globalThis.fetch=originalFetch;disconnectGitHub()}
});
