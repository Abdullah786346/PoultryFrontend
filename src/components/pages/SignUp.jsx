import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    profilePicture: null,
    gender: '',
    dob: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    position: '',
    organization: '',
    qualification: '',
    specialization: '',
    membershipCategory: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [verificationLink, setVerificationLink] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.agreeTerms) {
      alert("You must agree to the terms and conditions");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      const res = await fetch('/api/signup', {
        method: 'POST',
        body: data
      });

      let result;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        const text = await res.text();
        const cleanText = text.trim();
        if (cleanText.startsWith("<")) {
          throw new Error(`Server returned HTML error page (Status ${res.status}). This usually means a backend crash or configuration issue.`);
        } else {
          throw new Error(cleanText || `Server error (Status ${res.status})`);
        }
      }

      if (res.ok) {
        if (result.verificationLink) {
          setVerificationLink(result.verificationLink);
        } else {
          alert(result.message || "Signup successful! Please check your email for verification.");
          navigate('/login');
        }
      } else {
        alert(result.error || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const membershipFee = formData.membershipCategory === "student"
    ? (formData.country === "Pakistan" ? "500 PKR" : "25 USD")
    : formData.membershipCategory === "professional"
      ? (formData.country === "Pakistan" ? "1000 PKR" : "50 USD")
      : "Select membership category";

  if (verificationLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-amber-950 py-12 px-4 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#de0f3f] opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl text-center space-y-6 text-white relative z-10 animate-fade-in">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center border border-green-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Account Registered!</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your Poultry Professionals Society account has been registered. We've logged your verification token to the backend server.
          </p>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-amber-200 text-xs text-left">
            <strong>Testing Note:</strong> Since real emails are simulated in development, click the button below to trigger account verification.
          </div>
          <button
            onClick={() => navigate(verificationLink)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition transform duration-150 active:scale-95 shadow-lg shadow-green-600/30"
          >
            Simulate Email Verification (Click to Verify)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 w-full max-w-4xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            PAS <span className="text-[#de0f3f]">Membership Registration</span>
          </h2>
          <p className="text-gray-600 mt-2">Join the Poultry Association Society community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="border-b pb-4 border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">A. Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 block">(as it should appear on certificates)</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#de0f3f] focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#de0f3f] file:text-white hover:file:bg-[#b30c33] cursor-pointer"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6 mt-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                      className="text-[#de0f3f] focus:ring-[#de0f3f] h-4 w-4 cursor-pointer"
                      required
                    />
                    <span className="ml-2 text-gray-700 font-medium">Male</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                      className="text-[#de0f3f] focus:ring-[#de0f3f] h-4 w-4 cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700 font-medium">Female</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#de0f3f] focus:border-transparent transition-all cursor-pointer"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="border-b pb-4 border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">B. Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 block">(used for login)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#de0f3f] focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone/WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#de0f3f] focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Pakistan"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#de0f3f] focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Lahore"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#de0f3f] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Professional Information */}
          <div className="border-b pb-4 border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">C. Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Position <span className="text-red-500">*</span>
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#de0f3f] focus:border-transparent transition-all cursor-pointer"
                  required
                >
                  <option value="">Select Position</option>
                  <option value="Student">Student</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Industry Professional">Industry Professional</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affiliation/Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="University of Agriculture"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#de0f3f] focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Qualification <span className="text-red-500">*</span>
                </label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#de0f3f] focus:border-transparent transition-all cursor-pointer"
                  required
                >
                  <option value="">Select Highest Degree</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization/Area of Interest <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Poultry Genetics, Nutrition, Health"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#de0f3f] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Membership Category */}
          <div className="border-b pb-4 border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">D. Membership Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="studentMember"
                    name="membershipCategory"
                    value="student"
                    checked={formData.membershipCategory === "student"}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#de0f3f] focus:ring-[#de0f3f] cursor-pointer"
                    required
                  />
                  <label htmlFor="studentMember" className="ml-2 font-semibold text-gray-700 cursor-pointer">
                    Student Member
                  </label>
                </div>
                <p className="text-sm text-gray-600 ml-6 mt-1.5 font-medium">
                  {formData.country === "Pakistan" 
                    ? "500 PKR (National)" 
                    : "25 USD (International)"}
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="professionalMember"
                    name="membershipCategory"
                    value="professional"
                    checked={formData.membershipCategory === "professional"}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#de0f3f] focus:ring-[#de0f3f] cursor-pointer"
                    required
                  />
                  <label htmlFor="professionalMember" className="ml-2 font-semibold text-gray-700 cursor-pointer">
                    Professional Member
                  </label>
                </div>
                <p className="text-sm text-gray-600 ml-6 mt-1.5 font-medium">
                  {formData.country === "Pakistan" 
                    ? "1000 PKR (National)" 
                    : "50 USD (International)"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Account Security */}
          <div className="border-b pb-4 border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">E. Account Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  minLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#de0f3f] focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#de0f3f] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="h-4 w-4 text-[#de0f3f] focus:ring-[#de0f3f] border-gray-300 rounded mt-1 cursor-pointer"
              required
            />
            <label className="ml-2 text-gray-700 text-sm cursor-pointer">
              I agree to the <Link to="/terms" className="text-[#de0f3f] font-semibold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#de0f3f] font-semibold hover:underline">Privacy Policy</Link>
            </label>
          </div>

          <div className="bg-[#de0f3f]/5 p-4 rounded-xl border border-[#de0f3f]/20">
            <p className="text-[#de0f3f] font-semibold flex items-center justify-between">
              <span>Selected Membership Fee:</span>
              <span className="text-xl font-bold">{membershipFee}</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#de0f3f] hover:bg-[#b30c33] text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-98 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Completing Registration...' : 'Complete Registration'}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-[#de0f3f] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;