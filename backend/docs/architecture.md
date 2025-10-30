# Backend Architecture

## Technology Stack

### Core Framework
- **FastAPI**: Modern, fast web framework for building APIs with Python 3.11+
- **Python 3.11**: Programming language
- **MySQL 8.0+**: Relational database management system

### Key Libraries

#### Database & ORM
- **SQLAlchemy 2.0**: SQL toolkit and ORM
- **PyMySQL**: Pure Python MySQL driver
- **Alembic**: Database migration tool

#### Authentication & Security
- **python-jose[cryptography]**: JWT token handling
- **passlib[bcrypt]**: Password hashing
- **python-multipart**: Form data parsing

#### Validation & Serialization
- **Pydantic**: Data validation using Python type annotations
- **email-validator**: Email validation

#### CORS & Middleware
- **fastapi.middleware.cors**: Cross-Origin Resource Sharing support

#### Development & Testing
- **pytest**: Testing framework
- **pytest-asyncio**: Async test support
- **httpx**: HTTP client for testing
- **python-dotenv**: Environment variable management

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # Application entry point
│   ├── config.py                  # Configuration management
│   ├── database.py                # Database connection
│   │
│   ├── models/                    # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── company.py
│   │   ├── project.py
│   │   ├── drillhole.py
│   │   ├── dispatch.py
│   │   ├── sample.py
│   │   ├── inventory.py
│   │   ├── user.py
│   │   └── audit_log.py
│   │
│   ├── schemas/                   # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── company.py
│   │   ├── project.py
│   │   ├── drillhole.py
│   │   ├── dispatch.py
│   │   ├── sample.py
│   │   ├── inventory.py
│   │   ├── user.py
│   │   └── auth.py
│   │
│   ├── api/                       # API routes
│   │   ├── __init__.py
│   │   ├── deps.py                # Dependencies (auth, db session)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py
│   │       ├── companies.py
│   │       ├── projects.py
│   │       ├── drillholes.py
│   │       ├── dispatches.py
│   │       ├── samples.py
│   │       ├── inventory.py
│   │       ├── reports.py
│   │       └── users.py
│   │
│   ├── services/                  # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── dispatch_service.py
│   │   ├── inventory_service.py
│   │   ├── report_service.py
│   │   └── audit_service.py
│   │
│   └── utils/                     # Utility functions
│       ├── __init__.py
│       ├── security.py            # Password hashing, JWT
│       ├── validators.py          # Custom validators
│       └── helpers.py             # Helper functions
│
├── alembic/                       # Database migrations
│   ├── versions/
│   └── env.py
│
├── tests/                         # Test suite
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_dispatches.py
│   ├── test_inventory.py
│   └── test_reports.py
│
├── scripts/                       # Utility scripts
│   ├── init_db.py                 # Database initialization
│   └── seed_data.py               # Seed initial data
│
├── docs/                          # Documentation
│   ├── architecture.md
│   ├── database_schema.md
│   └── api_documentation.md
│
├── .env.example                   # Example environment variables
├── .gitignore
├── alembic.ini                    # Alembic configuration
├── requirements.txt               # Python dependencies
├── pytest.ini                     # Pytest configuration
└── README.md                      # Backend documentation
```

## Architecture Layers

### 1. API Layer (Routes)
- Handles HTTP requests and responses
- Input validation via Pydantic schemas
- Authentication and authorization checks
- Delegates business logic to service layer

### 2. Service Layer
- Contains business logic
- Orchestrates operations across multiple models
- Handles complex calculations and validations
- Manages transactions

### 3. Data Access Layer (Models)
- SQLAlchemy ORM models
- Database schema representation
- Relationships and constraints

### 4. Schema Layer (Pydantic)
- Request/response validation
- Data serialization/deserialization
- Type safety

## API Design Principles

### RESTful Endpoints

**Authentication:**
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

**Companies:**
- `GET /api/v1/companies` - List all companies
- `POST /api/v1/companies` - Create company
- `GET /api/v1/companies/{id}` - Get company details
- `PUT /api/v1/companies/{id}` - Update company
- `DELETE /api/v1/companies/{id}` - Delete company

**Projects:**
- `GET /api/v1/projects` - List all projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/{id}` - Get project details
- `PUT /api/v1/projects/{id}` - Update project
- `DELETE /api/v1/projects/{id}` - Delete project

**Drillholes:**
- `GET /api/v1/drillholes` - List all drillholes
- `POST /api/v1/drillholes` - Create drillhole
- `GET /api/v1/drillholes/{id}` - Get drillhole details
- `PUT /api/v1/drillholes/{id}` - Update drillhole

**Dispatches:**
- `GET /api/v1/dispatches` - List all dispatches
- `POST /api/v1/dispatches` - Create dispatch
- `GET /api/v1/dispatches/{id}` - Get dispatch details
- `PUT /api/v1/dispatches/{id}` - Update dispatch
- `POST /api/v1/dispatches/{id}/return` - Process return
- `GET /api/v1/dispatches/outstanding` - Get outstanding dispatches

**Samples:**
- `GET /api/v1/samples` - List all samples
- `POST /api/v1/samples` - Create sample
- `GET /api/v1/samples/{id}` - Get sample details
- `GET /api/v1/dispatches/{id}/samples` - Get samples for dispatch

**Inventory:**
- `GET /api/v1/inventory` - Get current inventory
- `PUT /api/v1/inventory` - Update base inventory
- `GET /api/v1/inventory/available` - Get available inventory

**Reports:**
- `GET /api/v1/reports/dashboard` - Dashboard statistics
- `GET /api/v1/reports/reconciliation` - Reconciliation report
- `GET /api/v1/reports/analytics` - Analytics data
- `GET /api/v1/reports/export` - Export data to CSV

**Users:**
- `GET /api/v1/users` - List all users (admin only)
- `POST /api/v1/users` - Create user (admin only)
- `GET /api/v1/users/{id}` - Get user details
- `PUT /api/v1/users/{id}` - Update user

## Security Features

### Authentication
- JWT (JSON Web Tokens) for stateless authentication
- Access tokens (short-lived, 30 minutes)
- Refresh tokens (long-lived, 7 days)

### Authorization
- Role-based access control (RBAC)
- Roles: admin, manager, operator
- Protected endpoints based on user roles

### Password Security
- Bcrypt hashing algorithm
- Salt rounds: 12
- Password strength validation

### CORS Configuration
- Configurable allowed origins
- Credentials support for authenticated requests

## Database Connection

### Connection Pooling
- Pool size: 5-20 connections
- Pool recycle: 3600 seconds
- Pool pre-ping: enabled for connection health checks

### Transaction Management
- Automatic rollback on errors
- Context managers for session handling
- Optimistic locking for concurrent updates

## Error Handling

### HTTP Status Codes
- `200 OK` - Successful GET/PUT
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Business logic conflict
- `500 Internal Server Error` - Server errors

### Error Response Format
```json
{
  "detail": "Error message",
  "error_code": "ERROR_CODE",
  "timestamp": "2025-10-20T12:00:00Z"
}
```

## Performance Optimization

### Database Optimization
- Proper indexing on frequently queried columns
- Eager loading for related entities
- Query result caching for static data

### API Optimization
- Response compression
- Pagination for list endpoints
- Field selection for large responses

## Monitoring & Logging

### Logging
- Structured logging with JSON format
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
- Request/response logging
- Error tracking with stack traces

### Audit Trail
- All data modifications logged
- User actions tracked
- Timestamp and user information recorded

## Deployment Considerations

### Environment Variables
- Database credentials
- JWT secret keys
- CORS allowed origins
- Debug mode flag

### Docker Support
- Dockerfile for containerization
- Docker Compose for multi-container setup
- Health check endpoints

### Database Migrations
- Alembic for version-controlled schema changes
- Automatic migration on deployment
- Rollback capability

