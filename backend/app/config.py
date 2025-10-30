"""
Application configuration management
"""
from pydantic_settings import BaseSettings
from typing import List
import os


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
    DATABASE_USER: str = "avnadmin"
    DATABASE_PASSWORD: str = "AVNS_iWJGA8P1Bgf3Ri9_vwt"
    DATABASE_NAME: str = "defaultdb"
    DATABASE_DRIVER: str = "pymysql"  # pymysql or mysqlconnector
    DATABASE_SSL_MODE: str = "REQUIRED"  # DISABLED, REQUIRED, VERIFY_CA, VERIFY_IDENTITY
    DATABASE_URL: str | None = None
    
    # Database connection pool
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_RECYCLE: int = 3600
    DB_POOL_PRE_PING: bool = True
    
    # Security
    SECRET_KEY: str = "RJ-hGtJpimsdF503yZ2y6TT9SKAVkC3YsvKpXG3cHPKUtMLcXUhIeptrv5Z0FXc5duadEe4tqpXlDNn4ci3zBg"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Password
    PASSWORD_MIN_LENGTH: int = 8
    PASSWORD_BCRYPT_ROUNDS: int = 12
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    @property
    def database_url(self) -> str:
        """Construct database URL, prefer explicit DATABASE_URL if provided"""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        driver = self.DATABASE_DRIVER.strip()
        base = f"mysql+{driver}://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        # For mysqlconnector, include ssl-mode if required
        if driver == "mysqlconnector" and self.DATABASE_SSL_MODE.upper() != "DISABLED":
            return base + f"?ssl-mode={self.DATABASE_SSL_MODE.upper()}"
        return base
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()

