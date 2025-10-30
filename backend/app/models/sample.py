"""
Sample model
"""
from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, Enum, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class SampleType(str, enum.Enum):
    """Sample type enumeration"""
    CORE = "core"
    ASSAY = "assay"
    GEOCHEMICAL = "geochemical"
    MINERALOGY = "mineralogy"


class SampleStatus(str, enum.Enum):
    """Sample status enumeration"""
    COLLECTED = "collected"
    PROCESSING = "processing"
    COMPLETED = "completed"


class Sample(Base):
    """Sample model"""
    
    __tablename__ = "samples"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    dispatch_id = Column(Integer, ForeignKey("dispatches.id", ondelete="CASCADE"), nullable=False, index=True)
    sample_id = Column(String(100), unique=True, nullable=False, index=True)
    sample_type = Column(Enum(SampleType), nullable=False, index=True)
    from_depth = Column(DECIMAL(10, 2), nullable=True)
    to_depth = Column(DECIMAL(10, 2), nullable=True)
    status = Column(Enum(SampleStatus), default=SampleStatus.COLLECTED, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False
    )
    
    # Relationships
    dispatch = relationship("Dispatch", back_populates="samples")

