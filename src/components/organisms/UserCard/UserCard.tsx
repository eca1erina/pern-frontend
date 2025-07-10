'use client';
import React from 'react';
import { User } from 'lucide-react';
import './UserCard.css';
import { UserCardProps } from './IUserCard';

const UserCard: React.FC<UserCardProps> = ({ user, onFollow }) => {
  return (
    <div className="profile-state">
      <User size={20} style={{ marginRight: 18 }} />
      <span className="profile-name">{user.name}</span>
    </div>
  );
};

export default UserCard;
