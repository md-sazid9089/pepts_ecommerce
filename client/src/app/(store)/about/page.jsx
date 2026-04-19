import Link from 'next/link';
import { FiZap, FiUsers, FiGlobe, FiCode } from 'react-icons/fi';
import styles from './about.module.css';

export const metadata = {
  title: 'About Us | Daraz Clone',
  description: 'Learn about our mission, values, and commitment to customer satisfaction.',
};

export default function AboutPage() {
  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', icon: FiUsers },
    { name: 'Ahmed Hassan', role: 'CTO', icon: FiCode },
    { name: 'Fatima Khan', role: 'Head of Operations', icon: FiGlobe },
    { name: 'Ravi Patel', role: 'Customer Success Lead', icon: FiUsers },
  ];

  const values = [
    {
      icon: FiZap,
      title: 'Innovation',
      description: 'We continuously improve our platform with cutting-edge technology',
    },
    {
      icon: FiUsers,
      title: 'Trust',
      description: 'Building strong relationships with our customers and partners',
    },
    {
      icon: FiZap,
      title: 'Efficiency',
      description: 'Fast, reliable service that exceeds customer expectations',
    },
    {
      icon: FiGlobe,
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and social responsibility',
    },
  ];

  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>About Our Platform</h1>
          <p>Revolutionizing online shopping in South Asia</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.mission}>
        <div className={styles.container}>
          <div className={styles.missionContent}>
            <div className={styles.missionText}>
              <h2>Our Mission</h2>
              <p>
                We are committed to providing a seamless, secure, and delightful online shopping
                experience to millions of customers across South Asia. Our platform brings together
                the best sellers and most diverse product selection to create a vibrant marketplace.
              </p>
              <p>
                Founded in 2015, we've grown to become a trusted name in e-commerce, serving over
                5 million active customers and supporting thousands of sellers to grow their businesses.
              </p>
            </div>
            <div className={styles.missionStats}>
              <div className={styles.stat}>
                <h3>5M+</h3>
                <p>Active Customers</p>
              </div>
              <div className={styles.stat}>
                <h3>50K+</h3>
                <p>Sellers</p>
              </div>
              <div className={styles.stat}>
                <h3>100K+</h3>
                <p>Products</p>
              </div>
              <div className={styles.stat}>
                <h3>24/7</h3>
                <p>Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.values}>
        <div className={styles.container}>
          <h2>Our Core Values</h2>
          <div className={styles.valuesGrid}>
            {values.map((value, idx) => {
              const IconComponent = value.icon;
              return (
                <div key={idx} className={styles.valueCard}>
                  <div className={styles.valueIcon}><IconComponent size={48} /></div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.team}>
        <div className={styles.container}>
          <h2>Leadership Team</h2>
          <div className={styles.teamGrid}>
            {team.map((member, idx) => {
              const IconComponent = member.icon;
              return (
                <div key={idx} className={styles.teamCard}>
                  <div className={styles.teamImage}><IconComponent size={56} /></div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2>Ready to Explore?</h2>
          <p>Start shopping from thousands of products on our platform</p>
          <Link href="/products" className={styles.ctaBtn}>
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
}
