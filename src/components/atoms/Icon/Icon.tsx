import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 20, color = 'currentColor' }) => {
  const LucideIcon = LucideIcons[name];
  return LucideIcon ? <LucideIcon size={size} color={color} /> : null;
};

export default Icon; 