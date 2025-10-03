# MERN Portfolio Website

A modern, responsive portfolio website built with the MERN stack (MongoDB, Express.js, React, and Node.js). Features a dynamic admin dashboard for content management.

## 🌟 Features

### Portfolio Frontend
- **Modern Design**: Elegant UI with animations using Framer Motion
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Smooth Navigation**: Automatic scrolling to sections via navbar
- **Interactive Sections**:
  - Home: Hero section with profile picture and call-to-action
  - About: Personal information and download resume functionality
  - Education: Timeline of educational achievements
  - Skills: Categorized technical skills with proficiency indicators
  - Projects: Portfolio showcase with filtering and live demos
  - Contact: Contact form with form validation

### Admin Dashboard
- **Secure Authentication**: JWT-based login system
- **Content Management**: Full CRUD operations for all portfolio content
- **File Upload**: Image and document upload functionality
- **Real-time Updates**: Changes reflect immediately on the portfolio
- **Message Management**: View and manage contact form submissions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-portfolio
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   npm run backend:install
   ```

4. **Environment Setup**
   
   **Frontend (.env)**:
   ```bash
   cp env.template .env
   ```
   Update `.env` with your frontend variables.
   
   **Backend (.env)**:
   ```bash
   cd backend
   cp .env.example .env
   ```
   Update `.env` with your MongoDB URI and other backend variables.

5. **Start Development Servers**
   
   **Terminal 1 (Backend)**:
   ```bash
   npm run backend
   ```
   
   **Terminal 2 (Frontend)**:
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## 📁 Project Structure

```
mern-portfolio/
├── backend/                 # Express.js API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── utils/               # Helper functions
│   ├── uploads/             # File storage
│   └── server.js           # Main server file
├── src/                    # React frontend
│   ├── components/         # Portfolio components
│   ├── pages/              # Admin pages
│   ├── types/              # TypeScript definitions
│   ├── utils/               # API utilities
│   ├── hooks/               # Custom React hooks
│   └── contexts/            # React contexts
└── public/                 # Static assets
```

## 🔧 Technical Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form management
- **Axios** for API requests
- **React Toastify** for notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Express Validator** for input validation
- **BcryptJS** for password hashing
- **Nodemailer** for email notifications

## 🎨 Design Features

- **Gradient Backgrounds**: Modern gradient design elements
- **Smooth Animations**: Scroll-triggered animations and hover effects
- **Glass Morphism**: Backdrop blur effects for modern UI
- **Interactive Elements**: Hover states and micro-interactions
- **Responsive Grid**: Mobile-first responsive design
- **Color Scheme**: Professional blue and purple gradients

## 📝 Admin Features

### Content Management
- **Profile Management**: Update personal information, bio, resume
- **Education CRUD**: Add, edit, delete education entries
- **Skills Management**: Manage technical skills with categories and proficiency
- **Project Portfolio**: Upload project images, manage demo links
- **File Uploads**: Handle profile pictures, project images, resume PDFs

### Message Management
- **Contact Form**: View all incoming messages
- **Status Tracking**: Mark messages as read/replied
- **Email Notifications**: Automatic email alerts for new messages

## 🚀 Deployment

### Frontend (Vercel)
1. Build the project: `npm run build`
2. Deploy to Vercel: Connect your GitHub repository
3. Set environment variables in Vercel dashboard

### Backend (Render/Heroku)
1. Deploy backend folder to your chosen platform
2. Set environment variables including MongoDB URI
3. Update frontend API URL to production backend

### Database
- Use MongoDB Atlas for cloud database
- Ensure network access is configured properly
- Update connection string in backend `.env`

## 🔐 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MERN Portfolio
VITE_NODE_ENV=development
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
ADMIN_EMAIL=admin@yourportfolio.com
ADMIN_PASSWORD=your_admin_password
```

## 📱 Mobile Optimization

- Responsive navigation with mobile menu
- Touch-friendly interface elements
- Optimized images for different screen sizes
- Smooth scrolling on mobile devices
- Landscape and portrait orientation support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- UI inspiration from modern portfolio designs
- Framer Motion for smooth animations
- Lucide React for beautiful icons
- TailwindCSS for efficient styling

---

**Built with ❤️ using the MERN stack**
