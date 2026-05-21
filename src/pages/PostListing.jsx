import React, { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, IndianRupee, CheckSquare } from 'lucide-react';
import { uploadImage } from '../utils/uploadImage';
import { generateDescription } from '../utils/generateDescription';

const AMENITIES_OPTIONS = [
  'WiFi', 'Meals', 'AC', 'CCTV', 'Laundry',
  'Parking', 'Power Backup', 'Housekeeping',
  'Study Room', 'Warden', 'Furnished', 'Kitchen'
];

function PostListing() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
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
    photoUrls:['','',''],
    amenities: []
  });
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerateDescription = async () => {
    if (!form.title || !form.city || !form.rent) {
      alert('Please fill in Title, City and Rent first!');
      return;
    }
    setGenerating(true);
    try {
      const description = await generateDescription({
        title: form.title,
        city: form.city,
        area: form.area,
        rent: form.rent,
        roomType: form.roomType,
        gender: form.gender,
        amenities: form.amenities
      });
      setForm(prev => ({ ...prev, description }));
    } catch (err) {
      console.error('Failed to generate description:', err);
      alert('Failed to generate description. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingIndex(index);
    try {
      const url = await uploadImage(file);
      const newUrls = [...form.photoUrls];
      newUrls[index] = url;
      setForm(prev => ({
        ...prev,
        photoUrls: newUrls,
        photoUrl: newUrls[0] || prev.photoUrl
      }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploadingIndex(null);
    }
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
        amenities: form.amenities.join(','),
        photoUrl: form.photoUrls[0] || form.photoUrl,
        photoUrls: form.photoUrls.filter(url => url).join(',')
      };
      await API.post('/listings', listingData);
      setSuccess(true);
      setTimeout(() => navigate('/my-listings'), 2000);
    } catch (err) {
      console.error('Failed to post listing:', err);
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-10 shadow-sm border">
          <p className="text-6xl mb-4">🎉</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Listing Posted!</h2>
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
            Post a PG / Hostel
          </h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details and reach thousands of seekers for free.</p>
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
                placeholder="e.g. Sunshine Boys PG"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Description *</label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={generating}
                  className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>✨ Generate with AI</>
                  )}
                </button>
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe your PG — or click 'Generate with AI' above!"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe your PG — facilities, rules, nearby landmarks..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none"
              />
            </div> */}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Photos (up to 3) 📸
              </label>
              <div className="flex flex-col gap-3">
                {[0, 1, 2].map(index => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl p-3 hover:border-blue-400 transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                        className="w-full text-sm text-gray-500"
                      />
                    </div>
                    {form.photoUrls[index] && (
                      <img
                        src={form.photoUrls[index]}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 rounded-xl object-cover border"
                      />
                    )}
                    {uploadingIndex === index && (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">Upload photos from your device — max 3 photos</p>
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
                  placeholder="e.g. Pune"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Area / Locality *</label>
                <input
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Koregaon Park"
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
                placeholder="e.g. 12, MG Road, Koregaon Park"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Room Details */}
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
                  placeholder="e.g. 6500"
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
                <label className="text-sm font-medium text-gray-700 mb-1 block">Gender Preference</label>
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-4 rounded-2xl font-semibold text-base hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? '⏳ Posting...' : '🏠 Post Listing for Free'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostListing;