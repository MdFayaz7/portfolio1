import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  GraduationCap,
  Code,
  FolderOpen,
  MessageSquare,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { profileAPI, educationAPI, skillsAPI, projectsAPI, contactAPI, assetUrl } from '../utils/api';
import { Profile, Education, Skill, Project, Message } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  
  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, educationRes, skillsRes, projectsRes, messagesRes] = await Promise.all([
        profileAPI.getProfile(),
        educationAPI.getEducation(),
        skillsAPI.getSkills(),
        projectsAPI.getProjects(),
        contactAPI.getMessages()
      ]);
      
      setProfile(profileRes.data.profile);
      setEducation(educationRes.data.education);
      setSkills(skillsRes.data.skills);
      setProjects(projectsRes.data.projects);
      setMessages(messagesRes.data.messages);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const formDataToSend = new FormData();

    // Append text fields
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      if (
        key === 'profilePicture' ||
        key === 'resume' ||
        key === 'homeImage' ||
        key === 'aboutImage' ||
        key === 'resumeUrl'
      ) {
        return;
      }
      // Skip the nested object itself; only send flattened socialLinks.* fields
      if (key === 'socialLinks') {
        return;
      }
      if (value === undefined) return;
      if (key.startsWith('socialLinks.')) {
        formDataToSend.append(key, value);
      } else {
        formDataToSend.append(key, value);
      }
    });

      // Append files
      if (formData.profilePicture) {
        formDataToSend.append('profilePicture', formData.profilePicture);
      }
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      }
      if (formData.homeImage) {
        formDataToSend.append('homeImage', formData.homeImage);
      }
      if (formData.aboutImage) {
        formDataToSend.append('aboutImage', formData.aboutImage);
      }

      await profileAPI.updateProfile(formDataToSend);
      toast.success('Profile updated successfully');
      setEditing(null);
      setFormData({});
      fetchData();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddEducation = async () => {
    try {
      await educationAPI.createEducation(formData);
      toast.success('Education added successfully');
      setShowAddForm(null);
      setFormData({});
      fetchData();
    } catch (error) {
      toast.error('Failed to add education');
    }
  };

  const handleEditEducation = (edu: Education) => {
    setEditing(`education-${edu._id}`);
    setFormData(edu);
  };

  const handleUpdateEducation = async () => {
    if (!editing) return;
    try {
      await educationAPI.updateEducation(editing.split('-')[1], formData);
      toast.success('Education updated successfully');
      setEditing(null);
      setFormData({});
      fetchData();
    } catch (error) {
      toast.error('Failed to update education');
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this education?')) {
      try {
        await educationAPI.deleteEducation(id);
        toast.success('Education deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete education');
      }
    }
  };

  const handleAddSkill = async () => {
    try {
      await skillsAPI.createSkill(formData);
      toast.success('Skill added successfully');
      setShowAddForm(null);
      setFormData({});
      fetchData();
    } catch (error) {
      toast.error('Failed to add skill');
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setEditing(`skill-${skill._id}`);
    setFormData(skill);
  };

  const handleUpdateSkill = async () => {
    if (!editing) return;
    try {
      await skillsAPI.updateSkill(editing.split('-')[1], formData);
      toast.success('Skill updated successfully');
      setEditing(null);
      setFormData({});
      fetchData();
    } catch (error) {
      toast.error('Failed to update skill');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await skillsAPI.deleteSkill(id);
        toast.success('Skill deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete skill');
      }
    }
  };

  const handleAddProject = async () => {
    if (!formData.title || !formData.description || !formData.image || !(formData.image instanceof File)) {
      toast.error('Please fill all required fields and select an image file');
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'image' && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append image file
      if (formData.image && formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      await projectsAPI.createProject(formDataToSend);
      toast.success('Project added successfully');
      setShowAddForm(null);
      setFormData({});
      fetchData();
    } catch (error) {
      toast.error('Failed to add project');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditing(`project-${project._id}`);
    setFormData(project);
  };

  const handleUpdateProject = async () => {
    if (!editing) return;
    try {
      await projectsAPI.updateProject(editing.split('-')[1], formData);
      toast.success('Project updated successfully');
      setEditing(null);
      setFormData({});
      fetchData();
    } catch (error) {
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.deleteProject(id);
        toast.success('Project deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Profile Management</h2>
        <button
          onClick={() => {
            setEditing('profile');
            setFormData(profile || {});
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Edit size={20} />
          <span>Edit Profile</span>
        </button>
      </div>
      
      {profile && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={editing === 'profile' ? (formData.name || '') : profile.name}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                readOnly={editing !== 'profile'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={editing === 'profile' ? (formData.title || '') : profile.title}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                readOnly={editing !== 'profile'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={editing === 'profile' ? (formData.email || '') : profile.email}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                readOnly={editing !== 'profile'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={editing === 'profile' ? (formData.location || '') : profile.location}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                readOnly={editing !== 'profile'}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">About Text</label>
              <textarea
                name="aboutText"
                value={editing === 'profile' ? (formData.aboutText || '') : profile.aboutText}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                readOnly={editing !== 'profile'}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Welcome Message</label>
              <textarea
                name="welcomeMessage"
                value={editing === 'profile' ? (formData.welcomeMessage || '') : profile.welcomeMessage}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                readOnly={editing !== 'profile'}
              />
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
              <input
                type="url"
                name="socialLinks.github"
                value={editing === 'profile' ? (formData['socialLinks.github'] || profile.socialLinks?.github || '') : (profile.socialLinks?.github || '')}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                readOnly={editing !== 'profile'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="socialLinks.linkedin"
                value={editing === 'profile' ? (formData['socialLinks.linkedin'] || profile.socialLinks?.linkedin || '') : (profile.socialLinks?.linkedin || '')}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                readOnly={editing !== 'profile'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Twitter URL</label>
              <input
                type="url"
                name="socialLinks.twitter"
                value={editing === 'profile' ? (formData['socialLinks.twitter'] || profile.socialLinks?.twitter || '') : (profile.socialLinks?.twitter || '')}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                readOnly={editing !== 'profile'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Instagram URL</label>
              <input
                type="url"
                name="socialLinks.instagram"
                value={editing === 'profile' ? (formData['socialLinks.instagram'] || profile.socialLinks?.instagram || '') : (profile.socialLinks?.instagram || '')}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                readOnly={editing !== 'profile'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
              <input
                type="url"
                name="socialLinks.website"
                value={editing === 'profile' ? (formData['socialLinks.website'] || profile.socialLinks?.website || '') : (profile.socialLinks?.website || '')}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                readOnly={editing !== 'profile'}
              />
            </div>
            {editing === 'profile' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Profile Picture</label>
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData((prev: any) => ({ ...prev, profilePicture: file }));
                      }
                    }}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 file:bg-blue-600 file:text-white file:border-none file:px-3 file:py-1 file:rounded file:mr-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Resume</label>
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData((prev: any) => ({ ...prev, resume: file }));
                      }
                    }}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 file:bg-blue-600 file:text-white file:border-none file:px-3 file:py-1 file:rounded file:mr-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Home Section Image</label>
                  <input
                    type="file"
                    name="homeImage"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData((prev: any) => ({ ...prev, homeImage: file }));
                      }
                    }}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 file:bg-blue-600 file:text-white file:border-none file:px-3 file:py-1 file:rounded file:mr-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">About Section Image</label>
                  <input
                    type="file"
                    name="aboutImage"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData((prev: any) => ({ ...prev, aboutImage: file }));
                      }
                    }}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 file:bg-blue-600 file:text-white file:border-none file:px-3 file:py-1 file:rounded file:mr-3"
                  />
                </div>
              </>
            )}
          </div>
          
          {editing === 'profile' && (
            <div className="flex space-x-4 mt-6">
              <button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Save size={20} />
                <span>Save Changes</span>
              </button>
              <button 
                onClick={() => setEditing(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderEducationTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Education Management</h2>
        <button 
          onClick={() => setShowAddForm('education')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Education</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu._id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                <p className="text-gray-300">{edu.institution}</p>
                <p className="text-gray-400">{edu.field}</p>
                <p className="text-sm text-gray-500">
                  {new Date(edu.startDate).toLocaleDateString()} - 
                  {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditEducation(edu)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteEducation(edu._id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm === 'education' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Add New Education</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Institution</label>
              <input
                type="text"
                name="institution"
                value={formData.institution || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Field</label>
              <input
                type="text"
                name="field"
                value={formData.field || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Grade</label>
              <input
                type="text"
                name="grade"
                value={formData.grade || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <button onClick={handleAddEducation} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Save size={20} />
              <span>Add Education</span>
            </button>
            <button onClick={() => setShowAddForm(null)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <X size={20} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {editing && editing.startsWith('education-') && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Edit Education</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Institution</label>
              <input
                type="text"
                name="institution"
                value={formData.institution || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Field</label>
              <input
                type="text"
                name="field"
                value={formData.field || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Grade</label>
              <input
                type="text"
                name="grade"
                value={formData.grade || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <button onClick={handleUpdateEducation} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Save size={20} />
              <span>Update Education</span>
            </button>
            <button onClick={() => setEditing(null)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <X size={20} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSkillsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Skills Management</h2>
        <button 
          onClick={() => setShowAddForm('skills')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Skill</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill._id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-semibold">{skill.name}</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditSkill(skill)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDeleteSkill(skill._id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-gray-400 text-sm">{skill.category}</p>
          </div>
        ))}
      </div>

      {showAddForm === 'skills' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Add New Skill</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              >
                <option value="">Select Category</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
              <input
                type="text"
                name="icon"
                value={formData.icon || ''}
                onChange={handleInputChange}
                placeholder="e.g., react, node, mongodb"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <button onClick={handleAddSkill} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Save size={20} />
              <span>Add Skill</span>
            </button>
            <button onClick={() => setShowAddForm(null)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <X size={20} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {editing && editing.startsWith('skill-') && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Edit Skill</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              >
                <option value="">Select Category</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
              <input
                type="text"
                name="icon"
                value={formData.icon || ''}
                onChange={handleInputChange}
                placeholder="e.g., react, node, mongodb"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <button onClick={handleUpdateSkill} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Save size={20} />
              <span>Update Skill</span>
            </button>
            <button onClick={() => setEditing(null)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <X size={20} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Projects Management</h2>
        <button 
          onClick={() => setShowAddForm('projects')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Project</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-gray-800 rounded-lg overflow-hidden">
            <img 
              src={assetUrl(project.image)} 
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span key={tech} className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs ${
                  project.status === 'Completed' ? 'bg-green-600' : 'bg-yellow-600'
                } text-white`}>
                  {project.status}
                </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditProject(project)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm === 'projects' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Add New Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              >
                <option value="">Select Status</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Planned">Planned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData((prev: any) => ({ ...prev, image: file }));
                  }
                }}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 file:bg-blue-600 file:text-white file:border-none file:px-3 file:py-1 file:rounded file:mr-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Live URL</label>
              <input
                type="url"
                name="demoUrl"
                value={formData.demoUrl || ''}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl || ''}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Technologies (comma separated)</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies || ''}
                onChange={handleInputChange}
                placeholder="React, Node.js, MongoDB"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <button onClick={handleAddProject} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Save size={20} />
              <span>Add Project</span>
            </button>
            <button onClick={() => setShowAddForm(null)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <X size={20} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {editing && editing.startsWith('project-') && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Edit Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              >
                <option value="">Select Status</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Planned">Planned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData((prev: any) => ({ ...prev, image: file }));
                  }
                }}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 file:bg-blue-600 file:text-white file:border-none file:px-3 file:py-1 file:rounded file:mr-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Live URL</label>
              <input
                type="url"
                name="demoUrl"
                value={formData.demoUrl || ''}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl || ''}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Technologies (comma separated)</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies || ''}
                onChange={handleInputChange}
                placeholder="React, Node.js, MongoDB"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              />
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <button onClick={handleUpdateProject} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Save size={20} />
              <span>Update Project</span>
            </button>
            <button onClick={() => setEditing(null)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <X size={20} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderMessagesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
        <button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Refresh
        </button>
      </div>
      
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message._id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-semibold">{message.name}</h3>
                <p className="text-gray-400">{message.email}</p>
                {message.phone && <p className="text-gray-400">{message.phone}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  message.status === 'new' ? 'bg-red-600' : 
                  message.status === 'read' ? 'bg-yellow-600' : 'bg-green-600'
                } text-white`}>
                  {message.status}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(message.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {message.subject && (
              <p className="text-white font-medium mb-2">{message.subject}</p>
            )}
            <p className="text-gray-300">{message.message}</p>
            <div className="flex space-x-2 mt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                Mark as Read
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-300 hover:text-white flex items-center space-x-2"
              >
                <Eye size={20} />
                <span>View Portfolio</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{tab.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'education' && renderEducationTab()}
              {activeTab === 'skills' && renderSkillsTab()}
              {activeTab === 'projects' && renderProjectsTab()}
              {activeTab === 'messages' && renderMessagesTab()}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
