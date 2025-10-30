"""
Dispatch model
"""
from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, Enum, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class DispatchStatus(str, enum.Enum):
    """Dispatch status enumeration"""
    OUTSTANDING = "outstanding"
    RETURNED = "returned"


class Dispatch(Base):
    """Dispatch model"""
    
    __tablename__ = "dispatches"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    drillhole_id = Column(Integer, ForeignKey("drillholes.id", ondelete="CASCADE"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    dispatch_date = Column(DateTime, nullable=False, index=True)
    hq_boxes = Column(Integer, nullable=False, default=0)
    nq_boxes = Column(Integer, nullable=False, default=0)
    driver = Column(String(255), nullable=False)
    technician = Column(String(255), nullable=False)
    samples_collected = Column(Integer, default=0)
    sample_type = Column(String(100), nullable=True)
    status = Column(Enum(DispatchStatus), default=DispatchStatus.OUTSTANDING, nullable=False, index=True)
    return_date = Column(DateTime, nullable=True)
    returned_hq = Column(Integer, nullable=True)
    returned_nq = Column(Integer, nullable=True)
    return_condition = Column(String(50), nullable=True)
    return_notes = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False
    )
    
    # Relationships
    project = relationship("Project", back_populates="dispatches")
    drillhole = relationship("Drillhole", back_populates="dispatches")
    company = relationship("Company", back_populates="dispatches")
    samples = relationship("Sample", back_populates="dispatch", cascade="all, delete-orphan")

