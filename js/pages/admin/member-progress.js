(function(){
var KEY="aiche.memberProgress.v1", C=["Technical","Marketing","OC","QC","PR","Web Development"];
var D={members:[{id:"m1",name:"Ahmed Hassan",committee:"Technical"},{id:"m2",name:"Sara Ali",committee:"Marketing"},{id:"m3",name:"Omar Khaled",committee:"Web Development"},{id:"m4",name:"Mariam Adel",committee:"QC"}],sessions:[{id:"s1",name:"Technical Weekly — 12 Oct",committee:"Technical"},{id:"s2",name:"Marketing Planning — 15 Oct",committee:"Marketing"},{id:"s3",name:"Web Team Review — 19 Oct",committee:"Web Development"}],rules:{Tasks:2,Attendance:2,Events:2,Engagement:1,Bonus:1},records:[{memberId:"m1",category:"Tasks",points:2,reason:"Task submitted on time",date:"2026-10-12"},{memberId:"m1",category:"Engagement",points:1,reason:"Active and engaged",date:"2026-10-12"},{memberId:"m2",category:"Tasks",points:-1,reason:"Task not submitted",date:"2026-10-15"},{memberId:"m3",category:"Bonus",points:1,reason:"Supported another committee",date:"2026-10-19"}],attendance:{}};
function read(){try{return JSON.parse(localStorage.getItem(KEY))||JSON.parse(JSON.stringify(D))}catch(e){return JSON.parse(JSON.stringify(D))}}
function scope(m){var u=window.currentUser;return !u||["president","vp","secretary"].indexOf(u.role)>=0||u.role!=="committee_admin"||!u.committee||u.committee===m.committee}
function can(k){return typeof window.can!=="function"||window.can(window.currentUser,k)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function total(d,id){return d.records.filter(function(r){return r.memberId===id}).reduce(function(n,r){return n+Number(r.points||0)},0)}
function rows(d,c){return d.members.filter(function(m){return scope(m)&&(c==="all"||m.committee===c)})}
window.AICHEProgress={KEY:KEY,committees:C,read:read,save:function(d){localStorage.setItem(KEY,JSON.stringify(d))},scope:scope,can:can,esc:esc,total:total,rows:rows};
if(!document.getElementById("progressRows"))return;
if(!can("view_member_progress")){document.querySelector(".dashboard").innerHTML="<h1>Access unavailable</h1><p>Your account cannot view member progress.</p>";return}
var mf=document.getElementById("memberFilter"),cf=document.getElementById("committeeFilter"),d=read();
cf.innerHTML+=C.filter(function(c){return !window.currentUser||window.currentUser.role!=="committee_admin"||!window.currentUser.committee||c===window.currentUser.committee}).map(function(c){return "<option>"+esc(c)+"</option>"}).join("");
mf.innerHTML='<option value="all">All members</option>'+d.members.filter(scope).map(function(m){return '<option value="'+esc(m.id)+'">'+esc(m.name)+"</option>"}).join("");
function render(){d=read();var shown=rows(d,cf.value).filter(function(m){return mf.value==="all"||m.id===mf.value});
document.getElementById("progressRows").innerHTML=shown.map(function(m){var a=Object.keys(d.attendance).filter(function(k){return k.slice(-m.id.length-1)===":"+m.id}),p=a.filter(function(k){return d.attendance[k].status.indexOf("Attended")===0}).length;return "<tr><td>"+esc(m.name)+"</td><td>"+esc(m.committee)+"</td><td>"+p+" / "+a.length+"</td><td>"+d.records.filter(function(r){return r.memberId===m.id&&r.category==="Tasks"}).length+" / —</td><td>—</td><td>—</td><td><strong>"+total(d,m.id)+"</strong></td></tr>"}).join("")||'<tr><td colspan="7">No member records for this selection.</td></tr>';
document.getElementById("memberSummary").innerHTML='<article><span>Members shown</span><strong>'+shown.length+'</strong></article><article><span>Average points</span><strong>'+(shown.length?Math.round(shown.reduce(function(n,m){return n+total(d,m.id)},0)/shown.length):0)+'</strong></article><article><span>Attendance records</span><strong>'+Object.keys(d.attendance).length+'</strong></article>';
var hist=d.records.filter(function(r){return (mf.value==="all"||r.memberId===mf.value)&&shown.some(function(m){return m.id===r.memberId})}).slice().reverse();
document.getElementById("history").innerHTML=hist.map(function(r){var m=d.members.find(function(x){return x.id===r.memberId});return "<div><strong>"+esc(m?m.name:"Member")+"</strong><span>"+esc(r.reason)+" · "+esc(r.category)+" · "+(r.points>0?"+":"")+r.points+" points</span><time>"+esc(r.date)+"</time></div>"}).join("")||"<p>No point history yet.</p>"}
mf.onchange=cf.onchange=render;render();
})();
