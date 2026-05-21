import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import PostListing from './pages/PostListing';
import SavedListings from './pages/SavedListings';
import MyListings from './pages/MyListings';
import EditListing from './pages/EditListing';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/post" element={<PostListing />} />
          <Route path="/saved" element={<SavedListings />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/edit/:id" element={<EditListing />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;