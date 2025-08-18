from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import random
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class Topic(str, Enum):
    OSI_MODEL = "osi_model"
    SUBNETTING = "subnetting"
    ROUTING_PROTOCOLS = "routing_protocols"
    SWITCHING = "switching"
    IP_ADDRESSING = "ip_addressing"

# Models
class Question(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question_text: str
    options: List[str]
    correct_answer: int  # Index of correct answer (0-3)
    explanation: str
    topic: Topic
    difficulty_level: DifficultyLevel
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuestionCreate(BaseModel):
    question_text: str
    options: List[str]
    correct_answer: int
    explanation: str
    topic: Topic
    difficulty_level: DifficultyLevel

class QuizAttempt(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    questions: List[str]  # Question IDs
    user_answers: List[int]  # User's answer indices
    score: float
    total_questions: int
    correct_answers: int
    difficulty_level: DifficultyLevel
    topic_filter: Optional[Topic] = None
    time_taken: int  # seconds
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuizStart(BaseModel):
    difficulty_level: DifficultyLevel
    topic_filter: Optional[Topic] = None
    question_count: int = 10

class QuizSubmission(BaseModel):
    session_id: str
    quiz_id: str
    answers: List[int]
    time_taken: int

class UserProgress(BaseModel):
    session_id: str
    total_quizzes: int = 0
    average_score: float = 0.0
    topics_attempted: Dict[str, int] = {}
    difficulty_progress: Dict[str, int] = {}
    weak_areas: List[str] = []
    last_activity: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Sample questions data
SAMPLE_QUESTIONS = [
    # OSI Model - Beginner
    {
        "question_text": "How many layers are in the OSI model?",
        "options": ["5", "6", "7", "8"],
        "correct_answer": 2,
        "explanation": "The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.",
        "topic": Topic.OSI_MODEL,
        "difficulty_level": DifficultyLevel.BEGINNER
    },
    {
        "question_text": "Which OSI layer is responsible for routing packets?",
        "options": ["Layer 2", "Layer 3", "Layer 4", "Layer 5"],
        "correct_answer": 1,
        "explanation": "Layer 3 (Network layer) is responsible for routing packets between different networks using IP addresses.",
        "topic": Topic.OSI_MODEL,
        "difficulty_level": DifficultyLevel.BEGINNER
    },
    # Subnetting - Intermediate
    {
        "question_text": "What is the subnet mask for a /24 network?",
        "options": ["255.255.0.0", "255.255.255.0", "255.255.255.128", "255.0.0.0"],
        "correct_answer": 1,
        "explanation": "A /24 network uses 24 bits for the network portion, resulting in a subnet mask of 255.255.255.0.",
        "topic": Topic.SUBNETTING,
        "difficulty_level": DifficultyLevel.INTERMEDIATE
    },
    {
        "question_text": "How many host addresses are available in a /26 subnet?",
        "options": ["62", "64", "126", "128"],
        "correct_answer": 0,
        "explanation": "A /26 subnet has 6 host bits (32-26=6), giving 2^6 = 64 total addresses. Subtract 2 for network and broadcast: 64-2 = 62 host addresses.",
        "topic": Topic.SUBNETTING,
        "difficulty_level": DifficultyLevel.INTERMEDIATE
    },
    # Routing Protocols - Advanced
    {
        "question_text": "Which routing protocol uses the Dijkstra algorithm?",
        "options": ["RIP", "EIGRP", "OSPF", "BGP"],
        "correct_answer": 2,
        "explanation": "OSPF (Open Shortest Path First) uses the Dijkstra algorithm to calculate the shortest path tree for routing decisions.",
        "topic": Topic.ROUTING_PROTOCOLS,
        "difficulty_level": DifficultyLevel.ADVANCED
    },
    {
        "question_text": "What is the maximum hop count for RIP?",
        "options": ["15", "16", "255", "Unlimited"],
        "correct_answer": 0,
        "explanation": "RIP has a maximum hop count of 15. A hop count of 16 is considered infinite and unreachable.",
        "topic": Topic.ROUTING_PROTOCOLS,
        "difficulty_level": DifficultyLevel.INTERMEDIATE
    },
    # Switching - Beginner
    {
        "question_text": "What does VLAN stand for?",
        "options": ["Virtual Local Area Network", "Very Large Area Network", "Variable Link Access Network", "Verified LAN Access Network"],
        "correct_answer": 0,
        "explanation": "VLAN stands for Virtual Local Area Network, which allows logical segmentation of a physical network.",
        "topic": Topic.SWITCHING,
        "difficulty_level": DifficultyLevel.BEGINNER
    },
    {
        "question_text": "What is the default VLAN ID on Cisco switches?",
        "options": ["0", "1", "2", "100"],
        "correct_answer": 1,
        "explanation": "The default VLAN ID on Cisco switches is VLAN 1, which is the default VLAN for all switchports.",
        "topic": Topic.SWITCHING,
        "difficulty_level": DifficultyLevel.BEGINNER
    },
    # IP Addressing - Intermediate
    {
        "question_text": "Which IP address class has a default subnet mask of 255.255.0.0?",
        "options": ["Class A", "Class B", "Class C", "Class D"],
        "correct_answer": 1,
        "explanation": "Class B networks use a default subnet mask of 255.255.0.0 (/16), providing 16 bits for the network and 16 bits for hosts.",
        "topic": Topic.IP_ADDRESSING,
        "difficulty_level": DifficultyLevel.INTERMEDIATE
    },
    {
        "question_text": "What type of address is 192.168.1.1?",
        "options": ["Public IP", "Private IP", "Loopback IP", "Multicast IP"],
        "correct_answer": 1,
        "explanation": "192.168.1.1 is a private IP address. The 192.168.0.0/16 range is reserved for private networks and cannot be routed on the internet.",
        "topic": Topic.IP_ADDRESSING,
        "difficulty_level": DifficultyLevel.BEGINNER
    }
]

@api_router.get("/")
async def root():
    return {"message": "CCNA Training Platform API"}

@api_router.post("/questions/seed")
async def seed_questions():
    """Seed the database with sample questions"""
    try:
        # Clear existing questions
        await db.questions.delete_many({})
        
        # Insert sample questions
        questions = [Question(**q) for q in SAMPLE_QUESTIONS]
        await db.questions.insert_many([q.dict() for q in questions])
        
        return {"message": f"Successfully seeded {len(questions)} questions"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/questions", response_model=List[Question])
async def get_questions():
    questions = await db.questions.find().to_list(length=None)
    return [Question(**q) for q in questions]

@api_router.post("/quiz/start")
async def start_quiz(quiz_config: QuizStart):
    """Start a new quiz with specified parameters"""
    try:
        # Build query filter
        query = {"difficulty_level": quiz_config.difficulty_level.value}
        if quiz_config.topic_filter:
            query["topic"] = quiz_config.topic_filter.value
        
        # Get available questions
        questions = await db.questions.find(query).to_list(length=None)
        
        if len(questions) < quiz_config.question_count:
            raise HTTPException(
                status_code=400, 
                detail=f"Not enough questions available. Found {len(questions)}, requested {quiz_config.question_count}"
            )
        
        # Randomly select questions
        selected_questions = random.sample(questions, quiz_config.question_count)
        
        # Create quiz session
        quiz_session = {
            "id": str(uuid.uuid4()),
            "questions": [Question(**q) for q in selected_questions],
            "difficulty_level": quiz_config.difficulty_level,
            "topic_filter": quiz_config.topic_filter,
            "created_at": datetime.now(timezone.utc)
        }
        
        return quiz_session
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/quiz/submit")
async def submit_quiz(submission: QuizSubmission):
    """Submit quiz answers and get results"""
    try:
        # Get the original quiz questions (you'd normally store this in a cache/session)
        # For now, we'll reconstruct based on the difficulty and topic
        query = {"difficulty_level": submission.quiz_id.split("_")[0] if "_" in submission.quiz_id else "beginner"}
        questions = await db.questions.find(query).to_list(length=len(submission.answers))
        
        if not questions:
            raise HTTPException(status_code=404, detail="Quiz questions not found")
        
        # Calculate score
        correct_answers = 0
        results = []
        
        for i, (question, user_answer) in enumerate(zip(questions, submission.answers)):
            is_correct = user_answer == question["correct_answer"]
            if is_correct:
                correct_answers += 1
            
            results.append({
                "question": question["question_text"],
                "options": question["options"],
                "user_answer": user_answer,
                "correct_answer": question["correct_answer"],
                "is_correct": is_correct,
                "explanation": question["explanation"]
            })
        
        score = (correct_answers / len(submission.answers)) * 100
        
        # Store quiz attempt
        quiz_attempt = QuizAttempt(
            session_id=submission.session_id,
            questions=[q["id"] for q in questions],
            user_answers=submission.answers,
            score=score,
            total_questions=len(submission.answers),
            correct_answers=correct_answers,
            difficulty_level=DifficultyLevel(query["difficulty_level"]),
            time_taken=submission.time_taken
        )
        
        await db.quiz_attempts.insert_one(quiz_attempt.dict())
        
        return {
            "score": score,
            "correct_answers": correct_answers,
            "total_questions": len(submission.answers),
            "results": results,
            "time_taken": submission.time_taken
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/progress/{session_id}")
async def get_user_progress(session_id: str):
    """Get user progress based on session ID"""
    try:
        attempts = await db.quiz_attempts.find({"session_id": session_id}).to_list(length=None)
        
        if not attempts:
            return {
                "session_id": session_id,
                "total_quizzes": 0,
                "average_score": 0,
                "topics_attempted": {},
                "difficulty_progress": {},
                "recent_scores": []
            }
        
        total_score = sum(attempt["score"] for attempt in attempts)
        average_score = total_score / len(attempts)
        
        topics_attempted = {}
        difficulty_progress = {}
        recent_scores = []
        
        for attempt in attempts:
            # Topic progress
            topic = attempt.get("topic_filter", "general")
            topics_attempted[topic] = topics_attempted.get(topic, 0) + 1
            
            # Difficulty progress
            diff = attempt["difficulty_level"]
            difficulty_progress[diff] = difficulty_progress.get(diff, 0) + 1
            
            # Recent scores
            recent_scores.append({
                "score": attempt["score"],
                "date": attempt["completed_at"],
                "difficulty": diff
            })
        
        # Sort recent scores by date
        recent_scores.sort(key=lambda x: x["date"], reverse=True)
        recent_scores = recent_scores[:10]  # Keep last 10
        
        return {
            "session_id": session_id,
            "total_quizzes": len(attempts),
            "average_score": round(average_score, 1),
            "topics_attempted": topics_attempted,
            "difficulty_progress": difficulty_progress,
            "recent_scores": recent_scores
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/leaderboard")
async def get_leaderboard():
    """Get top performers across all sessions"""
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$session_id",
                    "average_score": {"$avg": "$score"},
                    "total_quizzes": {"$sum": 1},
                    "best_score": {"$max": "$score"},
                    "last_activity": {"$max": "$completed_at"}
                }
            },
            {
                "$match": {
                    "total_quizzes": {"$gte": 3}  # At least 3 quizzes to qualify
                }
            },
            {
                "$sort": {"average_score": -1}
            },
            {
                "$limit": 10
            }
        ]
        
        leaderboard = await db.quiz_attempts.aggregate(pipeline).to_list(length=None)
        
        # Add rankings
        for i, entry in enumerate(leaderboard):
            entry["rank"] = i + 1
            entry["average_score"] = round(entry["average_score"], 1)
        
        return leaderboard
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()