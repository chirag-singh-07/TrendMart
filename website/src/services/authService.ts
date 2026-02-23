import api from "@/lib/axios";

export type Role = "buyer" | "seller";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
  };
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface CommonResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface UploadResponse {
  originalName: string;
  filename: string;
  folder: string;
  path: string;
  url: string;
  mimetype: string;
  sizeKB: number;
  width?: number;
  height?: number;
}

const authService = {
  register: async (payload: any): Promise<RegisterResponse["data"]> => {
    const response = await api.post<RegisterResponse>(
      "/api/auth/register",
      payload,
    );
    return response.data.data;
  },

  verifyEmail: async (payload: {
    otp: string;
    userId: string;
  }): Promise<void> => {
    await api.post("/api/auth/verify-email", payload);
  },

  resendOtp: async (payload: {
    userId: string;
    type: string;
  }): Promise<void> => {
    await api.post("/api/auth/resend-otp", payload);
  },

  login: async (payload: any): Promise<AuthResponse["data"]> => {
    const response = await api.post<AuthResponse>("/api/auth/login", payload);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/api/auth/logout");
  },

  logoutAll: async (): Promise<void> => {
    await api.post("/api/auth/logout-all");
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/api/auth/forgot-password", { email });
  },

  resetPassword: async (payload: any): Promise<void> => {
    await api.post("/api/auth/reset-password", payload);
  },

  refreshToken: async (): Promise<RefreshResponse["data"]> => {
    const response = await api.post<RefreshResponse>("/api/auth/refresh");
    return response.data.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get("/api/auth/me");
    return response.data.data;
  },
  updateProfile: async (payload: any): Promise<{ user: User }> => {
    const response = await api.patch("/api/auth/update-profile", payload);
    return response.data.data;
  },
  uploadAvatar: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<{ success: boolean; message: string; data: UploadResponse }>(
      "/api/upload/avatar",
      formData,
      {
        headers: {
          "Content-Type": undefined,
        },
      },
    );
    return response.data.data;
  },
};

export default authService;
