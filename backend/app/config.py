from pydantic_settings import BaseSettings
from typing import List

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
    import os

    DATABASE_USER: str = os.getenv("DATABASE_USER", "avnadmin")
    DATABASE_PASSWORD: str = os.getenv("DATABASE_PASSWORD", "defaultpassword")
    DATABASE_NAME: str = "defaultdb"
    DATABASE_DRIVER: str = "pymysql"
    DATABASE_SSL_MODE: str = "REQUIRED"
    DATABASE_URL: str | None = None

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://corepro.netlify.app",  # add your deployed frontend
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]

    # Logging
    LOG_LEVEL: str = "INFO"

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
