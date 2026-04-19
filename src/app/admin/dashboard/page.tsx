'use client';

import { useEffect, useState, useRef } from 'react';
import { db } from '@/lib/firebase';
import {
  collection, onSnapshot, query,
  orderBy, doc, updateDoc, limit,
  Timestamp, writeBatch, increment as fbIncrement
} from 'firebase/firestore';

type Tab = 'overview'|'clients'|'retailers'|'transactions'|'orders'|'activity';

interface Client { uid:string;name:string;email:string;phone:string;coinBalance:number;
  currentStreak:number;totalEarned:number;totalSpent:number;referralCount:number;referralCode:string;
  isOnline:boolean;isActive:boolean;hasSpunWheel:boolean;createdAt:Timestamp;lastSeen:Timestamp; }

interface Retailer { uid:string;name:string;ownerName:string;storeName:string;firmName:string;
  email:string;phone:string;address:string;city:string;state:string;pincode:string;category:string;
  gstNo:string;panNo:string;aadhaarNo:string;gstBillUrl:string;panCardUrl:string;aadhaarUrl:string;
  isVerified:boolean;isOnline:boolean;isActive:boolean;storeDetailsComplete:boolean;docsUploadPending:boolean;
  totalOrders:number;totalRevenue:number;rating:number;createdAt:Timestamp;lastSeen:Timestamp; }

interface Transaction { id:string;uid:string;retailerUid?:string;userName:string;userEmail:string;
  userPhone:string;storeName?:string;title:string;subtitle:string;amount:number;billAmount?:number;
  type:string;paymentMode?:string;upiApp?:string;status?:string;createdAt:Timestamp; }

interface Order { id:string;retailerUid:string;customerUid:string;storeName:string;customerName:string;
  customerPhone:string;amount:number;coinsAwarded:number;items:string;paymentMode:string;
  upiApp?:string;status:string;notes?:string;createdAt:Timestamp; }

interface Log { id:string;uid:string;type:string;firmName?:string;phone?:string;email?:string;
  details?:string;timestamp:Timestamp; }

const ago = (ts?:Timestamp) => {
  if (!ts?.seconds) return '—';
  const s = Math.floor(Date.now()/1000)-ts.seconds;
  if (s<60) return `${s}s ago`; if (s<3600) return `${Math.floor(s/60)}m ago`;
  if (s<86400) return `${Math.floor(s/3600)}h ago`; return `${Math.floor(s/86400)}d ago`;
};
const fmtDate = (ts?:Timestamp) => ts?.seconds ? new Date(ts.seconds*1000).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'2-digit'}) : '—';
const fmtNum = (n:number=0) => n.toLocaleString('en-IN');
const txEmoji = (t:string) => ({bonus:'🎁',earned:'🛍️',spent:'💸',referral:'👥',streak:'🔥',spin:'🎡'}[t]??'🪙');
const pmEmoji = (m:string) => ({upi:'📲',cash:'💵',card:'💳'}[m]??'💳');
const isToday = (ts?:Timestamp) => ts?.seconds ? new Date(ts.seconds*1000).toDateString()===new Date().toDateString() : false;

const COLORS = ['#7b5cf0','#ff6b35','#34c759','#4facfe','#ff3b5c','#ffd700','#00b4d8','#e040fb'];

function Avatar({name,sz=34}:{name:string;sz?:number}) {
  const c = COLORS[(name?.charCodeAt(0)||0)%COLORS.length];
  return <div style={{width:sz,height:sz,borderRadius:Math.round(sz*.3),background:c,display:'flex',
    alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:Math.round(sz*.42),color:'#fff',flexShrink:0}}>
    {name?.[0]?.toUpperCase()||'?'}</div>;
}

function Dot({on}:{on:boolean}) {
  return <span style={{display:'inline-flex',alignItems:'center',gap:4,padding:'2px 8px',borderRadius:20,
    fontSize:11,fontWeight:700,background:on?'#34c75918':'#1e1c2e',color:on?'#34c759':'#6b6888'}}>
    <span style={{width:5,height:5,borderRadius:'50%',background:on?'#34c759':'#555',display:'inline-block'}}/>
    {on?'Online':'Offline'}</span>;
}

function STag({s}:{s:string}) {
  const m:Record<string,[string,string]> = {completed:['#34c75920','#34c759'],pending:['#ff950020','#ff9500'],
    cancelled:['#ff3b5c20','#ff3b5c'],confirmed:['#4facfe20','#4facfe']};
  const [bg,col] = m[s]||['#2a2840','#9990c0'];
  return <span style={{display:'inline-flex',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:700,background:bg,color:col}}>{s}</span>;
}

function Skel() {
  return <>{Array(4).fill(0).map((_,i)=>(
    <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',borderBottom:'1px solid #0d0d1e'}}>
      <div style={{width:32,height:32,borderRadius:10,background:'#1e1c2e',flexShrink:0}}/>
      <div style={{flex:1}}>
        <div style={{height:11,background:'#1e1c2e',borderRadius:4,width:'45%',marginBottom:6}}/>
        <div style={{height:9,background:'#1e1c2e',borderRadius:4,width:'65%'}}/>
      </div>
    </div>
  ))}</>;
}

export default function AdminPage() {
  const [tab, setTab]    = useState<Tab>('overview');
  const [clients, setC]  = useState<Client[]>([]);
  const [retail, setR]   = useState<Retailer[]>([]);
  const [txs, setT]      = useState<Transaction[]>([]);
  const [orders, setO]   = useState<Order[]>([]);
  const [logs, setL]     = useState<Log[]>([]);
  const [loading, setLd] = useState(true);
  const [search, setSr]  = useState('');
  const [toast, setTs]   = useState('');
  const [tType, setTT]   = useState<'ok'|'err'>('ok');
  const [docM, setDocM]  = useState<Retailer|null>(null);
  const [cliM, setCliM]  = useState<Client|null>(null);
  const [ordM, setOrdM]  = useState<Order|null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const toast$ = (msg:string,tp:'ok'|'err'='ok') => {
    setTs(msg); setTT(tp); clearTimeout(timer.current);
    timer.current = setTimeout(()=>setTs(''),3500);
  };

  useEffect(() => {
    const us:Array<()=>void> = [];
    us.push(onSnapshot(query(collection(db,'users'),orderBy('createdAt','desc')),
      s=>{setC(s.docs.map(d=>({uid:d.id,...d.data()} as Client)));setLd(false);}));
    us.push(onSnapshot(query(collection(db,'retailers'),orderBy('createdAt','desc')),
      s=>setR(s.docs.map(d=>({uid:d.id,...d.data()} as Retailer)))));
    us.push(onSnapshot(query(collection(db,'transactions'),orderBy('createdAt','desc'),limit(300)),
      s=>setT(s.docs.map(d=>({id:d.id,...d.data()} as Transaction)))));
    us.push(onSnapshot(query(collection(db,'orders'),orderBy('createdAt','desc'),limit(300)),
      s=>setO(s.docs.map(d=>({id:d.id,...d.data()} as Order)))));
    us.push(onSnapshot(query(collection(db,'activity_logs'),orderBy('timestamp','desc'),limit(100)),
      s=>setL(s.docs.map(d=>({id:d.id,...d.data()} as Log)))));
    return ()=>us.forEach(u=>u());
  },[]);

  const verify = async (uid:string) => {
    await updateDoc(doc(db,'retailers',uid),{isVerified:true,verifiedAt:Timestamp.now()});
    toast$('✅ Retailer verified!');
  };
  const toggle = async (uid:string,col:string,cur:boolean) => {
    await updateDoc(doc(db,col,uid),{isActive:!cur});
    toast$(cur?'🚫 Suspended':'✅ Activated');
  };
  const award = async (uid:string,coins:number,name:string) => {
    const b=writeBatch(db);
    b.update(doc(db,'users',uid),{coinBalance:fbIncrement(coins),totalEarned:fbIncrement(coins)});
    b.set(doc(collection(db,'transactions')),{uid,userName:name,title:'Admin Bonus',
      subtitle:'Manually awarded by admin',amount:coins,type:'bonus',createdAt:Timestamp.now()});
    await b.commit();
    toast$(`🪙 +${coins} coins → ${name}`);
  };

  const totalCoins   = clients.reduce((s,c)=>s+(c.coinBalance||0),0);
  const onlineC      = clients.filter(c=>c.isOnline).length;
  const onlineR      = retail.filter(r=>r.isOnline).length;
  const pendV        = retail.filter(r=>!r.isVerified).length;
  const todayC       = clients.filter(c=>isToday(c.createdAt)).length;
  const todayO       = orders.filter(o=>isToday(o.createdAt)).length;
  const totalRev     = orders.reduce((s,o)=>s+(o.amount||0),0);
  const pendO        = orders.filter(o=>o.status==='pending').length;
  const totalTxC     = txs.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0);

  const q = search.toLowerCase();
  const fC = clients.filter(c=>!q||c.name?.toLowerCase().includes(q)||c.email?.toLowerCase().includes(q)||c.phone?.includes(q));
  const fR = retail.filter(r=>!q||r.storeName?.toLowerCase().includes(q)||r.ownerName?.toLowerCase().includes(q)||r.phone?.includes(q));
  const fT = txs.filter(t=>!q||t.userName?.toLowerCase().includes(q)||t.title?.toLowerCase().includes(q));
  const fO = orders.filter(o=>!q||o.customerName?.toLowerCase().includes(q)||o.storeName?.toLowerCase().includes(q)||o.items?.toLowerCase().includes(q));

  const S = {fontFamily:"'DM Sans',sans-serif",minHeight:'100vh',background:'#0b0b12',color:'#ddd8f0'};
  const card = {background:'#13132a',borderRadius:16,border:'1px solid #1e1c2e'} as const;

  return (
    <div style={S}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#2a2840;border-radius:3px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes slideIn{from{transform:translateY(-10px);opacity:0}to{transform:translateY(0);opacity:1}}
        table{border-collapse:collapse;width:100%}
        thead th{padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:#6b6888;
          text-transform:uppercase;letter-spacing:.7px;border-bottom:1px solid #1e1c2e;white-space:nowrap}
        tbody td{padding:10px 14px;font-size:13px;border-bottom:1px solid #16162a;vertical-align:middle}
        tbody tr:hover td{background:rgba(123,92,240,.05)}
        .btn{padding:5px 12px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;
          border:none;font-family:'DM Sans',sans-serif;transition:opacity .15s}
        .btn:hover{opacity:.8}.btn:active{transform:scale(.97)}
        .inp{background:#16162a;border:1px solid #2a2840;color:#ddd8f0;padding:9px 14px;
          border-radius:10px;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;
          width:100%;box-sizing:border-box;transition:border-color .15s}
        .inp:focus{border-color:#7b5cf0}.inp::placeholder{color:#4a4860}
        .nav{display:flex;align-items:center;gap:9px;width:100%;padding:9px 12px;border-radius:10px;
          border:none;cursor:pointer;text-align:left;font-family:'DM Sans',sans-serif;font-size:13.5px;
          transition:all .15s;background:transparent;color:#5a5878;border-left:2px solid transparent}
        .nav.on{background:rgba(123,92,240,.12);color:#c4b5fd;border-left:2px solid #7b5cf0;font-weight:600}
        .nav:hover:not(.on){background:rgba(255,255,255,.04);color:#9990c0}
        .mbg{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9998;
          display:flex;align-items:center;justify-content:center;padding:20px;animation:slideIn .2s}
        .mc{background:#13132a;border-radius:20px;border:1px solid #2a2840;max-width:620px;
          width:100%;max-height:90vh;overflow-y:auto}
      `}</style>

      {toast && <div style={{position:'fixed',top:16,right:16,zIndex:9999,animation:'slideIn .2s',
        background:tType==='ok'?'#1a2e1a':'#2e1a1a',border:`1px solid ${tType==='ok'?'#34c759':'#ff3b5c'}`,
        padding:'11px 16px',borderRadius:12,fontSize:13,fontWeight:600,
        color:tType==='ok'?'#34c759':'#ff3b5c',boxShadow:'0 8px 32px rgba(0,0,0,.4)'}}>
        {toast}
      </div>}

      {/* DOC MODAL */}
      {docM && <div className="mbg" onClick={()=>setDocM(null)}>
        <div className="mc" style={{padding:24}} onClick={e=>e.stopPropagation()}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
            <div>
              <div style={{fontSize:17,fontWeight:800}}>{docM.storeName||docM.firmName}</div>
              <div style={{fontSize:12,color:'#6b6888',marginTop:2}}>{docM.ownerName||docM.name} · {docM.phone}</div>
            </div>
            <button onClick={()=>setDocM(null)} style={{background:'none',border:'none',color:'#888',fontSize:22,cursor:'pointer'}}>✕</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:18}}>
            {[['GST Bill',docM.gstBillUrl],['PAN Card',docM.panCardUrl],['Aadhaar',docM.aadhaarUrl]].map(([lbl,url])=>(
              <div key={lbl as string}>
                <div style={{fontSize:11,color:'#6b6888',marginBottom:5}}>{lbl}</div>
                {url ? <a href={url as string} target="_blank" rel="noreferrer">
                  <img src={url as string} alt={lbl as string} style={{width:'100%',borderRadius:10,border:'1px solid #2a2840',maxHeight:100,objectFit:'cover'}}/>
                </a> : <div style={{background:'#0b0b12',borderRadius:10,height:80,display:'flex',alignItems:'center',justifyContent:'center',color:'#4a4860',fontSize:11,border:'1px dashed #2a2840'}}>
                  {docM.docsUploadPending?'⏳ Uploading':'Not uploaded'}</div>}
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:18}}>
            {[['GST',docM.gstNo],['PAN',docM.panNo],['Aadhaar',docM.aadhaarNo],['Phone',docM.phone],
              ['Email',docM.email],['Category',docM.category],['City',docM.city],['State',docM.state],
              ['Pincode',docM.pincode],['Joined',fmtDate(docM.createdAt)]].map(([k,v])=>(
              <div key={k as string} style={{background:'#0b0b12',padding:'9px 12px',borderRadius:9,border:'1px solid #16162a'}}>
                <div style={{fontSize:10,color:'#6b6888',marginBottom:2}}>{k}</div>
                <div style={{fontSize:12,fontWeight:600,fontFamily:'DM Mono',wordBreak:'break-all'}}>{v||'—'}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:8}}>
            {!docM.isVerified && <button className="btn" onClick={()=>{verify(docM.uid);setDocM(null);}}
              style={{flex:1,padding:'11px',background:'linear-gradient(135deg,#34c759,#30d158)',color:'#fff',borderRadius:11,fontSize:13}}>
              ✅ Verify Retailer</button>}
            {docM.isActive
              ? <button className="btn" onClick={()=>{toggle(docM.uid,'retailers',true);setDocM(null);}}
                  style={{flex:1,padding:'11px',background:'#2e1a1a',color:'#ff3b5c',border:'1px solid #ff3b5c33',borderRadius:11,fontSize:13}}>🚫 Suspend</button>
              : <button className="btn" onClick={()=>{toggle(docM.uid,'retailers',false);setDocM(null);}}
                  style={{flex:1,padding:'11px',background:'#1a2e1a',color:'#34c759',border:'1px solid #34c75933',borderRadius:11,fontSize:13}}>✅ Activate</button>}
          </div>
        </div>
      </div>}

      {/* CLIENT MODAL */}
      {cliM && <div className="mbg" onClick={()=>setCliM(null)}>
        <div className="mc" style={{padding:24}} onClick={e=>e.stopPropagation()}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <Avatar name={cliM.name} sz={48}/>
              <div>
                <div style={{fontSize:17,fontWeight:800}}>{cliM.name}</div>
                <div style={{fontSize:12,color:'#6b6888'}}>{cliM.email}</div>
              </div>
            </div>
            <button onClick={()=>setCliM(null)} style={{background:'none',border:'none',color:'#888',fontSize:22,cursor:'pointer'}}>✕</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
            {[['Phone',cliM.phone],['Referral Code',cliM.referralCode],
              ['Coins','🪙 '+cliM.coinBalance],['Total Earned','🪙 '+cliM.totalEarned],
              ['Total Spent','🪙 '+cliM.totalSpent],['Streak','🔥 '+cliM.currentStreak+' days'],
              ['Referrals',cliM.referralCount?.toString()],['Spun Wheel',cliM.hasSpunWheel?'✅ Yes':'❌ No'],
              ['Status',cliM.isOnline?'🟢 Online':'⚫ Offline'],['Joined',fmtDate(cliM.createdAt)]
            ].map(([k,v])=>(
              <div key={k as string} style={{background:'#0b0b12',padding:'9px 12px',borderRadius:9,border:'1px solid #16162a'}}>
                <div style={{fontSize:10,color:'#6b6888',marginBottom:2}}>{k}</div>
                <div style={{fontSize:13,fontWeight:700}}>{v||'—'}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:12,color:'#6b6888',marginBottom:8}}>Award coins manually:</div>
            <div style={{display:'flex',gap:8}}>
              {[10,25,50,100].map(c=>(
                <button key={c} className="btn" onClick={()=>award(cliM.uid,c,cliM.name)}
                  style={{flex:1,padding:'9px',background:'rgba(123,92,240,.15)',color:'#c4b5fd',border:'1px solid #7b5cf033',borderRadius:9,fontSize:13}}>
                  +{c}🪙</button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            {cliM.isActive
              ? <button className="btn" onClick={()=>{toggle(cliM.uid,'users',true);setCliM(null);}}
                  style={{flex:1,padding:'10px',background:'#2e1a1a',color:'#ff3b5c',border:'1px solid #ff3b5c33',borderRadius:10}}>🚫 Suspend</button>
              : <button className="btn" onClick={()=>{toggle(cliM.uid,'users',false);setCliM(null);}}
                  style={{flex:1,padding:'10px',background:'#1a2e1a',color:'#34c759',border:'1px solid #34c75933',borderRadius:10}}>✅ Activate</button>}
          </div>
        </div>
      </div>}

      {/* ORDER MODAL */}
      {ordM && <div className="mbg" onClick={()=>setOrdM(null)}>
        <div className="mc" style={{padding:24}} onClick={e=>e.stopPropagation()}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}>
            <div style={{fontSize:17,fontWeight:800}}>Order Details</div>
            <button onClick={()=>setOrdM(null)} style={{background:'none',border:'none',color:'#888',fontSize:22,cursor:'pointer'}}>✕</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {[['Customer',ordM.customerName],['Phone',ordM.customerPhone],
              ['Store',ordM.storeName],['Amount','₹'+ordM.amount],
              ['Items',ordM.items],['Payment',`${pmEmoji(ordM.paymentMode)} ${ordM.paymentMode}${ordM.upiApp?` (${ordM.upiApp})`:''}`],
              ['Coins Awarded','🪙 +'+ordM.coinsAwarded],['Status',ordM.status],
              ['Date',fmtDate(ordM.createdAt)],['Notes',ordM.notes||'—']
            ].map(([k,v])=>(
              <div key={k as string} style={{background:'#0b0b12',padding:'9px 12px',borderRadius:9,border:'1px solid #16162a'}}>
                <div style={{fontSize:10,color:'#6b6888',marginBottom:2}}>{k}</div>
                <div style={{fontSize:13,fontWeight:600}}>{v||'—'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>}

      <div style={{display:'flex',minHeight:'100vh'}}>
        {/* SIDEBAR */}
        <aside style={{width:216,background:'#090912',borderRight:'1px solid #16162a',
          padding:'18px 10px',display:'flex',flexDirection:'column',
          position:'fixed',top:0,bottom:0,left:0,overflowY:'auto',zIndex:100}}>
          <div style={{padding:'4px 8px 18px',borderBottom:'1px solid #16162a',marginBottom:14}}>
            <div style={{display:'flex',alignItems:'center',gap:9}}>
              <div style={{width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#7b5cf0,#9b59d4)',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>🪙</div>
              <div><div style={{fontSize:13.5,fontWeight:800}}>Baps Admin</div>
                <div style={{fontSize:10.5,color:'#6b6888'}}>Control Panel</div></div>
            </div>
          </div>
          {([['overview','📊','Overview'],['clients','👥','Clients'],['retailers','🏪','Retailers'],
            ['transactions','💳','Transactions'],['orders','📦','Orders'],['activity','🔔','Activity']] as [Tab,string,string][]).map(([id,icon,lbl])=>(
            <button key={id} className={`nav${tab===id?' on':''}`} onClick={()=>{setTab(id);setSr('');}}>
              <span style={{fontSize:14}}>{icon}</span>{lbl}
              {id==='retailers'&&pendV>0&&<span style={{marginLeft:'auto',background:'#ff9500',color:'#fff',borderRadius:20,padding:'1px 7px',fontSize:10,fontWeight:800}}>{pendV}</span>}
              {id==='orders'&&pendO>0&&<span style={{marginLeft:'auto',background:'#ff3b5c',color:'#fff',borderRadius:20,padding:'1px 7px',fontSize:10,fontWeight:800}}>{pendO}</span>}
            </button>
          ))}
          <div style={{marginTop:'auto',paddingTop:14,borderTop:'1px solid #16162a'}}>
            <div style={{display:'flex',alignItems:'center',gap:7,padding:'9px 10px',background:'#0b0b12',borderRadius:10,border:'1px solid #16162a'}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:'#34c759',boxShadow:'0 0 6px #34c759',animation:'pulse 2s infinite',flexShrink:0}}/>
              <div><div style={{fontSize:11,color:'#34c759',fontWeight:700}}>Live</div>
                <div style={{fontSize:10,color:'#6b6888'}}>{clients.length+retail.length} records</div></div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{marginLeft:216,flex:1,padding:22,minWidth:0}}>

          {/* OVERVIEW */}
          {tab==='overview' && <>
            <div style={{marginBottom:22}}>
              <div style={{fontSize:21,fontWeight:800,marginBottom:3}}>Dashboard Overview</div>
              <div style={{color:'#6b6888',fontSize:12.5}}>All collections streaming live from Firebase</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:11,marginBottom:22}}>
              {[['👥','Total Clients',fmtNum(clients.length),'#c4b5fd'],
                ['🟢','Online Now',fmtNum(onlineC),'#34c759'],
                ['✨','New Today',fmtNum(todayC),'#4facfe'],
                ['🪙','Coins Total',fmtNum(totalCoins),'#ffd700'],
                ['🏪','Retailers',fmtNum(retail.length),'#ff9500'],
                ['⏳','Pending Verify',fmtNum(pendV),'#ff6b35'],
                ['📦','Total Orders',fmtNum(orders.length),'#34c759'],
                ['💰','Revenue',`₹${fmtNum(totalRev)}`,'#34c759'],
                ['🎯','Today Orders',fmtNum(todayO),'#4facfe'],
                ['💳','Tx Coins',fmtNum(totalTxC),'#c4b5fd'],
              ].map(([icon,lbl,val,clr])=>(
                <div key={lbl as string} style={{...card,padding:'16px 14px'}}>
                  <div style={{fontSize:24,marginBottom:7}}>{icon}</div>
                  <div style={{fontSize:21,fontWeight:900,color:clr as string,lineHeight:1}}>{val}</div>
                  <div style={{fontSize:11,color:'#6b6888',marginTop:4}}>{lbl}</div>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
              {/* Recent clients */}
              <div style={card}>
                <div style={{padding:'13px 16px',borderBottom:'1px solid #16162a',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontWeight:700,fontSize:13.5}}>Recent Clients</span>
                  <button onClick={()=>setTab('clients')} style={{background:'none',border:'none',color:'#7b5cf0',fontSize:12,cursor:'pointer',fontWeight:600}}>All →</button>
                </div>
                {loading?<Skel/>:clients.slice(0,5).map(c=>(
                  <div key={c.uid} onClick={()=>setCliM(c)} style={{display:'flex',alignItems:'center',gap:9,padding:'10px 16px',
                    borderBottom:'1px solid #0d0d1e',cursor:'pointer',transition:'background .15s'}}
                    onMouseEnter={e=>(e.currentTarget.style.background='rgba(123,92,240,.05)')}
                    onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                    <Avatar name={c.name} sz={30}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</div>
                      <div style={{fontSize:11,color:'#6b6888',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.email}</div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:'#c4b5fd'}}>🪙{c.coinBalance}</div>
                      <Dot on={c.isOnline}/>
                    </div>
                  </div>
                ))}
              </div>
              {/* Recent orders */}
              <div style={card}>
                <div style={{padding:'13px 16px',borderBottom:'1px solid #16162a',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontWeight:700,fontSize:13.5}}>Recent Orders</span>
                  <button onClick={()=>setTab('orders')} style={{background:'none',border:'none',color:'#7b5cf0',fontSize:12,cursor:'pointer',fontWeight:600}}>All →</button>
                </div>
                {orders.length===0&&<div style={{padding:28,textAlign:'center',color:'#6b6888',fontSize:13}}>No orders yet</div>}
                {orders.slice(0,5).map(o=>(
                  <div key={o.id} onClick={()=>setOrdM(o)} style={{display:'flex',alignItems:'center',gap:9,padding:'10px 16px',
                    borderBottom:'1px solid #0d0d1e',cursor:'pointer',transition:'background .15s'}}
                    onMouseEnter={e=>(e.currentTarget.style.background='rgba(123,92,240,.05)')}
                    onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                    <div style={{width:30,height:30,borderRadius:9,background:'#34c75920',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,flexShrink:0}}>{pmEmoji(o.paymentMode)}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.customerName}</div>
                      <div style={{fontSize:11,color:'#6b6888'}}>{o.storeName}</div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:'#34c759'}}>₹{o.amount}</div>
                      <div style={{fontSize:11,color:'#c4b5fd'}}>+{o.coinsAwarded}🪙</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {pendV>0&&<div style={card}>
              <div style={{padding:'13px 16px',borderBottom:'1px solid #16162a',display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:15}}>⚠️</span>
                <span style={{fontWeight:700,fontSize:13.5,color:'#ff9500'}}>{pendV} Retailer{pendV>1?'s':''} Awaiting Verification</span>
              </div>
              {retail.filter(r=>!r.isVerified).map(r=>(
                <div key={r.uid} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderBottom:'1px solid #0d0d1e'}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13}}>{r.storeName||r.firmName}</div>
                    <div style={{fontSize:11,color:'#6b6888'}}>{r.ownerName||r.name} · {r.category} · {r.phone} · {fmtDate(r.createdAt)}</div>
                    {r.docsUploadPending&&<div style={{fontSize:11,color:'#ff9500',marginTop:2}}>⏳ Documents still uploading...</div>}
                  </div>
                  <button className="btn" onClick={()=>setDocM(r)} style={{background:'#1e1c2e',color:'#9990c0',marginRight:4}}>Docs</button>
                  <button className="btn" onClick={()=>verify(r.uid)} style={{background:'linear-gradient(135deg,#34c759,#30d158)',color:'#fff'}}>✓ Verify</button>
                </div>
              ))}
            </div>}
          </>}

          {/* CLIENTS */}
          {tab==='clients' && <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18,gap:14}}>
              <div>
                <div style={{fontSize:21,fontWeight:800}}>Clients</div>
                <div style={{color:'#6b6888',fontSize:12.5}}>{fC.length} total · {onlineC} online · {todayC} today</div>
              </div>
              <input className="inp" placeholder="Search name, email, phone..." value={search} onChange={e=>setSr(e.target.value)} style={{maxWidth:280}}/>
            </div>
            <div style={{...card,overflow:'hidden'}}>
              <div style={{overflowX:'auto'}}>
                <table>
                  <thead><tr>
                    <th>Client</th><th>Phone</th><th>Coins</th><th>Earned</th><th>Spent</th>
                    <th>Streak</th><th>Refs</th><th>Wheel</th><th>Status</th><th>Joined</th><th>Seen</th><th>Action</th>
                  </tr></thead>
                  <tbody>
                    {loading?Array(5).fill(0).map((_,i)=><tr key={i}>{Array(12).fill(0).map((_,j)=><td key={j}><div style={{height:11,background:'#1e1c2e',borderRadius:3,width:'65%'}}/></td>)}</tr>)
                    :fC.map(c=>(
                      <tr key={c.uid} style={{cursor:'pointer'}} onClick={()=>setCliM(c)}>
                        <td><div style={{display:'flex',alignItems:'center',gap:8}}>
                          <Avatar name={c.name} sz={30}/>
                          <div>
                            <div style={{fontWeight:600,fontSize:12.5}}>{c.name}</div>
                            <div style={{fontSize:10.5,color:'#6b6888',overflow:'hidden',textOverflow:'ellipsis',maxWidth:140,whiteSpace:'nowrap'}}>{c.email}</div>
                          </div>
                        </div></td>
                        <td style={{fontFamily:'DM Mono',fontSize:11.5}}>{c.phone||'—'}</td>
                        <td><span style={{fontWeight:800,color:'#c4b5fd'}}>🪙{c.coinBalance??0}</span></td>
                        <td style={{color:'#34c759',fontWeight:600,fontSize:12}}>+{c.totalEarned??0}</td>
                        <td style={{color:'#ff3b5c',fontWeight:600,fontSize:12}}>-{c.totalSpent??0}</td>
                        <td><span style={{color:'#ff6b35',fontWeight:600}}>🔥{c.currentStreak??0}d</span></td>
                        <td style={{textAlign:'center'}}>{c.referralCount??0}</td>
                        <td><span style={{display:'inline-flex',padding:'2px 8px',borderRadius:20,fontSize:10.5,fontWeight:700,
                          background:c.hasSpunWheel?'#34c75922':'#ff950022',color:c.hasSpunWheel?'#34c759':'#ff9500'}}>
                          {c.hasSpunWheel?'✓':'⏳'}</span></td>
                        <td><Dot on={c.isOnline}/>{!c.isActive&&<span style={{display:'block',marginTop:3,padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:700,background:'#ff3b5c22',color:'#ff3b5c'}}>Suspended</span>}</td>
                        <td style={{fontSize:11,color:'#6b6888',whiteSpace:'nowrap'}}>{fmtDate(c.createdAt)}</td>
                        <td style={{fontSize:11,color:'#6b6888',whiteSpace:'nowrap'}}>{ago(c.lastSeen)}</td>
                        <td onClick={e=>e.stopPropagation()}>
                          {c.isActive
                            ?<button className="btn" onClick={()=>toggle(c.uid,'users',true)} style={{background:'#ff3b5c22',color:'#ff3b5c'}}>Suspend</button>
                            :<button className="btn" onClick={()=>toggle(c.uid,'users',false)} style={{background:'#34c75922',color:'#34c759'}}>Activate</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>}

          {/* RETAILERS */}
          {tab==='retailers' && <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18,gap:14}}>
              <div>
                <div style={{fontSize:21,fontWeight:800}}>Retailers</div>
                <div style={{color:'#6b6888',fontSize:12.5}}>{fR.length} total · {pendV} pending · {onlineR} online</div>
              </div>
              <input className="inp" placeholder="Search store, owner, phone..." value={search} onChange={e=>setSr(e.target.value)} style={{maxWidth:280}}/>
            </div>
            <div style={{...card,overflow:'hidden'}}>
              <div style={{overflowX:'auto'}}>
                <table>
                  <thead><tr>
                    <th>Store</th><th>Owner</th><th>Category</th><th>Orders</th><th>Revenue</th>
                    <th>Rating</th><th>Verified</th><th>Setup</th><th>Docs</th><th>Status</th><th>Joined</th><th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {fR.map(r=>(
                      <tr key={r.uid}>
                        <td><div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div style={{width:30,height:30,borderRadius:9,background:'linear-gradient(135deg,#4facfe,#00f2fe)',
                            display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:13,color:'#fff',flexShrink:0}}>
                            {(r.storeName||r.firmName||'?')[0]?.toUpperCase()}</div>
                          <div>
                            <div style={{fontWeight:600,fontSize:12.5}}>{r.storeName||r.firmName}</div>
                            <div style={{fontSize:10.5,color:'#6b6888'}}>{r.email}</div>
                          </div>
                        </div></td>
                        <td>
                          <div style={{fontSize:12.5}}>{r.ownerName||r.name}</div>
                          <div style={{fontSize:10.5,color:'#6b6888',fontFamily:'DM Mono'}}>{r.phone}</div>
                        </td>
                        <td><span style={{display:'inline-flex',padding:'2px 9px',borderRadius:20,fontSize:11,fontWeight:700,background:'#7b5cf022',color:'#c4b5fd'}}>{r.category||'—'}</span></td>
                        <td style={{fontWeight:700}}>{r.totalOrders??0}</td>
                        <td style={{fontWeight:700,color:'#34c759'}}>₹{fmtNum(r.totalRevenue??0)}</td>
                        <td style={{color:'#ffd700'}}>{r.rating>0?`⭐${r.rating.toFixed(1)}`:'—'}</td>
                        <td><span style={{display:'inline-flex',padding:'2px 9px',borderRadius:20,fontSize:11,fontWeight:700,
                          background:r.isVerified?'#34c75922':'#ff950022',color:r.isVerified?'#34c759':'#ff9500'}}>
                          {r.isVerified?'✓ Verified':'⏳ Pending'}</span></td>
                        <td><span style={{display:'inline-flex',padding:'2px 9px',borderRadius:20,fontSize:11,fontWeight:700,
                          background:r.storeDetailsComplete?'#34c75922':'#ff3b5c22',color:r.storeDetailsComplete?'#34c759':'#ff3b5c'}}>
                          {r.storeDetailsComplete?'Done':'Incomplete'}</span></td>
                        <td><span style={{display:'inline-flex',padding:'2px 9px',borderRadius:20,fontSize:11,fontWeight:700,
                          background:r.docsUploadPending?'#ff950022':'#34c75922',color:r.docsUploadPending?'#ff9500':'#34c759'}}>
                          {r.docsUploadPending?'⏳ Pending':'✓ Ready'}</span></td>
                        <td><Dot on={r.isOnline}/></td>
                        <td style={{fontSize:11,color:'#6b6888',whiteSpace:'nowrap'}}>{fmtDate(r.createdAt)}</td>
                        <td><div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                          <button className="btn" onClick={()=>setDocM(r)} style={{background:'#1e1c2e',color:'#9990c0'}}>Docs</button>
                          {!r.isVerified&&<button className="btn" onClick={()=>verify(r.uid)} style={{background:'linear-gradient(135deg,#34c759,#30d158)',color:'#fff'}}>Verify</button>}
                          {r.isActive
                            ?<button className="btn" onClick={()=>toggle(r.uid,'retailers',true)} style={{background:'#ff3b5c22',color:'#ff3b5c'}}>Suspend</button>
                            :<button className="btn" onClick={()=>toggle(r.uid,'retailers',false)} style={{background:'#34c75922',color:'#34c759'}}>Activate</button>}
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>}

          {/* TRANSACTIONS */}
          {tab==='transactions' && <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18,gap:14}}>
              <div>
                <div style={{fontSize:21,fontWeight:800}}>Transactions</div>
                <div style={{color:'#6b6888',fontSize:12.5}}>{fT.length} total · {fmtNum(totalTxC)} coins transacted</div>
              </div>
              <input className="inp" placeholder="Search user, title..." value={search} onChange={e=>setSr(e.target.value)} style={{maxWidth:280}}/>
            </div>
            <div style={{...card,overflow:'hidden'}}>
              <table>
                <thead><tr><th>Type</th><th>Client</th><th>Store</th><th>Title</th><th>Coins</th><th>Bill</th><th>Payment</th><th>When</th></tr></thead>
                <tbody>
                  {fT.map(t=>(
                    <tr key={t.id}>
                      <td><div style={{width:32,height:32,borderRadius:9,background:'#7b5cf022',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>{txEmoji(t.type)}</div></td>
                      <td>
                        <div style={{fontWeight:600,fontSize:12.5}}>{t.userName||'—'}</div>
                        <div style={{fontSize:10.5,color:'#6b6888'}}>{t.userPhone||t.userEmail||''}</div>
                      </td>
                      <td style={{fontSize:12,color:'#9990c0'}}>{t.storeName||'—'}</td>
                      <td>
                        <div style={{fontWeight:600,fontSize:12.5}}>{t.title}</div>
                        <div style={{fontSize:10.5,color:'#6b6888'}}>{t.subtitle}</div>
                      </td>
                      <td><span style={{fontSize:13.5,fontWeight:800,color:t.amount>0?'#34c759':'#ff3b5c'}}>{t.amount>0?'+':''}{t.amount}🪙</span></td>
                      <td style={{fontWeight:600,color:'#9990c0',fontSize:12}}>{t.billAmount?`₹${t.billAmount}`:'—'}</td>
                      <td style={{fontSize:12}}>{t.paymentMode?`${pmEmoji(t.paymentMode)} ${t.upiApp||t.paymentMode}`:'—'}</td>
                      <td style={{fontSize:11,color:'#6b6888',whiteSpace:'nowrap'}}>{ago(t.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>}

          {/* ORDERS */}
          {tab==='orders' && <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18,gap:14}}>
              <div>
                <div style={{fontSize:21,fontWeight:800}}>Orders</div>
                <div style={{color:'#6b6888',fontSize:12.5}}>{fO.length} total · ₹{fmtNum(totalRev)} revenue · {todayO} today</div>
              </div>
              <input className="inp" placeholder="Search customer, store, items..." value={search} onChange={e=>setSr(e.target.value)} style={{maxWidth:280}}/>
            </div>
            {fO.length===0
              ?<div style={{...card,padding:56,textAlign:'center'}}>
                <div style={{fontSize:48,marginBottom:14}}>📭</div>
                <div style={{fontSize:17,fontWeight:700,marginBottom:6}}>No orders yet</div>
                <div style={{color:'#6b6888',fontSize:13}}>Orders appear here in real-time when retailers approve payments</div>
              </div>
              :<div style={{...card,overflow:'hidden'}}>
                <table>
                  <thead><tr><th>Customer</th><th>Store</th><th>Items</th><th>Amount</th><th>Coins</th><th>Payment</th><th>Status</th><th>Date</th><th></th></tr></thead>
                  <tbody>
                    {fO.map(o=>(
                      <tr key={o.id}>
                        <td>
                          <div style={{fontWeight:600,fontSize:12.5}}>{o.customerName||'—'}</div>
                          <div style={{fontSize:10.5,color:'#6b6888',fontFamily:'DM Mono'}}>{o.customerPhone}</div>
                        </td>
                        <td style={{fontSize:12,color:'#9990c0'}}>{o.storeName||'—'}</td>
                        <td style={{fontSize:12,maxWidth:130,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.items||'—'}</td>
                        <td style={{fontWeight:800,color:'#34c759',fontSize:13.5}}>₹{fmtNum(o.amount)}</td>
                        <td style={{color:'#c4b5fd',fontWeight:700}}>+{o.coinsAwarded}🪙</td>
                        <td style={{fontSize:12}}>{pmEmoji(o.paymentMode)} {o.upiApp||o.paymentMode}</td>
                        <td><STag s={o.status}/></td>
                        <td style={{fontSize:11,color:'#6b6888',whiteSpace:'nowrap'}}>{fmtDate(o.createdAt)}</td>
                        <td><button className="btn" onClick={()=>setOrdM(o)} style={{background:'#1e1c2e',color:'#9990c0'}}>View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>}
          </>}

          {/* ACTIVITY */}
          {tab==='activity' && <>
            <div style={{marginBottom:18}}>
              <div style={{fontSize:21,fontWeight:800}}>Activity Log</div>
              <div style={{color:'#6b6888',fontSize:12.5}}>{logs.length} events</div>
            </div>
            <div style={card}>
              {logs.length===0&&<div style={{padding:48,textAlign:'center',color:'#6b6888'}}>No activity yet</div>}
              {logs.map(l=>(
                <div key={l.id} style={{display:'flex',alignItems:'center',gap:11,padding:'12px 16px',borderBottom:'1px solid #0d0d1e'}}>
                  <div style={{width:32,height:32,borderRadius:9,background:'#7b5cf022',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,flexShrink:0}}>
                    {({'user_registration':'🏪','store_details_added':'📝','login':'🔑','payment':'💳'} as Record<string,string>)[l.type]??'🔔'}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13}}>{l.details||l.type.replace(/_/g,' ')}</div>
                    <div style={{fontSize:11,color:'#6b6888'}}>{[l.firmName,l.phone,l.email].filter(Boolean).join(' · ')}</div>
                  </div>
                  <div style={{fontSize:11,color:'#6b6888',whiteSpace:'nowrap'}}>{ago(l.timestamp)}</div>
                </div>
              ))}
            </div>
          </>}

        </main>
      </div>
    </div>
  );
}