import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Github, ExternalLink, Code, Calendar, Tag } from 'lucide-react';
import { Project as ProjectType } from '../types';
import { projectsAPI, assetUrl } from '../utils/api';
import { useInView } from 'react-intersection-observer';
import { formatDate, truncateText } from '../utils/scrollUtils';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getProjects();
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filters = ['all', 'featured', 'web-application', 'mobile-app', 'game'];

  const filterProjects = (filter: string) => {
    switch (filter) {
      case 'featured':
        return projects.filter(project => project.featured);
      case 'web-application':
        return projects.filter(project => project.category === 'Web Application');
      case 'mobile-app':
        return projects.filter(project => project.category === 'Mobile App');
      case 'game':
        return projects.filter(project => project.category === 'Game');
      default:
        return projects;
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-48 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-80 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-black" ref={ref}>
      <div className="container mx-auto px-4">
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My <span className="bg-gradient-to-r from-violet-600 to-green-500 bg-clip-text text-transparent">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-green-500 mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg">
            Some of my recent work and projects
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Code size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No projects added yet</h3>
            <p className="text-gray-400">
              Projects will be displayed here once added.
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Filter Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {filters.map((filter) => {
                const filterCount = filterProjects(filter).length;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeFilter === filter
                        ? 'bg-gradient-to-r from-violet-600 to-green-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="capitalize">{filter.replace('-', ' ')}</span>
                      {filterCount > 0 && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          activeFilter === filter ? 'bg-white/20' : 'bg-gray-700'
                        }`}>
                          {filterCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </motion.div>

            {/* Projects Grid */}
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filterProjects(activeFilter).map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  {/* Project Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={assetUrl(project.image)}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-56 md:h-64 lg:h-72 object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src.includes('placeholder.co')) return;
                        target.src = 'https://placehold.co/800x500/111111/AAAAAA?text=Project+Image';
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-4">
                        {project.demoUrl && (
                          <motion.a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            className="bg-white text-gray-800 p-3 rounded-full hover:bg-violet-600 hover:text-white transition-colors duration-300"
                            aria-label="Live URL"
                          >
                            <ExternalLink size={20} />
                          </motion.a>
                        )}
                        {project.githubUrl && (
                          <motion.a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            className="bg-white text-gray-800 p-3 rounded-full hover:bg-gray-800 hover:text-white transition-colors duration-300"
                            aria-label="GitHub URL"
                          >
                            <Github size={20} />
                          </motion.a>
                        )}
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    {/* Title and Category */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Tag size={16} />
                        <span>{project.category}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {truncateText(project.description, 100)}
                    </p>

                    {/* Technologies */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                            +{project.technologies.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status and Date */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>
                          {project.startDate ? formatDate(project.startDate) : 'Recent'}
                        </span>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Completed' 
                          ? 'bg-green-900 text-green-200'
                          : project.status === 'In Progress'
                          ? 'bg-violet-900 text-violet-200'
                          : 'bg-yellow-900 text-yellow-200'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex space-x-3">
                      <motion.a
                        href={project.demoUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-gradient-to-r from-violet-600 to-green-500 text-white text-center py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-shadow duration-300 flex items-center justify-center space-x-2"
                      >
                        <Eye size={16} />
                        <span>Live Project</span>
                      </motion.a>
                      {project.githubUrl && (
                        <motion.a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-gray-800 text-white text-center py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-shadow duration-300 flex items-center justify-center space-x-2"
                        >
                          <Github size={16} />
                          <span>Code</span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* View All Projects Button */}
            {activeFilter === 'featured' && projects.filter(p => !p.featured).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter('all')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-shadow duration-300"
                >
                  View All Projects
                </motion.button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
