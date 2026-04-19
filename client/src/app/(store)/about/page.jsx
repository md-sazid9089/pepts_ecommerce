'use client';

import Link from 'next/link';
import { FiArrowRight, FiCheck, FiShield, FiTruck, FiHeadphones } from 'react-icons/fi';

const teamMembers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    bio: 'Visionary leader with 10+ years in e-commerce innovation.',
    avatar: '👩‍💼',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Head of Operations',
    bio: 'Ensuring excellence in every product and delivery.',
    avatar: '👨‍💼',
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Customer Experience Director',
    bio: 'Dedicated to making every customer feel valued.',
    avatar: '👩‍💻',
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Product Innovation Lead',
    bio: 'Constantly exploring new ways to serve you better.',
    avatar: '👨‍🔬',
  },
];

const differences = [
  {
    icon: FiCheck,
    label: 'Quality Assurance',
    description: 'Every product is carefully vetted and verified.',
  },
  {
    icon: FiTruck,
    label: 'Fast Delivery',
    description: 'Nationwide shipping with real-time tracking.',
  },
  {
    icon: FiShield,
    label: 'Secure Payment',
    description: 'Industry-leading encryption and fraud protection.',
  },
  {
    icon: FiHeadphones,
    label: '24/7 Support',
    description: 'Always here to help, whenever you need us.',
  },
];

const stats = [
  { number: '500K+', label: 'Happy Customers' },
  { number: '50K+', label: 'Premium Products' },
  { number: '2K+', label: 'Verified Sellers' },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-[600px] bg-gradient-to-br from-[#F5EDEC] via-white to-[#F5EDEC] py-16 md:py-24 overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#F7B9C4] rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#F7B9C4] rounded-full opacity-15 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col gap-12 items-center text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-[#533638] leading-tight">
              Redefining Online Shopping Experience.
            </h1>
            <p className="text-lg md:text-xl text-[rgba(83,54,56,0.6)] max-w-2xl leading-relaxed">
              We believe shopping should be effortless, joyful, and trustworthy. Discover how we&apos;re transforming e-commerce one customer at a time.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#533638] text-white rounded-xl hover:bg-[#3D2728] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Explore Now
              <FiArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHO WE ARE - TWO COLUMN */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="flex flex-col gap-8">
              <div>
                <div className="inline-block px-4 py-2 bg-[#F7B9C4] bg-opacity-20 rounded-full mb-6">
                  <span className="text-sm font-semibold text-[#533638]">Our Story</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#533638] mb-6">Who We Are</h2>
                <p className="text-lg text-[rgba(83,54,56,0.6)] leading-relaxed mb-4">
                  Founded in 2020, we started with a simple mission: to create a marketplace where quality meets convenience.
                </p>
                <p className="text-lg text-[rgba(83,54,56,0.6)] leading-relaxed mb-4">
                  Today, we&apos;re proud to be the trusted destination for millions of customers seeking authentic, premium products delivered with exceptional service.
                </p>
                <p className="text-lg text-[rgba(83,54,56,0.6)] leading-relaxed">
                  Our commitment to excellence isn&apos;t just a promise—it&apos;s built into every interaction, every product, and every decision we make.
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                {['Community-Driven', 'Quality-Focused', 'Always Growing'].map((value, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#F7B9C4] flex items-center justify-center">
                      <FiCheck size={16} className="text-white" />
                    </div>
                    <span className="text-lg font-medium text-[#533638]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#F5EDEC] to-[#F7B9C4] rounded-3xl opacity-30 absolute inset-0" />
              <div className="relative aspect-square bg-white rounded-3xl shadow-lg flex items-center justify-center border border-[#F7B9C4] border-opacity-30">
                <div className="text-center">
                  <div className="text-8xl mb-4">🎁</div>
                  <p className="text-[#533638] font-semibold">Premium Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STATISTICS */}
      <section className="py-16 md:py-24 bg-[#F5EDEC] bg-opacity-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-[#533638] mb-3">
                  {stat.number}
                </div>
                <p className="text-lg text-[rgba(83,54,56,0.6)] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION & VISION - CARD LAYOUT */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
          <h2 className="text-4xl md:text-5xl font-bold text-[#533638] text-center mb-16">Our Vision</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="group relative bg-white rounded-3xl p-10 border border-[#F7B9C4] border-opacity-20 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7B9C4] rounded-full opacity-5 -translate-y-16 translate-x-16 group-hover:opacity-15 transition-opacity duration-300" />

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#F7B9C4] bg-opacity-20 flex items-center justify-center mb-6 group-hover:bg-opacity-30 transition-colors duration-300">
                  <span className="text-3xl">🎯</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-[#533638] mb-4">Our Mission</h3>
                <p className="text-lg text-[rgba(83,54,56,0.6)] leading-relaxed">
                  To empower millions of customers with access to premium, authentic products while supporting sellers and creating lasting economic value for our community.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group relative bg-white rounded-3xl p-10 border border-[#F7B9C4] border-opacity-20 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7B9C4] rounded-full opacity-5 -translate-y-16 translate-x-16 group-hover:opacity-15 transition-opacity duration-300" />

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#F7B9C4] bg-opacity-20 flex items-center justify-center mb-6 group-hover:bg-opacity-30 transition-colors duration-300">
                  <span className="text-3xl">✨</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-[#533638] mb-4">Our Vision</h3>
                <p className="text-lg text-[rgba(83,54,56,0.6)] leading-relaxed">
                  A world where online shopping feels personal, transparent, and genuinely rewarding—where every transaction builds trust and creates meaningful connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT - 4 COLUMN GRID */}
      <section className="py-20 md:py-32 bg-[#F5EDEC] bg-opacity-40">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
          <h2 className="text-4xl md:text-5xl font-bold text-[#533638] text-center mb-16">What Makes Us Different</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differences.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#F7B9C4] bg-opacity-20 flex items-center justify-center mb-6 group-hover:bg-opacity-40 transition-colors duration-300">
                    <Icon size={24} className="text-[#533638]" />
                  </div>

                  <h3 className="text-xl font-bold text-[#533638] mb-3">{item.label}</h3>
                  <p className="text-sm text-[rgba(83,54,56,0.6)] leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
          <h2 className="text-4xl md:text-5xl font-bold text-[#533638] text-center mb-16">Meet Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="group text-center">
                {/* Avatar */}
                <div className="mb-6 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F7B9C4] to-[#F5EDEC] flex items-center justify-center text-6xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    {member.avatar}
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-[#533638] mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-[#F7B9C4] mb-3">{member.role}</p>
                <p className="text-sm text-[rgba(83,54,56,0.6)] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES & FINAL CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#F5EDEC] to-[#F7B9C4] bg-opacity-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#533638] mb-6">Your Trust Matters</h2>
            <p className="text-lg text-[rgba(83,54,56,0.6)] max-w-2xl mx-auto">
              We stand behind our promise with industry-leading guarantees that give you complete peace of mind.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-md border-l-4 border-[#F7B9C4]">
              <div className="flex items-start gap-4">
                <FiShield size={28} className="text-[#533638] flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-[#533638] mb-2">Secure Payment</h3>
                  <p className="text-[rgba(83,54,56,0.6)]">
                    Bank-level encryption protects every transaction. Shop with confidence.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md border-l-4 border-[#F7B9C4]">
              <div className="flex items-start gap-4">
                <FiArrowRight size={28} className="text-[#533638] flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-[#533638] mb-2">Easy Returns</h3>
                  <p className="text-[rgba(83,54,56,0.6)]">
                    Not satisfied? 30-day hassle-free returns, no questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#533638] text-white rounded-xl hover:bg-[#3D2728] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Start Shopping Today
              <FiArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* BOTTOM TRUST STATEMENT */}
      <section className="py-12 bg-white border-t border-[#F7B9C4] border-opacity-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 text-center">
          <p className="text-[rgba(83,54,56,0.6)] max-w-2xl mx-auto">
            Join thousands of satisfied customers who&apos;ve made Precious Play their trusted shopping destination.
            <br />
            We&apos;re here, every step of your journey.
          </p>
        </div>
      </section>
    </main>
  );
}
