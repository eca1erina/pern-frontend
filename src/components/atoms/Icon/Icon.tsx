import { icons } from 'lucide-react';
import { FC } from 'react';

export interface IconProps {
    name: keyof typeof icons;
    color?: string;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

const Icon: FC<IconProps> = ({
    name,
    color,
    size = 20,
    strokeWidth,
    className
}) => {
    const LucideIcon = icons[name];

    if(!LucideIcon) {
        return null;    
    }

    return (
        <LucideIcon
            color={color}
            size={size}
            strokeWidth={strokeWidth}   
            className={className}
        />
    );
};

export default Icon; 