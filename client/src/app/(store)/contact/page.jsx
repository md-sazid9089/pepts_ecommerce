'use client';

import { useState } from 'react';
import styles from './contact.module.css';
import { FiMapPin, FiPhone, FiMail, FiClock, FiCheckCircle } from 'react-icons/fi';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, you would send this to your backend API
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      title: 'Global Headquarters',
      content: 'Dhaka, BD / Yangzhou, Jiangsu (CN Factory)',
    },
    {
      icon: FiPhone,
      title: 'Wholesale Support',
      content: '+86 18168023963',
    },
    {
      icon: FiMail,
      title: 'Email',
      content: 'bulk@precious-play-wholesale.com',
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      content: 'Mon - Fri: 9AM - 6PM',
    },
  ];

  return (
    <div className={styles.contactPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>Get in Touch</h1>
          <p>Have questions? We&apos;d love to hear from you.</p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className={styles.contactInfo}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            {contactInfo.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className={styles.infoCard}>
                  <div className={styles.infoIcon}><IconComponent size={48} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.formWrapper}>
            <div className={styles.formTitle}>
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
            </div>

            {submitted && (
              <div className={styles.successMessage}>
                <FiCheckCircle size={20} /> Thank you for your message! We&apos;ll contact you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h4>How long does delivery take?</h4>
              <p>
                Standard delivery typically takes 2-3 business days. Express delivery is available
                for next-day delivery.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h4>What is your return policy?</h4>
              <p>
                We offer 30-day returns on most items. Products must be in original condition with
                all packaging intact.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h4>Do you ship internationally?</h4>
              <p>
                Currently, we ship within Bangladesh and neighboring countries. International
                shipping options coming soon.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h4>How can I track my order?</h4>
              <p>
                You can track your order in real-time using the tracking link sent to your email
                after purchase.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
