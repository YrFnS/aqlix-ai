"""
Image Processing API Router
Extracted and enhanced from open-webui for Iraqi AI Chat System

Provides complete API routing for image generation, editing, and management
with Iraqi cultural compliance and Arabic RTL support.
"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from enum import Enum
import asyncio
import logging
from datetime import datetime
import uuid
import io
import base64

# Iraqi cultural validation and Arabic processing
from .middleware.cultural_validator import IraqiCulturalValidator
from .middleware.rtl_processor import ArabicRTLProcessor

logger = logging.getLogger(__name__)

# Initialize router
router = APIRouter(prefix="/api/v1/images", tags=["images"])

# Initialize Iraqi AI agents
cultural_validator = IraqiCulturalValidator()
rtl_processor = ArabicRTLProcessor()


class ProfessionalDomain(str, Enum):
    """Iraqi professional domain contexts"""

    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    BUSINESS = "business"
    ENGINEERING = "engineering"
    GENERAL = "general"


class ImageProvider(str, Enum):
    """Supported image generation providers"""

    DALLE3 = "dall-e-3"
    DALLE2 = "dall-e-2"
    STABLE_DIFFUSION = "stable-diffusion"
    OPENAI_TOOLS = "openai-image-tools"


class ImageGenerationRequest(BaseModel):
    """Image generation request with Iraqi cultural support"""

    prompt: str = Field(..., description="Primary prompt (English or Arabic)")
    prompt_ar: Optional[str] = Field(None, description="Arabic translation of prompt")
    negative_prompt: Optional[str] = Field(None, description="Negative prompt")
    negative_prompt_ar: Optional[str] = Field(
        None, description="Arabic negative prompt"
    )

    provider: ImageProvider = Field(
        default=ImageProvider.DALLE3, description="Image generation provider"
    )
    model: Optional[str] = Field(
        default="dall-e-3", description="Specific model version"
    )

    # Image specifications
    size: Optional[str] = Field(default="1024x1024", description="Image dimensions")
    quality: Optional[str] = Field(
        default="standard", description="Image quality (standard/hd)"
    )
    style: Optional[str] = Field(
        default="vivid", description="Image style (vivid/natural)"
    )
    n: int = Field(default=1, ge=1, le=4, description="Number of images to generate")

    # Iraqi-specific fields
    professional_domain: ProfessionalDomain = Field(default=ProfessionalDomain.GENERAL)
    cultural_validation: bool = Field(
        default=True, description="Enable Iraqi cultural validation"
    )
    islamic_compliance: bool = Field(
        default=True, description="Ensure Islamic compliance"
    )
    rtl_layout: bool = Field(default=False, description="Optimize for RTL languages")

    # User context
    user_id: str = Field(..., description="User identifier")
    session_id: Optional[str] = Field(None, description="Chat session identifier")


class ImageEditRequest(BaseModel):
    """Image editing request with cultural validation"""

    image_data: str = Field(..., description="Base64 encoded image data")
    mask_data: Optional[str] = Field(None, description="Base64 encoded mask data")
    prompt: str = Field(..., description="Edit instruction")
    prompt_ar: Optional[str] = Field(None, description="Arabic edit instruction")

    provider: ImageProvider = Field(default=ImageProvider.OPENAI_TOOLS)
    model: Optional[str] = Field(default="dall-e-2")

    size: Optional[str] = Field(default="1024x1024")
    n: int = Field(default=1, ge=1, le=4)

    # Iraqi-specific validation
    professional_domain: ProfessionalDomain = Field(default=ProfessionalDomain.GENERAL)
    cultural_validation: bool = Field(default=True)
    islamic_compliance: bool = Field(default=True)

    user_id: str = Field(...)
    session_id: Optional[str] = Field(None)


class ImageResponse(BaseModel):
    """Standardized image response"""

    id: str = Field(..., description="Unique image identifier")
    url: Optional[str] = Field(None, description="Image URL (if hosted)")
    data: Optional[str] = Field(None, description="Base64 image data")
    provider: ImageProvider = Field(..., description="Generation provider")
    model: str = Field(..., description="Model used")

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    size: str = Field(...)
    format: str = Field(default="png")

    # Cultural validation results
    cultural_score: float = Field(
        ..., ge=0, le=1, description="Cultural appropriateness score"
    )
    islamic_compliant: bool = Field(..., description="Islamic compliance status")
    professional_appropriate: bool = Field(
        ..., description="Professional context appropriate"
    )

    # Processing metadata
    generation_time: float = Field(..., description="Generation time in seconds")
    validation_time: float = Field(..., description="Validation time in seconds")


class ImageListResponse(BaseModel):
    """List of generated images"""

    images: List[ImageResponse]
    total: int
    page: int = 1
    per_page: int = 10
    has_next: bool = False


@router.post("/generate", response_model=ImageListResponse)
async def generate_images(request: ImageGenerationRequest) -> ImageListResponse:
    """
    Generate images with Iraqi cultural compliance

    Features:
    - Multi-provider support (DALL-E, Stable Diffusion)
    - Arabic prompt processing with RTL optimization
    - Cultural validation with 95%+ appropriateness
    - Professional domain context
    - Islamic compliance checking
    """
    try:
        start_time = datetime.utcnow()

        # Phase 1: Cultural Validation
        if request.cultural_validation:
            logger.info(f"Starting cultural validation for user {request.user_id}")

            # Validate primary prompt
            cultural_result = await cultural_validator.validate_prompt(
                prompt=request.prompt,
                domain=request.professional_domain,
                islamic_compliance=request.islamic_compliance,
            )

            if not cultural_result.is_valid:
                raise HTTPException(
                    status_code=400,
                    detail=f"Cultural validation failed: {cultural_result.reason}",
                )

            # Validate Arabic prompt if provided
            if request.prompt_ar:
                arabic_result = await cultural_validator.validate_arabic_prompt(
                    prompt=request.prompt_ar, domain=request.professional_domain
                )

                if not arabic_result.is_valid:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Arabic prompt validation failed: {arabic_result.reason}",
                    )

        # Phase 2: Arabic Text Processing
        processed_prompts = await rtl_processor.process_prompts(
            primary_prompt=request.prompt,
            arabic_prompt=request.prompt_ar,
            rtl_optimization=request.rtl_layout,
        )

        # Phase 3: Provider Selection and Generation
        from ..services.image_service_factory import ImageServiceFactory

        service = ImageServiceFactory.get_service(request.provider)

        generation_params = {
            "prompt": processed_prompts.optimized_prompt,
            "model": request.model,
            "size": request.size,
            "quality": request.quality,
            "style": request.style,
            "n": request.n,
            "user_id": request.user_id,
            "professional_domain": request.professional_domain.value,
        }

        # Generate images
        generated_images = await service.generate_images(**generation_params)

        # Phase 4: Post-Generation Validation
        validated_images = []

        for img_data in generated_images:
            if request.cultural_validation:
                # Validate generated image content
                image_validation = await cultural_validator.validate_image_content(
                    image_data=img_data.data,
                    domain=request.professional_domain,
                    islamic_compliance=request.islamic_compliance,
                )

                if not image_validation.is_valid:
                    logger.warning(
                        f"Generated image failed validation: {image_validation.reason}"
                    )
                    continue

            # Create response object
            validated_images.append(
                ImageResponse(
                    id=str(uuid.uuid4()),
                    data=img_data.data,
                    url=img_data.url,
                    provider=request.provider,
                    model=request.model,
                    size=request.size,
                    format=img_data.format,
                    cultural_score=image_validation.cultural_score
                    if request.cultural_validation
                    else 1.0,
                    islamic_compliant=image_validation.islamic_compliant
                    if request.cultural_validation
                    else True,
                    professional_appropriate=image_validation.professional_appropriate
                    if request.cultural_validation
                    else True,
                    generation_time=(datetime.utcnow() - start_time).total_seconds(),
                    validation_time=image_validation.processing_time
                    if request.cultural_validation
                    else 0.0,
                )
            )

        if not validated_images:
            raise HTTPException(
                status_code=400,
                detail="No images passed cultural validation. Please adjust your prompt.",
            )

        logger.info(
            f"Successfully generated {len(validated_images)} images for user {request.user_id}"
        )

        return ImageListResponse(
            images=validated_images,
            total=len(validated_images),
            page=1,
            per_page=len(validated_images),
            has_next=False,
        )

    except Exception as e:
        logger.error(f"Image generation failed for user {request.user_id}: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Image generation failed: {str(e)}"
        )


@router.post("/edit", response_model=ImageListResponse)
async def edit_image(request: ImageEditRequest) -> ImageListResponse:
    """
    Edit images with cultural validation

    Features:
    - Image inpainting and editing
    - Cultural compliance for edited content
    - Arabic instruction processing
    - Professional domain validation
    """
    try:
        start_time = datetime.utcnow()

        # Phase 1: Input Validation
        if request.cultural_validation:
            # Validate original image
            original_validation = await cultural_validator.validate_image_content(
                image_data=request.image_data,
                domain=request.professional_domain,
                islamic_compliance=request.islamic_compliance,
            )

            if not original_validation.is_valid:
                raise HTTPException(
                    status_code=400,
                    detail=f"Original image validation failed: {original_validation.reason}",
                )

            # Validate edit instruction
            instruction_validation = await cultural_validator.validate_prompt(
                prompt=request.prompt,
                domain=request.professional_domain,
                islamic_compliance=request.islamic_compliance,
            )

            if not instruction_validation.is_valid:
                raise HTTPException(
                    status_code=400,
                    detail=f"Edit instruction validation failed: {instruction_validation.reason}",
                )

        # Phase 2: Arabic Processing
        processed_instruction = await rtl_processor.process_prompts(
            primary_prompt=request.prompt, arabic_prompt=request.prompt_ar
        )

        # Phase 3: Image Editing
        from ..services.image_service_factory import ImageServiceFactory

        service = ImageServiceFactory.get_service(request.provider)

        edit_params = {
            "image_data": request.image_data,
            "mask_data": request.mask_data,
            "instruction": processed_instruction.optimized_prompt,
            "model": request.model,
            "size": request.size,
            "n": request.n,
            "user_id": request.user_id,
            "professional_domain": request.professional_domain.value,
        }

        edited_images = await service.edit_images(**edit_params)

        # Phase 4: Post-Edit Validation
        validated_edits = []

        for img_data in edited_images:
            if request.cultural_validation:
                edit_validation = await cultural_validator.validate_image_content(
                    image_data=img_data.data,
                    domain=request.professional_domain,
                    islamic_compliance=request.islamic_compliance,
                )

                if not edit_validation.is_valid:
                    logger.warning(
                        f"Edited image failed validation: {edit_validation.reason}"
                    )
                    continue

            validated_edits.append(
                ImageResponse(
                    id=str(uuid.uuid4()),
                    data=img_data.data,
                    url=img_data.url,
                    provider=request.provider,
                    model=request.model,
                    size=request.size,
                    format=img_data.format,
                    cultural_score=edit_validation.cultural_score
                    if request.cultural_validation
                    else 1.0,
                    islamic_compliant=edit_validation.islamic_compliant
                    if request.cultural_validation
                    else True,
                    professional_appropriate=edit_validation.professional_appropriate
                    if request.cultural_validation
                    else True,
                    generation_time=(datetime.utcnow() - start_time).total_seconds(),
                    validation_time=edit_validation.processing_time
                    if request.cultural_validation
                    else 0.0,
                )
            )

        if not validated_edits:
            raise HTTPException(
                status_code=400, detail="No edited images passed cultural validation."
            )

        return ImageListResponse(
            images=validated_edits,
            total=len(validated_edits),
            page=1,
            per_page=len(validated_edits),
            has_next=False,
        )

    except Exception as e:
        logger.error(f"Image editing failed for user {request.user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Image editing failed: {str(e)}")


@router.get("/models", response_model=Dict[str, List[Dict[str, Any]]])
async def get_available_models() -> Dict[str, List[Dict[str, Any]]]:
    """Get available image generation models by provider"""
    try:
        from ..services.image_service_factory import ImageServiceFactory

        models = {}

        for provider in ImageProvider:
            service = ImageServiceFactory.get_service(provider)
            provider_models = await service.get_available_models()
            models[provider.value] = provider_models

        return models

    except Exception as e:
        logger.error(f"Failed to fetch available models: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch available models")


@router.get("/config", response_model=Dict[str, Any])
async def get_image_config() -> Dict[str, Any]:
    """Get current image generation configuration"""
    try:
        config = {
            "supported_providers": [p.value for p in ImageProvider],
            "supported_domains": [d.value for d in ProfessionalDomain],
            "default_sizes": [
                "256x256",
                "512x512",
                "1024x1024",
                "1792x1024",
                "1024x1792",
            ],
            "max_images_per_request": 4,
            "cultural_validation": {
                "enabled": True,
                "min_score": 0.95,
                "islamic_compliance_required": True,
            },
            "arabic_support": {
                "rtl_processing": True,
                "dialect_recognition": True,
                "mixed_language_support": True,
            },
            "professional_domains": {
                domain.value: f"Iraqi {domain.value} professional context"
                for domain in ProfessionalDomain
            },
        }

        return config

    except Exception as e:
        logger.error(f"Failed to get image config: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get configuration")


@router.post("/validate", response_model=Dict[str, Any])
async def validate_prompt(
    prompt: str = Form(...),
    prompt_ar: Optional[str] = Form(None),
    domain: ProfessionalDomain = Form(default=ProfessionalDomain.GENERAL),
    islamic_compliance: bool = Form(default=True),
) -> Dict[str, Any]:
    """Validate image generation prompt for cultural compliance"""
    try:
        # Validate primary prompt
        validation_result = await cultural_validator.validate_prompt(
            prompt=prompt, domain=domain, islamic_compliance=islamic_compliance
        )

        result = {
            "is_valid": validation_result.is_valid,
            "cultural_score": validation_result.cultural_score,
            "islamic_compliant": validation_result.islamic_compliant,
            "professional_appropriate": validation_result.professional_appropriate,
            "recommendations": validation_result.recommendations,
            "processing_time": validation_result.processing_time,
        }

        # Validate Arabic prompt if provided
        if prompt_ar:
            arabic_validation = await cultural_validator.validate_arabic_prompt(
                prompt=prompt_ar, domain=domain
            )

            result["arabic_validation"] = {
                "is_valid": arabic_validation.is_valid,
                "cultural_score": arabic_validation.cultural_score,
                "dialect_recognized": arabic_validation.dialect_recognized,
                "recommendations": arabic_validation.recommendations,
            }

        return result

    except Exception as e:
        logger.error(f"Prompt validation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Validation failed")


@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint for image processing services"""
    try:
        # Check cultural validator
        cultural_status = await cultural_validator.health_check()

        # Check RTL processor
        rtl_status = await rtl_processor.health_check()

        # Check image services
        from ..services.image_service_factory import ImageServiceFactory

        service_status = {}
        for provider in ImageProvider:
            try:
                service = ImageServiceFactory.get_service(provider)
                status = await service.health_check()
                service_status[provider.value] = status
            except Exception as e:
                service_status[provider.value] = f"Error: {str(e)}"

        return {
            "status": "healthy",
            "cultural_validator": cultural_status,
            "rtl_processor": rtl_status,
            "image_services": service_status,
            "timestamp": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat(),
        }
