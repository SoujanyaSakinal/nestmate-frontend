import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, MapPin, IndianRupee, CheckSquare } from 'lucide-react';
import API from '../utils/api';

const AMENITIES_OPTIONS = [
  'WiFi', 'Meals', 'AC', 'CCTV', 'Laundry',
  'Parking', 'Power Backup', 'Housekeeping',
  'Study Room', 'Warden', 'Furnished', 'Kitchen'
];

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    area: '',
    rent: '',
    roomType: 'Single',
    gender: 'Any',
    availableFrom: '',
    photoUrl: '',
    amenities: []
  });

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await API.get(`/listings/${id}`);
      const l = res.data;
      setForm({
        title: l.title || '',
        description: l.description || '',
        address: l.address || '',
        city: l.city || '',
        area: l.area || '',
        rent: l.rent || '',
        roomType: l.roomType || 'Single',
        gender: l.gender || 'Any',
        availableFrom: l.availableFrom || '',
        photoUrl: l.photoUrl || '',
        amenities: l.amenities ? l.amenities.split(',').map(a => a.trim()) : []
      });
    } catch (err) {
      console.error('Failed to fetch listing:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleAmenity = (a) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const listingData = {
        ...form,
        rent: parseFloat(form.rent),
        amenities: form.amenities.join(',')
      };
      await API.put(`/listings/${id}`, listingData);
      setSuccess(true);
      setTimeout(() => navigate('/my-listings'), 2000);
    } catch (err) {
      console.error('Failed to update listing:', err);
      alert('Failed to update: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-10 shadow-sm border">
          <p className="text-6xl mb-4">✅</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Listing Updated!</h2>
          <p className="text-gray-500">Redirecting to your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Home size={24} className="text-blue-600" />
            Edit Listing
          </h1>
          <p className="text-gray-500 text-sm mt-1">Update your PG or hostel details.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Basic Info</h2>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">PG / Hostel Name *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Photo URL</label>
              <input
                name="photoUrl"
                value={form.photoUrl}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-1">
              <MapPin size={14} /> Location
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">City *</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Area *</label>
                <input
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Full Address *</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Room & Pricing */}
          <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-1">
              <IndianRupee size={14} /> Room & Pricing
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Monthly Rent (₹) *</label>
                <input
                  name="rent"
                  type="number"
                  value={form.rent}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Available From *</label>
                <input
                  name="availableFrom"
                  type="date"
                  value={form.availableFrom}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Room Type</label>
                <select
                  name="roomType"
                  value={form.roomType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                  <option value="Dorm">Dorm</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl border p-5">
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-1 mb-3">
              <CheckSquare size={14} /> Amenities
            </h2>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_OPTIONS.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition ${
                    form.amenities.includes(a)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/my-listings')}
              className="flex-1 border border-gray-200 text-gray-600 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? '⏳ Saving...' : '✅ Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditListing;