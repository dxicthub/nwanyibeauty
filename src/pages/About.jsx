import React from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiUsers, FiTruck, FiShield, FiStar, FiHeart, FiArrowRight } from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';

// Import hero banner image
import heroAboutUs from '../assets/images/hero_aboutus.jpg';

const About = () => {
  const stats = [
    { label: 'Happy Customers', value: '2,500+', icon: FiUsers },
    { label: 'Products Available', value: '200+', icon: FiStar },
    { label: 'Years of Excellence', value: '5+', icon: FiAward },
    { label: 'Categories', value: '9', icon: FiHeart },
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'We source only the finest beauty and salon products from trusted brands.',
      icon: FiShield,
    },
    {
      title: 'Customer Focus',
      description: 'Your satisfaction is our top priority. We are here to help you succeed.',
      icon: FiUsers,
    },
    {
      title: 'Reliable Service',
      description: 'Fast delivery and dedicated support to keep your business running smoothly.',
      icon: FiTruck,
    },
    {
      title: 'Wholesale Value',
      description: 'Competitive pricing without compromising on quality for professionals.',
      icon: FiAward,
    },
  ];

  return (
    <div className="pt-16 bg-[#FAF9FF] min-h-screen">
      {/* Hero Banner with Background Image */}
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
            src={heroAboutUs} 
            alt="About Nyanyi Onitsha" 
            className="w-full h-full object-cover object-center"
          />
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-[#6D28D9]/70 mix-blend-multiply"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <IoSparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 leading-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">Nyanyi Onitsha</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium max-w-2xl mx-auto">
            Your trusted wholesale partner for premium beauty, hair, and salon products
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center border border-[#E9DDF7] shadow-[0_4px_20px_rgba(109,40,217,0.06)]">
                <div className="w-12 h-12 bg-[#F7F3FF] rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-[#6D28D9]" />
                </div>
                <p className="text-2xl font-bold text-[#241238]">{stat.value}</p>
                <p className="text-sm text-[#6B6475]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#6D28D9] bg-[#F7F3FF] px-3 py-1 rounded-full border border-[#E9DDF7]">
                Our Story
              </span>
              <h2 className="text-3xl font-bold text-[#241238] mt-4 mb-4">
                Empowering Beauty Professionals Since 2019
              </h2>
              <p className="text-[#6B6475] leading-relaxed mb-4">
                Nyanyi Onitsha was founded with a simple mission: to provide beauty professionals
                with access to premium products at wholesale prices. Based in Onitsha, Nigeria,
                we have grown to become a trusted supplier for salons, beauty businesses, and
                individual professionals across the country.
              </p>
              <p className="text-[#6B6475] leading-relaxed mb-6">
                Our extensive catalogue features over 200 products across 9 categories,
                carefully curated to meet the diverse needs of the beauty and salon industry.
              </p>
              <Link to="/shop" className="inline-flex items-center text-[#6D28D9] hover:text-[#5B21B6] font-semibold">
                Explore Our Products <FiArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#6D28D9]/10 to-[#2563EB]/10 rounded-2xl overflow-hidden border border-[#E9DDF7]">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600"
                  alt="Beauty Products"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-[#E9DDF7]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F7F3FF] rounded-full flex items-center justify-center">
                    <FiAward className="w-5 h-5 text-[#6D28D9]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#241238]">Trusted Supplier</p>
                    <p className="text-xs text-[#6B6475]">5+ Years of Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-[#FAF9FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6D28D9] bg-[#F7F3FF] px-3 py-1 rounded-full border border-[#E9DDF7]">
              Our Values
            </span>
            <h2 className="text-3xl font-bold text-[#241238] mt-4">
              What Drives Us
            </h2>
            <p className="text-sm text-[#6B6475] mt-2 max-w-2xl mx-auto">
              Our core values guide everything we do, from product selection to customer service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-[#E9DDF7] hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-[#F7F3FF] rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[#6D28D9]" />
                </div>
                <h3 className="text-lg font-bold text-[#241238] mb-2">{value.title}</h3>
                <p className="text-sm text-[#6B6475]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#6D28D9] to-[#2563EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Partner With Us?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of beauty professionals who trust Nyanyi Onitsha for their product needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/shop"
              className="bg-white text-[#6D28D9] px-8 py-3 rounded-xl font-semibold hover:bg-[#EDE9FE] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Shop Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white/50 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:border-white/70"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;