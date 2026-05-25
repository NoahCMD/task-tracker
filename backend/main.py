from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, date
from enum import Enum

from database import SessionLocal, engine
from models import Task, TaskPriority, Base

# Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    due_date: Optional[date] = None
    tag: Optional[str] = None
    description: Optional[str] = None
    attachments: Optional[List[dict]] = None
    comments: Optional[List[dict]] = None

    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    title: str
    priority: Optional[TaskPriorityEnum] = TaskPriorityEnum.MEDIUM
    due_date: Optional[date] = None
    tag: Optional[str] = None
    description: Optional[str] = None
    attachments: Optional[List[dict]] = None
    comments: Optional[List[dict]] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    priority: Optional[TaskPriorityEnum] = None
    due_date: Optional[date] = None
    tag: Optional[str] = None
    description: Optional[str] = None
    attachments: Optional[List[dict]] = None
    comments: Optional[List[dict]] = None
    completed: Optional[bool] = None

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
        due_date=task_data.due_date,
        tag=task_data.tag,
        description=task_data.description,
        attachments=task_data.attachments,
        comments=task_data.comments
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

    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.priority is not None:
        task.priority = task_data.priority
    if task_data.due_date is not None:
        task.due_date = task_data.due_date
    if task_data.tag is not None:
        task.tag = task_data.tag
    if task_data.attachments is not None:
        task.attachments = task_data.attachments
    if task_data.comments is not None:
        task.comments = task_data.comments
    if task_data.completed is not None:
        task.completed = task_data.completed
    db.commit()
    db.refresh(task)
    return task