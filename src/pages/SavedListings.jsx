import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Trash2 } from 'lucide-react';
import API from '../utils/api';

function SavedListings() {
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedListings();
  }, []);

  const fetchSavedListings = async () => {
    try {
      const res = await API.get('/listings/saved');
      setSavedListings(res.data);
    } catch (err) {
      console.error('Failed to fetch saved listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeSaved = async (listingId) => {
    try {
      await API.post(`/listings/${listingId}/save`);
      setSavedListings(prev => prev.filter(l => l.id !== listingId));
    } catch (err) {
      console.error('Failed to remove saved listing:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Heart size={24} className="text-red-500 fill-red-500" />
            Saved Listings
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {savedListings.length} saved {savedListings.length === 1 ? 'listing' : 'listings'}
          </p>
        </div>

        {savedListings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border">
            <p className="text-6xl mb-4">💔</p>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No saved listings yet</h2>
            <p className="text-gray-400 text-sm mb-6">Browse PGs and tap the heart to save them here.</p>
            <Link
              to="/listings"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Browse PGs
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {savedListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition">
                <div className="relative">
                  <img
                    src={listing.photoUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600'}
                    alt={listing.title}
                    className="w-full h-44 object-cover"
                  />
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
                    listing.status === 'Available' ? 'bg-green-100 text-green-700' :
                    listing.status === 'Filling Fast' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {listing.status}
                  </span>
                  <button
                    onClick={() => removeSaved(listing.id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-50 transition group"
                  >
                    <Trash2 size={15} className="text-gray-400 group-hover:text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{listing.title}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                    <MapPin size={12} />
                    {listing.area}, {listing.city}
                  </div>
                  <div className="flex gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">{listing.roomType}</span>
                    <span className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-full font-medium">{listing.gender}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-blue-600">₹{listing.rent?.toLocaleString()}</span>
                      <span className="text-gray-400 text-xs">/month</span>
                    </div>
                    <Link
                      to={`/listings/${listing.id}`}
                      className="bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedListings;