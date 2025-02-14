export const registerFormValidateSchema = {
  name: {
    required: true,
    minLength: 3,
    message: "Name must be at least 3 characters long",
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email regex
    message: "Invalid email format",
  },
  password: {
    required: true,
    minLength: 6,
    pattern: /\d/, // Must contain at least one number
    message: "Password must be at least 6 characters long and contain a number",
  },
};

export const loginFormValidateSchema = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email regex
    message: "Invalid email format",
  },
  password: {
    required: true,
    minLength: 6,
    pattern: /\d/, // Must contain at least one number
    message: "Password must be at least 6 characters long and contain a number",
  },
};

export const resetPasswordValidateSchema = {
  newPassword: {
    required: true,
    minLength: 6,
    pattern: /\d/, // Must contain at least one number
    message: "Password must be at least 6 characters long and contain a number",
  },
};

export const forgotPasswordFormValidateSchema = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email regex
    message: "Invalid email format",
  },
};
