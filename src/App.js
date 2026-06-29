/*import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HomeTiles from './components/HomeTiles';
import Mission from './components/Mission';
import Membership from './components/Membership';
import News from './components/News';
import Footer from './components/Footer';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import Dashboard from './components/pages/Dashboard';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import ForgotPassword from './components/pages/ForgotPassword'; // Import ForgotPassword
import VerifyEmail from './components/pages/VerifyEmail'; // Import VerifyEmail

function App() {
  return (
    <AuthProvider> {/* Wrap with AuthProvider *
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <Routes>
            {/* Public Home Page *
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <section id="resources">
                    <Mission />
                  </section>
                  <section id="about">
                    <HomeTiles />
                  </section>
                  <section id="membership">
                    <Membership />
                  </section>
                  <section id="news">
                    <News />
                  </section>
                  <section id="contact">
                    <Footer />
                  </section>
                </>
              }
            />

            {/* Public Routes *
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Protected Routes *
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HomeTiles from './components/HomeTiles';
import Mission from './components/Mission';
import Membership from './components/Membership';
import News from './components/News';
import Footer from './components/Footer';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import Dashboard from './components/pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './components/pages/ForgotPassword';
import VerifyEmail from './components/pages/VerifyEmail';

function App() {
  return (
    <Router>
      <AuthProvider> {/* Moved inside Router */}
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <Routes>
            {/* Public Home Page */}
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <section id="resources">
                    <Mission />
                  </section>
                  <section id="about">
                    <HomeTiles />
                  </section>
                  <section id="membership">
                    <Membership />
                  </section>
                  <section id="news">
                    <News />
                  </section>
                  <section id="contact">
                    <Footer />
                  </section>
                </>
              }
            />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;