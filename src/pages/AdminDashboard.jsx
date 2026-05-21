import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Home, Star, Trash2, XCircle, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import API from '../utils/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'ADMIN') {
      navigate('/listings');
    }
  }, [navigate]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchListings();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await API.get('/admin/listings');
      setListings(res.data);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await API.delete(`/admin/listings/${id}`);
      setListings(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete listing:', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/listings/${id}/status`, { status });
      setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck size={28} />
            <h1 className="text-2xl font-bold">NestMate Admin Panel</h1>
          </div>
          <p className="text-blue-200 text-sm">Full control over users, listings and platform stats</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border p-5 text-center shadow-sm">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users size={18} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
              <p className="text-xs text-gray-500 mt-1">Total Users</p>
              <p className="text-xs text-gray-400 mt-1">{stats.totalSeekers} seekers · {stats.totalPosters} posters</p>
            </div>
            <div className="bg-white rounded-2xl border p-5 text-center shadow-sm">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Home size={18} className="text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalListings}</p>
              <p className="text-xs text-gray-500 mt-1">Total Listings</p>
              <p className="text-xs text-gray-400 mt-1">{stats.availableListings} available · {stats.closedListings} closed</p>
            </div>
            <div className="bg-white rounded-2xl border p-5 text-center shadow-sm">
              <div className="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertCircle size={18} className="text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.fillingFast}</p>
              <p className="text-xs text-gray-500 mt-1">Filling Fast</p>
              <p className="text-xs text-gray-400 mt-1">High demand listings</p>
            </div>
            <div className="bg-white rounded-2xl border p-5 text-center shadow-sm">
              <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star size={18} className="text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalReviews}</p>
              <p className="text-xs text-gray-500 mt-1">Total Reviews</p>
              <p className="text-xs text-gray-400 mt-1">Across all listings</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2 rounded-xl font-medium text-sm transition ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}
          >
            👥 Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-5 py-2 rounded-xl font-medium text-sm transition ${
              activeTab === 'listings'
                ? 'bg-blue-600 text-white'
                : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}
          >
            🏠 Listings ({listings.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">ID</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Name</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Email</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Phone</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Role</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Joined</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-400">#{user.id}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{user.name}</td>
                    <td className="px-5 py-3 text-gray-600">{user.email}</td>
                    <td className="px-5 py-3 text-gray-600">{user.phone || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        user.role === 'POSTER' ? 'bg-blue-100 text-blue-700' :
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="flex flex-col gap-3">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl border shadow-sm p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 flex-1">
                    <img
                      src={listing.photoUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200'}
                      alt={listing.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{listing.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{listing.area}, {listing.city}</p>
                      <p className="text-xs text-blue-600 font-semibold mt-1">₹{listing.rent?.toLocaleString()}/mo · {listing.roomType} · {listing.gender}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Posted by: {listing.poster?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(listing.status)}`}>
                      {listing.status}
                    </span>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {listing.status !== 'Available' && (
                        <button onClick={() => updateStatus(listing.id, 'Available')}
                          className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-600 border border-green-200 hover:bg-green-100">
                          <CheckCircle size={11} className="inline mr-1" />Available
                        </button>
                      )}
                      {listing.status !== 'Filling Fast' && (
                        <button onClick={() => updateStatus(listing.id, 'Filling Fast')}
                          className="text-xs px-2 py-1 rounded-lg bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-100">
                          <AlertCircle size={11} className="inline mr-1" />Filling Fast
                        </button>
                      )}
                      {listing.status !== 'Closed' && (
                        <button onClick={() => updateStatus(listing.id, 'Closed')}
                          className="text-xs px-2 py-1 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100">
                          <XCircle size={11} className="inline mr-1" />Close
                        </button>
                      )}
                      <button onClick={() => deleteListing(listing.id)}
                        className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-500 border border-red-200 hover:bg-red-100">
                        <Trash2 size={11} className="inline mr-1" />Delete
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

export default AdminDashboard;