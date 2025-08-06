'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import { User } from '@organisms/UserCard/IUserCard';
import '../Dashboard/Dashboard.css';
import styles from './ProfilePage.module.css';
import { User as UserIcon, Lock, Info } from 'lucide-react';
import Copyright from '@/components/atoms/Copyright/Copyright';
import { useRouter } from 'next/navigation';
import UserCard from '../../organisms/UserCard/UserCard';
import { getData, putData } from '@/utils/api';
import { useCurrency } from '@/context/CurrencyContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [, setLoading] = useState<boolean>(true);
  const [joinDate, setJoinDate] = useState<string>('January 2024');
  const [userId, setUserId] = useState<number | null>(null);

  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();
  const currencyOptions = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'RON'];

  useEffect(() => {
    const session = sessionStorage.getItem('user');
    if (!session) {
      setLoading(false);
      return;
    }

    const { id } = JSON.parse(session);
    setUserId(id);

    const fetchUserData = async () => {
      try {
        const userRes = await getData<{
          name: string;
          email: string;
          joinDate: string;
        }>(`/users/${id}`);

        if (userRes) {
          const { name, email, joinDate } = userRes;
          setUser({ name, email, avatarUrl: '' });
          setUsernameInput(name || '');
          setEmailInput(email || '');
          setJoinDate(joinDate || 'January 2024');
        }
      } catch {
        //console.error(error);
        setFeedback('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveUsername = async () => {
    if (!userId) return;
    try {
      const updatedUser = await putData<{ name: string }>(`/users/${userId}`, {
        name: usernameInput,
      });
      if (updatedUser) {
        setUser((u) => (u ? { ...u, name: updatedUser.name } : u));
        setEditUsername(false);
        setFeedback('Username updated successfully.');
      }
    } catch {
      //setFeedback(err.response?.data?.message || 'Failed to update username.');
    }
  };

  const handleSaveEmail = async () => {
    if (!userId) return;
    try {
      const updatedUser = await putData<{ email: string }>(`/users/${userId}`, {
        email: emailInput,
      });
      if (updatedUser) {
        setUser((u) => (u ? { ...u, email: updatedUser.email } : u));
        setEditEmail(false);
        setFeedback('Email updated successfully.');
      }
    } catch {
      //setFeedback(err.response?.data?.message || 'Failed to update email.');
    }
  };

  const handleSavePassword = async () => {
    if (!userId) return;
    if (newPassword !== confirmPassword) {
      setFeedback("Passwords don't match.");
      return;
    }

    try {
      const updatedPasswordResponse = await putData(`/users/${userId}`, {
        password: newPassword,
      });

      if (updatedPasswordResponse) {
        setNewPassword('');
        setConfirmPassword('');
        setEditPassword(false);
        setFeedback('Password updated successfully.');
      }
    } catch {
      //setFeedback(err.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <>
      <Sidebar />
      <div className="mainContent" style={{ alignItems: 'center' }}>
        <h1 className="header" style={{ alignSelf: 'flex-start' }}>
          Profile
        </h1>
        <div
          style={{ cursor: 'pointer', marginBottom: '1.5rem' }}
          onClick={() => router.push('/profile')}
        >
          <UserCard name={user?.name || 'User'} />
        </div>

        {feedback && <p style={{ color: '#e53e3e', marginBottom: '1rem' }}>{feedback}</p>}

        <div className={styles.profileSectionsWrapper}>
          {/* Personal Info */}
          <div className={`${styles.profileSectionCard} ${styles.animatedCard}`}>
            <div className={styles.profileSectionHeader}>
              <span className={styles.profileSectionIcon}>
                <UserIcon />
              </span>
              <h2 className={styles.profileSectionTitle}>Personal Information</h2>
            </div>

            {/* Username */}
            <div className={styles.profileFieldGroup}>
              <label className={styles.profileLabel}>Username</label>
              <div className={styles.profileInputRow}>
                <input
                  className={styles.profileInput}
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setEditUsername(true);
                  }}
                />
                {editUsername && (
                  <>
                    <button className="btn" onClick={handleSaveUsername}>
                      Save
                    </button>
                    <button
                      className="btn"
                      style={{ background: '#ede9fe', color: '#6c63ff' }}
                      onClick={() => {
                        setEditUsername(false);
                        setUsernameInput(user?.name || '');
                      }}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Email */}
            <div className={styles.profileFieldGroup}>
              <label className={styles.profileLabel}>Email</label>
              <div className={styles.profileInputRow}>
                <input
                  className={styles.profileInput}
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setEditEmail(true);
                  }}
                />
                {editEmail && (
                  <>
                    <button className="btn" onClick={handleSaveEmail}>
                      Save
                    </button>
                    <button
                      className="btn"
                      style={{ background: '#ede9fe', color: '#6c63ff' }}
                      onClick={() => {
                        setEditEmail(false);
                        setEmailInput(user?.email || '');
                      }}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Currency Selector */}
            <div className={styles.profileFieldGroup}>
              <label className={styles.profileLabel}>Preferred Currency</label>
              <div className={styles.profileInputRow}>
                <select
                  className={styles.profileInput}
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    toast.success(`Currency changed to ${e.target.value}`);
                  }}
                >
                  {currencyOptions.map((cur) => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className={`${styles.profileSectionCard} ${styles.animatedCard}`}>
            <div className={styles.profileSectionHeader}>
              <span className={styles.profileSectionIcon}>
                <Lock />
              </span>
              <h2 className={styles.profileSectionTitle}>Security</h2>
            </div>
            <div className={styles.profileFieldGroup}>
              <label className={styles.profileLabel}>Password</label>
              <div
                className={styles.profileInputRow}
                style={{ flexDirection: 'column', gap: '0.7rem', alignItems: 'flex-start' }}
              >
                <input
                  className={styles.profileInput}
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setEditPassword(true);
                  }}
                />
                <input
                  className={styles.profileInput}
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setEditPassword(true);
                  }}
                />
                {editPassword && (
                  <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.7rem' }}>
                    <button className="btn" onClick={handleSavePassword}>
                      Save
                    </button>
                    <button
                      className="btn"
                      style={{ background: '#ede9fe', color: '#6c63ff' }}
                      onClick={() => {
                        setEditPassword(false);
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className={`${styles.profileSectionCard} ${styles.animatedCard}`}>
            <div className={styles.profileSectionHeader}>
              <span className={styles.profileSectionIcon}>
                <Info />
              </span>
              <h2 className={styles.profileSectionTitle}>Account Details</h2>
            </div>
            <div className={styles.accountDetailRow}>
              <span className={styles.accountDetailLabel}>Account Status</span>
              <span className={styles.accountStatusBadge}>Active</span>
            </div>
            <div className={styles.accountDetailRow}>
              <span className={styles.accountDetailLabel}>Member Since</span>
              <span className={styles.accountDetailDate}>{joinDate}</span>
            </div>
          </div>
        </div>

        <Copyright />
      </div>
    </>
  );
};

export default ProfilePage;
