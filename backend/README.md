# Tray Inventory Management System - Backend

A comprehensive Python + MySQL backend system for managing drill core tray dispatches and returns in mining operations.

## Features

### Core Functionality
- **RESTful API** built with FastAPI
- **MySQL Database** with SQLAlchemy ORM
- **JWT Authentication** with role-based access control
- **Comprehensive CRUD Operations** for all entities
- **Advanced Reporting** and analytics
- **Audit Logging** for all data modifications
- **Data Export** to CSV format

### Security
- Password hashing with bcrypt
- JWT token-based authentication
- Role-based authorization (Admin, Manager, Operator)
- CORS configuration for frontend integration
- Secure session management

### Database Features
- Relational data model with foreign key constraints
- Automatic timestamps (created_at, updated_at)
- Transaction management
- Connection pooling
- Database migrations support

## Technology Stack

- **Framework**: FastAPI 0.104.1
- **Database**: MySQL 8.0+
- **ORM**: SQLAlchemy 2.0
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)
- **Validation**: Pydantic 2.5
- **Server**: Uvicorn
- **Containerization**: Docker & Docker Compose

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration management
│   ├── database.py             # Database connection
│   │
│   ├── models/                 # SQLAlchemy models
│   │   ├── company.py
│   │   ├── project.py
│   │   ├── drillhole.py
│   │   ├── dispatch.py
│   │   ├── sample.py
│   │   ├── inventory.py
│   │   ├── user.py
│   │   └── audit_log.py
│   │
│   ├── schemas/                # Pydantic schemas
│   │   ├── company.py
│   │   ├── dispatch.py
│   │   └── auth.py
│   │
│   ├── api/                    # API routes
│   │   ├── deps.py             # Dependencies
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── companies.py
│   │       ├── dispatches.py
│   │       └── reports.py
│   │
│   └── utils/                  # Utilities
│       ├── security.py
│       └── helpers.py
│
├── scripts/
│   ├── init_db.py              # Database initialization
│   └── seed_data.py            # Seed initial data
│
├── docs/
│   ├── architecture.md
│   ├── database_schema.md
│   └── api_documentation.md
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── README.md
```

## Installation

### Prerequisites
- Python 3.11+
- MySQL 8.0+
- pip

### Option 1: Local Installation

1. **Clone the repository**
```bash
git clone https://github.com/Blessman-Newton/Core-processing.git
cd Core-processing/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials and settings
```

5. **Create MySQL database**
```sql
CREATE DATABASE tray_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. **Initialize database**
```bash
python scripts/init_db.py
python scripts/seed_data.py
```

7. **Run the application**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Option 2: Docker Installation

1. **Clone the repository**
```bash
git clone https://github.com/Blessman-Newton/Core-processing.git
cd Core-processing/backend
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Start services**
```bash
docker-compose up -d
```

The backend will be available at `http://localhost:8000`

## API Documentation

### Interactive Documentation
Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Authentication

All endpoints (except `/api/v1/auth/login` and `/api/v1/auth/register`) require authentication.

**Login to get tokens:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Use the access token in requests:**
```bash
curl -X GET "http://localhost:8000/api/v1/dispatches" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Main Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

#### Companies
- `GET /api/v1/companies` - List companies
- `POST /api/v1/companies` - Create company
- `GET /api/v1/companies/{id}` - Get company
- `PUT /api/v1/companies/{id}` - Update company
- `DELETE /api/v1/companies/{id}` - Delete company

#### Dispatches
- `GET /api/v1/dispatches` - List dispatches
- `POST /api/v1/dispatches` - Create dispatch
- `GET /api/v1/dispatches/{id}` - Get dispatch
- `PUT /api/v1/dispatches/{id}` - Update dispatch
- `POST /api/v1/dispatches/{id}/return` - Process return
- `GET /api/v1/dispatches/outstanding` - Get outstanding dispatches

#### Reports
- `GET /api/v1/reports/dashboard` - Dashboard statistics
- `GET /api/v1/reports/reconciliation` - Reconciliation report
- `GET /api/v1/reports/analytics` - Analytics data
- `GET /api/v1/reports/export` - Export to CSV

## Database Schema

### Main Tables
- **companies** - Mining companies
- **projects** - Mining projects
- **drillholes** - Drillhole information
- **dispatches** - Tray dispatches and returns
- **samples** - Sample information
- **inventory** - Base inventory levels
- **users** - User accounts
- **audit_logs** - Audit trail

See [database_schema.md](docs/database_schema.md) for detailed schema documentation.

## Default Credentials

**Admin User:**
- Username: `admin`
- Password: `admin123`

## Default Data

### Companies
1. MineCore Ltd
2. GoldTech Mining
3. Diamond Exploration Co
4. African Minerals Group
5. Volta Resources
6. Ashanti Gold Corp
7. West African Mining
8. Precious Metals Inc

### Inventory
- HQ Boxes: 100
- NQ Boxes: 100

## Configuration

### Environment Variables

Key configuration options in `.env`:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=3308
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=tray_inventory

# Security
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

## Development

### Running Tests
```bash
pytest
```

### Code Style
```bash
# Format code
black app/

# Lint code
flake8 app/
```

### Database Migrations

Using Alembic for database migrations:

```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Deployment

### Production Checklist
- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Change default admin password
- [ ] Set `DEBUG=False`
- [ ] Configure proper CORS origins
- [ ] Use strong database password
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up backup strategy
- [ ] Configure logging and monitoring

### Docker Production Deployment

```bash
# Build production image
docker build -t tray-inventory-backend:latest .

# Run with production settings
docker-compose -f docker-compose.prod.yml up -d
```

## API Usage Examples

### Create a Dispatch
```python
import requests

url = "http://localhost:8000/api/v1/dispatches"
headers = {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json"
}
data = {
    "project_id": 1,
    "drillhole_id": 1,
    "company_id": 1,
    "hq_boxes": 10,
    "nq_boxes": 5,
    "driver": "John Doe",
    "technician": "Jane Smith",
    "samples_collected": 50,
    "sample_type": "core"
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

### Process a Return
```python
url = "http://localhost:8000/api/v1/dispatches/1/return"
data = {
    "returned_hq": 10,
    "returned_nq": 5,
    "return_condition": "Good",
    "return_notes": "All boxes returned in good condition"
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

### Get Dashboard Statistics
```python
url = "http://localhost:8000/api/v1/reports/dashboard"
response = requests.get(url, headers=headers)
print(response.json())
```

## Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u root -p -h localhost
```

### Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 PID
```

### Docker Issues
```bash
# View logs
docker-compose logs -f backend

# Restart services
docker-compose restart

# Rebuild
docker-compose up -d --build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

This project is part of the Tray Inventory Management System.

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@trayinventory.com

## Version History

- **1.0.0** (2025-10-20) - Initial release
  - Complete backend system
  - Authentication and authorization
  - CRUD operations for all entities
  - Reporting and analytics
  - Docker support

---

**Built with ❤️ for efficient drill core tray inventory management**

