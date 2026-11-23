import {useState,useEffect,useRef} from 'react';import {createRoot} from 'react-dom/client';
const I18N={"en":{"focus":"Focus","short":"Short break","long":"Long break","start":"Start","pause":"Pause","reset":"Reset","sessions":"Sessions","cycles":"cycles","done":"done today","mode":{"focus":"focus","short":"short break","long":"long break"}},"de":{"focus":"Fokus","short":"Kurze Pause","long":"Lange Pause","start":"Start","pause":"Pause","reset":"Reset","sessions":"Einheiten","cycles":"Zyklen","done":"heute erledigt","mode":{"focus":"fokus","short":"kurze pause","long":"lange pause"}}};
let lang=localStorage.getItem('lang')||'en';const t=k=>I18N[lang][k]||k;
const MODES={focus:25*60,short:5*60,long:15*60};
function App(){
  const [mode,setMode]=useState('focus');
  const [left,setLeft]=useState(MODES.focus);
  const [running,setRunning]=useState(false);
  const [sessions,setSessions]=useState(0);
  const [cycles,setCycles]=useState(0);
  const iv=useRef(null);
  useEffect(()=>{if(running){iv.current=setInterval(()=>setLeft(l=>{if(l<=1){clearInterval(iv.current);setRunning(false);if(mode==='focus'){setSessions(s=>s+1);setCycles(c=>{const n=c+1;setLeft(MODES[n%4===0?'long':'short']);return n;});}else setLeft(MODES.focus);return 0;}return l-1;}),1000);}return()=>clearInterval(iv.current);},[running,mode]);
  function switchMode(m){setMode(m);setLeft(MODES[m]);setRunning(false);}
  const total=MODES[mode],pct=left/total;
  const mm=String(Math.floor(left/60)).padStart(2,'0'),ss=String(left%60).padStart(2,'0');
  return <div className="pf">
    <div className="ring">
      <svg width="100%" height="100%" viewBox="0 0 320 320"><circle cx="160" cy="160" r="140" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="14"/><circle cx="160" cy="160" r="140" fill="none" stroke="url(#g)" strokeWidth="14" strokeLinecap="round" strokeDasharray={2*Math.PI*140} strokeDashoffset={2*Math.PI*140*(1-pct)}><defs><linearGradient id="g"><stop offset="0%" stopColor="#4dd8ff"/><stop offset="100%" stopColor="#b48cff"/></linearGradient></defs></circle></svg>
      <div className="time"><div className="t">{mm}:{ss}</div><div className="mode">{t('mode')[mode]}</div></div>
    </div>
    <div className="ctl">
      <button className="primary" onClick={()=>setRunning(!running)}>{running?t('pause'):t('start')}</button>
      <button onClick={()=>{setLeft(MODES[mode]);setRunning(false);}}>{t('reset')}</button>
    </div>
    <div className="ctl" style={{gap:8}}>{['focus','short','long'].map(m=><button key={m} onClick={()=>switchMode(m)} style={{opacity:mode===m?1:.5}}>{t(m)}</button>)}</div>
    <div className="stats"><div><b>{sessions}</b>{t('sessions')}</div><div><b>{cycles}</b>{t('cycles')}</div><div><b>{sessions*25}</b>{t('done')}</div></div>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);