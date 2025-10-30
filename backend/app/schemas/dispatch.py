"""
Dispatch schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.dispatch import DispatchStatus


class DispatchBase(BaseModel):
    """Base dispatch schema"""
    project_id: int
    drillhole_id: int
    company_id: int
    hq_boxes: int = Field(ge=0)
    nq_boxes: int = Field(ge=0)
    driver: str
    technician: str
    samples_collected: int = Field(ge=0, default=0)
    sample_type: Optional[str] = None


class DispatchCreate(DispatchBase):
    """Schema for creating a dispatch"""
    dispatch_date: Optional[datetime] = None


class DispatchUpdate(BaseModel):
    """Schema for updating a dispatch"""
    hq_boxes: Optional[int] = Field(ge=0, default=None)
    nq_boxes: Optional[int] = Field(ge=0, default=None)
    driver: Optional[str] = None
    technician: Optional[str] = None
    samples_collected: Optional[int] = Field(ge=0, default=None)
    sample_type: Optional[str] = None


class DispatchReturn(BaseModel):
    """Schema for processing a return"""
    returned_hq: int = Field(ge=0)
    returned_nq: int = Field(ge=0)
    return_condition: str
    return_notes: Optional[str] = None
    return_date: Optional[datetime] = None


class DispatchResponse(DispatchBase):
    """Schema for dispatch response"""
    id: int
    dispatch_date: datetime
    status: DispatchStatus
    return_date: Optional[datetime] = None
    returned_hq: Optional[int] = None
    returned_nq: Optional[int] = None
    return_condition: Optional[str] = None
    return_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DispatchWithDetails(DispatchResponse):
    """Schema for dispatch with related details"""
    project_name: Optional[str] = None
    drillhole_name: Optional[str] = None
    company_name: Optional[str] = None
    days_out: Optional[int] = None
    is_match: Optional[bool] = None

