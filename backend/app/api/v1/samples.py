"""
Samples API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.sample import Sample, SampleType, SampleStatus
from app.models.user import User
from app.schemas.sample import (
    SampleCreate,
    SampleUpdate,
    SampleResponse,
)
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[SampleResponse])
def list_samples(
    skip: int = 0,
    limit: int = 100,
    dispatch_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all samples with optional filtering
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        dispatch_id: Filter by dispatch ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of samples
    """
    query = db.query(Sample)
    
    if dispatch_id:
        query = query.filter(Sample.dispatch_id == dispatch_id)
    
    samples = query.order_by(Sample.created_at.desc()).offset(skip).limit(limit).all()
    
    return samples


@router.post("/", response_model=SampleResponse, status_code=status.HTTP_201_CREATED)
def create_sample(
    sample_data: SampleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new sample
    
    Args:
        sample_data: Sample data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Created sample
    """
    sample_dict = sample_data.model_dump()
    
    sample = Sample(**sample_dict)
    db.add(sample)
    db.commit()
    db.refresh(sample)
    
    return sample


@router.get("/{sample_id}", response_model=SampleResponse)
def get_sample(
    sample_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get sample by ID
    
    Args:
        sample_id: Sample ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Sample data
        
    Raises:
        HTTPException: If sample not found
    """
    sample = db.query(Sample).filter(Sample.id == sample_id).first()
    if not sample:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sample not found"
        )
    
    return sample


@router.put("/{sample_id}", response_model=SampleResponse)
def update_sample(
    sample_id: int,
    sample_data: SampleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update sample
    
    Args:
        sample_id: Sample ID
        sample_data: Updated sample data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Updated sample
        
    Raises:
        HTTPException: If sample not found
    """
    sample = db.query(Sample).filter(Sample.id == sample_id).first()
    if not sample:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sample not found"
        )
    
    # Update fields
    update_data = sample_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(sample, field, value)
    
    db.commit()
    db.refresh(sample)
    
    return sample


@router.delete("/{sample_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sample(
    sample_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete sample
    
    Args:
        sample_id: Sample ID
        db: Database session
        current_user: Current authenticated user
        
    Raises:
        HTTPException: If sample not found
    """
    sample = db.query(Sample).filter(Sample.id == sample_id).first()
    if not sample:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sample not found"
        )
    
    db.delete(sample)
    db.commit()
