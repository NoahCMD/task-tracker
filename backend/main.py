from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

from database import SessionLocal
from models import Task

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas for Request/Response validation ---
class TaskResponse(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    title: str

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


# Enforce that this returns a List of TaskResponse objects
@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()


# Receive data via JSON Request Body instead of URL parameters
@app.post("/tasks", response_model=TaskResponse)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(title=task_data.title)
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


# Receive update data via JSON Request Body
@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = task_data.completed
    db.commit()
    db.refresh(task)
    return task