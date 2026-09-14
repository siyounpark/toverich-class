import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
export const dynamic = "force-dynamic";
function reply(body: unknown, status=200) { return NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}}); }
export async function GET(){return reply({configured:Boolean(process.env.YOUTUBE_API_KEY && process.env.MUSIC_RESEARCH_ACCESS_CODE)});}
export async function POST(req: NextRequest){
const key=process.env.YOUTUBE_API_KEY,code=process.env.MUSIC_RESEARCH_ACCESS_CODE;
if(!key||!code)return reply({error:"실제 검색 연결이 아직 준비되지 않았어요. 아래 유튜브 검색 링크를 이용해 주세요."},503);
const supplied=req.headers.get("x-research-code")||"";
const a=Buffer.from(supplied),b=Buffer.from(code);
if(a.length!==b.length||!timingSafeEqual(a,b))return reply({error:"검색 이용 코드를 확인해 주세요."},401);
let input;try{input=await req.json()}catch{return reply({error:"검색 조건을 확인해 주세요."},400)}
const q=typeof input.q==="string"?input.q.trim():"",days=Number(input.days);
if(!q||q.length>200||![30,90].includes(days))return reply({error:"검색어와 기간을 확인해 주세요."},400);
try{
const after=new Date(Date.now()-days*86400000).toISOString();
const search=new URLSearchParams({key,part:"snippet",type:"video",q,maxResults:"9",order:"viewCount",publishedAfter:after,videoDuration:"long",safeSearch:"strict",relevanceLanguage:"ko"});
const s=await fetch("https://www.googleapis.com/youtube/v3/search?"+search,{signal:AbortSignal.timeout(12000),cache:"no-store"});
if(!s.ok)return reply({error:"유튜브 검색을 완료하지 못했어요. API 설정이나 할당량을 확인해 주세요."},502);
const sd=await s.json();const ids=(sd.items||[]).map((x:any)=>x.id?.videoId).filter((x:any)=>typeof x==="string"&&/^[A-Za-z0-9_-]{11}$/.test(x));
if(!ids.length)return reply({items:[],checkedAt:new Date().toISOString(),days,q});
const vs=await fetch("https://www.googleapis.com/youtube/v3/videos?"+new URLSearchParams({key,part:"snippet,statistics",id:ids.join(",")}),{signal:AbortSignal.timeout(12000),cache:"no-store"});
if(!vs.ok)return reply({error:"영상 지표를 가져오지 못했어요. 잠시 뒤 다시 시도해 주세요."},502);
const vd=await vs.json();const now=Date.now();
const items=(vd.items||[]).map((v:any)=>{const views=Number(v.statistics?.viewCount);const age=Math.max(1,(now-Date.parse(v.snippet.publishedAt))/86400000);return {id:v.id,title:v.snippet.title,channel:v.snippet.channelTitle,channelId:v.snippet.channelId,publishedAt:v.snippet.publishedAt,views:Number.isFinite(views)?views:null,averagePerDay:Number.isFinite(views)?Math.round(views/age):null,thumbnail:v.snippet.thumbnails?.medium?.url||""};});
return reply({items,checkedAt:new Date(now).toISOString(),days,q});
}catch{return reply({error:"검색 연결 시간이 초과되었거나 오류가 발생했어요. 다시 시도해 주세요."},502)}
}
