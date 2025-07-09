export interface SignupCardProps {
  title?: string;
  onSignup: (formData: { name: string; email: string; password: string }) => void;
  onLoginClick: () => void;
}
