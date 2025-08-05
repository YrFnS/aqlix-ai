"""
API Key router extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/api/v1/api_key.py
"""
from typing import List, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Response
from langflow.services.database.models.user.model import User
from langflow.services.database.models.api_key.model import ApiKey, ApiKeyCreate, ApiKeyRead, UnmaskedApiKeyRead
from langflow.services.auth.utils import get_current_active_user
from langflow.services.database.utils import DbSession

router = APIRouter(prefix="/api_key", tags=["API Keys"])

@router.get("/", response_model=List[ApiKeyRead])
async def get_api_keys(
    current_user: User = Depends(get_current_active_user),
    session: DbSession = Depends(),
) -> List[ApiKey]:
    """
    Retrieve API keys for the current user.
    
    Iraqi AI enhancements:
    - Show API key scope (chat, files, payments, cultural)
    - Display cultural access permissions
    - Include professional domain restrictions
    - Show payment gateway access status
    """
    try:
        api_keys = session.query(ApiKey).filter(
            ApiKey.user_id == current_user.id,
            ApiKey.is_active == True
        ).all()
        
        # Iraqi AI specific: Mask sensitive information appropriately
        # Add cultural and professional domain context
        
        return api_keys
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=UnmaskedApiKeyRead)
async def create_api_key(
    api_key_data: ApiKeyCreate,
    current_user: User = Depends(get_current_active_user),
    session: DbSession = Depends(),
) -> ApiKey:
    """
    Create a new API key.
    
    Iraqi AI enhancements:
    - Set cultural access permissions
    - Configure professional domain scope
    - Apply Iraqi security standards
    - Set payment gateway permissions
    """
    try:
        # Generate secure API key
        import secrets
        import string
        
        if not api_key_data.api_key:
            # Generate secure API key
            alphabet = string.ascii_letters + string.digits
            api_key_value = ''.join(secrets.choice(alphabet) for _ in range(64))
        else:
            api_key_value = api_key_data.api_key
        
        # Iraqi AI specific: Apply cultural and security defaults
        db_api_key = ApiKey(
            name=api_key_data.name,
            api_key=api_key_value,
            user_id=current_user.id,
            is_active=True,
            # Iraqi AI defaults would be added here:
            # scope=["chat", "files"],  # Default scope
            # cultural_access=True,
            # payment_enabled=False,    # Requires explicit enabling
            # professional_domain="general",
            # encryption_level="standard"
        )
        
        session.add(db_api_key)
        session.commit()
        session.refresh(db_api_key)
        
        return db_api_key
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{api_key_id}")
async def delete_api_key(
    api_key_id: UUID,
    current_user: User = Depends(get_current_active_user),
    session: DbSession = Depends(),
) -> Dict[str, str]:
    """
    Delete a specific API key.
    
    Iraqi AI enhancements:
    - Archive key usage according to Iraqi data laws
    - Clean up cultural permission cache
    - Log deletion for security audit
    """
    try:
        api_key = session.query(ApiKey).filter(
            ApiKey.id == api_key_id,
            ApiKey.user_id == current_user.id
        ).first()
        
        if not api_key:
            raise HTTPException(status_code=404, detail="API key not found")
        
        # Iraqi AI specific: Archive for audit compliance
        # archive_api_key_for_audit(api_key)
        
        session.delete(api_key)
        session.commit()
        
        return {"message": "API key deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/store")
async def store_api_key(
    api_key_data: Dict[str, str],
    response: Response,
    current_user: User = Depends(get_current_active_user),
    session: DbSession = Depends(),
) -> Dict[str, str]:
    """
    Save an external API key for the user.
    
    Iraqi AI enhancements:
    - Encrypt with Iraqi-compliant encryption standards
    - Apply cultural usage restrictions
    - Set professional domain access controls
    """
    try:
        store_api_key = api_key_data.get("store_api_key")
        if not store_api_key:
            raise HTTPException(status_code=400, detail="API key is required")
        
        # Iraqi AI specific: Apply encryption and cultural restrictions
        # encrypted_key = encrypt_with_iraqi_standards(store_api_key)
        
        # Update user's stored API key
        current_user.store_api_key = store_api_key  # Would be encrypted
        session.commit()
        
        # Set secure cookie with Iraqi security standards
        response.set_cookie(
            key="store_api_key",
            value=store_api_key,
            httponly=True,
            secure=True,
            samesite="strict",
            max_age=86400  # 24 hours
        )
        
        return {"message": "API key stored successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{api_key_id}")
async def update_api_key(
    api_key_id: UUID,
    update_data: Dict[str, Any],
    current_user: User = Depends(get_current_active_user),
    session: DbSession = Depends(),
) -> ApiKeyRead:
    """
    Update an existing API key.
    
    Iraqi AI enhancements:
    - Update cultural access permissions
    - Modify professional domain scope
    - Change payment gateway access
    """
    try:
        api_key = session.query(ApiKey).filter(
            ApiKey.id == api_key_id,
            ApiKey.user_id == current_user.id
        ).first()
        
        if not api_key:
            raise HTTPException(status_code=404, detail="API key not found")
        
        # Update allowed fields
        allowed_fields = ["name", "is_active"]  # Iraqi AI would add: scope, cultural_access, etc.
        
        for field, value in update_data.items():
            if field in allowed_fields:
                setattr(api_key, field, value)
        
        session.commit()
        session.refresh(api_key)
        
        return api_key
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{api_key_id}/usage")
async def get_api_key_usage(
    api_key_id: UUID,
    current_user: User = Depends(get_current_active_user),
    session: DbSession = Depends(),
) -> Dict[str, Any]:
    """
    Get usage statistics for an API key.
    
    Iraqi AI enhancements:
    - Show cultural feature usage
    - Display professional domain activity
    - Include payment gateway usage
    """
    try:
        api_key = session.query(ApiKey).filter(
            ApiKey.id == api_key_id,
            ApiKey.user_id == current_user.id
        ).first()
        
        if not api_key:
            raise HTTPException(status_code=404, detail="API key not found")
        
        # Iraqi AI specific usage analytics would include:
        # - cultural_features_used
        # - professional_domain_activity
        # - payment_transactions
        # - arabic_content_processed
        
        return {
            "total_uses": api_key.total_uses,
            "last_used_at": api_key.last_used_at,
            "created_at": api_key.created_at,
            # Iraqi AI metrics would be added here
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Iraqi AI Chat System enhancements needed:
# - Add /api_key/cultural-permissions endpoint for Islamic compliance settings
# - Add /api_key/professional-scope endpoint for Iraqi domain restrictions
# - Add /api_key/payment-access endpoint for payment gateway permissions
# - Add /api_key/security-audit endpoint for Iraqi security compliance
# - Add rate limiting configuration for Iraqi network conditions
# - Add API key templates for Iraqi professional domains
# - Add bulk API key management for Iraqi organizations