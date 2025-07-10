'use client';

import { FC, useEffect, useState } from 'react';
import ProfileTemplate from '@templates/ProfileTemplate/ProfileTemplate';
import { User } from '@organisms/UserCard/IUserCard';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const ProfilePage: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const session = sessionStorage.getItem('user');

    if (!session) {
      console.error('No user session found.');
      setLoading(false);
      return;
    }

    const { id } = JSON.parse(session);

    axios
      .get(`http://localhost:3001/users/${id}`)
      .then((res) => {
        const { name, email } = res.data;

        setUser({
          name,
          email,
          avatarUrl: '', 
        });
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleFollow = () => {
    if (user) {
      alert(`You followed ${user.name}`);
    }
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found or not logged in.</p>;

  return (
    <div>
      <ProfileTemplate user={user} onFollow={handleFollow} />
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={goToDashboard} style={{ padding: '10px 20px' }}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
