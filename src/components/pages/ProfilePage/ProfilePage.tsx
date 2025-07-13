'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import { User } from '@organisms/UserCard/IUserCard';
import axios from 'axios';
import '../Dashboard/Dashboard.css';
import styles from './ProfilePage.module.css';
import { User as UserIcon, Mail, Lock, Activity, Calendar, LogIn, Info } from 'lucide-react';
import Copyright from '@/components/atoms/Copyright/Copyright';
import { useRouter } from 'next/navigation';
import UserCard from '../../organisms/UserCard/UserCard';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [joinDate, setJoinDate] = useState<string>('');
  const [lastLogin, setLastLogin] = useState<string>('');

  // Edit states
  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();

  useEffect(() => {
    const session = sessionStorage.getItem('user');
    if (!session) {
      setLoading(false);
      return;
    }
    const { id } = JSON.parse(session);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const fetchUserData = async () => {
      try {
        const userRes = await axios.get(`${apiUrl}/users/${id}`);
        const { name, email, joinDate, lastLogin } = userRes.data;
        setUser({ name, email, avatarUrl: '' });
        setUsernameInput(name || '');
        setEmailInput(email || '');
        setJoinDate(joinDate || 'January 2024');
        setLastLogin(lastLogin || 'N/A');
      } catch (error) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Handlers for saving edits (implement API calls as needed)
  const handleSaveUsername = () => {
    setEditUsername(false);
    // TODO: API call to save username
    setUser(u => u ? { ...u, name: usernameInput } : u);
  };
  const handleSaveEmail = () => {
    setEditEmail(false);
    // TODO: API call to save email
    setUser(u => u ? { ...u, email: emailInput } : u);
  };
  const handleSavePassword = () => {
    setEditPassword(false);
    setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    // TODO: API call to change password
  };

  return (
    <>
      <Sidebar />
      <div className="mainContent" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh', overflowY: 'auto' }}>
        <h1 className="header" style={{ alignSelf: 'flex-start' }}>Profile</h1>
        <div style={{ cursor: 'pointer', marginBottom: '1.5rem' }} onClick={() => router.push('/profile')}>
          <UserCard name="User" />
        </div>
          <div className={styles.profileSectionsWrapper}>
            <div className={styles.profileSectionCard + ' ' + styles.animatedCard}>
              <div className={styles.profileSectionHeader}>
                <span className={styles.profileSectionIcon}><UserIcon /></span>
                <h2 className={styles.profileSectionTitle}>Personal Information</h2>
              </div>
              <div className={styles.profileFieldGroup}>
                <label className={styles.profileLabel} >Username</label>
                <div className={styles.profileInputRow}>
                  <input className={styles.profileInput} value={usernameInput} placeholder="Username" onChange={e => { setUsernameInput(e.target.value); setEditUsername(true); }} />
                  {editUsername && (
                    <>
                      <button className="btn" onClick={handleSaveUsername}>Save</button>
                      <button className="btn" style={{ background: '#ede9fe', color: '#6c63ff' }} onClick={() => { setEditUsername(false); setUsernameInput(user?.name || ''); }}>Cancel</button>
                    </>
                  )}
                </div>
              </div>
              <div className={styles.profileFieldGroup}>
                <label className={styles.profileLabel}>Email</label>
                <div className={styles.profileInputRow}>
                  <input className={styles.profileInput} value={emailInput} placeholder="Email" onChange={e => { setEmailInput(e.target.value); setEditEmail(true); }} />
                  {editEmail && (
                    <>
                      <button className="btn" onClick={handleSaveEmail}>Save</button>
                      <button className="btn" style={{ background: '#ede9fe', color: '#6c63ff' }} onClick={() => { setEditEmail(false); setEmailInput(user?.email || ''); }}>Cancel</button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.profileSectionCard + ' ' + styles.animatedCard}>
              <div className={styles.profileSectionHeader}>
                <span className={styles.profileSectionIcon}><Lock /></span>
                <h2 className={styles.profileSectionTitle}>Security</h2>
              </div>
              <div className={styles.profileFieldGroup}>
                <label className={styles.profileLabel}>Password</label>
                <div className={styles.profileInputRow} style={{ flexDirection: 'column', gap: '0.7rem', alignItems: 'flex-start' }}>
                  <input className={styles.profileInput} type="password" placeholder="New Password" value={newPassword} onChange={e => { setNewPassword(e.target.value); setEditPassword(true); }} />
                  <input className={styles.profileInput} type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setEditPassword(true); }} />
                  {editPassword && (
                    <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.7rem' }}>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.profileSectionCard + ' ' + styles.animatedCard}>
              <div className={styles.profileSectionHeader}>
                <span className={styles.profileSectionIcon}><Info /></span>
                <h2 className={styles.profileSectionTitle}>Account Details</h2>
              </div>
              <div className={styles.accountDetailRow}>
                <span className={styles.accountDetailLabel}>Account Status</span>
                <span className={styles.accountStatusBadge}>Active</span>
              </div>
              <div className={styles.accountDetailRow}>
                <span className={styles.accountDetailLabel}>Member Since</span>
                <span className={styles.accountDetailDate}>Jan 12, 2023</span>
              </div>
              <div className={styles.accountDetailRow}>
                <span className={styles.accountDetailLabel}>Last Login</span>
                <span className={styles.accountDetailDate}>Apr 27, 2024</span>
              </div>
            </div>
          </div>
          <div className={styles.saveChangesWrapper + ' ' + styles.saveChangesWrapperCenter}>
            <button className={styles.saveChangesBtn}>Save Changes</button>
          </div>
        <Copyright />
      </div>
    </>
  );
};

export default ProfilePage;

