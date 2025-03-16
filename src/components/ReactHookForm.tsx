import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveReactHookForm } from '../store/formSlice';
import AutocompleteCountry from './AutocompleteCountry';
import { FormData } from '../types/types';

const ReactHookForm = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [country, setCountry] = useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      age: undefined,
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      country: '',
      imageBase64: '',
    },
  });

  useEffect(() => {
    setValue('country', country);
    setTimeout(() => trigger('country'), 0);
  }, [country, setValue, trigger]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(file ? URL.createObjectURL(file) : null);
        setValue('imageBase64', base64);
        console.log('file', file);
        trigger('imageBase64');
      };
      reader.readAsDataURL(file);
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
      <div className="mb-4">
        <label>Name:</label>
        <input {...register('name')} autoComplete="given-name" />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div className="mb-4">
        <label>Age:</label>
        <input type="number" {...register('age')} autoComplete="age" />
        {errors.age && <p>{errors.age.message}</p>}
      </div>

      <div className="mb-4">
        <label>Email:</label>
        <input type="email" {...register('email')} autoComplete="email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <label>Password:</label>
        <input
          type="password"
          {...register('password')}
          autoComplete="new-password"
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div className="mb-4">
        <label>Confirm Password:</label>
        <input
          type="password"
          {...register('confirmPassword')}
          autoComplete="new-password"
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      <div className="mb-4">
        <label>Gender:</label>
        <select {...register('gender')}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p>{errors.gender.message}</p>}
      </div>

      <div className="mb-4">
        <label>Country:</label>
        <AutocompleteCountry
          value={country}
          onChange={setCountry}
          id="country"
        />
        {errors.country && <p>{errors.country.message}</p>}
      </div>

      <div className="mb-4">
        <label>Profile Image:</label>
        <input
          type="file"
          accept="image/*"
          name="image"
          // {...register('image')}
          onChange={handleImageUpload}
        />
        {imagePreview && (
          <img src={imagePreview} className="preview-image" alt="Preview" />
        )}
        {errors.imageBase64 && <p>{errors.imageBase64.message}</p>}
      </div>

      <div className="mb-4">
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            {...register('termsAccepted')}
            className={`mr-2 ${errors.termsAccepted ? 'border-red-500' : ''}`}
          />
          <label>I accept the Terms and Conditions</label>
          {errors.termsAccepted && <p>{errors.termsAccepted.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`btn ${isValid ? 'btn-active' : 'btn-disabled'}`}
      >
        Submit
      </button>
    </form>
  );
};

export default ReactHookForm;
