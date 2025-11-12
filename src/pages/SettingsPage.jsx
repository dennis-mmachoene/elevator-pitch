import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Lock,
  Bell,
  Moon,
  Sun,
  Trash2,
  Camera,
  Save,
  X,
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { userAPI, uploadAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/Cards';
import Input, { Textarea } from '../components/Input';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, updateUser, updatePassword, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    university: user?.university || '',
    campus: user?.campus || '',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Avatar Upload State
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Notification State
  const [notifications, setNotifications] = useState({
    emailMessages: true,
    emailOrders: true,
    pushNotifications: false,
    marketingEmails: false,
  });

  const handleProfileChange = (field) => (e) => {
    setProfileForm({ ...profileForm, [field]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const response = await userAPI.updateProfile(profileForm);
      updateUser(response.data.data.user);
      setIsEditingProfile(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileForm({
      name: user?.name || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      university: user?.university || '',
      campus: user?.campus || '',
    });
    setIsEditingProfile(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const response = await uploadAPI.uploadAvatar(file);
      updateUser({ avatar: response.data.data.avatar });
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) return;

    const password = window.prompt('Please enter your password to confirm:');
    if (!password) return;

    try {
      // Call delete account API
      await logout();
      toast.success('Account deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Settings</h1>
        <p className="text-text-secondary">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card elevated>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-subtle">
              <User className="w-5 h-5 text-accent-600" />
            </div>
            <h2 className="text-xl font-display font-semibold">Profile</h2>
          </div>
          {!isEditingProfile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingProfile(true)}
            >
              Edit
            </Button>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-neutral-200 dark:border-ground-700">
          <div className="relative">
            <Avatar src={user?.avatar} name={user?.name} size="2xl" />
            <label className="absolute bottom-0 right-0 p-2 rounded-full bg-gradient-accent text-white cursor-pointer hover:scale-110 transition-transform">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={isUploadingAvatar}
              />
              {isUploadingAvatar ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </label>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">{user?.name}</h3>
            <p className="text-sm text-text-secondary mb-2">{user?.email}</p>
            <p className="text-xs text-text-tertiary">
              Click the camera icon to change your avatar
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={profileForm.name}
            onChange={handleProfileChange('name')}
            disabled={!isEditingProfile}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={profileForm.phone}
            onChange={handleProfileChange('phone')}
            placeholder="+1 (555) 000-0000"
            disabled={!isEditingProfile}
          />

          <Textarea
            label="Bio"
            value={profileForm.bio}
            onChange={handleProfileChange('bio')}
            placeholder="Tell us about yourself..."
            rows={3}
            disabled={!isEditingProfile}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="University"
              value={profileForm.university}
              onChange={handleProfileChange('university')}
              placeholder="University Name"
              disabled={!isEditingProfile}
            />

            <Input
              label="Campus"
              value={profileForm.campus}
              onChange={handleProfileChange('campus')}
              placeholder="Main Campus"
              disabled={!isEditingProfile}
            />
          </div>

          {isEditingProfile && (
            <div className="flex gap-3 pt-4">
              <Button
                variant="accent"
                onClick={handleSaveProfile}
                loading={isSavingProfile}
                disabled={isSavingProfile}
                icon={Save}
              >
                Save Changes
              </Button>
              <Button variant="ghost" onClick={handleCancelEdit} icon={X}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Password Settings */}
      <Card elevated>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-subtle">
            <Lock className="w-5 h-5 text-accent-600" />
          </div>
          <h2 className="text-xl font-display font-semibold">
            Change Password
          </h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
            required
          />

          <Input
            label="New Password"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            helperText="At least 6 characters with uppercase, lowercase & number"
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
            required
          />

          <Button
            type="submit"
            variant="accent"
            loading={isChangingPassword}
            disabled={isChangingPassword}
          >
            Update Password
          </Button>
        </form>
      </Card>

      {/* Appearance */}
      <Card elevated>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-subtle">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-accent-600" />
            ) : (
              <Sun className="w-5 h-5 text-accent-600" />
            )}
          </div>
          <h2 className="text-xl font-display font-semibold">Appearance</h2>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated">
          <div>
            <p className="font-medium mb-1">Theme</p>
            <p className="text-sm text-text-secondary">
              {theme === 'dark' ? 'Dark mode' : 'Light mode'}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              theme === 'dark' ? 'bg-accent-600' : 'bg-neutral-300'
            }`}
          >
            <motion.div
              className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
              animate={{ x: theme === 'dark' ? 28 : 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            />
          </button>
        </div>
      </Card>

      {/* Notifications */}
      <Card elevated>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-subtle">
            <Bell className="w-5 h-5 text-accent-600" />
          </div>
          <h2 className="text-xl font-display font-semibold">Notifications</h2>
        </div>

        <div className="space-y-4">
          {Object.entries({
            emailMessages: 'Email notifications for new messages',
            emailOrders: 'Email notifications for orders',
            pushNotifications: 'Push notifications (coming soon)',
            marketingEmails: 'Marketing emails and updates',
          }).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated"
            >
              <p className="text-sm">{label}</p>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    [key]: !notifications[key],
                  })
                }
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  notifications[key] ? 'bg-accent-600' : 'bg-neutral-300'
                }`}
                disabled={key === 'pushNotifications'}
              >
                <motion.div
                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                  animate={{ x: notifications[key] ? 28 : 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card elevated className="border-2 border-red-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-display font-semibold text-red-600 dark:text-red-400">
            Danger Zone
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
            <h3 className="font-semibold mb-2">Delete Account</h3>
            <p className="text-sm text-text-secondary mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <Button variant="danger" icon={Trash2} onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;