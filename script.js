/* =========================================
   NAKSHATRA JYOTI
   FINAL FRONTEND JS
========================================= */


/* ================================
   ACHARYA DATA
================================ */

const acharyas = [

  {
    id: "shudhanshu",

    name: "ज्योतिषाचार्य शुभांशु दुबे",

    shortName: "शुभांशु दुबे",

    qualification:
      "वैदिक ज्योतिष • जन्म-कुंडली • प्रश्न परामर्श",

    image:
      "assets/acharyas/shudhanshu.jpg"
  },

  {
    id: "shreekant",

    name: "श्रीकांत मिश्रा",

    shortName: "श्रीकांत मिश्रा",

    qualification:
      "वैदिक मार्गदर्शन • संस्कार • शास्त्रीय अध्ययन",

    image:
      "assets/acharyas/shreekant.jpg"
  },

  {
    id: "siddhant",

    name: "सिद्धांत मिश्रा",

    shortName: "सिद्धांत मिश्रा",

    qualification:
      "संस्कृत व्याकरण • शास्त्रीय भाषा • अध्ययन",

    image:
      null
  }

];


/* ================================
   GLOBAL VARIABLES
================================ */

let selectedAcharya = acharyas[0];

let sliderIndex = 0;

let userName =
  localStorage.getItem("nakshatraUserName") ||
  "Guest";


/* ================================
   BASIC HELPERS
================================ */

function $(id){

  return document.getElementById(id);

}


function showPage(pageName){

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove("active");

    });


  const page =
    $(pageName + "Page");


  if(page){

    page.classList.add("active");

  }


  closeMenu();


  window.scrollTo({

    top:0,

    behavior:"smooth"

  });

}


/* ================================
   LANGUAGE
================================ */

document
  .querySelectorAll(".language")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".language")
          .forEach(btn =>
            btn.classList.remove("active")
          );


        button.classList.add("active");

      }
    );

  });


$("continueBtn").addEventListener(
  "click",
  () => {

    $("languageScreen")
      .classList.add("hidden");


    $("loginScreen")
      .classList.remove("hidden");

  }
);


/* ================================
   LOGIN
================================ */

$("loginBtn").addEventListener(
  "click",
  () => {

    const name =
      $("userName")
        .value
        .trim();


    userName =
      name || "Guest";


    localStorage.setItem(
      "nakshatraUserName",
      userName
    );


    openApp();

  }
);


$("guestBtn").addEventListener(
  "click",
  () => {

    userName = "Guest";

    openApp();

  }
);


/* ================================
   OPEN APP
================================ */

function openApp(){

  $("languageScreen")
    .classList.add("hidden");

  $("loginScreen")
    .classList.add("hidden");

  $("app")
    .classList
    .remove("hidden");


  updateProfile();

  renderAcharyas();

  renderMessages();

  renderCalls();

  startSlider();

  showPage("home");

}


/* ================================
   PROFILE
================================ */

function updateProfile(){

  $("profileName")
    .textContent =
    userName;


  const letter =
    userName
      .charAt(0)
      .toUpperCase();


  $("profileBtn")
    .textContent =
    letter;


  $("bigProfile")
    .textContent =
    letter;

}


/* ================================
   ACHARYA LIST
================================ */

function renderAcharyas(){

  const list =
    $("acharyaList");


  const full =
    $("acharyaFull");


  list.innerHTML = "";

  full.innerHTML = "";


  acharyas.forEach(
    acharya => {


      /* IMAGE */

      let image;


      if(acharya.image){

        image = `
          <img
            src="${acharya.image}"
            alt="${acharya.name}"
          >
        `;

      }

      else{

        image = `
          <div
            style="
              width:82px;
              height:82px;
              border-radius:16px;
              background:#e7bc62;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:30px;
            "
          >
            सि
          </div>
        `;

      }


      /* HOME CARD */

      list.innerHTML += `

        <div class="acharya-card">

          ${image}

          <div class="acharya-info">

            <h3>
              ${acharya.name}
            </h3>

            <p>
              ${acharya.qualification}
            </p>

            <span class="online">
              ● Online
            </span>

          </div>


          <div class="acharya-actions">

            <button
              class="small-btn"
              onclick="
                openChat('${acharya.id}')
              "
            >
              💬
            </button>

            <button
              class="small-btn"
              onclick="
                videoCall('${acharya.id}')
              "
            >
              ▣
            </button>

            <button
              class="small-btn"
              onclick="
                audioCall('${acharya.id}')
              "
            >
              ☎
            </button>

          </div>

        </div>

      `;


      /* FULL ACHARYA */

      full.innerHTML += `

        <div class="acharya-card">

          ${image}

          <div class="acharya-info">

            <h3>
              ${acharya.name}
            </h3>

            <p>
              ${acharya.qualification}
            </p>

            <p>
              योग्यता, अनुभव और विशेषज्ञता
              की जानकारी यहाँ आगे जोड़ी जाएगी।
            </p>

            <span class="online">
              ● Online
            </span>

            <div
              class="acharya-actions"
              style="margin-top:10px"
            >

              <button
                class="main-btn"
                onclick="
                  openChat('${acharya.id}')
                "
              >
                💬 संदेश
              </button>

              <button
                class="small-btn"
                onclick="
                  videoCall('${acharya.id}')
                "
              >
                ▣ वीडियो
              </button>

              <button
                class="small-btn"
                onclick="
                  audioCall('${acharya.id}')
                "
              >
                ☎ ऑडियो
              </button>

            </div>

          </div>

        </div>

      `;

    }
  );

}


/* ================================
   MESSAGE LIST
================================ */

function renderMessages(){

  const list =
    $("messageList");


  list.innerHTML = "";


  acharyas.forEach(
    acharya => {


      let photo;


      if(acharya.image){

        photo = `
          <img
            src="${acharya.image}"
            alt=""
          >
        `;

      }

      else{

        photo = `
          <div
            style="
              width:60px;
              height:60px;
              border-radius:14px;
              background:#e7bc62;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:25px;
            "
          >
            सि
          </div>
        `;

      }


      list.innerHTML += `

        <button
          class="message-card"
          onclick="
            openChat('${acharya.id}')
          "
        >

          ${photo}

          <div>

            <strong>
              ${acharya.name}
            </strong>

            <small>
              ● Online • संदेश भेजें
            </small>

          </div>

          <span>
            ›
          </span>

        </button>

      `;

    }
  );

}


/* ================================
   CALL LIST
================================ */

function renderCalls(){

  const list =
    $("callList");


  list.innerHTML = "";


  acharyas.forEach(
    acharya => {

      list.innerHTML += `

        <div class="call-person">

          ${
            acharya.image
            ?
            `<img src="${acharya.image}">`
            :
            `<div
              style="
                width:55px;
                height:55px;
                border-radius:13px;
                background:#e7bc62;
                display:flex;
                align-items:center;
                justify-content:center;
              "
            >सि</div>`
          }


          <div>

            <strong>
              ${acharya.name}
            </strong>

            <small>
              ● Online
            </small>

          </div>


          <button
            class="small-btn"
            onclick="
              audioCall('${acharya.id}')
            "
          >
            ☎
          </button>


          <button
            class="small-btn"
            onclick="
              videoCall('${acharya.id}')
            "
          >
            ▣
          </button>

        </div>

      `;

    }
  );

}


/* ================================
   CHAT
================================ */

function openChat(id){

  selectedAcharya =
    acharyas.find(
      person =>
        person.id === id
    );


  if(!selectedAcharya){

    selectedAcharya =
      acharyas[0];

  }


  $("chatName")
    .textContent =
    selectedAcharya.name;


  $("chatAvatar")
    .textContent =
    selectedAcharya.shortName
      .charAt(0);


  $("chatMessages").innerHTML = `

    <p class="empty-chat">
      ${selectedAcharya.name}
      से बातचीत शुरू करें।
    </p>

  `;


  $("chatModal")
    .classList
    .add("show");

}


$("sendBtn").addEventListener(
  "click",
  sendMessage
);


$("messageInput").addEventListener(
  "keydown",
  event => {

    if(event.key === "Enter"){

      sendMessage();

    }

  }
);


function sendMessage(){

  const input =
    $("messageInput");


  const text =
    input.value.trim();


  if(!text){

    return;

  }


  const box =
    $("chatMessages");


  const empty =
    box.querySelector(
      ".empty-chat"
    );


  if(empty){

    empty.remove();

  }


  const message =
    document.createElement(
      "div"
    );


  message.className =
    "bubble mine";


  message.textContent =
    text;


  box.appendChild(
    message
  );


  input.value = "";


  box.scrollTop =
    box.scrollHeight;

}


/* ================================
   AUDIO / VIDEO
================================ */

function audioCall(id){

  const person =
    acharyas.find(
      a => a.id === id
    );


  alert(
    "ऑडियो कॉल UI तैयार है।\n\n" +
    person.name +
    "\n\n" +
    "वास्तविक फोन/ऑडियो कॉल सेवा अगले चरण में जोड़ी जाएगी।"
  );

}


function videoCall(id){

  const person =
    acharyas.find(
      a => a.id === id
    );


  alert(
    "वीडियो कॉल UI तैयार है।\n\n" +
    person.name +
    "\n\n" +
    "वास्तविक वीडियो कॉल सेवा अगले चरण में जोड़ी जाएगी।"
  );

}


/* ================================
   HERO SLIDER
   5 SECOND
================================ */

function startSlider(){

  const hero =
    $("heroSlider");


  const dots =
    $("sliderDots");


  const slides = [

    {
      image:
        "assets/acharyas/shudhanshu.jpg"
    },

    {
      image:
        "assets/acharyas/shreekant.jpg"
    },

    {
      image:
        null
    }

  ];


  function changeSlide(){

    const slide =
      slides[sliderIndex];


    if(slide.image){

      hero.style.backgroundImage =
        `
        url("${slide.image}")
        `;

    }

    else{

      hero.style.backgroundImage =
        `
        linear-gradient(
          120deg,
          #fff8e8,
          #ead5aa
        )
        `;

    }


    dots.innerHTML = "";


    slides.forEach(
      (_,index) => {

        const dot =
          document.createElement(
            "span"
          );


        dot.className =
          "dot";


        if(index === sliderIndex){

          dot.classList
            .add("active");

        }


        dots.appendChild(
          dot
        );

      }
    );


    sliderIndex++;


    if(
      sliderIndex >=
      slides.length
    ){

      sliderIndex = 0;

    }

  }


  changeSlide();


  clearInterval(
    window.sliderTimer
  );


  window.sliderTimer =
    setInterval(
      changeSlide,
      5000
    );

}


/* ================================
   MENU
================================ */

$("menuBtn").addEventListener(
  "click",
  () => {

    $("sideMenu")
      .classList
      .add("open");

    $("overlay")
      .classList
      .add("show");

  }
);


$("closeMenu").addEventListener(
  "click",
  closeMenu
);


$("overlay").addEventListener(
  "click",
  closeMenu
);


function closeMenu(){

  $("sideMenu")
    .classList
    .remove("open");


  $("overlay")
    .classList
    .remove("show");

}


/* ================================
   NAVIGATION
================================ */

document.addEventListener(
  "click",
  event => {


    const button =
      event.target.closest(
        "[data-page]"
      );


    if(!button){

      return;

    }


    showPage(
      button.dataset.page
    );

  }
);


/* ================================
   TOP BUTTONS
================================ */

$("profileBtn").addEventListener(
  "click",
  () => {

    showPage("profile");

  }
);


$("talkBtn").addEventListener(
  "click",
  () => {

    openChat(
      "shudhanshu"
    );

  }
);


$("callButton").addEventListener(
  "click",
  () => {

    $("callModal")
      .classList
      .add("show");

  }
);


/* ================================
   CLOSE MODALS
================================ */

document
  .querySelectorAll(".closeModal")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        button
          .closest(".modal")
          .classList
          .remove("show");

      }
    );

  });


document
  .querySelectorAll(".modal")
  .forEach(modal => {

    modal.addEventListener(
      "click",
      event => {

        if(
          event.target ===
          modal
        ){

          modal
            .classList
            .remove("show");

        }

      }
    );

  });


/* ================================
   START
================================ */

window.addEventListener(
  "load",
  () => {

    console.log(
      "Nakshatra Jyoti loaded successfully."
    );

  }
);
