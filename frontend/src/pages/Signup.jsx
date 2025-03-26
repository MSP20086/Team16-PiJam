import React, { useState } from 'react';
import { useSignup } from '../hooks/useSignup';
import { useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate();
    const { signup, error, isLoading } = useSignup();

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;
        return strength;
    };

    // Form validation
    const validateForm = () => {
        const errors = {};
        
        if (!name.trim()) {
            errors.name = "Name is required";
        } else if (name.length < 3) {
            errors.name = "Name must be at least 3 characters long";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!password.trim()) {
            errors.password = "Password is required";
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters long";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                await signup(name, email, password, role);
            } catch (error) {
                console.error('Error during signup:', error);
            }
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const redirectToLogin = () => {
        navigate('/login');
    };

    const getPasswordStrengthColor = () => {
        switch(passwordStrength) {
            case 0:
            case 1:
                return 'bg-red-500';
            case 2:
            case 3:
                return 'bg-yellow-500';
            case 4:
            case 5:
                return 'bg-green-500';
            default:
                return 'bg-red-500';
        }
    };

    return (
        <div className='w-screen h-screen flex items-center justify-center bg-gray-100'>
            <div className="w-full max-w-md p-8 shadow-lg rounded-lg bg-white">
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    <h2 className='text-center text-3xl font-bold mb-6 text-gray-800'>Create Account</h2>
                    
                    {/* Username Input */}
                    <div>
                        <label htmlFor="name" className='text-gray-700 mb-2 block'>Username</label>
                        <input 
                            id="name" 
                            value={name} 
                            type="text" 
                            placeholder="Choose a username" 
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md ${
                                validationErrors.name ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {validationErrors.name && (
                            <span className="text-red-600 text-sm mt-1">{validationErrors.name}</span>
                        )}
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className='text-gray-700 mb-2 block'>Email</label>
                        <input 
                            id="email" 
                            value={email} 
                            type="email" 
                            placeholder="you@example.com" 
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md ${
                                validationErrors.email ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {validationErrors.email && (
                            <span className="text-red-600 text-sm mt-1">{validationErrors.email}</span>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label htmlFor="role" className='text-gray-700 mb-2 block'>Select Role</label>
                        <select 
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className='text-gray-700 mb-2 block'>Password</label>
                        <div className="relative">
                            <input 
                                id="password" 
                                value={password} 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Create a strong password" 
                                onChange={handlePasswordChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    validationErrors.password ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                            </button>
                        </div>
                        {validationErrors.password && (
                            <span className="text-red-600 text-sm mt-1">{validationErrors.password}</span>
                        )}
                        <div className="w-full h-1 mt-1 flex">
                            {[...Array(5)].map((_, index) => (
                                <div 
                                    key={index} 
                                    className={`h-full flex-1 mx-0.5 ${
                                        index < passwordStrength 
                                            ? getPasswordStrengthColor() 
                                            : 'bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className='bg-blue-600 hover:bg-blue-700 w-full mt-4 text-white py-2 rounded-md disabled:bg-blue-400'
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    {/* Error Handling */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                            {error || 'An error occurred during signup'}
                        </div>
                    )}

                    {/* Login Redirect */}
                    <div 
                        className='text-center text-sm text-gray-600 hover:text-blue-600 cursor-pointer'
                        onClick={redirectToLogin}
                    >
                        Already have an account? Log in
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;