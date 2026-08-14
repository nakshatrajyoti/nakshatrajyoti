/* =====================================================
   NAKSHATRA JYOTI
   MAIN APPLICATION LOGIC
===================================================== */


/* =====================================================
   LANGUAGE DATA
===================================================== */

const translations = {

  hi: {

    chooseLanguage: "अपनी भाषा चुनें",
    languageSubtitle: "आगे बढ़ने के लिए अपनी पसंद की भाषा चुनें।",
    languageNote: "आप बाद में Account → Language से भाषा बदल सकते हैं।",

    welcome: "स्वागत है",
    loginSubtitle: "अपनी यात्रा शुरू करने के लिए लॉगिन करें।",

    namePlaceholder: "अपना नाम लिखें",
    phonePlaceholder: "मोबाइल नंबर",

    tagline: "वैदिक मार्गदर्शन",

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
    careerDesc: "नौकरी, व्यवसाय और दिशा",

    marriage: "विवाह",
    marriageDesc: "विवाह एवं संबंध",

    muhurat: "मुहूर्त",
    muhuratDesc: "शुभ समय",

    education: "शिक्षा",
    educationDesc: "अध्ययन एवं दिशा",

    kundliPromo: "अपनी कुंडली तैयार करें",

    kundliPromoText:
      "जन्म विवरण देकर अपनी व्यक्तिगत कुंडली तैयार करें।",

    talkAcharya: "आचार्य से व्यक्तिगत बातचीत",

    ourAcharyas: "हमारे आचार्य",

    callAcharya: "आचार्य से बात करें",

    makeKundli: "अपनी कुंडली तैयार करें"

  },


  en: {

    chooseLanguage: "Choose your language",
    languageSubtitle: "Select your preferred language to continue.",
    languageNote: "You can change your language later from Account → Language.",

    welcome: "Welcome",
    loginSubtitle: "Login to begin your journey.",

    namePlaceholder: "Enter your name",
    phonePlaceholder: "Mobile number",

    tagline: "Vedic Guidance",

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
    careerDesc: "Jobs, business and direction",

    marriage: "Marriage",
    marriageDesc: "Marriage and relationships",

    muhurat: "Muhurat",
    muhuratDesc: "Auspicious timing",

    education: "Education",
    educationDesc: "Study and direction",

    kundliPromo: "Prepare your Kundli",

    kundliPromoText:
      "Enter your birth details to prepare your personal Kundli.",

    talkAcharya: "Talk personally with an Acharya",

    ourAcharyas: "Our Acharyas",

    callAcharya: "Talk to an Acharya",

    makeKundli: "Prepare your Kundli"

  },


  sa: {

    chooseLanguage: "स्वभाषां चिनुत",
    languageSubtitle: "अग्रे गन्तुं स्वस्य भाषां चिनुत।",

    welcome: "स्वागतम्",

    home: "गृहम्",
    acharya: "आचार्याः",
    kundli: "जन्मपत्रिका",
    rashifal: "राशिफलम्",
    call: "सम्भाषणम्",
    about: "अस्माकं विषये",

    heroTitle: "ज्ञानस्य दिशां प्राप्नुवन्तु।",

    exploreTitle: "कस्मिन् विषये मार्गदर्शनम् इच्छति?",

    career: "जीविका",
    marriage: "विवाहः",
    muhurat: "मुहूर्तः",
    education: "शिक्षा",

    ourAcharyas: "अस्माकम् आचार्याः",

    callAcharya: "आचार्येण सह सम्भाषणम्",

    makeKundli: "जन्मपत्रिकां निर्मातुम्"

  },


  bn: {

    chooseLanguage: "আপনার ভাষা বেছে নিন",
    languageSubtitle: "এগিয়ে যেতে আপনার পছন্দের ভাষা নির্বাচন করুন।",

    welcome: "স্বাগতম",

    home: "হোম",
    acharya: "আচার্য",
    kundli: "কুণ্ডলী",
    rashifal: "রাশিফল",
    call: "কল",
    about: "আমাদের সম্পর্কে",

    heroTitle: "জ্ঞান থেকে আপনার পথ খুঁজে নিন।",

    exploreTitle: "আপনি কোন বিষয়ে নির্দেশনা চান?",

    career: "ক্যারিয়ার",
    marriage: "বিবাহ",
    muhurat: "মুহূর্ত",
    education: "শিক্ষা",

    ourAcharyas: "আমাদের আচার্য",

    callAcharya: "আচার্যের সঙ্গে কথা বলুন",

    makeKundli: "আপনার কুণ্ডলী তৈরি করুন"

  },


  mr: {

    chooseLanguage: "तुमची भाषा निवडा",
    languageSubtitle: "पुढे जाण्यासाठी तुमची पसंतीची भाषा निवडा.",

    welcome: "स्वागत आहे",

    home: "होम",
    acharya: "आचार्य",
    kundli: "कुंडली",
    rashifal: "राशिभविष्य",
    call: "कॉल",
    about: "आमच्याबद्दल",

    heroTitle: "ज्ञानातून तुमच्या प्रश्नांना दिशा द्या.",

    exploreTitle: "तुम्हाला कोणत्या विषयावर मार्गदर्शन हवे आहे?",

    career: "करिअर",
    marriage: "विवाह",
    muhurat: "मुहूर्त",
    education: "शिक्षण",

    ourAcharyas: "आमचे आचार्य",

    callAcharya: "आचार्यांशी बोला",

    makeKundli: "तुमची कुंडली तयार करा"

  },


  ta: {

    chooseLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    languageSubtitle: "தொடர உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்.",

    welcome: "வரவேற்கிறோம்",

    home: "முகப்பு",
    acharya: "ஆச்சார்யர்கள்",
    kundli: "குண்டலி",
    rashifal: "ராசிபலன்",
    call: "அழைப்பு",
    about: "எங்களைப் பற்றி",

    heroTitle: "அறிவின் மூலம் உங்கள் கேள்விகளுக்கு வழிகாட்டுங்கள்.",

    exploreTitle: "எந்த விஷயத்தில் வழிகாட்டுதல் வேண்டும்?",

    career: "தொழில்",
    marriage: "திருமணம்",
    muhurat: "முகூர்த்தம்",
    education: "கல்வி",

    ourAcharyas: "எங்கள் ஆச்சார்யர்கள்",

    callAcharya: "ஆச்சார்யருடன் பேசுங்கள்",

    makeKundli: "உங்கள் குண்டலியை உருவாக்குங்கள்"

  }

};


/* =====================================================
   ACHARYA DATA
===================================================== */

const acharyas = [

  {

    id: "shudhanshu",

    name: "ज्योतिषाचार्य शुधांशु दुबे",

    english:
      "Jyotishacharya Shudhanshu Dubey",

    qualification:
      "वैदिक ज्योतिष • जन्म-कुंडली • प्रश्न परामर्श",

    image:
      "assets/acharyas/shudhanshu.jpg"

  },

  {

    id: "siddhant",

    name: "व्याकरणाचार्य सिद्धांत मिश्रा",

    english:
      "Vyakaranaacharya Siddhant Mishra",

    qualification:
      "संस्कृत व्याकरण • शास्त्रीय भाषा • अध्ययन",

    image:
      "assets/acharyas/siddhant.jpg"

  },

  {

    id: "shreekant",

    name: "वैदिक श्रीकांत मिश्रा",

    english:
      "Vaidik Shreekant Mishra",

    qualification:
      "वेद-अध्ययन • वैदिक परंपरा • संस्कार",

    image:
      "assets/acharyas/shreekant.jpg"

  }

];


/* =====================================================
   SERVICE DATA
===================================================== */

const services = {

  career: {

    title: "करियर",

    description:
      "करियर और कार्यक्षेत्र से जुड़े अलग-अलग विषयों पर मार्गदर्शन।",

    options: [

      ["💼", "नौकरी", "नौकरी और रोजगार से जुड़े प्रश्न"],

      ["🏛", "सरकारी नौकरी", "प्रतियोगी परीक्षा और सरकारी क्षेत्र"],

      ["📈", "प्रमोशन", "करियर growth और पदोन्नति"],

      ["🌍", "विदेश / Relocation", "विदेश जाने या स्थान परिवर्तन"],

      ["🏢", "Business", "व्यवसाय और उद्यम से जुड़े प्रश्न"],

      ["🧭", "Career Direction", "किस दिशा में आगे बढ़ें"]

    ]

  },


  marriage: {

    title: "विवाह",

    description:
      "विवाह और संबंध से जुड़े विषयों के लिए अलग-अलग मार्गदर्शन।",

    options: [

      ["♡", "विवाह योग", "विवाह के समय से जुड़े प्रश्न"],

      ["♧", "Compatibility", "दो लोगों की कुंडली का अध्ययन"],

      ["💍", "विवाह में देरी", "देरी से जुड़े ज्योतिषीय प्रश्न"],

      ["♥", "Relationship", "संबंध और पारिवारिक विषय"],

      ["✦", "विवाह मुहूर्त", "शुभ विवाह समय"]

    ]

  },


  muhurat: {

    title: "मुहूर्त",

    description:
      "महत्वपूर्ण कार्यों के लिए शुभ समय देखने की सुविधा।",

    options: [

      ["🏠", "गृह प्रवेश", "नए घर में प्रवेश का शुभ समय"],

      ["💍", "विवाह", "विवाह के लिए शुभ मुहूर्त"],

      ["🏢", "Business Start", "व्यवसाय शुरू करने का समय"],

      ["🚗", "वाहन", "वाहन खरीदने का शुभ समय"],

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

      ["🌍", "विदेश में शिक्षा", "विदेशी शिक्षा से जुड़े प्रश्न"],

      ["🧭", "विषय चयन", "उपयुक्त विषय चुनने में मार्गदर्शन"]

    ]

  }

};


/* =====================================================
   GLOBAL STATE
===================================================== */

let currentLanguage =
  localStorage.getItem("nakshatraLanguage") || null;

let currentTheme =
  localStorage.getItem("nakshatraTheme") || "light";

let userName =
  localStorage.getItem("nakshatraUserName") || "Guest";


/* =====================================================
   DOM
===================================================== */

const languageScreen =
  document.getElementById("languageScreen");

const loginScreen =
  document.getElementById("loginScreen");

const app =
  document.getElementById("app");

const pageContainer =
  document.getElementById("pageContainer");


/* =====================================================
   LANGUAGE START
===================================================== */

document
  .querySelectorAll(".language-btn")
  .forEach(button => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".language-btn")
        .forEach(b =>
          b.classList.remove("active")
        );

      button.classList.add("active");

      currentLanguage =
        button.dataset.lang;

    });

  });


document
  .getElementById("continueLanguage")
  .addEventListener("click", () => {

    if (!currentLanguage) {

      currentLanguage = "hi";

    }

    localStorage.setItem(
      "nakshatraLanguage",
      currentLanguage
    );

    applyLanguage(currentLanguage);

    languageScreen.classList.add("hidden");

    if (
      localStorage.getItem("nakshatraLoggedIn")
    ) {

      openApp();

    } else {

      loginScreen.classList.remove("hidden");

    }

  });


/* =====================================================
   APPLY LANGUAGE
===================================================== */

function applyLanguage(lang) {

  const data =
    translations[lang] ||
    translations.hi;

  document.documentElement.lang =
    lang === "hi" ? "hi" : "en";


  document
    .querySelectorAll("[data-i18n]")
    .forEach(element => {

      const key =
        element.dataset.i18n;

      if (data[key]) {

        element.textContent =
          data[key];

      }

    });


  document
    .querySelectorAll("[data-placeholder]")
    .forEach(element => {

      const key =
        element.dataset.placeholder;

      if (data[key]) {

        element.placeholder =
          data[key];

      }

    });

}


/* =====================================================
   LOGIN
===================================================== */

document
  .getElementById("loginBtn")
  .addEventListener("click", () => {

    const name =
      document
        .getElementById("loginName")
        .value
        .trim();

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

  });


document
  .getElementById("skipLogin")
  .addEventListener("click", () => {

    localStorage.setItem(
      "nakshatraLoggedIn",
      "guest"
    );

    userName = "Guest";

    openApp();

  });


/* =====================================================
   OPEN APP
===================================================== */

function openApp() {

  languageScreen.classList.add("hidden");

  loginScreen.classList.add("hidden");

  app.classList.remove("hidden");

  applyTheme();

  updateAccount();

  renderAcharyas();

  renderCallList();

  showPage("home");

}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageName) {

  document
    .querySelectorAll(".page")
    .forEach(page =>
      page.classList.remove("active")
    );


  const page =
    document.getElementById(
      pageName + "Page"
    );

  if (page) {

    page.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

  closeMenu();

}


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


/* =====================================================
   MENU
===================================================== */

const sideMenu =
  document.getElementById("sideMenu");

const overlay =
  document.getElementById("overlay");


document
  .getElementById("menuBtn")
  .addEventListener(
    "click",
    () => {

      sideMenu.classList.add("open");

      overlay.classList.add("show");

    }
  );


document
  .getElementById("closeMenu")
  .addEventListener(
    "click",
    closeMenu
  );


overlay.addEventListener(
  "click",
  closeMenu
);


function closeMenu() {

  sideMenu.classList.remove("open");

  overlay.classList.remove("show");

}


/* =====================================================
   ACCOUNT
===================================================== */

document
  .getElementById("accountBtn")
  .addEventListener(
    "click",
    () => showPage("account")
  );


function updateAccount() {

  document.getElementById(
    "accountName"
  ).textContent = userName;

  document.getElementById(
    "profileName"
  ).textContent = userName;


  const letter =
    userName
      .charAt(0)
      .toUpperCase();


  document.getElementById(
    "avatar"
  ).textContent = letter;

  document.getElementById(
    "bigAvatar"
  ).textContent = letter;

}


/* =====================================================
   THEME
===================================================== */

function applyTheme() {

  document.body.classList.toggle(
    "dark",
    currentTheme === "dark"
  );

}


document
  .getElementById("themeSetting")
  .addEventListener(
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


/* =====================================================
   LANGUAGE FROM ACCOUNT
===================================================== */

document
  .getElementById("languageSetting")
  .addEventListener(
    "click",
    () => {

      app.classList.add("hidden");

      languageScreen.classList.remove(
        "hidden"
      );

      document
        .querySelectorAll(".language-btn")
        .forEach(button => {

          button.classList.toggle(
            "active",
            button.dataset.lang ===
              currentLanguage
          );

        });

    }
  );


/* =====================================================
   LOGOUT
===================================================== */

document
  .getElementById("logoutBtn")
  .addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        "nakshatraLoggedIn"
      );

      localStorage.removeItem(
        "nakshatraUserName"
      );

      userName = "Guest";

      app.classList.add("hidden");

      loginScreen.classList.remove(
        "hidden"
      );

    }
  );


/* =====================================================
   ACHARYA RENDER
===================================================== */

function renderAcharyas() {

  const preview =
    document.getElementById(
      "acharyaPreview"
    );

  const full =
    document.getElementById(
      "acharyaFullList"
    );


  preview.innerHTML = "";

  full.innerHTML = "";


  acharyas.forEach(acharya => {

    preview.innerHTML += `

      <button
        class="acharya-item"
        data-acharya="${acharya.id}"
      >

        <div class="acharya-placeholder">
          ॐ
        </div>

        <div class="acharya-info">

          <h3>
            ${acharya.name}
          </h3>

          <p>
            ${acharya.qualification}
          </p>

          <div class="online">
            ● Available
          </div>

        </div>

        <strong>›</strong>

      </button>

    `;


    full.innerHTML += `

      <article class="acharya-profile">

        <div class="profile-photo">

          <img
            src="${acharya.image}"
            alt="${acharya.name}"
            style="
              width:100%;
              height:100%;
              object-fit:cover;
              display:block;
            "
            onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'
              width:100%;
              height:100%;
              display:grid;
              place-items:center;
              font-size:70px;
              color:var(--gold);
              background:var(--surface-2);
            \\' >ॐ</div>'"
          >

        </div>

        <div class="profile-body">

          <h2>
            ${acharya.name}
          </h2>

          <p>
            ${acharya.qualification}
          </p>

          <button
            class="call-btn"
            onclick="startConsultation('${acharya.id}')"
          >
            ☎ आचार्य से बात करें
          </button>

        </div>

      </article>

    `;

  });

}


/* =====================================================
   CALL LIST
===================================================== */

function renderCallList() {

  const list =
    document.getElementById(
      "callList"
    );

  list.innerHTML = "";


  acharyas.forEach(acharya => {

    list.innerHTML += `

      <div class="call-person">

        <div class="acharya-placeholder">
          ॐ
        </div>

        <div class="call-person-info">

          <strong>
            ${acharya.name}
          </strong>

          <span>
            ${acharya.qualification}
          </span>

          <div class="online">
            ● Online
          </div>

        </div>

        <button
          class="phone-button"
          onclick="startConsultation('${acharya.id}')"
        >
          ☎
        </button>

      </div>

    `;

  });

}


/* =====================================================
   CALL BUTTON
===================================================== */

document
  .getElementById("callMainBtn")
  .addEventListener(
    "click",
    () => showPage("call")
  );


function startConsultation(id) {

  const acharya =
    acharyas.find(
      item => item.id === id
    );

  if (!acharya) return;


  alert(
    `${acharya.name} से consultation शुरू करने का सिस्टम अगले चरण में जोड़ा जाएगा।`
  );

}


/* =====================================================
   SERVICE CARDS
===================================================== */

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


  document.getElementById(
    "serviceTitle"
  ).textContent =
    service.title;


  document.getElementById(
    "serviceDescription"
  ).textContent =
    service.description;


  const container =
    document.getElementById(
      "serviceOptions"
    );

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


function selectService(name) {

  alert(
   `"${name}" का पूरा सिस्टम अगले चरण में जोड़ा जाएगा।`
  );

}


/* =====================================================
   KUNDLI DEMO
===================================================== */

document
  .getElementById("kundliForm")
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =
        document.getElementById(
          "birthName"
        ).value;

      const date =
        document.getElementById(
          "birthDate"
        ).value;

      const time =
        document.getElementById(
          "birthTime"
        ).value;

      const place =
        document.getElementById(
          "birthPlace"
        ).value;


      document.getElementById(
        "kundliResult"
      ).innerHTML = `

        <div class="result-icon">
          ✦
        </div>

        <div class="eyebrow">
          KUNDLI PROFILE
        </div>

        <h2>
          ${name}
        </h2>

        <p>
          जन्म तारीख: ${date}<br>
          जन्म समय: ${time}<br>
          जन्म स्थान: ${place}
        </p>

        <p style="margin-top:15px;">
          आपकी वास्तविक ग्रह-गणना और कुंडली engine
          अगले चरण में Python backend से जोड़ी जाएगी।
        </p>

      `;

    }
  );


/* =====================================================
   INITIAL START
===================================================== */

(function init() {

  applyTheme();


  if (currentLanguage) {

    applyLanguage(
      currentLanguage
    );

    languageScreen.classList.add(
      "hidden"
    );


    if (
      localStorage.getItem(
        "nakshatraLoggedIn"
      )
    ) {

      openApp();

    } else {

      loginScreen.classList.remove(
        "hidden"
      );

    }

  }

})();
