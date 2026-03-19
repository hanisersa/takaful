'use client';

import { useState } from 'react';
import { Heart, Mail, Phone, MapPin, Send, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  };

  return (
    <div>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #010d06 0%, #064E3B 50%, #0d9466 100%)' }} />
        <div className="absolute inset-0 keffiyeh-pattern" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />

        <div className="container-custom relative z-10" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '16px' }}>
            Contact <span className="bg-linear-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">Us</span>
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(167,243,210,0.8)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Have a question or suggestion? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ===================== CONTENT ===================== */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container-custom">
          <div className="grid-cols-2-responsive" style={{ gap: '64px' }}>
            {/* Form */}
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                Send Us a Message
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '28px', lineHeight: 1.7 }}>
                We&apos;re here to help. Fill out the form and we&apos;ll get back to you.
              </p>

              {submitted && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', fontSize: '14px', fontWeight: 500, marginBottom: '20px' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                  Message sent! We&apos;ll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>First Name*</label>
                    <input type="text" required placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>Last Name*</label>
                    <input type="text" required placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>Email*</label>
                  <input type="email" required placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>Phone</label>
                  <input type="tel" placeholder="+970 59 XXX XXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>Message*</label>
                  <textarea rows={5} required placeholder="How can we help you?" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="input-field resize-none" />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '14px', width: '100%', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Send Message <Send style={{ width: '16px', height: '16px' }} />
                </button>
              </form>
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}>
              <div style={{ background: 'linear-gradient(135deg, #ecfdf5, #f0fdfa)', borderRadius: '20px', padding: '28px', border: '1px solid #a7f3d0' }}>
                <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '18px', marginBottom: '16px' }}>Get In Touch</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { icon: Mail, label: 'Email', value: 'support@takaful.ps', color: '#059669' },
                    { icon: Phone, label: 'Phone', value: '+970 59 123 4567', color: '#059669' },
                    { icon: MapPin, label: 'Location', value: 'Gaza, Palestine', color: '#059669' },
                    { icon: MessageSquare, label: 'WhatsApp', value: '+970 59 123 4567', color: '#059669' },
                  ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <item.icon style={{ width: '18px', height: '18px', color: item.color }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>{item.label}</p>
                        <p style={{ fontSize: '14px', color: '#111827', fontWeight: 600 }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#111827', borderRadius: '20px', padding: '28px', color: 'white' }}>
                <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>🕊️ From Gaza, With Love</h3>
                <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.7 }}>
                  Takaful was born from the belief that every skill matters. In times of hardship, our greatest resource is each other.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
