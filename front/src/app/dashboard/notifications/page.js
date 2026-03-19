'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Bell, Check, X, Clock, ArrowRight, CheckCircle2,
  AlertCircle, MessageCircle, Coins, MapPin, Star,
  Eye, ChevronRight, Filter, Inbox, UserCheck, Play,
  ThumbsUp, Loader2,
} from 'lucide-react';


const statusConfig = {
  pending: { label: 'Pending', color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: Clock },
  accepted: { label: 'Accepted', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: CheckCircle2 },
  in_progress: { label: 'In Progress', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: Play },
  completed: { label: 'Completed', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', icon: CheckCircle2 },
  declined: { label: 'Declined', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: X },
  refused: { label: 'Declined', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: X },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: X },
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  // Fetch real notifications from API
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const token = localStorage.getItem('takaful_token');
        if (!token) return;

        // Fetch both notifications and transactions for the provider
        const [notifRes, txRes] = await Promise.all([
          fetch('/api/notifications', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/transactions', { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);
        const notifData = await notifRes.json();
        const txData = await txRes.json();

        // Mark all notifications as read when viewing this page
        await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        // Build notification items from ALL transactions (both provider and requester)
        const txNotifs = (txData.transactions || [])
          .map(t => ({
            id: t.id,
            type: t.status === 'completed' ? 'service_completed' : 'service_request',
            role: t.isRequester ? 'requester' : 'provider',
            serviceId: t.service?.id || t.service,
            serviceTitle: t.service?.title || 'Service',
            requesterName: t.requester?.name || 'Unknown',
            requesterPhone: t.requester?.phone || '',
            providerName: t.provider?.name || 'Unknown',
            requesterMessage: t.message || 'No message provided.',
            points: t.points || 0,
            location: '',
            time: new Date(t.createdAt).toLocaleDateString(),
            status: t.status === 'refused' ? 'declined' : t.status,
            urgent: false,
            requesterConfirmed: !!t.requesterConfirmed,
            providerConfirmed: !!t.providerConfirmed,
          }));

        setNotifications(txNotifs);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [user]);

  const filters = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'pending', label: 'Pending', count: notifications.filter(n => n.status === 'pending').length },
    { id: 'accepted', label: 'Accepted', count: notifications.filter(n => n.status === 'accepted').length },
    { id: 'in_progress', label: 'In Progress', count: notifications.filter(n => n.status === 'in_progress').length },
    { id: 'completed', label: 'Completed', count: notifications.filter(n => n.status === 'completed').length },
  ];

  const filteredNotifications = activeFilter === 'all'
    ? notifications
    : notifications.filter(n => n.status === activeFilter);

  const handleAccept = async (id) => {
    const token = localStorage.getItem('takaful_token');
    try {
      const res = await fetch(`/api/transactions/${id}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'accept' }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'accepted' } : n));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to accept');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleDecline = async (id) => {
    const token = localStorage.getItem('takaful_token');
    try {
      const res = await fetch(`/api/transactions/${id}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'refuse' }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'declined' } : n));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to decline');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleStartService = async (id) => {
    // No separate start endpoint — stays as accepted until marked complete
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'in_progress' } : n));
  };

  const handleMarkCompleted = async (id) => {
    const token = localStorage.getItem('takaful_token');
    try {
      const res = await fetch(`/api/transactions/${id}/complete`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        if (data.status === 'completed') {
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'completed', providerConfirmed: true, requesterConfirmed: true } : n));
        } else {
          // One side confirmed — update flags from server response
          setNotifications(prev => prev.map(n => n.id === id ? {
            ...n,
            providerConfirmed: !!data.providerConfirmed,
            requesterConfirmed: !!data.requesterConfirmed,
          } : n));
        }
      } else {
        alert(data.error || 'Failed to confirm');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div style={{ paddingTop: '96px', paddingBottom: '80px', minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'linear-gradient(to right, #059669, #10b981)' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>Notifications</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: '0 0 4px' }}>
              Service <span style={{ color: '#059669' }}>Requests</span>
            </h1>
            <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
              Manage your service requests and updates
            </p>
          </div>
          <Link href="/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 18px', borderRadius: '12px', border: '1px solid #e5e7eb',
            background: 'white', color: '#374151', fontSize: '14px', fontWeight: '600',
            textDecoration: 'none',
          }}>
            ← Dashboard
          </Link>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
          {[
            { label: 'Pending', value: notifications.filter(n => n.status === 'pending').length, color: '#d97706', bg: '#fffbeb', icon: '⏳' },
            { label: 'Accepted', value: notifications.filter(n => n.status === 'accepted').length, color: '#2563eb', bg: '#eff6ff', icon: '✅' },
            { label: 'In Progress', value: notifications.filter(n => n.status === 'in_progress').length, color: '#7c3aed', bg: '#f5f3ff', icon: '🔄' },
            { label: 'Completed', value: notifications.filter(n => n.status === 'completed').length, color: '#059669', bg: '#ecfdf5', icon: '🎉' },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'white', borderRadius: '16px', padding: '18px',
              border: '1px solid #f3f4f6', textAlign: 'center',
            }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '6px' }}>{s.icon}</span>
              <p style={{ fontSize: '28px', fontWeight: '800', color: s.color, margin: '0 0 2px' }}>{s.value}</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex', gap: '4px', background: 'white', borderRadius: '14px',
          padding: '4px', border: '1px solid #f3f4f6', marginBottom: '24px', overflowX: 'auto',
        }}>
          {filters.map((f) => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '10px', fontSize: '13px',
              fontWeight: activeFilter === f.id ? 600 : 500, border: 'none',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              background: activeFilter === f.id ? '#ecfdf5' : 'transparent',
              color: activeFilter === f.id ? '#059669' : '#9ca3af',
            }}>
              {f.label}
              <span style={{
                fontSize: '11px', fontWeight: '700', padding: '2px 8px',
                borderRadius: '999px',
                background: activeFilter === f.id ? '#d1fae5' : '#f3f4f6',
                color: activeFilter === f.id ? '#059669' : '#9ca3af',
              }}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '20px', border: '1px solid #e5e7eb' }}>
              <Loader2 style={{ width: '40px', height: '40px', color: '#059669', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Loading notifications...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px', background: 'white',
              borderRadius: '20px', border: '1px solid #e5e7eb',
            }}>
              <Inbox style={{ width: '48px', height: '48px', color: '#d1d5db', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>No notifications</h3>
              <p style={{ fontSize: '14px', color: '#9ca3af' }}>No {activeFilter !== 'all' ? activeFilter : ''} requests right now</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const config = statusConfig[notif.status];
              const StatusIcon = config.icon;
              const isExpanded = expandedId === notif.id;

              return (
                <div key={notif.id} style={{
                  background: 'white', borderRadius: '20px',
                  border: `1.5px solid ${notif.status === 'pending' && notif.urgent ? '#fecaca' : '#e5e7eb'}`,
                  overflow: 'hidden', transition: 'all 0.2s',
                  boxShadow: notif.status === 'pending' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                }}>
                  {/* Notification Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : notif.id)}
                    style={{
                      padding: '20px 24px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '16px',
                    }}
                  >
                    {/* Status Dot */}
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      background: config.bg, border: `1.5px solid ${config.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <StatusIcon style={{ width: '22px', height: '22px', color: config.color }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: 0 }}>
                          {notif.type === 'service_completed'
                            ? 'Service Completed'
                            : notif.role === 'requester'
                              ? 'Your Request'
                              : 'New Service Request'}
                        </h3>
                        {notif.role === 'requester' && (
                          <span style={{
                            fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                            borderRadius: '6px', background: '#eff6ff', color: '#2563eb',
                            border: '1px solid #bfdbfe',
                          }}>
                            You requested
                          </span>
                        )}
                        {notif.role === 'provider' && (
                          <span style={{
                            fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                            borderRadius: '6px', background: '#fdf4ff', color: '#9333ea',
                            border: '1px solid #e9d5ff',
                          }}>
                            You provide
                          </span>
                        )}
                        {notif.urgent && notif.status === 'pending' && (
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: '3px',
                            fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                            borderRadius: '6px', background: '#fef2f2', color: '#dc2626',
                          }}>
                            <AlertCircle style={{ width: '12px', height: '12px' }} /> Urgent
                          </span>
                        )}
                        <span style={{
                          fontSize: '11px', fontWeight: '600', padding: '3px 10px',
                          borderRadius: '6px', background: config.bg, color: config.color,
                          border: `1px solid ${config.border}`,
                        }}>
                          {config.label}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                        <strong>{notif.role === 'requester' ? notif.providerName : notif.requesterName}</strong> — {notif.serviceTitle}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        background: '#ecfdf5', color: '#059669', fontSize: '13px',
                        fontWeight: '700', padding: '6px 12px', borderRadius: '8px',
                      }}>
                        <Coins style={{ width: '14px', height: '14px' }} />
                        {notif.points} pts
                      </div>
                      <span style={{ fontSize: '12px', color: '#d1d5db' }}>{notif.time}</span>
                      <ChevronRight style={{
                        width: '18px', height: '18px', color: '#d1d5db',
                        transition: 'transform 0.2s',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      }} />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div style={{
                      padding: '0 24px 24px',
                      borderTop: '1px solid #f3f4f6',
                      marginTop: '-4px', paddingTop: '20px',
                    }}>
                      {/* ===== PROVIDER ROLE ===== */}
                      {notif.role === 'provider' && notif.type === 'service_request' && (
                        <>
                          {/* Requester Info */}
                          <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr',
                            gap: '16px', marginBottom: '20px',
                          }}>
                            <div style={{
                              background: '#f9fafb', borderRadius: '14px', padding: '16px',
                            }}>
                              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px', fontWeight: '600' }}>Requester</p>
                              <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                {notif.requesterName}
                              </p>
                              <p style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                📞 {notif.requesterPhone}
                              </p>
                              {notif.location && (
                                <p style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                  <MapPin style={{ width: '13px', height: '13px' }} /> {notif.location}
                                </p>
                              )}
                            </div>
                            <div style={{
                              background: '#f9fafb', borderRadius: '14px', padding: '16px',
                            }}>
                              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px', fontWeight: '600' }}>Service Details</p>
                              <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                {notif.serviceTitle}
                              </p>
                              <p style={{ fontSize: '13px', color: '#059669', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Coins style={{ width: '13px', height: '13px' }} /> You&apos;ll earn {notif.points} points
                              </p>
                            </div>
                          </div>

                          {/* Message */}
                          <div style={{
                            background: '#eff6ff', borderRadius: '14px', padding: '16px',
                            marginBottom: '20px', border: '1px solid #bfdbfe',
                          }}>
                            <p style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MessageCircle style={{ width: '13px', height: '13px' }} /> Message from requester
                            </p>
                            <p style={{ fontSize: '14px', color: '#1e3a5f', lineHeight: '1.6', margin: 0 }}>
                              &ldquo;{notif.requesterMessage}&rdquo;
                            </p>
                          </div>

                          {/* Provider Action Buttons */}
                          {notif.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAccept(notif.id); }}
                                style={{
                                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                  padding: '14px', borderRadius: '14px', border: 'none',
                                  background: 'linear-gradient(135deg, #059669, #10b981)',
                                  color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                                  boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                                }}
                              >
                                <Check style={{ width: '18px', height: '18px' }} />
                                Accept Request
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDecline(notif.id); }}
                                style={{
                                  flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                  padding: '14px 24px', borderRadius: '14px',
                                  border: '2px solid #fecaca', background: '#fef2f2',
                                  color: '#dc2626', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                                }}
                              >
                                <X style={{ width: '18px', height: '18px' }} />
                                Decline
                              </button>
                            </div>
                          )}

                          {notif.status === 'accepted' && (
                            <div style={{
                              display: 'flex', flexDirection: 'column', gap: '12px',
                            }}>
                              <div style={{
                                background: '#eff6ff', borderRadius: '14px', padding: '16px',
                                border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '10px',
                              }}>
                                <CheckCircle2 style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                                <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                                  You accepted this request. When the job is done, confirm below.
                                  {notif.requesterConfirmed && ' The requester has already confirmed!'}
                                </p>
                              </div>
                              {!notif.providerConfirmed ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleMarkCompleted(notif.id); }}
                                  style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    padding: '14px', borderRadius: '14px', border: 'none',
                                    background: 'linear-gradient(135deg, #059669, #10b981)',
                                    color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                                  }}
                                >
                                  <CheckCircle2 style={{ width: '18px', height: '18px' }} />
                                  Confirm Job is Done
                                </button>
                              ) : (
                                <div style={{
                                  background: '#fffbeb', borderRadius: '14px', padding: '16px',
                                  border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '10px',
                                }}>
                                  <Clock style={{ width: '20px', height: '20px', color: '#d97706' }} />
                                  <p style={{ fontSize: '14px', color: '#92400e', margin: 0, fontWeight: '600' }}>
                                    ✅ You confirmed — waiting for {notif.requesterName} to confirm too.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {notif.status === 'completed' && (
                            <div style={{
                              background: '#ecfdf5', borderRadius: '14px', padding: '16px',
                              border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '10px',
                            }}>
                              <CheckCircle2 style={{ width: '20px', height: '20px', color: '#059669' }} />
                              <div>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: '#047857', margin: '0 0 2px' }}>
                                  Service completed! 🎉
                                </p>
                                <p style={{ fontSize: '13px', color: '#059669', margin: 0 }}>
                                  {notif.points} points have been added to your balance.
                                </p>
                              </div>
                            </div>
                          )}

                          {notif.status === 'declined' && (
                            <div style={{
                              background: '#fef2f2', borderRadius: '14px', padding: '16px',
                              border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '10px',
                            }}>
                              <X style={{ width: '20px', height: '20px', color: '#dc2626' }} />
                              <p style={{ fontSize: '14px', color: '#991b1b', margin: 0 }}>
                                You declined this request. The requester has been notified.
                              </p>
                            </div>
                          )}
                        </>
                      )}

                      {/* ===== REQUESTER ROLE ===== */}
                      {notif.role === 'requester' && (
                        <>
                          {/* Service & Provider Info */}
                          <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr',
                            gap: '16px', marginBottom: '20px',
                          }}>
                            <div style={{
                              background: '#f9fafb', borderRadius: '14px', padding: '16px',
                            }}>
                              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px', fontWeight: '600' }}>Provider</p>
                              <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                {notif.providerName}
                              </p>
                            </div>
                            <div style={{
                              background: '#f9fafb', borderRadius: '14px', padding: '16px',
                            }}>
                              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px', fontWeight: '600' }}>Service</p>
                              <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                {notif.serviceTitle}
                              </p>
                              <p style={{ fontSize: '13px', color: '#d97706', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Coins style={{ width: '13px', height: '13px' }} /> Costs you {notif.points} points
                              </p>
                            </div>
                          </div>

                          {/* Your message */}
                          {notif.requesterMessage && notif.requesterMessage !== 'No message provided.' && (
                            <div style={{
                              background: '#f9fafb', borderRadius: '14px', padding: '16px',
                              marginBottom: '20px', border: '1px solid #e5e7eb',
                            }}>
                              <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MessageCircle style={{ width: '13px', height: '13px' }} /> Your message
                              </p>
                              <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                                &ldquo;{notif.requesterMessage}&rdquo;
                              </p>
                            </div>
                          )}

                          {/* Requester Status UI */}
                          {notif.status === 'pending' && (
                            <div style={{
                              background: '#fffbeb', borderRadius: '14px', padding: '16px',
                              border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '10px',
                            }}>
                              <Clock style={{ width: '20px', height: '20px', color: '#d97706' }} />
                              <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
                                ⏳ Waiting for <strong>{notif.providerName}</strong> to accept or decline your request...
                              </p>
                            </div>
                          )}

                          {notif.status === 'accepted' && (
                            <div style={{
                              display: 'flex', flexDirection: 'column', gap: '12px',
                            }}>
                              <div style={{
                                background: '#ecfdf5', borderRadius: '14px', padding: '16px',
                                border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '10px',
                              }}>
                                <CheckCircle2 style={{ width: '20px', height: '20px', color: '#059669' }} />
                                <p style={{ fontSize: '14px', color: '#047857', margin: 0 }}>
                                  🎉 <strong>{notif.providerName}</strong> accepted your request!
                                  {notif.providerConfirmed && ' The provider has already confirmed the job is done.'}
                                </p>
                              </div>
                              {!notif.requesterConfirmed ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleMarkCompleted(notif.id); }}
                                  style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    padding: '14px', borderRadius: '14px', border: 'none',
                                    background: 'linear-gradient(135deg, #059669, #10b981)',
                                    color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                                  }}
                                >
                                  <CheckCircle2 style={{ width: '18px', height: '18px' }} />
                                  Confirm Job is Done
                                </button>
                              ) : (
                                <div style={{
                                  background: '#fffbeb', borderRadius: '14px', padding: '16px',
                                  border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '10px',
                                }}>
                                  <Clock style={{ width: '20px', height: '20px', color: '#d97706' }} />
                                  <p style={{ fontSize: '14px', color: '#92400e', margin: 0, fontWeight: '600' }}>
                                    ✅ You confirmed — waiting for {notif.providerName} to confirm too.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {notif.status === 'completed' && (
                            <div style={{
                              background: '#ecfdf5', borderRadius: '14px', padding: '16px',
                              border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '10px',
                            }}>
                              <CheckCircle2 style={{ width: '20px', height: '20px', color: '#059669' }} />
                              <div>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: '#047857', margin: '0 0 2px' }}>
                                  Service completed! 🎉
                                </p>
                                <p style={{ fontSize: '13px', color: '#059669', margin: 0 }}>
                                  {notif.points} points have been deducted from your balance and sent to {notif.providerName}.
                                </p>
                              </div>
                            </div>
                          )}

                          {notif.status === 'declined' && (
                            <div style={{
                              background: '#fef2f2', borderRadius: '14px', padding: '16px',
                              border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '10px',
                            }}>
                              <X style={{ width: '20px', height: '20px', color: '#dc2626' }} />
                              <p style={{ fontSize: '14px', color: '#991b1b', margin: 0 }}>
                                ❌ <strong>{notif.providerName}</strong> declined your request.
                              </p>
                            </div>
                          )}
                        </>
                      )}

                      {/* ===== COMPLETED TYPE (both roles) ===== */}
                      {notif.type === 'service_completed' && notif.role === 'provider' && (
                        <div style={{
                          background: '#ecfdf5', borderRadius: '14px', padding: '20px',
                          border: '1px solid #a7f3d0',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} style={{
                                width: '16px', height: '16px',
                                color: i < notif.rating ? '#f59e0b' : '#d1d5db',
                                fill: i < notif.rating ? '#f59e0b' : 'none',
                              }} />
                            ))}
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginLeft: '4px' }}>
                              {notif.rating}/5
                            </span>
                          </div>
                          <p style={{ fontSize: '14px', color: '#065f46', fontStyle: 'italic', margin: '0 0 8px' }}>
                            &ldquo;{notif.review}&rdquo;
                          </p>
                          <p style={{ fontSize: '13px', color: '#059669', fontWeight: '600' }}>
                            +{notif.points} points earned from {notif.requesterName}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Help */}
        <div style={{
          marginTop: '40px', background: 'linear-gradient(135deg, #059669, #047857)',
          borderRadius: '20px', padding: '32px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
          gap: '16px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.05,
            backgroundImage: `repeating-linear-gradient(45deg, white 0px, white 2px, transparent 2px, transparent 12px),
              repeating-linear-gradient(-45deg, white 0px, white 2px, transparent 2px, transparent 12px)`,
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
              How the service flow works
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: 0, maxWidth: '500px' }}>
              Accept → Start → Complete → Earn Points. Both you and the requester must confirm completion for points to transfer.
            </p>
          </div>
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', gap: '8px',
          }}>
            {['Accept', '→', 'Start', '→', 'Complete', '→', 'Earn'].map((step, i) => (
              <span key={i} style={{
                background: i % 2 === 0 ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                padding: i % 2 === 0 ? '8px 14px' : '8px 4px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
              }}>
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
