import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Heart, Wifi, Utensils, Wind, Shield } from 'lucide-react';
import API from '../utils/api';

function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    area: '',
    maxRent: '',
    roomType: '',
    gender: ''
  });

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    fetchSavedIds();
  }, []);
  
  const fetchSavedIds = async () => {
    try {
      const res = await API.get('/listings/saved');
      setSaved(res.data.map(l => l.id));
    } catch (err) {
      console.error('Failed to fetch saved ids:', err);
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/listings');
      setListings(res.data);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleSave = async (id) => {
    try {
      const res = await API.post(`/listings/${id}/save`);
      if (res.data.saved) {
        setSaved(prev => [...prev, id]);
      } else {
        setSaved(prev => prev.filter(s => s !== id));
      }
    } catch (err) {
      console.error('Failed to save listing:', err);
    }
  };

  const amenityIcon = (amenity) => {
    if (amenity === 'WiFi') return <Wifi size={12} />;
    if (amenity === 'Meals') return <Utensils size={12} />;
    if (amenity === 'AC') return <Wind size={12} />;
    if (amenity === 'CCTV') return <Shield size={12} />;
    return null;
  };

  const filtered = listings.filter(l => {
    return (
      (filters.city === '' || l.city?.toLowerCase().includes(filters.city.toLowerCase())) &&
      (filters.area === '' || l.area?.toLowerCase().includes(filters.area.toLowerCase())) &&
      (filters.maxRent === '' || l.rent <= parseInt(filters.maxRent)) &&
      (filters.roomType === '' || l.roomType === filters.roomType) &&
      (filters.gender === '' || l.gender === filters.gender)
    );
  });

  const statusColor = (status) => {
    if (status === 'Available') return 'bg-green-100 text-green-700';
    if (status === 'Filling Fast') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Browse PGs & Hostels</h1>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white focus-within:border-blue-500">
              <MapPin size={16} className="text-gray-400" />
              <input
                name="city"
                value={filters.city}
                onChange={handleFilter}
                placeholder="City"
                className="outline-none text-sm text-gray-700 w-full"
              />
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white focus-within:border-blue-500">
              <Search size={16} className="text-gray-400" />
              <input
                name="area"
                value={filters.area}
                onChange={handleFilter}
                placeholder="Area / Locality"
                className="outline-none text-sm text-gray-700 w-full"
              />
            </div>
            <input
              name="maxRent"
              type="number"
              value={filters.maxRent}
              onChange={handleFilter}
              placeholder="Max Rent (₹)"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <select
              name="roomType"
              value={filters.roomType}
              onChange={handleFilter}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-700"
            >
              <option value="">Room Type</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Dorm">Dorm</option>
            </select>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilter}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-700"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Any">Any</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading listings...</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{filtered.length} listings found</p>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🏠</p>
                <p className="text-gray-500 text-lg">No listings found.</p>
                <p className="text-gray-400 text-sm mt-1">Try changing filters or check back later.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(listing => (
                  <div key={listing.id} className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition overflow-hidden">
                    <div className="relative">
                      <img
                        src={listing.photoUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600'}
                        alt={listing.title}
                        className="w-full h-48 object-cover"
                      />
                      <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${statusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                      <button
                        onClick={() => toggleSave(listing.id)}
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110 transition"
                      >
                        <Heart
                          size={16}
                          className={saved.includes(listing.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                        />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 text-base mb-1">{listing.title}</h3>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                        <MapPin size={12} />
                        {listing.area}, {listing.city}
                      </div>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                          {listing.roomType}
                        </span>
                        <span className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-full font-medium">
                          {listing.gender}
                        </span>
                      </div>
                      {listing.amenities && (
                        <div className="flex gap-1 flex-wrap mb-4">
                          {listing.amenities.split(',').slice(0, 4).map(a => (
                            <span key={a} className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                              {amenityIcon(a.trim())} {a.trim()}
                            </span>
                          ))}
                        </div>
                      )}
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
          </>
        )}
      </div>
    </div>
  );
}

export default Listings;