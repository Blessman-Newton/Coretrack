"""
Helper utility functions
"""
from datetime import datetime
from typing import Any, Dict, List
import csv
import io


def format_datetime(dt: datetime) -> str:
    """
    Format datetime to ISO string
    
    Args:
        dt: Datetime object
        
    Returns:
        ISO formatted string
    """
    return dt.isoformat() if dt else None


def calculate_days_out(dispatch_date: datetime, return_date: datetime = None) -> int:
    """
    Calculate number of days a dispatch has been out
    
    Args:
        dispatch_date: Date of dispatch
        return_date: Date of return (None if still outstanding)
        
    Returns:
        Number of days
    """
    end_date = return_date if return_date else datetime.utcnow()
    delta = end_date - dispatch_date
    return delta.days


def export_to_csv(data: List[Dict[str, Any]], headers: List[str]) -> str:
    """
    Export data to CSV format
    
    Args:
        data: List of dictionaries containing data
        headers: List of column headers
        
    Returns:
        CSV string
    """
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=headers)
    
    writer.writeheader()
    writer.writerows(data)
    
    return output.getvalue()


def calculate_match_rate(total_returns: int, perfect_matches: int) -> float:
    """
    Calculate match rate percentage
    
    Args:
        total_returns: Total number of returns
        perfect_matches: Number of perfect matches
        
    Returns:
        Match rate as percentage
    """
    if total_returns == 0:
        return 0.0
    return round((perfect_matches / total_returns) * 100, 2)

