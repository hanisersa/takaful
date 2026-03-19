'use client';

import Link from 'next/link';
import {
  Heart,
  ArrowRight,
  Coins,
  Handshake,
  Stethoscope,
  Wrench,
  GraduationCap,
  Laptop,
  Paintbrush,
  Truck,
  Baby,
  ChefHat,
  Sparkles,
  Users,
  Shield,
  Zap,
  BookOpen,
  Code,
  HeartPulse,
  Brain,
  Smartphone,
  Scissors,
  Car,
  Hammer,
  Activity,
  Home,
  Cpu,
  HardHat,
  ScissorsLineDashed,
  Shirt,
  Settings,
  TruckIcon,
  School,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CounterAnimation from '@/components/CounterAnimation';

/* ── Available service categories (what Takaful offers) ── */
const serviceCategories = [
  { name: 'Healthcare', icon: Activity, desc: 'Medical consultations, nursing, therapy', color: '#dc2626', bg: '#fef2f2' },
  { name: 'Home Repairs', icon: Home, desc: 'Plumbing, electrical, carpentry', color: '#2563eb', bg: '#eff6ff' },
  { name: 'Technology', icon: Cpu, desc: 'Web development, phone repair, IT support', color: '#0891b2', bg: '#ecfeff' },
  { name: 'Construction', icon: HardHat, desc: 'Building, masonry, structural work', color: '#92400e', bg: '#fef3c7' },
  { name: 'Barber', icon: ScissorsLineDashed, desc: 'Haircuts, grooming, styling', color: '#7c3aed', bg: '#f5f3ff' },
  { name: 'Tailor', icon: Shirt, desc: 'Sewing, clothing alterations, design', color: '#ec4899', bg: '#fdf2f8' },
  { name: 'Mechanic', icon: Settings, desc: 'Vehicle repair, engine maintenance', color: '#ea580c', bg: '#fff7ed' },
  { name: 'Transport', icon: TruckIcon, desc: 'Driving, delivery, logistics', color: '#1d4ed8', bg: '#eff6ff' },
  { name: 'Education', icon: School, desc: 'Tutoring, language lessons, courses', color: '#059669', bg: '#ecfdf5' },
];

/* ── Example services to showcase what's possible ── */
const exampleServices = [
  { title: 'General Medical Consultation', category: 'Healthcare', icon: HeartPulse, iconColor: '#dc2626', iconBg: '#fef2f2', points: 50 },
  { title: 'Plumbing & Water Systems', category: 'Home Repairs', icon: Wrench, iconColor: '#2563eb', iconBg: '#eff6ff', points: 30 },
  { title: 'Web Development & Design', category: 'Technology', icon: Code, iconColor: '#0891b2', iconBg: '#ecfeff', points: 45 },
  { title: 'Building & Masonry', category: 'Construction', icon: Hammer, iconColor: '#92400e', iconBg: '#fef3c7', points: 35 },
  { title: 'Haircut & Grooming', category: 'Barber', icon: Scissors, iconColor: '#7c3aed', iconBg: '#f5f3ff', points: 15 },
  { title: 'Clothing Alterations', category: 'Tailor', icon: Paintbrush, iconColor: '#ec4899', iconBg: '#fdf2f8', points: 20 },
  { title: 'Engine & Vehicle Repair', category: 'Mechanic', icon: Car, iconColor: '#ea580c', iconBg: '#fff7ed', points: 30 },
  { title: 'Driving & Delivery', category: 'Transport', icon: Truck, iconColor: '#1d4ed8', iconBg: '#eff6ff', points: 20 },
  { title: 'Arabic & English Tutoring', category: 'Education', icon: BookOpen, iconColor: '#059669', iconBg: '#ecfdf5', points: 25 },
  { title: 'Mobile Phone Repair', category: 'Technology', icon: Smartphone, iconColor: '#0891b2', iconBg: '#ecfeff', points: 25 },
  { title: 'Nursing & First Aid', category: 'Healthcare', icon: Brain, iconColor: '#7c3aed', iconBg: '#f5f3ff', points: 45 },
  { title: 'Math & Science Tutoring', category: 'Education', icon: GraduationCap, iconColor: '#059669', iconBg: '#ecfdf5', points: 25 },
];

export default function HomePage() {
  const { isLoggedIn } = useAuth();

  return (
    <div>
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden flex items-center" style={{ height: '100vh', paddingTop: '70px' }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 30%', backgroundRepeat: 'no-repeat' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(1,13,6,0.92) 0%, rgba(6,78,59,0.88) 30%, rgba(6,95,70,0.85) 50%, rgba(4,120,87,0.82) 75%, rgba(16,185,129,0.78) 100%)' }} />
        <div className="absolute inset-0 olive-branch">
          <div className="absolute inset-0 keffiyeh-pattern" />
          <div className="absolute inset-0 palestine-accent" />
          <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, borderTop: '50vh solid rgba(206,32,41,0.06)', borderRight: '15vw solid transparent', zIndex: 0 }} />
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>

        <div className="container-custom relative z-10 py-4">
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-2 rounded-full text-sm font-medium animate-fade-in" style={{ marginBottom: '14px' }}>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Community-Powered Skill Exchange Platform</span>
            </div>

            <h1 className="animate-fade-in-up" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: '800', color: 'white', lineHeight: '1.1', marginBottom: '12px' }}>
              Give Your Skills,{' '}
              <span className="relative">
                <span className="bg-linear-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">Shape The Future</span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-amber-300 to-amber-400 rounded-full" />
              </span>
            </h1>

            <p className="animate-fade-in-up" style={{ fontSize: '15px', color: 'rgba(167,243,210,0.8)', maxWidth: '620px', margin: '0 auto 24px', lineHeight: '1.6', animationDelay: '0.2s' }}>
              Exchange services with your community using points. A doctor helps
              a teacher, a plumber helps a nurse — together we rebuild Palestine,
              one skill at a time.
            </p>

            {/* CTA buttons */}
            <div className="animate-fade-in-up" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '14px', marginBottom: '28px', animationDelay: '0.3s' }}>
              {isLoggedIn ? (
                <>
                  <Link href="/services" className="btn-white" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', fontSize: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>
                    Browse Services <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/services/offer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)', border: '2px solid rgba(255,255,255,0.3)', padding: '14px 32px', borderRadius: '12px', fontWeight: '600', fontSize: '16px', transition: 'all 0.3s', textDecoration: 'none' }}>
                    Offer Your Skills
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register" className="btn-white" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', fontSize: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>
                    Join Takaful <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)', border: '2px solid rgba(255,255,255,0.3)', padding: '14px 32px', borderRadius: '12px', fontWeight: '600', fontSize: '16px', transition: 'all 0.3s', textDecoration: 'none' }}>
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 animate-fade-in-up" style={{ gap: '12px', animationDelay: '0.4s' }}>
              {[
                { value: 5200, suffix: '+', label: 'Active Members' },
                { value: 12800, suffix: '+', label: 'Services Exchanged' },
                { value: 48, suffix: '+', label: 'Service Categories' },
                { value: 98, suffix: '%', label: 'Satisfaction Rate' },
              ].map((stat) => (
                <div key={stat.label} style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: '800', color: 'white', marginBottom: '6px' }}>
                    <CounterAnimation end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p style={{ color: 'rgba(167,243,208,0.7)', fontSize: '13px', fontWeight: '500' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="py-28 bg-white">
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span className="section-label">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900" style={{ marginTop: '12px', marginBottom: '16px' }}>
              Exchange Skills, <span className="text-emerald-600">Not Money</span>
            </h2>
            <p style={{ color: '#6b7280', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' }}>
              Our points-based system makes it easy to give and receive help within the community.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: '80px', position: 'relative', flexWrap: 'wrap' }} className="steps-row">
              <div className="hidden md:block" style={{ position: 'absolute', top: '40px', left: '80px', right: '80px', height: '3px', background: 'linear-gradient(90deg, #a7f3d0, #10b981, #a7f3d0)', borderRadius: '4px', zIndex: 0 }} />
              {[
                { step: '01', icon: Heart, title: 'Offer Your Skills', desc: 'Sign up and list the services you can provide — whether it\'s medical care, teaching, repairs, or anything your community needs.', color: 'from-emerald-500 to-teal-600' },
                { step: '02', icon: Coins, title: 'Earn Points', desc: 'Every time you help someone, you earn points. Points reflect your contribution and unlock services from others.', color: 'from-amber-500 to-orange-600' },
                { step: '03', icon: Handshake, title: 'Get Help Back', desc: 'Use your earned points to request services from other members. A doctor for a plumber, a teacher for an electrician.', color: 'from-blue-500 to-indigo-600' },
              ].map((item) => (
                <div key={item.step} className="group" style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '260px' }}>
                  <div className={`bg-linear-to-br ${item.color} group-hover:scale-110 transition-transform`} style={{ width: '80px', height: '80px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px', boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div style={{ display: 'inline-block', background: '#111827', color: 'white', fontSize: '11px', fontWeight: '700', padding: '5px 14px', borderRadius: '8px', marginBottom: '18px' }}>Step {item.step}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.8', textAlign: 'center' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SERVICE CATEGORIES ===================== */}
      <section style={{ padding: '80px 0' }} className="bg-linear-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-label">Service Categories</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '800', color: '#111827', marginTop: '12px', marginBottom: '16px' }}>
              What You Can <span style={{ color: '#059669' }}>Exchange</span>
            </h2>
            <p style={{ color: '#6b7280', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
              From healthcare to home repairs, education to tech — every skill has value in our community.
            </p>
          </div>

          <div className="grid-cols-3-responsive" style={{ gap: '16px' }}>
            {serviceCategories.map((cat) => (
              <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'white', borderRadius: '16px', padding: '28px 16px', border: '1px solid #f3f4f6', transition: 'all 0.2s' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <cat.icon style={{ width: '26px', height: '26px', color: cat.color }} />
                </div>
                <h3 style={{ fontWeight: '700', color: '#111827', fontSize: '15px', marginBottom: '6px' }}>{cat.name}</h3>
                <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.5 }}>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== EXAMPLE SERVICES ===================== */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-label">Available Services</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '800', color: '#111827', marginTop: '12px', marginBottom: '16px' }}>
              Services You Can <span style={{ color: '#059669' }}>Access</span>
            </h2>
            <p style={{ color: '#6b7280', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
              Here are some of the services offered by community members. Sign in to browse, request, or offer your own.
            </p>
          </div>

          <div className="grid-cols-3-responsive" style={{ gap: '20px' }}>
            {exampleServices.map((service) => (
              <div key={service.title} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f9fafb', borderRadius: '16px', padding: '20px', border: '1px solid #f3f4f6', transition: 'all 0.2s' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: service.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <service.icon style={{ width: '22px', height: '22px', color: service.iconColor }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{service.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{service.category}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: 600, color: '#b45309', background: '#fffbeb', padding: '2px 8px', borderRadius: '999px' }}>
                      <Coins style={{ width: '11px', height: '11px' }} /> {service.points} pts
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA after services */}
          {!isLoggedIn && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '15px' }}>
                Sign in to browse all services, see providers, and start exchanging skills.
              </p>
              <Link href="/register" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', fontSize: '15px' }}>
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===================== WHY TAKAFUL ===================== */}
      <section className="gradient-hero" style={{ padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 keffiyeh-pattern" />
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
        </div>
        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ color: '#6ee7b7', fontSize: '13px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Why Takaful</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '800', color: 'white', marginTop: '12px', marginBottom: '16px' }}>
              Together We Are <span style={{ color: '#fbbf24' }}>Stronger</span>
            </h2>
          </div>

          <div className="grid-cols-3-responsive" style={{ gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
            {[
              { icon: Shield, title: 'Trusted Community', desc: 'Every member is verified. Rate and review after each service exchange.' },
              { icon: Coins, title: 'No Money Needed', desc: 'Exchange skills using points. Help someone, earn points, get help back.' },
              { icon: Users, title: 'Built by Palestinians', desc: 'Made for our community. Every skill matters, every person deserves help.' },
            ].map((item) => (
              <div key={item.title} style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', margin: '0 auto 20px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon style={{ width: '26px', height: '26px', color: '#6ee7b7' }} />
                </div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: 'rgba(167,243,208,0.7)', fontSize: '14px', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="gradient-primary" style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="container-custom" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: '800', color: 'white', marginBottom: '20px' }}>
            {isLoggedIn ? 'Start Helping Today' : 'Join The Movement'}
          </h2>
          <p style={{ color: 'rgba(167,243,208,0.8)', maxWidth: '520px', margin: '0 auto 40px', lineHeight: '1.7', fontSize: '17px' }}>
            Your skills can change someone&apos;s life. Join the Takaful community today.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            {isLoggedIn ? (
              <>
                <Link href="/services/offer" className="btn-white" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 36px', fontSize: '16px' }}>
                  Offer Your Skills <Heart className="w-4 h-4" fill="currentColor" />
                </Link>
                <Link href="/services" style={{ color: 'white', border: '2px solid rgba(255,255,255,0.4)', padding: '16px 36px', borderRadius: '12px', fontWeight: '600', fontSize: '16px', textDecoration: 'none' }}>
                  Browse Services
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" className="btn-white" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 36px', fontSize: '16px' }}>
                  Create Free Account <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" style={{ color: 'white', border: '2px solid rgba(255,255,255,0.4)', padding: '16px 36px', borderRadius: '12px', fontWeight: '600', fontSize: '16px', textDecoration: 'none' }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
