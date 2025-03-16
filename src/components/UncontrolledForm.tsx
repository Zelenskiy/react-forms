import { useState, FormEvent } from 'react';
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
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    termsAccepted: false,
    country: '',
    imageBase64: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState({
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
  });

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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      if (files && files[0]) {
        const file = files[0];
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
          setErrors({ ...errors, image: 'Only JPEG and PNG formats are allowed' });
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          setErrors({ ...errors, image: 'Image must be less than 5MB' });
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, imageBase64: reader.result as string, image: file }));
          setErrors((prev) => {
            const { image, ...rest } = prev;
            return rest;
          });
        };
        
        reader.readAsDataURL(file);
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // console.log('Form Data:', formData);
      
      const finalData: Partial<FormData> = {
        ...formData,
        age: formData.age ? Number(formData.age) : undefined,
        isNew: false,
      };
      console.log('Final Data:', finalData);
      
      await formSchema.validate(finalData, { abortEarly: false });
      finalData.image = undefined;
      dispatch(saveUncontrolledForm(finalData as FormData));
      navigate('/');
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
      <h1 className="text-2xl font-bold mb-6">Controlled Form Approach</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <p>{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="age">Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} />
          {errors.age && <p>{errors.age}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p>{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <p>{errors.password}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Gender</label>
          <div className="flex gap-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="male"
                name="gender"
                onChange={handleChange}
                className="mr-1"
              />
              <label htmlFor="male">Male</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="female"
                name="gender"
                onChange={handleChange}
                className="mr-1"
              />
              <label htmlFor="female">Female</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="other"
                name="gender"
                onChange={handleChange}
                className="mr-1"
              />
              <label htmlFor="other">Other</label>
            </div>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>

        <AutocompleteCountry id="country" value={formData.country} onChange={(value) => setFormData((prev) => ({ ...prev, country: value }))} error={errors.country} />

        <div className="mb-4">
          <label htmlFor="image">Profile Image (JPEG/PNG, max 5MB)</label>
          <input 
            type="file" name="files" 
            onChange={handleChange} 
            accept="image/jpeg,image/png"/>
          {errors.image && <p>{errors.image}</p>}
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              name="termsAccepted"
              type="checkbox"
              id="terms"
              onChange={handleChange}
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UncontrolledForm;
