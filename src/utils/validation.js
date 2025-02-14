import {
  loginFormValidateSchema,
  registerFormValidateSchema,
} from "@/constants/validationSchema";

export const RegisterValidateForm = (formData, setErrors) => {
  let newErrors = {};

  // Validate Name
  if (registerFormValidateSchema.name.required && !formData.fullName.trim()) {
    newErrors.fullName = "Name is required";
  } else if (
    formData.fullName.length < registerFormValidateSchema.name.minLength
  ) {
    newErrors.fullName = registerFormValidateSchema.name.message;
  }

  // Validate Email
  if (registerFormValidateSchema.email.required && !formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!registerFormValidateSchema.email.pattern.test(formData.email)) {
    newErrors.email = registerFormValidateSchema.email.message;
  }

  // Validate Password
  if (registerFormValidateSchema.password.required && !formData.password) {
    newErrors.password = "Password is required";
  } else if (
    formData.password.length < registerFormValidateSchema.password.minLength
  ) {
    newErrors.password = registerFormValidateSchema.password.message;
  } else if (
    !registerFormValidateSchema.password.pattern.test(formData.password)
  ) {
    newErrors.password = registerFormValidateSchema.password.message;
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const LoginValidateForm = (formData, setErrors) => {
  let newErrors = {};

  // Validate Email
  if (loginFormValidateSchema.email.required && !formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!loginFormValidateSchema.email.pattern.test(formData.email)) {
    newErrors.email = loginFormValidateSchema.email.message;
  }

  // Validate Password
  if (loginFormValidateSchema.password.required && !formData.password) {
    newErrors.password = "Password is required";
  } else if (
    formData.password.length < loginFormValidateSchema.password.minLength
  ) {
    newErrors.password = loginFormValidateSchema.password.message;
  } else if (
    !loginFormValidateSchema.password.pattern.test(formData.password)
  ) {
    newErrors.password = loginFormValidateSchema.password.message;
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
