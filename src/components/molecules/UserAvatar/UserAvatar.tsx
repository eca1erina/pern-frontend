'use client';
import { FC } from 'react';
import Image from 'next/image';
import '@molecules/UserAvatar/UserAvatar.css';
import { UserAvatarProps } from '@molecules/UserAvatar/IUserAvatar';
import Icon from '@atoms/Icon/Icon';

const UserAvatar: FC<UserAvatarProps> = ({ name, avatarUrl }) => (
  <div>
    {avatarUrl ? (
      <Image src={avatarUrl} alt={name} className="avatar-img" width={100} height={100} />
    ) : (
      <div className="avatar-img avatar-fallback">
        <Icon name="User" size={56} color="#7b6cff" />
      </div>
    )}
  </div>
);

export default UserAvatar;
