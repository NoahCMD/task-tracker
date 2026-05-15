from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

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


@app.get("/")
def root():
    return {"message": "Task Tracker API is running"}


@app.get("/tasks")
def get_tasks():

    db: Session = SessionLocal()

    tasks = db.query(Task).all()

    return tasks


@app.post("/tasks")
def create_task(title: str):

    db: Session = SessionLocal()

    new_task = Task(
        title=title
    )

    db.add(new_task)

    db.commit()

    db.refresh(new_task)

    return new_task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):

    db: Session = SessionLocal()

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    db.delete(task)

    db.commit()

    return {"message": "Task deleted successfully"}


@app.put("/tasks/{task_id}")
def update_task(task_id: int, completed: bool):

    db: Session = SessionLocal()

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    task.completed = completed

    db.commit()

    db.refresh(task)

    return task