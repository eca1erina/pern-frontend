import { IconProps } from "@/components/atoms/Icon/Icon"; 

export interface NavLinkProps {
  href: string;
  iconName: IconProps['name']; 
  isActive?: boolean;
  children: React.ReactNode;
}