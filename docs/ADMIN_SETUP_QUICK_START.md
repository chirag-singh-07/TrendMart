# Admin Initialization Guide

## Quick Setup - Create First Admin User

### Method 1: Using npm script (Recommended)

```bash
cd backend
npm run setup-admin
```

This command will:
- ✅ Connect to MongoDB automatically
- ✅ Check if admins already exist
- ✅ Create a default super admin user
- ✅ Display credentials and save to console
- ✅ Disconnect safely

**Default credentials:**
- Email: `admin@trendmart.com`
- Password: `Admin@123456`
- Role: `super_admin`

### Method 2: Using ts-node directly

```bash
cd backend
npx tsx src/scripts/setupAdmin.ts
```

### Method 3: Using TypeScript directly

```bash
cd backend
npx ts-node src/scripts/setupAdmin.ts
```

---

## Using the Utility Functions

If you want to create admins programmatically in your application:

### Import and use in your code:

```typescript
import { createAdminUser, createMultipleAdmins, seedDemoAdmins } from "./utils/createAdmin";

// Create single admin
const admin = await createAdminUser({
  name: "John Doe",
  email: "john@admin.com",
  password: "SecurePassword123",
  role: "admin"
});

// Create multiple admins
const admins = await createMultipleAdmins([
  {
    name: "Admin One",
    email: "admin1@trendmart.com",
    password: "Password123",
    role: "admin"
  },
  {
    name: "Admin Two",
    email: "admin2@trendmart.com",
    password: "Password456",
    role: "admin"
  }
]);

// Seed demo admins for testing
await seedDemoAdmins();
```

---

## Environment Variables

Make sure your `.env` file has the correct MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/trendmart
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trendmart

JWT_SECRET=your-super-secret-key-change-this
```

If `MONGODB_URI` is not set, the system will try to connect to the local MongoDB:
```
mongodb://localhost:27017/trendmart
```

---

## Troubleshooting

### Error: "Cannot find module 'Admin.model.js'"

**Solution:** Make sure you run from the backend directory:
```bash
cd backend
npm run setup-admin
```

### Error: "connect ECONNREFUSED"

**Solution:** MongoDB is not running. Start it:
```bash
npm run mongodb-start-local
```

Or ensure your MongoDB service is running:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Error: "Admin with email X already exists"

**Solution:** The admin user already exists. You can either:
1. Use a different email address
2. Delete the existing admin from MongoDB
3. Use the login method to access with existing credentials

### Module resolution errors

Make sure you're using `tsx` or `ts-node`:
```bash
npm run setup-admin
# or
npx tsx src/scripts/setupAdmin.ts
```

---

## Default Permissions by Role

### Super Admin
- All permissions
- Can manage other admins
- Can reset system settings

### Admin
- Dashboard and analytics
- User management
- Product management
- Order management
- Category management
- Banner management
- Cannot delete other admins

### Moderator
- View orders
- Manage orders only
- Basic analytics
- Limited access

---

## After First Login

1. ✅ Login with default credentials
2. ✅ Go to Settings → Security
3. ✅ Change your password immediately
4. ✅ Enable two-factor authentication (when available)
5. ✅ Create additional admin accounts as needed

---

## Managing Admins

### Create additional admins via API

```bash
curl -X POST http://localhost:5000/api/admin/create-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "New Admin",
    "email": "newadmin@example.com",
    "password": "SecurePassword123",
    "role": "admin"
  }'
```

### List all admins

```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Delete an admin

```bash
curl -X DELETE http://localhost:5000/api/admin/delete-user/ADMIN_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Security Best Practices

1. **Change Default Password** - Change the default admin password after first login
2. **Use Strong Passwords** - Minimum 8 characters with mixed case, numbers, and symbols
3. **Secure JWT Secret** - Use a long, random string for `JWT_SECRET`
4. **Enable 2FA** - When available, enable two-factor authentication
5. **Regular Backups** - Backup your admin accounts and data regularly
6. **Audit Logs** - Monitor admin activity logs for suspicious behavior
7. **Role-Based Access** - Assign only necessary permissions to each admin
8. **Logout Sessions** - Cleanup inactive admin sessions periodically

---

## Frequently Asked Questions

**Q: Can I change an admin's role?**
A: Yes, as a super admin, you can update an admin's role using the API or admin panel.

**Q: What if I forget the admin password?**
A: As a super admin, you can reset any admin's password. If you're the only admin, you might need to reset the database.

**Q: How many admins can I create?**
A: Unlimited. Create as many as needed for your team.

**Q: How long are admin sessions valid?**
A: JWT tokens expire after 24 hours. Admins will need to login again.

**Q: Can I have multiple super admins?**
A: Yes, you can create multiple super admin accounts.

---

## Next Steps

1. ✅ Create admin account using `npm run setup-admin`
2. ✅ Start the backend server: `npm run dev`
3. ✅ Login to admin panel at `http://localhost:3000/admin`
4. ✅ Create additional admin accounts as needed
5. ✅ Configure roles and permissions for your team

For more information, see the main API documentation.
