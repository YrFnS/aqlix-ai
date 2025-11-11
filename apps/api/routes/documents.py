"""
Documents API Routes
FastAPI endpoints for document management and processing
"""

from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from typing import Optional, List
import logging

# Import models and services
try:
    from apps.api.models.documents import (
        DocumentCreate,
        Document,
        DocumentProcessRequest,
        DocumentAnalysis,
        DocumentListResponse,
        UploadResponse,
        DocumentDeleteResponse,
    )
    from apps.api.services.documents_service import DocumentsService
    from apps.api.middleware.auth_middleware import get_current_user_dependency
except ImportError:
    from models.documents import (
        DocumentCreate,
        Document,
        DocumentProcessRequest,
        DocumentAnalysis,
        DocumentListResponse,
        UploadResponse,
        DocumentDeleteResponse,
    )
    from services.documents_service import DocumentsService
    from middleware.auth_middleware import get_current_user_dependency

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1/documents", tags=["documents"])

# Initialize documents service
documents_service = DocumentsService()


# ========== DOCUMENT ENDPOINTS ==========


@router.post(
    "",
    response_model=Document,
    status_code=status.HTTP_201_CREATED,
    summary="Upload document",
    description="Upload a document for processing and storage",
)
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = None,
    tags: Optional[List[str]] = None,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Upload a document.

    Supports multiple file types: PDF, DOCX, TXT, images, spreadsheets, presentations.
    Files are stored in Supabase and can be processed with AI.

    Maximum file size: 50MB

    Args:
        file: Document file
        title: Optional document title
        tags: Optional tags for organization
        current_user: Current authenticated user

    Returns:
        Document: Uploaded document metadata

    Raises:
        HTTPException 400: If file validation fails
        HTTPException 413: If file too large
    """
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must have a filename",
            )

        # Get file size
        file_content = await file.read()
        size_bytes = len(file_content)

        # Validate size (50MB max)
        if size_bytes > 52428800:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File size exceeds 50MB limit",
            )

        # Reset file pointer
        await file.seek(0)

        # Create document upload
        upload_response = await documents_service.create_upload(
            user_id=current_user["user_id"],
            filename=file.filename,
            content_type=file.content_type or "application/octet-stream",
            size_bytes=size_bytes,
            title=title,
            tags=tags,
        )

        # Get created document
        document = await documents_service.get_document(
            upload_response["document_id"],
            current_user["user_id"],
        )

        return Document(**document)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload document",
        )


@router.get(
    "",
    response_model=DocumentListResponse,
    summary="List user documents",
    description="Retrieve all documents for the current user",
)
async def list_documents(
    limit: int = 50,
    offset: int = 0,
    tags: Optional[List[str]] = None,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    List all documents for the current user.

    Supports pagination and filtering by tags.

    Args:
        limit: Number of documents to return (default: 50, max: 100)
        offset: Offset for pagination (default: 0)
        tags: Optional tags to filter by
        current_user: Current authenticated user

    Returns:
        DocumentListResponse: List of documents with pagination info
    """
    try:
        # Validate pagination params
        limit = min(limit, 100)
        if offset < 0:
            offset = 0

        documents, total = await documents_service.list_documents(
            user_id=current_user["user_id"],
            limit=limit,
            offset=offset,
            tags=tags,
        )

        return DocumentListResponse(
            documents=[Document(**d) for d in documents],
            total=total,
            limit=limit,
            offset=offset,
        )
    except Exception as e:
        logger.error(f"Error listing documents: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve documents",
        )


@router.get(
    "/{document_id}",
    response_model=Document,
    summary="Get document",
    description="Retrieve a specific document by ID",
)
async def get_document(
    document_id: str,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Get a specific document.

    Args:
        document_id: Document ID
        current_user: Current authenticated user

    Returns:
        Document: Document details

    Raises:
        HTTPException 404: If document not found or user unauthorized
    """
    try:
        document = await documents_service.get_document(
            document_id=document_id,
            user_id=current_user["user_id"],
        )

        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found",
            )

        return Document(**document)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving document {document_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve document",
        )


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete document",
    description="Delete a document and its associated data",
)
async def delete_document(
    document_id: str,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Delete a document.

    Also deletes all associated analysis and data. This action cannot be undone.

    Args:
        document_id: Document ID
        current_user: Current authenticated user

    Returns:
        None (204 No Content on success)

    Raises:
        HTTPException 404: If document not found or user unauthorized
    """
    try:
        deleted = await documents_service.delete_document(
            document_id=document_id,
            user_id=current_user["user_id"],
        )

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found",
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting document {document_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete document",
        )


# ========== DOCUMENT PROCESSING ENDPOINTS ==========


@router.post(
    "/{document_id}/process",
    response_model=DocumentAnalysis,
    status_code=status.HTTP_200_OK,
    summary="Process document with AI",
    description="Analyze and process document content with AI",
)
async def process_document(
    document_id: str,
    request: DocumentProcessRequest,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Process a document with AI analysis.

    Performs analysis based on analysis_type:
    - summary: Generate document summary in specified language
    - extraction: Extract structured data (tables, forms, text blocks)
    - translation: Translate document to specified language

    Features:
    - Supports Arabic and English output
    - Can include image analysis and OCR
    - Returns detailed analysis results

    Args:
        document_id: Document ID
        request: Processing request with analysis type and options
        current_user: Current authenticated user

    Returns:
        DocumentAnalysis: Analysis result with details

    Raises:
        HTTPException 404: If document not found
        HTTPException 400: If processing fails
    """
    try:
        analysis = await documents_service.process_document(
            document_id=document_id,
            user_id=current_user["user_id"],
            analysis_type=request.analysis_type,
            language=request.language,
            include_images=request.include_images,
        )

        return DocumentAnalysis(**analysis)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing document {document_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process document",
        )


@router.patch(
    "/{document_id}/tags",
    response_model=Document,
    summary="Update document tags",
    description="Update tags for a document",
)
async def update_document_tags(
    document_id: str,
    tags: List[str],
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Update document tags.

    Tags help organize and categorize documents.

    Args:
        document_id: Document ID
        tags: New tags list
        current_user: Current authenticated user

    Returns:
        Document: Updated document

    Raises:
        HTTPException 404: If document not found or user unauthorized
    """
    try:
        document = await documents_service.update_document_tags(
            document_id=document_id,
            user_id=current_user["user_id"],
            tags=tags,
        )

        return Document(**document)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating document {document_id} tags: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update document tags",
        )
