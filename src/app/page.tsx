import Link from "next/link";

export default function Home(){
  return (
    <section className="card" aria-labelledby="home-title">
      <h1 id="home-title">Assignment 1 – HTML Generator</h1>
      <p>This tool will generate raw <strong>HTML5 + JavaScript</strong> with <strong>inline</strong> styles only.</p>
      <p><Link href="/tabs">Go to the Tabs Builder →</Link></p>
      <hr/>
      <h2>Pages</h2>
      <ul>
        <li><Link href="/tabs">Tabs Builder</Link></li>
        <li><Link href="/escape-room">Escape Room (placeholder)</Link></li>
        <li><Link href="/coding-races">Coding Races (placeholder)</Link></li>
        <li><Link href="/court-room">Court Room (placeholder)</Link></li>
        <li><Link href="/about">About</Link></li>
      </ul>
    </section>
  );
}
