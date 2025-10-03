import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Palette, Wrench, Globe, Zap } from 'lucide-react';
import { Skill } from '../types';
import { skillsAPI } from '../utils/api';
import { useInView } from 'react-intersection-observer';

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, Skill[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Frontend');
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillsAPI.getSkills();
        const { skills: skillsData, skillsByCategory: categories } = response.data;
        setSkills(skillsData);
        setSkillsByCategory(categories);
        
        // Set initial active category
        if (categories) {
          setActiveCategory(Object.keys(categories)[0] || 'Frontend');
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const skillCategories = {
    Frontend: { icon: Palette, color: 'from-pink-500 to-rose-500' },
    Backend: { icon: Code, color: 'from-blue-500 to-cyan-500' },
    Database: { icon: Database, color: 'from-green-500 to-emerald-500' },
    Tools: { icon: Wrench, color: 'from-purple-500 to-violet-500' },
    Languages: { icon: Globe, color: 'from-orange-500 to-yellow-500' },
    Other: { icon: Zap, color: 'from-gray-500 to-slate-500' },
  };

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-8"></div>
            <div className="space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Skills & <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Technologies</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">
            Technologies and tools I work with
          </p>
        </motion.div>

        {skills.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Code size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No skills added yet</h3>
            <p className="text-gray-500">
              Skills information will be displayed here once added.
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {Object.entries(skillCategories).map(([category, { icon: Icon, color }]) => {
                if (!skillsByCategory[category]?.length) return null;
                
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? `bg-gradient-to-r ${color} text-white shadow-lg transform scale-105`
                        : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon size={20} />
                      <span>{category}</span>
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {skillsByCategory[category]?.length || 0}
                      </span>
                    </div>
                  </button>
                );
              })}
            </motion.div>

            {/* Skills Grid */}
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {skillsByCategory[activeCategory]?.map((skill, index) => (
                <motion.div
                  key={skill._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="text-center">
                    {/* Skill Icon */}
                    <div className="mb-4">
                      {skill.iconUrl ? (
                        <img
                          src={skill.iconUrl}
                          alt={skill.name}
                          className="w-16 h-16 mx-auto rounded-lg shadow-md"
                        />
                      ) : (
                        <div
                          className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                          style={{ backgroundColor: skill.color }}
                        >
                          {skill.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Skill Name */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {skill.name}
                    </h3>

                    {/* Proficiency Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Proficiency</span>
                        <span className="text-sm font-medium text-gray-800">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.proficiency}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-2 rounded-full bg-gradient-to-r ${skillCategories[skill.category as keyof typeof skillCategories]?.color || 'from-blue-500 to-cyan-500'}`}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    {skill.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {skill.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* All Skills Overview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Skills Overview
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {skills.map((skill) => (
                  <motion.div
                    key={skill._id}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="text-center group cursor-pointer"
                  >
                    <div
                      className="w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center text-white text-lg font-bold transition-all duration-300 group-hover:shadow-lg"
                      style={{ backgroundColor: skill.color }}
                    >
                      {skill.name.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
