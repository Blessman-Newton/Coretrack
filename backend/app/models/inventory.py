"""
Inventory model
"""
from sqlalchemy import Column, Integer, TIMESTAMP, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum


class BoxType(str, enum.Enum):
    """Box type enumeration"""
    HQ = "hq"
    NQ = "nq"


class Inventory(Base):
    """Inventory model"""
    
    __tablename__ = "inventory"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    box_type = Column(Enum(BoxType), unique=True, nullable=False)
    base_quantity = Column(Integer, nullable=False, default=0)
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False
    )

