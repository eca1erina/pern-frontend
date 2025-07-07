import type { IconProps } from '@/components/atoms/Icon/IIcon';

export interface NavLinkProps {
  href: string;
  iconName: IconProps['name'];
  isActive?: boolean;
  children: React.ReactNode;
}
