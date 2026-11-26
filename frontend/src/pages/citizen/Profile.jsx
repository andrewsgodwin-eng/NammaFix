import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Globe, Shield, LogOut, Save, Edit3 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LanguageSelector } from '../../components/layout/LanguageSelector';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';

export const Profile = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser, switchRole, logout, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Karthik Subramanian',
    email: user?.email || 'karthik.s@example.com',
    phone: user?.phone || '9840123456',
    location: user?.location || 'T. Nagar, Chennai'
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(formData);
      setIsEditing(false);
      showToast(t('profile.profileUpdated'), 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-in fade-in duration-150 pb-8">
      {/* Header Card */}
      <Card className="p-6 text-center space-y-4 border-slate-200 bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 border-2 border-blue-200 text-blue-700 flex items-center justify-center mx-auto text-2xl font-black shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 text-white rounded-xl shadow-xs">
            {isAdmin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {user?.name}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#1D4ED8]">
            {isAdmin ? t('auth.adminMode') : t('auth.citizenMode')}
          </p>
        </div>
      </Card>

      {/* Profile Details & Settings */}
      <Card className="p-5 sm:p-7 space-y-5 border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {t('profile.title')}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={Edit3}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? t('common.cancel') : t('profile.editProfile')}
          </Button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label={t('profile.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={User}
              required
            />
            <Input
              label={t('profile.email')}
              value={formData.email}
              disabled
              icon={Mail}
              helperText="Email cannot be changed"
            />
            <Input
              label={t('profile.phone')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              icon={Phone}
            />
            <Input
              label={t('profile.currentLocation')}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              icon={MapPin}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={saving}
              icon={Save}
            >
              {t('profile.saveChanges')}
            </Button>
          </form>
        ) : (
          <div className="space-y-3.5 text-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500">{t('profile.email')}</span>
              <span className="font-bold text-slate-800">{user?.email}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500">{t('profile.phone')}</span>
              <span className="font-bold text-slate-800">{user?.phone}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500">{t('profile.currentLocation')}</span>
              <span className="font-bold text-slate-800">{user?.location}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Language Preference Card */}
      <Card className="p-5 border-slate-200 space-y-3">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          {t('profile.languagePreference')}
        </h4>
        <LanguageSelector variant="cards" />
      </Card>

      {/* Portal Switch & Access Card */}
      <Card className="p-5 border-slate-200 space-y-3">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Access Portals
        </h4>
        <p className="text-xs text-slate-500">
          Need to access the Corporation Officer desk? Switch portals to authenticate with your municipal badge.
        </p>
        <Button
          type="button"
          variant="outline"
          size="md"
          fullWidth
          onClick={() => navigate('/auth?portal=admin')}
        >
          🏛️ Switch to Corporation Officer Portal
        </Button>
      </Card>

      {/* App Version & Logout */}
      <div className="pt-2 text-center space-y-3">
        <p className="text-xs text-slate-400 font-medium">
          {t('profile.appVersion')}
        </p>

        <Button
          onClick={handleLogout}
          variant="danger"
          size="md"
          fullWidth
          icon={LogOut}
        >
          {t('profile.logoutBtn')}
        </Button>
      </div>
    </div>
  );
};
