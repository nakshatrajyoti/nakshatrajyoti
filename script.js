/* =========================================================
   NAKSHATRA JYOTI
   COMPLETE APP JAVASCRIPT
========================================================= */


/* =========================================================
   FIREBASE IMPORT
========================================================= */

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


/* =========================================================
   FIREBASE CONFIG
   आपके Firebase Project का config
========================================================= */

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRNf2BBo6KnjXCfXAaBvq58SDZ7cuVB9w",
  authDomain: "nakshatra-jyoti.firebaseapp.com",
  projectId: "nakshatra-jyoti",
  storageBucket: "nakshatra-jyoti.firebasestorage.app",
  messagingSenderId: "8014602515",
  appId: "1:8014602515:web:848b96e6932d9070a53ae6",
  measurementId: "G-BYK2GJFJD3"
};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

const firebaseApp =
  initializeApp(firebaseConfig);

const auth =
  getAuth(firebaseApp);


/* =========================================================
   SHORT SELECTOR
========================================================= */

const $ = (id) =>
  document.getElementById(id);


/* =========================================================
   SHOW / HIDE
========================================================= */

function show(element) {

  if (element) {

    element.classList.remove(
      "hidden"
    );

  }

}


function hide(element) {

  if (element) {

    element.classList.add(
      "hidden"
    );

  }

}


/* =========================================================
   MAIN SCREENS
========================================================= */

const languageScreen =
  $("languageScreen");

const loginScreen =
  $("loginScreen");

const mainApp =
  $("mainApp");


function showLanguage() {

  show(languageScreen);

  hide(loginScreen);

  hide(mainApp);

}


function showLogin() {

  hide(languageScreen);

  show(loginScreen);

  hide(mainApp);

}


function showMainApp() {

  hide(languageScreen);

  hide(loginScreen);

  show(mainApp);

}


/* =========================================================
   LANGUAGE SYSTEM
========================================================= */

let selectedLanguage =
  localStorage.getItem(
    "language"
  ) || "hi";


document
  .querySelectorAll(
    ".language"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".language"
          )
          .forEach(item => {

            item.classList.remove(
              "active"
            );

          });


        button.classList.add(
          "active"
        );


        selectedLanguage =
          button.dataset.lang;


        localStorage.setItem(
          "language",
          selectedLanguage
        );

      }
    );

  });


/* =========================================================
   LANGUAGE CONTINUE
========================================================= */

$("languageContinue")
  ?.addEventListener(
    "click",
    () => {

      localStorage.setItem(
        "language",
        selectedLanguage
      );


      showLogin();

    }
  );


/* =========================================================
   LOGIN ERROR
========================================================= */

function showLoginError(
  message
) {

  const box =
    $("loginError");


  if (box) {

    box.textContent =
      message;

  }

}


/* =========================================================
   FIREBASE ERROR TRANSLATION
========================================================= */

function firebaseError(
  error
) {

  console.error(
    "Firebase Error:",
    error
  );


  switch (
    error.code
  ) {

    case "auth/invalid-email":

      return "ईमेल पता सही नहीं है।";


    case "auth/invalid-credential":

      return "ईमेल या पासवर्ड गलत है।";


    case "auth/email-already-in-use":

      return "यह ईमेल पहले से मौजूद है।";


    case "auth/weak-password":

      return "पासवर्ड कम से कम 6 अक्षरों का रखें।";


    case "auth/operation-not-allowed":

      return "Firebase में Email/Password Login अभी चालू नहीं है।";


    case "auth/network-request-failed":

      return "Internet connection की समस्या है।";


    case "auth/user-disabled":

      return "यह account disable किया गया है।";


    case "auth/too-many-requests":

      return "बहुत ज्यादा प्रयास हुए हैं। थोड़ी देर बाद कोशिश करें।";


    default:

      return (
        "Login में समस्या: " +
        error.code
      );

  }

}


/* =========================================================
   LOGIN
========================================================= */

$("loginButton")
  ?.addEventListener(
    "click",
    async () => {

      const email =
        $("loginEmail")
          ?.value
          .trim();


      const password =
        $("loginPassword")
          ?.value;


      if (!email) {

        showLoginError(
          "कृपया Email डालें।"
        );

        return;

      }


      if (!password) {

        showLoginError(
          "कृपया Password डालें।"
        );

        return;

      }


      const button =
        $("loginButton");


      button.disabled =
        true;


      button.textContent =
        "Login हो रहा है...";


      try {

        const result =
          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );


        console.log(
          "LOGIN SUCCESS",
          result.user
        );


        showLoginError(
          ""
        );


      }

      catch (error) {

        showLoginError(
          firebaseError(
            error
          )
        );

      }

      finally {

        button.disabled =
          false;


        button.textContent =
          "लॉगिन करें";

      }

    }
  );


/* =========================================================
   CREATE NEW USER
========================================================= */

$("registerButton")
  ?.addEventListener(
    "click",
    async () => {

      const email =
        $("loginEmail")
          ?.value
          .trim();


      const password =
        $("loginPassword")
          ?.value;


      if (!email) {

        showLoginError(
          "नया account बनाने के लिए Email डालें।"
        );

        return;

      }


      if (!password) {

        showLoginError(
          "नया Password डालें।"
        );

        return;

      }


      if (
        password.length < 6
      ) {

        showLoginError(
          "Password कम से कम 6 characters का होना चाहिए।"
        );

        return;

      }


      const button =
        $("registerButton");


      button.disabled =
        true;


      button.textContent =
        "Account बन रहा है...";


      try {

        const result =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );


        /*
          Firebase account बनने के बाद
          user automatically signed-in होता है।
        */


        const username =
          email
            .split("@")[0];


        await updateProfile(
          result.user,
          {
            displayName:
              username
          }
        );


        console.log(
          "NEW USER CREATED",
          result.user
        );


        showLoginError(
          ""
        );


        /*
          Auth observer automatically
          Main App खोल देगा।
        */

      }

      catch (error) {

        showLoginError(
          firebaseError(
            error
          )
        );

      }

      finally {

        button.disabled =
          false;


        button.textContent =
          "नया अकाउंट बनाएँ";

      }

    }
  );


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      console.log(
        "USER LOGGED IN:",
        user.email
      );


      showMainApp();


      updateUserUI(
        user
      );


      openPage(
        "home"
      );

    }

    else {

      /*
        अगर user login नहीं है
        तो Login screen दिखेगी।
      */

      showLogin();

    }

  }
);


/* =========================================================
   USER INFORMATION
========================================================= */

function updateUserUI(
  user
) {

  const name =
    user.displayName ||
    user.email
      ?.split("@")[0] ||
    "User";


  const letter =
    name
      .charAt(0)
      .toUpperCase();


  if (
    $("profileLetter")
  ) {

    $("profileLetter")
      .textContent =
      letter;

  }


  if (
    $("bigProfileLetter")
  ) {

    $("bigProfileLetter")
      .textContent =
      letter;

  }


  if (
    $("accountName")
  ) {

    $("accountName")
      .textContent =
      name;

  }


  if (
    $("accountEmail")
  ) {

    $("accountEmail")
      .textContent =
      user.email || "";

  }

}


/* =========================================================
   LOGOUT
========================================================= */

$("logoutButton")
  ?.addEventListener(
    "click",
    async () => {

      try {

        await signOut(
          auth
        );

      }

      catch (error) {

        console.error(
          error
        );

      }

    }
  );


/* =========================================================
   SIDE MENU
========================================================= */

const sideMenu =
  $("sideMenu");

const menuOverlay =
  $("menuOverlay");


function openMenu() {

  sideMenu
    ?.classList
    .add("open");

  menuOverlay
    ?.classList
    .add("show");

}


function closeMenu() {

  sideMenu
    ?.classList
    .remove("open");

  menuOverlay
    ?.classList
    .remove("show");

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


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function openPage(
  pageName
) {

  document
    .querySelectorAll(
      ".page"
    )
    .forEach(page => {

      page.classList.remove(
        "active"
      );

    });


  const page =
    document.getElementById(
      pageName + "Page"
    );


  if (page) {

    page.classList.add(
      "active"
    );

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
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   PAGE BUTTONS
========================================================= */

document
  .querySelectorAll(
    "[data-page]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        openPage(
          button.dataset.page
        );

      }
    );

  });


/* =========================================================
   ACCOUNT
========================================================= */

$("accountButton")
  ?.addEventListener(
    "click",
    () => {

      openPage(
        "account"
      );

    }
  );


/* =========================================================
   LANGUAGE FROM ACCOUNT
========================================================= */

$("languageSetting")
  ?.addEventListener(
    "click",
    () => {

      showLanguage();

    }
  );


/* =========================================================
   THEME
========================================================= */

function applyTheme(
  theme
) {

  if (
    theme === "dark"
  ) {

    document.body
      .classList
      .add("dark");

  }

  else {

    document.body
      .classList
      .remove("dark");

  }

}


const savedTheme =
  localStorage.getItem(
    "theme"
  ) || "light";


applyTheme(
  savedTheme
);


$("themeSetting")
  ?.addEventListener(
    "click",
    () => {

      const isDark =
        document.body
          .classList
          .contains("dark");


      const newTheme =
        isDark
          ? "light"
          : "dark";


      localStorage.setItem(
        "theme",
        newTheme
      );


      applyTheme(
        newTheme
      );

    }
  );


/* =========================================================
   DAILY POSTER SETTINGS
========================================================= */

/*
   5000  = 5 seconds
   10000 = 10 seconds
   15000 = 15 seconds

   0 = automatic slideshow OFF
*/

const POSTER_INTERVAL =
  5000;


/*
   अगर false करेंगे तो
   poster अपने-आप नहीं बदलेगा।
*/

const POSTER_AUTO_PLAY =
  true;


/* =========================================================
   POSTER SLIDER
========================================================= */

const posters =
  document.querySelectorAll(
    ".poster"
  );


const posterDots =
  $("posterDots");


let currentPoster =
  0;


function createPosterDots() {

  if (
    !posterDots
  ) return;


  posterDots.innerHTML =
    "";


  posters.forEach(
    (_, index) => {

      const dot =
        document.createElement(
          "span"
        );


      dot.className =
        "poster-dot";


      if (
        index === 0
      ) {

        dot.classList.add(
          "active"
        );

      }


      dot.addEventListener(
        "click",
        () => {

          showPoster(
            index
          );

        }
      );


      posterDots.appendChild(
        dot
      );

    }
  );

}


function showPoster(
  index
) {

  if (
    !posters.length
  ) return;


  currentPoster =
    index;


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


if (
  posters.length > 0 &&
  POSTER_AUTO_PLAY &&
  POSTER_INTERVAL > 0
) {

  setInterval(
    () => {

      currentPoster++;


      if (
        currentPoster >=
        posters.length
      ) {

        currentPoster =
          0;

      }


      showPoster(
        currentPoster
      );

    },
    POSTER_INTERVAL
  );

}


/* =========================================================
   SERVICE CARDS
========================================================= */

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
          "SERVICE:",
          service
        );


        /*
          Career आदि के अलग full pages
          बाद में इसी navigation system
          में जोड़ेंगे।
        */

      }
    );

  });


/* =========================================================
   AI CHAT BASIC UI
========================================================= */

const aiInput =
  $("aiInput");

const aiSend =
  $("aiSend");

const aiMessages =
  $("aiMessages");


function addAIMessage(
  text,
  type
) {

  if (
    !aiMessages
  ) return;


  const message =
    document.createElement(
      "div"
    );


  message.textContent =
    text;


  message.style.padding =
    "12px 16px";


  message.style.marginBottom =
    "12px";


  message.style.borderRadius =
    "14px";


  message.style.maxWidth =
    "80%";


  if (
    type === "user"
  ) {

    message.style.marginLeft =
      "auto";

    message.style.background =
      "#e8c16a";

  }

  else {

    message.style.background =
      "white";

  }


  aiMessages.appendChild(
    message
  );


  aiMessages.scrollTop =
    aiMessages.scrollHeight;

}


function sendAIMessage() {

  if (
    !aiInput
  ) return;


  const text =
    aiInput.value.trim();


  if (!text)
    return;


  addAIMessage(
    text,
    "user"
  );


  aiInput.value =
    "";


  setTimeout(
    () => {

      addAIMessage(
        "AI प्रणाली अभी जोड़ी जा रही है।",
        "ai"
      );

    },
    400
  );

}


aiSend
  ?.addEventListener(
    "click",
    sendAIMessage
  );


aiInput
  ?.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        sendAIMessage();

      }

    }
  );


/* =========================================================
   INITIAL SCREEN
========================================================= */

/*
   अगर Firebase में user already logged-in है,
   onAuthStateChanged Main App खोलेगा।

   अगर user logged-out है,
   Login screen खुलेगी।

   पहली बार language select नहीं हुई है,
   तो Language screen खुलेगी।
*/

const savedLanguage =
  localStorage.getItem(
    "language"
  );


if (
  savedLanguage
) {

  showLogin();

}

else {

  showLanguage();

}


/* =========================================================
   DONE
========================================================= */

console.log(
  "✨ Nakshatra Jyoti loaded successfully."
);

console.log(
  "🔥 Firebase Authentication initialized."
);
