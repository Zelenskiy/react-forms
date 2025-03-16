import { useRef, useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveUncontrolledForm } from '../store/formSlice';
import { formSchema } from '../validations/schemas';
import AutocompleteCountry from './AutocompleteCountry';
import * as yup from 'yup';
import { FormData } from '../types/types';

interface FormErrors {
  [key: string]: string;
}

const UncontrolledForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const maleRef = useRef<HTMLInputElement>(null);
  const femaleRef = useRef<HTMLInputElement>(null);
  const otherRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [country, setCountry] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState({
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
  });
  const [imagePreview, setImagePreview] = useState<File | null | undefined>(
    null
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      hasNumber: /\d/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    });
  };

  const handlePasswordChange = () => {
    if (passwordRef.current) {
      checkPasswordStrength(passwordRef.current.value);
    }
  };

  const handleImageChange = () => {
    if (imageRef.current?.files && imageRef.current.files[0]) {
      const file = imageRef.current.files[0];

      // Check file size and type
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        setErrors({ ...errors, image: 'Image must be less than 5MB' });
        return;
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors({
          ...errors,
          image: 'Only JPEG and PNG formats are allowed',
        });
        return;
      }

      setImagePreview(file);

      // Clear error if exists
      if (errors.image) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { image, ...rest } = errors;
        setErrors(rest);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Get all form values
      const formData: Partial<FormData> = {
        name: nameRef.current?.value || '',
        age: ageRef.current?.value ? Number(ageRef.current.value) : undefined,
        email: emailRef.current?.value || '',
        password: passwordRef.current?.value || '',
        confirmPassword: confirmPasswordRef.current?.value || '',
        gender: maleRef.current?.checked
          ? 'male'
          : femaleRef.current?.checked
            ? 'female'
            : otherRef.current?.checked
              ? 'other'
              : '',
        termsAccepted: termsRef.current?.checked || false,
        country: country,
        image: imagePreview || undefined,
        isNew: false,
      };

      // Validate with Yup
      await formSchema.validate(formData, { abortEarly: false });

      // If validation passes
      dispatch(saveUncontrolledForm(formData as FormData));
      navigate('/'); // Redirect to main page
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: FormErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Uncontrolled Form Approach</h1>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            ref={nameRef}
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            ref={ageRef}
            className={`w-full p-2 border rounded ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.age && (
            <p className="text-red-500 text-xs mt-1">{errors.age}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            ref={passwordRef}
            onChange={handlePasswordChange}
            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}

          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Password strength:</p>
            <div className="flex space-x-2">
              <div
                className={`h-1 w-1/4 rounded ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`}
              ></div>
              <div
                className={`h-1 w-1/4 rounded ${passwordStrength.hasUpperCase ? 'bg-green-500' : 'bg-gray-300'}`}
              ></div>
              <div
                className={`h-1 w-1/4 rounded ${passwordStrength.hasLowerCase ? 'bg-green-500' : 'bg-gray-300'}`}
              ></div>
              <div
                className={`h-1 w-1/4 rounded ${passwordStrength.hasSpecialChar ? 'bg-green-500' : 'bg-gray-300'}`}
              ></div>
            </div>
            <div className="grid grid-cols-2 mt-1">
              <span
                className={`text-xs ${passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-500'}`}
              >
                Numbers
              </span>
              <span
                className={`text-xs ${passwordStrength.hasUpperCase ? 'text-green-500' : 'text-gray-500'}`}
              >
                Uppercase character
              </span>
              <span
                className={`text-xs ${passwordStrength.hasLowerCase ? 'text-green-500' : 'text-gray-500'}`}
              >
                Lowercase character
              </span>
              <span
                className={`text-xs ${passwordStrength.hasSpecialChar ? 'text-green-500' : 'text-gray-500'}`}
              >
                Special character
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            ref={confirmPasswordRef}
            className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Gender</label>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="male"
                name="gender"
                ref={maleRef}
                className="mr-2"
              />
              <label htmlFor="male">Male</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="female"
                name="gender"
                ref={femaleRef}
                className="mr-2"
              />
              <label htmlFor="female">Female</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="other"
                name="gender"
                ref={otherRef}
                className="mr-2"
              />
              <label htmlFor="other">Other</label>
            </div>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>

        <AutocompleteCountry
          id="uncontrolled-country"
          value={country}
          onChange={setCountry}
          error={errors.country}
        />

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Profile Image (JPEG/PNG, max 5MB)
          </label>
          <input
            type="file"
            id="image"
            ref={imageRef}
            onChange={handleImageChange}
            accept="image/jpeg,image/png"
            className={`w-full p-2 border rounded ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image}</p>
          )}

          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Image Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-auto max-h-40 rounded border"
              />
            </div>
          )}
        </div>

        {/* Terms and Conditions Field */}
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              ref={termsRef}
              className={`mr-2 ${errors.termsAccepted ? 'border-red-500' : ''}`}
            />
            <label htmlFor="terms" className="text-sm">
              I accept the Terms and Conditions
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-500 text-xs mt-1">{errors.termsAccepted}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UncontrolledForm;
