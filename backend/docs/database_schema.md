# Database Schema Design

## Overview

This document outlines the MySQL database schema for the Tray Inventory Management System backend.

## Tables

### 1. companies

Stores information about mining companies.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Company name |
| contact_email | VARCHAR(255) | NULL | Contact email |
| contact_phone | VARCHAR(50) | NULL | Contact phone |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

### 2. projects

Stores project information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| project_id | VARCHAR(100) | NOT NULL, UNIQUE | Project identifier |
| name | VARCHAR(255) | NOT NULL | Project name |
| company_id | INT | FOREIGN KEY (companies.id) | Associated company |
| location | VARCHAR(255) | NULL | Project location |
| status | ENUM('active', 'inactive', 'completed') | DEFAULT 'active' | Project status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

### 3. drillholes

Stores drillhole information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| drillhole_id | VARCHAR(100) | NOT NULL | Drillhole identifier |
| project_id | INT | FOREIGN KEY (projects.id) | Associated project |
| depth | DECIMAL(10,2) | NULL | Drillhole depth in meters |
| status | ENUM('active', 'completed', 'abandoned') | DEFAULT 'active' | Drillhole status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

### 4. dispatches

Main table for tracking tray dispatches.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| project_id | INT | FOREIGN KEY (projects.id) | Associated project |
| drillhole_id | INT | FOREIGN KEY (drillholes.id) | Associated drillhole |
| company_id | INT | FOREIGN KEY (companies.id) | Associated company |
| dispatch_date | DATETIME | NOT NULL | Date and time of dispatch |
| hq_boxes | INT | NOT NULL, DEFAULT 0 | Number of HQ boxes dispatched |
| nq_boxes | INT | NOT NULL, DEFAULT 0 | Number of NQ boxes dispatched |
| driver | VARCHAR(255) | NOT NULL | Driver name |
| technician | VARCHAR(255) | NOT NULL | Technician name |
| samples_collected | INT | DEFAULT 0 | Number of samples collected |
| sample_type | VARCHAR(100) | NULL | Type of samples |
| status | ENUM('outstanding', 'returned') | DEFAULT 'outstanding' | Dispatch status |
| return_date | DATETIME | NULL | Date and time of return |
| returned_hq | INT | NULL | Number of HQ boxes returned |
| returned_nq | INT | NULL | Number of NQ boxes returned |
| return_condition | VARCHAR(50) | NULL | Condition upon return |
| return_notes | TEXT | NULL | Notes about the return |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

### 5. samples

Stores detailed sample information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| dispatch_id | INT | FOREIGN KEY (dispatches.id) | Associated dispatch |
| sample_id | VARCHAR(100) | NOT NULL, UNIQUE | Sample identifier |
| sample_type | ENUM('core', 'assay', 'geochemical', 'mineralogy') | NOT NULL | Type of sample |
| from_depth | DECIMAL(10,2) | NULL | Starting depth |
| to_depth | DECIMAL(10,2) | NULL | Ending depth |
| status | ENUM('collected', 'processing', 'completed') | DEFAULT 'collected' | Sample status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

### 6. inventory

Tracks base inventory levels.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| box_type | ENUM('hq', 'nq') | NOT NULL, UNIQUE | Type of box |
| base_quantity | INT | NOT NULL, DEFAULT 0 | Base inventory quantity |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

### 7. users

Stores user authentication and profile information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| username | VARCHAR(100) | NOT NULL, UNIQUE | Username |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| full_name | VARCHAR(255) | NULL | Full name |
| role | ENUM('admin', 'manager', 'operator') | DEFAULT 'operator' | User role |
| is_active | BOOLEAN | DEFAULT TRUE | Account active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

### 8. audit_logs

Tracks all changes for auditing purposes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| user_id | INT | FOREIGN KEY (users.id) | User who made the change |
| table_name | VARCHAR(100) | NOT NULL | Table affected |
| record_id | INT | NOT NULL | ID of affected record |
| action | ENUM('create', 'update', 'delete') | NOT NULL | Type of action |
| old_values | JSON | NULL | Previous values |
| new_values | JSON | NULL | New values |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp of action |

## Indexes

### Performance Optimization Indexes

- **dispatches**: 
  - `idx_dispatch_date` on `dispatch_date`
  - `idx_status` on `status`
  - `idx_company_id` on `company_id`
  - `idx_project_id` on `project_id`

- **samples**: 
  - `idx_dispatch_id` on `dispatch_id`
  - `idx_sample_type` on `sample_type`

- **drillholes**: 
  - `idx_project_id` on `project_id`
  - `idx_drillhole_id` on `drillhole_id`

- **audit_logs**: 
  - `idx_user_id` on `user_id`
  - `idx_created_at` on `created_at`

## Relationships

```
companies (1) ----< (N) projects
companies (1) ----< (N) dispatches
projects (1) ----< (N) drillholes
projects (1) ----< (N) dispatches
drillholes (1) ----< (N) dispatches
dispatches (1) ----< (N) samples
users (1) ----< (N) audit_logs
```

## Initial Data

### Default Companies

1. MineCore Ltd
2. GoldTech Mining
3. Diamond Exploration Co
4. African Minerals Group
5. Volta Resources
6. Ashanti Gold Corp
7. West African Mining
8. Precious Metals Inc

### Default Inventory

- HQ Boxes: 100
- NQ Boxes: 100

