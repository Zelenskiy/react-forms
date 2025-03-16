export interface FormData {
  firstName: string;
  password: string;
  country: string;
  termsAccepted?: boolean;
  // image?: File | null;
  name: string;
  age: number;
  email: string;
  confirmPassword: string;
  gender: string;
  isNew: boolean;
  resolver?: (data: FormData) => boolean | undefined;
  mode: string;
  imageBase64: string;
}

export interface FormState {
  uncontrolled: FormData;
  reactHookForm: FormData;
}

export interface CountriesState {
  list: string[];
}

export interface RootState {
  forms: FormState;
  countries: CountriesState;
}
