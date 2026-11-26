import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Plus,
  CheckCircle,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { issueService } from '../../services/issueService';
import { apiClient } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { CATEGORIES } from '../../utils/constants';

export const Departments = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add department modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categories: ['pothole'],
    contactPhone: '',
    contactEmail: '',
    area: 'Greater Chennai Corporation',
  });

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await issueService.getDepartments();
      setDepartments(data);
    } catch (err) {
      setError(err.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleToggleCategory = (catId) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(catId);
      const updated = exists
        ? prev.categories.filter((c) => c !== catId)
        : [...prev.categories, catId];
      return { ...prev, categories: updated.length > 0 ? updated : [catId] };
    });
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contactPhone || !formData.contactEmail) {
      showToast('Please fill all required department fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (!issueService.USE_MOCK) {
        await apiClient.post('/admin/departments', formData);
      }
      setDepartments((prev) => [
        ...prev,
        {
          id: `dept_${Date.now()}`,
          _id: `dept_${Date.now()}`,
          ...formData,
        },
      ]);
      showToast('Department registered successfully', 'success');
      setShowAddModal(false);
      setFormData({
        name: '',
        categories: ['pothole'],
        contactPhone: '',
        contactEmail: '',
        area: 'Greater Chennai Corporation',
      });
    } catch (err) {
      showToast(err.message || 'Failed to register department', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading Municipal Operations Departments..." />;
  }

  if (error) {
    return <ErrorState onRetry={fetchDepartments} description={error} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150 pb-8">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
            CIVIC INFRASTRUCTURE
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {t('admin.departmentsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage municipal service divisions, contact desks and assigned problem categories
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={fetchDepartments}
            variant="outline"
            size="sm"
            icon={RefreshCw}
          >
            Refresh
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            variant="primary"
            size="md"
            icon={Plus}
          >
            Add Department
          </Button>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id || dept._id} className="p-5 space-y-4 border-slate-200 bg-white">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center font-bold flex-shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug truncate">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{dept.area}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Assigned Categories */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Responsible Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(dept.categories || []).map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-100"
                  >
                    {t(`categories.${cat}`, cat)}
                  </span>
                ))}
              </div>
            </div>

            {/* Contacts Footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-700">
              <a
                href={`tel:${dept.contactPhone}`}
                className="flex items-center gap-2 hover:text-[#1D4ED8] font-semibold"
              >
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{dept.contactPhone}</span>
              </a>
              <a
                href={`mailto:${dept.contactEmail}`}
                className="flex items-center gap-2 hover:text-[#1D4ED8] font-medium truncate"
              >
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="truncate">{dept.contactEmail}</span>
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Municipal Department"
      >
        <form onSubmit={handleAddDepartment} className="space-y-4">
          <Input
            label="Department Name"
            placeholder="e.g. Parks & Urban Greenery Board"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Assigned Categories
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = formData.categories.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleToggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t(`categories.${cat.id}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <Input
            label="Helpline Phone"
            placeholder="044-25384500"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            required
          />

          <Input
            label="Official Dispatch Email"
            type="email"
            placeholder="parks.gcc@chennaicorporation.gov.in"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            required
          />

          <Input
            label="Jurisdiction Area / Zones"
            placeholder="Greater Chennai Corporation (Zone 1-15)"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
            >
              Register Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
