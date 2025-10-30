"""
Dispatches API routes
"""
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database import get_db
from app.models.dispatch import Dispatch, DispatchStatus
from app.models.user import User
from app.schemas.dispatch import (
    DispatchCreate,
    DispatchUpdate,
    DispatchReturn,
    DispatchResponse,
    DispatchWithDetails,
)
from app.api.deps import get_current_user
from app.utils.helpers import calculate_days_out

router = APIRouter()


@router.get("/", response_model=List[DispatchWithDetails])
def list_dispatches(
    skip: int = 0,
    limit: int = 100,
    status_filter: DispatchStatus = None,
    company_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all dispatches with optional filtering
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        status_filter: Filter by dispatch status
        company_id: Filter by company ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of dispatches with details
    """
    query = db.query(Dispatch)
    
    if status_filter:
        query = query.filter(Dispatch.status == status_filter)
    
    if company_id:
        query = query.filter(Dispatch.company_id == company_id)
    
    dispatches = query.order_by(Dispatch.dispatch_date.desc()).offset(skip).limit(limit).all()
    
    # Enrich with additional details
    result = []
    for dispatch in dispatches:
        dispatch_dict = {
            **DispatchResponse.from_orm(dispatch).model_dump(),
            "project_name": dispatch.project.name if dispatch.project else None,
            "drillhole_name": dispatch.drillhole.drillhole_id if dispatch.drillhole else None,
            "company_name": dispatch.company.name if dispatch.company else None,
            "days_out": calculate_days_out(dispatch.dispatch_date, dispatch.return_date),
        }
        
        # Check if return matches dispatch
        if dispatch.status == DispatchStatus.RETURNED:
            is_match = (
                dispatch.returned_hq == dispatch.hq_boxes and
                dispatch.returned_nq == dispatch.nq_boxes
            )
            dispatch_dict["is_match"] = is_match
        
        result.append(DispatchWithDetails(**dispatch_dict))
    
    return result


@router.post("/", response_model=DispatchResponse, status_code=status.HTTP_201_CREATED)
def create_dispatch(
    dispatch_data: DispatchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new dispatch
    
    Args:
        dispatch_data: Dispatch data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Created dispatch
    """
    dispatch_dict = dispatch_data.model_dump()
    
    # Set dispatch date to now if not provided
    if not dispatch_dict.get("dispatch_date"):
        dispatch_dict["dispatch_date"] = datetime.utcnow()
    
    dispatch = Dispatch(**dispatch_dict)
    db.add(dispatch)
    db.commit()
    db.refresh(dispatch)
    
    return dispatch


@router.get("/outstanding", response_model=List[DispatchWithDetails])
def get_outstanding_dispatches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all outstanding dispatches
    
    Args:
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of outstanding dispatches
    """
    dispatches = db.query(Dispatch).filter(
        Dispatch.status == DispatchStatus.OUTSTANDING
    ).order_by(Dispatch.dispatch_date.asc()).all()
    
    result = []
    for dispatch in dispatches:
        dispatch_dict = {
            **DispatchResponse.from_orm(dispatch).model_dump(),
            "project_name": dispatch.project.name if dispatch.project else None,
            "drillhole_name": dispatch.drillhole.drillhole_id if dispatch.drillhole else None,
            "company_name": dispatch.company.name if dispatch.company else None,
            "days_out": calculate_days_out(dispatch.dispatch_date, None),
        }
        result.append(DispatchWithDetails(**dispatch_dict))
    
    return result


@router.get("/{dispatch_id}", response_model=DispatchResponse)
def get_dispatch(
    dispatch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get dispatch by ID
    
    Args:
        dispatch_id: Dispatch ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Dispatch data
        
    Raises:
        HTTPException: If dispatch not found
    """
    dispatch = db.query(Dispatch).filter(Dispatch.id == dispatch_id).first()
    if not dispatch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dispatch not found"
        )
    
    return dispatch


@router.put("/{dispatch_id}", response_model=DispatchResponse)
def update_dispatch(
    dispatch_id: int,
    dispatch_data: DispatchUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update dispatch
    
    Args:
        dispatch_id: Dispatch ID
        dispatch_data: Updated dispatch data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Updated dispatch
        
    Raises:
        HTTPException: If dispatch not found
    """
    dispatch = db.query(Dispatch).filter(Dispatch.id == dispatch_id).first()
    if not dispatch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dispatch not found"
        )
    
    # Update fields
    update_data = dispatch_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(dispatch, field, value)
    
    db.commit()
    db.refresh(dispatch)
    
    return dispatch


@router.post("/{dispatch_id}/return", response_model=DispatchResponse)
def process_return(
    dispatch_id: int,
    return_data: DispatchReturn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Process a dispatch return
    
    Args:
        dispatch_id: Dispatch ID
        return_data: Return data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Updated dispatch
        
    Raises:
        HTTPException: If dispatch not found or already returned
    """
    dispatch = db.query(Dispatch).filter(Dispatch.id == dispatch_id).first()
    if not dispatch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dispatch not found"
        )
    
    if dispatch.status == DispatchStatus.RETURNED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dispatch already returned"
        )
    
    # Update dispatch with return information
    dispatch.status = DispatchStatus.RETURNED
    dispatch.return_date = return_data.return_date or datetime.utcnow()
    dispatch.returned_hq = return_data.returned_hq
    dispatch.returned_nq = return_data.returned_nq
    dispatch.return_condition = return_data.return_condition
    dispatch.return_notes = return_data.return_notes
    
    db.commit()
    db.refresh(dispatch)
    
    return dispatch


@router.delete("/{dispatch_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dispatch(
    dispatch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete dispatch
    
    Args:
        dispatch_id: Dispatch ID
        db: Database session
        current_user: Current authenticated user
        
    Raises:
        HTTPException: If dispatch not found
    """
    dispatch = db.query(Dispatch).filter(Dispatch.id == dispatch_id).first()
    if not dispatch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dispatch not found"
        )
    
    db.delete(dispatch)
    db.commit()

