import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveReactHookForm } from '../store/formSlice';
import AutocompleteCountry from './AutocompleteCountry';
import { formSchema } from '../validations/schemas';
import { FormData } from '../types/types';

const ReactHookForm = () => {
  const [passwordStrength, setPasswordStrength] = useState({
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [country, setCountry] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
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
      image: null,
      imageBase64: '',
    },
  });

  const password = watch('password');
  // const image = watch('image');
  // const termsAccepted = watch('termsAccepted');

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
    setTimeout(() => trigger('country'), 0);
    console.log('First Name:', watch('firstName'));
    console.log('Age:', watch('age'));
    console.log('Email:', watch('email'));
    console.log('Password:', watch('password'));
    console.log('Confirm Password:', watch('confirmPassword'));
    console.log('Gender:', watch('gender'));
    console.log('Country:', watch('country'));
    console.log('Profile Image:', watch('image'));
    console.log('Terms Accepted:', watch('termsAccepted'));
    console.log('isValid:', isValid);
    console.log('formData:', watch());
    console.log('file:', imagePreview);
    
    
  }, [country, setValue, trigger]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(file ? URL.createObjectURL(file) : null);
        setImageBase64(base64);
        setValue('imageBase64', base64);
        console.log('file', file);
        
        setValue('image', file);
        trigger('imageBase64');
      };
      reader.readAsDataURL(file);
      setValue('image', file);
      trigger('image');
    }
  };

  const onSubmit = (data: FormData) => {
    if (isValid) {
      console.log('Data:', data);
      dispatch(saveReactHookForm(data));
      navigate('/');
    } else {
      console.log('Form is invalid');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div>
        <label>Name:</label>
        <input {...register('firstName')} autoComplete="given-name" />
        {errors.firstName && <p>{errors.firstName.message}</p>}
      </div>

      <div>
        <label>Age:</label>
        <input type="number" {...register('age')} autoComplete="age" />
        {errors.age && <p>{errors.age.message}</p>}
      </div>

      <div>
        <label>Email:</label>
        <input type="email" {...register('email')} autoComplete="email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label>Password:</label>
        <input type="password" {...register('password')} autoComplete="new-password" />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div>
        <label>Confirm Password:</label>
        <input type="password" {...register('confirmPassword')} autoComplete="new-password" />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      <div>
        <label>Gender:</label>
        <select {...register('gender')}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p>{errors.gender.message}</p>}
      </div>

      <div>
        <label>Country:</label>
        <AutocompleteCountry 
          value={country} 
          onChange={setCountry} 
          id="country" />
        {errors.country && <p>{errors.country.message}</p>}
      </div>

      <div>
        <label>Profile Image:</label>
        <input 
          type="file" 
          accept="image/*" 
          name='image'
          // {...register('image')} 
          onChange={handleImageUpload} />
        {imagePreview && <img src={imagePreview} className="preview-image" alt="Preview" />}
        {errors.image && <p>{errors.image.message}</p>}
      </div>

      <div className="mb-4">
          <div className="flex items-center mt-4">
      <input type="checkbox" {...register('termsAccepted')} className={`mr-2 ${errors.termsAccepted ? 'border-red-500' : ''}`} />
        <label>I accept the Terms and Conditions</label>
        {errors.termsAccepted && <p>{errors.termsAccepted.message}</p>}
      </div>
      </div>

      <button 
        type="submit" 
        // disabled={!isValid} 
        className={`btn ${isValid ? 'btn-active' : 'btn-disabled'}`}>
        Submit
      </button>
    </form>
  );
};

export default ReactHookForm;
