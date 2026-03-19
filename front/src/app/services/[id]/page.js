'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowLeft,
  Star,
  MapPin,
  Coins,
  Clock,
  MessageCircle,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Shield,
  AlertCircle,
  ThumbsUp,
  User,
  Calendar,
  ArrowRight,
  Heart,
  HeartPulse,
  Wrench,
  BookOpen,
  Code,
  Zap,
  Hammer,
  Brain,
  ChefHat,
  Smartphone,
  Scissors,
  Car,
  Loader2,
  Globe,
  GraduationCap,
  Laptop,
  Paintbrush,
  Truck,
  Baby,
} from 'lucide-react';

const categoryIconMap = {
  'Healthcare': { icon: HeartPulse, color: '#dc2626', bg: '#fef2f2' },
  'Home Repairs': { icon: Wrench, color: '#2563eb', bg: '#eff6ff' },
  'Technology': { icon: Laptop, color: '#0891b2', bg: '#ecfeff' },
  'Construction': { icon: Hammer, color: '#92400e', bg: '#fef3c7' },
  'Barber': { icon: Scissors, color: '#7c3aed', bg: '#f5f3ff' },
  'Tailor': { icon: Paintbrush, color: '#ec4899', bg: '#fdf2f8' },
  'Mechanic': { icon: Car, color: '#ea580c', bg: '#fff7ed' },
  'Transport': { icon: Truck, color: '#1d4ed8', bg: '#eff6ff' },
  'Education': { icon: GraduationCap, color: '#059669', bg: '#ecfdf5' },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const serviceId = params.id;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  // Determine if the current user is the provider of this service
  const isProvider = user && service && service.providerId === user._id;

  const [message, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmStep, setConfirmStep] = useState(0); // 0: none, 1: requested, 2: in-progress, 3: completed
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Provider-side state
  const [incomingRequests, setIncomingRequests] = useState([]);

  // Fetch service from API
  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/services/${serviceId}`);
        const data = await res.json();
        if (res.ok && data.service) {
          const s = data.service;
          const catInfo = categoryIconMap[s.category] || categoryIconMap['Other'];
          setService({
            ...s,
            icon: catInfo.icon,
            iconColor: catInfo.color,
            iconBg: catInfo.bg,
            tags: s.tags || [],
            reviews: s.reviews || 0,
            availability: s.availability === 'available' ? 'Available' : s.availability === 'busy' ? 'Busy' : s.availability || 'Available',
          });
        }
      } catch (err) {
        console.error('Failed to fetch service:', err);
      } finally {
        setLoading(false);
      }
    }
    if (serviceId) fetchService();
  }, [serviceId]);

  // Check if current user already has a transaction for this service (requester side)
  // Polls every 10 seconds so the UI updates when provider accepts/refuses
  useEffect(() => {
    async function checkExistingRequest() {
      if (!user || !service || isProvider) return;
      try {
        const token = localStorage.getItem('takaful_token');
        const res = await fetch('/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.transactions) {
          const myRequest = data.transactions.find(
            t => {
              const sId = t.service?.id || t.service;
              return sId === serviceId && t.isRequester && !['refused', 'cancelled'].includes(t.status);
            }
          );
          if (myRequest) {
            setActiveTransaction(myRequest);
            setShowConfirmation(true);
            if (myRequest.status === 'completed') {
              setConfirmStep(3);
            } else if (myRequest.status === 'accepted' || myRequest.status === 'in_progress') {
              // Check confirmation flags
              if (myRequest.requesterConfirmed && !myRequest.providerConfirmed) {
                setConfirmStep(2.5); // requester confirmed, waiting for provider
              } else if (!myRequest.requesterConfirmed && myRequest.providerConfirmed) {
                setConfirmStep(2.7); // provider confirmed, requester needs to confirm
              } else {
                setConfirmStep(2); // accepted, no one confirmed yet
              }
            } else if (myRequest.status === 'pending') {
              setConfirmStep(1);
            }
          } else {
            // Request was refused or cancelled — reset
            setShowConfirmation(false);
            setConfirmStep(0);
            setActiveTransaction(null);
          }
        }
      } catch (err) {
        console.error('Failed to check existing request:', err);
      }
    }
    if (user && service) {
      checkExistingRequest();
      // Poll every 10 seconds to detect provider response
      const interval = setInterval(checkExistingRequest, 10000);
      return () => clearInterval(interval);
    }
  }, [user, service, isProvider, serviceId]);

  // Fetch incoming transactions for this service (if provider)
  useEffect(() => {
    async function fetchTransactions() {
      if (!isProvider) return;
      try {
        const token = localStorage.getItem('takaful_token');
        const res = await fetch('/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.transactions) {
          // Filter transactions for this specific service where user is provider
          const incoming = data.transactions
            .filter(t => (t.service?.id === serviceId) && !t.isRequester)
            .map(t => ({
              id: t.id,
              name: t.requester?.name || 'Unknown',
              phone: t.requester?.phone || '',
              message: t.message || 'No message provided',
              time: new Date(t.createdAt).toLocaleDateString(),
              status: t.status,
              urgent: false,
              accepted: t.status === 'accepted' || t.status === 'in_progress' || t.status === 'completed',
              declined: t.status === 'refused',
              started: t.status === 'in_progress' || t.status === 'completed',
              completed: t.status === 'completed',
              requesterConfirmed: !!t.requesterConfirmed,
              providerConfirmed: !!t.providerConfirmed,
            }));
          setIncomingRequests(incoming);
        }
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      }
    }
    if (user && service) fetchTransactions();
  }, [isProvider, user, service, serviceId]);

  if (loading) {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', minHeight: '100vh', background: '#f9fafb' }}>
        <Loader2 style={{ width: '40px', height: '40px', color: '#059669', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontSize: '16px', color: '#6b7280' }}>Loading service...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!service) {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', minHeight: '100vh', background: '#f9fafb' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>😕</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Service Not Found</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>The service you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/services" style={{
          padding: '12px 28px', borderRadius: '12px', background: '#059669', color: 'white',
          fontSize: '14px', fontWeight: '600', textDecoration: 'none',
        }}>
          Back to Services
        </Link>
      </div>
    );
  }

  const Icon = service.icon;

  const handleRequestService = async () => {
    const token = localStorage.getItem('takaful_token');
    if (!token) {
      alert('Please log in first to request a service.');
      router.push('/auth');
      return;
    }
    setRequesting(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          serviceId: service.id,
          message: message || 'I would like to request this service.',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveTransaction(data.transaction);
        setConfirmStep(1);
        setShowConfirmation(true);
      } else {
        alert(data.error || 'Failed to request service');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setRequesting(false);
    }
  };

  const handleProviderAccept = async (txId) => {
    const token = localStorage.getItem('takaful_token');
    try {
      const res = await fetch(`/api/transactions/${txId}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'accept' }),
      });
      const data = await res.json();
      if (res.ok) {
        setIncomingRequests(prev => prev.map(r => r.id === txId ? { ...r, status: 'accepted', accepted: true } : r));
      } else {
        alert(data.error || 'Failed to accept');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleProviderDecline = async (txId) => {
    const token = localStorage.getItem('takaful_token');
    try {
      const res = await fetch(`/api/transactions/${txId}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'refuse' }),
      });
      const data = await res.json();
      if (res.ok) {
        setIncomingRequests(prev => prev.map(r => r.id === txId ? { ...r, status: 'refused', declined: true } : r));
      } else {
        alert(data.error || 'Failed to decline');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleProviderComplete = async (txId) => {
    const token = localStorage.getItem('takaful_token');
    try {
      const res = await fetch(`/api/transactions/${txId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        if (data.status === 'completed') {
          setIncomingRequests(prev => prev.map(r => r.id === txId ? { ...r, status: 'completed', completed: true, providerConfirmed: true, requesterConfirmed: true } : r));
        } else {
          // Provider confirmed but waiting for requester
          setIncomingRequests(prev => prev.map(r => r.id === txId ? { ...r, providerConfirmed: true } : r));
        }
      } else {
        alert(data.error || 'Failed to confirm');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // Requester confirms the job is finished → calls complete API
  const handleConfirmCompleted = async () => {
    const token = localStorage.getItem('takaful_token');
    const txId = activeTransaction?.id || activeTransaction?._id;
    if (!txId) {
      alert('No active transaction found.');
      return;
    }
    try {
      const res = await fetch(`/api/transactions/${txId}/complete`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        if (data.status === 'completed') {
          setConfirmStep(3);
        } else {
          // Requester confirmed, waiting for provider
          setConfirmStep(2.5);
        }
      } else {
        alert(data.error || 'Failed to confirm');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      alert(`Message sent to ${service.provider}: "${message}"`);
      setMessage('');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(`Contact request sent to ${service.provider}!\nName: ${contactForm.name}\nPhone: ${contactForm.phone}\nMessage: ${contactForm.message}`);
    setContactForm({ name: '', phone: '', message: '' });
    setShowContactForm(false);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (rating > 0 && reviewText.trim()) {
      alert(`Review submitted! Rating: ${rating}/5`);
      setRating(0);
      setReviewText('');
    }
  };

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px', minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '12px', border: '1px solid #e5e7eb',
            background: 'white', color: '#374151', fontSize: '14px', fontWeight: '600',
            cursor: 'pointer', marginBottom: '24px', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#a7f3d0'; e.currentTarget.style.color = '#059669'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Back to Services
        </button>

        {/* Service Hero */}
        <div style={{
          background: 'white', borderRadius: '24px', overflow: 'hidden',
          border: '1px solid #e5e7eb', marginBottom: '24px',
        }}>
          {/* Hero Banner */}
          <div style={{
            position: 'relative', height: '220px',
            background: `linear-gradient(135deg, ${service.iconBg} 0%, ${service.iconBg}cc 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: `${service.iconColor}15` }} />
            <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: `${service.iconColor}0a` }} />
            <div style={{
              width: '100px', height: '100px', borderRadius: '24px', background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(0,0,0,0.1)', zIndex: 1,
            }}>
              <Icon style={{ width: '48px', height: '48px', color: service.iconColor }} />
            </div>
            {/* Category */}
            <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
              <span style={{
                background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                color: '#047857', fontSize: '12px', fontWeight: '700', padding: '6px 14px',
                borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>{service.category}</span>
            </div>
            {/* Points */}
            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: 'white', fontSize: '14px', fontWeight: '700', padding: '8px 16px', borderRadius: '10px',
              }}>
                <Coins style={{ width: '16px', height: '16px' }} />
                {service.points} Points
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 400px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '12px', lineHeight: '1.3' }}>
                  {service.title}
                </h1>

                {/* Provider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                  }}>👤</div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#111827', fontSize: '16px' }}>{service.provider}</p>
                    <p style={{ fontSize: '13px', color: '#9ca3af' }}>Service Provider</p>
                  </div>
                </div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} style={{
                      width: '18px', height: '18px',
                      color: i < Math.floor(service.rating) ? '#f59e0b' : '#d1d5db',
                      fill: i < Math.floor(service.rating) ? '#f59e0b' : 'none',
                    }} />
                  ))}
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginLeft: '4px' }}>
                    {service.rating}
                  </span>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    ({service.reviews} reviews)
                  </span>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#6b7280' }}>
                    <MapPin style={{ width: '16px', height: '16px', color: '#059669' }} />
                    {service.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#6b7280' }}>
                    <Clock style={{ width: '16px', height: '16px', color: '#059669' }} />
                    {service.availability}
                  </span>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {service.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: '12px', fontWeight: '600', background: '#f3f4f6',
                      color: '#4b5563', padding: '6px 14px', borderRadius: '8px',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '0 0 auto', minWidth: '220px' }}>
                {isProvider ? (
                  <>
                    <Link
                      href="/dashboard/notifications"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '14px 28px', borderRadius: '14px', border: 'none',
                        background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                        color: 'white', fontSize: '15px', fontWeight: '700',
                        textDecoration: 'none', boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                      }}
                    >
                      📥 View Requests
                      <span style={{
                        background: 'rgba(255,255,255,0.25)', padding: '2px 10px',
                        borderRadius: '999px', fontSize: '12px',
                      }}>
                        {incomingRequests.filter(r => !r.accepted && !r.declined).length}
                      </span>
                    </Link>
                    <div style={{
                      background: '#eff6ff', borderRadius: '14px', padding: '14px',
                      border: '1px solid #bfdbfe', textAlign: 'center',
                    }}>
                      <p style={{ fontSize: '13px', color: '#1e40af', margin: 0, fontWeight: '500' }}>
                        👋 This is your service — manage incoming requests below
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleRequestService}
                      disabled={confirmStep > 0 || requesting}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '14px 28px', borderRadius: '14px', border: 'none',
                        background: confirmStep > 0 || requesting ? '#d1d5db' : 'linear-gradient(135deg, #059669, #10b981)',
                        color: 'white', fontSize: '15px', fontWeight: '700', cursor: confirmStep > 0 || requesting ? 'default' : 'pointer',
                        transition: 'all 0.2s', boxShadow: confirmStep > 0 || requesting ? 'none' : '0 4px 12px rgba(5,150,105,0.3)',
                      }}
                    >
                      {requesting ? (
                        <>Requesting...</>
                      ) : confirmStep > 0 ? (
                        <><CheckCircle2 style={{ width: '18px', height: '18px' }} /> Requested</>
                      ) : (
                        <><Coins style={{ width: '18px', height: '18px' }} /> Request Service ({service.points} pts)</>
                      )}
                    </button>
                    <button
                      onClick={() => setShowContactForm(!showContactForm)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '14px 28px', borderRadius: '14px',
                        border: '2px solid #059669', background: 'white',
                        color: '#059669', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <MessageCircle style={{ width: '18px', height: '18px' }} />
                      Contact Provider
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: 2 columns */}
        <div className="grid-1fr-380" style={{ gap: '24px', alignItems: 'start' }}>

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Description */}
            <div style={{
              background: 'white', borderRadius: '20px', padding: '28px',
              border: '1px solid #e5e7eb',
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📋 About This Service
              </h2>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.8' }}>
                {service.description}
              </p>
            </div>

            {/* ===== PROVIDER PANEL: Incoming Requests ===== */}
            {isProvider && (
              <div style={{
                background: 'white', borderRadius: '20px', padding: '28px',
                border: '2px solid #bfdbfe',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    📥 Incoming Requests
                    <span style={{
                      fontSize: '12px', fontWeight: '700', padding: '3px 10px',
                      borderRadius: '999px', background: '#fef2f2', color: '#ef4444',
                    }}>
                      {incomingRequests.filter(r => !r.accepted && !r.declined).length} new
                    </span>
                  </h2>
                  <Link href="/dashboard/notifications" style={{
                    fontSize: '13px', color: '#059669', fontWeight: '600', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    View All <ArrowRight style={{ width: '14px', height: '14px' }} />
                  </Link>
                </div>

                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
                  People requesting your service. Accept to begin the service flow.
                </p>

                {incomingRequests.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                    <p style={{ fontSize: '40px', marginBottom: '8px' }}>📭</p>
                    <p style={{ fontSize: '14px' }}>No incoming requests yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {incomingRequests.map((req) => (
                      <div key={req.id} style={{
                        background: req.completed ? '#ecfdf5' : req.started ? '#f5f3ff' : req.accepted ? '#eff6ff' : req.declined ? '#fef2f2' : '#f9fafb',
                        borderRadius: '16px', padding: '20px',
                        border: `1.5px solid ${req.completed ? '#a7f3d0' : req.started ? '#ddd6fe' : req.accepted ? '#bfdbfe' : req.declined ? '#fecaca' : '#e5e7eb'}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <p style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: 0 }}>
                                {req.name}
                              </p>
                              {req.urgent && !req.accepted && !req.declined && (
                                <span style={{
                                  fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                                  borderRadius: '4px', background: '#fef2f2', color: '#dc2626',
                                }}>URGENT</span>
                              )}
                              {req.accepted && !req.started && (
                                <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb' }}>Accepted</span>
                              )}
                              {req.started && !req.completed && (
                                <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', background: '#f5f3ff', color: '#7c3aed' }}>In Progress</span>
                              )}
                              {req.completed && (
                                <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', background: '#ecfdf5', color: '#059669' }}>Completed ✓</span>
                              )}
                              {req.declined && (
                                <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', background: '#fef2f2', color: '#dc2626' }}>Declined</span>
                              )}
                            </div>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>📞 {req.phone} · {req.time}</p>
                          </div>
                        </div>

                        {/* Client message */}
                        <div style={{
                          background: 'white', borderRadius: '10px', padding: '12px',
                          border: '1px solid #e5e7eb', marginBottom: '14px',
                        }}>
                          <p style={{ fontSize: '13px', color: '#374151', margin: 0, fontStyle: 'italic' }}>
                            &ldquo;{req.message}&rdquo;
                          </p>
                        </div>

                        {/* Action buttons by state */}
                        {!req.accepted && !req.declined && (
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => handleProviderAccept(req.id)}
                              style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                padding: '12px', borderRadius: '12px', border: 'none',
                                background: 'linear-gradient(135deg, #059669, #10b981)',
                                color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                              }}
                            >
                              <CheckCircle2 style={{ width: '16px', height: '16px' }} /> Accept
                            </button>
                            <button
                              onClick={() => handleProviderDecline(req.id)}
                              style={{
                                padding: '12px 20px', borderRadius: '12px',
                                border: '2px solid #fecaca', background: '#fef2f2',
                                color: '#dc2626', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                              }}
                            >
                              Decline
                            </button>
                          </div>
                        )}

                        {req.accepted && !req.completed && !req.declined && (
                          <div>
                            {!req.providerConfirmed ? (
                              <button
                                onClick={() => handleProviderComplete(req.id)}
                                style={{
                                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                  padding: '12px', borderRadius: '12px', border: 'none',
                                  background: 'linear-gradient(135deg, #059669, #10b981)',
                                  color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                }}
                              >
                                <CheckCircle2 style={{ width: '16px', height: '16px' }} /> Confirm Job is Done
                              </button>
                            ) : (
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '12px', borderRadius: '12px',
                                background: '#fffbeb', border: '1px solid #fde68a',
                              }}>
                                <Clock style={{ width: '18px', height: '18px', color: '#d97706' }} />
                                <span style={{ fontSize: '13px', color: '#92400e', fontWeight: '600' }}>
                                  ✅ You confirmed — waiting for {req.name} to confirm
                                </span>
                              </div>
                            )}
                            {req.requesterConfirmed && !req.providerConfirmed && (
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                marginTop: '8px', padding: '8px 12px', borderRadius: '8px',
                                background: '#eff6ff', border: '1px solid #bfdbfe',
                              }}>
                                <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: '500' }}>
                                  💡 {req.name} has confirmed. Please confirm from your side.
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {req.completed && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '12px', borderRadius: '12px',
                            background: '#ecfdf5', border: '1px solid #a7f3d0',
                          }}>
                            <CheckCircle2 style={{ width: '18px', height: '18px', color: '#059669' }} />
                            <span style={{ fontSize: '13px', color: '#047857', fontWeight: '600' }}>
                              Service completed! {service.points} points earned 🎉
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===== REQUESTER PANEL: Service Confirmation Tracker ===== */}
            {/* Service Confirmation Tracker */}
            {showConfirmation && (
              <div style={{
                background: 'white', borderRadius: '20px', padding: '28px',
                border: '2px solid #a7f3d0',
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield style={{ width: '20px', height: '20px', color: '#059669' }} />
                  Service Status & Confirmation
                </h2>

                {/* Progress Steps */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '28px' }}>
                  {[
                    { step: 1, label: 'Requested', desc: 'Waiting for provider' },
                    { step: 2, label: 'Accepted', desc: 'Confirm job done' },
                    { step: 3, label: 'Completed', desc: 'Points transferred' },
                  ].map((s, i) => (
                    <div key={s.step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: '0 0 auto' }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px', fontWeight: '700',
                          background: Math.floor(confirmStep) >= s.step ? '#059669' : '#e5e7eb',
                          color: Math.floor(confirmStep) >= s.step ? 'white' : '#9ca3af',
                          transition: 'all 0.3s',
                          boxShadow: Math.floor(confirmStep) >= s.step ? '0 4px 12px rgba(5,150,105,0.3)' : 'none',
                        }}>
                          {Math.floor(confirmStep) > s.step ? (
                            <CheckCircle2 style={{ width: '20px', height: '20px' }} />
                          ) : Math.floor(confirmStep) === s.step ? (
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }} />
                          ) : s.step}
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: Math.floor(confirmStep) >= s.step ? '#059669' : '#9ca3af', marginTop: '8px' }}>
                          {s.label}
                        </p>
                        <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                          {s.desc}
                        </p>
                      </div>
                      {i < 2 && (
                        <div style={{
                          flex: 1, height: '3px', borderRadius: '999px', margin: '0 8px',
                          background: Math.floor(confirmStep) > s.step ? '#059669' : '#e5e7eb',
                          transition: 'all 0.3s', marginBottom: '40px',
                        }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Status Messages & Actions */}
                {confirmStep === 1 && (
                  <div style={{
                    background: '#fffbeb', borderRadius: '14px', padding: '20px',
                    border: '1px solid #fde68a', display: 'flex', alignItems: 'flex-start', gap: '12px',
                  }}>
                    <Clock style={{ width: '20px', height: '20px', color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>⏳ Waiting for {service.provider}</p>
                      <p style={{ fontSize: '14px', color: '#a16207', marginBottom: '0' }}>
                        Your request has been sent. {service.provider} needs to accept or refuse your request before you can proceed. This page will update automatically.
                      </p>
                    </div>
                  </div>
                )}

                {confirmStep === 2 && (
                  <div style={{
                    background: '#eff6ff', borderRadius: '14px', padding: '20px',
                    border: '1px solid #bfdbfe', display: 'flex', alignItems: 'flex-start', gap: '12px',
                  }}>
                    <CheckCircle2 style={{ width: '20px', height: '20px', color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>✅ {service.provider} Accepted!</p>
                      <p style={{ fontSize: '14px', color: '#3b82f6', marginBottom: '12px' }}>
                        The provider has accepted your request and the service is underway. Once the work is finished, confirm below to transfer <strong>{service.points} points</strong> to {service.provider}.
                      </p>
                      <button
                        onClick={handleConfirmCompleted}
                        style={{
                          padding: '12px 24px', borderRadius: '12px', border: 'none',
                          background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontSize: '14px',
                          fontWeight: '700', cursor: 'pointer', display: 'flex',
                          alignItems: 'center', gap: '8px',
                          boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                        }}
                      >
                        <Coins style={{ width: '16px', height: '16px' }} />
                        Confirm Job is Done
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2.5: Requester confirmed, waiting for provider */}
                {confirmStep === 2.5 && (
                  <div style={{
                    background: '#fffbeb', borderRadius: '14px', padding: '20px',
                    border: '1px solid #fde68a', display: 'flex', alignItems: 'flex-start', gap: '12px',
                  }}>
                    <Clock style={{ width: '20px', height: '20px', color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>✅ You Confirmed — Waiting for {service.provider}</p>
                      <p style={{ fontSize: '14px', color: '#a16207', marginBottom: '0' }}>
                        You have confirmed the job is done. Waiting for {service.provider} to also confirm before <strong>{service.points} points</strong> are transferred. This page will update automatically.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2.7: Provider confirmed, requester needs to confirm */}
                {confirmStep === 2.7 && (
                  <div style={{
                    background: '#eff6ff', borderRadius: '14px', padding: '20px',
                    border: '1px solid #bfdbfe', display: 'flex', alignItems: 'flex-start', gap: '12px',
                  }}>
                    <AlertCircle style={{ width: '20px', height: '20px', color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>💡 {service.provider} Confirmed — Your Turn!</p>
                      <p style={{ fontSize: '14px', color: '#3b82f6', marginBottom: '12px' }}>
                        {service.provider} has confirmed the job is done. Please confirm from your side to transfer <strong>{service.points} points</strong>.
                      </p>
                      <button
                        onClick={handleConfirmCompleted}
                        style={{
                          padding: '12px 24px', borderRadius: '12px', border: 'none',
                          background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontSize: '14px',
                          fontWeight: '700', cursor: 'pointer', display: 'flex',
                          alignItems: 'center', gap: '8px',
                          boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                        }}
                      >
                        <Coins style={{ width: '16px', height: '16px' }} />
                        Confirm & Transfer {service.points} Points
                      </button>
                    </div>
                  </div>
                )}

                {confirmStep === 3 && (
                  <div style={{
                    background: '#ecfdf5', borderRadius: '14px', padding: '20px',
                    border: '1px solid #a7f3d0', display: 'flex', alignItems: 'flex-start', gap: '12px',
                  }}>
                    <CheckCircle2 style={{ width: '20px', height: '20px', color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', color: '#047857', marginBottom: '4px' }}>Service Completed! 🎉</p>
                      <p style={{ fontSize: '14px', color: '#059669', marginBottom: '6px' }}>
                        The service has been completed and <strong>{service.points} points</strong> have been transferred to {service.provider}. Thank you for using Hack In!
                      </p>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        Please leave a review below to help the community.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Review Section (shows after completion) */}
            {confirmStep === 3 && (
              <div style={{
                background: 'white', borderRadius: '20px', padding: '28px',
                border: '1px solid #e5e7eb',
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ThumbsUp style={{ width: '20px', height: '20px', color: '#059669' }} />
                  Leave a Review
                </h2>
                <form onSubmit={handleSubmitReview}>
                  {/* Star Rating */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '8px' }}>
                      Rate your experience
                    </label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          onClick={() => setRating(s)}
                          style={{
                            width: '28px', height: '28px', cursor: 'pointer',
                            color: s <= rating ? '#f59e0b' : '#d1d5db',
                            fill: s <= rating ? '#f59e0b' : 'none',
                            transition: 'all 0.15s',
                          }}
                        />
                      ))}
                      {rating > 0 && (
                        <span style={{ marginLeft: '8px', fontSize: '14px', color: '#6b7280', alignSelf: 'center' }}>
                          {rating}/5
                        </span>
                      )}
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Share your experience with this service..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '12px',
                      border: '2px solid #e5e7eb', fontSize: '14px', color: '#111827',
                      outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: '14px',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px', borderRadius: '12px', border: 'none',
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                  >
                    <Send style={{ width: '15px', height: '15px' }} />
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Contact Info Card */}
            <div style={{
              background: 'white', borderRadius: '20px', padding: '24px',
              border: '1px solid #e5e7eb',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User style={{ width: '18px', height: '18px', color: '#059669' }} />
                Provider Contact
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Phone style={{ width: '18px', height: '18px', color: '#059669' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Phone</p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{service.phone}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Mail style={{ width: '18px', height: '18px', color: '#059669' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Email</p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{service.email}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <MapPin style={{ width: '18px', height: '18px', color: '#059669' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Location</p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{service.location}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Calendar style={{ width: '18px', height: '18px', color: '#059669' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Availability</p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: service.availability === 'Available' ? '#059669' : '#d97706' }}>
                      {service.availability}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Message */}
            <div style={{
              background: 'white', borderRadius: '20px', padding: '24px',
              border: '1px solid #e5e7eb',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageCircle style={{ width: '18px', height: '18px', color: '#059669' }} />
                Quick Message
              </h3>
              <form onSubmit={handleSendMessage}>
                <textarea
                  rows={3}
                  placeholder={`Ask ${service.provider} a question...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '12px',
                    border: '2px solid #e5e7eb', fontSize: '14px', color: '#111827',
                    outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: '12px',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <button
                  type="submit"
                  style={{
                    width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}
                >
                  <Send style={{ width: '15px', height: '15px' }} />
                  Send Message
                </button>
              </form>
            </div>

            {/* Trust & Safety */}
            <div style={{
              background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
              borderRadius: '20px', padding: '24px',
              border: '1px solid #a7f3d0',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#047857', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield style={{ width: '18px', height: '18px' }} />
                Trust & Safety
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Points only transfer after confirmation',
                  'Both parties must agree on completion',
                  'Provider verified by community',
                  'Report issues anytime',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px', color: '#059669', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: '#065f46', fontWeight: '500' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowContactForm(false); }}
          >
            <div style={{
              background: 'white', borderRadius: '24px', padding: '32px',
              width: '90%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto',
            }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                Contact {service.provider}
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                Send your contact details so the provider can reach you.
              </p>

              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Your Name *</label>
                  <input
                    type="text" required placeholder="Enter your full name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '2px solid #e5e7eb', fontSize: '14px', color: '#111827',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                  <input
                    type="tel" required placeholder="+970 59 XXX XXXX"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '2px solid #e5e7eb', fontSize: '14px', color: '#111827',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Message *</label>
                  <textarea
                    rows={4} required placeholder="Describe what you need..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '2px solid #e5e7eb', fontSize: '14px', color: '#111827',
                      outline: 'none', resize: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    style={{
                      flex: 1, padding: '14px', borderRadius: '12px',
                      border: '2px solid #e5e7eb', background: 'white',
                      color: '#374151', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}
                  >
                    <Send style={{ width: '15px', height: '15px' }} />
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
