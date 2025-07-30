# Database Setup Guide

## 🗄️ **Database Options for Strapi v5**

Strapi v5 officially supports these databases:

### **1. PostgreSQL (Recommended for Production) ⭐**
- **Best performance and features**
- **Full ACID compliance**
- **Excellent for complex queries**
- **Great for production scaling**

### **2. MySQL**
- **Good performance**
- **Widely supported**
- **Familiar to many developers**

### **3. SQLite (Development Only)**
- **Simple file-based database**
- **Good for development**
- **Not suitable for production**

## ⚠️ **MongoDB Support**

**MongoDB is NOT officially supported in Strapi v5.** However, here are your options:

### **Option A: Use PostgreSQL (Recommended)**
PostgreSQL offers similar flexibility to MongoDB with better relational features.

### **Option B: Downgrade to Strapi v4**
If you absolutely need MongoDB, we'd need to recreate the project with Strapi v4.

### **Option C: Hybrid Approach**
Use PostgreSQL for Strapi and MongoDB for specific data needs.

## 🚀 **Setting Up PostgreSQL (Recommended)**

### **1. Install PostgreSQL**

**On macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Or using Postgres.app
# Download from https://postgresapp.com/
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### **2. Create Database and User**

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE blog_cms;
CREATE USER strapi_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE blog_cms TO strapi_user;
\q
```

### **3. Configure Environment Variables**

Create a `.env` file in the `cms` directory:

```env
# PostgreSQL Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=blog_cms
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false

# JWT Secrets (generate secure random strings)
JWT_SECRET=your-jwt-secret-here
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
API_TOKEN_SALT=your-api-token-salt-here
TRANSFER_TOKEN_SALT=your-transfer-token-salt-here

# App Keys (generate secure random strings)
APP_KEYS=your-app-keys-here,another-app-key-here

# Server Configuration
HOST=0.0.0.0
PORT=1337
```

### **4. Install PostgreSQL Driver**

```bash
npm install pg
```

### **5. Restart Strapi**

```bash
npm run develop
```

## 🗄️ **Setting Up MySQL**

### **1. Install MySQL**

**On macOS:**
```bash
brew install mysql
brew services start mysql
```

### **2. Create Database and User**

```sql
CREATE DATABASE blog_cms;
CREATE USER 'strapi_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON blog_cms.* TO 'strapi_user'@'localhost';
FLUSH PRIVILEGES;
```

### **3. Configure Environment Variables**

```env
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=blog_cms
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_secure_password
```

### **4. Install MySQL Driver**

```bash
npm install mysql2
```

## 🔧 **Database Migration**

When switching databases, you'll need to:

1. **Stop Strapi**
2. **Update environment variables**
3. **Restart Strapi** - it will automatically create the new database schema

## 📊 **Database Comparison**

| Feature | PostgreSQL | MySQL | SQLite | MongoDB* |
|---------|------------|-------|--------|----------|
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Scalability | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ |
| ACID Compliance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| JSON Support | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Strapi v5 Support | ✅ | ✅ | ✅ | ❌ |

*MongoDB not officially supported in Strapi v5

## 🎯 **Recommendation**

**Use PostgreSQL** for the best balance of:
- ✅ Performance
- ✅ Features
- ✅ Scalability
- ✅ Official Strapi support
- ✅ Production readiness

## 🚀 **Next Steps**

1. Choose your database (PostgreSQL recommended)
2. Install the database server
3. Create database and user
4. Update environment variables
5. Restart Strapi
6. Create your admin account
7. Start building your blog! 