'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Heart, Coins, ChevronDown, User, LogOut, Settings, LayoutDashboard, Star, MapPin, Award, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = isLoggedIn
    ? [
        { name: 'Services', href: '/services' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
      ]
    : [];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-black/5'
          : 'bg-white/70 backdrop-blur-md'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                Taka<span className="text-emerald-600">ful</span>
              </span>
              <span className="block text-[10px] text-gray-400 font-medium -mt-1 tracking-wider">
                REBUILD TOGETHER
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ alignItems: 'center', gap: '8px' }}>
            {navLinks.map((link) => (
              <div
                key={link.name}
                style={{ position: 'relative' }}
                onMouseEnter={() => link.children && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.08)'; e.currentTarget.style.color = '#059669'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                >
                  {link.name}
                  {link.children && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>

                {/* Dropdown */}
                {link.children && activeDropdown === link.name && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    paddingTop: '8px',
                    zIndex: 100,
                  }}>
                    <div style={{
                      width: '220px',
                      background: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
                      padding: '8px',
                    }} className="animate-fade-in">
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 14px',
                            fontSize: '14px',
                            color: '#374151',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.color = '#059669'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                        >
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', opacity: 0.5 }} />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side */}
          <div className="desktop-nav" style={{ alignItems: 'center', gap: '12px' }}>
            {isLoggedIn ? (
              <>
                {/* Points badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fffbeb', color: '#b45309', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <Coins className="w-4 h-4" />
                  <span>{user?.points || 0} pts</span>
                </div>

                {/* Offer Help */}
                <Link href="/services/offer" className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
                  Offer Help
                </Link>

                {/* Profile Dropdown */}
                <div
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '4px 4px 4px 12px', borderRadius: '999px',
                      border: '1.5px solid #e5e7eb', background: 'white',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(16,185,129,0.12)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{user?.firstName || 'User'}</span>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #047857)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {user?.avatar ? (
                        <span style={{ fontSize: '18px' }}>{user.avatar}</span>
                      ) : (
                        <User style={{ width: '16px', height: '16px', color: 'white' }} />
                      )}
                    </div>
                  </button>

              {profileOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: '8px', zIndex: 100 }}>
                  <div style={{
                    width: '300px', background: 'white', borderRadius: '20px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)',
                    overflowY: 'auto', maxHeight: '80vh',
                  }}>
                    {/* Profile Header */}
                    <div style={{
                      background: 'linear-gradient(135deg, #064E3B, #047857)',
                      padding: '24px 20px 20px',
                      position: 'relative',
                    }}>
                      <div className="keffiyeh-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
                      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '52px', height: '52px', borderRadius: '50%',
                          background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <span style={{ fontSize: '26px' }}>{user?.avatar || '👤'}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: 0 }}>
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p style={{ fontSize: '12px', color: 'rgba(167,243,208,0.8)', margin: 0 }}>{user?.role || 'Member'}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                            <MapPin style={{ width: '11px', height: '11px', color: 'rgba(167,243,208,0.6)' }} />
                            <span style={{ fontSize: '11px', color: 'rgba(167,243,208,0.6)' }}>{user?.location || 'Gaza'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div style={{
                        display: 'flex', gap: '0', marginTop: '16px',
                        background: 'rgba(0,0,0,0.2)', borderRadius: '12px', overflow: 'hidden',
                      }}>
                        <div style={{ flex: 1, textAlign: 'center', padding: '10px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginBottom: '2px' }}>
                            <Star style={{ width: '12px', height: '12px', color: '#fbbf24', fill: '#fbbf24' }} />
                            <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{user?.rating || '0.0'}</span>
                          </div>
                          <span style={{ fontSize: '10px', color: 'rgba(167,243,208,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rating</span>
                        </div>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ flex: 1, textAlign: 'center', padding: '10px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginBottom: '2px' }}>
                            <Coins style={{ width: '12px', height: '12px', color: '#fbbf24' }} />
                            <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{user?.points || 0}</span>
                          </div>
                          <span style={{ fontSize: '10px', color: 'rgba(167,243,208,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Points</span>
                        </div>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ flex: 1, textAlign: 'center', padding: '10px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginBottom: '2px' }}>
                            <Award style={{ width: '12px', height: '12px', color: '#34d399' }} />
                            <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{user?.completedServices || 0}</span>
                          </div>
                          <span style={{ fontSize: '10px', color: 'rgba(167,243,208,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Services</span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Links */}
                    <div style={{ padding: '8px' }}>
                      {[
                        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', desc: 'View your activity' },
                        { icon: User, label: 'My Profile', href: '/profile', desc: 'Edit your info' },
                        { icon: Settings, label: 'Settings', href: '/settings', desc: 'Preferences & security' },
                      ].map((item) => (
                        <Link key={item.label} href={item.href}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '10px 12px', fontSize: '14px', color: '#374151',
                            borderRadius: '12px', textDecoration: 'none', transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.color = '#059669'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                        >
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <item.icon style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '13px', lineHeight: 1.2, margin: 0 }}>{item.label}</p>
                            <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 400, margin: 0 }}>{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Member Since + Sign Out */}
                    <div style={{ borderTop: '1px solid #f3f4f6', padding: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', marginBottom: '4px' }}>
                        <Clock style={{ width: '12px', height: '12px', color: '#d1d5db' }} />
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>Member since {user?.memberSince || '2026'}</span>
                      </div>
                      <button
                        onClick={logout}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                          padding: '10px 12px', fontSize: '14px', color: '#ef4444',
                          borderRadius: '12px', border: 'none', background: 'transparent',
                          cursor: 'pointer', transition: 'all 0.15s', fontWeight: 500,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <LogOut style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
              </>
            ) : (
              <>
                <Link href="/login" style={{
                  padding: '10px 24px', fontSize: '14px', fontWeight: 600,
                  color: '#374151', borderRadius: '10px', textDecoration: 'none',
                  transition: 'all 0.2s', border: '1.5px solid #e5e7eb',
                }}>
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 24px', fontSize: '14px' }}>
                  Join Takaful <ArrowRight style={{ width: '14px', height: '14px' }} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-menu-btn"
            style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-menu" style={{ paddingTop: '16px', paddingBottom: '16px', borderTop: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block', padding: '12px 16px', fontSize: '14px', fontWeight: 500,
                      color: '#4b5563', textDecoration: 'none', borderRadius: '8px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.color = '#059669'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4b5563'; }}
                  >
                    {link.name}
                  </Link>
                  {link.children && (
                    <div style={{ marginLeft: '16px' }}>
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          style={{
                            display: 'block', padding: '8px 16px', fontSize: '14px',
                            color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#059669'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Mobile profile bar */}
            {isLoggedIn ? (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #047857)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontSize: '20px' }}>{user?.avatar || '👤'}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '14px', color: '#111827', margin: 0 }}>{user?.firstName} {user?.lastName}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{user?.role}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star style={{ width: '10px', height: '10px', color: '#fbbf24', fill: '#fbbf24' }} />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{user?.rating}</span>
                    </span>
                  </div>
                </div>
                <div style={{ background: '#fffbeb', color: '#b45309', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                  {user?.points} pts
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/services/offer" className="btn-primary" onClick={() => setIsOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '14px' }}>
                  Offer Help
                </Link>
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #fecaca', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <LogOut style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
            ) : (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6', padding: '16px', display: 'flex', gap: '8px' }}>
              <Link href="/login" onClick={() => setIsOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '14px', fontWeight: 600, color: '#374151', borderRadius: '10px', border: '1.5px solid #e5e7eb', textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link href="/register" className="btn-primary" onClick={() => setIsOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '14px' }}>
                Join Takaful
              </Link>
            </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
