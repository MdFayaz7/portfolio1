import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

// Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Portfolio Route */}
          <Route path="/" element={
            <>
              <Navbar />
              <main>
                <Home />
                <About />
                <Education />
                <Skills />
                <Projects />
                <Contact />
              </main>
              
              {/* Footer */}
              <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2">Ready to Work Together?</h3>
                    <p className="text-gray-300">Let's discuss your next project</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
                    <a 
                      href="mailto:your-email@example.com" 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      your-email@example.com
                    </a>
                    <a 
                      href="tel:+1234567890" 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-8">
                    <p className="text-gray-400">
                      © {new Date().getFullYear()} Your Name. All rights reserved. Built with React & TypeScript.
                    </p>
                  </div>
                </div>
              </footer>
            </>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
        
        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
