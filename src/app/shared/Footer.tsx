export default function Footer(){
  const studentName = "Hari";
  const studentNumber = "21458565";
  const today = new Date().toLocaleDateString();
  return (
    <footer role="contentinfo" style={{borderTop:"1px solid var(--border)",marginTop:"2rem"}}>
      <div className="container" style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
        <div className="small">© {new Date().getFullYear()} {studentName}</div>
        <div className="small">{studentName} · {studentNumber} · {today}</div>
      </div>
    </footer>
  );
}
