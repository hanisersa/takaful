'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User, Mail, Phone, MapPin, Star, Coins, Award, Clock,
  Edit3, Camera, Heart, CheckCircle2, Shield, BookOpen,
  Briefcase, ChevronRight, TrendingUp,
} from 'lucide-react';

const skills = ['General Medicine', 'First Aid', 'Health Education', 'Pediatrics', 'Community Health'];

const reviews = [
  { id: 1, name: 'Layla M.', avatar: '👩', rating: 5, text: 'Dr. Ahmad was incredibly helpful and thorough. Highly recommend!', date: '2 days ago', service: 'Medical Consultation' },
  { id: 2, name: 'Omar K.', avatar: '👨', rating: 5, text: 'Very professional and kind. Took time to explain everything clearly.', date: '1 week ago', service: 'Health Checkup' },
  { id: 3, name: 'Fatima S.', avatar: '👩‍🦱', rating: 4, text: 'Great experience. Was able to help my children. Thank you!', date: '2 weeks ago', service: 'Pediatric Advice' },
];

const serviceHistory = [
  { id: 1, title: 'Medical consultation for Layla', points: 30, type: 'earned', date: 'Jan 28, 2026', icon: '🩺' },
  { id: 2, title: 'English tutoring session', points: 20, type: 'spent', date: 'Jan 25, 2026', icon: '📚' },
  { id: 3, title: 'Plumbing repair for Omar', points: 25, type: 'earned', date: 'Jan 22, 2026', icon: '🔧' },
  { id: 4, title: 'Web design for local NGO', points: 40, type: 'earned', date: 'Jan 18, 2026', icon: '💻' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div style={{ paddingTop: '96px', paddingBottom: '80px', minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

        {/* Profile Header Card */}
        <div style={{
          background: 'white', borderRadius: '24px', overflow: 'hidden',
          border: '1px solid #f3f4f6', marginBottom: '32px',
        }}>
          {/* Banner */}
          <div style={{
            height: '180px', background: 'linear-gradient(135deg, #064E3B, #047857, #10b981)',
            position: 'relative',
          }}>
            <div className="keffiyeh-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
            <button style={{
              position: 'absolute', bottom: '12px', right: '16px',
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px',
              padding: '6px 14px', color: 'white', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <Camera style={{ width: '14px', height: '14px' }} /> Edit Cover
            </button>
          </div>

          {/* Profile Info */}
          <div style={{ padding: '0 32px 28px', position: 'relative' }}>
            {/* Avatar */}
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #047857)',
              border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', marginTop: '-50px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}>
              <span style={{ fontSize: '48px' }}>{user?.avatar || '👤'}</span>
              <button style={{
                position: 'absolute', bottom: '2px', right: '2px',
                width: '28px', height: '28px', borderRadius: '50%',
                background: '#10b981', border: '2px solid white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <Camera style={{ width: '12px', height: '12px', color: 'white' }} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '16px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
                  {user?.firstName} {user?.lastName}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#6b7280' }}>
                    <Briefcase style={{ width: '14px', height: '14px' }} /> {user?.role || 'Member'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#6b7280' }}>
                    <MapPin style={{ width: '14px', height: '14px' }} /> {user?.location || 'Gaza'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#6b7280' }}>
                    <Clock style={{ width: '14px', height: '14px' }} /> Member since {user?.memberSince || '2026'}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px', maxWidth: '500px' }}>
                  {user?.bio || 'Helping the community one skill at a time.'}
                </p>
              </div>
              <button style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 24px', borderRadius: '12px',
                background: 'white', border: '1.5px solid #e5e7eb',
                fontSize: '14px', fontWeight: 600, color: '#374151', cursor: 'pointer',
              }}>
                <Edit3 style={{ width: '15px', height: '15px' }} /> Edit Profile
              </button>
            </div>

            {/* Stats Row */}
            <div className="stats-row-responsive" style={{
              gap: '0', marginTop: '24px',
              background: '#f9fafb', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f3f4f6',
            }}>
              {[
                { icon: Star, label: 'Rating', value: user?.rating || '0.0', color: '#f59e0b', iconColor: '#f59e0b' },
                { icon: Coins, label: 'Points', value: user?.points || 0, color: '#f59e0b', iconColor: '#f59e0b' },
                { icon: Award, label: 'Services', value: user?.completedServices || 0, color: '#10b981', iconColor: '#10b981' },
                { icon: Heart, label: 'Helped', value: '32 people', color: '#ef4444', iconColor: '#ef4444' },
              ].map((stat, i) => (
                <div key={stat.label} style={{
                  flex: 1, textAlign: 'center', padding: '20px 12px',
                  borderRight: i < 3 ? '1px solid #f3f4f6' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
                    <stat.icon style={{ width: '16px', height: '16px', color: stat.iconColor }} />
                    <span style={{ fontSize: '22px', fontWeight: 800, color: '#111827' }}>{stat.value}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', background: 'white', borderRadius: '14px',
          padding: '4px', border: '1px solid #f3f4f6', marginBottom: '24px', overflowX: 'auto',
        }}>
          {[
            { id: 'about', label: 'About' },
            { id: 'services', label: 'Services' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'history', label: 'History' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              background: activeTab === tab.id ? '#ecfdf5' : 'transparent',
              color: activeTab === tab.id ? '#059669' : '#6b7280',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>

          {activeTab === 'about' && (
            <div className="grid-2fr-1fr" style={{ gap: '24px' }}>
              {/* Left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Bio */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f3f4f6' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>About Me</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.7 }}>
                    I am a medical doctor based in Gaza City with years of experience in general medicine and community health. 
                    I joined Takaful to help my neighbors and community members access healthcare guidance without barriers. 
                    I believe in the power of mutual aid — when we help each other, everyone rises.
                  </p>
                </div>

                {/* Skills */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f3f4f6' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Skills & Expertise</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {skills.map((skill) => (
                      <span key={skill} style={{
                        padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 500,
                        background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0',
                      }}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Contact Info */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f3f4f6' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Contact Info</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { icon: Mail, label: user?.email || 'ahmad@takaful.ps' },
                      { icon: Phone, label: user?.phone || '+970 59 123 4567' },
                      { icon: MapPin, label: user?.location || 'Gaza City' },
                    ].map((item) => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <item.icon style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        </div>
                        <span style={{ fontSize: '13px', color: '#374151' }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badges */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f3f4f6' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Badges</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { icon: '🌟', name: 'First Helper', desc: 'Completed first service' },
                      { icon: '🏗️', name: 'Community Builder', desc: 'Helped 10+ people' },
                      { icon: '⭐', name: 'Top Rated', desc: '4.8+ rating' },
                    ].map((badge) => (
                      <div key={badge.name} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '10px', borderRadius: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0',
                      }}>
                        <span style={{ fontSize: '22px' }}>{badge.icon}</span>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>{badge.name}</p>
                          <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>{badge.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>Reviews ({reviews.length})</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star style={{ width: '18px', height: '18px', color: '#f59e0b', fill: '#f59e0b' }} />
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{user?.rating}</span>
                  <span style={{ fontSize: '13px', color: '#9ca3af' }}>average</span>
                </div>
              </div>
              {reviews.map((rev) => (
                <div key={rev.id} style={{
                  background: 'white', borderRadius: '16px', padding: '20px',
                  border: '1px solid #f3f4f6',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: '18px' }}>{rev.avatar}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>{rev.name}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{rev.service} • {rev.date}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} style={{
                          width: '14px', height: '14px',
                          color: i < rev.rating ? '#f59e0b' : '#e5e7eb',
                          fill: i < rev.rating ? '#f59e0b' : 'none',
                        }} />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{rev.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Transaction History</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
                  <TrendingUp style={{ width: '14px', height: '14px' }} /> Net: +75 pts this month
                </div>
              </div>
              {serviceHistory.map((tx) => (
                <div key={tx.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 24px', borderBottom: '1px solid #fafafa',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '12px', background: '#f9fafb',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                    }}>{tx.icon}</div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827', margin: 0 }}>{tx.title}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{tx.date}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '14px', fontWeight: 700,
                    color: tx.type === 'earned' ? '#10b981' : '#ef4444',
                  }}>
                    {tx.type === 'earned' ? '+' : '-'}{tx.points} pts
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'services' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { title: 'General Medical Consultation', category: 'Healthcare', points: 30, emoji: '🩺', status: 'Active' },
                { title: 'Plumbing & Water Systems', category: 'Home Repairs', points: 20, emoji: '🔧', status: 'Active' },
                { title: 'Community Health Workshop', category: 'Healthcare', points: 25, emoji: '📋', status: 'Paused' },
              ].map((svc) => (
                <div key={svc.title} style={{
                  background: 'white', borderRadius: '16px', padding: '20px',
                  border: '1px solid #f3f4f6',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{svc.emoji}</span>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '999px',
                      background: svc.status === 'Active' ? '#ecfdf5' : '#fef3c7',
                      color: svc.status === 'Active' ? '#059669' : '#b45309',
                    }}>{svc.status}</span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{svc.title}</h4>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 12px' }}>{svc.category}</p>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: '#fffbeb', color: '#b45309', padding: '4px 12px',
                    borderRadius: '999px', fontSize: '13px', fontWeight: 600, width: 'fit-content',
                  }}>
                    <Coins style={{ width: '14px', height: '14px' }} /> {svc.points} pts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
