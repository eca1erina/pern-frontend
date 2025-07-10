'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import UserCard from '@organisms/UserCard/UserCard';
import { Header } from '@organisms/Header/Header';
import '@templates/ProfileTemplate/ProfileTemplate.css';
import { IProfileTemplateProps } from './IProfileTemplate';

const ProfileTemplate: FC<IProfileTemplateProps> = ({ user, onFollow }) => {
  const router = useRouter();

  return (
    <div className="profile-template">
      <Header
        logoIcon="👤"
        logoText="Profile"
        buttonLabel="Settings"
        buttonVariant="ghost"
        onButtonClick={() => router.push('/settings')}
      />
      <main>
        <UserCard user={user} onFollow={onFollow} />
      </main>
    </div>
  );
};

export default ProfileTemplate;
