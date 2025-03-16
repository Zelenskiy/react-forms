import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveReactHookForm } from '../store/formSlice';
import { formSchema } from '../validations/schemas';
import AutocompleteCountry from './AutocompleteCountry';
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
        <input {...register('firstName')} />
        {errors.firstName && <p>{errors.firstName.message}</p>}
      </div>

      <div>
        <label>Password:</label>
        <input type="password" {...register('password')} />
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

      <div>
        <label>Country:</label>
        <AutocompleteCountry value={country} onChange={setCountry} id={''} />
        {errors.country && <p>{errors.country.message}</p>}
      </div>

      <div>
        <label>Photo:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="preview-image" />
        )}
        {errors.profileImage && <p>{errors.profileImage.message}</p>}
      </div>

      <button type="submit">Send</button>
    </form>
  );
};

export default ReactHookForm;
