"""
Database Configuration for DigiBot

This file sets up the connection to the PostgreSQL database using SQLAlchemy.

It includes:
- DATABASE_URL: the connection string with login credentials.
- engine: the core connection to the database.
- SessionLocal: a session factory to interact with the database.
- Base: the base class for creating database models.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# PostgreSQL connection URL
DATABASE_URL = "postgresql://digibotuser:digipass123@localhost/digibotdb"

# Creates a connection engine to the database
engine = create_engine(DATABASE_URL)

# Creates a session factory to manage database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models (used for table definitions)
Base = declarative_base()
