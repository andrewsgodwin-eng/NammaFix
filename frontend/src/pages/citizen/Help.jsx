import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  SearchCode,
  FileQuestion,
  HelpCircle,
  PhoneCall,
  Building2,
  Send,
  PlusCircle,
  FileText,
  Users,
  Globe,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { FaqItem } from '../../components/help/FaqItem';
import { GuideCard } from '../../components/help/GuideCard';
import { EmergencyCard } from '../../components/help/EmergencyCard';
import { ComingSoonModal } from '../../components/common/ComingSoonModal';
import { EMERGENCY_CONTACTS } from '../../data/sampleData';
import { issueService } from '../../services/issueService';
import { useToast } from '../../components/common/Toast';

export const Help = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [trackInput, setTrackInput] = useState('');
  const [trackError, setTrackError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submittingContact, setSubmittingContact] = useState(false);

  useEffect(() => {
    issueService.getDepartments().then(setDepartments).catch(() => {});
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    const cleaned = trackInput.trim().toUpperCase();
    if (!cleaned || !/^NMF-\d{4}-\d{3,5}$/i.test(cleaned)) {
      setTrackError(t('help.invalidIdError'));
      return;
    }
    setTrackError('');
    navigate(`/issue/${cleaned}`);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactSubject || !contactMessage) {
      showToast(t('validation.required'), 'error');
      return;
    }
    // In Phase 1 show Coming Soon modal per Section 4 requirement
    setShowComingSoon(true);
  };

  // 5 How-to Guides
  const guides = [
    {
      id: 'report',
      title: t('help.guideReportTitle'),
      steps: t('help.guideReportSteps'),
      icon: PlusCircle
    },
    {
      id: 'track',
      title: t('help.guideTrackTitle'),
      steps: t('help.guideTrackSteps'),
      icon: FileText
    },
    {
      id: 'confirm',
      title: t('help.guideConfirmTitle'),
      steps: t('help.guideConfirmSteps'),
      icon: Users
    },
    {
      id: 'language',
      title: t('help.guideLanguageTitle'),
      steps: t('help.guideLanguageSteps'),
      icon: Globe
    },
    {
      id: 'location',
      title: t('help.guideLocationTitle'),
      steps: t('help.guideLocationSteps'),
      icon: MapPin
    }
  ];

  // 6 FAQs
  const faqs = [
    { q: t('help.faq1Q'), a: t('help.faq1A') },
    { q: t('help.faq2Q'), a: t('help.faq2A') },
    { q: t('help.faq3Q'), a: t('help.faq3A') },
    { q: t('help.faq4Q'), a: t('help.faq4A') },
    { q: t('help.faq5Q'), a: t('help.faq5A') },
    { q: t('help.faq6Q'), a: t('help.faq6A') }
  ];

  const filteredGuides = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.steps.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-150 pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1D4ED8] to-blue-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-4">
        <div className="space-y-1 max-w-xl">
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
            CITIZEN ASSISTANCE HUB
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('help.title')}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            {t('help.subtitle')}
          </p>
        </div>

        {/* 1. Search Box */}
        <div className="relative pt-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('help.searchPlaceholder')}
            icon={Search}
            className="bg-white/95 text-slate-900 border-none shadow-md min-h-[50px]"
          />
        </div>
      </div>

      {/* 2. Track a Complaint Section */}
      <Card className="p-5 sm:p-6 border-slate-200 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <SearchCode className="w-5 h-5 text-[#1D4ED8]" />
          <h3 className="text-lg font-bold text-slate-900">
            {t('help.trackTitle')}
          </h3>
        </div>

        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              value={trackInput}
              onChange={(e) => {
                setTrackInput(e.target.value);
                setTrackError('');
              }}
              placeholder={t('help.trackPlaceholder')}
              error={trackError}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Search}
            className="sm:w-32"
          >
            {t('help.trackBtn')}
          </Button>
        </form>
      </Card>

      {/* 3. How-to Guides */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <FileQuestion className="w-5 h-5 text-[#1D4ED8]" />
          <h3 className="text-lg font-bold text-slate-900">
            {t('help.guidesTitle')}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuides.map((guide) => (
            <GuideCard
              key={guide.id}
              title={guide.title}
              steps={guide.steps}
              icon={guide.icon}
            />
          ))}
        </div>
      </div>

      {/* 4. FAQs Accordion */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <HelpCircle className="w-5 h-5 text-[#1D4ED8]" />
          <h3 className="text-lg font-bold text-slate-900">
            {t('help.faqsTitle')}
          </h3>
        </div>

        <div className="space-y-2.5">
          {filteredFaqs.map((faq, idx) => (
            <FaqItem key={idx} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>

      {/* 5. Emergency Contacts */}
      <div className="space-y-3">
        <div className="px-1 space-y-0.5">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-[#DC2626]" />
            <span>{t('help.emergencyTitle')}</span>
          </h3>
          <p className="text-xs text-slate-500">
            {t('help.emergencySubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {EMERGENCY_CONTACTS.map((contact) => (
            <EmergencyCard key={contact.id} contact={contact} />
          ))}
        </div>
      </div>

      {/* 6. Local Civic Department Contacts */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Building2 className="w-5 h-5 text-[#1D4ED8]" />
          <h3 className="text-lg font-bold text-slate-900">
            {t('help.departmentsTitle')}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="p-4 space-y-2 border-slate-200">
              <h4 className="font-bold text-slate-900 text-base">{dept.name}</h4>
              <p className="text-xs text-slate-500">{dept.area}</p>
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-700">
                <a
                  href={`tel:${dept.contactPhone}`}
                  className="flex items-center gap-2 hover:text-[#1D4ED8] font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  <span>{dept.contactPhone}</span>
                </a>
                <a
                  href={`mailto:${dept.contactEmail}`}
                  className="flex items-center gap-2 hover:text-[#1D4ED8] truncate font-medium"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{dept.contactEmail}</span>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 7. Contact Us Form */}
      <Card className="p-5 sm:p-7 border-slate-200 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Send className="w-5 h-5 text-[#1D4ED8]" />
          <h3 className="text-lg font-bold text-slate-900">
            {t('help.contactFormTitle')}
          </h3>
        </div>

        <form onSubmit={handleContactSubmit} className="space-y-3">
          <Input
            label={t('help.contactSubject')}
            placeholder="e.g. Feedback on recent ward road repair..."
            value={contactSubject}
            onChange={(e) => setContactSubject(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              {t('help.contactMessage')} <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Write your message here..."
              required
              className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Send}
            loading={submittingContact}
          >
            {t('help.contactSubmit')}
          </Button>
        </form>
      </Card>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        featureName="Direct Support Ticket Dispatch"
      />
    </div>
  );
};
