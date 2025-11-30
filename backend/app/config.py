from pydantic_settings import BaseSettings
from typing import List, Union
import os
import json

class Settings(BaseSettings):
    """Application settings"""

    # Application
    APP_NAME: str = "Tray Inventory Management System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # API
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_HOST: str = "core-processing-blessmannewton0-9ae7.i.aivencloud.com"
    DATABASE_PORT: int = 23415
 

    DATABASE_USER: str = os.getenv("DATABASE_USER", "avnadmin")
    DATABASE_PASSWORD: str = os.getenv("DATABASE_PASSWORD", "defaultpassword")
    DATABASE_NAME: str = "defaultdb"
    DATABASE_DRIVER: str = "pymysql"
    DATABASE_SSL_MODE: str = "REQUIRED"
    DATABASE_URL: str | None = None


# Database connection pool
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_RECYCLE: int = 3600
    DB_POOL_PRE_PING: bool = True


 # Security / JWT
    SECRET_KEY: str = "RJ-hGtJpimsdF503yZ2y6TT9SKAVkC3YsvKpXG3cHPKUtMLcXUhIeptrv5Z0FXc5duadEe4tqpXlDNn4ci3zBg"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://corepro.netlify.app",
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    CORS_EXPOSE_HEADERS: List[str] = ["*"]

    # Logging
    LOG_LEVEL: str = "INFO"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Handle CORS_ORIGINS from environment variable (might be a JSON string)
        cors_env = os.getenv("CORS_ORIGINS")
        if cors_env:
            try:
                # Try to parse as JSON array
                parsed = json.loads(cors_env)
                if isinstance(parsed, list):
                    # Add netlify if not already present
                    if "https://corepro.netlify.app" not in parsed:
                        parsed.append("https://corepro.netlify.app")
                    self.CORS_ORIGINS = parsed
            except json.JSONDecodeError:
                # If not JSON, treat as comma-separated string
                origins = [origin.strip() for origin in cors_env.split(",")]
                if "https://corepro.netlify.app" not in origins:
                    origins.append("https://corepro.netlify.app")
                self.CORS_ORIGINS = origins

    @property
    def database_url(self) -> str:
        """Construct database URL"""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        driver = self.DATABASE_DRIVER.strip()
        base = f"mysql+{driver}://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        if driver == "mysqlconnector" and self.DATABASE_SSL_MODE.upper() != "DISABLED":
            return base + f"?ssl-mode={self.DATABASE_SSL_MODE.upper()}"
        return base

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
