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

let firebaseAuth = null;

let firebaseAuthModule = null;

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


    firebaseAuth =
      firebaseAuthModule.getAuth(
        app
      );


    firebaseReady = true;


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
  openAccountDrawer
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

function saveGuidanceRequest(
  request
) {

  const key =
    "nakshatraGuidanceRequests";


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


          cards[index]
            ?.scrollIntoView({
              behavior:
                "smooth",
              block:
                "nearest",
              inline:
                "center"
            });

        },
        5000
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
