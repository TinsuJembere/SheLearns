# SheLearns - Women's Tech Learning Platform

SheLearns is a comprehensive learning platform designed specifically for women in technology. It provides a supportive environment where women can learn, connect with mentors, engage in discussions, and grow their tech careers.

you can see it live on https://she-learns.vercel.app/

## 🌟 Features

### 👩‍💻 For Learners
- **AI Learning Companion**: Get instant help with coding questions and learning concepts
- **Mentor Matching**: Connect with experienced professionals in your field
- **Real-time Chat**: Communicate directly with mentors and peers
- **Blog Platform**: Access and contribute to tech-related articles
- **Profile Management**: Showcase your skills, projects, and learning journey

### 👩‍🏫 For Mentors
- **Mentorship Dashboard**: Manage mentee requests and interactions
- **Chat System**: Provide guidance through real-time messaging
- **Blog Moderation**: Share your knowledge through blog posts
- **Profile Customization**: Display your expertise and achievements

### 🛠️ Technical Features
- Real-time messaging with file sharing
- Cloudinary integration for image and file uploads
- AI-powered learning assistance
- Secure authentication system
- Responsive design for all devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/shelearns.git
cd shelearns
```

2. **Set up the backend**
```bash
cd server
npm install
```

Create a `.env` file in the server directory with the following variables:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3. **Set up the frontend**
```bash
cd client
npm install
```

Create a `.env` file in the client directory:
```env
VITE_API_URL=your_backend_api_url
```

### Running the Application

1. **Start the backend server**
```bash
cd server
npm run dev
```

2. **Start the frontend development server**
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Technology Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- Socket.io-client for real-time features
- Axios for API requests
- React Router for navigation
- React Icons for UI elements

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Cloudinary for file storage
- Multer for file upload handling

## 📱 Features in Detail

### Authentication
- Secure signup and login system
- JWT-based authentication
- Role-based access control (Student/Mentor)

### Real-time Chat
- One-on-one messaging
- File sharing support
- Message editing and deletion
- Read receipts
- Online status indicators

### AI Learning Companion
- Natural language processing for coding questions
- Code explanation capabilities
- Learning path recommendations
- Interactive problem-solving assistance

### Profile Management
- Customizable user profiles
- Skill tracking
- Portfolio showcase
- Avatar upload with Cloudinary

### Blog System
- Create and publish articles
- Rich text editing
- Image upload support
- Moderation system for quality control

Built with ❤️ for women in tech
