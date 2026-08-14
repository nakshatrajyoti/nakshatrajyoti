/* =====================================================
   NAKSHATRA JYOTI
   LANGUAGE + FIREBASE LOGIN
===================================================== */


/* =====================================================
   BASIC HELPERS
===================================================== */

const $ = (id) => document.getElementById(id);

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


/* =====================================================
   LANGUAGE
===================================================== */

let selectedLanguage =
  localStorage.getItem("language") || "hi";


document.querySelectorAll(".language").forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelectorAll(".language")
      .forEach(item => {

        item.classList.remove("active");

      });

    button.classList.add("active");

    selectedLanguage =
      button.dataset.lang;

  });

});


/* =====================================================
   LANGUAGE CONTINUE
===================================================== */

const languageContinue =
  $("languageContinue");


if (languageContinue) {

  languageContinue.addEventListener(
    "click",
    () => {

      localStorage.setItem(
        "language",
        selectedLanguage
      );

      showLogin();

    }
  );

}


/* =====================================================
   FIREBASE
===================================================== */

let auth = null;


/*
   Firebase को अलग try/catch में रखा गया है।
   Firebase में समस्या होने पर भी
   Language → Login काम करता रहेगा।
*/

async function initializeFirebase() {

  try {

    const firebaseModule =
      await import(
        "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js"
      );


    const authModule =
      await import(
        "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js"
      );


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


    const app =
      firebaseModule.initializeApp(
        firebaseConfig
      );


    auth =
      authModule.getAuth(app);


    console.log(
      "Firebase successfully connected."
    );


    authModule.onAuthStateChanged(
      auth,
      user => {

        if (user) {

          showApp();

          updateUserUI(user);

        }

      }
    );


  } catch (error) {

    console.error(
      "Firebase error:",
      error
    );

    /*
       Firebase fail होने पर Language
       system बंद नहीं होगा।
    */

  }

}


/* =====================================================
   LOGIN
===================================================== */

$("loginButton")?.addEventListener(
  "click",
  async () => {

    if (!auth) {

      showError(
        "Login system अभी Firebase से connect नहीं हुआ है।"
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

      showError(
        "ईमेल और पासवर्ड भरें।"
      );

      return;

    }


    try {

      setLoginLoading(true);


      const authModule =
        await import(
          "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js"
        );


      await authModule.signInWithEmailAndPassword(
        auth,
        email,
        password
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

  }
);


/* =====================================================
   REGISTER
===================================================== */

$("registerButton")?.addEventListener(
  "click",
  async () => {

    if (!auth) {

      showError(
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

      showError(
        "ईमेल और पासवर्ड भरें।"
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

      setLoginLoading(true);


      const authModule =
        await import(
          "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js"
        );


      const result =
        await authModule
          .createUserWithEmailAndPassword(
            auth,
            email,
            password
          );


      await authModule.updateProfile(
        result.user,
        {
          displayName:
            email.split("@")[0]
        }
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

  }
);


/* =====================================================
   ERROR
===================================================== */

function showError(message) {

  const box =
    $("loginError");

  if (box) {

    box.textContent =
      message;

  }

}


function getFirebaseError(error) {

  switch (error.code) {

    case "auth/invalid-email":
      return "ईमेल सही नहीं है।";

    case "auth/invalid-credential":
      return "ईमेल या पासवर्ड गलत है।";

    case "auth/email-already-in-use":
      return "यह ईमेल पहले से registered है।";

    case "auth/weak-password":
      return "पासवर्ड कम से कम 6 characters का रखें।";

    case "auth/too-many-requests":
      return "बहुत ज्यादा प्रयास हुए हैं। थोड़ी देर बाद कोशिश करें।";

    default:
      return "कुछ समस्या हुई। फिर से कोशिश करें।";

  }

}


/* =====================================================
   LOGIN BUTTON
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
      .textContent = letter;

  }


  if ($("bigProfileLetter")) {

    $("bigProfileLetter")
      .textContent = letter;

  }


  if ($("accountName")) {

    $("accountName")
      .textContent = name;

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

$("logoutButton")?.addEventListener(
  "click",
  async () => {

    if (!auth) return;


    try {

      const authModule =
        await import(
          "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js"
        );


      await authModule.signOut(auth);

      showLogin();

    } catch (error) {

      console.error(error);

    }

  }
);


/* =====================================================
   MENU
===================================================== */

const sideMenu =
  $("sideMenu");

const menuOverlay =
  $("menuOverlay");


function openMenu() {

  sideMenu?.classList.add("open");

  menuOverlay?.classList.add("show");

}


function closeMenu() {

  sideMenu?.classList.remove("open");

  menuOverlay?.classList.remove("show");

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


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function openPage(pageName) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove("active");

    });


  const page =
    document.getElementById(
      pageName + "Page"
    );


  if (page) {

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

$("accountButton")?.addEventListener(
  "click",
  () => {

    openPage("account");

  }
);


/* =====================================================
   THEME
===================================================== */

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
      dark ? "dark" : "light"
    );

  }
);


if (
  localStorage.getItem("theme")
  ===
  "dark"
) {

  document.body.classList.add(
    "dark"
  );

}


/* =====================================================
   LANGUAGE SETTING
===================================================== */

$("languageSetting")?.addEventListener(
  "click",
  () => {

    showLanguage();

  }
);


/* =====================================================
   START FIREBASE
===================================================== */

initializeFirebase();


/* =====================================================
   START SCREEN
===================================================== */

if (
  localStorage.getItem("language")
) {

  /*
     अगर पहले language select हो चुकी है,
     तो Login screen दिखाएँ।
  */

  showLogin();

} else {

  showLanguage();

}


console.log(
  "Nakshatra Jyoti loaded."
);
