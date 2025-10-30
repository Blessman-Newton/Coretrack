"""
Drillhole model
"""
from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, Enum, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class DrillholeStatus(str, enum.Enum):
    """Drillhole status enumeration"""
    ACTIVE = "active"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class Drillhole(Base):
    """Drillhole model"""
    
    __tablename__ = "drillholes"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    drillhole_id = Column(String(100), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    depth = Column(DECIMAL(10, 2), nullable=True)
    status = Column(Enum(DrillholeStatus), default=DrillholeStatus.ACTIVE, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False
    )
    
    # Relationships
    project = relationship("Project", back_populates="drillholes")
    dispatches = relationship("Dispatch", back_populates="drillhole", cascade="all, delete-orphan")

