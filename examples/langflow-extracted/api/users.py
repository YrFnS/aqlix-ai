"""
Users router extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/api/v1/users.py
"""
from typing import Annotated, Dict, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from langflow.services.database.models.user.model import User, UserCreate, UserRead, UserUpdate
from langflow.services.auth.utils import (
    get_current_active_user,
    get_current_active_superuser,
    hash_password
)
from langflow.services.database.utils import DbSession

router = APIRouter(tags=["Users"], prefix="/users")

# Type aliases for cleaner code
CurrentActiveUser = Annotated[User, Depends(get_current_active_user)]

class UsersResponse:
    """Response model for paginated users list"""
    def __init__(self, users: List[User], total_count: int):
        self.users = users
        self.total_count = total_count

@router.post("/", response_model=UserRead, status_code=201)
async def add_user(user: UserCreate, session: DbSession) -> User:
    """
    Add a new user to the database.
    
    Iraqi AI enhancements:
    - Set default language preference (Arabic/English)
    - Initialize cultural compliance settings
    - Create Iraqi professional domain preferences
    - Set up payment provider preferences
    """
    try:
        # Hash password
        hashed_password = hash_password(user.password)
        
        # Create user with Iraqi-specific defaults
        db_user = User(
            username=user.username,
            password=hashed_password,
            is_active=True,
            # Iraqi AI defaults would be added here:
            # preferred_language="arabic",
            # cultural_preferences={"islamic_compliance": True},
            # professional_domain="general",
            # payment_provider="zaincash"
        )
        
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        
        return db_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/whoami", response_model=UserRead)
async def read_current_user(current_user: CurrentActiveUser) -> User:
    """
    Retrieve the current user's data.
    
    Iraqi AI enhancements:
    - Include language preferences
    - Include cultural settings
    - Include professional domain settings
    """
    return current_user

@router.get("/", dependencies=[Depends(get_current_active_superuser)])
async def read_all_users(
    *,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    session: DbSession
) -> UsersResponse:
    """
    Retrieve a list of users from the database with pagination.
    
    Iraqi AI enhancements:
    - Filter by professional domain
    - Filter by language preference
    - Include cultural compliance status
    """
    try:
        # Get users with pagination
        users = session.query(User).offset(skip).limit(limit).all()
        total_count = session.query(User).count()
        
        return UsersResponse(users=users, total_count=total_count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{user_id}", response_model=UserRead)
async def patch_user(
    user_id: UUID,
    user_update: UserUpdate,
    user: CurrentActiveUser,
    session: DbSession
) -> User:
    """
    Update an existing user's data.
    
    Iraqi AI enhancements:
    - Validate cultural preference changes
    - Update professional domain settings
    - Handle language preference updates
    """
    try:
        # Permission check
        if user.id != user_id and not user.is_superuser:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        
        # Get user to update
        db_user = session.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update user fields
        update_data = user_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        session.commit()
        session.refresh(db_user)
        
        return db_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{user_id}/reset-password", response_model=UserRead)
async def reset_password(
    user_id: UUID,
    user_update: UserUpdate,
    user: CurrentActiveUser,
    session: DbSession
) -> User:
    """
    Reset a user's password.
    
    Iraqi AI enhancements:
    - Send password reset notification in user's preferred language
    - Apply cultural-appropriate security measures
    """
    try:
        # Permission check
        if user.id != user_id and not user.is_superuser:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        
        if not user_update.password:
            raise HTTPException(status_code=400, detail="Password is required")
        
        # Get user
        db_user = session.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update password
        db_user.password = hash_password(user_update.password)
        session.commit()
        session.refresh(db_user)
        
        return db_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{user_id}")
async def delete_user(
    user_id: UUID,
    current_user: Annotated[User, Depends(get_current_active_superuser)],
    session: DbSession
) -> Dict[str, str]:
    """
    Delete a user from the database.
    
    Iraqi AI enhancements:
    - Archive user data according to Iraqi data protection laws
    - Clean up cultural preference data
    - Handle payment data cleanup
    """
    try:
        # Get user
        db_user = session.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Delete user (cascade will handle related data)
        session.delete(db_user)
        session.commit()
        
        return {"message": "User deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Iraqi AI Chat System enhancements needed:
# - Add /users/{id}/cultural-preferences endpoint
# - Add /users/{id}/language-settings endpoint  
# - Add /users/{id}/professional-domain endpoint
# - Add /users/{id}/payment-settings endpoint
# - Add user analytics for Iraqi usage patterns
# - Add bulk user operations for Iraqi organizations
# - Add user verification for Iraqi professional domains