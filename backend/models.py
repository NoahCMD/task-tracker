from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, text, Enum
from database import Base
import enum

class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

    @classmethod
    def _missing_(cls, value):
        if isinstance(value, str):
            normalized = value.upper()
            if normalized in cls._value2member_map_:
                return cls._value2member_map_[normalized]
        return super()._missing_(value)

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False)
    due_date = Column(TIMESTAMP, nullable=True)