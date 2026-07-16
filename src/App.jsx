import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Wifi, Activity, Globe, Zap, Monitor, Radio, Layers,
  Smartphone, BarChart2, Download, Bell, Bot, Map, Wrench, Code,
  RefreshCw, Shield, AlertTriangle, CheckCircle, XCircle, Info,
  Lock, Server, LayoutDashboard, ArrowDown, ArrowUp,
  Cpu, HardDrive, Thermometer, Database, Signal, Search,
  Settings, Gauge, Network, Eye, Rss, ScanLine, ChevronRight,
  Moon, Sun, Menu, X, Terminal, Package, Antenna
} from "lucide-react";

const C = {
  bg: "#070b14", card: "#0c1120", card2: "#111827",
  border: "#1e2d47", borderHov: "#2a3f65",
  cyan: "#06d6f0", cyanFaint: "rgba(6,214,240,0.1)", cyanMid: "rgba(6,214,240,0.22)",
  purple: "#a855f7", purpleFaint: "rgba(168,85,247,0.12)",
  green: "#22c55e", greenFaint: "rgba(34,197,94,0.1)",
  yellow: "#f59e0b", yellowFaint: "rgba(245,158,11,0.1)",
  red: "#ef4444", redFaint: "rgba(239,68,68,0.1)",
  blue: "#3b82f6",
  text: "#e2e8f0", textSec: "#94a3b8", muted: "#64748b",
};

const ANIM = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes radarSweep {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ripple {
    0%   { transform: scale(0.8); opacity: 0.9; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 6px rgba(6,214,240,0.4); }
    50%       { box-shadow: 0 0 18px rgba(6,214,240,0.8); }
  }
  @keyframes scanLine {
    0%   { transform: translateY(0); opacity: 0.9; }
    100% { transform: translateY(60px); opacity: 0; }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes borderPulse {
    0%, 100% { border-color: rgba(6,214,240,0.3); }
    50%       { border-color: rgba(6,214,240,0.8); }
  }
  .anim-fade { animation: fadeSlideIn 0.35s ease both; }
  .anim-fade-d1 { animation: fadeSlideIn 0.35s 0.04s ease both; }
  .anim-fade-d2 { animation: fadeSlideIn 0.35s 0.08s ease both; }
  .anim-fade-d3 { animation: fadeSlideIn 0.35s 0.12s ease both; }
  .anim-fade-d4 { animation: fadeSlideIn 0.35s 0.16s ease both; }
  .anim-fade-d5 { animation: fadeSlideIn 0.35s 0.20s ease both; }
  .anim-slide-r { animation: slideInRight 0.3s ease both; }
  .hover-card:hover {
    border-color: ${C.borderHov} !important;
    transform: translateY(-1px);
    transition: all 0.18s;
  }
  .nav-btn:hover { background: rgba(6,214,240,0.06) !important; }
  .nav-btn.active { background: rgba(6,214,240,0.12) !important; border-left-color: ${C.cyan} !important; color: ${C.cyan} !important; }
`;

const NETWORKS = [
  { ssid:"ManitNet-AX3600", bssid:"A4:11:62:AA:BB:CC", rssi:-42, snr:45, ch:36, band:"5GHz",  sec:"WPA3", vendor:"Xiaomi",    wifi:"6",  rogue:false, clients:8, width:"80MHz" },
  { ssid:"ManitNet-6GHz",   bssid:"A4:11:62:AA:BB:DD", rssi:-45, snr:42, ch:37, band:"6GHz",  sec:"WPA3", vendor:"Xiaomi",    wifi:"6E", rogue:false, clients:2, width:"160MHz"},
  { ssid:"Optus_5G_Home",   bssid:"BC:EE:7B:11:22:33", rssi:-58, snr:28, ch:6,  band:"2.4GHz",sec:"WPA2", vendor:"Huawei",    wifi:"5",  rogue:false, clients:3, width:"20MHz" },
  { ssid:"ASUS_AX88U",      bssid:"E0:3F:49:CC:DD:EE", rssi:-65, snr:22, ch:100,band:"5GHz",  sec:"WPA3", vendor:"ASUS",      wifi:"6E", rogue:false, clients:5, width:"160MHz"},
  { ssid:"(hidden network)",bssid:"DE:AD:BE:EF:00:01",  rssi:-71, snr:14, ch:1,  band:"2.4GHz",sec:"Open", vendor:"Unknown",   wifi:"4",  rogue:true,  clients:0, width:"20MHz" },
  { ssid:"TPG-Home-WiFi",   bssid:"FC:EC:DA:44:55:66",  rssi:-74, snr:11, ch:11, band:"2.4GHz",sec:"WPA2", vendor:"TP-Link",   wifi:"5",  rogue:false, clients:2, width:"20MHz" },
  { ssid:"Neighbour_NBN",   bssid:"AA:BB:CC:77:88:99",  rssi:-79, snr:8,  ch:48, band:"5GHz",  sec:"WPA2", vendor:"Netgear",   wifi:"5",  rogue:false, clients:4, width:"40MHz" },
];

const DEVICES = [
  { name:"ThinkPad X1 C5",   mac:"A8:93:4A:11:22:33", ip:"192.168.1.10",  vendor:"Lenovo",       type:"Laptop",   rssi:-42, online:true,  bw:45.2, gw:false },
  { name:"Xiaomi AX10000",    mac:"A4:11:62:DD:EE:FF", ip:"192.168.1.1",   vendor:"Xiaomi",       type:"Router",   rssi:-18, online:true,  bw:0.4,  gw:true  },
  { name:"Pi 4B — AdGuard",   mac:"DC:A6:32:77:88:99", ip:"172.19.137.189",vendor:"Raspberry Pi", type:"Server",   rssi:-38, online:true,  bw:3.8,  gw:false },
  { name:"Galaxy Watch 6",    mac:"B4:EF:1C:44:55:66", ip:"192.168.1.11",  vendor:"Samsung",      type:"Wearable", rssi:-51, online:true,  bw:1.2,  gw:false },
  { name:"ESP32-S3 Cam",      mac:"CC:50:E3:AA:BB:CC", ip:"192.168.1.20",  vendor:"Espressif",    type:"IoT",      rssi:-67, online:true,  bw:0.8,  gw:false },
  { name:"Unknown Device",    mac:"DE:AD:BE:EF:CA:FE", ip:"192.168.1.99",  vendor:"???",          type:"Unknown",  rssi:-81, online:false, bw:0,    gw:false },
];

const ALERTS_DATA = [
  { type:"danger",  msg:"Evil Twin detected — ManitNet-AX3600 clone at DE:AD:BE:EF:00:01", time:"2m ago" },
  { type:"warning", msg:"High packet loss on wlan0: 8.3% (threshold 5%)",                  time:"5m ago" },
  { type:"success", msg:"New device joined: Galaxy Watch 6 (B4:EF:1C:44:55:66)",           time:"12m ago"},
  { type:"info",    msg:"Internet restored after 43s outage",                               time:"28m ago"},
  { type:"warning", msg:"Channel 6 congestion: 78% utilisation",                           time:"35m ago"},
  { type:"info",    msg:"DNS benchmark complete — AdGuard fastest (2ms avg)",              time:"1h ago" },
  { type:"success", msg:"Speed test complete — 924 Mbps DL / 421 Mbps UL",               time:"2h ago" },
];

const sin = (i, o = 0) => Math.sin(i * 0.4 + o) * 0.5 + 0.5;
const rand = () => (Math.random() - 0.5);
const genRSSI  = () => Array.from({length:40},(_,i)=>({ t:i, rssi:-(42+sin(i)*10+rand()*4), snr:38+sin(i,1)*10+rand()*3 }));
const genSpeed = () => Array.from({length:24},(_,i)=>({ t:i, dl:890+sin(i,2)*80+rand()*40, ul:415+sin(i,3)*40+rand()*20 }));
const genChan  = () => [
  {ch:1,util:72},{ch:6,util:78},{ch:11,util:35},
  {ch:36,util:22},{ch:40,util:8},{ch:44,util:15},{ch:48,util:41},{ch:100,util:18},
];

const s = {
  flex: {display:"flex"},
  col:  {display:"flex",flexDirection:"column"},
  row:  {display:"flex",alignItems:"center"},
  bet:  {display:"flex",alignItems:"center",justifyContent:"space-between"},
  cen:  {display:"flex",alignItems:"center",justifyContent:"center"},
  card: {background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",transition:"all 0.18s"},
  mono: {fontFamily:"'Courier New',Courier,monospace",fontSize:12},
  badge:(col)=>({background:col+"22",color:col,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,letterSpacing:0.5,whiteSpace:"nowrap"}),
};

function AnimatedBars({ rssi }) {
  const pct = Math.max(0,Math.min(100,((rssi+100)/70)*100));
  const col = rssi>-55?C.green:rssi>-70?C.yellow:C.red;
  return (
    <div style={{...s.row,gap:6}}>
      <div style={{width:56,height:5,background:C.border,borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:col,borderRadius:3,transition:"width 0.6s cubic-bezier(.4,0,.2,1)"}}/>
      </div>
      <span style={{...s.mono,color:col,minWidth:34,fontSize:11}}>{rssi}</span>
    </div>
  );
}

function PulseDot({ col = C.green, size = 7 }) {
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <div style={{position:"absolute",inset:0,borderRadius:"50%",background:col,animation:"pulse 1.4s ease-in-out infinite"}}/>
    </div>
  );
}

function Stat({ label, value, sub, col = C.cyan, Icon, delay = 0 }) {
  return (
    <div className={`hover-card anim-fade-d${delay}`}
      style={{...s.card,...s.col,gap:6}}>
      <div style={{...s.bet}}>
        <span style={{fontSize:10,color:C.muted,letterSpacing:0.8,fontWeight:600}}>{label.toUpperCase()}</span>
        {Icon && <Icon size={13} color={col} />}
      </div>
      <span style={{fontSize:22,fontWeight:700,color:col,letterSpacing:-0.5,animation:"countUp 0.4s ease both"}}>{value}</span>
      {sub && <span style={{fontSize:11,color:C.textSec}}>{sub}</span>}
    </div>
  );
}

function SHdr({ title, sub, right }) {
  return (
    <div style={{...s.bet,marginBottom:12}}>
      <div>
        <div style={{fontSize:14,fontWeight:600,color:C.text}}>{title}</div>
        {sub && <div style={{fontSize:11,color:C.muted,marginTop:1}}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function Tag({ text, col }) {
  return <span style={s.badge(col)}>{text}</span>;
}

function RadarWidget({ scanning }) {
  return (
    <div style={{position:"relative",width:48,height:48,flexShrink:0}}>
      <svg width="48" height="48" viewBox="0 0 48 48" style={{position:"absolute",inset:0}}>
        <circle cx="24" cy="24" r="21" fill="none" stroke={C.cyanMid} strokeWidth="1"/>
        <circle cx="24" cy="24" r="14" fill="none" stroke={C.cyanMid} strokeWidth="0.7"/>
        <circle cx="24" cy="24" r="7"  fill="none" stroke={C.cyanMid} strokeWidth="0.5"/>
        <line x1="3" y1="24" x2="45" y2="24" stroke={C.border} strokeWidth="0.5"/>
        <line x1="24" y1="3" x2="24" y2="45" stroke={C.border} strokeWidth="0.5"/>
      </svg>
      {scanning && (
        <svg width="48" height="48" viewBox="0 0 48 48"
          style={{position:"absolute",inset:0,transformOrigin:"24px 24px",animation:"radarSweep 1.6s linear infinite"}}>
          <defs>
            <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={C.cyan} stopOpacity="0"/>
              <stop offset="100%" stopColor={C.cyan} stopOpacity="0.55"/>
            </linearGradient>
          </defs>
          <path d="M24,24 L24,3 A21,21,0,0,1,44,24 Z" fill="url(#sweepGrad)"/>
          <line x1="24" y1="24" x2="24" y2="3" stroke={C.cyan} strokeWidth="1.2"/>
        </svg>
      )}
      <div style={{position:"absolute",inset:0,...s.cen}}>
        <div style={{width:5,height:5,borderRadius:"50%",background:C.cyan,animation:"pulse 1s ease-in-out infinite"}}/>
      </div>
    </div>
  );
}

function Toast({ toasts, dismiss }) {
  return (
    <div style={{position:"fixed",top:16,right:16,zIndex:999,...s.col,gap:8}}>
      {toasts.map(t => (
        <div key={t.id} className="anim-slide-r"
          style={{...s.row,gap:10,padding:"10px 14px",background:C.card2,
            border:`1px solid ${t.col}44`,borderRadius:8,boxShadow:`0 4px 20px rgba(0,0,0,0.4)`,
            minWidth:260,maxWidth:340}}>
          <t.Icon size={13} color={t.col} style={{flexShrink:0}}/>
          <span style={{fontSize:12,color:C.text,flex:1}}>{t.msg}</span>
          <button onClick={()=>dismiss(t.id)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",padding:0}}>
            <X size={12}/>
          </button>
        </div>
      ))}
    </div>
  );
}

function DashboardPanel({ rssiData, speedData }) {
  return (
    <div style={{...s.col,gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        <Stat label="Networks Found" value="7" sub="2×6GHz · 1 rogue detected" col={C.cyan}   Icon={Wifi}       delay={1}/>
        <Stat label="Signal Strength" value="-42 dBm" sub="Excellent · SNR 45 dB"  col={C.green}  Icon={Signal}     delay={2}/>
        <Stat label="Internet Speed" value="924 Mbps" sub="↑ 421 Mbps upload"       col={C.purple} Icon={Zap}        delay={3}/>
        <Stat label="Devices Online" value="5 / 6" sub="1 unknown flagged ⚠️"       col={C.yellow} Icon={Smartphone} delay={4}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:10}}>
        <div className="hover-card anim-fade-d2" style={s.card}>
          <SHdr title="Live Signal History" sub="wlan0 · ManitNet-AX3600 · auto-refresh 2s"/>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={rssiData.slice(-20)} margin={{top:4,right:4,bottom:0,left:-20}}>
              <defs>
                <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.cyan}   stopOpacity={0.35}/>
                  <stop offset="95%" stopColor={C.cyan}   stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="t" hide/>
              <YAxis domain={[-75,-30]} tick={{fontSize:9,fill:C.muted}}/>
              <Tooltip contentStyle={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,fontSize:11}}
                formatter={v=>[v.toFixed(1)+" dBm","RSSI"]}/>
              <Area type="monotone" dataKey="rssi" stroke={C.cyan} strokeWidth={2} fill="url(#gC)" dot={false} animationDuration={600}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="hover-card anim-fade-d3" style={s.card}>
          <SHdr title="Active Alerts" right={<Tag text="7 TOTAL" col={C.yellow}/>}/>
          <div style={{...s.col,gap:7}}>
            {ALERTS_DATA.slice(0,4).map((a,i)=>{
              const col={danger:C.red,warning:C.yellow,success:C.green,info:C.cyan}[a.type];
              const I={danger:XCircle,warning:AlertTriangle,success:CheckCircle,info:Info}[a.type];
              return (
                <div key={i} style={{...s.row,gap:8,padding:"7px 9px",background:col+"11",
                  borderRadius:6,borderLeft:`2px solid ${col}`}}>
                  <I size={11} color={col} style={{flexShrink:0}}/>
                  <span style={{fontSize:11,color:C.textSec,lineHeight:1.35}}>{a.msg}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
        <div className="hover-card anim-fade-d3" style={s.card}>
          <SHdr title="Nearby Networks" sub="7 found · best ch: 36 (5GHz)"/>
          {NETWORKS.slice(0,4).map((n,i)=>(
            <div key={i} style={{...s.bet,padding:"7px 0",borderBottom:i<3?`1px solid ${C.border}44`:"none"}}>
              <div style={{...s.row,gap:7}}>
                {n.rogue&&<AlertTriangle size={11} color={C.red}/>}
                <span style={{fontSize:12,color:C.text,fontWeight:500}}>{n.ssid}</span>
                <Tag text={n.band} col={n.band==="6GHz"?C.purple:n.band==="5GHz"?C.cyan:C.yellow}/>
              </div>
              <AnimatedBars rssi={n.rssi}/>
            </div>
          ))}
        </div>
        <div className="hover-card anim-fade-d4" style={s.card}>
          <SHdr title="Channel Utilisation" sub="2.4 + 5 GHz"/>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={genChan()} margin={{top:4,right:4,bottom:0,left:-24}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal vertical={false}/>
              <XAxis dataKey="ch" tick={{fontSize:9,fill:C.muted}}/>
              <YAxis domain={[0,100]} tick={{fontSize:9,fill:C.muted}}/>
              <Tooltip contentStyle={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,fontSize:11}}
                formatter={v=>[v+"%","Utilisation"]}/>
              <Bar dataKey="util" fill={C.cyan} radius={[3,3,0,0]} opacity={0.82} animationDuration={800}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function WirelessPanel() {
  const [filter,setFilter]=useState("");
  const [sort,setSort]=useState("rssi");
  const nets=[...NETWORKS]
    .filter(n=>n.ssid.toLowerCase().includes(filter.toLowerCase())||n.bssid.toLowerCase().includes(filter.toLowerCase()))
    .sort((a,b)=>sort==="rssi"?a.rssi-b.rssi:sort==="snr"?b.snr-a.snr:a.ch-b.ch);
  return (
    <div style={{...s.col,gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        <Stat label="APs Found" value="7" sub="3×5GHz · 1×6GHz · 3×2.4GHz" col={C.cyan}   Icon={Wifi}  delay={1}/>
        <Stat label="Rogue APs" value="1" sub="Evil Twin active — investigate" col={C.red}    Icon={Shield} delay={2}/>
        <Stat label="Best Channel" value="Ch 36" sub="5GHz · 22% utilisation"     col={C.green} Icon={ScanLine} delay={3}/>
        <Stat label="WiFi 6 / 6E" value="3 APs" sub="160MHz capable"              col={C.purple} Icon={Rss} delay={4}/>
      </div>
      <div className="anim-fade-d2" style={s.card}>
        <div style={{...s.bet,marginBottom:12}}>
          <SHdr title="Live WiFi Scan" sub="Auto-refresh every 10s · 7 networks"/>
          <div style={{...s.row,gap:8}}>
            <div style={{...s.row,gap:6,background:C.card2,border:`1px solid ${C.border}`,borderRadius:7,padding:"5px 10px"}}>
              <Search size={12} color={C.muted}/>
              <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Filter..."
                style={{background:"none",border:"none",outline:"none",color:C.text,fontSize:12,width:100}}/>
            </div>
            <select value={sort} onChange={e=>setSort(e.target.value)}
              style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:7,padding:"5px 8px",color:C.textSec,fontSize:12}}>
              <option value="rssi">Sort: Signal</option>
              <option value="snr">Sort: SNR</option>
              <option value="ch">Sort: Channel</option>
            </select>
          </div>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${C.border}`}}>
                {["SSID","BSSID","Band","Ch / Width","Security","Wi-Fi","RSSI","SNR","Clients","Vendor","Flags"].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"6px 10px",color:C.muted,fontWeight:600,whiteSpace:"nowrap",fontSize:10,letterSpacing:0.5}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nets.map((n,i)=>(
                <tr key={i} className="hover-card"
                  style={{borderBottom:`1px solid ${C.border}22`,background:n.rogue?C.red+"08":"transparent",
                    animation:`fadeSlideIn 0.3s ${i*0.04}s ease both`}}>
                  <td style={{padding:"9px 10px",color:C.text,fontWeight:600}}>
                    <div style={{...s.row,gap:6}}>
                      {n.rogue&&<AlertTriangle size={10} color={C.red}/>}
                      {n.ssid}
                    </div>
                  </td>
                  <td style={{padding:"9px 10px",...s.mono,color:C.muted}}>{n.bssid}</td>
                  <td style={{padding:"9px 10px"}}><Tag text={n.band} col={n.band==="6GHz"?C.purple:n.band==="5GHz"?C.cyan:C.yellow}/></td>
                  <td style={{padding:"9px 10px",...s.mono,color:C.textSec}}>{n.ch} / {n.width}</td>
                  <td style={{padding:"9px 10px"}}><Tag text={n.sec} col={n.sec==="WPA3"?C.green:n.sec==="WPA2"?C.cyan:C.red}/></td>
                  <td style={{padding:"9px 10px"}}><Tag text={`Wi-Fi ${n.wifi}`} col={n.wifi==="6E"||n.wifi==="7"?C.purple:n.wifi==="6"?C.cyan:C.muted}/></td>
                  <td style={{padding:"9px 10px"}}><AnimatedBars rssi={n.rssi}/></td>
                  <td style={{padding:"9px 10px",...s.mono,color:n.snr>30?C.green:n.snr>20?C.yellow:C.red}}>{n.snr} dB</td>
                  <td style={{padding:"9px 10px",color:C.textSec}}>{n.clients}</td>
                  <td style={{padding:"9px 10px",color:C.textSec}}>{n.vendor}</td>
                  <td style={{padding:"9px 10px"}}>
                    <div style={{...s.row,gap:4}}>
                      {n.rogue  && <Tag text="ROGUE" col={C.red}/>}
                      {n.sec==="Open" && <Tag text="OPEN" col={C.red}/>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{...s.row,gap:10}}>
        <div style={{...s.row,gap:8,padding:"10px 14px",background:C.redFaint,border:`1px solid ${C.red}44`,borderRadius:8,animation:"borderPulse 2s ease-in-out infinite"}}>
          <AlertTriangle size={14} color={C.red}/>
          <span style={{fontSize:12,color:C.red,fontWeight:600}}>Evil Twin Detected — DE:AD:BE:EF:00:01 is cloning ManitNet-AX3600. Do not connect.</span>
        </div>
        <div style={{...s.row,gap:8,padding:"10px 14px",background:C.greenFaint,border:`1px solid ${C.green}33`,borderRadius:8}}>
          <CheckCircle size={14} color={C.green}/>
          <span style={{fontSize:12,color:C.green}}>Best channel: 36 (5GHz) — only 22% utilised</span>
        </div>
      </div>
    </div>
  );
}

function SignalPanel({ rssiData }) {
  const scores=[
    {label:"Signal Quality",     val:94, col:C.green},
    {label:"Stability",          val:88, col:C.cyan},
    {label:"Reliability",        val:91, col:C.purple},
    {label:"Overall Health",     val:91, col:C.green},
  ];
  return (
    <div style={{...s.col,gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {scores.map((sc,i)=>(
          <div key={i} className={`hover-card anim-fade-d${i+1}`} style={s.card}>
            <div style={{fontSize:10,color:C.muted,marginBottom:8,letterSpacing:0.8,fontWeight:600}}>{sc.label.toUpperCase()}</div>
            <div style={{...s.row,gap:8,marginBottom:8}}>
              <span style={{fontSize:26,fontWeight:700,color:sc.col,animation:"countUp 0.5s ease both"}}>{sc.val}</span>
              <span style={{fontSize:12,color:C.muted}}>/100</span>
            </div>
            <div style={{height:4,background:C.border,borderRadius:2,overflow:"hidden"}}>
              <div style={{width:`${sc.val}%`,height:"100%",background:sc.col,borderRadius:2,transition:"width 1.2s cubic-bezier(.4,0,.2,1)"}}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div className="hover-card anim-fade-d2" style={s.card}>
          <SHdr title="Live RSSI" sub="wlan0 · 40 samples"/>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={rssiData} margin={{top:4,right:4,bottom:0,left:-16}}>
              <defs>
                <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.cyan}   stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={C.cyan}   stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="t" hide/>
              <YAxis domain={[-80,-30]} tick={{fontSize:9,fill:C.muted}}/>
              <Tooltip contentStyle={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,fontSize:11}}
                formatter={v=>[v.toFixed(1)+" dBm","RSSI"]}/>
              <Area type="monotone" dataKey="rssi" stroke={C.cyan} strokeWidth={2} fill="url(#gR)" dot={false} animationDuration={800}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="hover-card anim-fade-d3" style={s.card}>
          <SHdr title="SNR History" sub="Signal-to-Noise Ratio"/>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={rssiData} margin={{top:4,right:4,bottom:0,left:-16}}>
              <defs>
                <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.purple} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={C.purple} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="t" hide/>
              <YAxis domain={[20,55]} tick={{fontSize:9,fill:C.muted}}/>
              <Tooltip contentStyle={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,fontSize:11}}
                formatter={v=>[v.toFixed(1)+" dB","SNR"]}/>
              <Area type="monotone" dataKey="snr" stroke={C.purple} strokeWidth={2} fill="url(#gS)" dot={false} animationDuration={800}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="anim-fade-d4" style={{...s.card,...s.row,gap:10}}>
        <div style={{...s.row,gap:8,padding:"9px 14px",background:C.greenFaint,border:`1px solid ${C.green}33`,borderRadius:7}}>
          <CheckCircle size={13} color={C.green}/>
          <span style={{fontSize:12,color:C.green}}>Stable — predicted -41 to -48 dBm next 10 samples</span>
        </div>
        <div style={{...s.row,gap:8,padding:"9px 14px",background:C.cyanFaint,border:`1px solid ${C.cyan}33`,borderRadius:7}}>
          <Info size={13} color={C.cyan}/>
          <span style={{fontSize:12,color:C.cyan}}>Roaming unlikely · Band steering: inactive</span>
        </div>
      </div>
    </div>
  );
}

function SpeedPanel({ speedData }) {
  const [running,setRunning]=useState(false);
  const [pct,setPct]=useState(0);
  const [phase,setPhase]=useState("idle");
  const run=()=>{
    if(running)return;
    setRunning(true);setPct(0);setPhase("download");
    let p=0;
    const t=setInterval(()=>{
      p+=2.5;setPct(p);
      if(p>=50) setPhase("upload");
      if(p>=100){clearInterval(t);setRunning(false);setPhase("done");}
    },60);
  };
  const dlVal=running?(pct/100*924).toFixed(0):924;
  const ulVal=running&&pct>50?((pct-50)/50*421).toFixed(0):(!running&&phase==="done"?421:0);
  return (
    <div style={{...s.col,gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        <Stat label="Download" value="924 Mbps" sub="NBN 1000 · 92.4% efficiency" col={C.cyan}   Icon={ArrowDown} delay={1}/>
        <Stat label="Upload"   value="421 Mbps" sub="Full duplex"                   col={C.purple} Icon={ArrowUp}   delay={2}/>
        <Stat label="Ping"     value="8ms"       sub="Jitter: 1.2ms"                col={C.green}  Icon={Activity}  delay={3}/>
        <Stat label="Bufferbloat" value="A+"     sub="Excellent under load"          col={C.green}  Icon={Gauge}     delay={4}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:10}}>
        <div className="hover-card anim-fade-d2" style={{...s.card,...s.cen,flexDirection:"column",gap:18}}>
          <div style={{position:"relative",width:170,height:170}}>
            <svg width="170" height="170" viewBox="0 0 170 170">
              <circle cx="85" cy="85" r="76" fill="none" stroke={C.border} strokeWidth="8"/>
              <circle cx="85" cy="85" r="76" fill="none"
                stroke={phase==="upload"?C.purple:C.cyan} strokeWidth="8"
                strokeDasharray={`${2*Math.PI*76*(running?pct/100:1)} ${2*Math.PI*76}`}
                strokeLinecap="round" transform="rotate(-90 85 85)"
                style={{transition:"stroke-dasharray 0.06s linear,stroke 0.3s"}}/>
              {running&&[0.3,0.6].map((d,i)=>(
                <circle key={i} cx="85" cy="85" r="76" fill="none"
                  stroke={phase==="upload"?C.purple:C.cyan} strokeWidth="6" opacity="0.15"
                  style={{animation:`ripple 1.4s ${i*0.5}s ease-out infinite`}}/>
              ))}
            </svg>
            <div style={{position:"absolute",inset:0,...s.cen,flexDirection:"column"}}>
              <span style={{fontSize:36,fontWeight:700,color:phase==="upload"?C.purple:C.cyan,transition:"color 0.3s"}}>{dlVal}</span>
              <span style={{fontSize:12,color:C.muted}}>Mbps</span>
              <span style={{fontSize:10,color:C.textSec,marginTop:3,letterSpacing:0.5}}>
                {running?(phase==="upload"?"UPLOAD":"DOWNLOAD"):phase==="done"?"DONE":"DOWNLOAD"}
              </span>
            </div>
          </div>
          <button onClick={run} disabled={running}
            style={{padding:"10px 28px",background:running?C.border:C.cyan,
              color:running?C.muted:"#000",border:"none",borderRadius:8,
              fontWeight:700,cursor:running?"not-allowed":"pointer",fontSize:13,
              transition:"all 0.2s",animation:running?"glow 1s ease-in-out infinite":"none"}}>
            {running?`${phase==="upload"?"↑":"↓"} ${pct.toFixed(0)}%...`:"▶ Run Speed Test"}
          </button>
        </div>
        <div className="hover-card anim-fade-d3" style={s.card}>
          <SHdr title="Speed History" sub="Last 24 tests"/>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={speedData} margin={{top:4,right:4,bottom:0,left:-16}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="t" hide/>
              <YAxis domain={[300,1100]} tick={{fontSize:9,fill:C.muted}}/>
              <Tooltip contentStyle={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,fontSize:11}}
                formatter={(v,n)=>[Math.round(v)+" Mbps",n==="dl"?"Download":"Upload"]}/>
              <Line type="monotone" dataKey="dl" stroke={C.cyan}   strokeWidth={2} dot={false} animationDuration={800}/>
              <Line type="monotone" dataKey="ul" stroke={C.purple} strokeWidth={2} dot={false} animationDuration={800}/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{...s.row,gap:16,marginTop:8}}>
            {[["Download",C.cyan],["Upload",C.purple]].map(([l,c])=>(
              <div key={l} style={{...s.row,gap:5}}>
                <div style={{width:12,height:2,background:c,borderRadius:1}}/>
                <span style={{fontSize:11,color:C.textSec}}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DevicesPanel() {
  const ICONS={Router:Server,Laptop:Monitor,Server:Database,Wearable:Eye,IoT:Rss,Unknown:AlertTriangle};
  const COLS ={Router:C.cyan,Laptop:C.blue,Server:C.purple,Wearable:C.green,IoT:C.yellow,Unknown:C.red};
  return (
    <div style={{...s.col,gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        <Stat label="Devices Found"   value="6"        sub="5 online · 1 offline"        col={C.cyan}   Icon={Smartphone}   delay={1}/>
        <Stat label="Total Bandwidth" value="51.4 Mbps" sub="Across all devices"           col={C.purple} Icon={Activity}      delay={2}/>
        <Stat label="New Devices"     value="1"        sub="Galaxy Watch 6 · 12m ago"     col={C.green}  Icon={CheckCircle}   delay={3}/>
        <Stat label="Flagged"         value="1"        sub="Unknown MAC vendor"            col={C.red}    Icon={AlertTriangle} delay={4}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {DEVICES.map((d,i)=>{
          const Icon=ICONS[d.type]||Smartphone;
          const col=COLS[d.type]||C.muted;
          return (
            <div key={i} className={`hover-card anim-fade-d${Math.min(i+1,5)}`}
              style={{...s.card,border:`1px solid ${d.type==="Unknown"?C.red+"44":C.border}`,
                background:d.type==="Unknown"?C.redFaint:C.card}}>
              <div style={{...s.bet,marginBottom:10}}>
                <div style={{...s.row,gap:9}}>
                  <div style={{...s.cen,width:36,height:36,borderRadius:8,background:col+"20"}}>
                    <Icon size={16} color={col}/>
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:C.text}}>{d.name}</div>
                    <div style={{fontSize:10,color:C.muted}}>{d.vendor}</div>
                  </div>
                </div>
                <div style={{...s.row,gap:5}}>
                  <PulseDot col={d.online?C.green:C.red}/>
                  <span style={{fontSize:10,color:d.online?C.green:C.red,fontWeight:600}}>{d.online?"Online":"Offline"}</span>
                </div>
              </div>
              <div style={{...s.col,gap:5,padding:"8px 0",borderTop:`1px solid ${C.border}`}}>
                {[["IP",d.ip,true],["MAC",d.mac,true],["Bandwidth",d.bw+" Mbps",false]].map(([k,v,mono])=>(
                  <div key={k} style={s.bet}>
                    <span style={{fontSize:10,color:C.muted}}>{k}</span>
                    <span style={{fontSize:11,...(mono?s.mono:{}),color:k==="Bandwidth"?C.cyan:C.textSec}}>{v}</span>
                  </div>
                ))}
                <div style={s.bet}>
                  <span style={{fontSize:10,color:C.muted}}>Signal</span>
                  <AnimatedBars rssi={d.rssi}/>
                </div>
                {d.gw&&<Tag text="GATEWAY" col={C.cyan}/>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AlertsPanel() {
  const [filter,setFilter]=useState("all");
  const COLS={danger:C.red,warning:C.yellow,success:C.green,info:C.cyan};
  const ICONS={danger:XCircle,warning:AlertTriangle,success:CheckCircle,info:Info};
  const filtered=filter==="all"?ALERTS_DATA:ALERTS_DATA.filter(a=>a.type===filter);
  return (
    <div style={{...s.col,gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        <Stat label="Critical"  value="1" sub="Evil Twin active"   col={C.red}    Icon={XCircle}       delay={1}/>
        <Stat label="Warnings"  value="2" sub="Packet loss · Ch 6" col={C.yellow} Icon={AlertTriangle} delay={2}/>
        <Stat label="Info"      value="2" sub="New device · DNS"   col={C.cyan}   Icon={Info}          delay={3}/>
        <Stat label="Resolved"  value="2" sub="Last 2 hours"       col={C.green}  Icon={CheckCircle}   delay={4}/>
      </div>
      <div className="anim-fade-d2" style={s.card}>
        <div style={{...s.bet,marginBottom:12}}>
          <SHdr title="Alert Feed" sub="Real-time · last 24h"/>
          <div style={{...s.row,gap:5,flexWrap:"wrap"}}>
            {["all","danger","warning","info","success"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${filter===f?(COLS[f]||C.cyan):C.border}`,
                  background:filter===f?(COLS[f]?COLS[f]+"22":C.cyanFaint):"transparent",
                  color:filter===f?(COLS[f]||C.cyan):C.muted,fontSize:10,cursor:"pointer",
                  fontWeight:600,letterSpacing:0.4,textTransform:"capitalize",transition:"all 0.15s"}}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{...s.col,gap:8}}>
          {filtered.map((a,i)=>{
            const c=COLS[a.type]; const I=ICONS[a.type];
            return (
              <div key={i} style={{...s.row,gap:12,padding:"11px 14px",
                background:c+"10",border:`1px solid ${c}22`,borderRadius:8,
                borderLeft:`3px solid ${c}`,animation:`fadeSlideIn 0.3s ${i*0.06}s ease both`}}>
                <I size={14} color={c} style={{flexShrink:0}}/>
                <span style={{flex:1,fontSize:12,color:C.text}}>{a.msg}</span>
                <span style={{fontSize:10,color:C.muted,flexShrink:0}}>{a.time}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {[
          {label:"Discord Webhook", desc:"Alert on rogue APs + outages",     on:true,  col:C.purple},
          {label:"Email (SMTP)",    desc:"Daily digest + critical only",      on:false, col:C.cyan},
          {label:"MQTT Broker",     desc:"Publish events to mqtt://broker",   on:true,  col:C.green},
        ].map((c,i)=>(
          <div key={i} className="hover-card" style={{...s.card,...s.bet}}>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:2}}>{c.label}</div>
              <div style={{fontSize:10,color:C.muted}}>{c.desc}</div>
            </div>
            <div style={{width:38,height:21,borderRadius:11,background:c.on?c.col:C.border,
              position:"relative",cursor:"pointer",transition:"background 0.25s",flexShrink:0}}>
              <div style={{position:"absolute",top:2.5,left:c.on?19:2.5,width:16,height:16,
                borderRadius:"50%",background:"white",transition:"left 0.25s"}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemPanel() {
  const gauges=[
    {label:"CPU",    val:23, col:C.cyan,  unit:"%",    detail:"i5-6200U · 2 cores · 1.8 GHz"},
    {label:"RAM",    val:61, col:C.purple, unit:"%",   detail:"4.9 GB used / 8 GB"},
    {label:"Temp",   val:48, col:C.yellow, unit:"°C",  detail:"Throttle at 80°C"},
    {label:"Disk",   val:38, col:C.green,  unit:"%",   detail:"97 GB used / 256 GB NVMe"},
  ];
  return (
    <div style={{...s.col,gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {gauges.map((g,i)=>(
          <div key={i} className={`hover-card anim-fade-d${i+1}`} style={s.card}>
            <div style={{...s.bet,marginBottom:10}}>
              <span style={{fontSize:10,color:C.muted,letterSpacing:0.8,fontWeight:600}}>{g.label.toUpperCase()}</span>
              <span style={{fontSize:20,fontWeight:700,color:g.col}}>{g.val}<span style={{fontSize:11,fontWeight:400}}>{g.unit}</span></span>
            </div>
            <div style={{height:5,background:C.border,borderRadius:3,overflow:"hidden"}}>
              <div style={{width:`${g.val}%`,height:"100%",background:g.col,borderRadius:3,transition:"width 1.2s cubic-bezier(.4,0,.2,1)"}}/>
            </div>
            <div style={{fontSize:10,color:C.muted,marginTop:5}}>{g.detail}</div>
          </div>
        ))}
      </div>
      <div className="anim-fade-d2" style={s.card}>
        <SHdr title="System Info" sub="ThinkPad X1 Carbon Gen 5 · Linux Mint 22.3"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {[
            ["CPU","Intel i5-6200U · 2.3 GHz"],["Memory","8 GB DDR4-2133"],
            ["Storage","Samsung PM961 256 GB NVMe"],["Kernel","6.8.0-60-generic"],
            ["WiFi Adapter","Intel 8260 (iwlwifi)"],["Driver","iwlwifi-8000C-36.ucode"],
          ].map(([k,v])=>(
            <div key={k}>
              <div style={{fontSize:10,color:C.muted,fontWeight:600,letterSpacing:0.5}}>{k.toUpperCase()}</div>
              <div style={{fontSize:12,color:C.textSec,marginTop:3,...s.mono}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AiPanel() {
  const tips=[
    {Icon:Wifi,    col:C.cyan,   title:"Channel Recommendation",   body:"Switch to Channel 36 (5GHz) — only 22% utilisation vs Channel 6 at 78%. Expected throughput gain: ~120 Mbps."},
    {Icon:Shield,  col:C.red,    title:"Rogue AP Detected",        body:"DE:AD:BE:EF:00:01 is cloning ManitNet-AX3600. This is an Evil Twin attack. Isolate and investigate immediately."},
    {Icon:Activity,col:C.yellow, title:"Stability Issue",          body:"8.3% packet loss on wlan0. Likely cause: 2.4GHz interference from Ch 6 neighbours. Enable band steering."},
    {Icon:Zap,     col:C.green,  title:"Speed Optimisation",       body:"Enable 802.11k/v/r on AX10000 for roaming. Prioritise Pi 4B traffic via QoS — it handles all DNS for the network."},
  ];
  return (
    <div style={{...s.col,gap:14}}>
      <div className="anim-fade" style={{...s.card,background:C.purpleFaint,border:`1px solid ${C.purple}33`,animation:"borderPulse 3s ease-in-out infinite"}}>
        <div style={{...s.row,gap:10,marginBottom:10}}>
          <Bot size={18} color={C.purple}/>
          <span style={{fontSize:14,fontWeight:700,color:C.text}}>AI Network Health Summary</span>
          <Tag text="v1.0.5 NEW" col={C.purple}/>
        </div>
        <p style={{fontSize:13,color:C.textSec,lineHeight:1.75,margin:0}}>
          Your network is <span style={{color:C.green,fontWeight:600}}>generally healthy</span> with
          1 critical alert requiring immediate action.
          ManitNet-AX3600 (5GHz) shows excellent signal at -42 dBm with WPA3 — solid.
          Your 6GHz band is underutilised despite 160MHz capability — only 2 clients on ManitNet-6GHz.
          <span style={{color:C.red,fontWeight:600}}> Critical: </span>
          a rogue AP is mimicking your SSID using an unknown MAC. Investigate DE:AD:BE:EF:00:01 immediately.
          AdGuard Home at 172.19.137.189 is running perfectly — 2ms DNS latency, excellent.
          Overall score: <span style={{color:C.cyan,fontWeight:700}}>91/100</span>.
        </p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
        {tips.map((t,i)=>(
          <div key={i} className={`hover-card anim-fade-d${i+1}`}
            style={{...s.card,borderLeft:`3px solid ${t.col}`}}>
            <div style={{...s.row,gap:8,marginBottom:8}}>
              <t.Icon size={14} color={t.col}/>
              <span style={{fontSize:13,fontWeight:600,color:C.text}}>{t.title}</span>
            </div>
            <p style={{fontSize:12,color:C.textSec,lineHeight:1.65,margin:0}}>{t.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureGrid({ title, features, col=C.cyan, badge="" }) {
  return (
    <div style={{...s.col,gap:14}}>
      <div className="anim-fade" style={{...s.card,border:`1px solid ${col}33`,background:col+"08"}}>
        <div style={{...s.row,gap:10,marginBottom:14}}>
          <span style={{fontSize:15,fontWeight:700,color:col}}>{title}</span>
          {badge&&<Tag text={badge} col={col}/>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {features.map((f,i)=>(
            <div key={i} className="hover-card"
              style={{...s.row,gap:8,padding:"8px 10px",background:C.card,borderRadius:7,
                border:`1px solid ${C.border}`,animation:`fadeSlideIn 0.3s ${i*0.025}s ease both`}}>
              <CheckCircle size={11} color={col}/>
              <span style={{fontSize:11,color:C.textSec}}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const NAV=[
  {g:"ANALYSIS", items:[
    {id:"dashboard",label:"Dashboard",     Icon:LayoutDashboard},
    {id:"wireless", label:"Wireless",      Icon:Wifi},
    {id:"signal",   label:"Signal",        Icon:Activity},
    {id:"phy",      label:"PHY Info",      Icon:Radio},
    {id:"interface",label:"Interfaces",    Icon:Layers},
  ]},
  {g:"NETWORK", items:[
    {id:"diagnostics",label:"Diagnostics", Icon:Globe},
    {id:"speed",      label:"Speed Test",  Icon:Zap},
    {id:"devices",    label:"Devices",     Icon:Smartphone},
  ]},
  {g:"SYSTEM", items:[
    {id:"system",label:"System",           Icon:Monitor},
    {id:"router",label:"Router Support",   Icon:Server},
  ]},
  {g:"INSIGHTS", items:[
    {id:"viz",    label:"Visualisation",   Icon:BarChart2},
    {id:"export", label:"Export",          Icon:Download},
    {id:"alerts", label:"Alerts",          Icon:Bell},
  ]},
  {g:"SMART", items:[
    {id:"ai",    label:"AI Features",      Icon:Bot},
    {id:"remote",label:"Remote",           Icon:Map},
  ]},
  {g:"ADVANCED", items:[
    {id:"advanced",label:"Advanced",       Icon:Wrench},
    {id:"api",     label:"API",            Icon:Code},
  ]},
];

export default function App() {
  const [tab,setTab]=useState("dashboard");
  const [scanning,setScanning]=useState(false);
  const [collapsed,setCollapsed]=useState(false);
  const [toasts,setToasts]=useState([]);
  const [rssiData]=useState(genRSSI);
  const [speedData]=useState(genSpeed);

  const addToast=(msg,type="info")=>{
    const id=Date.now();
    const COLS={danger:C.red,warning:C.yellow,success:C.green,info:C.cyan};
    const ICONS={danger:XCircle,warning:AlertTriangle,success:CheckCircle,info:Info};
    setToasts(t=>[...t,{id,msg,col:COLS[type],Icon:ICONS[type]}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3800);
  };

  const dismissToast=id=>setToasts(t=>t.filter(x=>x.id!==id));

  const scan=()=>{
    if(scanning)return;
    setScanning(true);
    setTimeout(()=>{setScanning(false);addToast("Scan complete — 7 networks found","success");},2200);
  };

  const switchTab=id=>{
    setTab(id);
    if(id==="alerts") addToast("1 critical alert requires attention","danger");
  };

  const panels={
    dashboard:   <DashboardPanel rssiData={rssiData} speedData={speedData}/>,
    wireless:    <WirelessPanel/>,
    signal:      <SignalPanel rssiData={rssiData}/>,
    speed:       <SpeedPanel speedData={speedData}/>,
    devices:     <DevicesPanel/>,
    alerts:      <AlertsPanel/>,
    system:      <SystemPanel/>,
    ai:          <AiPanel/>,
    phy:         <FeatureGrid title="PHY Information" badge="v1.0.5" col={C.cyan}
      features={["MCS index display","NSS spatial streams","Channel width","Short guard interval","Bitrate TX/RX","TX power (dBm)","RX sensitivity","PHY type (HT/VHT/HE/EHT)","Antenna chains","Radio capabilities","Regulatory domain","Max EIRP"]} />,
    interface:   <FeatureGrid title="Interface Monitor" badge="v1.0.5" col={C.purple}
      features={["RX packet counter","TX packet counter","RX error counter","TX error counter","RX drop counter","TX drop counter","Retry counter","Collision stats","Per-interface throughput","Live graph","Multi-interface","Auto-refresh"]} />,
    diagnostics: <FeatureGrid title="Network Diagnostics" badge="v1.0.5" col={C.green}
      features={["Gateway latency","Internet latency","DNS lookup timing","Packet loss %","MTU path discovery","Traceroute","Route visualisation","IPv4 analysis","IPv6 analysis","DNS benchmarking","Gateway health","Bufferbloat test"]} />,
    router:      <FeatureGrid title="Router Support" badge="v1.0.5" col={C.blue}
      features={["OpenWrt LuCI API","DD-WRT SSH","pfSense XML-RPC","OPNsense API","UniFi Controller","MikroTik RouterOS","TP-Link Omada","ASUSWRT-Merlin","GL.iNet API","Tomato","Real-time stats pull","Config backup"]} />,
    viz:         <FeatureGrid title="Visualisation" badge="v1.0.5" col={C.yellow}
      features={["Live dashboard","Channel heatmap","Signal coverage map","Timeline graphs","Interactive charts","Topology graph","Device relationship","Geographic maps","Frequency spectrum","Band utilisation","Client density","Animation everywhere"]} />,
    export:      <FeatureGrid title="Export & Reports" badge="v1.0.5" col={C.green}
      features={["CSV export","JSON export","PDF reports (ReportLab)","HTML reports","Scheduled reports","Email delivery","Screenshot export","Config backup","Session history","Grafana dashboard","Prometheus metrics","Plugin SDK"]} />,
    remote:      <FeatureGrid title="Remote Monitoring" badge="v1.0.5" col={C.blue}
      features={["Multi-site dashboard","Pi agent (headless)","Remote web UI","API key auth","Role-based access","Cloud sync optional","Self-hosted mode","VPN-safe tunnel","Site comparison","Centralized alerts","Agent auto-update","WebSocket push"]} />,
    advanced:    <FeatureGrid title="Advanced Networking" badge="v1.0.5" col={C.yellow}
      features={["Wake-on-LAN","ARP table viewer","DHCP lease table","DNS cache viewer","TCP connectivity test","UDP test","Service detection","SSL cert expiry","Port scanner","nftables viewer","VLAN analysis","Interface config"]} />,
    api:         <FeatureGrid title="API & Integrations" badge="v1.0.5" col={C.cyan}
      features={["REST API (OpenAPI 3.0)","Interactive docs /docs","WebSocket ws/live","Prometheus /metrics","Grafana dashboard JSON","Home Assistant MQTT","Node-RED templates","Webhooks","Plugin SDK","Mobile app API","OAuth2 auth","Rate limiting"]} />,
  };

  const allItems=NAV.flatMap(g=>g.items);
  const current=allItems.find(n=>n.id===tab);

  return (
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif",overflow:"hidden"}}>
      <style>{ANIM}</style>
      <Toast toasts={toasts} dismiss={dismissToast}/>

      <aside style={{width:collapsed?54:210,flexShrink:0,background:C.card,
        borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",
        transition:"width 0.25s cubic-bezier(.4,0,.2,1)",overflow:"hidden"}}>
        <div style={{padding:"12px 10px",borderBottom:`1px solid ${C.border}`,
          display:"flex",alignItems:"center",gap:10,height:54,flexShrink:0}}>
          <div style={{width:30,height:30,borderRadius:8,background:C.cyanFaint,
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
            border:`1px solid ${C.cyan}33`,animation:"glow 3s ease-in-out infinite"}}>
            <Wifi size={14} color={C.cyan}/>
          </div>
          {!collapsed&&(
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.text,lineHeight:1,whiteSpace:"nowrap"}}>WiFi Analyzer</div>
              <div style={{fontSize:9,color:C.cyan,fontWeight:700,letterSpacing:0.8}}>PRO v1.0.5</div>
            </div>
          )}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
          {NAV.map(group=>(
            <div key={group.g}>
              {!collapsed&&(
                <div style={{fontSize:8,color:C.muted,letterSpacing:1.2,padding:"8px 12px 3px",
                  fontWeight:700,userSelect:"none"}}>{group.g}</div>
              )}
              {group.items.map(item=>{
                const active=tab===item.id;
                return (
                  <button key={item.id}
                    className={`nav-btn${active?" active":""}`}
                    onClick={()=>switchTab(item.id)}
                    title={collapsed?item.label:undefined}
                    style={{width:"100%",display:"flex",alignItems:"center",gap:9,
                      padding:collapsed?"9px 0":"7px 12px",
                      paddingLeft:collapsed?0:14,justifyContent:collapsed?"center":"flex-start",
                      background:active?C.cyanFaint:"transparent",
                      borderLeft:`2px solid ${active?C.cyan:"transparent"}`,
                      border:"none",borderLeftWidth:2,
                      cursor:"pointer",color:active?C.cyan:C.muted,
                      fontSize:12,fontWeight:active?600:400,textAlign:"left",
                      transition:"all 0.15s"}}>
                    <item.Icon size={14} style={{flexShrink:0}}/>
                    {!collapsed&&<span style={{whiteSpace:"nowrap"}}>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{padding:"8px 8px",borderTop:`1px solid ${C.border}`}}>
          <button onClick={()=>setCollapsed(x=>!x)}
            style={{width:"100%",padding:"7px",background:C.card2,
              border:`1px solid ${C.border}`,borderRadius:7,
              color:C.muted,cursor:"pointer",fontSize:11,display:"flex",
              alignItems:"center",justifyContent:"center",gap:6,transition:"all 0.2s"}}>
            <Menu size={13}/>
            {!collapsed&&<span>Collapse</span>}
          </button>
        </div>
      </aside>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <header style={{padding:"0 18px",borderBottom:`1px solid ${C.border}`,
          background:C.card,display:"flex",alignItems:"center",
          justifyContent:"space-between",height:54,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <RadarWidget scanning={scanning}/>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:C.text}}>{current?.label||"Dashboard"}</div>
              <div style={{fontSize:10,color:C.muted,display:"flex",alignItems:"center",gap:5}}>
                <PulseDot col={C.green} size={6}/>
                <span>LIVE · wlan0 · -42 dBm · SNR 45 dB</span>
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:C.textSec,
              padding:"4px 10px",background:C.card2,border:`1px solid ${C.border}`,borderRadius:6}}>
              <Signal size={11} color={C.cyan}/>
              <span style={{fontFamily:"monospace"}}>ManitNet-AX3600 · 5GHz · Ch 36</span>
            </div>
            <button onClick={scan} disabled={scanning}
              style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",
                background:scanning?C.cyanFaint:C.cyan+"22",
                border:`1px solid ${C.cyan}55`,borderRadius:7,
                color:C.cyan,cursor:scanning?"not-allowed":"pointer",
                fontSize:12,fontWeight:600,transition:"all 0.2s"}}>
              <RefreshCw size={12} style={{animation:scanning?"spin 0.7s linear infinite":"none"}}/>
              {scanning?"Scanning...":"Scan Now"}
            </button>
            <button onClick={()=>addToast("Settings coming in v1.1.0","info")}
              style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",
                background:C.card2,border:`1px solid ${C.border}`,borderRadius:7,
                cursor:"pointer",color:C.muted,transition:"all 0.15s"}}>
              <Settings size={14}/>
            </button>
          </div>
        </header>

        <main style={{flex:1,overflowY:"auto",padding:14}}>
          <div key={tab} style={{animation:"fadeSlideIn 0.28s ease both"}}>
            {panels[tab]||<div style={{color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}>Coming soon</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
