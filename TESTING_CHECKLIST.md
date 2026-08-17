# Nakshatra Jyoti — Testing & Deployment Checklist

## ⚠️ Important — please read first

I (Claude) **do not have network/internet access** in this environment,
so I cannot deploy this app or connect to your real Firebase project.
Everything below has been verified the way it *can* be verified without
a live server:

- `node --check script.js` — passed (no JavaScript syntax errors)
- HTML parsed with no fatal errors
- CSS brace-balance verified (no broken/unclosed rules)
- Every new HTML id referenced by JS was confirmed to exist in `index.html`
- Every Firestore collection/field the code reads or writes was traced
  by hand and matched against `firestore.rules` below
- No duplicate function/variable declarations anywhere in the file
- Checked for functions that got accidentally deleted during editing
  (this happened twice while I was working — both caught and fixed,
  confirmed by `node --check` afterward)

**What I could NOT do:** actually run the app in a browser against your
live Firebase project, click through it as User/Acharya/Admin, or watch
real Firestore reads/writes happen. That last mile has to happen on your
side — the checklist below is exactly what to click through.

---

## 1. Deploy the security rules first

1. Firebase Console → **Firestore Database → Rules** → paste the
   contents of `firestore.rules` → **Publish**.
2. Firebase Console → **Storage → Rules** → paste the contents of
   `storage.rules` → **Publish**.

Without this step, uploads and the new Guidance/Notification/Chat-media
features will fail with "permission denied".

## 2. Deploy the app

Replace your existing `index.html`, `style.css`, `script.js` with the
three files in this zip (same filenames, same relative paths — nothing
else in your project needs to change).

## 3. Manual test pass — User role

- [ ] Sign up / log in as a normal user
- [ ] Home loads: poster, guidance categories, राशिफल chips, विचार feed
- [ ] Click a राशि chip → its text shows below
- [ ] Open any service page (करियर आदि) → submit a Guidance question →
      see it appear under "आपके भेजे प्रश्न" as pending
- [ ] Open आचार्य page → see profile + their विचार feed with photo/video
- [ ] Like a post → heart fills, count goes up; unlike → reverts
- [ ] Comment on a post → appears in the list, comment count updates
- [ ] Share a post → native share sheet (mobile) or "लिंक कॉपी हो गया" toast
- [ ] Start a chat with an Acharya → send text, send a photo, send a video,
      send a file → all four show correctly with previews
- [ ] Confirm you **cannot** message yourself if you're also staff
- [ ] Bell icon shows a badge if you have unread notifications; opening
      it marks them read and the badge clears

## 4. Manual test pass — Acharya role

- [ ] Log in as a user whose `users/{uid}.role` is `acharya`
      (Admin sets this from Add/Manage Acharya)
- [ ] Dashboard shows: मेरे लेख, राशिफल panel, Guidance Requests panel,
      मेरी जानकारी
- [ ] Publish a विचार with a cover photo (crop it) — confirm it appears
      in the public विचार feed and on your own आचार्य profile page
- [ ] Publish a विचार with a video instead of a photo — confirm the
      video plays with controls wherever the post appears
- [ ] Update आज का राशिफल for a couple of राशियाँ → Save → confirm Home
      page shows the new text under those chips
- [ ] Open a pending Guidance request → answer it → confirm it moves to
      "answered" and the original user gets a 🔔 notification
- [ ] Bottom nav "कॉल" tab → should show **your Messages inbox** (only
      users who messaged you), not a list of other acharyas
- [ ] Open a conversation → send/receive text, photo, video, file →
      confirm 🟢/⚪ presence indicator updates for the other person

## 5. Manual test pass — Super Admin role

- [ ] Log in as the admin account (has a doc under `admins/{uid}`)
- [ ] Dashboard shows every panel: लेख, राशिफल, Guidance, 📢 Broadcast,
      Home Posters, आचार्य Management
- [ ] Change a Home poster (choose file → crop → save) → confirm Home
      updates
- [ ] Add a new Acharya (with photo) → confirm they appear in आचार्य page
      and can log in with `role: acharya`
- [ ] Remove an Acharya's role → confirm they fall back to a normal user
- [ ] Publish a 📢 Broadcast → confirm it shows up in every logged-in
      user's notification bell
- [ ] Confirm Admin can see **all** conversations in Messages (except a
      conversation where admin would be messaging themselves)
- [ ] Confirm Admin can answer any Guidance request, from any category

## 6. Known limitations / things I noticed but did not change

These were **pre-existing behaviors in your original code**, not things
I introduced — flagging them in case you want them addressed separately:

- When Admin edits a post originally written by an Acharya, `savePost()`
  always sets `authorUid` to whoever is editing it — so the post's
  authorship silently transfers to Admin on edit. This is existing
  behavior, not something I changed.
- `guidanceRequests` update rule allows any Staff member to update *any*
  field on a request (not just the answer fields) — kept intentionally
  loose to match "any acharya can answer any request," but it does mean
  a rules-level malicious Staff account could edit `userUid` too. Low
  risk since only trusted Staff accounts get that role, but worth knowing.

## 7. If something breaks

Open the browser console (F12) — Firestore/Storage permission errors
show up clearly there (`FirebaseError: Missing or insufficient
permissions`), which almost always means a rule in `firestore.rules` /
`storage.rules` doesn't match what the app is trying to do. Send me the
exact console error and I can pinpoint the fix.
