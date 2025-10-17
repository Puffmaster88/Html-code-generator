"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "./Theme";

function ThemeToggle(){
  const { theme, toggle } = useTheme();
  return (
    <button aria-label="Toggle theme" onClick={toggle} style={{border:"1px solid var(--border)",borderRadius:10,padding:".4rem .6rem",background:"transparent"}}>
      {theme === "light" ? "🌅 Dawn" : "🌇 Dusk"}
    </button>
  );
}

function Hamburger(){
  const [open,setOpen] = useState(false);
  return (
    <div style={{position:"relative"}}>
      <button aria-label="Open menu" aria-expanded={open} onClick={()=>setOpen(o=>!o)} style={{background:"transparent",border:"none"}}>
        <span className={`hamburger ${open?"open":""}`}><span></span><span></span><span></span></span>
      </button>
      {open && (
        <div role="menu" style={{position:"absolute",right:0,top:36,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:12,padding:".5rem",minWidth:180}} onClick={()=>setOpen(false)}>
          <Menu vertical />
        </div>
      )}
    </div>
  );
}

function Menu({vertical=false}:{vertical?:boolean}){
  const pathname = usePathname();
  const links = [
    {href:"/", label:"Home"},
    {href:"/tabs", label:"Tabs Builder"},
    {href:"/escape-room", label:"Escape Room"},
    {href:"/coding-races", label:"Coding Races"},
    {href:"/court-room", label:"Court Room"},
    {href:"/about", label:"About"},
  ];
  return (
    <nav aria-label="Main" style={{display: vertical?"block":"flex", gap:"0.25rem"}}>
      {links.map(l => (
        <Link key={l.href} href={l.href} aria-current={pathname===l.href?"page":undefined}>{l.label}</Link>
      ))}
    </nav>
  );
}

export default function Header(){
  useEffect(()=>{
    try {
      const path = window.location.pathname;
      document.cookie = "last_menu="+encodeURIComponent(path)+"; path=/; max-age="+(60*60*24*30);
    } catch {}
  },[]);

  const STUDENT_NUMBER = "21458565";

  return (
    <header role="banner" style={{borderBottom:"1px solid var(--border)",position:"sticky",top:0,background:"var(--bg)"}}>
      <div className="container" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem"}}>
        <div style={{fontWeight:700}} aria-label="Student Number">{STUDENT_NUMBER}</div>
        <Menu />
        <div style={{display:"flex",alignItems:"center",gap:".5rem"}}>
          <ThemeToggle/>
          <Hamburger/>
        </div>
      </div>
    </header>
  );
}
