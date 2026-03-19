'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User, Mail, Phone, MapPin, Shield, Bell, Eye, Lock, Globe,
  Palette, Moon, Sun, Save, ChevronRight, LogOut, Trash2, Camera,
  CheckCircle2, AlertTriangle, Key, ToggleLeft, ToggleRight,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    role: user?.role || '',
  });

  const [notifications, setNotifications] = useState({
    emailNotif: true,
    serviceRequests: true,
    pointsUpdates: true,
    communityNews: false,
    weeklyDigest: true,
  });

  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showRating: true,
    profilePublic: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  const Toggle = ({ on, onToggle }) => (
    <button onClick={onToggle} style={{
      width: '44px', height: '24px', borderRadius: '12px',
      background: on ? '#10b981' : '#d1d5db', border: 'none',
      cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
    }}>
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
        position: 'absolute', top: '2px', left: on ? '22px' : '2px', transition: 'all 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </button>
  );

  return (
    <div style={{ paddingTop: '96px', paddingBottom: '80px', minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>Settings</h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Manage your account preferences and security</p>
        </div>

        {/* Success Toast */}
        {saved && (
          <div style={{
            position: 'fixed', top: '100px', right: '24px', zIndex: 999,
            background: '#10b981', color: 'white', padding: '12px 20px',
            borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '14px', fontWeight: 600, boxShadow: '0 8px 25px rgba(16,185,129,0.3)',
            animation: 'fade-in 0.3s ease',
          }}>
            <CheckCircle2 style={{ width: '18px', height: '18px' }} /> Settings saved successfully!
          </div>
        )}

        <div className="grid-sidebar-240" style={{ gap: '24px' }}>

          {/* Sidebar Nav */}
          <div style={{
            background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6',
            padding: '8px', height: 'fit-content', position: 'sticky', top: '96px',
          }}>
            {sections.map((s) => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '12px 14px', borderRadius: '12px', border: 'none',
                fontSize: '14px', fontWeight: activeSection === s.id ? 600 : 500,
                cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                background: activeSection === s.id ? '#ecfdf5' : 'transparent',
                color: activeSection === s.id ? '#059669' : s.id === 'danger' ? '#ef4444' : '#6b7280',
              }}>
                <s.icon style={{ width: '18px', height: '18px' }} />
                {s.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
                <div style={{ padding: '24px 28px', borderBottom: '1px solid #f3f4f6' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Edit Profile</h2>
                  <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Update your personal information</p>
                </div>
                <div style={{ padding: '28px' }}>
                  {/* Avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                    <div style={{
                      width: '72px', height: '72px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #047857)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative', flexShrink: 0,
                    }}>
                      <span style={{ fontSize: '36px' }}>{user?.avatar || '👤'}</span>
                      <button style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: '#10b981', border: '2px solid white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      }}>
                        <Camera style={{ width: '10px', height: '10px', color: 'white' }} />
                      </button>
                    </div>
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>Profile Photo</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>JPG, PNG or GIF. 1MB max.</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid-cols-2-responsive" style={{ gap: '16px' }}>
                    {[
                      { label: 'First Name', key: 'firstName', icon: User, full: false },
                      { label: 'Last Name', key: 'lastName', icon: User, full: false },
                      { label: 'Email Address', key: 'email', icon: Mail, full: false },
                      { label: 'Phone Number', key: 'phone', icon: Phone, full: false },
                      { label: 'Location', key: 'location', icon: MapPin, full: false },
                    ].map((field) => (
                      <div key={field.key} style={{ gridColumn: field.full ? '1 / -1' : undefined }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>
                          {field.label}
                        </label>
                        <div style={{ position: 'relative' }}>
                          <field.icon style={{
                            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                            width: '16px', height: '16px', color: '#d1d5db',
                          }} />
                          <input
                            type="text"
                            value={profile[field.key]}
                            onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                            style={{
                              width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px',
                              border: '1.5px solid #e5e7eb', fontSize: '14px', color: '#111827',
                              outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#10b981'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                          />
                        </div>
                      </div>
                    ))}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Bio</label>
                      <textarea
                        rows={3}
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        style={{
                          width: '100%', padding: '10px 14px', borderRadius: '10px',
                          border: '1.5px solid #e5e7eb', fontSize: '14px', color: '#111827',
                          outline: 'none', resize: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#10b981'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button onClick={handleSave} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 28px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981, #047857)',
                      color: 'white', border: 'none', fontSize: '14px',
                      fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                    }}>
                      <Save style={{ width: '16px', height: '16px' }} /> Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
                <div style={{ padding: '24px 28px', borderBottom: '1px solid #f3f4f6' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Security</h2>
                  <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Manage your password and security settings</p>
                </div>
                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Change Password */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Current Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#d1d5db' }} />
                      <input type="password" placeholder="Enter current password" style={{
                        width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px',
                        border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                      }} />
                    </div>
                  </div>
                  <div className="grid-cols-2-responsive" style={{ gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>New Password</label>
                      <div style={{ position: 'relative' }}>
                        <Key style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#d1d5db' }} />
                        <input type="password" placeholder="New password" style={{
                          width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px',
                          border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                        }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
                      <div style={{ position: 'relative' }}>
                        <Key style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#d1d5db' }} />
                        <input type="password" placeholder="Confirm new password" style={{
                          width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px',
                          border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                        }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleSave} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 24px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981, #047857)',
                      color: 'white', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    }}>
                      <Save style={{ width: '16px', height: '16px' }} /> Update Password
                    </button>
                  </div>

                  {/* Two Factor */}
                  <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>Two-Factor Authentication</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Add an extra layer of security</p>
                      </div>
                      <Toggle on={false} onToggle={() => {}} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
                <div style={{ padding: '24px 28px', borderBottom: '1px solid #f3f4f6' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Notifications</h2>
                  <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Choose what you want to be notified about</p>
                </div>
                <div style={{ padding: '12px 28px' }}>
                  {[
                    { key: 'emailNotif', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'serviceRequests', label: 'Service Requests', desc: 'When someone requests your service' },
                    { key: 'pointsUpdates', label: 'Points Updates', desc: 'When you earn or spend points' },
                    { key: 'communityNews', label: 'Community News', desc: 'Updates about Takaful community' },
                    { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'A weekly summary of activity' },
                  ].map((item) => (
                    <div key={item.key} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 0', borderBottom: '1px solid #f9fafb',
                    }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>{item.label}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{item.desc}</p>
                      </div>
                      <Toggle
                        on={notifications[item.key]}
                        onToggle={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ padding: '16px 28px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleSave} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 24px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981, #047857)',
                    color: 'white', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  }}>
                    <Save style={{ width: '16px', height: '16px' }} /> Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeSection === 'privacy' && (
              <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
                <div style={{ padding: '24px 28px', borderBottom: '1px solid #f3f4f6' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Privacy</h2>
                  <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Control what others can see about you</p>
                </div>
                <div style={{ padding: '12px 28px' }}>
                  {[
                    { key: 'profilePublic', label: 'Public Profile', desc: 'Allow others to view your profile' },
                    { key: 'showEmail', label: 'Show Email', desc: 'Display your email on your profile' },
                    { key: 'showPhone', label: 'Show Phone', desc: 'Display your phone number on your profile' },
                    { key: 'showLocation', label: 'Show Location', desc: 'Display your city on your profile' },
                    { key: 'showRating', label: 'Show Rating', desc: 'Display your rating publicly' },
                  ].map((item) => (
                    <div key={item.key} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 0', borderBottom: '1px solid #f9fafb',
                    }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>{item.label}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{item.desc}</p>
                      </div>
                      <Toggle
                        on={privacy[item.key]}
                        onToggle={() => setPrivacy({ ...privacy, [item.key]: !privacy[item.key] })}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ padding: '16px 28px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleSave} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 24px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981, #047857)',
                    color: 'white', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  }}>
                    <Save style={{ width: '16px', height: '16px' }} /> Save Privacy Settings
                  </button>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            {activeSection === 'danger' && (
              <div style={{
                background: 'white', borderRadius: '20px', border: '1.5px solid #fecaca', overflow: 'hidden',
              }}>
                <div style={{ padding: '24px 28px', borderBottom: '1px solid #fecaca', background: '#fef2f2' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ef4444', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle style={{ width: '20px', height: '20px' }} /> Danger Zone
                  </h2>
                  <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Irreversible actions — proceed with caution</p>
                </div>
                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>Sign Out</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Sign out of your account on this device</p>
                    </div>
                    <button onClick={logout} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 20px', borderRadius: '10px', border: '1.5px solid #fecaca',
                      background: 'white', color: '#ef4444', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    }}>
                      <LogOut style={{ width: '14px', height: '14px' }} /> Sign Out
                    </button>
                  </div>
                  <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#ef4444', margin: '0 0 2px' }}>Delete Account</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Permanently delete your account and all data</p>
                    </div>
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 20px', borderRadius: '10px', border: 'none',
                      background: '#ef4444', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    }}>
                      <Trash2 style={{ width: '14px', height: '14px' }} /> Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
