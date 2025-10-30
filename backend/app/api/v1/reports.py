"""
Reports and analytics API routes
"""
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.dispatch import Dispatch, DispatchStatus
from app.models.inventory import Inventory, BoxType
from app.models.user import User
from app.api.deps import get_current_user
from app.utils.helpers import calculate_match_rate, export_to_csv, calculate_days_out

router = APIRouter()


@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get dashboard statistics
    
    Args:
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Dashboard statistics
    """
    # Get inventory
    hq_inventory = db.query(Inventory).filter(Inventory.box_type == BoxType.HQ).first()
    nq_inventory = db.query(Inventory).filter(Inventory.box_type == BoxType.NQ).first()
    
    base_hq = hq_inventory.base_quantity if hq_inventory else 0
    base_nq = nq_inventory.base_quantity if nq_inventory else 0
    
    # Outstanding dispatches
    outstanding = db.query(Dispatch).filter(
        Dispatch.status == DispatchStatus.OUTSTANDING
    ).all()
    
    outstanding_hq = sum(d.hq_boxes for d in outstanding)
    outstanding_nq = sum(d.nq_boxes for d in outstanding)
    outstanding_samples = sum(d.samples_collected for d in outstanding)
    
    # Returned dispatches
    returned = db.query(Dispatch).filter(
        Dispatch.status == DispatchStatus.RETURNED
    ).all()
    
    returned_hq = sum(d.returned_hq for d in returned if d.returned_hq)
    returned_nq = sum(d.returned_nq for d in returned if d.returned_nq)
    
    # Calculate matches
    perfect_matches = sum(
        1 for d in returned
        if d.returned_hq == d.hq_boxes and d.returned_nq == d.nq_boxes
    )
    
    match_rate = calculate_match_rate(len(returned), perfect_matches)
    
    # Total samples
    total_samples = db.query(func.sum(Dispatch.samples_collected)).scalar() or 0
    
    return {
        "inventory": {
            "base": {"hq": base_hq, "nq": base_nq},
            "outstanding": {"hq": outstanding_hq, "nq": outstanding_nq},
            "available": {
                "hq": base_hq - outstanding_hq,
                "nq": base_nq - outstanding_nq
            }
        },
        "dispatches": {
            "total": len(outstanding) + len(returned),
            "outstanding": len(outstanding),
            "returned": len(returned),
            "match_rate": match_rate
        },
        "samples": {
            "total": total_samples,
            "outstanding": outstanding_samples
        }
    }


@router.get("/reconciliation")
def get_reconciliation_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get reconciliation report
    
    Args:
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Reconciliation report with discrepancies
    """
    # Get outstanding dispatches
    outstanding = db.query(Dispatch).filter(
        Dispatch.status == DispatchStatus.OUTSTANDING
    ).order_by(Dispatch.dispatch_date.asc()).all()
    
    outstanding_list = []
    for dispatch in outstanding:
        days_out = calculate_days_out(dispatch.dispatch_date, None)
        outstanding_list.append({
            "id": dispatch.id,
            "project": dispatch.project.name if dispatch.project else None,
            "drillhole": dispatch.drillhole.drillhole_id if dispatch.drillhole else None,
            "company": dispatch.company.name if dispatch.company else None,
            "dispatch_date": dispatch.dispatch_date.isoformat(),
            "hq_boxes": dispatch.hq_boxes,
            "nq_boxes": dispatch.nq_boxes,
            "days_out": days_out,
            "driver": dispatch.driver,
            "technician": dispatch.technician
        })
    
    # Get discrepancies
    returned = db.query(Dispatch).filter(
        Dispatch.status == DispatchStatus.RETURNED
    ).all()
    
    discrepancies = []
    for dispatch in returned:
        hq_diff = (dispatch.returned_hq or 0) - dispatch.hq_boxes
        nq_diff = (dispatch.returned_nq or 0) - dispatch.nq_boxes
        
        if hq_diff != 0 or nq_diff != 0:
            discrepancies.append({
                "id": dispatch.id,
                "project": dispatch.project.name if dispatch.project else None,
                "drillhole": dispatch.drillhole.drillhole_id if dispatch.drillhole else None,
                "company": dispatch.company.name if dispatch.company else None,
                "dispatch_date": dispatch.dispatch_date.isoformat(),
                "return_date": dispatch.return_date.isoformat() if dispatch.return_date else None,
                "hq_dispatched": dispatch.hq_boxes,
                "hq_returned": dispatch.returned_hq,
                "hq_difference": hq_diff,
                "nq_dispatched": dispatch.nq_boxes,
                "nq_returned": dispatch.returned_nq,
                "nq_difference": nq_diff,
                "notes": dispatch.return_notes
            })
    
    return {
        "outstanding": outstanding_list,
        "discrepancies": discrepancies
    }


@router.get("/analytics")
def get_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get analytics data
    
    Args:
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Analytics data by company and sample type
    """
    # Dispatches by company
    company_stats = db.query(
        Dispatch.company_id,
        func.count(Dispatch.id).label("dispatch_count"),
        func.sum(Dispatch.samples_collected).label("total_samples")
    ).group_by(Dispatch.company_id).all()
    
    by_company = []
    for stat in company_stats:
        company = db.query(Dispatch).filter(Dispatch.company_id == stat.company_id).first().company
        by_company.append({
            "company": company.name if company else "Unknown",
            "dispatches": stat.dispatch_count,
            "samples": stat.total_samples or 0
        })
    
    # Dispatches by sample type
    sample_type_stats = db.query(
        Dispatch.sample_type,
        func.count(Dispatch.id).label("dispatch_count")
    ).filter(Dispatch.sample_type.isnot(None)).group_by(Dispatch.sample_type).all()
    
    by_sample_type = [
        {
            "sample_type": stat.sample_type,
            "dispatches": stat.dispatch_count
        }
        for stat in sample_type_stats
    ]
    
    return {
        "by_company": by_company,
        "by_sample_type": by_sample_type
    }


@router.get("/export")
def export_dispatches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Export all dispatches to CSV
    
    Args:
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        CSV file response
    """
    dispatches = db.query(Dispatch).order_by(Dispatch.dispatch_date.desc()).all()
    
    data = []
    for dispatch in dispatches:
        data.append({
            "ID": dispatch.id,
            "Project": dispatch.project.name if dispatch.project else "",
            "Drillhole": dispatch.drillhole.drillhole_id if dispatch.drillhole else "",
            "Company": dispatch.company.name if dispatch.company else "",
            "Dispatch Date": dispatch.dispatch_date.isoformat(),
            "HQ Boxes": dispatch.hq_boxes,
            "NQ Boxes": dispatch.nq_boxes,
            "Driver": dispatch.driver,
            "Technician": dispatch.technician,
            "Samples Collected": dispatch.samples_collected,
            "Sample Type": dispatch.sample_type or "",
            "Status": dispatch.status.value,
            "Return Date": dispatch.return_date.isoformat() if dispatch.return_date else "",
            "Returned HQ": dispatch.returned_hq or "",
            "Returned NQ": dispatch.returned_nq or "",
            "Return Condition": dispatch.return_condition or "",
            "Return Notes": dispatch.return_notes or ""
        })
    
    headers = [
        "ID", "Project", "Drillhole", "Company", "Dispatch Date",
        "HQ Boxes", "NQ Boxes", "Driver", "Technician",
        "Samples Collected", "Sample Type", "Status",
        "Return Date", "Returned HQ", "Returned NQ",
        "Return Condition", "Return Notes"
    ]
    
    csv_content = export_to_csv(data, headers)
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=dispatches_export.csv"
        }
    )

