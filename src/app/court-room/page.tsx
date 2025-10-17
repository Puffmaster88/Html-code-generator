"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type CaseType = "Traffic" | "Contract" | "Theft";
type Evidence = { id: string; label: string; weight: number; details: string };
type Witness = { id: string; name: string; statement: string; reliability: number };
type CourtCase = {
  id: string;
  type: CaseType;
  title: string;
  summary: string;
  evidence: Evidence[];
  witnesses: Witness[];
  claims: string[];
  defenses: string[];
  burden: "preponderance" | "beyondReasonableDoubt";
};

function uid() { return Math.random().toString(36).slice(2, 9); }
function rand<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)); }

const BANK: Record<CaseType, Omit<CourtCase, "id" | "title" | "summary" | "evidence" | "witnesses">> = {
  Traffic: { type: "Traffic", claims: ["Speeding","Failure to stop","Unsafe lane change"], defenses: ["Faulty speedometer","Sudden emergency","Obstruction of sign"], burden: "preponderance" },
  Contract: { type: "Contract", claims: ["Breach of contract","Non-payment","Late delivery"], defenses: ["Impossibility","No meeting of minds","Frustration of purpose"], burden: "preponderance" },
  Theft:   { type: "Theft",   claims: ["Unlawful taking","Possession of stolen property"], defenses: ["Mistake of fact","Consent","Alibi"], burden: "beyondReasonableDoubt" },
};

function makeEvidence(ct: CaseType): Evidence[] {
  const pool = {
    Traffic: [
      { label: "Dashcam clip", weight: 2, details: "Shows lane change at 60 km/h." },
      { label: "Speed gun reading", weight: 3, details: "Registered 78 km/h; device calibrated last month." },
      { label: "Intersection photo", weight: 2, details: "Vehicle entered during yellow-to-red phase." },
    ],
    Contract: [
      { label: "Signed agreement", weight: 3, details: "Specifies delivery by 12 Aug; penalty clause." },
      { label: "Invoice trail", weight: 2, details: "Two unpaid invoices; partial payment received." },
      { label: "Email thread", weight: 2, details: "Discussed extensions; no final acceptance." },
    ],
    Theft: [
      { label: "CCTV still", weight: 3, details: "Figure matching attire near storage room." },
      { label: "Recovered goods", weight: 3, details: "Serials match inventory." },
      { label: "Fingerprint match", weight: 2, details: "Partial print on tape." },
    ],
  }[ct];
  const n = 2 + Math.floor(Math.random() * pool.length);
  return Array.from({ length: n }).map((_, i) => {
    const e = rand(pool); return { id: `e${i}-${uid()}`, ...e };
  });
}
function makeWitnesses(ct: CaseType): Witness[] {
  const pool = {
    Traffic: [
      { name: "Patrol Officer Smith", statement: "Observed vehicle at high speed.", reliability: 0.9 },
      { name: "Road Worker Lee", statement: "Signage placement was clear that day.", reliability: 0.7 },
    ],
    Contract: [
      { name: "Project Manager Cruz", statement: "Delivery attempted; access denied.", reliability: 0.75 },
      { name: "Accountant Patel", statement: "Ledger shows late partials.", reliability: 0.8 },
    ],
    Theft: [
      { name: "Security Guard Omar", statement: "Saw an individual carrying a box after hours.", reliability: 0.7 },
      { name: "Neighbor Riley", statement: "Heard movement near storage around midnight.", reliability: 0.6 },
    ],
  }[ct];
  const n = 1 + Math.floor(Math.random() * pool.length);
  return Array.from({ length: n }).map((_, i) => {
    const w = rand(pool); return { id: `w${i}-${uid()}`, ...w };
  });
}
function makeCase(): CourtCase {
  const type = rand<CaseType>(["Traffic","Contract","Theft"]);
  const base = BANK[type];
  const title = `${type} Case #${Math.floor(Math.random() * 900 + 100)}`;
  const summaryMap = {
    Traffic: "Alleged speeding near an intersection during evening traffic.",
    Contract: "Dispute over delivery deadline and payment milestones.",
    Theft:   "Warehouse loss reported; goods recovered from nearby unit.",
  } as const;
  return {
    id: uid(), type, title, summary: summaryMap[type],
    evidence: makeEvidence(type), witnesses: makeWitnesses(type),
    claims: base.claims, defenses: base.defenses, burden: base.burden,
  };
}

export default function CourtRoom() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState<CourtCase>(makeCase());
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [selectedWitness, setSelectedWitness] = useState<string | null>(null);
  const [objection, setObjection] = useState<"relevance" | "hearsay" | "leading" | "none">("none");
  const [juryVotesGuilty, setJuryVotesGuilty] = useState(0);
  const [notes, setNotes] = useState("");
  const tickRef = useRef<number | undefined>(undefined);

  // modal state
  const [verdictOpen, setVerdictOpen] = useState(false);
  const [verdict, setVerdict] = useState<{
    result: "GUILTY" | "NOT GUILTY";
    burden: string;
    score: string;
    jury: string;
  } | null>(null);

  useEffect(() => {
    if (!running) return;
    tickRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s > 0) return s - 1;
        if (minutes > 0) { setMinutes((m) => m - 1); return 59; }
        setRunning(false); alert("⏰ Time's up!"); return 0;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, minutes]);

  const totalJurors = 12;
  const innocenceVotes = totalJurors - juryVotesGuilty;

  const strength = useMemo(() => {
    const ew = selectedEvidence
      .map((id) => current.evidence.find((e) => e.id === id)?.weight || 0)
      .reduce((a, b) => a + b, 0);
    const wr = selectedWitness ? (current.witnesses.find((w) => w.id === selectedWitness)?.reliability || 0) * 2 : 0;
    const penalty = objection !== "none" ? 0.5 : 0;
    return Math.max(0, ew + wr - penalty);
  }, [selectedEvidence, selectedWitness, current, objection]);

  function resetTimer() { setRunning(false); setMinutes(5); setSeconds(0); }
  function newCase() {
    setCurrent(makeCase());
    setSelectedEvidence([]); setSelectedWitness(null); setObjection("none");
    setJuryVotesGuilty(0); setNotes(""); resetTimer();
  }
  function toggleEvidence(id: string) {
    setSelectedEvidence((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  // === modal verdict instead of alert ===
  function submitVerdict() {
    const threshold = current.burden === "beyondReasonableDoubt" ? 6.5 : 3.5;
    const meetsBurden = strength >= threshold && juryVotesGuilty >= Math.ceil(totalJurors * 0.5);
    setVerdict({
      result: meetsBurden ? "GUILTY" : "NOT GUILTY",
      burden: current.burden === "beyondReasonableDoubt" ? "Beyond Reasonable Doubt" : "Balance of Probabilities",
      score: strength.toFixed(1),
      jury: `${juryVotesGuilty}/${totalJurors}`,
    });
    setVerdictOpen(true);
  }

  return (
    <section className="card" aria-labelledby="court-title">
      <h1 id="court-title">
        <img src="/icon/scales.svg" alt="" aria-hidden="true" className="icon" />
        Court Room — You are the Judge
      </h1>

      {/* Timer */}
      <div className="row">
        <img src="/icon/timer.svg" alt="" aria-hidden="true" className="icon" />
        <label>
          Minutes{" "}
          <input type="number" value={minutes} min={0}
            onChange={(e) => setMinutes(parseInt(e.target.value || "0", 10))}
            style={{ width: 80 }} />
        </label>
        <div><strong>{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</strong></div>
        <button onClick={() => setRunning(true)}>
          <img src="/icon/play.svg" alt="" aria-hidden="true" className="icon" />
          Start
        </button>
        <button onClick={() => setRunning(false)}>
          <img src="/icon/pause.svg" alt="" aria-hidden="true" className="icon" />
          Pause
        </button>
        <button onClick={resetTimer}>
          <img src="/icon/reset.svg" alt="" aria-hidden="true" className="icon" />
          Reset
        </button>
      </div>

      <hr />

      {/* Case header */}
      <div style={{ display: "grid", gap: 8 }}>
        <div className="small">{current.type} · Burden: {current.burden === "beyondReasonableDoubt" ? "Beyond Reasonable Doubt" : "Balance of Probabilities"}</div>
        <h2>{current.title}</h2>
        <p>{current.summary}</p>
      </div>

      {/* Two columns aligned to top */}
      <div className="grid-2">
        {/* Evidence & Witness */}
        <div className="card" aria-labelledby="evidence-title">
          <h3 id="evidence-title">
            <img src="/icon/evidence.svg" alt="" aria-hidden="true" className="icon" />
            Evidence
          </h3>
          <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
            {current.evidence.map((e) => (
              <li key={e.id}>
                <label className="choice">
                  <input type="checkbox" checked={selectedEvidence.includes(e.id)} onChange={() => toggleEvidence(e.id)} />
                  <span>{e.label} <span className="small">(weight {e.weight})</span></span>
                </label>
                {selectedEvidence.includes(e.id) && (
                  <div className="small" style={{ marginLeft: 26 }}>{e.details}</div>
                )}
              </li>
            ))}
          </ul>

          <h3 style={{ marginTop: 12 }}>
            <img src="/icon/witness.svg" alt="" aria-hidden="true" className="icon" />
            Witness
          </h3>
          <div role="radiogroup" aria-label="witness">
            {current.witnesses.map((w) => (
              <label key={w.id} className="choice">
                <input type="radio" name="witness" checked={selectedWitness === w.id} onChange={() => setSelectedWitness(w.id)} />
                <span>
                  {w.name} <span className="small">(reliability {w.reliability})</span>
                  <div className="small">{w.statement}</div>
                </span>
              </label>
            ))}
            <label className="choice">
              <input type="radio" name="witness" checked={selectedWitness === null} onChange={() => setSelectedWitness(null)} />
              <span>No witness</span>
            </label>
          </div>
        </div>

        {/* Arguments & Jury */}
        <div className="card" aria-labelledby="arguments-title">
          <h3 id="arguments-title">
            <img src="/icon/gavel.svg" alt="" aria-hidden="true" className="icon" />
            Arguments
          </h3>

          <div className="grid-2">
            <div>
              <div className="small">Claims</div>
              <ul>{current.claims.map((c, i) => <li key={`c${i}`}>{c}</li>)}</ul>
            </div>
            <div>
              <div className="small">Defenses</div>
              <ul>{current.defenses.map((d, i) => <li key={`d${i}`}>{d}</li>)}</ul>
            </div>
          </div>

          <div className="row" style={{ marginTop: 8 }}>
            <img src="/icon/objection.svg" alt="" aria-hidden="true" className="icon" />
            <label htmlFor="objection">Raise objection:</label>
            <select id="objection" value={objection} onChange={(e) => setObjection(e.target.value as any)}>
              <option value="none">— None —</option>
              <option value="relevance">Relevance</option>
              <option value="hearsay">Hearsay</option>
              <option value="leading">Leading</option>
            </select>
            <span className="small">{objection !== "none" ? "Penalty applied." : "No penalty applied."}</span>
          </div>

          <div style={{ marginTop: 12 }}>
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="small">Jury votes guilty: {juryVotesGuilty} / {totalJurors} (not guilty: {innocenceVotes})</div>
            <input
              type="range" min={0} max={totalJurors} value={juryVotesGuilty}
              onChange={(e) => setJuryVotesGuilty(clamp(parseInt(e.target.value, 10) || 0, 0, totalJurors))}
              style={{ width: "100%" }} aria-label="Jury votes guilty"
            />
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <div className="small">Strength score: <strong>{strength.toFixed(1)}</strong></div>
            <button onClick={submitVerdict} style={{ marginLeft: "auto" }}>
              <img src="/icon/export.svg" alt="" aria-hidden="true" className="icon" />
              Deliver Verdict
            </button>
          </div>
        </div>
      </div>

      <hr />

      <div className="row">
        <button onClick={newCase}>
          <img src="/icon/dice.svg" alt="" aria-hidden="true" className="icon" />
          New Case (generate another)
        </button>
        <button onClick={() => {
          const payload = {
            caseId: current.id, type: current.type, selectedEvidence, selectedWitness, objection,
            juryVotesGuilty, notes, strength,
          };
          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url; a.download = `courtroom-${current.id}.json`; a.click();
          URL.revokeObjectURL(url);
        }}>
          <img src="/icon/export.svg" alt="" aria-hidden="true" className="icon" />
          Export Decision JSON
        </button>
      </div>

      <button onClick={async () => {
        const payload = {
        caseId: current.id,
        caseType: current.type,
        caseTitle: current.title,
        caseSummary: current.summary,
        selectedEvidence,
        selectedWitness,
        objection,
        juryVotesGuilty,
        notes,
        strength,
     };
  const res = await fetch("/api/decisions", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(payload) });
  const data = await res.json();
  alert(res.ok ? `Saved decision #${data.id}` : `Save failed: ${data.error || res.statusText}`);
}}>
  <img src="/icon/export.svg" alt="" aria-hidden="true" className="icon" />
  Save to DB
</button>

<button onClick={async () => {
  const payload = {
    caseId: current.id,
    caseType: current.type,
    caseTitle: current.title,
    caseSummary: current.summary,
    selectedEvidence,
    selectedWitness,
    objection,
    juryVotesGuilty,
    notes,
    strength,
  };
  const res = await fetch("/api/decisions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  alert(res.ok ? `Saved decision #${data.id}` : `Save failed: ${data.error || res.statusText}`);
}}>
  <img src="/icon/export.svg" alt="" aria-hidden="true" className="icon" />
  Save to DB
</button>



      {/* ===== Verdict Modal ===== */}
      {verdictOpen && verdict && (
        <div role="dialog" aria-modal="true" aria-labelledby="verdict-title" className="modal">
          <div className="modal-card">
            <h3 id="verdict-title" style={{ marginTop: 0 }}>
              <img src="/icon/gavel.svg" alt="" aria-hidden="true" className="icon" />
              Verdict
            </h3>
            <p style={{ fontSize: "1.1rem", fontWeight: 700 }}>{verdict.result}</p>
            <ul style={{ marginTop: 0 }}>
              <li><strong>Burden:</strong> {verdict.burden}</li>
              <li><strong>Strength score:</strong> {verdict.score}</li>
              <li><strong>Jury:</strong> {verdict.jury}</li>
            </ul>
            <div className="row" style={{ justifyContent: "flex-end", marginTop: 10 }}>
              <button onClick={() => setVerdictOpen(false)}>Close</button>
              <button onClick={() => { setVerdictOpen(false); newCase(); }} style={{ marginLeft: 6 }}>
                <img src="/icon/dice.svg" alt="" aria-hidden="true" className="icon" />
                New Case
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
 