// src/components/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaSignOutAlt, 
  FaBook, FaCalendarAlt, FaComments, FaCog, FaCreditCard, FaLock, 
  FaCheckCircle, FaSpinner, FaClock, FaUsers, 
  FaTimesCircle, FaCoins, FaSearch, FaUserShield, FaSyncAlt
} from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateUser } = useAuth();
  
  // States
  const [activeTab, setActiveTab] = useState(currentUser?.role === 'admin' ? 'pending' : 'resources');
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // stores userId of user being approved/rejected
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Payment Form States
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentForm, setPaymentForm] = useState({
    cardHolder: currentUser?.fullName || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    // JazzCash fields
    jazzcashAccount: '',
    jazzcashMobile: '',
    jazzcashTransactionId: '',
    // Bank transfer fields
    bankAccountNumber: '',
    bankAccountHolder: '',
    bankName: '',
    referenceNumber: ''
  });
  const [paymentError, setPaymentError] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const getProfileImage = (userObj = currentUser) => {
    if (!userObj || !userObj.profilePicture) return null;
    if (userObj.profilePicture.startsWith('data:')) {
      return userObj.profilePicture;
    }
    return `/uploads/${userObj.profilePicture}`;
  };

  // Compute membership fee details
  const getFeeInfo = (category = currentUser?.membershipCategory, country = currentUser?.country) => {
    if (category === 'student') {
      return country === 'Pakistan' 
        ? { amount: '500', currency: 'PKR', display: '500 PKR' }
        : { amount: '25', currency: 'USD', display: '25 USD' };
    } else {
      return country === 'Pakistan' 
        ? { amount: '1000', currency: 'PKR', display: '1000 PKR' }
        : { amount: '50', currency: 'USD', display: '50 USD' };
    }
  };

  const feeInfo = getFeeInfo();

  // Load all users (Admin only)
  const fetchAllUsers = useCallback(async () => {
    if (currentUser?.role !== 'admin') return;
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchAllUsers();
    }
  }, [currentUser, fetchAllUsers]);

  // Refresh User Status (Member only)
  const handleRefreshStatus = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/protected', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const updatedUser = await res.json();
        // Update context & localstorage
        updateUser(updatedUser);
      }
    } catch (err) {
      console.error("Error refreshing status:", err);
    } finally {
      setTimeout(() => setRefreshing(false), 800);
    }
  };

  // Submit payment
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');
    
    // Validation based on payment method
    if (paymentMethod === 'card') {
      const { cardNumber, cardHolder, expiryDate, cvv } = paymentForm;
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        setPaymentError('All card fields are required.');
        return;
      }
      if (cardNumber.replace(/\s+/g, '').length < 16) {
        setPaymentError('Invalid Card Number.');
        return;
      }
    } else if (paymentMethod === 'jazzcash') {
      const { jazzcashAccount, jazzcashMobile, jazzcashTransactionId } = paymentForm;
      if (!jazzcashAccount || !jazzcashMobile || !jazzcashTransactionId) {
        setPaymentError('All JazzCash fields are required.');
        return;
      }
    } else if (paymentMethod === 'bank_transfer') {
      const { bankAccountNumber, bankAccountHolder, bankName, referenceNumber } = paymentForm;
      if (!bankAccountNumber || !bankAccountHolder || !bankName || !referenceNumber) {
        setPaymentError('All bank transfer fields are required.');
        return;
      }
    }

    setPaymentSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/pay-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentMethod,
          ...paymentForm,
          amount: feeInfo.amount,
          currency: feeInfo.currency
        })
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        const cleanText = text.trim();
        if (cleanText.startsWith("<")) {
          throw new Error(`Server returned HTML error page (Status ${res.status}). This usually means a backend crash or configuration issue.`);
        } else {
          throw new Error(cleanText || `Server error (Status ${res.status})`);
        }
      }

      if (res.ok) {
        setPaymentSuccess(true);
        setTimeout(() => {
          updateUser(data.user);
          setPaymentSubmitting(false);
          setPaymentSuccess(false);
        }, 1500);
      } else {
        setPaymentError(data.error || 'Payment failed.');
        setPaymentSubmitting(false);
      }
    } catch (err) {
      setPaymentError('Payment error: ' + err.message);
      setPaymentSubmitting(false);
    }
  };

  // Admin approves payment
  const handleApprovePayment = async (userId) => {
    setActionLoading(userId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/approve-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        // update local list
        setUsersList(prev => prev.map(u => u._id === userId ? { ...u, paymentStatus: 'approved' } : u));
      }
    } catch (err) {
      console.error("Approve error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Admin rejects/revokes payment
  const handleRejectPayment = async (userId) => {
    setActionLoading(userId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/reject-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        // update local list
        setUsersList(prev => prev.map(u => u._id === userId ? { ...u, paymentStatus: 'unpaid', paymentDetails: undefined } : u));
      }
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    setPaymentForm(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setPaymentForm(prev => ({ ...prev, expiryDate: formatted.slice(0, 5) }));
  };

  const handleNumericChange = (e, key, maxLength) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    setPaymentForm(prev => ({ ...prev, [key]: value }));
  };

  // Admin stats calculation
  const getAdminStats = () => {
    const total = usersList.length;
    const pending = usersList.filter(u => u.paymentStatus === 'pending_approval').length;
    const approved = usersList.filter(u => u.paymentStatus === 'approved').length;
    
    // Revenue summation
    let usdRev = 0;
    let pkrRev = 0;
    usersList.forEach(u => {
      if (u.paymentStatus === 'approved') {
        const uFee = getFeeInfo(u.membershipCategory, u.country);
        if (uFee.currency === 'USD') usdRev += parseFloat(uFee.amount);
        else if (uFee.currency === 'PKR') pkrRev += parseFloat(uFee.amount);
      }
    });

    return { total, pending, approved, usdRev, pkrRev };
  };

  const stats = getAdminStats();

  // Filtered users for admin tabs
  const getFilteredUsers = () => {
    return usersList.filter(user => {
      const matchSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      if (activeTab === 'pending') return user.paymentStatus === 'pending_approval';
      if (activeTab === 'approved') return user.paymentStatus === 'approved';
      return true; // for 'all' tab
    });
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-950 via-gray-900 to-crimson/30 py-6 px-6 border-b border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-crimson opacity-10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10 gap-4">
          <div className="text-center md:text-left flex items-center gap-3">
            {currentUser?.role === 'admin' && (
              <div className="bg-amber-500 text-gray-950 p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
                <FaUserShield className="text-2xl" />
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
                Welcome back, <span className="text-amber-500">{currentUser?.fullName?.split(' ')[0] || ''}</span>
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {currentUser?.role === 'admin' 
                  ? 'PPS Administrative Management Control Center' 
                  : 'Access your Poultry Professionals Society member workspace'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {currentUser?.role === 'member' && currentUser?.paymentStatus === 'pending_approval' && (
              <button
                onClick={handleRefreshStatus}
                disabled={refreshing}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium py-2 px-4 rounded-lg border border-white/10 transition active:scale-95 text-sm"
              >
                <FaSyncAlt className={`text-xs ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Syncing...' : 'Refresh Status'}
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-crimson hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg transition transform duration-150 active:scale-95 shadow-md shadow-crimson/20 text-sm"
            >
              <FaSignOutAlt className="text-xs" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1 w-full flex flex-col justify-start">
        
        {/* ============================================================== */}
        {/* CASE 1: USER IS ADMIN                                          */}
        {/* ============================================================== */}
        {currentUser?.role === 'admin' && (
          <div className="space-y-8 flex-1 flex flex-col">
            
            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl flex items-center justify-between hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Total Members</p>
                  <h3 className="text-3xl font-extrabold text-white mt-1">{loadingUsers ? '...' : stats.total}</h3>
                </div>
                <div className="bg-blue-500/10 text-blue-400 p-4 rounded-xl border border-blue-500/20">
                  <FaUsers className="text-2xl" />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl flex items-center justify-between hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                {stats.pending > 0 && (
                  <div className="absolute top-0 right-0 bg-crimson text-white text-[9px] px-2 py-0.5 font-extrabold rounded-bl-lg animate-pulse uppercase tracking-wider">
                    Action required
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Pending Approvals</p>
                  <h3 className="text-3xl font-extrabold text-white mt-1">{loadingUsers ? '...' : stats.pending}</h3>
                </div>
                <div className={`p-4 rounded-xl border ${stats.pending > 0 ? 'bg-crimson/10 text-crimson border-crimson/20 animate-pulse' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                  <FaClock className="text-2xl" />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl flex items-center justify-between hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Approved Members</p>
                  <h3 className="text-3xl font-extrabold text-white mt-1">{loadingUsers ? '...' : stats.approved}</h3>
                </div>
                <div className="bg-green-500/10 text-green-400 p-4 rounded-xl border border-green-500/20">
                  <FaCheckCircle className="text-2xl" />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl flex items-center justify-between hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Total Revenue</p>
                  <div className="mt-1 flex flex-col">
                    <span className="text-xl font-bold text-emerald-400">{stats.usdRev} USD</span>
                    <span className="text-xs font-medium text-gray-300">{stats.pkrRev.toLocaleString()} PKR</span>
                  </div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-xl border border-emerald-500/20">
                  <FaCoins className="text-2xl" />
                </div>
              </div>

            </div>

            {/* Admin Table Section */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 flex-1 flex flex-col">
              
              {/* Controls bar */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
                
                {/* Tabs */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 self-start">
                  <button 
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 ${activeTab === 'pending' ? 'bg-crimson text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    Pending Approvals
                    {stats.pending > 0 && (
                      <span className="bg-white text-crimson text-xs font-black px-2 py-0.5 rounded-full">
                        {stats.pending}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => setActiveTab('approved')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'approved' ? 'bg-crimson text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    Approved Members
                  </button>
                  <button 
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'all' ? 'bg-crimson text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    All Registrations
                  </button>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                    <FaSearch className="text-sm" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all text-sm"
                  />
                </div>

              </div>

              {/* Table / List View */}
              <div className="flex-1 overflow-x-auto">
                {loadingUsers ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
                    <FaSpinner className="text-4xl animate-spin text-crimson" />
                    <p className="font-semibold text-sm">Fetching membership records...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3">
                    <div className="bg-white/5 p-4 rounded-full text-gray-600 border border-white/5">
                      {activeTab === 'pending' ? <FaCheckCircle className="text-4xl text-green-500/50" /> : <FaSearch className="text-4xl" />}
                    </div>
                    <h4 className="font-bold text-lg text-white">No registrations found</h4>
                    <p className="text-sm text-gray-500">
                      {activeTab === 'pending' 
                        ? 'All registered members have paid and been approved.' 
                        : 'No records matching the filter criteria.'}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="py-4 px-4">Member Info</th>
                        <th className="py-4 px-4">Country & Contact</th>
                        <th className="py-4 px-4">Affiliation</th>
                        <th className="py-4 px-4">Fee Summary</th>
                        <th className="py-4 px-4">Payment Details</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      <AnimatePresence>
                        {filteredUsers.map((user) => {
                          const userFee = getFeeInfo(user.membershipCategory, user.country);
                          const profileImage = getProfileImage(user);
                          return (
                            <motion.tr 
                              key={user._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="hover:bg-white/5 transition-colors group"
                            >
                              {/* Avatar and Name */}
                              <td className="py-4 px-4 flex items-center gap-3">
                                {profileImage ? (
                                  <img 
                                    src={profileImage} 
                                    alt={user.fullName} 
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
                                  />
                                ) : (
                                  <div className="bg-gray-800 text-gray-400 rounded-full w-10 h-10 flex items-center justify-center border border-white/10 text-xs font-bold font-mono">
                                    {user.fullName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-bold text-white leading-tight">{user.fullName}</h4>
                                  <span className="text-xs bg-white/10 text-gray-300 border border-white/5 px-2 py-0.5 rounded font-mono uppercase mt-1 inline-block">
                                    {user.membershipCategory}
                                  </span>
                                </div>
                              </td>

                              {/* Country and Phone */}
                              <td className="py-4 px-4">
                                <p className="text-white flex items-center gap-1">
                                  <FaMapMarkerAlt className="text-gray-500 text-xs" />
                                  {user.city}, {user.country}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                              </td>

                              {/* Position & Organization */}
                              <td className="py-4 px-4">
                                <p className="text-white leading-tight font-semibold">{user.position || 'N/A'}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{user.organization || 'N/A'}</p>
                              </td>

                              {/* Fee Info */}
                              <td className="py-4 px-4">
                                <p className="text-white font-mono font-bold">{userFee.display}</p>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                                  user.paymentStatus === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                  user.paymentStatus === 'pending_approval' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                                  'bg-red-500/20 text-red-300 border border-red-500/30'
                                }`}>
                                  {user.paymentStatus === 'pending_approval' ? 'Pending Approval' : user.paymentStatus}
                                </span>
                              </td>

                              {/* Card detail logs */}
                              <td className="py-4 px-4">
                                {user.paymentDetails ? (
                                  <div className="text-xs space-y-1">
                                    <p className="text-gray-300 font-semibold capitalize flex items-center gap-1.5">
                                      {user.paymentDetails.paymentMethod === 'jazzcash' ? (
                                        <>
                                          <FaCoins className="text-amber-500 text-xs" />
                                          JazzCash
                                        </>
                                      ) : user.paymentDetails.paymentMethod === 'bank_transfer' ? (
                                        <>
                                          <FaBuilding className="text-blue-500 text-xs" />
                                          Bank Transfer
                                        </>
                                      ) : (
                                        <>
                                          <FaCreditCard className="text-gray-500 text-xs" />
                                          Card
                                        </>
                                      )}
                                    </p>
                                    {user.paymentDetails.paymentMethod === 'jazzcash' ? (
                                      <>
                                        <p className="text-gray-400">Account: <span className="text-white">{user.paymentDetails.jazzcashAccount}</span></p>
                                        <p className="text-gray-400">Mobile: <span className="text-white">{user.paymentDetails.jazzcashMobile}</span></p>
                                        <p className="text-gray-400">TID: <span className="text-white font-mono">{user.paymentDetails.jazzcashTransactionId}</span></p>
                                      </>
                                    ) : user.paymentDetails.paymentMethod === 'bank_transfer' ? (
                                      <>
                                        <p className="text-gray-400">Bank: <span className="text-white">{user.paymentDetails.bankName}</span></p>
                                        <p className="text-gray-400">Account: <span className="text-white font-mono">{user.paymentDetails.bankAccountNumber}</span></p>
                                        <p className="text-gray-400">Holder: <span className="text-white">{user.paymentDetails.bankAccountHolder}</span></p>
                                        <p className="text-gray-400">Ref: <span className="text-white font-mono">{user.paymentDetails.referenceNumber}</span></p>
                                      </>
                                    ) : (
                                      <>
                                        <p className="text-gray-300 font-mono flex items-center gap-1.5">
                                          <FaCreditCard className="text-gray-500 text-xs" />
                                          {user.paymentDetails.cardNumber}
                                        </p>
                                        <p className="text-gray-400">Holder: <span className="text-white">{user.paymentDetails.cardHolder}</span></p>
                                      </>
                                    )}
                                    <p className="text-[10px] text-gray-500">
                                      Paid: {new Date(user.paymentDetails.paidAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-gray-600 italic text-xs">No records available</span>
                                )}
                              </td>

                              {/* Admin Actions */}
                              <td className="py-4 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  {user.paymentStatus === 'pending_approval' && (
                                    <>
                                      <button
                                        onClick={() => handleApprovePayment(user._id)}
                                        disabled={actionLoading !== null}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition-all duration-150 flex items-center gap-1 active:scale-95 shadow-md shadow-emerald-700/20 disabled:opacity-50"
                                      >
                                        {actionLoading === user._id ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleRejectPayment(user._id)}
                                        disabled={actionLoading !== null}
                                        className="bg-crimson hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition-all duration-150 flex items-center gap-1 active:scale-95 shadow-md shadow-crimson/20 disabled:opacity-50"
                                      >
                                        {actionLoading === user._id ? <FaSpinner className="animate-spin" /> : <FaTimesCircle />}
                                        Reject
                                      </button>
                                    </>
                                  )}

                                  {user.paymentStatus === 'approved' && (
                                    <button
                                      onClick={() => handleRejectPayment(user._id)}
                                      disabled={actionLoading !== null}
                                      className="border border-red-500/30 hover:bg-red-500/10 text-red-400 font-semibold py-1.5 px-3 rounded-lg text-xs transition-all duration-150 flex items-center gap-1 active:scale-95 disabled:opacity-50"
                                    >
                                      {actionLoading === user._id ? <FaSpinner className="animate-spin" /> : <FaTimesCircle />}
                                      Revoke Access
                                    </button>
                                  )}

                                  {user.paymentStatus === 'unpaid' && (
                                    <span className="text-gray-500 italic text-xs py-1">Awaiting checkout</span>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 2: MEMBER IS UNPAID (Payment Form view)                   */}
        {/* ============================================================== */}
        {currentUser?.role === 'member' && currentUser?.paymentStatus === 'unpaid' && (
          <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-4">
            
            {/* Billing Summary Column */}
            <div className="lg:col-span-5 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl text-left space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white pb-3 border-b border-white/10 flex items-center gap-2">
                  <FaUser className="text-crimson text-sm" />
                  Membership Summary
                </h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Subscriber:</span>
                    <span className="text-white font-bold">{currentUser.fullName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white uppercase font-semibold">{currentUser.membershipCategory}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Country:</span>
                    <span className="text-white">{currentUser.country}</span>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="bg-crimson/10 border border-crimson/20 p-4 rounded-xl space-y-2">
                <span className="text-xs text-red-200 uppercase font-semibold tracking-wider">Total Membership Fee</span>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-3xl font-extrabold text-white font-mono">{feeInfo.display}</h3>
                  <span className="text-xs text-gray-300 italic">One-time payment</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
                  Secure activation. Access to scientific journals, conferences and standard society tools will be enabled immediately after payment verification.
                </p>
              </div>

              {/* Security info */}
              <div className="flex items-center gap-3 text-xs text-gray-400 pt-2">
                <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                  <FaLock className="text-amber-500 text-sm" />
                </div>
                <p>Payment information is masked. Mock bank simulator checks applied successfully.</p>
              </div>
            </div>

            {/* Payment Input Form Column */}
            <div className="lg:col-span-7 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaCreditCard className="text-crimson" />
                Pay Membership Fee
              </h2>

              {paymentError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm animate-shake">
                  {paymentError}
                </div>
              )}

              {/* Mock Rotating Visual Card Container */}
              <div className="mb-8 relative w-full h-40 bg-gradient-to-tr from-rose-900 to-amber-900 rounded-xl p-5 shadow-2xl border border-white/20 text-left overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">Poultry Professionals Society</span>
                    <p className="text-[10px] text-white/50 uppercase mt-0.5">Member Secure ID Card</p>
                  </div>
                  <div className="bg-white/15 px-3 py-1 rounded border border-white/10 text-xs font-black text-white font-mono">
                    VISA
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-lg text-white font-mono tracking-widest text-center py-1">
                    {paymentForm.cardNumber || '•••• •••• •••• ••••'}
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <p className="text-[8px] text-white/40 uppercase">Card Holder</p>
                      <p className="text-white font-bold tracking-wider font-mono truncate max-w-[200px]">
                        {paymentForm.cardHolder.toUpperCase() || 'MEMBER NAME'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] text-white/40 uppercase text-right">Expires</p>
                      <p className="text-white font-bold tracking-wider font-mono">{paymentForm.expiryDate || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handlePaymentSubmit} className="space-y-5 text-left">
                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-lg border transition-all text-sm font-semibold ${
                        paymentMethod === 'card'
                          ? 'bg-crimson border-crimson text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <FaCreditCard className="mb-1" />
                      Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('jazzcash')}
                      className={`p-3 rounded-lg border transition-all text-sm font-semibold ${
                        paymentMethod === 'jazzcash'
                          ? 'bg-crimson border-crimson text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <FaCoins className="mb-1" />
                      JazzCash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-3 rounded-lg border transition-all text-sm font-semibold ${
                        paymentMethod === 'bank_transfer'
                          ? 'bg-crimson border-crimson text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <FaBuilding className="mb-1" />
                      Bank Transfer
                    </button>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.cardHolder}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, cardHolder: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all text-sm"
                        placeholder="John Doe"
                      />
                    </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                      <FaCreditCard className="text-sm" />
                    </span>
                    <input
                      type="text"
                      required
                      value={paymentForm.cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 placeholder-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all text-sm font-mono tracking-wider"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentForm.expiryDate}
                      onChange={handleExpiryChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all text-sm font-mono"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      CVV Code
                    </label>
                    <input
                      type="password"
                      required
                      value={paymentForm.cvv}
                      onChange={(e) => handleNumericChange(e, 'cvv', 3)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all text-sm font-mono"
                      placeholder="•••"
                    />
                  </div>
                </div>
                  </>
                )}

                {paymentMethod === 'jazzcash' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        JazzCash Account Number
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.jazzcashAccount}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, jazzcashAccount: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all text-sm"
                        placeholder="03XX-XXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.jazzcashMobile}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, jazzcashMobile: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all text-sm"
                        placeholder="03XX-XXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.jazzcashTransactionId}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, jazzcashTransactionId: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all text-sm"
                        placeholder="TID from JazzCash app"
                      />
                    </div>
                  </>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.bankAccountNumber}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, bankAccountNumber: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all text-sm"
                        placeholder="Your account number"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.bankAccountHolder}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, bankAccountHolder: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all text-sm"
                        placeholder="Account holder name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.bankName}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, bankName: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all text-sm"
                        placeholder="Bank name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Reference Number
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.referenceNumber}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, referenceNumber: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all text-sm"
                        placeholder="Transaction reference"
                      />
                    </div>
                  </>
                )}

                {/* Submitting state loader */}
                <button
                  type="submit"
                  disabled={paymentSubmitting}
                  className="w-full mt-6 bg-crimson hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition duration-300 transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-crimson/35 disabled:opacity-50"
                >
                  {paymentSubmitting ? (
                    paymentSuccess ? (
                      <>
                        <FaCheckCircle className="text-lg animate-bounce" />
                        Secure Checkout Confirmed!
                      </>
                    ) : (
                      <>
                        <FaSpinner className="animate-spin text-lg" />
                        Validating Transactions...
                      </>
                    )
                  ) : (
                    <>
                      <FaLock className="text-xs" />
                      Submit Verification Payment
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 3: MEMBER IS PENDING APPROVAL (Timeline Tracker)         */}
        {/* ============================================================== */}
        {currentUser?.role === 'member' && currentUser?.paymentStatus === 'pending_approval' && (
          <div className="max-w-2xl mx-auto w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-8 my-8 text-center">
            
            {/* Visual Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center justify-center text-4xl animate-pulse shadow-lg shadow-amber-500/10">
                <FaClock className="animate-spin-slow" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-white">Payment Received!</h2>
              <h3 className="text-lg font-bold text-amber-500">Awaiting Admin Verification</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-lg mx-auto">
                Thank you! Your payment verification file has been uploaded to the society servers. The administrator is currently reviewing the bank receipt logs to approve your profile access.
              </p>
            </div>

            {/* Stepper Timeline Visualizer */}
            <div className="relative py-4 px-6 border border-white/5 bg-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 hidden sm:block"></div>
              
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center space-y-2 bg-gray-950 sm:px-4 py-2">
                <div className="w-9 h-9 rounded-full bg-green-600 text-white border border-green-500/50 flex items-center justify-center">
                  <FaCheckCircle className="text-sm" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-extrabold text-white">Account Created</p>
                  <p className="text-[10px] text-gray-500 font-mono">Step 1</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center space-y-2 bg-gray-950 sm:px-4 py-2">
                <div className="w-9 h-9 rounded-full bg-green-600 text-white border border-green-500/50 flex items-center justify-center">
                  <FaCheckCircle className="text-sm" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-extrabold text-white">Payment Uploaded</p>
                  <p className="text-[10px] text-gray-500 font-mono">{feeInfo.display}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center space-y-2 bg-gray-950 sm:px-4 py-2">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center justify-center animate-pulse">
                  <FaSpinner className="animate-spin text-sm" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-extrabold text-amber-400">Admin Approval</p>
                  <p className="text-[10px] text-gray-500 font-mono">Verification pending</p>
                </div>
              </div>
            </div>

            {/* Mock payment information card summary */}
            {currentUser.paymentDetails && (
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-left space-y-2 max-w-md mx-auto">
                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-white/5 pb-2">Verification Receipt</p>
                <div className="grid grid-cols-2 text-xs gap-y-1 mt-2 font-mono">
                  <span className="text-gray-500">Method:</span>
                  <span className="text-white text-right">{currentUser.paymentDetails.cardNumber}</span>
                  <span className="text-gray-500">Account:</span>
                  <span className="text-white text-right truncate">{currentUser.paymentDetails.cardHolder}</span>
                  <span className="text-gray-500">Amount:</span>
                  <span className="text-white text-right">{feeInfo.display}</span>
                  <span className="text-gray-500">Timestamp:</span>
                  <span className="text-white text-right">{new Date(currentUser.paymentDetails.paidAt).toLocaleTimeString()}</span>
                </div>
              </div>
            )}

            {/* Sync Control */}
            <div className="space-y-4 pt-2">
              <button
                onClick={handleRefreshStatus}
                disabled={refreshing}
                className="w-full max-w-xs mx-auto bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 px-4 rounded-xl border border-white/10 transition active:scale-95 flex items-center justify-center gap-2 text-sm"
              >
                <FaSyncAlt className={`text-xs ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Verify Approval Status'}
              </button>
              <p className="text-[11px] text-gray-500">
                You can press "Verify Approval Status" to check if the Admin has approved your payment.
              </p>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 4: MEMBER IS APPROVED (Standard Full Dashboard)          */}
        {/* ============================================================== */}
        {currentUser?.role === 'member' && currentUser?.paymentStatus === 'approved' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            
            {/* Left Profile Sidebar Card */}
            <div className="lg:col-span-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col items-center">
              <h2 className="text-lg font-bold text-white mb-6 w-full pb-3 border-b border-white/10 flex items-center gap-2">
                <FaUser className="text-crimson text-sm" />
                Member Profile
              </h2>

              <div className="flex flex-col items-center mb-6 w-full">
                {getProfileImage() ? (
                  <img 
                    src={getProfileImage()} 
                    alt="Profile" 
                    className="w-28 h-28 rounded-full object-cover border-4 border-crimson shadow-lg mb-4"
                  />
                ) : (
                  <div className="bg-gray-800 border border-white/10 rounded-full w-28 h-28 mb-4 flex items-center justify-center text-gray-400">
                    <FaUser className="text-3xl" />
                  </div>
                )}
                <h3 className="text-lg font-bold text-white text-center">
                  {currentUser.fullName}
                </h3>
                <span className="mt-2 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Verified Member
                </span>
              </div>

              <div className="w-full space-y-3.5 text-xs text-gray-300 text-left">
                <div className="flex items-center gap-3 py-1.5 border-b border-white/5">
                  <FaEnvelope className="text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase">Email Address</p>
                    <p className="text-white truncate max-w-[200px]">{currentUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-1.5 border-b border-white/5">
                  <FaBriefcase className="text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase">Position</p>
                    <p className="text-white">{currentUser.position || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-1.5 border-b border-white/5">
                  <FaBuilding className="text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase">Organization</p>
                    <p className="text-white">{currentUser.organization || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-1.5">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase">Location</p>
                    <p className="text-white">{currentUser.city}, {currentUser.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Dashboard Workspace Grid */}
            <div className="lg:col-span-8 space-y-6 text-left">
              
              {/* Welcome Card */}
              <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
                <h2 className="text-xl font-bold text-white mb-3">Society Member Panel</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Welcome to the digital Poultry Professionals Society member workspace. As a fully verified and paid member, your credentials have been approved by the administrators. You now have unrestricted access to academic publications, professional forums, and upcoming events.
                </p>
              </div>

              {/* Resource grid cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-xl shadow-md hover:bg-white/10 hover:border-white/15 transition-all duration-300 cursor-pointer group flex gap-4 items-start">
                  <div className="bg-crimson/10 text-crimson p-3 rounded-lg group-hover:bg-crimson/25 transition">
                    <FaBook className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-white mb-1">Scientific Journals</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">Access peer-reviewed articles, case studies, and research publications.</p>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-xl shadow-md hover:bg-white/10 hover:border-white/15 transition-all duration-300 cursor-pointer group flex gap-4 items-start">
                  <div className="bg-amber-500/10 text-amber-500 p-3 rounded-lg group-hover:bg-amber-500/25 transition">
                    <FaCalendarAlt className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-white mb-1">Symposia & Events</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">View calendars and secure student/professional registration for upcoming symposia.</p>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-xl shadow-md hover:bg-white/10 hover:border-white/15 transition-all duration-300 cursor-pointer group flex gap-4 items-start">
                  <div className="bg-green-500/10 text-green-500 p-3 rounded-lg group-hover:bg-green-500/25 transition">
                    <FaComments className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-white mb-1">Society Forums</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">Engage with industry leaders and exchange research ideas within global sub-boards.</p>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-xl shadow-md hover:bg-white/10 hover:border-white/15 transition-all duration-300 cursor-pointer group flex gap-4 items-start">
                  <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-lg group-hover:bg-indigo-500/25 transition">
                    <FaCog className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-white mb-1">Member Settings</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">Update your qualification records, download membership certificate pdfs, or manage security.</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;