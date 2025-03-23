import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, LogIn, Home, FileText, Award, PlusCircle, BarChart2 } from 'lucide-react';

// This would come from your authentication system
const ROLE = {
  GUEST: 'guest',
  STUDENT: 'student',
  TEACHER: 'teacher'
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(ROLE.GUEST); // Default to guest
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock function - replace with actual auth check
  useEffect(() => {
    // Simulating auth check
    const checkAuthStatus = () => {
      // This would be replaced with your actual auth logic
      const mockRole = localStorage.getItem('userRole') || ROLE.GUEST;
      const mockLoggedIn = mockRole !== ROLE.GUEST;
      
      setUserRole(mockRole);
      setIsLoggedIn(mockLoggedIn);
    };
    
    checkAuthStatus();
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // Mock login/logout functions - replace with actual auth functions
  const handleLogin = () => {
    // For demo purposes only
    localStorage.setItem('userRole', ROLE.TEACHER); // or TEACHER
    setUserRole(ROLE.STUDENT);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setUserRole(ROLE.GUEST);
    setIsLoggedIn(false);
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-white text-xl font-bold">CodeChallenge</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {/* Common Links For All Roles */}
              <a
                href="/"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <Home className="mr-1 h-4 w-4" /> Home
              </a>

              {/* Student Links */}
              {userRole === ROLE.STUDENT && isLoggedIn && (
                <>
                  <a
                    href="/submissions"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <FileText className="mr-1 h-4 w-4" /> My Submissions
                  </a>
                  <a
                    href="/challenges"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <Award className="mr-1 h-4 w-4" /> Challenges
                  </a>
                </>
              )}

              {/* Teacher Links */}
              {userRole === ROLE.TEACHER && isLoggedIn && (
                <>
                  <a
                    href="/create-challenge"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <PlusCircle className="mr-1 h-4 w-4" /> Create Challenge
                  </a>
                  <a
                    href="/teacher/challenges"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <Award className="mr-1 h-4 w-4" /> My Challenges
                  </a>
                  <div className="relative group">
                    <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <BarChart2 className="mr-1 h-4 w-4" /> More <ChevronDown className="ml-1 h-3 w-3" />
                    </button>
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block z-10">
                      <a
                        href="/insights"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Insights & Dashboard
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:ml-6 md:flex md:items-center">
            {!isLoggedIn ? (
              <a
                href="/login"
                onClick={handleLogin}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <LogIn className="mr-1 h-4 w-4" /> Login / Register
              </a>
            ) : (
              <div className="relative group">
                <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                </button>
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block z-10">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleNavbar}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </a>

            {/* Student Mobile Links */}
            {userRole === ROLE.STUDENT && isLoggedIn && (
              <>
                <a
                  href="/submissions"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  My Submissions
                </a>
                <a
                  href="/challenges"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Challenges
                </a>
              </>
            )}

            {/* Teacher Mobile Links */}
            {userRole === ROLE.TEACHER && isLoggedIn && (
              <>
                <a
                  href="/create-challenge"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Create Challenge
                </a>
                <a
                  href="/teacher/challenges"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  My Challenges
                </a>
                <a
                  href="/insights"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Insights & Dashboard
                </a>
              </>
            )}
          </div>

          {/* Mobile Auth Section */}
          <div className="pt-4 pb-3 border-t border-gray-700">
            {!isLoggedIn ? (
              <div className="px-2">
                <a
                  href="/login"
                  onClick={handleLogin}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Login / Register
                </a>
              </div>
            ) : (
              <>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
                      <User className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {userRole === ROLE.STUDENT ? 'Student User' : 'Teacher User'}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      user@example.com
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <a
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    onClick={handleLogout}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Sign out
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;