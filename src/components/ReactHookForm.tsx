import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveReactHookForm } from '../store/formSlice';
import AutocompleteCountry from './AutocompleteCountry';
import { FormData } from '../types/types';

const formSchema = yup.object().shape({
  firstName: yup.string().required('Name is required'),
  age: yup
    .number()
    .typeError('Age must be a number')
    .positive('Age must be positive')
    .integer('Age must be an integer')
    .min(18, 'You must be at least 18 years old')
    .max(120, 'Age cannot exceed 120')
    .required('Age is required'),
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  gender: yup.string().required('Gender is required'),
  country: yup.string().required('Country is required'),
  profileImage: yup.mixed().required('Profile image is required'),
  termsAccepted: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

const ReactHookForm = () => {
  const [passwordStrength, setPasswordStrength] = useState({
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [country, setCountry] = useState<string>('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      age: undefined,
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      country: '',
      termsAccepted: false,
    },
  });

  const password = watch('password');

  useEffect(() => {
    if (password) {
      setPasswordStrength({
        hasNumber: /\d/.test(password),
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      });
    }
  }, [password]);

  useEffect(() => {
    setValue('country', country);
    trigger('country');
  }, [country, setValue, trigger]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue('profileImage', file);
      trigger('profileImage');
    }
  };

  const onSubmit = (data: FormData) => {
    dispatch(saveReactHookForm(data));
    navigate('/success');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div>
        <label>Name:</label>
        <input {...register('firstName')} autoComplete="given-name" />
        {errors.firstName && <p>{errors.firstName.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="age" className="block text-sm font-medium mb-1">
          Age
        </label>
        <input
          type="number"
          id="age"
          {...register('age')}
          autoComplete="age"
          className={`w-full p-2 border rounded ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.age && (
          <p className="text-red-500 text-xs mt-1">{errors.age?.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          autoComplete="email"
          className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
        )}
      </div>

      <div>
        <label>Password:</label>
        <input 
          type="password" 
          {...register('password')} 
          autoComplete="new-password" 
        />
        {errors.password && <p>{errors.password.message}</p>}

        <div className="flex space-x-2">
          <p className={passwordStrength.hasNumber ? 'valid' : 'invalid'}>
            Digit
          </p>
          <p className={passwordStrength.hasUpperCase ? 'valid' : 'invalid'}>
            Upper symbol
          </p>
          <p className={passwordStrength.hasLowerCase ? 'valid' : 'invalid'}>
            Lower symbol
          </p>
          <p className={passwordStrength.hasSpecialChar ? 'valid' : 'invalid'}>
            Special characters
          </p>
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
          {...register('confirmPassword')}
          autoComplete="new-password"
          className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Gender</label>
        <div className="flex gap-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="male"
              value="male"
              {...register('gender')}
              className="mr-1"
            />
            <label htmlFor="male">Male</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="female"
              value="female"
              {...register('gender')}
              className="mr-1"
            />
            <label htmlFor="female">Female</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="other"
              value="other"
              {...register('gender')}
              className="mr-1"
            />
            <label htmlFor="other">Other</label>
          </div>
        </div>
        {errors.gender && (
          <p className="text-red-500 text-xs mt-1">{errors.gender?.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Country:</label>
        <AutocompleteCountry value={country} onChange={setCountry} id="country" />
        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
      </div>

      <div>
        <label>Photo:</label>
        <input 
          type="file" 
          accept="image/*" 
          {...register('profileImage', { onChange: handleImageUpload })}
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="preview-image" />
        )}
        {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage.message}</p>}
      </div>

      <div className="mb-4 mt-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            {...register('termsAccepted')}
            className={`mr-2 ${errors.termsAccepted ? 'border-red-500' : ''}`}
          />
          <label htmlFor="terms" className="text-sm">
            I accept the Terms and Conditions
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="text-red-500 text-xs mt-1">{errors.termsAccepted?.message}</p>
        )}
      </div>

      <button 
        type="submit" 
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
      >
        Send
      </button>
    </form>
  );
};

export default ReactHookForm;
