"""
Audit Log model
"""
from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class AuditAction(str, enum.Enum):
    """Audit action enumeration"""
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"


class AuditLog(Base):
    """Audit Log model"""
    
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    table_name = Column(String(100), nullable=False)
    record_id = Column(Integer, nullable=False)
    action = Column(Enum(AuditAction), nullable=False)
    old_values = Column(JSON, nullable=True)
    new_values = Column(JSON, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")

