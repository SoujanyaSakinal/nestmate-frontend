import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, PlusCircle, Heart, List, LogOut, Menu, X, ShieldCheck} from 'lucide-react';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1 transition font-medium text-sm ${
      isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Home size={24} />
          NestMate
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/listings" className={navLinkClass}>
            <Search size={16} /> Browse
          </NavLink>
          {user?.role === 'POSTER' && (
            <NavLink to="/post" className={navLinkClass}>
              <PlusCircle size={16} /> Post a PG
            </NavLink>
          )}
          <NavLink to="/saved" className={navLinkClass}>
            <Heart size={16} /> Saved
          </NavLink>
          {user?.role === 'POSTER' && (
            <NavLink to="/my-listings" className={navLinkClass}>
              <List size={16} /> My Listings
            </NavLink>
          )}
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" className={navLinkClass}>
              <ShieldCheck size={16} /> Admin
            </NavLink>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-gray-700 font-medium text-sm">Hi, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition text-sm"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-blue-600 hover:underline text-sm">Login</NavLink>
              <NavLink to="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm">
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3">
          <NavLink to="/listings" onClick={() => setMenuOpen(false)}
            className={({ isActive }) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}>
            Browse
          </NavLink>
          <NavLink to="/post" onClick={() => setMenuOpen(false)}
            className={({ isActive }) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}>
            Post a PG
          </NavLink>
          <NavLink to="/saved" onClick={() => setMenuOpen(false)}
            className={({ isActive }) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}>
            Saved
          </NavLink>
          <NavLink to="/my-listings" onClick={() => setMenuOpen(false)}
            className={({ isActive }) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}>
            My Listings
          </NavLink>
          <button onClick={handleLogout} className="text-red-500 text-left text-sm">Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;