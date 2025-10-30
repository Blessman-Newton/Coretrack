"""
Project schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.project import ProjectStatus


class ProjectBase(BaseModel):
    """Base project schema"""
    project_id: str
    name: str
    company_id: int
    location: Optional[str] = None
    status: ProjectStatus = ProjectStatus.ACTIVE


class ProjectCreate(ProjectBase):
    """Schema for creating a project"""
    pass


class ProjectUpdate(BaseModel):
    """Schema for updating a project"""
    name: Optional[str] = None
    location: Optional[str] = None
    status: Optional[ProjectStatus] = None


class ProjectResponse(ProjectBase):
    """Schema for project response"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProjectWithDetails(ProjectResponse):
    """Schema for project with related details"""
    company_name: Optional[str] = None
    drillhole_count: int = 0
    dispatch_count: int = 0
