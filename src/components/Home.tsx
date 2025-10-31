import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronDown } from 'lucide-react';
import { Profile } from '../types';
import { profileAPI, assetUrl } from '../utils/api';
import { scrollToElement } from '../utils/scrollUtils';

const Home: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.getProfile();
        setProfile(response.data.profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowIndicator(window.scrollY < 80);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleDownloadResume = async () => {
    try {
      const response = await profileAPI.downloadResume();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  if (loading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </section>
    );
  }

  const defaultWelcome = "Hello! I'm a passionate Full Stack Developer";
  const defaultAbout = "Welcome to my portfolio where you can explore my journey, skills, and projects.";

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * window.innerWidth],
              y: [0, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            {/* Profile Picture */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative mx-auto w-48 h-48 mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse"></div>
              <div className="relative w-full h-full bg-white rounded-full overflow-hidden shadow-2xl">
                {profile?.homeImage ? (
                  <img
                    src={assetUrl(profile.homeImage)}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : profile?.profilePicture ? (
                  <img
                    src={assetUrl(profile.profilePicture)}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-6xl font-bold">
                    {profile?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Name and Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {profile?.name || 'Your Name'}
              </span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-2xl md:text-4xl text-gray-300 mb-8"
            >
              {profile?.title || 'Full Stack Developer'}
            </motion.h2>
          </motion.div>

          {/* Welcome Message */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {profile?.welcomeMessage || defaultWelcome}. {defaultAbout}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToElement('projects')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              View My Work
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadResume}
              className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-colors duration-300 flex items-center gap-2"
            >
              <Download size={20} />
              Download Resume
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
      </div>

      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute left-1/2 transform -translate-x-1/2 bottom-2 sm:bottom-4 md:bottom-6 cursor-pointer z-20"
          onClick={() => {
            scrollToElement('about');
            setShowIndicator(false);
          }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/70 flex flex-col items-center"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Home;
