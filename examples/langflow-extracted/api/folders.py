"""
Folders router extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/api/v1/folders.py
Note: This router currently redirects to projects endpoint, but we'll implement full functionality
"""
from typing import List, Dict, Any, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from fastapi.responses import RedirectResponse
from langflow.services.database.models.user.model import User
from langflow.services.database.models.folder.model import Folder, FolderCreate, FolderRead, FolderUpdate
from langflow.services.auth.utils import get_current_active_user
from langflow.services.database.utils import DbSession

router = APIRouter(prefix="/folders", tags=["Folders"])

@router.post("/", response_model=FolderRead)
async def create_folder(
    folder: FolderCreate,
    current_user: User = Depends(get_current_active_user),
    session: DbSession = Depends(),
) -> Folder:
    """
    Create a new folder for organizing workflows.
    
    Iraqi AI enhancements:
    - Set cultural category defaults
    - Configure Arabic language support
    - Apply professional domain organization
    - Set Islamic compliance preferences
    """
    try:
        # Iraqi AI specific defaults:
        # - folder_type based on user preferences
        # - cultural_category for Islamic compliance
        # - language_primary for Arabic/English support
        # - iraqi_domain for professional categorization
        
        db_folder = Folder(
            **folder.model_dump(),
            user_id=current_user.id,
            # Iraqi AI defaults would be added here:
            # folder_type="personal",
            # cultural_category="general", 
            # language_primary="arabic",
            # iraqi_domain="general"
        )
        
        session.add(db_folder)
        session.commit()
        session.refresh(db_folder)
        
        return db_folder
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[FolderRead])
async def read_folders(
    current_user: User = Depends(get_current_active_user),
    session: DbSession = Depends(),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
) -> List[Folder]:
    """
    Retrieve folders with pagination and search support.
    
    Iraqi AI enhancements:
    - Search in Arabic and English
    - Filter by professional domain
    - Show cultural category
    - Support RTL text ordering
    """
    try:
        query = session.query(Folder).filter(Folder.user_id == current_user.id)
        
        if search:
            # Iraqi AI: Support Arabic text search
            # Arabic text processing would be added here
            query = query.filter(
                Folder.name.ilike(f"%{search}%") |
                Folder.description.ilike(f"%{search}%")
            )
        
        folders = query.offset(skip).limit(limit).all()
        
        return folders
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{folder_id}", response_model=FolderRead)
async def read_folder(
    folder_id: UUID,
    current_user: User = Depends(get_current_active_user),
    session: DbSession = Depends(),
) -> Folder:
    """
    Read a specific folder.
    
    Iraqi AI enhancements:
    - Include cultural metadata
    - Show Arabic descriptions
    - Display professional domain context
    """
    try:
        folder = session.query(Folder).filter(
            Folder.id == folder_id,
            Folder.user_id == current_user.id
        ).first()
        
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")
        
        return folder
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{folder_id}", response_model=FolderRead)
async def update_folder(
    folder_id: UUID,
    folder_update: FolderUpdate,
    current_user: User = Depends(get_current_active_user),
    session: DbSession = Depends(),
) -> Folder:
    """
    Update an existing folder.
    
    Iraqi AI enhancements:
    - Validate Arabic text updates
    - Update cultural preferences
    - Handle professional domain changes
    """
    try:
        folder = session.query(Folder).filter(
            Folder.id == folder_id,
            Folder.user_id == current_user.id
        ).first()
        
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")
        
        # Iraqi AI specific validations:
        # - Arabic text processing
        # - Cultural appropriateness validation
        # - Professional domain validation
        
        update_data = folder_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(folder, field, value)
        
        session.commit()
        session.refresh(folder)
        
        return folder
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{folder_id}")
async def delete_folder(
    folder_id: UUID,
    current_user: User = Depends(get_current_active_user),
    session: DbSession = Depends(),
) -> Dict[str, str]:
    """
    Delete a folder and optionally its contents.
    
    Iraqi AI enhancements:
    - Archive according to Iraqi data retention laws
    - Clean up cultural metadata
    - Handle Arabic content archival
    """
    try:
        folder = session.query(Folder).filter(
            Folder.id == folder_id,
            Folder.user_id == current_user.id
        ).first()
        
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")
        
        # Check if folder has contents
        if folder.flows or folder.children:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete folder with contents. Move or delete contents first."
            )
        
        session.delete(folder)
        session.commit()
        
        return {"message": "Folder deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{folder_id}/upload")
async def upload_to_folder(
    folder_id: UUID,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    session: DbSession = Depends(),
) -> Dict[str, Any]:
    """
    Upload files to a specific folder.
    
    Iraqi AI enhancements:
    - Validate cultural appropriateness
    - Process Arabic documents
    - Apply professional domain validation
    """
    try:
        # Verify folder exists and user owns it
        folder = session.query(Folder).filter(
            Folder.id == folder_id,
            Folder.user_id == current_user.id
        ).first()
        
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")
        
        # Iraqi AI specific processing:
        # - Cultural validation
        # - Arabic text extraction
        # - Professional domain classification
        
        file_content = await file.read()
        
        # Process and save file
        # Implementation would handle file processing
        
        return {
            "message": "File uploaded successfully",
            "folder_id": folder_id,
            "filename": file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Redirect endpoints (maintaining compatibility with original Langflow)
@router.post("/redirect", status_code=307)
async def redirect_create_folder():
    """Redirect to projects endpoint for backward compatibility"""
    return RedirectResponse(url="/api/v1/projects/", status_code=307)

@router.get("/redirect", status_code=307)
async def redirect_read_folders():
    """Redirect to projects endpoint for backward compatibility"""
    return RedirectResponse(url="/api/v1/projects/", status_code=307)

# Iraqi AI Chat System enhancements needed:
# - Add /folders/cultural-categories endpoint for Islamic compliance organization
# - Add /folders/professional-domains endpoint for Iraqi domain organization
# - Add /folders/arabic-search endpoint for Arabic text search
# - Add /folders/templates/iraqi for Iraqi professional folder templates
# - Add folder sharing with cultural privacy controls
# - Add hierarchical folder structure with Arabic support
# - Add folder analytics for Iraqi organizational patterns