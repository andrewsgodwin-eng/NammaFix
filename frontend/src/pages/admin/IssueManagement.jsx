import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  SlidersHorizontal,
  CheckCircle,
  XCircle,
  Building,
  RefreshCw,
  GitMerge,
  MapPin,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { StatusTimeline } from '../../components/issues/StatusTimeline';
import { issueService } from '../../services/issueService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import { CATEGORIES, STATUS_LIST } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export const IssueManagement = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Admin Action Modal States
  const [activeModal, setActiveModal] = useState(null); // 'verify' | 'reject' | 'assign' | 'status' | 'merge'
  const [rejectReason, setRejectReason] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [newStatus, setNewStatus] = useState('in_progress');
  const [statusNote, setStatusNote] = useState('');
  const [mergeMasterId, setMergeMasterId] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [issueList, deptList] = await Promise.all([
        issueService.getIssues({
          category: filterCategory,
          status: filterStatus,
          search
        }),
        issueService.getDepartments()
      ]);
      setIssues(issueList);
      setDepartments(deptList);
      if (!selectedIssue && issueList.length > 0) {
        setSelectedIssue(issueList[0]);
      } else if (selectedIssue) {
        const refreshed = issueList.find((i) => i.id === selectedIssue.id);
        if (refreshed) setSelectedIssue(refreshed);
      }
    } catch (err) {
      setError(err.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterCategory, filterStatus, search]);

  const handleVerify = async () => {
    if (!selectedIssue) return;
    setProcessing(true);
    try {
      const updated = await issueService.adminVerifyIssue(selectedIssue.id, user);
      setSelectedIssue(updated);
      showToast('Issue successfully verified!', 'success');
      setActiveModal(null);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to verify', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedIssue || !rejectReason.trim()) {
      showToast('Please provide a reason for rejection', 'error');
      return;
    }
    setProcessing(true);
    try {
      const updated = await issueService.adminRejectIssue(selectedIssue.id, rejectReason, user);
      setSelectedIssue(updated);
      showToast('Issue marked as rejected', 'info');
      setActiveModal(null);
      setRejectReason('');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to reject', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedIssue || !selectedDeptId) {
      showToast('Please select a department', 'error');
      return;
    }
    setProcessing(true);
    try {
      const updated = await issueService.adminAssignIssue(selectedIssue.id, selectedDeptId, user);
      setSelectedIssue(updated);
      showToast('Assigned to department successfully', 'success');
      setActiveModal(null);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to assign', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedIssue) return;
    setProcessing(true);
    try {
      const updated = await issueService.adminUpdateStatus(selectedIssue.id, newStatus, statusNote, user);
      setSelectedIssue(updated);
      showToast(`Status updated to ${newStatus}`, 'success');
      setActiveModal(null);
      setStatusNote('');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleMerge = async () => {
    if (!selectedIssue || !mergeMasterId.trim()) {
      showToast('Please provide a master complaint ID', 'error');
      return;
    }
    setProcessing(true);
    try {
      const updated = await issueService.adminMergeIssue(selectedIssue.id, mergeMasterId, user);
      setSelectedIssue(updated);
      showToast(`Merged into master ticket ${mergeMasterId}`, 'success');
      setActiveModal(null);
      setMergeMasterId('');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to merge duplicates', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 bg-white">
      {/* Header & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A120E] leading-tight">
              {t('admin.issueManagementTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B4A2E] font-mono">
              Review, verify, assign, resolve and group citizen complaints
            </p>
          </div>
          <Button
            onClick={fetchData}
            variant="secondary"
            size="sm"
            icon={RefreshCw}
          >
            Refresh
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search by ID, keyword, address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full rounded-xl border border-[#E8E2D9] bg-white text-sm px-3.5 py-2.5 font-medium text-[#1A120E] focus:outline-none focus:border-[#A88462] min-h-[44px]"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {t(`categories.${c.id}`)}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded-xl border border-[#E8E2D9] bg-white text-sm px-3.5 py-2.5 font-medium text-[#1A120E] focus:outline-none focus:border-[#A88462] min-h-[44px]"
          >
            <option value="all">All Statuses</option>
            {STATUS_LIST.map((st) => (
              <option key={st} value={st}>
                {t(`status.${st}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Layout: Table (Left) + Detail & Action Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Complaint Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-2xs flex flex-col">
          <div className="p-4 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FBF9F6]">
            <span className="text-xs font-mono font-bold text-[#6B4A2E] uppercase">
              {issues.length} Issues In Pipeline
            </span>
          </div>

          <div className="overflow-x-auto flex-1 max-h-[680px] overflow-y-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FBF9F6] text-[#6B4A2E] font-mono border-b border-[#E8E2D9] sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Affected</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9] text-[#1A120E] font-medium">
                {issues.map((issue) => {
                  const isSelected = selectedIssue?.id === issue.id || selectedIssue?._id === issue._id;
                  return (
                    <tr
                      key={issue.id || issue._id}
                      onClick={() => setSelectedIssue(issue)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#F5EFEB] font-bold text-[#1A120E]' : 'hover:bg-[#FBF9F6]'
                      }`}
                    >
                      <td className="py-3 px-3 font-mono text-[#A88462] whitespace-nowrap font-bold">
                        {issue.complaintId || issue.displayId || issue._id?.slice(-6)}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap capitalize">
                        {t(`categories.${issue.category}`) || issue.category}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-xs">
                        👥 {issue.affectedCount || 1}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <Badge status={issue.status} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-[#8A7B6E] font-mono text-xs whitespace-nowrap">
                        {formatDate(issue.createdAt || Date.now())}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Selected Issue Inspection & Action Panel */}
        <div className="lg:col-span-5">
          {selectedIssue ? (
            <Card className="p-5 space-y-5 sticky top-20 bg-white border-[#E8E2D9]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#6B4A2E] uppercase tracking-wider">Selected Ticket</span>
                  <h3 className="text-xl font-black text-[#1A120E] font-mono">{selectedIssue.complaintId || selectedIssue._id?.slice(-6)}</h3>
                </div>
                <Badge status={selectedIssue.status} size="md" />
              </div>

              {/* Photo & Map Preview */}
              {selectedIssue.imageUrl && (
                <div className="rounded-xl overflow-hidden h-44 bg-[#FBF9F6] border border-[#E8E2D9]">
                  <img
                    src={selectedIssue.imageUrl}
                    alt="Inspection Photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2 text-xs sm:text-sm">
                <p className="text-[#1A120E] font-medium bg-[#FBF9F6] p-3 rounded-xl border border-[#E8E2D9]">
                  {selectedIssue.description}
                </p>

                <div className="p-3 rounded-xl bg-[#FBF9F6] border border-[#E8E2D9] flex items-start gap-2 text-xs">
                  <MapPin className="w-4 h-4 text-[#A88462] flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-[#1A120E]">{selectedIssue.address}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6B4A2E] px-1 font-mono">
                  <span>Dept: <strong className="text-[#1A120E]">{selectedIssue.department?.name || 'Unassigned'}</strong></span>
                  <span>Impact: <strong className="text-[#1A120E]">{selectedIssue.affectedCount || 1} Citizens</strong></span>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Admin Actions
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => setActiveModal('verify')}
                    variant="primary"
                    size="sm"
                    icon={CheckCircle}
                  >
                    {t('admin.verifyBtn')}
                  </Button>

                  <Button
                    onClick={() => setActiveModal('reject')}
                    variant="danger"
                    size="sm"
                    icon={XCircle}
                  >
                    {t('admin.rejectBtn')}
                  </Button>

                  <Button
                    onClick={() => setActiveModal('assign')}
                    variant="outline"
                    size="sm"
                    icon={Building}
                  >
                    {t('admin.assignBtn')}
                  </Button>

                  <Button
                    onClick={() => setActiveModal('status')}
                    variant="secondary"
                    size="sm"
                    icon={RefreshCw}
                  >
                    {t('admin.updateStatusBtn')}
                  </Button>
                </div>

                <Button
                  onClick={() => setActiveModal('merge')}
                  variant="ghost"
                  size="sm"
                  fullWidth
                  icon={GitMerge}
                >
                  {t('admin.mergeDuplicateBtn')}
                </Button>
              </div>

              {/* Timeline */}
              <div className="pt-2 border-t border-slate-100 max-h-48 overflow-y-auto">
                <p className="text-xs font-bold text-slate-500 mb-2">Audit History</p>
                <StatusTimeline timeline={selectedIssue.timeline || []} />
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-slate-500">
              Select a complaint from the table to view details and take action.
            </Card>
          )}
        </div>
      </div>

      {/* Verify Modal */}
      <Modal
        isOpen={activeModal === 'verify'}
        onClose={() => setActiveModal(null)}
        title="Verify Complaint"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Confirm that field inspection has verified this issue ({selectedIssue?.complaintId}) as a genuine public civic hazard.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" loading={processing} onClick={handleVerify}>Confirm Verification</Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={activeModal === 'reject'}
        onClose={() => setActiveModal(null)}
        title="Reject Complaint"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#D5C4AE]/80">
            Please enter a formal reason for rejecting this complaint. This reason will be visible to the reporting citizen.
          </p>
          <textarea
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={t('admin.reasonPlaceholder')}
            className="w-full p-3 rounded-xl border border-[#3A2418] bg-[#1A120E] text-[#D5C4AE] placeholder:text-[#A88462]/50 text-sm focus:outline-none focus:border-rose-500"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="danger" loading={processing} onClick={handleReject}>Reject Ticket</Button>
          </div>
        </div>
      </Modal>

      {/* Assign Modal */}
      <Modal
        isOpen={activeModal === 'assign'}
        onClose={() => setActiveModal(null)}
        title="Assign Department"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#D5C4AE]/80">
            Choose the municipal department or agency responsible for executing repairs.
          </p>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#3A2418] bg-[#1A120E] text-[#D5C4AE] text-sm focus:outline-none focus:border-[#A88462]"
          >
            <option value="">{t('admin.selectDeptPlaceholder')}</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name} ({dept.area})</option>
            ))}
          </select>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" loading={processing} onClick={handleAssign}>Assign Department</Button>
          </div>
        </div>
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={activeModal === 'status'}
        onClose={() => setActiveModal(null)}
        title="Update Resolution Status"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-[#A88462] block mb-1">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#3A2418] bg-[#1A120E] text-[#D5C4AE] text-sm focus:outline-none focus:border-[#A88462]"
            >
              {STATUS_LIST.map((st) => (
                <option key={st} value={st}>{t(`status.${st}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono text-[#A88462] block mb-1">Field Update Note</label>
            <textarea
              rows={2}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder={t('admin.statusNotePlaceholder')}
              className="w-full p-3 rounded-xl border border-[#3A2418] bg-[#1A120E] text-[#D5C4AE] placeholder:text-[#A88462]/50 text-sm focus:outline-none focus:border-[#A88462]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" loading={processing} onClick={handleUpdateStatus}>Update Status</Button>
          </div>
        </div>
      </Modal>

      {/* Merge Duplicate Modal */}
      <Modal
        isOpen={activeModal === 'merge'}
        onClose={() => setActiveModal(null)}
        title="Merge Duplicate Complaints"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Link this complaint ({selectedIssue?.complaintId}) as a duplicate to an existing Master Complaint ID. Affected citizen counts will automatically combine.
          </p>
          <Input
            placeholder={t('admin.mergeTargetPlaceholder')}
            value={mergeMasterId}
            onChange={(e) => setMergeMasterId(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" loading={processing} onClick={handleMerge}>Confirm Merge</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
