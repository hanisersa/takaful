'use client';

import { Eye, Database, Lock, Share2, UserCheck, Trash2, Shield } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: `When you register for Takaful, we collect your name, email address, location (city/area), and skills. When you use the platform, we collect information about the services you offer and request, your transaction history, and points balance. We may also collect device information and usage data to improve our services.`,
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: `We use your information to: provide and maintain the Takaful platform; match service providers with those in need; manage the points system; communicate important updates and notifications; improve our services and user experience; ensure platform safety and prevent abuse. We do not sell your personal information to third parties.`,
  },
  {
    icon: Share2,
    title: 'Information Sharing',
    content: `Your public profile information (name, skills, location area) is visible to other Takaful users. When you engage in a service transaction, your contact details may be shared with the other party to facilitate the exchange. We may share anonymized, aggregated data for research or reporting purposes. We will disclose information if required by law or to protect the safety of our users.`,
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: `We implement industry-standard security measures to protect your personal data, including encrypted data transmission (HTTPS), secure password hashing, and regular security audits. However, no method of electronic transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`,
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: `You have the right to: access the personal data we hold about you; correct inaccurate information in your profile; request a copy of your data; opt out of non-essential communications; withdraw consent for data processing. To exercise any of these rights, contact us through our Contact page or email support@takaful.ps.`,
  },
  {
    icon: Trash2,
    title: 'Data Retention & Deletion',
    content: `We retain your account data for as long as your account is active. Transaction history is kept for accountability and dispute resolution purposes. If you delete your account, we will remove your personal information within 30 days, except where retention is required for legal or safety reasons. You can request account deletion from your Settings page.`,
  },
  {
    icon: Shield,
    title: 'Cookies & Local Storage',
    content: `Takaful uses essential cookies and local storage to keep you logged in and remember your preferences. We do not use tracking cookies or third-party advertising cookies. You can clear your browser storage at any time, but this will require you to log in again.`,
  },
];

export default function PrivacyPage() {
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
            <Eye style={{ width: '14px', height: '14px' }} /> Privacy
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'white', margin: '0 0 12px' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>
            We respect your privacy and are committed to protecting your personal data.
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '16px' }}>
            Last updated: June 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 20px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {sections.map((section, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '16px', padding: '28px',
              border: '1px solid #f3f4f6',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <section.icon style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                </div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  {section.title}
                </h2>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{
          marginTop: '40px', padding: '24px', borderRadius: '16px',
          background: '#eff6ff', border: '1px solid #bfdbfe', textAlign: 'center',
        }}>
          <p style={{ fontSize: '14px', color: '#1d4ed8', fontWeight: 600, margin: '0 0 4px' }}>
            Privacy concerns?
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Reach out at <strong>privacy@takaful.ps</strong> or visit our <a href="/contact" style={{ color: '#2563eb', textDecoration: 'underline' }}>Contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
