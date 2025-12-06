import React from "react";
import { X } from "lucide-react";

const SignUpModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div
        className="relative bg-white rounded-2xl shadow-brand-lg w-full max-w-md mx-4 overflow-hidden z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <button
              onClick={onClose}
              className="text-white/90 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/80 text-sm mt-2">
            Join ProjectWaze PH and become a community auditor
          </p>
        </div>

        {/* Form Content */}
        <div className="px-6 py-8">
          <div className="space-y-5">
            {/* Username Field */}
            <div>
              <label
                htmlFor="signup-username"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Username
              </label>
              <input
                id="signup-username"
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                placeholder="Create a strong password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label
                htmlFor="signup-phone"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Phone Number
              </label>
              <input
                id="signup-phone"
                type="tel"
                placeholder="+63 912 345 6789"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <button className="w-full bg-brand-gradient text-white py-3.5 rounded-lg font-semibold text-base hover:shadow-brand-lg hover:scale-[1.02] transition-all duration-300">
              Sign Up
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3.5 rounded-lg font-semibold text-base hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-brand-primary font-semibold hover:text-brand-primary-dark transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
