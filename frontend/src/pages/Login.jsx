import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();
    const { login, error, isLoading } = useLogin();

    // Form validation
    const validateForm = () => {
        const errors = {};
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            errors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!password.trim()) {
            errors.password = "Password is required";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                await login(email, password);
            } catch (error) {
                console.error('Error during login:', error);
            }
        }
    };

    const redirectToSignup = () => {
        navigate('/signup');
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    return (
        <div className='w-screen h-screen flex items-center justify-center bg-gray-100'>
            <div className="w-full max-w-md p-8 shadow-lg rounded-lg bg-white">
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    <h2 className='text-center text-3xl font-bold mb-6 text-gray-800'>Welcome Back</h2>
                    
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className='text-gray-700 mb-2 block'>Email</label>
                        <input 
                            id="email" 
                            type="email" 
                            value={email} 
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

                    {/* Password Input */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="password" className='text-gray-700'>Password</label>
                            <button 
                                type="button"
                                onClick={handleForgotPassword}
                                className='text-blue-600 hover:text-blue-800 text-sm'
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <div className="relative">
                            <input 
                                id="password" 
                                type={showPassword ? "text" : "password"} 
                                value={password} 
                                placeholder="Enter your password" 
                                onChange={(e) => setPassword(e.target.value)}
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
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className='bg-blue-600 hover:bg-blue-700 w-full mt-4 text-white py-2 rounded-md disabled:bg-blue-400'
                    >
                        {isLoading ? 'Logging In...' : 'Sign In'}
                    </button>

                    {/* Error Handling */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                            {error || 'An error occurred during login'}
                        </div>
                    )}

                    {/* Signup Redirect */}
                    <div 
                        className='text-center text-sm text-gray-600 hover:text-blue-600 cursor-pointer'
                        onClick={redirectToSignup}
                    >
                        Don't have an account? Sign up
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;