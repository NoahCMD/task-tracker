from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from enum import Enum

from database import SessionLocal, engine
from models import Task, TaskPriority, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskPriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TaskResponse(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime
    priority: TaskPriorityEnum
    due_date: Optional[datetime] = None  

    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    title: str
    priority: Optional[TaskPriorityEnum] = TaskPriorityEnum.MEDIUM
    due_date: Optional[datetime] = None  

class TaskUpdate(BaseModel):
    completed: bool

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Task Tracker API is running"}

@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks(status: Optional[str] = Query(None, description="Filter tasks by status: 'completed' or 'pending'"), db: Session = Depends(get_db)):
    query = db.query(Task)
    
    if status == "completed":
        query = query.filter(Task.completed == True)
    elif status == "pending":
        query = query.filter(Task.completed == False)
        
    return query.all()

@app.post("/tasks", response_model=TaskResponse)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(
        title=task_data.title,
        priority=task_data.priority,
        due_date=task_data.due_date
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = task_data.completed
    db.commit()
    db.refresh(task)
    return task