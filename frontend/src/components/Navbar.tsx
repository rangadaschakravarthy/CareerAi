import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  console.log(user);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Regular user links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Career Quiz", path: "/quiz" },
    { name: "Explore Careers", path: "/careers" },
  ];

  const authLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Learning Hub", path: "/learn" },
    { name: "Practice", path: "/practice" },
    { name: "Profile", path: "/profile" },
  ];

  // Admin-only links
  const adminLinks = [
    { name: "Dashboard", path: "/admin" },
  ];

  const isAdmin = isAuthenticated && user?.email === "admin@gmail.com";

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" />
              <path d="M19 17v4" />
              <path d="M3 5h4" />
              <path d="M17 19h4" />
            </svg>
            <span className="text-xl font-bold text-gray-900">
              CareerAI
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {isAdmin ? (
              adminLinks.map(({ name, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === path
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {name}
                </Link>
              ))
            ) : (
              <>
                {navLinks.map(({ name, path }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === path
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {name}
                  </Link>
                ))}
                {isAuthenticated &&
                  authLinks.map(({ name, path }) => (
                    <Link
                      key={path}
                      to={path}
                      className={`text-sm font-medium transition-colors ${
                        location.pathname === path
                          ? "text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      {name}
                    </Link>
                  ))}
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-700 hover:text-red-600 gap-1"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
            {!isAuthenticated && !isAdmin && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-30"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="absolute right-0 w-3/4 max-w-xs bg-white h-full shadow-md p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-2">
              {isAdmin
                ? adminLinks.map(({ name, path }) => (
                    <Link
                      key={path}
                      to={path}
                      className={`block px-3 py-2 rounded text-sm ${
                        location.pathname === path
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {name}
                    </Link>
                  ))
                : [...navLinks, ...(isAuthenticated ? authLinks : [])].map(
                    ({ name, path }) => (
                      <Link
                        key={path}
                        to={path}
                        className={`block px-3 py-2 rounded text-sm ${
                          location.pathname === path
                            ? "bg-blue-100 text-blue-600"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {name}
                      </Link>
                    )
                  )}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm px-3 py-2 rounded text-gray-700 hover:bg-gray-100 flex items-center gap-2 mt-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

