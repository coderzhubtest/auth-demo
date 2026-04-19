import json
import os
from datetime import datetime
from typing import Optional, Dict, List
from models import UserInDB
from config import DB_PATH


class JSONDatabase:
    """JSON-based database for user storage"""

    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        """Initialize database file if it doesn't exist"""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        if not os.path.exists(self.db_path):
            self._write_db({"users": {}})

    def _read_db(self) -> Dict:
        """Read database from JSON file"""
        try:
            with open(self.db_path, "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {"users": {}}

    def _write_db(self, data: Dict):
        """Write database to JSON file"""
        with open(self.db_path, "w") as f:
            json.dump(data, f, indent=2, default=str)

    def create_user(self, user_id: str, email: str, hashed_password: str, full_name: str) -> UserInDB:
        """Create a new user"""
        db = self._read_db()
        
        if email in [u["email"] for u in db["users"].values()]:
            raise ValueError("Email already exists")
        
        now = datetime.now().isoformat()
        user_data = {
            "user_id": user_id,
            "email": email,
            "full_name": full_name,
            "hashed_password": hashed_password,
            "created_at": now,
            "updated_at": now,
        }
        
        db["users"][user_id] = user_data
        self._write_db(db)
        return UserInDB(**user_data)

    def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        """Get user by email"""
        db = self._read_db()
        for user_data in db["users"].values():
            if user_data["email"] == email:
                return UserInDB(**user_data)
        return None

    def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        """Get user by ID"""
        db = self._read_db()
        user_data = db["users"].get(user_id)
        if user_data:
            return UserInDB(**user_data)
        return None

    def update_user(self, user_id: str, **kwargs) -> Optional[UserInDB]:
        """Update user information"""
        db = self._read_db()
        
        if user_id not in db["users"]:
            return None
        
        user_data = db["users"][user_id]
        user_data.update(kwargs)
        user_data["updated_at"] = datetime.now().isoformat()
        
        db["users"][user_id] = user_data
        self._write_db(db)
        return UserInDB(**user_data)

    def delete_user(self, user_id: str) -> bool:
        """Delete a user"""
        db = self._read_db()
        
        if user_id in db["users"]:
            del db["users"][user_id]
            self._write_db(db)
            return True
        return False

    def get_all_users(self) -> List[UserInDB]:
        """Get all users"""
        db = self._read_db()
        return [UserInDB(**user_data) for user_data in db["users"].values()]


# Global database instance
db = JSONDatabase()
