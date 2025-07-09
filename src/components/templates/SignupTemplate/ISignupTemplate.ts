export interface ISignupTemplateProps {
  onSignup: (formData: { name: string; email: string; password: string }) => void;
  onLoginClick: () => void;
}
