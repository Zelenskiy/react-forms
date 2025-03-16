import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormData, FormState } from '../types/types';

const initialState: FormState = {
  uncontrolled: {
    name: '',
    age: 0,
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    termsAccepted: false,
    image: undefined,
    country: '',
    isNew: false,
    mode: '',
    imageBase64: '',
  },
  reactHookForm: {
    name: '',
    age: 0,
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    termsAccepted: false,
    image: undefined,
    country: '',
    isNew: false,
    mode: '',
    imageBase64: '',
  },
};

export const formSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    saveUncontrolledForm: (state, action: PayloadAction<FormData>) => {
      state.uncontrolled = { ...action.payload, isNew: true };
    },
    saveReactHookForm: (state, action: PayloadAction<FormData>) => {
      state.reactHookForm = { ...action.payload, isNew: true };
    },
    resetNewFlag: (
      state,
      action: PayloadAction<'uncontrolled' | 'reactHookForm'>
    ) => {
      if (action.payload === 'uncontrolled') {
        state.uncontrolled.isNew = false;
      } else if (action.payload === 'reactHookForm') {
        state.reactHookForm.isNew = false;
      }
    },
  },
});

export const { saveUncontrolledForm, saveReactHookForm, resetNewFlag } =
  formSlice.actions;

export default formSlice.reducer;
