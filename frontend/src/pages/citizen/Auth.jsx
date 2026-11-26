import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Shield,
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Logo } from '../../components/common/Logo';
import { LanguageSelector } from '../../components/layout/LanguageSelector';
import { useAuth } from '../../hooks/useAuth';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useToast } from '../../components/common/Toast';

export const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginWithGoogle, register, switchRole } = useAuth();
  const { showToast } = useToast();
  const { fetchLocation } = useGeolocation();

  // Selected portal: 'citizen' or 'admin' (defaults from URL ?portal=admin or ?portal=citizen)
  const [portal, setPortal] = useState(searchParams.get('portal') === 'admin' ? 'admin' : 'citizen');
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [step, setStep] = useState('form'); // 'form' | 'location_prompt'
  const [loading, setLoading] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: searchParams.get('portal') === 'admin' ? 'admin.chennai@nammafix.gov.in' : '',
    phone: '',
    password: 'password123',
    officerBadgeId: 'CHN-AE-102',
    department: 'Greater Chennai Corporation - Ward 114',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = t('validation.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('validation.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('validation.required');
    }

    if (mode === 'register' && portal === 'citizen') {
      if (!formData.name) newErrors.name = t('validation.required');
      if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = t('validation.phoneInvalid');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (portal === 'admin') {
        // Admin Officer Authentication
        await login(formData.email || 'admin.chennai@nammafix.gov.in', formData.password);
        switchRole('admin');
        showToast('Corporation Officer credentials verified. Access granted!', 'success');
        navigate('/admin');
      } else {
        // Citizen Authentication
        if (mode === 'login') {
          await login(formData.email, formData.password);
          switchRole('citizen');
          showToast(t('auth.loginTitle'), 'success');
          navigate('/');
        } else {
          await register(formData);
          switchRole('citizen');
          setStep('location_prompt');
        }
      }
    } catch (err) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      switchRole('citizen');
      showToast('Logged in with Google', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Google login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = (type) => {
    if (type === 'citizen') {
      setPortal('citizen');
      setMode('login');
      setFormData((prev) => ({
        ...prev,
        email: 'karthik@gmail.com',
        password: 'password123',
        name: 'Karthik S',
      }));
    } else {
      setPortal('admin');
      setMode('login');
      setFormData((prev) => ({
        ...prev,
        email: 'admin.chennai@nammafix.gov.in',
        password: 'adminpassword',
        officerBadgeId: 'CHN-AE-102',
        department: 'Zone 8 (Anna Nagar) Roads Dept',
      }));
    }
  };

  const handleAllowLocation = () => {
    fetchLocation();
    showToast(t('auth.locationPermissionTitle'), 'success');
    navigate('/');
  };

  if (step === 'location_prompt') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 max-w-md mx-auto">
        <Card className="w-full text-center p-6 sm:p-8 space-y-6 border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <MapPin className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('auth.locationPermissionTitle')}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('auth.locationPermissionDesc')}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={handleAllowLocation}
              variant="primary"
              size="lg"
              fullWidth
              icon={MapPin}
            >
              {t('auth.allowLocation')}
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="md"
              fullWidth
            >
              {t('auth.skipForNow')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-900">
      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/welcome')}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portals</span>
        </button>
        <LanguageSelector variant="header" />
      </div>

      <Card className="w-full max-w-md p-6 sm:p-8 space-y-6 border-slate-200/90 bg-white shadow-sm">
        {/* Minimalist Portal Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/70">
          <button
            type="button"
            onClick={() => {
              setPortal('citizen');
              setMode('login');
              setErrors({});
            }}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              portal === 'citizen'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Citizen Login
          </button>
          <button
            type="button"
            onClick={() => {
              setPortal('admin');
              setMode('login');
              setErrors({});
            }}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              portal === 'admin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Officer Desk
          </button>
        </div>

        {/* Portal Header Title */}
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                portal === 'admin'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {portal === 'admin' ? 'Officer Authentication' : 'Citizen Authentication'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {portal === 'admin'
              ? 'Officer Operations Desk'
              : mode === 'login'
              ? t('auth.loginTitle')
              : t('auth.registerTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {portal === 'admin'
              ? 'Enter your municipal government credentials to manage ward issues'
              : mode === 'login'
              ? 'Sign in to track reported issues & upvote neighborhood fixes'
              : 'Create an account to report civic issues in your area'}
          </p>
        </div>

        {/* Google Sign In for Citizens */}
        {portal === 'citizen' && (
          <>
            <Button
              type="button"
              onClick={handleGoogleAuth}
              variant="outline"
              size="md"
              fullWidth
              disabled={loading}
              className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              {t('auth.continueWithGoogle')}
            </Button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-xs font-bold text-slate-400 uppercase">
                {t('auth.or')}
              </span>
            </div>
          </>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {portal === 'citizen' && mode === 'register' && (
            <Input
              label={t('auth.name')}
              placeholder="e.g. Karthik S"
              icon={User}
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
            />
          )}

          {portal === 'admin' && (
            <Input
              label="Municipal Officer Service / Badge ID"
              placeholder="e.g. CHN-AE-102"
              icon={KeyRound}
              value={formData.officerBadgeId}
              onChange={(e) => setFormData({ ...formData, officerBadgeId: e.target.value })}
            />
          )}

          <Input
            label={portal === 'admin' ? 'Gov Official Email ID' : t('auth.email')}
            type="email"
            placeholder={portal === 'admin' ? 'officer@chennaicorp.gov.in' : 'name@example.com'}
            icon={Mail}
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          {portal === 'citizen' && mode === 'register' && (
            <Input
              label={t('auth.phone')}
              type="tel"
              placeholder="9840123456"
              icon={Phone}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
            />
          )}

          <Input
            label={t('auth.password')}
            type="password"
            placeholder="••••••••"
            icon={Lock}
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={portal === 'admin' ? Shield : ArrowRight}
            iconPosition={portal === 'admin' ? 'left' : 'right'}
            className={
              portal === 'admin'
                ? 'bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-sm min-h-[48px]'
                : 'bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm min-h-[48px]'
            }
          >
            {portal === 'admin'
              ? 'Authenticate as Corporation Officer'
              : mode === 'login'
              ? t('auth.login')
              : t('auth.register')}
          </Button>
        </form>

        {/* Toggle Mode for Citizens */}
        {portal === 'citizen' && (
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setErrors({});
              }}
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
            >
              {mode === 'login' ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
            </button>
          </div>
        )}

        {/* Clean Minimalist Quick Autofill Buttons */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            ⚡ Quick Test Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('citizen')}
              className="p-2.5 text-xs font-semibold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl border border-slate-200 transition-colors"
            >
              👤 Fill Citizen
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('admin')}
              className="p-2.5 text-xs font-semibold bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 rounded-xl border border-slate-200 transition-colors"
            >
              🏛️ Fill Officer
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
