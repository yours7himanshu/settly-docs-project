# TeamDocs - MERN Knowledge Management System

A full-stack MERN application where teams can create, manage, and search knowledge documents with AI-powered features using Google Gemini.

## 🚀 Features

### Core Functionality
- **User Authentication**: Email/password registration and login with JWT
- **Role-based Access**: Regular users and administrators with different permissions
- **Document Management**: Create, read, update, and delete documents
- **Team Activity Feed**: Track recent document changes across the team

### AI-Powered Features (Google Gemini Integration)
- **Auto-Summarization**: Automatically generate document summaries
- **Intelligent Tags**: AI-generated tags for better organization
- **Semantic Search**: Find documents using AI embeddings and similarity matching
- **Text Search**: Traditional full-text search across documents
- **Team Q&A**: Ask questions and get answers based on your document knowledge base

### Advanced Features
- **Document Versioning**: Track changes and view document history
- **Tag-based Filtering**: Filter documents by tags with chip-style interface
- **Responsive Design**: Professional UI that works on desktop and mobile
- **Real-time Activity**: See who's editing what in real-time

## 🏗️ Architecture

```
steyll/
├── backend/          # Express.js API server
├── client/           # React client application (User interface)
├── admin/            # React admin application (Admin interface)
└── README.md         # This file
```

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Google Gemini API Key** (for AI features)

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd settly-docs-project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

**Environment Configuration:**
```bash
# Copy the example file and create your own .env
cp .env.example .env
```

**Edit the `.env` file with your actual values:**
```env
MONGO_URI=mongodb://localhost:27017/teamdocs
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000

# Admin Credentials (not stored in database)
ADMIN_EMAIL=admin@settyl.com
ADMIN_PASSWORD=admin12345
```

**Start the backend server:**
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Client Application Setup

```bash
cd ../client
npm install
```

**Environment Configuration:**
```bash
# Copy the example file and create your own .env
cp .env.example .env
```

**Edit the client `.env` file (optional - for custom backend URL):**
```env
VITE_BACKEND_URL=http://localhost:3000/api
```

**Start the client:**
```bash
npm run dev
```

The client will run on `http://localhost:5173`

### 4. Admin Application Setup

```bash
cd ../admin
npm install
```

**Environment Configuration:**
```bash
# Copy the example file and create your own .env
cp .env.example .env
```

**Edit the admin `.env` file (optional - for custom backend URL):**
```env
VITE_BACKEND_URL=http://localhost:3000/api
```

**Start the admin application:**
```bash
npm run dev
```

The admin interface will run on `http://localhost:5174`

## 🔧 Environment Variables Explained

### Backend Variables (`backend/.env`)

#### Required Variables
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation (make it long and secure)
- `GEMINI_API_KEY`: Google Gemini API key for AI features

#### Optional Variables
- `PORT`: Backend server port (default: 3000)
- `CLIENT_ORIGIN`: Client app URL for CORS (default: http://localhost:5173)
- `ADMIN_ORIGIN`: Admin app URL for CORS (default: http://localhost:5174)

#### Admin Configuration
- `ADMIN_EMAIL`: Administrator email for admin access
- `ADMIN_PASSWORD`: Administrator password for admin access

**Note**: Admin credentials are stored in environment variables, not in the database, for enhanced security.

### Frontend Variables (Optional)

#### Client (`client/.env`)
- `VITE_BACKEND_URL`: Backend API URL (default: http://localhost:3000/api)

#### Admin (`admin/.env`)
- `VITE_BACKEND_URL`: Backend API URL (default: http://localhost:3000/api)

**Note**: Frontend .env files are optional. The apps will use default values if not provided.

## 🎯 Getting Started

1. **Start all three services** (backend, client, admin)
2. **Register a new user** at `http://localhost:5173/register`
3. **Login** and start creating documents
4. **Access admin panel** at `http://localhost:5174` using the admin credentials:
   - **Email**: `admin@settyl.com`
   - **Password**: `admin12345`

**Note**: Make sure to update your backend `.env` file with these admin credentials for the admin login to work.

## 👥 User Roles

### Regular Users
- Create, edit, and delete their own documents
- Search across their personal documents
- Use AI features (summarization, tag generation, Q&A)
- View team activity feed

### Administrators
- Full access to all documents in the system
- Can edit and delete any user's documents
- Access to admin panel with management features
- All regular user features

## 🔍 Search Features

### Text Search
- Traditional full-text search using MongoDB text indexes
- Searches across document titles, content, and tags
- Fast and efficient for exact matches

### Semantic Search
- AI-powered search using Google Gemini embeddings
- Understands context and meaning, not just keywords
- Great for finding conceptually related documents

## 🤖 AI Features

All AI features are powered by Google Gemini:

1. **Auto-Summarization**: Documents are automatically summarized when created
2. **Tag Generation**: AI suggests relevant tags based on content
3. **Semantic Search**: Vector similarity search using embeddings
4. **Team Q&A**: Ask questions and get answers from your document knowledge base

## 📁 Project Structure

### Backend (`/backend`)
```
backend/
├── src/
│   ├── config/          # Database and environment configuration
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Authentication and error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # External service integrations (Gemini AI)
│   └── index.js         # Server entry point
├── .env.example         # Environment variables template
└── package.json
```

### Client (`/client`)
```
client/
├── src/
│   ├── components/      # Reusable React components
│   ├── context/         # React Context (Authentication)
│   ├── lib/             # Utilities (HTTP client)
│   ├── pages/           # React pages/routes
│   └── main.jsx         # React entry point
└── package.json
```

### Admin (`/admin`)
```
admin/
├── src/
│   ├── components/      # Admin-specific components
│   ├── context/         # React Context (Authentication)
│   ├── lib/             # Utilities (HTTP client)
│   ├── pages/           # Admin pages/routes
│   └── main.jsx         # React entry point
└── package.json
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Role-based Access Control**: Different permissions for users and admins
- **Environment-based Admin**: Admin credentials stored securely in environment variables
- **Input Validation**: Zod schema validation for all API inputs
- **CORS Protection**: Configured for specific origins

## 🛠️ Development

### Running in Development Mode

1. **Backend**: `cd backend && npm run dev`
2. **Client**: `cd client && npm run dev`
3. **Admin**: `cd admin && npm run dev`

### Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- Google Gemini AI
- Zod for validation

**Frontend:**
- React.js + Vite
- React Router for routing
- Tailwind CSS for styling
- Axios for HTTP requests
- React Toastify for notifications
- Lucide React for icons

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user or admin

### Document Endpoints
- `GET /api/docs` - List user's documents
- `POST /api/docs` - Create new document
- `GET /api/docs/:id` - Get specific document
- `PUT /api/docs/:id` - Update document
- `DELETE /api/docs/:id` - Delete document
- `POST /api/docs/:id/summarize` - Generate AI summary
- `POST /api/docs/:id/tags` - Generate AI tags

### Search Endpoints
- `GET /api/search/text?q=query` - Text search
- `GET /api/search/semantic?q=query` - Semantic search

### Q&A Endpoint
- `POST /api/qa` - Ask question about documents

### Activity Endpoint
- `GET /api/activity` - Get recent team activity

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check your `MONGO_URI` in `.env`

2. **Gemini AI Features Not Working**
   - Verify your `GEMINI_API_KEY` is correct
   - Check Google Cloud Console for API quotas

3. **Admin Login Failed**
   - Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`
   - Ensure backend server is running

4. **CORS Errors**
   - Check `CLIENT_ORIGIN` and `ADMIN_ORIGIN` in backend `.env`
   - Ensure all three servers are running on correct ports





