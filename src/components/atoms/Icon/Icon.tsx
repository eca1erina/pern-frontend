import React from 'react';
import * as LucideIcons from 'lucide-react';
import { IconProps } from './IIcon';

const Icon: React.FC<IconProps> = ({ name, size = 20, color = 'currentColor' }) => {
  const LucideIcon = LucideIcons[name];
  if (typeof LucideIcon === 'function' || (LucideIcon && typeof LucideIcon === 'object')) {
    const Component = LucideIcon as React.ElementType;
    return <Component size={size} color={color} />;
  }
  return null;
};

export default Icon;
