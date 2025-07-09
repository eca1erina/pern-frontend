'use client';
import { FC } from 'react';
import UserAvatar from '@molecules/UserAvatar/UserAvatar';
import Button from '@atoms/Button/Button';
import '@organisms/UserCard/UserCard.css';
import { UserCardProps } from './IUserCard';

const UserCard: FC<UserCardProps> = ({ user, onFollow }) => (
  <div className="user-card">
    <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />
  </div>
);

export default UserCard;
