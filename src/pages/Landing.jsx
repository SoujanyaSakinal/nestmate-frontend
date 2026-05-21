import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Shield, Star, Users, Home } from 'lucide-react';

function Landing() {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find Your Perfect <span className="text-yellow-300">PG or Hostel</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Community-driven platform connecting students & workers with trusted PGs and hostels. No brokers. No fees.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-2xl mx-auto shadow-xl">
            <div className="flex items-center gap-2 flex-1 px-3">
              <MapPin size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Enter city or area (e.g. Pune, Koregaon Park)"
                className="w-full text-gray-700 outline-none py-2"
              />
            </div>
            <Link
              to="/listings"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-center"
            >
              Search PGs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-10 px-4 border-b">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">500+</p>
            <p className="text-gray-500 text-sm mt-1">PGs & Hostels Listed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">12+</p>
            <p className="text-gray-500 text-sm mt-1">Cities Covered</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">2000+</p>
            <p className="text-gray-500 text-sm mt-1">Happy Students</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How NestMate Works</h2>
          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">1. Search</h3>
              <p className="text-gray-500 text-sm">Browse PGs and hostels by city, area, budget, and preferences.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">2. Connect</h3>
              <p className="text-gray-500 text-sm">Contact the owner directly via WhatsApp or phone. No middlemen.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="bg-yellow-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home size={24} className="text-yellow-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">3. Move In</h3>
              <p className="text-gray-500 text-sm">Visit the place, finalize, and move into your new home!</p>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose NestMate?</h2>
          <div className="grid md:grid-cols-2 gap-6">

            <div className="flex items-start gap-4 p-5 rounded-2xl border hover:shadow-md transition">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Shield size={22} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">No Broker Fees</h4>
                <p className="text-gray-500 text-sm">Connect directly with PG owners and residents. Zero commission.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl border hover:shadow-md transition">
              <div className="bg-green-100 p-3 rounded-xl">
                <Star size={22} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Verified Reviews</h4>
                <p className="text-gray-500 text-sm">Read honest reviews from real residents before you decide.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl border hover:shadow-md transition">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Users size={22} className="text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibumid text-gray-800 mb-1">Community Driven</h4>
                <p className="text-gray-500 text-sm">Listings posted by real owners and current residents — not agencies.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl border hover:shadow-md transition">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <MapPin size={22} className="text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Location Based</h4>
                <p className="text-gray-500 text-sm">Find PGs near your college or workplace with smart area search.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 px-4 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Have a vacant room or bed?</h2>
        <p className="text-blue-100 mb-8 text-lg">Post your PG or hostel listing for free and reach thousands of seekers.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
          >
            Post a Listing — It's Free
          </Link>
          <Link
            to="/listings"
            className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Browse PGs
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-6 text-sm">
        <p>© 2026 NestMate — Built for students & workers across India 🏠</p>
      </footer>

    </div>
  );
}

export default Landing;