export interface HeaderProps {
  logoIcon?: string;
  logoText?: string;
  buttonLabel?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'blue' | 'purple';
  onButtonClick?: () => void;
  showButton?: boolean;
}
