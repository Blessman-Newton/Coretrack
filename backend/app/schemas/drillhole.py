"""
Drillhole schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.drillhole import DrillholeStatus


class DrillholeBase(BaseModel):
    """Base drillhole schema"""
    drillhole_id: str
    project_id: int
    depth: Optional[Decimal] = None
    status: DrillholeStatus = DrillholeStatus.ACTIVE


class DrillholeCreate(DrillholeBase):
    """Schema for creating a drillhole"""
    pass


class DrillholeUpdate(BaseModel):
    """Schema for updating a drillhole"""
    drillhole_id: Optional[str] = None
    depth: Optional[Decimal] = None
    status: Optional[DrillholeStatus] = None


class DrillholeResponse(DrillholeBase):
    """Schema for drillhole response"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DrillholeWithDetails(DrillholeResponse):
    """Schema for drillhole with related details"""
    project_name: Optional[str] = None
    project_project_id: Optional[str] = None
    dispatch_count: int = 0
