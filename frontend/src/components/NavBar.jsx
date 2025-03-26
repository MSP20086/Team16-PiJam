// import React, { useState, useEffect } from 'react';
// import { Menu, X, ChevronDown, User, LogIn, Home, FileText, Award, PlusCircle, BarChart2, Star, Zap, Gift, Music, Sun, Moon } from 'lucide-react';

// // This would come from your authentication system
// const ROLE = {
//   GUEST: 'guest',
//   STUDENT: 'student',
//   TEACHER: 'teacher'
// };

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [userRole, setUserRole] = useState(ROLE.TEACHER);
//   const [isLoggedIn, setIsLoggedIn] = useState(true);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [streakCount, setStreakCount] = useState(0);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [xpPoints, setXpPoints] = useState(0);
//   const [navbarColor, setNavbarColor] = useState('#ffffff');

//   // Simulated XP and streak data
//   useEffect(() => {
//     if (isLoggedIn) {
//       setStreakCount(Math.floor(Math.random() * 15) + 1);
//       setXpPoints(Math.floor(Math.random() * 1500) + 100);
//     } else {
//       setStreakCount(0);
//       setXpPoints(0);
//     }
//   }, [isLoggedIn]);

//   // Rainbow color effect on scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;
//       const hue = (scrollPosition / 5) % 360;
//       // Very subtle color change - just a hint of color
//       setNavbarColor(`hsl(${hue}, 10%, 98%)`);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     // Set initial theme based on user preference
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     setIsDarkMode(prefersDark);
//   }, []);

//   const toggleNavbar = () => {
//     setIsOpen(!isOpen);
//   };

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   // Mock login/logout functions
//   const handleLogin = () => {
//     localStorage.setItem('userRole', ROLE.STUDENT);
//     setUserRole(ROLE.STUDENT);
//     setIsLoggedIn(true);
//     setShowConfetti(true);
    
//     // Hide confetti after 3 seconds
//     setTimeout(() => {
//       setShowConfetti(false);
//     }, 3000);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('userRole');
//     setUserRole(ROLE.GUEST);
//     setIsLoggedIn(false);
//   };

//   return (
//     <nav 
//       className={`shadow-lg sticky top-0 z-50 transition-all duration-500 ease-in-out ${isDarkMode ? 'bg-gray-900 text-white' : ''} `}
//       style={{ backgroundColor: isDarkMode ? '#121212' : navbarColor }}
//     >
//       {/* Animated progress bar at the top */}
//       {isLoggedIn && (
//         <div className="relative h-1 w-full bg-gray-200">
//           <div 
//             className="absolute h-1 bg-gradient-to-r from-purple-500 to-pink-500"
//             style={{ width: `${(xpPoints / 2000) * 100}%` }}
//           ></div>
//         </div>
//       )}
      
//       {/* Confetti animation on login */}
//       {showConfetti && (
//         <div className="absolute inset-0 pointer-events-none">
//           {[...Array(50)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute animate-confetti"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: "-10px",
//                 backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
//                 width: `${Math.random() * 10 + 5}px`,
//                 height: `${Math.random() * 10 + 5}px`,
//                 transform: `rotate(${Math.random() * 360}deg)`,
//                 animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
//               }}
//             />
//           ))}
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <div className="flex-shrink-0 flex items-center">
//               <span className={`text-xl font-bold transform hover:scale-105 transition-transform ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`}>
//                 π<span className="text-pink-500">Jam</span> Foundation
//               </span>
//             </div>
//             <div className="hidden md:ml-6 md:flex md:space-x-4">
//               {/* Common Links For All Roles */}
//               <a
//                 href="/"
//                 className={`hover:bg-indigo-100 px-3 py-2 rounded-full text-sm font-medium flex items-center transition duration-300 ${isDarkMode ? 'hover:bg-gray-800' : ''}`}
//               >
//                 <Home className={`mr-1 h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} /> Home
//               </a>

//               {/* Student Links */}
//               {userRole === ROLE.STUDENT && isLoggedIn && (
//                 <>
//                   <a
//                     href="/submissions"
//                     className={`hover:bg-indigo-100 px-3 py-2 rounded-full text-sm font-medium flex items-center transition duration-300 ${isDarkMode ? 'hover:bg-gray-800' : ''}`}
//                   >
//                     <FileText className={`mr-1 h-4 w-4 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} /> My Jams
//                   </a>
//                   <a
//                     href="/challenges"
//                     className={`hover:bg-indigo-100 px-3 py-2 rounded-full text-sm font-medium flex items-center transition duration-300 ${isDarkMode ? 'hover:bg-gray-800' : ''}`}
//                   >
//                     <Award className={`mr-1 h-4 w-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} /> Quests
//                   </a>
//                 </>
//               )}

//               {/* Teacher Links */}
//               {userRole === ROLE.TEACHER && isLoggedIn && (
//                 <>
//                   <a
//                     href="/create-challenge"
//                     className={`hover:bg-indigo-100 px-3 py-2 rounded-full text-sm font-medium flex items-center transition duration-300 ${isDarkMode ? 'hover:bg-gray-800' : ''}`}
//                   >
//                     <PlusCircle className={`mr-1 h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} /> Craft Quest
//                   </a>
//                   <a
//                     href="/teacher/challenges"
//                     className={`hover:bg-indigo-100 px-3 py-2 rounded-full text-sm font-medium flex items-center transition duration-300 ${isDarkMode ? 'hover:bg-gray-800' : ''}`}
//                   >
//                     <Award className={`mr-1 h-4 w-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} /> My Quests
//                   </a>
//                   <div className="relative group">
//                     <button className={`hover:bg-indigo-100 px-3 py-2 rounded-full text-sm font-medium flex items-center transition duration-300 ${isDarkMode ? 'hover:bg-gray-800' : ''}`}>
//                       <BarChart2 className={`mr-1 h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} /> More <ChevronDown className="ml-1 h-3 w-3" />
//                     </button>
//                     <div className={`absolute left-0 mt-2 w-48 rounded-lg shadow-lg py-1 focus:outline-none hidden group-hover:block z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
//                       <a
//                         href="/insights"
//                         className={`block px-4 py-2 text-sm hover:bg-indigo-100 rounded-md mx-1 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
//                       >
//                         Insights & Dashboard
//                       </a>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Right side elements */}
//           <div className="hidden md:flex md:items-center md:space-x-4">
//             {/* Theme toggle */}
//             <button 
//               onClick={toggleTheme}
//               className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//             >
//               {isDarkMode ? (
//                 <Sun className="h-5 w-5 text-yellow-400" />
//               ) : (
//                 <Moon className="h-5 w-5 text-indigo-600" />
//               )}
//             </button>
            
//             {/* Streak counter for logged-in users */}
//             {isLoggedIn && (
//               <div className={`flex items-center px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-indigo-100'}`}>
//                 <Zap className="h-4 w-4 text-yellow-500 mr-1" />
//                 <span className="text-sm font-medium">
//                   {streakCount} day{streakCount !== 1 ? 's' : ''}
//                 </span>
//               </div>
//             )}
            
//             {/* XP for logged-in users */}
//             {isLoggedIn && (
//               <div className={`flex items-center px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-pink-100'}`}>
//                 <Star className="h-4 w-4 text-pink-500 mr-1" />
//                 <span className="text-sm font-medium">
//                   {xpPoints} XP
//                 </span>
//               </div>
//             )}

//             {/* Auth Section */}
//             {!isLoggedIn ? (
//               <a
//                 href="/login"
//                 onClick={handleLogin}
//                 className={`hover:bg-indigo-500 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center transition duration-300 hover:scale-105 transform`}
//               >
//                 <LogIn className="mr-1 h-4 w-4" /> Join the Jam
//               </a>
//             ) : (
//               <div className="relative group">
//                 <button className="flex items-center focus:outline-none rounded-full border-2 border-indigo-300 p-1 transition hover:border-indigo-400">
//                   <span className="sr-only">Open user menu</span>
//                   <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${userRole === ROLE.STUDENT ? 'bg-gradient-to-br from-pink-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
//                     <User className="h-5 w-5" />
//                   </div>
//                 </button>
//                 <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 focus:outline-none hidden group-hover:block z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
//                   <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
//                     <p className="text-sm font-semibold">
//                       {userRole === ROLE.STUDENT ? 'Student' : 'Teacher'} Account
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
//                   </div>
//                   <a
//                     href="/profile"
//                     className={`block px-4 py-2 text-sm hover:bg-indigo-100 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
//                   >
//                     Your Profile
//                   </a>
//                   <a
//                     href="/rewards"
//                     className={`block px-4 py-2 text-sm hover:bg-indigo-100 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
//                   >
//                     <div className="flex items-center">
//                       <Gift className="h-4 w-4 mr-2 text-pink-500" />
//                       Claim Rewards
//                       {Math.random() > 0.5 && (
//                         <span className="ml-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">NEW</span>
//                       )}
//                     </div>
//                   </a>
//                   <a
//                     href="#"
//                     onClick={handleLogout}
//                     className={`block px-4 py-2 text-sm hover:bg-indigo-100 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
//                   >
//                     Sign out
//                   </a>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="flex items-center md:hidden">
//             {isLoggedIn && (
//               <>
//                 <div className="flex items-center mr-4">
//                   <Zap className="h-4 w-4 text-yellow-500 mr-1" />
//                   <span className="text-sm font-medium">
//                     {streakCount}d
//                   </span>
//                 </div>
//                 <div className="flex items-center mr-4">
//                   <Star className="h-4 w-4 text-pink-500 mr-1" />
//                   <span className="text-sm font-medium">
//                     {xpPoints}
//                   </span>
//                 </div>
//               </>
//             )}
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-full mr-2"
//             >
//               {isDarkMode ? (
//                 <Sun className="h-5 w-5 text-yellow-400" />
//               ) : (
//                 <Moon className="h-5 w-5 text-indigo-600" />
//               )}
//             </button>
//             <button
//               onClick={toggleNavbar}
//               className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
//             >
//               <span className="sr-only">Open main menu</span>
//               {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu with sliding animation */}
//       <div 
//         className={`transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'} absolute w-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
//         style={{ top: '64px', height: 'calc(100vh - 64px)' }}
//       >
//         <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//           <a
//             href="/"
//             className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
//           >
//             <div className="flex items-center">
//               <Home className={`mr-2 h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} /> Home
//             </div>
//           </a>

//           {/* Student Mobile Links */}
//           {userRole === ROLE.STUDENT && isLoggedIn && (
//             <>
//               <a
//                 href="/submissions"
//                 className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
//               >
//                 <div className="flex items-center">
//                   <FileText className={`mr-2 h-5 w-5 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} /> My Jams
//                 </div>
//               </a>
//               <a
//                 href="/challenges"
//                 className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
//               >
//                 <div className="flex items-center">
//                   <Award className={`mr-2 h-5 w-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} /> Quests
//                 </div>
//               </a>
//             </>
//           )}

//           {/* Teacher Mobile Links */}
//           {userRole === ROLE.TEACHER && isLoggedIn && (
//             <>
//               <a
//                 href="/create-challenge"
//                 className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
//               >
//                 <div className="flex items-center">
//                   <PlusCircle className={`mr-2 h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} /> Craft Quest
//                 </div>
//               </a>
//               <a
//                 href="/teacher/challenges"
//                 className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
//               >
//                 <div className="flex items-center">
//                   <Award className={`mr-2 h-5 w-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} /> My Quests
//                 </div>
//               </a>
//               <a
//                 href="/insights"
//                 className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
//               >
//                 <div className="flex items-center">
//                   <BarChart2 className={`mr-2 h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} /> Insights & Dashboard
//                 </div>
//               </a>
//             </>
//           )}
          
//           {/* Music player easter egg */}
//           <div className={`px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'bg-gray-800' : 'bg-indigo-50'}`}>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <Music className={`mr-2 h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} /> Coding Jam
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button className="p-1 rounded-full bg-indigo-600 text-white">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//             <div className="mt-2 bg-gray-200 dark:bg-gray-700 h-1 w-full rounded-full">
//               <div className="bg-indigo-600 h-1 rounded-full" style={{ width: '35%' }}></div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Auth Section */}
//         <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
//           {!isLoggedIn ? (
//             <div className="px-2">
//               <a
//                 href="/login"
//                 onClick={handleLogin}
//                 className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white text-center"
//               >
//                 Join the Jam
//               </a>
//             </div>
//           ) : (
//             <>
//               <div className="flex items-center px-5">
//                 <div className="flex-shrink-0">
//                   <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${userRole === ROLE.STUDENT ? 'bg-gradient-to-br from-pink-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
//                     <User className="h-6 w-6" />
//                   </div>
//                 </div>
//                 <div className="ml-3">
//                   <div className="text-base font-medium">
//                     {userRole === ROLE.STUDENT ? 'Student User' : 'Teacher User'}
//                   </div>
//                   <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                     user@example.com
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-3 px-2 space-y-1">
//                 <a
//                   href="/profile"
//                   className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
//                 >
//                   Your Profile
//                 </a>
//                 <a
//                   href="/rewards"
//                   className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
//                 >
//                   <div className="flex items-center">
//                     <Gift className="h-5 w-5 mr-2 text-pink-500" />
//                     Claim Rewards
//                     {Math.random() > 0.5 && (
//                       <span className="ml-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">NEW</span>
//                     )}
//                   </div>
//                 </a>
//                 <a
//                   href="#"
//                   onClick={handleLogout}
//                   className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
//                 >
//                   Sign out
//                 </a>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
      
//       {/* Custom keyframes for confetti animation */}
//       <style jsx>{`
//         @keyframes fall {
//           0% {
//             transform: translateY(0) rotate(0deg);
//             opacity: 1;
//           }
//           100% {
//             transform: translateY(100vh) rotate(720deg);
//             opacity: 0;
//           }
//         }
        
//         @keyframes pulse {
//           0%, 100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.5;
//           }
//         }
        
//         .animate-confetti {
//           animation: fall 3s linear forwards;
//         }
//       `}</style>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, X, User, LogIn, Home, FileText, Award, PlusCircle, 
  GraduationCap, ChevronDown
} from 'lucide-react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsUserMenuOpen(false);
  };

  // Role-specific styling and icons
  const getRoleDetails = () => {
    if (!user) return null;

    const roleDetails = {
      student: {
        icon: <GraduationCap className="h-5 w-5 text-pink-500" />,
        bgClass: 'bg-gradient-to-br from-pink-500 to-indigo-600',
        label: 'Student',
        color: 'text-pink-600'
      },
      teacher: {
        icon: <GraduationCap className="h-5 w-5 text-blue-500" />,
        bgClass: 'bg-gradient-to-br from-blue-500 to-purple-600',
        label: 'Teacher',
        color: 'text-blue-600'
      }
    };

    return roleDetails[user.role] || roleDetails.student;
  };

  const roleDetails = getRoleDetails();

  // Extract first name or use full name
  const getUserDisplayName = () => {
    if (!user) return '';
    const name = user.name || user.email;
    return name.split(' ')[0];
  };

  return (
    <nav 
      className={`shadow-lg sticky top-0 z-50 transition-all duration-500 ease-in-out 
        ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}
        ${user ? 'border-b' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className={`text-xl font-bold transform hover:scale-105 transition-transform 
                ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`}
            >
              π<span className="text-pink-500">Jam</span> Foundation
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Common Links */}
            <Link
              to="/"
              className={`hover:bg-indigo-100 px-3 py-2 rounded-full text-sm font-medium flex items-center transition duration-300 
                ${isDarkMode ? 'hover:bg-gray-800' : ''}`}
            >
              <Home className={`mr-1 h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} /> 
              Home
            </Link>

            {/* User-Specific Navigation */}
            {user && user.role === 'student' && (
              <>
                <Link
                  to="/challenges"
                  className={`hover:bg-indigo-100 px-3 py-2 rounded-full text-sm font-medium flex items-center transition duration-300 
                    ${isDarkMode ? 'hover:bg-gray-800' : ''}`}
                >
                  <Award className={`mr-1 h-4 w-4 text-yellow-500`} /> 
                  Quests
                </Link>
                <Link
                  to="/student/dashboard"
                  className={`hover:bg-indigo-100 px-3 py-2 rounded-full text-sm font-medium flex items-center transition duration-300 
                    ${isDarkMode ? 'hover:bg-gray-800' : ''}`}
                >
                  <FileText className={`mr-1 h-4 w-4 text-pink-500`} /> 
                  My Jams
                </Link>
              </>
            )}

            {user && user.role === 'teacher' && (
              <>
                <Link
                  to="/teacher/challenges"
                  className={`hover:bg-indigo-100 px-3 py-2 rounded-full text-sm font-medium flex items-center transition duration-300 
                    ${isDarkMode ? 'hover:bg-gray-800' : ''}`}
                >
                  <Award className={`mr-1 h-4 w-4 text-blue-500`} /> 
                  My Quests
                </Link>
                <Link
                  to="/challenges/new"
                  className={`hover:bg-indigo-100 px-3 py-2 rounded-full text-sm font-medium flex items-center transition duration-300 
                    ${isDarkMode ? 'hover:bg-gray-800' : ''}`}
                >
                  <PlusCircle className={`mr-1 h-4 w-4 text-green-500`} /> 
                  Craft Quest
                </Link>
              </>
            )}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`hover:bg-indigo-500 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center transition duration-300 hover:scale-105 transform`}
                >
                  <LogIn className="mr-1 h-4 w-4" /> Join the Jam
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className={`flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full hover:shadow-md transition-all duration-300 
                    ${isUserMenuOpen ? 'ring-2 ring-indigo-300' : ''}`}
                >
                  {/* Role Badge */}
                  <div className={`rounded-full p-2 ${roleDetails.bgClass}`}>
                    {roleDetails.icon}
                  </div>

                  {/* User Info */}
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-semibold ${roleDetails.color}`}>
                        Hi, {getUserDisplayName()}
                      </span>
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                      />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {roleDetails.label} Account
                    </div>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user.name || user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LogIn className="inline-block mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleNavbar}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none 
                ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          {/* User Role Display for Mobile */}
          {user && (
            <div className="px-4 py-3 border-b flex items-center space-x-3">
              <div className={`rounded-full p-2 ${roleDetails.bgClass}`}>
                {roleDetails.icon}
              </div>
              <div>
                <div className={`font-semibold ${roleDetails.color}`}>
                  {roleDetails.label} Account
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center 
                ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
              onClick={toggleNavbar}
            >
              <Home className={`mr-2 h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} /> 
              Home
            </Link>

            {/* Student Mobile Links */}
            {user && user.role === 'student' && (
              <>
                <Link
                  to="/challenges"
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center 
                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
                  onClick={toggleNavbar}
                >
                  <Award className="mr-2 h-5 w-5 text-yellow-500" /> 
                  Quests
                </Link>
                <Link
                  to="/student/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center 
                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
                  onClick={toggleNavbar}
                >
                  <FileText className="mr-2 h-5 w-5 text-pink-500" /> 
                  My Jams
                </Link>
              </>
            )}

            {/* Teacher Mobile Links */}
            {user && user.role === 'teacher' && (
              <>
                <Link
                  to="/teacher/challenges"
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center 
                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
                  onClick={toggleNavbar}
                >
                  <Award className="mr-2 h-5 w-5 text-blue-500" /> 
                  My Quests
                </Link>
                <Link
                  to="/challenges/new"
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center 
                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}
                  onClick={toggleNavbar}
                >
                  <PlusCircle className="mr-2 h-5 w-5 text-green-500" /> 
                  Craft Quest
                </Link>
              </>
            )}

            {/* Logout for Mobile */}
            {user && (
              <button
                onClick={handleLogout}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center 
                  ${isDarkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
              >
                <LogIn className="mr-2 h-5 w-5 text-red-500" /> 
                Logout
              </button>
            )}

            {/* Login/Signup for Mobile */}
            {!user && (
              <div className="space-y-2 pt-2">
                <Link
                  to="/login"
                  className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md"
                  onClick={toggleNavbar}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center bg-pink-600 text-white px-4 py-2 rounded-md"
                  onClick={toggleNavbar}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;