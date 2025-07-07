'use client';
import React from 'react';
import { User } from 'lucide-react';
import './UserCard.css';

interface UserCardProps {
  name: string;
}

const UserCard: React.FC<UserCardProps> = ({ name }) => {
  return (
    <div className="profile-state">
      <User size={20} style={{ marginRight: 18 }} />
      <span className="profile-name">{name}</span>
    </div>
  );
};

export default UserCard;
