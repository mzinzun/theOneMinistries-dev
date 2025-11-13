#!/bin/bash

# Deployment Preparation Script for Namecheap
# This script prepares your files for deployment

echo "🚀 Preparing TheOneMinistries API for Namecheap Deployment..."

# Set variables
PROJECT_DIR="/Users/mzinzun/development/theOneMinistries-dev"
API_DIR="$PROJECT_DIR/api_server"
DEPLOY_DIR="$PROJECT_DIR/deploy_package"

# Create deployment package directory
echo "📁 Creating deployment package..."
mkdir -p "$DEPLOY_DIR"

# Copy necessary files
echo "📂 Copying API server files..."
cp -r "$API_DIR/controllers" "$DEPLOY_DIR/"
cp -r "$API_DIR/database" "$DEPLOY_DIR/"
cp -r "$API_DIR/helper" "$DEPLOY_DIR/"
cp -r "$API_DIR/routes" "$DEPLOY_DIR/"

# Copy configuration files
cp "$API_DIR/package.json" "$DEPLOY_DIR/"
cp "$API_DIR/api-server.js" "$DEPLOY_DIR/"

# Copy environment template (you'll need to create .env from this)
cp "$API_DIR/.env.template" "$DEPLOY_DIR/"

# Copy documentation
cp "$API_DIR/NAMECHEAP_DEPLOYMENT.md" "$DEPLOY_DIR/"
cp "$API_DIR/POSTGRES_MIGRATION.md" "$DEPLOY_DIR/"

# Create .env file from template
echo "📝 Creating .env file from template..."
cat > "$DEPLOY_DIR/.env" << 'EOF'
# PostgreSQL Migration - Environment Variables
# UPDATE THESE VALUES WITH YOUR NAMECHEAP DATABASE CREDENTIALS

# Database Configuration (UPDATE THESE!)
DB_HOST=your_namecheap_postgres_host_here
DB_PORT=5432
DB_NAME=your_database_name_here
DB_USER=your_database_user_here
DB_PASSWORD=your_database_password_here
DB_SSL=true

# Application Configuration
NODE_ENV=production
PORT=3001

# JWT Configuration (CHANGE THIS SECRET!)
JWT_SECRET=change_this_to_a_secure_random_string
JWT_EXPIRES_IN=7d
EOF

# Create a README for deployment
cat > "$DEPLOY_DIR/DEPLOYMENT_README.md" << 'EOF'
# 🚀 TheOneMinistries API - Ready for Deployment

## What's in this package:
- ✅ All necessary API files
- ✅ PostgreSQL configuration and migration
- ✅ Updated dependencies (including 'pg')
- ✅ Environment template
- ✅ Deployment documentation

## Next Steps:

1. **Configure Database:**
   - Create PostgreSQL database in Namecheap cPanel
   - Update `.env` with your actual database credentials

2. **Upload to Server:**
   - Upload this entire folder to your Namecheap hosting
   - Or use Git to clone and copy these files

3. **Install Dependencies:**
   ```bash
   npm install --production
   ```

4. **Run Migration:**
   ```bash
   npm run migrate
   ```

5. **Start Your App:**
   ```bash
   npm start
   ```

## Important Files:
- `NAMECHEAP_DEPLOYMENT.md` - Complete deployment guide
- `.env` - **EDIT THIS** with your database credentials
- `database/migrate.js` - Run this to create your database tables

## Controllers Updated:
- Use `controllers/user_controller_pg.js` as example
- Convert other controllers following the same pattern

Good luck with your deployment! 🎉
EOF

# Create compressed archive for easy upload
echo "📦 Creating compressed archive..."
cd "$PROJECT_DIR"
tar -czf "theoneministries_api_deploy.tar.gz" -C deploy_package .

echo ""
echo "✅ Deployment package ready!"
echo ""
echo "📁 Files prepared in: $DEPLOY_DIR"
echo "📦 Compressed archive: $PROJECT_DIR/theoneministries_api_deploy.tar.gz"
echo ""
echo "🔧 Next steps:"
echo "1. Edit $DEPLOY_DIR/.env with your Namecheap database credentials"
echo "2. Upload the files to your Namecheap server"
echo "3. Follow the instructions in NAMECHEAP_DEPLOYMENT.md"
echo ""
echo "📚 Documentation included:"
echo "- NAMECHEAP_DEPLOYMENT.md (detailed deployment guide)"
echo "- POSTGRES_MIGRATION.md (migration information)"
echo "- DEPLOYMENT_README.md (quick start guide)"
