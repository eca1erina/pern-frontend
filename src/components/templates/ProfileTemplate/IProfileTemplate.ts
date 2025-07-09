import { User } from '@organisms/UserCard/IUserCard';
import { ButtonHTMLAttributes, MouseEventHandler } from 'react';

export interface IProfileTemplateProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  user: User;
  onFollow: MouseEventHandler<HTMLButtonElement>;
}
