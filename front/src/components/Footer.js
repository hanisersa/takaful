'use client';

import Link from 'next/link';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    Menu: [
      { name: 'Services', href: '/services' },
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    Resources: [
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'FAQs', href: '/faq' },
      { name: 'Points System', href: '/how-it-works' },
    ],
    Services: [
      { name: 'Browse Services', href: '/services' },
      { name: 'Offer a Service', href: '/services/offer' },
      { name: 'Request Help', href: '/services/request' },
    ],
  };

  return (
    <footer style={{ background: '#111827', color: '#d1d5db' }}>
      {/* Palestine stripe */}
      <div className="palestine-stripe" />

      <div className="container-custom" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
        <div className="grid-footer">
          {/* Brand */}
          <div>
            <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', textDecoration: 'none' }}>
              <div className="gradient-primary" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart className="w-5 h-5" style={{ color: 'white' }} fill="white" />
              </div>
              <div>
                <span style={{ fontSize: '20px', fontWeight: '800', color: 'white', letterSpacing: '-0.02em' }}>
                  Taka<span style={{ color: '#34d399' }}>ful</span>
                </span>
                <span style={{ display: 'block', fontSize: '10px', color: '#6b7280', fontWeight: '500', marginTop: '-2px', letterSpacing: '0.15em' }}>
                  REBUILD TOGETHER
                </span>
              </div>
            </Link>
            <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.7', maxWidth: '360px', marginBottom: '24px' }}>
              Our mission is to empower Palestinian communities by creating a
              platform where skills and services are exchanged freely. Together,
              we rebuild what was lost and build what was dreamed.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                <Mail className="w-4 h-4" style={{ color: '#10b981' }} />
                <span>support@takaful.ps</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                <Phone className="w-4 h-4" style={{ color: '#10b981' }} />
                <span>+970 59 123 4567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                <MapPin className="w-4 h-4" style={{ color: '#10b981' }} />
                <span>Gaza, Palestine</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '20px' }}>{title}</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0, margin: 0 }}>
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#34d399'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #1f2937' }}>
        <div className="container-custom bottom-bar" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            © 2026 Takaful. Built with ❤️ for Palestine.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/privacy" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>
              Privacy
            </Link>
            <Link href="/terms" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>
              Terms
            </Link>
            <Link href="/safety" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>
              Safety
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
