# Admin User Management System

This directory contains all the files needed to create and manage admin users in your TrendMart e-commerce platform.

## 📁 Files Overview

### Frontend Services (`admin-webiste/src/services/`)

#### `adminUserService.ts`
Service class for managing admin operations from the frontend. Provides methods for:
- Creating admin users
- Updating admin information
- Deleting admin users
- Logging in/out
- Changing passwords
- Managing permissions
- Viewing activity logs

**Usage Example:**
```typescript
import AdminUserService from './services/adminUserService';

// Create new admin
const newAdmin = await AdminUserService.createAdmin({
  name: "John Doe",
  email: "john@admin.com",
  password: "SecurePassword123",
  role: "admin"
});

// Login
const response = await AdminUserService.loginAdmin(
  "admin@example.com",
  "password"
);

// Update permissions
await AdminUserService.updatePermissions(adminId, [
  'view_dashboard',
  'manage_users',
  'manage_products'
]);
```

---

### Backend Database Model (`backend/src/models/`)

#### `Admin.model.ts`
MongoDB schema for admin users with the following features:
- **Fields:**
  - `name`: Admin's full name
  - `email`: Unique email address
  - `password`: Hashed password
  - `role`: One of `super_admin`, `admin`, `moderator`
  - `status`: `active` or `inactive`
  - `permissions`: Array of permission strings
  - `lastLogin`: Last login timestamp
  - `loginAttempts`: Failed login counter
  - `lockoutUntil`: Account lockout timestamp

- **Methods:**
  - `matchPassword()`: Compare passwords
  - `incLoginAttempts()`: Increment failed attempts
  - `resetLoginAttempts()`: Reset login counter
  - `isLocked()`: Check account lockout status

- **Indicing:** Email and creation date indexed for fast queries

---

### Backend Controllers (`backend/src/admin/controllers/`)

#### `adminController.ts`
Handles all admin-related API operations:
- `createAdminUser()` - Create new admin
- `getAllAdmins()` - Fetch all admins with filtering
- `getAdminById()` - Get specific admin details
- `updateAdminUser()` - Update admin information
- `deleteAdminUser()` - Delete admin (with self-delete prevention)
- `adminLogin()` - Authenticate admin
- `changePassword()` - Self password change
- `resetPassword()` - Reset admin password (Super Admin only)
- `updatePermissions()` - Modify admin permissions
- `changeAdminStatus()` - Activate/deactivate admin

---

### Backend Routes (`backend/src/admin/routes/`)

#### `admin.routes.ts`
RESTful API endpoints for admin management:

**Public Routes:**
- `POST /api/admin/login` - Admin login

**Protected Routes (Require Authentication):**
- `POST /api/admin/create-user` - Create new admin
- `GET /api/admin/users` - List all admins
- `GET /api/admin/user/:id` - Get admin by ID
- `PATCH /api/admin/update-user/:id` - Update admin
- `DELETE /api/admin/delete-user/:id` - Delete admin
- `POST /api/admin/change-password` - Change own password
- `POST /api/admin/reset-password/:id` - Reset admin password
- `PATCH /api/admin/permissions/:id` - Update permissions
- `PATCH /api/admin/status/:id` - Change admin status

---

### Backend Middleware (`backend/src/admin/middlewares/`)

#### `adminAuth.middleware.ts`
Authentication and authorization middleware:
- `verifyAdminToken()` - Validate JWT token
- `verifySuperAdmin()` - Check super admin role
- `verifyPermission()` - Check specific permissions
- `verifyAdminRole()` - Check role among multiple
- `optionalAdminAuth()` - Optional authentication

---

### Backend Utilities (`backend/src/utils/`)

#### `createAdmin.ts`
Utility script for creating admin users programmatically:

**Functions:**
- `createAdminUser()` - Create single admin
- `createMultipleAdmins()` - Create multiple admins
- `createDefaultAdmin()` - Create default super admin
- `seedDemoAdmins()` - Seed demo admin accounts

**Default Permissions by Role:**
- **Super Admin:** All permissions
- **Admin:** Most permissions (except deleting admins)
- **Moderator:** Basic permissions (view/manage orders)

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies
```bash
# Backend
cd backend
npm install bcrypt jsonwebtoken zod

# Frontend
cd admin-webiste
npm install axios
```

### Step 2: Create Initial Admin User

#### Option A: Using Node Script
```bash
cd backend
npx ts-node src/utils/createAdmin.ts
```

#### Option B: Using API
```bash
curl -X POST http://localhost:5000/api/admin/create-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "SecurePassword123",
    "role": "admin"
  }'
```

#### Option C: Using Service
```typescript
import AdminUserService from './services/adminUserService';

await AdminUserService.createAdmin({
  name: "Admin User",
  email: "admin@example.com",
  password: "SecurePassword123",
  role: "admin"
});
```

### Step 3: Integrate Routes
In your `backend/src/server.ts`:
```typescript
import adminRoutes from './admin/routes/admin.routes';
app.use('/api/admin', adminRoutes);
```

### Step 4: Seed Demo Admins (Optional)
```bash
cd backend
npx ts-node -e "import { seedDemoAdmins } from './src/utils/createAdmin'; seedDemoAdmins();"
```

---

## 📋 Admin Roles & Permissions

### Roles:
1. **Super Admin** - Full system access
2. **Admin** - Most features (cannot delete other admins)
3. **Moderator** - Limited access (orders, support)

### Available Permissions:
```
Dashboard
├── view_dashboard
├── view_analytics

Users
├── view_users
├── manage_users
└── delete_users

Products
├── view_products
├── manage_products
└── delete_products

Orders
├── view_orders
├── manage_orders
└── delete_orders

Categories
├── view_categories
├── manage_categories
└── delete_categories

Banners
├── view_banners
├── manage_banners
└── delete_banners

Admin Management
├── view_admins
├── manage_admins
└── delete_admins

System
├── manage_permissions
├── view_logs
├── view_settings
└── manage_settings
```

---

## 🔒 Security Features

- **Password Hashing:** BCrypt with 10 salt rounds
- **JWT Authentication:** 24-hour expiration
- **Account Lockout:** 5 failed attempts → 30-minute lockout
- **Password Reset:** Super admin can reset any admin's password
- **Self-Delete Prevention:** Admins cannot delete their own accounts
- **Status Management:** Inactive admins cannot login
- **Activity Logging:** Track all admin actions

---

## 📝 Example Usage

### Frontend - Creating Admin User
```typescript
import AdminUserService from './services/adminUserService';

try {
  const response = await AdminUserService.createAdmin({
    name: "New Admin",
    email: "newadmin@example.com",
    password: "SecurePassword123",
    role: "admin"
  });
  
  console.log("Admin created:", response.admin);
} catch (error) {
  console.error("Error:", error.message);
}
```

### Frontend - Admin Login
```typescript
try {
  const response = await AdminUserService.loginAdmin(
    "admin@example.com",
    "password123"
  );
  
  // Token is automatically saved to localStorage
  console.log("Logged in as:", response.admin.name);
} catch (error) {
  console.error("Login failed:", error.message);
}
```

### Backend - Create Admin Programmatically
```typescript
import { createAdminUser } from './utils/createAdmin';

const admin = await createAdminUser({
  name: "John Admin",
  email: "john@admin.com",
  password: "SecurePassword123",
  role: "super_admin"
});
```

---

## 🐛 Troubleshooting

**Issue:** "Email is already in use"
- Solution: Use unique email addresses for each admin

**Issue:** "Account is locked"
- Solution: Wait 30 minutes or super admin resets the account

**Issue:** "Token has expired"
- Solution: Login again to get a new token

**Issue:** "You do not have permission"
- Solution: Ask super admin to add required permissions

---

## 📚 Environment Variables

Add to your `.env` file:
```env
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=24h
MONGODB_URI=mongodb://your-database-url
```

---

## 🎯 Next Steps

1. ✅ Create admin pages in the admin-webiste
2. ✅ Integrate API endpoints with backend
3. Add admin activity logging dashboard
4. Implement real-time admin notifications
5. Add two-factor authentication
6. Create admin audit trail reports

---

## 📞 Support

For issues or questions, please refer to the main API documentation or contact the development team.
