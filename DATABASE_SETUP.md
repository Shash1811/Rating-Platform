# PostgreSQL Database Setup Guide

## Step 1: Install PostgreSQL

### Option A: Download Official Installer (Recommended for Windows)

1. **Download PostgreSQL**
   - Go to: https://www.postgresql.org/download/windows/
   - Download the latest version (PostgreSQL 16+ recommended)
   - Choose the interactive installer

2. **Run Installer**
   - Run the downloaded `.exe` file
   - Follow the installation wizard
   - **Important**: Remember the password you set for the `postgres` superuser
   - Install pgAdmin 4 (included in the installer)

3. **Verify Installation**
   - Open Command Prompt/PowerShell
   - Run: `psql --version`
   - You should see the PostgreSQL version

### Option B: Using Chocolatey (Windows Package Manager)

```bash
# Install Chocolatey (if not already installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install PostgreSQL
choco install postgresql

# Refresh PATH
refreshenv
```

## Step 2: Create Database

### Method A: Using pgAdmin (GUI Method)

1. **Open pgAdmin 4**
   - Find it in Start Menu or run from installer

2. **Connect to Server**
   - Click "Add New Server"
   - **Name**: Local PostgreSQL
   - **Host**: localhost
   - **Port**: 5432
   - **Username**: postgres
   - **Password**: [password you set during installation]
   - Click "Save"

3. **Create Database**
   - Expand the server in the left panel
   - Right-click on "Databases"
   - Select "Create" → "Database..."
   - **Database name**: `rating_platform`
   - **Owner**: postgres
   - Click "Save"

### Method B: Using psql (Command Line)

1. **Open Command Prompt as Administrator**

2. **Connect to PostgreSQL**
   ```bash
   psql -U postgres -h localhost
   ```
   - Enter the password when prompted

3. **Create Database**
   ```sql
   CREATE DATABASE rating_platform;
   ```

4. **Verify Database Creation**
   ```sql
   \l
   ```
   - You should see `rating_platform` in the list

5. **Exit psql**
   ```sql
   \q
   ```

## Step 3: Configure Backend Environment

1. **Navigate to Backend Directory**
   ```bash
   cd c:\Users\Shashwati B.U\OneDrive\Desktop\Full_Stack_Coding\backend
   ```

2. **Open .env File**
   - Open the `.env` file in a text editor
   - Update with your PostgreSQL credentials:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_postgres_password_here
   DB_NAME=rating_platform

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # Application Configuration
   PORT=3001
   ```

3. **Replace the following:**
   - `your_postgres_password_here` → Your actual PostgreSQL password
   - `your-super-secret-jwt-key-change-this-in-production` → A secure random string

## Step 4: Test Database Connection

1. **Start Backend Server**
   ```bash
   npm run start:dev
   ```

2. **Check for Database Connection Messages**
   - You should see logs indicating successful database connection
   - Look for messages like: "Database connection established"

3. **Common Issues & Solutions**

   ### Issue: "Connection refused"
   - **Solution**: Make sure PostgreSQL service is running
   - Check Windows Services for "postgresql-x64-16"

   ### Issue: "Authentication failed"
   - **Solution**: Verify password in .env matches PostgreSQL password
   - Check username is correct (usually "postgres")

   ### Issue: "Database does not exist"
   - **Solution**: Run the database creation commands from Step 2
   - Verify database name is exactly `rating_platform`

## Step 5: Verify Database Tables (Optional)

1. **Start Backend** (if not already running)
   ```bash
   npm run start:dev
   ```

2. **Check Tables in pgAdmin**
   - Connect to your server in pgAdmin
   - Expand `rating_platform` database
   - Expand "Schemas" → "public" → "Tables"
   - You should see: `users`, `stores`, `ratings`

3. **Or Use psql**
   ```bash
   psql -U postgres -d rating_platform -h localhost
   \dt
   ```

## Step 6: Database Credentials Reference

Keep these credentials handy:

| Setting | Value | Where to Use |
|----------|--------|--------------|
| Host | localhost | .env file |
| Port | 5432 | .env file |
| Username | postgres | .env file |
| Password | [Your password] | .env file |
| Database | rating_platform | .env file |

## Step 7: Security Best Practices

1. **Change Default Password**
   - Consider changing the default `postgres` password
   - Use a strong, unique password

2. **Environment Variables**
   - Never commit `.env` file to version control
   - Use different passwords for development/production

3. **Database Permissions**
   - For production, create a dedicated user with limited permissions
   - Don't use `postgres` superuser in production

## Step 8: Troubleshooting

### PostgreSQL Service Not Starting
```bash
# Check service status
Get-Service postgresql*

# Start service manually
Start-Service postgresql-x64-16
```

### Port Already in Use
```bash
# Check what's using port 5432
netstat -ano | findstr :5432

# Change PostgreSQL port if needed (in postgresql.conf)
```

### Connection Timeout
- Check Windows Firewall settings
- Ensure PostgreSQL port (5432) is allowed
- Try connecting with `localhost` and `127.0.0.1`

## Quick Setup Commands (Copy & Paste)

```bash
# 1. Navigate to project
cd c:\Users\Shashwati B.U\OneDrive\Desktop\Full_Stack_Coding

# 2. Create database (if using psql)
psql -U postgres -c "CREATE DATABASE rating_platform;"

# 3. Navigate to backend
cd backend

# 4. Install dependencies (if not done)
npm install

# 5. Start backend
npm run start:dev
```

## Next Steps

After database setup is complete:

1. ✅ Backend should connect to PostgreSQL successfully
2. ✅ Database tables will be created automatically
3. ✅ Start the frontend: `cd ../frontend && npm start`
4. ✅ Access application at `http://localhost:3000`

## Need Help?

If you encounter any issues:

1. **Check PostgreSQL logs**: Usually in `C:\Program Files\PostgreSQL\16\data\log`
2. **Verify service status**: Windows Services → postgresql-x64-16
3. **Test connection manually**: Use pgAdmin or psql to connect
4. **Check .env file**: Ensure all values are correct

Your database is now ready for the rating platform! 🎉
