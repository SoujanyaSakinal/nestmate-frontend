import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { MapPin, PlusCircle, Edit, XCircle, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

function MyListings() {
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await API.get('/listings/my');
      setMyListings(res.data);
    } catch (err) {
      console.error('Failed to fetch my listings:', err);
    } finally {
      // setLoading(false);
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      await API.put(`/listings/${id}/status`, { status: newStatus });
      setMyListings(prev =>
        prev.map(l => l.id === id ? { ...l, status: newStatus } : l)
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing? This cannot be undone.')) return;
    try {
      await API.delete(`/listings/${id}`);
      setMyListings(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete listing:', err);
    }
  };

  const statusColor = (status) => {
    if (status === 'Available') return 'bg-green-100 text-green-700';
    if (status === 'Filling Fast') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-600';
  };

  const statusIcon = (status) => {
    if (status === 'Available') return <CheckCircle size={13} />;
    if (status === 'Filling Fast') return <AlertCircle size={13} />;
    return <XCircle size={13} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
            <p className="text-gray-500 text-sm mt-1">{myListings.length} listings posted by you</p>
          </div>
          <Link
            to="/post"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition text-sm"
          >
            <PlusCircle size={16} /> Post New
          </Link>
        </div>

        {/* Empty state */}
        {myListings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border">
            <p className="text-6xl mb-4">🏠</p>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No listings yet</h2>
            <p className="text-gray-400 text-sm mb-6">Post your first PG or hostel listing for free.</p>
            <Link
              to="/post"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Post a Listing
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {myListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="flex flex-col sm:flex-row">

                  {/* Image */}
                  <img
                    src={listing.photoUrl}
                    alt={listing.title}
                    className="w-full sm:w-48 h-40 sm:h-auto object-cover"
                  />

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-base">{listing.title}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                          <MapPin size={12} />
                          {listing.area}, {listing.city}
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${statusColor(listing.status)}`}>
                        {statusIcon(listing.status)} {listing.status}
                      </span>
                    </div>

                    {/* Details row */}
                    <div className="flex gap-3 mb-4 flex-wrap">
                      <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">{listing.roomType}</span>
                      <span className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-full">{listing.gender}</span>
                      <span className="text-blue-600 font-bold text-sm">₹{listing.rent.toLocaleString()}/mo</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/listings/${listing.id}`}
                        className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                      >
                        View
                      </Link>
                      <Link
                        to={`/edit/${listing.id}`}
                        className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                      >
                        <Edit size={12} /> Edit
                      </Link>

                      {listing.status !== 'Available' && (
                        <button
                          onClick={() => changeStatus(listing.id, 'Available')}
                          className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-600 hover:bg-green-100 transition"
                        >
                          <CheckCircle size={12} /> Mark Available
                        </button>
                      )}
                      {listing.status !== 'Filling Fast' && (
                        <button
                          onClick={() => changeStatus(listing.id, 'Filling Fast')}
                          className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-600 hover:bg-yellow-100 transition"
                        >
                          <AlertCircle size={12} /> Filling Fast
                        </button>
                      )}
                      {listing.status !== 'Closed' && (
                        <button
                          onClick={() => changeStatus(listing.id, 'Closed')}
                          className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition"
                        >
                          <XCircle size={12} /> Close
                        </button>
                      )}
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
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

export default MyListings;