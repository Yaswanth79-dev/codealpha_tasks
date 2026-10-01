'use strict';
const K = 'lingo.v1', $ = s => document.querySelector(s);
let S = {lang:'es', box:{}, xp:0, days:[], scores:[], daily:{}};
let view = 'home', sess = null;
try { const r = JSON.parse(localStorage.getItem(K)); if (r && r.box) S = Object.assign(S, r); } catch(e){}
const save = () => { try { localStorage.setItem(K, JSON.stringify(S)); } catch(e){} };
const L = () => D[S.lang];
const todayStr = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset()*6e4).toISOString().slice(0,10); };
const shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const bx = x => S.box[`${S.lang}:${x.c}:${x.i}`] || 0;
const setBx = (x,v) => S.box[`${S.lang}:${x.c}:${x.i}`] = v;
const items = c => L()[c].map((a,i) => ({w:a[0], p:a[1], e:a[2], c, i}));
const learned = c => items(c).filter(x => bx(x) >= 2).length;
const NAMES = {vocab:'Vocabulary', phrases:'Phrases', grammar:'Grammar', mixed:'Mixed'};
const pct = (a,b) => b ? Math.round(a/b*100) : 0;

function mark(){ const t = todayStr(); if (!S.days.includes(t)) S.days.push(t); }
function streak(){
  const d = new Date(); let n = 0; const f = x => new Date(x - x.getTimezoneOffset()*6e4).toISOString().slice(0,10);
  if (!S.days.includes(f(d))) d.setDate(d.getDate()-1);
  while (S.days.includes(f(d))) { n++; d.setDate(d.getDate()-1); }
  return n;
}
function say(text){
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = L().code; u.rate = .85; speechSynthesis.speak(u);
}

/* ---------- flashcards ---------- */
function startCards(list, then){
  sess = {type:'cards', list, i:0, flip:false, got:0, then}; view = 'study';
}
function dueList(c, n){ return items(c).sort((a,b) => bx(a)-bx(b) || a.i-b.i).slice(0, n); }

/* ---------- quizzes ---------- */
function qItem(x, pool){
  const rev = Math.random() < .5;
  const ans = rev ? x.w : x.e;
  const others = shuffle(pool.filter(y => y.w !== x.w)).slice(0,3).map(y => rev ? y.w : y.e);
  return {p: rev ? `How do you say “${x.e}”?` : `What does “${x.w}” mean?`, o: shuffle([ans, ...others]), a: ans, say: x.w, x};
}
const qGram = g => ({p:g.q[0], o:shuffle(g.q[1]), a:g.q[1][g.q[2]]});
function startQuiz(cat, daily, list){
  let qs;
  if (list) qs = list.map(x => qItem(x, items(x.c)));
  else if (cat === 'grammar') qs = shuffle(L().grammar.map(qGram));
  else if (cat === 'mixed') qs = shuffle([...shuffle(items('vocab')).slice(0,4).map(x=>qItem(x,items('vocab'))), ...shuffle(items('phrases')).slice(0,2).map(x=>qItem(x,items('phrases'))), ...shuffle(L().grammar).slice(0,2).map(qGram)]);
  else qs = shuffle(items(cat)).slice(0,8).map(x => qItem(x, items(cat)));
  sess = {type:'quiz', cat, daily, qs, i:0, score:0, picked:null, missed:[]}; view = 'study';
}
function finishQuiz(){
  const s = sess; S.xp += s.score*10; mark();
  S.scores.push({lang:S.lang, cat:s.cat, s:s.score, n:s.qs.length, d:todayStr()});
  if (s.daily) { S.daily[todayStr()] = true; S.xp += 20; }
  save(); sess = {type:'result', ...s};
}

/* ---------- views ---------- */
function home(){
  const done = S.daily[todayStr()];
  const cats = ['vocab','phrases'].map(c => {
    const n = items(c).length, l = learned(c);
    return `<button class="cat" data-a="cat" data-c="${c}"><b>${NAMES[c]}</b><small>${l} of ${n} learned</small><div class="bar"><i style="width:${pct(l,n)}%"></i></div></button>`;
  }).join('') + `<button class="cat" data-a="go" data-v="grammar"><b>Grammar</b><small>${L().grammar.length} short lessons</small><div class="bar"><i style="width:${pct(S.scores.filter(x=>x.lang===S.lang&&x.cat==='grammar').length?1:0,1)}%"></i></div></button>`;
  return `<div class="card hero"><h2>Today's lesson</h2><p>${done ? 'Done for today. Nice work! Practise more any time.' : 'Five words and phrases, then a quick quiz.'}</p>
    <button class="btn" data-a="daily">${done ? 'Practise again' : 'Start lesson'}</button></div>
    <div class="cats">${cats}</div>`;
}
function study(){
  const s = sess;
  if (s.type === 'cards') {
    const x = s.list[s.i];
    return `<div class="meta"><span>${NAMES[x.c]}</span><span>${s.i+1} of ${s.list.length}</span></div>
      <div class="card"><button class="flash" data-a="flip" aria-label="Flip card"><div class="w">${x.w}</div>
      ${s.flip ? `<div class="p">${x.p}</div><div class="e">${x.e}</div>` : '<small>Tap to see translation and pronunciation</small>'}</button>
      <div class="row" style="justify-content:center"><button class="say" data-a="say" data-t="${x.w.replace(/"/g,'&quot;')}" aria-label="Hear pronunciation">&#128266;</button></div></div>
      ${s.flip ? `<div class="row"><button class="btn alt" data-a="rate" data-g="0">Still learning</button><button class="btn good" data-a="rate" data-g="1">Got it</button></div>` : ''}`;
  }
  if (s.type === 'quiz') {
    const q = s.qs[s.i], p = s.picked;
    return `<div class="meta"><span>${NAMES[s.cat] || 'Quiz'} quiz</span><span>${s.i+1} of ${s.qs.length}</span></div>
      <div class="card"><div class="q">${q.p}</div><div class="opts">${q.o.map((o,k) =>
        `<button class="opt ${p===null?'':o===q.a?'ok':k===p?'no':''}" data-a="pick" data-k="${k}" ${p===null?'':'disabled'}>${o}</button>`).join('')}</div>
      ${p!==null ? `<button class="btn" data-a="next">${s.i+1===s.qs.length?'See results':'Next'}</button>` : ''}</div>`;
  }
  if (s.type === 'cdone') return `<div class="card"><h2>Session complete</h2><p>You marked ${s.got} of ${s.n} as known. +${s.got*5} XP</p><div class="row"><button class="btn" data-a="go" data-v="home">Back to lessons</button><button class="btn alt" data-a="go" data-v="quiz">Take a quiz</button></div></div>`;
  const p = pct(s.score, s.qs.length);
  return `<div class="card"><h2>${s.score} of ${s.qs.length} correct (${p}%)</h2><p>${p>=80?'Excellent work!':p>=50?'Good progress. Review the cards and try again.':'Keep practising, you will get there.'} +${s.score*10} XP</p>
    ${s.missed.length ? `<p class="mute">To review:</p><ul class="ex">${s.missed.map(m=>`<li><b>${m.q}</b> ${m.a}</li>`).join('')}</ul>` : ''}
    <div class="row"><button class="btn" data-a="go" data-v="quiz">Another quiz</button><button class="btn alt" data-a="go" data-v="home">Back to lessons</button></div></div>`;
}
function quizMenu(){
  return `<div class="card"><h2>Choose a practice test</h2><p class="mute">Check what you have learned in ${L().name}.</p><div class="cats">${['vocab','phrases','grammar'].map(c=>
    `<button class="cat" data-a="quiz" data-c="${c}"><b>${NAMES[c]}</b><small>${c==='grammar'?L().grammar.length:Math.min(8,L()[c].length)} questions</small></button>`).join('')}
    <button class="cat" data-a="quiz" data-c="mixed" style="grid-column:1/-1"><b>Mixed review</b><small>8 questions from every category</small></button></div></div>`;
}
function grammar(){
  return L().grammar.map(g => `<div class="card"><h2>${g.t}</h2><p>${g.e}</p><ul class="ex">${g.ex.map(e=>`<li><b>${e[0]}</b> means ${e[1]}</li>`).join('')}</ul></div>`).join('')
    + `<button class="btn" data-a="quiz" data-c="grammar">Practise grammar</button>`;
}
function progress(){
  const sc = S.scores.filter(x => x.lang === S.lang), avg = pct(sc.reduce((a,x)=>a+x.s,0), sc.reduce((a,x)=>a+x.n,0));
  const bars = ['vocab','phrases'].map(c => { const n = items(c).length, l = learned(c); return `<p style="margin:10px 0 0"><b>${NAMES[c]}</b> <span class="mute">${l} of ${n} learned</span></p><div class="bar"><i style="width:${pct(l,n)}%"></i></div>`; }).join('');
  return `<div class="card"><div class="stats"><div><b>${streak()}</b><span>day streak</span></div><div><b>${S.xp}</b><span>XP</span></div><div><b>${learned('vocab')+learned('phrases')}</b><span>items learned</span></div><div><b>${sc.length?avg+'%':'-'}</b><span>quiz average</span></div></div></div>
    <div class="card"><h2>${L().name} progress</h2>${bars}</div>
    <div class="card"><h2>Recent quizzes</h2>${sc.length ? `<ul class="ex">${sc.slice(-5).reverse().map(x=>`<li><b>${NAMES[x.cat]||'Lesson'}</b> ${x.s}/${x.n} on ${x.d}</li>`).join('')}</ul>` : '<p class="mute">No quizzes yet. Take one to see your scores here.</p>'}</div>
    <button class="btn alt" data-a="reset">Reset all progress</button>`;
}
function render(){
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.v === view || (view==='study' && b.dataset.v==='home' && sess && sess.type==='cards')));
  $('#lang').value = S.lang;
  $('#app').innerHTML = ({home, quiz:quizMenu, grammar, progress, study}[view])();
}

/* ---------- actions ---------- */
const act = {
  go: d => { view = d.v; sess = null; },
  cat: d => startCards(dueList(d.c, 10)),
  daily: () => { const l = [...dueList('vocab',3), ...dueList('phrases',2)]; startCards(l, () => startQuiz('mixed', true, l)); },
  flip: () => { sess.flip = !sess.flip; },
  say: d => say(d.t),
  rate: d => {
    const x = sess.list[sess.i]; setBx(x, d.g === '1' ? Math.min(4, bx(x)+1) : 0);
    if (d.g === '1') sess.got++;
    sess.i++; sess.flip = false;
    if (sess.i >= sess.list.length) {
      S.xp += sess.got*5; mark(); save();
      if (sess.then) sess.then(); else sess = {type:'cdone', got:sess.got, n:sess.list.length};
    } else save();
  },
  quiz: d => startQuiz(d.c),
  pick: d => {
    const q = sess.qs[sess.i]; if (sess.picked !== null) return;
    sess.picked = +d.k;
    if (q.o[sess.picked] === q.a) { sess.score++; if (q.say) say(q.say); }
    else sess.missed.push({q: q.p, a: q.a});
  },
  next: () => { if (++sess.i >= sess.qs.length) finishQuiz(); else sess.picked = null; },
  reset: () => { if (confirm('Delete all progress, scores and streaks?')) { S = {lang:S.lang, box:{}, xp:0, days:[], scores:[], daily:{}}; save(); } }
};
$('#app').onclick = $('#nav').onclick = e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  act[b.dataset.a](b.dataset); render();
};
$('#lang').onchange = e => { S.lang = e.target.value; save(); view = 'home'; sess = null; render(); };
render();
