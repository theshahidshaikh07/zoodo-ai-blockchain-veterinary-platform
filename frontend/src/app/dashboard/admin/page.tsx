'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import {
  ShieldCheck,
  Users,
  Building2,
  PawPrint,
  Calendar,
  Key,
  Database,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Trash2,
  Download,
  AlertTriangle,
  FileText,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  LogOut,
  Sparkles,
  Award,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'verifications' | 'users' | 'pets' | 'appointments' | 'otps' | 'danger'>('verifications');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [bizFilter, setBizFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  // Danger Zone Confirmation Modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  // Success / Alert message
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 5000);
  };

  const fetchOverview = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await apiService.getAdminOverview();
      if (res.success && res.data) {
        setOverviewData(res.data);
      } else {
        showAlert('error', res.message || 'Failed to fetch admin overview');
      }
    } catch (err: any) {
      showAlert('error', err?.message || 'Error connecting to admin API');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    // Check if user is admin
    const storedUser = localStorage.getItem('user');
    let userRole = user?.userType;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.userType) userRole = parsed.userType;
      } catch {}
    }

    if (userRole && userRole !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchOverview();
  }, [user, router]);

  // One-Click Business Verification (Award Green Tick)
  const handleVerifyBusiness = async (businessId: string, status: 'verified' | 'rejected') => {
    setActionLoading(businessId);
    try {
      const res = await apiService.verifyBusiness({
        businessId,
        status,
        notes: status === 'verified' ? 'Approved by Super Admin' : 'Documents require re-upload',
      });
      if (res.success) {
        showAlert('success', status === 'verified' 
          ? 'Business verified! Granted official Green Tick badge. 🎉' 
          : 'Business marked as rejected.');
        await fetchOverview();
      } else {
        showAlert('error', res.message || 'Failed to update verification status');
      }
    } catch (err: any) {
      showAlert('error', err?.message || 'Error verifying business');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${email}" and all their associated data?`)) {
      return;
    }
    setActionLoading(userId);
    try {
      const res = await apiService.deleteAdminUser(userId);
      if (res.success) {
        showAlert('success', `User ${email} deleted successfully.`);
        await fetchOverview();
      } else {
        showAlert('error', res.message || 'Could not delete user');
      }
    } catch (err: any) {
      showAlert('error', err?.message || 'Error deleting user');
    } finally {
      setActionLoading(null);
    }
  };

  // Reset Database
  const handleResetDatabase = async () => {
    if (resetConfirmText !== 'RESET') {
      showAlert('error', 'Please type RESET in capital letters to confirm.');
      return;
    }
    setResetStatus('Resetting database...');
    try {
      const res = await apiService.adminClearDatabase();
      if (res.success) {
        showAlert('success', 'Database cleared successfully! Super Admin account preserved.');
        setShowResetModal(false);
        setResetConfirmText('');
        await fetchOverview();
      } else {
        showAlert('error', res.message || 'Failed to reset database');
      }
    } catch (err: any) {
      showAlert('error', err?.message || 'Error resetting database');
    } finally {
      setResetStatus(null);
    }
  };

  // Export DB as JSON file
  const handleExportDB = () => {
    if (!overviewData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(overviewData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `zoodo_db_snapshot_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg font-medium text-slate-300">Loading Super Admin Command Center...</p>
      </div>
    );
  }

  const counts = overviewData?.counts || {};
  const users = overviewData?.users || [];
  const businesses = overviewData?.businesses || [];
  const pets = overviewData?.pets || [];
  const appointments = overviewData?.appointments || [];
  const otps = overviewData?.otps || [];

  // Filtered Users
  const filteredUsers = users.filter((u: any) => {
    const matchSearch =
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = userRoleFilter === 'all' || u.userType === userRoleFilter;
    return matchSearch && matchRole;
  });

  // Filtered Businesses
  const filteredBusinesses = businesses.filter((b: any) => {
    if (bizFilter === 'all') return true;
    if (bizFilter === 'pending') return b.verificationStatus === 'pending' || b.verificationStatus === 'under_review';
    return b.verificationStatus === bizFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Admin Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">Zoodo Command Center</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Cloud DB
                </span>
              </div>
              <p className="text-xs text-slate-400">Master Administration & Business License Verifications</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchOverview(true)}
              disabled={refreshing}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Sync DB
            </button>
            <button
              onClick={handleExportDB}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
            <div className="h-6 w-px bg-slate-800 mx-1" />
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs font-medium text-rose-400 transition-colors flex items-center gap-1.5 border border-rose-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Floating Alert Toast */}
      {alertMsg && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-sm shadow-xl transition-all ${
              alertMsg.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {alertMsg.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span className="font-medium">{alertMsg.text}</span>
            </div>
            <button onClick={() => setAlertMsg(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white">{counts.totalUsers || 0}</div>
            <span className="text-[11px] text-slate-500 mt-1">Platform accounts</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Businesses</span>
              <Building2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{counts.totalBusinesses || 0}</div>
            <span className="text-[11px] text-slate-500 mt-1">Provider accounts</span>
          </div>

          <div className="bg-slate-900/60 border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-transparent rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Verified ✓</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">{counts.verifiedBusinesses || 0}</div>
            <span className="text-[11px] text-emerald-500/70 mt-1">Official green tick</span>
          </div>

          <div className="bg-slate-900/60 border border-amber-500/20 bg-gradient-to-b from-amber-950/20 to-transparent rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">{counts.pendingBusinesses || 0}</div>
            <span className="text-[11px] text-amber-500/70 mt-1">Action required</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Pets</span>
              <PawPrint className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-bold text-white">{counts.totalPets || 0}</div>
            <span className="text-[11px] text-slate-500 mt-1">Pets onboarded</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Appointments</span>
              <Calendar className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white">{counts.totalAppointments || 0}</div>
            <span className="text-[11px] text-slate-500 mt-1">Booked sessions</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'verifications'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            Business Verifications & Licenses
            {counts.pendingBusinesses > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === 'verifications' ? 'bg-slate-950 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {counts.pendingBusinesses}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Complete Users DB ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('pets')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pets'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <PawPrint className="w-4 h-4" />
            Registered Pets ({pets.length})
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Appointments ({appointments.length})
          </button>

          <button
            onClick={() => setActiveTab('otps')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'otps'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Key className="w-4 h-4" />
            Security & OTP Audits ({otps.length})
          </button>

          <button
            onClick={() => setActiveTab('danger')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'danger'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/20'
            }`}
          >
            <Database className="w-4 h-4" />
            Database Controls
          </button>
        </div>

        {/* TAB 1: BUSINESS VERIFICATION & LICENSES */}
        {activeTab === 'verifications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  Provider License Verification Portal
                </h2>
                <p className="text-sm text-slate-400">
                  Review submitted business licenses, shop certificates, and clinic proofs. Approved providers receive the official Green Tick badge across Zoodo.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
                <button
                  onClick={() => setBizFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    bizFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({businesses.length})
                </button>
                <button
                  onClick={() => setBizFilter('pending')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    bizFilter === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Pending ({counts.pendingBusinesses || 0})
                </button>
                <button
                  onClick={() => setBizFilter('verified')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    bizFilter === 'verified' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Verified ✓ ({counts.verifiedBusinesses || 0})
                </button>
              </div>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center">
                <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-300">No businesses found</h3>
                <p className="text-xs text-slate-500 mt-1">No businesses match the selected filter criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredBusinesses.map((biz: any) => {
                  const isVerified = biz.verificationStatus === 'verified';
                  const isPending = biz.verificationStatus === 'pending' || biz.verificationStatus === 'under_review';

                  return (
                    <div
                      key={biz.id}
                      className={`bg-slate-900/80 border rounded-2xl p-6 transition-all shadow-xl ${
                        isVerified
                          ? 'border-emerald-500/40 shadow-emerald-950/20'
                          : isPending
                          ? 'border-amber-500/30 shadow-amber-950/20'
                          : 'border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-white">{biz.businessName}</h3>
                            {isVerified ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/10">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                Verified Business ✓
                              </span>
                            ) : isPending ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/40">
                                <Clock className="w-4 h-4" />
                                Pending Review
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/40">
                                <XCircle className="w-4 h-4" />
                                Rejected
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {biz.categories && biz.categories.map((cat: string) => (
                              <span
                                key={cat}
                                className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 capitalize"
                              >
                                {cat.replace('_', ' ')}
                              </span>
                            ))}
                            <span className="text-xs text-slate-500 ml-2">
                              Joined {biz.createdAt ? new Date(biz.createdAt).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                        </div>

                        {/* Verification Action Buttons */}
                        <div className="flex items-center gap-3 shrink-0">
                          {isVerified ? (
                            <button
                              disabled={actionLoading === biz.id}
                              onClick={() => handleVerifyBusiness(biz.id, 'rejected')}
                              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all flex items-center gap-1.5"
                            >
                              <XCircle className="w-4 h-4" />
                              Revoke Verification
                            </button>
                          ) : (
                            <>
                              <button
                                disabled={actionLoading === biz.id}
                                onClick={() => handleVerifyBusiness(biz.id, 'rejected')}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-all flex items-center gap-1.5"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                              <button
                                disabled={actionLoading === biz.id}
                                onClick={() => handleVerifyBusiness(biz.id, 'verified')}
                                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                              >
                                <Award className="w-4 h-4" />
                                Approve & Grant Green Tick ✓
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Business Details & Documents Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-xs text-slate-400">
                        <div className="space-y-1">
                          <span className="text-slate-500 font-medium">Owner Details</span>
                          <div className="text-slate-200 font-semibold">{biz.ownerName}</div>
                          <div className="text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            {biz.ownerEmail}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-500 font-medium">Contact & Location</span>
                          <div className="text-slate-200 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {biz.phone || 'Not provided'}
                          </div>
                          <div className="text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {biz.city || 'City'}, {biz.state || ''} ({biz.pincode || 'No Pin'})
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-500 font-medium">Tax & Legal Registration</span>
                          <div className="text-slate-200">GST: {biz.gst || 'Not entered'}</div>
                          <div className="text-slate-400">PAN: {biz.pan || 'Not entered'}</div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-500 font-medium">License / Documents Status</span>
                          <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                            {biz.documents?.length || 0} Documents Uploaded
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {isVerified ? 'All documents verified' : 'Requires admin inspection'}
                          </span>
                        </div>
                      </div>

                      {/* Attached Documents Preview */}
                      {biz.documents && biz.documents.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-slate-800/80">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                            Attached Verification Documents
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {biz.documents.map((doc: any) => (
                              <div
                                key={doc.id}
                                className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between"
                              >
                                <div className="space-y-0.5">
                                  <div className="text-xs font-medium text-slate-200 truncate max-w-[180px]">
                                    {doc.docName || doc.docType}
                                  </div>
                                  <div className="text-[10px] text-slate-500 capitalize">{doc.category} Certificate</div>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  doc.status === 'verified'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                }`}>
                                  {doc.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPLETE USERS DATABASE */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  Complete Users Master Database
                </h2>
                <p className="text-sm text-slate-400">
                  Direct inspection of every single user account and credentials record in the database.
                </p>
              </div>

              {/* Search & Role Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, email, handle..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-64"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Roles</option>
                  <option value="pet_owner">Pet Owners</option>
                  <option value="business">Businesses</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">User</th>
                      <th className="px-4 py-3.5">Email</th>
                      <th className="px-4 py-3.5">Handle</th>
                      <th className="px-4 py-3.5">Role</th>
                      <th className="px-4 py-3.5">Verified</th>
                      <th className="px-4 py-3.5">Auth Mode</th>
                      <th className="px-4 py-3.5">Joined At</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((u: any) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-white flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase">
                            {u.firstName ? u.firstName[0] : 'U'}
                          </div>
                          <div>
                            <div>{u.firstName} {u.lastName}</div>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {u.id.slice(0, 8)}...</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{u.email}</td>
                        <td className="px-4 py-3.5 font-mono text-emerald-400">@{u.username}</td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            u.userType === 'admin'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : u.userType === 'business'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          }`}>
                            {u.userType}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {u.isVerified ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <Clock className="w-3.5 h-3.5" /> No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-slate-400">
                          {u.googleId ? (
                            <span className="text-slate-300">Google OAuth</span>
                          ) : (
                            <span className="text-slate-400">Password / OTP</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">
                          {u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {u.userType !== 'admin' && (
                            <button
                              disabled={actionLoading === u.id}
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors border border-rose-500/20"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ALL REGISTERED PETS */}
        {activeTab === 'pets' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-pink-400" />
                All Registered Pets Database
              </h2>
              <p className="text-sm text-slate-400">
                Inspection of all pets enrolled across all pet parent accounts.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Pet</th>
                    <th className="px-4 py-3.5">Species / Breed</th>
                    <th className="px-4 py-3.5">Gender</th>
                    <th className="px-4 py-3.5">Age & Weight</th>
                    <th className="px-4 py-3.5">Sterilized</th>
                    <th className="px-4 py-3.5">Owner Details</th>
                    <th className="px-4 py-3.5">Onboarded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                        No pets registered in the database yet.
                      </td>
                    </tr>
                  ) : (
                    pets.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                            🐾
                          </div>
                          {p.name}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="text-slate-200 font-medium">{p.species}</div>
                          <div className="text-slate-500 text-[11px]">{p.breed || 'Mixed'}</div>
                        </td>
                        <td className="px-4 py-3.5 capitalize text-slate-300">{p.gender}</td>
                        <td className="px-4 py-3.5 text-slate-300">
                          {p.age ? `${p.age} ${p.ageUnit}` : 'N/A'} • {p.weight ? `${p.weight} ${p.weightUnit}` : 'N/A'}
                        </td>
                        <td className="px-4 py-3.5">
                          {p.sterilized ? (
                            <span className="text-emerald-400 font-medium">Yes ✓</span>
                          ) : (
                            <span className="text-slate-500">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="text-slate-200 font-medium">{p.ownerName}</div>
                          <div className="text-slate-500 text-[11px]">{p.ownerEmail}</div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-400">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recent'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ALL APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                All Platform Appointments
              </h2>
              <p className="text-sm text-slate-400">
                Overview of bookings across veterinary clinics, groomers, and trainers.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Appointment Date</th>
                    <th className="px-4 py-3.5">Service Type</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Notes</th>
                    <th className="px-4 py-3.5">Owner ID</th>
                    <th className="px-4 py-3.5">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        No appointments booked in the database yet.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((a: any) => (
                      <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-white">{a.appointmentDate}</td>
                        <td className="px-4 py-3.5 capitalize text-cyan-400 font-semibold">{a.type}</td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-400">{a.notes || 'No notes'}</td>
                        <td className="px-4 py-3.5 font-mono text-slate-500">{a.ownerId.slice(0, 8)}...</td>
                        <td className="px-4 py-3.5 text-slate-400">
                          {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY & OTP AUDITS */}
        {activeTab === 'otps' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                Security Verification & OTP Audit Log
              </h2>
              <p className="text-sm text-slate-400">
                Log of 6-digit verification codes sent, expiration windows, and completion status.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Recipient Email</th>
                    <th className="px-4 py-3.5">6-Digit OTP</th>
                    <th className="px-4 py-3.5">Purpose</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Expires At</th>
                    <th className="px-4 py-3.5">Sent At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {otps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        No OTP verification logs available.
                      </td>
                    </tr>
                  ) : (
                    otps.map((o: any) => (
                      <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3.5 text-white font-medium">{o.email}</td>
                        <td className="px-4 py-3.5 font-mono text-base font-bold text-amber-400 tracking-wider">
                          {o.otpCode}
                        </td>
                        <td className="px-4 py-3.5 capitalize text-slate-400">{o.purpose}</td>
                        <td className="px-4 py-3.5">
                          {o.isUsed ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              Used ✓
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              Pending / Active
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-slate-400">
                          {o.expiresAt ? new Date(o.expiresAt).toLocaleTimeString() : 'N/A'}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">
                          {o.createdAt ? new Date(o.createdAt).toLocaleString() : 'Recent'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: DATABASE DANGER ZONE */}
        {activeTab === 'danger' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
                Database Control Center & Safety Tools
              </h2>
              <p className="text-sm text-slate-400">
                Administrative database export and emergency reset utilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Download className="w-6 h-6 text-sky-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">Export Database Snapshot</h3>
                    <p className="text-xs text-slate-400">Download all database tables formatted in structured JSON.</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Exports current live records including users, business profiles, pets, appointments, and verification status.
                </p>
                <button
                  onClick={handleExportDB}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Full JSON Backup
                </button>
              </div>

              <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                  <div>
                    <h3 className="text-base font-bold text-rose-400">Clear & Reset Test Database</h3>
                    <p className="text-xs text-slate-400">Wipe test users, businesses, and pets to start fresh.</p>
                  </div>
                </div>
                <p className="text-xs text-rose-300/70">
                  ⚠️ This action deletes all test users, business profiles, pets, and appointments. The Super Admin account (<span className="font-mono text-white">admin</span>) will be automatically preserved.
                </p>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Reset Database Now
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Safety Confirmation Modal for Database Reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">Confirm Database Reset</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You are about to wipe all registered users, businesses, pets, and appointments from the live database.
              Your Super Admin account will remain safe.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">
                Type <span className="text-rose-400 font-mono font-bold">RESET</span> to confirm:
              </label>
              <input
                type="text"
                value={resetConfirmText}
                onChange={(e) => setResetConfirmText(e.target.value)}
                placeholder="RESET"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetConfirmText('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={resetConfirmText !== 'RESET' || Boolean(resetStatus)}
                onClick={handleResetDatabase}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
              >
                {resetStatus ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
