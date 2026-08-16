# Nakshatra Jyoti — Super Admin + WhatsApp-style Messaging Build

यह final frontend build मौजूदा role-safe Firebase architecture पर आधारित है। मुख्य files:
- `index.html`
- `style.css`
- `script.js`
- `FINAL_SETUP_README.md`

## Role system

- `admins/{uid}` → Super Administrator
- `users/{uid}.role = "acharya"` → Acharya
- बाकी authenticated accounts → User

Login के बाद role Firebase UID से resolve होता है।

## Super Admin controls

Super Admin dashboard में:
- आचार्य विचार / लेख create, edit, publish, delete
- Home के तीन posters और उनके titles बदलने की सुविधा
- नया Acharya जोड़ना
- Acharya Firebase UID connect करना
- Acharya का phone, image, speciality, qualification, bio, social links manage करना
- जरूरत होने पर Acharya role वापस User करना
- सभी user conversations देखना और reply करना

Home poster settings `acharyas/__siteSettings` में रखी जाती हैं। Existing Firestore rules में `acharyas` को केवल Admin लिख सकता है, इसलिए अलग rules collection की जरूरत नहीं है।

## Messaging

Messaging अब role-aware है:
- User → केवल अपनी conversations
- Acharya → केवल अपने users की conversations
- Super Admin → सभी consultation conversations, लेकिन अपने self-chat को नहीं
- WhatsApp-style inbox: avatar, user/acharya name, last message, time, unread badge
- Chat खोलकर सीधे reply
- `unreadForUid` से unread state
- Staff के लिए browser notification permission

Private conversation access अभी भी Firestore participant/admin rules से सुरक्षित है।

## Acharya Vichar

नई public authenticated page:
- `आचार्य विचार`
- published articles
- search
- category filter
- article read modal
- Home पर latest article preview

Acharya अपने authored articles लिख/संशोधित/प्रकाशित कर सकता है।
Super Admin सभी posts manage कर सकता है।

## Images

Call/Acharya cards अब Firebase में गलत/खाली image value होने पर भी local default:
- `./assets/acharyas/acharya1.jpg`
- `./assets/acharyas/acharya2.jpg`
- `./assets/acharyas/acharya3.jpg`

का fallback लेते हैं। इसलिए पहले की तरह photos दिखाई देनी चाहिए।

## Deployment

GitHub Pages पर root में:
- `index.html`
- `style.css`
- `script.js`

और existing `assets/` folder रखें।

Firebase Authentication + Firestore पहले से configured होना चाहिए।
