# """
# Main FastAPI application
# """
# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from app.config import settings
# from app.api.v1 import api_router
# from app.database import init_db
# import logging

# # Setup logger
# logger = logging.getLogger("uvicorn")
# logging.basicConfig(level=settings.LOG_LEVEL)


# # Create FastAPI application
# app = FastAPI(
#     title=settings.APP_NAME,
#     version=settings.APP_VERSION,
#     debug=settings.DEBUG,
# )

# # Allowed origins for CORS
# allowed_origins = settings.CORS_ORIGINS

# # Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=allowed_origins,
#     allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
#     allow_methods=settings.CORS_ALLOW_METHODS,
#     allow_headers=settings.CORS_ALLOW_HEADERS,
# )

# # Include API routes
# app.include_router(api_router, prefix=settings.API_V1_PREFIX)


# @app.middleware("http")
# async def log_origin(request: Request, call_next):
#     """
#     Log the origin of incoming requests for debugging CORS
#     """
#     origin = request.headers.get("origin")
#     if origin:
#         logger.info(f"Incoming request from origin: {origin}")
#     response = await call_next(request)
#     return response


# @app.on_event("startup")
# async def startup_event():
#     """
#     Initialize database on startup
#     """
#     logger.info("Initializing database connection...")
#     init_db()
#     logger.info("Database initialized.")


# @app.get("/")
# async def root():
#     """
#     Root endpoint
#     """
#     return {
#         "message": "Tray Inventory Management System API",
#         "version": settings.APP_VERSION,
#         "docs": "/docs",
#     }


# @app.get("/health")
# async def health_check():
#     """
#     Health check endpoint
#     """
#     return {"status": "healthy"}


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(
#         "app.main:app",
#         host="0.0.0.0",
#         port=8000,
#         reload=settings.DEBUG,
#     )

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1 import api_router
from app.database import init_db
import logging

# Logger setup
logger = logging.getLogger("uvicorn")
logging.basicConfig(level=settings.LOG_LEVEL)

# FastAPI instance
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Optional middleware to log request origins
@app.middleware("http")
async def log_origin(request: Request, call_next):
    origin = request.headers.get("origin")
    if origin:
        logger.info(f"Incoming request from origin: {origin}")
    response = await call_next(request)
    return response

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Initializing database connection...")
    init_db()
    logger.info("Database initialized.")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Tray Inventory Management System API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
