import React, { useState, useEffect } from "react";
import { X, MapPin, Loader } from "lucide-react";
import api from "../../../axios";
import showAlert from "../ui/Alerts";
import { useNavigate } from "react-router-dom";

const SignInModal = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      requestLocation();
    } else {
      setLocation(null);
      setLocationError(null);
    }
  }, [isOpen]);

  const requestLocation = () => {
    setIsRequestingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsRequestingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setIsRequestingLocation(false);
        setLocationError(null);
      },
      (error) => {
        let errorMessage = "Unable to get your location. ";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage += "Please enable location permissions in your browser settings to view nearby government projects.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage += "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage += "Location request timed out. Please try again.";
        } else {
          errorMessage += "An unknown error occurred.";
        }
        setLocationError(errorMessage);
        setIsRequestingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const signInData = { username, password };
      if (location) {
        signInData.latitude = location.latitude;
        signInData.longitude = location.longitude;
      }
      await api.post("/auth/signin", signInData);
      setLoading(false);
      onClose();
      showAlert({
        type: "success",
        title: "Signed in successfully",
        text: "Welcome back!",
        onConfirm: () => navigate("/dashboard"),
      });
    } catch (err) {
      setLoading(false);
      showAlert({
        type: "error",
        title: "Sign in failed",
        text:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Sign in failed",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div
        className="relative bg-white rounded-2xl shadow-brand-lg w-full max-w-md mx-4 overflow-hidden z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <button
              onClick={onClose}
              className="text-white/90 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/80 text-sm mt-2">
            Sign in to continue to ProjectWaze PH
          </p>
        </div>
        <form className="px-6 py-8" onSubmit={handleSignIn}>
          <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Location Access Required
                </p>
                <p className="text-xs text-blue-700">
                  We need your location to show nearby government flood-control projects. Please allow location access when prompted.
                </p>
                {isRequestingLocation && (
                  <div className="flex items-center gap-2 mt-2 text-blue-600">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-xs">Requesting location...</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2 mt-2 text-green-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">Location captured successfully</span>
                  </div>
                )}
                {locationError && (
                  <div className="mt-2">
                    <p className="text-xs text-red-600 mb-2">{locationError}</p>
                    <button
                      type="button"
                      onClick={requestLocation}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
                    >
                      Try again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label
                htmlFor="signin-username"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Username
              </label>
              <input
                id="signin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label
                htmlFor="signin-password"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Password
              </label>
              <input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200"
                autoComplete="current-password"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-brand-primary bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-brand-primary"
                  disabled
                />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                className="text-brand-primary font-semibold hover:text-brand-primary-dark transition-colors"
                disabled
              >
                Forgot password?
              </button>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <button
              type="submit"
              className="w-full bg-brand-gradient text-white py-3.5 rounded-lg font-semibold text-base hover:shadow-brand-lg hover:scale-[1.02] transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3.5 rounded-lg font-semibold text-base hover:bg-gray-200 transition-all duration-200"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-brand-primary font-semibold hover:text-brand-primary-dark transition-colors"
              disabled={loading}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInModal;
