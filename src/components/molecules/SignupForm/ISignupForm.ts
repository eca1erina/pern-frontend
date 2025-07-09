export interface SignupFormProps {
  onSubmit: (formData: { name: string; email: string; password: string }) => void;
}
