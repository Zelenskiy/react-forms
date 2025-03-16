import * as yup from 'yup';

const isFirstLetterUpperCase = (value: string): boolean => {
  return typeof value === 'string' && /^[A-Z]/.test(value);
};

const checkPasswordStrength = (value: string): boolean => {
  if (!value) return false;

  const hasNumber = /\d/.test(value);
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);

  return hasNumber && hasUpperCase && hasLowerCase && hasSpecialChar;
};

const validateImage = (value: unknown): boolean => {
  const file = value as File | string | undefined;
  if (!file) return false;

  if (typeof file === 'string' && file.startsWith('data:image/')) {
    return file.includes('data:image/jpeg') || file.includes('data:image/png');
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file instanceof File && file.size > maxSize) return false;

  const validTypes = ['image/jpeg', 'image/png'];
  if (file instanceof File) {
    return validTypes.includes(file.type);
  }
  return false;
};

export const formSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .test(
      'is-uppercase',
      'First letter must be uppercase',
      isFirstLetterUpperCase
    ),

  age: yup
    .number()
    .typeError('Age must be a number')
    .positive('Age must be positive')
    .required('Age is required'),

  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),

  password: yup
    .string()
    .required('Password is required')
    .test(
      'password-strength',
      'Password must contain at least 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character',
      checkPasswordStrength
    ),

  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),

  gender: yup.string().required('Gender is required'),

  termsAccepted: yup
    .boolean()
    .oneOf([true], 'You must accept Terms and Conditions'),

  image: yup
    .mixed()
    .test(
      'is-valid-image',
      'Image must be a JPEG or PNG file less than 5MB',
      validateImage
    ),

  country: yup.string().required('Country is required'),
});
