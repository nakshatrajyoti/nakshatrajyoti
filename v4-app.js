
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";

const V4_CONFIG = {
  apiKey:"AIzaSyDRNf2BBo6KnjXCfXAaBvq58SDZ7cuVB9w",
  authDomain:"nakshatra-jyoti.firebaseapp.com",
  projectId:"nakshatra-jyoti",
  storageBucket:"nakshatra-jyoti.firebasestorage.app",
  messagingSenderId:"8014602515",
  appId:"1:8014602515:web:848b96e6932d9070a53ae6"
};

const v4App = getApps().find(a => a.name === "nakshatraV4") || initializeApp(V4_CONFIG,"nakshatraV4");
const auth = getAuth(v4App);
const db = getFirestore(v4App);
const storage = getStorage(v4App);

const SUPER_ADMIN_UID = "W1uZo8MbVhgT9xfPC4AzAJtzjOu1";

const ZODIAC = [
  ["मेष","♈","आज आत्मविश्वास के साथ निर्णय लेने का दिन है।"],
  ["वृषभ","♉","धैर्य और नियमित प्रयास से काम आगे बढ़ेगा।"],
  ["मिथुन","♊","बातचीत और सीखने से नए अवसर मिल सकते हैं।"],
  ["कर्क","♋","परिवार और भावनात्मक संतुलन पर ध्यान दें।"],
  ["सिंह","♌","नेतृत्व और रचनात्मकता को सही दिशा दें।"],
  ["कन्या","♍","योजना बनाकर चलने से काम व्यवस्थित रहेगा।"],
  ["तुला","♎","संतुलन और सहयोग से बेहतर परिणाम मिलेंगे।"],
  ["वृश्चिक","♏","धैर्य रखें और महत्वपूर्ण बातों पर जल्दबाजी न करें।"],
  ["धनु","♐","नई सीख और नई दिशा के लिए अच्छा समय है।"],
  ["मकर","♑","लगातार मेहनत का परिणाम धीरे-धीरे दिखाई देगा।"],
  ["कुंभ","♒","नए विचारों को व्यावहारिक रूप देने का समय है।"],
  ["मीन","♓","अंतर्ज्ञान और शांत मन से निर्णय लेना लाभकारी रहेगा।"]
];

const ACHARYA_FALLBACK = [
  {id:"acharya1",name:"ज्योतिषाचार्य शुभांशु दुबे",speciality:"वैदिक ज्योतिष • जन्म-कुंडली",image:"./assets/acharyas/acharya1.jpg",qualification:"वैदिक ज्योतिष एवं जन्म-कुंडली अध्ययन",bio:"व्यक्तिगत प्रश्नों और वैदिक ज्योतिषीय विषयों पर परामर्श।"},
  {id:"acharya2",name:"श्रीकांत मिश्रा",speciality:"वैदिक ज्योतिष • परामर्श",image:"./assets/acharyas/acharya2.jpg",qualification:"वैदिक अध्ययन एवं ज्योतिषीय परामर्श",bio:"जीवन के महत्वपूर्ण निर्णयों के लिए संरचित वैदिक मार्गदर्शन।"},
  {id:"acharya3",name:"सिद्धांत मिश्रा",speciality:"वैदिक ज्योतिष • परामर्श",image:"./assets/acharyas/acharya3.jpg",qualification:"संस्कृत, वैदिक परंपरा एवं ज्योतिषीय अध्ययन",bio:"परंपरागत ज्ञान और व्यक्तिगत मार्गदर्शन पर केंद्रित।"}
];

let role="guest", profile=null, activeAcharya=null, activeConversation=null;
let pageStack=[];
let chatUnsub=null;
let conversationUnsub=null;
let currentMuted=false;

const $ = id => document.getElementById(id);
const q = sel => document.querySelector(sel);
const qa = sel => [...document.querySelectorAll(sel)];
const esc = v => String(v ?? "").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

function shellOn(){
  const s=$("v4RoleShell"); if(!s) return;
  s.classList.add("v4-active"); s.setAttribute("aria-hidden","false");
}
function page(id, push=true){
  const pages=qa(".v4-page");
  if(!$(id)) return;
  pages.forEach(p=>p.classList.add("v4-hidden"));
  $(id).classList.remove("v4-hidden");
  if(push) pageStack.push(id);
  const title=$(id)?.querySelector("h1")?.textContent || "Nakshatra Jyoti";
  $("v4TopTitle").textContent=title;
  $("v4TopSub").textContent=role==="admin"?"Super Admin":role==="acharya"?"आचार्य पैनल":"वैदिक मार्गदर्शन";
}
function back(){
  if(pageStack.length>1){ pageStack.pop(); const id=pageStack[pageStack.length-1]; page(id,false); return; }
  page(role==="admin"?"v4AdminDashboard":role==="acharya"?"v4AcharyaDashboard":"v4UserHome",false);
}
function setRoleNav(){
  const nav=$("v4RoleNav"); if(!nav) return;
  const ach=nav.querySelector("[data-v4-acharyas]");
  const msg=nav.querySelector("[data-v4-messages]");
  const home=nav.querySelector("[data-v4-home]");
  if(role==="admin"){
    ach?.classList.add("v4-hidden"); msg?.classList.add("v4-hidden"); home?.setAttribute("data-v4-home","");
  }else if(role==="acharya"){
    ach?.classList.add("v4-hidden"); msg?.classList.remove("v4-hidden");
    msg.querySelector("small").textContent="मेरे संदेश";
  }else{
    ach?.classList.remove("v4-hidden"); msg?.classList.remove("v4-hidden");
    msg.querySelector("small").textContent="संदेश";
  }
}
function renderZodiac(target){
  $(target).innerHTML=ZODIAC.map(([n,s,d])=>`<article class="v4-zodiac" data-zodiac="${n}"><span class="symbol">${s}</span><h3>${n}</h3><p>${esc(d)}</p></article>`).join("");
}
function renderPosts(){
  const posts=[
    {id:"demo1",name:"ज्योतिषाचार्य शुभांशु दुबे",image:"./assets/acharyas/acharya1.jpg",media:"./assets/acharyas/acharya1.jpg",caption:"आज का विचार — धैर्य, साधना और सही दिशा जीवन के निर्णयों को मजबूत बनाते हैं।"},
    {id:"demo2",name:"श्रीकांत मिश्रा",image:"./assets/acharyas/acharya2.jpg",media:"./assets/acharyas/acharya2.jpg",caption:"हर प्रश्न का उत्तर केवल समय नहीं, सही दृष्टिकोण भी देता है।"}
  ];
  const html=posts.map(p=>`
    <article class="v4-post" data-post="${p.id}">
      <div class="v4-post-head"><img class="v4-avatar" src="${p.image}" alt=""><div><strong>${esc(p.name)}</strong><small>आज</small></div></div>
      <img class="v4-post-media" src="${p.media}" alt="">
      <div class="v4-post-body"><p class="v4-post-caption">${esc(p.caption)}</p>
      <div class="v4-post-actions"><button data-like="${p.id}">♡ Like</button><button data-comment="${p.id}">💬 Comment</button><button data-share="${p.id}">↗ Share</button></div></div>
    </article>`).join("");
  $("v4PostFeed").innerHTML=html; $("v4PostFeedHome").innerHTML=html;
  qa("[data-post]").forEach(el=>el.addEventListener("click",e=>{if(e.target.closest("button"))return; openPost(el.dataset.post)}));
}
function openPost(id){
  const src=q(`[data-post="${id}"]`);
  if(!src)return;
  $("v4SinglePostBody").innerHTML=`<article class="v4-post">${src.innerHTML}<div class="v4-card" style="border:0;box-shadow:none"><h3>Comments</h3><textarea rows="3" placeholder="अपनी प्रतिक्रिया लिखें..."></textarea><button class="v4-primary" type="button">Comment भेजें</button></div></article>`;
  page("v4SinglePost");
}
async function loadAcharyas(){
  try{
    const snap=await import("https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js").then(m=>m.getDocs(m.collection(db,"acharyas")));
    if(!snap.empty) return snap.docs.map(d=>({id:d.id,...d.data()}));
  }catch{}
  return ACHARYA_FALLBACK;
}
async function renderAcharyas(){
  const list=await loadAcharyas();
  $("v4AcharyaList").innerHTML=list.map(a=>`<article class="v4-acharya-card" data-ach="${esc(a.id)}"><img class="v4-avatar" src="${esc(a.image||ACHARYA_FALLBACK[0].image)}" alt=""><div><h3>${esc(a.name)}</h3><p>${esc(a.speciality||"वैदिक ज्योतिष")}</p><span class="v4-online">● परामर्श उपलब्ध</span></div></article>`).join("");
  qa("[data-ach]").forEach(el=>el.addEventListener("click",()=>openAcharya(el.dataset.ach)));
}
async function openAcharya(id){
  const list=await loadAcharyas(); activeAcharya=list.find(a=>a.id===id)||list[0];
  $("v4AcharyaProfileBody").innerHTML=`
    <div class="v4-profile-card"><div class="v4-profile-cover"></div><div class="v4-profile-main">
      <img class="v4-avatar" src="${esc(activeAcharya.image)}" alt=""><h1>${esc(activeAcharya.name)}</h1>
      <div class="v4-online">● Online status उपलब्ध</div><p><b>${esc(activeAcharya.speciality||"वैदिक ज्योतिष")}</b></p>
      <p>${esc(activeAcharya.bio||"व्यक्तिगत वैदिक मार्गदर्शन।")}</p>
      <button class="v4-primary" data-v4-start-chat="${esc(activeAcharya.id)}">💬 निजी बातचीत शुरू करें</button>
    </div></div>
    <div class="v4-section"><div class="v4-section-head"><h2>विचार</h2></div><div class="v4-feed">${$("v4PostFeedHome").innerHTML}</div></div>`;
  $("v4AcharyaProfileBody").querySelector("[data-v4-start-chat]")?.addEventListener("click",()=>startChat(activeAcharya));
  page("v4AcharyaProfile");
}
async function roleOf(user){
  if(!user) return "guest";
  if(user.uid===SUPER_ADMIN_UID) return "admin";
  try{
    const s=await getDoc(doc(db,"users",user.uid));
    const r=s.exists()?s.data().role:"user";
    if(r==="acharya") return "acharya";
    return "user";
  }catch{return "user";}
}
function conversationId(a,b){ return [a,b].sort().join("_"); }
async function startChat(ach){
  const u=auth.currentUser;
  if(!u || role!=="user") return;
  if(ach.uid && ach.uid===u.uid){ return; } // self-chat is impossible
  activeConversation={userUid:u.uid,acharyaUid:ach.uid||ach.id,acharya:ach};
  $("v4ChatName").textContent=ach.name||"Pandit Ji";
  $("v4ChatAvatar").src=ach.image||"./assets/acharyas/acharya1.jpg";
  $("v4ChatStatus").textContent="● Online";
  $("v4MuteButton").textContent="🔔";
  currentMuted=false;
  pageStack.push("v4Chat"); page("v4Chat",false);
  listenChat();
}
function listenChat(){
  if(chatUnsub)chatUnsub();
  const u=auth.currentUser;if(!u||!activeConversation)return;
  // The UI is ready for a Firestore conversation collection:
  // conversations/{conversationId}/messages/{messageId}
  $("v4ChatMessages").innerHTML=`<div class="v4-bubble theirs">यह आपकी निजी बातचीत है। यहाँ केवल आप और आपके आचार्य के संदेश दिखाई देंगे।</div>`;
}
function renderNotifications(items=[]){
  const list=items.length?items:[{title:"स्वागत",body:"आपका notification center तैयार है।",time:"अभी"}];
  $("v4NotificationsList").innerHTML=list.map(n=>`<article class="v4-notification"><strong>${esc(n.title)}</strong><p>${esc(n.body)}</p><small>${esc(n.time||"")}</small></article>`).join("");
}
function routeByRole(){
  shellOn(); setRoleNav();
  if(role==="admin"){pageStack=["v4AdminDashboard"];page("v4AdminDashboard",false)}
  else if(role==="acharya"){
    $("v4AcharyaDashName").textContent=profile?.name||"आचार्य पैनल";
    pageStack=["v4AcharyaDashboard"];page("v4AcharyaDashboard",false)
  }else{
    pageStack=["v4UserHome"];page("v4UserHome",false)
  }
}
async function boot(user){
  role=await roleOf(user);
  if(user){
    try{const s=await getDoc(doc(db,"users",user.uid));profile=s.exists()?s.data():{uid:user.uid,role};}catch{profile={uid:user.uid,role};}
  }
  routeByRole();
  renderZodiac("v4RashifalPreview");renderZodiac("v4RashifalGrid");renderPosts();await renderAcharyas();renderNotifications();
}
$("v4Back")?.addEventListener("click",back);
$("v4RoleNav")?.addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.hasAttribute("data-v4-home"))page(role==="admin"?"v4AdminDashboard":role==="acharya"?"v4AcharyaDashboard":"v4UserHome");
  else if(b.hasAttribute("data-v4-acharyas"))page("v4AcharyaDirectory");
  else if(b.hasAttribute("data-v4-messages"))page(role==="acharya"?"v4AcharyaInbox":"v4UserInbox");
  else if(b.hasAttribute("data-v4-notifications"))page("v4Notifications");
});
$("v4AttachButton")?.addEventListener("click",()=>$("v4AttachmentMenu").classList.toggle("v4-hidden"));
qa("[data-v4-file]").forEach(b=>b.addEventListener("click",()=>{$("v4FileInput").accept=b.dataset.v4File;$("v4FileInput").click();$("v4AttachmentMenu").classList.add("v4-hidden")}));
$("v4MuteButton")?.addEventListener("click",()=>{currentMuted=!currentMuted;$("v4MuteButton").textContent=currentMuted?"🔕":"🔔"});
$("v4SendButton")?.addEventListener("click",()=>{const i=$("v4MessageInput");const t=i.value.trim();if(!t)return;const box=$("v4ChatMessages");box.insertAdjacentHTML("beforeend",`<div class="v4-bubble mine">${esc(t)}<small>अभी</small></div>`);i.value="";box.scrollTop=box.scrollHeight});
$("v4MessageInput")?.addEventListener("keydown",e=>{if(e.key==="Enter")$("v4SendButton").click()});
$("v4ProfileFile")?.addEventListener("change",e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=()=>{$("v4ProfilePreview").src=r.result};r.readAsDataURL(f)}});
$("v4SaveProfile")?.addEventListener("click",async()=>{
  const u=auth.currentUser;if(!u)return;
  const data={uid:u.uid,name:$("v4ProfileName").value.trim(),speciality:$("v4ProfileSpeciality").value.trim(),qualification:$("v4ProfileQualification").value.trim(),bio:$("v4ProfileBio").value.trim(),updatedAt:serverTimestamp()};
  try{await setDoc(doc(db,"users",u.uid),data,{merge:true});alert("Profile save हो गई।")}catch(e){alert("Profile save नहीं हो सकी।")}
});
$("v4PublishNotice")?.addEventListener("click",async()=>{
  if(role!=="admin")return;
  const title=$("v4AdminNoticeTitle").value.trim(),body=$("v4AdminNoticeBody").value.trim();if(!title||!body)return;
  try{await addDoc(collection(db,"notifications"),{title,body,createdBy:SUPER_ADMIN_UID,createdAt:serverTimestamp(),audience:"users"});alert("सूचना publish कर दी गई।");$("v4AdminNoticeTitle").value="";$("v4AdminNoticeBody").value=""}catch(e){alert("Firebase में सूचना publish नहीं हुई।")}
});
qa("[data-v4-page]").forEach(b=>b.addEventListener("click",()=>{const p=b.dataset.v4Page;const map={notifications:"v4Notifications","acharya-inbox":"v4AcharyaInbox","guidance":"v4Guidance","posts":"v4Posts","rashifal":"v4Rashifal","profile-edit":"v4ProfileEdit","admin-notifications":"v4AdminNotifications","admin-acharyas":"v4AdminAcharyas","admin-users":"v4AdminUsers","admin-posts":"v4AdminPosts","admin-guidance":"v4AdminGuidance","admin-settings":"v4AdminSettings"};if(map[p])page(map[p])}));
qa("[data-v4-guidance]").forEach(b=>b.addEventListener("click",()=>{$("v4GuidanceType").value=b.dataset.v4Guidance;page("v4Guidance")}));
$("v4SendGuidance")?.addEventListener("click",async()=>{
  const u=auth.currentUser;if(!u)return;const text=$("v4GuidanceText").value.trim();if(!text)return;
  try{await addDoc(collection(db,"guidance"),{userUid:u.uid,type:$("v4GuidanceType").value,text,status:"open",createdAt:serverTimestamp()});alert("आपका मार्गदर्शन प्रश्न भेज दिया गया।");$("v4GuidanceText").value=""}catch{alert("Guidance भेजने में समस्या हुई।")}
});
$("v4BackChat")?.addEventListener("click",back);

onAuthStateChanged(auth,user=>{
  if(user) boot(user);
  else { role="guest"; profile=null; }
});
