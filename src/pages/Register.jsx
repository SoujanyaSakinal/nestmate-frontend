import React, { useState } from 'react';
import API from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Home, Eye, EyeOff } from 'lucide-react';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'SEEKER'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      const res = await API.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      }));
      
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-blue-600 font-bold text-2xl mb-2">
            <Home size={28} />
            NestMate
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Create your account</h2>
          <p className="text-gray-500 text-sm mt-1">Join thousands finding their perfect PG</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          {/* Role Toggle */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'SEEKER' })}
                className={`py-3 rounded-xl border-2 font-medium text-sm transition ${
                  formData.role === 'SEEKER'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                🔍 Seeker
                <p className="text-xs font-normal mt-0.5">Looking for a PG</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'POSTER' })}
                className={`py-3 rounded-xl border-2 font-medium text-sm transition ${
                  formData.role === 'POSTER'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                🏠 Poster
                <p className="text-xs font-normal mt-0.5">Listing a PG / Hostel</p>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <User size={18} className="text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Saurabh Patil"
                className="flex-1 outline-none text-gray-700 text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="flex-1 outline-none text-gray-700 text-sm"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <Phone size={18} className="text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="flex-1 outline-none text-gray-700 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <Lock size={18} className="text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="flex-1 outline-none text-gray-700 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition mt-2"
          >
            Create Account
          </button>

        </form>

        {/* Login link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;