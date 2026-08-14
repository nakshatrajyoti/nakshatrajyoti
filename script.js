/* =========================================================
   NAKSHATRA JYOTI
   FINAL SCRIPT
   Firebase Authentication + Language + App Navigation
========================================================= */


/* =========================================================
   BASIC HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const show = (el) => {
  if (el) el.classList.remove("hidden");
};

const hide = (el) => {
  if (el) el.classList.add("hidden");
};


/* =========================================================
   SCREENS
========================================================= */

const languageScreen = $("languageScreen");
const loginScreen = $("loginScreen");
const mainApp = $("mainApp");

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


/* =========================================================
   LANGUAGE
========================================================= */

let selectedLanguage =
  localStorage.getItem("language") || "hi";

document.querySelectorAll(".language").forEach((button) => {

  button.addEventListener("click", () => {

    document
      .querySelectorAll(".language")
      .forEach((item) => {
        item.classList.remove("active");
      });

    button.classList.add("active");

    selectedLanguage =
      button.dataset.lang || "hi";

  });

});


/* =========================================================
   LANGUAGE CONTINUE
========================================================= */

const languageContinue =
  $("languageContinue");

if (languageContinue) {

  languageContinue.addEventListener("click", () => {

    localStorage.setItem(
      "language",
      selectedLanguage
    );

    showLogin();

  });

}


/* =========================================================
   FIREBASE
========================================================= */

let firebaseAuth = null;
let firebaseAuthModule = null;

let firebaseReady = false;


/* YOUR FIREBASE CONFIG */

const firebaseConfig = {

  apiKey:
    "AIzaSyDRNf2BBo6KnjXCfXAaBvq58SDZ7cuVB9w",

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
    "G-BYK2GJFJD3"

};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

async function initializeFirebase() {

  try {

    console.log("Firebase starting...");


    const appModule =
      await import(
        "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js"
      );


    firebaseAuthModule =
      await import(
        "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js"
      );


    const app =
      appModule.initializeApp(
        firebaseConfig
      );


    firebaseAuth =
      firebaseAuthModule.getAuth(app);


    firebaseReady = true;


    console.log(
      "Firebase connected successfully."
    );


    /*
      Firebase login state
    */

    firebaseAuthModule.onAuthStateChanged(
      firebaseAuth,
      (user) => {

        if (user) {

          console.log(
            "User already logged in:",
            user.email
          );

          showApp();

          updateUserUI(user);

        } else {

          console.log(
            "No user logged in."
          );

        }

      }
    );


  } catch (error) {

    console.error(
      "Firebase initialization error:",
      error
    );

    firebaseReady = false;

    showError(
      "Firebase connect नहीं हो पाया। कृपया थोड़ी देर बाद फिर कोशिश करें।"
    );

  }

}


/* =========================================================
   REGISTER MODE
========================================================= */

let registerMode = false;


/*
   Username field dynamically बनाया जाएगा।
   इसलिए HTML में अलग से username input
   बनाने की जरूरत नहीं है।
*/

function createUsernameField() {

  if ($("registerUsername")) {
    return;
  }


  const emailInput =
    $("loginEmail");

  if (!emailInput) {
    return;
  }


  const username =
    document.createElement("input");


  username.id =
    "registerUsername";


  username.type =
    "text";


  username.placeholder =
    "यूज़रनेम";


  username.autocomplete =
    "username";


  username.className =
    emailInput.className;


  emailInput.parentNode.insertBefore(
    username,
    emailInput
  );

}


/* =========================================================
   REMOVE USERNAME FIELD
========================================================= */

function removeUsernameField() {

  const username =
    $("registerUsername");

  if (username) {
    username.remove();
  }

}


/* =========================================================
   CHANGE LOGIN / REGISTER MODE
========================================================= */

function setRegisterMode(enabled) {

  registerMode = enabled;


  const registerButton =
    $("registerButton");

  const loginButton =
    $("loginButton");


  if (enabled) {

    createUsernameField();


    if (loginButton) {

      loginButton.textContent =
        "अकाउंट बनाएँ";

    }


    if (registerButton) {

      registerButton.textContent =
        "पहले से अकाउंट है? लॉगिन करें";

    }


    const email =
      $("loginEmail");

    if (email) {

      email.placeholder =
        "ईमेल";

    }


    showError("");


  } else {

    removeUsernameField();


    if (loginButton) {

      loginButton.textContent =
        "लॉगिन करें";

    }


    if (registerButton) {

      registerButton.textContent =
        "नया अकाउंट बनाएँ";

    }


    const email =
      $("loginEmail");

    if (email) {

      email.placeholder =
        "ईमेल";

    }


    showError("");

  }

}


/* =========================================================
   REGISTER BUTTON
========================================================= */

$("registerButton")?.addEventListener(
  "click",
  () => {

    setRegisterMode(
      !registerMode
    );

  }
);


/* =========================================================
   LOGIN / REGISTER MAIN BUTTON
========================================================= */

$("loginButton")?.addEventListener(
  "click",
  async () => {

    if (!firebaseReady || !firebaseAuth) {

      showError(
        "Firebase अभी तैयार नहीं हुआ है। 2-3 सेकंड बाद फिर कोशिश करें।"
      );

      return;

    }


    const email =
      $("loginEmail")
        ?.value
        .trim();


    const password =
      $("loginPassword")
        ?.value || "";


    /* =====================================================
       REGISTER
    ===================================================== */

    if (registerMode) {

      const username =
        $("registerUsername")
          ?.value
          .trim();


      if (!username) {

        showError(
          "यूज़रनेम डालें।"
        );

        return;

      }


      if (username.length < 3) {

        showError(
          "यूज़रनेम कम से कम 3 अक्षरों का रखें।"
        );

        return;

      }


      if (!email) {

        showError(
          "ईमेल डालें।"
        );

        return;

      }


      if (!password) {

        showError(
          "पासवर्ड डालें।"
        );

        return;

      }


      if (password.length < 6) {

        showError(
          "पासवर्ड कम से कम 6 characters का होना चाहिए।"
        );

        return;

      }


      try {

        setLoginLoading(
          true,
          "अकाउंट बनाया जा रहा है..."
        );


        const result =
          await firebaseAuthModule
            .createUserWithEmailAndPassword(
              firebaseAuth,
              email,
              password
            );


        /*
          Username Firebase profile में save होगा।
        */

        await firebaseAuthModule.updateProfile(
          result.user,
          {
            displayName: username
          }
        );


        showError("");


        /*
          Account बनते ही सीधे App
        */

        showApp();

        updateUserUI(
          result.user
        );


        console.log(
          "New account created successfully."
        );


      } catch (error) {

        console.error(
          "Register error:",
          error
        );


        showError(
          getFirebaseError(error)
        );


      } finally {

        setLoginLoading(
          false
        );

      }


      return;

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    if (!email) {

      showError(
        "ईमेल डालें।"
      );

      return;

    }


    if (!password) {

      showError(
        "पासवर्ड डालें।"
      );

      return;

    }


    try {

      setLoginLoading(
        true,
        "लॉगिन हो रहा है..."
      );


      const result =
        await firebaseAuthModule
          .signInWithEmailAndPassword(
            firebaseAuth,
            email,
            password
          );


      showError("");


      showApp();


      updateUserUI(
        result.user
      );


      console.log(
        "Login successful."
      );


    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      showError(
        getFirebaseError(error)
      );


    } finally {

      setLoginLoading(
        false
      );

    }

  }
);


/* =========================================================
   FIREBASE ERROR
========================================================= */

function getFirebaseError(error) {

  console.error(
    "Firebase error code:",
    error?.code
  );


  switch (error?.code) {

    case "auth/invalid-api-key":

    case "auth/api-key-not-valid":

      return "Firebase API key मान्य नहीं है। Firebase Web App की config जाँचें।";


    case "auth/invalid-email":

      return "ईमेल सही नहीं है।";


    case "auth/missing-password":

      return "पासवर्ड डालें।";


    case "auth/weak-password":

      return "पासवर्ड कम से कम 6 characters का रखें।";


    case "auth/email-already-in-use":

      return "यह ईमेल पहले से registered है। Login करें।";


    case "auth/invalid-credential":

      return "ईमेल या पासवर्ड गलत है।";


    case "auth/user-not-found":

      return "इस ईमेल से कोई अकाउंट नहीं मिला।";


    case "auth/wrong-password":

      return "पासवर्ड गलत है।";


    case "auth/too-many-requests":

      return "बहुत ज्यादा प्रयास हुए हैं। थोड़ी देर बाद फिर कोशिश करें।";


    case "auth/network-request-failed":

      return "Internet connection की समस्या है।";


    case "auth/operation-not-allowed":

      return "Firebase में Email/Password login अभी Enabled नहीं है।";


    default:

      return (
        "Login में समस्या: " +
        (error?.code || "unknown-error")
      );

  }

}


/* =========================================================
   ERROR DISPLAY
========================================================= */

function showError(message) {

  const box =
    $("loginError");


  if (box) {

    box.textContent =
      message || "";

  }

}


/* =========================================================
   BUTTON LOADING
========================================================= */

function setLoginLoading(
  loading,
  text = "कृपया प्रतीक्षा करें..."
) {

  const button =
    $("loginButton");


  if (!button) {
    return;
  }


  if (loading) {

    button.disabled =
      true;

    button.dataset.oldText =
      button.textContent;

    button.textContent =
      text;

  } else {

    button.disabled =
      false;


    button.textContent =
      registerMode
        ? "अकाउंट बनाएँ"
        : "लॉगिन करें";

  }

}


/* =========================================================
   USER UI
========================================================= */

function updateUserUI(user) {

  if (!user) {
    return;
  }


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


/* =========================================================
   LOGOUT
========================================================= */

$("logoutButton")?.addEventListener(
  "click",
  async () => {

    if (
      !firebaseReady ||
      !firebaseAuth
    ) {
      return;
    }


    try {

      await firebaseAuthModule
        .signOut(
          firebaseAuth
        );


      showLogin();


    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

    }

  }
);


/* =========================================================
   MENU
========================================================= */

const sideMenu =
  $("sideMenu");

const menuOverlay =
  $("menuOverlay");


function openMenu() {

  sideMenu?.classList.add(
    "open"
  );

  menuOverlay?.classList.add(
    "show"
  );

}


function closeMenu() {

  sideMenu?.classList.remove(
    "open"
  );

  menuOverlay?.classList.remove(
    "show"
  );

}


$("menuButton")?.addEventListener(
  "click",
  openMenu
);


$("closeMenu")?.addEventListener(
  "click",
  closeMenu
);


menuOverlay?.addEventListener(
  "click",
  closeMenu
);


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function openPage(pageName) {

  document
    .querySelectorAll(".page")
    .forEach((page) => {

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
    .forEach((button) => {

      button.classList.remove(
        "nav-active"
      );

    });


  document
    .querySelectorAll(
      `[data-page="${pageName}"]`
    )
    .forEach((button) => {

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
  .querySelectorAll(
    "[data-page]"
  )
  .forEach((button) => {

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

$("accountButton")?.addEventListener(
  "click",
  () => {

    openPage(
      "account"
    );

  }
);


/* =========================================================
   THEME
========================================================= */

$("themeSetting")?.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "dark"
    );


    const dark =
      document.body.classList.contains(
        "dark"
      );


    localStorage.setItem(
      "theme",
      dark
        ? "dark"
        : "light"
    );

  }
);


if (
  localStorage.getItem(
    "theme"
  ) === "dark"
) {

  document.body.classList.add(
    "dark"
  );

}


/* =========================================================
   LANGUAGE SETTING
========================================================= */

$("languageSetting")?.addEventListener(
  "click",
  () => {

    showLanguage();

  }
);


/* =========================================================
   START SCREEN
========================================================= */

if (
  localStorage.getItem(
    "language"
  )
) {

  showLogin();

} else {

  showLanguage();

}


/* =========================================================
   START FIREBASE
========================================================= */

initializeFirebase();


/* =========================================================
   READY
========================================================= */

console.log(
  "Nakshatra Jyoti loaded successfully."
);
