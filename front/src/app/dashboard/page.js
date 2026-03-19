'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Coins, TrendingUp, TrendingDown, ArrowRight, Star, Clock,
  CheckCircle2, AlertCircle, Bell, Settings, User, BarChart3,
  Calendar, Award, Heart, Plus, ChevronRight,
} from 'lucide-react';

const categoryEmojis = {
  'Healthcare': '🩺', 'Home Repairs': '🔧', 'Technology': '💻',
  'Construction': '🏗️', 'Barber': '💈', 'Tailor': '🧵',
  'Mechanic': '🔧', 'Transport': '🚗', 'Education': '📚',
};

const achievements = [
  { name: 'First Helper', desc: 'Complete your first service', icon: '🌟', threshold: 1 },
  { name: 'Community Builder', desc: 'Help 10 different people', icon: '🏗️', threshold: 10 },
  { name: 'Top Rated', desc: 'Maintain 4.8+ rating', icon: '⭐', ratingBased: true, minRating: 4.8 },
  { name: 'Veteran Helper', desc: 'Complete 50 services', icon: '🎖️', threshold: 50 },
  { name: 'Gaza Champion', desc: 'Help 100 people', icon: '🏆', threshold: 100 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [activeRequests, setActiveRequests] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchDashboardData() {
      const token = localStorage.getItem('takaful_token');
      if (!token) return;

      try {
        // Fetch user's transactions
        const txRes = await fetch('/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const txData = await txRes.json();

        if (txData.transactions) {
          // Recent transactions (completed ones for history)
          const recent = txData.transactions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(t => {
              const isEarned = t.provider?._id === user?._id;
              return {
                id: t._id,
                type: isEarned ? 'earned' : 'spent',
                description: t.service?.title || 'Service',
                points: t.points || 0,
                date: new Date(t.createdAt).toLocaleDateString(),
                icon: categoryEmojis[t.service?.category] || '📋',
                status: t.status,
              };
            });
          setRecentTransactions(recent);

          // Active (pending) requests where user is provider
          const pending = txData.transactions
            .filter(t => (t.provider?._id === user?._id) && t.status === 'pending')
            .map(t => ({
              id: t._id,
              title: t.service?.title || 'Service request',
              requester: `${t.requester?.firstName || ''} ${t.requester?.lastName?.[0] || ''}.`.trim(),
              points: t.points || 0,
              time: new Date(t.createdAt).toLocaleDateString(),
              urgent: false,
            }));
          setActiveRequests(pending);
        }

        // Fetch notification count
        const notifRes = await fetch('/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const notifData = await notifRes.json();
        setUnreadCount(notifData.unreadCount || 0);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    }
    fetchDashboardData();
  }, [user]);

  const completedCount = user?.completedServices || 0;
  const computedAchievements = achievements.map(a => {
    if (a.ratingBased) {
      return { ...a, completed: (user?.rating || 0) >= a.minRating };
    }
    return {
      ...a,
      completed: completedCount >= a.threshold,
      progress: Math.min(completedCount, a.threshold),
      total: a.threshold,
    };
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'services', label: 'My Services', icon: Heart },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'achievements', label: 'Achievements', icon: Award },
  ];

  return (
    <div style={{ paddingTop: '96px', paddingBottom: '80px', minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '18px',
              background: 'linear-gradient(135deg, #34d399, #14b8a6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '30px', boxShadow: '0 8px 24px rgba(16,185,129,0.25)', flexShrink: 0,
            }}>
              {user?.avatar || '👤'}
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
                {user?.role || 'Member'} • {user?.location || 'Gaza'} • Member since {user?.memberSince || '2026'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link href="/dashboard/notifications" style={{
              padding: '10px', borderRadius: '12px', background: 'white',
              border: '1px solid #e5e7eb', color: '#6b7280', cursor: 'pointer',
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none',
            }}>
              <Bell style={{ width: '20px', height: '20px' }} />
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                width: '16px', height: '16px', background: '#ef4444', borderRadius: '50%',
                fontSize: '10px', color: 'white', fontWeight: 700,
                display: unreadCount > 0 ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center',
              }}>{unreadCount}</span>
            </Link>
            <Link href="/settings" style={{
              padding: '10px', borderRadius: '12px', background: 'white',
              border: '1px solid #e5e7eb', color: '#6b7280', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
            }}>
              <Settings style={{ width: '20px', height: '20px' }} />
            </Link>
            <Link href="/services/offer" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #047857)',
              color: 'white', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none', boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
            }}>
              <Plus style={{ width: '16px', height: '16px' }} /> Offer Service
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid-cols-4-responsive" style={{ gap: '16px', marginBottom: '32px' }}>
          {/* Points Card */}
          <div style={{
            gridColumn: 'span 2',
            background: 'linear-gradient(135deg, #064E3B, #047857, #10b981)',
            borderRadius: '20px', padding: '28px', color: 'white',
            position: 'relative', overflow: 'hidden',
          }}>
            <div className="keffiyeh-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.08 }} />
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <p style={{ fontSize: '13px', color: 'rgba(167,243,208,0.7)', fontWeight: 500, margin: '0 0 6px' }}>Your Balance</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '42px', fontWeight: 800 }}>{user?.points || 0}</span>
                <span style={{ fontSize: '18px', color: 'rgba(167,243,208,0.6)', fontWeight: 500 }}>points</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(167,243,208,0.8)' }}>
                  <TrendingUp style={{ width: '14px', height: '14px' }} /> {recentTransactions.filter(t => t.type === 'earned').reduce((s, t) => s + t.points, 0)} earned recently
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(167,243,208,0.4)' }}>
                  <TrendingDown style={{ width: '14px', height: '14px' }} /> {recentTransactions.filter(t => t.type === 'spent').reduce((s, t) => s + t.points, 0)} spent recently
                </span>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
              </div>
              <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>Completed</span>
            </div>
            <p style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>{user?.completedServices || 0}</p>
            <p style={{ fontSize: '12px', color: '#d1d5db', margin: 0 }}>Services delivered</p>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
              </div>
              <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>Rating</span>
            </div>
            <p style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>{user?.rating || '0.0'}</p>
            <p style={{ fontSize: '12px', color: '#d1d5db', margin: 0 }}>From {user?.completedServices || 0} reviews</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', background: 'white', borderRadius: '14px',
          padding: '4px', border: '1px solid #f3f4f6', marginBottom: '32px', overflowX: 'auto',
        }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '10px', fontSize: '14px',
              fontWeight: activeTab === tab.id ? 600 : 500, border: 'none',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              background: activeTab === tab.id ? '#ecfdf5' : 'transparent',
              color: activeTab === tab.id ? '#059669' : '#9ca3af',
            }}>
              <tab.icon style={{ width: '16px', height: '16px' }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid-2fr-1fr" style={{ gap: '24px' }}>
          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Transactions */}
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Recent Transactions</h2>
                <button style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#10b981', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                  View All <ChevronRight style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
              {recentTransactions.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>
                  <p style={{ fontSize: '14px' }}>No transactions yet. Request or offer a service to get started!</p>
                </div>
              ) : (
              <div>
              {recentTransactions.map((tx) => (
                <div key={tx.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 24px', borderBottom: '1px solid #fafafa',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{tx.icon}</div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827', margin: 0 }}>{tx.description}</p>
                      <p style={{ fontSize: '12px', color: '#d1d5db', margin: 0 }}>{tx.date}</p>
                    </div>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 700, color: tx.type === 'earned' ? '#10b981' : '#ef4444' }}>
                    <Coins style={{ width: '14px', height: '14px' }} />
                    {tx.type === 'earned' ? '+' : '-'}{tx.points}
                    {tx.status && tx.status !== 'completed' && (
                      <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: '#f3f4f6', color: '#6b7280', marginLeft: '4px' }}>{tx.status}</span>
                    )}
                  </span>
                </div>
              ))}
              </div>
              )}
            </div>

            {/* Achievements */}
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Achievements</h2>
                <span style={{ fontSize: '12px', color: '#d1d5db' }}>{computedAchievements.filter(a => a.completed).length} of {computedAchievements.length} unlocked</span>
              </div>
              <div className="grid-cols-3-responsive" style={{ gap: '14px', padding: '20px 24px' }}>
                {computedAchievements.map((a) => (
                  <div key={a.name} style={{
                    borderRadius: '14px', padding: '16px', textAlign: 'center',
                    border: '1px solid', borderColor: a.completed ? '#a7f3d0' : '#f3f4f6',
                    background: a.completed ? '#ecfdf5' : '#f9fafb', opacity: a.completed ? 1 : 0.7,
                  }}>
                    <span style={{ fontSize: '26px', display: 'block', marginBottom: '8px' }}>{a.icon}</span>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{a.name}</p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>{a.desc}</p>
                    {!a.completed && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ width: '100%', height: '6px', borderRadius: '999px', background: '#e5e7eb', overflow: 'hidden' }}>
                          <div style={{ width: `${(a.progress / a.total) * 100}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                        </div>
                        <p style={{ fontSize: '10px', color: '#9ca3af', margin: '4px 0 0' }}>{a.progress}/{a.total}</p>
                      </div>
                    )}
                    {a.completed && <div style={{ marginTop: '8px' }}><CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981' }} /></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Quick Actions */}
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Offer Service', icon: '🤝', href: '/services/offer' },
                  { label: 'Find Help', icon: '🔍', href: '/services' },
                  { label: 'My Profile', icon: '👤', href: '/profile' },
                  { label: 'Invite Friend', icon: '💌', href: '#' },
                ].map((action) => (
                  <Link key={action.label} href={action.href} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    padding: '16px 10px', borderRadius: '14px', background: '#f9fafb', border: '1px solid #f3f4f6',
                    textDecoration: 'none', textAlign: 'center',
                  }}>
                    <span style={{ fontSize: '22px' }}>{action.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Active Requests */}
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #f3f4f6' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Active Requests</h3>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: '#fef2f2', color: '#ef4444' }}>{activeRequests.length} open</span>
              </div>
              {activeRequests.map((req) => (
                <div key={req.id} style={{ padding: '14px 20px', borderBottom: '1px solid #fafafa' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>{req.title}</p>
                    {req.urgent && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: '#fef2f2', color: '#ef4444', whiteSpace: 'nowrap' }}>
                        <AlertCircle style={{ width: '10px', height: '10px' }} /> Urgent
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af' }}>
                    <span>{req.requester} • {req.time}</span>
                    <span style={{ background: '#fffbeb', color: '#b45309', padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>{req.points} pts</span>
                  </div>
                </div>
              ))}
              <div style={{ padding: '14px 20px', borderTop: '1px solid #f3f4f6' }}>
                <Link href="/services" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '13px', color: '#10b981', fontWeight: 600, textDecoration: 'none' }}>
                  View All Requests <ArrowRight style={{ width: '14px', height: '14px' }} />
                </Link>
              </div>
            </div>

            {/* Monthly Goal */}
            <div style={{ background: 'linear-gradient(135deg, #ecfdf5, #ccfbf1)', borderRadius: '20px', border: '1px solid #a7f3d0', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Monthly Goal</h3>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 14px' }}>Help 10 people this month</p>
              <div style={{ width: '100%', height: '10px', borderRadius: '999px', background: 'white', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: '70%', height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #10b981, #14b8a6)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#059669', fontWeight: 600 }}>7 of 10 completed</span>
                <span style={{ color: '#9ca3af' }}>3 remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
