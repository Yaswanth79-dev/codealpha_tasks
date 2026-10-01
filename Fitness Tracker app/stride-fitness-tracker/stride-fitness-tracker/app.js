'use strict';
const KEY = 'stride.v1';
const RATE = {Walking:4,Running:11,Cycling:8,'Gym workout':6,HIIT:12,Swimming:9,Yoga:3,'Daily steps':0,Other:5}; // kcal per minute
const META = {steps:['Steps','#0F7B6C',''],minutes:['Active minutes','#6B5BD2','min'],calories:['Calories burned','#E8743B','kcal']};
const $ = s => document.querySelector(s);
let S = {entries:[], goals:{steps:10000, minutes:45, calories:500}};
let metric = 'steps';
const iso = d => new Date(d.getTime() - d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
let day = iso(new Date());
const shift = (d,n) => { const t = new Date(d+'T12:00'); t.setDate(t.getDate()+n); return iso(t); };
const fmt = n => n.toLocaleString();

function load(){ try { const r = JSON.parse(localStorage.getItem(KEY)); if (r && Array.isArray(r.entries) && r.goals) S = r; } catch(e){} }
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){ msg('Could not save: browser storage is unavailable.', true); } }
function msg(t, err){ const m = $('#msg'); m.textContent = t; m.className = err ? 'err' : ''; }

function tot(d){
  return S.entries.filter(e => e.date === d).reduce((a,e) => ({steps:a.steps+e.steps, minutes:a.minutes+e.minutes, calories:a.calories+e.calories}), {steps:0,minutes:0,calories:0});
}

function ring(k, v, g){
  const r = 44, c = 2*Math.PI*r, p = Math.min(v/g, 1), pct = Math.round(p*100);
  return `<div class="card ring"><svg viewBox="0 0 110 110" role="img" aria-label="${META[k][0]}: ${pct}% of goal">
    <circle cx="55" cy="55" r="${r}" class="bg"/>
    <circle cx="55" cy="55" r="${r}" class="fg" stroke="${META[k][1]}" stroke-dasharray="${c*p} ${c}" transform="rotate(-90 55 55)"/>
    <text x="55" y="62" text-anchor="middle">${pct}%</text></svg>
    <div><b>${fmt(v)}</b> <small>${META[k][2]}</small><span>${META[k][0]}, goal ${fmt(g)}</span></div></div>`;
}

function chart(){
  const days = [...Array(7)].map((_,i) => shift(day, i-6));
  const vals = days.map(d => tot(d)[metric]);
  const g = S.goals[metric], max = Math.max(g, ...vals) * 1.15;
  const W = 420, H = 190, bw = 36, gap = (W - 7*bw) / 8, gy = H - g/max*H;
  let s = `<svg viewBox="0 0 ${W} ${H+24}" role="img" aria-label="${META[metric][0]} over the last 7 days"><line x1="0" x2="${W}" y1="${gy}" y2="${gy}" class="goal"/><text x="${W}" y="${gy-4}" text-anchor="end" class="gl">goal</text>`;
  days.forEach((d,i) => {
    const h = vals[i]/max*H, x = gap + i*(bw+gap);
    const lab = new Date(d+'T12:00').toLocaleDateString(undefined,{weekday:'short'});
    s += `<rect x="${x}" y="${H-Math.max(h,1)}" width="${bw}" height="${Math.max(h,1)}" rx="6" fill="${META[metric][1]}" opacity="${d===day?1:.45}"><title>${d}: ${fmt(vals[i])}</title></rect>
      <text x="${x+bw/2}" y="${H+16}" text-anchor="middle" class="ax">${lab}</text>`;
    if (vals[i]) s += `<text x="${x+bw/2}" y="${H-h-5}" text-anchor="middle" class="vl">${vals[i]>=1000?(vals[i]/1000).toFixed(1)+'k':vals[i]}</text>`;
  });
  $('#chart').innerHTML = s + '</svg>';
  $('#avg').textContent = fmt(Math.round(vals.reduce((a,b)=>a+b,0)/7));
  $('#best').textContent = fmt(Math.max(...vals));
  let n = 0, d = tot(day).steps+tot(day).minutes+tot(day).calories ? day : shift(day,-1);
  while (S.entries.some(e => e.date === d)) { n++; d = shift(d,-1); }
  $('#streak').textContent = n;
}

function list(){
  const items = S.entries.filter(e => e.date === day);
  $('#list').innerHTML = items.length ? items.map(e =>
    `<li><div class="t"><b>${e.type}</b><small>${[e.minutes&&e.minutes+' min', e.steps&&fmt(e.steps)+' steps', e.calories&&e.calories+' kcal'].filter(Boolean).join(', ')}</small></div><button class="x" data-id="${e.id}" aria-label="Delete ${e.type} entry">Delete</button></li>`).join('')
    : '<li class="empty">Nothing logged for this day yet. Add your first activity above.</li>';
}

function render(){
  const t = tot(day), g = S.goals, isToday = day === iso(new Date());
  $('#day').value = day; $('#day').max = iso(new Date());
  $('#next').disabled = isToday;
  $('#lbl').textContent = isToday ? 'today' : day;
  $('#addlbl').textContent = isToday ? 'today' : day;
  $('#rings').innerHTML = ['steps','minutes','calories'].map(k => ring(k, t[k], g[k])).join('');
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.m === metric));
  for (const k in g) document.querySelector(`#goals [name=${k}]`).value = g[k];
  chart(); list();
}

$('#form').onsubmit = e => {
  e.preventDefault();
  const f = new FormData(e.target), type = f.get('type');
  const minutes = +f.get('minutes') || 0, steps = +f.get('steps') || 0;
  let calories = +f.get('calories') || 0;
  if (!minutes && !steps && !calories) return msg('Enter minutes, steps or calories to log an activity.', true);
  if (!calories && minutes) calories = Math.round(minutes * RATE[type]);
  S.entries.push({id: Date.now(), date: day, type, minutes, steps, calories});
  save(); e.target.reset(); render(); msg('Activity added.');
};
$('#list').onclick = e => {
  const id = e.target.dataset.id; if (!id) return;
  S.entries = S.entries.filter(x => x.id != id); save(); render(); msg('Entry deleted.');
};
$('#tabs').onclick = e => { if (e.target.dataset.m) { metric = e.target.dataset.m; render(); } };
$('#prev').onclick = () => { day = shift(day,-1); render(); };
$('#next').onclick = () => { if (day < iso(new Date())) { day = shift(day,1); render(); } };
$('#day').onchange = e => { if (e.target.value) { day = e.target.value; render(); } };
$('#goals').onchange = e => {
  const v = +e.target.value; if (v > 0) { S.goals[e.target.name] = v; save(); render(); }
};
$('#csv').onclick = () => {
  const rows = ['date,type,minutes,steps,calories', ...S.entries.map(e => [e.date,e.type,e.minutes,e.steps,e.calories].join(','))];
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([rows.join('\n')], {type:'text/csv'}));
  a.download = 'stride-activity.csv'; a.click();
};
$('#demo').onclick = () => {
  if (S.entries.length && !confirm('Add sample data for the last 14 days to your existing entries?')) return;
  const types = ['Walking','Running','Cycling','Gym workout','Yoga','HIIT'];
  for (let i = 0; i < 14; i++) {
    const d = shift(iso(new Date()), -i), t = types[(i*5+3) % types.length], m = 20 + (i*7) % 40;
    S.entries.push({id: Date.now()+i*2, date: d, type: 'Daily steps', minutes: 0, steps: 4000 + (i*1370) % 7000, calories: 0});
    if (i % 5 !== 4) S.entries.push({id: Date.now()+i*2+1, date: d, type: t, minutes: m, steps: t==='Running'||t==='Walking' ? m*110 : 0, calories: Math.round(m*RATE[t])});
  }
  save(); render(); msg('Sample data added.');
};
$('#clear').onclick = () => {
  if (confirm('Delete all logged activity? This cannot be undone.')) { S.entries = []; save(); render(); msg('All data cleared.'); }
};

load(); render();
