"use client";
import { useEffect, useMemo, useState } from "react";

type Tab = { id: string; title: string; content: string };
const MAX_TABS = 15;
const LS_KEY = "a1_tabs";
const COOKIE_ACTIVE = "a1_active_tab";

function uid(){ return Math.random().toString(36).slice(2,9); }

export default function TabsBuilder(){
  const [tabs,setTabs] = useState<Tab[]>([{id:uid(), title:"Tab 1", content:"Hello from Tab 1"}]);
  const [active,setActive] = useState(0);

  useEffect(()=>{
    const saved = localStorage.getItem(LS_KEY);
    if(saved){
      try{
        const parsed:Tab[] = JSON.parse(saved);
        if(Array.isArray(parsed) && parsed.length) setTabs(parsed);
      }catch{}
    }
  },[]);

  useEffect(()=>{
    const cookie = document.cookie.split("; ").find(r=>r.startsWith(COOKIE_ACTIVE+"="));
    if(cookie){
      const v = Number(decodeURIComponent(cookie.split("=")[1]||""));
      if(!Number.isNaN(v)) setActive(Math.max(0, Math.min(v, tabs.length-1)));
    }
  },[tabs.length]);

  useEffect(()=>{ localStorage.setItem(LS_KEY, JSON.stringify(tabs)); },[tabs]);
  useEffect(()=>{ document.cookie = COOKIE_ACTIVE+"="+encodeURIComponent(String(active))+"; path=/; max-age="+(60*60*24*30); },[active]);

  function addTab(){ if(tabs.length>=MAX_TABS) return; setTabs([...tabs, {id:uid(), title:`Tab ${tabs.length+1}`, content:""}]); setActive(tabs.length); }
  function removeTab(index:number){ if(tabs.length<=1) return; const copy=[...tabs]; copy.splice(index,1); setTabs(copy); setActive(Math.max(0,index-1)); }
  const updateTitle = (i:number, title:string) => setTabs(ts=> ts.map((t,idx)=> idx===i ? {...t, title: title.trim()||`Tab ${i+1}`} : t));
  const updateContent = (i:number, content:string) => setTabs(ts=> ts.map((t,idx)=> idx===i ? {...t, content} : t));

  const output = useMemo(()=> generateInlineHTML(tabs, active), [tabs, active]);

  return (
    <section className="card" aria-labelledby="tabs-title">
      <h1 id="tabs-title">Tabs Builder</h1>
      <p className="small">Add/rename up to {MAX_TABS} tabs. Data persists in <code>localStorage</code>. The last active tab is remembered using a cookie.</p>

      <div role="tablist" aria-label="Edit tabs" style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",alignItems:"center"}}>
        {tabs.map((t,i)=> (
          <button key={t.id} role="tab" aria-selected={active===i} onClick={()=>setActive(i)} style={{border:"1px solid var(--border)",borderRadius:10,padding:".35rem .6rem",background: active===i?"var(--border)":"transparent"}}>
            {t.title || `Tab ${i+1}`}
          </button>
        ))}
        <button onClick={addTab} disabled={tabs.length>=MAX_TABS} aria-label="Add tab" style={{border:"1px solid var(--border)",borderRadius:999,padding:".35rem .6rem",background:"transparent"}}>＋</button>
        <button onClick={()=>removeTab(active)} disabled={tabs.length<=1} aria-label="Remove current tab" style={{border:"1px solid var(--border)",borderRadius:999,padding:".35rem .6rem",background:"transparent"}}>−</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:"1rem",marginTop:"1rem"}}>
        <div>
          <label htmlFor="title">Tab Title</label>
          <input id="title" value={tabs[active]?.title||""} onChange={e=>updateTitle(active, e.target.value)} />
        </div>
        <div>
          <label htmlFor="content">Tab Content (HTML allowed)</label>
          <textarea id="content" rows={6} value={tabs[active]?.content||""} onChange={e=>updateContent(active, e.target.value)} placeholder="Write paragraph text, or raw HTML like &lt;strong&gt;hello&lt;/strong&gt;" />
        </div>
      </div>

      <hr/>
      <h2>Output (copy & paste into Hello.html)</h2>
      <button onClick={()=> navigator.clipboard.writeText(output)} style={{border:"1px solid var(--border)",borderRadius:10,padding:".4rem .6rem",background:"transparent",marginBottom:".5rem"}}>Copy Output</button>
      <textarea aria-label="Generated HTML output" rows={16} style={{width:"100%"}} value={output} readOnly />

      <details style={{marginTop:"1rem"}}>
        <summary>Preview</summary>
        <iframe style={{width:"100%",height:400,border:"1px solid var(--border)",borderRadius:12}} srcDoc={output} />
      </details>
    </section>
  );
}

function generateInlineHTML(tabs:Tab[], activeIndex:number){
  const esc = (s:string)=> s.replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const btn = (sel:boolean)=> `style="border:1px solid #d1d5db;border-radius:10px;padding:6px 10px;background:${sel?"#e5e7eb":"transparent"};margin:2px;"`;
  const panes = tabs.map((t,i)=>`<div role="tabpanel" ${i===activeIndex?"":"hidden"} style="padding:12px;border:1px solid #e5e7eb;border-radius:12px;margin-top:8px;">${t.content || esc("(empty)")}</div>`).join("\n");
  const buttons = tabs.map((t,i)=>`<button role="tab" aria-selected="${String(i===activeIndex)}" data-index="${i}" ${btn(i===activeIndex)}>${esc(t.title || `Tab ${i+1}`)}</button>`).join("");
  const script = `!function(){var b=document.getElementById('tabbar'),p=document.getElementById('panes').children,K='out_active_tab';function set(i){for(var x=0;x<b.children.length;x++){var el=b.children[x],sel=x===i;el.setAttribute('aria-selected',String(sel));el.setAttribute('style','border:1px solid #d1d5db;border-radius:10px;padding:6px 10px;background:'+(sel?'#e5e7eb':'transparent')+';margin:2px;');if(p[x])p[x].hidden=!sel}try{localStorage.setItem(K,String(i));}catch(e){}document.cookie='out_active_tab='+encodeURIComponent(String(i))+'; path=/; max-age='+(60*60*24*30);}b.addEventListener('click',function(e){var t=e.target;if(t&&t.tagName==='BUTTON'){set(parseInt(t.getAttribute('data-index')||'0'));}});var s=parseInt((function(){try{return localStorage.getItem(K);}catch(e){return '0';}})()||'0');!isNaN(s)&&s<p.length?set(s):set(${activeIndex});}();`;
  const safeScript = script.replace(/<\/(script)/gi,"<\\/$1>");
  return `<!doctype html><html lang=en><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Tabs Output</title><body style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#111827;background:#fff;padding:16px;"><h1 style="margin:0 0 8px 0;">Generated Tabs</h1><p style="color:#6b7280;margin:0 0 12px 0;">Inline CSS only</p><div role="tablist" aria-label="Tabs" id="tabbar">${buttons}</div><div id="panes">${panes}</div><script>${safeScript}</script></body></html>`;
}
