import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, MapPin, Mail, Phone } from 'lucide-react';
import { Profile } from '../types';
import { profileAPI, assetUrl } from '../utils/api';
import { useInView } from 'react-intersection-observer';

const About: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Rotate between two passages (admin-provided) every 5 seconds
  const [activePassageIndex, setActivePassageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePassageIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      <section id="about" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-48 mx-auto mb-8"></div>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                </div>
                <div className="h-96 bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const defaultAboutText = "I am a passionate full-stack developer with expertise in modern web technologies.";
  const defaultBio = "";

  const passages = [profile?.aboutText || defaultAboutText, profile?.cvText || defaultBio];

  return (
    <section id="about" className="py-20 bg-black" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="bg-gradient-to-r from-violet-600 to-green-500 bg-clip-text text-transparent">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-green-500 mx-auto"></div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left side - Image */}
            <div className="order-2 lg:order-1">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  {profile?.aboutImage ? (
                    <img
                      src={assetUrl(profile.aboutImage)}
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
                    <div className="w-full h-full bg-gradient-to-r from-violet-600 to-green-500 flex items-center justify-center text-white text-8xl font-bold">
                      {profile?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-6 w-8 h-8 bg-violet-600 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-6 -left-4 w-6 h-6 bg-green-500 rounded-full animate-pulse delay-1000"></div>
              </motion.div>
            </div>

            {/* Right side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-1 lg:order-2 space-y-6"
            >
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {profile?.name || 'Your Name'}
                </h3>
                <h4 className="text-xl text-violet-300 mb-6">
                  {profile?.title || 'Full Stack Developer'}
                </h4>
              </div>

              <div className="prose prose-lg text-gray-300 leading-relaxed min-h-[8rem]">
                <motion.div
                  key={activePassageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  {passages[activePassageIndex]}
                </motion.div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                {profile?.location && (
                  <div className="flex items-center space-x-3 text-gray-300">
                    <MapPin className="text-violet-300" size={20} />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Mail className="text-violet-300" size={20} />
                    <a href={`mailto:${profile.email}`} className="hover:text-violet-300 transition-colors">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Phone className="text-violet-300" size={20} />
                    <a href={`tel:${profile.phone}`} className="hover:text-violet-300 transition-colors">
                      {profile.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Download Resume Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadResume}
                className="bg-gradient-to-r from-violet-600 to-green-500 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <Download size={20} />
                <span>Download Resume</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
