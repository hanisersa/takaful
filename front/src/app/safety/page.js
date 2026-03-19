'use client';

import { ShieldCheck, UserCheck, AlertOctagon, MessageCircle, MapPin, Phone, Heart } from 'lucide-react';

const guidelines = [
  {
    icon: UserCheck,
    title: 'Verify Before You Meet',
    content: `Always check the profile and reviews of the person you're connecting with. Look for verified accounts with completed transactions and positive feedback. If a profile seems suspicious or too new, proceed with caution.`,
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    icon: MapPin,
    title: 'Meet in Safe Locations',
    content: `When meeting for a service exchange, choose well-known, public locations when possible. Inform a family member or friend about where you're going and who you're meeting. Trust your instincts — if something feels wrong, leave.`,
    color: '#059669',
    bg: '#ecfdf5',
  },
  {
    icon: MessageCircle,
    title: 'Communicate on Platform',
    content: `Keep your conversations within the Takaful platform as much as possible. This creates a record that can help resolve disputes. Be wary of users who immediately want to move communication to external channels.`,
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    icon: AlertOctagon,
    title: 'Report Suspicious Activity',
    content: `If you encounter harassment, fraud, or any behavior that violates our community guidelines, report it immediately. Use the report button on any profile or transaction, or contact us directly. We investigate all reports within 24 hours.`,
    color: '#dc2626',
    bg: '#fef2f2',
  },
  {
    icon: Phone,
    title: 'Emergency Contacts',
    content: `In case of immediate danger, always contact local emergency services first. You can also reach the Takaful safety team at safety@takaful.ps. Keep emergency numbers saved on your phone before going to any service exchange.`,
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    icon: Heart,
    title: 'Community Standards',
    content: `Takaful is built on mutual respect and solidarity. Treat every community member with dignity regardless of their background. Discrimination, harassment, and exploitation of any kind will result in permanent removal from the platform.`,
    color: '#e11d48',
    bg: '#fff1f2',
  },
];

const safetyTips = [
  'Never share your password or account credentials with anyone.',
  'Be cautious of requests that seem too good to be true.',
  'Don\'t pay points before a service is confirmed and started.',
  'Take photos of completed work as proof for dispute resolution.',
  'Rate and review every service exchange to help the community.',
  'Update your profile regularly to maintain trust.',
];

export default function SafetyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
        paddingTop: '120px', paddingBottom: '60px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px', marginBottom: '16px',
            background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '13px', fontWeight: 600,
          }}>
            <ShieldCheck style={{ width: '14px', height: '14px' }} /> Safety
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'white', margin: '0 0 12px' }}>
            Safety Center
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>
            Your safety is our top priority. Follow these guidelines to stay safe on Takaful.
          </p>
        </div>
      </div>

      {/* Guidelines */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 20px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {guidelines.map((item, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '16px', padding: '28px',
              border: '1px solid #f3f4f6',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <item.icon style={{ width: '20px', height: '20px', color: item.color }} />
                </div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  {item.title}
                </h2>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{
          background: 'white', borderRadius: '16px', padding: '28px',
          border: '1px solid #f3f4f6',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck style={{ width: '20px', height: '20px', color: '#2563eb' }} /> Quick Safety Tips
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {safetyTips.map((tip, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '12px 14px', background: '#f9fafb', borderRadius: '10px',
              }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  background: '#eff6ff', color: '#2563eb', fontSize: '11px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px',
                }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: 1.5 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency */}
        <div style={{
          marginTop: '24px', padding: '24px', borderRadius: '16px',
          background: '#fef2f2', border: '1px solid #fecaca', textAlign: 'center',
        }}>
          <p style={{ fontSize: '14px', color: '#dc2626', fontWeight: 600, margin: '0 0 4px' }}>
            In case of emergency
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Contact local emergency services immediately. Then report to <strong>safety@takaful.ps</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
