import React, { useState } from 'react';
import { X, Eye, EyeOff, AlertCircle, Sparkles, Check } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: { name: string; role: 'user' | 'vendor' | 'admin'; emailOrPhone: string }) => void;
}

export default function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'vendor'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password helper mock
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState<string | null>(null);

  const handleForgotPassword = () => {
    if (!emailOrPhone) {
      setError('Please enter your Email or Phone first to reset your password.');
      return;
    }
    setError(null);
    setForgotPasswordMsg(`A password reset instructions code was sent to ${emailOrPhone}!`);
    setTimeout(() => {
      setForgotPasswordMsg(null);
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!emailOrPhone.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    if (isSignUp && !name.trim()) {
      setError('Please enter your full name to sign up.');
      setIsLoading(false);
      return;
    }

    const url = isSignUp ? '/api/auth/register' : '/api/auth/login';
    const body = isSignUp 
      ? { name, emailOrPhone: emailOrPhone.trim(), password, role }
      : { emailOrPhone: emailOrPhone.trim(), password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      if (isSignUp) {
        setSuccess('Account created successfully! Logging you in...');
        setTimeout(() => {
          onLoginSuccess({
            name: data.user.name,
            role: data.user.role,
            emailOrPhone: data.user.emailOrPhone
          });
          if (rememberMe) {
            localStorage.setItem('daraz_current_user', JSON.stringify(data.user));
          }
          onClose();
        }, 1500);
      } else {
        onLoginSuccess({
          name: data.user.name,
          role: data.user.role,
          emailOrPhone: data.user.emailOrPhone
        });
        if (rememberMe) {
          localStorage.setItem('daraz_current_user', JSON.stringify(data.user));
        }
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in"
      id="login-modal-overlay"
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden px-8 py-10 border border-gray-100 flex flex-col items-center animate-scale-up"
        id="login-modal-box"
      >
        {/* Close Button X */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-full hover:bg-gray-50 cursor-pointer"
          id="login-modal-close"
        >
          <X size={20} />
        </button>

        {/* 1. TAIGA Branding Custom Vector Logo (Recreated precisely to match user's screenshot) */}
        <div className="flex justify-center w-full mb-2 mt-2" id="login-modal-logo">
          <svg viewBox="0 0 350 100" className="h-16 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shopping Bag Icon on Left */}
            <g transform="translate(10, 5)">
              {/* Orange swoop underlay */}
              <path d="M 12 75 C 35 88, 75 88, 98 75" stroke="#FF4500" strokeWidth="5" strokeLinecap="round" />
              <path d="M 8 73 L 25 73 C 27 73, 28 74, 28 76 L 28 78" stroke="#FF4500" strokeWidth="3.5" strokeLinecap="round" />
              
              {/* Main Bag body */}
              <path d="M 32 35 L 82 35 L 94 85 C 94 89, 90 92, 86 92 L 28 92 C 24 92, 20 89, 20 85 Z" fill="#1C1C1E" />
              
              {/* Custom stripe decoration */}
              <path d="M 36 39 L 48 39 L 40 80 L 32 80 Z" fill="#FFFFFF" opacity="0.12" />
              
              {/* Orange handles */}
              <path d="M 44 38 C 44 20, 70 20, 70 38" stroke="#FF4500" strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M 50 38 C 50 26, 64 26, 64 38" stroke="#FF4500" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>

            {/* TAIGA Text */}
            <g transform="translate(125, 25)">
              {/* T */}
              <path d="M 10 15 L 42 15 M 26 15 L 26 68" stroke="#111111" strokeWidth="12" strokeLinecap="square" />
              
              {/* A (Stylized with Orange Triangle) */}
              <path d="M 52 68 L 72 15" stroke="#111111" strokeWidth="11" strokeLinecap="square" />
              <path d="M 92 68 L 72 15" stroke="#111111" strokeWidth="11" strokeLinecap="square" />
              <polygon points="72,28 64,48 80,48" fill="#FF4500" />
              <path d="M 61 51 L 83 51" stroke="#111111" strokeWidth="7" />

              {/* I */}
              <path d="M 108 15 L 108 68" stroke="#111111" strokeWidth="12" strokeLinecap="square" />
              
              {/* G */}
              <path d="M 162 28 C 158 18, 142 18, 134 28 C 124 38, 124 50, 134 60 C 144 68, 158 68, 162 58 L 162 43 L 146 43" stroke="#111111" strokeWidth="11" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
              
              {/* A (Stylized with Orange Triangle) */}
              <path d="M 176 68 L 196 15" stroke="#111111" strokeWidth="11" strokeLinecap="square" />
              <path d="M 216 68 L 196 15" stroke="#111111" strokeWidth="11" strokeLinecap="square" />
              <polygon points="196,28 188,48 204,48" fill="#FF4500" />
              <path d="M 185 51 L 207 51" stroke="#111111" strokeWidth="7" />
            </g>
          </svg>
        </div>

        {/* 2. Heading title exactly matching the screenshot */}
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mt-3 text-left w-full font-sans">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>

        {/* 3. Subheading switcher exactly matching the screenshot */}
        <p className="text-sm text-gray-500 mt-1 text-left w-full font-sans font-medium mb-6">
          {isSignUp ? (
            <>
              Create your new account. Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                  setSuccess(null);
                }} 
                className="text-[#FF4500] font-black hover:underline cursor-pointer"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Login to your account. Do not have account?{' '}
              <button 
                type="button" 
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                  setSuccess(null);
                }} 
                className="text-[#FF4500] font-black hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </p>

        {/* Alerts / Success */}
        {error && (
          <div className="w-full mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2 text-xs font-semibold font-sans">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="w-full mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-start gap-2 text-xs font-semibold font-sans">
            <Check size={15} className="shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {forgotPasswordMsg && (
          <div className="w-full mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl flex items-start gap-2 text-xs font-semibold font-sans">
            <Sparkles size={15} className="shrink-0 mt-0.5 text-blue-500" />
            <span>{forgotPasswordMsg}</span>
          </div>
        )}

        {/* 4. Auth Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 font-sans text-left" id="login-modal-form">
          
          {/* Full Name field (Only in Sign Up Mode) */}
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20 focus:border-[#FF4500] bg-gray-50/50"
                required
              />
            </div>
          )}

          {/* Email / Phone field exactly matching screenshot */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
              Email / Phone
            </label>
            <input
              type="text"
              placeholder="Enter email or phone number"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20 focus:border-[#FF4500] bg-gray-50/50"
              required
            />
          </div>

          {/* Password field exactly matching screenshot */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Ex::6+ Character"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20 focus:border-[#FF4500] bg-gray-50/50"
                required
              />
              {/* Eye toggle button with visibility matching screenshot */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role selector (Only in Sign Up mode) to make it easy to sign up as customer or vendor */}
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2 px-3 rounded-xl border text-xs font-black text-center transition-all cursor-pointer ${
                    role === 'user' 
                      ? 'border-[#FF4500] bg-orange-50/50 text-[#FF4500]' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🛒 Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`py-2 px-3 rounded-xl border text-xs font-black text-center transition-all cursor-pointer ${
                    role === 'vendor' 
                      ? 'border-[#FF4500] bg-orange-50/50 text-[#FF4500]' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🏬 Shop Vendor
                </button>
              </div>
            </div>
          )}

          {/* Remember Me and Forgot Password row */}
          <div className="flex items-center justify-between w-full pt-1 text-xs font-bold text-gray-600">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-[#FF4500] focus:ring-[#FF4500] h-4.5 w-4.5" 
              />
              <span className="text-gray-600">Remember Me</span>
            </label>
            <button 
              type="button" 
              onClick={handleForgotPassword} 
              className="text-gray-500 hover:text-[#FF4500] cursor-pointer transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Solid bold Orange Login Button exactly matching screenshot */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-[#FF4500] hover:bg-[#E03D00] text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/10 mt-5 flex items-center justify-center gap-1.5 cursor-pointer ${
              isLoading ? 'opacity-85 cursor-wait' : ''
            }`}
            id="login-submit-btn"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <span>{isSignUp ? 'Sign Up' : 'Login'}</span>
            )}
          </button>
        </form>

        {/* Demo user credentials hint list in grey block */}
        <div className="mt-6 w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-bold text-gray-500 leading-relaxed text-left font-sans">
          <p className="text-gray-700 uppercase tracking-wider text-[9px] mb-1">💡 Demo Accounts (Synced with DB):</p>
          <ul className="space-y-0.5 list-disc pl-3">
            <li>Customer: <span className="text-[#FF4500]">suresh@taiga.lk</span> (pass: <span className="text-gray-700">password123</span>)</li>
            <li>Shop Vendor: <span className="text-[#FF4500]">vendor@taiga.lk</span> (pass: <span className="text-gray-700">vendor123</span>)</li>
            <li>Admin Office: <span className="text-[#FF4500]">admin@taiga.lk</span> (pass: <span className="text-gray-700">admin123</span>)</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
