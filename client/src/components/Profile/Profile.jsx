import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom'
import { FiLogOut, FiUser, FiMapPin, FiShoppingBag, FiEdit2, FiLock, FiPackage, FiArrowRight, FiSave, FiX } from 'react-icons/fi';

const colors = {
  primary: "#1e293b",
  secondary: "#64748b",
  accent: "#10b981",
  background: "#f8fafc",
  white: "#ffffff",
  border: "#e2e8f0",
  text: "#1e293b",
  textLight: "#64748b",
  danger: "#ef4444",
}

const styles = {
  profileContainer: {
    maxWidth: '1000px',
    margin: '2rem auto',
    padding: '0 1.5rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    backgroundColor: colors.white,
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${colors.border}`,
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: colors.primary,
    color: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  userName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: colors.text,
    margin: 0,
  },
  userEmail: {
    fontSize: '1rem',
    color: colors.textLight,
    margin: 0,
  },
  userSince: {
    fontSize: '0.875rem',
    color: colors.secondary,
    marginTop: '0.25rem',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border}`,
    backgroundColor: 'transparent',
    color: colors.danger,
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  tabs: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: '0.5rem',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    color: colors.textLight,
    transition: 'all 0.2s',
    borderBottom: '3px solid transparent',
  },
  tabActive: {
    color: colors.primary,
    borderBottomColor: colors.primary,
  },
  tabContent: {
    backgroundColor: colors.white,
    padding: '2.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${colors.border}`,
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  emptyIcon: {
    color: colors.border,
    marginBottom: '1rem',
  },
  ctaBtn: {
    marginTop: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: '600',
  },
  settingsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  editBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: `1px solid ${colors.border}`,
    background: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  infoDisplay: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  infoLabel: {
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  infoValue: {
    fontSize: '1.125rem',
    color: colors.text,
    padding: '0.75rem',
    backgroundColor: colors.background,
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border}`,
  },
  form: {
    display: 'grid',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border}`,
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.875rem',
    backgroundColor: colors.accent,
    color: colors.white,
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  notLoggedIn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  notLoggedInContent: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: colors.white,
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
  },
  signInBtn: {
    marginTop: '1.5rem',
    padding: '0.875rem 2rem',
    backgroundColor: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  }
}

export function ProfileView() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  if (!user) {
    return (
      <div style={styles.notLoggedIn}>
        <div style={styles.notLoggedInContent}>
          <div style={{ color: colors.secondary, marginBottom: '1.5rem' }}><FiLock size={64} /></div>
          <h2 style={{ marginBottom: '1rem' }}>Access Denied</h2>
          <p style={{ color: colors.textLight }}>Please sign in to view your profile and manage orders.</p>
          <button
            onClick={() => navigate('/login')}
            style={styles.signInBtn}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div style={styles.profileContainer}>
      {/* Profile Header */}
      <div style={styles.profileHeader}>
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={styles.userInfo}>
            <h1 style={styles.userName}>{user.name}</h1>
            <p style={styles.userEmail}>{user.email}</p>
            {user.createdAt && (
              <p style={styles.userSince}>
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <FiLogOut size={18} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'orders' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('orders')}
        >
          <FiShoppingBag size={18} /> My Orders
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'address' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('address')}
        >
          <FiMapPin size={18} /> Address Book
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'settings' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('settings')}
        >
          <FiUser size={18} /> Account Settings
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === 'orders' && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}><FiPackage size={64} /></div>
            <h3>No orders yet</h3>
            <p style={{ color: colors.textLight }}>You haven&apos;t made any purchases. Start shopping now!</p>
            <a href="/products" style={styles.ctaBtn}>
              Continue Shopping <FiArrowRight size={14} />
            </a>
          </div>
        )}

        {activeTab === 'address' && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}><FiMapPin size={64} /></div>
            <h3>No addresses saved</h3>
            <p style={{ color: colors.textLight }}>Add your delivery addresses for faster checkout</p>
            <button style={styles.ctaBtn}>+ Add New Address</button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div style={styles.settingsHeader}>
              <h3 style={{ margin: 0 }}>Personal Information</h3>
              <button
                style={styles.editBtn}
                onClick={handleEditToggle}
              >
                {isEditing ? <><FiX size={16} /> Cancel</> : <><FiEdit2 size={16} /> Edit Profile</>}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={styles.input}
                    disabled
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={styles.input}
                    placeholder="+880 1XX XXX XXXX"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                    placeholder="Enter your delivery address"
                  />
                </div>

                <button type="submit" style={styles.saveBtn}>
                  <FiSave size={18} /> Save Changes
                </button>
              </form>
            ) : (
              <div style={styles.infoDisplay}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Full Name</span>
                  <span style={styles.infoValue}>{user.name}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Email</span>
                  <span style={styles.infoValue}>{user.email}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Phone</span>
                  <span style={styles.infoValue}>{user.phone || 'Not added'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Address</span>
                  <span style={styles.infoValue}>{user.address || 'Not added'}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
