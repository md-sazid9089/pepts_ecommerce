'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiPackage, FiRefreshCw, FiCheckCircle, FiDollarSign, FiFileText, FiZap } from 'react-icons/fi';

export default function AboutPage() {
  const stats = [
    { label: 'Unique Customers', value: '393,000+' },
    { label: 'Products Delivered', value: '820,000+' },
    { label: 'Years of Excellence', value: '9+' },
  ];

  return (
    <main className="bg-white min-h-screen font-sans">
      {/* WELCOME SECTION */}
      <section className="container mx-auto px-6 py-16 md:py-28 lg:px-12 lg:py-36 text-center">
        <span className="block text-xs md:text-sm font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">
          WELCOME TO PEPTA
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-10 tracking-tight">
          Our Perfect Store
        </h1>
        <div className="max-w-3xl mx-auto space-y-6 text-gray-600 leading-relaxed md:text-lg">
          <p>
            Pepta is a name synonymous with excellence, innovation, and trust in the world of technology and gadgets. Over the past 9 years, we have proudly built a legacy rooted in exceptional customer satisfaction and unmatched quality.
          </p>
          <p>
            With a growing family of <span className="font-bold text-gray-900">{stats[0].value} unique customers</span>, we have earned the trust of tech enthusiasts across the nation. From smartphones to laptops, smartwatches to accessories, we have successfully delivered over <span className="font-bold text-gray-900">{stats[1].value} products</span>, turning dreams into reality.
          </p>
        </div>
      </section>

      {/* 3. HERO IMAGE SHOWCASE */}
      <section className="container mx-auto px-4 md:px-12 pt-24 md:pt-36 lg:pt-48 pb-32 lg:pb-48">
        <div className="relative w-full overflow-hidden rounded-[2.5rem] shadow-premium">
          <Image
            src="/aboutbatman.png"
            alt="Pepta Store Experience"
            width={1600}
            height={900}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </section>

      {/* 4. OUR PROCESS */}
      <section className="w-full pt-24 md:pt-36 lg:pt-48 py-32 bg-gray-50 lg:py-40">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <span className="block text-xs md:text-sm font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
              OUR PROCESS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
              FROM CONCEPT TO DELIVERY
            </h2>
            <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed md:text-lg">
              Our streamlined production process ensures quality, precision, and timely delivery at every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                title: 'Sample Development',
                desc: 'After paying the sample fee, production of the initial sample begins and is delivered within 10–15 working days.',
                Icon: FiPackage
              },
              {
                title: 'Sample Modification',
                desc: 'Revisions are made based on provided specifications, with up to two free adjustments taking 3–5 working days each.',
                Icon: FiRefreshCw
              },
              {
                title: 'Sample Approval',
                desc: 'Once all modifications are satisfactory, the sample is officially approved as the master reference for production.',
                Icon: FiCheckCircle
              },
              {
                title: 'Price Quotation & Logistics',
                desc: 'Finalized sample details are used to determine quantities, packaging needs, and generate a price quotation.',
                Icon: FiDollarSign
              },
              {
                title: 'Bulk Order Confirmation',
                desc: 'After confirming terms and paying the deposit, a production contract is executed with finalized product details.',
                Icon: FiFileText
              },
              {
                title: 'Mass Production',
                desc: 'Large-scale production begins after contract execution and is completed within 25 working days with minor allowable variations.',
                Icon: FiZap
              }
            ].map((step, index) => {
              const cardStyles = [
                // Card 1: Black background, white text, icon top
                'bg-black text-white p-8 rounded-[1.5rem] border border-black shadow-lg',
                // Card 2: Light blue background, icon left
                'bg-blue-50 p-8 rounded-[1.5rem] border border-blue-200 shadow-sm',
                // Card 3: White background, colored icon, top border accent
                'bg-white p-8 rounded-[1.5rem] border-2 border-t-4 border-gray-200 border-t-black shadow-sm',
                // Card 4: Light gray background, left border accent
                'bg-gray-50 p-8 rounded-[1.5rem] border border-gray-200 border-l-4 border-l-black shadow-sm',
                // Card 5: Light green background
                'bg-green-50 p-8 rounded-[1.5rem] border border-green-200 shadow-sm',
                // Card 6: Purple/indigo background
                'bg-indigo-50 p-8 rounded-[1.5rem] border border-indigo-200 shadow-sm'
              ];

              const iconBgStyles = [
                'bg-white text-black',
                'bg-blue-500 text-white',
                'bg-black text-white',
                'bg-gray-900 text-white',
                'bg-green-500 text-white',
                'bg-indigo-500 text-white'
              ];

              const textColorClass = index === 0 ? 'text-white' : 'text-gray-900';
              const descColorClass = index === 0 ? 'text-gray-200' : 'text-gray-600';

              return (
                <div 
                  key={index}
                  className={`group transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${cardStyles[index]}`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${iconBgStyles[index]}`}>
                    <step.Icon size={28} />
                  </div>
                  <h3 className={`text-lg font-bold mb-4 ${textColorClass}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${descColorClass}`}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
