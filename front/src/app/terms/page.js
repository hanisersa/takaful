'use client';

import { FileText, Scale, AlertTriangle, Shield, Users, Globe } from 'lucide-react';

const sections = [
  {
    icon: Scale,
    title: 'Acceptance of Terms',
    content: `By accessing and using Takaful, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform. Takaful reserves the right to update or modify these terms at any time without prior notice. Continued use of the platform after changes constitutes acceptance of the updated terms.`,
  },
  {
    icon: Users,
    title: 'User Accounts',
    content: `You must be at least 16 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate, current, and complete information during registration. Takaful reserves the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    icon: Globe,
    title: 'Platform Usage',
    content: `Takaful is a community-based skill-exchange platform designed for mutual aid. You agree to use the platform only for its intended purpose — offering and requesting community services. You may not use Takaful for commercial solicitation, spam, or any activity that disrupts the community. All services exchanged are between community members; Takaful acts only as a facilitator.`,
  },
  {
    icon: FileText,
    title: 'Points System',
    content: `The Takaful points system is a community currency used to facilitate service exchanges. Points have no monetary value and cannot be exchanged for cash. Points are earned by providing services and spent when requesting services. Takaful reserves the right to adjust point balances in cases of fraud, abuse, or system errors.`,
  },
  {
    icon: AlertTriangle,
    title: 'Prohibited Conduct',
    content: `Users must not: post false or misleading information; harass, threaten, or intimidate other users; attempt to manipulate the points system; impersonate other users or Takaful staff; use the platform for illegal activities; share content that is hateful, violent, or discriminatory. Violations may result in immediate account suspension.`,
  },
  {
    icon: Shield,
    title: 'Limitation of Liability',
    content: `Takaful is provided "as is" without warranties of any kind. We do not guarantee the quality, safety, or legality of services exchanged between users. Takaful is not liable for any damages arising from the use of the platform, including but not limited to direct, indirect, incidental, or consequential damages. Users engage with each other at their own risk.`,
  },
];

export default function TermsPage() {
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
            <Scale style={{ width: '14px', height: '14px' }} /> Legal
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'white', margin: '0 0 12px' }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>
            Please read these terms carefully before using the Takaful platform.
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
            Questions about these terms?
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Contact us at <strong>support@takaful.ps</strong> or visit our <a href="/contact" style={{ color: '#2563eb', textDecoration: 'underline' }}>Contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
