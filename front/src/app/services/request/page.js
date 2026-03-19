'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Send,
  MapPin,
  Coins,
  AlertCircle,
  CheckCircle2,
  FileText,
  ArrowLeft,
  ArrowRight,
  Clock,
} from 'lucide-react';

const categoryPoints = {
  'Healthcare': 50,
  'Home Repairs': 30,
  'Technology': 45,
  'Construction': 35,
  'Barber': 15,
  'Tailor': 20,
  'Mechanic': 30,
  'Transport': 20,
  'Education': 25,
};

const categories = [
  { name: 'Healthcare', emoji: '🩺' },
  { name: 'Home Repairs', emoji: '🔧' },
  { name: 'Technology', emoji: '💻' },
  { name: 'Construction', emoji: '🏗️' },
  { name: 'Barber', emoji: '💈' },
  { name: 'Tailor', emoji: '🧵' },
  { name: 'Mechanic', emoji: '🔩' },
  { name: 'Transport', emoji: '🚗' },
  { name: 'Education', emoji: '📚' },
];

const locations = ['Gaza City', 'Khan Younis', 'Rafah', 'Deir al-Balah', 'Jabalia', 'Beit Hanoun', 'Remote / Online'];

export default function RequestServicePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    points: 20,
    location: '',
    urgency: 'normal',
  });

  const totalSteps = 3;

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!form.title.trim()) return 'Please describe what you need.';
      if (!form.category) return 'Please select a category.';
    }
    if (currentStep === 2) {
      if (!form.location) return 'Please select a location.';
    }
    return '';
  };

  const handleNextStep = () => {
    const error = validateStep(step);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('takaful_token');
      if (!token) {
        alert('Please log in first to request a service.');
        router.push('/login');
        return;
      }
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          description: form.description,
          points: form.points,
          location: form.location,
          type: 'request',
          urgency: form.urgency,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('🎉 Your request has been posted! Community members will reach out soon.');
        router.push('/services');
      } else {
        alert(data.error || 'Failed to post request');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: '96px', paddingBottom: '80px', minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: '999px',
            background: '#eff6ff', color: '#2563eb', fontSize: '13px', fontWeight: 600,
            border: '1px solid #bfdbfe', marginBottom: '12px',
          }}>Request Help</span>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
            Need <span style={{ color: '#2563eb' }}>Help?</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Post a request and let the community help you.</p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 700,
                background: step >= s ? '#2563eb' : '#e5e7eb',
                color: step >= s ? 'white' : '#9ca3af',
              }}>
                {step > s ? <CheckCircle2 style={{ width: '18px', height: '18px' }} /> : s}
              </div>
              {s < 3 && (
                <div style={{
                  flex: 1, height: '4px', borderRadius: '999px',
                  background: step > s ? '#2563eb' : '#e5e7eb',
                }} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #f3f4f6' }}>

            {/* Step 1: What do you need? */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <FileText style={{ width: '20px', height: '20px', color: '#2563eb' }} /> What Do You Need?
                </h2>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Describe your need*</label>
                  <input
                    type="text" placeholder="e.g., Need a plumber for kitchen sink" required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '1.5px solid #e5e7eb', fontSize: '14px', color: '#111827',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '10px' }}>Category*</label>
                  <div className="grid-cols-3-responsive" style={{ gap: '8px' }}>
                    {categories.map((cat) => (
                      <button key={cat.name} type="button"
                        onClick={() => setForm({ ...form, category: cat.name, points: categoryPoints[cat.name] ?? 20 })}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                          padding: '12px 6px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                          border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s',
                          borderColor: form.category === cat.name ? '#2563eb' : '#e5e7eb',
                          background: form.category === cat.name ? '#eff6ff' : 'white',
                          color: form.category === cat.name ? '#2563eb' : '#6b7280',
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{cat.emoji}</span>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Details (Optional)</label>
                  <textarea rows={4} placeholder="Describe in detail what you need help with..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '1.5px solid #e5e7eb', fontSize: '14px', color: '#111827',
                      outline: 'none', resize: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location & Urgency */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <MapPin style={{ width: '20px', height: '20px', color: '#2563eb' }} /> Location & Urgency
                </h2>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Where do you need help?*</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {locations.map((loc) => (
                      <button key={loc} type="button"
                        onClick={() => setForm({ ...form, location: loc })}
                        style={{
                          padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 500,
                          border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s',
                          borderColor: form.location === loc ? '#2563eb' : '#e5e7eb',
                          background: form.location === loc ? '#eff6ff' : 'white',
                          color: form.location === loc ? '#2563eb' : '#6b7280',
                        }}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '10px' }}>How urgent is this?</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { value: 'low', label: 'Low', desc: 'No rush', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: Clock },
                      { value: 'normal', label: 'Normal', desc: 'When possible', color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: Clock },
                      { value: 'urgent', label: 'Urgent', desc: 'ASAP', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: AlertCircle },
                    ].map((opt) => (
                      <button key={opt.value} type="button"
                        onClick={() => setForm({ ...form, urgency: opt.value })}
                        style={{
                          flex: '1 1 120px', padding: '14px 12px', borderRadius: '14px', textAlign: 'center',
                          border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s',
                          borderColor: form.urgency === opt.value ? opt.border : '#e5e7eb',
                          background: form.urgency === opt.value ? opt.bg : 'white',
                        }}
                      >
                        <opt.icon style={{
                          width: '18px', height: '18px', margin: '0 auto 6px',
                          color: form.urgency === opt.value ? opt.color : '#9ca3af',
                        }} />
                        <p style={{
                          fontSize: '13px', fontWeight: 700, margin: '0 0 2px',
                          color: form.urgency === opt.value ? opt.color : '#374151',
                        }}>{opt.label}</p>
                        <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '8px' }}>Points cost</label>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderRadius: '14px', background: '#eff6ff', border: '1px solid #bfdbfe',
                  }}>
                    <span style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: 600 }}>
                      {form.category ? `Based on ${form.category} rate` : 'Select a category first'}
                    </span>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: '#fffbeb', padding: '6px 14px', borderRadius: '999px',
                      fontSize: '14px', fontWeight: 700, color: '#b45309',
                    }}>
                      <Coins style={{ width: '15px', height: '15px' }} /> {form.points} pts
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <CheckCircle2 style={{ width: '20px', height: '20px', color: '#2563eb' }} /> Review Your Request
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Title', value: form.title },
                    { label: 'Category', value: form.category },
                    { label: 'Location', value: form.location },
                    { label: 'Urgency', value: form.urgency.charAt(0).toUpperCase() + form.urgency.slice(1) },
                    { label: 'Points', value: `${form.points} pts` },
                  ].map((item) => (
                    <div key={item.label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 16px', background: '#f9fafb', borderRadius: '12px',
                    }}>
                      <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{item.label}</span>
                      <span style={{ fontSize: '14px', color: '#111827', fontWeight: 600 }}>{item.value || '—'}</span>
                    </div>
                  ))}
                  {form.description && (
                    <div style={{ padding: '14px 16px', background: '#f9fafb', borderRadius: '12px' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Details</span>
                      <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.6 }}>{form.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Validation Error */}
            {validationError && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px',
                borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca',
                color: '#dc2626', fontSize: '13px', fontWeight: 500, marginTop: '16px',
              }}>
                <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                {validationError}
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {step > 1 && (
                <button type="button" onClick={() => { setStep(step - 1); setValidationError(''); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '14px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                    border: '1.5px solid #e5e7eb', background: 'white', color: '#374151',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back
                </button>
              )}
              {step < totalSteps ? (
                <button type="button" onClick={handleNextStep}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '14px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white',
                    border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                  }}
                >
                  Continue <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              ) : (
                <button type="submit" disabled={submitting}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '14px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                    background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white',
                    border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: submitting ? 'none' : '0 4px 14px rgba(37,99,235,0.3)',
                  }}
                >
                  {submitting ? 'Posting...' : <><Send style={{ width: '16px', height: '16px' }} /> Post Request</>}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
