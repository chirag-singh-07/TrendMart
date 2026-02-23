import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

interface AdminUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: "super_admin" | "admin" | "moderator";
  status: "active" | "inactive";
  permissions?: string[];
  createdAt?: string;
  lastLogin?: string;
}

interface AdminAuthResponse {
  token: string;
  admin: AdminUser;
}

interface CreateAdminResponse {
  success: boolean;
  admin: AdminUser;
  message: string;
}

class AdminUserService {
  // Create a new admin user
  static async createAdmin(data: {
    name: string;
    email: string;
    password: string;
    role: "super_admin" | "admin" | "moderator";
  }): Promise<CreateAdminResponse> {
    try {
      const response = await axios.post<CreateAdminResponse>(
        `${API_BASE_URL}/admin/create-user`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create admin user"
      );
    }
  }

  // Update admin user
  static async updateAdmin(
    id: string,
    data: Partial<AdminUser>
  ): Promise<CreateAdminResponse> {
    try {
      const response = await axios.patch<CreateAdminResponse>(
        `${API_BASE_URL}/admin/update-user/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update admin user"
      );
    }
  }

  // Delete admin user
  static async deleteAdmin(id: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/delete-user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete admin user"
      );
    }
  }

  // Get all admin users
  static async getAllAdmins(): Promise<AdminUser[]> {
    try {
      const response = await axios.get<{ admins: AdminUser[] }>(
        `${API_BASE_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      return response.data.admins;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch admin users"
      );
    }
  }

  // Get single admin user
  static async getAdminById(id: string): Promise<AdminUser> {
    try {
      const response = await axios.get<{ admin: AdminUser }>(
        `${API_BASE_URL}/admin/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      return response.data.admin;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch admin user"
      );
    }
  }

  // Admin login
  static async loginAdmin(email: string, password: string): Promise<AdminAuthResponse> {
    try {
      const response = await axios.post<AdminAuthResponse>(
        `${API_BASE_URL}/admin/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to login"
      );
    }
  }

  // Admin logout
  static logoutAdmin(): void {
    localStorage.removeItem("adminToken");
  }

  // Change admin password
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }

  // Reset admin password (by super admin)
  static async resetPassword(
    adminId: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/reset-password/${adminId}`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }

  // Update admin permissions
  static async updatePermissions(
    adminId: string,
    permissions: string[]
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/admin/permissions/${adminId}`,
        { permissions },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update permissions"
      );
    }
  }

  // Change admin status
  static async changeStatus(
    adminId: string,
    status: "active" | "inactive"
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/admin/status/${adminId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to change status"
      );
    }
  }

  // Get admin activity logs
  static async getActivityLogs(adminId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/activity-logs/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      return response.data.logs;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch activity logs"
      );
    }
  }
}

export default AdminUserService;
