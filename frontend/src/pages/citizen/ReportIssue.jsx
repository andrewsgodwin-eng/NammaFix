import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Camera,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  Wand2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { PhotoUpload } from '../../components/issues/PhotoUpload';
import { CategoryPicker } from '../../components/issues/CategoryPicker';
import { LocationPicker } from '../../components/map/LocationPicker';
import { ISSUE_IMAGES } from '../../assets/placeholders';
import { issueService } from '../../services/issueService';
import { useAuth } from '../../hooks/useAuth';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useToast } from '../../components/common/Toast';

export const ReportIssue = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { location: geoLoc, fetchLocation } = useGeolocation(true);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [createdIssue, setCreatedIssue] = useState(null);
  const [copied, setCopied] = useState(false);
  const [similarIssues, setSimilarIssues] = useState([]);
  const [suggestedCategory, setSuggestedCategory] = useState(null);

  const [formData, setFormData] = useState({
    imageUrl: '',
    category: '',
    description: '',
    address: 'Usman Road, T. Nagar, Chennai',
    location: {
      lat: geoLoc.lat || 13.0418,
      lng: geoLoc.lng || 80.2337,
    },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (geoLoc.lat && geoLoc.lng) {
      setFormData((prev) => ({
        ...prev,
        location: { lat: geoLoc.lat, lng: geoLoc.lng },
      }));
    }
  }, [geoLoc]);

  // Phase 6: Image Category Classification Heuristic
  const handleImageChange = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));

    // AI Classification Suggestion Simulation
    if (url && !formData.category) {
      const lower = url.toLowerCase();
      let detected = 'pothole';
      if (lower.includes('light') || lower.includes('electric') || lower.includes('dark')) detected = 'street_light';
      else if (lower.includes('garbage') || lower.includes('waste') || lower.includes('bin')) detected = 'garbage';
      else if (lower.includes('water') || lower.includes('pipe') || lower.includes('leak')) detected = 'water';
      else if (lower.includes('drain') || lower.includes('sewage')) detected = 'drainage';

      setSuggestedCategory(detected);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      imageUrl: prev.imageUrl || ISSUE_IMAGES[categoryId] || ISSUE_IMAGES.other,
    }));
    setErrors((prev) => ({ ...prev, category: '' }));
  };

  // Phase 6: Proximity duplicate check
  useEffect(() => {
    if (formData.category && formData.location?.lat) {
      issueService
        .getSimilarIssues(formData.location.lat, formData.location.lng, formData.category)
        .then(setSimilarIssues)
        .catch(() => {});
    }
  }, [formData.category, formData.location]);

  const handleNext = () => {
    if (step === 2 && !formData.category) {
      setErrors({ category: t('validation.categoryRequired') });
      return;
    }
    if (step === 3) {
      const errs = {};
      if (!formData.description || formData.description.trim().length < 10) {
        errs.description = t('validation.descMinLength');
      }
      if (formData.description.length > 280) {
        errs.description = t('validation.descMaxLength');
      }
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
    }
    setErrors({});
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await issueService.createIssue(formData, user);
      setCreatedIssue(result);
      setStep(5);
      showToast(t('report.successTitle'), 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyComplaintId = () => {
    if (createdIssue?.complaintId) {
      navigator.clipboard.writeText(createdIssue.complaintId);
      setCopied(true);
      showToast(t('common.idCopied'), 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Step 5: Success Screen
  if (step === 5 && createdIssue) {
    return (
      <div className="max-w-lg mx-auto text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
        <Card className="p-6 sm:p-8 space-y-6 border-emerald-200 bg-gradient-to-b from-emerald-50/40 via-white to-white">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {t('report.successTitle')}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('report.successMessage', { complaintId: createdIssue.complaintId })}
            </p>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
            <div className="text-left">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                {t('issue.complaintId')}
              </span>
              <span className="text-lg font-black tracking-wider text-amber-400">
                {createdIssue.complaintId}
              </span>
            </div>
            <Button
              onClick={copyComplaintId}
              variant="outline"
              size="sm"
              icon={copied ? Check : Copy}
              className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700 min-h-[40px]"
            >
              {copied ? 'Copied' : t('common.copyId')}
            </Button>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={() => navigate(`/issue/${createdIssue.complaintId}`)}
              variant="primary"
              size="lg"
              fullWidth
              icon={ArrowRight}
              iconPosition="right"
              className="shadow-lg shadow-blue-600/20"
            >
              {t('report.trackComplaintBtn')}
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="md"
              fullWidth
            >
              {t('report.backToHomeBtn')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-6">
      {/* Step Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
            Step {step} of 4
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {step === 1 && t('report.step1')}
            {step === 2 && t('report.step2')}
            {step === 3 && t('report.step3')}
            {step === 4 && t('report.step4')}
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[#1D4ED8] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Photo */}
      {step === 1 && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Camera className="w-5 h-5 text-[#1D4ED8]" />
            <h3 className="text-lg font-bold text-slate-900">{t('report.step1')}</h3>
          </div>
          <PhotoUpload
            imageUrl={formData.imageUrl}
            onImageChange={handleImageChange}
            category={formData.category}
          />

          {suggestedCategory && !formData.category && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 text-blue-900 font-semibold">
                <Wand2 className="w-4 h-4 text-[#1D4ED8]" />
                Suggested Category: <strong>{t(`categories.${suggestedCategory}`)}</strong>
              </span>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleCategorySelect(suggestedCategory)}
              >
                Apply
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Step 2: Category */}
      {step === 2 && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="w-5 h-5 text-[#1D4ED8]" />
            <h3 className="text-lg font-bold text-slate-900">{t('report.selectCategory')}</h3>
          </div>
          <CategoryPicker
            selectedCategory={formData.category}
            onSelect={handleCategorySelect}
            error={errors.category}
          />
        </Card>
      )}

      {/* Step 3: Description & Location */}
      {step === 3 && (
        <Card className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-[#1D4ED8]" />
            <h3 className="text-lg font-bold text-slate-900">{t('report.step3')}</h3>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-800">
                {t('report.descriptionLabel')} <span className="text-rose-500">*</span>
              </label>
              <span className={`text-xs ${formData.description.length > 280 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                {t('report.charCount', { count: formData.description.length })}
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('report.descriptionPlaceholder')}
              className={`w-full p-3.5 rounded-xl border bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] ${
                errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.description && (
              <p className="text-xs font-semibold text-rose-600">{errors.description}</p>
            )}
          </div>

          <Input
            label="Street Address / Landmark"
            placeholder={t('report.addressPlaceholder')}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <LocationPicker
            location={formData.location}
            onLocationChange={(loc) => setFormData((prev) => ({ ...prev, location: loc }))}
            onDetectGps={fetchLocation}
            address={formData.address}
            onAddressChange={(newAddr) => setFormData((prev) => ({ ...prev, address: newAddr }))}
          />
        </Card>
      )}

      {/* Step 4: Review & Similar Issue Duplicate Prevention */}
      {step === 4 && (
        <div className="space-y-4">
          {/* Similar Issue Callout */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm text-amber-900 space-y-2">
              <h4 className="font-bold text-amber-950">
                {t('report.similarWarningTitle')}
              </h4>
              <p>
                {t('report.similarWarningDesc', {
                  category: t(`categories.${formData.category || 'other'}`),
                })}
              </p>
              <div className="pt-1 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(similarIssues[0]?.complaintId ? `/issue/${similarIssues[0].complaintId}` : '/issue/NMF-2026-00427')}
                  className="bg-amber-600 hover:bg-amber-700 min-h-[36px]"
                >
                  {t('report.joinExistingBtn')}
                </Button>
              </div>
            </div>
          </div>

          {/* Report Summary Card */}
          <Card className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
              {t('report.reviewTitle')}
            </h3>

            {formData.imageUrl && (
              <div className="rounded-xl overflow-hidden h-44 bg-slate-100 border">
                <img
                  src={formData.imageUrl}
                  alt="Issue Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-xs text-slate-400 block font-semibold">Category</span>
                <span className="font-bold text-slate-900">
                  {t(`categories.${formData.category || 'other'}`)}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-xs text-slate-400 block font-semibold">Reporter</span>
                <span className="font-bold text-slate-900">{user?.name || 'Citizen'}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-sm">
              <span className="text-xs text-slate-400 block font-semibold">Description</span>
              <p className="text-slate-800 mt-0.5">{formData.description}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-sm">
              <span className="text-xs text-slate-400 block font-semibold">Location</span>
              <p className="text-slate-800 font-medium">{formData.address}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                GPS: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="md"
            icon={ArrowLeft}
            onClick={handleBack}
          >
            {t('common.back')}
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => navigate('/')}
          >
            {t('common.cancel')}
          </Button>
        )}

        {step < 4 ? (
          <Button
            type="button"
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={handleNext}
            className="ml-auto shadow-md shadow-blue-600/20"
          >
            {t('common.next')}
          </Button>
        ) : (
          <Button
            type="button"
            variant="action"
            size="lg"
            loading={submitting}
            onClick={handleSubmit}
            className="ml-auto shadow-lg shadow-red-600/25"
          >
            {t('report.submitReportBtn')}
          </Button>
        )}
      </div>
    </div>
  );
};
