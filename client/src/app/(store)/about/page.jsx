import Link from 'next/link';
import Image from 'next/image';
import { 
  FiTruck, 
  FiCreditCard, 
  FiRefreshCw, 
  FiDollarSign, 
  FiShield, 
  FiAward, 
  FiSmartphone, 
  FiUserCheck, 
  FiHeadphones, 
  FiZap 
} from 'react-icons/fi';

export const metadata = {
  title: 'About Dazzle - Premium Technology & Gadget Gallery',
  description: 'Dazzle is a name synonymous with excellence, innovation, and trust in the world of technology and gadgets over the past 9 years.',
};

const features = [
  {
    icon: FiTruck,
    title: 'Countrywide Free Delivery',
    desc: 'No matter where you are in Bangladesh, your order reaches you without any delivery charges'
  },
  {
    icon: FiCreditCard,
    title: '36-Month EMI Facility',
    desc: 'Flexible payment options for products over BDT 5,000 through 39 partner banks'
  },
  {
    icon: FiRefreshCw,
    title: 'Exclusive Exchange Offers',
    desc: 'Upgrade your gadgets with the best value for your old devices'
  },
  {
    icon: FiDollarSign,
    title: 'Competitive Pricing',
    desc: 'Unbeatable prices for a wide range of electronics, accessories, and more'
  },
  {
    icon: FiShield,
    title: 'Authentic Products',
    desc: '100% original gadgets and accessories from globally renowned brands'
  },
  {
    icon: FiAward,
    title: 'Comprehensive Warranty Services',
    desc: 'Extended warranties for added peace of mind'
  },
  {
    icon: FiSmartphone,
    title: 'Pre-Orders for Any Electronics',
    desc: 'Get the latest devices delivered within 15 days'
  },
  {
    icon: FiUserCheck,
    title: 'After-Sales Service',
    desc: 'From expert assistance to smooth warranty claims, we\'re here for you'
  },
  {
    icon: FiHeadphones,
    title: '24/7 Customer Support',
    desc: 'Round-the-clock service to ensure you never face any inconvenience'
  },
  {
    icon: FiZap,
    title: 'Fast Delivery',
    desc: 'Quick and reliable delivery services tailored to your needs'
  }
];

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex text-xs md:text-sm text-gray-500 gap-2">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black font-medium">About Us</span>
        </nav>
      </div>

      {/* 1. WELCOME SECTION */}
      <section className="w-full py-16 md:py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-xs md:text-sm font-semibold tracking-widest text-gray-500 uppercase mb-4 text-center">
            WELCOME TO DAZZLE
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight text-center">
            Our Perfect Store
          </h1>
          <div className="space-y-6 text-sm md:text-base text-gray-600 leading-relaxed text-center max-w-3xl">
            <p>
              Dazzle is a name synonymous with excellence, innovation, and trust in the world of technology and gadgets. Over the past 9 years, we have proudly built a legacy rooted in exceptional customer satisfaction and unmatched quality.
            </p>
            <p>
              With a growing family of <span className="font-semibold text-gray-900">393,000+ unique customers</span>, we have earned the trust of tech enthusiasts across the nation. From smartphones to laptops, smartwatches to accessories, we have successfully delivered over <span className="font-semibold text-gray-900">820,000+ products</span>, turning dreams into reality.
            </p>
          </div>
        </div>
      </section>

      {/* 2. SHOWCASE IMAGE */}
      <section className="w-full px-4 md:px-12 pb-20">
        <div className="max-w-7xl mx-auto">
          <Image
            src="/aboutbatman.png"
            alt="Dazzle Store Interior"
            width={1400}
            height={700}
            className="w-full h-auto rounded-2xl shadow-2xl object-cover"
            priority
          />
        </div>
      </section>

      {/* 3. EXPERIENCE SECTION */}
      <section className="w-full py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs md:text-sm font-semibold tracking-widest text-gray-500 uppercase mb-4 block">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              OVER 9 YEARS OF EXPERIENCE
            </h2>
            <p className="max-w-3xl mx-auto text-sm md:text-base text-gray-600 leading-relaxed">
              Over 9 years of experience, we have crafted thousands of strategic discovery process that enables us to peel back the layers which enable us to understand, connect.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Image 1 */}
            <div className="group overflow-hidden rounded-2xl shadow-lg aspect-[3/4] relative bg-gray-200">
              <Image
                src="/experience1.png"
                alt="Experience 1"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            {/* Image 2 */}
            <div className="group overflow-hidden rounded-2xl shadow-lg aspect-[3/4] relative bg-gray-200">
              <Image
                src="/experience2.png"
                alt="Experience 2"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            {/* Image 3 */}
            <div className="group overflow-hidden rounded-2xl shadow-lg aspect-[3/4] relative bg-gray-200">
              <Image
                src="/experience3.png"
                alt="Experience 3"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURE GRID */}
      <section className="w-full py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="p-8 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
