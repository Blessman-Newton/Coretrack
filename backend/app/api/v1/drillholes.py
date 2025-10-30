"""
Drillholes API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.drillhole import Drillhole, DrillholeStatus
from app.models.user import User
from app.schemas.drillhole import (
    DrillholeCreate,
    DrillholeUpdate,
    DrillholeResponse,
    DrillholeWithDetails,
)
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[DrillholeWithDetails])
def list_drillholes(
    skip: int = 0,
    limit: int = 100,
    project_id: int = None,
    status_filter: DrillholeStatus = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all drillholes with optional filtering
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        project_id: Filter by project ID
        status_filter: Filter by drillhole status
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of drillholes with details
    """
    query = db.query(Drillhole)
    
    if project_id:
        query = query.filter(Drillhole.project_id == project_id)
    
    if status_filter:
        query = query.filter(Drillhole.status == status_filter)
    
    drillholes = query.order_by(Drillhole.created_at.desc()).offset(skip).limit(limit).all()
    
    # Enrich with additional details
    result = []
    for drillhole in drillholes:
        drillhole_dict = {
            **DrillholeResponse.from_orm(drillhole).model_dump(),
            "project_name": drillhole.project.name if drillhole.project else None,
            "project_project_id": drillhole.project.project_id if drillhole.project else None,
            "dispatch_count": len(drillhole.dispatches),
        }
        result.append(DrillholeWithDetails(**drillhole_dict))
    
    return result


@router.post("/", response_model=DrillholeResponse, status_code=status.HTTP_201_CREATED)
def create_drillhole(
    drillhole_data: DrillholeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new drillhole
    
    Args:
        drillhole_data: Drillhole data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Created drillhole
    """
    drillhole_dict = drillhole_data.model_dump()
    
    drillhole = Drillhole(**drillhole_dict)
    db.add(drillhole)
    db.commit()
    db.refresh(drillhole)
    
    return drillhole


@router.get("/{drillhole_id}", response_model=DrillholeWithDetails)
def get_drillhole(
    drillhole_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get drillhole by ID with details
    
    Args:
        drillhole_id: Drillhole ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Drillhole data with details
        
    Raises:
        HTTPException: If drillhole not found
    """
    drillhole = db.query(Drillhole).filter(Drillhole.id == drillhole_id).first()
    if not drillhole:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Drillhole not found"
        )
    
    # Enrich with details
    drillhole_dict = DrillholeResponse.from_orm(drillhole).model_dump()
    drillhole_dict["project_name"] = drillhole.project.name if drillhole.project else None
    drillhole_dict["project_project_id"] = drillhole.project.project_id if drillhole.project else None
    drillhole_dict["dispatch_count"] = len(drillhole.dispatches)
    
    return DrillholeWithDetails(**drillhole_dict)


@router.put("/{drillhole_id}", response_model=DrillholeResponse)
def update_drillhole(
    drillhole_id: int,
    drillhole_data: DrillholeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update drillhole
    
    Args:
        drillhole_id: Drillhole ID
        drillhole_data: Updated drillhole data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Updated drillhole
        
    Raises:
        HTTPException: If drillhole not found
    """
    drillhole = db.query(Drillhole).filter(Drillhole.id == drillhole_id).first()
    if not drillhole:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Drillhole not found"
        )
    
    # Update fields
    update_data = drillhole_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(drillhole, field, value)
    
    db.commit()
    db.refresh(drillhole)
    
    return drillhole


@router.delete("/{drillhole_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_drillhole(
    drillhole_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete drillhole
    
    Args:
        drillhole_id: Drillhole ID
        db: Database session
        current_user: Current authenticated user
        
    Raises:
        HTTPException: If drillhole not found
    """
    drillhole = db.query(Drillhole).filter(Drillhole.id == drillhole_id).first()
    if not drillhole:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Drillhole not found"
        )
    
    db.delete(drillhole)
    db.commit()
