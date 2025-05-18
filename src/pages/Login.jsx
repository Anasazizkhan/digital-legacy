import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGoogle, FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      
      // First, authenticate with Firebase
      const user = await signInWithGoogle();
      
      // Send the Firebase ID token to backend
      const response = await api.post('/auth/google', { 
        idToken: await user.getIdToken() 
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const formatError = (errorMessage) => {
    if (errorMessage.includes('auth/wrong-password')) {
      return 'Incorrect password. Please try again.';
    } else if (errorMessage.includes('auth/user-not-found')) {
      return 'No account found with this email.';
    } else if (errorMessage.includes('auth/invalid-email')) {
      return 'Please enter a valid email address.';
    } else if (errorMessage.includes('auth/too-many-requests')) {
      return 'Too many failed attempts. Please try again later.';
    }
    return 'Failed to sign in. Please check your credentials.';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-sm border border-white/10 p-8 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2 text-red-400">
              <FaExclamationCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-2 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-2 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-white hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-4 w-full bg-white/5 border border-white/10 text-white py-2 rounded-lg hover:bg-white/10 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaGoogle className="w-5 h-5" />
              <span>Google</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:underline">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 