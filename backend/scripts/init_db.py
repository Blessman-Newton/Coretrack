"""
Database initialization script
Creates all tables in the database
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import engine, Base
from app.models import (
    Company,
    Project,
    Drillhole,
    Dispatch,
    Sample,
    Inventory,
    User,
    AuditLog,
)


def init_database():
    """
    Initialize database by creating all tables
    """
    print("Creating database tables...")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    print("Database tables created successfully!")
    print("\nCreated tables:")
    for table in Base.metadata.sorted_tables:
        print(f"  - {table.name}")


if __name__ == "__main__":
    init_database()

