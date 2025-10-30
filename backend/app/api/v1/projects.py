"""
Projects API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.project import Project, ProjectStatus
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectWithDetails,
)
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[ProjectResponse])
def list_projects(
    skip: int = 0,
    limit: int = 100,
    company_id: int = None,
    status_filter: ProjectStatus = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all projects with optional filtering
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        company_id: Filter by company ID
        status_filter: Filter by project status
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of projects
    """
    query = db.query(Project)
    
    if company_id:
        query = query.filter(Project.company_id == company_id)
    
    if status_filter:
        query = query.filter(Project.status == status_filter)
    
    projects = query.order_by(Project.created_at.desc()).offset(skip).limit(limit).all()
    
    return projects


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new project
    
    Args:
        project_data: Project data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Created project
        
    Raises:
        HTTPException: If project_id already exists
    """
    # Check if project_id already exists
    if db.query(Project).filter(Project.project_id == project_data.project_id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project ID already exists"
        )
    
    project_dict = project_data.model_dump()
    
    project = Project(**project_dict)
    db.add(project)
    db.commit()
    db.refresh(project)
    
    return project


@router.get("/{project_id}", response_model=ProjectWithDetails)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get project by ID with details
    
    Args:
        project_id: Project ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Project data with details
        
    Raises:
        HTTPException: If project not found
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Enrich with details
    project_dict = ProjectResponse.from_orm(project).model_dump()
    project_dict["company_name"] = project.company.name if project.company else None
    project_dict["drillhole_count"] = len(project.drillholes)
    project_dict["dispatch_count"] = len(project.dispatches)
    
    return ProjectWithDetails(**project_dict)


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update project
    
    Args:
        project_id: Project ID
        project_data: Updated project data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Updated project
        
    Raises:
        HTTPException: If project not found
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Update fields
    update_data = project_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete project
    
    Args:
        project_id: Project ID
        db: Database session
        current_user: Current authenticated user
        
    Raises:
        HTTPException: If project not found
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db.delete(project)
    db.commit()
