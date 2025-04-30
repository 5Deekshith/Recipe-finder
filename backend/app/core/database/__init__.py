from .config import Base, engine
from app.api.models import User  # ensure model is registered

# Initialize database: create tables for all models
Base.metadata.create_all(bind=engine)
