'use client';
import React from 'react';
import { User } from 'lucide-react';
import './UserCard.css';
import { UserProps } from './IUserCard';

const UserCard: React.FC<UserProps> = ({ name }) => {
  return (
    <div className="profile-state">
      <User size={20} style={{ marginRight: 18 }} />
      <span className="profile-name">{name}</span>
    </div>
  );
};

export default UserCard;
