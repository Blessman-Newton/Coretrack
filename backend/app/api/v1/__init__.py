"""
API v1 routes
"""
from fastapi import APIRouter
from app.api.v1 import auth, companies, dispatches, reports, samples, users, projects, drillholes

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
api_router.include_router(dispatches.router, prefix="/dispatches", tags=["Dispatches"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(samples.router, prefix="/samples", tags=["Samples"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(drillholes.router, prefix="/drillholes", tags=["Drillholes"])

