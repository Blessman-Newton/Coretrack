"""
Database seeding script
Populates database with initial data
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal
from app.models import Company, Inventory, User
from app.models.inventory import BoxType
from app.models.user import UserRole
from app.utils.security import get_password_hash


def seed_companies(db):
    """Seed initial companies"""
    companies = [
        {"name": "MineCore Ltd", "contact_email": "contact@minecore.com"},
        {"name": "GoldTech Mining", "contact_email": "info@goldtech.com"},
        {"name": "Diamond Exploration Co", "contact_email": "contact@diamondexploration.com"},
        {"name": "African Minerals Group", "contact_email": "info@africanminerals.com"},
        {"name": "Volta Resources", "contact_email": "contact@voltaresources.com"},
        {"name": "Ashanti Gold Corp", "contact_email": "info@ashantigold.com"},
        {"name": "West African Mining", "contact_email": "contact@westafricanmining.com"},
        {"name": "Precious Metals Inc", "contact_email": "info@preciousmetals.com"},
    ]
    
    print("Seeding companies...")
    for company_data in companies:
        existing = db.query(Company).filter(Company.name == company_data["name"]).first()
        if not existing:
            company = Company(**company_data)
            db.add(company)
            print(f"  Added: {company_data['name']}")
        else:
            print(f"  Skipped (exists): {company_data['name']}")
    
    db.commit()


def seed_inventory(db):
    """Seed initial inventory"""
    inventory_data = [
        {"box_type": BoxType.HQ, "base_quantity": 100},
        {"box_type": BoxType.NQ, "base_quantity": 100},
    ]
    
    print("\nSeeding inventory...")
    for inv_data in inventory_data:
        existing = db.query(Inventory).filter(Inventory.box_type == inv_data["box_type"]).first()
        if not existing:
            inventory = Inventory(**inv_data)
            db.add(inventory)
            print(f"  Added: {inv_data['box_type'].value} - {inv_data['base_quantity']} boxes")
        else:
            print(f"  Skipped (exists): {inv_data['box_type'].value}")
    
    db.commit()


def seed_users(db):
    """Seed initial admin user"""
    print("\nSeeding users...")
    
    # Check if admin exists
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin = User(
            username="admin",
            email="admin@trayinventory.com",
            password_hash=get_password_hash("admin123"),
            full_name="System Administrator",
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(admin)
        db.commit()
        print("  Added: admin user (username: admin, password: admin123)")
        print("  IMPORTANT: Change the admin password after first login!")
    else:
        print("  Skipped (exists): admin user")


def seed_database():
    """
    Seed database with initial data
    """
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("DATABASE SEEDING")
        print("=" * 60)
        
        seed_companies(db)
        seed_inventory(db)
        seed_users(db)
        
        print("\n" + "=" * 60)
        print("Database seeding completed successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

