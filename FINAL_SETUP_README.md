# Nakshatra Jyoti — Final Role-Stable Build 3.1.0

इस build में Firebase Authentication और role detection को एक साथ stable किया गया है।

## GitHub Pages में सिर्फ ये 3 files replace करें

- `index.html`
- `style.css`
- `script.js`

`assets/` folder को delete/replace नहीं करना है। आपकी existing photos/assets वैसे ही रहने दें।

## Login के बाद role कैसे पहचाना जाएगा

### User
Normal Firebase Email/Password account = `User`.

User को कोई manual role देने की जरूरत नहीं है। पहली बार login पर `users/{uid}` profile बनती है।

### Admin
Firebase Authentication में Admin का account बनाइए/रखिए।

फिर Firestore में:

`admins/{ADMIN_UID}`

Document ID = Admin का exact Firebase UID.

Field:

`role: "admin"`

Admin login करते ही system `admins/{uid}` check करेगा और `Administrator` role देगा। Admin Dashboard अपने-आप दिखाई देगा।

### Acharya
हर Acharya का अलग Firebase Authentication account रखें।

Admin Dashboard → Acharya Profiles में उस account का exact Firebase UID डालें और save करें। इससे:

`users/{ACHARYA_UID}`

में:

`role: "acharya"`

सेट होगा।

Acharya अगली बार login करेगा तो system उसे `Acharya` के रूप में पहचानकर Acharya Panel दिखाएगा।

## महत्वपूर्ण

Admin role के लिए केवल localStorage या browser data पर भरोसा नहीं किया गया है। Admin पहचान Firestore के `admins/{uid}` document से होती है।

Acharya पहचान Firestore के `users/{uid}.role` से होती है।

Login के बाद Firebase Auth restore होने का इंतजार करके role resolution दोबारा चलता है। इससे वह समस्या ठीक की गई है जिसमें Login सफल होने के बाद account हमेशा सामान्य User दिख रहा था।

## Firebase services

- Firebase Authentication → Email/Password enabled होना चाहिए।
- Firestore Database enabled होना चाहिए।
- Firestore security rules आपकी role/security policy के अनुसार deploy रहें।

Real private chat और AI के लिए Firestore/Cloud Functions भी deploy रहने चाहिए। GitHub Pages केवल frontend host करता है।

## इस build में मुख्य सुधार

1. Firebase Auth restore होने के बाद role resolution।
2. Admin → Admin Dashboard।
3. Acharya → Acharya Panel।
4. Normal user → normal User account।
5. Role badge account में दिखेगा।
6. Admin dashboard में article management + Acharya profile management।
7. Acharya panel में अपने articles और account information।
8. Acharya panel से private messages तक direct access।
9. Normal user को Admin/Acharya panel नहीं दिखेगा।
10. Normal user/Acharya से default Acharya records लिखने की कोशिश नहीं होगी।
11. Existing public Home, Acharya, Call, Kundli, Messages और service pages को हटाया नहीं गया है।

**इस build के बाद अलग `ui-fix.js` लगाने की जरूरत नहीं है।**
