/* =====================================================
   NAKSHATRA JYOTI
   Firebase + App JavaScript
===================================================== */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


/* =====================================================
   FIREBASE CONFIG
===================================================== */

const firebaseConfig = {

  apiKey: "AIzaSyDRnf2BBo6KnjXCfXAaBvq58SDZ7cuVB9w",

  authDomain:
    "nakshatra-jyoti.firebaseapp.com",

  projectId:
    "nakshatra-jyoti",

  storageBucket:
    "nakshatra-jyoti.firebasestorage.app",

  messagingSenderId:
    "8014602515",

  appId:
    "1:8014602515:web:848b96e6932d9070a53ae6",

  measurementId:
    "G-BYK2GJFDJ3"
};


/* =====================================================
   INITIALIZE FIREBASE
===================================================== */

const firebaseApp =
  initializeApp(firebaseConfig);

const auth =
  getAuth(firebaseApp);


/* =====================================================
   HELPERS
===================================================== */

const $ = (id) =>
  document.getElementById(id);


const show = (element) => {

  if (element) {
    element.classList.remove("hidden");
  }

};


const hide = (element) => {

  if (element) {
    element.classList.add("hidden");
  }

};


/* =====================================================
   SCREENS
===================================================== */

const languageScreen =
  $("languageScreen");

const loginScreen =
  $("loginScreen");

const mainApp =
  $("mainApp");


function showLogin(){

  hide(languageScreen);

  show(loginScreen);

  hide(mainApp);

}


function showApp(){

  hide(languageScreen);

  hide(loginScreen);

  show(mainApp);

}


/* =====================================================
   LANGUAGE
===================================================== */

let selectedLanguage =
  localStorage.getItem("language") || "hi";


document
  .querySelectorAll(".language")
  .forEach(button => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".language")
        .forEach(item =>
          item.classList.remove("active")
        );

      button.classList.add("active");

      selectedLanguage =
        button.dataset.lang;

    });

  });


$("languageContinue")
  ?.addEventListener("click", () => {

    localStorage.setItem(
      "language",
      selectedLanguage
    );

    showLogin();

  });


/* =====================================================
   FIREBASE AUTH STATE
===================================================== */

onAuthStateChanged(
  auth,
  user => {

    if (user) {

      console.log(
        "Logged in:",
        user.email
      );

      showApp();

      updateUserUI(user);

    } else {

      showLogin();

    }

  }
);


/* =====================================================
   LOGIN
===================================================== */

$("loginButton")
  ?.addEventListener("click", async () => {

    const email =
      $("loginEmail").value.trim();

    const password =
      $("loginPassword").value;


    if (!email || !password) {

      showError(
        "कृपया ईमेल और पासवर्ड भरें।"
      );

      return;

    }


    try {

      setLoginLoading(true);

      const result =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );


      console.log(
        "Login successful:",
        result.user
      );


      $("loginError").textContent = "";


    } catch (error) {

      console.error(error);

      showError(
        getFirebaseError(error)
      );

    } finally {

      setLoginLoading(false);

    }

  });


/* =====================================================
   REGISTER
===================================================== */

$("registerButton")
  ?.addEventListener("click", async () => {

    const email =
      $("loginEmail").value.trim();

    const password =
      $("loginPassword").value;


    if (!email || !password) {

      showError(
        "पहले ईमेल और पासवर्ड भरें।"
      );

      return;

    }


    if (password.length < 6) {

      showError(
        "पासवर्ड कम से कम 6 characters का रखें।"
      );

      return;

    }


    try {

      setLoginLoading(true);


      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );


      await updateProfile(
        result.user,
        {
          displayName:
            email.split("@")[0]
        }
      );


      $("loginError").textContent = "";


      alert(
        "अकाउंट सफलतापूर्वक बन गया।"
      );


    } catch (error) {

      console.error(error);

      showError(
        getFirebaseError(error)
      );

    } finally {

      setLoginLoading(false);

    }

  });


/* =====================================================
   LOGIN ERROR
===================================================== */

function showError(message){

  const errorBox =
    $("loginError");

  if (errorBox) {

    errorBox.textContent =
      message;

  }

}


function getFirebaseError(error){

  switch(error.code){

    case "auth/invalid-email":
      return "ईमेल सही नहीं है।";

    case "auth/invalid-credential":
      return "ईमेल या पासवर्ड गलत है।";

    case "auth/email-already-in-use":
      return "यह ईमेल पहले से registered है।";

    case "auth/weak-password":
      return "पासवर्ड बहुत कमजोर है।";

    case "auth/user-not-found":
      return "यह अकाउंट नहीं मिला।";

    case "auth/wrong-password":
      return "पासवर्ड गलत है।";

    case "auth/too-many-requests":
      return "बहुत ज्यादा प्रयास हुए हैं। थोड़ी देर बाद कोशिश करें।";

    default:
      return "कुछ समस्या हुई। फिर से कोशिश करें।";

  }

}


/* =====================================================
   LOGIN BUTTON LOADING
===================================================== */

function setLoginLoading(loading){

  const button =
    $("loginButton");

  if (!button) return;


  if (loading){

    button.disabled = true;

    button.textContent =
      "कृपया प्रतीक्षा करें...";

  } else {

    button.disabled = false;

    button.textContent =
      "लॉगिन करें";

  }

}


/* =====================================================
   USER UI
===================================================== */

function updateUserUI(user){

  const name =
    user.displayName ||
    user.email?.split("@")[0] ||
    "User";


  const letter =
    name
      .charAt(0)
      .toUpperCase();


  if ($("profileLetter")){

    $("profileLetter")
      .textContent = letter;

  }


  if ($("bigProfileLetter")){

    $("bigProfileLetter")
      .textContent = letter;

  }


  if ($("accountName")){

    $("accountName")
      .textContent = name;

  }


  if ($("accountEmail")){

    $("accountEmail")
      .textContent =
        user.email || "";

  }

}


/* =====================================================
   LOGOUT
===================================================== */

$("logoutButton")
  ?.addEventListener("click", async () => {

    try {

      await signOut(auth);

      console.log(
        "User logged out"
      );

    } catch(error){

      console.error(error);

    }

  });


/* =====================================================
   SIDE MENU
===================================================== */

const sideMenu =
  $("sideMenu");

const menuOverlay =
  $("menuOverlay");


function openMenu(){

  sideMenu?.classList.add("open");

  menuOverlay?.classList.add("show");

}


function closeMenu(){

  sideMenu?.classList.remove("open");

  menuOverlay?.classList.remove("show");

}


$("menuButton")
  ?.addEventListener(
    "click",
    openMenu
  );


$("closeMenu")
  ?.addEventListener(
    "click",
    closeMenu
  );


menuOverlay
  ?.addEventListener(
    "click",
    closeMenu
  );


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function openPage(pageName){

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove("active");

    });


  const page =
    document.getElementById(
      pageName + "Page"
    );


  if (page){

    page.classList.add("active");

  }


  document
    .querySelectorAll(
      ".bottom-nav button"
    )
    .forEach(button => {

      button.classList.remove(
        "nav-active"
      );

    });


  document
    .querySelectorAll(
      `[data-page="${pageName}"]`
    )
    .forEach(button => {

      button.classList.add(
        "nav-active"
      );

    });


  closeMenu();


  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

}


/* =====================================================
   ALL PAGE BUTTONS
===================================================== */

document
  .querySelectorAll("[data-page]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const page =
          button.dataset.page;

        openPage(page);

      }
    );

  });


/* =====================================================
   ACCOUNT BUTTON
===================================================== */

$("accountButton")
  ?.addEventListener(
    "click",
    () => {

      openPage("account");

    }
  );


/* =====================================================
   POSTER SLIDER
===================================================== */

const posters =
  document.querySelectorAll(
    ".poster"
  );

const posterDots =
  $("posterDots");


let currentPoster = 0;


function createPosterDots(){

  if (!posterDots) return;

  posterDots.innerHTML = "";


  posters.forEach(
    (_, index) => {

      const dot =
        document.createElement(
          "span"
        );

      dot.className =
        "poster-dot";


      if (index === 0){

        dot.classList.add(
          "active"
        );

      }


      dot.addEventListener(
        "click",
        () => {

          showPoster(index);

        }
      );


      posterDots.appendChild(
        dot
      );

    }
  );

}


function showPoster(index){

  if (!posters.length)
    return;


  currentPoster = index;


  posters.forEach(
    (poster, i) => {

      poster.classList.toggle(
        "active",
        i === index
      );

    }
  );


  document
    .querySelectorAll(
      ".poster-dot"
    )
    .forEach(
      (dot, i) => {

        dot.classList.toggle(
          "active",
          i === index
        );

      }
    );

}


createPosterDots();


if (posters.length > 1){

  setInterval(
    () => {

      currentPoster++;

      if (
        currentPoster >=
        posters.length
      ){

        currentPoster = 0;

      }

      showPoster(
        currentPoster
      );

    },
    5000
  );

}


/* =====================================================
   SERVICE CARDS
===================================================== */

document
  .querySelectorAll(
    ".service-card"
  )
  .forEach(card => {

    card.addEventListener(
      "click",
      () => {

        const service =
          card.dataset.service;

        console.log(
          "Selected service:",
          service
        );

        alert(
          "जल्द ही इस सेवा का पूरा सिस्टम यहाँ आएगा।"
        );

      }
    );

  });


/* =====================================================
   AI CHAT UI
===================================================== */

const aiInput =
  $("aiInput");

const aiSend =
  $("aiSend");

const aiMessages =
  $("aiMessages");


function addMessage(
  text,
  type
){

  if (!aiMessages)
    return;


  const message =
    document.createElement(
      "div"
    );


  message.textContent =
    text;


  message.style.marginBottom =
    "12px";


  message.style.padding =
    "12px 16px";


  message.style.borderRadius =
    "14px";


  message.style.maxWidth =
    "80%";


  if (type === "user"){

    message.style.marginLeft =
      "auto";

    message.style.background =
      "#e8c16a";

  } else {

    message.style.background =
      "white";

    message.style.border =
      "1px solid #e7ddcc";

  }


  aiMessages.appendChild(
    message
  );


  aiMessages.scrollTop =
    aiMessages.scrollHeight;

}


function sendAIMessage(){

  const text =
    aiInput?.value.trim();


  if (!text)
    return;


  addMessage(
    text,
    "user"
  );


  aiInput.value = "";


  setTimeout(
    () => {

      addMessage(
        "आपका प्रश्न प्राप्त हुआ। AI प्रणाली जोड़ने के बाद यहाँ वास्तविक उत्तर आएगा।",
        "ai"
      );

    },
    500
  );

}


aiSend?.addEventListener(
  "click",
  sendAIMessage
);


aiInput?.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ){

      sendAIMessage();

    }

  }
);


/* =====================================================
   DARK / LIGHT THEME
===================================================== */

$("themeSetting")
  ?.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "dark"
      );


      const isDark =
        document.body.classList.contains(
          "dark"
        );


      localStorage.setItem(
        "theme",
        isDark
          ? "dark"
          : "light"
      );

    }
  );


const savedTheme =
  localStorage.getItem(
    "theme"
  );


if (savedTheme === "dark"){

  document.body.classList.add(
    "dark"
  );

}


/* =====================================================
   LANGUAGE SETTING
===================================================== */

$("languageSetting")
  ?.addEventListener(
    "click",
    () => {

      hide(mainApp);

      show(languageScreen);

    }
  );


console.log(
  "Nakshatra Jyoti JS loaded successfully."
);

console.log(
  "Firebase Authentication initialized."
);
