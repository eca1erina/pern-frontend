export interface FormData {
  email: string;
  password: string;
}

export interface Props {
  onSubmit: (data: FormData) => void;
}
