import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import { Education as EducationType } from '../types';
import { educationAPI } from '../utils/api';
import { useInView } from 'react-intersection-observer';
import { formatDate } from '../utils/scrollUtils';

const Education: React.FC = () => {
  const [education, setEducation] = useState<EducationType[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await educationAPI.getEducation();
        setEducation(response.data.education);
      } catch (error) {
        console.error('Error fetching education:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) {
    return (
      <section id="education" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-8"></div>
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Education & <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Experience</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">
            My educational background and professional journey
          </p>
        </motion.div>

        {education.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <GraduationCap size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No education entries yet</h3>
            <p className="text-gray-500">
              Education information will be displayed here once added.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
              
              {education.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative mb-12 last:mb-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  {/* Card */}
                  <div className="ml-16 bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {item.degree}
                        </h3>
                        <h4 className="text-xl font-semibold text-blue-600 mb-2">
                          {item.institution}
                        </h4>
                        <p className="text-gray-600 mb-4">
                          {item.field}
                        </p>
                      </div>
                      
                      {/* Status badge */}
                      <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        {item.endDate ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            Completed
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      {/* Description */}
                      {item.description && (
                        <p className="text-gray-700 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* Grade */}
                      {item.grade && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <GraduationCap size={16} />
                          <span className="font-medium">Grade: {item.grade}</span>
                        </div>
                      )}

                      {/* Date and Location */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar size={16} />
                          <span>
                            {formatDate(item.startDate)}
                            {item.endDate && ` - ${formatDate(item.endDate)}`}
                            {!item.endDate && ' - Present'}
                          </span>
                        </div>
                        
                        {item.location && (
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin size={16} />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Education;
