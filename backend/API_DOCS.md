# 📦 E-Commerce Backend — API Documentation

> **Base URL:** `http://localhost:5000`  
> **Content-Type:** `application/json` (all requests & responses)  
> **Credentials:** Must send `credentials: "include"` (or `withCredentials: true` in Axios) on every request so the browser sends the `httpOnly` refresh token cookie automatically.

---

## Table of Contents

- [Response Shape](#response-shape)
- [Authentication Flow](#authentication-flow)
- [Rate Limits](#rate-limits)
- [Auth Endpoints](#auth-endpoints)
  - [Health Check](#health-check)
  - [Register](#post-apiauthregister)
  - [Verify Email](#post-apiauthverify-email)
  - [Resend OTP](#post-apiauthresend-otp)
  - [Login](#post-apiauthlogin)
  - [Refresh Token](#post-apiauthrefresh)
  - [Logout](#post-apiauthlogout)
  - [Logout All Devices](#post-apiauthlogout-all)
  - [Forgot Password](#post-apiauthforgot-password)
  - [Reset Password](#post-apiauthreset-password)
  - [Change Password](#post-apiauthchange-password)
- [Error Reference](#error-reference)
- [Frontend Integration Tips](#frontend-integration-tips)

---

## Response Shape

Every response from this API follows the same envelope shape:

### ✅ Success
```json
{
  "success": true,
  "message": "Human-readable description of what happened.",
  "data": { ... }
}
```
> `data` is omitted on responses that have no meaningful payload (e.g. logout, verify email).

### ❌ Error
```json
{
  "success": false,
  "message": "Human-readable error description."
}
```

### ❌ Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

---

## Authentication Flow

This API uses a **dual-token strategy**:

| Token | Type | Storage | Lifetime | Purpose |
|-------|------|---------|----------|---------|
| **Access Token** | JWT (Bearer) | Memory / localStorage | Short (e.g. 15m) | Authenticate API requests |
| **Refresh Token** | JWT | `httpOnly` cookie (auto-managed by browser) | Long (e.g. 7d) | Get a new access token |

### How to authenticate requests

Add the access token to the `Authorization` header:

```http
Authorization: Bearer <accessToken>
```

### Token refresh flow

When an API call returns `401 Unauthorized`, silently call `POST /api/auth/refresh` to get a new access token, then retry the original request. The refresh cookie is sent automatically by the browser.

```
API Request → 401 Unauthorized
       ↓
POST /api/auth/refresh  ← browser sends httpOnly cookie automatically
       ↓
New accessToken returned
       ↓
Retry original request with new accessToken
```

---

## Rate Limits

All `/api/auth/*` routes share a **base rate limit**, with stricter limits on sensitive endpoints:

| Limiter | Applies To | Limit | Window |
|--------|-----------|-------|--------|
| **Auth** (global) | All `/api/auth/*` routes | 30 requests | 1 minute |
| **Login** | `POST /api/auth/login` | 5 requests | 15 minutes |
| **OTP** | `verify-email`, `forgot-password`, `resend-otp` | 3 requests | 10 minutes |

When a rate limit is exceeded, the server responds with:

```http
HTTP 429 Too Many Requests
```
```json
{
  "status": 429,
  "success": false,
  "message": "Too many login attempts from this IP. Please try again after 15 minutes."
}
```

Standard `RateLimit-*` headers are included in every response.

---

## Auth Endpoints

### Health Check

```http
GET /health
```

No auth required.

**Response `200`**
```json
{
  "success": true,
  "message": "API Running 🚀"
}
```

---

### POST `/api/auth/register`

Create a new buyer or seller account. Sends an email verification OTP upon success.

**Rate limit:** General auth (30 req/min)

#### Request Body

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `firstName` | `string` | ✅ | 2–50 characters |
| `lastName` | `string` | ✅ | 2–50 characters |
| `email` | `string` | ✅ | Valid email, lowercased |
| `password` | `string` | ✅ | 8–72 chars, must include uppercase, lowercase, and a digit |
| `role` | `"buyer"` \| `"seller"` | ✅ | |
| `phone` | `string` | ❌ | E.164 format e.g. `+919876543210` |

```json
{
  "firstName": "Chirag",
  "lastName": "Singh",
  "email": "chirag@example.com",
  "password": "MyPass123",
  "role": "buyer",
  "phone": "+919876543210"
}
```

#### Response `201`

```json
{
  "success": true,
  "message": "Account created successfully. Please check your email for the verification OTP.",
  "data": {
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1"
  }
}
```

> ⚠️ **Save the `userId`** — you'll need it for the `verify-email` step.

#### Error Cases

| Status | Message |
|--------|---------|
| `409` | An account with this email already exists. |
| `409` | An account with this phone number already exists. |
| `422` | Validation failed. (see `errors` array) |

---

### POST `/api/auth/verify-email`

Verify the user's email address using the 6-digit OTP sent during registration.

**Rate limit:** OTP (3 req / 10 min)

#### Request Body

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `userId` | `string` | ✅ | MongoDB ObjectId returned from `/register` |
| `otp` | `string` | ✅ | Exactly 6 digits |

```json
{
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "otp": "482910"
}
```

#### Response `200`

```json
{
  "success": true,
  "message": "Email verified successfully. You can now log in."
}
```

#### Error Cases

| Status | Message |
|--------|---------|
| `400` | Invalid or expired OTP. Please request a new one. |
| `400` | Email is already verified. |
| `404` | User not found. |
| `422` | Validation failed. |

---

### POST `/api/auth/resend-otp`

Resend a new OTP to the user's registered email. Subject to a cooldown — can only resend if less than 8 minutes remain on the current OTP.

**Rate limit:** OTP (3 req / 10 min)

#### Request Body

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `userId` | `string` | ✅ | MongoDB ObjectId |
| `type` | `string` | ✅ | `"verify"` (email verification) or `"reset"` (password reset) |

```json
{
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "type": "verify"
}
```

#### Response `200`

```json
{
  "success": true,
  "message": "A new OTP has been sent to your registered email address."
}
```

#### Error Cases

| Status | Message |
|--------|---------|
| `404` | User not found. |
| `422` | Validation failed. |
| `429` | Please wait before requesting a new OTP. Your current OTP is still valid. |

---

### POST `/api/auth/login`

Authenticate with email and password. Returns an access token in the body and sets the refresh token as an `httpOnly` cookie.

**Rate limit:** Login (5 req / 15 min)

#### Request Body

| Field | Type | Required |
|-------|------|----------|
| `email` | `string` | ✅ |
| `password` | `string` | ✅ |

```json
{
  "email": "chirag@example.com",
  "password": "MyPass123"
}
```

#### Response `200`

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "firstName": "Chirag",
      "lastName": "Singh",
      "email": "chirag@example.com",
      "role": "buyer",
      "avatar": "https://cdn.example.com/avatars/chirag.jpg"
    }
  }
}
```

> 🍪 A `httpOnly` refresh token cookie is also set automatically. You do **not** need to handle it manually.

#### Error Cases

| Status | Message |
|--------|---------|
| `401` | Invalid email or password. |
| `403` | Please verify your email before logging in. Check your inbox for the OTP. |
| `403` | Your account has been suspended. Reason: \<reason\> |
| `403` | This account no longer exists. |
| `422` | Validation failed. |
| `429` | Too many login attempts from this IP. Please try again after 15 minutes. |

---

### POST `/api/auth/refresh`

Exchange the `httpOnly` refresh token cookie for a new access token. The cookie is automatically rotated (old one invalidated, new one set).

**Rate limit:** General (30 req/min)

No request body needed — the browser sends the cookie automatically.

#### Response `200`

```json
{
  "success": true,
  "message": "Token refreshed successfully.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Cases

| Status | Message |
|--------|---------|
| `401` | Refresh token not found. Please log in again. |
| `401` | Refresh token has already been used or revoked. Please log in again. |
| `401` | User not found. |

> 🔐 If you get a `401` from `/refresh`, clear the local access token and redirect the user to the login page.

---

### POST `/api/auth/logout`

Log out the current device session. Invalidates the current refresh token and blacklists the access token.

**Rate limit:** General (30 req/min)  
**Auth:** ✅ Required (`Authorization: Bearer <accessToken>`)

No request body needed.

#### Response `200`

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

#### Error Cases

| Status | Message |
|--------|---------|
| `400` | Refresh token not found. |
| `401` | Unauthorized (missing or invalid access token) |

---

### POST `/api/auth/logout-all`

Log out from **all devices**. Clears all stored refresh tokens for the user and blacklists the current access token.

**Rate limit:** General (30 req/min)  
**Auth:** ✅ Required

No request body needed.

#### Response `200`

```json
{
  "success": true,
  "message": "Logged out from all devices successfully."
}
```

#### Error Cases

| Status | Message |
|--------|---------|
| `401` | Unauthorized |

---

### POST `/api/auth/forgot-password`

Initiate a password reset flow. Sends a 6-digit OTP to the given email address if an account exists.

**Rate limit:** OTP (3 req / 10 min)

> 🔒 This endpoint **always returns 200** regardless of whether the email exists, to prevent user enumeration attacks.

#### Request Body

| Field | Type | Required |
|-------|------|----------|
| `email` | `string` | ✅ |

```json
{
  "email": "chirag@example.com"
}
```

#### Response `200`

```json
{
  "success": true,
  "message": "If an account exists for this email, a password reset OTP has been sent."
}
```

> ⚠️ **Save the `userId`** — you need to ask the user to enter it alongside the OTP, OR look it up on email input if you store it. The `/reset-password` endpoint requires `userId`. Typically: send a "We've sent you an OTP" page where the user can also enter their userId (you should have stored it at register time) or pre-fill it via your app state.

---

### POST `/api/auth/reset-password`

Reset a user's password using the OTP received via email. Invalidates all existing sessions after reset.

**Rate limit:** General (30 req/min)

#### Request Body

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `userId` | `string` | ✅ | MongoDB ObjectId |
| `otp` | `string` | ✅ | Exactly 6 digits |
| `newPassword` | `string` | ✅ | 8–72 chars, uppercase + lowercase + digit |

```json
{
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "otp": "391847",
  "newPassword": "NewPass456"
}
```

#### Response `200`

```json
{
  "success": true,
  "message": "Password reset successfully. Please log in with your new password."
}
```

#### Error Cases

| Status | Message |
|--------|---------|
| `400` | Invalid or expired OTP. Please request a new one. |
| `404` | User not found. |
| `422` | Validation failed. |

---

### POST `/api/auth/change-password`

Change the password for a logged-in user. Invalidates all other sessions and issues a new refresh token for the current session.

**Rate limit:** General (30 req/min)  
**Auth:** ✅ Required

#### Request Body

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `currentPassword` | `string` | ✅ | |
| `newPassword` | `string` | ✅ | 8–72 chars, uppercase + lowercase + digit |

```json
{
  "currentPassword": "MyPass123",
  "newPassword": "BetterPass789"
}
```

#### Response `200`

```json
{
  "success": true,
  "message": "Password changed successfully. Other sessions have been invalidated."
}
```

> 🍪 A rotated refresh token cookie is set automatically.

#### Error Cases

| Status | Message |
|--------|---------|
| `400` | Current password is incorrect. |
| `401` | Unauthorized |
| `404` | User not found. |
| `422` | Validation failed. |

---

## Error Reference

| HTTP Status | Meaning | When it Happens |
|-------------|---------|----------------|
| `200` | OK | Request succeeded |
| `201` | Created | Resource was created (e.g. register) |
| `400` | Bad Request | Business logic error (wrong OTP, password mismatch) |
| `401` | Unauthorized | Missing/expired/invalid access token or refresh token |
| `403` | Forbidden | Account blocked, suspended, or email unverified |
| `404` | Not Found | Resource doesn't exist (e.g. user not found) |
| `409` | Conflict | Duplicate email or phone |
| `422` | Unprocessable Entity | Zod validation failed — check `errors[]` |
| `429` | Too Many Requests | Rate limit hit |
| `500` | Internal Server Error | Unexpected server-side failure |

---

## Frontend Integration Tips

### Axios Setup (recommended)

```typescript
// lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // REQUIRED — sends the httpOnly refresh cookie
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // or from state/memory
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Silently refresh on 401
let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/api/auth/refresh");
        const newToken = data.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        queue.forEach((cb) => cb(newToken));
        queue = [];
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        // Refresh failed — force logout
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Fetch Setup (vanilla)

```typescript
// Always include credentials so the refresh cookie is sent
fetch("/api/auth/refresh", {
  method: "POST",
  credentials: "include",
});
```

### Registration → Verification Flow (UI)

```
Step 1: POST /api/auth/register
        → store userId from response
        → navigate to /verify-email

Step 2: User enters OTP from email
        → POST /api/auth/verify-email  { userId, otp }
        → on success → navigate to /login

(Optional) Resend button (after 2 min cooldown on UI):
        → POST /api/auth/resend-otp  { userId, type: "verify" }
```

### Forgot Password Flow (UI)

```
Step 1: User enters email
        → POST /api/auth/forgot-password
        → always show "OTP sent" message (regardless of response)

Step 2: User enters userId + OTP + new password
        → POST /api/auth/reset-password
        → on success → navigate to /login
```

> 💡 **Where does the user get their `userId` for reset?** Store it in `localStorage` after registration, or ask the user to enter their email first, then look up the userId on your frontend (if you persist it). Alternatively, modify the backend to accept email instead of userId on the reset endpoint in the future.

### Password Validation Regex (for real-time frontend feedback)

```typescript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;
// Must contain: lowercase, uppercase, digit. Length: 8–72.
```

### Phone Number Format

```typescript
// Valid: +919876543210, +12125551234, +447911123456
const phoneRegex = /^\+?[1-9]\d{7,14}$/;
```
