'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  MapPin,
  Coins,
  Star,
  ArrowUpDown,
  X,
  Filter,
  Heart,
  Clock,
  ArrowRight,
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
  Stethoscope,
  GraduationCap,
  Laptop,
  Paintbrush,
  Truck,
  Baby,
  Globe,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

// Map category names to icons/colors for display
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

const categories = [
  { name: 'All', icon: Globe, color: '#059669' },
  { name: 'Healthcare', icon: Stethoscope, color: '#dc2626' },
  { name: 'Home Repairs', icon: Wrench, color: '#2563eb' },
  { name: 'Technology', icon: Laptop, color: '#0891b2' },
  { name: 'Construction', icon: Hammer, color: '#92400e' },
  { name: 'Barber', icon: Scissors, color: '#7c3aed' },
  { name: 'Tailor', icon: Paintbrush, color: '#ec4899' },
  { name: 'Mechanic', icon: Car, color: '#ea580c' },
  { name: 'Transport', icon: Truck, color: '#1d4ed8' },
  { name: 'Education', icon: GraduationCap, color: '#059669' },
];

const locations = ['All', 'Gaza City', 'Khan Younis', 'Rafah', 'Deir al-Balah', 'Jabalia'];
const sortOptions = ['Recommended', 'Lowest Points', 'Highest Rated', 'Most Reviews'];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.services) {
          // Enrich each service with icon/color from the category map
          const enriched = data.services.map((s) => {
            const catInfo = categoryIconMap[s.category] || categoryIconMap['Other'];
            return {
              ...s,
              icon: catInfo.icon,
              iconColor: catInfo.color,
              iconBg: catInfo.bg,
              tags: s.tags || [],
              reviews: s.reviews || 0,
              availability: s.availability === 'available' ? 'Available' : s.availability === 'busy' ? 'Busy' : s.availability || 'Available',
            };
          });
          setAllServices(enriched);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const filteredServices = allServices
    .filter((s) => {
      const matchSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.provider || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = selectedCategory === 'All' || s.category === selectedCategory;
      const matchLocation = selectedLocation === 'All' || s.location === selectedLocation;
      return matchSearch && matchCategory && matchLocation;
    })
    .sort((a, b) => {
      if (sortBy === 'Lowest Points') return a.points - b.points;
      if (sortBy === 'Highest Rated') return b.rating - a.rating;
      if (sortBy === 'Most Reviews') return b.reviews - a.reviews;
      return 0;
    });

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedLocation !== 'All' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px', minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'linear-gradient(to right, #059669, #10b981)' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>Services Marketplace</span>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>
            Browse <span style={{ color: '#059669' }}>Services</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '600px' }}>
            Find the help you need or offer your skills to the community. Every exchange strengthens our bonds.
          </p>
        </div>

        {/* Categories Horizontal Scroll */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: selectedCategory === cat.name ? '2px solid #059669' : '2px solid #e5e7eb',
                  background: selectedCategory === cat.name ? '#ecfdf5' : 'white',
                  color: selectedCategory === cat.name ? '#059669' : '#4b5563',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: selectedCategory === cat.name ? '#d1fae5' : '#f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CatIcon style={{ width: '16px', height: '16px', color: selectedCategory === cat.name ? '#059669' : cat.color }} />
                </div>
                {cat.name === 'All' ? 'All Services' : cat.name}
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          border: '1px solid #e5e7eb',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search services, skills, providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 44px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '14px',
                  color: '#111827',
                  background: '#f9fafb',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Location Select */}
            <div style={{ position: 'relative', flex: '0 0 auto' }}>
              <MapPin style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af', pointerEvents: 'none' }} />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{
                  padding: '12px 16px 12px 36px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '14px',
                  color: '#374151',
                  background: '#f9fafb',
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'auto',
                  minWidth: '160px',
                }}
              >
                {locations.map((l) => (
                  <option key={l} value={l}>{l === 'All' ? '📍 All Locations' : l}</option>
                ))}
              </select>
            </div>

            {/* Filters Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                borderRadius: '12px',
                border: showFilters ? '2px solid #059669' : '2px solid #e5e7eb',
                background: showFilters ? '#ecfdf5' : '#f9fafb',
                color: showFilters ? '#059669' : '#6b7280',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <SlidersHorizontal style={{ width: '16px', height: '16px' }} />
              Sort & View
              {activeFilterCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#059669',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>{activeFilterCount}</span>
              )}
            </button>
          </div>

          {/* Extended Filters Panel */}
          {showFilters && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Sort by:</span>
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: sortBy === option ? '#059669' : '#f3f4f6',
                      color: sortBy === option ? 'white' : '#6b7280',
                      transition: 'all 0.2s',
                    }}
                  >
                    {option}
                  </button>
                ))}

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', background: '#f3f4f6', borderRadius: '10px', padding: '4px' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      background: viewMode === 'grid' ? 'white' : 'transparent',
                      color: viewMode === 'grid' ? '#059669' : '#9ca3af',
                      boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Grid3X3 style={{ width: '16px', height: '16px' }} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      background: viewMode === 'list' ? 'white' : 'transparent',
                      color: viewMode === 'list' ? '#059669' : '#9ca3af',
                      boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <List style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Tags */}
        {activeFilterCount > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Active Filters:</span>
            {selectedCategory !== 'All' && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '8px', background: '#ecfdf5',
                color: '#059669', fontSize: '13px', fontWeight: '600',
              }}>
                {selectedCategory}
                <X style={{ width: '14px', height: '14px', cursor: 'pointer' }} onClick={() => setSelectedCategory('All')} />
              </span>
            )}
            {selectedLocation !== 'All' && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '8px', background: '#ecfdf5',
                color: '#059669', fontSize: '13px', fontWeight: '600',
              }}>
                <MapPin style={{ width: '12px', height: '12px' }} /> {selectedLocation}
                <X style={{ width: '14px', height: '14px', cursor: 'pointer' }} onClick={() => setSelectedLocation('All')} />
              </span>
            )}
            {searchQuery && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '8px', background: '#ecfdf5',
                color: '#059669', fontSize: '13px', fontWeight: '600',
              }}>
                &quot;{searchQuery}&quot;
                <X style={{ width: '14px', height: '14px', cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
              </span>
            )}
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedLocation('All'); setSearchQuery(''); }}
              style={{ fontSize: '13px', color: '#ef4444', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '4px' }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Results Count Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Showing <strong style={{ color: '#111827' }}>{filteredServices.length}</strong> services
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#9ca3af' }}>
            <ArrowUpDown style={{ width: '14px', height: '14px' }} /> {sortBy}
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Loader2 style={{ width: '40px', height: '40px', color: '#059669', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '16px', color: '#6b7280' }}>Loading services...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filteredServices.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))' : '1fr',
            gap: '20px',
          }}>
            {filteredServices.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#a7f3d0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                {/* Card Header / Image Area */}
                <div style={{
                  position: 'relative',
                  height: viewMode === 'grid' ? '160px' : '100px',
                  background: `linear-gradient(135deg, ${service.iconBg} 0%, ${service.iconBg}dd 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {/* Decorative circles */}
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: `${service.iconColor}12` }} />
                  <div style={{ position: 'absolute', bottom: '-10px', left: '-10px', width: '60px', height: '60px', borderRadius: '50%', background: `${service.iconColor}0a` }} />

                  {(() => { const Icon = service.icon; return (
                    <div style={{
                      width: viewMode === 'grid' ? '72px' : '52px',
                      height: viewMode === 'grid' ? '72px' : '52px',
                      borderRadius: '18px',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      zIndex: 1,
                    }}>
                      <Icon style={{ width: viewMode === 'grid' ? '32px' : '24px', height: viewMode === 'grid' ? '32px' : '24px', color: service.iconColor }} />
                    </div>
                  ); })()}

                  {/* Category Badge */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span style={{
                      background: 'rgba(255,255,255,0.92)',
                      backdropFilter: 'blur(8px)',
                      color: '#047857',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {service.category}
                    </span>
                  </div>

                  {/* Points Badge */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '5px 12px',
                      borderRadius: '8px',
                    }}>
                      <Coins style={{ width: '13px', height: '13px' }} />
                      {service.points} pts
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: service.availability === 'Available' ? 'rgba(5,150,105,0.15)' : 'rgba(234,179,8,0.15)',
                      color: service.availability === 'Available' ? '#047857' : '#a16207',
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '4px 10px',
                      borderRadius: '6px',
                    }}>
                      <Clock style={{ width: '11px', height: '11px' }} />
                      {service.availability}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontWeight: '700', color: '#111827', fontSize: '17px', marginBottom: '8px', lineHeight: '1.3' }}>
                    {service.title}
                  </h3>

                  {/* Provider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px',
                    }}>
                      👤
                    </div>
                    <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>{service.provider}</span>
                  </div>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        style={{
                          width: '14px',
                          height: '14px',
                          color: i < Math.floor(service.rating) ? '#f59e0b' : '#d1d5db',
                          fill: i < Math.floor(service.rating) ? '#f59e0b' : 'none',
                        }}
                      />
                    ))}
                    <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '6px', fontWeight: '500' }}>
                      {service.rating} ({service.reviews})
                    </span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          background: '#f3f4f6',
                          color: '#4b5563',
                          padding: '4px 10px',
                          borderRadius: '6px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid #f3f4f6',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#9ca3af' }}>
                      <MapPin style={{ width: '13px', height: '13px' }} />
                      {service.location}
                    </div>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>
                      View Details
                      <ArrowRight style={{ width: '14px', height: '14px' }} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'white',
            borderRadius: '20px',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              No Services Found
            </h3>
            <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedLocation('All'); setSearchQuery(''); }}
              style={{
                padding: '12px 28px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{
          marginTop: '48px',
          background: 'linear-gradient(135deg, #059669, #047857)',
          borderRadius: '20px',
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Keffiyeh pattern overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            backgroundImage: `repeating-linear-gradient(45deg, white 0px, white 2px, transparent 2px, transparent 12px),
              repeating-linear-gradient(-45deg, white 0px, white 2px, transparent 2px, transparent 12px)`,
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
              Have a skill to share? 🤝
            </h3>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', maxWidth: '500px' }}>
              Offer your services to the community and earn points that you can use to get help when you need it.
            </p>
          </div>
          <Link
            href="/services/offer"
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '12px',
              background: 'white',
              color: '#059669',
              fontSize: '15px',
              fontWeight: '700',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            Offer a Service
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
