// export interface FormData {
//     name: string;
//     age: number;
//     email: string;
//     password: string;
//     confirmPassword: string;
//     gender: string;
//     termsAccepted: boolean;
//     country: string;
//     isNew: boolean;
//     profileImage?: File;
//     image?: string| undefined;
//     firstName: string;
//   }

export interface FormData {
  firstName: string;
  password: string;
  country: string;
  profileImage: File | null;
  termsAccepted?: boolean;
  image?: File | null;
  name: string;
  age: number;
  email: string;
  confirmPassword: string;
  gender: string;
  isNew: boolean;
  resolver: (data: FormData) => boolean;
  mode: string;
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
