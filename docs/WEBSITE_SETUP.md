# TrendMart Website - Setup & Implementation Guide

## 📋 Overview

The website is a complete e-commerce platform built with React, TypeScript, and Tailwind CSS. It features user authentication, profile management with avatar uploads, product browsing, and more.

---

## 🗂️ Project Structure

```
website/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn UI components
│   │   ├── Navbar.tsx      # Navigation with user dropdown
│   │   ├── Footer.tsx      # Footer component
│   │   ├── ProtectedRoute.tsx
│   │   └── ProductCard.tsx
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Home page (PUBLIC)
│   │   ├── Login.tsx       # Login page
│   │   ├── Register.tsx    # Registration page
│   │   ├── VerifyEmail.tsx # Email verification
│   │   ├── ForgotPassword.tsx
│   │   └── Profile.tsx     # User profile (PROTECTED)
│   ├── services/
│   │   └── authService.ts  # API service methods
│   ├── store/
│   │   └── authStore.ts    # Zustand auth state management
│   ├── lib/
│   │   ├── axios.ts        # Axios instance with interceptors
│   │   └── utils.ts        # Utility functions
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend running on `http://localhost:5000`
- MongoDB connected
- Redis running

### Installation

1. **Navigate to website folder:**
   ```bash
   cd website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

The website will be available at `http://localhost:5173` (or the port Vite assigns)

---

## 🔐 Authentication Flow

### Registration Path
1. User registers on `/register` page
2. Backend generates 6-digit OTP and sends to email
3. User navigates to `/verify-email` and enters OTP
4. Email verification complete → User can login

### Login Path
1. User enters email & password on `/login`
2. Backend validates credentials and returns access token
3. Token stored in localStorage
4. User redirected to home page
5. Navbar shows user profile dropdown

### Profile Management Path
1. User clicks profile in navbar dropdown
2. Navigates to `/profile` (protected route)
3. Can edit: firstName, lastName, phone
4. Can upload new avatar by clicking camera icon
5. Changes saved to backend and reflected in navbar avatar

---

## 👤 Profile Page Features

### Components Used
- **Avatar Upload**: Click camera icon to select and upload new image
  - File size limit: 2MB
  - Supported formats: JPG, PNG, WebP, GIF
  - Image optimized and served from `/uploads/avatars/`
  
- **Profile Form**: Edit user information (requires auth)
  - First Name (editable)
  - Last Name (editable)
  - Email (read-only)
  - Phone (editable)
  - Save/Cancel buttons

- **Sidebar Navigation**: Quick links to:
  - Personal Details (active)
  - Track Orders
  - Payments
  - Addresses
  - Security
  - Preferences

- **Cards**:
  - Recent Activity (mock data)
  - Wallet Balance (mock data)

### Profile Update Workflow
```
User Form Input
    ↓
Component State Update
    ↓
handleUpdateProfile() called
    ↓
authService.updateProfile(payload)
    ↓
API: PATCH /api/auth/update-profile
    ↓
Backend validates & updates user
    ↓
Response with updated user data
    ↓
authStore.user updated
    ↓
Component re-renders with new data
    ↓
Toast notification shown
```

---

## 🖼️ Avatar Upload Workflow

### Flow Diagram
```
User clicks camera icon
    ↓
File input dialog opens
    ↓
User selects image file
    ↓
handleFileChange() validates:
  - File size < 2MB
  - File is an image
    ↓
authStore.updateAvatar(file) called
    ↓
authService.uploadAvatar(file)
    ↓
API: POST /api/upload/avatar
  - Content-Type: multipart/form-data
  - Body: FormData with file
    ↓
Backend:
  - Validates file with Multer
  - Processes image with Sharp
  - Resizes to optimal dimensions
  - Converts to WebP
  - Saves to /uploads/avatars/
  - Returns: { url: "/uploads/avatars/uuid.webp" }
    ↓
authService.updateProfile({ avatar: url })
    ↓
API: PATCH /api/auth/update-profile
  - Sets avatar path in user document
    ↓
Response with updated user including avatar
    ↓
authStore.user updated
    ↓
Avatar in navbar updated
    ↓
Toast: "Avatar updated successfully"
```

---

## 🔌 API Endpoints Used

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email with OTP
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/update-profile` - Update user profile
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Upload
- `POST /api/upload/avatar` - Upload avatar image
  - Requires: Authentication
  - File: image/webp, image/jpeg, image/png, image/gif
  - Max Size: 2MB
  - Returns: `{ url: string, filename: string, ...metadata }`

---

## 🛠️ Service Architecture

### authService.ts
Handles all API calls:
```typescript
{
  register(payload)         // Register new user
  login(payload)            // Login
  verifyEmail(payload)      // Verify OTP
  logout()                  // Logout
  getMe()                   // Fetch current user
  updateProfile(payload)    // Update profile fields
  uploadAvatar(file)        // Upload avatar file
}
```

### authStore.ts (Zustand)
Manages global auth state:
```typescript
{
  user: User | null         // Current user object
  accessToken: string       // JWT token
  isAuthenticated: boolean  // Auth status
  isLoading: boolean        // Loading state
  
  login()                   // Login handler
  logout()                  // Logout handler
  updateProfile()           // Update profile
  updateAvatar()            // Upload avatar & update
}
```

---

## 📡 API Request/Response Format

### Update Profile Request
```
PATCH /api/auth/update-profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "avatar": "/uploads/avatars/uuid.webp"  // Optional
}
```

### Update Profile Response
```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "avatar": "/uploads/avatars/uuid.webp",
      "role": "buyer"
    }
  }
}
```

### Avatar Upload Request
```
POST /api/upload/avatar
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

FormData:
  file: [binary image data]
```

### Avatar Upload Response
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "originalName": "photo.jpg",
    "filename": "uuid.webp",
    "folder": "avatars",
    "path": "uploads/avatars/uuid.webp",
    "url": "/uploads/avatars/uuid.webp",
    "mimetype": "image/webp",
    "sizeKB": 45,
    "width": 200,
    "height": 200
  }
}
```

---

## 🔒 Authentication Security

### Token Management
- **Access Token**: JWT stored in localStorage
  - Included in all requests via Authorization header
  - Short-lived (typically 15 mins)
  
- **Refresh Token**: HttpOnly cookie
  - Automatically sent with requests
  - Used to get new access token when expired
  - More secure (not accessible to JS)

### Request Interceptor
- Automatically adds `Authorization: Bearer {token}` header
- Extracts token from localStorage

### Response Interceptor
- Handles 401 responses
- Automatically refreshes token if expired
- Retries failed request with new token
- Redirects to login if refresh fails

---

## 🎨 UI Component Dependencies

The profile page uses shadcn/ui components:
- `Button` - Action buttons
- `Input` - Form inputs
- `Label` - Form labels
- `Avatar` - User avatar display
- All components styled with Tailwind CSS + custom classes

---

## 📊 State Management Flow

```
Initial Load
    ↓
App.tsx useEffect → initializeAuth()
    ↓
Check localStorage for accessToken
    ↓
If exists:
  - Call /api/auth/me
  - Set user in store
  - isAuthenticated = true
    ↓
If not exists:
  - isAuthenticated = false
    ↓
Navbar renders based on isAuthenticated
```

---

## 🧪 Testing the Features

### 1. Registration & Login
1. Go to `/register`
2. Fill form with valid data
3. Check email for OTP
4. Go to `/verify-email` and enter OTP
5. Go to `/login` with credentials
6. Should be logged in

### 2. Profile Page
1. Login as user
2. Click profile in navbar dropdown
3. Edit form fields
4. Click "Commit Changes"
5. Check toast notification
6. Verify changes persisted

### 3. Avatar Upload
1. On profile page, click camera icon
2. Select image file (< 2MB)
3. Avatar should update immediately
4. Check navbar - avatar should change
5. Refresh page - avatar should persist

---

## 🐛 Troubleshooting

### "Profile page is blank"
- Check if user is logged in
- Check browser console for errors
- Verify backend is running on port 5000

### "Avatar upload fails"
- Check file size (must be < 2MB)
- Check file format (JPG, PNG, GIF, WebP)
- Check backend logs for upload errors
- Verify `/uploads/avatars/` directory exists

### "Profile form won't save"
- Check network tab for API response
- Verify authorization header is sent
- Check token is valid (not expired)
- Verify backend update-profile endpoint works

### "Avatar shows placeholder"
- Check if avatar URL is correct in user object
- Verify image file exists in backend `/uploads/avatars/`
- Check if backend is serving static files from `/uploads`

---

## 🚦 Routing Configuration

### Public Routes (Accessible without login)
- `/` - Home page
- `/product/:id` - Product details
- `/login` - Login page
- `/register` - Registration page
- `/verify-email` - Email verification
- `/forgot-password` - Password reset

### Protected Routes (Require login)
- `/profile` - User profile page

---

## 📦 Dependencies

Key packages:
- **react** - UI framework
- **react-router-dom** - Routing
- **zustand** - State management
- **axios** - HTTP client
- **tailwindcss** - Styling
- **shadcn/ui** - UI components
- **react-hook-form** - Form handling
- **zod** - Data validation
- **sonner** - Toast notifications
- **lucide-react** - Icons

---

## 🔄 Workflow Summary

### User Registration to Profile Update
1. **Register** → Email verification → Login
2. **Navigate** to /profile (protected)
3. **Edit** profile fields in form
4. **Submit** → API call → Backend validation
5. **Store** updated user in Zustand
6. **Render** updated data
7. **Show** success notification

### Avatar Upload Workflow
1. **Click** camera icon on profile
2. **Select** image from file input
3. **Validate** file size and type
4. **Upload** to /api/upload/avatar
5. **Process** image on backend
6. **Save** URL in database
7. **Update** user avatar in store
8. **Refresh** avatar in navbar
9. **Show** success notification

---

## 🎯 Next Steps

To make the website fully functional, you can:

1. **Connect real products**
   - Create product service
   - Fetch from `/api/products`
   - Update FeaturedProducts component

2. **Add cart functionality**
   - Create cart store
   - Implement add/remove items
   - Show cart in navbar

3. **Add wishlist**
   - Implement wishlist state
   - Add to/remove from wishlist
   - Show wishlist page

4. **Orders and checkout**
   - Create order service
   - Implement payment flow
   - Show order history in profile

5. **Admin panel**
   - Create seller/admin routes
   - Add product management
   - Order management

---

## ✅ What's Working

- ✅ User registration with email verification
- ✅ User login with JWT authentication
- ✅ Profile page with edit functionality
- ✅ Avatar upload with image optimization
- ✅ Responsive UI with Tailwind CSS
- ✅ State management with Zustand
- ✅ Protected routes
- ✅ Error handling and toast notifications
- ✅ Token refresh mechanism
- ✅ User navbar with dropdown menu

---

## 📝 Notes

- All timestamps use MongoDB's automatic `createdAt` and `updatedAt`
- Avatars are processed to WebP format for optimization
- Failed login attempts are tracked (max 5 before temporary lock)
- Password is hashed with bcrypt (12 rounds)
- Phone numbers are optional but must be unique if provided
- Emails are case-insensitive for login

---

## 🎓 Key Features Explained

### Form Validation
- Frontend: Zod schema validation
- Backend: Express validator middleware
- Real-time feedback with error messages

### Image Processing
- Sharp library for optimization
- WebP conversion for smaller file sizes
- Automatic dimension resizing
- EXIF data preservation

### Security
- HttpOnly cookies for refresh token
- JWT for access token
- CORS configured
- Rate limiting on auth endpoints
- Password hashing with bcrypt

---

For more details, check the backend API documentation in `docs/API_DOCS.md`
