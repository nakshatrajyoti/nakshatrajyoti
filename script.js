/* =========================================================
   NAKSHATRA JYOTI
   FINAL ADVANCED SCRIPT
   Firebase Authentication + Language + Navigation
   Theme + Account + Services + Guidance System
========================================================= */


/* =========================================================
   BASIC HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

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


document
  .querySelectorAll(".language")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".language")
          .forEach((item) => {

            item.classList.remove(
              "active"
            );

          });


        button.classList.add(
          "active"
        );


        selectedLanguage =
          button.dataset.lang || "hi";

      }
    );

  });


/* =========================================================
   LANGUAGE CONTINUE
========================================================= */

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


/* =========================================================
   FIREBASE
========================================================= */

let firebaseApp = null;

let firebaseAuth = null;

let firebaseAuthModule = null;

let firebaseFirestoreModule = null;

let firebaseDb = null;

let firebaseStorageModule = null;

let firebaseStorage = null;

let firebaseReady = false;


/* =========================================================
   FIREBASE CONFIG
========================================================= */

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

    console.log(
      "Firebase starting..."
    );


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

    firebaseApp = app;

    firebaseFirestoreModule =
      await import(
        "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js"
      );

    firebaseAuth =
      firebaseAuthModule.getAuth(
        app
      );

    firebaseDb =
      firebaseFirestoreModule.getFirestore(
        app
      );

    firebaseStorageModule =
      await import(
        "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js"
      );

    firebaseStorage =
      firebaseStorageModule.getStorage(
        app
      );

    firebaseReady = true;

    window.dispatchEvent(
      new Event("nakshatra-firebase-ready")
    );


    console.log(
      "Firebase connected successfully."
    );


    firebaseAuthModule.onAuthStateChanged(
      firebaseAuth,
      (user) => {

        if (user) {

          console.log(
            "User already logged in:",
            user.email
          );


          showApp();


          updateUserUI(
            user
          );


          loadSavedUserSettings(
            user
          );

          // IMPORTANT: role resolution must happen after Firebase has
          // actually restored the authenticated user. Previously the
          // feature layer could run before currentUser was available,
          // leaving every account as the default User role.
          window.dispatchEvent(
            new CustomEvent("nakshatra-auth-state", {
              detail: {
                uid: user.uid,
                email: user.email || ""
              }
            })
          );

        } else {

          console.log(
            "No user logged in."
          );

          window.dispatchEvent(
            new CustomEvent("nakshatra-auth-state", {
              detail: { uid: null }
            })
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


/* =========================================================
   CREATE USERNAME FIELD
========================================================= */

function createUsernameField() {

  if (
    $("registerUsername")
  ) {

    return;

  }


  const emailInput =
    $("loginEmail");


  if (!emailInput) {

    return;

  }


  const username =
    document.createElement(
      "input"
    );


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

function setRegisterMode(
  enabled
) {

  registerMode =
    enabled;


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

    if (
      !firebaseReady ||
      !firebaseAuth
    ) {

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


      if (
        username.length < 3
      ) {

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


      if (
        password.length < 6
      ) {

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


        await firebaseAuthModule
          .updateProfile(
            result.user,
            {
              displayName:
                username
            }
          );


        showError("");


        showApp();


        updateUserUI(
          result.user
        );


        saveLocalUserData(
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
          getFirebaseError(
            error
          )
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


      saveLocalUserData(
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
        getFirebaseError(
          error
        )
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

function getFirebaseError(
  error
) {

  console.error(
    "Firebase error code:",
    error?.code
  );


  switch (
    error?.code
  ) {

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


    case "auth/user-disabled":

      return "यह अकाउंट अभी disabled है।";


    case "auth/requires-recent-login":

      return "इस काम के लिए दोबारा लॉगिन करना आवश्यक है।";


    default:

      return (
        "Login में समस्या: " +
        (
          error?.code ||
          "unknown-error"
        )
      );

  }

}


/* =========================================================
   ERROR DISPLAY
========================================================= */

function showError(
  message
) {

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

function updateUserUI(
  user
) {

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


  const menuName =
    $("menuProfileName");


  if (menuName) {

    menuName.textContent =
      name;

  }


  const menuEmail =
    $("menuProfileEmail");


  if (menuEmail) {

    menuEmail.textContent =
      user.email || "";

  }


  const menuLetter =
    $("menuProfileLetter");


  if (menuLetter) {

    menuLetter.textContent =
      letter;

  }


  const drawerName =
    $("drawerAccountName");


  if (drawerName) {

    drawerName.textContent =
      name;

  }


  const drawerEmail =
    $("drawerAccountEmail");


  if (drawerEmail) {

    drawerEmail.textContent =
      user.email || "";

  }


  const drawerLetter =
    $("drawerProfileLetter");


  if (drawerLetter) {

    drawerLetter.textContent =
      letter;

  }

}


/* =========================================================
   LOCAL USER DATA
========================================================= */

function saveLocalUserData(
  user
) {

  if (!user) {

    return;

  }


  const data = {

    name:
      user.displayName ||
      user.email?.split("@")[0] ||
      "User",

    email:
      user.email || "",

    language:
      localStorage.getItem(
        "language"
      ) || "hi",

    lastLogin:
      new Date().toISOString()

  };


  localStorage.setItem(
    "nakshatraUser",
    JSON.stringify(data)
  );

}


/* =========================================================
   LOAD USER SETTINGS
========================================================= */

function loadSavedUserSettings(
  user
) {

  if (!user) {

    return;

  }


  const saved =
    localStorage.getItem(
      "nakshatraUser"
    );


  if (!saved) {

    saveLocalUserData(
      user
    );

    return;

  }


  try {

    const data =
      JSON.parse(
        saved
      );


    if (
      data.language &&
      !localStorage.getItem(
        "language"
      )
    ) {

      localStorage.setItem(
        "language",
        data.language
      );

    }

  } catch (error) {

    console.warn(
      "Saved user data could not be read.",
      error
    );

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

      window.NJPresence?.stop();

      await firebaseAuthModule
        .signOut(
          firebaseAuth
        );


      localStorage.removeItem(
        "nakshatraUser"
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
   MENU REFERENCES
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


  document.body.style.overflow =
    "hidden";

}


function closeMenu() {

  sideMenu?.classList.remove(
    "open"
  );


  menuOverlay?.classList.remove(
    "show"
  );


  document.body.style.overflow =
    "";

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
   ESCAPE KEY
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape"
    ) {

      closeMenu();

      closeAccountDrawer();

    }

  }
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
    .forEach(
      (page) => {

        page.classList.remove(
          "active"
        );

      }
    );


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
    .forEach(
      (button) => {

        button.classList.remove(
          "nav-active"
        );

      }
    );


  document
    .querySelectorAll(
      `[data-page="${pageName}"]`
    )
    .forEach(
      (button) => {

        button.classList.add(
          "nav-active"
        );

      }
    );


  closeMenu();


  closeAccountDrawer();


  // Dedicated full-screen chat (no bottom nav) only applies while the
  // person is actually inside a chat thread on the Messages page —
  // leaving that page for any other page must restore the normal
  // bottom navigation immediately.
  if (pageName !== "messages") {
    document.body.classList.remove("chat-fullscreen-active");
    document.dispatchEvent(new Event("nakshatra-leave-messages"));
  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  localStorage.setItem(
    "lastPage",
    pageName
  );

}


/* =========================================================
   ALL PAGE BUTTONS
========================================================= */

document
  .querySelectorAll(
    "[data-page]"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const page =
            button.dataset.page;


          if (page) {

            openPage(
              page
            );

          }

        }
      );

    }
  );


/* =========================================================
   ACCOUNT DRAWER REFERENCES
========================================================= */

const accountOverlay =
  $("accountOverlay");


const accountDrawer =
  $("accountDrawer");


function openAccountDrawer() {

  if (!accountDrawer) {

    openPage(
      "account"
    );

    return;

  }


  accountDrawer.classList.add(
    "open"
  );


  accountOverlay?.classList.add(
    "show"
  );


  document.body.style.overflow =
    "hidden";

}


function closeAccountDrawer() {

  accountDrawer?.classList.remove(
    "open"
  );


  accountOverlay?.classList.remove(
    "show"
  );


  document.body.style.overflow =
    "";

}


$("accountButton")?.addEventListener(
  "click",
  () => {

    if (typeof refreshAccountDrawer === "function") {

      refreshAccountDrawer();

    }

    openAccountDrawer();

  }
);


$("closeAccountDrawer")?.addEventListener(
  "click",
  closeAccountDrawer
);


accountOverlay?.addEventListener(
  "click",
  closeAccountDrawer
);


/* =========================================================
   ACCOUNT LEGACY FALLBACK
========================================================= */

$("accountPageButton")?.addEventListener(
  "click",
  () => {

    openAccountDrawer();

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

    document.body.classList.add(
      "dark"
    );

  } else {

    document.body.classList.remove(
      "dark"
    );

  }


  localStorage.setItem(
    "theme",
    theme
  );


  updateThemeUI(
    theme
  );

}


function updateThemeUI(
  theme
) {

  const themeText =
    $("themeCurrent");


  if (themeText) {

    themeText.textContent =
      theme === "dark"
        ? "डार्क"
        : "लाइट";

  }


  const themeIcon =
    $("themeIcon");


  if (themeIcon) {

    themeIcon.textContent =
      theme === "dark"
        ? "☀️"
        : "🌙";

  }

}


function toggleTheme() {

  const isDark =
    document.body.classList.contains(
      "dark"
    );


  applyTheme(
    isDark
      ? "light"
      : "dark"
  );

}


$("themeSetting")?.addEventListener(
  "click",
  toggleTheme
);


$("themeToggle")?.addEventListener(
  "click",
  toggleTheme
);


/* =========================================================
   INITIAL THEME
========================================================= */

const savedTheme =
  localStorage.getItem(
    "theme"
  ) || "light";


applyTheme(
  savedTheme
);


/* =========================================================
   LANGUAGE SETTING
========================================================= */

$("languageSetting")?.addEventListener(
  "click",
  () => {

    closeMenu();

    closeAccountDrawer();

    showLanguage();

  }
);


$("accountLanguageSetting")?.addEventListener(
  "click",
  () => {

    closeAccountDrawer();

    showLanguage();

  }
);


/* =========================================================
   ACCOUNT THEME SETTING
========================================================= */

$("accountThemeSetting")?.addEventListener(
  "click",
  () => {

    toggleTheme();

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
   RESTORE LANGUAGE BUTTON
========================================================= */

function restoreLanguageButton() {

  const current =
    localStorage.getItem(
      "language"
    ) || "hi";


  selectedLanguage =
    current;


  document
    .querySelectorAll(
      ".language"
    )
    .forEach(
      (button) => {

        button.classList.toggle(
          "active",
          button.dataset.lang ===
            current
        );

      }
    );

}


restoreLanguageButton();


/* =========================================================
   START FIREBASE
========================================================= */

initializeFirebase();


/* =========================================================
   READY
========================================================= */

console.log(
  "Nakshatra Jyoti advanced script loaded successfully."
);
/* =========================================================
   NAKSHATRA JYOTI
   ADVANCED GUIDANCE SYSTEM
   CAREER + MARRIAGE + MUHURAT + EDUCATION
========================================================= */


/* =========================================================
   SERVICE DATA
========================================================= */

const serviceData = {

  career: {

    title: "करियर एवं नौकरी",

    subtitle:
      "नौकरी, व्यवसाय, प्रतियोगी परीक्षा और करियर दिशा से संबंधित मार्गदर्शन।",

    icon: "💼",

    topics: [

      {
        icon: "🎯",
        title: "करियर दिशा",
        text:
          "किस क्षेत्र में आगे बढ़ने की संभावना बेहतर हो सकती है।"
      },

      {
        icon: "🏢",
        title: "नौकरी",
        text:
          "नौकरी, कार्यक्षेत्र और पेशेवर जीवन से संबंधित मार्गदर्शन।"
      },

      {
        icon: "📈",
        title: "प्रमोशन",
        text:
          "कार्यस्थल पर प्रगति और जिम्मेदारियों से संबंधित मार्गदर्शन।"
      },

      {
        icon: "💰",
        title: "व्यवसाय",
        text:
          "व्यवसाय, साझेदारी और आर्थिक दिशा से संबंधित मार्गदर्शन।"
      },

      {
        icon: "📚",
        title: "प्रतियोगी परीक्षा",
        text:
          "प्रतियोगी परीक्षाओं और तैयारी की दिशा से संबंधित मार्गदर्शन।"
      },

      {
        icon: "✈️",
        title: "विदेशी करियर",
        text:
          "विदेश में अध्ययन या रोजगार की संभावनाओं पर मार्गदर्शन।"
      },

      {
        icon: "🔄",
        title: "करियर परिवर्तन",
        text:
          "करियर बदलने और नए क्षेत्र में जाने से संबंधित विचार।"
      },

      {
        icon: "🧭",
        title: "करियर टाइमिंग",
        text:
          "महत्वपूर्ण करियर निर्णयों के समय से संबंधित ज्योतिषीय विश्लेषण।"
      }

    ]

  },


  marriage: {

    title: "विवाह एवं संबंध",

    subtitle:
      "विवाह, संबंध, जीवनसाथी और वैवाहिक जीवन से संबंधित मार्गदर्शन।",

    icon: "💍",

    topics: [

      {
        icon: "💑",
        title: "विवाह योग",
        text:
          "विवाह से संबंधित ज्योतिषीय संकेतों का अध्ययन।"
      },

      {
        icon: "🗓️",
        title: "विवाह का समय",
        text:
          "विवाह के संभावित समय से संबंधित विश्लेषण।"
      },

      {
        icon: "❤️",
        title: "प्रेम संबंध",
        text:
          "प्रेम और संबंधों से संबंधित मार्गदर्शन।"
      },

      {
        icon: "🤝",
        title: "विवाह अनुकूलता",
        text:
          "दो व्यक्तियों की जन्म जानकारी के आधार पर अनुकूलता अध्ययन।"
      },

      {
        icon: "🏠",
        title: "वैवाहिक जीवन",
        text:
          "विवाह के बाद के जीवन से संबंधित सामान्य मार्गदर्शन।"
      },

      {
        icon: "💫",
        title: "जीवनसाथी",
        text:
          "जीवनसाथी के स्वभाव और संबंधों से संबंधित ज्योतिषीय संकेत।"
      }

    ]

  },


  muhurat: {

    title: "शुभ मुहूर्त",

    subtitle:
      "विभिन्न शुभ कार्यों के लिए उपयुक्त समय से संबंधित जानकारी।",

    icon: "✦",

    topics: [

      {
        icon: "🏠",
        title: "गृह प्रवेश",
        text:
          "गृह प्रवेश के लिए शुभ समय की जानकारी।"
      },

      {
        icon: "💍",
        title: "विवाह मुहूर्त",
        text:
          "विवाह के लिए शुभ तिथि एवं समय की जानकारी।"
      },

      {
        icon: "🚗",
        title: "वाहन मुहूर्त",
        text:
          "नए वाहन से संबंधित शुभ समय।"
      },

      {
        icon: "🏪",
        title: "व्यवसाय प्रारंभ",
        text:
          "नए व्यवसाय या प्रतिष्ठान के शुभारंभ का समय।"
      },

      {
        icon: "📖",
        title: "विद्यारंभ",
        text:
          "शिक्षा आरंभ करने के लिए शुभ समय।"
      },

      {
        icon: "🛕",
        title: "पूजा एवं अनुष्ठान",
        text:
          "धार्मिक कार्यों और अनुष्ठानों के लिए शुभ समय।"
      }

    ]

  },


  education: {

    title: "अध्ययन एवं विद्या",

    subtitle:
      "शिक्षा, अध्ययन, परीक्षा और ज्ञान से संबंधित मार्गदर्शन।",

    icon: "🎓",

    topics: [

      {
        icon: "📚",
        title: "शिक्षा दिशा",
        text:
          "अध्ययन के क्षेत्र और शिक्षा की दिशा से संबंधित मार्गदर्शन।"
      },

      {
        icon: "📝",
        title: "परीक्षा",
        text:
          "परीक्षा और अध्ययन से संबंधित ज्योतिषीय मार्गदर्शन।"
      },

      {
        icon: "🔬",
        title: "उच्च शिक्षा",
        text:
          "उच्च शिक्षा और विशेषज्ञता से संबंधित संकेत।"
      },

      {
        icon: "🌍",
        title: "विदेश में शिक्षा",
        text:
          "विदेश में अध्ययन की संभावनाओं से संबंधित मार्गदर्शन।"
      },

      {
        icon: "🧠",
        title: "एकाग्रता",
        text:
          "अध्ययन की आदत और एकाग्रता से संबंधित सामान्य मार्गदर्शन।"
      },

      {
        icon: "🏆",
        title: "प्रतियोगी परीक्षा",
        text:
          "प्रतियोगी परीक्षाओं के लिए अध्ययन दिशा।"
      }

    ]

  }

};


/* =========================================================
   DYNAMIC SERVICE PAGE
========================================================= */

function getServicePage(
  type
) {

  return document.getElementById(
    type + "Page"
  );

}


/* =========================================================
   CREATE SERVICE CONTENT
========================================================= */

function renderServicePage(
  type
) {

  const page =
    getServicePage(
      type
    );


  const data =
    serviceData[type];


  if (
    !page ||
    !data
  ) {

    return;

  }


  page.classList.add(
    "service-page"
  );


  let html = `

    <div class="service-hero">

      <div class="service-hero-icon">
        ${data.icon}
      </div>

      <div class="section-label">
        NAKSHATRA GUIDANCE
      </div>

      <h1>
        ${data.title}
      </h1>

      <p>
        ${data.subtitle}
      </p>

    </div>


    <div class="section-heading-row"
         style="margin-top:35px">

      <div>

        <div class="section-label">
          GUIDANCE TOPICS
        </div>

        <h2>
          किस विषय पर मार्गदर्शन चाहिए?
        </h2>

      </div>

    </div>


    <div class="service-grid">

  `;

  if (type === "career") {

    html += `

      <div
        class="career-special-section"
        style="margin-top:35px;"
      >

        <div class="section-label">
          CAREER SPECIAL GUIDANCE
        </div>

        <h2>
          करियर के किस क्षेत्र में मार्गदर्शन चाहिए?
        </h2>

        <div
          id="careerSpecialTopics"
          class="career-special-topics"
        ></div>

      </div>

    `;

  }


  data.topics.forEach(
    (topic, index) => {

      html += `

        <button
          class="service-option"
          data-service-topic="${type}"
          data-topic-index="${index}"
        >

          <div class="service-option-icon">
            ${topic.icon}
          </div>

          <h3>
            ${topic.title}
          </h3>

          <p>
            ${topic.text}
          </p>

        </button>

      `;

    }
  );


  html += `

    </div>


    <div
      class="guidance-action-panel"
      id="${type}GuidancePanel"
      style="
        display:none;
        margin-top:25px;
      "
    >

      <div class="form-panel">

        <div class="section-label">
          PERSONAL GUIDANCE
        </div>

        <h2>
          अपनी जानकारी दें
        </h2>

        <p
          style="
            color:var(--muted);
            margin:6px 0 20px;
          "
        >
          सही मार्गदर्शन के लिए नीचे दी गई जानकारी भरें।
        </p>


        <div class="form-grid">

          <div class="form-field">

            <label>
              नाम
            </label>

            <input
              type="text"
              id="${type}Name"
              placeholder="अपना नाम"
            >

          </div>


          <div class="form-field">

            <label>
              जन्म तिथि
            </label>

            <input
              type="date"
              id="${type}Dob"
            >

          </div>


          <div class="form-field">

            <label>
              जन्म समय
            </label>

            <input
              type="time"
              id="${type}Tob"
            >

          </div>


          <div class="form-field">

            <label>
              जन्म स्थान
            </label>

            <input
              type="text"
              id="${type}Place"
              placeholder="शहर / स्थान"
            >

          </div>


          <div class="form-field full">

            <label>
              आपका प्रश्न
            </label>

            <textarea
              id="${type}Question"
              placeholder="जिस विषय पर मार्गदर्शन चाहिए, वह यहाँ लिखें..."
            ></textarea>

          </div>

        </div>


        <div class="form-actions">

          <button
            class="submit"
            data-submit-guidance="${type}"
          >
            मार्गदर्शन के लिए आगे बढ़ें
          </button>

          <button
            type="button"
            data-close-guidance="${type}"
          >
            वापस
          </button>

        </div>


        <div
          id="${type}Result"
          class="result-box empty"
          style="display:none"
        ></div>

      </div>

    </div>

  `;


  page.innerHTML =
    html;


  attachServiceEvents(
    type
  );

}


/* =========================================================
   ATTACH SERVICE EVENTS
========================================================= */

function attachServiceEvents(
  type
) {

  const page =
    getServicePage(
      type
    );


  if (!page) {

    return;

  }


  page
    .querySelectorAll(
      "[data-service-topic]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const panel =
              page.querySelector(
                `#${type}GuidancePanel`
              );


            if (panel) {

              panel.style.display =
                "block";


              panel.scrollIntoView({
                behavior:
                  "smooth",
                block:
                  "start"
              });

            }


            page
              .querySelectorAll(
                ".service-option"
              )
              .forEach(
                (item) => {

                  item.style.borderColor =
                    "";

                }
              );


            button.style.borderColor =
              "var(--gold)";


            const topicIndex =
              button.dataset.topicIndex;


            localStorage.setItem(
              "selectedGuidanceTopic",
              JSON.stringify({

                type:
                  type,

                index:
                  topicIndex

              })
            );

          }
        );

      }
    );


  page
    .querySelector(
      `[data-close-guidance="${type}"]`
    )
    ?.addEventListener(
      "click",
      () => {

        const panel =
          page.querySelector(
            `#${type}GuidancePanel`
          );


        if (panel) {

          panel.style.display =
            "none";

        }

      }
    );


  page
    .querySelector(
      `[data-submit-guidance="${type}"]`
    )
    ?.addEventListener(
      "click",
      () => {

        submitGuidance(
          type
        );

      }
    );

}


/* =========================================================
   SUBMIT GUIDANCE
========================================================= */

function submitGuidance(
  type
) {

  const data =
    serviceData[type];


  if (!data) {

    return;

  }


  const name =
    document.getElementById(
      `${type}Name`
    )?.value.trim();


  const dob =
    document.getElementById(
      `${type}Dob`
    )?.value;


  const tob =
    document.getElementById(
      `${type}Tob`
    )?.value;


  const place =
    document.getElementById(
      `${type}Place`
    )?.value.trim();


  const question =
    document.getElementById(
      `${type}Question`
    )?.value.trim();


  const result =
    document.getElementById(
      `${type}Result`
    );


  if (!name) {

    showInlineResult(
      result,
      "कृपया अपना नाम दर्ज करें।",
      true
    );

    return;

  }


  if (!dob) {

    showInlineResult(
      result,
      "कृपया जन्म तिथि दर्ज करें।",
      true
    );

    return;

  }


  if (!tob) {

    showInlineResult(
      result,
      "कृपया जन्म समय दर्ज करें।",
      true
    );

    return;

  }


  if (!place) {

    showInlineResult(
      result,
      "कृपया जन्म स्थान दर्ज करें।",
      true
    );

    return;

  }


  const selectedTopic =
    getSelectedTopic(
      type
    );


  const guidance =
    {

      type:
        type,

      category:
        data.title,

      topic:
        selectedTopic
          ? selectedTopic.title
          : data.title,

      name:
        name,

      dob:
        dob,

      tob:
        tob,

      place:
        place,

      question:
        question,

      createdAt:
        new Date().toISOString()

    };


  saveGuidanceRequest(
    guidance
  );


  if (result) {

    result.style.display =
      "block";

    result.classList.remove(
      "empty"
    );


    result.innerHTML = `

      <div class="section-label">
        REQUEST RECEIVED
      </div>

      <h3>
        आपकी जानकारी सुरक्षित रूप से तैयार है।
      </h3>

      <p
        style="
          color:var(--muted);
          margin-top:8px;
        "
      >
        ${
          selectedTopic
            ? selectedTopic.title
            : data.title
        }
        के लिए आपका प्रश्न दर्ज कर लिया गया है।
      </p>

      <div
        style="
          margin-top:18px;
          padding:15px;
          border-radius:14px;
          background:var(--cream);
        "
      >

        <strong>
          ${escapeHTML(name)}
        </strong>

        <br>

        <span>
          ${escapeHTML(place)}
        </span>

      </div>

    `;

  }


  result?.scrollIntoView({
    behavior:
      "smooth",
    block:
      "center"
  });

}


/* =========================================================
   SELECTED TOPIC
========================================================= */

function getSelectedTopic(
  type
) {

  const saved =
    localStorage.getItem(
      "selectedGuidanceTopic"
    );


  if (!saved) {

    return null;

  }


  try {

    const data =
      JSON.parse(
        saved
      );


    if (
      data.type !== type
    ) {

      return null;

    }


    const topic =
      serviceData[type]
        ?.topics?.[
          Number(
            data.index
          )
        ];


    return topic ||
      null;

  } catch (error) {

    console.warn(
      "Topic data error:",
      error
    );


    return null;

  }

}


/* =========================================================
   SAVE GUIDANCE REQUEST
========================================================= */

/* =========================================================
   SAVE GUIDANCE REQUEST
   LOCAL BACKUP + FIRESTORE
========================================================= */

async function saveGuidanceRequest(request) {

  const key =
    "nakshatraGuidanceRequests";


  /* =======================================================
     LOCAL BACKUP
  ======================================================= */

  let requests = [];


  try {

    requests =
      JSON.parse(
        localStorage.getItem(
          key
        ) || "[]"
      );


    if (
      !Array.isArray(
        requests
      )
    ) {

      requests = [];

    }

  } catch {

    requests = [];

  }


  requests.push(
    request
  );


  if (
    requests.length > 30
  ) {

    requests =
      requests.slice(
        -30
      );

  }


  localStorage.setItem(
    key,
    JSON.stringify(
      requests
    )
  );


  /* =======================================================
     FIRESTORE
  ======================================================= */

  try {

    const user =
      firebaseAuth?.currentUser || null;


    if (
      !user ||
      !firebaseReady ||
      !firebaseDb ||
      !firebaseFirestoreModule
    ) {

      console.warn(
        "Guidance: Firebase user/database not ready."
      );

      return false;

    }


    await firebaseFirestoreModule.addDoc(

      firebaseFirestoreModule.collection(
        firebaseDb,
        "guidanceRequests"
      ),

      {

        ...request,

        userId:
          user.uid,

        userEmail:
          user.email || "",

        createdAt:
          firebaseFirestoreModule.serverTimestamp()

      }

    );


    console.log(
      "Guidance request saved to Firestore."
    );


    return true;


  } catch (error) {

    console.error(
      "Guidance Firestore save error:",
      error
    );


    return false;

  }

}


/* =========================================================
   INLINE RESULT
========================================================= */

function showInlineResult(
  element,
  message,
  error = false
) {

  if (!element) {

    return;

  }


  element.style.display =
    "block";


  element.classList.remove(
    "empty"
  );


  element.innerHTML = `

    <div
      style="
        color:
          ${
            error
              ? "var(--danger)"
              : "var(--success)"
          };
        font-weight:800;
      "
    >
      ${escapeHTML(message)}
    </div>

  `;


  element.scrollIntoView({
    behavior:
      "smooth",
    block:
      "center"
  });

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   RENDER ALL SERVICES
========================================================= */

function initializeServicePages() {

  [
    "career",
    "marriage",
    "muhurat",
    "education"

  ].forEach(
    (type) => {

      renderServicePage(
        type
      );

    }
  );

}


/* =========================================================
   CAREER SPECIAL SYSTEM
========================================================= */

const careerTopics = [

  {
    icon: "💼",
    title: "सरकारी नौकरी",
    text:
      "सरकारी सेवा, प्रशासन और सार्वजनिक क्षेत्र से संबंधित मार्गदर्शन।"
  },

  {
    icon: "🏦",
    title: "बैंकिंग एवं वित्त",
    text:
      "बैंकिंग, वित्त और आर्थिक क्षेत्र से संबंधित करियर दिशा।"
  },

  {
    icon: "👨‍💻",
    title: "IT एवं टेक्नोलॉजी",
    text:
      "तकनीकी क्षेत्र और डिजिटल करियर से संबंधित मार्गदर्शन।"
  },

  {
    icon: "⚕️",
    title: "मेडिकल क्षेत्र",
    text:
      "स्वास्थ्य एवं चिकित्सा क्षेत्र से संबंधित अध्ययन और करियर दिशा।"
  },

  {
    icon: "⚖️",
    title: "कानून",
    text:
      "कानून, न्याय और विधिक क्षेत्र से संबंधित करियर मार्गदर्शन।"
  },

  {
    icon: "📊",
    title: "प्रबंधन",
    text:
      "प्रबंधन, नेतृत्व और कॉर्पोरेट क्षेत्र से संबंधित मार्गदर्शन।"
  },

  {
    icon: "🎨",
    title: "रचनात्मक क्षेत्र",
    text:
      "लेखन, डिजाइन, कला और रचनात्मक क्षेत्रों से संबंधित दिशा।"
  },

  {
    icon: "🌱",
    title: "कृषि एवं ग्रामीण व्यवसाय",
    text:
      "कृषि, भूमि और ग्रामीण व्यवसाय से संबंधित मार्गदर्शन।"
  }

];


function renderCareerTopics() {

  const container =
    document.getElementById(
      "careerSpecialTopics"
    );


  if (!container) {

    return;

  }


  container.innerHTML =
    careerTopics
      .map(
        (item, index) => `

          <button
            class="career-topic"
            data-career-topic="${index}"
          >

            <div class="career-topic-icon">
              ${item.icon}
            </div>

            <div>

              <strong>
                ${item.title}
              </strong>

              <small>
                ${item.text}
              </small>

            </div>

          </button>

        `
      )
      .join("");


  container
    .querySelectorAll(
      "[data-career-topic]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const index =
              Number(
                button.dataset.careerTopic
              );


            const item =
              careerTopics[index];


            if (!item) {

              return;

            }


            localStorage.setItem(
              "selectedCareerTopic",
              JSON.stringify(
                item
              )
            );


            openCareerQuestionBox(
              item
            );

          }
        );

      }
    );

}


/* =========================================================
   CAREER QUESTION BOX
========================================================= */

function openCareerQuestionBox(
  topic
) {

  const existing =
    document.getElementById(
      "careerDynamicQuestion"
    );


  if (existing) {

    existing.remove();

  }


  const careerPage =
    document.getElementById(
      "careerPage"
    );


  if (!careerPage) {

    return;

  }


  const box =
    document.createElement(
      "div"
    );


  box.id =
    "careerDynamicQuestion";


  box.className =
    "form-panel";


  box.style.marginTop =
    "25px";


  box.innerHTML = `

    <div class="section-label">
      CAREER GUIDANCE
    </div>

    <h2>
      ${escapeHTML(topic.title)}
    </h2>

    <p
      style="
        color:var(--muted);
      margin:5px 0 20px;
      "
    >
      ${escapeHTML(topic.text)}
    </p>


    <div class="form-grid">

      <div class="form-field">

        <label>
          आपका नाम
        </label>

        <input
          id="careerUserName"
          type="text"
          placeholder="नाम"
        >

      </div>


      <div class="form-field">

        <label>
          जन्म तिथि
        </label>

        <input
          id="careerUserDob"
          type="date"
        >

      </div>


      <div class="form-field">

        <label>
          जन्म समय
        </label>

        <input
          id="careerUserTob"
          type="time"
        >

      </div>


      <div class="form-field">

        <label>
          जन्म स्थान
        </label>

        <input
          id="careerUserPlace"
          type="text"
          placeholder="शहर / स्थान"
        >

      </div>


      <div class="form-field full">

        <label>
          करियर से संबंधित प्रश्न
        </label>

        <textarea
          id="careerUserQuestion"
          placeholder="अपना प्रश्न विस्तार से लिखें..."
        ></textarea>

      </div>

    </div>


    <div class="form-actions">

      <button
        class="submit"
        id="careerSubmitButton"
      >
        करियर मार्गदर्शन के लिए भेजें
      </button>

      <button
        id="careerCancelButton"
        type="button"
      >
        बंद करें
      </button>

    </div>


    <div
      id="careerResponse"
      class="result-box empty"
      style="display:none"
    ></div>

  `;


  careerPage.appendChild(
    box
  );


  $("careerCancelButton")
    ?.addEventListener(
      "click",
      () => {

        box.remove();

      }
    );


  $("careerSubmitButton")
    ?.addEventListener(
      "click",
      () => {

        submitCareerRequest(
          topic
        );

      }
    );


  box.scrollIntoView({
    behavior:
      "smooth",
    block:
      "start"
  });

}


/* =========================================================
   CAREER REQUEST
========================================================= */

function submitCareerRequest(
  topic
) {

  const name =
    $("careerUserName")
      ?.value
      .trim();


  const dob =
    $("careerUserDob")
      ?.value;


  const tob =
    $("careerUserTob")
      ?.value;


  const place =
    $("careerUserPlace")
      ?.value
      .trim();


  const question =
    $("careerUserQuestion")
      ?.value
      .trim();


  const response =
    $("careerResponse");


  if (!name) {

    showInlineResult(
      response,
      "कृपया अपना नाम दर्ज करें।",
      true
    );

    return;

  }


  if (!dob) {

    showInlineResult(
      response,
      "कृपया जन्म तिथि दर्ज करें।",
      true
    );

    return;

  }


  if (!tob) {

    showInlineResult(
      response,
      "कृपया जन्म समय दर्ज करें।",
      true
    );

    return;

  }


  if (!place) {

    showInlineResult(
      response,
      "कृपया जन्म स्थान दर्ज करें।",
      true
    );

    return;

  }


  const request = {

    category:
      "करियर एवं नौकरी",

    topic:
      topic.title,

    name:
      name,

    dob:
      dob,

    tob:
      tob,

    place:
      place,

    question:
      question,

    createdAt:
      new Date().toISOString()

  };


  saveGuidanceRequest(
    request
  );


  if (response) {

    response.style.display =
      "block";

    response.classList.remove(
      "empty"
    );


    response.innerHTML = `

      <div class="section-label">
        CAREER REQUEST SAVED
      </div>

      <h3>
        आपकी करियर संबंधी जानकारी तैयार है।
      </h3>

      <p
        style="
          color:var(--muted);
          margin-top:8px;
        "
      >
        ${escapeHTML(topic.title)}
        के लिए आपका प्रश्न सुरक्षित रूप से दर्ज हो गया है।
      </p>

    `;

  }

}


/* =========================================================
   INITIALIZE SERVICES AFTER DOM READY
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      initializeServicePages();

      renderCareerTopics();

    }
  );

} else {

  initializeServicePages();

  renderCareerTopics();

}


/* =========================================================
   HOME CATEGORY QUICK OPEN
========================================================= */

document
  .querySelectorAll(
    ".category-card"
  )
  .forEach(
    (card) => {

      card.addEventListener(
        "click",
        () => {

          const page =
            card.dataset.page;


          if (page) {

            openPage(
              page
            );

          }

        }
      );

    }
  );


/* =========================================================
   POSTER SYSTEM
========================================================= */

function initializePosters() {

  const posters =
    document.querySelectorAll(
      ".poster-card img, .poster-slider img"
    );


  if (!posters.length) {

    return;

  }


  posters.forEach(
    (image) => {

      image.addEventListener(
        "error",
        () => {

          image.style.display =
            "none";

        }
      );

    }
  );

}


initializePosters();


/* =========================================================
   POSTER AUTO SLIDE
========================================================= */

function initializePosterAutoSlide() {

  const slider =
    document.querySelector(
      ".poster-slider"
    );


  if (!slider) {

    return;

  }


  /* Do not attach the same slider timers/listeners more than once. */
  if (
    slider.dataset.posterAutoSlideAttached ===
    "true"
  ) {

    return;

  }


  slider.dataset.posterAutoSlideAttached =
    "true";


  let timer = null;


  function start() {

    if (
      window.innerWidth > 800
    ) {

      return;

    }


    const cards =
      slider.querySelectorAll(
        ".poster-card"
      );


    if (
      cards.length < 2
    ) {

      return;

    }


    let index = 0;


    timer =
      setInterval(
        () => {

          index =
            (index + 1) %
            cards.length;


          slider.scrollTo({
  left: cards[index].offsetLeft,
  behavior: "smooth"
});

        },
        2000
      );

  }


  function stop() {

    if (timer) {

      clearInterval(
        timer
      );

      timer =
        null;

    }

  }


  start();


  window.addEventListener(
    "resize",
    () => {

      stop();

      start();

    }
  );


  slider.addEventListener(
    "touchstart",
    stop,
    {
      passive:
        true
    }
  );


  slider.addEventListener(
    "touchend",
    () => {

      setTimeout(
        start,
        3000
      );

    },
    {
      passive:
        true
    }
  );

}


initializePosterAutoSlide();


/* =========================================================
   IMAGE FALLBACK
========================================================= */

document.addEventListener(
  "error",
  (event) => {

    const target =
      event.target;


    if (
      target &&
      target.tagName ===
        "IMG"
    ) {

      target.classList.add(
        "image-load-failed"
      );

    }

  },
  true
);


/* =========================================================
   LAST PAGE RESTORE
========================================================= */

function restoreLastPage() {

  const user =
    localStorage.getItem(
      "nakshatraUser"
    );


  if (!user) {

    return;

  }


  const lastPage =
    localStorage.getItem(
      "lastPage"
    );


  if (
    lastPage &&
    document.getElementById(
      lastPage + "Page"
    )
  ) {

    openPage(
      lastPage
    );

  }

}


/* =========================================================
   APP VISIBILITY
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.visibilityState ===
      "visible"
    ) {

      console.log(
        "Nakshatra Jyoti active."
      );

    }

  }
);


/* =========================================================
   ONLINE / OFFLINE STATUS
========================================================= */

window.addEventListener(
  "online",
  () => {

    console.log(
      "Internet connection restored."
    );

  }
);


window.addEventListener(
  "offline",
  () => {

    console.warn(
      "Internet connection unavailable."
    );

  }
);
/* =========================================================
   NAKSHATRA JYOTI
   FINAL PART 3
   ACCOUNT + PROFILE + SETTINGS + MESSAGES
   NAVIGATION + STORAGE + UI PROTECTION
========================================================= */


/* =========================================================
   ACCOUNT DRAWER
========================================================= */

function refreshAccountDrawer() {

  const user =
    firebaseAuth?.currentUser;


  if (!user) {

    return;

  }


  updateUserUI(
    user
  );


  const theme =
    localStorage.getItem(
      "theme"
    ) || "light";


  updateThemeUI(
    theme
  );


  const language =
    localStorage.getItem(
      "language"
    ) || "hi";


  const languageText =
    $("accountLanguage");


  if (languageText) {

    languageText.textContent =
      language === "hi"
        ? "हिन्दी"
        : "English";

  }

}


/* =========================================================
   ACCOUNT BUTTON
========================================================= */

/*
   The main account click handler is registered once in the core
   navigation section.  This section intentionally does not add a
   second listener, which prevents duplicate drawer actions.
*/


/* =========================================================
   ACCOUNT CLOSE
========================================================= */

$("closeAccountDrawer")?.addEventListener(
  "click",
  () => {

    closeAccountDrawer();

  }
);


/* =========================================================
   ACCOUNT OVERLAY
========================================================= */

$("accountOverlay")?.addEventListener(
  "click",
  () => {

    closeAccountDrawer();

  }
);


/* =========================================================
   ACCOUNT PROFILE EDIT
========================================================= */

$("editProfileButton")?.addEventListener(
  "click",
  async () => {

    const user =
      firebaseAuth?.currentUser;


    if (!user) {

      return;

    }


    const currentName =
      user.displayName ||
      user.email?.split("@")[0] ||
      "";


    const newName =
      window.prompt(
        "अपना नाम दर्ज करें:",
        currentName
      );


    if (
      newName === null
    ) {

      return;

    }


    const name =
      newName.trim();


    if (
      name.length < 2
    ) {

      window.alert(
        "नाम कम से कम 2 अक्षरों का होना चाहिए।"
      );


      return;

    }


    try {

      await firebaseAuthModule
        .updateProfile(
          user,
          {
            displayName:
              name
          }
        );


      updateUserUI(
        user
      );


      saveLocalUserData(
        user
      );


      refreshAccountDrawer();


      window.alert(
        "प्रोफाइल अपडेट हो गई।"
      );


    } catch (error) {

      console.error(
        "Profile update error:",
        error
      );


      window.alert(
        "प्रोफाइल अपडेट नहीं हो पाई। कृपया दोबारा प्रयास करें।"
      );

    }

  }
);


/* =========================================================
   LANGUAGE QUICK CHANGE
========================================================= */

function changeApplicationLanguage(
  language
) {

  if (
    language !== "hi" &&
    language !== "en"
  ) {

    language =
      "hi";

  }


  selectedLanguage =
    language;


  localStorage.setItem(
    "language",
    language
  );


  document
    .querySelectorAll(
      ".language"
    )
    .forEach(
      (button) => {

        button.classList.toggle(
          "active",
          button.dataset.lang ===
            language
        );

      }
    );


  const languageText =
    $("accountLanguage");


  if (languageText) {

    languageText.textContent =
      language === "hi"
        ? "हिन्दी"
        : "English";

  }


  console.log(
    "Language changed:",
    language
  );

}


/* =========================================================
   HINDI LANGUAGE BUTTON
========================================================= */

$("accountHindi")?.addEventListener(
  "click",
  () => {

    changeApplicationLanguage(
      "hi"
    );

  }
);


/* =========================================================
   ENGLISH LANGUAGE BUTTON
========================================================= */

$("accountEnglish")?.addEventListener(
  "click",
  () => {

    changeApplicationLanguage(
      "en"
    );

  }
);


/* =========================================================
   THEME OPTIONS
========================================================= */

$("themeLight")?.addEventListener(
  "click",
  () => {

    applyTheme(
      "light"
    );

  }
);


$("themeDark")?.addEventListener(
  "click",
  () => {

    applyTheme(
      "dark"
    );

  }
);


/* =========================================================
   SETTINGS SUMMARY
========================================================= */

function refreshSettingsSummary() {

  const theme =
    localStorage.getItem(
      "theme"
    ) || "light";


  const language =
    localStorage.getItem(
      "language"
    ) || "hi";


  const themeElement =
    $("settingsTheme");


  if (themeElement) {

    themeElement.textContent =
      theme === "dark"
        ? "डार्क"
        : "लाइट";

  }


  const languageElement =
    $("settingsLanguage");


  if (languageElement) {

    languageElement.textContent =
      language === "hi"
        ? "हिन्दी"
        : "English";

  }

}


refreshSettingsSummary();


/* =========================================================
   SETTINGS OBSERVER
========================================================= */

window.addEventListener(
  "storage",
  () => {

    refreshSettingsSummary();

  }
);


/* =========================================================
   MESSAGES DATA
========================================================= */

const MESSAGE_STORAGE_KEY =
  "nakshatraMessages";


function getMessages() {

  try {

    const data =
      JSON.parse(
        localStorage.getItem(
          MESSAGE_STORAGE_KEY
        ) || "[]"
      );


    if (
      Array.isArray(
        data
      )
    ) {

      return data;

    }

  } catch (error) {

    console.warn(
      "Message storage error:",
      error
    );

  }


  return [];

}


/* =========================================================
   SAVE MESSAGE
========================================================= */

function saveMessage(
  message
) {

  const messages =
    getMessages();


  messages.push({

    id:
      Date.now(),

    text:
      message,

    createdAt:
      new Date().toISOString(),

    read:
      false

  });


  localStorage.setItem(
    MESSAGE_STORAGE_KEY,
    JSON.stringify(
      messages
    )
  );


  renderMessages();

}


/* =========================================================
   MARK ALL MESSAGES READ
========================================================= */

function markMessagesRead() {

  const messages =
    getMessages();


  const updated =
    messages.map(
      (message) => {

        return {

          ...message,

          read:
            true

        };

      }
    );


  localStorage.setItem(
    MESSAGE_STORAGE_KEY,
    JSON.stringify(
      updated
    )
  );


  updateMessageBadge();

}


/* =========================================================
   DELETE MESSAGE
========================================================= */

function deleteMessage(
  id
) {

  const messages =
    getMessages();


  const filtered =
    messages.filter(
      (message) => {

        return message.id !==
          id;

      }
    );


  localStorage.setItem(
    MESSAGE_STORAGE_KEY,
    JSON.stringify(
      filtered
    )
  );


  renderMessages();

}


/* =========================================================
   RENDER MESSAGES
========================================================= */

function renderMessages() {

  const box =
    $("messagesContainer");


  if (!box) {

    return;

  }


  const messages =
    getMessages();


  if (
    !messages.length
  ) {

    box.innerHTML = `

      <div class="message-empty">

        <div class="message-empty-icon">
          💬
        </div>

        <h3>
          अभी कोई संदेश नहीं है
        </h3>

        <p>
          आपके महत्वपूर्ण संदेश यहाँ दिखाई देंगे।
        </p>

      </div>

    `;


    updateMessageBadge();


    return;

  }


  box.innerHTML =
    messages
      .slice()
      .reverse()
      .map(
        (message) => {

          const date =
            formatMessageDate(
              message.createdAt
            );


          return `

            <article
              class="message-item"
              data-message-id="${message.id}"
              style="
                padding:18px;
                margin-bottom:12px;
                border:1px solid var(--border);
                border-radius:17px;
                background:var(--white);
              "
            >

              <div
                style="
                  display:flex;
                  align-items:flex-start;
                  justify-content:space-between;
                  gap:10px;
                "
              >

                <div>

                  <strong>
                    Nakshatra Jyoti
                  </strong>

                  <small
                    style="
                      display:block;
                      color:var(--muted);
                      margin-top:3px;
                    "
                  >
                    ${escapeHTML(date)}
                  </small>

                </div>


                <button
                  type="button"
                  data-delete-message="${message.id}"
                  style="
                    border:0;
                    background:transparent;
                    cursor:pointer;
                    font-size:18px;
                  "
                >
                  ×
                </button>

              </div>


              <p
                style="
                  margin-top:12px;
                  color:var(--muted);
                "
              >
                ${escapeHTML(message.text)}
              </p>

            </article>

          `;

        }
      )
      .join("");


  box
    .querySelectorAll(
      "[data-delete-message]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(
                button.dataset.deleteMessage
              );


            deleteMessage(
              id
            );

          }
        );

      }
    );


  updateMessageBadge();

}


/* =========================================================
   MESSAGE DATE
========================================================= */

function formatMessageDate(
  value
) {

  if (!value) {

    return "";

  }


  const date =
    new Date(
      value
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "";

  }


  try {

    return date.toLocaleString(
      "hi-IN",
      {
        dateStyle:
          "medium",
        timeStyle:
          "short"
      }
    );

  } catch {

    return date.toLocaleString();

  }

}


/* =========================================================
   MESSAGE BADGE
========================================================= */

function updateMessageBadge() {

  const messages =
    getMessages();


  const unread =
    messages.filter(
      (message) =>
        !message.read
    ).length;


  document
    .querySelectorAll(
      ".message-badge"
    )
    .forEach(
      (badge) => {

        if (
          unread > 0
        ) {

          badge.textContent =
            unread > 9
              ? "9+"
              : String(
                  unread
                );

          badge.style.display =
            "flex";

        } else {

          badge.style.display =
            "none";

        }

      }
    );

}


renderMessages();


/* =========================================================
   MESSAGE PAGE OPEN
========================================================= */

document
  .querySelectorAll(
    '[data-page="messages"]'
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          setTimeout(
            () => {

              markMessagesRead();

              renderMessages();

            },
            100
          );

        }
      );

    }
  );


/* =========================================================
   GUIDANCE REQUEST HISTORY
========================================================= */

async function getGuidanceRequests() {

  try {

    const user =
      firebaseAuth?.currentUser || null;

    if (
      !user ||
      !firebaseReady ||
      !firebaseDb ||
      !firebaseFirestoreModule
    ) {
      return [];
    }

    const snapshot =
      await firebaseFirestoreModule.getDocs(
        firebaseFirestoreModule.query(
          firebaseFirestoreModule.collection(
            firebaseDb,
            "guidanceRequests"
          ),
          firebaseFirestoreModule.where(
            "userId",
            "==",
            user.uid
          )
        )
      );

    return snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data()
      })
    );

  } catch (error) {

    console.error(
      "Guidance requests load error:",
      error
    );

    return [];
  }
}


/* =========================================================
   RENDER REQUEST HISTORY
========================================================= */

async function renderGuidanceHistory() {

  const container =
    $("guidanceHistory");


  if (!container) {

    return;

  }


  const requests =
    await getGuidanceRequests();


  if (
    !requests.length
  ) {

    container.innerHTML = `

      <div class="message-empty">

        <div class="message-empty-icon">
          ✦
        </div>

        <h3>
          अभी कोई अनुरोध नहीं है
        </h3>

        <p>
          आपके मार्गदर्शन अनुरोध यहाँ दिखाई देंगे।
        </p>

      </div>

    `;


    return;

  }


  container.innerHTML =
    requests
      .slice()
      .reverse()
      .map(
        (item) => `

          <article
            style="
              padding:18px;
              margin-bottom:12px;
              border:1px solid var(--border);
              border-radius:17px;
              background:var(--white);
            "
          >

            <div class="section-label">
              ${escapeHTML(
                item.category ||
                "मार्गदर्शन"
              )}
            </div>

            <h3>
              ${escapeHTML(
                item.topic ||
                "सामान्य मार्गदर्शन"
              )}
            </h3>

            <p
              style="
                color:var(--muted);
                margin-top:6px;
              "
            >
              ${escapeHTML(
                item.name ||
                ""
              )}
              •
              ${escapeHTML(
                item.place ||
                ""
              )}
            </p>

            <small
              style="
                display:block;
                color:var(--muted);
                margin-top:8px;
              "
            >
              ${escapeHTML(
                formatMessageDate(
                  item.createdAt
                )
              )}
            </small>

          </article>

        `
      )
      .join("");

}


renderGuidanceHistory();


/* =========================================================
   RE-RENDER HISTORY WHEN PAGE OPENS
========================================================= */

document
  .querySelectorAll(
    "[data-page]"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          setTimeout(
            () => {

              renderGuidanceHistory();

            },
            150
          );

        }
      );

    }
  );


/* =========================================================
   CLEAR HISTORY
========================================================= */

$("clearGuidanceHistory")
  ?.addEventListener(
    "click",
    () => {

      const confirmed =
        window.confirm(
          "क्या आप सभी पुराने मार्गदर्शन अनुरोध हटाना चाहते हैं?"
        );


      if (!confirmed) {

        return;

      }


      localStorage.removeItem(
        "nakshatraGuidanceRequests"
      );


      renderGuidanceHistory();

    }
  );


/* =========================================================
   CLEAR MESSAGES
========================================================= */

$("clearMessages")
  ?.addEventListener(
    "click",
    () => {

      const confirmed =
        window.confirm(
          "क्या आप सभी संदेश हटाना चाहते हैं?"
        );


      if (!confirmed) {

        return;

      }


      localStorage.removeItem(
        MESSAGE_STORAGE_KEY
      );


      renderMessages();

    }
  );


/* =========================================================
   HOME WELCOME MESSAGE
========================================================= */

function updateWelcomeMessage() {

  const element =
    $("welcomeUser");


  if (!element) {

    return;

  }


  const user =
    firebaseAuth?.currentUser;


  const name =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "आप";


  element.textContent =
    `नमस्कार ${name} जी`;

}


updateWelcomeMessage();


/* =========================================================
   USER STATE REFRESH
========================================================= */

/*
   Authentication state is already handled by initializeFirebase().
   Keeping a second onAuthStateChanged listener here caused duplicate
   UI refreshes and made account state harder to reason about.
*/


/* =========================================================
   HOME BUTTON
========================================================= */

document
  .querySelectorAll(
    '[data-page="home"]'
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          closeAccountDrawer();

          window.scrollTo({
            top:
              0,
            behavior:
              "smooth"
          });

        }
      );

    }
  );


/* =========================================================
   BOTTOM NAV SCROLL SAFETY
========================================================= */

function updateBottomNavSpace() {

  const nav =
    document.querySelector(
      ".bottom-nav"
    );


  if (!nav) {

    return;

  }


  const height =
    nav.offsetHeight;


  document.documentElement
    .style
    .setProperty(
      "--bottom-nav-space",
      `${height + 35}px`
    );

}


updateBottomNavSpace();


window.addEventListener(
  "resize",
  updateBottomNavSpace
);


/* =========================================================
   SAFE PAGE NAVIGATION
========================================================= */

window.addEventListener(
  "popstate",
  () => {

    const page =
      new URLSearchParams(
        window.location.search
      ).get(
        "page"
      );


    if (
      page &&
      document.getElementById(
        page + "Page"
      )
    ) {

      openPage(
        page
      );

    }

  }
);


/* =========================================================
   UPDATE URL WITHOUT RELOAD
========================================================= */

const originalOpenPage =
  window.openNakshatraPage;


window.openNakshatraPage =
  function(
    pageName
  ) {

    if (
      typeof openPage ===
      "function"
    ) {

      openPage(
        pageName
      );

    }

  };


/* =========================================================
   DOUBLE CLICK PROTECTION
========================================================= */

document.addEventListener(
  "click",
  (event) => {

    const button =
      event.target.closest(
        "button"
      );


    if (!button) {

      return;

    }


    if (
      button.dataset.processing ===
      "true"
    ) {

      event.preventDefault();

      return;

    }


    if (
      button.dataset.noLock ===
      "true"
    ) {

      return;

    }


    if (
      button.classList.contains(
        "submit"
      ) ||
      button.id ===
        "loginButton"
    ) {

      return;

    }

  },
  true
);


/* =========================================================
   LOGIN FORM ENTER KEY
========================================================= */

$("loginPassword")
  ?.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        $("loginButton")
          ?.click();

      }

    }
  );


$("loginEmail")
  ?.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        $("loginButton")
          ?.click();

      }

    }
  );


/* =========================================================
   REGISTER USERNAME ENTER KEY
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key !==
      "Enter"
    ) {

      return;

    }


    const target =
      event.target;


    if (
      target?.id ===
      "registerUsername"
    ) {

      event.preventDefault();

      $("loginButton")
        ?.click();

    }

  }
);


/* =========================================================
   INPUT AUTO SAVE
========================================================= */

const autoSaveFields = [

  "careerUserName",
  "careerUserDob",
  "careerUserTob",
  "careerUserPlace",
  "careerUserQuestion",

  "marriageName",
  "marriageDob",
  "marriageTob",
  "marriagePlace",
  "marriageQuestion",

  "muhuratName",
  "muhuratDob",
  "muhuratTob",
  "muhuratPlace",
  "muhuratQuestion",

  "educationName",
  "educationDob",
  "educationTob",
  "educationPlace",
  "educationQuestion"

];


function initializeAutoSave() {

  autoSaveFields.forEach(
    (id) => {

      const input =
        $(id);


      if (!input) {

        return;

      }

      /* Prevent duplicate input listeners when the service UI is
         rendered again after DOMContentLoaded. */
      if (
        input.dataset.autoSaveAttached ===
        "true"
      ) {

        return;

      }


      const storageKey =
        "draft_" + id;


      const saved =
        localStorage.getItem(
          storageKey
        );


      if (
        saved !== null
      ) {

        input.value =
          saved;

      }


      input.addEventListener(
        "input",
        () => {

          localStorage.setItem(
            storageKey,
            input.value
          );

        }
      );

      input.dataset.autoSaveAttached =
        "true";

    }
  );

}


initializeAutoSave();


/* =========================================================
   CLEAR DRAFT AFTER SUBMISSION
========================================================= */

function clearDraft(
  prefix
) {

  const fields = [

    "Name",
    "Dob",
    "Tob",
    "Place",
    "Question"

  ];


  fields.forEach(
    (field) => {

      localStorage.removeItem(
        "draft_" +
        prefix +
        field
      );

    }
  );

}


/* =========================================================
   PAGE LOADED FINALIZATION
========================================================= */

function finalizeApplication() {

  /* Rebuild dynamic service content after the DOM is ready.
     The guards in the event handlers and autosave system make this
     safe even when script.js is loaded at the end of <body>. */
  initializeServicePages();

  renderCareerTopics();

  restoreLanguageButton();

  refreshSettingsSummary();

  initializePosters();

  initializePosterAutoSlide();

  initializeAutoSave();

  updateMessageBadge();

  renderMessages();

  renderGuidanceHistory();

  updateBottomNavSpace();

  updateWelcomeMessage();

  console.log(
    "Nakshatra Jyoti application finalized successfully."
  );

}


if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    finalizeApplication
  );

} else {

  finalizeApplication();

}


/* =========================================================
   GLOBAL ERROR SAFETY
========================================================= */

window.addEventListener(
  "error",
  (event) => {

    console.error(
      "Application error:",
      event.error ||
      event.message
    );

  }
);


/* =========================================================
   PROMISE ERROR SAFETY
========================================================= */

window.addEventListener(
  "unhandledrejection",
  (event) => {

    console.error(
      "Unhandled promise rejection:",
      event.reason
    );

  }
);


/* =========================================================
   APP VERSION
========================================================= */

const NAKSHATRA_APP_VERSION =
  "3.1.0-role-stable";


localStorage.setItem(
  "nakshatraAppVersion",
  NAKSHATRA_APP_VERSION
);


console.log(
  "Nakshatra Jyoti version:",
  NAKSHATRA_APP_VERSION
);


/* =========================================================
   FINAL READY MESSAGE
========================================================= */

console.log(
  "================================================="
);

console.log(
  " NAKSHATRA JYOTI READY"
);

console.log(
  " Firebase Authentication: ENABLED"
);

console.log(
  " Language System: ENABLED"
);

console.log(
  " Theme System: ENABLED"
);

console.log(
  " Account System: ENABLED"
);

console.log(
  " Guidance System: ENABLED"
);

console.log(
  " Career System: ENABLED"
);

console.log(
  " Marriage System: ENABLED"
);

console.log(
  " Muhurat System: ENABLED"
);

console.log(
  " Education System: ENABLED"
);

console.log(
  " Message System: ENABLED"
);

console.log(
  "================================================="
);

/* =========================================================
   NAKSHATRA JYOTI
   FINAL PRODUCT LAYER
   CLOUD CHAT + AI + BLOG CMS + ADMIN + PROFILE
   Existing features are intentionally preserved.
========================================================= */

(() => {

  "use strict";

  const FIREBASE_VERSION = "12.16.0";

  const ACHARYA_DEFAULTS = [
    {
      id: "acharya1",
      name: "ज्योतिषाचार्य शुभांशु दुबे",
      speciality: "वैदिक ज्योतिष • जन्म-कुंडली • प्रश्न परामर्श",
      image: "./assets/acharyas/acharya1.jpg",
      qualification: "वैदिक ज्योतिष एवं जन्म-कुंडली अध्ययन",
      bio: "व्यक्तिगत प्रश्नों, जन्म-कुंडली और वैदिक ज्योतिषीय विषयों पर परामर्श।",
      phone: "",
      instagram: "",
      facebook: "",
      uid: ""
    },
    {
      id: "acharya2",
      name: "श्रीकांत मिश्रा",
      speciality: "वैदिक ज्योतिष • परामर्श",
      image: "./assets/acharyas/acharya2.jpg",
      qualification: "वैदिक अध्ययन एवं ज्योतिषीय परामर्श",
      bio: "जीवन के महत्वपूर्ण निर्णयों के लिए संरचित वैदिक मार्गदर्शन।",
      phone: "",
      instagram: "",
      facebook: "",
      uid: ""
    },
    {
      id: "acharya3",
      name: "सिद्धांत मिश्रा",
      speciality: "वैदिक ज्योतिष • परामर्श",
      image: "./assets/acharyas/acharya3.jpg",
      qualification: "संस्कृत, वैदिक परंपरा एवं ज्योतिषीय अध्ययन",
      bio: "परंपरागत ज्ञान, संस्कृत अध्ययन और व्यक्तिगत मार्गदर्शन पर केंद्रित।",
      phone: "",
      instagram: "",
      facebook: "",
      uid: ""
    }
  ];

  let featureReady = false;
  let currentRole = "user";
  let currentProfile = null;
  let currentConversation = null;
  let currentChatUnsubscribe = null;
  let currentConversationUnsubscribe = null;
  let blogCache = [];
  let aiMessages = [];
  let lastConversationSnapshotSignature = "";
  let notificationPermissionRequested = false;

  const aiFunctionUrl =
    "https://us-central1-nakshatra-jyoti.cloudfunctions.net/askAI";

  const F = () => firebaseFirestoreModule;
  const DB = () => firebaseDb;
  const USER = () => firebaseAuth?.currentUser || null;

  function safeText(value) {
    if (typeof escapeHTML === "function") {
      return escapeHTML(String(value ?? ""));
    }

    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getAuthUser() {
    return USER();
  }

  function firestoreReady() {
    return Boolean(firebaseReady && DB() && F());
  }

  function roleCanManageContent() {
    return currentRole === "admin" || currentRole === "acharya";
  }

  function roleCanManageAdmin() {
    return currentRole === "admin";
  }

  async function ensureUserProfile() {
    const user = getAuthUser();
    if (!user || !firestoreReady()) return null;

    const ref = F().doc(DB(), "users", user.uid);
    const snap = await F().getDoc(ref);

    if (!snap.exists()) {
      const profile = {
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "User",
        email: user.email || "",
        role: "user",
        language: localStorage.getItem("language") || "hi",
        theme: localStorage.getItem("theme") || "light",
        createdAt: F().serverTimestamp(),
        updatedAt: F().serverTimestamp()
      };

      await F().setDoc(ref, profile);
      currentProfile = profile;
      currentRole = "user";
      return profile;
    }

    currentProfile = snap.data();
    currentRole = currentProfile.role || "user";
    return currentProfile;
  }

  async function resolveAdminRole() {
    const user = getAuthUser();
    if (!user || !firestoreReady()) return false;

    const adminRef = F().doc(DB(), "admins", user.uid);
    const adminSnap = await F().getDoc(adminRef);

    if (adminSnap.exists()) {
      currentRole = "admin";
      if (currentProfile) currentProfile.role = "admin";
      return true;
    }

    return false;
  }

  async function ensureRoleAndProfile() {
    try {
      const user = getAuthUser();

      if (!user) {
        currentProfile = null;
        currentRole = "user";
        refreshRoleUI();
        refreshRoleDashboard();
        return null;
      }

      // Always read the user's Firestore profile first.
      await ensureUserProfile();

      // The admins/{uid} document is the authoritative admin marker.
      // It is checked before the normal users/{uid}.role value.
      const isAdmin = await resolveAdminRole();

      if (!isAdmin) {
        currentRole = currentProfile?.role === "acharya"
          ? "acharya"
          : "user";
      }

      refreshRoleUI();
      ensureRoleDashboardShell();
      refreshRoleDashboard();

      // Only an Admin should create/update the default Acharya documents.
      // Normal users and Acharyas must never attempt that write.
      if (currentRole === "admin") {
        await syncAcharyaDefaults();
      }

      await loadBlog();
      await loadSiteSettings();
      startSiteSettingsRealtime();
      wireRashifalGrid();
      startRashifalRealtime();
      startHomeFeedRealtime();
      wireFeedPillAndLoadMore();
      startNotificationCenterRealtime();
      startPresenceHeartbeat();
      startPresenceRealtime();
      startAcharyasRealtime();
      await loadMessagesInbox();
      await renderAdminStats();
      await renderAdminPosts();
      await renderAdminAcharyas();

      return currentRole;
    } catch (error) {
      console.warn("Feature profile initialization failed:", error);
      currentRole = "user";
      refreshRoleUI();
      refreshRoleDashboard();
      return "user";
    }
  }

  /* =========================================================
     ROLE-AWARE DASHBOARD
     One dashboard route is created dynamically so the existing
     public pages stay intact. Admin/Acharya access is controlled by
     the resolved Firebase role, not by a localStorage flag.
  ========================================================= */

  function ensureRoleDashboardShell() {
    let page = document.getElementById("roleDashboardPage");
    if (!page) {
      page = document.createElement("section");
      page.id = "roleDashboardPage";
      page.className = "page role-dashboard-page";
      document.querySelector("main")?.appendChild(page);
    }

    const menu = document.getElementById("sideMenu");
    if (menu && !document.getElementById("roleDashboardMenuButton")) {
      const divider = document.createElement("div");
      divider.className = "menu-divider role-menu-divider";
      divider.id = "roleDashboardDivider";

      const button = document.createElement("button");
      button.id = "roleDashboardMenuButton";
      button.type = "button";
      button.className = "role-dashboard-menu-button";
      button.innerHTML = `<span id="roleDashboardMenuIcon">🛡️</span><span id="roleDashboardMenuText">डैशबोर्ड</span>`;

      menu.appendChild(divider);
      menu.appendChild(button);

      button.addEventListener("click", () => {
        if (currentRole === "admin" || currentRole === "acharya") {
          openPage("roleDashboard");
          refreshRoleDashboard();
        } else {
          showFeatureToast("यह पैनल केवल अधिकृत अकाउंट के लिए है।");
        }
      });
    }

    let roleBadge = document.getElementById("drawerAccountRole");
    if (!roleBadge) {
      const email = document.getElementById("drawerAccountEmail");
      if (email?.parentElement) {
        roleBadge = document.createElement("span");
        roleBadge.id = "drawerAccountRole";
        roleBadge.className = "profile-role-badge user";
        email.parentElement.appendChild(roleBadge);
      }
    }
  }

  function roleDisplayName() {
    if (currentRole === "admin") return "Super Administrator";
    if (currentRole === "acharya") return "Acharya";
    return "User";
  }

  function buildRoleDashboard() {
    const page = document.getElementById("roleDashboardPage");
    if (!page) return;

    const user = getAuthUser();
    const name = currentProfile?.name || user?.displayName || user?.email?.split("@")[0] || "User";
    const email = user?.email || currentProfile?.email || "";

    if (currentRole === "admin") {
      page.innerHTML = `
        <div class="page-heading role-dashboard-heading">
          <div class="section-label">ADMINISTRATION</div>
          <h1>Admin Dashboard</h1>
          <p>नक्षत्र ज्योति की सामग्री, आचार्य प्रोफ़ाइल और cloud data का प्रबंधन।</p>
        </div>

        <div class="role-identity-card">
          <div class="role-avatar">🛡️</div>
          <div><strong>${safeText(name)}</strong><small>${safeText(email)}</small></div>
          <span class="profile-role-badge admin">Super Administrator</span>
        </div>

        <div class="role-shortcuts super-admin-shortcuts">
          <button type="button" data-role-action="messages">💬 User Messages</button>
          <button type="button" data-role-action="acharya-public">👁️ सार्वजनिक आचार्य पेज</button>
        </div>

        <div id="adminStats" class="admin-stats-grid"></div>

        <section class="role-panel">
          <div class="role-panel-heading">
            <div><div class="section-label">ACHARYA VICHAR • CONTENT STUDIO</div><h2>आचार्य विचार / लेख प्रबंधन</h2></div>
          </div>
          <form id="postForm" class="admin-post-form">
            <input id="postId" type="hidden">
            <label>शीर्षक<input id="postTitle" type="text" maxlength="180" required></label>
            <label>संक्षिप्त विवरण<input id="postExcerpt" type="text" maxlength="300"></label>
            <label>श्रेणी<select id="postCategory"><option value="jyotish">ज्योतिष</option><option value="kundli">कुंडली</option><option value="muhurat">मुहूर्त</option><option value="guidance">मार्गदर्शन</option><option value="other">अन्य</option></select></label>
            <label>मीडिया प्रकार</label>
            <select id="postMediaType">
              <option value="photo">📷 फोटो</option>
              <option value="video">🎥 वीडियो</option>
            </select>
            <div id="postPhotoFieldWrap">
              <label>Cover फोटो</label>
              ${window.NJPhoto.fieldHTML({ id: "postCoverUrl", aspect: "16/9", folder: "posts" })}
            </div>
            <div id="postVideoFieldWrap" hidden>
              <label>वीडियो</label>
              <div class="video-upload-field">
                <input id="postVideoFileInput" type="file" accept="video/*" hidden>
                <button id="postVideoChooseButton" class="secondary-button" type="button">🎥 वीडियो चुनें</button>
                <video id="postVideoPreview" controls hidden></video>
                <div id="postVideoStatus" class="crop-status"></div>
                <input id="postVideoUrl" type="hidden">
              </div>
            </div>
            <label>विचार / लेख<textarea id="postContent" rows="8" required placeholder="आज का विचार लिखें…"></textarea></label>
            <label class="checkbox-line"><input id="postPublished" type="checkbox" checked> प्रकाशित करें</label>
            <div class="role-actions"><button class="primary-button" type="submit">लेख सुरक्षित करें</button><button id="resetPostForm" class="secondary-button" type="button">नया लेख</button></div>
            <div id="postFormStatus" class="form-status"></div>
          </form>
          <div id="adminPostList" class="admin-post-list"></div>
        </section>

        <section class="role-panel super-admin-panel">
          <div class="section-label">SUPER ADMIN • HOME CONTROL</div>
          <h2>होम पोस्टर बदलें</h2>
          <p class="role-muted">यहाँ से Home के तीन मुख्य posters और उनके शीर्षक बदल सकते हैं।</p>
          <form id="siteSettingsForm" class="admin-post-form">
            <div class="super-admin-grid">
              <div>
                <label>Poster 1 फोटो</label>
                ${window.NJPhoto.fieldHTML({ id: "sitePoster1", aspect: "16/9", folder: "posters" })}
                <label>Poster 1 शीर्षक<input id="sitePoster1Title" type="text" maxlength="120" placeholder="आज का मार्गदर्शन"></label>
              </div>
              <div>
                <label>Poster 2 फोटो</label>
                ${window.NJPhoto.fieldHTML({ id: "sitePoster2", aspect: "16/9", folder: "posters" })}
                <label>Poster 2 शीर्षक<input id="sitePoster2Title" type="text" maxlength="120" placeholder="वैदिक दृष्टि"></label>
              </div>
              <div>
                <label>Poster 3 फोटो</label>
                ${window.NJPhoto.fieldHTML({ id: "sitePoster3", aspect: "16/9", folder: "posters" })}
                <label>Poster 3 शीर्षक<input id="sitePoster3Title" type="text" maxlength="120" placeholder="नक्षत्र ज्योति"></label>
              </div>
            </div>
            <div class="role-actions">
              <button class="primary-button" type="submit">पोस्टर सुरक्षित करें</button>
              <button id="resetSiteSettings" class="secondary-button" type="button">Default वापस करें</button>
            </div>
            <div id="siteSettingsStatus" class="form-status"></div>
          </form>
        </section>

        <section class="role-panel">
          <div class="section-label">ACHARYA MANAGEMENT</div>
          <h2>आचार्य प्रोफ़ाइल</h2>
          <p class="role-muted">यहीं से नया आचार्य जोड़ें, Firebase UID जोड़कर role दें, और फोटो/फोन/परिचय बदलें।</p>

          <form id="adminAddAcharyaForm" class="admin-acharya-form admin-add-acharya-form">
            <div class="admin-acharya-head">
              <div class="role-avatar">ॐ</div>
              <div><strong>नया आचार्य</strong><small>Firebase account पहले बनाकर UID यहाँ डालें।</small></div>
            </div>
            <div class="admin-form-row">
              <label>नाम<input name="name" required maxlength="120" placeholder="आचार्य का नाम"></label>
              <label>Firebase UID<input name="uid" required placeholder="Firebase Authentication UID"></label>
            </div>
            <div class="admin-form-row">
              <label>विशेषज्ञता<input name="speciality" placeholder="वैदिक ज्योतिष • प्रश्न परामर्श"></label>
              <label>फोन<input name="phone" placeholder="+91…"></label>
            </div>
            <div class="admin-form-row">
              <label>Instagram URL<input name="instagram" placeholder="https://instagram.com/..."></label>
              <label>Facebook URL<input name="facebook" placeholder="https://facebook.com/..."></label>
            </div>
            <label>योग्यता<input name="qualification" placeholder="शिक्षा / योग्यता"></label>
            <label>परिचय<textarea name="bio" placeholder="आचार्य का परिचय"></textarea></label>
            <label>राशिफल अनुमति (Assigned Rashis)</label>
            <div class="admin-rashi-checks">
              ${RASHI_LIST.map((r) => `
                <label class="checkbox-line rashi-check">
                  <input type="checkbox" name="assignedRashis" value="${r.id}"> ${r.symbol} ${r.name}
                </label>`).join("")}
            </div>
            <label>फोटो</label>
            ${window.NJPhoto.fieldHTML({ name: "image", aspect: "1", folder: "acharyas" })}
            <label class="checkbox-line"><input name="active" type="checkbox" checked> उपलब्ध दिखाएँ</label>
            <button class="primary-button" type="submit">आचार्य जोड़ें</button>
            <div id="adminAddAcharyaStatus" class="form-status"></div>
          </form>

          <div id="adminAcharyaList"></div>
        </section>

        <section class="role-panel">
          <div class="section-label">SUPER ADMIN • NOTIFICATIONS</div>
          <h2>📢 विशेष सूचना</h2>
          <p class="role-muted">यह सूचना सभी logged-in Users/Acharyas के Notification Center में तुरंत दिखेगी।</p>
          <form id="adminAnnouncementForm" class="admin-post-form">
            <label>Title<input id="announcementTitle" type="text" maxlength="120" required placeholder="विशेष सूचना"></label>
            <label>Message<textarea id="announcementBody" rows="3" required maxlength="500" placeholder="आज शाम नई जानकारी उपलब्ध होगी।"></textarea></label>
            <button class="primary-button" type="submit">Publish</button>
            <div id="announcementStatus" class="form-status"></div>
          </form>
        </section>

        <section class="role-panel">
          <div class="section-label">SUPER ADMIN • GUIDANCE</div>
          <h2>📋 Guidance Requests (Monitor)</h2>
          <p class="role-muted">सभी उपयोगकर्ताओं के मार्गदर्शन अनुरोध और उनकी स्थिति यहाँ दिखती है।</p>
          <div id="adminGuidanceList" class="admin-guidance-list">
            <div class="admin-empty">लोड हो रहा है…</div>
          </div>
        </section>
      `;
      return;
    }

    if (currentRole === "acharya") {
      page.innerHTML = `
        <div class="page-heading role-dashboard-heading">
          <div class="section-label">ACHARYA PANEL</div>
          <h1>आचार्य पैनल</h1>
          <p>आपके account, लेख और निजी मार्गदर्शन अनुरोध यहाँ उपलब्ध हैं।</p>
        </div>

        <div class="role-identity-card">
          <div class="role-avatar">ॐ</div>
          <div><strong>${safeText(name)}</strong><small>${safeText(email)}</small></div>
          <span class="profile-role-badge acharya">Acharya</span>
        </div>

        <div class="role-shortcuts">
          <button type="button" data-role-action="messages">💬 निजी संदेश</button>
          <button type="button" data-role-action="acharya-public">👁️ मेरी सार्वजनिक प्रोफ़ाइल</button>
        </div>

        <section class="role-panel">
          <div class="section-label">MY CONTENT</div>
          <h2>मेरे लेख</h2>
          <form id="postForm" class="admin-post-form">
            <input id="postId" type="hidden">
            <label>शीर्षक<input id="postTitle" type="text" maxlength="180" required></label>
            <label>संक्षिप्त विवरण<input id="postExcerpt" type="text" maxlength="300"></label>
            <label>श्रेणी<select id="postCategory"><option value="jyotish">ज्योतिष</option><option value="kundli">कुंडली</option><option value="muhurat">मुहूर्त</option><option value="guidance">मार्गदर्शन</option><option value="other">अन्य</option></select></label>
            <label>मीडिया प्रकार</label>
            <select id="postMediaType">
              <option value="photo">📷 फोटो</option>
              <option value="video">🎥 वीडियो</option>
            </select>
            <div id="postPhotoFieldWrap">
              <label>Cover फोटो</label>
              ${window.NJPhoto.fieldHTML({ id: "postCoverUrl", aspect: "16/9", folder: "posts" })}
            </div>
            <div id="postVideoFieldWrap" hidden>
              <label>वीडियो</label>
              <div class="video-upload-field">
                <input id="postVideoFileInput" type="file" accept="video/*" hidden>
                <button id="postVideoChooseButton" class="secondary-button" type="button">🎥 वीडियो चुनें</button>
                <video id="postVideoPreview" controls hidden></video>
                <div id="postVideoStatus" class="crop-status"></div>
                <input id="postVideoUrl" type="hidden">
              </div>
            </div>
            <label>विचार / लेख<textarea id="postContent" rows="8" required placeholder="आज का विचार लिखें…"></textarea></label>
            <label class="checkbox-line"><input id="postPublished" type="checkbox" checked> प्रकाशित करें</label>
            <div class="role-actions"><button class="primary-button" type="submit">लेख सुरक्षित करें</button><button id="resetPostForm" class="secondary-button" type="button">नया लेख</button></div>
            <div id="postFormStatus" class="form-status"></div>
          </form>
          <div id="adminPostList" class="admin-post-list"></div>
        </section>

        <section class="role-panel">
          <div class="section-label">GUIDANCE</div>
          <h2>📋 मार्गदर्शन अनुरोध</h2>
          <p class="role-muted">User द्वारा भेजे गए अनुरोधों का उत्तर यहाँ से दें। उत्तर देते ही User को notification मिलेगा।</p>
          <div id="acharyaGuidanceList" class="admin-guidance-list">
            <div class="admin-empty">लोड हो रहा है…</div>
          </div>
        </section>

        <section class="role-panel">
          <div class="section-label">TODAY'S RASHIFAL</div>
          <h2>🔮 आज का राशिफल</h2>
          <p class="role-muted">आप केवल Admin द्वारा assign की गई राशियों का राशिफल publish/update कर सकते हैं।</p>
          <div id="rashifalEditorGrid" class="rashifal-editor-grid">
            <div class="rashifal-loading">लोड हो रहा है…</div>
          </div>
        </section>

        <section class="role-panel">
          <div class="section-label">PROFILE</div>
          <h2>👤 मेरी Profile</h2>
          <div class="role-profile-grid">
            <div><small>ईमेल</small><strong>${safeText(email)}</strong></div>
            <div><small>भूमिका</small><strong>Acharya</strong></div>
            <div><small>Firebase UID</small><strong>${safeText(user?.uid || "")}</strong></div>
          </div>
          <p class="role-muted">फोटो, नाम, योग्यता, विशेषता और परिचय अपडेट करें — बदलाव तुरंत Firebase Storage/Firestore में सुरक्षित होंगे।</p>
          <div id="acharyaOwnProfileBox">
            <div class="admin-empty">लोड हो रहा है…</div>
          </div>
        </section>
      `;
      return;
    }

    page.innerHTML = `
      <div class="page-heading"><div class="section-label">ACCOUNT</div><h1>डैशबोर्ड उपलब्ध नहीं</h1><p>यह पैनल केवल Admin और Acharya accounts के लिए है।</p></div>
    `;
  }

  function wireRoleDashboardEvents() {
    const page = document.getElementById("roleDashboardPage");
    if (!page || page.dataset.roleEvents === "true") return;
    page.dataset.roleEvents = "true";

    page.addEventListener("click", (event) => {
      const action = event.target.closest("[data-role-action]")?.dataset.roleAction;
      if (!action) return;
      if (action === "messages") {
        openPage("messages");
        showMessagesInbox?.();
        loadMessagesInbox?.();
      }
      if (action === "acharya-public") {
        openPage("acharya");
      }
    });
  }

  function wireRoleDashboardForms() {
    const form = document.getElementById("postForm");
    if (form && form.dataset.roleFormWired !== "true") {
      form.dataset.roleFormWired = "true";
      form.addEventListener("submit", savePost);
    }

    wirePostMediaTypeToggle();
    wirePostVideoUpload();

    const reset = document.getElementById("resetPostForm");
    if (reset && reset.dataset.roleResetWired !== "true") {
      reset.dataset.roleResetWired = "true";
      reset.addEventListener("click", resetPostForm);
    }

    const siteForm = document.getElementById("siteSettingsForm");
    if (siteForm && siteForm.dataset.siteSettingsWired !== "true") {
      siteForm.dataset.siteSettingsWired = "true";
      siteForm.addEventListener("submit", saveSiteSettings);
    }

    const siteReset = document.getElementById("resetSiteSettings");
    if (siteReset && siteReset.dataset.siteResetWired !== "true") {
      siteReset.dataset.siteResetWired = "true";
      siteReset.addEventListener("click", clearSitePosterSettings);
    }

    const addAcharyaForm = document.getElementById("adminAddAcharyaForm");
    if (addAcharyaForm && addAcharyaForm.dataset.addAcharyaWired !== "true") {
      addAcharyaForm.dataset.addAcharyaWired = "true";
      addAcharyaForm.addEventListener("submit", saveAdminAcharya);
    }

    wireAdminAnnouncementForm();
  }

  function wirePostMediaTypeToggle() {
    const select = $id("postMediaType");
    if (!select || select.dataset.wired === "true") return;
    select.dataset.wired = "true";

    const apply = () => {
      const isVideo = select.value === "video";
      $id("postPhotoFieldWrap").hidden = isVideo;
      $id("postVideoFieldWrap").hidden = !isVideo;
    };

    select.addEventListener("change", apply);
    apply();
  }

  function wirePostVideoUpload() {
    const button = $id("postVideoChooseButton");
    const input = $id("postVideoFileInput");
    if (!button || !input || button.dataset.wired === "true") return;
    button.dataset.wired = "true";

    button.addEventListener("click", () => input.click());

    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;

      const status = $id("postVideoStatus");
      const preview = $id("postVideoPreview");
      const user = getAuthUser();

      if (!user) {
        if (status) status.textContent = "वीडियो अपलोड के लिए login ज़रूरी है।";
        return;
      }

      if (!firebaseStorage || !firebaseStorageModule) {
        if (status) status.textContent = "Storage अभी तैयार नहीं है, कुछ सेकंड बाद फिर कोशिश करें।";
        return;
      }

      // Show a local instant preview while the real upload runs in
      // the background — the user never has to wait to see their pick.
      preview.src = URL.createObjectURL(file);
      preview.hidden = false;
      if (status) status.textContent = "अपलोड हो रहा है… 0%";

      try {
        const path = `uploads/${user.uid}/posts/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.replace(/[^a-zA-Z0-9.]+/g, "_")}`;
        const storageRef = firebaseStorageModule.ref(firebaseStorage, path);
        const task = firebaseStorageModule.uploadBytesResumable(storageRef, file, {
          contentType: file.type || "video/mp4"
        });

        task.on(
          "state_changed",
          (snapshot) => {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            if (status) status.textContent = `अपलोड हो रहा है… ${pct}%`;
          },
          (error) => {
            console.error("Video upload error:", error);
            if (status) status.textContent = "वीडियो अपलोड नहीं हो सका। कृपया फिर कोशिश करें।";
          },
          async () => {
            const url = await firebaseStorageModule.getDownloadURL(task.snapshot.ref);
            $id("postVideoUrl").value = url;
            if (status) status.textContent = "✅ वीडियो अपलोड हो गया।";
          }
        );
      } catch (error) {
        console.error("Video upload error:", error);
        if (status) status.textContent = "वीडियो अपलोड नहीं हो सका। कृपया फिर कोशिश करें।";
      }
    });
  }


  function refreshRoleDashboard() {
    ensureRoleDashboardShell();
    buildRoleDashboard();
    wireRoleDashboardEvents();
    wireRoleDashboardForms();

    if (currentRole === "admin") {
      loadSiteSettings().then((settings) => {
        [
          ["sitePoster1", settings.poster1],
          ["sitePoster2", settings.poster2],
          ["sitePoster3", settings.poster3],
          ["sitePoster1Title", settings.poster1Title],
          ["sitePoster2Title", settings.poster2Title],
          ["sitePoster3Title", settings.poster3Title]
        ].forEach(([id, value]) => {
          const input = $(id);
          if (input && !input.value) input.value = value || "";
          window.NJPhoto?.syncPreview(input);
        });
      });
      renderAdminGuidanceMonitor();
    }

    if (currentRole === "acharya") {
      renderRashifalEditor();
      renderAcharyaGuidance();
      renderAcharyaOwnProfileForm();
    }

    const menuButton = document.getElementById("roleDashboardMenuButton");
    const divider = document.getElementById("roleDashboardDivider");
    const allowed = currentRole === "admin" || currentRole === "acharya";

    if (menuButton) {
      menuButton.style.display = allowed ? "flex" : "none";
      const icon = document.getElementById("roleDashboardMenuIcon");
      const text = document.getElementById("roleDashboardMenuText");
      if (icon) icon.textContent = currentRole === "admin" ? "🛡️" : "ॐ";
      if (text) text.textContent = currentRole === "admin" ? "Admin Dashboard" : "आचार्य पैनल";
    }
    if (divider) divider.style.display = allowed ? "block" : "none";
  }

  function refreshRoleUI() {
    ensureRoleDashboardShell();

    document.querySelectorAll(".admin-only").forEach((el) => {
      if (roleCanManageContent()) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    });

    document.querySelectorAll(".admin-only-page").forEach((el) => {
      if (roleCanManageContent()) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    });

    const role = $("drawerAccountRole");
    if (role) {
      role.textContent =
        currentRole === "admin"
          ? "Super Administrator"
          : currentRole === "acharya"
            ? "Acharya"
            : "User";
      role.className = "profile-role-badge " + currentRole;
    }
  }

  async function syncAcharyaDefaults() {
    if (!firestoreReady() || !getAuthUser()) return;

    const batch = F().writeBatch(DB());

    for (const item of ACHARYA_DEFAULTS) {
      const ref = F().doc(DB(), "acharyas", item.id);
      const snap = await F().getDoc(ref);
      if (!snap.exists()) {
        batch.set(ref, {
          ...item,
          active: true,
          updatedAt: F().serverTimestamp()
        });
      }
    }

    await batch.commit();
  }

  function defaultAcharyaImage(id) {
    const fallback = ACHARYA_DEFAULTS.find((item) => item.id === id);
    return fallback?.image || "./assets/acharyas/acharya1.jpg";
  }

  function normalizeAcharya(item) {
    const normalized = { ...item };
    const image = String(normalized.image || "").trim();
    const looksLikeImage =
      image.startsWith("./") ||
      image.startsWith("../") ||
      image.startsWith("/") ||
      /^https?:\/\//i.test(image) ||
      /^data:image\//i.test(image);

    if (!looksLikeImage) {
      normalized.image = defaultAcharyaImage(normalized.id);
    }
    if (!normalized.image) normalized.image = defaultAcharyaImage(normalized.id);
    normalized.active = normalized.active !== false;
    return normalized;
  }

  // Realtime cache: the "acharyas" collection is now kept in sync with
  // a single onSnapshot listener (same pattern already used for the
  // poster, rashifal, feed, notifications, and presence elsewhere in
  // this file) instead of a fresh one-time getDocs() on every call.
  // getAcharyas() keeps its exact previous signature/behavior for every
  // existing caller — only the data source underneath changed.
  let acharyasRawCache = null;
  let acharyasRealtimeStarted = false;

  function mergeAcharyaList(cloud) {
    const map = new Map(cloud.map((item) => [item.id, item]));

    const mergedDefaults = ACHARYA_DEFAULTS.map((fallback) =>
      normalizeAcharya({
        ...fallback,
        ...(map.get(fallback.id) || {})
      })
    );

    const knownIds = new Set(ACHARYA_DEFAULTS.map((item) => item.id));
    const extras = cloud
      .filter((item) => !knownIds.has(item.id))
      .map(normalizeAcharya);

    return [...mergedDefaults, ...extras];
  }

  function startAcharyasRealtime() {
    if (acharyasRealtimeStarted || !firestoreReady()) return;
    acharyasRealtimeStarted = true;

    F().onSnapshot(
      F().collection(DB(), "acharyas"),
      (snap) => {
        acharyasRawCache = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((item) => item.id !== "__siteSettings");

        // Re-render whichever acharya-facing view happens to be open
        // right now; each of these functions already no-ops safely if
        // its container isn't in the DOM.
        renderCallCards();
        enhanceAcharyaPage();
        renderAdminAcharyas();
      },
      (error) => {
        console.warn("Acharyas realtime error:", error);
        acharyasRealtimeStarted = false;
      }
    );
  }

  async function getAcharyas() {
    if (acharyasRawCache) return mergeAcharyaList(acharyasRawCache);
    if (!firestoreReady()) return ACHARYA_DEFAULTS.map(normalizeAcharya);

    // Before the realtime listener's first snapshot arrives, fall back
    // to a one-time read so the very first render isn't left empty.
    try {
      const snap = await F().getDocs(F().collection(DB(), "acharyas"));
      const cloud = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((item) => item.id !== "__siteSettings");
      return mergeAcharyaList(cloud);
    } catch (error) {
      console.warn("Acharya profiles could not be loaded:", error);
      return ACHARYA_DEFAULTS.map(normalizeAcharya);
    }
  }


  async function getAcharyaById(id) {
    const list = await getAcharyas();
    return list.find((item) => item.id === id) || list[0];
  }

  async function getMyAcharyaRecord() {
    const user = getAuthUser();
    if (!user || !firestoreReady()) return null;

    try {
      const q = F().query(
        F().collection(DB(), "acharyas"),
        F().where("uid", "==", user.uid)
      );
      const snap = await F().getDocs(q);
      if (snap.empty) return null;
      const d = snap.docs[0];
      return { id: d.id, ...d.data() };
    } catch (error) {
      console.warn("Could not load own Acharya record:", error);
      return null;
    }
  }

  /* =========================================================
     ACHARYA — SELF-SERVICE PROFILE EDIT
     Updates the SAME acharyas/{id} document Admin manages (no
     duplicate collection). An Acharya may edit their own photo,
     name, qualification, speciality and bio; only Admin may
     change assignedRashis / active status / contact links.
  ========================================================= */

  async function renderAcharyaOwnProfileForm() {
    const box = $id("acharyaOwnProfileBox");
    if (!box || currentRole !== "acharya") return;

    const mine = await getMyAcharyaRecord();

    if (!mine) {
      box.innerHTML = `<div class="rashifal-empty">आपकी Acharya प्रोफ़ाइल Firebase UID से नहीं जुड़ी मिली। कृपया Admin से संपर्क करें ताकि वे "आचार्य प्रबंधन" में आपका UID जोड़ सकें।</div>`;
      return;
    }

    box.innerHTML = `
      <form id="acharyaOwnProfileForm" class="admin-post-form">
        <input id="acharyaOwnProfileId" type="hidden" value="${safeText(mine.id)}">
        <label>फोटो</label>
        ${window.NJPhoto.fieldHTML({ id: "acharyaOwnProfileImage", value: mine.image || "", aspect: "1", folder: "acharyas" })}
        <label>नाम<input id="acharyaOwnProfileName" type="text" value="${safeText(mine.name || "")}" required></label>
        <label>योग्यता<input id="acharyaOwnProfileQualification" type="text" value="${safeText(mine.qualification || "")}"></label>
        <label>विशेषता<input id="acharyaOwnProfileSpeciality" type="text" value="${safeText(mine.speciality || "")}"></label>
        <label>परिचय<textarea id="acharyaOwnProfileBio" rows="4">${safeText(mine.bio || "")}</textarea></label>
        <div class="role-actions">
          <button class="primary-button" type="submit">💾 सुरक्षित करें</button>
        </div>
        <div id="acharyaOwnProfileStatus" class="form-status"></div>
      </form>
    `;

    // Cropper click-to-open is handled by a single delegated listener
    // NJPhoto already attaches at document level — no per-field wiring
    // call needed here, same as every other dynamically injected
    // NJPhoto.fieldHTML() field in this app (postForm, admin acharya
    // forms, etc.).
    const form = $id("acharyaOwnProfileForm");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = $id("acharyaOwnProfileStatus");
      const id = $id("acharyaOwnProfileId").value;

      const payload = {
        name: $id("acharyaOwnProfileName").value.trim(),
        qualification: $id("acharyaOwnProfileQualification").value.trim(),
        speciality: $id("acharyaOwnProfileSpeciality").value.trim(),
        bio: $id("acharyaOwnProfileBio").value.trim(),
        image: isSafeMediaUrl($id("acharyaOwnProfileImage").value.trim())
          ? $id("acharyaOwnProfileImage").value.trim()
          : mine.image || ""
      };

      if (!payload.name) {
        status.textContent = "नाम आवश्यक है।";
        return;
      }

      status.textContent = "सुरक्षित हो रहा है…";
      try {
        await F().updateDoc(F().doc(DB(), "acharyas", id), payload);
        status.textContent = "✅ Profile अपडेट हो गई। सार्वजनिक पेज पर अगली बार खुलने पर दिखेगी।";
      } catch (error) {
        console.error("Acharya self profile save error:", error);
        status.textContent = "❌ सुरक्षित नहीं हुआ। Firestore rules जाँचें (acharyas/{id}.uid आपके login से मेल खाना चाहिए)।";
      }
    });
  }

  /* =========================================================
     RASHIFAL — 12 zodiac signs
     Firestore: rashifal/{signId}
       { sign, signId, date, text, updatedBy, updatedByUid, updatedAt }
     An Acharya may only write signs listed in their own
     acharyas/{id}.assignedRashis array (Admin sets this).
  ========================================================= */
  const RASHI_LIST = [
    { id: "mesh", symbol: "♈", name: "मेष" },
    { id: "vrishabh", symbol: "♉", name: "वृषभ" },
    { id: "mithun", symbol: "♊", name: "मिथुन" },
    { id: "kark", symbol: "♋", name: "कर्क" },
    { id: "singh", symbol: "♌", name: "सिंह" },
    { id: "kanya", symbol: "♍", name: "कन्या" },
    { id: "tula", symbol: "♎", name: "तुला" },
    { id: "vrishchik", symbol: "♏", name: "वृश्चिक" },
    { id: "dhanu", symbol: "♐", name: "धनु" },
    { id: "makar", symbol: "♑", name: "मकर" },
    { id: "kumbh", symbol: "♒", name: "कुंभ" },
    { id: "meen", symbol: "♓", name: "मीन" }
  ];

  let rashifalData = {};
  let rashifalRealtimeStarted = false;

  function todayDateLabel() {
    return new Date().toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function renderRashifalGrid() {
    const grid = $id("rashifalGrid");
    if (!grid) return;

    grid.innerHTML = RASHI_LIST.map((r) => {
      const item = rashifalData[r.id];
      const hasText = Boolean(item?.text?.trim());
      return `
        <button type="button" class="rashifal-box" data-rashi="${r.id}">
          <span class="rashifal-symbol">${r.symbol}</span>
          <span class="rashifal-name">${r.name}</span>
          <span class="rashifal-updated-badge">${hasText ? "अपडेट" : "जल्द आएगा"}</span>
        </button>`;
    }).join("");
  }

  function startRashifalRealtime() {
    if (rashifalRealtimeStarted || !firestoreReady()) return;
    rashifalRealtimeStarted = true;

    F().onSnapshot(
      F().collection(DB(), "rashifal"),
      (snap) => {
        const map = {};
        snap.forEach((d) => { map[d.id] = d.data(); });
        rashifalData = map;
        renderRashifalGrid();
      },
      (error) => {
        console.warn("Rashifal realtime error:", error);
        rashifalRealtimeStarted = false;
      }
    );
  }

  function openRashifalDetail(signId) {
    const rashi = RASHI_LIST.find((r) => r.id === signId);
    if (!rashi) return;
    const item = rashifalData[signId];

    $id("rashifalDetailSymbol").textContent = rashi.symbol;
    $id("rashifalDetailName").textContent = rashi.name;
    $id("rashifalDetailDate").textContent = item?.date || todayDateLabel();
    $id("rashifalDetailText").textContent = item?.text?.trim()
      ? item.text
      : "इस राशि के लिए आज का राशिफल अभी उपलब्ध नहीं है। कृपया बाद में देखें।";
    $id("rashifalDetailMeta").textContent = item?.updatedBy
      ? `— ${item.updatedBy} द्वारा अपडेट`
      : "";

    $id("rashifalDetailOverlay")?.classList.add("show");
  }

  function closeRashifalDetail() {
    $id("rashifalDetailOverlay")?.classList.remove("show");
  }

  function wireRashifalGrid() {
    const grid = $id("rashifalGrid");
    if (grid && grid.dataset.wired !== "true") {
      grid.dataset.wired = "true";
      grid.addEventListener("click", (event) => {
        const box = event.target.closest("[data-rashi]");
        if (!box) return;
        openRashifalDetail(box.dataset.rashi);
      });
    }

    const overlay = $id("rashifalDetailOverlay");
    if (overlay && overlay.dataset.wired !== "true") {
      overlay.dataset.wired = "true";
      $id("rashifalDetailClose")?.addEventListener("click", closeRashifalDetail);
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeRashifalDetail();
      });
    }
  }

  async function renderRashifalEditor() {
    const box = $id("rashifalEditorGrid");
    if (!box || currentRole !== "acharya") return;

    const mine = await getMyAcharyaRecord();
    const assigned = new Set(mine?.assignedRashis || []);

    // The realtime listener may not have delivered data yet (e.g. editor
    // opened before the Home grid ever mounted) — fall back to one read.
    if (!rashifalRealtimeStarted && firestoreReady()) {
      try {
        const snap = await F().getDocs(F().collection(DB(), "rashifal"));
        const map = {};
        snap.forEach((d) => { map[d.id] = d.data(); });
        rashifalData = { ...map, ...rashifalData };
      } catch (error) {
        console.warn("Rashifal editor load error:", error);
      }
    }

    if (!mine) {
      box.innerHTML = `<div class="rashifal-empty">आपकी Acharya प्रोफ़ाइल Firebase UID से नहीं जुड़ी मिली। कृपया Admin से संपर्क करें।</div>`;
      return;
    }

    if (!assigned.size) {
      box.innerHTML = `<div class="rashifal-empty">आपको अभी कोई राशि assign नहीं की गई है। Admin "आचार्य प्रबंधन" से राशि assign कर सकते हैं।</div>`;
      return;
    }

    box.innerHTML = RASHI_LIST.map((r) => {
      const locked = !assigned.has(r.id);
      const item = rashifalData[r.id];
      return `
        <div class="rashifal-editor-card ${locked ? "locked" : ""}" data-rashi-editor="${r.id}">
          <div class="rashifal-editor-head">
            <span>${r.symbol}</span><span>${r.name}</span>
            ${locked ? '<span class="lock-note">🔒 Assigned नहीं</span>' : ""}
          </div>
          <textarea data-rashi-text ${locked ? "disabled" : ""} maxlength="600" placeholder="आज का राशिफल लिखें…">${item?.text ? safeText(item.text) : ""}</textarea>
          <div class="rashifal-editor-actions">
            <span class="rashifal-editor-status" data-rashi-status></span>
            ${locked ? "" : '<button type="button" class="primary-button" data-rashi-save>Publish / Update</button>'}
          </div>
        </div>`;
    }).join("");

    box.querySelectorAll("[data-rashi-save]").forEach((button) => {
      button.addEventListener("click", async () => {
        const card = button.closest("[data-rashi-editor]");
        const signId = card.dataset.rashiEditor;
        if (!assigned.has(signId)) return;

        const rashi = RASHI_LIST.find((r) => r.id === signId);
        const textarea = card.querySelector("[data-rashi-text]");
        const status = card.querySelector("[data-rashi-status]");
        const text = textarea.value.trim();

        button.disabled = true;
        if (status) status.textContent = "सुरक्षित हो रहा है…";

        try {
          await F().setDoc(
            F().doc(DB(), "rashifal", signId),
            {
              sign: rashi.name,
              signId,
              date: todayDateLabel(),
              text,
              updatedBy: currentProfile?.name || getAuthUser()?.email || "Acharya",
              updatedByUid: getAuthUser()?.uid || "",
              updatedAt: F().serverTimestamp()
            },
            { merge: true }
          );

          if (status) status.textContent = "✅ अपडेट हो गया।";
        } catch (error) {
          console.error("Rashifal save error:", error);
          if (status) status.textContent = "❌ सुरक्षित नहीं हुआ। Firestore rules जाँचें।";
        } finally {
          button.disabled = false;
        }
      });
    });
  }

  /* =========================================================
     POSTS / THOUGHTS FEED (Instagram-style, realtime)
     Reuses the existing "posts" collection (same one the Blog
     page reads) — no duplicate collection. Adds: authorPhoto,
     mediaType/videoUrl, likedBy/likeCount, commentCount, and a
     posts/{id}/comments subcollection.
  ========================================================= */

  let feedPosts = [];
  let feedListenerStarted = false;
  let feedPendingNew = [];
  let feedOldestSnapDoc = null;
  let feedHasMoreOlder = true;
  const feedCommentUnsubs = {};
  const feedOpenComments = new Set();

  function feedRelativeTime(ts) {
    const ms = timestampMs(ts);
    if (!ms) return "";
    const diff = Date.now() - ms;
    const min = Math.floor(diff / 60000);
    if (min < 1) return "अभी";
    if (min < 60) return `${min} मिनट पहले`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} घंटे पहले`;
    const day = Math.floor(hr / 24);
    if (day < 7) return `${day} दिन पहले`;
    return formatFeatureDate(ts);
  }

  function feedCardHTML(post) {
    const uid = getAuthUser()?.uid || "";
    const liked = Array.isArray(post.likedBy) && post.likedBy.includes(uid);
    const isOwn = post.authorUid === uid;
    const canDelete = isOwn || roleCanManageAdmin();

    return `
      <article class="feed-card" data-post-id="${safeText(post.id)}">
        <div class="feed-card-head">
          <img class="feed-avatar" src="${safeText(post.authorPhoto || "./assets/acharyas/acharya1.jpg")}" alt="${safeText(post.authorName)}">
          <div class="feed-head-text">
            <strong>${safeText(post.authorName || "आचार्य")}</strong>
            <small>${safeText(feedRelativeTime(post.createdAt))}</small>
          </div>
          ${canDelete ? `<button class="feed-delete-button" data-feed-delete="${safeText(post.id)}" type="button" aria-label="हटाएँ">🗑️</button>` : ""}
        </div>

        ${post.excerpt || post.title ? `<p class="feed-caption">${safeText(post.excerpt || post.title)}</p>` : ""}

        ${post.mediaType === "video" && post.videoUrl
          ? `<video class="feed-media" src="${safeText(post.videoUrl)}" controls playsinline></video>`
          : post.coverUrl
            ? `<img class="feed-media" src="${safeText(post.coverUrl)}" alt="${safeText(post.title)}">`
            : ""
        }

        <div class="feed-actions">
          <button class="feed-action-button ${liked ? "liked" : ""}" data-feed-like="${safeText(post.id)}" type="button">
            ${liked ? "❤️" : "🤍"} <span data-feed-like-count>${post.likeCount || 0}</span>
          </button>
          <button class="feed-action-button" data-feed-comment-toggle="${safeText(post.id)}" type="button">
            💬 <span data-feed-comment-count>${post.commentCount || 0}</span>
          </button>
          <button class="feed-action-button" data-feed-share="${safeText(post.id)}" type="button">↗ Share</button>
          <button class="text-link feed-read-more" data-feed-read="${safeText(post.id)}" type="button">पूरा लेख पढ़ें →</button>
        </div>

        <div class="feed-comments" data-feed-comments-box="${safeText(post.id)}" hidden>
          <div class="feed-comments-list" data-feed-comments-list></div>
          <form class="feed-comment-form" data-feed-comment-form="${safeText(post.id)}">
            <input type="text" maxlength="300" placeholder="टिप्पणी लिखें…" data-feed-comment-input required>
            <button type="submit">भेजें</button>
          </form>
        </div>
      </article>`;
  }

  function renderInitialFeed() {
    const box = $id("homeFeed");
    if (!box) return;

    if (!feedPosts.length) {
      box.innerHTML = `<div class="feed-empty">📝 अभी कोई विचार प्रकाशित नहीं हुआ है।</div>`;
      return;
    }

    box.innerHTML = feedPosts.map(feedCardHTML).join("");
  }

  function patchFeedCardInPlace(post) {
    const card = document.querySelector(`.feed-card[data-post-id="${CSS.escape(post.id)}"]`);
    if (!card) return;

    const uid = getAuthUser()?.uid || "";
    const liked = Array.isArray(post.likedBy) && post.likedBy.includes(uid);
    const likeButton = card.querySelector("[data-feed-like]");
    if (likeButton) {
      likeButton.classList.toggle("liked", liked);
      likeButton.innerHTML = `${liked ? "❤️" : "🤍"} <span data-feed-like-count>${post.likeCount || 0}</span>`;
    }
    const commentCount = card.querySelector("[data-feed-comment-count]");
    if (commentCount) commentCount.textContent = post.commentCount || 0;
  }

  function showFeedNewPostsPill() {
    const pill = $id("feedNewPostsPill");
    const countEl = $id("feedNewPostsCount");
    if (!pill || !countEl) return;
    countEl.textContent = feedPendingNew.length;
    pill.hidden = feedPendingNew.length === 0;
  }

  function flushFeedPendingNew() {
    if (!feedPendingNew.length) return;
    feedPosts = [...feedPendingNew.reverse(), ...feedPosts];
    feedPendingNew = [];
    renderInitialFeed();
    wireFeedCardEvents();
    showFeedNewPostsPill();
    $id("homeFeed")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startHomeFeedRealtime() {
    if (feedListenerStarted || !firestoreReady()) return;
    feedListenerStarted = true;

    const q = F().query(
      F().collection(DB(), "posts"),
      F().where("published", "==", true),
      F().orderBy("createdAt", "desc"),
      F().limit(20)
    );

    let initialLoadDone = false;

    F().onSnapshot(
      q,
      (snap) => {
        if (!initialLoadDone) {
          feedPosts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          feedOldestSnapDoc = snap.docs[snap.docs.length - 1] || null;
          feedHasMoreOlder = snap.docs.length === 20;
          $id("feedLoadOlder").hidden = !feedHasMoreOlder;
          renderInitialFeed();
          wireFeedCardEvents();
          initialLoadDone = true;
          return;
        }

        snap.docChanges().forEach((change) => {
          const data = { id: change.doc.id, ...change.doc.data() };

          if (change.type === "added") {
            if (feedPosts.some((p) => p.id === data.id) || feedPendingNew.some((p) => p.id === data.id)) return;
            feedPendingNew.push(data);
            showFeedNewPostsPill();
          } else if (change.type === "modified") {
            const idx = feedPosts.findIndex((p) => p.id === data.id);
            if (idx !== -1) {
              feedPosts[idx] = data;
              patchFeedCardInPlace(data);
            }
          } else if (change.type === "removed") {
            feedPosts = feedPosts.filter((p) => p.id !== data.id);
            document.querySelector(`.feed-card[data-post-id="${CSS.escape(data.id)}"]`)?.remove();
          }
        });
      },
      (error) => {
        console.warn("Home feed realtime error:", error);
        feedListenerStarted = false;
      }
    );
  }

  async function loadOlderFeedPosts() {
    if (!feedHasMoreOlder || !feedOldestSnapDoc || !firestoreReady()) return;

    const button = $id("feedLoadOlder");
    if (button) { button.disabled = true; button.textContent = "लोड हो रहा है…"; }

    try {
      const q = F().query(
        F().collection(DB(), "posts"),
        F().where("published", "==", true),
        F().orderBy("createdAt", "desc"),
        F().startAfter(feedOldestSnapDoc),
        F().limit(10)
      );
      const snap = await F().getDocs(q);
      const older = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      feedOldestSnapDoc = snap.docs[snap.docs.length - 1] || feedOldestSnapDoc;
      feedHasMoreOlder = snap.docs.length === 10;

      feedPosts = [...feedPosts, ...older];

      const box = $id("homeFeed");
      if (box) box.insertAdjacentHTML("beforeend", older.map(feedCardHTML).join(""));
      wireFeedCardEvents();

      if (button) {
        button.hidden = !feedHasMoreOlder;
        button.disabled = false;
        button.textContent = "पुराने विचार लोड करें";
      }
    } catch (error) {
      console.error("Load older posts error:", error);
      if (button) { button.disabled = false; button.textContent = "पुराने विचार लोड करें"; }
      showFeatureToast("पुराने विचार लोड नहीं हो सके।");
    }
  }

  async function toggleFeedLike(postId) {
    const user = getAuthUser();
    if (!user || !firestoreReady()) return;

    const post = feedPosts.find((p) => p.id === postId) || feedPendingNew.find((p) => p.id === postId);
    if (!post) return;

    const liked = Array.isArray(post.likedBy) && post.likedBy.includes(user.uid);

    // Optimistic local update so the tap feels instant, then reconcile
    // with the realtime "modified" event when Firestore confirms it.
    post.likedBy = liked
      ? (post.likedBy || []).filter((id) => id !== user.uid)
      : [...(post.likedBy || []), user.uid];
    post.likeCount = Math.max(0, (post.likeCount || 0) + (liked ? -1 : 1));
    patchFeedCardInPlace(post);

    try {
      await F().updateDoc(F().doc(DB(), "posts", postId), {
        likedBy: liked ? F().arrayRemove(user.uid) : F().arrayUnion(user.uid),
        likeCount: F().increment(liked ? -1 : 1)
      });
    } catch (error) {
      console.error("Like toggle error:", error);
      // Revert optimistic change on failure.
      post.likedBy = liked
        ? [...(post.likedBy || []), user.uid]
        : (post.likedBy || []).filter((id) => id !== user.uid);
      post.likeCount = Math.max(0, (post.likeCount || 0) + (liked ? 1 : -1));
      patchFeedCardInPlace(post);
      showFeatureToast("Like सुरक्षित नहीं हुआ।");
    }
  }

  function toggleFeedComments(postId) {
    const box = document.querySelector(`[data-feed-comments-box="${CSS.escape(postId)}"]`);
    if (!box) return;

    const isOpen = feedOpenComments.has(postId);
    if (isOpen) {
      box.hidden = true;
      feedOpenComments.delete(postId);
      feedCommentUnsubs[postId]?.();
      delete feedCommentUnsubs[postId];
      return;
    }

    box.hidden = false;
    feedOpenComments.add(postId);

    if (!firestoreReady()) return;

    const listEl = box.querySelector("[data-feed-comments-list]");
    listEl.innerHTML = `<div class="feed-comments-loading">लोड हो रहा है…</div>`;

    const q = F().query(
      F().collection(DB(), "posts", postId, "comments"),
      F().orderBy("createdAt", "asc"),
      F().limit(100)
    );

    feedCommentUnsubs[postId] = F().onSnapshot(
      q,
      (snap) => {
        const uid = getAuthUser()?.uid || "";
        const comments = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        listEl.innerHTML = comments.length
          ? comments.map((c) => `
              <div class="feed-comment-row" data-comment-id="${safeText(c.id)}">
                <img src="${safeText(c.photo || "./assets/acharyas/acharya1.jpg")}" alt="">
                <div class="feed-comment-body">
                  <strong>${safeText(c.name || "User")}</strong>
                  <p>${safeText(c.text)}</p>
                </div>
                ${c.uid === uid ? `<button class="feed-comment-delete" data-feed-comment-delete="${safeText(c.id)}" data-feed-comment-post="${safeText(postId)}" type="button">×</button>` : ""}
              </div>`).join("")
          : `<div class="feed-comments-empty">सबसे पहले टिप्पणी करें।</div>`;

        listEl.querySelectorAll("[data-feed-comment-delete]").forEach((button) => {
          button.addEventListener("click", () => deleteFeedComment(button.dataset.feedCommentPost, button.dataset.feedCommentDelete));
        });
      },
      (error) => {
        console.warn("Feed comments listener error:", error);
        listEl.innerHTML = `<div class="feed-comments-empty">टिप्पणियाँ लोड नहीं हो सकीं।</div>`;
      }
    );
  }

  async function submitFeedComment(postId, text) {
    const user = getAuthUser();
    if (!user || !firestoreReady() || !text.trim()) return;

    const myAcharya = currentRole === "acharya" ? await getMyAcharyaRecord() : null;

    try {
      await F().addDoc(F().collection(DB(), "posts", postId, "comments"), {
        uid: user.uid,
        name: currentProfile?.name || myAcharya?.name || user.displayName || user.email?.split("@")[0] || "User",
        photo: myAcharya?.image || "",
        text: text.trim(),
        createdAt: F().serverTimestamp()
      });

      await F().updateDoc(F().doc(DB(), "posts", postId), {
        commentCount: F().increment(1)
      });
    } catch (error) {
      console.error("Add comment error:", error);
      showFeatureToast("टिप्पणी सुरक्षित नहीं हुई।");
    }
  }

  async function deleteFeedComment(postId, commentId) {
    if (!firestoreReady()) return;
    if (!window.confirm("यह टिप्पणी हटानी है?")) return;

    try {
      await F().deleteDoc(F().doc(DB(), "posts", postId, "comments", commentId));
      await F().updateDoc(F().doc(DB(), "posts", postId), {
        commentCount: F().increment(-1)
      });
    } catch (error) {
      console.error("Delete comment error:", error);
      showFeatureToast("टिप्पणी हटाई नहीं जा सकी।");
    }
  }

  async function shareFeedPost(postId) {
    const post = feedPosts.find((p) => p.id === postId);
    if (!post) return;

    const shareUrl = `${location.origin}${location.pathname}#post-${postId}`;
    const shareData = {
      title: post.title || "Nakshatra Jyoti",
      text: post.excerpt || post.title || "",
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch (error) {
      // User cancelled the native share sheet — no error toast needed.
      if (error?.name === "AbortError") return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showFeatureToast("लिंक कॉपी हो गया।");
    } catch (error) {
      window.prompt("इस लिंक को कॉपी करें:", shareUrl);
    }
  }

  function wireFeedCardEvents() {
    const box = $id("homeFeed");
    if (!box || box.dataset.wired === "true") return;
    box.dataset.wired = "true";

    box.addEventListener("click", (event) => {
      const likeBtn = event.target.closest("[data-feed-like]");
      if (likeBtn) return toggleFeedLike(likeBtn.dataset.feedLike);

      const commentToggle = event.target.closest("[data-feed-comment-toggle]");
      if (commentToggle) return toggleFeedComments(commentToggle.dataset.feedCommentToggle);

      const shareBtn = event.target.closest("[data-feed-share]");
      if (shareBtn) return shareFeedPost(shareBtn.dataset.feedShare);

      const readBtn = event.target.closest("[data-feed-read]");
      if (readBtn) return openBlogPost(readBtn.dataset.feedRead);

      const deleteBtn = event.target.closest("[data-feed-delete]");
      if (deleteBtn) return deletePost(deleteBtn.dataset.feedDelete);
    });

    box.addEventListener("submit", (event) => {
      const form = event.target.closest("[data-feed-comment-form]");
      if (!form) return;
      event.preventDefault();
      const input = form.querySelector("[data-feed-comment-input]");
      const text = input.value;
      input.value = "";
      submitFeedComment(form.dataset.feedCommentForm, text);
    });
  }

  function wireFeedPillAndLoadMore() {
    const pill = $id("feedNewPostsPill");
    if (pill && pill.dataset.wired !== "true") {
      pill.dataset.wired = "true";
      pill.addEventListener("click", flushFeedPendingNew);
    }

    const loadMore = $id("feedLoadOlder");
    if (loadMore && loadMore.dataset.wired !== "true") {
      loadMore.dataset.wired = "true";
      loadMore.addEventListener("click", loadOlderFeedPosts);
    }
  }

  /* =========================================================
     NOTIFICATION CENTER
     Collection: notifications/{id}
       { targetUid: "<uid>" | "all", type, title, body,
         createdAt, readBy: [uid, ...] }
     A single realtime listener drives three things at once —
     the bell badge count, the /notifications page list, and a
     toast for anything that arrives after this session started
     — so we are not running duplicate listeners on the same
     collection.
  ========================================================= */

  let notificationCenterStarted = false;
  let notificationSessionStart = 0;
  let notificationItems = [];

  function notificationIcon(type) {
    return {
      new_post: "📝",
      guidance_reply: "🙏",
      announcement: "📢",
      acharya_message: "💬"
    }[type] || "🔔";
  }

  function writeNotification({ targetUid, type, title, body }) {
    if (!firestoreReady()) return Promise.resolve();
    return F().addDoc(F().collection(DB(), "notifications"), {
      targetUid: targetUid || "all",
      type,
      title: title || "सूचना",
      body: body || "",
      readBy: [],
      createdAt: F().serverTimestamp()
    }).catch((error) => console.warn("Notification write failed:", error));
  }

  function notifyNewPostPublished(title, authorName) {
    writeNotification({
      targetUid: "all",
      type: "new_post",
      title: title || "नया विचार",
      body: `${authorName || "आचार्य"} ने एक नया विचार प्रकाशित किया।`
    });
  }

  function renderNotificationsList() {
    const box = $id("notificationsList");
    if (!box) return;

    if (!notificationItems.length) {
      box.innerHTML = `<div class="notifications-empty">🔔 अभी कोई सूचना नहीं है।</div>`;
      return;
    }

    const uid = getAuthUser()?.uid || "";

    box.innerHTML = notificationItems.map((n) => {
      const unread = !(n.readBy || []).includes(uid);
      return `
        <div class="notification-row ${unread ? "unread" : ""}" data-notification-id="${safeText(n.id)}">
          <div class="notification-icon">${notificationIcon(n.type)}</div>
          <div class="notification-body">
            <strong>${safeText(n.title)}</strong>
            <p>${safeText(n.body)}</p>
          </div>
          <div class="notification-time">${safeText(feedRelativeTime(n.createdAt))}</div>
          ${unread ? '<span class="unread-dot"></span>' : ""}
        </div>`;
    }).join("");

    box.querySelectorAll("[data-notification-id]").forEach((row) => {
      row.addEventListener("click", () => markNotificationRead(row.dataset.notificationId));
    });
  }

  async function markNotificationRead(id) {
    const user = getAuthUser();
    if (!user || !firestoreReady()) return;

    const item = notificationItems.find((n) => n.id === id);
    if (!item || (item.readBy || []).includes(user.uid)) return;

    // Optimistic UI so tapping feels instant.
    item.readBy = [...(item.readBy || []), user.uid];
    renderNotificationsList();
    updateNotificationBadge();

    try {
      await F().updateDoc(F().doc(DB(), "notifications", id), {
        readBy: F().arrayUnion(user.uid)
      });
    } catch (error) {
      console.warn("Mark notification read failed:", error);
    }
  }

  function updateNotificationBadge() {
    const badge = $id("notificationBadge");
    if (!badge) return;
    const uid = getAuthUser()?.uid || "";
    const unreadCount = notificationItems.filter((n) => !(n.readBy || []).includes(uid)).length;
    badge.textContent = unreadCount > 9 ? "9+" : String(unreadCount);
    badge.hidden = unreadCount === 0;
  }

  function startNotificationCenterRealtime() {
    if (notificationCenterStarted || !firestoreReady()) return;
    const user = getAuthUser();
    if (!user) return;

    notificationCenterStarted = true;
    notificationSessionStart = Date.now();

    // Firestore requires a composite index the first time a where("in")
    // + orderBy query like this runs — the browser console will show a
    // direct "create index" link from Firebase the first time it's hit;
    // click it once in the Firebase Console and it works from then on.
    const q = F().query(
      F().collection(DB(), "notifications"),
      F().where("targetUid", "in", [user.uid, "all"]),
      F().orderBy("createdAt", "desc"),
      F().limit(50)
    );

    F().onSnapshot(
      q,
      (snap) => {
        notificationItems = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        renderNotificationsList();
        updateNotificationBadge();

        snap.docChanges().forEach((change) => {
          if (change.type !== "added") return;
          const data = change.doc.data();
          const ms = timestampMs(data.createdAt);
          if (ms && ms >= notificationSessionStart) {
            showFeatureToast(`${notificationIcon(data.type)} ${data.body || data.title || "नई सूचना।"}`);
          }
        });
      },
      (error) => {
        console.warn("Notification center realtime error:", error);
        notificationCenterStarted = false;
      }
    );
  }

  /* =========================================================
     GUIDANCE — Acharya reply + Admin monitor
     Reuses the existing guidanceRequests collection (question,
     category, topic, name, userId, createdAt) and adds:
     status, answer, answeredBy, answeredByUid, answeredAt.
     Answering triggers a targeted "guidance_reply" notification
     to the requester through the same Notification Center.
  ========================================================= */

  function guidanceRowHTML(item, { withReplyForm } = {}) {
    const answered = item.status === "answered";
    return `
      <article class="guidance-row ${answered ? "answered" : "pending"}" data-guidance-id="${safeText(item.id)}">
        <div class="guidance-row-head">
          <strong>${safeText(item.name || "User")}</strong>
          <span class="guidance-status-tag">${answered ? "✅ उत्तर दिया गया" : "⏳ लंबित"}</span>
        </div>
        <div class="guidance-category">${safeText(item.category || item.topic || "मार्गदर्शन")}</div>
        <p class="guidance-question">${safeText(item.question || "")}</p>
        ${item.answer ? `<p class="guidance-answer"><b>उत्तर${item.answeredBy ? ` (${safeText(item.answeredBy)})` : ""}:</b> ${safeText(item.answer)}</p>` : ""}
        ${withReplyForm && !answered ? `
          <form class="guidance-reply-form" data-guidance-reply="${safeText(item.id)}">
            <textarea rows="3" maxlength="1000" placeholder="अपना उत्तर लिखें…" required></textarea>
            <button class="primary-button" type="submit">उत्तर भेजें</button>
            <span class="form-status"></span>
          </form>` : ""}
      </article>`;
  }

  async function renderAdminGuidanceMonitor() {
    const box = $id("adminGuidanceList");
    if (!box || !roleCanManageAdmin() || !firestoreReady()) return;

    try {
      const snap = await F().getDocs(F().query(F().collection(DB(), "guidanceRequests"), F().limit(200)));
      const items = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));

      box.innerHTML = items.length
        ? items.map((item) => guidanceRowHTML(item)).join("")
        : `<div class="admin-empty">अभी कोई guidance request नहीं है।</div>`;
    } catch (error) {
      console.error("Admin guidance monitor error:", error);
      box.innerHTML = `<div class="admin-empty">Guidance data लोड नहीं हो सकी। Firestore rules जाँचें।</div>`;
    }
  }

  async function renderAcharyaGuidance() {
    const box = $id("acharyaGuidanceList");
    if (!box || currentRole !== "acharya" || !firestoreReady()) return;

    try {
      const snap = await F().getDocs(
        F().query(F().collection(DB(), "guidanceRequests"), F().limit(200))
      );
      const items = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));

      box.innerHTML = items.length
        ? items.map((item) => guidanceRowHTML(item, { withReplyForm: true })).join("")
        : `<div class="admin-empty">अभी कोई pending guidance request नहीं है।</div>`;

      box.querySelectorAll("[data-guidance-reply]").forEach((form) => {
        form.addEventListener("submit", async (event) => {
          event.preventDefault();
          const id = form.dataset.guidanceReply;
          const textarea = form.querySelector("textarea");
          const status = form.querySelector(".form-status");
          const answer = textarea.value.trim();
          if (!answer) return;

          const item = items.find((i) => i.id === id);
          const user = getAuthUser();
          const myAcharya = await getMyAcharyaRecord();
          const answeredBy = myAcharya?.name || currentProfile?.name || user?.email?.split("@")[0] || "Acharya";

          try {
            await F().updateDoc(F().doc(DB(), "guidanceRequests", id), {
              status: "answered",
              answer,
              answeredBy,
              answeredByUid: user?.uid || "",
              answeredAt: F().serverTimestamp()
            });

            if (item?.userId) {
              writeNotification({
                targetUid: item.userId,
                type: "guidance_reply",
                title: "मार्गदर्शन का उत्तर मिला",
                body: `${answeredBy} ने आपके "${item.category || item.topic || "मार्गदर्शन"}" प्रश्न का उत्तर दिया है।`
              });
            }

            if (status) status.textContent = "✅ उत्तर भेज दिया गया।";
            await renderAcharyaGuidance();
          } catch (error) {
            console.error("Guidance reply error:", error);
            if (status) status.textContent = "❌ उत्तर सुरक्षित नहीं हुआ। Firestore rules जाँचें।";
          }
        });
      });
    } catch (error) {
      console.error("Acharya guidance load error:", error);
      box.innerHTML = `<div class="admin-empty">Guidance data लोड नहीं हो सकी।</div>`;
    }
  }

  function wireAdminAnnouncementForm() {
    const form = $id("adminAnnouncementForm");
    if (!form || form.dataset.wired === "true") return;
    form.dataset.wired = "true";

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const title = $id("announcementTitle").value.trim();
      const body = $id("announcementBody").value.trim();
      const status = $id("announcementStatus");
      if (!title || !body) return;

      try {
        await writeNotification({ targetUid: "all", type: "announcement", title, body });
        form.reset();
        if (status) status.textContent = "✅ सूचना प्रकाशित हो गई।";
      } catch (error) {
        console.error("Announcement publish error:", error);
        if (status) status.textContent = "❌ सूचना प्रकाशित नहीं हो सकी।";
      }
    });
  }

  /* =========================================================
     SUPER ADMIN SITE SETTINGS / POSTERS
     Stored in acharyas/__siteSettings so no extra Firebase
     collection/rules change is required.
  ========================================================= */
  const DEFAULT_SITE_SETTINGS = {
    poster1: "./assets/posters/poster1.jpg",
    poster2: "./assets/posters/poster2.jpg",
    poster3: "./assets/posters/poster3.jpg",
    poster1Title: "आज का मार्गदर्शन",
    poster2Title: "वैदिक दृष्टि",
    poster3Title: "नक्षत्र ज्योति"
  };

  function isSafeMediaUrl(value) {
    const url = String(value || "").trim();
    return (
      url.startsWith("./") ||
      url.startsWith("../") ||
      url.startsWith("/") ||
      /^https?:\/\//i.test(url)
    );
  }

  function applySiteSettingsToDOM(settings) {
    [1, 2, 3].forEach((n) => {
      const img = $("poster" + n + "Img");
      const url = isSafeMediaUrl(settings["poster" + n])
        ? settings["poster" + n]
        : DEFAULT_SITE_SETTINGS["poster" + n];

      if (img) {
        img.src = url;
        img.onerror = () => {
          img.onerror = null;
          img.src = DEFAULT_SITE_SETTINGS["poster" + n];
        };
      }

      const title = document.querySelector(
        `.poster-card:nth-child(${n}) .poster-overlay strong`
      );
      if (title && settings["poster" + n + "Title"]) {
        title.textContent = settings["poster" + n + "Title"];
      }
    });
  }

  async function loadSiteSettings() {
    const safeDefaults = { ...DEFAULT_SITE_SETTINGS };
    if (!firestoreReady()) return safeDefaults;

    try {
      const snap = await F().getDoc(
        F().doc(DB(), "acharyas", "__siteSettings")
      );

      const data = snap.exists() ? snap.data() : {};
      const settings = {
        ...safeDefaults,
        ...data
      };

      applySiteSettingsToDOM(settings);
      return settings;
    } catch (error) {
      console.warn("Site settings load error:", error);
      return safeDefaults;
    }
  }

  // Realtime poster: once subscribed, any admin update to
  // acharyas/__siteSettings is reflected on every open Home screen
  // instantly, with no page refresh and no repeated getDoc polling.
  let siteSettingsRealtimeStarted = false;
  function startSiteSettingsRealtime() {
    if (siteSettingsRealtimeStarted || !firestoreReady()) return;
    siteSettingsRealtimeStarted = true;

    F().onSnapshot(
      F().doc(DB(), "acharyas", "__siteSettings"),
      (snap) => {
        const data = snap.exists() ? snap.data() : {};
        applySiteSettingsToDOM({ ...DEFAULT_SITE_SETTINGS, ...data });
      },
      (error) => {
        console.warn("Site settings realtime error:", error);
        siteSettingsRealtimeStarted = false;
      }
    );
  }

  async function saveSiteSettings(event) {
    event?.preventDefault?.();
    if (currentRole !== "admin" || !firestoreReady()) return;

    const status = $("siteSettingsStatus");
    const payload = {
      poster1: $("sitePoster1")?.value.trim() || DEFAULT_SITE_SETTINGS.poster1,
      poster2: $("sitePoster2")?.value.trim() || DEFAULT_SITE_SETTINGS.poster2,
      poster3: $("sitePoster3")?.value.trim() || DEFAULT_SITE_SETTINGS.poster3,
      poster1Title: $("sitePoster1Title")?.value.trim() || DEFAULT_SITE_SETTINGS.poster1Title,
      poster2Title: $("sitePoster2Title")?.value.trim() || DEFAULT_SITE_SETTINGS.poster2Title,
      poster3Title: $("sitePoster3Title")?.value.trim() || DEFAULT_SITE_SETTINGS.poster3Title,
      updatedAt: F().serverTimestamp()
    };

    const bad = [payload.poster1, payload.poster2, payload.poster3].some(
      (value) => !isSafeMediaUrl(value)
    );

    if (bad) {
      if (status) status.textContent = "Poster URL सही image URL या local ./assets path होना चाहिए।";
      return;
    }

    try {
      await F().setDoc(
        F().doc(DB(), "acharyas", "__siteSettings"),
        payload,
        { merge: true }
      );
      await loadSiteSettings();
      if (status) status.textContent = "Poster settings सुरक्षित हो गईं।";
      showFeatureToast("Home posters सफलतापूर्वक बदल दिए गए।");
    } catch (error) {
      console.error("Site settings save error:", error);
      if (status) status.textContent = "Poster settings सुरक्षित नहीं हुईं।";
    }
  }

  async function clearSitePosterSettings() {
    if (currentRole !== "admin" || !firestoreReady()) return;
    try {
      await F().setDoc(
        F().doc(DB(), "acharyas", "__siteSettings"),
        {
          ...DEFAULT_SITE_SETTINGS,
          updatedAt: F().serverTimestamp()
        },
        { merge: true }
      );
      await loadSiteSettings();
      [
        ["sitePoster1", DEFAULT_SITE_SETTINGS.poster1],
        ["sitePoster2", DEFAULT_SITE_SETTINGS.poster2],
        ["sitePoster3", DEFAULT_SITE_SETTINGS.poster3],
        ["sitePoster1Title", DEFAULT_SITE_SETTINGS.poster1Title],
        ["sitePoster2Title", DEFAULT_SITE_SETTINGS.poster2Title],
        ["sitePoster3Title", DEFAULT_SITE_SETTINGS.poster3Title]
      ].forEach(([id, value]) => {
        if ($(id)) $(id).value = value;
        window.NJPhoto?.syncPreview($(id));
      });
      showFeatureToast("Default posters वापस आ गए।");
    } catch (error) {
      console.error("Reset site settings error:", error);
    }
  }

  /* =========================================================
     PRESENCE — Acharya online/offline
     Firestore collection: presence/{uid} = { online, lastSeen }
     This is a heartbeat pattern (write every ~20s + on tab
     visibility change), not Realtime Database onDisconnect —
     using RTDB would mean enabling a second Firebase product
     just for this. A viewer treats a presence doc as "offline"
     once lastSeen is older than PRESENCE_STALE_MS, which is what
     makes it self-heal even if a tab crashes without writing a
     clean "offline" signal.
  ========================================================= */

  const PRESENCE_HEARTBEAT_MS = 20000;
  const PRESENCE_STALE_MS = 45000;
  let presenceHeartbeatTimer = null;
  let presenceListenerStarted = false;
  const presenceCache = {};

  async function setMyPresence(online) {
    const user = getAuthUser();
    if (!user || !firestoreReady()) return;
    try {
      await F().setDoc(
        F().doc(DB(), "presence", user.uid),
        { online, lastSeen: F().serverTimestamp() },
        { merge: true }
      );
    } catch (error) {
      console.warn("Presence update failed:", error);
    }
  }

  function startPresenceHeartbeat() {
    if (presenceHeartbeatTimer) return;

    setMyPresence(!document.hidden);

    // Re-checking document.hidden on every tick (rather than always
    // writing "true") matters: without this, a tab left open in the
    // background would flip back to "online" on the very next tick,
    // undoing the visibilitychange handler below within ~20s.
    presenceHeartbeatTimer = setInterval(() => {
      setMyPresence(!document.hidden);
    }, PRESENCE_HEARTBEAT_MS);

    document.addEventListener("visibilitychange", () => {
      setMyPresence(!document.hidden);
    });

    // Both events are wired because neither fires reliably on its own
    // across browsers: "pagehide" is what actually fires on iOS Safari
    // (where "beforeunload" is unreliable), while "beforeunload" still
    // covers desktop browsers that don't fire "pagehide" consistently.
    // Both are best-effort — a Firestore write is not guaranteed to
    // finish during unload — the staleness check in isPresenceOnline()
    // is what makes offline detection reliable when this signal is
    // missed entirely (closed tab, lost network, crashed browser).
    window.addEventListener("beforeunload", () => setMyPresence(false));
    window.addEventListener("pagehide", () => setMyPresence(false));
  }

  function isPresenceOnline(uid) {
    const p = presenceCache[uid];
    if (!p || !p.online) return false;
    const ms = timestampMs(p.lastSeen);
    return Boolean(ms) && Date.now() - ms < PRESENCE_STALE_MS;
  }

  function startPresenceRealtime() {
    if (presenceListenerStarted || !firestoreReady()) return;
    presenceListenerStarted = true;

    F().onSnapshot(
      F().collection(DB(), "presence"),
      (snap) => {
        snap.forEach((d) => { presenceCache[d.id] = d.data(); });
        renderCallCards();
        refreshChatOnlineDot();
      },
      (error) => {
        console.warn("Presence realtime error:", error);
        presenceListenerStarted = false;
      }
    );
  }

  function stopPresenceHeartbeat() {
    if (presenceHeartbeatTimer) {
      clearInterval(presenceHeartbeatTimer);
      presenceHeartbeatTimer = null;
    }
    setMyPresence(false);
  }

  // Exposed so the logout handler (declared outside this IIFE, near
  // the top of the file) can mark the user offline while Firebase Auth
  // still allows the write — i.e. just before signOut() actually runs.
  window.NJPresence = { stop: stopPresenceHeartbeat };

  function refreshChatOnlineDot() {
    const dot = $id("chatOnlineDot");
    if (!dot || !currentConversation) return;

    const isStaff = currentRole === "admin" || currentRole === "acharya";
    const otherUid = isStaff ? currentConversation.userId : currentConversation.acharyaUid;
    const online = otherUid ? isPresenceOnline(otherUid) : false;

    dot.hidden = false;
    dot.classList.toggle("online", online);
    dot.classList.toggle("offline", !online);
    dot.title = online ? "🟢 Online" : "⚪ Offline";
  }

  /* =========================================================
     CALL PAGE — COMPACT PROFESSIONAL CARDS
  ========================================================= */

  async function renderCallCards() {
    const grid = document.querySelector(".consultation-grid");
    if (!grid) return;

    const list = await getAcharyas();
    const myUid = getAuthUser()?.uid || "";

    grid.innerHTML = list.map((a) => {
      const isSelf = Boolean(a.uid) && a.uid === myUid;
      const online = a.uid ? isPresenceOnline(a.uid) : false;
      return `
      <article class="consultation-card" data-acharya-id="${safeText(a.id)}">
        <img src="${safeText(a.image)}" alt="${safeText(a.name)}"
          onerror="this.onerror=null;this.src='${safeText(defaultAcharyaImage(a.id))}'">
        <div class="consultation-main">
          <div class="consultation-info">
            <h2>${safeText(a.name)}</h2>
            <p>${safeText(a.speciality)}</p>
            <small class="availability-line ${online ? "is-online" : "is-offline"}">
              <i></i>${a.active === false ? "अभी उपलब्ध नहीं" : online ? "🟢 Online" : "⚪ Offline"}
            </small>
          </div>
          <div class="consultation-actions">
            ${isSelf
              ? `<span class="self-profile-note">यह आपकी अपनी प्रोफ़ाइल है</span>`
              : `
                <button class="call-now" data-call-acharya="${safeText(a.id)}" type="button">☎ कॉल</button>
                <button class="message-now" data-message-acharya="${safeText(a.id)}" type="button">💬 संदेश</button>
              `}
          </div>
        </div>
      </article>
    `;
    }).join("");

    grid.querySelectorAll("[data-call-acharya]").forEach((button) => {
      button.addEventListener("click", async () => {
        const a = await getAcharyaById(button.dataset.callAcharya);
        startAcharyaCall(a);
      });
    });

    grid.querySelectorAll("[data-message-acharya]").forEach((button) => {
      button.addEventListener("click", async () => {
        const a = await getAcharyaById(button.dataset.messageAcharya);
        await openAcharyaChat(a);
      });
    });
  }

  function startAcharyaCall(acharya) {
    if (acharya.uid && acharya.uid === getAuthUser()?.uid) {
      showFeatureToast("आप स्वयं को कॉल नहीं कर सकते।");
      return;
    }

    if (acharya.phone) {
      window.location.href = `tel:${acharya.phone}`;
      return;
    }

    showFeatureToast(
      `${acharya.name} का मोबाइल नंबर अभी प्रोफ़ाइल में जोड़ा नहीं गया है। Admin Dashboard में नंबर जोड़ें।`
    );
  }

  /* =========================================================
     ACHARYA PAGE ACTIONS
  ========================================================= */

  async function enhanceAcharyaPage() {
    const list = document.querySelector(".acharya-list");
    if (!list) return;

    const acharyas = await getAcharyas();

    list.innerHTML = acharyas.map((a) => `
      <article class="acharya-detail" data-acharya-id="${safeText(a.id)}">
        <div class="acharya-detail-photo">
          <img src="${safeText(a.image)}" alt="${safeText(a.name)}"
            onerror="this.onerror=null;this.src='${safeText(defaultAcharyaImage(a.id))}'">
        </div>
        <div class="acharya-detail-content">
          <div class="section-label">PERSONAL GUIDANCE</div>
          <h2>${safeText(a.name)}</h2>
          <div class="acharya-speciality">${safeText(a.speciality)}</div>
          <p><b>योग्यता:</b> ${safeText(a.qualification)}</p>
          <p><b>परिचय:</b> ${safeText(a.bio)}</p>
          <div class="social-buttons acharya-social-links">
            <a class="social-link instagram-link" href="${safeText(a.instagram || "#")}" target="_blank" rel="noopener noreferrer" data-social="instagram" data-url="${safeText(a.instagram || "")}">Instagram</a>
            <a class="social-link facebook-link" href="${safeText(a.facebook || "#")}" target="_blank" rel="noopener noreferrer" data-social="facebook" data-url="${safeText(a.facebook || "")}">Facebook</a>
            <a class="social-link phone-link" href="${a.phone ? `tel:${safeText(a.phone)}` : "#"}" data-social="phone" data-url="${safeText(a.phone || "")}">📱 मोबाइल</a>
          </div>
        </div>
      </article>
    `).join("");

    list.querySelectorAll("[data-social]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const url = link.dataset.url || "";
        const type = link.dataset.social;
        if (!url) {
          event.preventDefault();
          const labels = { instagram: "Instagram", facebook: "Facebook", phone: "मोबाइल नंबर" };
          showFeatureToast(`${labels[type] || "संपर्क"} अभी प्रोफ़ाइल में जोड़ा नहीं गया है।`);
        }
      });
    });
  }

  /* =========================================================
     PRIVATE CLOUD CHAT
  ========================================================= */

  async function openAcharyaChat(acharya) {
    const user = getAuthUser();
    if (!user) {
      showLogin();
      return;
    }

    if (!firestoreReady()) {
      showFeatureToast("Firebase database अभी तैयार नहीं है।");
      return;
    }

    if (!acharya?.uid) {
      showFeatureToast(
        `${acharya.name} के लिए Firebase Acharya account अभी connect नहीं है। Admin Dashboard में Acharya UID जोड़ें।`
      );
      return;
    }

    if (acharya.uid === user.uid) {
      showFeatureToast("आप स्वयं को संदेश नहीं भेज सकते।");
      return;
    }

    openPage("messages");
    showChatWorkspace();

    try {
      const conversations = F().collection(DB(), "conversations");
      const q = F().query(
        conversations,
        F().where("participantUids", "array-contains", user.uid),
        F().limit(100)
      );
      const snap = await F().getDocs(q);
      const existing = snap.docs.find(
        (item) =>
          item.data().acharyaId === acharya.id &&
          item.data().userId === user.uid
      );

      if (existing) {
        await openConversation({
          id: existing.id,
          ...existing.data()
        });
        return;
      }

      const ref = await F().addDoc(conversations, {
        participantUids: [user.uid, acharya.uid],
        userId: user.uid,
        acharyaId: acharya.id,
        acharyaUid: acharya.uid,
        acharyaName: acharya.name,
        userName: user.displayName || user.email?.split("@")[0] || currentProfile?.name || "User",
        userEmail: user.email || "",
        lastMessage: "",
        lastSenderUid: "",
        unreadForUid: "",
        lastAt: F().serverTimestamp(),
        createdAt: F().serverTimestamp()
      });

      await openConversation({
        id: ref.id,
        participantUids: [user.uid, acharya.uid],
        userId: user.uid,
        acharyaId: acharya.id,
        acharyaUid: acharya.uid,
        acharyaName: acharya.name,
        userName: user.displayName || user.email?.split("@")[0] || currentProfile?.name || "User",
        userEmail: user.email || ""
      });
    } catch (error) {
      console.error("Open private chat error:", error);
      showFeatureToast("चैट खोलने में समस्या हुई। Firestore rules और Acharya UID जाँचें।");
    }
  }

  function showChatWorkspace() {
    $("messagesList")?.classList.add("hidden");
    $("chatWorkspace")?.classList.remove("hidden");
    $("aiChatWorkspace")?.classList.add("hidden");
    document.body.classList.add("chat-fullscreen-active");
  }

  function showMessagesInbox() {
    $("messagesList")?.classList.remove("hidden");
    $("chatWorkspace")?.classList.add("hidden");
    $("aiChatWorkspace")?.classList.add("hidden");
    document.body.classList.remove("chat-fullscreen-active");
    stopChatListeners();
  }

  function showAIWorkspace() {
    $("messagesList")?.classList.add("hidden");
    $("chatWorkspace")?.classList.add("hidden");
    $("aiChatWorkspace")?.classList.remove("hidden");
    document.body.classList.add("chat-fullscreen-active");
    renderAIChat();
  }

  async function openConversation(conversation) {
    currentConversation = conversation;

    const reader = getAuthUser();
    if (
      reader &&
      conversation?.unreadForUid === reader.uid &&
      firestoreReady()
    ) {
      try {
        await F().updateDoc(
          F().doc(DB(), "conversations", conversation.id),
          { unreadForUid: "" }
        );
      } catch (error) {
        console.warn("Could not clear message badge:", error);
      }
    }

    showChatWorkspace();

    const avatar = $("chatAvatar");
    const title = $("chatTitle");
    const subtitle = $("chatSubtitle");

    const isStaff = currentRole === "admin" || currentRole === "acharya";
    const titleName = isStaff
      ? (conversation.userName || "User")
      : (conversation.acharyaName || "आचार्य");

    if (avatar) {
      avatar.textContent = String(titleName || "U").trim().charAt(0).toUpperCase();
    }
    if (title) title.textContent = titleName;
    const subtitleText = $id("chatSubtitleText") || subtitle;
    if (subtitleText) {
      subtitleText.textContent = currentRole === "admin"
        ? `Super Admin • ${conversation.acharyaName || "आचार्य"}`
        : currentRole === "acharya"
          ? "निजी user conversation"
          : "निजी परामर्श • केवल प्रतिभागियों को दिखाई देगा";
    }
    refreshChatOnlineDot();

    stopChatListeners();

    if (!firestoreReady()) return;

    const messagesRef = F().collection(
      DB(),
      "conversations",
      conversation.id,
      "messages"
    );

    const q = F().query(
      messagesRef,
      F().orderBy("createdAt", "asc")
    );

    currentChatUnsubscribe = F().onSnapshot(
      q,
      (snap) => {
        const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        renderCloudChatMessages(messages);
      },
      (error) => {
        console.error("Chat listener error:", error);
        showFeatureToast("चैट लोड नहीं हो सकी। Firestore rules/index जाँचें।");
      }
    );
  }

  function renderCloudChatMessages(messages) {
    const box = $("chatMessages");
    const user = getAuthUser();
    if (!box) return;

    // Preserve reading position: only auto-scroll to the newest message
    // if the person was already near the bottom before this update —
    // someone reading older messages should never get yanked down.
    const wasNearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 120;

    if (!messages.length) {
      box.innerHTML = `
        <div class="chat-empty">
          <div>ॐ</div>
          <h3>बातचीत शुरू करें</h3>
          <p>आपका संदेश केवल इस बातचीत के प्रतिभागियों के लिए उपलब्ध रहेगा।</p>
        </div>`;
      return;
    }

    box.innerHTML = messages.map((m) => {
      const mine = m.senderUid === user?.uid;
      let mediaHTML = "";

      if (m.type === "image" && m.mediaUrl) {
        mediaHTML = `<img class="chat-media-image" src="${safeText(m.mediaUrl)}" alt="फोटो" loading="lazy">`;
      } else if (m.type === "video" && m.mediaUrl) {
        mediaHTML = `<video class="chat-media-video" src="${safeText(m.mediaUrl)}" controls playsinline></video>`;
      } else if (m.type === "file" && m.mediaUrl) {
        mediaHTML = `
          <a class="chat-file-card" href="${safeText(m.mediaUrl)}" target="_blank" rel="noopener noreferrer">
            <span class="chat-file-icon">📄</span>
            <span class="chat-file-name">${safeText(m.fileName || "फ़ाइल")}</span>
          </a>`;
      }

      return `
        <div class="chat-row ${mine ? "mine" : "theirs"}">
          <div class="chat-bubble">
            ${mediaHTML}
            ${m.text ? `<div class="chat-message-text">${safeText(m.text)}</div>` : ""}
            <small>${safeText(formatFeatureDate(m.createdAt))}</small>
          </div>
        </div>`;
    }).join("");

    if (wasNearBottom) {
      box.scrollTop = box.scrollHeight;
    }
  }

  async function sendChatMessage(event) {
    event.preventDefault();

    const input = $("chatInput");
    const text = input?.value.trim();
    const user = getAuthUser();

    if (!text || !user || !currentConversation || !firestoreReady()) return;

    const participants = currentConversation.participantUids || [];
    const recipientUid =
      participants.find((uid) => uid !== user.uid) ||
      currentConversation.acharyaUid ||
      currentConversation.userId ||
      "";

    if (recipientUid === user.uid) {
      showFeatureToast("आप स्वयं को संदेश नहीं भेज सकते।");
      return;
    }

    input.value = "";

    try {
      await F().addDoc(
        F().collection(
          DB(),
          "conversations",
          currentConversation.id,
          "messages"
        ),
        {
          senderUid: user.uid,
          senderRole: currentRole,
          type: "text",
          text,
          createdAt: F().serverTimestamp()
        }
      );

      await F().updateDoc(
        F().doc(DB(), "conversations", currentConversation.id),
        {
          lastMessage: text.slice(0, 180),
          lastSenderUid: user.uid,
          unreadForUid: recipientUid,
          lastAt: F().serverTimestamp()
        }
      );
    } catch (error) {
      console.error("Send chat error:", error);
      showFeatureToast("संदेश भेजा नहीं जा सका।");
    }
  }

  const CHAT_MEDIA_LIMITS_MB = { image: 12, video: 60, file: 25 };

  async function sendChatMediaMessage(file, kind) {
    const user = getAuthUser();
    if (!user || !currentConversation || !firestoreReady() || !file) return;

    const participants = currentConversation.participantUids || [];
    const recipientUid =
      participants.find((uid) => uid !== user.uid) ||
      currentConversation.acharyaUid ||
      currentConversation.userId ||
      "";

    if (recipientUid === user.uid) {
      showFeatureToast("आप स्वयं को संदेश नहीं भेज सकते।");
      return;
    }

    if (!firebaseStorage || !firebaseStorageModule) {
      showFeatureToast("Storage अभी तैयार नहीं है, कुछ सेकंड बाद फिर कोशिश करें।");
      return;
    }

    const maxMb = CHAT_MEDIA_LIMITS_MB[kind] || 25;
    if (file.size > maxMb * 1024 * 1024) {
      showFeatureToast(`फ़ाइल बहुत बड़ी है। अधिकतम ${maxMb}MB की अनुमति है।`);
      return;
    }

    const status = $id("chatUploadStatus");
    if (status) { status.hidden = false; status.textContent = "अपलोड हो रहा है… 0%"; }

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.]+/g, "_");
      const path = `chat/${currentConversation.id}/${user.uid}/${Date.now()}-${safeName}`;
      const storageRef = firebaseStorageModule.ref(firebaseStorage, path);
      const task = firebaseStorageModule.uploadBytesResumable(storageRef, file, {
        contentType: file.type || "application/octet-stream"
      });

      await new Promise((resolve, reject) => {
        task.on(
          "state_changed",
          (snap) => {
            const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            if (status) status.textContent = `अपलोड हो रहा है… ${pct}%`;
          },
          reject,
          resolve
        );
      });

      const url = await firebaseStorageModule.getDownloadURL(task.snapshot.ref);

      await F().addDoc(
        F().collection(DB(), "conversations", currentConversation.id, "messages"),
        {
          senderUid: user.uid,
          senderRole: currentRole,
          type: kind,
          mediaUrl: url,
          fileName: file.name,
          fileSize: file.size,
          text: "",
          createdAt: F().serverTimestamp()
        }
      );

      await F().updateDoc(
        F().doc(DB(), "conversations", currentConversation.id),
        {
          lastMessage: kind === "image" ? "📷 फोटो" : kind === "video" ? "🎥 वीडियो" : "📄 फ़ाइल",
          lastSenderUid: user.uid,
          unreadForUid: recipientUid,
          lastAt: F().serverTimestamp()
        }
      );

      if (status) {
        status.textContent = "✅ भेजा गया।";
        setTimeout(() => { status.hidden = true; }, 1500);
      }
    } catch (error) {
      console.error("Send media message error:", error);
      if (status) {
        status.textContent = "❌ भेजा नहीं जा सका। कृपया फिर कोशिश करें।";
        setTimeout(() => { status.hidden = true; }, 2500);
      }
    }
  }

  function wireChatAttachments() {
    const attachButton = $id("chatAttachButton");
    const menu = $id("chatAttachMenu");
    const fileInput = $id("chatFileInput");
    if (!attachButton || !menu || !fileInput || attachButton.dataset.wired === "true") return;
    attachButton.dataset.wired = "true";

    attachButton.addEventListener("click", (event) => {
      event.stopPropagation();
      menu.hidden = !menu.hidden;
    });

    document.addEventListener("click", (event) => {
      if (!menu.hidden && !menu.contains(event.target) && event.target !== attachButton) {
        menu.hidden = true;
      }
    });

    menu.querySelectorAll("[data-chat-attach]").forEach((button) => {
      button.addEventListener("click", () => {
        const kind = button.dataset.chatAttach;
        fileInput.accept = kind === "image" ? "image/*" : kind === "video" ? "video/*" : "*/*";
        fileInput.dataset.kind = kind;
        menu.hidden = true;
        fileInput.click();
      });
    });

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      const kind = fileInput.dataset.kind || "file";
      fileInput.value = "";
      if (!file) return;
      await sendChatMediaMessage(file, kind);
    });
  }

  async function requestMessageNotificationPermission() {
    if (notificationPermissionRequested) return;
    notificationPermissionRequested = true;

    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "default") return;

    try {
      await Notification.requestPermission();
    } catch {
      // Notification permission is optional.
    }
  }

  function showIncomingMessageNotifications(conversations) {
    const user = getAuthUser();
    if (!user || typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;

    const unread = conversations.filter(
      (conversation) =>
        conversation.unreadForUid === user.uid &&
        conversation.lastSenderUid &&
        conversation.lastSenderUid !== user.uid
    );

    const signature = unread
      .map((conversation) => `${conversation.id}:${conversation.lastAt?.seconds || conversation.lastAt || ""}`)
      .sort()
      .join("|");

    if (!signature || signature === lastConversationSnapshotSignature) return;

    const previous = lastConversationSnapshotSignature;
    lastConversationSnapshotSignature = signature;
    if (!previous) return;

    unread.forEach((conversation) => {
      const person = currentRole === "user"
        ? (conversation.acharyaName || "आचार्य")
        : (conversation.userName || "User");

      try {
        new Notification(`नया संदेश — ${person}`, {
          body: conversation.lastMessage || "आपको नया संदेश मिला है।",
          tag: `nakshatra-${conversation.id}`
        });
      } catch {
        // Ignore notification errors.
      }
    });
  }

  async function loadMessagesInbox() {
    const user = getAuthUser();
    const list = $("messagesList");
    if (!list || !user || !firestoreReady()) return;

    if (currentConversationUnsubscribe) {
      currentConversationUnsubscribe();
      currentConversationUnsubscribe = null;
    }

    if (currentRole === "admin" || currentRole === "acharya") {
      requestMessageNotificationPermission();
    }

    const conversationsRef = F().collection(DB(), "conversations");

    let q;
    if (currentRole === "admin") {
      // Super Admin can see all consultation threads, but not a private
      // "self-chat" that may have been created from the public UI.
      q = F().query(conversationsRef, F().limit(200));
    } else {
      q = F().query(
        conversationsRef,
        F().where("participantUids", "array-contains", user.uid),
        F().limit(100)
      );
    }

    currentConversationUnsubscribe = F().onSnapshot(
      q,
      (snap) => {
        let conversations = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }));

        if (currentRole === "admin") {
          conversations = conversations.filter(
            (conversation) => conversation.userId !== user.uid
          );
        } else if (currentRole === "acharya") {
          conversations = conversations.filter(
            (conversation) => conversation.acharyaUid === user.uid
          );
        } else {
          conversations = conversations.filter(
            (conversation) => conversation.userId === user.uid
          );
        }

        conversations.sort(
          (a, b) => timestampMs(b.lastAt) - timestampMs(a.lastAt)
        );

        renderConversationList(conversations);
        updateMessageCount(conversations);
        showIncomingMessageNotifications(conversations);
      },
      (error) => {
        console.error("Conversation inbox error:", error);
        list.innerHTML = `
          <div class="message-empty premium-empty">
            <div class="message-empty-icon">⚠️</div>
            <h3>संदेश लोड नहीं हो सके</h3>
            <p>Firebase/Firestore connection या rules जाँचें।</p>
          </div>`;
      }
    );
  }

  function renderConversationList(conversations) {
    const list = $("messagesList");
    if (!list) return;

    const user = getAuthUser();
    const isStaff = currentRole === "admin" || currentRole === "acharya";

    if (!conversations.length) {
      list.innerHTML = `
        <div class="message-empty premium-empty">
          <div class="message-empty-icon">💬</div>
          <h3>${isStaff ? "अभी कोई user message नहीं है" : "अभी कोई निजी चैट नहीं है"}</h3>
          <p>${
            isStaff
              ? "जब कोई user आपको संदेश भेजेगा, उसकी बातचीत यहाँ WhatsApp जैसी सूची में दिखाई देगी।"
              : "कॉल पेज से किसी आचार्य को चुनकर संदेश शुरू करें, या AI assistant खोलें।"
          }</p>
          ${!isStaff ? `<button id="openAiFromEmpty" class="primary-button compact-button" type="button">✦ AI से बात करें</button>` : ""}
        </div>`;

      $("openAiFromEmpty")?.addEventListener("click", showAIWorkspace);
      return;
    }

    const heading = currentRole === "admin"
      ? "Super Admin — सभी user conversations"
      : currentRole === "acharya"
        ? "आपके users के संदेश"
        : "आपकी निजी बातचीत";

    list.innerHTML = `
      <div class="inbox-topbar">
        <div>
          <strong>${safeText(heading)}</strong>
          <small>${isStaff ? "नए संदेश ऊपर दिखेंगे। किसी conversation को खोलकर तुरंत reply करें।" : "हर बातचीत अलग और सुरक्षित है।"}</small>
        </div>
        <button id="openAiFromInbox" class="ai-inbox-button" type="button">✦ AI</button>
      </div>
      <div class="conversation-list">
        ${conversations.map((c) => {
          const unread = c.unreadForUid === user?.uid;
          const personName = isStaff
            ? (c.userName || "User")
            : (c.acharyaName || "आचार्य");
          const personSub = isStaff
            ? `${c.acharyaName || "आचार्य"} • ${c.lastMessage || "नया संवाद"}`
            : (c.lastMessage || "बातचीत शुरू करें");

          return `
            <button class="conversation-card ${unread ? "conversation-unread" : ""}" data-open-conversation="${safeText(c.id)}" type="button">
              <div class="conversation-avatar">${safeText(personName.trim().charAt(0).toUpperCase() || "U")}</div>
              <div class="conversation-copy">
                <strong>${safeText(personName)}</strong>
                <small>${safeText(personSub)}</small>
              </div>
              <div class="conversation-meta">
                <time>${safeText(formatFeatureDate(c.lastAt))}</time>
                ${unread ? `<b class="conversation-unread-badge">नया</b>` : ""}
              </div>
            </button>`;
        }).join("")}
      </div>`;

    $("openAiFromInbox")?.addEventListener("click", showAIWorkspace);

    list.querySelectorAll("[data-open-conversation]").forEach((button) => {
      button.addEventListener("click", async () => {
        const conversation = conversations.find(
          (c) => c.id === button.dataset.openConversation
        );
        if (conversation) await openConversation(conversation);
      });
    });
  }


  function stopChatListeners() {
    if (currentChatUnsubscribe) {
      currentChatUnsubscribe();
      currentChatUnsubscribe = null;
    }
  }

  function updateMessageCount(conversations) {
    const user = getAuthUser();
    const count = user
      ? conversations.filter((conversation) => conversation.unreadForUid === user.uid).length
      : 0;

    document.querySelectorAll(".message-badge").forEach((badge) => {
      badge.textContent = count > 9 ? "9+" : String(count);
      badge.style.display = count ? "flex" : "none";
    });
  }

  /* =========================================================
     AI ASSISTANT
     Secret stays on Cloud Function; it is never placed in this file.
  ========================================================= */

  function loadSavedAIChat() {
    const user = getAuthUser();
    if (!user) return [];

    try {
      return JSON.parse(
        localStorage.getItem(`nakshatra-ai-${user.uid}`) || "[]"
      );
    } catch {
      return [];
    }
  }

  function saveAIChat() {
    const user = getAuthUser();
    if (!user) return;
    localStorage.setItem(
      `nakshatra-ai-${user.uid}`,
      JSON.stringify(aiMessages.slice(-80))
    );
  }

  function renderAIChat() {
    const box = $("aiChatMessages");
    if (!box) return;

    if (!aiMessages.length) {
      aiMessages = loadSavedAIChat();
    }

    if (!aiMessages.length) {
      aiMessages = [
        {
          role: "model",
          text: "नमस्कार 🙏 मैं नक्षत्र ज्योति AI assistant हूँ। आप करियर, कुंडली, शिक्षा, विवाह, मुहूर्त या सामान्य वैदिक विषयों पर प्रश्न पूछ सकते हैं। व्यक्तिगत/चिकित्सकीय निर्णय के लिए योग्य विशेषज्ञ की सलाह भी लें।"
        }
      ];
    }

    box.innerHTML = aiMessages.map((m) => `
      <div class="chat-row ${m.role === "user" ? "mine" : "theirs"}">
        <div class="chat-bubble">
          <div class="chat-message-text">${safeText(m.text).replaceAll("\n", "<br>")}</div>
        </div>
      </div>`).join("");

    box.scrollTop = box.scrollHeight;
  }

  async function sendAIMessage(event) {
    event.preventDefault();

    const input = $("aiChatInput");
    const text = input?.value.trim();
    if (!text) return;

    input.value = "";
    aiMessages.push({ role: "user", text });
    renderAIChat();

    const button = $("aiChatComposer")?.querySelector("button");
    if (button) button.disabled = true;

    try {
      const user = getAuthUser();
      const token = user ? await user.getIdToken() : "";

      const response = await fetch(aiFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: text,
          language: localStorage.getItem("language") || "hi",
          history: aiMessages.slice(-12)
        })
      });

      if (!response.ok) throw new Error(`AI HTTP ${response.status}`);

      const data = await response.json();
      aiMessages.push({
        role: "model",
        text: data.text || "अभी AI उत्तर उपलब्ध नहीं है। कृपया थोड़ी देर बाद फिर प्रयास करें।"
      });
    } catch (error) {
      console.error("AI request error:", error);
      aiMessages.push({
        role: "model",
        text: "AI service अभी connect नहीं है। Firebase Functions में askAI deploy होने के बाद यह चैट वास्तविक AI उत्तर देगी।"
      });
    } finally {
      saveAIChat();
      renderAIChat();
      if (button) button.disabled = false;
    }
  }

  /* =========================================================
     BLOG CMS
  ========================================================= */

  async function loadBlog() {
    if (!firestoreReady()) return;

    try {
      const q = F().query(
        F().collection(DB(), "posts"),
        F().where("published", "==", true),
        F().limit(100)
      );

      const snap = await F().getDocs(q);
      blogCache = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));

      renderBlogList();
      renderHomeBlogPreview();
    } catch (error) {
      console.warn("Blog load error:", error);
      renderBlogList([]);
      renderHomeBlogPreview([]);
    }
  }

  function renderBlogList(source = blogCache) {
    const list = $("blogList");
    if (!list) return;

    const search = ($( "blogSearch")?.value || "").trim().toLowerCase();
    const category = $("blogCategoryFilter")?.value || "all";

    const filtered = source.filter((post) => {
      const text = `${post.title || ""} ${post.excerpt || ""} ${post.content || ""}`.toLowerCase();
      const categoryOk = category === "all" || (post.category || "other") === category;
      return categoryOk && (!search || text.includes(search));
    });

    if (!filtered.length) {
      list.innerHTML = `
        <div class="blog-empty">
          <div>📝</div>
          <h3>अभी कोई प्रकाशित लेख नहीं है</h3>
          <p>Admin Dashboard से पहला लेख प्रकाशित करें।</p>
        </div>`;
      return;
    }

    list.innerHTML = filtered.map((post) => `
      <article class="blog-card" data-post-id="${safeText(post.id)}">
        ${post.coverUrl ? `<img src="${safeText(post.coverUrl)}" alt="${safeText(post.title)}">` : `<div class="blog-cover-placeholder">ॐ</div>`}
        <div class="blog-card-body">
          <div class="blog-meta">
            <span>${safeText(blogCategoryName(post.category))}</span>
            <time>${safeText(formatFeatureDate(post.createdAt))}</time>
          </div>
          <h2>${safeText(post.title)}</h2>
          <p>${safeText(post.excerpt || truncateText(post.content, 180))}</p>
          <div class="blog-author">लेखक: ${safeText(post.authorName || "नक्षत्र ज्योति")}</div>
          <button class="text-link blog-read-button" data-read-post="${safeText(post.id)}" type="button">पूरा लेख पढ़ें →</button>
        </div>
      </article>`).join("");

    list.querySelectorAll("[data-read-post]").forEach((button) => {
      button.addEventListener("click", () => openBlogPost(button.dataset.readPost));
    });
  }

  function renderHomeBlogPreview(source = blogCache) {
    const box = $("homeBlogPreview");
    if (!box) return;

    const posts = source.slice(0, 3);
    if (!posts.length) {
      box.innerHTML = `<div class="blog-empty small-blog-empty"><div>📝</div><p>नए आचार्य लेख जल्द यहाँ दिखाई देंगे।</p></div>`;
      return;
    }

    box.innerHTML = posts.map((post) => `
      <article class="blog-card compact-blog-card">
        ${post.coverUrl ? `<img src="${safeText(post.coverUrl)}" alt="${safeText(post.title)}">` : `<div class="blog-cover-placeholder">ॐ</div>`}
        <div class="blog-card-body">
          <div class="blog-meta"><span>${safeText(blogCategoryName(post.category))}</span></div>
          <h3>${safeText(post.title)}</h3>
          <p>${safeText(post.excerpt || truncateText(post.content, 110))}</p>
          <button class="text-link" data-read-home-post="${safeText(post.id)}" type="button">पढ़ें →</button>
        </div>
      </article>`).join("");

    box.querySelectorAll("[data-read-home-post]").forEach((button) => {
      button.addEventListener("click", () => openBlogPost(button.dataset.readHomePost));
    });
  }

  function openBlogPost(id) {
    const post = blogCache.find((item) => item.id === id);
    if (!post) return;

    const modal = document.createElement("div");
    modal.className = "blog-modal-overlay";
    modal.innerHTML = `
      <article class="blog-modal">
        <button class="blog-modal-close" type="button">×</button>
        ${post.coverUrl ? `<img src="${safeText(post.coverUrl)}" alt="${safeText(post.title)}">` : ""}
        <div class="section-label">${safeText(blogCategoryName(post.category))}</div>
        <h1>${safeText(post.title)}</h1>
        <div class="blog-modal-author">${safeText(post.authorName || "नक्षत्र ज्योति")} • ${safeText(formatFeatureDate(post.createdAt))}</div>
        <div class="blog-modal-content">${safeText(post.content).replaceAll("\n", "<br><br>")}</div>
      </article>`;

    document.body.appendChild(modal);
    modal.querySelector(".blog-modal-close")?.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.remove();
    });
  }

  function blogCategoryName(value) {
    return {
      jyotish: "ज्योतिष",
      kundli: "कुंडली",
      muhurat: "मुहूर्त",
      guidance: "मार्गदर्शन",
      other: "अन्य"
    }[value] || "अन्य";
  }

  async function renderAdminPosts() {
    const box = $("adminPostList");
    if (!box || !roleCanManageContent() || !firestoreReady()) return;

    try {
      const user = getAuthUser();
      const postsQuery = roleCanManageAdmin()
        ? F().query(F().collection(DB(), "posts"), F().limit(100))
        : F().query(F().collection(DB(), "posts"), F().where("authorUid", "==", user.uid), F().limit(100));

      const snap = await F().getDocs(postsQuery);

      const posts = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => timestampMs(b.updatedAt || b.createdAt) - timestampMs(a.updatedAt || a.createdAt));

      if (!posts.length) {
        box.innerHTML = `<div class="admin-empty">अभी कोई लेख नहीं है।</div>`;
        return;
      }

      box.innerHTML = posts.map((post) => `
        <article class="admin-post-row">
          <div>
            <strong>${safeText(post.title)}</strong>
            <small>${safeText(blogCategoryName(post.category))} • ${post.published ? "Published" : "Draft"}</small>
          </div>
          <div class="admin-row-actions">
            <button type="button" data-edit-post="${safeText(post.id)}">संपादित</button>
            <button type="button" data-delete-post="${safeText(post.id)}">हटाएँ</button>
          </div>
        </article>`).join("");

      box.querySelectorAll("[data-edit-post]").forEach((button) => {
        button.addEventListener("click", () => editPost(button.dataset.editPost, posts));
      });

      box.querySelectorAll("[data-delete-post]").forEach((button) => {
        button.addEventListener("click", () => deletePost(button.dataset.deletePost));
      });
    } catch (error) {
      console.error("Admin posts error:", error);
      box.innerHTML = `<div class="admin-empty">Admin access या Firestore rules जाँचें।</div>`;
    }
  }

  function editPost(id, posts) {
    const post = posts.find((item) => item.id === id);
    if (!post) return;

    $("postId").value = post.id;
    $("postTitle").value = post.title || "";
    $("postExcerpt").value = post.excerpt || "";
    $("postContent").value = post.content || "";
    $("postCategory").value = post.category || "other";
    $("postMediaType").value = post.mediaType === "video" ? "video" : "photo";
    $("postCoverUrl").value = post.coverUrl || "";
    window.NJPhoto?.syncPreview($("postCoverUrl"));
    $("postVideoUrl").value = post.videoUrl || "";
    if (post.videoUrl) {
      const preview = $id("postVideoPreview");
      preview.src = post.videoUrl;
      preview.hidden = false;
    }
    $("postMediaType").dispatchEvent(new Event("change"));
    $("postPublished").checked = post.published !== false;
    $("postFormStatus").textContent = "लेख edit mode में है।";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function savePost(event) {
    event.preventDefault();
    if (!roleCanManageContent() || !firestoreReady()) return;

    const user = getAuthUser();
    if (!user) return;

    const id = $("postId").value.trim();
    const mediaType = $("postMediaType")?.value === "video" ? "video" : "photo";

    const myAcharya = currentRole === "acharya" ? await getMyAcharyaRecord() : null;

    const payload = {
      title: $("postTitle").value.trim(),
      excerpt: $("postExcerpt").value.trim(),
      content: $("postContent").value.trim(),
      category: $("postCategory").value,
      mediaType,
      coverUrl: mediaType === "photo" ? $("postCoverUrl").value.trim() : "",
      videoUrl: mediaType === "video" ? $("postVideoUrl").value.trim() : "",
      published: $("postPublished").checked,
      authorUid: user.uid,
      authorName: myAcharya?.name || user.displayName || user.email?.split("@")[0] || "Admin",
      authorPhoto: myAcharya?.image || "",
      updatedAt: F().serverTimestamp()
    };

    if (!payload.title || payload.content.length < 20) {
      $("postFormStatus").textContent = "शीर्षक और कम से कम 20 अक्षरों का लेख आवश्यक है।";
      return;
    }

    if (mediaType === "video" && !payload.videoUrl) {
      $("postFormStatus").textContent = "कृपया वीडियो अपलोड होने का इंतज़ार करें या फोटो चुनें।";
      return;
    }

    try {
      if (id) {
        await F().updateDoc(F().doc(DB(), "posts", id), payload);
      } else {
        await F().addDoc(F().collection(DB(), "posts"), {
          ...payload,
          likedBy: [],
          likeCount: 0,
          commentCount: 0,
          createdAt: F().serverTimestamp()
        });

        notifyNewPostPublished(payload.title, payload.authorName);
      }

      resetPostForm();
      $("postFormStatus").textContent = "लेख सफलतापूर्वक सुरक्षित हो गया।";
      await loadBlog();
      await renderAdminPosts();
      renderAdminStats();
    } catch (error) {
      console.error("Save post error:", error);
      $("postFormStatus").textContent = "लेख सुरक्षित नहीं हो सका। Admin Firestore rules जाँचें।";
    }
  }

  async function deletePost(id) {
    if (!roleCanManageContent() || !firestoreReady()) return;
    if (!window.confirm("क्या आप इस लेख को हटाना चाहते हैं?")) return;

    try {
      await F().deleteDoc(F().doc(DB(), "posts", id));
      await loadBlog();
      await renderAdminPosts();
      renderAdminStats();
    } catch (error) {
      console.error("Delete post error:", error);
      showFeatureToast("लेख हटाया नहीं जा सका।");
    }
  }

  function resetPostForm() {
    $("postForm")?.reset();
    if ($("postId")) $("postId").value = "";
    if ($("postPublished")) $("postPublished").checked = true;
    window.NJPhoto?.resetField($("postCoverUrl")?.closest(".photo-field"));

    if ($id("postVideoUrl")) $id("postVideoUrl").value = "";
    if ($id("postVideoStatus")) $id("postVideoStatus").textContent = "";
    const preview = $id("postVideoPreview");
    if (preview) { preview.hidden = true; preview.removeAttribute("src"); }
    if ($id("postMediaType")) {
      $id("postMediaType").value = "photo";
      $id("postMediaType").dispatchEvent(new Event("change"));
    }
  }

  async function saveAdminAcharya(event) {
    event.preventDefault();

    if (currentRole !== "admin" || !firestoreReady()) return;

    const form = event.currentTarget;
    const status = $("adminAddAcharyaStatus");
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name?.trim() || !data.uid?.trim()) {
      if (status) status.textContent = "नाम और Firebase UID आवश्यक है।";
      return;
    }

    const idBase = data.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);

    const id = `acharya_${idBase || "new"}_${Date.now().toString(36)}`;

    const payload = {
      id,
      name: data.name.trim(),
      uid: data.uid.trim(),
      speciality: data.speciality?.trim() || "वैदिक ज्योतिष • परामर्श",
      phone: data.phone?.trim() || "",
      instagram: data.instagram?.trim() || "",
      facebook: data.facebook?.trim() || "",
      qualification: data.qualification?.trim() || "",
      bio: data.bio?.trim() || "",
      assignedRashis: new FormData(form).getAll("assignedRashis"),
      image: isSafeMediaUrl(data.image?.trim())
        ? data.image.trim()
        : "./assets/acharyas/acharya1.jpg",
      active: form.querySelector('[name="active"]')?.checked === true,
      updatedAt: F().serverTimestamp(),
      createdAt: F().serverTimestamp()
    };

    try {
      await F().setDoc(F().doc(DB(), "acharyas", id), payload, { merge: true });
      await F().setDoc(
        F().doc(DB(), "users", payload.uid),
        {
          role: "acharya",
          uid: payload.uid,
          name: payload.name,
          updatedAt: F().serverTimestamp()
        },
        { merge: true }
      );

      form.reset();
      const active = form.querySelector('[name="active"]');
      if (active) active.checked = true;
      window.NJPhoto?.resetField(form.querySelector(".photo-field"));

      if (status) status.textContent = `${payload.name} को Acharya के रूप में जोड़ दिया गया।`;
      await renderAdminAcharyas();
      await renderCallCards();
      await enhanceAcharyaPage();
      await renderAdminStats();
      showFeatureToast(`${payload.name} का Acharya account connect हो गया।`);
    } catch (error) {
      console.error("Add Acharya error:", error);
      if (status) {
        status.textContent = "आचार्य नहीं जोड़ा जा सका। Firebase UID और Firestore rules जाँचें।";
      }
    }
  }

  /* =========================================================
     ADMIN ACHARYA PROFILE MANAGEMENT
  ========================================================= */

  async function renderAdminAcharyas() {
    const box = $("adminAcharyaList");
    if (!box || !roleCanManageAdmin() || !firestoreReady()) return;

    const list = await getAcharyas();

    box.innerHTML = list.map((a) => `
      <form class="admin-acharya-form" data-admin-acharya="${safeText(a.id)}">
        <div class="admin-acharya-head">
          <img src="${safeText(a.image)}" alt="${safeText(a.name)}">
          <div><strong>${safeText(a.name)}</strong><small>${safeText(a.id)}</small></div>
          <button type="button" class="acharya-toggle-active ${a.active === false ? "is-inactive" : "is-active"}" data-toggle-active="${safeText(a.id)}">
            ${a.active === false ? "⚪ Inactive" : "🟢 Active"}
          </button>
        </div>
        <div class="admin-form-row">
          <label>नाम<input name="name" value="${safeText(a.name)}" maxlength="120"></label>
          <label>Firebase UID<input name="uid" value="${safeText(a.uid || "")}" placeholder="Acharya Auth UID"></label>
        </div>
        <div class="admin-form-row">
          <label>विशेषज्ञता<input name="speciality" value="${safeText(a.speciality || "")}"></label>
          <label>फोन<input name="phone" value="${safeText(a.phone || "")}" placeholder="+91…"></label>
        </div>
        <div class="admin-form-row">
          <label>Instagram URL<input name="instagram" value="${safeText(a.instagram || "")}" placeholder="https://instagram.com/..."></label>
          <label>Facebook URL<input name="facebook" value="${safeText(a.facebook || "")}" placeholder="https://facebook.com/..."></label>
        </div>
        <label>योग्यता<input name="qualification" value="${safeText(a.qualification || "")}"></label>
        <label>परिचय<textarea name="bio">${safeText(a.bio || "")}</textarea></label>
        <label>राशिफल अनुमति (Assigned Rashis)</label>
        <div class="admin-rashi-checks">
          ${RASHI_LIST.map((r) => `
            <label class="checkbox-line rashi-check">
              <input type="checkbox" name="assignedRashis" value="${r.id}" ${(a.assignedRashis || []).includes(r.id) ? "checked" : ""}> ${r.symbol} ${r.name}
            </label>`).join("")}
        </div>
        <label>फोटो</label>
        ${window.NJPhoto.fieldHTML({ name: "image", value: a.image || "", aspect: "1", folder: "acharyas" })}
        <label class="checkbox-line"><input name="active" type="checkbox" ${a.active !== false ? "checked" : ""}> उपलब्ध दिखाएँ</label>
        <div class="role-actions">
          <button class="secondary-button" type="submit">प्रोफ़ाइल सुरक्षित करें</button>
          ${a.uid ? `<button class="danger-button" data-remove-acharya-role="${safeText(a.uid)}" data-acharya-name="${safeText(a.name)}" type="button">Acharya role हटाएँ</button>` : ""}
        </div>
        <div class="form-status"></div>
      </form>`).join("");

    box.querySelectorAll("[data-toggle-active]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (currentRole !== "admin" || !firestoreReady()) return;
        const id = button.dataset.toggleActive;
        const acharya = list.find((a) => a.id === id);
        if (!acharya) return;

        const nextActive = acharya.active === false;
        try {
          await F().updateDoc(F().doc(DB(), "acharyas", id), {
            active: nextActive,
            updatedAt: F().serverTimestamp()
          });
          await renderAdminAcharyas();
          showFeatureToast(`${acharya.name} अब ${nextActive ? "Active" : "Inactive"} है।`);
        } catch (error) {
          console.error("Toggle active error:", error);
          showFeatureToast("Status बदला नहीं जा सका।");
        }
      });
    });

    box.querySelectorAll("[data-remove-acharya-role]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (currentRole !== "admin" || !firestoreReady()) return;

        const uid = button.dataset.removeAcharyaRole;
        const name = button.dataset.acharyaName || "आचार्य";
        if (!window.confirm(`${name} का Acharya role हटाकर User बनाना है?`)) return;

        try {
          await F().setDoc(
            F().doc(DB(), "users", uid),
            { role: "user", updatedAt: F().serverTimestamp() },
            { merge: true }
          );

          const statusEl = button.closest("form")?.querySelector(".form-status");
          if (statusEl) statusEl.textContent = "Acharya role हटाकर User कर दिया गया।";

          await renderAdminAcharyas();
          showFeatureToast(`${name} अब User role में है।`);
        } catch (error) {
          console.error("Remove Acharya role error:", error);
          showFeatureToast("Acharya role हटाया नहीं जा सका।");
        }
      });
    });

    box.querySelectorAll("[data-admin-acharya]").forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const id = form.dataset.adminAcharya;
        const data = Object.fromEntries(new FormData(form).entries());
        try {
          await F().setDoc(F().doc(DB(), "acharyas", id), {
            id,
            name: data.name || "",
            uid: data.uid || "",
            speciality: data.speciality || "",
            phone: data.phone || "",
            instagram: data.instagram || "",
            facebook: data.facebook || "",
            qualification: data.qualification || "",
            bio: data.bio || "",
            assignedRashis: new FormData(form).getAll("assignedRashis"),
            image: data.image || "",
            active: form.querySelector('[name="active"]')?.checked === true,
            updatedAt: F().serverTimestamp()
          }, { merge: true });

          if (data.uid) {
            await F().setDoc(
              F().doc(DB(), "users", data.uid),
              {
                role: "acharya",
                name: data.name || "",
                updatedAt: F().serverTimestamp()
              },
              { merge: true }
            );
          }

          form.querySelector(".form-status").textContent = "सुरक्षित हो गया।";
          await renderCallCards();
          await enhanceAcharyaPage();
        } catch (error) {
          console.error("Acharya save error:", error);
          form.querySelector(".form-status").textContent = "सुरक्षित नहीं हुआ।";
        }
      });
    });
  }

  async function renderAdminStats() {
    const box = $("adminStats");
    if (!box || !roleCanManageAdmin()) return;

    const acharyas = await getAcharyas();

    box.innerHTML = `
      <div class="admin-stat"><strong>${blogCache.length}</strong><span>Published Posts</span></div>
      <div class="admin-stat"><strong>${acharyas.length}</strong><span>Acharya Profiles</span></div>
      <div class="admin-stat"><strong>1</strong><span>AI Assistant</span></div>
      <div class="admin-stat"><strong>Cloud</strong><span>Firebase Data Layer</span></div>`;
  }

  /* =========================================================
     PROFILE / ACCOUNT
  ========================================================= */

  async function editUserProfile() {
    const user = getAuthUser();
    if (!user) return;

    const currentName = user.displayName || user.email?.split("@")[0] || "";
    const name = window.prompt("अपना नाम दर्ज करें:", currentName);
    if (name === null) return;

    const trimmed = name.trim();
    if (trimmed.length < 2) {
      showFeatureToast("नाम कम से कम 2 अक्षरों का रखें।");
      return;
    }

    try {
      await firebaseAuthModule.updateProfile(user, { displayName: trimmed });
      if (firestoreReady()) {
        await F().setDoc(
          F().doc(DB(), "users", user.uid),
          { name: trimmed, updatedAt: F().serverTimestamp() },
          { merge: true }
        );
      }
      currentProfile = { ...(currentProfile || {}), name: trimmed };
      updateUserUI(user);
      showFeatureToast("प्रोफ़ाइल अपडेट हो गई।");
    } catch (error) {
      console.error("Profile update error:", error);
      showFeatureToast("प्रोफ़ाइल अपडेट नहीं हो सकी।");
    }
  }

  /* =========================================================
     KUNDLI SAVED PROFILE
  ========================================================= */

  async function saveCloudKundli() {
    const user = getAuthUser();
    if (!user || !firestoreReady()) return;

    const data = {
      name: $("kundliName")?.value.trim() || "",
      birthDate: $("kundliDate")?.value || "",
      birthTime: $("kundliTime")?.value || "",
      birthPlace: $("kundliPlace")?.value.trim() || "",
      updatedAt: F().serverTimestamp()
    };

    if (!data.name || !data.birthDate || !data.birthTime || !data.birthPlace) {
      showFeatureToast("कुंडली के सभी जन्म विवरण भरें।");
      return;
    }

    try {
      await F().setDoc(F().doc(DB(), "savedKundli", user.uid), {
        ...data,
        userId: user.uid
      }, { merge: true });

      const box = $("kundliResult");
      if (box) {
        box.innerHTML = `
          <strong>जन्म प्रोफ़ाइल सुरक्षित है</strong>
          <p>${safeText(data.name)} • ${safeText(data.birthDate)} • ${safeText(data.birthTime)} • ${safeText(data.birthPlace)}</p>
          <small>इसे आपकी निजी प्रोफ़ाइल के साथ सुरक्षित रखा गया है।</small>`;
      }
    } catch (error) {
      console.error("Kundli save error:", error);
      showFeatureToast("कुंडली विवरण सुरक्षित नहीं हो सका।");
    }
  }

  async function loadCloudKundli() {
    const user = getAuthUser();
    if (!user || !firestoreReady()) return;

    try {
      const snap = await F().getDoc(F().doc(DB(), "savedKundli", user.uid));
      if (!snap.exists()) return;
      const data = snap.data();
      if ($("kundliName")) $("kundliName").value = data.name || "";
      if ($("kundliDate")) $("kundliDate").value = data.birthDate || "";
      if ($("kundliTime")) $("kundliTime").value = data.birthTime || "";
      if ($("kundliPlace")) $("kundliPlace").value = data.birthPlace || "";
    } catch (error) {
      console.warn("Kundli load error:", error);
    }
  }

  /* =========================================================
     HELPERS / EVENTS
  ========================================================= */

  function timestampMs(value) {
    if (!value) return 0;
    if (typeof value.toMillis === "function") return value.toMillis();
    if (typeof value.seconds === "number") return value.seconds * 1000;
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? 0 : time;
  }

  function formatFeatureDate(value) {
    const ms = timestampMs(value);
    if (!ms) return "अभी";
    try {
      return new Date(ms).toLocaleString("hi-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return new Date(ms).toLocaleString();
    }
  }

  function truncateText(text, length) {
    const value = String(text || "");
    return value.length > length ? value.slice(0, length).trim() + "…" : value;
  }

  function showFeatureToast(message) {
    let toast = $("featureToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "featureToast";
      toast.className = "feature-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 3600);
  }

  function wireEvents() {
    $("closeAccount")?.addEventListener("click", closeAccountDrawer);
    $("menuAccountButton")?.addEventListener("click", () => { closeMenu(); openAccountDrawer(); });

    $("chatComposer")?.addEventListener("submit", sendChatMessage);
    $("aiChatComposer")?.addEventListener("submit", sendAIMessage);
    wireChatAttachments();

    $("chatBackButton")?.addEventListener("click", showMessagesInbox);
    $("aiBackButton")?.addEventListener("click", showMessagesInbox);
    $("chatAiButton")?.addEventListener("click", showAIWorkspace);

    document.addEventListener("nakshatra-leave-messages", () => {
      stopChatListeners();
      document.body.classList.remove("chat-fullscreen-active");
    });

    $("blogSearch")?.addEventListener("input", () => renderBlogList());
    $("blogCategoryFilter")?.addEventListener("change", () => renderBlogList());

    $("postForm")?.addEventListener("submit", savePost);
    $("resetPostForm")?.addEventListener("click", resetPostForm);
    $("editProfileButton")?.addEventListener("click", editUserProfile);
    $("saveKundliButton")?.addEventListener("click", saveCloudKundli);

    $("accountThemeButton")?.addEventListener("click", () => {
      const next = (localStorage.getItem("theme") || "light") === "dark" ? "light" : "dark";
      if (typeof applyTheme === "function") applyTheme(next);
      updateThemeUI?.(next);
    });

    $("accountLanguageButton")?.addEventListener("click", () => {
      const next = (localStorage.getItem("language") || "hi") === "hi" ? "en" : "hi";
      localStorage.setItem("language", next);
      if ($("accountLanguageText")) $("accountLanguageText").textContent = next === "hi" ? "हिन्दी" : "English";
      showFeatureToast(next === "hi" ? "भाषा: हिन्दी" : "Language: English");
    });

    document.querySelectorAll('[data-page="messages"]').forEach((button) => {
      button.addEventListener("click", () => {
        setTimeout(() => {
          showMessagesInbox();
          loadMessagesInbox();
        }, 120);
      });
    });

    document.querySelectorAll('[data-page="blog"]').forEach((button) => {
      button.addEventListener("click", () => {
        setTimeout(() => renderBlogList(), 120);
      });
    });

    document.querySelectorAll('[data-page="admin"]').forEach((button) => {
      button.addEventListener("click", () => {
        if (!roleCanManageContent()) {
          showFeatureToast("Content Studio केवल authorized account के लिए है।");
          return;
        }
        setTimeout(() => {
          renderAdminPosts();
          renderAdminAcharyas();
          renderAdminStats();
        }, 120);
      });
    });

    $("drawerLogoutButton")?.addEventListener("click", () => $("logoutButton")?.click());
  }

  /* =========================================================
     AUTH -> ROLE BRIDGE
     Firebase Authentication resolves asynchronously. This listener
     guarantees the role layer runs again after login/restore/logout.
  ========================================================= */

  window.addEventListener("nakshatra-auth-state", async (event) => {
    const uid = event.detail?.uid;

    if (!uid) {
      currentProfile = null;
      currentRole = "user";
      refreshRoleUI();
      refreshRoleDashboard();
      return;
    }

    // Wait for Firebase/Firestore state, then resolve admin/acharya/user.
    await ensureRoleAndProfile();
    await renderCallCards();
    await enhanceAcharyaPage();
    await loadCloudKundli();
    refreshAccountDrawer?.();
  });

  async function initFeatureLayer() {
    if (featureReady) return;
    featureReady = true;

    wireEvents();
    ensureRoleDashboardShell();

    if (!firestoreReady()) return;

    // This may run before Firebase has restored currentUser. The
    // auth-state bridge above will run the same initialization again
    // as soon as the user is known.
    await ensureRoleAndProfile();
    await renderCallCards();
    await enhanceAcharyaPage();
    await loadSiteSettings();
    await loadCloudKundli();
    aiMessages = loadSavedAIChat();
    refreshAccountDrawer?.();
  }

  if (firebaseReady) {
    initFeatureLayer();
  } else {
    window.addEventListener("nakshatra-firebase-ready", initFeatureLayer, { once: true });
  }

})();


/* =========================================================
   NAKSHATRA JYOTI
   PHOTO UPLOAD + CROP SYSTEM
   Replaces plain "photo URL" text boxes across the app
   (Home posters, Acharya photo, Post cover) with:
   File चुनें -> Crop/Adjust -> Save (uploads to Firebase
   Storage and fills the same hidden field the existing
   save functions already read from).
   Added as a separate, self-contained layer so nothing in
   the existing role/dashboard/post code above had to change
   its logic — only the input markup was swapped.
========================================================= */

(() => {
  "use strict";

  function $id(id) {
    return document.getElementById(id);
  }

  /* ---------- reusable field markup + helpers (exposed) ---------- */

  function fieldHTML({ id = "", name = "", value = "", aspect = "1", folder = "misc" } = {}) {
    const val = value ? String(value) : "";
    const esc = val.replace(/"/g, "&quot;");
    const idAttr = id ? `id="${id}"` : "";
    const nameAttr = name ? `name="${name}"` : "";
    return `<div class="photo-field" data-aspect="${aspect}" data-folder="${folder}">
      <div class="photo-field-preview">
        <img data-photo-preview alt="" src="${esc}" style="${val ? "" : "display:none"}">
        <span data-photo-placeholder style="${val ? "display:none" : ""}">📷</span>
      </div>
      <input type="hidden" ${idAttr} ${nameAttr} value="${esc}">
      <button type="button" class="secondary-button photo-pick-button">📁 फोटो चुनें</button>
    </div>`;
  }

  function syncPreview(inputEl) {
    if (!inputEl) return;
    const fieldEl = inputEl.closest(".photo-field");
    if (!fieldEl) return;
    const img = fieldEl.querySelector("[data-photo-preview]");
    const ph = fieldEl.querySelector("[data-photo-placeholder]");
    const val = (inputEl.value || "").trim();
    if (val) {
      if (img) { img.src = val; img.style.display = ""; }
      if (ph) ph.style.display = "none";
    } else {
      if (img) { img.removeAttribute("src"); img.style.display = "none"; }
      if (ph) ph.style.display = "";
    }
  }

  function resetField(fieldEl) {
    if (!fieldEl) return;
    const input = fieldEl.querySelector("input[type=hidden]");
    if (input) input.value = "";
    const img = fieldEl.querySelector("[data-photo-preview]");
    const ph = fieldEl.querySelector("[data-photo-placeholder]");
    if (img) { img.removeAttribute("src"); img.style.display = "none"; }
    if (ph) ph.style.display = "";
  }

  window.NJPhoto = { fieldHTML, syncPreview, resetField };

  /* ---------- crop modal state ---------- */

  let cropTargetField = null;
  let naturalW = 0;
  let naturalH = 0;
  let scale = 1;
  let baseScale = 1;
  let offX = 0;
  let offY = 0;
  let aspectRatio = 1;
  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOffX = 0;
  let dragOffY = 0;
  let rotation = 0;

  function parseAspect(str) {
    if (!str) return 1;
    if (String(str).includes("/")) {
      const [a, b] = String(str).split("/").map(Number);
      if (a && b) return a / b;
    }
    const n = Number(str);
    return n > 0 ? n : 1;
  }

  function openCropperForField(fieldEl) {
    cropTargetField = fieldEl;
    aspectRatio = parseAspect(fieldEl.dataset.aspect);
    naturalW = 0;
    naturalH = 0;

    const stage = $id("photoCropStage");
    stage.style.setProperty("--crop-aspect", aspectRatio);

    $id("photoCropStageWrap").classList.remove("active");
    $id("photoCropStatus").textContent = "";
    $id("photoCropZoom").value = 100;
    $id("photoCropRotate").value = 0;
    rotation = 0;
    $id("photoCropFileInput").value = "";
    $id("photoCropImg").removeAttribute("src");
    $id("photoCropSave").disabled = false;
    $id("photoCropOverlay").classList.add("show");
  }

  function closeCropper() {
    $id("photoCropOverlay").classList.remove("show");
    cropTargetField = null;
  }

  function loadFileIntoCropper(file) {
    if (!file || !file.type || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = $id("photoCropImg");
      img.onload = () => {
        naturalW = img.naturalWidth;
        naturalH = img.naturalHeight;

        // Make the stage visible first so its measured size is correct.
        $id("photoCropStageWrap").classList.add("active");

        const stage = $id("photoCropStage");
        const rect = stage.getBoundingClientRect();

        baseScale = Math.max(rect.width / naturalW, rect.height / naturalH);
        scale = baseScale;
        offX = (rect.width - naturalW * scale) / 2;
        offY = (rect.height - naturalH * scale) / 2;
        rotation = 0;
        $id("photoCropRotate").value = 0;

        applyTransform();
        $id("photoCropZoom").value = 100;
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function clampOffsets() {
    const stage = $id("photoCropStage");
    const rect = stage.getBoundingClientRect();
    const dispW = naturalW * scale;
    const dispH = naturalH * scale;
    const minX = Math.min(0, rect.width - dispW);
    const minY = Math.min(0, rect.height - dispH);
    offX = Math.max(minX, Math.min(0, offX));
    offY = Math.max(minY, Math.min(0, offY));
  }

  function applyTransform() {
    if (!naturalW) return;
    clampOffsets();
    const img = $id("photoCropImg");
    img.style.transform =
      `translate(${offX}px, ${offY}px) scale(${scale}) rotate(${rotation}deg)`;
  }

  function handleRotateChange() {
    if (!naturalW) return;
    rotation = Number($id("photoCropRotate").value) || 0;
    applyTransform();
  }

  function nudgeRotate(delta) {
    if (!naturalW) return;
    const input = $id("photoCropRotate");
    const next = Math.max(-45, Math.min(45, (Number(input.value) || 0) + delta));
    input.value = next;
    handleRotateChange();
  }

  function handleZoomChange() {
    if (!naturalW) return;
    const stage = $id("photoCropStage");
    const rect = stage.getBoundingClientRect();
    const zoomVal = Number($id("photoCropZoom").value) / 100;
    const newScale = baseScale * zoomVal;

    // Zoom around the stage center so the subject stays put.
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const natX = (cx - offX) / scale;
    const natY = (cy - offY) / scale;
    offX = cx - natX * newScale;
    offY = cy - natY * newScale;
    scale = newScale;

    applyTransform();
  }

  function wireDrag() {
    const stage = $id("photoCropStage");

    stage.addEventListener("pointerdown", (event) => {
      if (!naturalW) return;
      dragging = true;
      stage.setPointerCapture(event.pointerId);
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragOffX = offX;
      dragOffY = offY;
    });

    stage.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      offX = dragOffX + (event.clientX - dragStartX);
      offY = dragOffY + (event.clientY - dragStartY);
      applyTransform();
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach((evt) => {
      stage.addEventListener(evt, () => {
        dragging = false;
      });
    });
  }

  async function doSave() {
    if (!naturalW || !cropTargetField) return;

    const status = $id("photoCropStatus");
    const user = firebaseAuth?.currentUser;

    if (!user) {
      status.textContent = "फोटो अपलोड के लिए login ज़रूरी है।";
      return;
    }

    if (!firebaseStorage || !firebaseStorageModule) {
      status.textContent = "Storage अभी तैयार नहीं है, कुछ सेकंड बाद फिर कोशिश करें।";
      return;
    }

    status.textContent = "अपलोड हो रहा है…";
    $id("photoCropSave").disabled = true;

    try {
      const stage = $id("photoCropStage");
      const rect = stage.getBoundingClientRect();

      const outW = aspectRatio >= 1 ? 960 : Math.round(960 * aspectRatio);
      const outH = Math.round(outW / aspectRatio);

      // If the user rotated the photo, bake the rotation into a padded
      // intermediate canvas first so the crop below is taken from the
      // actual rotated pixels, not the original unrotated image.
      let sourceEl = $id("photoCropImg");
      let padX = 0;
      let padY = 0;

      if (rotation) {
        const rad = (rotation * Math.PI) / 180;
        const cos = Math.abs(Math.cos(rad));
        const sin = Math.abs(Math.sin(rad));
        const bw = Math.round(naturalW * cos + naturalH * sin);
        const bh = Math.round(naturalW * sin + naturalH * cos);

        const rotCanvas = document.createElement("canvas");
        rotCanvas.width = bw;
        rotCanvas.height = bh;
        const rotCtx = rotCanvas.getContext("2d");
        rotCtx.translate(bw / 2, bh / 2);
        rotCtx.rotate(rad);
        rotCtx.drawImage(sourceEl, -naturalW / 2, -naturalH / 2, naturalW, naturalH);

        sourceEl = rotCanvas;
        padX = (bw - naturalW) / 2;
        padY = (bh - naturalH) / 2;
      }

      const srcX = -offX / scale + padX;
      const srcY = -offY / scale + padY;
      const srcW = rect.width / scale;
      const srcH = rect.height / scale;

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(sourceEl, srcX, srcY, srcW, srcH, 0, 0, outW, outH);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
      if (!blob) throw new Error("canvas export failed");

      const folder = cropTargetField.dataset.folder || "misc";
      const path = `uploads/${user.uid}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const storageRef = firebaseStorageModule.ref(firebaseStorage, path);

      await firebaseStorageModule.uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
      const url = await firebaseStorageModule.getDownloadURL(storageRef);

      const input = cropTargetField.querySelector("input[type=hidden]");
      if (input) {
        input.value = url;
        syncPreview(input);
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }

      $id("photoCropSave").disabled = false;
      closeCropper();
    } catch (error) {
      console.error("Photo upload error:", error);
      status.textContent = "अपलोड नहीं हो सका। कृपया फिर कोशिश करें।";
      $id("photoCropSave").disabled = false;
    }
  }

  function wireModal() {
    const overlay = $id("photoCropOverlay");
    if (!overlay || overlay.dataset.wired === "true") return;
    overlay.dataset.wired = "true";

    $id("photoCropChooseButton").addEventListener("click", () => $id("photoCropFileInput").click());

    $id("photoCropFileInput").addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (file) loadFileIntoCropper(file);
    });

    $id("photoCropZoom").addEventListener("input", handleZoomChange);
    $id("photoCropRotate").addEventListener("input", handleRotateChange);
    $id("photoCropRotateLeft").addEventListener("click", () => nudgeRotate(-15));
    $id("photoCropRotateRight").addEventListener("click", () => nudgeRotate(15));
    $id("photoCropClose").addEventListener("click", closeCropper);
    $id("photoCropCancel").addEventListener("click", closeCropper);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeCropper();
    });

    $id("photoCropSave").addEventListener("click", doSave);

    wireDrag();
  }

  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".photo-pick-button");
    if (!btn) return;
    const field = btn.closest(".photo-field");
    if (!field) return;
    wireModal();
    openCropperForField(field);
  });

  wireModal();

})();
