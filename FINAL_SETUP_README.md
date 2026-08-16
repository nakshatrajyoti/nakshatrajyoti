# Nakshatra Jyoti V4

This package keeps the existing frontend/assets and adds a role-separated V4 application shell.

## Roles
- Super Admin: fixed UID `W1uZo8MbVhgT9xfPC4AzAJtzjOu1`
- Acharya: `users/{uid}.role = "acharya"`
- Normal user: `users/{uid}.role = "user"`

## Important
The V4 UI is deliberately separated by role at login. The production backend must also deploy matching Firestore/Storage rules. Firebase documentation recommends Authentication plus Security Rules for role-based access control.

Keep the existing `assets/` folder.
Do not put private API secrets in frontend code.
