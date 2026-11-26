import { apiClient } from './api';
import {
  SAMPLE_ISSUES,
  SAMPLE_DEPARTMENTS,
  SAMPLE_NOTIFICATIONS,
  SAMPLE_USERS
} from '../data/sampleData';
import { calculateDistanceKm } from '../utils/formatters';

// Set USE_MOCK to false to use the live backend API, with automatic fallback if server is unreachable
export let USE_MOCK = false;

// In-memory fallback state
let fallbackIssues = JSON.parse(JSON.stringify(SAMPLE_ISSUES));
let fallbackNotifications = JSON.parse(JSON.stringify(SAMPLE_NOTIFICATIONS));
let fallbackDepartments = JSON.parse(JSON.stringify(SAMPLE_DEPARTMENTS));

export const issueService = {
  setUseMock(val) {
    USE_MOCK = val;
  },

  async getIssues(filters = {}) {
    if (!USE_MOCK) {
      try {
        const queryParams = new URLSearchParams();
        if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
        if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
        if (filters.search) queryParams.append('search', filters.search);

        return await apiClient.get(`/admin/issues?${queryParams.toString()}`);
      } catch (err) {
        console.warn('Backend unavailable, using local data:', err.message);
      }
    }

    // Mock / fallback
    let list = [...fallbackIssues];
    if (filters.category && filters.category !== 'all') {
      list = list.filter((i) => i.category === filters.category);
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter((i) => i.status === filters.status);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.complaintId.toLowerCase().includes(s) ||
          i.description.toLowerCase().includes(s) ||
          i.address.toLowerCase().includes(s)
      );
    }
    return list;
  },

  async getMyReports(userId) {
    if (!USE_MOCK) {
      try {
        return await apiClient.get('/issues/mine');
      } catch (err) {
        console.warn('Backend unavailable, using local data:', err.message);
      }
    }
    return fallbackIssues.filter((i) => i.reporter?.id === userId || i.reporter?._id === userId || i.reporter?.email === userId);
  },

  async getConfirmedIssues(userId) {
    if (!USE_MOCK) {
      try {
        return await apiClient.get('/issues/confirmed');
      } catch (err) {
        console.warn('Backend unavailable, using local data:', err.message);
      }
    }
    return fallbackIssues.filter((i) => i.confirmedByUserIds?.includes(userId));
  },

  async getNearbyIssues(lat, lng, radiusKm = 10, category = 'all', status = 'all') {
    if (!USE_MOCK) {
      try {
        const params = new URLSearchParams({
          lat: String(lat),
          lng: String(lng),
          radius: String(radiusKm),
          category,
          status,
        });
        const data = await apiClient.get(`/issues/nearby?${params.toString()}`);
        return data.map((issue) => {
          const [iLng, iLat] = issue.location.coordinates;
          const distance = calculateDistanceKm(lat, lng, iLat, iLng);
          return { ...issue, distance };
        });
      } catch (err) {
        console.warn('Backend unavailable, calculating nearby locally:', err.message);
      }
    }

    return fallbackIssues
      .map((issue) => {
        const [iLng, iLat] = issue.location.coordinates;
        const distance = calculateDistanceKm(lat, lng, iLat, iLng);
        return { ...issue, distance };
      })
      .filter((issue) => {
        const matchRadius = issue.distance <= radiusKm;
        const matchCat = category === 'all' || issue.category === category;
        const matchStat =
          status === 'all' ||
          (status === 'open' && issue.status !== 'resolved' && issue.status !== 'rejected') ||
          (status === 'resolved' && issue.status === 'resolved') ||
          issue.status === status;
        return matchRadius && matchCat && matchStat;
      })
      .sort((a, b) => a.distance - b.distance);
  },

  async getIssueById(id) {
    if (!USE_MOCK) {
      try {
        return await apiClient.get(`/issues/${id}`);
      } catch (err) {
        console.warn('Backend unavailable, checking local data:', err.message);
      }
    }

    const issue = fallbackIssues.find(
      (i) => i.id?.toLowerCase() === id.toLowerCase() || i.complaintId?.toLowerCase() === id.toLowerCase() || i._id === id
    );
    if (!issue) throw new Error('Issue not found');
    return issue;
  },

  async createIssue(issueData, user) {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post('/issues', issueData);
        return res.issue || res;
      } catch (err) {
        console.warn('Backend unavailable, storing issue locally:', err.message);
      }
    }

    const currentYear = new Date().getFullYear();
    const randomSeq = String(Math.floor(100 + Math.random() * 900)).padStart(5, '0');
    const complaintId = `NMF-${currentYear}-${randomSeq}`;

    const newIssue = {
      id: complaintId,
      complaintId,
      reporter: user || SAMPLE_USERS[0],
      category: issueData.category,
      description: issueData.description,
      imageUrl: issueData.imageUrl || '',
      location: {
        type: 'Point',
        coordinates: [issueData.location.lng, issueData.location.lat],
      },
      address: issueData.address || 'Chennai, Tamil Nadu',
      status: 'reported',
      affectedCount: 1,
      confirmedByUserIds: [user?.id || user?._id || SAMPLE_USERS[0].id],
      department: null,
      duplicateOf: null,
      rejectionReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'reported',
          at: new Date().toISOString(),
          by: user?.name || 'Citizen',
          note: 'Complaint registered via NammaFix app',
        },
      ],
    };

    fallbackIssues.unshift(newIssue);
    return newIssue;
  },

  async confirmIssue(issueId, user) {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post(`/issues/${issueId}/confirm`);
        return res.issue || res;
      } catch (err) {
        console.warn('Backend unavailable, confirming locally:', err.message);
      }
    }

    const issue = fallbackIssues.find((i) => i.id === issueId || i.complaintId === issueId || i._id === issueId);
    if (!issue) throw new Error('Issue not found');
    const uid = user?.id || user?._id || 'usr_001';
    if (!issue.confirmedByUserIds) issue.confirmedByUserIds = [];
    if (!issue.confirmedByUserIds.includes(uid)) {
      issue.confirmedByUserIds.push(uid);
      issue.affectedCount = (issue.affectedCount || 0) + 1;
    }
    return issue;
  },

  async submitFeedback(issueId, isFixed, note, user) {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post(`/issues/${issueId}/feedback`, { isFixed, note });
        return res.issue || res;
      } catch (err) {
        console.warn('Backend unavailable, updating feedback locally:', err.message);
      }
    }

    const issue = fallbackIssues.find((i) => i.id === issueId || i.complaintId === issueId || i._id === issueId);
    if (!issue) throw new Error('Issue not found');
    if (!isFixed) {
      issue.status = 'reopened';
      issue.timeline.push({
        status: 'reopened',
        at: new Date().toISOString(),
        by: `${user?.name || 'Citizen'} (Feedback)`,
        note: note || 'Citizen reported issue is still not fixed on ground.',
      });
    }
    return issue;
  },

  async getSimilarIssues(lat, lng, category) {
    if (!USE_MOCK) {
      try {
        return await apiClient.get(`/issues/similar?lat=${lat}&lng=${lng}&category=${category}`);
      } catch (err) {
        console.warn('Backend unavailable, returning similar mock:', err.message);
      }
    }
    return fallbackIssues.filter((i) => i.category === category).slice(0, 2);
  },

  async getDepartments() {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/help/contacts');
        return res.departments || res;
      } catch (err) {
        console.warn('Backend unavailable, loading local departments:', err.message);
      }
    }
    return fallbackDepartments;
  },

  async getNotifications(userId) {
    if (!USE_MOCK) {
      try {
        return await apiClient.get('/notifications');
      } catch (err) {
        console.warn('Backend unavailable, loading local notifications:', err.message);
      }
    }
    return fallbackNotifications;
  },

  async markNotificationRead(notifId) {
    if (!USE_MOCK) {
      try {
        return await apiClient.patch(`/notifications/${notifId}/read`);
      } catch (err) {
        console.warn('Backend unavailable:', err.message);
      }
    }
    fallbackNotifications = fallbackNotifications.map((n) =>
      n.id === notifId ? { ...n, read: true } : n
    );
    return { success: true };
  },

  async markAllNotificationsRead() {
    if (!USE_MOCK) {
      try {
        return await apiClient.patch('/notifications/read-all');
      } catch (err) {
        console.warn('Backend unavailable:', err.message);
      }
    }
    fallbackNotifications = fallbackNotifications.map((n) => ({ ...n, read: true }));
    return { success: true };
  },

  async adminVerifyIssue(id, user) {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.patch(`/admin/issues/${id}/verify`);
        return res.issue || res;
      } catch (err) {
        console.warn('Backend unavailable, verifying locally:', err.message);
      }
    }

    const issue = fallbackIssues.find((i) => i.id === id || i.complaintId === id || i._id === id);
    if (!issue) throw new Error('Issue not found');
    issue.status = 'verified';
    issue.timeline.push({
      status: 'verified',
      at: new Date().toISOString(),
      by: user?.name || 'Municipal Officer',
      note: 'Issue verified on-site by field inspector',
    });
    return issue;
  },

  async adminRejectIssue(id, reason, user) {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.patch(`/admin/issues/${id}/reject`, { reason });
        return res.issue || res;
      } catch (err) {
        console.warn('Backend unavailable, rejecting locally:', err.message);
      }
    }

    const issue = fallbackIssues.find((i) => i.id === id || i.complaintId === id || i._id === id);
    if (!issue) throw new Error('Issue not found');
    issue.status = 'rejected';
    issue.rejectionReason = reason;
    issue.timeline.push({
      status: 'rejected',
      at: new Date().toISOString(),
      by: user?.name || 'Municipal Officer',
      note: `Rejected: ${reason}`,
    });
    return issue;
  },

  async adminAssignIssue(id, departmentId, user) {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.patch(`/admin/issues/${id}/assign`, { departmentId });
        return res.issue || res;
      } catch (err) {
        console.warn('Backend unavailable, assigning locally:', err.message);
      }
    }

    const issue = fallbackIssues.find((i) => i.id === id || i.complaintId === id || i._id === id);
    const dept = fallbackDepartments.find((d) => d.id === departmentId || d._id === departmentId);
    if (!issue) throw new Error('Issue not found');
    issue.status = 'assigned';
    issue.department = dept;
    issue.timeline.push({
      status: 'assigned',
      at: new Date().toISOString(),
      by: user?.name || 'Zonal Officer',
      note: `Assigned to ${dept?.name || 'Department'}`,
    });
    return issue;
  },

  async adminUpdateStatus(id, newStatus, note, user) {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.patch(`/admin/issues/${id}/status`, { status: newStatus, note });
        return res.issue || res;
      } catch (err) {
        console.warn('Backend unavailable, updating status locally:', err.message);
      }
    }

    const issue = fallbackIssues.find((i) => i.id === id || i.complaintId === id || i._id === id);
    if (!issue) throw new Error('Issue not found');
    issue.status = newStatus;
    issue.timeline.push({
      status: newStatus,
      at: new Date().toISOString(),
      by: user?.name || 'Field Officer',
      note: note || `Status updated to ${newStatus}`,
    });
    return issue;
  },

  async adminMergeIssue(id, masterId, user) {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post(`/admin/issues/${id}/merge`, { masterId });
        return res.issue || res;
      } catch (err) {
        console.warn('Backend unavailable, merging locally:', err.message);
      }
    }

    const issue = fallbackIssues.find((i) => i.id === id || i.complaintId === id || i._id === id);
    if (!issue) throw new Error('Issue not found');
    issue.duplicateOf = masterId;
    issue.timeline.push({
      status: issue.status,
      at: new Date().toISOString(),
      by: user?.name || 'Admin',
      note: `Merged duplicate into master ticket ${masterId}`,
    });
    return issue;
  },

  async getAdminStats() {
    if (!USE_MOCK) {
      try {
        return await apiClient.get('/admin/stats');
      } catch (err) {
        console.warn('Backend unavailable, calculating stats locally:', err.message);
      }
    }

    const total = fallbackIssues.length;
    const pending = fallbackIssues.filter((i) => i.status === 'reported' || i.status === 'verified').length;
    const inProgress = fallbackIssues.filter((i) => i.status === 'in_progress' || i.status === 'assigned').length;
    const resolved = fallbackIssues.filter((i) => i.status === 'resolved').length;
    const resolutionRate = Math.round((resolved / total) * 100);
    return { total, pending, inProgress, resolved, resolutionRate, avgFixDays: 3.2 };
  },

  async getAdminAnalytics() {
    if (!USE_MOCK) {
      try {
        return await apiClient.get('/admin/analytics');
      } catch (err) {
        console.warn('Backend unavailable, calculating analytics locally:', err.message);
      }
    }

    const categoryCounts = {};
    fallbackIssues.forEach((i) => {
      categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
    });
    const categoryData = Object.entries(categoryCounts).map(([cat, count]) => ({
      category: cat,
      count,
    }));
    const hotspots = [
      { area: 'T. Nagar (Ward 134)', count: 4, resolution: '75%' },
      { area: 'Adyar (Ward 173)', count: 3, resolution: '66%' },
      { area: 'Anna Nagar (Ward 102)', count: 3, resolution: '100%' },
      { area: 'Mylapore (Ward 122)', count: 2, resolution: '50%' },
      { area: 'Velachery (Ward 177)', count: 2, resolution: '0%' },
    ];
    return { categoryData, hotspots };
  },

  async submitHelpMessage(messageData) {
    if (!USE_MOCK) {
      try {
        return await apiClient.post('/help/messages', messageData);
      } catch (err) {
        console.warn('Backend unavailable:', err.message);
      }
    }
    return { success: true, message: 'Your message has been sent to our civic response team.' };
  },
};
