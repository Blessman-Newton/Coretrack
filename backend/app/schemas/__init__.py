"""
Pydantic schemas for request/response validation
"""
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse
from app.schemas.dispatch import (
    DispatchCreate,
    DispatchUpdate,
    DispatchReturn,
    DispatchResponse,
    DispatchWithDetails,
)
from app.schemas.auth import (
    UserLogin,
    UserRegister,
    TokenResponse,
    TokenRefresh,
    UserResponse,
)
from app.schemas.sample import (
    SampleCreate,
    SampleUpdate,
    SampleResponse,
)
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserResponse as UserDetailResponse,
)
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectWithDetails,
)
from app.schemas.drillhole import (
    DrillholeCreate,
    DrillholeUpdate,
    DrillholeResponse,
    DrillholeWithDetails,
)

__all__ = [
    "CompanyCreate",
    "CompanyUpdate",
    "CompanyResponse",
    "DispatchCreate",
    "DispatchUpdate",
    "DispatchReturn",
    "DispatchResponse",
    "DispatchWithDetails",
    "UserLogin",
    "UserRegister",
    "TokenResponse",
    "TokenRefresh",
    "UserResponse",
    "SampleCreate",
    "SampleUpdate",
    "SampleResponse",
    "UserCreate",
    "UserUpdate",
    "UserDetailResponse",
    "ProjectCreate",
    "ProjectUpdate",
    "ProjectResponse",
    "ProjectWithDetails",
    "DrillholeCreate",
    "DrillholeUpdate",
    "DrillholeResponse",
    "DrillholeWithDetails",
]

