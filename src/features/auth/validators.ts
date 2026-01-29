/**
 * Auth form validation helpers
 * Can be extended with Zod schemas if needed
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

export function validatePasswordConfirm(
  password: string,
  passwordConfirm: string
): string | null {
  if (!passwordConfirm) return 'Please confirm your password';
  if (password !== passwordConfirm) return 'Passwords do not match';
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim() === '') return `${fieldName} is required`;
  return null;
}

export function validateLoginForm(email: string, password: string): ValidationResult {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) errors.password = 'Password is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateRegisterForm(
  email: string,
  password: string,
  passwordConfirm: string,
  firstName: string,
  lastName: string
): ValidationResult {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validatePasswordConfirm(password, passwordConfirm);
  if (confirmError) errors.password_confirm = confirmError;

  const firstNameError = validateRequired(firstName, 'First name');
  if (firstNameError) errors.first_name = firstNameError;

  const lastNameError = validateRequired(lastName, 'Last name');
  if (lastNameError) errors.last_name = lastNameError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateForgotPasswordForm(email: string): ValidationResult {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateResetPasswordForm(
  password: string,
  passwordConfirm: string
): ValidationResult {
  const errors: Record<string, string> = {};

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validatePasswordConfirm(password, passwordConfirm);
  if (confirmError) errors.password_confirm = confirmError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
