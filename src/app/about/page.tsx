export default function About(){
  return (
    <section className="card" aria-labelledby="about-title">
      <h1 id="about-title">About This Site</h1>
      <p>Name: <strong>Hari</strong></p>
      <p>Student Number: <strong>21458565</strong></p>
      <video controls width={720} style={{maxWidth:"100%",borderRadius:12,border:"1px solid var(--border)"}}>
        <source src="/demo.mp4" type="video/mp4" />
      </video>
    </section>
  );
}
