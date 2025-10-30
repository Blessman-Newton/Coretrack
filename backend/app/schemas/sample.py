"""
Sample schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.sample import SampleType, SampleStatus


class SampleBase(BaseModel):
    """Base sample schema"""
    dispatch_id: int
    sample_id: str
    sample_type: SampleType
    from_depth: Optional[Decimal] = None
    to_depth: Optional[Decimal] = None
    status: SampleStatus = SampleStatus.COLLECTED


class SampleCreate(SampleBase):
    """Schema for creating a sample"""
    pass


class SampleUpdate(BaseModel):
    """Schema for updating a sample"""
    sample_type: Optional[SampleType] = None
    from_depth: Optional[Decimal] = None
    to_depth: Optional[Decimal] = None
    status: Optional[SampleStatus] = None


class SampleResponse(SampleBase):
    """Schema for sample response"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
