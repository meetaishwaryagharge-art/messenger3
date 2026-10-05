(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='cc_state_v1',pg=location.pathname.split('/').pop(),Q=new URLSearchParams(location.search);
const C={all:['All Clients','AC'],RE:['Raj Enterprises','RE'],GT:['Global Traders Pvt Ltd','GT'],SS:['Sree Sai Logistics','SS'],VI:['Vikram Industries','VI'],SE:['Sunrise Exports','SE']};
const CL=['RE','GT','SS','VI','SE','AB','XY'];
const T={Festival:['#f08a4b','gift'],Notice:['#3b82f6','doc'],Announcement:['#8b5cf6','mega']};
const ts=s=>new Date(s).getTime();
const fresh=()=>({chats:{},read:{},sel:['RE','GT','SE'],
 draft:{type:'Festival',aud:'all',text:'This Diwali, may your home be filled with happiness, prosperity and success.\n\nHappy Diwali!',att:'',wa:1,em:1,when:null},
 sched:[{id:1,type:'Festival',title:'Diwali Festival Message',aud:'All Clients (1,245)',ts:ts('2026-11-12T10:00')},
 {id:2,type:'Announcement',title:'Monthly Newsletter',aud:'Active Clients (980)',ts:ts('2026-11-25T11:00')},
 {id:3,type:'Announcement',title:'New Product Launch',aud:'VIP Clients (120)',ts:ts('2026-12-05T14:00')},
 {id:4,type:'Notice',title:'Year End Notice',aud:'All Clients (1,245)',ts:ts('2026-12-20T09:00')}],sent:[]});
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}S=S||fresh();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const D=S.draft,esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const now=()=>new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
const fmt=t=>{const d=new Date(t);return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})+' • '+d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})};
const go=u=>location.href=u;
const toast=m=>{const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.appendChild(d);setTimeout(()=>d.remove(),1800)};
const audInfo=()=>{const n=S.sel.length;return D.aud==='all'?['All Clients (1,245)',1245]:D.aud==='active'?['Active Clients (980)',980]:D.aud==='vip'?['VIP Clients (120)',120]:['Selected Clients ('+n+')',n]};

// shared: bottom nav + header icons
$$('.nav a').forEach(a=>{const l=a.textContent.trim();a.style.cursor='pointer';
 a.onclick=()=>l==='Chats'?go('02-chat-list.html'):l==='Contacts'?go('05-select-clients.html?from=contacts'):l==='Broadcast'?go('07-scheduled.html'):toast('More options coming soon')});

// 02 chat list
if(pg.startsWith('02')){
 $('.tabs a.on').href='02-chat-list.html';
 $$('.row').forEach(r=>{r.closest('a')?.replaceWith(r);
  const n=$('b',r).textContent,id=Object.keys(C).find(k=>C[k][0]===n);if(!id)return;
  const L=(S.chats[id]||[]).slice(-1)[0];
  if(L){$('.m span',r).textContent=(L.w==='me'?'You: ':'')+L.t.replace(/\n+/g,' ');const t=$('time',r);if(t)t.textContent=L.tm}
  if(S.read[id])$('.badge',r)?.remove();
  r.onclick=()=>go('03-individual-chat.html?c='+id)});
 $('.fab').onclick=()=>go('05-select-clients.html?from=contacts');
 $$('.hd i').forEach(i=>{if(!i.closest('a'))i.onclick=()=>toast('Not available in this demo')});
}

// 03 individual chat
if(pg.startsWith('03')){
 const id=C[Q.get('c')]?Q.get('c'):'RE',c=C[id];S.read[id]=1;save();
 const hd=$('.hd');$('.av',hd).textContent=c[1];$('div',hd).firstChild.textContent=c[0];
 if(id==='all')$('small',hd).textContent='245 clients';
 $$('.hd i').forEach(i=>{if(!i.closest('a'))i.onclick=()=>toast('Not available in this demo')});
 const chat=$('.chat');chat.style.overflowY='auto';
 if(id!=='RE')chat.innerHTML='<div class=pill>Today</div>';
 const add=m=>{const d=document.createElement('div');d.className='bub'+(m.w==='in'?' in':'');
  d.innerHTML=esc(m.t).replace(/\n/g,'<br>')+'<em>'+m.tm+(m.w==='me'?' ✓✓':'')+'</em>';chat.appendChild(d);chat.scrollTop=chat.scrollHeight};
 (S.chats[id]||[]).forEach(add);
 $('.input').innerHTML='<div style="display:flex;gap:10px;align-items:center"><i data-i=smile data-s=20></i><input id=msg placeholder="Type a message..." autocomplete=off><i data-i=clip data-s=20></i><i data-i=camera data-s=20></i></div><b id=send style="cursor:pointer"><i data-i=mic data-s=22></i></b>';
 renderIcons();
 const inp=$('#msg'),btn=$('#send');
 const icon=()=>{btn.innerHTML='<i data-i='+(inp.value.trim()?'next':'mic')+' data-s=22></i>';renderIcons()};
 const replies=['Thank you!','Noted, thanks.','Sure, will check and revert.','Received. Thank you!'];
 const send=()=>{const v=inp.value.trim();if(!v)return toast('Voice messages not available in demo');
  const m={w:'me',t:v,tm:now()};(S.chats[id]=S.chats[id]||[]).push(m);save();add(m);inp.value='';icon();
  if(id!=='all')setTimeout(()=>{const r={w:'in',t:replies[Math.random()*4|0],tm:now()};S.chats[id].push(r);save();add(r)},1200)};
 btn.onclick=send;inp.oninput=icon;inp.onkeydown=e=>{if(e.key==='Enter')send()};
 $$('.input i[data-i=smile],.input i[data-i=clip],.input i[data-i=camera]').forEach(i=>i.onclick=()=>toast('Not available in this demo'));
}

// 04 create announcement
if(pg.startsWith('04')){
 const tiles=$$('.types')[0].children,att=$$('.types')[1].children,rads=$$('.rad').slice(0,4),via=$$('.rad')[4];
 const types=['Festival','Notice','Announcement'];
 $('.box').outerHTML='<div class=box style="height:110px"><textarea id=txt maxlength=1000 placeholder="Write your message..."></textarea><small id=cnt></small></div>';
 const txt=$('#txt'),cnt=$('#cnt');txt.value=D.text;
 const upd=()=>{D.text=txt.value;cnt.textContent=txt.value.length+'/1000';save()};txt.oninput=upd;upd();
 [...tiles].forEach((t,i)=>{t.classList.toggle('sel',D.type===types[i]);t.onclick=()=>{D.type=types[i];[...tiles].forEach(x=>x.classList.toggle('sel',x===t));save()}});
 const r4=rads[3];r4.closest('a')?.replaceWith(r4);
 const keys=['all','active','vip','sel'],rl=()=>{rads.forEach((r,i)=>r.firstElementChild.className=D.aud===keys[i]?'on':'');
  r4.childNodes[1].textContent='Selected Clients'+(D.aud==='sel'?' ('+S.sel.length+') ':' ')};
 rads.forEach((r,i)=>r.onclick=()=>{if(i===3){D.aud='sel';save();return go('05-select-clients.html')}D.aud=keys[i];save();rl()});rl();
 const labels=['Image','PDF','Document'],acc=['image/*','application/pdf','.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'];
 const file=document.createElement('input');file.type='file';let cur=-1;
 const al=()=>[...att].forEach((t,i)=>{const s=$('span',t);s.style.cssText='color:var(--tx);max-width:88px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
  const on=D.att&&D.attIdx===i;t.classList.toggle('sel',!!on);s.textContent=on?D.att:labels[i]});
 [...att].forEach((t,i)=>t.onclick=()=>{if(D.att&&D.attIdx===i){D.att='';D.attIdx=-1;save();return al()}cur=i;file.accept=acc[i];file.value='';file.click()});
 file.onchange=()=>{if(file.files[0]){D.att=file.files[0].name;D.attIdx=cur;save();al()}};al();
 const chk=$$('.chk',via),ks=['wa','em'];
 chk.forEach((c,i)=>{c.classList.toggle('on',!!D[ks[i]]);c.onclick=()=>{if(D[ks[i]]&&!D[ks[1-i]])return toast('Select at least one channel');D[ks[i]]=D[ks[i]]?0:1;c.classList.toggle('on',!!D[ks[i]]);save()}});
 $('a.btn').onclick=e=>{e.preventDefault();upd();
  if(!D.text.trim())return toast('Please write a message');
  if(D.aud==='sel'&&!S.sel.length)return toast('Select at least one client');go('06-message-preview.html')};
}

// 05 select clients
if(pg.startsWith('05')){
 const rows=$$('.row'),chips=$$('.chips span'),ft=$('b[style*="gr"]');
 if(Q.get('from')==='contacts')$('.hd a').href='02-chat-list.html';
 const sb=$('.box');sb.innerHTML='<i data-i=search data-s=18></i><input id=q placeholder="Search clients...">';
 rows.forEach((r,i)=>{const c=$('.chk',r);if(!$('i',c))c.innerHTML='<i data-i=check data-s=12></i>';r.dataset.id=CL[i];r.dataset.fav=$('.tag',r)?1:'';
  c.classList.toggle('on',S.sel.includes(CL[i]));r.onclick=()=>{const id=CL[i],k=S.sel.indexOf(id);k<0?S.sel.push(id):S.sel.splice(k,1);save();rf()}});
 renderIcons();let tab=0;
 const rf=()=>{const q=$('#q').value.toLowerCase();
  rows.forEach(r=>{const on=S.sel.includes(r.dataset.id);$('.chk',r).classList.toggle('on',on);
   const ok=(tab===0||(tab===1&&on)||(tab===2&&r.dataset.fav))&&r.textContent.toLowerCase().includes(q);r.style.display=ok?'':'none'});
  ft.textContent='Selected: '+S.sel.length;chips[1].textContent='Selected ('+S.sel.length+')'};
 chips.forEach((c,i)=>{c.style.cursor='pointer';c.onclick=()=>{tab=i;chips.forEach(x=>x.classList.toggle('on',x===c));rf()}});
 $('#q').oninput=rf;rf();
 $('a[href*="06"]').onclick=e=>{e.preventDefault();if(!S.sel.length)return toast('Select at least one client');D.aud='sel';save();go('06-message-preview.html')};
}

// 06 preview / send / schedule
if(pg.startsWith('06')){
 if(!D.text.trim()){toast('Write a message first');setTimeout(()=>go('04-create-announcement.html'),900)}
 if(D.type!=='Festival')$('.ban').style.display='none';
 const bub=$('div[style*="background:var(--lt)"]');
 bub.innerHTML=esc(D.text).replace(/\n/g,'<br>')+(D.att?'<br><br>📎 '+esc(D.att):'')+'<em style="display:block;text-align:right;font-size:10.5px;color:var(--mu);font-style:normal">'+now()+' ✓✓</em>';
 const [rc,rv,rs]=$$('body > .row'),send=$('a.btn:not(.out)');
 const draw=()=>{const [l,n]=audInfo();$('b',rc).textContent=n.toLocaleString()+' clients';
  $('b',rv).textContent=(D.wa?'WhatsApp':'')+(D.wa&&D.em?' & ':'')+(D.em?'Email':'');
  $('b',rs).textContent=D.when?fmt(D.when):'Send Now';send.textContent=D.when?'Schedule':'Send Now'};draw();
 rc.onclick=rv.onclick=()=>go('04-create-announcement.html');
 rs.onclick=()=>{let later=!!D.when;const sh=document.createElement('div');sh.className='sheet';
  sh.innerHTML='<div><h4>Schedule message</h4><div class=chips><span data-m=0>Send Now</span><span data-m=1>Schedule for later</span></div><div id=dt style="display:none;gap:8px;padding:8px 16px"><input type=date id=d><input type=time id=tm></div><div style="height:8px"></div><button class=btn id=ok>Done</button></div>';
  document.body.appendChild(sh);const today=new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
  $('#d',sh).min=today;if(D.when){const x=new Date(D.when-new Date().getTimezoneOffset()*6e4).toISOString();$('#d',sh).value=x.slice(0,10);$('#tm',sh).value=x.slice(11,16)}
  const m=()=>{$$('.chips span',sh).forEach((s,i)=>s.classList.toggle('on',!!i===later));$('#dt',sh).style.display=later?'flex':'none'};m();
  $$('.chips span',sh).forEach((s,i)=>s.onclick=()=>{later=!!i;m()});
  sh.onclick=e=>{if(e.target===sh)sh.remove()};
  $('#ok',sh).onclick=()=>{if(!later){D.when=null}else{const t=ts($('#d',sh).value+'T'+$('#tm',sh).value);if(isNaN(t)||t<=Date.now())return toast('Pick a future date & time');D.when=t}save();draw();sh.remove()}};
 send.onclick=e=>{e.preventDefault();if(!D.text.trim())return go('04-create-announcement.html');
  const [aud]=audInfo(),title=D.text.trim().split('\n')[0].slice(0,32),rec={id:Date.now(),type:D.type,title,aud,ts:D.when||Date.now(),text:D.text};
  if(D.when){S.sched.push(rec)}else{S.sent.unshift(rec);(S.chats.all=S.chats.all||[]).push({w:'me',t:D.text,tm:now()})}
  const later=!!D.when;D.text='';D.att='';D.attIdx=-1;D.when=null;save();toast(later?'Message scheduled':'Message sent');
  setTimeout(()=>go('07-scheduled.html'+(later?'':'?tab=sent')),700)};
}

// 07 scheduled / sent
if(pg.startsWith('07')){
 let tab=Q.get('tab')==='sent'?1:0;const tabs=$$('.tabs a'),list=document.createElement('div');
 $$('.sch').forEach(e=>e.remove());$('.tabs').after(list);
 const render=()=>{tabs.forEach((t,i)=>t.classList.toggle('on',i===tab));
  const items=(tab?S.sent:[...S.sched].sort((a,b)=>a.ts-b.ts));
  list.innerHTML=items.length?'':'<div class=empty>'+(tab?'No sent messages yet':'No scheduled messages')+'</div>';
  items.forEach(it=>{const [bg,ic]=T[it.type]||T.Announcement,d=document.createElement('div');d.className='sch';
   d.innerHTML='<span class=ic style="background:'+bg+'"><i data-i='+ic+' data-s=20></i></span><div style=flex:1><b>'+esc(it.title)+'</b><br><span style="color:var(--mu);font-size:12px">'+esc(it.aud)+'</span><br><span style="color:var(--mu);font-size:12px">'+fmt(it.ts)+'</span></div><span class=st>'+(tab?'Sent':'Scheduled')+'</span><span class=dots><i data-i=dots data-s=18></i></span>';
   $('.dots',d).onclick=e=>{e.stopPropagation();$$('.menu').forEach(m=>m.remove());const m=document.createElement('div');m.className='menu';
    m.innerHTML=(tab?'':'<div data-a=now>Send now</div>')+'<div data-a=del style="color:#e53935">Delete</div>';d.appendChild(m);
    m.onclick=ev=>{const a=ev.target.dataset.a;if(!a)return;
     if(a==='del'){const L=tab?S.sent:S.sched;L.splice(L.indexOf(it),1);toast('Deleted')}
     else{S.sched.splice(S.sched.indexOf(it),1);it.ts=Date.now();S.sent.unshift(it);toast('Message sent')}save();render()}};
   list.appendChild(d)});renderIcons()};
 tabs.forEach((t,i)=>{t.style.cursor='pointer';t.onclick=()=>{tab=i;render()}});
 document.addEventListener('click',()=>$$('.menu').forEach(m=>m.remove()));render();
}
})();
