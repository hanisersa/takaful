'use client';

import { Heart, Users, Shield, Coins, Globe, Sparkles, Target, HandHeart } from 'lucide-react';
import CounterAnimation from '@/components/CounterAnimation';

export default function AboutPage() {
  return (
    <div>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #010d06 0%, #064E3B 50%, #0d9466 100%)' }} />
        <div className="absolute inset-0 keffiyeh-pattern" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />

        <div className="container-custom relative z-10" style={{ textAlign: 'center' }}>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-2 rounded-full text-sm font-medium" style={{ marginBottom: '20px' }}>
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Our Story</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '16px' }}>
            About <span className="bg-linear-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">Takaful</span>
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(167,243,210,0.8)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            Born from the belief that every skill matters and every person deserves help.
            In times of hardship, our greatest resource is each other.
          </p>
        </div>
      </section>

      {/* ===================== MISSION ===================== */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container-custom">
          <div className="grid-cols-2-responsive" style={{ gap: '64px', alignItems: 'center' }}>
            <div>
              <span className="section-label">Our Mission</span>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#111827', marginTop: '12px', marginBottom: '16px' }}>
                Rebuilding Palestine, <span style={{ color: '#059669' }}>One Skill at a Time</span>
              </h2>
              <p style={{ color: '#6b7280', lineHeight: 1.8, marginBottom: '20px', fontSize: '15px' }}>
                Takaful (تكافل) means mutual support and solidarity. Our platform connects
                Palestinians with skills to those who need them, creating a sustainable
                cycle of giving and receiving without money.
              </p>
              <p style={{ color: '#6b7280', lineHeight: 1.8, fontSize: '15px' }}>
                A doctor treats a teacher&apos;s child, the teacher tutors a carpenter&apos;s
                son, and the carpenter fixes the doctor&apos;s furniture. Everyone contributes,
                everyone benefits. This is the power of community.
              </p>
            </div>

            <div className="grid-cols-2-responsive" style={{ gap: '16px' }}>
              {[
                { icon: Users, value: 5200, suffix: '+', label: 'Active Members', color: '#059669', bg: '#ecfdf5' },
                { icon: Heart, value: 12800, suffix: '+', label: 'Services Exchanged', color: '#dc2626', bg: '#fef2f2' },
                { icon: Globe, value: 15, suffix: '+', label: 'Regions Covered', color: '#2563eb', bg: '#eff6ff' },
                { icon: Shield, value: 98, suffix: '%', label: 'Satisfaction Rate', color: '#7c3aed', bg: '#f5f3ff' },
              ].map((stat) => (
                <div key={stat.label} style={{ background: stat.bg, borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
                  <stat.icon style={{ width: '28px', height: '28px', color: stat.color, margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
                    <CounterAnimation end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== VALUES ===================== */}
      <section style={{ padding: '80px 0' }} className="bg-linear-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="section-label">Our Values</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#111827', marginTop: '12px', marginBottom: '16px' }}>
              What We <span style={{ color: '#059669' }}>Believe In</span>
            </h2>
          </div>

          <div className="grid-cols-3-responsive" style={{ gap: '24px' }}>
            {[
              {
                icon: HandHeart,
                title: 'Mutual Support',
                desc: 'We believe in a community where everyone helps each other. Your skill is your currency — give what you can, receive what you need.',
                color: '#059669',
                bg: '#ecfdf5',
              },
              {
                icon: Shield,
                title: 'Trust & Safety',
                desc: 'Every member is verified. Rate and review after each exchange to keep the community safe and trustworthy for everyone.',
                color: '#2563eb',
                bg: '#eff6ff',
              },
              {
                icon: Target,
                title: 'Empowerment',
                desc: 'We empower Palestinians to use their skills, build connections, and create a self-sustaining support network for our community.',
                color: '#7c3aed',
                bg: '#f5f3ff',
              },
            ].map((value) => (
              <div key={value.title} style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #f3f4f6', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: value.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <value.icon style={{ width: '28px', height: '28px', color: value.color }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>{value.title}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.8 }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW POINTS WORK ===================== */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="section-label">Points System</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#111827', marginTop: '12px', marginBottom: '16px' }}>
              How <span style={{ color: '#059669' }}>Points</span> Work
            </h2>
            <p style={{ color: '#6b7280', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
              Points are based on the complexity and value of each service, inspired by fair salary standards.
            </p>
          </div>

          <div className="grid-cols-4-responsive" style={{ gap: '16px' }}>
            {[
              { step: '1', title: 'Sign Up', desc: 'Create your account and list your skills', color: '#059669' },
              { step: '2', title: 'Help Others', desc: 'Provide services to community members who need your skills', color: '#d97706' },
              { step: '3', title: 'Earn Points', desc: 'Receive points based on the service category and complexity', color: '#2563eb' },
              { step: '4', title: 'Get Help', desc: 'Use your earned points to request any service you need', color: '#7c3aed' },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: item.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, margin: '0 auto 16px' }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="gradient-hero" style={{ padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0 keffiyeh-pattern" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="container-custom" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
            From Gaza, <span style={{ color: '#fbbf24' }}>With Love</span> 🕊️
          </h2>
          <p style={{ color: 'rgba(167,243,208,0.7)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7, fontSize: '16px' }}>
            Takaful was built by Palestinians, for Palestinians. In times when resources
            are scarce, our skills become our greatest wealth. Together, we rebuild.
          </p>
          <p style={{ color: 'rgba(167,243,208,0.4)', marginTop: '24px', fontSize: '14px' }}>🇵🇸</p>
        </div>
      </section>
    </div>
  );
}
