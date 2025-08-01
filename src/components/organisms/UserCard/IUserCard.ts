import { MouseEventHandler } from 'react';

export interface User {
  name: string;
  avatarUrl: string;
  email: string;
}

export interface UserProps {
  name: string;
}

export interface UserCardProps {
  user: User;
  onFollow: MouseEventHandler<HTMLButtonElement>;
}
