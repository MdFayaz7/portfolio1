import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Palette, Wrench, Globe, Zap } from 'lucide-react';
import { Skill } from '../types';
import { skillsAPI } from '../utils/api';
import { useInView } from 'react-intersection-observer';

// Map common skill names to Devicon classes
const getDeviconClass = (name: string): string | null => {
  const key = name.trim().toLowerCase();
  const map: Record<string, string> = {
    // Languages
    'java': 'devicon-java-plain colored',
    'javascript': 'devicon-javascript-plain colored',
    'typescript': 'devicon-typescript-plain colored',
    'python': 'devicon-python-plain colored',
    'c': 'devicon-c-plain colored',
    'c++': 'devicon-cplusplus-plain colored',
    'c#': 'devicon-csharp-plain colored',
    'go': 'devicon-go-plain colored',
    'golang': 'devicon-go-plain colored',
    'php': 'devicon-php-plain colored',
    'ruby': 'devicon-ruby-plain colored',
    'kotlin': 'devicon-kotlin-plain colored',
    'swift': 'devicon-swift-plain colored',
    
    // Frontend
    'html': 'devicon-html5-plain colored',
    'html5': 'devicon-html5-plain colored',
    'css': 'devicon-css3-plain colored',
    'css3': 'devicon-css3-plain colored',
    'sass': 'devicon-sass-original colored',
    'scss': 'devicon-sass-original colored',
    'tailwind': 'devicon-tailwindcss-plain colored',
    'tailwindcss': 'devicon-tailwindcss-plain colored',
    'react': 'devicon-react-original colored',
    'next': 'devicon-nextjs-original-wordmark',
    'next.js': 'devicon-nextjs-original-wordmark',
    'redux': 'devicon-redux-original colored',
    'vite': 'devicon-vitejs-plain colored',
    
    // Backend
    'node': 'devicon-nodejs-plain colored',
    'nodejs': 'devicon-nodejs-plain colored',
    'node.js': 'devicon-nodejs-plain colored',
    'express': 'devicon-express-original',
    'express.js': 'devicon-express-original',
    'nestjs': 'devicon-nestjs-plain colored',
    'spring': 'devicon-spring-original colored',
    'spring boot': 'devicon-spring-original colored',
    
    // Databases
    'mongodb': 'devicon-mongodb-plain colored',
    'mysql': 'devicon-mysql-plain colored',
    'postgres': 'devicon-postgresql-plain colored',
    'postgresql': 'devicon-postgresql-plain colored',
    'redis': 'devicon-redis-plain colored',
    
    // DevOps / Tools
    'git': 'devicon-git-plain colored',
    'github': 'devicon-github-original',
    'docker': 'devicon-docker-plain colored',
    'kubernetes': 'devicon-kubernetes-plain colored',
    'aws': 'devicon-amazonwebservices-plain colored',
    'gcp': 'devicon-googlecloud-plain colored',
    'google cloud': 'devicon-googlecloud-plain colored',
    'azure': 'devicon-azure-plain colored',
    'linux': 'devicon-linux-plain',
    'nginx': 'devicon-nginx-original colored',
    'jest': 'devicon-jest-plain colored',
    'webpack': 'devicon-webpack-plain colored',
    'babel': 'devicon-babel-plain colored',
    'eslint': 'devicon-eslint-original colored',
    'npm': 'devicon-npm-original-wordmark',
    'yarn': 'devicon-yarn-plain colored',
    'pnpm': 'devicon-pnpm-original',
  };
  return map[key] ?? null;
};

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
      <section id="skills" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-48 mx-auto mb-8"></div>
            <div className="space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 bg-black" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Skills & <span className="bg-gradient-to-r from-violet-600 to-green-500 bg-clip-text text-transparent">Technologies</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-green-500 mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg">
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
                        : 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:shadow-md'
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
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {skillsByCategory[activeCategory]?.map((skill, index) => (
                <motion.div
                  key={skill._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="text-center">
                    {/* Skill Icon */}
                    <div className="mb-4">
                      {skill.iconUrl ? (
                        <img
                          src={skill.iconUrl}
                          alt={skill.name}
                          className="w-16 h-16 mx-auto rounded-lg shadow-md object-contain p-1"
                        />
                      ) : (
                        (() => {
                          const iconClass = getDeviconClass(skill.name);
                          if (iconClass) {
                            return (
                              <i
                                className={`${iconClass} text-6xl leading-[4rem] inline-block`}
                                aria-label={skill.name}
                                title={skill.name}
                              />
                            );
                          }
                          return (
                            <div
                              className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                              style={{ backgroundColor: skill.color }}
                            >
                              {skill.name.charAt(0)}
                            </div>
                          );
                        })()
                      )}
                    </div>

                    {/* Skill Name */}
                    <div className="mt-1">
                      <p className="text-white font-medium">{skill.name}</p>
                    </div>

                    {/* Description */}
                    {skill.description && (
                      <p className="text-gray-300 text-sm leading-relaxed">
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
              className="mt-16 bg-gray-900 rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Skills Overview
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {skills.map((skill) => (
                  <motion.div
                    key={skill._id}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="text-center group cursor-pointer"
                  >
                    {skill.iconUrl ? (
                      <img
                        src={skill.iconUrl}
                        alt={skill.name}
                        className="w-12 h-12 mx-auto mb-2 rounded-lg shadow-md object-contain p-0.5"
                      />
                    ) : (
                      (() => {
                        const iconClass = getDeviconClass(skill.name);
                        if (iconClass) {
                          return (
                            <i
                              className={`${iconClass} text-4xl leading-[3rem] inline-block`}
                              aria-label={skill.name}
                              title={skill.name}
                            />
                          );
                        }
                        return (
                          <div
                            className="w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center text-white text-lg font-bold transition-all duration-300 group-hover:shadow-lg"
                            style={{ backgroundColor: skill.color }}
                          >
                            {skill.name.charAt(0)}
                          </div>
                        );
                      })()
                    )}
                    <div className="text-gray-200 text-sm">{skill.name}</div>
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
