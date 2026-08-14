/* =====================================================
   NAKSHATRA JYOTI
   MAIN JAVASCRIPT
===================================================== */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


/* =====================================================
   HELPERS
===================================================== */

const $ = (id) =>
  document.getElementById(id);


const show = (el) => {

  if (el) {
    el.classList.remove("hidden");
  }

};


const hide = (el) => {

  if (el) {
    el.classList.add("hidden");
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


function showApp() {

  hide(languageScreen);

  hide(loginScreen);

  show(mainApp);

}


/* =====================================================
   LANGUAGE
===================================================== */

let selectedLanguage =
  localStorage.getItem("language") || null;


document
  .querySelectorAll(".language")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".language")
          .forEach(item => {

            item.classList.remove("active");

          });


        button.classList.add("active");


        selectedLanguage =
          button.dataset.lang;

      }
    );

  });


$("languageContinue")
  ?.addEventListener(
    "click",
    () => {

      if (!selectedLanguage) {

        selectedLanguage = "hi";

      }


      localStorage.setItem(
        "language",
        selectedLanguage
      );


      showLogin();

    }
  );


/* =====================================================
   FIREBASE CONFIG
===================================================== */

/*
   यह CONFIG Firebase Console के
   Web App configuration से लिया गया है।

   अगर Firebase Console में apiKey बदल चुका है,
   तो केवल नीचे का firebaseConfig
   Firebase Console वाला नया config रखें।
*/

const firebaseConfig = {

  apiKey:
    "AIzaSyDRnf2BBo6KnjXCfXAaBvq58SDZ7cuVB9w",

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

let firebaseReady = false;

let auth = null;


try {

  const app =
    initializeApp(firebaseConfig);


  auth =
    getAuth(app);


  firebaseReady = true;


  console.log(
    "Firebase connected successfully."
  );


} catch (error) {

  console.error(
    "Firebase initialization error:",
    error
  );


  showLoginError(
    "Firebase connection में समस्या है। Console में error देखें।"
  );

}


/* =====================================================
   AUTH STATE
===================================================== */

if (firebaseReady) {

  onAuthStateChanged(
    auth,
    user => {

      if (user) {

        showApp();

        updateUserUI(user);

      } else {

        /*
           अगर login नहीं है,
           तो login screen पर रहें।
        */

        if (
          localStorage.getItem("language")
        ) {

          showLogin();

        } else {

          showLanguage();

        }

      }

    }
  );

}


/* =====================================================
   LOGIN
===================================================== */

$("loginButton")
  ?.addEventListener(
    "click",
    async () => {

      clearLoginError();


      if (!firebaseReady) {

        showLoginError(
          "Firebase अभी connect नहीं हुआ है।"
        );

        return;

      }


      const email =
        $("loginEmail")
          ?.value
          .trim();


      const password =
        $("loginPassword")
          ?.value;


      if (!email || !password) {

        showLoginError(
          "ईमेल और पासवर्ड भरें।"
        );

        return;

      }


      try {

        setLoginLoading(true);


        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );


        console.log(
          "Login successful."
        );


      } catch (error) {

        console.error(
          "Login error:",
          error
        );


        showLoginError(
          firebaseErrorMessage(error)
        );


      } finally {

        setLoginLoading(false);

      }

    }
  );


/* =====================================================
   REGISTER
===================================================== */

$("registerButton")
  ?.addEventListener(
    "click",
    async () => {

      clearLoginError();


      if (!firebaseReady) {

        showLoginError(
          "Firebase अभी connect नहीं हुआ है।"
        );

        return;

      }


      const email =
        $("loginEmail")
          ?.value
          .trim();


      const password =
        $("loginPassword")
          ?.value;


      if (!email || !password) {

        showLoginError(
          "नया अकाउंट बनाने के लिए ईमेल और पासवर्ड भरें।"
        );

        return;

      }


      if (password.length < 6) {

        showLoginError(
          "पासवर्ड कम से कम 6 characters का होना चाहिए।"
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


        const username =
          email
            .split("@")[0]
            .trim();


        await updateProfile(
          result.user,
          {
            displayName: username
          }
        );


        console.log(
          "New user created."
        );


      } catch (error) {

        console.error(
          "Registration error:",
          error
        );


        showLoginError(
          firebaseErrorMessage(error)
        );


      } finally {

        setLoginLoading(false);

      }

    }
  );


/* =====================================================
   ERROR MESSAGE
===================================================== */

function showLoginError(message) {

  const box =
    $("loginError");


  if (box) {

    box.textContent =
      message;

  }

}


function clearLoginError() {

  const box =
    $("loginError");


  if (box) {

    box.textContent = "";

  }

}


/* =====================================================
   FIREBASE ERROR
===================================================== */

function firebaseErrorMessage(error) {

  switch (error.code) {

    case "auth/invalid-api-key":
      return "Firebase API key गलत है। Firebase Console से Web App का नया config डालें।";


    case "auth/api-key-not-valid":
      return "Firebase API key valid नहीं है। Firebase Console के Project Settings → Web App से config दोबारा copy करें।";


    case "auth/invalid-email":
      return "ईमेल सही format में नहीं है।";


    case "auth/invalid-credential":
      return "ईमेल या पासवर्ड गलत है।";


    case "auth/user-not-found":
      return "इस ईमेल से कोई account नहीं मिला। पहले नया अकाउंट बनाएँ।";


    case "auth/wrong-password":
      return "पासवर्ड गलत है।";


    case "auth/email-already-in-use":
      return "यह ईमेल पहले से registered है। Login करें।";


    case "auth/weak-password":
      return "पासवर्ड कम से कम 6 characters का रखें।";


    case "auth/too-many-requests":
      return "बहुत अधिक प्रयास हुए हैं। थोड़ी देर बाद कोशिश करें।";


    case "auth/network-request-failed":
      return "Internet connection check करें।";


    default:
      return
        "Login में समस्या: " +
        (error.message || error.code || "Unknown error");

  }

}


/* =====================================================
   LOGIN LOADING
===================================================== */

function setLoginLoading(loading) {

  const button =
    $("loginButton");


  if (!button) return;


  if (loading) {

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

function updateUserUI(user) {

  const name =
    user.displayName ||
    user.email?.split("@")[0] ||
    "User";


  const letter =
    name
      .charAt(0)
      .toUpperCase();


  if ($("profileLetter")) {

    $("profileLetter")
      .textContent =
      letter;

  }


  if ($("bigProfileLetter")) {

    $("bigProfileLetter")
      .textContent =
      letter;

  }


  if ($("accountName")) {

    $("accountName")
      .textContent =
      name;

  }


  if ($("accountEmail")) {

    $("accountEmail")
      .textContent =
      user.email || "";

  }

}


/* =====================================================
   LOGOUT
===================================================== */

$("logoutButton")
  ?.addEventListener(
    "click",
    async () => {

      if (!auth) return;


      try {

        await signOut(auth);

        showLogin();

      } catch (error) {

        console.error(
          "Logout error:",
          error
        );

      }

    }
  );


/* =====================================================
   SIDE MENU
===================================================== */

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


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function openPage(pageName) {

  document
    .querySelectorAll(".page")
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


document
  .querySelectorAll("[data-page]")
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


/* =====================================================
   ACCOUNT
===================================================== */

$("accountButton")
  ?.addEventListener(
    "click",
    () => {

      openPage("account");

    }
  );


/* =====================================================
   THEME
===================================================== */

$("themeSetting")
  ?.addEventListener(
    "click",
    () => {

      document.body
        .classList
        .toggle("dark");


      const dark =
        document.body
          .classList
          .contains("dark");


      localStorage.setItem(
        "theme",
        dark ? "dark" : "light"
      );

    }
  );


if (
  localStorage.getItem("theme")
  === "dark"
) {

  document.body
    .classList
    .add("dark");

}


/* =====================================================
   LANGUAGE SETTING
===================================================== */

$("languageSetting")
  ?.addEventListener(
    "click",
    () => {

      showLanguage();

    }
  );


/* =====================================================
   INITIAL SCREEN
===================================================== */

if (
  localStorage.getItem("language")
) {

  showLogin();

} else {

  showLanguage();

}


console.log(
  "Nakshatra Jyoti loaded successfully."
);
