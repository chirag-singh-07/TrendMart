# TrendMart - Quick Start Guide

## 🚀 Running the Complete System

### Step 1: Start the Backend Server

```bash
cd "c:\Users\chirag singh\Desktop\final-ecoom\backend"
npm run dev
```

Expected output:
```
Server running on http://localhost:5000
MongoDB connected
Redis connected
API Running 🚀
```

### Step 2: Start the Website Frontend

```bash
cd "c:\Users\chirag singh\Desktop\final-ecoom\website"
npm run dev
```

Expected output:
```
  VITE v7.3.1  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open in Browser

- Navigate to `http://localhost:5173`
- You should see the TrendMart home page

---

## 🧪 Test the Features

### 1. Register a New Account
1. Click **Register** in navbar
2. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Phone: `+919876543210`
   - Password: `Password123` (must have uppercase, lowercase, digits)
3. Click **Register**
4. Check your email for OTP (in development, check backend logs)
5. Enter OTP on verify-email page
6. You'll be redirected to login

### 2. Login
1. Go to `/login`
2. Enter credentials:
   - Email: `john@example.com`
   - Password: `Password123`
3. Click **Sign In**
4. You should see your avatar in the navbar

### 3. Update Profile (Avatar Upload)
1. Click your avatar/name in navbar → **Profile**
2. Click the **camera icon** on the avatar
3. Select an image file (JPG, PNG, etc. - under 2MB)
4. Image should upload and display immediately
5. Refresh page - avatar should persist
6. Edit other fields (First Name, Last Name, Phone)
7. Click **Commit Changes**
8. Changes should be saved and navbar avatar should update

---

## ✅ What's Fixed

Fixed the avatar upload issue by:
1. **Removed hardcoded Content-Type header** from axios default headers
2. **Added dynamic Content-Type handling** in request interceptor
3. **FormData is now sent without Content-Type** (lets browser set multipart/form-data)
4. **Fixed avatar URL in Navbar** to use API_BASE_URL prefix
5. **Removed explicit multipart header** from uploadAvatar method

---

## 🔧 Troubleshooting

### Issue: "Avatar upload fails with 400 Bad Request"
✅ **Fixed** - Now sends FormData correctly without conflicting headers

### Issue: "Avatar in navbar shows broken image"
✅ **Fixed** - Now uses full URL with API_BASE_URL prefix

### Issue: "Profile page shows blank"
- Make sure you're logged in
- Check network tab - /api/auth/me should return user data
- Check browser console for errors

### Issue: "Backend returns "No file uploaded""
- Ensure file is selected and under 2MB
- Check browser console - upload should show in network tab
- Verify backend /uploads/avatars/ directory exists

### Issue: "Cannot POST /api/upload/avatar"
- Backend server might not be running
- Check if backend is on http://localhost:5000
- Check backend logs for errors

---

## 📁 Key Files Modified

1. **website/src/lib/axios.ts**
   - Fixed Content-Type handling for FormData
   - Added dynamic header management

2. **website/src/services/authService.ts**
   - Removed explicit multipart headers
   - Simplified FormData handling

3. **website/src/components/Navbar.tsx**
   - Added API_BASE_URL import
   - Fixed avatar src to use full URL

4. **website/src/App.tsx**
   - Fixed routing - Home page now public
   - Profile page is protected

---

## 🎯 Flow Verification

### Avatar Upload Flow
```
User selects file
    ↓
File validation (size, type)
    ↓
FormData created with file
    ↓
POST /api/upload/avatar (FormData)
    ↓
Backend Multer middleware validates
    ↓
Sharp processes image → WebP
    ↓
Save to /uploads/avatars/uuid.webp
    ↓
Return { url: "/uploads/avatars/uuid.webp" }
    ↓
Send PATCH /api/auth/update-profile with avatar URL
    ↓
User document updated
    ↓
Response with updated user object
    ↓
Zustand store updated
    ↓
Component re-renders with new avatar
    ↓
Navbar avatar updates immediately
    ✅ Success!
```

### Form Update Flow
```
User edits fields
    ↓
Form state updated
    ↓
Click "Commit Changes"
    ↓
Validation passes
    ↓
POST /api/auth/update-profile
    ↓
Backend validates & updates
    ↓
Response with updated user
    ↓
Zustand store updated
    ↓
Form resets, editing disabled
    ✅ Success!
```

---

## 🔐 Security Notes

- Access tokens stored in localStorage (short-lived JWT)
- Refresh tokens stored in httpOnly cookies (more secure)
- All authenticated requests include Authorization header
- Automatic token refresh on 401 response
- Password reset requires email verification
- Phone uniqueness enforced in database

---

## 📊 API Endpoints Used

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-email` - Verify with OTP
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/update-profile` - Update profile
- `POST /api/auth/logout` - Logout user

### Upload
- `POST /api/upload/avatar` - Upload avatar (multipart)

---

## 💾 Database Schema (Relevant Fields)

### User Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String (optional, unique),
  avatar: String (path like "/uploads/avatars/uuid.webp"),
  role: "buyer" | "seller" | "admin",
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  isBlocked: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧩 Component Hierarchy

```
App
├── Navbar
│   └── Avatar + Dropdown Menu
├── Routes
│   ├── Home (Public)
│   ├── Login (Public)
│   ├── Register (Public)
│   ├── VerifyEmail (Public)
│   ├── ForgotPassword (Public)
│   └── ProtectedRoute
│       └── Profile
│           ├── Avatar Section
│           ├── Profile Form
│           ├── Sidebar Navigation
│           └── Card Components
└── Footer
```

---

## 🎨 Styling

- **Tailwind CSS** for base styles
- **shadcn/ui** components for consistency
- **Custom classes** for unique styling
- **Responsive design** - mobile first approach
- **Dark mode support** via next-themes (can be enabled)

---

## 🚨 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 400 Bad Request on upload | FormData sent with wrong headers | ✅ Fixed - No content-type header for FormData |
| Broken avatar image | URL without API_BASE_URL | ✅ Fixed - Now using full URL |
| Profile form won't save | Token expired or not sent | Token auto-refreshes on 401 |
| Page shows login when logged in | initializeAuth() not called | App.tsx calls it on mount |
| Products not showing | Using mock data | Use real API when ready |

---

## 🎓 Next Steps

1. ✅ Avatar upload working
2. ✅ Profile updates working
3. ✅ Authentication complete
4. Next: Connect real product data
5. Next: Add cart functionality
6. Next: Implement orders/checkout

---

## 📝 Notes

- All images are converted to WebP for optimization
- Avatar size will be 200x200px after processing
- Failed attempts tracked (max 5 login attempts = lock)
- OTP valid for 10 minutes
- Access token valid for 15 minutes
- Refresh token valid for 7 days

---

For full documentation, see `WEBSITE_SETUP.md`
