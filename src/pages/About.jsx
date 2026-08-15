import React from 'react';

const About = () => {
  return (
    <div className="pt-16">
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h1 className="text-4xl font-display font-bold text-center mb-8">About Nwanyi Onitsha</h1>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg">
              <p className="text-lg text-gray-700 mb-6">
                Nwanyi Onitsha is a premier wholesale supplier of beauty, hair, and salon products. 
                We are dedicated to providing high-quality products at competitive prices to salons, 
                beauty professionals, and retailers across the country.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With years of experience in the beauty industry, we understand the needs of 
                professionals and strive to offer the best products and service possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6">
              <h3 className="text-xl font-display font-bold text-primary-600 mb-3">Our Mission</h3>
              <p className="text-gray-600">
                To empower beauty professionals with high-quality products and exceptional service, 
                helping them create beautiful results for their clients.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-xl font-display font-bold text-primary-600 mb-3">Our Vision</h3>
              <p className="text-gray-600">
                To become the leading wholesale beauty supplier, known for quality, reliability, 
                and innovation in the beauty industry.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-xl font-display font-bold text-primary-600 mb-3">Our Values</h3>
              <p className="text-gray-600">
                Quality, integrity, professionalism, and customer satisfaction are at the core 
                of everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-display font-bold text-center mb-8">What We Offer</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-2">💇</div>
              <p className="font-semibold">Hair Products</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💄</div>
              <p className="font-semibold">Salon Materials</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💺</div>
              <p className="font-semibold">Salon Equipment</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💅</div>
              <p className="font-semibold">Nail Accessories</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">👁️</div>
              <p className="font-semibold">Eyelashes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💇‍♀️</div>
              <p className="font-semibold">Weavons</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🖊️</div>
              <p className="font-semibold">Tattoo Supplies</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">✂️</div>
              <p className="font-semibold">Wig Tools</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;