# Namecheap Deployment Guide

## 🎯 Overview
This guide helps you deploy your migrated PostgreSQL Node.js application to Namecheap hosting.

## 📋 Prerequisites
- Namecheap shared hosting account with Node.js support
- PostgreSQL database created in Namecheap cPanel
- FTP/SFTP access to your hosting account
- Your database credentials from Namecheap

## 🗂️ What to Deploy

### **Deploy These Directories/Files:**
```
api_server/
├── controllers/          # All your controllers (use _pg versions)
├── database/            # PostgreSQL connection and migration files
├── helper/              # Authentication middleware
├── routes/              # Your API routes
├── package.json         # Dependencies (including 'pg')
├── api-server.js        # Your main server file
└── .env                 # Environment variables (create from template)
```

### **DON'T Deploy These:**
```
❌ models/               # MongoDB models (not needed for PostgreSQL)
❌ seed/                 # Old MongoDB seed files
❌ node_modules/         # Will be installed on server
❌ .env.template         # Template only
❌ mongoexport           # MongoDB export files
```

## 🔧 Pre-Deployment Setup

### **Step 1: Create Production Environment File**
```bash
cp .env.template .env
```

Edit `.env` with your Namecheap database credentials:
```env
# Namecheap PostgreSQL Configuration
DB_HOST=your_namecheap_postgres_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_SSL=true

# Production settings
NODE_ENV=production
PORT=3001

# Your JWT secret
JWT_SECRET=your_production_jwt_secret_here
```

### **Step 2: Update Your Main Server File**
Modify `api-server.js` to use PostgreSQL instead of MongoDB:

```javascript
// Replace MongoDB connection with PostgreSQL
const db = require('./database/postgres-connection');

// Test PostgreSQL connection on startup
db.testConnection()
  .then(() => {
    console.log('✅ PostgreSQL connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });
```

### **Step 3: Update Controllers**
Replace your MongoDB controllers with PostgreSQL versions:
```javascript
// In your routes file, change:
// const userController = require('./controllers/user_controller');
const userController = require('./controllers/user_controller_pg');
```

## 🚀 Deployment Methods

### **Method 1: FTP/SFTP Upload (Recommended)**

1. **Compress your api_server folder:**
```bash
cd /Users/mzinzun/development/theOneMinistries-dev
tar -czf api_server.tar.gz api_server/
```

2. **Upload via FTP/SFTP:**
   - Use FileZilla, Cyberduck, or your preferred FTP client
   - Upload to your domain's directory (usually `public_html/` or similar)
   - Extract the files on the server

3. **Install dependencies on server:**
```bash
# SSH into your Namecheap server or use cPanel Terminal
cd /path/to/your/api_server
npm install --production
```

### **Method 2: Git Deployment**

1. **Commit your changes:**
```bash
git add .
git commit -m "PostgreSQL migration complete"
git push origin pgMigration
```

2. **Clone on server:**
```bash
# SSH into Namecheap server
git clone https://github.com/mzinzun/theOneMinistries-dev.git
cd theOneMinistries-dev/api_server
npm install --production
```

## 🗄️ Database Setup on Namecheap

### **Step 1: Create PostgreSQL Database**
1. Login to Namecheap cPanel
2. Go to "PostgreSQL Databases"
3. Create new database
4. Create database user
5. Assign user to database with all privileges
6. Note down the connection details

### **Step 2: Run Migration on Production**
```bash
# SSH into your server, navigate to your app directory
cd /path/to/your/api_server

# Run the migration to create tables
npm run migrate
```

## 🔧 Server Configuration

### **Update package.json start script:**
```json
{
  "scripts": {
    "start": "node api-server.js",
    "dev": "nodemon api-server.js",
    "migrate": "node database/migrate.js"
  }
}
```

### **Production Optimizations:**
```javascript
// In your server file, add production settings:
if (process.env.NODE_ENV === 'production') {
  // Disable detailed error messages
  app.use((err, req, res, next) => {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  });
}
```

## 🌐 Namecheap-Specific Configuration

### **Node.js App Setup:**
1. In cPanel, go to "Node.js Selector"
2. Create new Node.js application
3. Set startup file: `api-server.js`
4. Set application root to your uploaded directory
5. Install dependencies
6. Start the application

### **Environment Variables in cPanel:**
Add your environment variables in the Node.js app configuration:
- `DB_HOST`
- `DB_NAME`
- `DB_USER` 
- `DB_PASSWORD`
- `NODE_ENV=production`

## 🧪 Testing Your Deployment

### **Test API Endpoints:**
```bash
# Test basic connection
curl https://yourdomain.com/api/health

# Test user endpoints (if you have them)
curl https://yourdomain.com/api/users
```

### **Check Logs:**
```bash
# In your server directory
tail -f logs/error.log
# or check cPanel error logs
```

## 🔍 Troubleshooting

### **Common Issues:**

1. **Database Connection Fails:**
   - Verify credentials in `.env`
   - Check if PostgreSQL service is running
   - Ensure SSL is properly configured

2. **Module Not Found:**
   - Run `npm install` in production
   - Check Node.js version compatibility

3. **Permission Errors:**
   - Set proper file permissions (755 for directories, 644 for files)
   - Ensure Node.js app has write access where needed

4. **Port Issues:**
   - Use the port assigned by Namecheap
   - Check if port is properly configured in cPanel

## 📋 Deployment Checklist

- [ ] PostgreSQL database created on Namecheap
- [ ] Environment variables configured
- [ ] Code uploaded to server
- [ ] Dependencies installed (`npm install`)
- [ ] Database migration completed (`npm run migrate`)
- [ ] Node.js app configured in cPanel
- [ ] API endpoints tested
- [ ] Error logging configured
- [ ] SSL/HTTPS working
- [ ] Domain pointing to correct directory

## 🚀 Go Live!

Once everything is tested and working:
1. Update your frontend to point to the new API URL
2. Update any API documentation
3. Monitor logs for any issues
4. Set up automated backups for your PostgreSQL database

Your PostgreSQL-powered API is now ready for production on Namecheap! 🎉