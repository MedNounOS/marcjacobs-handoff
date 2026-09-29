import {applyChange,type Snapshot} from './workspace-domain.ts';
type Config={owner:string;repo:string;branch:string;file:string};
let config:Config|null=null;
let token='';let username='';
export function configureGitHub(value:Config){config=value}
export function isGitHubMode(){return config!==null}
export function connectedUser(){return username}
export function disconnectGitHub(){token='';username=''}
function endpoint(){if(!config)throw new Error('GitHub is not configured.');return `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.file}`}
function headers(candidate=token):Record<string,string>{return{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(candidate?{Authorization:`Bearer ${candidate}`}:{})}}
async function checked(response:Response){if(response.ok)return response;if(response.status===401)throw new Error('GitHub access expired or the token is invalid. Reconnect to continue.');if(response.status===409||response.status===422)throw new Error('The shared workspace changed during your save. Refresh and try again; your edits are still here.');if(response.status===403)throw new Error('GitHub denied this request. Check repository write access and token Contents permission, or try again after the rate limit resets.');throw new Error(`GitHub could not complete the request (${response.status}). Please retry.`)}
export async function connectGitHub(candidate:string){candidate=candidate.trim();if(!candidate)throw new Error('Enter a repository-scoped GitHub token.');
 const user=await (await checked(await fetch('https://api.github.com/user',{headers:headers(candidate)}))).json() as any;
 const repo=await (await checked(await fetch(`https://api.github.com/repos/${config!.owner}/${config!.repo}`,{headers:headers(candidate)}))).json() as any;
 if(!repo.permissions?.push)throw new Error('This GitHub account does not have write access to the handoff repository.');
 token=candidate;username=user.login;return username;
}
function decode(text:string){return new TextDecoder().decode(Uint8Array.from(atob(text.replace(/\s/g,'')),c=>c.charCodeAt(0)))}
function encode(text:string){const bytes=new TextEncoder().encode(text);let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(binary)}
export async function workspaceRequest(input?:any):Promise<Response>{
 if(!config)return fetch('/api/workspace',input?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)}:{cache:'no-store'});
 try{
  if(!input){
   // Public reads use raw content, avoiding the unauthenticated REST API quota.
   const url=`https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${config.file}?refresh=${Date.now()}`;
   const response=await checked(await fetch(url,{cache:'no-store'}));return Response.json(await response.json());
  }
  if(!token)throw new Error('Connect GitHub to save shared changes. Your edits are still here.');
  const current=await (await checked(await fetch(endpoint()+`?ref=${config.branch}`,{headers:headers(),cache:'no-store'}))).json() as any;
  if(!current.content||!current.sha)throw new Error('The shared workspace file is unavailable.');
  const data:Snapshot=JSON.parse(decode(current.content));const next=applyChange(data,input,username);
  const response=await fetch(endpoint(),{method:'PUT',headers:{...headers(),'Content-Type':'application/json'},body:JSON.stringify({message:`Handoff: ${input.operation==='settings'?'update settings':input.operation==='delete'?'remove custom entry':input.data?.title||'update entry'}`,content:encode(JSON.stringify(next,null,2)+'\n'),sha:current.sha,branch:config.branch})});await checked(response);return Response.json(next);
 }catch(error:any){return Response.json({error:error.name==='ZodError'?'Please check the form fields.':error.message||'GitHub is unavailable. Your edits are still here.'},{status:400})}
}
