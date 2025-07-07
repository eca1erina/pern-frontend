'use client';
import { FC } from 'react';
import Image from 'next/image';
import '@molecules/UserAvatar/UserAvatar.css';
import { UserAvatarProps } from '@molecules/UserAvatar/IUserAvatar';

const UserAvatar: FC<UserAvatarProps> = ({ name, avatarUrl }) => (
  <div>
    <Image src={avatarUrl} alt={name} className="avatar-img" width={40} height={40} />
    <span className="avatar-name">{name}</span>
  </div>
);

export default UserAvatar;
