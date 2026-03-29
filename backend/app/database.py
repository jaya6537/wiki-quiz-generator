from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Get DATABASE_URL from environment (Render provides this for PostgreSQL)
# For local development, fall back to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{os.path.dirname(__file__)}/wiki_quiz.db")

# Handle PostgreSQL connection strings from Render
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite needs special connection args, PostgreSQL doesn't
# If a DATABASE_URL is provided but currently unreachable (network/DNS), we fall back to local SQLite
# to avoid hard startup failure during environment troubleshooting.
from sqlalchemy.exc import OperationalError

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    try:
        engine = create_engine(DATABASE_URL)
        # verify connection once at startup in case env var is invalid
        with engine.connect() as conn:
            pass
    except OperationalError as exc:
        print("⚠️ Could not connect to DATABASE_URL; falling back to local SQLite.")
        print(f"   DATABASE_URL={DATABASE_URL}")
        print(f"   error={exc}")
        fallback_url = f"sqlite:///{os.path.dirname(__file__)}/wiki_quiz.db"
        engine = create_engine(fallback_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()