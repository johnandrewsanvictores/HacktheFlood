import React, { useState } from "react";
import { MapPin, Eye, Camera, Brain, Bell, Navigation } from "lucide-react";
import SignInModal from "../components/modals/signInModal";
import SignUpModal from "../components/modals/signUpModal";

const LandingPage = () => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const handleSwitchToSignUp = () => {
    setIsSignInModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  const handleSwitchToSignIn = () => {
    setIsSignUpModalOpen(false);
    setIsSignInModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-hero-gradient text-white overflow-hidden relative">
        <div className="container mx-auto px-6 lg:px-12 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                BantayBayan
              </h1>
              <p className="text-xl md:text-2xl font-medium leading-relaxed">
                Citizens at the center. Government data as reference. Technology
                as an enabler.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-white/90 max-w-xl">
                Think of it as "Waze for government projects." Track public
                infrastructure in real-time, verify their existence with your
                own eyes, and report possible ghost projects. Empower your
                community through transparency and accountability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => {
                    console.log("Join Us button clicked!"); // Debug log
                    setIsSignInModalOpen(true);
                  }}
                  className="bg-white text-brand-primary px-8 py-4 rounded-full font-semibold text-lg hover:shadow-brand-lg hover:scale-105 transition-all duration-300"
                >
                  Join Us
                </button>
              </div>
            </div>

            {/* Right Visual - Placeholder */}
            <div className="flex justify-center items-center">
              <div className="w-full max-w-lg aspect-square bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-white/80 text-lg font-medium">
                    Visual Placeholder
                  </p>
                  <p className="text-white/60 text-sm">
                    Brand illustration goes here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-center text-gray-600 mb-16 text-lg">
              Five simple steps to become a community auditor
            </p>

            <div className="grid md:grid-cols-5 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="bg-brand-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <MapPin className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Log In & Allow Location
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Enable GPS access to see projects near you
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="bg-brand-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <Navigation className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    View Nearby Projects
                  </h3>
                  <p className="text-gray-600 text-sm">
                    See government projects on an interactive map
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="bg-brand-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <Eye className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Check Details
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Review project information and status
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="bg-brand-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  4
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <Camera className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Verify or Report
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Upload photos to verify or flag issues
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="text-center">
                <div className="bg-brand-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  5
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <Brain className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    AI Analysis
                  </h3>
                  <p className="text-gray-600 text-sm">
                    AI reviews reports and alerts the community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
              Powerful Features
            </h2>
            <p className="text-center text-gray-600 mb-16 text-lg">
              Everything you need to monitor government projects
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                <MapPin className="w-12 h-12 text-brand-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  GPS-Powered Detection
                </h3>
                <p className="text-gray-600">
                  Automatically discover government projects near your location
                  using GPS technology.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                <Navigation className="w-12 h-12 text-brand-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Real-Time Project Map
                </h3>
                <p className="text-gray-600">
                  Interactive map showing all government-funded projects with
                  up-to-date information.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                <Camera className="w-12 h-12 text-brand-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Citizen Reporting
                </h3>
                <p className="text-gray-600">
                  Submit photo evidence to verify projects or report
                  discrepancies you observe.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                <Brain className="w-12 h-12 text-brand-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  AI-Powered Verification
                </h3>
                <p className="text-gray-600">
                  Advanced AI analyzes reports to identify patterns and verify
                  project authenticity.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                <Bell className="w-12 h-12 text-brand-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Community Alerts
                </h3>
                <p className="text-gray-600">
                  Receive SMS and app notifications about suspicious projects in
                  your area.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                <Eye className="w-12 h-12 text-brand-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Transparency Dashboard
                </h3>
                <p className="text-gray-600">
                  Access detailed project information, budgets, and progress
                  reports in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-brand-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">
              The Power of Community Action
            </h2>
            <p className="text-xl leading-relaxed mb-8 text-blue-50">
              ProjectWaze PH empowers every Filipino to become an auditor in
              their own barangay. By combining citizen vigilance with
              technology, we create a powerful force for transparency and
              accountability. Together, we can ensure that every peso of public
              funds is used properly, that ghost projects are exposed, and that
              our communities get the infrastructure they deserve.
            </p>
            <p className="text-lg text-blue-100">
              Join thousands of Filipinos building a culture of community-driven
              anti-corruption. Your eyes, your voice, and your actions matter.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-2">
                  ProjectWaze PH
                </h3>
                <p className="text-gray-400">Transparency through technology</p>
              </div>
              <div className="flex gap-8">
                <a href="#about" className="hover:text-white transition-colors">
                  About
                </a>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
                <a
                  href="#privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
              <p>
                &copy; {new Date().getFullYear()} ProjectWaze PH. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
      />

      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    </div>
  );
};

export default LandingPage;
