'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, ArrowLeft, CheckCircle2, Coins, MapPin, Clock, Tag, FileText,
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
  { name: 'Mechanic', emoji: '🔧' },
  { name: 'Transport', emoji: '🚗' },
  { name: 'Education', emoji: '📚' },
];

const locations = ['Gaza City', 'Khan Younis', 'Rafah', 'Deir al-Balah', 'Jabalia', 'Beit Hanoun', 'Remote / Online'];

export default function OfferServicePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', description: '', points: 20,
    location: '', availability: 'available', tags: '',
  });

  const totalSteps = 3;
  const [validationError, setValidationError] = useState('');

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!form.title.trim()) return 'Please enter a service title.';
      if (!form.category) return 'Please select a category.';
    }
    if (currentStep === 2) {
      if (!form.location) return 'Please select a location.';
      if (form.points < 5) return 'Points must be at least 5.';
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
        alert('Please log in first to offer a service.');
        router.push('/auth');
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
          availability: form.availability,
          tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('🎉 Your service has been posted! You\'ll be notified when someone requests it.');
        router.push('/services');
      } else {
        alert(data.error || 'Failed to create service');
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
            background: '#ecfdf5', color: '#059669', fontSize: '13px', fontWeight: 600,
            border: '1px solid #a7f3d0', marginBottom: '12px',
          }}>Offer A Service</span>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
            Share Your <span style={{ color: '#10b981' }}>Skills</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Help your community and earn points.</p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 700,
                background: step >= s ? '#10b981' : '#e5e7eb',
                color: step >= s ? 'white' : '#9ca3af',
              }}>
                {step > s ? <CheckCircle2 style={{ width: '18px', height: '18px' }} /> : s}
              </div>
              {s < 3 && (
                <div style={{
                  flex: 1, height: '4px', borderRadius: '999px',
                  background: step > s ? '#10b981' : '#e5e7eb',
                }} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #f3f4f6' }}>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <FileText style={{ width: '20px', height: '20px', color: '#10b981' }} /> Basic Information
                </h2>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Service Title*</label>
                  <input
                    type="text" placeholder="e.g., General Medical Consultation" required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '1.5px solid #e5e7eb', fontSize: '14px', color: '#111827',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
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
                          borderColor: form.category === cat.name ? '#10b981' : '#e5e7eb',
                          background: form.category === cat.name ? '#ecfdf5' : 'white',
                          color: form.category === cat.name ? '#059669' : '#6b7280',
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{cat.emoji}</span>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Description</label>
                  <textarea rows={4} placeholder="Describe your service in detail (optional)..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '1.5px solid #e5e7eb', fontSize: '14px', color: '#111827',
                      outline: 'none', resize: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <Tag style={{ width: '20px', height: '20px', color: '#10b981' }} /> Service Details
                </h2>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Points Required*</label>
                  {form.category === 'Other' ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <input type="range" min="5" max="100" step="5"
                          value={form.points}
                          onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                          style={{ flex: 1, accentColor: '#10b981' }}
                        />
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          background: '#fffbeb', color: '#b45309', padding: '6px 16px',
                          borderRadius: '999px', fontSize: '14px', fontWeight: 700,
                          border: '1px solid rgba(245,158,11,0.2)',
                        }}>
                          <Coins style={{ width: '16px', height: '16px' }} /> {form.points} pts
                        </div>
                      </div>
                      <p style={{ fontSize: '11px', color: '#d1d5db', marginTop: '6px' }}>Set a fair point value for your custom service.</p>
                    </>
                  ) : (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 18px', borderRadius: '12px',
                      background: '#ecfdf5', border: '1.5px solid #a7f3d0',
                    }}>
                      <span style={{ fontSize: '13px', color: '#047857', fontWeight: 600 }}>
                        {form.category ? `Based on ${form.category} market rate` : 'Select a category first'}
                      </span>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: '#fffbeb', color: '#b45309', padding: '6px 16px',
                        borderRadius: '999px', fontSize: '14px', fontWeight: 700,
                        border: '1px solid rgba(245,158,11,0.2)',
                      }}>
                        <Coins style={{ width: '16px', height: '16px' }} /> {form.points} pts
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Location*</label>
                  <select required value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '1.5px solid #e5e7eb', fontSize: '14px', color: '#111827',
                      outline: 'none', cursor: 'pointer', boxSizing: 'border-box',
                      background: 'white',
                    }}
                  >
                    <option value="">Select location...</option>
                    {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '10px' }}>Availability</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                      { value: 'available', label: 'Available Now', icon: '🟢' },
                      { value: 'next-day', label: 'Next Day', icon: '🟡' },
                      { value: 'this-week', label: 'This Week', icon: '🔵' },
                    ].map((opt) => (
                      <button key={opt.value} type="button"
                        onClick={() => setForm({ ...form, availability: opt.value })}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          gap: '6px', padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                          border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s',
                          borderColor: form.availability === opt.value ? '#10b981' : '#e5e7eb',
                          background: form.availability === opt.value ? '#ecfdf5' : 'white',
                          color: form.availability === opt.value ? '#059669' : '#6b7280',
                        }}
                      >
                        {opt.icon} {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Tags (comma separated)</label>
                  <input type="text" placeholder="e.g., Medicine, Urgent, Consultation"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '1.5px solid #e5e7eb', fontSize: '14px', color: '#111827',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <CheckCircle2 style={{ width: '20px', height: '20px', color: '#10b981' }} /> Review & Submit
                </h2>

                <div style={{ background: '#f9fafb', borderRadius: '16px', padding: '20px' }}>
                  {[
                    { label: 'Title', value: form.title },
                    { label: 'Category', value: form.category },
                  ].map((row) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: '13px', color: '#9ca3af' }}>{row.label}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{row.value || '—'}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '13px', color: '#9ca3af' }}>Points</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fffbeb', color: '#b45309', padding: '2px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 600 }}>
                      <Coins style={{ width: '12px', height: '12px' }} /> {form.points} pts
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '13px', color: '#9ca3af' }}>Location</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                      <MapPin style={{ width: '12px', height: '12px' }} /> {form.location || '—'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                    <span style={{ fontSize: '13px', color: '#9ca3af' }}>Availability</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                      <Clock style={{ width: '12px', height: '12px' }} /> {form.availability}
                    </span>
                  </div>
                  {form.description && (
                    <div style={{ paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                      <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 6px' }}>Description</p>
                      <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, margin: 0 }}>{form.description}</p>
                    </div>
                  )}
                </div>

                <div style={{ background: '#ecfdf5', borderRadius: '14px', padding: '16px', border: '1px solid #a7f3d0' }}>
                  <p style={{ fontSize: '14px', color: '#047857', fontWeight: 600, margin: 0 }}>
                    ✅ Your service will be visible to all community members once submitted.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {validationError && (
            <div style={{
              marginTop: '16px', padding: '12px 16px', borderRadius: '12px',
              background: '#fef2f2', border: '1px solid #fecaca',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ fontSize: '14px', color: '#dc2626', fontWeight: '600' }}>⚠️ {validationError}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
            {step > 1 ? (
              <button type="button" onClick={() => { setValidationError(''); setStep(step - 1); }} style={{
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px',
                fontWeight: 600, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer',
              }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back
              </button>
            ) : <div />}

            {step < totalSteps ? (
              <button type="button" onClick={handleNextStep} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #047857)',
                color: 'white', fontSize: '14px', fontWeight: 600,
                border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
              }}>
                Continue <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            ) : (
              <button type="submit" disabled={submitting} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px', borderRadius: '12px',
                background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #047857)',
                color: 'white', fontSize: '14px', fontWeight: 600,
                border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
              }}>
                {submitting ? 'Submitting...' : 'Submit Service'} <CheckCircle2 style={{ width: '16px', height: '16px' }} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
