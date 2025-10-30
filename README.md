# Tray Inventory Management System

A comprehensive full-stack system for tracking and managing drill core tray dispatches and returns in mining operations.

## 🏗️ Architecture

This is a **monorepo** containing both frontend and backend:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Python + FastAPI + MySQL + SQLAlchemy

```
Core-processing/
├── src/                    # React Frontend
├── backend/                # Python Backend API
├── package.json            # Frontend dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

**Frontend:**
- Node.js 18+ and npm
- Modern web browser

**Backend:**
- Python 3.11+
- MySQL 8.0+

### 1. Start the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# Create database
mysql -u root -p
CREATE DATABASE tray_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Initialize database
python scripts/init_db.py
python scripts/seed_data.py

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run at: **http://localhost:8000**
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 2. Start the Frontend

```bash
# In a new terminal, from project root
npm install

# Configure environment
cp .env.example .env
# Default API URL is http://localhost:8000/api/v1

# Start development server
npm run dev
```

Frontend will run at: **http://localhost:5173**

### 3. Login

Default credentials:
- **Username**: `admin`
- **Password**: `admin123`

## 📋 Features

### Frontend (React)
- **Real-time Statistics**
  - Available inventory (HQ/NQ boxes)
  - Outstanding dispatches count
  - Completed returns with match rate
  - Total samples collected
- **Recent Activity Table**
  - Last 5 dispatches
  - Status tracking
  - Days out calculation

### 📤 Dispatch Management
- Create new tray dispatches
- Track HQ and NQ box counts
- Record driver and technician information
- Sample collection tracking with types:
  - Core samples
  - Assay samples
  - Geochemical samples
  - Mineralogy samples
- Company selection from predefined list

### 📥 Return Processing
- Select outstanding dispatches
- Record actual returned quantities
- Mismatch detection system
  - Automatic comparison of expected vs returned
  - Detailed difference breakdown
  - Confirmation dialog for discrepancies
- Condition assessment (Good/Fair/Damaged)
- Return notes for documentation

### 🔄 Reconciliation
- **Inventory Overview**
  - Base inventory display
  - Currently out tracking
  - Available inventory calculation
- **Outstanding Dispatches Table**
  - Color-coded by days out:
    - ✅ Green: 0-3 days
    - ⚠️ Yellow: 4-7 days
    - 🔴 Red: 8+ days
  - Full dispatch details
- **Discrepancy Report**
  - Automatic identification of mismatches
  - HQ and NQ differences highlighted
  - Associated notes for investigation

### 📈 Reports & Analytics
- **Export Functionality**
  - CSV export of all dispatch data
  - Comprehensive field coverage
  - Timestamped file naming
- **Summary Statistics**
  - Total dispatches
  - Completed returns
  - Outstanding count
  - Overall match rate
- **Complete Dispatch History**
  - Full table with all records
  - Status indicators
  - Match status icons
- **Analytics Breakdowns**
  - Dispatches by company
  - Sample counts by company
  - Sample types analysis
  - Dispatch counts by sample type

## Companies Supported
- MineCore Ltd
- GoldTech Mining
- Diamond Exploration Co
- African Minerals Group
- Volta Resources
- Ashanti Gold Corp
- West African Mining
- Precious Metals Inc

## Technical Details

### State Management
- React hooks (useState, useMemo)
- Real-time calculations
- Persistent form state

### Data Tracking
Each dispatch includes:
- Unique ID
- Drillhole identification
- Company assignment
- Dispatch and return dates
- HQ/NQ box counts
- Driver and technician names
- Sample information
- Status (outstanding/returned)
- Return details and condition
- Notes

### Calculations
- **Available Inventory**: Base inventory - Outstanding totals
- **Match Rate**: (Perfect matches / Total returns) × 100
- **Days Out**: Current date - Dispatch date
- **Discrepancies**: Dispatched quantity - Returned quantity

## User Interface
- Clean, modern design with Tailwind CSS
- Responsive layout (mobile-friendly)
- Color-coded status indicators
- Interactive forms with validation
- Modal dialogs for critical actions
- Icon integration (Lucide React)

## Getting Started

### Prerequisites
```json
{
  "react": "^18.x",
  "lucide-react": "latest",
  "tailwindcss": "^3.x"
}
```

### Installation
```bash
npm install react lucide-react
npm install -D tailwindcss
```

### Usage
```jsx
import TrayInventorySystem from './tray_inventory_system';

function App() {
  return <TrayInventorySystem />;
}
```

## File Structure
```
d:\Projects\Claude\
├── tray_inventory_system.tsx  # Main component (979 lines)
├── index.tsx                   # Alternative/backup version
└── README.md                   # This file
```

## Future Enhancements
- [ ] Backend integration (API/Database)
- [ ] User authentication
- [ ] Multi-user support
- [ ] Print functionality
- [ ] Advanced filtering and search
- [ ] Date range reports
- [ ] Email notifications for long outstanding
- [ ] Barcode scanning integration
- [ ] Photo upload for damaged trays
- [ ] Historical trend analysis

## Version
**Current**: 1.0.0 (Complete)  
**Date**: October 17, 2025

---

Built for efficient drill core tray inventory management in mining operations. 🏗️⛏️
