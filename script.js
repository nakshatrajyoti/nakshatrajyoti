/* =========================================================
   NAKSHATRA JYOTI
   COMPLETE APP SCRIPT
   Works with the current index.html
   ========================================================= */

"use strict";

/* =========================================================
   TRANSLATIONS
   ========================================================= */

const translations = {

  hi: {
    chooseLanguage: "अपनी भाषा चुनें",
    languageSubtitle: "आगे बढ़ने के लिए अपनी पसंद की भाषा चुनें।",

    welcome: "स्वागत है",
    loginSubtitle: "अपनी ज्योतिषीय यात्रा शुरू करें।",

    namePlaceholder: "अपना नाम",
    phonePlaceholder: "मोबाइल नंबर",

    login: "लॉगिन / अकाउंट बनाएं",
    guest: "अभी Guest के रूप में जारी रखें",

    home: "होम",
    acharya: "आचार्य",
    kundli: "कुंडली",
    rashifal: "राशिफल",
    call: "कॉल",
    about: "हमारे बारे में",

    heroTitle: "अपने प्रश्नों को ज्ञान की दिशा दें।",
    heroText:
      "वैदिक ज्ञान, कुंडली अध्ययन और हमारे आचार्यों से व्यक्तिगत मार्गदर्शन।",

    exploreTitle:
      "आप किस विषय पर मार्गदर्शन चाहते हैं?",

    career: "करियर",
    marriage: "विवाह",
    muhurat: "मुहूर्त",
    education: "शिक्षा",

    kundliTitle: "अपनी कुंडली तैयार करें",
    talkAcharya: "आचार्य से बात करें",

    ourAcharyas: "हमारे आचार्य",

    back: "← वापस"
  },

  en: {
    chooseLanguage: "Choose your language",
    languageSubtitle: "Select your preferred language to continue.",

    welcome: "Welcome",
    loginSubtitle: "Start your astrology journey.",

    namePlaceholder: "Your name",
    phonePlaceholder: "Mobile number",

    login: "Login / Create Account",
    guest: "Continue as Guest",

    home: "Home",
    acharya: "Acharyas",
    kundli: "Kundli",
    rashifal: "Horoscope",
    call: "Call",
    about: "About Us",

    heroTitle: "Find direction through knowledge.",
    heroText:
      "Vedic wisdom, Kundli study and personal guidance from our Acharyas.",

    exploreTitle:
      "What would you like guidance about?",

    career: "Career",
    marriage: "Marriage",
    muhurat: "Muhurat",
    education: "Education",

    kundliTitle: "Prepare your Kundli",
    talkAcharya: "Talk to an Acharya",

    ourAcharyas: "Our Acharyas",

    back: "← Back"
  },

  sa: {
    chooseLanguage: "स्वभाषां चिनुत",
    languageSubtitle: "अग्रे गन्तुं स्वस्य भाषां चिनुत।",

    welcome: "स्वागतम्",
    loginSubtitle: "ज्योतिषयात्रां प्रारभताम्।",

    namePlaceholder: "नाम लिखतु",
    phonePlaceholder: "दूरभाषाङ्कः",

    login: "प्रवेशः / खातं रचयतु",
    guest: "अतिथिरूपेण प्रविशतु",

    home: "गृहम्",
    acharya: "आचार्याः",
    kundli: "जन्मपत्रिका",
    rashifal: "राशिफलम्",
    call: "सम्भाषणम्",
    about: "अस्माकं विषये",

    heroTitle: "ज्ञानस्य दिशां प्राप्नुवन्तु।",
    heroText:
      "वैदिकज्ञानं, जन्मपत्रिकाध्ययनं, आचार्यैः व्यक्तिगतं मार्गदर्शनम्।",

    exploreTitle:
      "कस्मिन् विषये मार्गदर्शनम् इच्छति?",

    career: "जीविका",
    marriage: "विवाहः",
    muhurat: "मुहूर्तः",
    education: "शिक्षा",

    kundliTitle: "जन्मपत्रिकां निर्मातुम्",
    talkAcharya: "आचार्येण सह सम्भाषणम्",

    ourAcharyas: "अस्माकम् आचार्याः",

    back: "← प्रत्यागच्छतु"
  },

  bn: {
    chooseLanguage: "আপনার ভাষা বেছে নিন",
    languageSubtitle: "এগিয়ে যেতে আপনার পছন্দের ভাষা নির্বাচন করুন।",

    welcome: "স্বাগতম",
    loginSubtitle: "আপনার জ্যোতিষ যাত্রা শুরু করুন।",

    namePlaceholder: "আপনার নাম",
    phonePlaceholder: "মোবাইল নম্বর",

    login: "লগইন / অ্যাকাউন্ট তৈরি করুন",
    guest: "অতিথি হিসেবে চালিয়ে যান",

    home: "হোম",
    acharya: "আচার্য",
    kundli: "কুণ্ডলী",
    rashifal: "রাশিফল",
    call: "কল",
    about: "আমাদের সম্পর্কে",

    heroTitle: "জ্ঞানের মাধ্যমে আপনার প্রশ্নের দিশা খুঁজুন।",
    heroText:
      "বৈদিক জ্ঞান, কুণ্ডলী এবং আচার্যের ব্যক্তিগত পরামর্শ।",

    exploreTitle:
      "কোন বিষয়ে নির্দেশনা চান?",

    career: "ক্যারিয়ার",
    marriage: "বিবাহ",
    muhurat: "মুহূর্ত",
    education: "শিক্ষা",

    kundliTitle: "আপনার কুণ্ডলী তৈরি করুন",
    talkAcharya: "আচার্যের সঙ্গে কথা বলুন",

    ourAcharyas: "আমাদের আচার্য",

    back: "← ফিরে যান"
  },

  mr: {
    chooseLanguage: "तुमची भाषा निवडा",
    languageSubtitle: "पुढे जाण्यासाठी तुमची पसंतीची भाषा निवडा.",

    welcome: "स्वागत आहे",
    loginSubtitle: "तुमचा ज्योतिष प्रवास सुरू करा.",

    namePlaceholder: "तुमचे नाव",
    phonePlaceholder: "मोबाईल नंबर",

    login: "लॉगिन / खाते तयार करा",
    guest: "Guest म्हणून पुढे जा",

    home: "होम",
    acharya: "आचार्य",
    kundli: "कुंडली",
    rashifal: "राशिभविष्य",
    call: "कॉल",
    about: "आमच्याबद्दल",

    heroTitle: "ज्ञानातून तुमच्या प्रश्नांना दिशा द्या.",
    heroText:
      "वैदिक ज्ञान, कुंडली आणि आचार्यांचे वैयक्तिक मार्गदर्शन.",

    exploreTitle:
      "तुम्हाला कोणत्या विषयावर मार्गदर्शन हवे आहे?",

    career: "करिअर",
    marriage: "विवाह",
    muhurat: "मुहूर्त",
    education: "शिक्षण",

    kundliTitle: "तुमची कुंडली तयार करा",
    talkAcharya: "आचार्यांशी बोला",

    ourAcharyas: "आमचे आचार्य",

    back: "← मागे"
  },

  ta: {
    chooseLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    languageSubtitle: "தொடர உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்.",

    welcome: "வரவேற்கிறோம்",
    loginSubtitle: "உங்கள் ஜோதிடப் பயணத்தைத் தொடங்குங்கள்.",

    namePlaceholder: "உங்கள் பெயர்",
    phonePlaceholder: "மொபைல் எண்",

    login: "உள்நுழைவு / கணக்கு உருவாக்கு",
    guest: "விருந்தினராக தொடரவும்",

    home: "முகப்பு",
    acharya: "ஆச்சார்யர்கள்",
    kundli: "குண்டலி",
    rashifal: "ராசிபலன்",
    call: "அழைப்பு",
    about: "எங்களைப் பற்றி",

    heroTitle: "அறிவின் மூலம் உங்கள் கேள்விகளுக்கு வழிகாட்டுங்கள்.",
    heroText:
      "வேத அறிவு, குண்டலி மற்றும் ஆச்சார்யர்களின் தனிப்பட்ட வழிகாட்டுதல்.",

    exploreTitle:
      "எந்த விஷயத்தில் வழிகாட்டுதல் வேண்டும்?",

    career: "தொழில்",
    marriage: "திருமணம்",
    muhurat: "முகூர்த்தம்",
    education: "கல்வி",

    kundliTitle: "உங்கள் குண்டலியை உருவாக்குங்கள்",
    talkAcharya: "ஆச்சார்யருடன் பேசுங்கள்",

    ourAcharyas: "எங்கள் ஆச்சார்யர்கள்",

    back: "← திரும்பு"
  }

};


/* =========================================================
   ACHARYA DATA
   ========================================================= */

const acharyas = [

  {
    id: "shreekant",
    name: "श्रीकांत मिश्रा",
    english: "Shreekant Mishra",
    qualification:
      "वैदिक मार्गदर्शन • संस्कार • शास्त्रीय अध्ययन",
    image: "assets/acharyas/shreekant.jpg"
  },

  {
    id: "shudhanshu",
    name: "शुधांशु दुबे",
    english: "Shudhanshu Dubey",
    qualification:
      "वैदिक ज्योतिष • जन्म-कुंडली • प्रश्न परामर्श",
    image: "assets/acharyas/shudhanshu.jpg"
  },

  {
    id: "siddhant",
    name: "सिद्धांत मिश्रा",
    english: "Siddhant Mishra",
    qualification:
      "संस्कृत व्याकरण • शास्त्रीय भाषा • अध्ययन",
    image: "assets/acharyas/siddhant.jpg"
  }

];


/* =========================================================
   SERVICE DATA
   ========================================================= */

const services = {

  career: {
    title: "करियर",
    description:
      "करियर और कार्यक्षेत्र से जुड़े अलग-अलग विषयों पर मार्गदर्शन।",

    options: [
      ["💼", "नौकरी", "नौकरी और रोजगार"],
      ["🏛", "सरकारी नौकरी", "सरकारी क्षेत्र और प्रतियोगी परीक्षा"],
      ["📈", "प्रमोशन", "पदोन्नति और करियर growth"],
      ["🌍", "विदेश / Relocation", "विदेश या स्थान परिवर्तन"],
      ["🏢", "Business", "व्यवसाय से जुड़े प्रश्न"],
      ["🧭", "Career Direction", "करियर की दिशा"]
    ]
  },

  marriage: {
    title: "विवाह",
    description:
      "विवाह और संबंध से जुड़े विषयों के लिए मार्गदर्शन।",

    options: [
      ["♡", "विवाह योग", "विवाह से जुड़े प्रश्न"],
      ["♧", "Compatibility", "दो लोगों की कुंडली का अध्ययन"],
      ["💍", "विवाह में देरी", "देरी से जुड़े प्रश्न"],
      ["♥", "Relationship", "संबंध और पारिवारिक विषय"],
      ["✦", "विवाह मुहूर्त", "शुभ विवाह समय"]
    ]
  },

  muhurat: {
    title: "मुहूर्त",
    description:
      "महत्वपूर्ण कार्यों के लिए शुभ समय देखने की सुविधा।",

    options: [
      ["🏠", "गृह प्रवेश", "नए घर में प्रवेश"],
      ["💍", "विवाह", "विवाह का शुभ समय"],
      ["🏢", "Business Start", "व्यवसाय शुरू करने का समय"],
      ["🚗", "वाहन", "वाहन खरीदने का समय"],
      ["📚", "शिक्षा", "शिक्षा से जुड़े शुभ समय"]
    ]
  },

  education: {
    title: "शिक्षा",
    description:
      "अध्ययन, परीक्षा और शिक्षा से जुड़े प्रश्नों पर मार्गदर्शन।",

    options: [
      ["📚", "अध्ययन", "अध्ययन की दिशा"],
      ["🎓", "Higher Education", "उच्च शिक्षा"],
      ["📝", "परीक्षा", "परीक्षा और तैयारी"],
      ["🌍", "विदेश में शिक्षा", "विदेशी शिक्षा"],
      ["🧭", "विषय चयन", "उपयुक्त विषय"]
    ]
  }

};


/* =========================================================
   STATE
   ========================================================= */

let currentLanguage =
  localStorage.getItem("nakshatraLanguage") || null;

let currentTheme =
  localStorage.getItem("nakshatraTheme") || "light";

let userName =
  localStorage.getItem("nakshatraUserName") || "Guest";


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = id =>
  document.getElementById(id);


/* =========================================================
   SAFE TEXT HELPER
   ========================================================= */

function setText(id, text) {

  const element = $(id);

  if (element) {
    element.textContent = text;
  }

}


/* =========================================================
   LANGUAGE BUTTONS
   ========================================================= */

document
  .querySelectorAll(".language")
  .forEach(button => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".language")
        .forEach(item => {
          item.classList.remove("active");
        });

      button.classList.add("active");

      currentLanguage =
        button.dataset.lang;

    });

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

      if (!currentLanguage) {
        currentLanguage = "hi";
      }

      localStorage.setItem(
        "nakshatraLanguage",
        currentLanguage
      );

      applyLanguage(currentLanguage);

      $("languageScreen")
        .classList.add("hidden");

      $("loginScreen")
        .classList.remove("hidden");

    }
  );

}


/* =========================================================
   APPLY LANGUAGE
   ========================================================= */

function applyLanguage(lang) {

  const data =
    translations[lang] ||
    translations.hi;

  document.documentElement.lang =
    lang;

  /* Main visible headings */

  const languageTitle =
    $("languageScreen")?.querySelector("h1");

  if (languageTitle) {
    languageTitle.textContent =
      data.chooseLanguage;
  }

  const languageSubtitle =
    $("languageScreen")?.querySelector("p");

  if (languageSubtitle) {
    languageSubtitle.textContent =
      data.languageSubtitle;
  }


  /* Login */

  const loginTitle =
    $("loginScreen")?.querySelector("h1");

  if (loginTitle) {
    loginTitle.textContent =
      data.welcome;
  }

  const loginSubtitle =
    $("loginScreen")?.querySelector("p");

  if (loginSubtitle) {
    loginSubtitle.textContent =
      data.loginSubtitle;
  }

  const nameInput =
    $("userNameInput");

  if (nameInput) {
    nameInput.placeholder =
      data.namePlaceholder;
  }

  const phoneInput =
    $("userPhoneInput");

  if (phoneInput) {
    phoneInput.placeholder =
      data.phonePlaceholder;
  }

  setText(
    "loginButton",
    data.login
  );

  setText(
    "guestButton",
    data.guest
  );


  /* Bottom navigation */

  const bottomButtons =
    document.querySelectorAll(
      ".bottom-nav button"
    );

  if (bottomButtons.length >= 5) {

    setText(
      bottomButtons[0]
        .querySelector("small"),
      data.home
    );

    setText(
      bottomButtons[1]
        .querySelector("small"),
      data.acharya
    );

    setText(
      bottomButtons[2]
        .querySelector("small"),
      data.call
    );

    setText(
      bottomButtons[3]
        .querySelector("small"),
      data.kundli
    );

    setText(
      bottomButtons[4]
        .querySelector("small"),
      data.rashifal
    );

  }


  /* Home */

  const hero =
    $("homePage");

  if (hero) {

    const h1 =
      hero.querySelector(".hero h1");

    const p =
      hero.querySelector(".hero p");

    const sectionTitle =
      hero.querySelector(
        ".section-title h2"
      );

    if (h1) {
      h1.innerHTML =
        data.heroTitle;
    }

    if (p) {
      p.textContent =
        data.heroText;
    }

    if (sectionTitle) {
      sectionTitle.textContent =
        data.exploreTitle;
    }

  }

}


/* =========================================================
   LOGIN
   ========================================================= */

const loginButton =
  $("loginButton");

if (loginButton) {

  loginButton.addEventListener(
    "click",
    () => {

      const name =
        $("userNameInput")?.value.trim();

      userName =
        name || "Guest";

      localStorage.setItem(
        "nakshatraUserName",
        userName
      );

      localStorage.setItem(
        "nakshatraLoggedIn",
        "true"
      );

      openApp();

    }
  );

}


/* =========================================================
   GUEST
   ========================================================= */

const guestButton =
  $("guestButton");

if (guestButton) {

  guestButton.addEventListener(
    "click",
    () => {

      userName = "Guest";

      localStorage.setItem(
        "nakshatraUserName",
        "Guest"
      );

      localStorage.setItem(
        "nakshatraLoggedIn",
        "guest"
      );

      openApp();

    }
  );

}


/* =========================================================
   OPEN APP
   ========================================================= */

function openApp() {

  $("languageScreen")
    ?.classList.add("hidden");

  $("loginScreen")
    ?.classList.add("hidden");

  $("mainApp")
    ?.classList.remove("hidden");

  applyTheme();

  updateAccount();

  renderAcharyas();

  renderCallList();

  showPage("home");

}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(pageName) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove("active");

    });


  const page =
    $(`${pageName}Page`);

  if (page) {

    page.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  closeMenu();

}


/* =========================================================
   ALL DATA-PAGE BUTTONS
   ========================================================= */

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-page]"
      );

    if (!button) return;

    showPage(
      button.dataset.page
    );

  }
);


/* =========================================================
   SIDE MENU
   ========================================================= */

const sideMenu =
  $("sideMenu");

const menuOverlay =
  $("menuOverlay");

const menuButton =
  $("menuButton");

const closeMenuButton =
  $("closeMenu");


if (menuButton) {

  menuButton.addEventListener(
    "click",
    () => {

      sideMenu?.classList.add("open");

      menuOverlay?.classList.add("show");

    }
  );

}


if (closeMenuButton) {

  closeMenuButton.addEventListener(
    "click",
    closeMenu
  );

}


if (menuOverlay) {

  menuOverlay.addEventListener(
    "click",
    closeMenu
  );

}


function closeMenu() {

  sideMenu?.classList.remove("open");

  menuOverlay?.classList.remove("show");

}


/* =========================================================
   ACCOUNT
   ========================================================= */

const accountButton =
  $("accountButton");

if (accountButton) {

  accountButton.addEventListener(
    "click",
    () => {

      showPage("account");

    }
  );

}


function updateAccount() {

  setText(
    "accountName",
    userName
  );

  const letter =
    (userName || "G")
      .charAt(0)
      .toUpperCase();

  setText(
    "profileLetter",
    letter
  );

  setText(
    "bigProfileLetter",
    letter
  );

}


/* =========================================================
   THEME
   ========================================================= */

function applyTheme() {

  document.body.classList.toggle(
    "dark",
    currentTheme === "dark"
  );

}


const themeSetting =
  $("themeSetting");

if (themeSetting) {

  themeSetting.addEventListener(
    "click",
    () => {

      currentTheme =
        currentTheme === "light"
          ? "dark"
          : "light";

      localStorage.setItem(
        "nakshatraTheme",
        currentTheme
      );

      applyTheme();

    }
  );

}


/* =========================================================
   CHANGE LANGUAGE FROM ACCOUNT
   ========================================================= */

const languageSetting =
  $("languageSetting");

if (languageSetting) {

  languageSetting.addEventListener(
    "click",
    () => {

      $("mainApp")
        ?.classList.add("hidden");

      $("languageScreen")
        ?.classList.remove("hidden");

      document
        .querySelectorAll(".language")
        .forEach(button => {

          button.classList.toggle(
            "active",
            button.dataset.lang ===
              currentLanguage
          );

        });

    }
  );

}


/* =========================================================
   LOGOUT
   ========================================================= */

const logoutButton =
  $("logoutButton");

if (logoutButton) {

  logoutButton.addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        "nakshatraLoggedIn"
      );

      localStorage.removeItem(
        "nakshatraUserName"
      );

      userName = "Guest";

      $("mainApp")
        ?.classList.add("hidden");

      $("loginScreen")
        ?.classList.remove("hidden");

    }
  );

}


/* =========================================================
   ACHARYA RENDER
   ========================================================= */

function renderAcharyas() {

  const homeList =
    $("homeAcharyaList");

  const grid =
    $("acharyaGrid");


  if (homeList) {
    homeList.innerHTML = "";
  }

  if (grid) {
    grid.innerHTML = "";
  }


  acharyas.forEach(acharya => {


    /* HOME LIST */

    if (homeList) {

      homeList.innerHTML += `

        <button
          class="acharya-item"
          data-acharya="${acharya.id}"
        >

          <img
            class="acharya-photo"
            src="${acharya.image}"
            alt="${acharya.name}"
            onerror="this.style.display='none'"
          >

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

          <strong>›</strong>

        </button>

      `;

    }


    /* ACHARYA PAGE */

    if (grid) {

      grid.innerHTML += `

        <article class="acharya-profile">

          <img
            class="profile-photo"
            src="${acharya.image}"
            alt="${acharya.name}"
            onerror="
              this.style.display='none';
              this.parentElement.style.background='var(--surface2)';
            "
          >

          <div class="profile-body">

            <h2>
             ${acharya.name}
            </h2>

            <p>
              ${acharya.qualification}
            </p>

            <span class="online">
              ● Online
            </span>

            <button
              class="call-btn"
              onclick="startConsultation('${acharya.id}')"
            >
              ☎ आचार्य से बात करें
            </button>

          </div>

        </article>

      `;

    }

  });

}


/* =========================================================
   CALL LIST
   ========================================================= */

function renderCallList() {

  const list =
    $("callList");

  if (!list) return;

  list.innerHTML = "";


  acharyas.forEach(acharya => {

    list.innerHTML += `

      <div class="call-person">

        <img
          class="acharya-photo"
          src="${acharya.image}"
          alt="${acharya.name}"
          onerror="this.style.display='none'"
        >

        <div class="call-person-info">

          <strong>
            ${acharya.name}
          </strong>

          <span>
            ${acharya.qualification}
          </span>

          <span class="online">
            ● Online
          </span>

        </div>

        <button
          class="phone-button"
          onclick="startConsultation('${acharya.id}')"
          aria-label="Call"
        >
          ☎
        </button>

      </div>

    `;

  });

}


/* =========================================================
   MAIN CALL BUTTON
   ========================================================= */

const mainCallButton =
  $("mainCallButton");

if (mainCallButton) {

  mainCallButton.addEventListener(
    "click",
    () => {

      showPage("call");

    }
  );

}


/* =========================================================
   CONSULTATION
   ========================================================= */

function startConsultation(id) {

  const acharya =
    acharyas.find(
      item => item.id === id
    );

  if (!acharya) return;


  alert(
    `${acharya.name} से संपर्क का वास्तविक Audio/Video Call सिस्टम अगले चरण में जोड़ा जाएगा।`
  );

}


/* =========================================================
   SERVICE CARDS
   ========================================================= */

document
  .querySelectorAll("[data-service]")
  .forEach(card => {

    card.addEventListener(
      "click",
      () => {

        openService(
          card.dataset.service
        );

      }
    );

  });


function openService(type) {

  const service =
    services[type];

  if (!service) return;


  setText(
    "serviceTitle",
    service.title
  );

  setText(
    "serviceDescription",
    service.description
  );


  const container =
    $("serviceOptions");

  if (!container) return;

  container.innerHTML = "";


  service.options.forEach(
    option => {

      container.innerHTML += `

        <button
          class="service-option"
          onclick="selectService('${option[1]}')"
        >

          <div class="icon">
            ${option[0]}
          </div>

          <h3>
            ${option[1]}
          </h3>

          <p>
            ${option[2]}
          </p>

        </button>

      `;

    }
  );


  showPage("service");

}


/* =========================================================
   SERVICE OPTION
   ========================================================= */

function selectService(name) {

  alert(
    `"${name}" का विस्तृत सिस्टम अगले development चरण में जोड़ा जाएगा।`
  );

}


/* =========================================================
   KUNDLI DEMO
   ========================================================= */

const kundliForm =
  $("kundliForm");

if (kundliForm) {

  kundliForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =
        $("birthName")?.value || "";

      const date =
        $("birthDate")?.value || "";

      const time =
        $("birthTime")?.value || "";

      const place =
        $("birthPlace")?.value || "";


      const result =
        $("kundliResult");

      if (!result) return;


      result.innerHTML = `

        <div class="big-symbol">
          ✦
        </div>

        <span class="gold-label">
          KUNDLI PROFILE
        </span>

        <h2>
          ${name}
        </h2>

        <p>
          जन्म तारीख: ${date}<br>
          जन्म समय: ${time}<br>
          जन्म स्थान: ${place}
        </p>

        <p style="margin-top:15px;">
          यह अभी frontend demo है।
          वास्तविक ग्रह-गणना और Kundli engine
          बाद में Python backend से जोड़ा जाएगा।
        </p>

      `;

    }
  );

}


/* =========================================================
   RASHIFAL
   ========================================================= */

const rashifalButtons =
  document.querySelectorAll(
    ".zodiac-grid button"
  );

const rashifalResult =
  document.querySelector(
    "#rashifalPage .result-card"
  );


rashifalButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        if (!rashifalResult) return;

        const sign =
          button.textContent.trim();


        rashifalResult.innerHTML = `

          <span class="gold-label">
            TODAY
          </span>

          <h2>
            ${sign}
          </h2>

          <p>
            इस राशि का दैनिक राशिफल
            यहाँ दिखाई जाएगा।
          </p>

          <p style="margin-top:15px;">
            वास्तविक दैनिक राशिफल engine
            अगले चरण में जोड़ा जाएगा।
          </p>

        `;

      }
    );

  }
);


/* =========================================================
   INITIAL START
   ========================================================= */

(function init() {

  applyTheme();


  /* पहली बार हमेशा Language Screen */

  if (!currentLanguage) {

    $("languageScreen")
      ?.classList.remove("hidden");

    $("loginScreen")
      ?.classList.add("hidden");

    $("mainApp")
      ?.classList.add("hidden");

    currentLanguage = "hi";

    return;

  }


  /* पहले से language चुनी है */

  applyLanguage(
    currentLanguage
  );


  const loggedIn =
    localStorage.getItem(
      "nakshatraLoggedIn"
    );


  if (loggedIn) {

    openApp();

  } else {

    $("languageScreen")
      ?.classList.add("hidden");

    $("loginScreen")
      ?.classList.remove("hidden");

    $("mainApp")
      ?.classList.add("hidden");

  }

})();
   
