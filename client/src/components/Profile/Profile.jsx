import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiLogOut, FiUser, FiMapPin, FiShoppingBag, FiEdit2, FiLock, FiPackage, FiArrowRight } from 'react-icons/fi';


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
      <div className={styles.notLoggedIn}>
        <div className={styles.notLoggedInContent}>
          <div className={styles.notLoggedInIcon}><FiLock size={48} /></div>
          <h2>Please sign in to view your profile</h2>
          <button
            onClick={() => navigate('/login')}
            className={styles.signInBtn}
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
      // Reset form
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
    <div className={styles.profileContainer}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.userName}>{user.name}</h1>
            <p className={styles.userEmail}>{user.email}</p>
            <p className={styles.userSince}>
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FiLogOut size={18} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FiShoppingBag size={18} /> My Orders
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'address' ? styles.active : ''}`}
          onClick={() => setActiveTab('address')}
        >
          <FiMapPin size={18} /> Address Book
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FiUser size={18} /> Account Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* My Orders */}
        {activeTab === 'orders' && (
          <div className={styles.ordersList}>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}><FiPackage size={48} /></div>
              <h3>No orders yet</h3>
              <p>You haven&apos;t made any purchases. Start shopping now!</p>
              <a href="/products" className={styles.ctaBtn}>
                Continue Shopping <FiArrowRight size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Address Book */}
        {activeTab === 'address' && (
          <div className={styles.addressList}>
            <div className={styles.addressHeader}>
              <h3>Saved Addresses</h3>
              <button className={styles.addAddressBtn}>+ Add New Address</button>
            </div>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}><FiMapPin size={48} /></div>
              <h3>No addresses saved</h3>
              <p>Add your delivery addresses for faster checkout</p>
            </div>
          </div>
        )}

        {/* Account Settings */}
        {activeTab === 'settings' && (
          <div className={styles.settings}>
            <div className={styles.settingsHeader}>
              <h3>Personal Information</h3>
              <button
                className={styles.editBtn}
                onClick={handleEditToggle}
              >
                <FiEdit2 size={16} /> {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={styles.input}
                    placeholder="+880 1XX XXX XXXX"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={styles.textarea}
                    rows={4}
                    placeholder="Enter your delivery address"
                  />
                </div>

                <button type="submit" className={styles.saveBtn}>
                  Save Changes
                </button>
              </form>
            ) : (
              <div className={styles.infoDisplay}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Full Name</span>
                  <span className={styles.value}>{user.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{user.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Phone</span>
                  <span className={styles.value}>{user.phone || 'Not added'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Address</span>
                  <span className={styles.value}>{user.address || 'Not added'}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

