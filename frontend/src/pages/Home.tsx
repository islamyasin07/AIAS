// src/pages/Home.tsx
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import { font } from "../ui/tokens";
import { button } from "../ui/utils";

export default function Home() {
  return (
    <div style={page}>
      {/* خلفية + بابلز */}
      <div style={bgGrad} />
      <div style={{...blob, top:-80, left:-40, background:"rgba(59,130,246,.16)"}}/>
      <div style={{...blob, bottom:-90, right:-60, background:"rgba(249,115,22,.14)"}}/>

      {/* HERO */}
      <section style={{padding:"44px 14px 18px"}}>
        <div style={heroCard} className="fade-in-up">
          <div style={heroGrid}>
            <div style={{display:"grid", gap:14}}>
              <h1 style={heroTitle}>AIAS – An-Najah Chapter</h1>
              <p style={heroSub}>منصّة طلاب العمارة — موارد، فعاليات، مجتمع، وفرص.</p>
              <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
                <Link to="/events" style={btnAccent}>استكشف الفعاليات</Link>
                <Link to="/resources" style={btnGhostDark}>تصفّح الموارد</Link>
              </div>
            </div>

            {/* JuiceWRLD's*/}
            <div style={heroMedia}>
              <div className="hero-pics">
                <img className="pic p1" src="/juicewrld.jpg" alt="" />
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* أهداف */}
      <section>
        <h2 style={sectionH}>أهداف AIAS</h2>
        <div className="no-gap-grid">
          {[
            {t:"موارد تعليمية",d:"فيديوهات، شروحات، مشاريع طلابية."},
            {t:"فعاليات وورش",d:"إعلانات، تسجيل، إدارة السعة."},
            {t:"مجتمع ودعم",d:"تواصل، فرص، وتوجيه."},
          ].map((c,i)=>(
            <div key={i} className="cell">
              <div style={{fontWeight:800, fontSize:18, color:"#fff"}}>{c.t}</div>
              <div style={{opacity:.85, marginTop:6, color:"rgba(255,255,255,.85)"}}>{c.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      <section style={{marginTop:18}}>
        <Header title="Upcoming Events" to="/events" />
        <div className="no-gap-grid">
          {[1,2,3,4,5,6].map((i)=>(
            <div key={i} className="cell hover">
              <div className="title">Event title #{i}</div>
              <div className="muted">Date • Location</div>
              <Link to="/events" className="btn-dark">سجّل الآن</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section style={{marginTop:18, marginBottom:34}}>
        <Header title="Latest Resources" to="/resources" />
        <div className="no-gap-grid">
          {[1,2,3,4,5,6].map((i)=>(
            <div key={i} className="cell hover">
              <div className="title">Resource #{i}</div>
              <div className="muted">Video • Guide • Link</div>
              <Link to="/resources" className="btn-ghost">تصفّح</Link>
            </div>
          ))}
        </div>
      </section>

      <style>{css}</style>
    </div>
  );
}

function Header({title,to}:{title:string;to:string}){
  return (
    <div style={row}>
      <h2 style={listH}>{title}</h2>
      <Link to={to} style={{color:"#60a5fa", textDecoration:"none", fontWeight:800}}>عرض الكل →</Link>
    </div>
  );
}


const page:CSSProperties={position:"relative",minHeight:"100vh",background:"linear-gradient(180deg,#0b1220 0%,#0f172a 60%,#0a0f1c 100%)"};
const bgGrad:CSSProperties={position:"absolute",inset:0,pointerEvents:"none",background:"radial-gradient(800px 400px at 15% -10%,rgba(255,255,255,.06),transparent 60%)"};
const blob:CSSProperties={position:"absolute",width:360,height:360,borderRadius:"50%",filter:"blur(70px)"};

const heroCard:CSSProperties={
  margin:"0 auto",maxWidth:1100,padding:28,borderRadius:20,
  background:"linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04))",
  border:"1px solid rgba(255,255,255,.12)",boxShadow:"0 30px 80px rgba(0,0,0,.35)",backdropFilter:"blur(8px)"
};
const heroGrid:CSSProperties={display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:24,alignItems:"center"};
const heroTitle:CSSProperties={fontFamily:font.family,fontWeight:font.weight.black,fontSize:38,color:"#fff"};
const heroSub:CSSProperties={color:"rgba(255,255,255,.85)",fontSize:16};
const heroMedia:CSSProperties={position:"relative",height:240,borderRadius:16,overflow:"hidden",border:"none",background:"transparent"};

const sectionH:CSSProperties={color:"#fff",fontFamily:font.family,fontWeight:900,fontSize:22,padding:"0 14px",margin:"8px 0 10px"};
const row:CSSProperties={display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 14px",margin:"8px 0 10px"};
const listH:CSSProperties={color:"#fff",fontSize:20,fontWeight:900,margin:0};

const btnAccent={...button("accent"),boxShadow:"0 6px 20px rgba(249,115,22,.35)"};
const btnGhostDark={...button("onDark"),border:"1px solid rgba(255,255,255,.28)"};

const css = `

.no-gap-grid{
  margin: 0 14px;
  display: grid;
  grid-template-columns: repeat(3,minmax(0,1fr));
  gap: 0;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.08);
}

.cell{
  background: linear-gradient(180deg,#0f1b2d,#0e1826);
  padding: 18px 18px 20px;

  border-right: 1px solid rgba(255,255,255,.06);
  border-bottom: 1px solid rgba(255,255,255,.06);
}
.cell:nth-child(3n){ border-right: none; }       
.cell:nth-last-child(-n+3){ border-bottom: none; }
.title{ font-weight:800; font-size:18px; color:#fff }
.muted{ color:rgba(255,255,255,.75); font-size:13px; margin-top:6px }

.btn-dark{
  display:inline-block; margin-top:10px; padding:8px 10px;
  background:#0b1220; color:#fff; border-radius:12px; font-weight:800; font-size:13px;
  border:1px solid rgba(255,255,255,.18); text-decoration:none;
}
.btn-ghost{
  display:inline-block; margin-top:10px; padding:8px 10px;
  background:transparent; color:#fff; border-radius:12px; font-weight:800; font-size:13px;
  border:1px solid rgba(255,255,255,.28); text-decoration:none;
}

.hover{ transition: transform .16s ease, box-shadow .16s ease; }
.hover:hover{ transform: translateY(-2px); box-shadow: 0 16px 32px rgba(0,0,0,.28) }


.hero-pics{position:relative; width:100%; height:100%;}
.hero-pics .pic{
  position:absolute; inset:0; width:100%; height:100%;
  object-fit:cover; display:block; border:0; outline:0; background:transparent;
  opacity:0; animation:cycle 12s infinite; filter:contrast(1.06) saturate(1.04);
}
.hero-pics .p1{ animation-delay:0s } .hero-pics .p2{ animation-delay:4s } .hero-pics .p3{ animation-delay:8s }
@keyframes cycle{ 0%{opacity:0} 5%{opacity:.95} 30%{opacity:.95} 35%{opacity:0} 100%{opacity:0} }


.fade-in-up{opacity:0; transform:translateY(10px); animation:fadeIn .5s ease forwards}
@keyframes fadeIn{to{opacity:1; transform:translateY(0)}}


@media (max-width: 980px){
  .no-gap-grid{ grid-template-columns: repeat(2,minmax(0,1fr)); }
  .cell:nth-child(3n){ border-right: 1px solid rgba(255,255,255,.06); }
  .cell:nth-child(2n){ border-right: none; }
  .cell:nth-last-child(-n+2){ border-bottom: none; }
}
@media (max-width: 640px){
  .no-gap-grid{ grid-template-columns: 1fr; }
  .cell{ border-right:none }
  .cell:not(:last-child){ border-bottom:1px solid rgba(255,255,255,.06) }
}
`;
