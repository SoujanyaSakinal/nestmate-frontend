import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Heart, Star, Wifi, Utensils,
         Wind, Shield, ArrowLeft, Calendar, Users } from 'lucide-react';
import API from '../utils/api';

function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviews, setReviews] = useState([]);
  const [mainPhoto, setMainPhoto] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchListing();
    fetchReviews();
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await API.get(`/listings/${id}`);
      setListing(res.data);
    } catch (err) {
      console.error('Failed to fetch listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/listings/${id}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!review.comment) return;
    try {
      const res = await API.post(`/listings/${id}/reviews`, review);
      setReviews([...reviews, res.data]);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      console.error('Failed to post review:', err);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const statusColor = (status) => {
    if (status === 'Available') return 'bg-green-100 text-green-700';
    if (status === 'Filling Fast') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🏠</p>
          <p className="text-gray-500 text-lg">Listing not found.</p>
          <Link to="/listings" className="text-blue-600 mt-4 block">← Back to listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Back button */}
        <Link to="/listings" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 text-sm">
          <ArrowLeft size={16} /> Back to listings
        </Link>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-6">

          {/* Photo */}
          <div className="relative">
          {listing.photoUrls && listing.photoUrls.split(',').filter(u => u).length > 1 ? (
          <div>
            <img
              src={mainPhoto || listing.photoUrls.split(',')[0]}
              alt={listing.title}
              className="w-full h-72 object-cover"
            />
            <div className="flex gap-2 p-3 bg-gray-100 overflow-x-auto">
              {listing.photoUrls.split(',').filter(u => u).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Room view ${i + 1}`}
                  onClick={() => setMainPhoto(url)}
                  className={`h-16 w-24 object-cover rounded-lg flex-shrink-0 cursor-pointer border-2 transition ${
                    (mainPhoto || listing.photoUrls.split(',')[0]) === url
                      ? 'border-blue-500'
                      : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <img
            src={listing.photoUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600'}
            alt={listing.title}
            className="w-full h-72 object-cover"
          />
        )}
            <span className={`absolute top-4 left-4 text-sm font-semibold px-3 py-1 rounded-full ${statusColor(listing.status)}`}>
              {listing.status}
            </span>
            <button
              onClick={() => setSaved(!saved)}
              className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-md hover:scale-110 transition"
            >
              <Heart size={20} className={saved ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
            </button>
          </div>

          <div className="p-6">

            {/* Title + rating */}
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{listing.title}</h1>
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-700">{avgRating}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
              <MapPin size={14} />
              {listing.address}, {listing.area}, {listing.city}
            </div>

            {/* Price + badges */}
            <div className="flex items-center gap-4 mb-6">
              <div>
                <span className="text-3xl font-bold text-blue-600">₹{listing.rent?.toLocaleString()}</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <span className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full font-medium">{listing.roomType}</span>
              <span className="bg-purple-50 text-purple-600 text-sm px-3 py-1 rounded-full font-medium">{listing.gender}</span>
            </div>

            {/* Info row */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} className="text-blue-500" />
                <span>Available from: <strong>{listing.availableFrom}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} className="text-blue-500" />
                <span>For: <strong>{listing.gender} only</strong></span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">About this PG</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {listing.amenities && listing.amenities.split(',').map(a => (
                  <span key={a} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-full">
                    {a.trim() === 'WiFi' && <Wifi size={13} />}
                    {a.trim() === 'Meals' && <Utensils size={13} />}
                    {a.trim() === 'AC' && <Wind size={13} />}
                    {a.trim() === 'CCTV' && <Shield size={13} />}
                    {a.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-blue-50 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-800 mb-1">Contact the Owner</h3>
              <p className="text-gray-500 text-sm mb-4">
                Posted by <strong>{listing.poster?.name || 'Owner'}</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/91${listing.poster?.phone}?text=Hi, I found your PG listing on NestMate — ${listing.title}. Is it still available?`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-green-500 text-white text-center py-3 rounded-xl font-semibold hover:bg-green-600 transition"
                >
                  💬 Chat on WhatsApp
                </a>
                <button
                  onClick={() => setShowPhone(!showPhone)}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-blue-200 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
                >
                  <Phone size={16} />
                  {showPhone ? listing.poster?.phone : 'Show Phone Number'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="font-bold text-gray-800 text-lg mb-4">
            Reviews ({reviews.length}) · ⭐ {avgRating}
          </h3>

          {/* Review list */}
          <div className="flex flex-col gap-4 mb-6">
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map(r => (
                <div key={r.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-700 text-sm">
                      {r.author?.name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13}
                        className={i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{r.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Add review */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-700 mb-3">Write a Review</h4>
            <form onSubmit={submitReview} className="flex flex-col gap-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setReview({ ...review, rating: n })}>
                      <Star size={24}
                        className={n <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={review.comment}
                onChange={e => setReview({ ...review, comment: e.target.value })}
                placeholder="Share your experience about this PG..."
                rows={3}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition self-start px-6"
              >
                Post Review
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ListingDetail;