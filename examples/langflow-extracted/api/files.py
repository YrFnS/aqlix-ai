"""
Files router extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/api/v1/files.py
"""
from typing import List, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Path
from fastapi.responses import StreamingResponse
from langflow.services.database.models.user.model import User
from langflow.services.auth.utils import get_current_active_user
from langflow.services.storage.service import StorageService

router = APIRouter(prefix="/files", tags=["Files"])

@router.post("/upload/{flow_id}")
async def upload_file(
    flow_id: str = Path(..., description="The flow ID"),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    storage_service: StorageService = Depends(),
) -> Dict[str, str]:
    """
    Upload a file for a specific flow.
    
    Iraqi AI enhancements:
    - Validate file content for cultural appropriateness
    - Scan for Arabic text and apply RTL handling
    - Security scanning for malicious content
    - Support Iraqi document formats (Arabic PDFs, etc.)
    """
    try:
        # Check file size
        MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB
        if file.size and file.size > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File size exceeds maximum limit")
        
        # Iraqi AI specific validations would include:
        # - Cultural content validation
        # - Arabic text detection
        # - Security scanning
        # - Iraqi document format support
        
        # Save file with timestamp
        file_content = await file.read()
        file_path = await storage_service.save_file(
            flow_id=flow_id,
            file_name=file.filename,
            file_content=file_content,
            user_id=current_user.id
        )
        
        return {"file_path": file_path, "message": "File uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/download/{flow_id}/{file_name}")
async def download_file(
    flow_id: str = Path(..., description="The flow ID"),
    file_name: str = Path(..., description="The file name"),
    current_user: User = Depends(get_current_active_user),
    storage_service: StorageService = Depends(),
) -> StreamingResponse:
    """
    Download a file from a specific flow.
    
    Iraqi AI enhancements:
    - Apply RTL formatting for Arabic documents
    - Add cultural context metadata
    - Support Iraqi-specific file formats
    """
    try:
        file_content, content_type = await storage_service.get_file(
            flow_id=flow_id,
            file_name=file_name,
            user_id=current_user.id
        )
        
        # Iraqi AI specific processing would include:
        # - RTL text formatting for Arabic content
        # - Cultural metadata inclusion
        # - Professional domain context
        
        return StreamingResponse(
            file_content,
            media_type=content_type,
            headers={"Content-Disposition": f"attachment; filename={file_name}"}
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail="File not found")

@router.get("/images/{flow_id}/{file_name}")
async def download_image(
    flow_id: str = Path(..., description="The flow ID"),
    file_name: str = Path(..., description="The image file name"),
    current_user: User = Depends(get_current_active_user),
    storage_service: StorageService = Depends(),
) -> StreamingResponse:
    """
    Download an image file.
    
    Iraqi AI enhancements:
    - Validate images for cultural appropriateness
    - Support Arabic text in images (OCR)
    - Apply Islamic compliance filtering
    """
    try:
        # Validate image content type
        allowed_types = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]
        
        file_content, content_type = await storage_service.get_file(
            flow_id=flow_id,
            file_name=file_name,
            user_id=current_user.id
        )
        
        if content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="File is not a valid image")
        
        # Iraqi AI specific processing:
        # - Cultural appropriateness validation
        # - Arabic OCR processing
        # - Islamic compliance checks
        
        return StreamingResponse(file_content, media_type=content_type)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Image not found")

@router.get("/profile_pictures/{folder_name}/{file_name}")
async def download_profile_picture(
    folder_name: str = Path(..., description="The folder name"),
    file_name: str = Path(..., description="The file name"),
    storage_service: StorageService = Depends(),
) -> StreamingResponse:
    """
    Download profile pictures.
    
    Iraqi AI enhancements:
    - Cultural-appropriate profile pictures
    - Support for Islamic guidelines
    - Arabic name support
    """
    try:
        file_content, content_type = await storage_service.get_profile_picture(
            folder_name=folder_name,
            file_name=file_name
        )
        
        return StreamingResponse(file_content, media_type=content_type)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Profile picture not found")

@router.get("/profile_pictures/list")
async def list_profile_pictures(
    storage_service: StorageService = Depends(),
) -> Dict[str, List[str]]:
    """
    List available profile pictures.
    
    Iraqi AI enhancements:
    - Include culturally appropriate Iraqi pictures
    - Support Islamic-compliant avatars
    - Professional domain specific avatars
    """
    try:
        return await storage_service.list_profile_pictures()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list/{flow_id}")
async def list_files(
    flow_id: str = Path(..., description="The flow ID"),
    current_user: User = Depends(get_current_active_user),
    storage_service: StorageService = Depends(),
) -> List[Dict[str, Any]]:
    """
    List files for a specific flow.
    
    Iraqi AI enhancements:
    - Include Arabic metadata
    - Show cultural validation status
    - Display professional domain context
    """
    try:
        files = await storage_service.list_files(
            flow_id=flow_id,
            user_id=current_user.id
        )
        
        # Iraqi AI specific metadata would include:
        # - language_detected
        # - cultural_validated
        # - professional_domain
        # - rtl_processed
        
        return files
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete/{flow_id}/{file_name}")
async def delete_file(
    flow_id: str = Path(..., description="The flow ID"),
    file_name: str = Path(..., description="The file name"),
    current_user: User = Depends(get_current_active_user),
    storage_service: StorageService = Depends(),
) -> Dict[str, str]:
    """
    Delete a file from a specific flow.
    
    Iraqi AI enhancements:
    - Archive according to Iraqi data retention laws
    - Clean cultural validation data
    - Update professional domain indexes
    """
    try:
        await storage_service.delete_file(
            flow_id=flow_id,
            file_name=file_name,
            user_id=current_user.id
        )
        
        return {"message": "File deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Iraqi AI Chat System enhancements needed:
# - Add /files/arabic-ocr endpoint for Arabic text extraction
# - Add /files/cultural-validate endpoint for Islamic compliance
# - Add /files/professional-process/{domain} for Iraqi professional docs
# - Add /files/rtl-convert endpoint for RTL document processing
# - Add /files/security-scan endpoint for malware detection
# - Add support for Iraqi government document formats
# - Add bulk file operations for Iraqi organizations